import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <span className="logo">Royal<span>Rent</span></span>
            <p>© 2025 RoyalRent · Gonzalo Velasco & Miguel José · PFC DAM</p>
            <div className="foot-links">
                <Link to="/services">Servicios</Link>
                <a href="/#equipo">Equipo</a>
                <a href="/#contacto">Contacto</a>
            </div>
        </footer>
    );
}
