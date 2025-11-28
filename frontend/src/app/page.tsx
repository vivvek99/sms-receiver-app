'use client';

import { useState, useEffect } from 'react';
import { PhoneCard, MessageList, ConnectionStatus } from '@/components';
import { useMessages } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import { PhoneNumber, Message, ApiResponse, PaginatedResponse } from '@/types';

export default function HomePage() {
  const [phones, setPhones] = useState<PhoneNumber[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(null);
  const [isLoadingPhones, setIsLoadingPhones] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessageId, setNewMessageId] = useState<string | undefined>();

  const { messages, isConnected, setInitialMessages, addMessage } = useMessages(
    selectedPhone?.id
  );

  // Fetch phone numbers on mount
  useEffect(() => {
    async function fetchPhones() {
      try {
        const response = await api.get<ApiResponse<PhoneNumber[]>>('/api/phones');
        if (response.success && response.data) {
          setPhones(response.data);
          // Auto-select first phone if available
          if (response.data.length > 0) {
            setSelectedPhone(response.data[0]);
          }
        }
      } catch (err) {
        setError('Failed to load phone numbers');
        console.error('Error fetching phones:', err);
      } finally {
        setIsLoadingPhones(false);
      }
    }
    fetchPhones();
  }, []);

  // Fetch messages when phone is selected
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedPhone) return;

      setIsLoadingMessages(true);
      try {
        const response = await api.get<ApiResponse<PaginatedResponse<Message>>>(
          `/api/phones/${selectedPhone.id}/messages`
        );
        if (response.success && response.data) {
          setInitialMessages(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoadingMessages(false);
      }
    }
    fetchMessages();
  }, [selectedPhone, setInitialMessages]);

  // Handle new message notification
  useEffect(() => {
    if (messages.length > 0) {
      const newestMessage = messages[0];
      setNewMessageId(newestMessage.id);
      const timer = setTimeout(() => setNewMessageId(undefined), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  if (isLoadingPhones) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading phone numbers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Phone Numbers Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Phone Numbers</h2>
            <span className="text-sm text-gray-500">{phones.length} available</span>
          </div>
          <div className="space-y-3">
            {phones.map((phone) => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                isSelected={selectedPhone?.id === phone.id}
                onClick={() => setSelectedPhone(phone)}
              />
            ))}
          </div>
          {phones.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No phone numbers available</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              {selectedPhone && (
                <p className="text-sm text-gray-500 mt-1">
                  Showing messages for {selectedPhone.number}
                </p>
              )}
            </div>
            <ConnectionStatus isConnected={isConnected} />
          </div>
          {selectedPhone ? (
            <MessageList
              messages={messages}
              isLoading={isLoadingMessages}
              newMessageId={newMessageId}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Select a phone number to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
