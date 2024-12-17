"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { createProfile } from "@/app/services/userProfile";
import Image from "next/image";

const AddDriverModal = ({ isOpen, onClose, onSave }) => {
  const [birthday, setBirthday] = useState<string>(""); // State for birthday
  const [dateHired, setDateHired] = useState<string>(""); // State for date hired
  const [age, setAge] = useState<number | string>(""); // State for age
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
    status: "On Duty",
    specific_personnel_status: "",
  });

  // Calculate Age
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
      setAge(""); // Clear age if birthday is removed
    }
  }, [birthday]);

  // Handle input changes
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

  // Handle birthday changes
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
  };

  // Handle date hired changes
  const handleDateHiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateHired(e.target.value);
  };

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        user_profile_image: file, // Store the file object
      }));
    }
  };

// Handle form submission
const handleSubmit = async () => {
  try {
    const newProfileData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        newProfileData.append(key, value);
      }
    });

    newProfileData.append("date_of_birth", birthday);
    newProfileData.append("date_hired", dateHired);

    const response = await createProfile(newProfileData); // Save the new driver profile
    if (response && response.profile) {
      onSave(response.profile); // Pass the new profile to the parent
    }
    onClose(); // Close the modal
  } catch (error) {
    console.error("Error creating profile:", error);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold">Add Driver Record</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>

        <form className="grid grid-cols-2 gap-4 mt-4">
          {/* Left Column */}
          <div>
            <div className="flex flex-col items-center space-y-4 mb-2">
              <div className="relative w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {formData.user_profile_image ? (
                  <Image
                    src={formData.user_profile_image}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-gray-500">
                    + Add Photo
                  </span>
                )}
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="e.g. Callo"
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              First Name
            </label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="e.g. Juan"
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Middle Initial
            </label>
            <Input
              name="middle_initial"
              value={formData.middle_initial}
              onChange={handleInputChange}
              placeholder="e.g. V"
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Position
            </label>
            <Input
              name="position"
              value="Driver"
              disabled
              className="focus:outline-none focus-visible:ring-0"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              License Number
            </label>
            <Input
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              placeholder="e.g. N03-12-123456"
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Date Hired
            </label>
            <Input
              name="date_hired"
              value={dateHired}
              onChange={handleDateHiredChange}
              type="date"
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Right Column */}
          <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <Input
              name="birthday"
              value={birthday}
              onChange={handleBirthdayChange}
              type="date"
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <Input
              value={age}
              readOnly
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Gender
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Contact Number
            </label>
            <Input
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Contact Person
            </label>
            <Input
              name="contact_person"
              value={formData.contact_person}
              onChange={handleInputChange}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Contact Person Number
            </label>
            <Input
              name="contact_person_number"
              value={formData.contact_person_number}
              onChange={handleInputChange}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Personnel Status */}
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Personnel Status
            </label>
            <select
              name="personnel_status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="On Duty">On Duty</option>
              <option value="Terminated">Terminated</option>
              <option value="On Leave">On Leave</option>
              <option value="Others">Others</option>
            </select>

            {/* Additional input for "Others" */}
            {formData.status === "Others" && (
              <Input
                name="specific_personnel_status"
                value={formData.specific_personnel_status}
                onChange={handleInputChange}
                placeholder="Specify personnel status"
                className="mt-2 focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          {/* Buttons */}
          <div className="col-span-2 flex justify-end space-x-4 -mt-12 mb-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverModal;
