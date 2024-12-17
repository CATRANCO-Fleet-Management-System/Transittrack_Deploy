import React from "react";

interface FullRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  busDetails: {
    busNumber: string;
    ORNumber: string;
    CRNumber: string;
    plateNumber: string;
    thirdLBI: string;
    comprehensiveInsurance?: string;
    assignedDriver: string;
    assignedPAO: string;
    route?: string;
  };
}

const FullRecordModal: React.FC<FullRecordModalProps> = ({ isOpen, onClose, busDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-3xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Bus Full Record</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
          >
            ✕
          </button>
        </div>

        {/* General Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-600">General Information</h3>
            <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
              <p>
                <span className="font-medium">Bus Number:</span> {busDetails.busNumber}
              </p>
              <p>
                <span className="font-medium">Plate Number:</span> {busDetails.plateNumber}
              </p>
              <p>
                <span className="font-medium">OR Number:</span> {busDetails.ORNumber}
              </p>
              <p>
                <span className="font-medium">CR Number:</span> {busDetails.CRNumber}
              </p>
            </div>
          </div>

          {/* Insurance Details */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600">Insurance Details</h3>
            <div className="mt-4 text-gray-700">
              <p>
                <span className="font-medium">Third Party Liability:</span> {busDetails.thirdLBI}
              </p>
              {busDetails.comprehensiveInsurance && (
                <p>
                  <span className="font-medium">Comprehensive Insurance:</span>{" "}
                  {busDetails.comprehensiveInsurance}
                </p>
              )}
            </div>
          </div>

          {/* Personnel */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600">Personnel</h3>
            <div className="mt-4 text-gray-700">
              <p>
                <span className="font-medium">Assigned Driver:</span> {busDetails.assignedDriver}
              </p>
              <p>
                <span className="font-medium">Assigned PAO:</span> {busDetails.assignedPAO}
              </p>
            </div>
          </div>

          {/* Route */}
          {busDetails.route && (
            <div>
              <h3 className="text-lg font-semibold text-blue-600">Route</h3>
              <p className="mt-4 text-gray-700">{busDetails.route}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullRecordModal;
