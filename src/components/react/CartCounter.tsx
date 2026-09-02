import React from 'react';
import { useStore } from '@nanostores/react';
import { $totalCartCount, toggleCartDrawer } from '../../utils/cartStore';
import { ShoppingBag } from 'lucide-react';

export default function CartCounter() {
  const count = useStore($totalCartCount);

  return (
    <button
      onClick={() => toggleCartDrawer(true)}
      className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100 flex items-center justify-center group"
      aria-label="Buka Keranjang Belanja"
    >
      <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:scale-105 transition-transform" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse-subtle border-2 border-white shadow-sm">
          {count}
        </span>
      )}
    </button>
  );
}
