import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getVehicleAssignmentById,
  createVehicleAssignment,
} from "@/app/services/vehicleAssignService";
import EditBusRecordModal from "@/app/components/EditBusRecordModal";
import EditPersonnelModal from "@/app/components/EditPersonnelModal";
import FullRecordModal from "@/app/components/FullRecordModal";

interface BusBoxProps {
  vehicle_id: string;
  busNumber: string;
  ORNumber: string;
  CRNumber: string;
  plateNumber: string;
  thirdLBI: string;
  ci: string;
  assignedDriver: string;
  assignedPAO: string;
  assignmentId: string | null;
  route?: string;
  onDelete: () => void;
  onEdit: () => void;
  onUpdateBus: (updatedBus: any) => void;
  onUpdatePersonnel: (updatedPersonnel: any) => void;
}

const BusRecord: React.FC<BusBoxProps> = ({
  vehicle_id,
  busNumber,
  ORNumber,
  CRNumber,
  plateNumber,
  thirdLBI,
  ci,
  assignedDriver,
  assignedPAO,
  assignmentId: initialAssignmentId,
  route,
  onDelete,
  onUpdateBus,
  onUpdatePersonnel,
}) => {
  const [assignmentId, setAssignmentId] = useState<string | null>(initialAssignmentId);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditBusModalOpen, setIsEditBusModalOpen] = useState(false);
  const [isEditPersonnelModalOpen, setIsEditPersonnelModalOpen] = useState(false);
  const [isFullRecordModalOpen, setIsFullRecordModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const toggleDropdown = useCallback(() => setDropdownOpen((prev) => !prev), []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch or create vehicle assignment
  useEffect(() => {
    const fetchOrCreateAssignment = async () => {
      if (assignmentId !== null) return; // Avoid redundant calls if assignmentId already exists
      setLoading(true);
      try {
        const response = await getVehicleAssignmentById(vehicle_id);
        if (response?.vehicle_assignment_id) {
          setAssignmentId(response.vehicle_assignment_id);
        } else {
          const newAssignment = await createVehicleAssignment({
            vehicle_id,
            user_profile_ids: [assignedDriver, assignedPAO].filter(Boolean),
          });
          setAssignmentId(newAssignment.vehicle_assignment_id);
        }
      } catch (error) {
        console.error("Error fetching or creating assignment ID:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrCreateAssignment();
  }, [assignmentId, vehicle_id, assignedDriver, assignedPAO]);

  // Open modals
  const handleEditBus = () => {
    setIsEditBusModalOpen(true);
    setDropdownOpen(false);
  };

  const handleEditPersonnel = () => {
    setIsEditPersonnelModalOpen(true);
    setDropdownOpen(false);
  };

  const openFullRecordModal = () => setIsFullRecordModalOpen(true);

  return (
    <div className="record-box-container bg-white border-gray-200 rounded-lg border-2 flex flex-col p-4">
      {/* Loading State */}
      {loading && <div className="text-center text-gray-500">Loading assignment...</div>}

      {/* Bus Record Details */}
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <td className="border p-2 font-bold">Bus Number:</td>
            <td className="border p-2">{busNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">OR Number:</td>
            <td className="border p-2">{ORNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">CR Number:</td>
            <td className="border p-2">{CRNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Plate Number:</td>
            <td className="border p-2">{plateNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Third LBI:</td>
            <td className="border p-2">{thirdLBI}</td>
          </tr>
          {ci && (
            <tr>
              <td className="border p-2 font-bold">Comprehensive Insurance:</td>
              <td className="border p-2">{ci}</td>
            </tr>
          )}
          <tr>
            <td className="border p-2 font-bold">Assigned Driver:</td>
            <td className="border p-2">{assignedDriver}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Assigned PAO:</td>
            <td className="border p-2">{assignedPAO}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Route:</td>
            <td className="border p-2">{route || "Not Assigned"}</td>
          </tr>
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
          onClick={onDelete}
        >
          Remove
        </button>

        <div className="relative w-full" ref={dropdownRef}>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            onClick={toggleDropdown}
          >
            Edit
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-4/5 bg-white border border-gray-300 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleEditBus}
              >
                Edit Bus Record
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleEditPersonnel}
              >
                Edit Personnel Assignment
              </button>
            </div>
          )}
        </div>

        <button
          onClick={openFullRecordModal}
          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          View Full Record
        </button>
      </div>

      {/* Modals */}
      <FullRecordModal
        isOpen={isFullRecordModalOpen}
        onClose={() => setIsFullRecordModalOpen(false)}
        busDetails={{
          busNumber,
          ORNumber,
          CRNumber,
          plateNumber,
          thirdLBI,
          ci,
          assignedDriver,
          assignedPAO,
          route,
        }}
      />

      {isEditBusModalOpen && (
        <EditBusRecordModal
          vehicle_id={vehicle_id}
          onClose={() => setIsEditBusModalOpen(false)}
          onSubmit={onUpdateBus}
        />
      )}

      {isEditPersonnelModalOpen && (
        <EditPersonnelModal
          vehicle_id={vehicle_id}
          onClose={() => setIsEditPersonnelModalOpen(false)}
          onSubmit={onUpdatePersonnel}
        />
      )}
    </div>
  );
};

export default BusRecord;
