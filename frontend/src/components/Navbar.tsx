import React from "react";
import { Link } from "react-router-dom";

// Props for Navbar
interface NavbarProps {
  username: string | null; // null if not logged in
  onLogout: () => void;    // callback for logging out
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Left side: Home & Concerts */}
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-300 font-semibold">
          Home
        </Link>
        <Link to="/concerts" className="hover:text-gray-300 font-semibold">
          Concerts
        </Link>
      </div>

      {/* Right side: Login or Username */}
      <div className="flex space-x-4 items-center">
        {username ? (
          <>
            <span className="font-semibold">Hello, {username}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
