import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    return (
        <section className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="hero-bg" style={{ filter: 'brightness(0.4)' }}></div>
            <div className="hero-overlay"></div>

            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--r)',
                        padding: '40px',
                        boxShadow: 'var(--shadow-m)',
                        border: '1px solid var(--border)',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--text)', marginBottom: '8px' }}>
                            {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
                        </h2>
                        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>
                            {isLogin ? 'Accede a tu cuenta en RoyalRent' : 'Únete a nuestra plataforma exclusiva'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ background: '#fff0f0', color: '#d32f2f', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center', border: '1px solid #ffcdd2', overflow: 'hidden' }}
                            >
                                <i className="fa-solid fa-circle-exclamation"></i> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>NOMBRE COMPLETO</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                        placeholder="Ej. Alejandro Valdés"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px' }}>CORREO ELECTRÓNICO</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-gold"
                            disabled={loading}
                            style={{ width: '100%', marginTop: '10px', padding: '14px', fontSize: '1rem', border: 'none', cursor: 'pointer', borderRadius: '6px', transform: loading ? 'scale(0.98)' : 'scale(1)' }}
                        >
                            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                        <button
                            onClick={toggleMode}
                            style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--sans)' }}
                        >
                            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                            <span style={{ color: 'var(--accent)', fontWeight: '600' }}>
                                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
