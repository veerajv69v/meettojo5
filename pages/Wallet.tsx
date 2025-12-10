import React, { useState, useEffect } from 'react';
import { COIN_PACKAGES, initiatePhonePeTransaction } from '../services/paymentService';
import { getCoinBalance, getTransactions, addCoins } from '../services/supabaseService';
import { CoinPackage, Transaction } from '../types';
import { Wallet as WalletIcon, CheckCircle2, Loader2, Gift, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    const bal = await getCoinBalance();
    const txs = await getTransactions();
    setBalance(bal);
    setHistory(txs);
  };

  const handlePurchase = async (pkg: CoinPackage) => {
    setProcessing(pkg.id);
    try {
      const success = await initiatePhonePeTransaction(pkg);
      if (success) {
        const newBal = await addCoins(pkg.coins, `Purchased ${pkg.coins} Coins`);
        setBalance(newBal);
        loadWalletData(); // Refresh history
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Payment Failed. Please try again.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto pb-24">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-8 rounded-b-3xl shadow-xl sticky top-0 z-10">
         <div className="flex items-center justify-between mb-4">
           <h1 className="text-2xl font-bold">My Wallet</h1>
           <WalletIcon className="w-6 h-6 opacity-80" />
         </div>
         <div className="text-center py-6">
           <span className="text-sm opacity-80 uppercase tracking-widest">Current Balance</span>
           <div className="text-5xl font-black mt-2 flex items-center justify-center gap-2">
             {balance} <span className="text-2xl text-yellow-400">🪙</span>
           </div>
         </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
           <Gift className="w-5 h-5 text-pink-500" />
           Top Up Coins
        </h2>
        
        <div className="space-y-4">
          {COIN_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePurchase(pkg)}
              disabled={!!processing}
              className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition active:scale-[0.98] disabled:opacity-70 relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-2xl">
                    🪙
                 </div>
                 <div className="text-left">
                   <div className="font-bold text-gray-900 text-lg">{pkg.coins} Coins</div>
                   <div className="text-xs text-green-600 font-medium">Best Value</div>
                 </div>
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                 ₹{pkg.price}
              </div>

              {processing === pkg.id && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                   <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
           <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-500" />
              Transaction History
           </h2>
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             {history.length > 0 ? (
                <div className="divide-y divide-gray-50">
                   {history.map(tx => (
                     <div key={tx.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                           </div>
                           <div>
                             <p className="font-bold text-sm text-gray-900">{tx.description}</p>
                             <p className="text-xs text-gray-400">{formatDate(tx.timestamp)}</p>
                           </div>
                        </div>
                        <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                           {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                        </span>
                     </div>
                   ))}
                </div>
             ) : (
               <div className="p-8 text-center text-gray-400 text-sm">No transactions yet.</div>
             )}
           </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white rounded-2xl p-8 flex flex-col items-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold">Payment Successful!</h3>
              <p className="text-gray-500 mt-2">Coins have been added to your wallet.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;