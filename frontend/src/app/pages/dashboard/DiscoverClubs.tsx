import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Users, TrendingUp, Star } from 'lucide-react';

export function DiscoverClubs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Arts', 'Sports', 'Academic', 'Social', 'Career'];

  const clubs = [
    {
      id: 1,
      name: 'Tech Innovators',
      description: 'Building the future through code, innovation, and collaboration.',
      category: 'Technology',
      members: 245,
      rating: 4.8,
      trending: true,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
    },
    {
      id: 2,
      name: 'Robotics Lab',
      description: 'Designing and building robots for competitions and research.',
      category: 'Technology',
      members: 178,
      rating: 4.9,
      trending: true,
      image: 'https://images.unsplash.com/photo-1758295746012-41650245a9bb?w=400',
    },
    {
      id: 3,
      name: 'Arts & Culture Society',
      description: 'Celebrating creativity through visual arts, music, and performance.',
      category: 'Arts',
      members: 189,
      rating: 4.7,
      trending: false,
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
    },
    {
      id: 4,
      name: 'Dance Crew',
      description: 'Express yourself through various dance styles and performances.',
      category: 'Arts',
      members: 156,
      rating: 4.6,
      trending: true,
      image: 'https://images.unsplash.com/photo-1698824554771-293b5dcc42db?w=400',
    },
    {
      id: 5,
      name: 'Debate Club',
      description: 'Sharpen your critical thinking and public speaking skills.',
      category: 'Academic',
      members: 134,
      rating: 4.8,
      trending: false,
      image: 'https://images.unsplash.com/photo-1619521167611-5e7752997822?w=400',
    },
    {
      id: 6,
      name: 'Photography Club',
      description: 'Capture moments and master the art of photography.',
      category: 'Arts',
      members: 201,
      rating: 4.7,
      trending: false,
      image: 'https://images.unsplash.com/photo-1588420490858-3828a17244a5?w=400',
    },
    {
      id: 7,
      name: 'Fitness Enthusiasts',
      description: 'Stay healthy and active with group workouts and sports.',
      category: 'Sports',
      members: 312,
      rating: 4.9,
      trending: true,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    },
    {
      id: 8,
      name: 'Music Collective',
      description: 'Create, perform, and enjoy music together.',
      category: 'Arts',
      members: 167,
      rating: 4.8,
      trending: false,
      image: 'https://images.unsplash.com/photo-1681060168586-e039f0bd3284?w=400',
    },
    {
      id: 9,
      name: 'Sustainability Squad',
      description: 'Making campus greener through environmental initiatives.',
      category: 'Social',
      members: 223,
      rating: 4.9,
      trending: true,
      image: 'https://images.unsplash.com/photo-1736195881107-568d125b7dc8?w=400',
    },
  ];

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#090908] text-[#F5F0E8] space-y-8 px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">Discover Clubs</h1>
        <p className="text-white/60">Find your community and pursue your passions</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Button */}
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-[#C9A96E] text-[#090908] shadow-lg shadow-[#C9A96E]/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Results Count */}
      <div className="text-white/60 text-sm">
        {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'} found
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club, index) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#C9A96E]/50 transition-all">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                {/* Trending Badge */}
                {club.trending && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#C9A96E]/25 backdrop-blur-xl rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-semibold">Trending</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full">
                  <span className="text-xs text-white font-medium">{club.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A96E] transition-colors">
                  {club.name}
                </h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  {club.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-white/60">
                      <Users className="w-4 h-4" />
                      <span>{club.members}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{club.rating}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#C9A96E]/20 text-[#C9A96E] rounded-lg hover:bg-[#C9A96E]/30 transition-colors font-medium">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClubs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="inline-block p-6 bg-white/5 rounded-full mb-4">
            <Search className="w-12 h-12 text-white/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No clubs found</h3>
          <p className="text-white/60">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
