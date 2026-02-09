# Deployment & Branching Strategy

This guide outlines the Git branching strategy and Vercel deployment workflow for the SkillSwap project.

## 1. Git Setup (Run these commands locally)

Since this is a fresh project, you need to initialize Git and set up your branches.

### Initialize Repository
```bash
# Initialize Git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete landing page and dashboard"

# Rename master to main (standard practice)
git branch -M main
```

### Create Development Branch
```bash
# Create and switch to develop branch
git checkout -b develop
```

## 2. GitHub Setup

1.  Create a new repository on GitHub named `skillswap-landing-page`.
2.  Link your local repository to GitHub:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/skillswap-landing-page.git

# Push main branch
git push -u origin main

# Push develop branch
git push -u origin develop
```

## 3. Vercel Configuration

1.  **Login to Vercel**: Go to [vercel.com](https://vercel.com) and log in with GitHub.
2.  **Add New Project**: Click **"Add New..."** -> **"Project"**.
3.  **Import Repository**: Find `skillswap-landing-page` in the list and click **"Import"**.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `next build` (default).
    *   **Install Command**: `npm install` (default).
5.  **Deploy**: Click **"Deploy"**. This will deploy the `main` branch to Production.

### Branch Deployments (Environments)

Vercel automatically handles branch deployments:

*   **Production**: The `main` branch. Updates here update your live site (e.g., `skillswap.vercel.app`).
*   **Preview (Development)**: The `develop` branch (and any other branch like `feature/*`).
    *   Vercel creates a unique URL for each pull request and branch push (e.g., `skillswap-git-develop-yourname.vercel.app`).
    *   You can treat the `develop` branch deployment as your "Staging/Test" environment.

## 4. Development Workflow

### Step 1: New Feature
Start a new feature from the `develop` branch.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature-name
```

... Make changes, code, test ...

```bash
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature-name
```

### Step 2: Merge to Develop (Testing)
Create a Pull Request (PR) on GitHub from `feature/...` to `develop`.
Once merged, Vercel will automatically redeploy the **Preview** environment for `develop`.

### Step 3: Release to Production
When `develop` is stable and ready for release:
1.  Create a Pull Request from `develop` to `main`.
2.  Merge the PR.
3.  Vercel will automatically build and deploy to **Production**.

## 5. Hotfixes
For urgent bugs in production:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/bug-fix-name
```

... Fix bug ...

```bash
git commit -m "fix: Resolve urgent bug"
git push origin hotfix/bug-fix-name
```

1.  Merge `hotfix` to `main` (Deploys fix to Prod).
2.  **Important**: Also merge `hotfix` back into `develop` so the fix isn't lost in the next release!
