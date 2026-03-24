import OpenAI from 'openai';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages, gatewayUrl, token, agentId } = await req.json();

  const baseURL = gatewayUrl
    ? `${gatewayUrl.replace(/\/$/, '')}/v1`
    : `${process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789'}/v1`;

  const apiKey = token || process.env.OPENCLAW_TOKEN || 'no-token';

  const client = new OpenAI({ baseURL, apiKey });

  const model = agentId ? `openclaw:${agentId}` : 'openclaw';

  const stream = await client.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
