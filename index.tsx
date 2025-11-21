
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  DollarSign, 
  Info, 
  X, 
  Trash2,
  Users,
  Trophy,
  Search,
  Filter as FilterIcon,
  RotateCcw,
  CheckCircle2,
  Ban,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

// --- Types ---

type SkillLevel = 'Newbie' | 'Yếu' | 'TB-' | 'TB' | 'TB+' | 'Khá' | 'Tốt' | 'Pro';
type PostStatus = 'open' | 'full';
type GenderFilter = 'male' | 'female' | '';

interface UserProfile {
  id: string;
  username: string;
  password: string; // In a real app, never store plain passwords!
  fullName: string;
  phoneNumber: string;
}

interface PlayerRequirement {
  slots: number;
  minLevel: SkillLevel;
  maxLevel: SkillLevel;
  cost: number;
}

interface Post {
  id: string;
  creatorId?: string; // Link post to a user
  courtName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  male: PlayerRequirement;
  female: PlayerRequirement;
  notes: string;
  createdAt: number;
  status: PostStatus;
}

// --- Constants ---

const SKILL_LEVELS: SkillLevel[] = ['Newbie', 'Yếu', 'TB-', 'TB', 'TB+', 'Khá', 'Tốt', 'Pro'];

const getSkillLevelIndex = (level: string) => SKILL_LEVELS.indexOf(level as SkillLevel);

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    courtName: 'Sân Cầu Lông Viettel',
    address: 'Hẻm 158 Hoàng Hoa Thám, Tân Bình',
    contactName: 'Anh Tuấn',
    contactPhone: '0901234567',
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '20:00',
    male: { slots: 2, minLevel: 'TB', maxLevel: 'Khá', cost: 50000 },
    female: { slots: 1, minLevel: 'TB-', maxLevel: 'TB', cost: 40000 },
    notes: 'Sân thảm mới, cầu Thành Công, vui vẻ hòa đồng, không cay cú.',
    createdAt: Date.now(),
    status: 'open'
  },
  {
    id: '2',
    courtName: 'Sân 175',
    address: 'Nguyễn Kiệm, Gò Vấp',
    contactName: 'Chị Mai',
    contactPhone: '0987654321',
    date: new Date().toISOString().split('T')[0],
    startTime: '20:00',
    endTime: '22:00',
    male: { slots: 0, minLevel: 'Khá', maxLevel: 'Khá', cost: 60000 },
    female: { slots: 2, minLevel: 'TB-', maxLevel: 'TB+', cost: 30000 },
    notes: 'Thiếu nữ đánh giao lưu, nước uống miễn phí.',
    createdAt: Date.now() - 10000,
    status: 'open'
  }
];

// --- Auth Components ---

const LoginModal = ({ 
  isOpen, 
  onClose, 
  onLogin,
  onSwitchToRegister
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogin: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usersStr = localStorage.getItem('badminton_users');
    const users: UserProfile[] = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
      onClose();
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Đăng Nhập</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 mt-2"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Chưa có tài khoản? {' '}
          <button onClick={onSwitchToRegister} className="text-emerald-600 font-bold hover:underline">
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterModal = ({ 
  isOpen, 
  onClose, 
  onRegister,
  onSwitchToLogin
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onRegister: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    const usersStr = localStorage.getItem('badminton_users');
    const users: UserProfile[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.some(u => u.username === formData.username)) {
      setError('Tên đăng nhập đã tồn tại');
      return;
    }

    const newUser: UserProfile = {
      id: Date.now().toString(),
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('badminton_users', JSON.stringify(updatedUsers));
    
    onRegister(newUser);
    onClose();
    setFormData({ username: '', password: '', confirmPassword: '', fullName: '', phoneNumber: '' });
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Đăng Ký Tài Khoản</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Họ và tên hiển thị</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              value={formData.phoneNumber}
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu</label>
                <input
                type="password"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nhập lại mật khẩu</label>
                <input
                type="password"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 mt-4"
          >
            Tạo Tài Khoản
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Đã có tài khoản? {' '}
          <button onClick={onSwitchToLogin} className="text-emerald-600 font-bold hover:underline">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const Header = ({ 
  currentUser, 
  onOpenPostModal, 
  onOpenLogin, 
  onOpenRegister,
  onLogout 
}: { 
  currentUser: UserProfile | null;
  onOpenPostModal: () => void; 
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
}) => (
  <header className="bg-emerald-600 text-white shadow-lg sticky top-0 z-20">
    <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex flex-wrap gap-y-2 justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-white p-1.5 md:p-2 rounded-full text-emerald-600">
          <Users size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold leading-tight">Cầu Lông Vãn Lai</h1>
          <p className="text-[10px] md:text-xs text-emerald-100 hidden sm:block">Tìm kèo giao lưu nhanh chóng</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs text-emerald-200">Xin chào,</span>
                <span className="text-sm font-bold">{currentUser.fullName}</span>
             </div>
             <button 
              onClick={onLogout}
              className="bg-emerald-700 p-2 rounded-full hover:bg-emerald-800 transition-colors text-emerald-100"
              title="Đăng xuất"
             >
               <LogOut size={18} />
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenLogin}
              className="text-sm font-medium hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <LogIn size={16} />
              <span className="hidden xs:inline">Đăng nhập</span>
            </button>
            <button 
              onClick={onOpenRegister}
              className="bg-white/10 text-sm font-medium hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <UserPlus size={16} />
              <span className="hidden xs:inline">Đăng ký</span>
            </button>
          </div>
        )}

        <button 
          onClick={onOpenPostModal}
          className="bg-white text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-1 md:gap-2 shadow-sm ml-2"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Đăng Tin</span>
        </button>
      </div>
    </div>
  </header>
);

interface FilterBarProps {
  filters: { 
    date: string; 
    level: string; 
    location: string;
    gender: GenderFilter;
    maxCost: string;
  };
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 sticky top-[70px] md:top-[80px] z-10">
      <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold border-b border-slate-100 pb-2">
        <FilterIcon size={18} className="text-emerald-600" />
        <span>Bộ lọc tìm kiếm</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Location Search */}
        <div className="relative col-span-2 md:col-span-3 lg:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm tên sân hoặc địa chỉ..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all text-slate-900"
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
          />
        </div>

        {/* Date Filter */}
        <div>
          <input 
            type="date" 
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-600 transition-all text-slate-900"
            value={filters.date}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>

        {/* Gender Filter */}
        <div>
           <select 
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-600 transition-all appearance-none text-slate-900"
              value={filters.gender}
              onChange={(e) => onChange('gender', e.target.value)}
            >
              <option value="">Giới tính: Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
        </div>

        {/* Level Filter */}
        <div>
            <select 
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-600 transition-all appearance-none text-slate-900"
              value={filters.level}
              onChange={(e) => onChange('level', e.target.value)}
            >
              <option value="">Trình độ</option>
              {SKILL_LEVELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
        </div>

        {/* Cost Filter + Reset */}
        <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Phí tối đa"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-600 transition-all text-slate-900"
              value={filters.maxCost}
              onChange={(e) => onChange('maxCost', e.target.value)}
            />
            <button 
              onClick={onReset}
              className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-colors flex-shrink-0"
              title="Xóa bộ lọc"
            >
              <RotateCcw size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  currentUser: UserProfile | null;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onDelete, onToggleStatus }) => {
  const isFull = post.status === 'full';
  
  // Check ownership - if post has no creatorId, assume it's public/legacy, OR if current user matches
  const isOwner = currentUser && post.creatorId === currentUser.id;
  // For demo purposes, we might allow deleting legacy posts or just restriction
  // Let's restrict actions to owner only if creatorId exists. If not, anyone can (legacy behavior) or no one.
  // Better approach for this demo: If legacy (no creatorId), treat as owned by no one (or allow all if simple).
  // Strict mode: Only owner can edit/delete. Legacy posts: maybe anyone for now or hide actions.
  const canModify = isOwner || (!post.creatorId); // Allow legacy posts to be modified by anyone for now to avoid breaking old data UX

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatLevel = (min: SkillLevel, max: SkillLevel) => {
    if (min === max) return min;
    return `${min} - ${max}`;
  };

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 relative ${isFull ? 'bg-slate-100 border-slate-200 opacity-90' : 'bg-white border-slate-200'}`}>
      
      {/* Status Overlay/Badge if Full */}
      {isFull && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-slate-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
            ĐÃ ĐỦ KÈO
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className={`p-4 border-b flex justify-between items-start ${isFull ? 'bg-slate-200 border-slate-300' : 'bg-slate-50 border-slate-100'}`}>
        <div className={isFull ? 'opacity-60' : ''}>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {post.courtName}
          </h3>
          <div className="text-slate-500 text-sm flex items-center gap-1 mt-1">
            <MapPin size={14} />
            <span className="truncate max-w-[250px]">{post.address}</span>
          </div>
        </div>
        <div className={`flex flex-col items-end ${isFull ? 'opacity-60' : ''} ${isFull ? 'mr-20' : ''} `}> 
          <div className={`${isFull ? 'bg-slate-300 text-slate-600' : 'bg-emerald-100 text-emerald-800'} text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-colors`}>
            <Calendar size={12} />
            {formatDate(post.date)}
          </div>
          <div className="text-slate-600 text-xs font-medium mt-1 flex items-center gap-1">
            <Clock size={12} />
            {post.startTime} - {post.endTime}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className={`p-4 ${isFull ? 'opacity-75 grayscale-[0.5]' : ''} transition-all`}>
        {/* Requirements Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Male Section */}
          <div className={`p-3 rounded-xl border ${post.male.slots > 0 ? (isFull ? 'bg-slate-200 border-slate-300' : 'bg-blue-50 border-blue-100') : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <div className={`flex items-center gap-1 mb-2 font-semibold text-sm ${isFull ? 'text-slate-700' : 'text-blue-800'}`}>
              <User size={16} /> Nam
              {post.male.slots > 0 ? <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isFull ? 'bg-slate-300 text-slate-700' : 'bg-blue-200 text-blue-800'}`}>Cần {post.male.slots}</span> : <span className="ml-auto text-xs text-slate-400">Đủ</span>}
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1"><Trophy size={12}/> Trình:</span>
                <span className="font-medium">{formatLevel(post.male.minLevel, post.male.maxLevel)}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1"><DollarSign size={12}/> Phí/1h:</span>
                <span className="font-medium text-slate-900">{formatCurrency(post.male.cost)}</span>
              </div>
            </div>
          </div>

          {/* Female Section */}
          <div className={`p-3 rounded-xl border ${post.female.slots > 0 ? (isFull ? 'bg-slate-200 border-slate-300' : 'bg-pink-50 border-pink-100') : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <div className={`flex items-center gap-1 mb-2 font-semibold text-sm ${isFull ? 'text-slate-700' : 'text-pink-800'}`}>
              <User size={16} /> Nữ
              {post.female.slots > 0 ? <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isFull ? 'bg-slate-300 text-slate-700' : 'bg-pink-200 text-pink-800'}`}>Cần {post.female.slots}</span> : <span className="ml-auto text-xs text-slate-400">Đủ</span>}
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1"><Trophy size={12}/> Trình:</span>
                <span className="font-medium">{formatLevel(post.female.minLevel, post.female.maxLevel)}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1"><DollarSign size={12}/> Phí/1h:</span>
                <span className="font-medium text-slate-900">{formatCurrency(post.female.cost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {post.notes && (
          <div className={`p-3 rounded-lg border mb-4 ${isFull ? 'bg-slate-100 border-slate-200' : 'bg-yellow-50 border-yellow-100'}`}>
            <div className="flex items-start gap-2">
              <Info size={16} className={`${isFull ? 'text-slate-400' : 'text-yellow-600'} mt-0.5 shrink-0`} />
              <p className="text-sm text-slate-700 italic line-clamp-2">{post.notes}</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className={`flex items-center justify-between pt-2 border-t ${isFull ? 'border-slate-200' : 'border-slate-100'}`}>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Liên hệ</span>
            <span className={`text-sm font-bold ${isFull ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{post.contactName}</span>
          </div>
          <div className="flex gap-2">
            {canModify && (
              <>
                {/* Toggle Status Button */}
                <button
                  onClick={() => onToggleStatus(post.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors border ${
                    isFull 
                      ? 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                  title={isFull ? "Mở lại kèo" : "Đánh dấu đã đủ"}
                >
                  {isFull ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
                  <span className="hidden xs:inline">{isFull ? 'Tuyển lại' : 'Báo đủ'}</span>
                </button>

                <button 
                  onClick={() => onDelete(post.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Xóa tin"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
            
            {/* Call Button - Disabled if full */}
            {isFull ? (
               <button 
               disabled
               className="bg-slate-200 text-slate-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed flex items-center gap-2"
             >
               <Ban size={16} />
               Đã Đủ
             </button>
            ) : (
              <a 
                href={`tel:${post.contactPhone}`}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md active:scale-95"
              >
                <Phone size={16} />
                Gọi Ngay
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  currentUser
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  currentUser: UserProfile;
}) => {
  // Use string | number for inputs to allow empty strings while typing
  const [formData, setFormData] = useState({
    courtName: '',
    address: '',
    contactName: currentUser.fullName,
    contactPhone: currentUser.phoneNumber,
    // Fix: Use local time for date default instead of UTC
    date: (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    })(),
    startTime: '19:00',
    endTime: '21:00',
    maleSlots: '' as string | number,
    maleMinLevel: 'TB' as SkillLevel,
    maleMaxLevel: 'TB' as SkillLevel,
    maleCost: 50000 as string | number,
    femaleSlots: '' as string | number,
    femaleMinLevel: 'TB' as SkillLevel,
    femaleMaxLevel: 'TB' as SkillLevel,
    femaleCost: 40000 as string | number,
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      creatorId: currentUser.id,
      courtName: formData.courtName,
      address: formData.address,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      male: {
        slots: Number(formData.maleSlots) || 0,
        minLevel: formData.maleMinLevel,
        maxLevel: formData.maleMaxLevel,
        cost: Number(formData.maleCost) || 0
      },
      female: {
        slots: Number(formData.femaleSlots) || 0,
        minLevel: formData.femaleMinLevel,
        maxLevel: formData.femaleMaxLevel,
        cost: Number(formData.femaleCost) || 0
      },
      notes: formData.notes,
      status: 'open'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-left">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-slate-100 shrink-0">
            <h2 className="text-xl font-bold text-slate-800">Đăng Tin Tuyển Vãn Lai</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16}/> Thông tin sân & Liên hệ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  required
                  placeholder="Tên sân cầu (VD: Sân Viettel)" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                  value={formData.courtName}
                  onChange={e => setFormData({...formData, courtName: e.target.value})}
                />
                <input 
                  required
                  placeholder="Địa chỉ chi tiết" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
                <input 
                  required
                  placeholder="Tên người liên hệ" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                  value={formData.contactName}
                  onChange={e => setFormData({...formData, contactName: e.target.value})}
                />
                <input 
                  required
                  type="tel"
                  placeholder="Số điện thoại" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                  value={formData.contactPhone}
                  onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                <Clock size={16}/> Thời gian
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  required
                  type="date"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <div className="flex items-center gap-2 md:col-span-2">
                  <input 
                    required
                    type="time"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    required
                    type="time"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                <Users size={16}/> Yêu cầu người chơi
              </h3>
              
              {/* Male */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3">Tuyển Nam</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Số lượng</label>
                    <input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      value={formData.maleSlots}
                      onChange={e => setFormData({...formData, maleSlots: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Trình độ (Từ - Đến)</label>
                    <div className="flex gap-1">
                        <select 
                        className="w-1/2 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                        value={formData.maleMinLevel}
                        onChange={e => setFormData({...formData, maleMinLevel: e.target.value as SkillLevel})}
                        >
                        {SKILL_LEVELS.map(l => <option key={`m-min-${l}`} value={l}>{l}</option>)}
                        </select>
                        <select 
                        className="w-1/2 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                        value={formData.maleMaxLevel}
                        onChange={e => setFormData({...formData, maleMaxLevel: e.target.value as SkillLevel})}
                        >
                        {SKILL_LEVELS.map(l => <option key={`m-max-${l}`} value={l}>{l}</option>)}
                        </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Chi phí / 1h</label>
                    <input 
                      type="number" 
                      step="1000"
                      placeholder="50000"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      value={formData.maleCost}
                      onChange={e => setFormData({...formData, maleCost: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Female */}
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                <h4 className="font-semibold text-pink-800 mb-3">Tuyển Nữ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Số lượng</label>
                    <input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      value={formData.femaleSlots}
                      onChange={e => setFormData({...formData, femaleSlots: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Trình độ (Từ - Đến)</label>
                    <div className="flex gap-1">
                        <select 
                        className="w-1/2 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                        value={formData.femaleMinLevel}
                        onChange={e => setFormData({...formData, femaleMinLevel: e.target.value as SkillLevel})}
                        >
                        {SKILL_LEVELS.map(l => <option key={`f-min-${l}`} value={l}>{l}</option>)}
                        </select>
                        <select 
                        className="w-1/2 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                        value={formData.femaleMaxLevel}
                        onChange={e => setFormData({...formData, femaleMaxLevel: e.target.value as SkillLevel})}
                        >
                        {SKILL_LEVELS.map(l => <option key={`f-max-${l}`} value={l}>{l}</option>)}
                        </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Chi phí / 1h</label>
                    <input 
                      type="number" 
                      step="1000"
                      placeholder="40000"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      value={formData.femaleCost}
                      onChange={e => setFormData({...formData, femaleCost: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Ghi chú thêm</label>
              <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 h-24 text-slate-900"
                placeholder="Vui lòng ghi rõ loại cầu sử dụng, tính chất nhóm (vui vẻ, try hard)..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Đăng Tin Ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [filters, setFilters] = useState<{
    date: string;
    level: string;
    location: string;
    gender: GenderFilter;
    maxCost: string;
  }>({
    date: '',
    level: '',
    location: '',
    gender: '',
    maxCost: ''
  });

  // Check Login
  useEffect(() => {
    const savedUser = localStorage.getItem('badminton_currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem('badminton_posts');
    if (saved) {
      try {
        const parsedPosts = JSON.parse(saved);
        // Migrate data: ensure status and min/max levels exist
        const migratedPosts = parsedPosts.map((p: any) => ({
          ...p,
          status: p.status || 'open',
          male: {
            ...p.male,
            minLevel: p.male.minLevel || p.male.level || 'TB',
            maxLevel: p.male.maxLevel || p.male.level || 'TB',
          },
          female: {
            ...p.female,
            minLevel: p.female.minLevel || p.female.level || 'TB',
            maxLevel: p.female.maxLevel || p.female.level || 'TB',
          }
        }));
        setPosts(migratedPosts);
      } catch (e) {
        setPosts(MOCK_POSTS);
      }
    } else {
      setPosts(MOCK_POSTS);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('badminton_posts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('badminton_currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('badminton_currentUser');
  };

  const handleAddPost = (newPostData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: 'open' // Ensure new posts are open
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa tin này?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'open' ? 'full' : 'open' };
      }
      return p;
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ date: '', level: '', location: '', gender: '', maxCost: '' });
  };

  const openCreatePost = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const filteredPosts = posts.filter(post => {
    // Location/Name Search (case insensitive)
    const searchTerm = filters.location.toLowerCase().trim();
    const matchLocation = !searchTerm || 
      post.courtName.toLowerCase().includes(searchTerm) || 
      post.address.toLowerCase().includes(searchTerm);

    // Date Search (exact match)
    const matchDate = !filters.date || post.date === filters.date;

    // Advanced Level, Gender, and Cost Logic
    const filterLevelIndex = filters.level ? getSkillLevelIndex(filters.level) : -1;
    const maxCostNum = filters.maxCost ? Number(filters.maxCost) : Infinity;

    // Check Male Requirements
    // Must have slots AND (no gender filter OR gender is male) AND (no level filter OR level matches) AND (cost <= maxCost)
    const isMaleMatch = post.male.slots > 0 && 
      (!filters.gender || filters.gender === 'male') &&
      (!filters.level || (getSkillLevelIndex(post.male.minLevel) <= filterLevelIndex && getSkillLevelIndex(post.male.maxLevel) >= filterLevelIndex)) &&
      (post.male.cost <= maxCostNum);

    // Check Female Requirements
    // Must have slots AND (no gender filter OR gender is female) AND (no level filter OR level matches) AND (cost <= maxCost)
    const isFemaleMatch = post.female.slots > 0 && 
      (!filters.gender || filters.gender === 'female') &&
      (!filters.level || (getSkillLevelIndex(post.female.minLevel) <= filterLevelIndex && getSkillLevelIndex(post.female.maxLevel) >= filterLevelIndex)) &&
      (post.female.cost <= maxCostNum);

    // Post is valid if either Male OR Female conditions are met
    const matchCriteria = isMaleMatch || isFemaleMatch;

    return matchLocation && matchDate && matchCriteria;
  });

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <Header 
        currentUser={currentUser}
        onOpenPostModal={openCreatePost}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        <FilterBar 
          filters={filters} 
          onChange={handleFilterChange} 
          onReset={resetFilters} 
        />

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Trophy size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Chưa có bài đăng nào</h3>
            <p className="text-slate-500 mt-2 mb-6">Hãy là người đầu tiên tạo kèo giao lưu!</p>
            <button 
              onClick={openCreatePost}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-all"
            >
              Đăng Tin Mới
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Không tìm thấy kết quả</h3>
            <p className="text-slate-500 mt-1 mb-4">Thử thay đổi bộ lọc tìm kiếm của bạn.</p>
            <button 
              onClick={resetFilters}
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={currentUser}
                onDelete={handleDeletePost} 
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </main>

      {currentUser && (
        <CreatePostModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddPost} 
          currentUser={currentUser}
        />
      )}

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleLogin}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
