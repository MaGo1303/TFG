import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useScrollReveal } from '../hooks/useAnimations';
import TiltCard from '../components/TiltCard';

const ServiceCard = ({ item, index, handleAddToCart }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const onAdd = () => {
        if (!startDate || !endDate) {
            alert('Por favor selecciona las fechas de alquiler.');
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            alert('La fecha de fin debe ser posterior a la de inicio.');
            return;
        }
        handleAddToCart({ ...item, startDate, endDate });
        setStartDate('');
        setEndDate('');
    };

    return (
        <TiltCard className={`listing-card reveal delay-${Math.min((index % 5) * 100 + 100, 500)}`}>
            <div className="listing-img" style={{ backgroundImage: `url('${item.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {!item.image_url && <i className="fa-solid fa-image"></i>}
                <div className="listing-type">{item.type.toUpperCase()}</div>
            </div>
            <div className="listing-content">
                <h3 className="listing-title">{item.name}</h3>
                <p className="listing-desc">{item.description}</p>
                <div className="listing-footer" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{flex: 1}}>
                            <label style={{fontSize: '0.75rem', color: 'var(--text-3)'}}>Recogida</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '0.85rem'}} min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={{fontSize: '0.75rem', color: 'var(--text-3)'}}>Devolución</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '0.85rem'}} min={startDate || new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="listing-price">{item.price}€<span>/día</span></div>
                        <button onClick={onAdd} className="btn-listing" style={{ cursor: 'pointer', border: 'none' }}>
                            Añadir
                        </button>
                    </div>
                </div>
            </div>
        </TiltCard>
    );
};

export default function Services() {
    useScrollReveal();
    const [items, setItems] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();

    const filter = searchParams.get('type') || 'all';
    const [toastMsg, setToastMsg] = useState(null);

    const handleAddToCart = (item) => {
        addToCart(item);
        setToastMsg(`${item.name} añadido al carrito`);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleFilter = (cat) => {
        if (cat === 'all') {
            searchParams.delete('type');
        } else {
            searchParams.set('type', cat);
        }
        setSearchParams(searchParams);
    };

    useEffect(() => {
        const fetchItems = async () => {
            const url = filter === 'all' 
                ? `${import.meta.env.VITE_API_URL}/items` 
                : `${import.meta.env.VITE_API_URL}/items?type=${filter}`;
            try {
                const res = await axios.get(url);
                setItems(res.data);
            } catch {
                console.error("Error fetching items");
            }
        };
        fetchItems();
    }, [filter]);

    return (
        <div className="page-fade-in">
            <header className="page-header reveal">
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
                            {items.map((item, index) => (
                                <ServiceCard key={item.id} item={item} index={index} handleAddToCart={handleAddToCart} />
                            ))}
                        </div>
                        
                        {items.length === 0 && (
                            <p style={{textAlign: 'center', marginTop: '40px', color: 'var(--text-3)'}}>No hay servicios disponibles para esta categoría en este momento.</p>
                        )}
                        
                        {/* Toast Notification */}
                        <div style={{
                            position: 'fixed',
                            bottom: '30px',
                            left: '50%',
                            transform: `translateX(-50%) ${toastMsg ? 'translateY(0)' : 'translateY(100px)'}`,
                            opacity: toastMsg ? 1 : 0,
                            visibility: toastMsg ? 'visible' : 'hidden',
                            background: '#1b4a32',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-m)',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#4ade80' }}></i>
                            {toastMsg}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
