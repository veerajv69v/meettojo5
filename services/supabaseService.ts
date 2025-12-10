import { User, Transaction } from '../types';

// This is a mock service to simulate Supabase interactions
// In a real app, this would import { createClient } from '@supabase/supabase-js'

export const mockUser: User = {
  id: 'current-user-123',
  name: 'Alex',
  age: 26,
  gender: 'Male',
  bio: 'Adventure seeker & coffee enthusiast. Looking for someone to hike the world with.',
  interests: ['Travel', 'Photography', 'Hiking', 'Sushi'],
  photos: [
    'https://picsum.photos/400/600?random=1',
    'https://picsum.photos/400/600?random=2',
    'https://picsum.photos/400/600?random=3'
  ],
  location: 'San Francisco, CA',
  job: 'Product Designer',
  coins: 150,
  
  // Extended Mock Data
  company: 'Tech Startup',
  school: 'University of Design',
  hometown: 'Austin, TX',
  height: '180 cm',
  exercise: 'Active',
  educationLevel: 'Bachelors',
  drinking: 'Socially',
  smoking: 'Never',
  lookingFor: 'Relationship',
  kids: 'Someday',
  starSign: 'Leo',
  politics: 'Liberal',
  religion: 'Agnostic',
  languages: ['English', 'Spanish']
};

let currentCoins = mockUser.coins;
let transactions: Transaction[] = [
  { id: 't1', type: 'credit', amount: 100, description: 'Welcome Bonus', timestamp: Date.now() - 100000000 },
  { id: 't2', type: 'credit', amount: 50, description: 'Daily Login', timestamp: Date.now() - 50000000 },
];

export const fetchPotentialMatches = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `match-${i}`,
    name: ['Sarah', 'Jessica', 'Emily', 'Chloe', 'Mia'][i % 5],
    age: 22 + (i % 8),
    gender: 'Female',
    bio: 'Lover of sunsets and long walks on the beach. swipe right if you have a dog!',
    interests: ['Yoga', 'Reading', 'Wine', 'Music'],
    photos: [
      `https://picsum.photos/400/600?random=${10 + i}`,
      `https://picsum.photos/400/600?random=${20 + i}`
    ],
    location: `${i * 2 + 1} miles away`,
    job: 'Marketing Manager',
    coins: 0,
    height: '165 cm',
    exercise: 'Sometimes',
    lookingFor: 'Something Casual',
    drinking: 'Socially'
  }));
};

export const sendMessage = async (matchId: string, text: string, isGift: boolean = false) => {
  console.log(`Sending message to ${matchId}: ${text} (Gift: ${isGift})`);
  return true;
};

// --- Wallet Services ---

export const getCoinBalance = async (): Promise<number> => {
  return currentCoins;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
};

export const addCoins = async (amount: number, description: string) => {
  currentCoins += amount;
  mockUser.coins = currentCoins; // Sync mock user
  transactions.push({
    id: Date.now().toString(),
    type: 'credit',
    amount,
    description,
    timestamp: Date.now()
  });
  return currentCoins;
};

export const deductCoins = async (amount: number, description: string): Promise<boolean> => {
  if (currentCoins >= amount) {
    currentCoins -= amount;
    mockUser.coins = currentCoins; // Sync mock user
    transactions.push({
      id: Date.now().toString(),
      type: 'debit',
      amount,
      description,
      timestamp: Date.now()
    });
    return true;
  }
  return false;
};