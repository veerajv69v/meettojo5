import { CoinPackage } from '../types';

export const COIN_PACKAGES: CoinPackage[] = [
  { id: 'p1', coins: 100, price: 99 },
  { id: 'p2', coins: 500, price: 399 },
  { id: 'p3', coins: 1200, price: 899 },
];

export const initiatePhonePeTransaction = async (pkg: CoinPackage): Promise<boolean> => {
  console.log('Initiating PhonePe transaction for', pkg);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() > 0.1;
      resolve(success);
    }, 2000);
  });
};