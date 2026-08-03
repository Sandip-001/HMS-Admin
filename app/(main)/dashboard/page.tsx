"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";


const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-4 mb-6 mt-6 sm:mb-8 rounded-xl shadow-2xl px-5"
        >
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
