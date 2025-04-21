import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { Book, BookFilter, BookSort } from '../types/Book';
import { useAuth } from '../context/AuthContext';

const Library: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<BookFilter>({});
  const [sort, setSort] = useState<BookSort>({ field: 'genre', order: 'asc' });
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get('/books');
        setBooks(response.data);
        setFilteredBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...books];

    // Apply filters
    if (filters.genre) {
      result = result.filter(book => book.category.toLowerCase().includes(filters.genre!.toLowerCase()));
    }
    if (filters.author) {
      result = result.filter(book => book.author.toLowerCase().includes(filters.author!.toLowerCase()));
    }
    if (filters.name) {
      result = result.filter(book => book.title.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    if (filters.available !== undefined) {
      result = result.filter(book => book.status === (filters.available ? 'available' : 'borrowed'));
    }

    // Apply sorting
    result.sort((a, b) => {
      const compareValue = (field: keyof BookSort['field']) => {
        const getValue = (book: Book) => {
          switch (field) {
            case 'genre':
              return book.category;
            case 'author':
              return book.author;
            case 'name':
              return book.title;
            default:
              return '';
          }
        };
        return getValue(a).toLowerCase().localeCompare(getValue(b).toLowerCase());
      };

      return sort.order === 'asc' ? compareValue(sort.field) : -compareValue(sort.field);
    });

    setFilteredBooks(result);
  }, [books, filters, sort]);

  const handleFilterChange = (field: keyof BookFilter, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (field: BookSort['field']) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBorrowBook = async (bookId: string) => {
    try {
      await axiosInstance.post('/student/borrow-request', { bookId });
      // Update the book's status in the local state
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book._id === bookId ? { ...book, status: 'borrowed' } : book
        )
      );
      toast.success('Borrow request submitted successfully!');
    } catch (error: any) {
      console.error('Error borrowing book:', error);
      toast.error(error.response?.data?.message || 'Failed to submit borrow request. Please try again.');
    }
  };

  const navigateToMyBooks = () => {
    navigate('/requests');
  };

  const navigateToNewRequest = () => {
    navigate('/new-book-request');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Library Catalog</h1>
          <div className="flex space-x-4">
            <button 
              onClick={navigateToMyBooks}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              My Borrowed Books
            </button>
            <button 
              onClick={navigateToNewRequest}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Request New Book
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Filters Box */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Filters</h2>
              <span className="text-sm text-blue-800">
                Showing {filteredBooks.length} of {books.length} books
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Genre</label>
                <input
                  type="text"
                  value={filters.genre || ''}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by genre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Author</label>
                <input
                  type="text"
                  value={filters.author || ''}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by author"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Title</label>
                <input
                  type="text"
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Availability</label>
                <select
                  value={filters.available === undefined ? '' : filters.available.toString()}
                  onChange={(e) => handleFilterChange('available', e.target.value === 'true')}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Available</option>
                  <option value="false">Borrowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-blue-200">
              <h2 className="text-xl font-semibold text-blue-900">Available Books</h2>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-blue-600">Loading books...</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-blue-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
                        onClick={() => handleSortChange('genre')}
                      >
                        Genre {sort.field === 'genre' && (sort.order === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
                        onClick={() => handleSortChange('author')}
                      >
                        Author {sort.field === 'author' && (sort.order === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
                        onClick={() => handleSortChange('name')}
                      >
                        Title {sort.field === 'name' && (sort.order === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-200">
                    {filteredBooks.map((book) => (
                      <tr key={book._id} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                          {book.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                          {book.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => book.status === 'available' && handleBorrowBook(book._id)}
                            className={`${
                              book.status === 'available'
                                ? 'text-blue-600 hover:text-blue-800'
                                : 'text-gray-400 cursor-not-allowed'
                            } font-medium mr-3`}
                            disabled={book.status !== 'available'}
                          >
                            {book.status === 'available' ? 'Borrow' : 'Borrowed'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library; 