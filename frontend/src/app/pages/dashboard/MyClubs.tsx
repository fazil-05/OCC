import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, Award, Settings, Bell, Crown } from 'lucide-react';

export function MyClubs() {
  const myClubs = [
    {
      id: 1,
      name: 'Tech Innovators',
      role: 'President',
      members: 245,
      nextEvent: 'Hackathon 2026 - Apr 15',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      color: 'cyan',
    },
    {
      id: 2,
      name: 'Photography Club',
      role: 'Member',
      members: 201,
      nextEvent: 'Photo Walk - Apr 12',
      image: 'https://images.unsplash.com/photo-1588420490858-3828a17244a5?w=400',
      color: 'purple',
    },
    {
      id: 3,
      name: 'Sustainability Squad',
      role: 'Vice President',
      members: 223,
      nextEvent: 'Campus Cleanup - Apr 18',
      image: 'https://images.unsplash.com/photo-1736195881107-568d125b7dc8?w=400',
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090908] text-[#F5F0E8] space-y-8 px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">My Clubs</h1>
        <p className="text-white/60">Manage your club memberships and activities</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-[#C9A96E]/20 to-[#C9A96E]/10 border border-[#C9A96E]/25 p-6"
        >
          <Users className="w-8 h-8 text-[#C9A96E] mb-3" />
          <p className="text-white/60 text-sm mb-1">Total Clubs</p>
          <p className="text-3xl font-black text-white">{myClubs.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-[#C9A96E]/20 to-[#C9A96E]/10 border border-[#C9A96E]/25 p-6"
        >
          <Award className="w-8 h-8 text-[#C9A96E] mb-3" />
          <p className="text-white/60 text-sm mb-1">Leadership Roles</p>
          <p className="text-3xl font-black text-white">2</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-[#C9A96E]/20 to-[#C9A96E]/10 border border-[#C9A96E]/25 p-6"
        >
          <Calendar className="w-8 h-8 text-[#C9A96E] mb-3" />
          <p className="text-white/60 text-sm mb-1">Upcoming Events</p>
          <p className="text-3xl font-black text-white">3</p>
        </motion.div>
      </div>

      {/* Clubs List */}
      <div className="space-y-6">
        {myClubs.map((club, index) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0F]" />
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{club.name}</h3>
                      {club.role !== 'Member' && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400 font-semibold">{club.role}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{club.members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{club.nextEvent}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <Bell className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <Settings className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-[#C9A96E]/20 text-[#C9A96E] rounded-lg hover:bg-[#C9A96E]/30 transition-colors font-medium">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                    View Events
                  </button>
                  {club.role !== 'Member' && (
                    <button className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                      Manage Club
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State for users with no clubs */}
      {myClubs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
        >
          <div className="inline-block p-6 bg-white/5 rounded-full mb-4">
            <Users className="w-12 h-12 text-white/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No clubs yet</h3>
          <p className="text-white/60 mb-6">Join clubs to see them here</p>
          <button className="px-6 py-3 bg-[#C9A96E] text-[#090908] rounded-full font-semibold hover:bg-[#B9925E] transition-colors">
            Discover Clubs
          </button>
        </motion.div>
      )}
    </div>
  );
}
