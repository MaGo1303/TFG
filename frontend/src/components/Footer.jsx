import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer" style={{ padding: '40px 28px', borderTop: '1px solid rgba(197, 160, 89, 0.2)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <span className="logo" style={{ fontSize: '1.4rem' }}>Royal<span style={{ color: 'var(--accent)' }}>Rent</span></span>
                <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>El lujo que mereces a tu alcance.</p>
                <div className="foot-links" style={{ display: 'flex', gap: '24px', margin: '10px 0' }}>
                    <Link to="/services" style={{ transition: 'color 0.3s' }}>Servicios</Link>
                    <a href="/#equipo" style={{ transition: 'color 0.3s' }}>Equipo</a>
                    <a href="/#contacto" style={{ transition: 'color 0.3s' }}>Contacto</a>
                </div>
                <div style={{ width: '40px', height: '1px', background: 'var(--accent)', opacity: 0.5, margin: '10px 0' }}></div>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>© {new Date().getFullYear()} RoyalRent · Gonzalo Velasco & Miguel José · PFC DAM</p>
            </div>
        </footer>
    );
}
