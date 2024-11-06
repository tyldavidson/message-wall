'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Image as ImageIcon, X, Plus, Trash2, Lock, LogOut } from 'lucide-react';

const MessageWall = () => {
  // ... all the state and function declarations stay the same ...

  return (
    <div className="min-h-screen bg-[#4A4745] text-white flex flex-col font-['Playfair_Display']">
      <div className="flex-1 p-5 sm:p-10 lg:p-20 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Digital Ofrenda</h1>
          {isAdmin && (
            <button
              onClick={handleAdminLogout}
              className="text-sm text-[#FF7D2B] hover:text-[#FF7D2B]/80"
            >
              Logout Admin
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#FF7D2B] text-white px-4 py-2 rounded-lg hover:bg-[#FF7D2B]/80 transition duration-200"
          >
            <Plus size={20} />
            Add a message
          </button>
        </div>

        {/* Messages Display - Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="break-inside-avoid mb-6 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/15 transition duration-200 shadow-lg"
            >
              {isAdmin && (
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition duration-200"
                  title="Delete message"
                >
                  <Trash2 size={20} />
                </button>
              )}
              {msg.image_url && (
                <div className="relative w-full">
                  <img
                    src={msg.image_url}
                    alt="Message attachment"
                    className="w-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-white/90 mb-4 leading-relaxed">{msg.message}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-[#FF7D2B]">- {msg.name}</p>
                    <p className="text-white/50">{new Date(msg.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleLike(msg.id)}
                    className="flex items-center gap-1 text-white/50 hover:text-[#FF7D2B] transition duration-200"
                  >
                    <Heart
                      size={16}
                      fill={msg.likes > 0 ? "currentColor" : "none"}
                    />
                    <span>{msg.likes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updated Footer */}
      <footer className="p-5 sm:p-10 lg:p-20 text-sm text-[#FF7D2B]/80">
        <p>
          © 2024 Digital Ofrenda LLC - {' '}
          <button
            onClick={() => setShowAdminModal(true)}
            className="hover:text-[#FF7D2B] transition duration-200 inline-block"
          >
            admin login
          </button>
        </p>
      </footer>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#4A4745] shadow-xl rounded-lg w-full max-w-md relative text-white">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute right-4 top-4 text-white/50 hover:text-white/70"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">Admin Access</h2>

              {adminError && (
                <p className="text-red-400 text-sm">{adminError}</p>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Admin Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded focus:ring-2 focus:ring-[#FF7D2B] focus:border-[#FF7D2B] text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF7D2B] text-white py-2 px-4 rounded hover:bg-[#FF7D2B]/80 transition duration-200"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#4A4745] shadow-xl rounded-lg w-full max-w-md relative text-white">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-white/50 hover:text-white/70"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">Add a Message</h2>

              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={newMessage.name}
                  onChange={(e) => setNewMessage(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded focus:ring-2 focus:ring-[#FF7D2B] focus:border-[#FF7D2B] text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Your Message</label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage(prev => ({...prev, message: e.target.value}))}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded min-h-[100px] focus:ring-2 focus:ring-[#FF7D2B] focus:border-[#FF7D2B] text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Add Image (optional)</label>
                <div className="mt-1 flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded cursor-pointer hover:bg-white/10">
                    <ImageIcon size={20} />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {newMessage.imagePreview && (
                    <div className="relative w-20 h-20">
                      <img
                        src={newMessage.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setNewMessage(prev => ({...prev, image: null, imagePreview: null}))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#FF7D2B] text-white py-2 px-4 rounded hover:bg-[#FF7D2B]/80 transition duration-200"
              >
                Post Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageWall;