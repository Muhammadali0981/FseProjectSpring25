import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login_Page";
import Student_Login_Page from "./components/Student_Login";
import Admin_Login_Page from "./components/Admin_Login";

const App = () => {
  return (
    <Router>
      {/* Navigation Bar */}
      <div className="fixed top-0 w-full p-4 bg-blue-400 text-white shadow-lg flex justify-between z-50">
        <span><Link to="/" style={{ color: "white"}}> FAST NUCES Library App </Link></span>
        <div>
          <span className="ml-4">Login to access library</span>
        </div>
      </div>
      {/* Routes for Different Pages */}
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-300 text-white pt-16 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Main_Page_Img.jpg')" }}>
              <div className="z-20 grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 w-360">

                {/* Library Box */}
                <div className="p-6 bg-blue-600/60 hover:bg-blue-800 rounded-lg shadow-lg w-60 text-center">
                  <h2 className="text-xl font-semibold mb-2">Explore The Library</h2>
                  <Link to="/login" className="block bg-white text-blue-500 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"> 
                    Login 
                  </Link>
                </div>

                {/* About Page Box */}
                <div className="p-6 bg-blue-600/60 hover:bg-blue-800 rounded-lg shadow-lg w-60 text-center">
                  <h2 className="text-xl font-semibold mb-2">Learn about our services</h2>
                  <Link to="/about" className="block bg-white text-blue-500 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"> 
                    Go to About Page
                  </Link>
                </div>

                {/* Contact Page Box */}
                <div className="p-6 bg-blue-600/60 hover:bg-blue-800 rounded-lg shadow-lg w-60 text-center">
                  <h2 className="text-xl font-semibold mb-2">Contact us for inquiries</h2>
                  <Link to="/contact" className="block bg-white text-blue-500 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"> 
                    Go to Contact Page
                  </Link>
                </div>
              </div>
            </div>
          }
        />

        {/* Login Page */}
        <Route path="/login" element={ 
          <div className="w-screen flex flex-col justify-center items-center"><Login /></div>
        } />
        <Route path="/stdlogin" element={<Student_Login_Page />} />
        <Route path="/admlogin" element={<Admin_Login_Page />} />
        <Route path="/stdsignup" element={<Student_Login_Page />} />
        <Route path="/admsignup" element={<Admin_Login_Page />} />
      </Routes>
    </Router>
  );
};

export default App;
