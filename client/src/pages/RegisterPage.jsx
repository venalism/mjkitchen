import React from 'react';
import { useForm } from 'react-hook-form';
import { signUp } from '../services/supabaseAuth';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { data } = await signUp({ email: values.email, password: values.password, options: { data: { full_name: values.name } } });
      if (data?.session) {
        await setSession(data.session);
        navigate('/');
      } else {
        alert('Cek email untuk verifikasi atau login setelah mendaftar.');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-semibold mb-4">Daftar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Nama" {...register('name')} />
        <input className="w-full border rounded p-2" placeholder="Email" {...register('email')} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" {...register('password')} />
        <button className="w-full bg-emerald-600 text-white py-2 rounded">Daftar</button>
      </form>
      <div className="text-sm mt-3">Sudah punya akun? <Link className="text-emerald-600" to="/login">Masuk</Link></div>
    </div>
  );
}