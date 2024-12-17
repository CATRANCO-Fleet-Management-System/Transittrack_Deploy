"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaEnvelope, FaBell, FaCaretDown } from "react-icons/fa";
import Link from "next/link";
import { logout } from "../services/authService"; // Import the logout function
import { useRouter } from "next/navigation"; // Import Next.js router for redirection

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter(); // Initialize the router for redirection

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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      // If there's no token, log the user out immediately (or redirect them to login)
      if (!token) {
        console.error("No token found, cannot log out.");
        router.push("/login");
        return;
      }

      // Proceed with logout from the server (if applicable)
      await logout(); // Call the logout function from authService

      // Clear the token from localStorage
      localStorage.removeItem("authToken");

      // Redirect to the login page after logout
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show a notification or error message to the user
    }
  };

  return (
    <div className="header flex flex-row justify-between mt-10">
      <div className="title ml-10 text-violet-700">
        <h1 className="font-semibold text-4xl">{title}</h1>
      </div>
      <div className="icon-container flex flex-row mr-14">
        <div className="icons flex flex-row border-r-2 border-gray-400 mr-4 text-violet-700">
          <Link href="/notification">
            <FaBell size={25} className="mr-5 mt-2 cursor-pointer" />
          </Link>
        </div>
        <div className="profile ml-3 flex items-center justify-center relative">
          <FaUser
            size={42}
            className="rounded-full border border-gray-400 p-2"
          />
          <FaCaretDown
            size={20}
            className="ml-2 cursor-pointer"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div
              ref={dropdownRef}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 w-36 text-base bg-white border border-gray-300 rounded shadow-lg z-50 mr-10"
  >
              <Link
                href="/editprofile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Settings
              </Link>

              <button
                onClick={handleLogout} // Trigger logout on click
                className="block w-full text-left px-4 py-2 text-red-500 font-semibold hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
