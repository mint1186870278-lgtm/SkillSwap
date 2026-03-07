# Vercel 自动部署配置指南

> 目标：推送代码到 main 后，Vercel 自动完成部署；队友推送到 feature/* 时，可自动合并并部署。
> 
> 最后验证：2025-03-06

---

## 一、问题原因

部署显示 **Blocked** 通常由以下原因导致：

1. **Vercel Deployment Protection**：生产部署需要手动审批
2. **Git 集成未正确配置**：未在 push 时自动触发部署
3. **账号/额度限制**：Hobby 计划或超出限额

---

## 二、解决步骤

### 步骤 1：检查 Vercel Git 集成

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard) → 选择 **SkillSwap** 项目
2. 点击顶部 **Settings**
3. 左侧菜单点击 **Git**
4. 确认 **Production Branch** 为 `main`
5. 检查 **Ignored Build Step** 未误配置为始终跳过构建

### 步骤 2：检查 Deployment Protection（若部署被 Blocked）

在 **Settings** → **Deployment Protection** 页面中：

- 若项目有 Protection Level，可设为 **None** 或 **Standard**（视需求）
- 若部署仍 Blocked，查看该次部署的 **Logs** 确认具体原因

### 步骤 3：确认自动部署行为

- 每次向 `main` 分支 push 时，Vercel 应自动触发部署
- 若 Git 自动部署被 Blocked，可使用下方 **Deploy Hook** 方案

---

## 三、推荐方案：Vercel Deploy Hook（主动触发部署）

当 Git 自动部署被 Blocked 时，可用 Deploy Hook 让 GitHub Actions 主动触发 Vercel 部署。

### 1. 创建 Deploy Hook

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard) → 选择 **SkillSwap** 项目
2. **Settings** → **Git** → 滚动到 **Deploy Hooks**
3. 点击 **Create Hook**
   - Name: `github-actions`
   - Branch to deploy: `main`
4. 复制生成的 URL（形如 `https://api.vercel.com/v1/integrations/deploy/...`）

### 2. 添加 GitHub Secret

1. 打开仓库 [SkillSwap](https://github.com/mint1186870278-lgtm/SkillSwap) → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. **Name** 填：`VERCEL_DEPLOY_HOOK`（必须一模一样）
4. **Secret** 填：粘贴上一步复制的 URL
5. 点击 **Add secret**

### 3. 生效方式

配置完成后：

- **每次 push 到 main**：`trigger-vercel-deploy.yml` 会调用 Deploy Hook，主动触发 Vercel 部署
- **队友 push 到 feature/\***：`auto-merge-to-main.yml` 会合并到 main 并 push，同时也会调用 Deploy Hook

---

## 四、可选：启用 GitHub Actions 自动合并

当队友推送到 `feature/*` 分支时，可自动合并到 `main` 并触发部署。

### 4.1 创建 Personal Access Token (PAT)

1. 打开 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. Note 填：`auto-merge`（随便起名）
4. 勾选权限：**repo**
5. 点击 **Generate token**，**复制生成的 token**（只显示一次，务必保存）

### 4.2 添加 GitHub Secret

1. 仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. **Name** 填：`REPO_ACCESS_TOKEN`
4. **Secret** 填：粘贴上一步复制的 token
5. 点击 **Add secret**

### 4.3 若 main 有分支保护（需要审批才能合并）

1. 仓库 **Settings** → **Branches** → 找到 main 的分支保护规则，点击 **Edit**
2. 找到 **Allow specified actors to bypass required pull requests**
3. 勾选它，并在下方添加**创建 PAT 的那个 GitHub 账号**
4. 保存

> 若 main 没有分支保护（任何人可直接 push），可跳过 4.3。

---

## 五、快速检查清单

- [ ] Vercel 项目已正确连接 GitHub 仓库
- [ ] Production Branch 为 `main`
- [ ] Deployment Protection 未阻止自动部署
- [ ] `VERCEL_DEPLOY_HOOK` 已添加到 GitHub Secrets
- [ ] （可选）`REPO_ACCESS_TOKEN` 已配置，auto-merge 工作正常

---

## 六、仍无法自动部署时

1. 查看 Vercel 部署详情中的 **Build Logs** 和错误信息
2. 检查 [Vercel Status](https://www.vercel-status.com/)
3. 确认账号未超出 [Hobby 计划限制](https://vercel.com/docs/limits)
