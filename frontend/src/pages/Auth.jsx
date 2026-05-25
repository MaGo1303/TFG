import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.error || 'Error de autenticación. Verifica tus datos.');
            setLoading(false);
        }
    };

    return (
        <section className="hero page-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="hero-bg" style={{ filter: 'brightness(0.4)' }}></div>
            <div className="hero-overlay"></div>
            
            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px', padding: '0 20px' }}>
                <div className="reveal-scale in" style={{ 
                    background: 'var(--card)', 
                    borderRadius: 'var(--r)', 
                    padding: '40px', 
                    boxShadow: 'var(--shadow-m)',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--text)', marginBottom: '8px' }}>
                            {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
                        </h2>
                        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>
                            {isLogin ? 'Accede a tu cuenta en RoyalRent' : 'Únete a nuestra plataforma exclusiva'}
                        </p>
                    </div>

                    {error && (
                        <div style={{ background: '#fff0f0', color: '#d32f2f', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center', border: '1px solid #ffcdd2' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {!isLogin && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>NOMBRE COMPLETO</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                    placeholder="Ej. Alejandro Valdés"
                                />
                            </div>
                        )}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>CORREO ELECTRÓNICO</label>
                            <input 
                                type="email" 
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>CONTRASEÑA</label>
                            <input 
                                type="password" 
                                required 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-gold" 
                            disabled={loading}
                            style={{ width: '100%', marginTop: '10px', padding: '14px', fontSize: '1rem', border: 'none', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', transform: loading ? 'scale(0.98)' : 'scale(1)' }}
                        >
                            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--sans)' }}
                        >
                            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                            <span style={{ color: 'var(--accent)', fontWeight: '600' }}>
                                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
