'use client';

import { IoCartOutline, IoTicketOutline, IoPersonOutline } from 'react-icons/io5';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCart } from '@/context/CartContext';

export default function Menu() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  const isOfertasActive = pathname === '/' || pathname.startsWith('/cupcake/');
  const isCarrinhoActive = pathname === '/carrinho';
  const isPerfilActive = pathname === '/perfil';

  return (
    <footer className="fixed bottom-0 left-0 flex w-full justify-around border-t border-gray-200 bg-white py-3 text-xs font-medium">
      <Link
        className={`flex flex-col items-center relative ${isCarrinhoActive ? 'text-orange-500' : 'text-black'}`}
        href="/carrinho"
      >
        <IoCartOutline className="h-5 w-5" />
        Carrinho
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
      <Link
        className={`flex flex-col items-center ${isOfertasActive ? 'text-orange-500' : 'text-black'}`}
        href="/"
      >
        <IoTicketOutline className="h-5 w-5" />
        Ofertas
      </Link>
      <Link
        className={`flex flex-col items-center ${isPerfilActive ? 'text-orange-500' : 'text-black'}`}
        href="/perfil"
      >
        <IoPersonOutline className="h-5 w-5" />
        Eu
      </Link>
    </footer>
  );
}
