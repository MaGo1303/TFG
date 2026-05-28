import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const menuVariants = {
    hidden: {
        opacity: 0,
        x: '100%',
        transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
    },
};

const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: 0.05 + i * 0.05, duration: 0.3, ease: [0.23, 1, 0.32, 1] },
    }),
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const navItems = [
        { to: '/services', label: 'Servicios' },
        ...(user
            ? [
                { to: '/profile', label: user.name, icon: <User size={18} style={{ marginRight: 5, verticalAlign: 'middle' }} /> },
                ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: <Shield size={18} style={{ marginRight: 5, verticalAlign: 'middle' }} /> }] : []),
            ]
            : [{ to: '/auth', label: 'Login', className: 'btn-gold', style: { padding: '8px 20px', borderRadius: '4px' } }]
        ),
    ];

    return (
        <nav className={`nav nav-hidden-top ${scrolled ? 'solid' : ''}`} id="nav">
            <div className="nav-inner">
                <Link to="/" className="logo">
                    <img src="/img/royal_rent_logo.png" alt="RoyalRent" className="logo-img logo-img-desktop" />
                    <img src="/img/royal_rent_favicon.jpg" alt="RoyalRent" className="logo-img logo-img-mobile" />
                </Link>

                <div className="nav-links" id="navLinks">
                    <span className="nav-mobile-logo"><img src="/img/royal_rent_favicon.jpg" alt="RoyalRent" className="mobile-logo-img" /></span>
                    <div className="nav-mobile-sep"></div>
                    <Link to="/services">Servicios</Link>
                    {user ? (
                        <>
                            <Link to="/profile"><User size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> {user.name}</Link>
                            {user.role === 'admin' && <Link to="/admin"><Shield size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Admin</Link>}
                            <button type="button" onClick={logout} className="btn-ghost" style={{ padding: '5px 15px', border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}><LogOut size={18} /></button>
                        </>
                    ) : (
                        <Link to="/auth" className="btn-gold" style={{ padding: '8px 20px', borderRadius: '4px' }}>Login</Link>
                    )}
                    <Link to="/cart" className="cart-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                        <ShoppingCart size={20} />
                        {cart.length > 0 && <span className="badge-pulse" style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>{cart.length}</span>}
                    </Link>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            className="nav-mobile-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(15, 21, 32, 0.6)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 140,
                            }}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            className="nav-mobile-panel"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '280px',
                                background: 'rgba(15, 21, 32, 0.98)',
                                backdropFilter: 'blur(12px)',
                                zIndex: 150,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '80px 32px 32px',
                                gap: '8px',
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <img src="/img/royal_rent_favicon.jpg" alt="RoyalRent" style={{ height: 44, borderRadius: 8 }} />
                            </div>
                            <div style={{ width: 32, height: 2, background: 'var(--accent)', opacity: 0.4, margin: '0 auto 16px' }} />
                            {navItems.map((item, i) => (
                                <motion.div key={item.to} custom={i} variants={linkVariants} initial="hidden" animate="visible">
                                    <Link
                                        to={item.to}
                                        onClick={() => setMenuOpen(false)}
                                        className={item.className || ''}
                                        style={{
                                            display: 'block',
                                            padding: '12px 16px',
                                            color: '#fff',
                                            textDecoration: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            borderRadius: 8,
                                            textAlign: 'center',
                                            ...(item.style || {}),
                                        }}
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                            {user && (
                                <motion.div custom={navItems.length} variants={linkVariants} initial="hidden" animate="visible">
                                    <button
                                        onClick={() => { logout(); setMenuOpen(false); }}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '12px 16px',
                                            color: '#e53e3e',
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            borderRadius: 8,
                                            marginTop: 16,
                                        }}
                                    >
                                        <LogOut size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} /> Cerrar Sesión
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    className={`burger ${menuOpen ? 'open' : ''}`}
                    id="burger"
                    aria-label="Menú"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
