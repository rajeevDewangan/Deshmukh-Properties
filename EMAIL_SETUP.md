# Email Setup Guide for Deshmukh Properties

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key
1. In Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name it "Deshmukh Properties"
4. Copy the API key (starts with `re_`)

### Step 3: Add Domain (Optional but Recommended)
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `deshmukhproperties.com`)
3. Follow DNS setup instructions
4. This allows emails to come from `noreply@deshmukhproperties.com`

### Step 4: Environment Variables
Create a `.env.local` file in your project root:

```env
RESEND_API_KEY=re_your_api_key_here
```

### Step 5: Test
1. Restart your development server: `npm run dev`
2. Fill out the contact form
3. Click "Send Message"
4. Check your email inbox!

## 📧 What Happens Now

✅ **Emails are sent automatically** - no external email clients needed
✅ **Professional HTML formatting** with your branding
✅ **Reliable delivery** through Resend's infrastructure
✅ **Real-time feedback** with success/error messages

## 🎯 Features

- **From:** Deshmukh Properties <noreply@deshmukhproperties.com>
- **To:** rajeevdewangan10@gmail.com
- **Subject:** Contact from [Name] - Deshmukh Properties
- **Content:** Beautiful HTML email with contact details and message
- **Delivery:** Instant, reliable delivery to your inbox

## 💰 Pricing

- **Free tier:** 3,000 emails/month
- **Paid plans:** Start at $20/month for 50,000 emails
- **Perfect for:** Small to medium businesses

## 🔧 Alternative: Gmail SMTP

If you prefer to use Gmail directly:

1. Enable 2-Factor Authentication on your Gmail
2. Generate App Password
3. Create `.env.local`:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   ```
4. I can update the code to use Gmail SMTP instead

## 🆘 Need Help?

The current setup uses Resend which is the most reliable option. Once you add the API key, emails will be sent automatically without any external email clients!
