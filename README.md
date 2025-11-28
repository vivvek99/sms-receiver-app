# SMS Receiver App

A production-ready SMS receiving web application similar to receive-smss.com, featuring real-time message display, Twilio integration, and modern cloud deployment.

## Features

- 📱 **Real-time SMS Reception** - Receive and display SMS messages instantly via WebSocket
- 🌐 **Modern Frontend** - Next.js 14 with TailwindCSS for a responsive, beautiful UI
- ⚡ **Robust Backend** - Express.js with TypeScript for type-safe API development
- 🗄️ **PostgreSQL Database** - Prisma ORM for type-safe database operations
- 📞 **Twilio Integration** - Webhook integration for SMS reception
- 🐳 **Docker Support** - Full Docker Compose setup for local development
- ☁️ **Azure Deployment** - Ready for Azure App Service deployment
- 🍎 **M4 Mac Optimized** - ARM64 Docker builds for Apple Silicon

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, React 18, TailwindCSS, Socket.IO Client |
| Backend | Express.js, TypeScript, Socket.IO, Prisma |
| Database | PostgreSQL 16 |
| SMS Provider | Twilio |
| Container | Docker, Docker Compose |
| Cloud | Azure App Service |

## Project Structure

```
sms-receiver-app/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── types/           # TypeScript types
│   ├── Dockerfile           # Production Dockerfile
│   └── Dockerfile.dev       # Development Dockerfile
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── index.ts         # Entry point
│   ├── prisma/              # Prisma schema and migrations
│   ├── Dockerfile           # Production Dockerfile
│   └── Dockerfile.dev       # Development Dockerfile
├── docs/                     # Documentation
│   └── API.md               # API documentation
├── .azure/                   # Azure deployment scripts
├── .github/workflows/        # GitHub Actions CI/CD
├── docker-compose.yml        # Production Docker Compose
└── docker-compose.dev.yml    # Development Docker Compose (M4 Mac optimized)
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 16 (or use Docker)
- Twilio account (for SMS reception)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sms-receiver-app.git
   cd sms-receiver-app
   ```

2. **Start with Docker Compose** (Recommended)
   ```bash
   # For Apple Silicon (M4 Mac)
   docker-compose -f docker-compose.dev.yml up -d

   # For x86/amd64
   docker-compose up -d
   ```

3. **Or run without Docker**

   Backend:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/api/health

### Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

### Adding Phone Numbers

Use the API to add phone numbers:

```bash
curl -X POST http://localhost:3001/api/phones \
  -H "Content-Type: application/json" \
  -d '{
    "number": "+1234567890",
    "country": "United States",
    "countryCode": "US"
  }'
```

## Twilio Configuration

1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token
3. Purchase a phone number or use a free trial number
4. Configure the webhook URL in Twilio console:
   - Webhook URL: `https://your-domain.com/api/webhook/twilio`
   - Method: POST

### Environment Variables

Update your backend `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VALIDATE_WEBHOOK=true  # Enable in production
```

## Azure Deployment

### Using Azure CLI

```bash
# Login to Azure
az login

# Run the deployment script
chmod +x .azure/deploy.sh
.azure/deploy.sh
```

### Manual Deployment

1. Create Azure resources (Resource Group, App Service Plan, PostgreSQL)
2. Configure environment variables in Azure App Service
3. Deploy using GitHub Actions or Azure CLI

### GitHub Actions

The repository includes CI/CD workflows:

- **ci.yml** - Runs on every PR, performs linting, building, and testing
- **deploy.yml** - Deploys to Azure on push to main branch

Required secrets:
- `AZURE_BACKEND_PUBLISH_PROFILE`
- `AZURE_FRONTEND_PUBLISH_PROFILE`

## API Documentation

See [docs/API.md](docs/API.md) for complete API documentation.

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/phones` | GET | List all phone numbers |
| `/api/phones/:id` | GET | Get phone by ID |
| `/api/phones` | POST | Create phone number |
| `/api/phones/:id` | DELETE | Delete phone number |
| `/api/phones/:phoneId/messages` | GET | Get messages for phone |
| `/api/messages/:id` | GET | Get message by ID |
| `/api/webhook/twilio` | POST | Twilio webhook |

## Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## M4 Mac (Apple Silicon) Optimization

The project includes ARM64-optimized Docker configurations:

- `docker-compose.dev.yml` - Uses `platform: linux/arm64`
- `Dockerfile.dev` files - Built for ARM64 architecture
- Prisma schema includes `darwin-arm64` binary target

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues and questions, please open a GitHub issue.
