# LinkedIn-HubSpot Sync - HubSpot Marketplace App

This repository contains the **HubSpot marketplace app configuration and integration layer** for the LinkedIn-HubSpot sync system. This app acts as a proxy between HubSpot and the main Python Flask backend, handling OAuth initiation and webhook forwarding.

## 🏗️ Architecture Overview

```
🔗 HubSpot Marketplace App (This Repository)
├── 📱 OAuth initiation and redirection
├── 📡 Webhook reception and forwarding
├── 🎨 HubSpot UI card integration
└── 🚀 HubSpot infrastructure deployment

🌐 Main Backend (linkedin-hubspot-sync)
├── 🐍 Python Flask backend with business logic
├── 🔐 OAuth token exchange and management
├── 🗄️ Database operations and data sync
└── 🚀 Google Cloud Run deployment
```

## 🎯 Purpose

This app serves as the **HubSpot marketplace integration layer** that:

1. **Initiates OAuth flows** and redirects users to the main backend
2. **Receives webhooks** from HubSpot and forwards them to the main backend
3. **Provides UI cards** for HubSpot interface integration
4. **Manages app lifecycle** (install, uninstall, subscription changes)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- HubSpot CLI (`@hubspot/cli`)
- Access to HubSpot developer account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkedin-hubspot-marketplace-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Install HubSpot CLI**
   ```bash
   npm install -g @hubspot/cli
   ```

5. **Authenticate with HubSpot**
   ```bash
   hs auth
   ```

### Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Watch for changes**
   ```bash
   npm run watch
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Deployment

1. **Deploy to HubSpot**
   ```bash
   npm run deploy
   ```

2. **Clean build artifacts**
   ```bash
   npm run clean
   ```

## 📁 Project Structure

```
linkedin-hubspot-marketplace-app/
├── src/
│   ├── index.js              # Main Express server
│   └── public-app.json       # HubSpot app manifest
├── hsproject.json            # HubSpot project configuration
├── package.json              # Node.js dependencies
├── env.example               # Environment variables template
└── README.md                 # This file
```

## 🔐 OAuth Flow

The app implements a **proxy OAuth pattern**:

1. **User installs app** from HubSpot marketplace
2. **HubSpot redirects** to `/oauth/hubspot/start` with `portalId`
3. **App redirects** to main backend: `https://linkedin-hubspot.yoyaba.com/oauth/hubspot/start`
4. **Main backend handles** LinkedIn OAuth and data setup
5. **User completes setup** and returns to HubSpot

## 📡 Webhook Handling

All webhooks are **forwarded to the main backend**:

- **App Install**: `POST /webhooks/hubspot/install`
- **App Uninstall**: `POST /webhooks/hubspot/uninstall`  
- **Subscription Change**: `POST /webhooks/hubspot/subscription`

## 🎨 HubSpot UI Integration

The app provides **UI cards** for HubSpot interface:

- **Sync Status Card**: View sync progress and recent activity
- **Company Mapping Card**: Manage LinkedIn to HubSpot company mappings

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `MAIN_BACKEND_URL` | Main backend URL | `https://linkedin-hubspot.yoyaba.com` |
| `HUBSPOT_CLIENT_ID` | HubSpot OAuth client ID | - |
| `HUBSPOT_CLIENT_SECRET` | HubSpot OAuth client secret | - |

### HubSpot App Configuration

The `src/public-app.json` file configures:

- **OAuth scopes** for data access
- **Webhook endpoints** for app lifecycle events
- **UI cards** for interface integration
- **App settings** for user configuration

## 🔧 Development

### Local Development

1. **Start local server**
   ```bash
   npm run dev
   ```

2. **Test endpoints**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Test OAuth flow**
   ```bash
   curl "http://localhost:3000/oauth/hubspot/start?portalId=12345"
   ```

### Testing

1. **Run tests**
   ```bash
   npm test
   ```

2. **Lint code**
   ```bash
   npm run lint
   ```

## 🚀 Deployment

### HubSpot Deployment

1. **Build project**
   ```bash
   npm run build
   ```

2. **Deploy to HubSpot**
   ```bash
   npm run deploy
   ```

3. **Verify deployment**
   - Check HubSpot developer portal
   - Test app installation
   - Verify webhook delivery

### Production Considerations

- **Environment variables** must be set in HubSpot
- **Main backend** must be accessible from HubSpot
- **SSL certificates** are handled by HubSpot
- **Scaling** is automatic via HubSpot infrastructure

## 🔍 Monitoring & Debugging

### Health Checks

- **Health endpoint**: `GET /health`
- **Status monitoring**: Check HubSpot developer portal
- **Webhook logs**: Monitor HubSpot webhook delivery

### Common Issues

1. **OAuth redirects failing**
   - Verify main backend is accessible
   - Check environment variables
   - Validate HubSpot app configuration

2. **Webhooks not delivering**
   - Verify webhook endpoints are accessible
   - Check HubSpot webhook configuration
   - Monitor main backend webhook handling

3. **App installation failing**
   - Check OAuth scopes in app manifest
   - Verify redirect URLs are correct
   - Test with HubSpot test account

## 📚 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/oauth/hubspot/start` | OAuth initiation |
| `GET` | `/oauth/hubspot/callback` | OAuth callback |
| `POST` | `/webhooks/hubspot/install` | App install webhook |
| `POST` | `/webhooks/hubspot/uninstall` | App uninstall webhook |
| `POST` | `/webhooks/hubspot/subscription` | Subscription change webhook |
| `GET` | `/cards/sync-status` | Sync status card |
| `GET` | `/cards/company-mapping` | Company mapping card |

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and HubSpot developer docs
- **Issues**: Create GitHub issue for bugs or feature requests
- **HubSpot Support**: Use HubSpot developer community for platform-specific questions

## 🔗 Related Repositories

- **Main Backend**: [linkedin-hubspot-sync](https://github.com/your-org/linkedin-hubspot-sync)
- **Documentation**: [Project Wiki](https://github.com/your-org/linkedin-hubspot-marketplace-app/wiki)

---

**This app is designed to work seamlessly with the main LinkedIn-HubSpot sync backend, providing a clean separation between HubSpot marketplace integration and core business logic.**
