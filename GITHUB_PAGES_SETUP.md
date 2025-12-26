# GitHub Pages Deployment Setup

## ✅ Completed Steps

1. ✅ Updated `docusaurus.config.ts` with correct baseUrl
2. ✅ Created GitHub Actions workflow (`.github/workflows/deploy-docs.yml`)
3. ✅ Committed and pushed changes to GitHub

## 🔧 Required: Enable GitHub Pages

You need to enable GitHub Pages in your repository settings. Follow these steps:

### Step 1: Go to Repository Settings

1. Open your repository: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon
2. Click on **Settings** (top menu bar)
3. In the left sidebar, click on **Pages** (under "Code and automation")

### Step 2: Configure GitHub Pages Source

1. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (not "Deploy from a branch")
   - This allows the GitHub Actions workflow to deploy the site

2. Click **Save** (if there's a save button)

### Step 3: Trigger the Deployment

The workflow will automatically run when you:
- Push to the `002-expand-course-content` branch (main branch)
- Push to the `fix/002-expand-course-content` branch

Or you can manually trigger it:
1. Go to the **Actions** tab in your repository
2. Click on "Deploy Docs to GitHub Pages" workflow
3. Click **Run workflow** → Select branch → Click **Run workflow**

### Step 4: Wait for Deployment

1. Go to the **Actions** tab: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/actions
2. You should see the "Deploy Docs to GitHub Pages" workflow running
3. Wait for it to complete (usually 2-5 minutes)
4. Look for a green checkmark ✅ when done

### Step 5: Access Your Site

Once deployed, your site will be available at:

**🌐 https://munibaweb123.github.io/physical-ai-and-robotics-hackathon/**

## 📋 Deployment Workflow Details

The workflow (`.github/workflows/deploy-docs.yml`) automatically:

1. **Triggers on**:
   - Push to `002-expand-course-content` branch
   - Push to `fix/002-expand-course-content` branch
   - Manual trigger via Actions tab

2. **Build process**:
   - Checks out code
   - Sets up Node.js 20
   - Installs dependencies in `physical-ai-docs/`
   - Runs `npm run build`
   - Uploads build artifact

3. **Deploy process**:
   - Deploys to GitHub Pages using the artifact
   - Updates the live site

## 🔍 Monitoring Deployments

### Check Deployment Status

1. **Actions Tab**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/actions
   - See all workflow runs
   - Check build logs for errors

2. **Pages Settings**: Repository → Settings → Pages
   - Shows current deployment status
   - Displays the live URL

### Common Issues

#### Issue 1: "GitHub Pages is not enabled"
**Solution**: Follow Step 2 above to enable GitHub Actions as the source

#### Issue 2: "Workflow doesn't run"
**Solution**:
- Check if Actions are enabled: Settings → Actions → General → Allow all actions
- Manually trigger the workflow from the Actions tab

#### Issue 3: "404 Page Not Found"
**Causes**:
- Incorrect baseUrl in `docusaurus.config.ts`
- Site not fully deployed yet (wait 5 minutes)
- Pages source not set to "GitHub Actions"

**Solution**:
- Verify baseUrl is `/physical-ai-and-robotics-hackathon/`
- Check deployment completed successfully in Actions tab
- Ensure Pages source is set to "GitHub Actions"

#### Issue 4: "Build fails"
**Solution**:
- Check the Actions tab for error logs
- Common issues:
  - Missing dependencies (check `package-lock.json` exists)
  - TypeScript errors in Docusaurus config
  - Broken links in documentation

## 🚀 Future Deployments

Every time you push to the main branch or fix branch, the site will automatically rebuild and redeploy!

You don't need to do anything manually - GitHub Actions handles everything.

## 📝 Manual Deployment (Alternative)

If you prefer manual deployment, you can also use:

```bash
cd physical-ai-docs
npm run build

# Then manually deploy using Docusaurus CLI
GIT_USER=munibaweb123 npm run deploy
```

But the GitHub Actions workflow is recommended for automatic deployments.

## 🔗 Quick Links

- **Repository**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon
- **Actions**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/actions
- **Settings → Pages**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/settings/pages
- **Live Site** (after deployment): https://munibaweb123.github.io/physical-ai-and-robotics-hackathon/

---

**Status**: ✅ Configuration complete - Now enable GitHub Pages in repository settings!
