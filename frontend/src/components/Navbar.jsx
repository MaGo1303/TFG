import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`nav nav-hidden-top ${scrolled ? 'solid' : ''}`} id="nav">
            <div className="nav-inner">
                <Link to="/" className="logo">Royal<span>Rent</span></Link>
                <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
                    <span className="nav-mobile-logo">Royal<span>Rent</span></span>
                    <div className="nav-mobile-sep"></div>
                    <Link to="/services" onClick={() => setMenuOpen(false)}>Servicios</Link>
                    {user ? (
                        <>
                            <Link to="/profile" onClick={() => setMenuOpen(false)}><User size={18} style={{marginRight: '5px', verticalAlign: 'middle'}}/> {user.name}</Link>
                            <button onClick={() => {logout(); setMenuOpen(false);}} className="btn-ghost" style={{padding: '5px 15px', border: 'none', background: 'transparent', color: 'white', cursor: 'pointer'}}><LogOut size={18}/></button>
                        </>
                    ) : (
                        <Link to="/auth" onClick={() => setMenuOpen(false)} className="btn-gold" style={{padding: '8px 20px', borderRadius: '4px'}}>Login</Link>
                    )}
                    <Link to="/cart" onClick={() => setMenuOpen(false)} className="cart-link" style={{position: 'relative', display: 'flex', alignItems: 'center', marginLeft: '10px'}}>
                        <ShoppingCart size={20} />
                        {cart.length > 0 && <span style={{position: 'absolute', top: '-10px', right: '-10px', background: '#d4af37', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px'}}>{cart.length}</span>}
                    </Link>
                </div>
                <button className={`burger ${menuOpen ? 'open' : ''}`} id="burger" aria-label="Menú" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
