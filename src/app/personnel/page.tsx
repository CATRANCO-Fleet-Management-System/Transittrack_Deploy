"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import AddDriverModal from "../components/AddDriverModal";
import AddAssistantOfficerModal from "../components/AddAssistantOfficerModal";
import EditDriverModal from "../components/EditDriverModal";
import EditAssistantOfficerModal from "../components/EditAssistantOfficerModal";
import Pagination from "../components/Pagination"; // Import Pagination Component
import { FaPlus, FaHistory } from "react-icons/fa";
import PersonnelRecord from "@/app/components/PersonnelRecord";
import { getAllProfiles, deleteProfile } from "@/app/services/userProfile";
import HistoryModal from "../components/HistoryModal";
import ViewBioDataModal from "../components/ViewBioDataModal";

const extractHistoryFromProfiles = (profiles) => {
  return profiles.map((profile) => ({
    details: `${profile.profile.first_name} ${profile.profile.last_name}`,
    position: profile.profile.position,
    date_hired: profile.profile.date_hired || "N/A", // Assuming created_at as date hired
    status: profile.profile.status || "Active", // Replace with the correct status field if available
  }));
};

const ButtonGroup = ({ activeButton, onClick, onViewHistory }) => (
  <div className="button-type-employee-container flex flex-row space-x-10 m-12">
    <button
      className={`px-4 py-2 border-2 rounded transition-colors duration-300 ease-in-out ${
        activeButton === "drivers"
          ? "border-blue-500 text-blue-500"
          : "border-transparent text-gray-700"
      }`}
      onClick={() => onClick("drivers")}
    >
      Drivers
    </button>
    <button
      className={`px-4 py-2 border-2 rounded transition-colors duration-300 ease-in-out ${
        activeButton === "conductors"
          ? "border-blue-500 text-blue-500"
          : "border-transparent text-gray-700"
      }`}
      onClick={() => onClick("conductors")}
    >
      Passenger Assistant Officer
    </button>
    <button
      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
      onClick={onViewHistory}
    >
      <FaHistory className="mr-2" />
      View History
    </button>
  </div>
);

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  return new Date(ageDiff).getUTCFullYear() - 1970;
};

const Personnel = () => {
  const [activeButton, setActiveButton] = useState("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [personnelHistory, setPersonnelHistory] = useState([]);
  const [isViewBioDataModalOpen, setIsViewBioDataModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getAllProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const openHistoryModal = () => {
    const history = extractHistoryFromProfiles(profiles);
    setPersonnelHistory(history);
    setIsHistoryModalOpen(true);
  };

  const filteredProfiles = profiles
    .filter(
      (item) =>
        item.profile &&
        (activeButton === "drivers"
          ? item.profile.position === "driver"
          : item.profile.position === "passenger_assistant_officer")
    )
    .filter((profile) =>
      `${profile.profile.first_name} ${profile.profile.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const handleViewBioData = (profileId) => {
    const profile = profiles.find(
      (profile) => profile.profile.user_profile_id === profileId
    );
    setSelectedProfile(profile);
    setIsViewBioDataModalOpen(true);
  };


  const handleDelete = (recordId) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteProfile(deleteRecordId);
        setProfiles((prevProfiles) =>
          prevProfiles.filter(
            (profile) => profile.profile.user_profile_id !== deleteRecordId
          )
        );
        setDeleteRecordId(null);
        setIsDeletePopupOpen(false);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  const handleAddNew = async (newProfile) => {
    try {
      const formattedProfile = {
        profile: newProfile,
      };
      setProfiles((prevProfiles) => [...prevProfiles, formattedProfile]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding new personnel:", error);
    }
  };

  const handleEdit = (profileId) => {
    setSelectedProfileId(profileId);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedProfile) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) =>
        profile.profile.user_profile_id === updatedProfile.user_profile_id
          ? { ...profile, profile: updatedProfile }
          : profile
      )
    );
    setIsEditModalOpen(false);
    
  };

  return (
    <Layout>
      <section className="flex flex-row h-screen bg-white">
        <div className="w-full flex flex-col bg-slate-200">
          <Header title="Bus Personnel Management" />
          <div className="content flex flex-col flex-1">
            <ButtonGroup
              activeButton={activeButton}
              onClick={setActiveButton}
              onViewHistory={openHistoryModal}
            />
            <div className="options flex items-center space-x-10 p-4 w-9/12 ml-10">
              <input
                type="text"
                placeholder={`Find ${activeButton}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FaPlus size={22} className="mr-2" />
                Add New
              </button>
            </div>
            <div className="records flex flex-col h-full">
              <div className="output flex flex-wrap mt-4 items-center ml-14">
                {paginatedProfiles.map((profile) => (
                  <PersonnelRecord
                    key={profile.profile.user_profile_id}
                    driverId={profile.profile.user_profile_id}
                    driverName={`${profile.profile.first_name} ${profile.profile.last_name}`}
                    birthday={profile.profile.date_of_birth}
                    age={calculateAge(profile.profile.date_of_birth)}
                    licenseNumber={profile.profile.license_number}
                    address={profile.profile.address}
                    contactNumber={profile.profile.contact_number}
                    contactPerson={profile.profile.contact_person}
                    onDelete={() =>
                      handleDelete(profile.profile.user_profile_id)
                    }
                    onEdit={() => handleEdit(profile.profile.user_profile_id)}
                    onView={() => handleViewBioData(profile.profile.user_profile_id)}
                  />
                ))}
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        {activeButton === "drivers" ? (
          <AddDriverModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddNew}
          />
        ) : (
          <AddAssistantOfficerModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddNew}
          />
        )}
        {activeButton === "drivers" ? (
          <EditDriverModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userProfileId={selectedProfileId}
            onSave={handleSaveEdit}
          />
        ) : (
          <EditAssistantOfficerModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userProfileId={selectedProfileId}
            onSave={handleSaveEdit}
          />
        )}
        <ViewBioDataModal
        isOpen={isViewBioDataModalOpen}
        onClose={() => setIsViewBioDataModalOpen(false)}
        profile={selectedProfile}
      />
        <Confirmpopup
          isOpen={isDeletePopupOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Delete Profile"
          message="Are you sure you want to delete this profile?"
        />
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          history={personnelHistory}
        />
      </section>
    </Layout>
  );
};

export default Personnel;
