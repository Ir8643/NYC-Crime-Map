# ⚡ Quick Cloudflare Pages Setup

## Build Configuration

Copy these settings when setting up your Cloudflare Pages project:

### Build Settings

```
Framework preset: Vite
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: (leave empty)
Node version: 18
```

### Environment Variables

Add these in **Settings → Environment variables**:

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://your-backend-url.com/api` | Your backend API URL |
| `NODE_VERSION` | `18` | Node.js version |

### Quick Deploy Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Backend deployed and accessible
- [ ] Custom domain configured (optional)

### Testing Locally

Before deploying, test the production build:

```bash
cd frontend
npm install
npm run build
npm run preview
```

Visit `http://localhost:4173` to preview the production build.

### Common Issues

**Build fails:**
- Check Node version is 18+
- Verify all dependencies in package.json
- Check build logs in Cloudflare dashboard

**API not working:**
- Verify `VITE_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is publicly accessible

**404 errors:**
- Verify `_redirects` file is in `frontend/public/`
- Check build output includes `index.html`

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

