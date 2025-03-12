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
- OpenAI SDK for AI capabilities

## Environment Variables

This application uses environment variables to store sensitive information like API keys. For local development, create a `.env` file in the root directory with the following variables:

```
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_ORG_ID=your_openai_org_id_here
VITE_OPENAI_MODEL=gpt-3.5-turbo

# API Proxy Configuration
VITE_API_PROXY_URL=http://localhost:3001/api
```

## Deploying to Netlify

When deploying to Netlify, you need to set up environment variables in the Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following environment variables:
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key
   - `VITE_OPENAI_ORG_ID`: Your OpenAI Organization ID
   - `VITE_OPENAI_MODEL`: The OpenAI model to use (e.g., gpt-3.5-turbo)
   - `VITE_API_PROXY_URL`: URL to your API proxy (if applicable)

![Netlify Environment Variables](https://docs.netlify.com/images/configure-builds-environment-variables.png)

### Important Security Notes

- Never commit your `.env` file to version control
- Always use environment variables for sensitive information
- Consider using Netlify Functions or a separate backend for API calls to keep your API keys secure

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
