import React from 'react';
import { useCartStore } from '../store/cartStore';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, total, updateQty, removeItem, clear } = useCartStore();
  const profile = useAuthStore((s) => s.profile);
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!profile) return alert('Harap login');
    // For demo, gunakan alamat default pertama
    const addrs = await api.get(`/users/${profile.user_id}/addresses`);
    const defaultAddress = addrs.data[0];
    if (!defaultAddress) return alert('Tambahkan alamat terlebih dahulu');

    const payload = {
      user_id: profile.user_id,
      address_id: defaultAddress.address_id,
      items: items.map((i) => ({ menu_id: i.menu_id, quantity: i.quantity })),
    };
    const resp = await api.post('/orders', payload);
    clear();
    navigate('/orders');
  };

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-4">Keranjang</h1>
      {items.length === 0 ? <div>Keranjang kosong</div> : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.menu_id} className="flex items-center justify-between border rounded p-3 bg-white">
              <div>
                <div className="font-semibold">{i.menu_name}</div>
                <div className="text-sm text-gray-500">Rp {Number(i.price).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" className="w-20 border rounded p-1" value={i.quantity} min={1} onChange={(e) => updateQty(i.menu_id, Number(e.target.value))} />
                <button className="text-red-500" onClick={() => removeItem(i.menu_id)}>Hapus</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-4">
            <div className="font-semibold">Total: Rp {total().toLocaleString()}</div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={placeOrder}>Buat Pesanan</button>
          </div>
        </div>
      )}
    </div>
  );
}

