"use client";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createProfile } from "@/app/services/userProfile"; // Import createProfile service

const DashboardHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [birthday, setBirthday] = useState<string>(""); // State to hold birthday
  const [age, setAge] = useState<number | string>(""); // State to hold calculated age
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_initial: "",
    position: "passenger_assistant_officer",
    sex: "Male",
    contact_number: "",
    contact_person: "",
    contact_person_number: "",
    address: "",
    user_profile_image: "",
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to calculate age based on the birthday
  useEffect(() => {
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(""); // Clear age if no birthday is provided
    }
  }, [birthday]);

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Date of Birth change
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value); // Set birthday to the selected date
  };

  // Photo Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const PhotoUpload = () => (
    <div className="relative w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
      <input
        type="file"
        id="photoUpload"
        accept="image/*"
        onChange={handleImageChange}
        className="absolute inset-0 opacity-0"
      />
      {formData.photo ? (
        <img
          src={formData.photo}
          alt="Profile Preview"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="text-gray-500 text-center">Add Profile Photo</span>
      )}
    </div>
  );

  // Handle form submission to create profile
  const handleSubmit = async () => {
    try {
      const profileData = {
        last_name: formData.last_name,
        first_name: formData.first_name,
        middle_initial: formData.middle_initial,
        position: formData.position,
        sex: formData.sex,
        contact_number: formData.contact_number,
        contact_person: formData.contact_person,
        contact_person_number: formData.contact_person_number,
        address: formData.address,
        date_of_birth: birthday, // Include birthday in the profile data
        photo: formData.photo,
      };
      await createProfile(profileData); // Call createProfile function
      router.push("/personnel"); // Redirect after successful submission
    } catch (error) {
      console.error("Error creating profile:", error);
      // Optionally handle error feedback to the user
    }
  };

  const handleCancelClick = () => {
    router.push("/personnel");
  };

  return (
    <section className="h-screen flex flex-row bg-white ">
      <Sidebar />

      <section className="w-full bg-slate-200">
        <Header title="Add PAO Record" />

        <section className="right w-full overflow-y-hidden">
          <div className="forms-container ml-14">
            <div className="output flex flex-row space-x-2 mt-20">
              <div className="forms flex w-11/12 bg-white h-160 rounded-lg border-1 border-gray-300">
                <div className="1st-row flex-col m-5 ml-14 w-96 space-y-4">
                  <h1>Last Name</h1>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: Callo"
                  />
                  <h1>First Name</h1>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: Juan"
                  />
                  <h1>Middle Initial</h1>
                  <Input
                    name="middle_initial"
                    value={formData.middle_initial}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: V"
                  />
                  <h1>Position</h1>
                  <Input
                    name="position"
                    value="passenger assistant officer "
                    className="h-10 text-lg"
                    type="text"
                    disabled
                  />

                  <h1>Date of Birth</h1>
                  <Input
                    name="birthday"
                    value={birthday}
                    onChange={handleBirthdayChange} // Bind to birthday state
                    className="h-10 text-lg"
                    type="date" // Date picker input
                    placeholder="Select Date of Birth"
                  />
                </div>
                <div className="2nd-row flex-col m-5 w-96 space-y-4">
                  <h1>Age</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    value={age} // Display calculated age
                    readOnly
                  />
                  <h1>Gender</h1>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="h-10 text-lg border-2 rounded-lg p-2"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <h1>Contact Number</h1>
                  <Input
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="Contact Number"
                  />
                  <h1>Contact Person</h1>
                  <Input
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="Contact Person"
                  />
                  <h1>Contact Person phone #</h1>
                  <Input
                    name="contact_person_number"
                    value={formData.contact_person_number}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="Phone Number"
                  />
                  <h1>Address</h1>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-34 text-lg text-left p-2 border-2 align-top w-96 rounded-lg"
                    placeholder="Address"
                  />
                </div>
                <div className="3rd-row ml-14">
                  <div className="flex flex-col items-center m-14">
                    <PhotoUpload />
                  </div>
                </div>
                <div className="relative">
                  <div className="buttons absolute bottom-0 right-0 flex flex-col space-y-5 w-24 mb-8 mr-8">
                    <button
                      onClick={handleSubmit} // Add form submission handler
                      className="flex items-center justify-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                    >
                      Add
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="flex items-center justify-center px-4 py-2 border-2 border-red-500 rounded-md text-red-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                    >
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

export default DashboardHeader;
