import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
      <footer className="text-center text-sm text-gray-500 py-6">© MJ Kitchen</footer>
    </div>
  );
}


