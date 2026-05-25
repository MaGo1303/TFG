import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useScrollReveal } from '../hooks/useAnimations';

export default function Profile() {
    useScrollReveal();
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) return;

        // Fetch history
        axios.get(`${import.meta.env.VITE_API_URL}/orders/history`)
            .then(res => setHistory(res.data))
            .catch(err => console.error(err));
    }, [user, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/user/profile`, formData);
            setMessage('Perfil actualizado correctamente');
            setUser({ ...user, name: formData.name, email: formData.email });
        } catch {
            setMessage('Error al actualizar');
        }
    };

    if (!user) return null;

    return (
        <div className="page-fade-in">
            <header className="page-header reveal" style={{ paddingBottom: '30px' }}>
                <div className="wrap">
                    <div className="breadcrumb">
                        <Link to="/"><i className="fa-solid fa-house"></i> Inicio</Link>
                        <span>/</span>
                        <span>Mi Perfil</span>
                    </div>
                    <h1>Mi <em>Perfil</em></h1>
                    <p>Gestiona tu información personal y revisa tu historial de compras.</p>
                </div>
            </header>

            <main className="cat-main" style={{ minHeight: '60vh' }}>
                <div className="wrap">
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        
                        {/* LEFT: UPDATE PROFILE */}
                        <div className="reveal-left" style={{ flex: '1', minWidth: '320px', background: 'var(--card)', padding: '35px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-m)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>Actualizar Datos</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Cuenta RoyalRent</span>
                                </div>
                            </div>

                            {message && (
                                <div style={{ background: message.includes('Error') ? '#fff0f0' : '#f0fff4', color: message.includes('Error') ? '#d32f2f' : '#2e7d32', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '20px', border: `1px solid ${message.includes('Error') ? '#ffcdd2' : '#c8e6c9'}` }}>
                                    <i className={message.includes('Error') ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check"}></i> {message}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>NOMBRE</label>
                                    <input 
                                        type="text" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        required
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>EMAIL</label>
                                    <input 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={e => setFormData({...formData, email: e.target.value})} 
                                        required
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>NUEVA CONTRASEÑA (OPCIONAL)</label>
                                    <input 
                                        type="password" 
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})} 
                                        placeholder="Deja en blanco para no cambiar"
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                    />
                                </div>
                                <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Guardar Cambios</button>
                            </form>

                            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                                <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: HISTORY */}
                        <div className="reveal-right" style={{ flex: '2', minWidth: '320px' }}>
                            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '25px' }}>Historial de Reservas</h3>
                            
                            {history.length === 0 ? (
                                <div style={{ background: 'var(--card)', padding: '40px', borderRadius: 'var(--r)', border: '1px solid var(--border)', textAlign: 'center' }}>
                                    <i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: '2.5rem', color: 'var(--border-d)', marginBottom: '15px' }}></i>
                                    <p style={{ color: 'var(--text-2)', fontSize: '1rem' }}>Aún no tienes reservas.</p>
                                    <Link to="/services" className="btn-listing" style={{ marginTop: '15px', display: 'inline-block' }}>Explorar Catálogo</Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {history.map(order => (
                                        <div key={order.id} style={{ background: 'var(--card)', borderRadius: 'var(--r)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                                            <div style={{ background: 'var(--bg2)', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Referencia</span>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)' }}>#{order.id.toString().padStart(5, '0')}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Pagado</span>
                                                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }}>{order.total_price}€</div>
                                                </div>
                                            </div>
                                            <div style={{ padding: '20px 25px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    {order.items.map(item => (
                                                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            <div style={{ width: '50px', height: '40px', background: `url('${item.image_url}') center/cover no-repeat var(--bg)`, borderRadius: '4px', border: '1px solid var(--border)' }}></div>
                                                            <div style={{ flex: 1 }}>
                                                                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)' }}>{item.name}</h4>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{item.type.toUpperCase()}</span>
                                                            </div>
                                                            <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                                                                <span style={{ color: 'var(--text-3)', marginRight: '10px' }}>{item.quantity}x</span>
                                                                <span style={{ fontWeight: '500', color: 'var(--text)' }}>{item.price}€</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
