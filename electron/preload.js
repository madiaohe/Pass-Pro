const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 Electron API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 密码数据操作
  savePasswords: (data) => ipcRenderer.invoke('save-passwords', data),
  loadPasswords: (masterPassword) => ipcRenderer.invoke('load-passwords', masterPassword),
  
  // 首次设置主密码
  setupMasterPassword: (password) => ipcRenderer.invoke('setup-master-password', password),
  verifyMasterPassword: (password) => ipcRenderer.invoke('verify-master-password', password),
  hasMasterPassword: () => ipcRenderer.invoke('has-master-password'),
  
  // 应用控制
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // 平台信息
  platform: process.platform,
});

// 监听主进程发送的事件
ipcRenderer.on('lock-app', () => {
  window.dispatchEvent(new CustomEvent('app-lock'));
});
