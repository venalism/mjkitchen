// client/src/pages/RegisterPage.jsx
import { useForm } from 'react-hook-form';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Pass extra details to be stored in `auth.users`
          data: {
            name: formData.name,
            phone_number: formData.phone_number,
          }
        }
      });

      if (error) throw error;
      
      // Supabase sends a confirmation email by default.
      // You might want to show a message here.
      alert('Registration successful! Please check your email to confirm.');
      navigate('/login');

    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              {...register('phone_number')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          
          {authError && <p className="text-red-500 text-center">{authError}</p>}
          
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Register
          </button>
        </form>
        <p className="text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;