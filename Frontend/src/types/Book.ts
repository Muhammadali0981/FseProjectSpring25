export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  description?: string;
  publishedYear?: string;
  publisher?: string;
  location: string;
  status: 'available' | 'borrowed';
  createdAt?: string;
  updatedAt?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface BookFilter {
  genre?: string;
  author?: string;
  name?: string;
  available?: boolean;
}

export interface BookSort {
  field: 'genre' | 'author' | 'name';
  order: 'asc' | 'desc';
}

export interface BookRequest {
  _id: string;
  student: string;
  book: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  requestDate: string;
  approvalDate?: string;
  returnDate?: string;
  dueDate?: string;
  adminNotes?: string;
}

export interface NewBookRequest {
  _id: string;
  studentId: string;
  studentName: string;
  bookName: string;
  author: string;
  genre: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
}

export interface BookFormData {
  name: string;
  author: string;
  genre: string;
  reason: string;
} 