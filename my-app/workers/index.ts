import { handleChatRequest } from './chat-api';
import { Env } from './types';
import { ExecutionContext } from '@cloudflare/workers-types';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3003',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
  'Access-Control-Allow-Credentials': 'true',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Route requests
    if (url.pathname === '/api/chat') {
      const response = await handleChatRequest(request, env);
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...response.headers,
          ...corsHeaders,
        },
      });
    }

    // Handle static assets
    if (url.pathname.startsWith('/assets/')) {
      const asset = await env.R2.get(url.pathname.slice(1));
      if (asset) {
        return new Response(asset.body, {
          headers: {
            'Content-Type': asset.httpMetadata?.contentType || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000',
            ...corsHeaders,
          },
        });
      }
    }

    // Handle database operations
    if (url.pathname.startsWith('/api/chats')) {
      const userId = request.headers.get('X-User-ID');
      if (!userId) {
        return new Response('Unauthorized', { 
          status: 401,
          headers: corsHeaders,
        });
      }

      switch (request.method) {
        case 'GET':
          const chats = await env.DB.prepare(
            'SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC'
          ).bind(userId).all();
          return new Response(JSON.stringify(chats), {
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });

        case 'POST':
          const { title } = await request.json();
          const result = await env.DB.prepare(
            'INSERT INTO chats (user_id, title, created_at, updated_at) VALUES (?, ?, datetime(), datetime()) RETURNING *'
          ).bind(userId, title).first();
          return new Response(JSON.stringify(result), {
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });

        default:
          return new Response('Method not allowed', { 
            status: 405,
            headers: corsHeaders,
          });
      }
    }

    // Handle messages
    if (url.pathname.startsWith('/api/chats/') && url.pathname.includes('/messages')) {
      const chatId = url.pathname.split('/')[2];
      const userId = request.headers.get('X-User-ID');
      if (!userId) {
        return new Response('Unauthorized', { 
          status: 401,
          headers: corsHeaders,
        });
      }

      switch (request.method) {
        case 'GET':
          const messages = await env.DB.prepare(
            'SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC'
          ).bind(chatId).all();
          return new Response(JSON.stringify(messages), {
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });

        case 'POST':
          const { content, role } = await request.json();
          const result = await env.DB.prepare(
            'INSERT INTO messages (chat_id, user_id, content, role, timestamp) VALUES (?, ?, ?, ?, datetime()) RETURNING *'
          ).bind(chatId, userId, content, role).first();
          return new Response(JSON.stringify(result), {
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });

        default:
          return new Response('Method not allowed', { 
            status: 405,
            headers: corsHeaders,
          });
      }
    }

    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders,
    });
  },
}; 