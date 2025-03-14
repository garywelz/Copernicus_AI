# Deploying Copernicus AI to Vercel

This guide provides step-by-step instructions for deploying the Copernicus AI podcast platform to Vercel.

## Prerequisites

1. A GitHub account with the repository pushed to it
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure your code is pushed to the GitHub repository:

```bash
# Run the preparation script
./prepare_for_github.sh

# Review the changes
git status

# Commit the changes
git commit -m "Initial commit for Vercel deployment"

# Push to GitHub
git push copernicus_ai main
```

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository (`garywelz/Copernicus_AI`)
3. Vercel will automatically detect that it's a Next.js project

### 3. Configure the Project

In the Vercel deployment interface:

1. **Project Name**: Enter a name for your project (e.g., `copernicus-ai`)
2. **Framework Preset**: Ensure Next.js is selected
3. **Root Directory**: Leave as default (/)
4. **Build Command**: Leave as default (`next build`)
5. **Output Directory**: Leave as default (`.next`)

### 4. Environment Variables

If your project requires any environment variables, add them in the Vercel interface:

- No sensitive API keys are required for the frontend deployment
- All content is statically generated

### 5. Deploy

Click the "Deploy" button and wait for the deployment to complete.

### 6. Verify Deployment

Once deployed, Vercel will provide you with a URL to access your site (e.g., `https://copernicus-ai.vercel.app`).

## Post-Deployment

### Custom Domain (Optional)

To use a custom domain:

1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain and follow the instructions to configure DNS

### Continuous Deployment

Vercel automatically sets up continuous deployment:

- Any push to the `main` branch will trigger a new deployment
- You can configure preview deployments for pull requests

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs in Vercel
2. Ensure all dependencies are correctly specified in `package.json`
3. Verify that your Next.js configuration is correct
4. Check that all required environment variables are set

## Getting Help

If you need assistance with Vercel deployment:

- Consult the [Vercel documentation](https://vercel.com/docs)
- Use Vercel AI (v0) for deployment assistance
- Check the Next.js [deployment documentation](https://nextjs.org/docs/deployment) 