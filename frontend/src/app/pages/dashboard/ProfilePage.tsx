import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, Mail, MapPin, Calendar, Award, Edit2, Save } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || 'Tech University',
    major: 'Computer Science',
    year: 'Junior',
    bio: 'Passionate about technology and innovation. Love building things and solving problems.',
    interests: ['Technology', 'Sports', 'Music'],
  });

  const achievements = [
    { icon: '🏆', label: 'Club President', count: 1 },
    { icon: '⭐', label: 'Events Attended', count: 24 },
    { icon: '🎯', label: 'Active Member', count: 3 },
    { icon: '🎓', label: 'Skills Learned', count: 12 },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save to backend
  };

  return (
    <div className="min-h-screen bg-[#090908] text-[#F5F0E8] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">My Profile</h1>
        <p className="text-white/60">Manage your personal information and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-2xl bg-gradient-to-br from-[#C9A96E]/20 to-[#C9A96E]/10 border border-[#C9A96E]/25 p-8 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C9A96E]/40 to-[#C9A96E]/10 flex items-center justify-center">
              <span className="text-5xl font-black text-white">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-black text-white mb-1">{profileData.name}</h2>
                <p className="text-white/70">{profileData.major} • {profileData.year}</p>
              </div>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-white"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profileData.university}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined Apr 2024</span>
              </div>
            </div>

            <p className="text-white/80">{profileData.bio}</p>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-black text-white mb-4">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center hover:border-white/20 transition-all"
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="text-2xl font-black text-white mb-1">{achievement.count}</p>
              <p className="text-white/60 text-sm">{achievement.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
        >
          <h3 className="text-xl font-black text-white mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              ) : (
                <p className="text-white font-medium">{profileData.name}</p>
              )}
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1">Email</label>
              <p className="text-white font-medium">{profileData.email}</p>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1">University</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.university}
                  onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              ) : (
                <p className="text-white font-medium">{profileData.university}</p>
              )}
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1">Major</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.major}
                  onChange={(e) => setProfileData({ ...profileData, major: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              ) : (
                <p className="text-white font-medium">{profileData.major}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
        >
          <h3 className="text-xl font-black text-white mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.interests.map((interest, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#C9A96E]/20 text-[#C9A96E] rounded-full text-sm font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
          {isEditing && (
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors">
              + Add Interest
            </button>
          )}

          <div className="mt-6">
            <h4 className="text-lg font-bold text-white mb-3">About</h4>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
              />
            ) : (
              <p className="text-white/70">{profileData.bio}</p>
            )}
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
