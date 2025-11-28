import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMS Receiver - Receive SMS Online',
  description: 'Receive SMS messages online with temporary phone numbers. Free and instant.',
  keywords: ['sms', 'receive sms', 'temporary phone number', 'virtual number'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">SMS Receiver</h1>
              </div>
              <nav className="hidden sm:flex items-center gap-6">
                <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                  Home
                </a>
                <a href="/api-docs" className="text-gray-600 hover:text-gray-900 font-medium">
                  API Docs
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} SMS Receiver. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
