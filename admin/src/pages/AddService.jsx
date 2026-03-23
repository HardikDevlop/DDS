import { useState } from "react";
import axios from "axios";
import { PageLayout } from "../Components/PageLayout";
import { FiPlusCircle } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddService() {
  const [form, setForm] = useState({
    name: "",
    visitingPrice: "",
    images: [],
  });

  const [subServices, setSubServices] = useState([
    { name: "", price: "", image: null, imagePreview: null },
  ]);

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

  const removeSubServiceImage = (index) => {
    const updated = [...subServices];
    updated[index].image = null;
    updated[index].imagePreview = null;
    setSubServices(updated);
  };

  const addSubService = () => {
    setSubServices([
      ...subServices,
      { name: "", price: "", image: null, imagePreview: null },
    ]);
  };

  const removeSubService = (index) => {
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
    const subServicesData = subServices.map((sub) => ({
      name: sub.name,
      price: sub.price,
      image: sub.image ? sub.image.name : null,
    }));
    formData.append("subServices", JSON.stringify(subServicesData));
    subServices.forEach((sub) => {
      if (sub.image) formData.append("subServiceImages", sub.image);
    });

    try {
      await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Service added successfully!");
      setForm({ name: "", visitingPrice: "", images: [] });
      setSubServices([{ name: "", price: "", image: null, imagePreview: null }]);
    } catch (err) {
      console.error("Failed to add service:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unknown error";
      alert(`Failed to add service: ${msg}`);
    }
  };

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <PageLayout
      icon={FiPlusCircle}
      title="Add New Service"
      subtitle="Fill out the form to list your service"
      maxWidth="max-w-4xl"
    >
      <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden animate-slide-up">
        <div className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Service Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. AC Repair"
                />
              </div>
              <div>
                <label htmlFor="visitingPrice" className={labelClass}>
                  Visiting Price (₹)
                </label>
                <input
                  id="visitingPrice"
                  name="visitingPrice"
                  type="number"
                  value={form.visitingPrice}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="images" className={labelClass}>
                  Service Images (Max 5)
                </label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700 file:font-medium"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Selected: {form.images.length} image(s)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Sub-Services
                </label>
                <button
                  type="button"
                  onClick={addSubService}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  + Add Sub-Service
                </button>
              </div>
              <div className="grid gap-4">
                {subServices.map((sub, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-800">
                        Sub-Service {index + 1}
                      </h4>
                      {subServices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubService(index)}
                          className="text-red-600 hover:text-red-700 text-xl leading-none"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Sub-Service Name
                        </label>
                        <input
                          name="name"
                          value={sub.name}
                          placeholder="Enter name"
                          onChange={(e) => handleSubChange(index, e)}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Price (₹)
                        </label>
                        <input
                          name="price"
                          value={sub.price}
                          type="number"
                          placeholder="0"
                          onChange={(e) => handleSubChange(index, e)}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Sub-Service Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSubImageChange(index, e)}
                        className="w-full text-sm text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700"
                      />
                      {sub.imagePreview && (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={sub.imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubServiceImage(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-dashboard-card"
              >
                Publish Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
