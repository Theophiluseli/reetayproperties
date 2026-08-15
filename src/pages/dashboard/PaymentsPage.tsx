import React from 'react';
import { CreditCard, Plus, ShieldCheck, CheckCircle } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-950">Payments & Billing</h1>
        <p className="text-xs text-gray-500 font-medium">Manage payment methods, billing address, and receipts</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-navy-950">Saved Payment Methods</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-navy-950 via-navy-900 to-slate-800 text-white space-y-4 shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gold-400">Reetay VIP Card</span>
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-lg font-mono tracking-wider">•••• •••• •••• 8902</div>
            <div className="flex justify-between text-[10px] text-gray-300 uppercase">
              <span>David Reetay</span>
              <span>Expires 08/29</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gold-500 hover:bg-gold-50/20 transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-navy-950 mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-navy-950">Add New Payment Method</span>
            <span className="text-[10px] text-gray-400">Card, Mobile Money, or Bank Transfer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
