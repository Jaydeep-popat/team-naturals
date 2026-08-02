'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      
      <div className="rounded-[20px] border border-forest/10 bg-white p-7 space-y-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-forest text-[15px]">Email Notifications</p>
            <p className="text-[13px] text-forest/70 mt-1 font-medium">Receive updates about your orders and offers.</p>
          </div>
          <div 
            className={`flex h-[32px] w-[56px] items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${emailNotif ? 'bg-forest' : 'bg-forest/15'}`}
            onClick={() => setEmailNotif(!emailNotif)}
          >
            <motion.div 
              className="h-[24px] w-[24px] rounded-full bg-white shadow-sm" 
              animate={{ x: emailNotif ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
        <hr className="border-forest/5" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-forest text-[15px]">SMS Notifications</p>
            <p className="text-[13px] text-forest/70 mt-1 font-medium">Get text alerts for deliveries.</p>
          </div>
          <div 
            className={`flex h-[32px] w-[56px] items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${smsNotif ? 'bg-forest' : 'bg-forest/15'}`}
            onClick={() => setSmsNotif(!smsNotif)}
          >
            <motion.div 
              className="h-[24px] w-[24px] rounded-full bg-white shadow-sm" 
              animate={{ x: smsNotif ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
