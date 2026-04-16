import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Lock, Globe, User, Shield, Eye, EyeOff } from 'lucide-react';

export function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#090908] text-[#F5F0E8] px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">Settings</h1>
        <p className="text-white/60">Manage your account settings and preferences</p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A96E]/20 rounded-lg">
            <Bell className="w-5 h-5 text-[#C9A96E]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Notifications</h2>
            <p className="text-white/60 text-sm">Manage how you receive notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-white/60 text-sm">Receive push notifications on your device</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-[#C9A96E]' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-white/60 text-sm">Receive notifications via email</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                emailNotifications ? 'bg-[#C9A96E]' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  emailNotifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A96E]/20 rounded-lg">
            <Shield className="w-5 h-5 text-[#C9A96E]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Account Security</h2>
            <p className="text-white/60 text-sm">Manage your password and security settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
            />
          </div>

          <button className="w-full py-3 bg-[#C9A96E] text-[#090908] rounded-xl font-semibold hover:bg-[#B9925E] transition-colors">
            Update Password
          </button>
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A96E]/20 rounded-lg">
            <Lock className="w-5 h-5 text-[#C9A96E]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Privacy</h2>
            <p className="text-white/60 text-sm">Control your privacy settings</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Profile Visibility</p>
                <p className="text-white/60 text-sm">Make your profile visible to others</p>
              </div>
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                <option value="public">Public</option>
                <option value="members">Members Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Show Email</p>
                <p className="text-white/60 text-sm">Display email on your profile</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-white/20">
                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6"
      >
        <h2 className="text-xl font-black text-red-400 mb-2">Danger Zone</h2>
        <p className="text-white/60 text-sm mb-6">Irreversible actions for your account</p>

        <div className="space-y-3">
          <button className="w-full py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors text-left px-4">
            Deactivate Account
          </button>
          <button className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors text-left px-4">
            Delete Account
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
