# 部署到魔搭社区 (ModelScope) 指南

本项目已配置好 Docker 部署支持，可以轻松部署到魔搭社区 (ModelScope) 的创空间 (Spaces)。

## 步骤 1: 创建创空间

1. 登录 [魔搭社区](https://modelscope.cn/)。
2. 进入 [创空间](https://modelscope.cn/studios) 页面。
3. 点击 **"创建创空间"**。
4. 填写空间名称（例如 `skillswap-landing`）。
5. 在 **"SDK选择"** 中，选择 **"Docker"**。
6. 点击 **"创建"**。

## 步骤 2: 上传代码

创建空间后，你会获得一个 Git 仓库地址。你需要将本地代码推送到这个仓库。

1. 在你的项目根目录下，初始化 git（如果尚未初始化）：
   ```bash
   git init
   ```

2. 添加魔搭空间的远程仓库地址（将 `<YOUR_MODELSCOPE_GIT_URL>` 替换为你的实际地址）：
   ```bash
   git remote add modelscope <YOUR_MODELSCOPE_GIT_URL>
   ```

3. 提交代码：
   ```bash
   git add .
   git commit -m "Initial deploy to ModelScope"
   ```

4. 推送到魔搭仓库：
   ```bash
   git push -f modelscope main
   # 或者如果是 master 分支
   git push -f modelscope master
   ```

## 步骤 3: 等待构建与运行

推送代码后，魔搭社区会自动检测 `Dockerfile` 并开始构建镜像。

1. 回到创空间页面，点击 **"构建日志"** 查看构建进度。
2. 构建成功后，状态会变为 **"运行中"**。
3. 点击 **"应用"** 标签页即可预览你的网站。

## 注意事项

- **端口**: `Dockerfile` 已配置为监听 `7860` 端口，这是魔搭社区和 Hugging Face Spaces 的默认端口。
- **构建输出**: 项目配置了 `output: 'standalone'` 模式，以优化构建体积和启动速度。
- **环境变量**: 如果项目需要环境变量（如 API Keys），请在创空间的 **"设置"** -> **"环境变量"** 中添加。

祝部署顺利！🚀
