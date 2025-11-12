import React from 'react';

export default function MenuItem({ item, onAdd }) {
  const firstImage = Array.isArray(item.images) && item.images[0]?.image_url;
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {firstImage ? (
        <img src={firstImage} alt={item.menu_name} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
      )}
      <div className="p-3">
        <div className="font-semibold">{item.menu_name}</div>
        <div className="text-sm text-gray-500">{item.description}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-semibold">Rp {Number(item.price).toLocaleString()}</div>
          <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={() => onAdd?.(item)}>Tambah</button>
        </div>
      </div>
    </div>
  );
}

