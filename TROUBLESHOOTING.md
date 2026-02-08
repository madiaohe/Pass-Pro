# PassPro 项目运行故障排除

## 🔧 当前环境问题

当前环境遇到了以下问题：
1. **网络限制** - 无法连接到 npm 官方仓库
2. **Electron 下载失败** - 需要访问 GitHub 下载 Electron 二进制文件

## ✅ 解决方案

### 方案 1: 使用国内镜像（推荐）

```bash
# 1. 设置 npm 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 2. 设置 Electron 镜像
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/

# 3. 删除旧的 node_modules，重新安装
rm -rf node_modules package-lock.json
npm install

# 4. 运行开发服务器
npm run dev
```

### 方案 2: 使用 yarn

```bash
# 1. 安装 yarn
npm install -g yarn

# 2. 设置 yarn 使用淘宝镜像
yarn config set registry https://registry.npmmirror.com

# 3. 安装依赖
yarn install

# 4. 运行
yarn dev
```

### 方案 3: 使用 cnpm

```bash
# 1. 安装 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com

# 2. 使用 cnpm 安装
cnpm install

# 3. 运行
cnpm run dev
```

### 方案 4: 手动下载 Electron

如果只有 Electron 下载失败：

```bash
# 1. 先安装其他依赖（跳过 Electron）
npm install --legacy-peer-deps --ignore-scripts

# 2. 手动下载 Electron
# 访问 https://npmmirror.com/mirrors/electron/28.1.0/
# 下载 electron-v28.1.0-win32-x64.zip

# 3. 解压到 node_modules/electron/dist/
mkdir -p node_modules/electron/dist
# 将下载的文件解压到此目录

# 4. 创建 Electron 启动脚本
echo '{"version": "28.1.0"}' > node_modules/electron/path.txt
```

## 🚀 运行项目

### 开发模式（前端）

```bash
npm run dev
```
访问: http://localhost:5173

### 桌面应用模式

```bash
npm run electron:dev
```

### 构建生产版本

```bash
npm run build
npm run electron:build
```

## 📋 检查清单

运行项目前请确认：

- [ ] Node.js 版本 >= 18 (`node --version`)
- [ ] npm 版本 >= 9 (`npm --version`)
- [ ] 已设置国内镜像（如果需要）
- [ ] node_modules 目录存在且不为空
- [ ] 端口 5173 未被占用

## 🔍 常见问题

### Q1: 提示 "vite 不是内部或外部命令"

**解决**:
```bash
npm install -g vite
# 或
npx vite
```

### Q2: Electron 启动后白屏

**解决**:
1. 先运行 `npm run build` 确保有 dist 目录
2. 检查 dist/index.html 是否存在
3. 在 Electron 窗口按 `Ctrl+Shift+I` 打开开发者工具查看错误

### Q3: 样式不生效

**解决**:
```bash
# 确保 Tailwind CSS 已生成
npm run build:css
```

### Q4: 加密模块报错

**解决**:
```bash
# 重新安装依赖
rm -rf node_modules
npm install
```

## 📞 获取帮助

如果以上方法都无法解决问题：

1. 检查网络连接
2. 尝试使用手机热点
3. 在公司/学校网络下，可能需要配置代理
4. 查看 npm 错误日志: `cat ~/.npm/_logs/*.log`

## 🎯 快速测试（无需 Electron）

如果你只需要测试前端功能，可以：

```bash
# 1. 仅安装核心依赖（不包括 Electron）
npm install vite react react-dom lucide-react @vitejs/plugin-react

# 2. 运行前端开发服务器
npx vite

# 3. 浏览器访问 http://localhost:5173
```

注意：此模式下数据不会持久化存储（因为需要 Electron 的 Node.js API）。

---

**祝你顺利运行项目！** 🚀
