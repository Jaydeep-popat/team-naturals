'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { User, Mail, Shield, Camera, Loader2, CheckCircle, Search, ShieldAlert } from 'lucide-react';
import { adminUsers, auth } from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
  const { user, updateProfile } = useAuth();
  const [uploadingPic, setUploadingPic] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [promotingUserId, setPromotingUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await adminUsers.list({ limit: 50, search: searchQuery });
      setUsersList(res.data.users);
    } catch (error: any) {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handlePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploadingPic(true);
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      
      const res = await auth.uploadProfilePic(formData);
      
      // Update local context
      await updateProfile({ profilePic: res.data.user.profilePic });
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setUploadingPic(false);
    }
  };

  const handlePromote = async (userToPromote: any) => {
    if (!confirm(`Are you sure you want to promote ${userToPromote.firstName} to Admin?`)) return;

    setPromotingUserId(userToPromote.userId);
    try {
      await adminUsers.promote(userToPromote.email);
      toast.success(`${userToPromote.firstName} is now an Admin!`);
      fetchUsers(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Failed to promote user');
    } finally {
      setPromotingUserId(null);
    }
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <h1 className="font-display text-3xl font-bold text-forest">Admin Profile</h1>
      
      {/* ── Profile Section ── */}
      <div className="bg-white rounded-2xl border border-forest/10 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          
          {/* Avatar Upload */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full bg-forest/10 flex items-center justify-center text-3xl font-bold text-forest overflow-hidden border-2 border-forest/5 shadow-sm">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <span>{initials || 'A'}</span>
              )}
              
              {uploadingPic && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-forest" />
                </div>
              )}

              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={20} className="mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePicUpload}
                  disabled={uploadingPic}
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-forest">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center gap-2 mt-2 text-forest/60">
              <Shield size={16} className="text-terracotta" />
              <span className="font-medium capitalize">{user?.role || 'Administrator'}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-forest/10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forest/40 uppercase tracking-wider">Email Address</label>
            <div className="flex items-center gap-2 text-forest font-medium">
              <Mail size={18} className="text-forest/50" />
              {user?.email}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forest/40 uppercase tracking-wider">Full Name</label>
            <div className="flex items-center gap-2 text-forest font-medium">
              <User size={18} className="text-forest/50" />
              {user?.firstName} {user?.lastName}
            </div>
          </div>
        </div>
      </div>

      {/* ── Team Management Section ── */}
      <div className="bg-white rounded-2xl border border-forest/10 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-forest/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-forest flex items-center gap-2">
              <ShieldAlert className="text-forest/70" />
              Team Management
            </h2>
            <p className="text-sm text-forest/60 mt-1">View all users and manage admin access.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-forest/5 border-none rounded-xl text-sm focus:ring-1 focus:ring-forest outline-none text-forest placeholder:text-forest/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-forest/70">
            <thead className="bg-forest/5 text-xs uppercase font-semibold text-forest/60">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {loadingUsers ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-forest/40">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-forest/40">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                usersList.map((u) => (
                  <tr key={u.userId} className="hover:bg-forest/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-forest">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-forest/50">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-forest">
                          <Shield size={12} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <User size={12} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handlePromote(u)}
                          disabled={promotingUserId === u.userId}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-terracotta/10 px-3 py-1.5 text-xs font-bold text-terracotta hover:bg-terracotta hover:text-white transition-colors disabled:opacity-50"
                        >
                          {promotingUserId === u.userId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          Promote to Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
