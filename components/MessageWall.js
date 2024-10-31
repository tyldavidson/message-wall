'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Image as ImageIcon, X, Plus } from 'lucide-react';

const MessageWall = () => {
  // NEW/MODIFIED CODE START
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    name: '',
    message: '',
    image: null,
    imagePreview: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages when component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMessage(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          }),
        });

        if (response.ok) {
          await fetchMessages(); // Refresh messages
          setNewMessage({
            name: '',
            message: '',
            image: null,
            imagePreview: null,
          });
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error posting message:', error);
      }
    }
  };

  const handleLike = async (messageId) => {
    try {
      await fetch(`/api/messages/${messageId}/like`, {
        method: 'PUT',
      });
      await fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Message Wall</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          <Plus size={20} />
          Add a message
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            {/* Modal content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">Add a Message</h2>

              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={newMessage.name}
                  onChange={(e) => setNewMessage(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Your Message</label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage(prev => ({...prev, message: e.target.value}))}
                  className="w-full p-2 border rounded min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Add Image (optional)</label>
                <div className="mt-1 flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded cursor-pointer hover:bg-gray-100">
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
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Post Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Messages Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition duration-200">
            {msg.imagePreview && (
              <div className="mb-4">
                <img
                  src={msg.imagePreview}
                  alt="Message attachment"
                  className="rounded-lg max-h-[300px] w-full object-cover"
                />
              </div>
            )}
            <p className="text-gray-700 mb-3">{msg.message}</p>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <p className="font-medium text-gray-600">- {msg.name}</p>
                <p className="text-gray-400">{msg.createdAt}</p>
              </div>
              <button
                onClick={() => handleLike(msg.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition duration-200"
              >
                <Heart
                  size={16}
                  fill={msg.likes > 0 ? "currentColor" : "none"}
                />
                <span>{msg.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageWall;