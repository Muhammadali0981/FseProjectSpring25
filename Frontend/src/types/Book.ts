export interface Book {
  id: string;
  name: string;
  author: string;
  genre: string;
  available: boolean;
  borrowedBy?: string;
  borrowDate?: Date;
  returnDate?: Date;
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
  id: string;
  studentId: string;
  bookId: string;
  type: 'borrow' | 'return';
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
}

export interface NewBookRequest {
  id: string;
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