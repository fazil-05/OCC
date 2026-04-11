import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026

  const events = [
    {
      id: 1,
      title: 'Hackathon 2026',
      club: 'Tech Innovators',
      date: '2026-04-15',
      time: '9:00 AM',
      location: 'Engineering Auditorium',
      attendees: 45,
      color: 'cyan',
    },
    {
      id: 2,
      title: 'Art Exhibition',
      club: 'Arts & Culture',
      date: '2026-04-18',
      time: '2:00 PM',
      location: 'Gallery Hall',
      attendees: 32,
      color: 'purple',
    },
    {
      id: 3,
      title: 'Basketball Tournament',
      club: 'Fitness Enthusiasts',
      date: '2026-04-20',
      time: '4:00 PM',
      location: 'Sports Complex',
      attendees: 64,
      color: 'orange',
    },
    {
      id: 4,
      title: 'AI Workshop',
      club: 'Tech Innovators',
      date: '2026-04-22',
      time: '2:00 PM',
      location: 'Lab 205',
      attendees: 28,
      color: 'cyan',
    },
    {
      id: 5,
      title: 'Campus Cleanup',
      club: 'Sustainability Squad',
      date: '2026-04-25',
      time: '10:00 AM',
      location: 'Main Campus',
      attendees: 52,
      color: 'green',
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-[#090908] text-[#F5F0E8] space-y-8 px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">Events Calendar</h1>
        <p className="text-white/60">Stay updated with upcoming club events and activities</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-white/60 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === 2; // Mock today as April 2
              
              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 rounded-lg transition-all ${
                    day
                      ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
                      : 'bg-transparent'
                  } ${isToday ? 'ring-2 ring-[#C9A96E]' : ''}`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 ${isToday ? 'text-[#C9A96E]' : 'text-white'}`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="text-xs px-2 py-1 rounded bg-[#C9A96E]/20 text-[#C9A96E] truncate"
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <h3 className="text-xl font-black text-white mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <h4 className="text-white font-semibold mb-2">{event.title}</h4>
                  <p className="text-white/60 text-sm mb-3">{event.club}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
