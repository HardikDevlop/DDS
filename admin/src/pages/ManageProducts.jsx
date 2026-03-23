import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PageLayout, PageSkeletonHeader, PageSkeletonCards } from "../Components/PageLayout";
import { FiPackage, FiPlusCircle, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name,
    visitingPrice: product.visitingPrice,
    images: [],
  });
  const [existingImages, setExistingImages] = useState(Array.isArray(product.images) ? [...product.images] : []);
  const [subServices, setSubServices] = useState(
    Array.isArray(product.subServices) && product.subServices.length > 0
      ? product.subServices.map((sub) => ({
          name: sub.name,
          price: sub.price,
          existingImage: sub.image,
          image: null,
          imagePreview: null,
        }))
      : [{ name: "", price: "", existingImage: null, image: null, imagePreview: null }]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setForm((prev) => ({ ...prev, images: files }));
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...subServices];
    updated[index][name] = value;
    setSubServices(updated);
  };

  const handleSubImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...subServices];
      updated[index].image = file;
      updated[index].imagePreview = URL.createObjectURL(file);
      setSubServices(updated);
    }
  };

  const handleRemoveSubServiceImage = (index) => {
    const updated = [...subServices];
    updated[index].existingImage = null;
    setSubServices(updated);
  };

  const addSubService = () => {
    setSubServices([
      ...subServices,
      { name: "", price: "", existingImage: null, image: null, imagePreview: null },
    ]);
  };

  const removeSubService = (index) => {
    if (subServices.length === 1) return;
    const updated = [...subServices];
    updated.splice(index, 1);
    setSubServices(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("visitingPrice", form.visitingPrice);
    form.images.forEach((file) => formData.append("images", file));
    formData.append("existingImages", JSON.stringify(existingImages || []));
    const subServicesData = subServices.map((sub) => ({
      name: sub.name,
      price: sub.price,
      image: sub.image ? sub.image.name : sub.existingImage || null,
    }));
    formData.append("subServices", JSON.stringify(subServicesData));
    subServices.forEach((sub) => {
      if (sub.image && sub.image instanceof File) formData.append("subServiceImages", sub.image);
    });

    try {
      await axios.put(`${BASE_URL}/api/products/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated!");
      onSave();
    } catch (err) {
      console.error("Failed to update product:", err);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dashboard-card rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-xl border border-slate-200/80">
        <div className="p-4 sm:p-6 sticky top-0 bg-white border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit Service</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Visiting Price (₹)</label>
            <input
              name="visitingPrice"
              type="number"
              value={form.visitingPrice}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Existing Images</label>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={`${BASE_URL}/uploads/${img}`}
                    alt=""
                    className="w-20 h-16 object-cover border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              {existingImages.length === 0 && <span className="text-xs text-slate-500">No images</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Add Images (Max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700"
            />
            {form.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.images.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-20 h-16 object-cover border rounded-xl" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Sub-Services</label>
              <button type="button" onClick={addSubService} className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                + Add Sub-Service
              </button>
            </div>
            {subServices.map((sub, index) => (
              <div key={index} className="border border-slate-200 rounded-xl p-3 mb-3 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-slate-800">Sub-Service {index + 1}</h4>
                  {subServices.length > 1 && (
                    <button type="button" onClick={() => removeSubService(index)} className="text-red-600 hover:text-red-700 text-xl leading-none">
                      ×
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <input
                    name="name"
                    value={sub.name}
                    placeholder="Name"
                    onChange={(e) => handleSubChange(index, e)}
                    required
                    className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                  <input
                    name="price"
                    value={sub.price}
                    type="number"
                    placeholder="Price"
                    onChange={(e) => handleSubChange(index, e)}
                    required
                    className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sub-Service Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSubImageChange(index, e)}
                    className="block text-xs"
                  />
                  {sub.existingImage && !sub.imagePreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Current:</span>
                      <img
                        src={`${BASE_URL}/uploads/${sub.existingImage}`}
                        alt="Current"
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => (e.target.src = "/img/default-service.png")}
                      />
                      <button type="button" onClick={() => handleRemoveSubServiceImage(index)} className="text-red-600 text-xs hover:underline">
                        Remove
                      </button>
                    </div>
                  )}
                  {sub.imagePreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-500">New:</span>
                      <img src={sub.imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...subServices];
                          updated[index].image = null;
                          updated[index].imagePreview = null;
                          setSubServices(updated);
                        }}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  const toggleSubServices = (productId) => {
    setExpanded((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  return (
    <PageLayout
      icon={FiPackage}
      title="Manage Services"
      subtitle={`${products.length} ${products.length === 1 ? "service" : "services"} available`}
      maxWidth="max-w-7xl"
      action={
        <button
          onClick={() => navigate("/add-service")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-dashboard-card"
        >
          <FiPlusCircle size={18} />
          Add New Service
        </button>
      }
    >
      {isLoading ? (
        <>
          <PageSkeletonHeader />
          <PageSkeletonCards count={6} />
        </>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-slide-up">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden hover:shadow-dashboard-card-hover transition-all duration-300"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={
                    product.images?.[0]
                      ? `${BASE_URL}/uploads/${product.images[0]}`
                      : "/img/default-service.png"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/img/default-service.png")}
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-slate-600">
                  <strong>Visiting Price:</strong> ₹{product.visitingPrice}
                </p>
                {product.subServices?.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleSubServices(product._id)}
                      className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700"
                    >
                      {expanded[product._id] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      {expanded[product._id] ? "Hide" : "Show"} Sub-Services
                    </button>
                    {expanded[product._id] && (
                      <ul className="mt-2 text-sm text-slate-700 space-y-2">
                        {product.subServices.map((sub, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <img
                              src={sub.image ? `${BASE_URL}/uploads/${sub.image}` : "/img/default-service.png"}
                              alt={sub.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                              onError={(e) => (e.target.src = "/img/default-service.png")}
                            />
                            <span className="font-medium">{sub.name}</span>
                            <span className="text-emerald-600 font-semibold ml-auto">₹{sub.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 gap-2">
                  <span className="text-xs text-slate-500">
                    {product.subServices?.length || 0} sub-services
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card p-8 sm:p-12 text-center animate-slide-up">
          <FiPackage className="mx-auto text-slate-300" size={48} />
          <h3 className="mt-4 text-lg font-semibold text-slate-800">No services found</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by adding your first service.</p>
          <button
            onClick={() => navigate("/add-service")}
            className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Add Service
          </button>
        </div>
      )}

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={() => {
            setEditing(null);
            fetchProducts();
          }}
        />
      )}
    </PageLayout>
  );
}
