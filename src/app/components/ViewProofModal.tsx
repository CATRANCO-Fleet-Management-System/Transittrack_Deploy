import React from "react";

const ViewProofModal = ({ isOpen, onClose, proof }) => {
  const BASE_URL = "https://catranco.jwisnetwork.com/storage/";

  /**
   * Renders the image with the provided path.
   * @param {string} imagePath - The relative path to the image.
   * @param {string} altText - The alternative text for the image.
   */
  const renderImage = (imagePath, altText) => {
    if (!imagePath) {
      return (
        <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center text-gray-500">
          No Image Available
        </div>
      );
    }

    const fullUrl = `${BASE_URL}${imagePath.replace(/^\/+/, "")}`; // Removes leading slashes if present
    console.log("Rendering image with URL:", fullUrl);

    return (
      <img
        src={fullUrl}
        alt={altText}
        className="w-full h-auto max-h-80 border border-gray-300 p-2 rounded object-contain"
        onError={(e) => {
          e.target.src = "/placeholder-image.png"; // Fallback image
          e.target.alt = "Placeholder image"; // Updated alt for the fallback
        }}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Completion Proof</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition duration-200"
          >
            ✖
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Proof Image Section */}
          <div className="flex-1">
            <label className="block font-medium mb-2 text-gray-700">Proof Image</label>
            {renderImage(proof, "Completion Proof")}
          </div>

          {/* Details Section */}
          <div className="flex-1">
            <label className="block font-medium mb-2 text-gray-700">Details</label>
            <p className="border border-gray-300 p-4 rounded bg-gray-100 text-gray-700">
              Proof related to the maintenance task is displayed here. Verify the provided
              image for accuracy.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProofModal;
