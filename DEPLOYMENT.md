# 部署指南

本指南将帮助您将项目上传到GitHub并部署到Vercel。

## 第一步：上传到GitHub

### 1. 创建GitHub仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 `+` 按钮，选择 `New repository`
3. 填写仓库信息：
   - Repository name: `icp-soft-upload-system` (或您喜欢的名称)
   - Description: `软件上传系统 - 基于Vue3的第三方软件上传审核平台`
   - 选择 `Public` (公开) 或 `Private` (私有)
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 `Create repository`

### 2. 推送代码到GitHub

创建仓库后，GitHub会显示推送代码的命令。在项目根目录执行以下命令：

```bash
# 添加远程仓库（替换为您的GitHub用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/icp-soft-upload-system.git

# 推送代码到GitHub
git push -u origin master
```

**或者使用SSH（如果已配置SSH密钥）：**

```bash
git remote add origin git@github.com:YOUR_USERNAME/icp-soft-upload-system.git
git push -u origin master
```

### 3. 验证上传

刷新GitHub仓库页面，您应该能看到所有项目文件。

---

## 第二步：部署到Vercel

### 1. 注册/登录Vercel

1. 访问 [Vercel](https://vercel.com)
2. 点击 `Sign Up` 或 `Log In`
3. 建议使用GitHub账号登录，这样可以直接访问您的仓库

### 2. 导入项目

1. 登录后，点击 `Add New...` → `Project`
2. 在 "Import Git Repository" 中找到您的仓库 `icp-soft-upload-system`
3. 点击 `Import`

### 3. 配置项目

Vercel会自动检测到这是一个Vite项目，但需要确认以下配置：

- **Framework Preset**: Vite
- **Root Directory**: `frontend` (点击 Edit 按钮设置)
- **Build Command**: `npm run build` (自动检测)
- **Output Directory**: `dist` (自动检测)
- **Install Command**: `npm install` (自动检测)

### 4. 环境变量（可选）

如果后续需要配置环境变量，可以在 "Environment Variables" 部分添加。
目前项目不需要环境变量。

### 5. 部署

1. 点击 `Deploy` 按钮
2. 等待部署完成（通常需要1-3分钟）
3. 部署成功后，您会看到：
   - 🎉 Congratulations 页面
   - 项目的访问链接（类似：`https://your-project.vercel.app`）

### 6. 访问项目

点击提供的链接即可访问您的在线项目！

---

## 更新部署

### 方式一：通过Git推送自动部署

Vercel会自动监听GitHub仓库的变化。每次您推送代码到GitHub时：

```bash
git add .
git commit -m "更新说明"
git push
```

Vercel会自动检测到变化并重新部署。

### 方式二：手动重新部署

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到您的项目
3. 点击项目进入详情页
4. 点击 `Deployments` 标签
5. 点击最新部署右侧的三个点，选择 `Redeploy`

---

## 自定义域名（可选）

如果您有自己的域名：

1. 在Vercel项目设置中找到 `Domains`
2. 点击 `Add` 添加您的域名
3. 按照指示配置DNS记录
4. 等待DNS生效（可能需要几分钟到几小时）

---

## 常见问题

### 1. 部署失败

**可能原因：**
- 构建命令错误
- 依赖安装失败
- 路由配置问题

**解决方法：**
- 检查Vercel的构建日志
- 确认 `vercel.json` 配置正确
- 确认 `frontend/package.json` 中的依赖完整

### 2. 页面404错误

**原因：** SPA路由配置问题

**解决方法：**
确认 `vercel.json` 中包含以下配置：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. localStorage数据丢失

这是正常现象。由于项目使用localStorage存储数据：
- 每个浏览器的数据是独立的
- 清除浏览器缓存会导致数据丢失
- 建议在说明中提醒用户这是演示项目

---

## 项目当前状态

✅ Git仓库已初始化
✅ 代码已提交到本地仓库
✅ `.gitignore` 已创建
✅ `vercel.json` 已配置
⏳ 等待推送到GitHub
⏳ 等待部署到Vercel

---

## 快速命令参考

```bash
# 查看当前状态
git status

# 查看提交历史
git log --oneline

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送到GitHub
git push -u origin master

# 后续更新推送
git add .
git commit -m "更新内容"
git push
```

---

## 技术支持

如遇到问题，可以参考：
- [Vercel官方文档](https://vercel.com/docs)
- [GitHub官方文档](https://docs.github.com)
- [Vite部署指南](https://vitejs.dev/guide/static-deploy.html)

祝您部署顺利！🚀
