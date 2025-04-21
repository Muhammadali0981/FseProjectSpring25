import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BookRequest, NewBookRequest } from "../types/Book";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const Student_Requests = () => {
  const { user } = useAuth();
  const [borrowRequests, setBorrowRequests] = useState<BookRequest[]>([]);
  const [newBookRequests, setNewBookRequests] = useState<NewBookRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const [borrowResponse, newBookResponse] = await Promise.all([
          axiosInstance.get('/student/my-requests'),
          axiosInstance.get('/student/new-book-requests')
        ]);
        setBorrowRequests(borrowResponse.data);
        setNewBookRequests(newBookResponse.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch requests. Please try again later.";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error fetching requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleReturnBook = async (requestId: string) => {
    try {
      await axiosInstance.post(`/student/return-request/${requestId}`);
      toast.success("Return request submitted successfully!");
      // Refresh the requests list
      const response = await axiosInstance.get('/student/my-requests');
      setBorrowRequests(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to submit return request. Please try again.";
      toast.error(errorMessage);
      console.error("Error submitting return request:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          {borrowRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No borrow/return requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrowRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.book}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.status === 'approved' && !request.returnDate && (
                          <button
                            onClick={() => handleReturnBook(request._id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Return Book
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* New Book Requests */}
        <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">New Book Requests</h2>
          {newBookRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No new book requests found.</p>
          ) : (
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
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.bookName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.genre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student_Requests; 