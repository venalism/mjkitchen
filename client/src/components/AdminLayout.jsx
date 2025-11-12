import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <Link to="/" className="font-semibold">MJ Kitchen Admin</Link>
          <nav className="space-x-4">
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/menu">Menu</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
          </nav>
        </div>
      </div>
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

