'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, ShoppingBagIcon, MapPinIcon, SettingsIcon, LogOutIcon, PackageIcon } from 'lucide-react';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string; icon: React.FC<any> }[] = [
    { id: 'profile', label: 'Personal Info', icon: UserIcon },
    { id: 'orders', label: 'Order History', icon: ShoppingBagIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-cream/30 px-4 py-32 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="font-display text-4xl font-bold tracking-tight text-forest lg:text-5xl">
            My Account
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            Manage your personal information, orders, and addresses.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Sidebar Navigation */}
          <div className="w-full shrink-0 lg:w-64">
            <div className="flex overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0 hide-scrollbar gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition-colors lg:w-full ${
                      isActive ? 'bg-forest text-cream shadow-soft' : 'text-forest hover:bg-cream-soft'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {tab.label}
                  </button>
                );
              })}
              
              <div className="hidden lg:block my-4 h-px w-full bg-forest/10" />

              <button
                className="flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold text-terracotta transition-colors hover:bg-terracotta/10 lg:w-full"
              >
                <LogOutIcon size={18} strokeWidth={2} />
                Log Out
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 rounded-3xl bg-white p-6 shadow-soft sm:p-10 border border-forest/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'addresses' && <AddressesTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest">Personal Information</h2>
        <p className="mt-1 text-sm text-muted">Update your details to keep your account secure.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">First Name</label>
          <input type="text" defaultValue="Yugal" className="w-full rounded-xl border border-forest/10 bg-cream/20 px-4 py-3 text-sm font-medium text-forest outline-none transition-all focus:border-terracotta focus:bg-white focus:ring-1 focus:ring-terracotta/30" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Last Name</label>
          <input type="text" defaultValue="Doe" className="w-full rounded-xl border border-forest/10 bg-cream/20 px-4 py-3 text-sm font-medium text-forest outline-none transition-all focus:border-terracotta focus:bg-white focus:ring-1 focus:ring-terracotta/30" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Email Address</label>
          <input type="email" defaultValue="yugal@example.com" className="w-full rounded-xl border border-forest/10 bg-cream/20 px-4 py-3 text-sm font-medium text-forest outline-none transition-all focus:border-terracotta focus:bg-white focus:ring-1 focus:ring-terracotta/30" />
        </div>
      </div>

      <div className="pt-4">
        <button className="rounded-full bg-forest px-8 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-forest/90 hover:shadow-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function OrdersTab() {
  const mockOrders = [
    { id: '#TN-1249', date: 'Oct 12, 2026', total: '₹1450', status: 'Delivered', items: 3 },
    { id: '#TN-1022', date: 'Sep 05, 2026', total: '₹890', status: 'Processing', items: 1 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest">Order History</h2>
        <p className="mt-1 text-sm text-muted">View your recent orders and track their status.</p>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl border border-forest/10 p-5 transition-colors hover:bg-cream-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest/5 text-forest">
                <PackageIcon size={20} />
              </div>
              <div>
                <p className="font-bold text-forest">{order.id}</p>
                <p className="text-xs text-muted">{order.date} • {order.items} items</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
              <p className="font-bold text-forest">{order.total}</p>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                order.status === 'Delivered' ? 'bg-forest/10 text-forest' : 'bg-terracotta/10 text-terracotta'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressesTab() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest">Saved Addresses</h2>
          <p className="mt-1 text-sm text-muted">Manage your shipping and billing addresses.</p>
        </div>
        <button className="rounded-full bg-forest px-5 py-2 text-sm font-bold text-white shadow-soft transition-all hover:bg-forest/90 shrink-0">
          Add New Address
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Default Address */}
        <div className="relative rounded-2xl border-2 border-forest p-5 shadow-soft">
          <div className="absolute right-4 top-4 rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
            Default
          </div>
          <p className="font-bold text-forest mb-1">Home</p>
          <div className="text-sm text-muted space-y-1">
            <p>Yugal Doe</p>
            <p>123 Nature Valley Road, Suite A</p>
            <p>Mumbai, MH 400001</p>
            <p>India</p>
            <p className="pt-2 text-forest/70">Phone: +91 98765 43210</p>
          </div>
          <div className="mt-4 flex gap-3 text-xs font-bold text-forest">
            <button className="hover:text-terracotta">Edit</button>
            <button className="hover:text-terracotta">Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest">Account Settings</h2>
        <p className="mt-1 text-sm text-muted">Manage notifications and account security.</p>
      </div>
      
      <div className="rounded-2xl border border-forest/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-forest">Email Notifications</p>
            <p className="text-xs text-muted">Receive updates about your orders and exclusive offers.</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-forest relative cursor-pointer">
            <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
          </div>
        </div>
        <hr className="border-forest/5" />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-forest">SMS Notifications</p>
            <p className="text-xs text-muted">Get text alerts for deliveries.</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-forest/20 relative cursor-pointer">
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
          </div>
        </div>
      </div>
    </div>
  );
}
