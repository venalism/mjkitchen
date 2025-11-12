import { create } from 'zustand';
import { supabase, signOut } from '../services/supabaseAuth';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  profile: null,
  loading: false,

  init: async () => {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (session?.access_token) {
      set({ user: session.user, token: session.access_token });
      localStorage.setItem('token', session.access_token);
      // bootstrap profile on backend
      try {
        const resp = await api.post('/users/bootstrap', {
          name: session.user?.user_metadata?.full_name || session.user?.email,
          email: session.user?.email,
        });
        set({ profile: resp.data });
      } catch {}
    }
  },

  setSession: async (session) => {
    const token = session?.access_token || null;
    set({ user: session?.user || null, token });
    if (token) {
      localStorage.setItem('token', token);
      try {
        const resp = await api.post('/users/bootstrap', {
          name: session.user?.user_metadata?.full_name || session.user?.email,
          email: session.user?.email,
        });
        set({ profile: resp.data });
      } catch {}
    } else {
      localStorage.removeItem('token');
      set({ profile: null });
    }
  },

  logout: async () => {
    await signOut();
    localStorage.removeItem('token');
    set({ user: null, token: null, profile: null });
  },
}));


