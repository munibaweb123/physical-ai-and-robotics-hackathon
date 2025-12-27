# Fix GitHub Pages Deployment

## ❌ Current Issue

Your site at https://munibaweb123.github.io/physical-ai-and-robotics-hackathon/ is showing **old content** because it's still deploying from the `gh-pages` branch instead of using the new GitHub Actions workflow.

## ✅ Solution (3 Simple Steps)

### Step 1: Change GitHub Pages Source

1. **Open this link**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/settings/pages

2. **Look for "Build and deployment" section**

3. **Under "Source"**:
   - You'll see it's currently set to: **"Deploy from a branch"** with `gh-pages` selected
   - **CHANGE IT TO**: **"GitHub Actions"**

4. The page will auto-save (no save button needed)

**Screenshot of what to look for:**
```
Build and deployment
├─ Source: [Dropdown menu]
   └─ Select: "GitHub Actions"  ← Click here!
```

### Step 2: Trigger the Workflow

1. **Open this link**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/actions

2. **In the left sidebar**, click on: **"Deploy Docs to GitHub Pages"**

3. **On the right side**, click the **"Run workflow"** dropdown button

4. **Select branch**: `fix/002-expand-course-content`

5. Click the green **"Run workflow"** button

### Step 3: Wait and Verify

1. **Watch the workflow run** (will show a spinning icon → then green checkmark ✅)

2. **Wait 2-5 minutes** for deployment to complete

3. **Visit your site**: https://munibaweb123.github.io/physical-ai-and-robotics-hackathon/

4. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R) to clear browser cache

5. **You should see your updated changes!** 🎉

## 🔍 Troubleshooting

### If the workflow fails:

**Check the logs**:
1. Go to Actions tab
2. Click on the failed workflow run
3. Click on the failed job
4. Read the error messages

**Common issues**:
- Missing dependencies → Check if `package-lock.json` exists in `physical-ai-docs/`
- Build errors → Check TypeScript/React errors in the logs
- Permission denied → Make sure GitHub Actions has write permissions (Settings → Actions → General → Workflow permissions → Read and write)

### If you still see old content:

1. **Clear browser cache completely**:
   - Chrome: Ctrl+Shift+Delete → Clear cached images and files
   - Or use Incognito/Private mode

2. **Check deployment completed**:
   - Actions tab should show green checkmark ✅
   - Pages settings should show "Your site is live at..."

3. **Verify correct baseUrl**:
   - Open `physical-ai-docs/docusaurus.config.ts`
   - Check `baseUrl: '/physical-ai-and-robotics-hackathon/'`

## 📝 Quick Links

- **Repository Settings → Pages**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/settings/pages
- **Actions Tab**: https://github.com/munibaweb123/physical-ai-and-robotics-hackathon/actions
- **Live Site**: https://munibaweb123.github.io/physical-ai-and-robotics-hackathon/

## 🎯 What Happens After This?

Once you complete these steps, **all future deployments will be automatic**!

Every time you push to:
- `002-expand-course-content` branch, OR
- `fix/002-expand-course-content` branch

The site will **automatically rebuild and redeploy** within 2-5 minutes. No manual steps needed!

## ⚙️ Workflow Configuration

The workflow (`.github/workflows/deploy-docs.yml`) is already set up to:
- ✅ Build the Docusaurus site
- ✅ Deploy to GitHub Pages
- ✅ Run on every push to main/fix branches
- ✅ Allow manual triggering

You just need to **enable GitHub Actions as the source** (Step 1 above)!

---

**TL;DR**: Go to Settings → Pages → Change Source to "GitHub Actions" → Go to Actions → Run workflow → Wait 5 minutes → Refresh site!
