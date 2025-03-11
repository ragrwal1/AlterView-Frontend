This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

This project is configured for easy deployment on Vercel. Follow these steps:

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one already.

2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Set up your environment variables in the Vercel dashboard:
   - `VITE_VAPI_WEB_TOKEN`: Your VAPI web token
   - `NEXT_PUBLIC_SERVER_URL`: Your server URL

4. Deploy using one of these methods:

   **Option 1: Using Vercel CLI**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy
   vercel
   ```

   **Option 2: Using GitHub Integration**
   1. Push your code to a GitHub repository
   2. Import the project in the Vercel dashboard
   3. Configure your environment variables
   4. Deploy

5. Your app will be deployed to a URL like `your-project.vercel.app`

For more customization options, refer to the [Vercel documentation](https://vercel.com/docs).
