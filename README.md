# OpenClaw Chatbot

A Vercel-deployed chatbot that integrates with [OpenClaw](https://docs.openclaw.ai) — the self-hosted AI agent gateway.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakerdock%2Fopenclaw-chatbot&env=OPENCLAW_GATEWAY_URL,OPENCLAW_TOKEN&envDescription=OpenClaw%20gateway%20URL%20and%20auth%20token&project-name=openclaw-chatbot)

## Features

- Streaming chat UI with OpenClaw gateway integration
- Configurable gateway URL, auth token, and agent ID via settings panel
- Server-side defaults via environment variables, client-side overrides via localStorage
- Edge runtime for low-latency streaming
- Built with Next.js, TypeScript, and Tailwind CSS

## Setup

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCLAW_GATEWAY_URL` | OpenClaw gateway HTTP endpoint | `http://localhost:18789` |
| `OPENCLAW_TOKEN` | Auth token for the gateway | `no-token` |

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use the settings panel (gear icon) to configure your gateway connection.

### Deploy to Vercel

1. Click the **Deploy with Vercel** button above, or:
2. Connect the `makerdock/openclaw-chatbot` repo to a Vercel project
3. Set `OPENCLAW_GATEWAY_URL` and `OPENCLAW_TOKEN` environment variables
4. Deploy

> **Note:** For Vercel to reach a local OpenClaw gateway, expose it via Tailscale Serve, Cloudflare Tunnel, or bind to a public address.

## Architecture

- `app/api/chat/route.ts` — Edge API route that proxies chat completions to OpenClaw via the OpenAI-compatible API
- `app/page.tsx` — Chat UI with message history and streaming display
- `components/` — Settings panel for gateway configuration
