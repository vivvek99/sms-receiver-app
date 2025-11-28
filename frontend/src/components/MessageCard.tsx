'use client';

import { Message } from '@/types';
import { formatPhoneNumber, formatRelativeTime } from '@/lib/utils';

interface MessageCardProps {
  message: Message;
  isNew?: boolean;
}

export function MessageCard({ message, isNew = false }: MessageCardProps) {
  return (
    <div
      className={`p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ${
        isNew ? 'animate-slide-up ring-2 ring-primary-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              From: {formatPhoneNumber(message.from)}
            </span>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap break-words">
            {message.body}
          </p>
        </div>
        <time
          className="text-xs text-gray-500 whitespace-nowrap"
          dateTime={message.receivedAt}
          title={new Date(message.receivedAt).toLocaleString()}
        >
          {formatRelativeTime(message.receivedAt)}
        </time>
      </div>
    </div>
  );
}
