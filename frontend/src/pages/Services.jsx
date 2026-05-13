import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Services() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const location = useLocation();
    const { addToCart } = useCart();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get('type');
        if (type) setFilter(type);
    }, [location]);

    useEffect(() => {
        const fetchItems = async () => {
            const url = filter === 'all' 
                ? 'http://localhost:5000/api/items' 
                : `http://localhost:5000/api/items?type=${filter}`;
            try {
                const res = await axios.get(url);
                setItems(res.data);
            } catch (error) {
                console.error("Error fetching items", error);
            }
        };
        fetchItems();
    }, [filter]);

    const handleFilter = (cat) => {
        setFilter(cat);
    };

    return (
        <>
            <header className="page-header">
                <div className="wrap">
                    <div className="breadcrumb">
                        <Link to="/"><i className="fa-solid fa-house"></i> Inicio</Link>
                        <span>/</span>
                        <span>Servicios</span>
                    </div>
                    <h1>Catálogo de <em>Servicios</em></h1>
                    <p>Elige tu categoría y descubre nuestra selección exclusiva de vehículos premium.</p>

                    <div className="filter-tabs">
                        <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>Todos</button>
                        <button className={`tab ${filter === 'car' ? 'active' : ''}`} onClick={() => handleFilter('car')}><i className="fa-solid fa-car-side"></i> Coches</button>
                        <button className={`tab ${filter === 'yacht' ? 'active' : ''}`} onClick={() => handleFilter('yacht')}><i className="fa-solid fa-sailboat"></i> Yates</button>
                        <button className={`tab ${filter === 'helicopter' ? 'active' : ''}`} onClick={() => handleFilter('helicopter')}><i className="fa-solid fa-helicopter"></i> Helicópteros</button>
                    </div>
                </div>
            </header>

            <main className="cat-main">
                <div className="wrap">
                    <section className="cat-section">
                        <div className="cat-header">
                            <div className="cat-title-wrap">
                                <div className="cat-icon-wrap">
                                    <i className={
                                        filter === 'car' ? "fa-solid fa-car-side" :
                                        filter === 'yacht' ? "fa-solid fa-sailboat" :
                                        filter === 'helicopter' ? "fa-solid fa-helicopter" :
                                        "fa-solid fa-star"
                                    }></i>
                                </div>
                                <div>
                                    <h2>
                                        {filter === 'car' ? "Coches de Lujo" :
                                         filter === 'yacht' ? "Yates & Barcos" :
                                         filter === 'helicopter' ? "Helicópteros VIP" : "Todos los Servicios"}
                                    </h2>
                                    <span>Selección Premium</span>
                                </div>
                            </div>
                        </div>

                        <div className="listing-grid">
                            {items.map(item => (
                                <div key={item.id} className="listing-card">
                                    <div className="listing-img" style={{ backgroundImage: `url('${item.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        {/* Fallback si no hay imagen real en la DB */}
                                        {!item.image_url && <i className="fa-solid fa-image"></i>}
                                    </div>
                                    <div className="listing-info">
                                        <div className="listing-top">
                                            <h3>{item.name}</h3>
                                            <div className="listing-stars">★★★★★ <span>5.0</span></div>
                                        </div>
                                        <p>{item.description}</p>
                                        
                                        <div className="listing-specs">
                                            {item.type === 'car' && <>
                                                <span><i className="fa-solid fa-road"></i> Premium</span>
                                                <span><i className="fa-solid fa-users"></i> Biplaza/Plazas</span>
                                            </>}
                                            {item.type === 'yacht' && <>
                                                <span><i className="fa-solid fa-ruler-horizontal"></i> Gran eslora</span>
                                                <span><i className="fa-solid fa-users"></i> Tripulación</span>
                                            </>}
                                            {item.type === 'helicopter' && <>
                                                <span><i className="fa-solid fa-location-dot"></i> Larga distancia</span>
                                                <span><i className="fa-solid fa-users"></i> VIP</span>
                                            </>}
                                        </div>

                                        <div className="listing-footer" style={{ marginTop: '15px' }}>
                                            <div className="listing-price">{item.price}€<span>/día</span></div>
                                            <button onClick={() => addToCart(item)} className="btn-listing" style={{ cursor: 'pointer', border: 'none' }}>
                                                Añadir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {items.length === 0 && (
                            <p style={{textAlign: 'center', marginTop: '40px', color: 'var(--text-3)'}}>No hay servicios disponibles para esta categoría en este momento.</p>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}
