# PassPro Git 工作流程

> 版本管理策略 - 让每个改动都可追溯

## 🌳 分支策略（Git Flow 简化版）

```
main/master     生产环境代码（稳定版）
    │
    ├── develop     开发主分支（日常开发）
    │       │
    │       ├── feature/login      功能分支
    │       ├── feature/export     功能分支
    │       └── bugfix/memory      修复分支
    │
    └── hotfix      紧急修复分支
```

### 分支说明

| 分支 | 用途 | 保护级别 |
|------|------|----------|
| `master` | 生产环境代码，只接受合并 | 🔴 禁止直接推送 |
| `develop` | 日常开发主分支 | 🟡 建议PR合并 |
| `feature/*` | 新功能开发 | 🟢 自由推送 |
| `bugfix/*` | Bug 修复 | 🟢 自由推送 |
| `hotfix/*` | 紧急生产修复 | 🟡 需要审核 |

---

## 📝 提交规范（Conventional Commits）

### 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(ui): 添加深色模式` |
| `fix` | Bug 修复 | `fix(crypto): 修复加密失败问题` |
| `docs` | 文档更新 | `docs: 更新安装说明` |
| `style` | 代码格式 | `style: 统一缩进` |
| `refactor` | 重构 | `refactor: 提取加密工具类` |
| `perf` | 性能优化 | `perf: 减少渲染次数` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖` |

### 示例提交
```bash
# 功能开发
git commit -m "feat(ui): 添加密码导出功能

- 支持 CSV 和 JSON 格式导出
- 添加导出密码确认对话框
- 限制导出文件保存位置

Closes #12"

# Bug 修复
git commit -m "fix(sync): 修复多设备同步冲突

当两台设备同时修改时，现在会自动合并更改，
冲突时保留最新版本并提示用户。

Fixes #23"
```

---

## 🏷️ 版本管理（语义化版本）

### 版本号规则：MAJOR.MINOR.PATCH

| 位置 | 何时递增 | 示例 |
|------|----------|------|
| MAJOR | 不兼容的 API 修改 | `1.x.x` → `2.0.0` |
| MINOR | 向下兼容的功能添加 | `1.0.x` → `1.1.0` |
| PATCH | 向下兼容的问题修复 | `1.0.0` → `1.0.1` |

### 版本标签管理

```bash
# 发布新版本前打标签
git tag -a v1.0.0 -m "首次正式版发布

功能：
- 主密码保护
- AES-256 加密
- 密码生成器
- 分类管理

测试环境：Windows 11, Electron 28"

# 推送标签到 GitHub
git push origin v1.0.0

# 推送所有标签
git push origin --tags
```

---

## 🔄 日常开发流程

### 1. 开始新功能

```bash
# 切换到 develop 分支
git checkout develop
git pull origin develop

# 创建功能分支
git checkout -b feature/功能名称

# 例如
git checkout -b feature/auto-lock
```

### 2. 开发过程中

```bash
# 频繁提交（小步提交原则）
git add .
git commit -m "feat: 添加自动锁定设置UI"

# 推送到远程备份
git push origin feature/auto-lock
```

### 3. 功能完成

```bash
# 更新 develop 分支
git checkout develop
git pull origin develop

# 合并功能分支
git merge feature/auto-lock

# 删除功能分支
git branch -d feature/auto-lock
git push origin --delete feature/auto-lock

# 推送 develop
git push origin develop
```

### 4. 发布版本

```bash
# 从 develop 创建发布分支
git checkout -b release/v1.1.0

# 修复最后小问题后合并到 master
git checkout master
git merge release/v1.1.0

# 打标签
git tag -a v1.1.0 -m "版本 1.1.0 发布"

# 推送
git push origin master
git push origin v1.1.0

# 合并回 develop
git checkout develop
git merge release/v1.1.0

# 删除发布分支
git branch -d release/v1.1.0
```

---

## 🆘 紧急修复流程

```bash
# 从 master 创建热修复分支
git checkout master
git checkout -b hotfix/critical-bug

# 修复问题
git commit -m "fix: 修复密码丢失的严重问题"

# 合并到 master 和 develop
git checkout master
git merge hotfix/critical-bug
git tag -a v1.0.1 -m "紧急修复"
git push origin master --tags

git checkout develop
git merge hotfix/critical-bug
git push origin develop

git branch -d hotfix/critical-bug
```

---

## 💾 备份与恢复

### 查看历史版本

```bash
# 查看提交历史
git log --oneline --graph --all

# 查看具体改动
git show 提交ID

# 对比版本
git diff v1.0.0 v1.1.0
```

### 回溯到旧版本

```bash
# 临时查看旧版本（不修改代码）
git checkout v1.0.0

# 回到最新
git checkout master

# 回滚到特定提交（慎用！）
git reset --hard 提交ID

# 查看所有操作记录（用于恢复）
git reflog
```

---

## 🔐 GitHub 设置建议

### 1. 启用分支保护（Settings → Branches）

对 `master` 分支：
- ✅ Require pull request reviews
- ✅ Require status checks
- ✅ Restrict pushes

### 2. 使用 Issues 跟踪功能

- 每个功能创建一个 Issue
- 提交消息中引用：`Closes #123`
- 使用标签分类：`bug`, `feature`, `enhancement`

### 3. 使用 Projects 看板

创建看板管理开发进度：
- To Do
- In Progress  
- Review
- Done

### 4. Releases 页面

每次打标签后，在 GitHub Releases 页面：
- 上传构建好的 `.exe` 安装包
- 写发布说明
- 标记为预发布（如果是测试版）

---

## 📋 提交检查清单

每次提交前检查：

- [ ] 代码可以正常运行
- [ ] 提交信息符合规范
- [ ] 包含相关 Issue 编号
- [ ] 敏感信息未提交（密码、密钥等）
- [ ] 大型二进制文件已排除

---

## 🚀 快速命令参考

```bash
# 查看状态
git status

# 查看分支
git branch -a

# 创建并切换分支
git checkout -b feature/xxx

# 合并分支
git merge feature/xxx

# 删除本地分支
git branch -d feature/xxx

# 删除远程分支
git push origin --delete feature/xxx

# 查看标签
git tag -l

# 创建标签
git tag -a v1.0.0 -m "版本说明"

# 推送标签
git push origin v1.0.0
```

---

> 💡 **提示**：即使是个人项目，也要养成良好习惯！
> 
> 未来你会感谢现在规范的自己 🎯
