"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        // Only show active members
        setMembers(data.filter(m => m.isActive).sort((a, b) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          {member.profileImage ? (
            <img
              src={member.profileImage}
              alt={member.name}
              className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-400">
                {member.name.charAt(0)}
              </span>
            </div>
          )}
          <h3 className="text-xl font-bold mb-2">{member.name}</h3>
          <p className="text-gray-600 mb-2">{member.title}</p>
          <p className="text-gray-500">{member.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
