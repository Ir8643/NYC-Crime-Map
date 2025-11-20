# 🚀 Deployment Guide - Cloudflare Pages

This guide will help you deploy the NYC Real Data Dashboard to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- A GitHub/GitLab repository (or direct git access)
- Node.js 18+ installed locally (for testing builds)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to a git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click **Create application** → **Pages** → **Connect to Git**
4. Select your git provider and authorize Cloudflare
5. Select your repository

### 3. Configure Build Settings

In the build configuration:

- **Project name**: `nyc-dashboard` (or your preferred name)
- **Production branch**: `main` (or `master`)
- **Build command**: 
  ```bash
  cd frontend && npm install && npm run build
  ```
- **Build output directory**: 
  ```
  frontend/dist
  ```
- **Root directory**: Leave empty (uses repo root)

### 4. Set Environment Variables

In the Cloudflare Pages dashboard, go to **Settings** → **Environment variables**:

Add the following:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com/api` | Production |
| `NODE_VERSION` | `18` | Production |

**Note**: Replace `your-backend-url.com` with your actual backend API URL.

### 5. Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your application
3. Your site will be available at `https://your-project.pages.dev`

## Backend Deployment

The frontend requires a backend API. You have several options:

### Option 1: Cloudflare Workers

Deploy the backend as a Cloudflare Worker:

1. Install Wrangler CLI: `npm install -g wrangler`
2. Convert Express app to Workers format
3. Deploy: `wrangler publish`

### Option 2: Traditional Hosting

Deploy to services like:
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **Heroku**: `git push heroku main`
- **DigitalOcean App Platform**: Connect GitHub repo

### Option 3: Keep Local Development Backend

For development/testing, you can run the backend locally and update `VITE_API_URL` to point to your local server (not recommended for production).

## Custom Domain

1. In Cloudflare Pages, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions

## Continuous Deployment

Cloudflare Pages automatically deploys on:
- Push to production branch
- Pull requests (preview deployments)

You can configure this in **Settings** → **Builds & deployments**.

## Troubleshooting

### Build Fails

1. **Check build logs** in Cloudflare dashboard
2. **Verify Node version** (should be 18+)
3. **Check environment variables** are set correctly
4. **Test build locally**: `cd frontend && npm run build`

### API Not Working

1. **Verify `VITE_API_URL`** is set correctly
2. **Check CORS settings** on backend
3. **Verify backend is accessible** from the internet
4. **Check browser console** for errors

### White Screen

1. **Check browser console** for JavaScript errors
2. **Verify all assets are loading** (Network tab)
3. **Check build output** includes `index.html`
4. **Verify `_redirects` file** is in `public/` directory

## Environment-Specific Builds

You can set different environment variables for:
- **Production**: Live site
- **Preview**: Pull request previews
- **Branch**: Specific branch deployments

Configure these in **Settings** → **Environment variables**.

## Performance Optimization

Cloudflare Pages automatically provides:
- ✅ Global CDN
- ✅ HTTPS/SSL
- ✅ DDoS protection
- ✅ Analytics (with Pro plan)

For better performance:
- Enable **Auto Minify** in Cloudflare dashboard
- Use **Cloudflare Workers** for API (lower latency)
- Enable **Browser Cache TTL** settings

## Monitoring

- **Analytics**: Available in Cloudflare dashboard
- **Error Tracking**: Check browser console and Cloudflare logs
- **Performance**: Use Cloudflare Analytics or Google Analytics

## Rollback

If something goes wrong:

1. Go to **Deployments** in Cloudflare Pages
2. Find a previous successful deployment
3. Click **Retry deployment** or **Rollback to this deployment**

---

Need help? Open an issue on GitHub or check [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).

