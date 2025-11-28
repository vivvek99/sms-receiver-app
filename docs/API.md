# SMS Receiver API Documentation

## Overview

The SMS Receiver API provides endpoints for managing phone numbers and SMS messages. It integrates with Twilio for receiving SMS messages and uses WebSocket for real-time message updates.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://your-domain.com`

## Authentication

Currently, the API is open for development purposes. For production, implement authentication using JWT or API keys.

## Endpoints

### Health Check

#### GET /api/health

Returns the health status of the API.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Phone Numbers

#### GET /api/phones

Get all active phone numbers.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "number": "+1234567890",
      "country": "United States",
      "countryCode": "US",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/phones/:id

Get a specific phone number by ID.

**Parameters:**
- `id` (path) - The phone number UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "number": "+1234567890",
    "country": "United States",
    "countryCode": "US",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `404` - Phone number not found

#### POST /api/phones

Create a new phone number.

**Request Body:**
```json
{
  "number": "+1234567890",
  "country": "United States",
  "countryCode": "US"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "number": "+1234567890",
    "country": "United States",
    "countryCode": "US",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Missing required fields

#### DELETE /api/phones/:id

Delete a phone number.

**Parameters:**
- `id` (path) - The phone number UUID

**Response:**
```json
{
  "success": true,
  "message": "Phone number deleted successfully"
}
```

**Errors:**
- `404` - Phone number not found

---

### Messages

#### GET /api/phones/:phoneId/messages

Get messages for a specific phone number with pagination.

**Parameters:**
- `phoneId` (path) - The phone number UUID
- `page` (query, optional) - Page number (default: 1)
- `limit` (query, optional) - Items per page (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "from": "+1987654321",
        "to": "+1234567890",
        "body": "Hello, this is a test message",
        "twilioSid": "SM...",
        "receivedAt": "2024-01-01T00:00:00.000Z",
        "phoneNumberId": "uuid"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

#### GET /api/messages/:id

Get a specific message by ID.

**Parameters:**
- `id` (path) - The message UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "from": "+1987654321",
    "to": "+1234567890",
    "body": "Hello, this is a test message",
    "twilioSid": "SM...",
    "receivedAt": "2024-01-01T00:00:00.000Z",
    "phoneNumberId": "uuid"
  }
}
```

**Errors:**
- `404` - Message not found

---

### Twilio Webhook

#### POST /api/webhook/twilio

Webhook endpoint for receiving SMS messages from Twilio.

**Headers:**
- `x-twilio-signature` - Twilio request signature (validated in production)

**Request Body (form-urlencoded):**
- `From` - Sender phone number
- `To` - Recipient phone number
- `Body` - Message content
- `MessageSid` - Twilio message SID

**Response:**
```xml
<Response></Response>
```

---

## WebSocket

### Connection

Connect to the WebSocket server using Socket.IO:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
});
```

### Events

#### subscribe

Subscribe to messages for a specific phone number.

```javascript
socket.emit('subscribe', { phoneNumberId: 'uuid' });
```

#### unsubscribe

Unsubscribe from messages for a specific phone number.

```javascript
socket.emit('unsubscribe', { phoneNumberId: 'uuid' });
```

#### new_message

Emitted when a new SMS message is received.

```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

The API implements rate limiting:
- Window: 15 minutes
- Maximum requests: 100 per IP

---

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection string | - |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |
| TWILIO_ACCOUNT_SID | Twilio Account SID | - |
| TWILIO_AUTH_TOKEN | Twilio Auth Token | - |
| TWILIO_VALIDATE_WEBHOOK | Validate Twilio signatures | false |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:3001 |
| NEXT_PUBLIC_WS_URL | WebSocket URL | http://localhost:3001 |
