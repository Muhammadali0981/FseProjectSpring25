import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Book } from "../types/Book";

const Admin_Dashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    pendingRequests: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
            <div className="text-gray-600">
              Welcome, {user?.name}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Books</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Available</h3>
              <p className="text-3xl font-bold text-green-600">{stats.availableBooks}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Borrowed</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.borrowedBooks}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Pending Requests</h3>
              <p className="text-3xl font-bold text-red-600">{stats.pendingRequests}</p>
            </div>
          </div>

          {/* Recent Books */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">No books found</p>
                </div>
              ) : (
                books.map((book) => (
                  <div key={book.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.name}</h3>
                    <p className="text-gray-600 mb-4">{book.author}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status: Available</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Manage
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Dashboard; 