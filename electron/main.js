const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const crypto = require('./utils/crypto');

// 保持窗口对象的全局引用，防止被垃圾回收
let mainWindow;

// 获取数据存储目录（支持环境变量或默认用户目录）
function getDataDir() {
  // 优先使用环境变量
  if (process.env.PASSPRO_DATA_DIR) {
    return process.env.PASSPRO_DATA_DIR;
  }
  
  // 默认使用用户目录
  return path.join(os.homedir(), '.passpro');
}

// 数据文件路径
const DATA_DIR = getDataDir();
const DATA_FILE = path.join(DATA_DIR, 'passwords.enc');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

console.log('Data directory:', DATA_DIR);

// 创建窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    center: true, // 窗口居中显示
    title: 'PassPro',
    icon: path.join(__dirname, '../dist/vite.svg'), // 临时图标
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: true, // 立即显示窗口
    backgroundColor: '#F0F4F8',
  });
  
  console.log('Window created, ID:', mainWindow.id);
  console.log('Window bounds:', mainWindow.getBounds());

  // Windows 和 Linux 的菜单栏处理
  if (process.platform !== 'darwin') {
    mainWindow.setMenu(null); // 移除默认菜单
  }

  // 加载应用
  const htmlPath = path.join(__dirname, '../dist/index.html');
  console.log('Loading HTML from:', htmlPath);
  console.log('__dirname:', __dirname);
  
  if (process.env.VITE_DEV_SERVER_URL) {
    // 开发环境
    console.log('Development mode, loading URL:', process.env.VITE_DEV_SERVER_URL);
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境
    console.log('Production mode, loading file:', htmlPath);
    mainWindow.loadFile(htmlPath).catch(err => {
      console.error('Failed to load file:', err);
    });
  }

  // 加载完成后显示窗口
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
    mainWindow.focus();
    console.log('Window shown and focused');
  });
  
  // 窗口关闭事件
  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });
  
  // 监听加载失败
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
  
  // 监听崩溃
  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error('Window crashed:', killed);
  });
  
  // 打开开发者工具（调试用，发布时可删除）
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('Created data directory:', DATA_DIR);
  }
}

// IPC 处理：检查是否已设置主密码
ipcMain.handle('has-master-password', async () => {
  try {
    await fs.access(CONFIG_FILE);
    const config = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8'));
    return !!config.masterPasswordHash;
  } catch {
    return false;
  }
});

// IPC 处理：设置主密码（首次使用）
ipcMain.handle('setup-master-password', async (event, password) => {
  try {
    await ensureDataDir();
    
    const masterPasswordHash = crypto.hashPassword(password);
    const config = {
      masterPasswordHash,
      createdAt: new Date().toISOString(),
      version: 1,
    };
    
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    
    // 创建空的密码文件
    const emptyData = { passwords: [], version: 1 };
    const encrypted = crypto.encrypt(emptyData, password);
    await fs.writeFile(DATA_FILE, encrypted);
    
    return { success: true };
  } catch (error) {
    console.error('Setup master password error:', error);
    return { success: false, error: error.message };
  }
});

// IPC 处理：验证主密码
ipcMain.handle('verify-master-password', async (event, password) => {
  try {
    const config = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8'));
    const isValid = crypto.verifyPassword(password, config.masterPasswordHash);
    
    if (!isValid) {
      return { success: false, error: '主密码错误' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Verify master password error:', error);
    return { success: false, error: error.message };
  }
});

// IPC 处理：保存密码
ipcMain.handle('save-passwords', async (event, { data, masterPassword }) => {
  try {
    await ensureDataDir();
    
    const dataToSave = {
      passwords: data.passwords,
      version: 1,
      lastModified: new Date().toISOString(),
    };
    
    const encrypted = crypto.encrypt(dataToSave, masterPassword);
    await fs.writeFile(DATA_FILE, encrypted);
    
    return { success: true };
  } catch (error) {
    console.error('Save passwords error:', error);
    return { success: false, error: error.message };
  }
});

// IPC 处理：加载密码
ipcMain.handle('load-passwords', async (event, masterPassword) => {
  try {
    await ensureDataDir();
    
    // 检查文件是否存在
    try {
      await fs.access(DATA_FILE);
    } catch {
      // 文件不存在，返回空数据
      return { 
        success: true, 
        data: { passwords: [], version: 1 } 
      };
    }
    
    const encrypted = await fs.readFile(DATA_FILE, 'utf8');
    const decrypted = crypto.decrypt(encrypted, masterPassword);
    
    return { success: true, data: decrypted };
  } catch (error) {
    console.error('Load passwords error:', error);
    return { success: false, error: error.message };
  }
});

// IPC 处理：窗口控制
ipcMain.on('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) mainWindow.close();
});

// App 事件处理
app.whenReady().then(() => {
  // 禁用 GPU 缓存以避免权限警告
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-software-rasterizer');
  
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 安全：防止新窗口创建
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    console.log('Blocked new window:', navigationUrl);
  });
});

console.log('PassPro Electron app starting...');
console.log('Data directory:', DATA_DIR);
console.log('To change data location, set PASSPRO_DATA_DIR environment variable');
