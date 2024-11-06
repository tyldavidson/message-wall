'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Image as ImageIcon, X, Plus, Trash2, Lock, LogOut } from 'lucide-react';
import Script from 'next/script';

const MessageWall = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [newMessage, setNewMessage] = useState({
    name: '',
    message: '',
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    fetchMessages();
    const storedAdminStatus = localStorage.getItem('isAdmin');
    if (storedAdminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert('Please complete the CAPTCHA verification');
      return;
    }
    
    if (newMessage.name && newMessage.message) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newMessage.name,
            message: newMessage.message,
            imageUrl: newMessage.imagePreview,
            recaptchaToken: recaptchaToken,
          }),
        });

        if (response.ok) {
          await fetchMessages();
          setNewMessage({
            name: '',
            message: '',
            image: null,
            imagePreview: null,
          });
          setShowModal(false);
          // Reset reCAPTCHA
          window.grecaptcha?.reset();
          setRecaptchaToken('');
        }
      } catch (error) {
        console.error('Error posting message:', error);
      }
    }
  };

  // ... rest of your existing functions stay the same ...

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js" async defer />
      
      <div className="min-h-screen bg-[#4A4745] text-white flex flex-col">
        {/* Your existing header and content sections stay the same until the form */}

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

                {/* reCAPTCHA */}
                <div className="flex justify-center my-4">
                  <div 
                    className="g-recaptcha" 
                    data-sitekey="6Ld4TXcqAAAAAGJ7msvDzjRzM-FGLA724cRP2n-H"
                    data-callback={(token) => setRecaptchaToken(token)}
                  />
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

        {/* Rest of your existing code (admin modal, footer, etc.) stays the same */}
      </div>

      {/* Add this style to hide the reCAPTCHA badge */}
      <style jsx global>{`
        .grecaptcha-badge {
          visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default MessageWall;