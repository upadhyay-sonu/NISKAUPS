✦ Deployment Guide - Niskaups

This guide covers deploying Niskaups to production using Vercel (frontend) and Render (backend).

---

## 🌐 Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free)
- GitHub repository

### Step 1: Push to GitHub

```bash
cd Niskaups
git init
git add .
git commit -m "Initial commit: Niskaups bookstore"
git branch -M main
git remote add origin https://github.com/yourusername/niskaups.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `client` folder as root
5. Add Environment Variables:
   ```
   VITE_API_URL=https://niskaups-api.onrender.com/api
   ```
6. Click Deploy

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records

**Vercel URL:** `https://niskaups.vercel.app`

---

## 🔧 Backend Deployment (Render)

### Prerequisites
- Render account (free)
- GitHub repository with server folder

### Step 1: Prepare Backend

Ensure `server/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: niskaups-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`

### Step 3: Add Environment Variables

In Render dashboard, go to Environment:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://upadhyayasonu41_db_user:a2aDnk6FnlCjaemF@cluster0.3wmmili.mongodb.net/?appName=Cluster0
JWT_SECRET=your_production_secret_min_32_chars
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_live_your_real_key
STRIPE_PUBLIC_KEY=pk_live_your_real_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@niskaups.com
CLIENT_URL=https://niskaups.vercel.app
```

### Step 4: Update Frontend API URL

In Vercel environment variables:
```
VITE_API_URL=https://niskaups-api.onrender.com/api
```

**Render URL:** `https://niskaups-api.onrender.com`

---

## 📦 MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [mongod atlas.com](https://www.mongodb.com/cloud/atlas)
2. Create account and log in
3. Create new project: "Niskaups"
4. Build a cluster:
   - Choose free tier
   - Select region (e.g., US East)
   - Create cluster

### Step 2: Configure Security

1. Create Database User:
   - Username: `niskaups_user`
   - Password: (use auto-generated, save it)
   - Add user

2. Whitelist IPs:
   - Add `0.0.0.0/0` (allow all, for development)
   - Or specific IPs for production

3. Network Access → Add IP Address

### Step 3: Get Connection String

1. Click "Connect"
2. Choose "Drivers"
3. Copy connection string
4. Replace `<username>` and `<password>`
5. Use in `MONGODB_URI`

---

## 💳 Stripe Configuration

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up and verify email
3. Complete onboarding

### Step 2: Get API Keys

1. Go to Dashboard → Developers → API Keys
2. Copy:
   - **Secret Key** → `STRIPE_SECRET_KEY`
   - **Publishable Key** → `STRIPE_PUBLIC_KEY`

### Step 3: Add Webhook

1. Go to Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://niskaups-api.onrender.com/webhooks/stripe`
4. Select events: `charge.succeeded`, `charge.failed`
5. Save and copy signing secret

### Step 4: Implement Payment Handler

Update `server/controllers/paymentController.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { user: req.user.id }
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

---

## 📸 Cloudinary Configuration

### Step 1: Create Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up
3. Go to Dashboard
4. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 2: Add to Environment

Add to backend `.env`:
```
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Implement Upload Handler

Update `server/controllers/uploadController.js`:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

---

## 📧 Email Configuration (Nodemailer)

### Step 1: Enable Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (enable if not)
3. App Passwords
4. Select Mail & Windows
5. Copy password

### Step 2: Add to Environment

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@niskaups.com
```

### Step 3: Implement Email Handler

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendOrderConfirmation = async (order, user) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: `Order Confirmation #${order._id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order Total: $${order.totalPrice}</p>
      <p>Status: ${order.orderStatus}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
```

---

## 🔒 Security Checklist

### Before Production:
- [ ] Change `JWT_SECRET` to 32+ character random string
- [ ] Update MongoDB password in connection string
- [ ] Enable HTTPS on all domains
- [ ] Set `NODE_ENV=production`
- [ ] Disable debug logging
- [ ] Set secure cookie flags
- [ ] Configure CORS for specific origins
- [ ] Add rate limiting
- [ ] Enable security headers (Helmet)
- [ ] Use strong passwords
- [ ] Enable 2FA on all accounts
- [ ] Regular backups of database
- [ ] Monitor logs and errors
- [ ] Hide sensitive error messages

### Environment Variables to Secure:
```
◆ JWT_SECRET - 32+ random characters
◆ STRIPE_SECRET_KEY - Production key
◆ CLOUDINARY_API_SECRET - Secret only
◆ MONGODB_URI - Whitelisted IP only
◆ SMTP_PASS - App-specific password
```

---

## 📊 Monitoring & Maintenance

### Vercel
- Monitor build logs
- Check performance metrics
- Set up error tracking

### Render
- View logs in dashboard
- Monitor CPU/Memory usage
- Set up alerts

### MongoDB
- Monitor connections
- Check backup status
- Review access logs

---

✦ Production Deployment Steps

### Week 1: Setup
◆ Create all cloud accounts (MongoDB, Stripe, Cloudinary, Gmail)
◆ Configure environments
◆ Deploy to staging first
4. ✅ Test all features

### Week 2: Testing
1. ✅ Test authentication flow
2. ✅ Test payments (Stripe test mode)
3. ✅ Test email notifications
4. ✅ Test image uploads
5. ✅ Load testing
6. ✅ Security audit

### Week 3: Launch
1. ✅ Verify all services
2. ✅ Enable monitoring
3. ✅ Set up backups
4. ✅ Enable analytics
5. ✅ Launch to production
6. ✅ Monitor for errors

---

## 🆘 Common Deployment Issues

### "MongoDB connection error"
- Check IP whitelist in Atlas
- Verify connection string
- Ensure firewall allows outbound

### "CORS errors"
- Add CLIENT_URL to backend env
- Check CORS configuration
- Verify API URL in frontend

### "Payment not processing"
- Verify Stripe keys
- Check webhook configuration
- Test with Stripe test cards

### "Images not uploading"
- Verify Cloudinary credentials
- Check file size limits
- Ensure multer is configured

---

## 📈 Post-Launch

### Monitor Metrics
- Page load time
- Error rates
- User engagement
- Conversion rate

### Regular Maintenance
- Weekly backups
- Monthly security patches
- Performance optimization
- Customer support

---

## 💬 Support

For issues during deployment:
1. Check logs on Vercel/Render
2. Review environment variables
3. Test locally first
4. Contact provider support

---

**Congratulations! Your Niskaups bookstore is now live! 🎉**
