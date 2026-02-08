# 数据存储位置选择

## 方案 1：默认（C盘用户目录）✅ 推荐

**路径**：`C:\Users\<用户名>\.passpro\`

**优点**：
- 卸载应用不丢数据
- 系统自动备份用户目录
- 标准做法，最稳定

**启动**：
```bash
npm run electron:dev
```

---

## 方案 2：D盘存储

**路径**：`D:\PassProData\`

**优点**：
- 不占用C盘空间
- 重装系统后数据还在

**启动**：

**方法 A - 双击运行**：
```
双击 launch-d-drive.bat
```

**方法 B - 手动设置**：
```cmd
cd passpro-project
set PASSPRO_DATA_DIR=D:\PassProData
npm run electron:dev
```

---

## 方案 3：自定义任意位置

**方法**：设置环境变量
```cmd
set PASSPRO_DATA_DIR=E:\MyPasswords
npm run electron:dev
```

---

## 📊 数据占用

| 项目 | 大小 |
|-----|------|
| 1个密码条目 | ~0.1 KB |
| 100个密码 | ~10 KB |
| 1000个密码 | ~100 KB |

**结论**：即使存1000个密码，也仅占100KB，几乎可以忽略。

---

## 🔄 迁移数据

如果想把数据从C盘迁移到D盘：

1. **退出 PassPro**
2. **复制数据**：
   ```
   C:\Users\<用户名>\.passpro\  →  D:\PassProData\
   ```
3. **使用 D 盘启动**：双击 `launch-d-drive.bat`

---

## 💡 建议

**普通用户**：用默认C盘位置，简单省心  
**C盘紧张**：用 D 盘方案，双击 `launch-d-drive.bat`  
**高级用户**：自定义环境变量
