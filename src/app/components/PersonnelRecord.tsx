import React from "react";

interface RecordBoxProps {
  driverId: string;
  driverName: string;
  birthday: string;
  age: number;
  gender?: string; // Optional
  licenseNumber?: string; // Optional
  address: string;
  contactNumber: string;
  contactPerson: string;
  contactPersonNumber?: string; // Optional
  onDelete: () => void;
  onEdit: () => void; // Edit handler
  onView: () => void; // View handler
}

const PersonnelRecord: React.FC<RecordBoxProps> = ({
  driverId,
  driverName,
  birthday,
  age,
  gender,
  licenseNumber,
  address,
  contactNumber,
  contactPerson,
  contactPersonNumber,
  onDelete,
  onEdit,
  onView
}) => {
  return (
    <div className="record-box-container bg-white border-gray-200 rounded-lg border-2 flex flex-col p-4">
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="border p-2 font-bold">Name:</td>
            <td className="border p-2">{driverName}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">ID:</td>
            <td className="border p-2">{driverId}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Birthday:</td>
            <td className="border p-2">{birthday}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Age:</td>
            <td className="border p-2">{age}</td>
          </tr>
          {gender && (
            <tr>
              <td className="border p-2 font-bold">Gender:</td>
              <td className="border p-2">{gender}</td>
            </tr>
          )}
          {licenseNumber && (
            <tr>
              <td className="border p-2 font-bold">License Number:</td>
              <td className="border p-2">{licenseNumber}</td>
            </tr>
          )}
          <tr>
            <td className="border p-2 font-bold">Address:</td>
            <td className="border p-2">{address}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Phone Number:</td>
            <td className="border p-2">{contactNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Contact Person:</td>
            <td className="border p-2">{contactPerson}</td>
          </tr>
          {contactPersonNumber && (
            <tr>
              <td className="border p-2 font-bold">Contact Person Number:</td>
              <td className="border p-2">{contactPersonNumber}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex space-x-2 mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onDelete}
        >
          Remove
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={onView}
        >
          View Bio Data
        </button>
      </div>
    </div>
  );
};

export default PersonnelRecord;
