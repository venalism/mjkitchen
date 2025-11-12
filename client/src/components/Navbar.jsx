import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <div className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">MJ Kitchen</Link>
        <nav className="space-x-4 text-sm">
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          {user ? (
            <>
              <NavLink to="/orders">Orders</NavLink>
              <button onClick={logout} className="ml-2 text-red-500">Logout</button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </div>
  );
}

