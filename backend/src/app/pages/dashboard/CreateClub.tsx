import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Upload, X, Loader2 } from 'lucide-react';

export function CreateClub() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    email: '',
    website: '',
  });

  const categories = ['Technology', 'Arts', 'Sports', 'Academic', 'Social', 'Career'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    navigate('/dashboard/my-clubs');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#090908] text-[#F5F0E8] px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-white mb-2">Create a Club</h1>
          <p className="text-white/60">Start your own community and bring students together</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Club Logo/Cover */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Club Images</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Club Logo</label>
                <div className="relative h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors cursor-pointer overflow-hidden group">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 group-hover:text-white/80 transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <p className="text-sm">Click to upload logo</p>
                    <p className="text-xs text-white/40 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* Cover Upload */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Cover Image</label>
                <div className="relative h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors cursor-pointer overflow-hidden group">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 group-hover:text-white/80 transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <p className="text-sm">Click to upload cover</p>
                    <p className="text-xs text-white/40 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Club Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter club name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                >
                  <option value="" className="bg-gray-900">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us about your club..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Engineering Building, Room 301"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="club@university.edu"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourclub.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#C9A96E] text-[#090908] rounded-xl font-semibold hover:bg-[#B9925E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Club...
                </>
              ) : (
                "Create Club"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
