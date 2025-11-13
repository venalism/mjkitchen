// client/src/pages/admin/AdminGalleryPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FiEdit, FiTrash2, FiX, FiPlus, FiImage, FiArrowLeft } from 'react-icons/fi';

// --- Modal Component ---
const GalleryModal = ({ image, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: image || { image_url: '', caption: '' },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {image ? 'Edit Image' : 'Add New Image'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                {...register('image_url', { required: 'Image URL is required' })}
                placeholder="https://example.com/image.png"
                className="mt-1 block w-full"
              />
              {errors.image_url && <p className="mt-1 text-xs text-red-500">{errors.image_url.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Caption (Optional)</label>
              <textarea
                {...register('caption')}
                rows={3}
                className="mt-1 block w-full"
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function AdminGalleryPage() {
  const { menuId } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // We get the menu item details, which includes the gallery images array
      const { data } = await api.get(`/menu/items/${menuId}`);
      setMenuItem(data);
    } catch (error) {
      console.error("Failed to load menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [menuId]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
  };

  const handleModalSave = async (data) => {
    try {
      if (currentImage) {
        // Update
        await api.put(`/menu/gallery/${currentImage.gallery_id}`, data);
      } else {
        // Create
        await api.post(`/menu/${menuId}/gallery`, data);
      }
      handleModalClose();
      loadData(); // Refresh the list
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Failed to save image.');
    }
  };

  const handleDelete = async (galleryId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/menu/gallery/${galleryId}`);
        loadData(); // Refresh
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('Failed to delete image.');
      }
    }
  };

  return (
    <div className="py-6">
      <div className="mb-4">
        <Link 
          to="/admin/menu" 
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800"
        >
          <FiArrowLeft />
          Back to Menu List
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          Manage Gallery: <span className="text-emerald-600">{menuItem?.menu_name || '...'}</span>
        </h1>
        <button
          onClick={() => {
            setCurrentImage(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md text-sm hover:bg-emerald-700"
        >
          <FiPlus size={16} />
          Add Image
        </button>
      </div>
      
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-gray-500">Loading images...</p>
        ) : menuItem?.images.length === 0 ? (
          <p className="text-gray-500">No gallery images found for this item.</p>
        ) : (
          menuItem?.images.map((img) => (
            <div key={img.gallery_id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <img src={img.image_url} alt={img.caption || 'Gallery image'} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-sm text-gray-600 truncate">{img.caption || 'No caption'}</p>
                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    onClick={() => {
                      setCurrentImage(img);
                      setIsModalOpen(true);
                    }} 
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(img.gallery_id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <GalleryModal
          image={currentImage}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}