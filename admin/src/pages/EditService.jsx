import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PageLayout, PageSkeletonForm } from "../Components/PageLayout";
import { FiEdit2 } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    review: "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [subServices, setSubServices] = useState([{ name: "", price: "" }]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/${id}`)
      .then((res) => {
        const data = res.data;
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          rating: data.rating,
          review: data.review || "",
          images: [],
        });
        setExistingImages(data.images || []);
        const subs = data.subServices?.length
          ? data.subServices.map((s) => ({ name: s.name || s.title || "", price: s.price ?? "" }))
          : [{ name: "", price: "" }];
        setSubServices(subs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...subServices];
    updated[index][name] = value;
    setSubServices(updated);
  };

  const addSubService = () => {
    setSubServices([...subServices, { name: "", price: "" }]);
  };

  const removeSubService = (index) => {
    const updated = [...subServices];
    updated.splice(index, 1);
    setSubServices(updated);
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value);
      }
    });
    formData.append("subServices", JSON.stringify(subServices));
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product");
    }
  };

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <PageLayout
      icon={FiEdit2}
      title="Edit Service"
      subtitle="Update service details"
      maxWidth="max-w-3xl"
    >
      {loading ? (
        <PageSkeletonForm />
      ) : (
        <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden animate-slide-up">
          <div className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Service Name"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={`${inputClass} min-h-[100px]`}
                placeholder="Description"
                required
                rows={4}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Price (₹)"
                  required
                />
                <input
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Rating"
                  required
                />
              </div>
              <input
                name="review"
                value={form.review}
                onChange={handleChange}
                className={inputClass}
                placeholder="Review"
              />

              <div>
                <label className={labelClass}>Existing Images</label>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={`${BASE_URL}/uploads/${img}`}
                        alt=""
                        className="w-24 h-16 object-cover rounded-xl border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Add New Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700"
                />
              </div>

              <div>
                <label className={labelClass}>Sub-Services</label>
                <div className="space-y-2">
                  {subServices.map((sub, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2">
                      <input
                        name="name"
                        value={sub.name}
                        onChange={(e) => handleSubChange(index, e)}
                        placeholder="Sub-service name"
                        className={`${inputClass} flex-1`}
                        required
                      />
                      <input
                        name="price"
                        value={sub.price}
                        type="number"
                        onChange={(e) => handleSubChange(index, e)}
                        placeholder="Price (₹)"
                        className={`${inputClass} sm:w-32`}
                        required
                      />
                      {subServices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubService(index)}
                          className="text-red-600 hover:text-red-700 text-xl px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSubService}
                  className="mt-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  + Add Sub-Service
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
              >
                Update Product
              </button>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
