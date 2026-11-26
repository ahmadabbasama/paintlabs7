import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// Floating bag button, bottom-right on every device.
// Hidden while the bag drawer or a full-screen product / checkout page is open.
export const FloatingCartButton: React.FC = () => {
  const { cartItemCount, isCartOpen, setIsCartOpen, isCheckoutOpen, activePainting } = useShop();

  if (isCartOpen || isCheckoutOpen || activePainting) return null;

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#191918] text-white shadow-lg shadow-black/25 flex items-center justify-center hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label={`Open shopping bag with ${cartItemCount} items`}
    >
      <ShoppingBag className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#C5A059] text-[#191918] text-[11px] font-bold tabular-nums flex items-center justify-center border-2 border-[#FBFBFA]">
        {cartItemCount}
      </span>
    </button>
  );
};
