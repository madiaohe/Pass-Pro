# PassPro 桌面应用构建指南

## 🚀 快速运行桌面应用

### 方法 1：使用 VS Code 外部终端（推荐）

1. **打开系统终端**（不是 VS Code 内置终端）
   - 按 `Win + R`，输入 `cmd`，回车
   - 或右键开始菜单，选择 "终端"

2. **进入项目目录**
   ```bash
   cd D:\Learning\daily\password_2.0.1\passpro-project
   ```

3. **构建前端**
   ```bash
   npm run build
   ```

4. **启动 Electron**
   ```bash
   npx electron .
   ```

### 方法 2：使用 npm 脚本

在系统终端中运行：

```bash
cd D:\Learning\daily\password_2.0.1\passpro-project
npm run electron:dev
```

## 📦 构建可执行文件

### Windows 版本

```bash
cd passpro-project
npm run electron:build:win
```

输出位置：`dist-electron/PassPro Setup 1.0.0.exe`

### macOS 版本

```bash
npm run electron:build:mac
```

输出位置：`dist-electron/PassPro-1.0.0.dmg`

### Linux 版本

```bash
npm run electron:build:linux
```

输出位置：`dist-electron/PassPro-1.0.0.AppImage`

## 🐛 常见问题

### Q1: 提示 "Cannot find module 'electron'"

**解决**：
```bash
# 重新安装 electron
npm install electron --legacy-peer-deps
```

### Q2: 构建时卡住不动

**解决**：
- Electron 首次下载需要较长时间
- 使用国内镜像：
  ```bash
  npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
  ```

### Q3: 杀毒软件拦截

**解决**：
- 将项目目录添加到杀毒软件白名单
- 或使用 Windows Defender 的排除项设置

### Q4: 应用启动白屏

**解决**：
1. 确保先运行 `npm run build`
2. 检查 `dist/index.html` 是否存在
3. 按 `Ctrl+Shift+I` 打开开发者工具查看错误

## 📁 数据存储位置

桌面版数据存储在用户目录：

- **Windows**: `C:\Users\<用户名>\.passpro\`
- **macOS**: `~/.passpro/`
- **Linux**: `~/.passpro/`

包含文件：
- `passwords.enc` - 加密的密码数据
- `config.json` - 配置文件

## 🔄 开发调试

### 开启开发者工具

在 `electron/main.js` 中找到 `createWindow` 函数，添加：

```javascript
mainWindow.webContents.openDevTools();
```

### 重新加载应用

在 Electron 窗口中：
- `Ctrl + R` - 重新加载页面
- `Ctrl + Shift + I` - 打开开发者工具

## 📋 发布清单

发布前请检查：

- [ ] 应用版本号已更新（package.json）
- [ ] 图标已替换（默认使用系统图标）
- [ ] 测试过安装和卸载流程
- [ ] 测试过数据加密/解密
- [ ] 检查过数据存储路径

## 🎯 下一步

构建完成后，你可以：

1. **分发应用**
   - 将 `.exe` / `.dmg` / `.AppImage` 文件分享给他人
   - 或上传到 GitHub Releases

2. **自动更新**
   - 集成 electron-updater
   - 配置更新服务器

3. **代码签名**
   - 购买代码签名证书
   - 避免杀毒软件误报

---

**祝你构建成功！** 🎉
