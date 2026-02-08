# 上传到 GitHub 指南

## 第一步：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 输入仓库名：`PassPro`
3. 选择 **Private**（私有，保护你的密码管理器代码）
4. 不要勾选 "Initialize with README"（因为我们已有代码）
5. 点击 **Create repository**

## 第二步：获取仓库地址

创建后会看到类似：
```
https://github.com/你的用户名/PassPro.git
```

## 第三步：连接本地并推送

在项目目录中运行：

```bash
cd D:\Learning\daily\password_2.0.1\passpro-project

# 添加远程仓库（用你的实际地址替换）
git remote add origin https://github.com/你的用户名/PassPro.git

# 推送代码
git push -u origin master
```

## 第四步：输入 GitHub 凭据

运行 `git push` 后会要求输入：
- Username: 你的 GitHub 用户名
- Password: **Personal Access Token**（不是登录密码！）

### 创建 Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限（完全仓库访问）
4. 点击 Generate，复制生成的 token
5. 粘贴到密码提示处

## 第五步：验证上传

刷新 GitHub 页面，确认文件已上传。

## 后续推送

以后修改代码后：

```bash
# 查看修改
git status

# 添加所有修改
git add .

# 提交
git commit -m "描述本次修改"

# 推送到 GitHub
git push
```

## 注意事项

- **node_modules** 已被 .gitignore 排除，不会上传
- **dist/** 和 **dist-electron/** 构建输出也被排除
- 只上传源代码，安装包需从源码构建
