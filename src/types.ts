export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export interface UserProfile {
  uid: string;
  name: string;
  studentId: string;
  dormRoom?: string;
  phone?: string;
  role: UserRole;
  penaltyPoints: number;
  createdAt: any;
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: any;
}

export interface PenaltyPointRecord {
  id: string;
  userId: string;
  reason: string;
  points: number;
  date: any;
}

export interface SleepoutApplication {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export interface LaundryMachine {
  id: string;
  type: 'washer' | 'dryer';
  machineIndex: number;
  status: 'available' | 'in-use' | 'broken';
  userId?: string;
  startTime?: any;
  durationMinutes?: number;
}

export interface DailyMenu {
  date: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  operatingHours?: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  importance: 'normal' | 'urgent';
  createdAt: any;
}

export interface Post {
  id: string;
  authorId: string;
  authorName?: string;
  title: string;
  content: string;
  category: 'anonymous' | 'market';
  imageUrl?: string;
  price?: number;
  createdAt: any;
  commentCount?: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: any;
}
