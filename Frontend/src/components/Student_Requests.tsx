import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BookRequest, NewBookRequest } from "../types/Book";

const Student_Requests = () => {
  const { user } = useAuth();
  const [borrowRequests, setBorrowRequests] = useState<BookRequest[]>([
    {
      id: '1',
      studentId: 'ST123',
      bookId: 'B1',
      type: 'borrow',
      status: 'pending',
      requestDate: '2024-03-20'
    }
  ]);
  
  const [newBookRequests, setNewBookRequests] = useState<NewBookRequest[]>([
    {
      id: '1',
      studentId: 'ST123',
      studentName: 'John Student',
      bookName: 'New Book',
      author: 'New Author',
      genre: 'Fiction',
      reason: 'For research purposes',
      status: 'pending',
      requestDate: '2024-03-20'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">My Requests</h1>
          <div className="text-gray-600">
            Welcome, {user?.name}
          </div>
        </div>

        {/* Borrow/Return Requests */}
        <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Borrow/Return Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.bookId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.requestDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Book Requests */}
        <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">New Book Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newBookRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.bookName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.genre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.requestDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student_Requests; 