[![Netlify Status](https://api.netlify.com/api/v1/badges/a05de994-7536-4991-9e03-14fd940804ce/deploy-status)](https://app.netlify.com/sites/gleaming-jalebi-3466f6/deploys)

# Green AI Chat

A modern chat application built with React, TypeScript, and Vite.

## Features

- Real-time chat interface
- Authentication system
- Markdown support
- Syntax highlighting
- Dark mode support
- PDF export functionality

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- Framer Motion for animations
- Backend service for AI capabilities

## Backend Service

This application uses a backend service hosted on Render to handle AI interactions:

```
https://openai-chat-backend-gbuu.onrender.com
```

The backend service handles all API calls to OpenAI, which keeps your API keys secure by not exposing them in the client-side code.

## Environment Variables

This application uses environment variables for configuration. For local development, create a `.env` file in the root directory with the following variables:

```
# Application configuration
VITE_APP_NAME="Green AI Chat"
VITE_APP_VERSION="1.2.0"

# API configuration
VITE_API_URL="https://openai-chat-backend-gbuu.onrender.com"

# Feature flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false

# OpenAI Configuration
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

## Deploying to Netlify

When deploying to Netlify, you need to set up environment variables in the Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following environment variables:
   - `VITE_APP_NAME`: The name of your application
   - `VITE_APP_VERSION`: The version of your application
   - `VITE_API_URL`: The URL of the backend service
   - `VITE_OPENAI_MODEL`: The OpenAI model to use (e.g., gpt-3.5-turbo)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the `.env.example` template
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
