'use client';

import { PhoneNumber } from '@/types';
import { formatPhoneNumber, getCountryFlag } from '@/lib/utils';

interface PhoneCardProps {
  phone: PhoneNumber;
  isSelected: boolean;
  onClick: () => void;
  messageCount?: number;
}

export function PhoneCard({ phone, isSelected, onClick, messageCount = 0 }: PhoneCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-primary-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={phone.country}>
            {getCountryFlag(phone.countryCode)}
          </span>
          <div>
            <p className="font-semibold text-gray-900">
              {formatPhoneNumber(phone.number)}
            </p>
            <p className="text-sm text-gray-500">{phone.country}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`w-3 h-3 rounded-full ${
              phone.isActive ? 'bg-green-500' : 'bg-gray-300'
            }`}
            title={phone.isActive ? 'Active' : 'Inactive'}
          />
          {messageCount > 0 && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {messageCount} messages
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
