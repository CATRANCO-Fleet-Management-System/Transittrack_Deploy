"use client";
import Sidebar2 from "../components/Sidebar2";
import Header from "../components/Header";
import React, { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaArrowLeft,
  FaEnvelope,
  FaBell,
  FaCaretDown,
  FaPen,
  FaUsers,
  FaBus,
  FaPaperclip,
  FaPlus,
  FaImage,
  FaPaperPlane,
} from "react-icons/fa";

const Messages: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Commuter");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setSelectedUser(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  const commuters = ["Sheena All", "Iggy Harapeko", "Grab a Tea"];
  const personnel = ["Febby Malacaste", "Kent Asilo", "Christian Bilbao"];

  const users = activeTab === "Commuter" ? commuters : personnel;

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar2 />

      <section className="right w-full bg-slate-200 overflow-y-hidden ">
        <Header title="" />

        <div className="content flex p-6 overflow-hidden">
          {" "}
          {/* Adjusted to overflow-hidden */}
          <div className="w-1/3 bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-[70vh]">
            {" "}
            {/* Set max height */}
            <div className="Tabs flex flex-col justify-around mb-4">
              <div className="flex justify-around">
                <button
                  className={`tab px-4 py-2 font-semibold flex items-center space-x-2 ${
                    activeTab === "Personnel"
                      ? "text-blue-600 border-b-2 border-gray-400"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabClick("Personnel")}
                >
                  <FaUsers size={20} className="mr-2" />
                  <span>Personnel</span>
                </button>
                <button
                  className={`tab px-4 py-2 font-semibold flex items-center space-x-2 ${
                    activeTab === "Commuter"
                      ? "text-blue-600 border-b-2 border-gray-400"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabClick("Commuter")}
                >
                  <FaBus size={20} className="mr-2" />
                  <span>Commuters</span>
                </button>
              </div>
              <div className="SearchBar mt-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <ul className="space-y-4">
              {filteredUsers.map((user, index) => (
                <li
                  key={index}
                  className={`cursor-pointer flex items-center space-x-3 hover:bg-gray-200 p-2 rounded ${
                    selectedUser === user
                      ? "bg-blue-100 border border-blue-300"
                      : ""
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <FaUser
                    size={30}
                    className={`${
                      selectedUser === user ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`${
                      selectedUser === user ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    {user}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/3 bg-white rounded-lg shadow-lg ml-4 p-4 max-h-[70vh]">
            {" "}
            {/* Set max height */}
            {selectedUser ? (
              <div className="chat-window">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {selectedUser}
                </h2>
                <div className="chat-content bg-gray-50 p-4 rounded h-96 overflow-y-scroll">
                  <div className="message flex items-start space-x-3 mb-4">
                    <img
                      src="/avatar.png"
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="message-content bg-white p-4 rounded-lg border border-gray-300">
                      <p className="text-gray-700">
                        Think of the life you have lived until now as over and,
                        as a dead man, see what’s left as a bonus and live it
                        according to Nature. Love the hand that fate deals you
                        and play it as your own, for what could be more fitting?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="chat-input mt-4 flex items-center space-x-3">
                  <button className="p-2 text-gray-600">
                    <FaPaperclip size={20} />
                  </button>
                  <button className="p-2 text-gray-600">
                    <FaPlus size={20} />
                  </button>
                  <button className="p-2 text-gray-600">
                    <FaImage size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                  <button className="p-2 text-blue-600">
                    <FaPaperPlane size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-user-selected flex items-center justify-center h-full">
                <p className="text-gray-600">
                  Please select a user to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Messages;
