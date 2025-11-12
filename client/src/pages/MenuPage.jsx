import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MenuItem from '../components/MenuItem';
import { useCartStore } from '../store/cartStore';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState('');
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.get('/menu/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    const url = active ? `/menu/items?category_id=${active}` : '/menu/items';
    api.get(url).then((r) => setItems(r.data));
  }, [active]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-4">Menu</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setActive('')} className={`px-3 py-1 rounded border ${active===''?'bg-emerald-600 text-white':''}`}>Semua</button>
        {categories.map((c) => (
          <button key={c.category_id} onClick={() => setActive(c.category_id)} className={`px-3 py-1 rounded border ${active===c.category_id?'bg-emerald-600 text-white':''}`}>{c.category_name}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItem key={item.menu_id} item={item} onAdd={addItem} />
        ))}
      </div>
    </div>
  );
}