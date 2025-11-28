export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">API Documentation</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Base URL</h2>
        <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
          {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
        </code>
      </div>

      <div className="space-y-6">
        {/* Phone Numbers Endpoints */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Phone Numbers</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">GET</span>
                <code className="text-sm">/api/phones</code>
              </div>
              <p className="text-gray-600 text-sm mb-2">Get all available phone numbers</p>
              <details className="text-sm">
                <summary className="cursor-pointer text-primary-600 hover:text-primary-700">Response Example</summary>
                <pre className="mt-2 bg-gray-100 p-3 rounded-lg overflow-x-auto">
{`{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "number": "+1234567890",
      "country": "United States",
      "countryCode": "US",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}`}
                </pre>
              </details>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">GET</span>
                <code className="text-sm">/api/phones/:id</code>
              </div>
              <p className="text-gray-600 text-sm">Get a specific phone number by ID</p>
            </div>
          </div>
        </div>

        {/* Messages Endpoints */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">GET</span>
                <code className="text-sm">/api/phones/:phoneId/messages</code>
              </div>
              <p className="text-gray-600 text-sm mb-2">Get messages for a phone number</p>
              <div className="text-sm text-gray-500">
                <strong>Query Parameters:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li><code>page</code> - Page number (default: 1)</li>
                  <li><code>limit</code> - Items per page (default: 50)</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">GET</span>
                <code className="text-sm">/api/messages/:id</code>
              </div>
              <p className="text-gray-600 text-sm">Get a specific message by ID</p>
            </div>
          </div>
        </div>

        {/* Webhook Endpoint */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Twilio Webhook</h2>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">POST</span>
              <code className="text-sm">/api/webhook/twilio</code>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Twilio webhook endpoint for receiving SMS messages
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Note:</strong> This endpoint should be configured in your Twilio console as the webhook URL for incoming SMS messages.
            </div>
          </div>
        </div>

        {/* WebSocket */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">WebSocket Events</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Connection</h3>
              <p className="text-gray-600 text-sm mb-2">
                Connect to the WebSocket server at the same base URL using Socket.IO client.
              </p>
              <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
{`import { io } from 'socket.io-client';

const socket = io('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}');

socket.on('connect', () => {
  console.log('Connected');
});`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Events</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><code className="bg-gray-100 px-2 py-1 rounded">subscribe</code> - Subscribe to a phone number&apos;s messages</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">new_message</code> - Emitted when a new SMS is received</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">error</code> - Emitted on errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
