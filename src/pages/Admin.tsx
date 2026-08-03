import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Phone, Mail, X, TrendingUp, Users, ShoppingBag, MessageSquare, Watch, LayoutDashboard, Settings, LogOut, Package, ChevronRight, Edit3, Menu, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/products';

export const AdminDashboard = ({ productList, setProductList, customizationRequests }: any) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'requests' | 'users'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRequests: 0, revenue: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, image: '1000113140.jpg', region: '', category: 'Ancient Architecture'
  });
  
  const navigate = useNavigate();

  const getImageUrl = (img: string) => {
    if (!img) return '';
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return `/${img}`;
  };

  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = 'flex';
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('dharohar_token');
        if (!token) return;
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('dharohar_token');
        if (!token) return;
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(await res.json());
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const token = localStorage.getItem('dharohar_token');
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map(u => u._id === updated._id ? updated : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, description: product.description, price: product.price, image: product.image, region: product.region, category: product.category
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, image: '1000113140.jpg', region: '', category: 'Ancient Architecture' });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('dharohar_token');
      const priceStr = `₹ ${formData.price.toLocaleString()}`;
      
      if (editingProduct) {
        const payload = { ...formData, priceStr };
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setProductList((prev: any) => prev.map((p: any) => p.id === updated.id ? updated : p));
        }
      } else {
        const newId = Math.max(0, ...productList.map((p: any) => p.id)) + 1;
        const payload = { id: newId, ...formData, priceStr };
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const saved = await res.json();
          setProductList((prev: any) => [saved, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('dharohar_token');
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setProductList((prev: any) => prev.filter((p: any) => p.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#0c0a09] text-stone-300 font-sans overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-stone-950 border-r border-stone-800/50 flex flex-col z-40 shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-amber-500 tracking-wider">Dharohar</h1>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-mono mt-1">Admin Portal</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-stone-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <button 
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'overview' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          
          <button 
            onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'products' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'}`}
          >
            <Package size={18} /> Products
          </button>
          
          <button 
            onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'requests' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'}`}
          >
            <MessageSquare size={18} /> Requests
          </button>

          <button 
            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'users' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'}`}
          >
            <Users size={18} /> Users
          </button>
        </nav>

        <div className="p-4 border-t border-stone-800/50">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-900 transition-all duration-300">
            <LogOut size={18} className="rotate-180" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/4 w-full md:w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
        
        {/* Top Header */}
        <header className="h-16 md:h-20 border-b border-stone-800/30 bg-stone-950/40 backdrop-blur-md flex items-center justify-between px-4 md:px-10 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-stone-400 hover:text-white p-1">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="text-stone-500 hidden sm:inline">Admin</span>
              <ChevronRight size={14} className="text-stone-600 hidden sm:inline" />
              <span className="text-amber-400 font-medium capitalize">{activeTab}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield size={14} />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 z-10 custom-scrollbar">
          
          {activeTab === 'overview' && (
            <div className="animate-[fade-in-up_0.4s_ease-out] max-w-6xl mx-auto space-y-8">
              <div className="mb-6 mt-2 md:mt-0">
                <h2 className="text-2xl md:text-3xl font-serif text-white">Welcome back.</h2>
                <p className="text-sm md:text-base text-stone-400 mt-1">Here is the latest snapshot of your business.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:bg-stone-900/80 hover:border-amber-500/30 transition-all duration-500 shadow-lg">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
                  <div className="text-amber-500/50 group-hover:text-amber-400 transition-colors mb-4"><TrendingUp size={24} className="md:w-7 md:h-7" /></div>
                  <h3 className="text-stone-400 font-mono text-[10px] uppercase tracking-widest mb-1">Total Revenue</h3>
                  <p className="text-2xl md:text-3xl font-serif text-white">₹ {((stats?.revenue) || 0).toLocaleString()}</p>
                </div>
                
                <div className="bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:bg-stone-900/80 hover:border-amber-500/30 transition-all duration-500 shadow-lg">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                  <div className="text-blue-500/50 group-hover:text-blue-400 transition-colors mb-4"><Package size={24} className="md:w-7 md:h-7" /></div>
                  <h3 className="text-stone-400 font-mono text-[10px] uppercase tracking-widest mb-1">Active Products</h3>
                  <p className="text-2xl md:text-3xl font-serif text-white">{stats.totalProducts}</p>
                </div>

                <div className="bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:bg-stone-900/80 hover:border-amber-500/30 transition-all duration-500 shadow-lg">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                  <div className="text-green-500/50 group-hover:text-green-400 transition-colors mb-4"><ShoppingBag size={24} className="md:w-7 md:h-7" /></div>
                  <h3 className="text-stone-400 font-mono text-[10px] uppercase tracking-widest mb-1">Total Orders</h3>
                  <p className="text-2xl md:text-3xl font-serif text-white">{stats.totalOrders}</p>
                </div>

                <div className="bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:bg-stone-900/80 hover:border-amber-500/30 transition-all duration-500 shadow-lg">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                  <div className="text-purple-500/50 group-hover:text-purple-400 transition-colors mb-4"><Users size={24} className="md:w-7 md:h-7" /></div>
                  <h3 className="text-stone-400 font-mono text-[10px] uppercase tracking-widest mb-1">Registered Users</h3>
                  <p className="text-2xl md:text-3xl font-serif text-white">{stats.totalUsers}</p>
                </div>
              </div>

              {/* Recent Activity Mini-Panel */}
              <div className="mt-8 bg-stone-900/30 backdrop-blur-sm border border-stone-800/50 rounded-2xl p-5 md:p-8">
                 <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-lg font-serif text-white">Action Center</h3>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-stone-950/50 border border-stone-800/50 p-5 md:p-6 rounded-xl flex items-center justify-between hover:border-amber-500/20 transition-colors">
                       <div>
                         <p className="text-stone-400 text-xs md:text-sm mb-1">Pending Customizations</p>
                         <p className="text-xl md:text-2xl font-serif text-white">{stats.totalRequests}</p>
                       </div>
                       <button onClick={() => setActiveTab('requests')} className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-500 hover:text-stone-950 transition-all">Review</button>
                    </div>
                    <div className="bg-stone-950/50 border border-stone-800/50 p-5 md:p-6 rounded-xl flex items-center justify-between hover:border-amber-500/20 transition-colors">
                       <div>
                         <p className="text-stone-400 text-xs md:text-sm mb-1">Manage Catalog</p>
                         <p className="text-xl md:text-2xl font-serif text-white">{stats.totalProducts} Items</p>
                       </div>
                       <button onClick={() => setActiveTab('products')} className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-500 hover:text-stone-950 transition-all">Go to Catalog</button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-[fade-in-up_0.4s_ease-out] max-w-7xl mx-auto">
              <div className="mb-6 md:mb-8 mt-2 md:mt-0">
                <h2 className="text-2xl md:text-3xl font-serif text-white">Registered Users</h2>
                <p className="text-sm md:text-base text-stone-400 mt-2">Manage customer accounts and assign administrative privileges.</p>
              </div>

              <div className="bg-stone-900/30 backdrop-blur-md border border-stone-800/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-stone-950/80 text-stone-400 font-mono text-[10px] uppercase tracking-widest border-b border-stone-800/50">
                      <tr>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Phone</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/30">
                      {users.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No users found.</td></tr>
                      ) : users.map((u: any) => (
                        <tr key={u._id} className="hover:bg-stone-800/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-bold text-xs uppercase border border-stone-700">{u.name?.charAt(0) || 'U'}</div>
                              <span className="font-medium text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-stone-400">{u.email}</td>
                          <td className="px-6 py-4 text-stone-400">{u.phone}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-stone-800/50 text-stone-400 border border-stone-700/50'}`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleRoleChange(u._id, u.role)}
                              className="text-xs font-medium text-stone-400 hover:text-amber-400 bg-stone-900 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg border border-stone-800 hover:border-amber-500/30 transition-all"
                            >
                              {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-[fade-in-up_0.4s_ease-out] max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 md:mb-8 mt-2 md:mt-0">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-white">Product Catalog</h2>
                  <p className="text-sm md:text-base text-stone-400 mt-2">Manage your inventory, pricing, and collections.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="w-full sm:w-auto justify-center bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95">
                  <Plus size={18} /> Add New Product
                </button>
              </div>

              <div className="bg-stone-900/30 backdrop-blur-md border border-stone-800/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-stone-950/80 text-stone-400 font-mono text-[10px] uppercase tracking-widest border-b border-stone-800/50">
                      <tr>
                        <th className="px-4 md:px-6 py-4 font-medium">Product</th>
                        <th className="px-4 md:px-6 py-4 font-medium hidden sm:table-cell">Category</th>
                        <th className="px-4 md:px-6 py-4 font-medium">Price</th>
                        <th className="px-4 md:px-6 py-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/30">
                      {productList.map((p: any) => (
                        <tr key={p.id} className="hover:bg-stone-800/40 transition-colors group">
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3 md:gap-4">
                              <img 
                                src={getImageUrl(p.image)} 
                                alt={p.name} 
                                className="w-10 h-10 rounded-lg object-cover bg-stone-800 border border-stone-700 shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23292524'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='10' text-anchor='middle' fill='%23a8a29e' dy='.3em'%3EWatch%3C/text%3E%3C/svg%3E"; }} 
                              />
                              <div>
                                <p className="font-medium text-white max-w-[150px] md:max-w-xs truncate">{p.name}</p>
                                <p className="text-[10px] text-stone-500 font-mono">ID: {p.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                            <span className="bg-stone-800/50 text-stone-300 px-3 py-1 rounded-full text-xs border border-stone-700/50">{p.category}</span>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-amber-400 font-medium">{p.priceStr}</td>
                          <td className="px-4 md:px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 md:opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleOpenModal(p)} className="p-2 bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 rounded-lg transition-colors" title="Edit">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="animate-[fade-in-up_0.4s_ease-out] max-w-5xl mx-auto">
              <div className="mb-6 md:mb-8 mt-2 md:mt-0">
                <h2 className="text-2xl md:text-3xl font-serif text-white">Customization Requests</h2>
                <p className="text-sm md:text-base text-stone-400 mt-2">Manage bespoke timepiece inquiries from clients.</p>
              </div>

              {!Array.isArray(customizationRequests) || customizationRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4 bg-stone-900/20 border border-stone-800/50 rounded-3xl border-dashed">
                  <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center text-stone-600 mb-4">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-lg text-stone-300 font-serif mb-1">No pending requests</h3>
                  <p className="text-sm text-stone-500 text-center">New customization inquiries will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customizationRequests.map((req: any, idx: number) => (
                    <div key={idx} className="bg-stone-900/40 backdrop-blur-md border border-stone-800/50 rounded-2xl p-5 md:p-6 hover:border-amber-500/30 transition-all duration-300">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="w-full md:w-1/3 md:border-r border-b md:border-b-0 border-stone-800/50 pb-4 md:pb-0 md:pr-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-serif text-lg font-bold border border-amber-500/20 shrink-0">
                              {req.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-base md:text-lg">{req.name}</h3>
                              <div className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">{req.date}</div>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-stone-400">
                            <p className="flex items-center gap-2"><Phone size={14} className="text-stone-500" /> {req.phone}</p>
                            {req.email && <p className="flex items-center gap-2"><Mail size={14} className="text-stone-500" /> {req.email}</p>}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="inline-block px-3 py-1 bg-stone-950 border border-stone-800 rounded-lg text-[10px] md:text-xs font-mono text-amber-500 uppercase tracking-wider mb-3">
                            Target Model: {req.watchModel}
                          </div>
                          <div className="bg-stone-950/50 rounded-xl p-4 md:p-5 border border-stone-800/30 relative">
                            <MessageSquare size={16} className="absolute top-4 md:top-5 right-4 md:right-5 text-stone-700" />
                            <p className="text-stone-300 text-xs md:text-sm leading-relaxed pr-6 md:pr-8">"{req.customNotes}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Premium Slide-out Side Panel for Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full md:w-auto md:max-w-md w-full bg-stone-950 h-full border-l border-stone-800 shadow-2xl flex flex-col animate-[slide-in-right_0.3s_ease-out]">
            
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-stone-800/50 bg-stone-900/20">
              <h3 className="text-xl md:text-2xl font-serif text-amber-400">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-stone-500">Product Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="e.g. Royal Heritage Watch" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-stone-500">Price (₹)</label>
                <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-stone-900/50 border border-stone-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-stone-500">Category</label>
                <div className="relative">
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-xl p-3 text-sm md:text-base text-white appearance-none focus:outline-none focus:border-amber-500/50 transition-colors">
                    {categories.map(c => c !== "All Watches" && <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none rotate-90" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-stone-500">Region / Heritage</label>
                <input required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} placeholder="e.g. Gujarat, India" className="w-full bg-stone-900/50 border border-stone-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-stone-500">Image Filename</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <input required value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="image.jpg" />
                  </div>
                  {formData.image && (
                    <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 overflow-hidden shrink-0">
                       <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-stone-500">Description</label>
                <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-xl p-3 text-sm md:text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none" placeholder="Detail the craftsmanship..." />
              </div>
            </form>

            <div className="p-4 md:p-6 border-t border-stone-800/50 bg-stone-950">
              <button onClick={handleSaveProduct} disabled={isSaving} className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 py-3 md:py-4 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2">
                {isSaving ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Create Product')}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
