import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminMenuPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ menu_name: '', price: 0, category_id: '' });

  const reload = async () => {
    const [cats, menu] = await Promise.all([
      api.get('/menu/categories'),
      api.get('/menu/items'),
    ]);
    setCategories(cats.data);
    setItems(menu.data);
  };

  useEffect(() => { reload(); }, []);

  const save = async () => {
    await api.post('/menu/items', { ...form, price: Number(form.price), is_available: true });
    setForm({ menu_name: '', price: 0, category_id: '' });
    reload();
  };

  const remove = async (id) => {
    await api.delete(`/menu/items/${id}`);
    reload();
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-4">Kelola Menu</h1>
      <div className="bg-white border rounded p-4 mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          <input className="border rounded p-2" placeholder="Nama" value={form.menu_name} onChange={(e) => setForm({ ...form, menu_name: e.target.value })} />
          <select className="border rounded p-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Pilih Kategori</option>
            {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
          </select>
          <input className="border rounded p-2" placeholder="Harga" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="mt-3"><button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={save}>Simpan</button></div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((i) => (
          <div key={i.menu_id} className="bg-white border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.menu_name}</div>
              <div className="text-sm text-gray-500">Rp {Number(i.price).toLocaleString()}</div>
            </div>
            <button className="text-red-500" onClick={() => remove(i.menu_id)}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

