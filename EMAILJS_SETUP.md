# EmailJS Setup Guide

This guide explains how to set up EmailJS for the contact form on the Mayday website.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for an account
2. After signing up, you'll be directed to the dashboard

## Step 2: Create an Email Service

1. In the EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Name your service (e.g., "Mayday Contact Form")

## Step 3: Create an Email Template

1. Go to "Email Templates" in the dashboard
2. Click "Create New Template"
3. Design your email template with the following variables:
   - `{{from_name}}` - The name of the person submitting the form
   - `{{from_email}}` - The email of the person submitting the form
   - `{{phone}}` - The phone number from the form
   - `{{position}}` - The professional position from the form
   - `{{message}}` - The message from the form
4. Set the "To Email" field to: ventas@mayday.global
5. Save your template

## Step 4: Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Replace the placeholder values with your actual EmailJS credentials:
- `your_service_id`: Found in the "Email Services" section
- `your_template_id`: Found in the "Email Templates" section
- `your_public_key`: Found in the "Account" section under "API Keys"

## Step 5: Initialize EmailJS (Optional)

For better performance, you can initialize EmailJS when your app starts. Add the following code to your `_app.tsx` or similar entry file:

```typescript
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../emailjs';

// Inside your App component
useEffect(() => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}, []);
```

## Testing

After setting up, test your contact form to ensure emails are being sent correctly. You should receive test submissions at ventas@mayday.global.
