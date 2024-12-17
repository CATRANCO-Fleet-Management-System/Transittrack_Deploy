// components/ViewBioDataModal.jsx
import React from "react";

const ViewBioDataModal = ({ isOpen, onClose, profile }) => {
  if (!isOpen || !profile) return null;

  const { first_name, last_name, date_of_birth, license_number, address, contact_number, contact_person, sex, date_hired, status } = profile.profile;

  const age = calculateAge(date_of_birth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Bio Data of {first_name} {last_name}</h2>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="border p-2 font-bold">Name:</td>
              <td className="border p-2">{first_name} {last_name}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Birthday:</td>
              <td className="border p-2">{date_of_birth}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Age:</td>
              <td className="border p-2">{age}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Gender:</td>
              <td className="border p-2">{sex}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">License Number:</td>
              <td className="border p-2">{license_number}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Address:</td>
              <td className="border p-2">{address}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Contact Number:</td>
              <td className="border p-2">{contact_number}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Contact Person:</td>
              <td className="border p-2">{contact_person}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Date Hired:</td>
              <td className="border p-2">{date_hired || "N/A"}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Status:</td>
              <td className="border p-2">{status || "Active"}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  return new Date(ageDiff).getUTCFullYear() - 1970;
}

export default ViewBioDataModal;
