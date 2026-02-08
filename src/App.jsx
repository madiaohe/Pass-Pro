import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, Plus, Search, Copy, Eye, EyeOff, RefreshCw, 
  Settings, LogOut, Shield, Key, CreditCard, Globe, 
  Mail, Gamepad, MoreHorizontal, Check, ChevronRight, X,
  LayoutGrid, Bell, User, AlertTriangle, Wallet, Pencil,
  TrendingUp, Activity, Sparkles, Zap, Loader2
} from 'lucide-react';

// --- Visual Style Constants ---
const STYLES = {
  glassCard: "bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]",
  heading: "text-lg font-bold text-slate-800 tracking-tight",
};

// --- Components ---

const NavItem = ({ icon: Icon, label, count, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 mb-1 group font-medium relative overflow-hidden
      ${active 
        ? 'text-white shadow-lg shadow-teal-500/25' 
        : 'text-slate-500 hover:bg-white/60 hover:text-teal-700'
      }`}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 animate-border-flow"></div>
    )}
    
    <div className="relative z-10 flex items-center gap-3 w-full">
      <Icon size={18} className={active ? 'text-white' : 'text-slate-400 group-hover:text-teal-600 transition-colors'} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-sm tracking-wide ${active ? 'text-white font-bold' : ''}`}>{label}</span>
      {count > 0 && !active && (
        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-lg group-hover:bg-white group-hover:text-teal-600">
          {count}
        </span>
      )}
    </div>
  </button>
);

const StatCard = ({ icon: Icon, label, value, unit, theme, delay }) => {
  const themes = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
      gradient: 'group-hover:from-blue-500 group-hover:to-cyan-500',
      shadow: 'group-hover:shadow-blue-500/20',
      valueColor: 'group-hover:text-blue-600'
    },
    orange: {
      iconBg: 'bg-orange-50 text-orange-500',
      gradient: 'group-hover:from-orange-500 group-hover:to-red-500',
      shadow: 'group-hover:shadow-orange-500/20',
      valueColor: 'group-hover:text-orange-600'
    }
  };
  
  const t = themes[theme] || themes.blue;

  return (
    <div 
      className={`
        relative p-[1px] rounded-[24px] transition-all duration-500 group
        hover:-translate-y-1 hover:z-20 h-28
        ${t.shadow} hover:shadow-xl
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-br from-transparent via-transparent to-transparent ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative h-full bg-white/90 backdrop-blur-xl rounded-[23px] p-5 flex items-center gap-5 overflow-hidden">
        <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700`}></div>

        <div className={`w-14 h-14 rounded-2xl ${t.iconBg} flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md`}>
          <Icon size={26} strokeWidth={2.5} />
        </div>
        
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className={`text-3xl font-black text-slate-800 tracking-tight leading-none transition-colors duration-300 ${t.valueColor}`}>
              {value}
            </h3>
            {unit && <span className="text-xs font-bold text-slate-400/80">{unit}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordCard = ({ item, onCopy, onEdit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const getCategoryStyle = (cat) => {
    switch(cat) {
      case 'social': return { 
        bg: 'bg-indigo-50', text: 'text-indigo-600', icon: Globe, label: '社交', 
        gradient: 'group-hover:from-indigo-500 group-hover:to-purple-500',
        shadow: 'group-hover:shadow-indigo-500/20',
      };
      case 'finance': return { 
        bg: 'bg-emerald-50', text: 'text-emerald-600', icon: Wallet, label: '金融',
        gradient: 'group-hover:from-emerald-500 group-hover:to-teal-500',
        shadow: 'group-hover:shadow-emerald-500/20',
      };
      case 'work': return { 
        bg: 'bg-blue-50', text: 'text-blue-600', icon: Mail, label: '工作',
        gradient: 'group-hover:from-blue-500 group-hover:to-cyan-500',
        shadow: 'group-hover:shadow-blue-500/20',
      };
      case 'game': return { 
        bg: 'bg-orange-50', text: 'text-orange-600', icon: Gamepad, label: '娱乐',
        gradient: 'group-hover:from-orange-500 group-hover:to-amber-500',
        shadow: 'group-hover:shadow-orange-500/20',
      };
      default: return { 
        bg: 'bg-slate-50', text: 'text-slate-600', icon: Key, label: '其他',
        gradient: 'group-hover:from-slate-500 group-hover:to-gray-500',
        shadow: 'group-hover:shadow-slate-500/20',
      };
    }
  };
  
  const style = getCategoryStyle(item.category);
  const Icon = style.icon;

  return (
    <div className={`
      relative p-[1px] rounded-[24px] transition-all duration-500 group
      hover:-translate-y-2 hover:scale-[1.02] hover:z-20
      ${style.shadow} hover:shadow-2xl
    `}>
      <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-br from-transparent via-transparent to-transparent ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative h-full bg-white/95 backdrop-blur-xl rounded-[23px] p-5 flex flex-col overflow-hidden">
        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`}></div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className={`
              w-12 h-12 rounded-2xl ${style.bg} ${style.text} 
              flex items-center justify-center shadow-sm 
              transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md
            `}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">{item.title}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wide mt-1 inline-block opacity-60 group-hover:opacity-100 transition-opacity ${style.text}`}>
                {style.label}
              </span>
            </div>
          </div>
          
          <div className="flex gap-1 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
             <button onClick={() => onEdit(item)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors" title="编辑">
               <Pencil size={16} />
             </button>
             <button onClick={() => onCopy(item.password)} className="p-2 hover:bg-teal-50 rounded-xl text-slate-400 hover:text-teal-600 transition-colors" title="复制">
              <Copy size={16} />
            </button>
          </div>
        </div>
        
        <div className="mb-5 flex-1 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-transparent group-hover:bg-white/80 transition-colors w-fit max-w-full shadow-sm group-hover:shadow-inner">
            <User size={12} className="text-slate-400 shrink-0" />
            <p className="text-slate-500 text-xs truncate font-medium select-all">
              {item.username}
            </p>
          </div>
        </div>

        <div className={`
          relative z-10 rounded-xl p-1 pl-3 flex items-center justify-between border 
          transition-all duration-300
          ${showPassword ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 group-hover:border-slate-200 group-hover:bg-white'}
        `}>
          <div className="font-mono text-sm text-slate-600 truncate mr-2 tracking-wider select-none h-8 flex items-center w-full">
            {showPassword ? (
              <span className="text-slate-800 font-semibold animate-fade-in">{item.password}</span>
            ) : (
              <div className="flex gap-0.5 opacity-40 group-hover:opacity-60 transition-opacity">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowPassword(!showPassword)} 
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0
              ${showPassword ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-teal-600 hover:bg-white hover:shadow-sm'}
            `}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddNewCard = ({ onClick }) => (
  <button onClick={onClick} className="relative group rounded-[24px] h-full min-h-[180px] w-full cursor-pointer outline-none hover:z-20">
    <div className="absolute inset-0 rounded-[24px] border-2 border-dashed border-teal-200 group-hover:border-teal-400 transition-colors duration-300"></div>
    
    <div className="absolute inset-0 rounded-[24px] bg-teal-50/30 group-hover:bg-teal-50/60 transition-colors duration-300 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-200 transition-all duration-300 relative z-10">
        <Plus size={28} className="text-teal-500 group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
      </div>
      
      <div className="text-center relative z-10">
        <span className="font-bold text-teal-700 text-sm tracking-wide block group-hover:-translate-y-1 transition-transform">新建项目</span>
        <span className="text-[10px] text-teal-500/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 block mt-1">
          点击添加新密码
        </span>
      </div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-teal-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]"></div>
  </button>
);

// --- Main Application ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSetup, setHasSetup] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  const [passwords, setPasswords] = useState([]);

  // 检查是否是首次使用
  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      // 检查是否在 Electron 环境中
      if (window.electronAPI) {
        const hasMaster = await window.electronAPI.hasMasterPassword();
        setHasSetup(hasMaster);
        setIsFirstTime(!hasMaster);
      } else {
        // 浏览器环境：使用 localStorage 模拟
        const hasMaster = localStorage.getItem('passpro_master');
        console.log('Browser mode - hasMaster:', hasMaster);
        setHasSetup(!!hasMaster);
        setIsFirstTime(!hasMaster);
      }
    } catch (error) {
      console.error('Check first time error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData) => {
    let newPasswords;
    if (editingItem) {
      newPasswords = passwords.map(p => p.id === editingItem.id ? { ...itemData, id: p.id } : p);
      showToast('项目修改成功');
    } else {
      newPasswords = [...passwords, { ...itemData, id: Date.now() }];
      showToast('项目已安全保存');
    }
    
    setPasswords(newPasswords);
    setIsModalOpen(false);
    
    // 自动保存到本地
    await saveToFile(newPasswords);
  };

  const saveToFile = async (data) => {
    if (window.electronAPI) {
      // Electron 环境
      const result = await window.electronAPI.savePasswords({
        data: { passwords: data },
        masterPassword
      });
      
      if (!result.success) {
        showToast('保存失败: ' + result.error);
      }
    } else {
      // 浏览器环境：保存到 localStorage
      localStorage.setItem('passpro_data', JSON.stringify({ passwords: data }));
    }
  };

  const loadFromFile = async () => {
    setIsLoading(true);
    
    if (window.electronAPI) {
      // Electron 环境
      const result = await window.electronAPI.loadPasswords(masterPassword);
      if (result.success) {
        setPasswords(result.data.passwords || []);
        setIsLoggedIn(true);
        showToast('解锁成功');
      } else {
        showToast(result.error || '密码错误');
      }
    } else {
      // 浏览器环境
      const storedPwd = sessionStorage.getItem('passpro_pwd');
      if (masterPassword === storedPwd) {
        // 加载保存的密码
        const saved = localStorage.getItem('passpro_data');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            setPasswords(data.passwords || []);
          } catch {
            setPasswords([]);
          }
        } else {
          setPasswords([]);
        }
        setIsLoggedIn(true);
        showToast('解锁成功（浏览器模式）');
      } else {
        showToast('密码错误');
      }
    }
    
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!masterPassword) return;
    
    await loadFromFile();
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    if (!masterPassword) return;
    
    setIsLoading(true);
    
    if (window.electronAPI) {
      // Electron 环境
      const result = await window.electronAPI.setupMasterPassword(masterPassword);
      if (result.success) {
        setIsFirstTime(false);
        setHasSetup(true);
        setPasswords([]);
        setIsLoggedIn(true);
        showToast('设置成功');
      } else {
        showToast('设置失败: ' + result.error);
      }
    } else {
      // 浏览器环境：使用 localStorage
      localStorage.setItem('passpro_master', 'true');
      // 保存主密码到 sessionStorage（页面刷新后需要重新输入）
      sessionStorage.setItem('passpro_pwd', masterPassword);
      setIsFirstTime(false);
      setHasSetup(true);
      setPasswords([]);
      setIsLoggedIn(true);
      showToast('设置成功（浏览器模式，数据存储在本地）');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMasterPassword('');
    setPasswords([]);
    setActiveCategory('all');
    setSearchQuery('');
  };

  const filteredPasswords = useMemo(() => {
    return passwords.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [passwords, activeCategory, searchQuery]);

  // 登录/设置页面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex items-center justify-center p-6 font-sans">
        <div className={`${STYLES.glassCard} p-12 w-full max-w-md text-center relative overflow-hidden ring-1 ring-white/50`}>
           <div className="absolute top-0 right-0 w-40 h-40 bg-teal-300 rounded-full blur-[100px] opacity-40 -mr-10 -mt-10 animate-pulse-glow"></div>
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-300 rounded-full blur-[100px] opacity-40 -ml-10 -mb-10 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-[32px] mx-auto mb-8 shadow-2xl shadow-teal-500/40 flex items-center justify-center text-white rotate-3 group hover:rotate-12 transition-transform duration-500 cursor-pointer">
              <Shield size={48} strokeWidth={2} />
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
              {isFirstTime ? '欢迎使用' : '欢迎回来'}
            </h1>
            <p className="text-slate-400 mb-10 font-medium">
              {isFirstTime ? 'PassPro 安全空间 - 首次使用请设置主密码' : 'PassPro 安全空间'}
            </p>
            
            {/* 调试信息 - 浏览器模式显示重置按钮 */}
            {!window.electronAPI && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-700">
                <p className="font-bold mb-1">🌐 浏览器测试模式</p>
                <p className="mb-2">数据存储在浏览器本地</p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="text-xs bg-yellow-200 hover:bg-yellow-300 px-3 py-1 rounded-lg transition-colors"
                >
                  重置数据（清除所有密码）
                </button>
              </div>
            )}

            <form onSubmit={isFirstTime ? handleSetup : handleLogin} className="space-y-6">
              <div className="text-left">
                <div className="relative group">
                  <input 
                    type="password" 
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 pl-12 text-slate-800 font-medium focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none placeholder-slate-400 shadow-sm group-hover:bg-white"
                    placeholder={isFirstTime ? "设置主密码（至少6位）" : "输入主密码解锁"}
                    minLength={6}
                  />
                  <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                </div>
                {isFirstTime && (
                  <p className="text-xs text-slate-400 mt-2 text-left">
                    提示：主密码用于加密您的数据，请务必牢记！
                  </p>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={!masterPassword || masterPassword.length < 6 || isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-[0.98] relative overflow-hidden
                  ${masterPassword && masterPassword.length >= 6 && !isLoading
                    ? 'bg-slate-900 text-white hover:shadow-slate-900/40' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>{isFirstTime ? '设置并进入' : '解锁'}</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex font-sans text-slate-800 p-3 md:p-5 overflow-hidden relative">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] bg-teal-200/20 rounded-full blur-[150px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] bg-indigo-200/20 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="flex-1 flex gap-6 relative z-10 max-w-[1600px] mx-auto w-full">
        
        {/* Sidebar */}
        <aside className="w-64 hidden md:flex flex-col py-2 pl-2">
          <div className="px-5 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-900/30">
              <Shield size={20} fill="currentColor" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">PassPro</span>
          </div>

          <div className="space-y-1 flex-1 pr-4">
            <NavItem icon={LayoutGrid} label="安全概览" count={passwords.length} active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
            <div className="my-6 border-t border-slate-200/60 mx-4"></div>
            <p className="px-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">分类</p>
            <NavItem icon={Globe} label="社交媒体" count={passwords.filter(p => p.category === 'social').length} active={activeCategory === 'social'} onClick={() => setActiveCategory('social')} />
            <NavItem icon={Wallet} label="金融财务" count={passwords.filter(p => p.category === 'finance').length} active={activeCategory === 'finance'} onClick={() => setActiveCategory('finance')} />
            <NavItem icon={Mail} label="工作办公" count={passwords.filter(p => p.category === 'work').length} active={activeCategory === 'work'} onClick={() => setActiveCategory('work')} />
            <NavItem icon={Gamepad} label="游戏娱乐" count={passwords.filter(p => p.category === 'game').length} active={activeCategory === 'game'} onClick={() => setActiveCategory('game')} />
          </div>

          <div className="pr-4 pb-2">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl text-slate-500 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all text-xs font-bold group border border-transparent hover:border-slate-100">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>退出登录</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-2.5rem)]">
          <header className="flex items-center justify-between py-2 mb-6 shrink-0">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">安全概览</h1>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">今日安全指数良好</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input type="text" placeholder="搜索保险箱..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white/70 border border-transparent rounded-2xl pl-11 pr-5 py-3 w-72 text-sm font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:bg-white outline-none transition-all placeholder-slate-400 group-hover:bg-white/90 group-hover:shadow-md" />
              </div>
              <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-teal-600 hover:shadow-lg hover:-translate-y-0.5 transition-all relative group">
                <Bell size={20} className="group-hover:animate-bounce" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button onClick={openCreateModal} className={`hidden md:flex items-center gap-2 pl-5 pr-6 py-3 rounded-2xl font-bold text-sm transition-all relative overflow-hidden group shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5`}>
                 <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Plus size={20} strokeWidth={3} className="relative z-10 text-white" />
                <span className="relative z-10 text-white">新建项目</span>
              </button>
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-2 pt-2 pb-5 custom-scrollbar">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 shrink-0 relative z-10">
              
              {/* Card 1: Hero Security Score */}
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-teal-600 to-emerald-600 animate-aurora text-white p-6 shadow-xl shadow-teal-600/20 group hover:-translate-y-1 hover:z-20 transition-transform cursor-default flex items-center justify-between h-28">
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute left-10 bottom-0 w-20 h-20 rounded-full bg-emerald-400/20 blur-xl animate-pulse"></div>
                  
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm border border-white/10">
                            <Shield size={16} fill="currentColor" className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-teal-50 uppercase tracking-widest opacity-90">安全评分</span>
                    </div>
                    <div className="mt-1 flex items-baseline">
                        <span className="text-4xl font-black tracking-tighter leading-none drop-shadow-sm">98</span>
                        <span className="text-sm text-teal-100/80 font-bold ml-1">/100</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-end justify-between h-full">
                     <div className="px-3 py-1 bg-emerald-500/30 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm flex items-center gap-1">
                        <Sparkles size={10} fill="currentColor"/> 状态极佳
                     </div>
                     <div className="flex items-center gap-1.5 text-teal-100 text-[10px] font-bold bg-white/10 px-2 py-1 rounded-lg">
                        <Activity size={12} />
                        <span>实时监控中</span>
                     </div>
                  </div>
              </div>

              {/* Card 2: Total Items */}
              <StatCard 
                icon={Key} 
                label="已存储账户" 
                value={passwords.length} 
                unit="个"
                theme="blue"
                delay={100}
              />

              {/* Card 3: Risks */}
              <StatCard 
                icon={AlertTriangle} 
                label="潜在风险" 
                value="0" 
                unit="需处理"
                theme="orange"
                delay={200}
              />
            </div>

            {/* List Section Header */}
            <div className="flex items-center justify-between mb-4 shrink-0 px-1">
              <h2 className={STYLES.heading}>所有密码</h2>
              <button onClick={openCreateModal} className="md:hidden text-teal-600 font-bold text-sm bg-teal-50 px-3 py-1 rounded-lg">
                + 新建
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              <AddNewCard onClick={openCreateModal} />
              {filteredPasswords.map(p => (
                <PasswordCard 
                  key={p.id} 
                  item={p} 
                  onCopy={handleCopy} 
                  onEdit={openEditModal}
                />
              ))}
            </div>

          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up border border-white/10">
          <div className="bg-teal-500 rounded-full p-1">
             <Check size={12} strokeWidth={4} />
          </div>
          <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      {isModalOpen && (
        <PasswordModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveItem}
          initialData={editingItem} 
        />
      )}
    </div>
  );
}

// --- Modal Component ---
function PasswordModal({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: '', username: '', password: '', category: 'social'
  });
  const [showGen, setShowGen] = useState(false);
  const [genLength, setGenLength] = useState(12);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const generate = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let res = '';
    for(let i=0; i<genLength; i++) res += chars.charAt(Math.floor(Math.random()*chars.length));
    setFormData(prev => ({...prev, password: res}));
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative z-10 bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scale-in ring-1 ring-white/50">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
             <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{initialData ? '编辑密码' : '新建项目'}</h2>
             <p className="text-xs font-bold text-slate-400 mt-1 uppercase">请完善您的账户信息</p>
           </div>
           <button onClick={onClose} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
             <X size={18} />
           </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-7 custom-scrollbar">
           <div>
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">服务名称</label>
             <input autoFocus={!initialData} value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-lg font-bold text-slate-800 placeholder-slate-300 focus:bg-white focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none" placeholder="例如：Twitter" />
           </div>
           <div>
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">用户名 / 邮箱</label>
             <div className="relative group">
                <User className="absolute left-5 top-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" size={20} />
                <input value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-3.5 pl-14 font-medium text-slate-800 placeholder-slate-300 focus:bg-white focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none" placeholder="name@example.com" />
             </div>
           </div>
           <div>
              <div className="flex justify-between items-end mb-2.5">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">密码</label>
                 <button onClick={() => { setShowGen(!showGen); if(!formData.password && !showGen) generate(); }} className={`text-[10px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${showGen ? 'bg-teal-50 text-teal-600' : 'text-teal-600 hover:bg-teal-50'}`}>
                   <Zap size={12} className={showGen ? "fill-current" : ""} /> {showGen ? '收起生成器' : '自动生成'}
                 </button>
              </div>
              <div className="relative group">
                 <Lock className="absolute left-5 top-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" size={20} />
                 <input value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-3.5 pl-14 font-mono text-slate-800 placeholder-slate-300 focus:bg-white focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none" placeholder="••••••••••••" />
              </div>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showGen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-5">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold text-teal-700 uppercase">密码强度: <span className="text-teal-500">高</span></span>
                      <span className="text-xs font-mono font-bold text-teal-600 bg-white px-2 py-0.5 rounded shadow-sm">{genLength} 位</span>
                   </div>
                   <input type="range" min="8" max="32" value={genLength} onChange={e=>setGenLength(parseInt(e.target.value))} className="w-full h-1.5 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-5" />
                   <button onClick={generate} className="w-full bg-white border border-teal-200 text-teal-700 font-bold text-xs py-3 rounded-xl hover:bg-teal-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                     <RefreshCw size={14} /> 刷新随机密码
                   </button>
                </div>
              </div>
           </div>
           <div>
             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">分类</label>
             <div className="grid grid-cols-4 gap-3">
                {['social', 'finance', 'work', 'game'].map(cat => (
                  <button key={cat} onClick={() => setFormData({...formData, category: cat})} className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all ${formData.category === cat ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}>
                    {cat === 'social' ? '社交' : cat === 'finance' ? '金融' : cat === 'work' ? '工作' : '娱乐'}
                  </button>
                ))}
             </div>
           </div>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
           <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">取消</button>
           <button onClick={() => onSave(formData)} className="flex-[2] py-3.5 rounded-2xl font-bold text-white bg-slate-900 shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-0.5 transition-all text-sm">保存项目</button>
        </div>
      </div>
    </div>
  );
}
