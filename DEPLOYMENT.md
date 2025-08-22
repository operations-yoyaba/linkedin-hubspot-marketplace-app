# Deployment Guide - HubSpot Marketplace App

This guide covers deploying the LinkedIn-HubSpot Sync marketplace app to HubSpot and setting up the production environment.

## 🚀 Prerequisites

### Required Accounts & Access
- **HubSpot Developer Account**: Access to HubSpot developer portal
- **HubSpot CLI**: Installed and authenticated (`@hubspot/cli`)
- **Main Backend**: Deployed and accessible at `https://linkedin-hubspot.yoyaba.com`
- **Domain**: DNS configured for `linkedin-hubspot.yoyaba.com`

### Development Environment
- Node.js 18+ installed
- All dependencies installed (`npm install`)
- Environment variables configured (`.env` file)

## 🔧 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Locally
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test OAuth redirect
curl "http://localhost:3000/oauth/hubspot/start?portalId=12345"
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test OAuth Flow
1. **Start development server**: `npm run dev`
2. **Test OAuth initiation**: Visit `/oauth/hubspot/start?portalId=12345`
3. **Verify redirect**: Should redirect to main backend
4. **Test webhook forwarding**: Use Postman or similar to test webhook endpoints

## 🚀 HubSpot Deployment

### 1. Authenticate with HubSpot
```bash
hs auth
# Follow prompts to authenticate with your HubSpot account
```

### 2. Build Project
```bash
npm run build
```

### 3. Deploy to HubSpot
```bash
npm run deploy
```

### 4. Verify Deployment
- Check HubSpot developer portal
- Verify app appears in your account
- Test app installation process

## 🌐 Production Configuration

### Environment Variables
Set these in your HubSpot app configuration:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production environment |
| `MAIN_BACKEND_URL` | `https://linkedin-hubspot.yoyaba.com` | Main backend URL |
| `HUBSPOT_CLIENT_ID` | Your HubSpot client ID | OAuth client ID |
| `HUBSPOT_CLIENT_SECRET` | Your HubSpot client secret | OAuth client secret |

### HubSpot App Configuration
Update `src/public-app.json` with production URLs:

```json
{
  "webhooks": [
    {
      "name": "app.install",
      "url": "https://linkedin-hubspot.yoyaba.com/webhooks/hubspot/install"
    }
  ],
  "urls": {
    "auth": "https://linkedin-hubspot.yoyaba.com/oauth/hubspot/start",
    "admin": "https://linkedin-hubspot.yoyaba.com/dashboard"
  }
}
```

## 🔐 OAuth Configuration

### 1. HubSpot OAuth Setup
1. **Create OAuth app** in HubSpot developer portal
2. **Set redirect URLs**:
   - `https://linkedin-hubspot.yoyaba.com/oauth/hubspot/start`
   - `https://linkedin-hubspot.yoyaba.com/oauth/hubspot/callback`
3. **Configure scopes** for required permissions
4. **Get client ID and secret**

### 2. LinkedIn OAuth Setup
1. **Create LinkedIn app** in LinkedIn developer portal
2. **Set redirect URLs**:
   - `https://linkedin-hubspot.yoyaba.com/oauth/linkedin/callback`
3. **Configure required permissions** for ad account access
4. **Get client ID and secret**

## 📡 Webhook Configuration

### 1. HubSpot Webhooks
Configure these webhook endpoints in HubSpot:

- **App Install**: `https://linkedin-hubspot.yoyaba.com/webhooks/hubspot/install`
- **App Uninstall**: `https://linkedin-hubspot.yoyaba.com/webhooks/hubspot/uninstall`
- **Subscription Change**: `https://linkedin-hubspot.yoyaba.com/webhooks/hubspot/subscription`

### 2. Webhook Security
- **Signature verification** is handled by main backend
- **Rate limiting** is implemented in the app
- **Error handling** includes retry logic and logging

## 🎨 UI Cards Configuration

### 1. Sync Status Card
- **Endpoint**: `https://linkedin-hubspot.yoyaba.com/cards/sync-status`
- **Purpose**: Display sync progress and recent activity
- **Integration**: Embedded in HubSpot interface

### 2. Company Mapping Card
- **Endpoint**: `https://linkedin-hubspot.yoyaba.com/cards/company-mapping`
- **Purpose**: Manage LinkedIn to HubSpot company mappings
- **Integration**: Embedded in HubSpot interface

## 🔍 Monitoring & Debugging

### 1. Health Checks
- **Endpoint**: `GET /health`
- **Purpose**: Monitor app health and status
- **Response**: JSON with status, timestamp, and version

### 2. Logging
- **Console logs**: OAuth redirects and webhook forwarding
- **Error logs**: Failed webhook forwarding and OAuth errors
- **Access logs**: All incoming requests and responses

### 3. HubSpot Developer Portal
- **App status**: Check app health and configuration
- **Webhook delivery**: Monitor webhook success/failure rates
- **Installation logs**: Track app installations and uninstallations

## 🚨 Troubleshooting

### Common Issues

#### 1. OAuth Redirects Failing
**Symptoms**: Users can't complete OAuth flow
**Causes**: 
- Main backend not accessible
- Incorrect redirect URLs
- Missing environment variables

**Solutions**:
- Verify main backend is running
- Check redirect URL configuration
- Validate environment variables

#### 2. Webhooks Not Delivering
**Symptoms**: HubSpot events not reaching main backend
**Causes**:
- Webhook endpoints not accessible
- Incorrect webhook configuration
- Network connectivity issues

**Solutions**:
- Test webhook endpoints manually
- Verify HubSpot webhook configuration
- Check network connectivity

#### 3. App Installation Failing
**Symptoms**: Users can't install app from marketplace
**Causes**:
- Missing OAuth scopes
- Incorrect app configuration
- HubSpot app review issues

**Solutions**:
- Verify OAuth scopes in app manifest
- Check app configuration
- Contact HubSpot support if needed

### Debug Commands
```bash
# Check app health
curl https://your-app-domain.com/health

# Test OAuth redirect
curl "https://your-app-domain.com/oauth/hubspot/start?portalId=12345"

# Test webhook endpoint
curl -X POST https://your-app-domain.com/webhooks/hubspot/install \
  -H "Content-Type: application/json" \
  -d '{"portalId":"12345","test":true}'
```

## 📊 Performance & Scaling

### 1. HubSpot Infrastructure
- **Automatic scaling**: Handled by HubSpot
- **Load balancing**: Built-in load balancing
- **CDN**: Global content delivery network

### 2. Rate Limiting
- **API rate limits**: 100 requests per 15 minutes per IP
- **Webhook rate limits**: No specific limits, but monitor usage
- **OAuth rate limits**: Follow HubSpot and LinkedIn guidelines

### 3. Monitoring
- **Response times**: Monitor endpoint response times
- **Error rates**: Track failed requests and webhooks
- **Usage metrics**: Monitor app installation and usage

## 🔄 Updates & Maintenance

### 1. Code Updates
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Test changes
npm test

# Deploy to HubSpot
npm run deploy
```

### 2. Configuration Updates
- **Environment variables**: Update in HubSpot app settings
- **App manifest**: Update `src/public-app.json` and redeploy
- **Webhook URLs**: Update if main backend URLs change

### 3. Monitoring Updates
- **Health checks**: Monitor app health regularly
- **Webhook delivery**: Check webhook success rates
- **User feedback**: Monitor app installation success rates

## 📚 Additional Resources

### Documentation
- [HubSpot Developer Documentation](https://developers.hubspot.com/)
- [HubSpot CLI Documentation](https://developers.hubspot.com/docs/tools/developer-tools)
- [Express.js Documentation](https://expressjs.com/)

### Support
- **HubSpot Developer Community**: For platform-specific questions
- **GitHub Issues**: For app-specific bugs and features
- **HubSpot Support**: For marketplace and app review issues

---

**This deployment guide covers the essential steps to get your HubSpot marketplace app running in production. Follow these steps carefully and test thoroughly before going live.**
