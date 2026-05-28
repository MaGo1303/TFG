import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
    { key: 'overview', label: 'Resumen', icon: 'fa-solid fa-chart-pie' },
    { key: 'users', label: 'Usuarios', icon: 'fa-solid fa-users' },
    { key: 'orders', label: 'Pedidos', icon: 'fa-solid fa-receipt' },
    { key: 'items', label: 'Vehículos', icon: 'fa-solid fa-car-side' },
    { key: 'messages', label: 'Mensajes', icon: 'fa-solid fa-envelope' },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`);
            setStats(res.data);
        } catch { console.error('Error fetching stats'); }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
            setUsers(res.data);
        } catch { console.error('Error fetching users'); }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`);
            setOrders(res.data);
        } catch { console.error('Error fetching orders'); }
    };

    const fetchItems = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/items`);
            setItems(res.data);
        } catch { console.error('Error fetching items'); }
    };

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/messages`);
            setMessages(res.data);
        } catch { console.error('Error fetching messages'); }
    };

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchUsers(), fetchOrders(), fetchItems(), fetchMessages()]);
            setLoading(false);
        };
        loadAll();
    }, []);

    const deleteUser = async (id) => {
        if (!confirm('¿Eliminar este usuario?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) { alert(err.response?.data?.error || 'Error'); }
    };

    const deleteItem = async (id) => {
        if (!confirm('¿Eliminar este vehículo?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/items/${id}`);
            setItems(items.filter(i => i.id !== id));
        } catch { alert('Error al eliminar'); }
    };

    const toggleItemAvailability = async (item) => {
        const nextAvailability = !Boolean(item.is_available);
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/admin/items/${item.id}/availability`, {
                is_available: nextAvailability,
            });
            setItems(items.map(i => (
                i.id === item.id ? { ...i, is_available: nextAvailability ? 1 : 0 } : i
            )));
            await fetchStats();
        } catch {
            alert('Error al actualizar disponibilidad');
        }
    };

    const deleteMessage = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/messages/${id}`);
            setMessages(messages.filter(m => m.id !== id));
        } catch { alert('Error al eliminar'); }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatDateTime = (d) => new Date(d).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (loading) {
        return (
            <div>
                <header className="page-header" style={{ paddingBottom: '30px' }}>
                    <div className="wrap">
                        <div className="breadcrumb"><Link to="/"><i className="fa-solid fa-house"></i> Inicio</Link><span>/</span><span>Admin</span></div>
                        <h1>Panel de <em>Administración</em></h1>
                    </div>
                </header>
                <main className="cat-main" style={{ minHeight: '60vh' }}>
                    <div className="wrap">
                        <div className="admin-loading"><div className="services-spinner"></div><span>Cargando dashboard...</span></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <header className="page-header" style={{ paddingBottom: '30px' }}>
                <div className="wrap">
                    <div className="breadcrumb"><Link to="/"><i className="fa-solid fa-house"></i> Inicio</Link><span>/</span><span>Admin</span></div>
                    <h1>Panel de <em>Administración</em></h1>
                    <p>Gestiona usuarios, pedidos, vehículos y mensajes desde un solo lugar.</p>
                </div>
            </header>

            <main className="cat-main" style={{ minHeight: '60vh' }}>
                <div className="wrap">
                    <div className="admin-tabs">
                        {TABS.map(tab => (
                            <button key={tab.key} className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
                                <i className={tab.icon}></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

                            {activeTab === 'overview' && stats && (
                                <div>
                                    <div className="admin-stats-grid">
                                        <div className="admin-stat-card">
                                            <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><i className="fa-solid fa-users"></i></div>
                                            <div className="stat-info"><span className="stat-value">{stats.totals.users}</span><span className="stat-label">Usuarios</span></div>
                                        </div>
                                        <div className="admin-stat-card">
                                            <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}><i className="fa-solid fa-receipt"></i></div>
                                            <div className="stat-info"><span className="stat-value">{stats.totals.orders}</span><span className="stat-label">Pedidos</span></div>
                                        </div>
                                        <div className="admin-stat-card">
                                            <div className="stat-icon" style={{ background: 'rgba(197,160,89,0.1)', color: 'var(--accent)' }}><i className="fa-solid fa-euro-sign"></i></div>
                                            <div className="stat-info"><span className="stat-value">{stats.totals.revenue.toLocaleString('es-ES')}€</span><span className="stat-label">Ingresos</span></div>
                                        </div>
                                        <div className="admin-stat-card">
                                            <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}><i className="fa-solid fa-car-side"></i></div>
                                            <div className="stat-info"><span className="stat-value">{stats.totals.items}</span><span className="stat-label">Vehículos</span></div>
                                        </div>
                                        <div className="admin-stat-card">
                                            <div className="stat-icon" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}><i className="fa-solid fa-envelope"></i></div>
                                            <div className="stat-info"><span className="stat-value">{stats.totals.messages}</span><span className="stat-label">Mensajes</span></div>
                                        </div>
                                    </div>

                                    <div className="admin-grid-2col">
                                        <div className="admin-card">
                                            <h3><i className="fa-solid fa-clock"></i> Últimos pedidos</h3>
                                            <div className="admin-mini-list">
                                                {stats.recentOrders.map(o => (
                                                    <div key={o.id} className="admin-mini-item">
                                                        <div>
                                                            <strong>#{o.id}</strong>
                                                            <span className="admin-mini-sub">{o.user_name}</span>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span className="admin-mini-value">{parseFloat(o.total_price)}€</span>
                                                            <span className="admin-mini-sub">{formatDate(o.created_at)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {stats.recentOrders.length === 0 && <p className="admin-empty-text">Sin pedidos aún</p>}
                                            </div>
                                        </div>
                                        <div className="admin-card">
                                            <h3><i className="fa-solid fa-user-plus"></i> Últimos usuarios</h3>
                                            <div className="admin-mini-list">
                                                {stats.recentUsers.map(u => (
                                                    <div key={u.id} className="admin-mini-item">
                                                        <div>
                                                            <strong>{u.name}</strong>
                                                            <span className="admin-mini-sub">{u.email}</span>
                                                        </div>
                                                        <span className={`admin-badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h3><i className="fa-solid fa-users"></i> Usuarios ({users.length})</h3>
                                    </div>
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Registro</th><th></th></tr>
                                            </thead>
                                            <tbody>
                                                {users.map(u => (
                                                    <tr key={u.id}>
                                                        <td>#{u.id}</td>
                                                        <td>{u.name}</td>
                                                        <td>{u.email}</td>
                                                        <td><span className={`admin-badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                                                        <td>{formatDate(u.created_at)}</td>
                                                        <td>{u.role !== 'admin' && <button className="admin-btn-icon danger" onClick={() => deleteUser(u.id)} title="Eliminar"><i className="fa-solid fa-trash"></i></button>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h3><i className="fa-solid fa-receipt"></i> Pedidos ({orders.length})</h3>
                                    </div>
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr><th>ID</th><th>Cliente</th><th>Vehículos</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(o => (
                                                    <tr key={o.id}>
                                                        <td>#{o.id}</td>
                                                        <td><div>{o.user_name}</div><div className="admin-mini-sub">{o.user_email}</div></td>
                                                        <td>{o.items?.map(i => i.name).join(', ')}</td>
                                                        <td><strong>{parseFloat(o.total_price)}€</strong></td>
                                                        <td><span className={`admin-badge badge-${o.status}`}>{o.status}</span></td>
                                                        <td>{formatDate(o.created_at)}</td>
                                                    </tr>
                                                ))}
                                                {orders.length === 0 && <tr><td colSpan="6" className="admin-empty-text">Sin pedidos</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'items' && (
                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h3><i className="fa-solid fa-car-side"></i> Vehículos ({items.length})</h3>
                                    </div>
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr><th>ID</th><th>Nombre</th><th>Tipo</th><th>Precio/día</th><th></th></tr>
                                            </thead>
                                            <tbody>
                                                {items.map(i => (
                                                    <tr key={i.id}>
                                                        <td>#{i.id}</td>
                                                        <td>{i.name}</td>
                                                        <td><span className={`admin-badge badge-${i.type}`}>{i.type}</span></td>
                                                        <td><strong>{parseFloat(i.price)}€</strong></td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    className={`admin-btn-icon ${Boolean(i.is_available) ? 'success' : 'danger-state'}`}
                                                                    onClick={() => toggleItemAvailability(i)}
                                                                    title={Boolean(i.is_available) ? 'Disponible. Clic para marcar como no disponible' : 'No disponible. Clic para marcar como disponible'}
                                                                >
                                                                    <i className={`fa-solid ${Boolean(i.is_available) ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                                </button>
                                                                <button className="admin-btn-icon danger" onClick={() => deleteItem(i.id)} title="Eliminar"><i className="fa-solid fa-trash"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'messages' && (
                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h3><i className="fa-solid fa-envelope"></i> Mensajes ({messages.length})</h3>
                                    </div>
                                    <div className="admin-messages-list">
                                        {messages.map(m => (
                                            <div key={m.id} className="admin-message-card">
                                                <div className="admin-message-header">
                                                    <div>
                                                        <strong>{m.name}</strong>
                                                        <span className="admin-mini-sub" style={{ marginLeft: '8px' }}>{m.email}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span className="admin-mini-sub">{formatDateTime(m.created_at)}</span>
                                                        <button className="admin-btn-icon danger" onClick={() => deleteMessage(m.id)} title="Eliminar"><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </div>
                                                <p className="admin-message-body">{m.message}</p>
                                            </div>
                                        ))}
                                        {messages.length === 0 && <p className="admin-empty-text">Sin mensajes</p>}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
