"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

// Icons
import {
  FaHome,
  FaUtensils,
  FaInfoCircle,
  FaEnvelope,
  FaUserCircle,
  FaBell,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const [currUser, setCurrUser] = useState<User | null>(null);
  const router = useRouter();

  const tableNoString =
    typeof window !== "undefined" ? localStorage.getItem("tableNo") : null;
  const menuLink = tableNoString ? `/${tableNoString}/Menu` : "/select-table";

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.email) {
        try {
          const res = await axios.post("/api/currentUser", {
            email: user.email,
          });
          setCurrUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }
    };
    fetchUser();
  }, [user]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMenuOpen]);

  const handleTableCall = async () => {
    let currentTableNo: number | null = null;

    if (tableNoString && !isNaN(Number(tableNoString))) {
      currentTableNo = Number(tableNoString);
    } else {
      const userInput = prompt("Please enter your table number:");
      if (userInput && !isNaN(Number(userInput))) {
        currentTableNo = Number(userInput);
        useCartStore.getState().setTableNo(parseInt(currentTableNo.toString()));
        localStorage.setItem("tableNo", currentTableNo.toString());
      } else {
        alert("Invalid table number.");
        return;
      }
    }

    alert(
      `A waiter has been notified for table ${currentTableNo}. Please wait!`
    );

    try {
      const res = await axios.post("/api/TableCall", {
        tableNo: currentTableNo,
        userId: currUser?.id,
      });
      console.log(res.data);
    } catch (error) {
      console.error("Error notifying waiter:", error);
      alert("Failed to notify the waiter. Please try again.");
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-lg font-semibold flex items-center space-x-2 hover:text-gray-300 transition-all"
        >
          <FaUtensils className="text-2xl" />
          <span className="font-popins">Quick Bite</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="/"
            className="hover:text-gray-300 flex items-center space-x-1"
          >
            <FaHome />
            <span>Home</span>
          </Link>
          <Link
            href={menuLink}
            className="hover:text-gray-300 flex items-center space-x-1"
          >
            <FaUtensils />
            <span>Menu</span>
          </Link>
          {!currUser?.isAdmin && (
            <>
              <Link
                href="/about"
                className="hover:text-gray-300 flex items-center space-x-1"
              >
                <FaInfoCircle />
                <span>About</span>
              </Link>
              <Link
                href="/contact"
                className="hover:text-gray-300 flex items-center space-x-1"
              >
                <FaEnvelope />
                <span>Contact</span>
              </Link>
            </>
          )}
          {currUser?.id && (
            <Link
              href={`/waitingList/${currUser.id}`}
              className="hover:text-gray-300 flex items-center space-x-1"
            >
              <FaUserCircle />
              <span>Waiting List</span>
            </Link>
          )}
          {currUser?.isAdmin && (
            <Link
              href="/admin"
              className="hover:text-gray-300 flex items-center space-x-1"
            >
              <FaBell />
              <span>Admin</span>
            </Link>
          )}
          {!currUser?.isAdmin && (
            <button
              onClick={handleTableCall}
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition-all flex items-center space-x-1"
            >
              <FaBell />
              <span>Table Call</span>
            </button>
          )}
          {currUser && (
            <a
              href="/api/auth/logout"
              className="hover:text-gray-300 flex items-center space-x-1"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </a>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}

      {/* Mobile Sidebar */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 w-3/4 h-full bg-blue-600 text-white p-6 z-50 transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start space-y-4">
          <Link
            href="/"
            onClick={toggleMenu}
            className="hover:text-gray-300 flex items-center space-x-2"
          >
            <FaHome />
            <span>Home</span>
          </Link>
          <Link
            href={menuLink}
            onClick={toggleMenu}
            className="hover:text-gray-300 flex items-center space-x-2"
          >
            <FaUtensils />
            <span>Menu</span>
          </Link>
          {!currUser?.isAdmin && (
            <>
              <Link
                href="/about"
                onClick={toggleMenu}
                className="hover:text-gray-300 flex items-center space-x-2"
              >
                <FaInfoCircle />
                <span>About</span>
              </Link>
              <Link
                href="/contact"
                onClick={toggleMenu}
                className="hover:text-gray-300 flex items-center space-x-2"
              >
                <FaEnvelope />
                <span>Contact</span>
              </Link>
            </>
          )}
          {currUser?.id && (
            <Link
              href={`/waitingList/${currUser.id}`}
              onClick={toggleMenu}
              className="hover:text-gray-300 flex items-center space-x-2"
            >
              <FaUserCircle />
              <span>Waiting List</span>
            </Link>
          )}
          {currUser?.isAdmin && (
            <Link
              href="/admin"
              onClick={toggleMenu}
              className="hover:text-gray-300 flex items-center space-x-2"
            >
              <FaBell />
              <span>Admin</span>
            </Link>
          )}
          {!currUser?.isAdmin && (
            <button
              onClick={() => {
                handleTableCall();
                toggleMenu();
              }}
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition-all flex items-center space-x-2"
            >
              <FaBell />
              <span>Table Call</span>
            </button>
          )}
          {currUser && (
            <a
              href="/api/auth/logout"
              onClick={toggleMenu}
              className="hover:text-gray-300 flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
