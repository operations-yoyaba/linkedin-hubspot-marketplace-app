const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// OAuth initiation endpoint - redirects to main backend
app.get('/oauth/hubspot/start', (req, res) => {
  const { portalId, state } = req.query;
  
  if (!portalId) {
    return res.status(400).json({ error: 'Missing portalId parameter' });
  }

  // Redirect to main backend OAuth flow
  const redirectUrl = `https://blihu.yoyaba.com/oauth/hubspot/start?portalId=${portalId}&state=${state || ''}`;
  
  console.log(`OAuth initiation for portal ${portalId}, redirecting to: ${redirectUrl}`);
  
  res.redirect(redirectUrl);
});

// OAuth callback endpoint - redirects to main backend
app.get('/oauth/hubspot/callback', (req, res) => {
  const { code, state, portalId } = req.query;
  
  if (!code || !portalId) {
    return res.status(400).json({ error: 'Missing required OAuth parameters' });
  }

  // Redirect to main backend OAuth callback
  const redirectUrl = `https://blihu.yoyaba.com/oauth/hubspot/callback?code=${code}&state=${state || ''}&portalId=${portalId}`;
  
  console.log(`OAuth callback for portal ${portalId}, redirecting to: ${redirectUrl}`);
  
  res.redirect(redirectUrl);
});

// Webhook forwarding endpoints
app.post('/webhooks/hubspot/install', async (req, res) => {
  try {
    const { portalId, subscriptionType, appId } = req.body;
    
    console.log(`App install webhook received for portal ${portalId}`);
    
    // Forward webhook to main backend
    const response = await fetch('https://blihu.yoyaba.com/webhooks/hubspot/install', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-From': 'hubspot-marketplace-app'
      },
      body: JSON.stringify(req.body)
    });
    
    if (response.ok) {
      console.log(`Webhook forwarded successfully to main backend`);
      res.status(200).json({ status: 'forwarded' });
    } else {
      console.error(`Failed to forward webhook: ${response.status}`);
      res.status(500).json({ error: 'Failed to forward webhook' });
    }
  } catch (error) {
    console.error('Error forwarding webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/webhooks/hubspot/uninstall', async (req, res) => {
  try {
    const { portalId, subscriptionType, appId } = req.body;
    
    console.log(`App uninstall webhook received for portal ${portalId}`);
    
    // Forward webhook to main backend
    const response = await fetch('https://blihu.yoyaba.com/webhooks/hubspot/uninstall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-From': 'hubspot-marketplace-app'
      },
      body: JSON.stringify(req.body)
    });
    
    if (response.ok) {
      console.log(`Webhook forwarded successfully to main backend`);
      res.status(200).json({ status: 'forwarded' });
    } else {
      console.error(`Failed to forward webhook: ${response.status}`);
      res.status(500).json({ error: 'Failed to forward webhook' });
    }
  } catch (error) {
    console.error('Error forwarding webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/webhooks/hubspot/subscription', async (req, res) => {
  try {
    const { portalId, subscriptionType, appId } = req.body;
    
    console.log(`Subscription change webhook received for portal ${portalId}`);
    
    // Forward webhook to main backend
    const response = await fetch('https://blihu.yoyaba.com/webhooks/hubspot/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-From': 'hubspot-marketplace-app'
      },
      body: JSON.stringify(req.body)
    });
    
    if (response.ok) {
      console.log(`Webhook forwarded successfully to main backend`);
      res.status(200).json({ status: 'forwarded' });
    } else {
      console.error(`Failed to forward webhook: ${response.status}`);
      res.status(500).json({ error: 'Failed to forward webhook' });
    }
  } catch (error) {
    console.error('Error forwarding webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Card endpoints for HubSpot UI integration
app.get('/cards/sync-status', (req, res) => {
  const { portalId, userId } = req.query;
  
  // Redirect to main backend card endpoint
  const redirectUrl = `https://blihu.yoyaba.com/cards/sync-status?portalId=${portalId}&userId=${userId}`;
  
  res.redirect(redirectUrl);
});

app.get('/cards/company-mapping', (req, res) => {
  const { portalId, userId } = req.query;
  
  // Redirect to main backend card endpoint
  const redirectUrl = `https://blihu.yoyaba.com/cards/company-mapping?portalId=${portalId}&userId=${userId}`;
  
  res.redirect(redirectUrl);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`HubSpot Marketplace App server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Main backend: https://blihu.yoyaba.com`);
});

module.exports = app;
