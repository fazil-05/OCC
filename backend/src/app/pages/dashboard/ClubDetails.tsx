import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Mail, 
  Globe, 
  Star,
  ArrowLeft,
  UserPlus,
  Share2
} from 'lucide-react';

export function ClubDetails() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  // Mock club data
  const club = {
    id: clubId,
    name: 'Tech Innovators',
    description: 'Building the future through code, innovation, and collaboration. We organize hackathons, workshops, and tech talks to help students enhance their technical skills and network with industry professionals.',
    category: 'Technology',
    members: 245,
    rating: 4.8,
    founded: '2020',
    location: 'Engineering Building, Room 301',
    email: 'tech@university.edu',
    website: 'techinnovators.com',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Hackathon 2026',
      date: 'April 15, 2026',
      time: '9:00 AM - 6:00 PM',
      location: 'Engineering Auditorium',
      attendees: 45,
    },
    {
      id: 2,
      title: 'AI Workshop',
      date: 'April 22, 2026',
      time: '2:00 PM - 4:00 PM',
      location: 'Lab 205',
      attendees: 28,
    },
  ];

  const teamMembers = [
    { name: 'Alex Johnson', role: 'President', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { name: 'Sarah Smith', role: 'Vice President', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { name: 'Mike Chen', role: 'Technical Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  ];

  return (
    <div className="min-h-screen bg-[#090908] text-[#F5F0E8] space-y-8 px-6 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Cover Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-80 rounded-3xl overflow-hidden"
      >
        <img
          src={club.coverImage}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
        
        {/* Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button className="p-3 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Club Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-[#C9A96E]/20 backdrop-blur-xl rounded-full mb-3">
                <span className="text-sm text-[#C9A96E] font-medium">{club.category}</span>
              </div>
              <h1 className="text-5xl font-black text-white mb-2">{club.name}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{club.members} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{club.rating}</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-[#C9A96E] text-[#090908] rounded-full font-semibold hover:bg-[#B9925E] transition-colors flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Join Club
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
          >
            <h2 className="text-2xl font-black text-white mb-4">About</h2>
            <p className="text-white/70 leading-relaxed">{club.description}</p>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
          >
            <h2 className="text-2xl font-black text-white mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
          >
            <h3 className="text-xl font-black text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-[#C9A96E]" />
                <span className="text-sm">{club.location}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-[#C9A96E]" />
                <span className="text-sm">{club.email}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Globe className="w-5 h-5 text-[#C9A96E]" />
                <span className="text-sm">{club.website}</span>
              </div>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
          >
            <h3 className="text-xl font-black text-white mb-4">Leadership Team</h3>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{member.name}</p>
                    <p className="text-white/50 text-xs">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
