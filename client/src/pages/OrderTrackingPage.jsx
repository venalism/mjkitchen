// client/src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function OrderTrackingPage() {
  const profile = useAuthStore((s) => s.profile);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // ✨ FIX: Use profile.id instead of profile.user_id
    if (profile?.id) {
      api.get(`/orders/mine/${profile.id}`).then((r) => setOrders(r.data));
    }
  }, [profile]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-4">Pesanan Saya</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.order_id} className="bg-white border rounded p-3">
            <div className="flex items-center justify-between">
              <div>#{o.order_id}</div>
              <div className="text-sm px-2 py-1 rounded bg-gray-100">{o.status}</div>
            </div>
            <div className="text-sm text-gray-500">Total: Rp {Number(o.total_amount).toLocaleString()}</div>
          </div>
        ))}
        {orders.length === 0 && <div>Belum ada pesanan.</div>}
      </div>
    </div>
  );
}