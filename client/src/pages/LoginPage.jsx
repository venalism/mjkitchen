import React from 'react';
import { useForm } from 'react-hook-form';
import { signInWithPassword } from '../services/supabaseAuth';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { session } = await signInWithPassword(values);
      await setSession(session);
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-semibold mb-4">Masuk</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" {...register('email')} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" {...register('password')} />
        <button className="w-full bg-emerald-600 text-white py-2 rounded">Masuk</button>
      </form>
      <div className="text-sm mt-3">Belum punya akun? <Link className="text-emerald-600" to="/register">Daftar</Link></div>
    </div>
  );
}