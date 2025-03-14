# Supabase Integration for Kerdos Chat App

This document provides instructions on how to set up and configure Supabase for user management and authentication in the Kerdos Chat App.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Kerdos Chat App codebase

## Setup Steps

### 1. Create a Supabase Project

1. Log in to your Supabase account
2. Create a new project with a name of your choice
3. Note down the project URL and anon key (found in Project Settings > API)

### 2. Configure Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from your Supabase project.

### 3. Set Up Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql` from this repository
3. Run the SQL script to create the necessary tables and policies

### 4. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure the following settings:
   - Site URL: Set to your application's URL (e.g., `http://localhost:5173` for local development)
   - Redirect URLs: Add your application's URL followed by `/auth/callback` (e.g., `http://localhost:5173/auth/callback`)
   - Enable Email/Password sign-in method

### 5. Set Up Row Level Security (RLS)

The SQL script in step 3 already sets up RLS policies, but verify that they are correctly applied:

1. Go to Database > Tables in your Supabase dashboard
2. For each table (profiles, subscriptions, chats, messages, usage), check that RLS is enabled
3. Verify that the policies are correctly set up for each table

## Using Supabase in the Application

The application uses the following Supabase services:

1. **Authentication**: Sign up, sign in, and sign out functionality
2. **User Profiles**: Store and retrieve user profile information
3. **Subscriptions**: Manage user subscription tiers and message limits
4. **Chats and Messages**: Store and retrieve chat conversations
5. **Usage Tracking**: Track user actions for analytics

## Deployment

When deploying to production:

1. Update the environment variables in your hosting platform (e.g., Netlify, Vercel)
2. Update the Site URL and Redirect URLs in Supabase Authentication settings to match your production URL
3. Consider setting up additional security measures like OAuth providers

## Troubleshooting

- **Authentication Issues**: Check that your environment variables are correctly set and that the authentication settings in Supabase are properly configured.
- **Database Access Issues**: Verify that RLS policies are correctly set up and that the user has the necessary permissions.
- **API Errors**: Check the browser console for error messages and verify that the Supabase client is correctly initialized.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 