import React from "react";
import { Routes, Route, Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex felx-col items-center justify-center min-h-screen bg-blue-300 text-white pt-16 bg-cover bg-center bg-no-repeat w-full" style={{ backgroundImage: "url('/Main_Page_Img.jpg')" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        {/* Student Login Box */}
        <div className="p-6 bg-blue-800/80 rounded-lg shadow-lg w-60 text-center">
          <h3 className="font-bold text-white">Login as Student</h3>
          <div className="bg-gray-800 text-blue-300 w-full mt-2 p-2">
            As a Student, you can browse, search, issue books and request new books from the library.
          </div>
          <Link to="/stdlogin" className="bg-black hover:bg-gray-700 mt-2 px-4 py-2 font-bold rounded block">
            Login as Student
          </Link>
        </div>

        {/* Administrator Login Box */}
        <div className="p-6 bg-blue-800/80 rounded-lg shadow-lg w-60 text-center">
          <h3 className="font-bold text-white">Login as Administrator</h3>
          <div className="bg-gray-800 text-blue-300 w-full mt-2 p-2">
            As an Administrator, you can add, categorize, relocate books and resolve student requests for new books.
          </div>
          <Link to="/admlogin" className="bg-black hover:bg-gray-700 mt-2 px-4 py-2 font-bold rounded block">
            Login as Administrator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
