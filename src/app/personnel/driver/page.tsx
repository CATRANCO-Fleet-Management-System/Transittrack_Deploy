"use client";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation"; // Use useSearchParams for query params
import { updateProfile, getUserProfile } from "@/app/services/userProfile";

const EditDriver = () => {
  const [birthday, setBirthday] = useState<string>("");
  const [age, setAge] = useState<number | string>("");
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_initial: "",
    position: "driver",
    license_number: "",
    sex: "Male",
    contact_number: "",
    contact_person: "",
    contact_person_number: "",
    address: "",
    user_profile_image: "",
  });

  const searchParams = useSearchParams(); // Fetch query params
  const user_profile_id = searchParams.get("user_profile_id");
  const router = useRouter();

  // Fetch user profile data when the page loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileData = await getUserProfile(user_profile_id!); // Ensure the ID is not null
        setFormData(userProfileData);
        setBirthday(userProfileData.date_of_birth); // Set the birthday for age calculation
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (user_profile_id) {
      fetchUserProfile();
    }
  }, [user_profile_id]);

  // Calculate Age
  useEffect(() => {
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge("");
    }
  }, [birthday]);

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date of birth changes
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
  };

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          user_profile_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedProfile = {
        ...formData,
        date_of_birth: birthday,
      };
      await updateProfile(user_profile_id!, updatedProfile); // Ensure the ID is not null
      router.push("/personnel"); // Redirect to personnel page
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelClick = () => {
    router.push("/personnel");
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar />

      <section className="w-full bg-slate-200">
        <Header title="Add Driver Record" />

        <section className="right w-full overflow-y-hidden">
          <div className="forms-container ml-14">
            <div className="output flex flex-row space-x-2 mt-20">
              <div className="forms flex w-11/12 bg-white h-160 rounded-lg border-1 border-gray-300">
                <div className="1st-row flex-col m-5 ml-14 w-96 space-y-4">
                  <h1>Last Name</h1>
                  <Input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="ex: Callo" />
                  <h1>First Name</h1>
                  <Input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="ex: Juan" />
                  <h1>Middle Initial</h1>
                  <Input name="middle_initial" value={formData.middle_initial} onChange={handleInputChange} placeholder="ex: V" />
                  <h1>Position</h1>
                  <Input name="position" value="Driver" disabled />
                  <h1>License Number</h1>
                  <Input
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    placeholder="ex: N03-12-123456"
                  />
                  <h1>Date of Birth</h1>
                  <Input name="birthday" value={birthday} onChange={handleBirthdayChange} type="date" />
                </div>
                <div className="2nd-row flex-col m-5 w-96 space-y-4">
                  <h1>Age</h1>
                  <Input value={age} readOnly />
                  <h1>Gender</h1>
                  <select name="sex" value={formData.sex} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <h1>Contact Number</h1>
                  <Input name="contact_number" value={formData.contact_number} onChange={handleInputChange} />
                  <h1>Contact Person</h1>
                  <Input name="contact_person" value={formData.contact_person} onChange={handleInputChange} />
                  <h1>Contact Person Number</h1>
                  <Input name="contact_person_number" value={formData.contact_person_number} onChange={handleInputChange} />
                  <h1>Address</h1>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="photo-upload-container flex flex-col items-center space-y-4 mt-10">
                  <div className="relative w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full">
                    <input type="file" id="photoUpload" accept="image/*" onChange={handleImageChange} />
                    {formData.user_profile_image && (
                      <img
                        src={formData.user_profile_image}
                        alt="Profile Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={handleSubmit} className="bg-blue-500 text-white rounded px-4 py-2">
                      Save
                    </button>
                    <button onClick={handleCancelClick} className="bg-red-500 text-white rounded px-4 py-2">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

export default EditDriver;
