export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bio: string;
  interests: string[];
  photos: string[];
  location: string;
  job: string;
  coins: number;

  // Extended Profile Fields
  company?: string;
  school?: string;
  hometown?: string;
  height?: string;
  exercise?: string;
  educationLevel?: string;
  drinking?: string;
  smoking?: string;
  lookingFor?: string;
  kids?: string;
  starSign?: string;
  politics?: string;
  religion?: string;
  languages?: string[];

  // Auth Specific
  phoneNumber?: string;
  interestedGender?: 'Male' | 'Female' | 'Everyone';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isGift?: boolean;
}

export interface Match {
  id: string;
  user: User;
  lastMessage?: string;
  lastActive: number;
}

export enum AppRoute {
  SPLASH = 'splash',
  AUTH = 'auth',
  PROFILE = 'profile',
  DISCOVER = 'discover',
  PEOPLE = 'people',
  LIKED_YOU = 'liked_you',
  MATCHES = 'matches', // This serves as the Chat List page
  WALLET = 'wallet'
}

export interface CoinPackage {
  id: string;
  coins: number;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: number;
}