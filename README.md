# MathX Frontend

This is the frontend application for MathX, a math animation generator built with React, Vite, and Supabase.

## Overview

This frontend application connects to a backend deployed on Google Cloud Run and uses Google Cloud Storage for storing animation videos and code files.

## Environment Setup

The application requires the following environment variables:

```
VITE_BACKEND_URL=https://manim-ai-backend-943004966625.asia-south1.run.app
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment on Vercel

This repository is optimized for deployment on Vercel. The backend dependencies have been removed to ensure a smooth deployment process.

1. Connect this repository to Vercel
2. Set the environment variables in the Vercel dashboard
3. Deploy!

## Features

- User authentication via Supabase
- Animation generation through the backend API
- Animation history tracking and display
- Responsive design with Tailwind CSS
