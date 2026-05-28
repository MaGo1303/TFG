import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useAnimations';
import { motion } from 'framer-motion';
import ServiceDrawer from '../components/ServiceDrawer';

const categories = [
    { key: 'all', label: 'Todos', icon: 'fa-solid fa-star', img: '/img/ferrari_488.png' },
    { key: 'car', label: 'Coches', icon: 'fa-solid fa-car-side', img: '/img/ferrari_488.png' },
    { key: 'yacht', label: 'Yates', icon: 'fa-solid fa-sailboat', img: '/img/azimut_80.jpg' },
    { key: 'helicopter', label: 'Helicópteros', icon: 'fa-solid fa-helicopter', img: '/img/bell_429.jpg' },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] },
    }),
};

export default function Services() {
    useScrollReveal();
    const [items, setItems] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [drawerItem, setDrawerItem] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categoryCounts, setCategoryCounts] = useState({ all: 0, car: 0, yacht: 0, helicopter: 0 });

    const filter = searchParams.get('type') || 'all';

    const handleFilter = (cat) => {
        if (cat === 'all') {
            searchParams.delete('type');
        } else {
            searchParams.set('type', cat);
        }
        setSearchParams(searchParams);
    };

    const openDrawer = (item) => {
        setDrawerItem(item);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setDrawerItem(null), 300);
    };

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            const url = filter === 'all'
                ? `${import.meta.env.VITE_API_URL}/items`
                : `${import.meta.env.VITE_API_URL}/items?type=${filter}`;
            try {
                const res = await axios.get(url);
                setItems(res.data);
            } catch {
                console.error("Error fetching items");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [filter]);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/items`);
                const counts = { all: res.data.length, car: 0, yacht: 0, helicopter: 0 };
                res.data.forEach(item => {
                    if (counts[item.type] !== undefined) counts[item.type]++;
                });
                setCategoryCounts(counts);
            } catch {
                console.error("Error fetching category counts");
            }
        };
        fetchCounts();
    }, []);

    const featured = useMemo(() => {
        if (items.length === 0) return null;
        return items.reduce((max, item) => parseFloat(item.price) > parseFloat(max.price) ? item : max, items[0]);
    }, [items]);

    const rest = useMemo(() => {
        if (!featured) return items;
        return items.filter(item => item.id !== featured.id);
    }, [items, featured]);

    const getCategoryCount = (key) => {
        return categoryCounts[key] || 0;
    };

    return (
        <div>
            <header className="page-header">
                <div className="wrap">
                    <div className="breadcrumb">
                        <Link to="/"><i className="fa-solid fa-house"></i> Inicio</Link>
                        <span>/</span>
                        <span>Servicios</span>
                    </div>
                    <h1>Servicios <em>Premium</em></h1>
                    <p>Selecciona una categoría y descubre nuestra selección exclusiva.</p>
                </div>
            </header>

            <div className="cat-cards-section">
                <div className="wrap">
                    <div className="cat-cards-grid">
                        {categories.map(cat => (
                            <button
                                key={cat.key}
                                className={`cat-card ${filter === cat.key ? 'active' : ''}`}
                                onClick={() => handleFilter(cat.key)}
                            >
                                <div className="cat-card-img">
                                    <img src={cat.img} alt={cat.label} />
                                    <div className="cat-card-overlay"></div>
                                </div>
                                <div className="cat-card-content">
                                    <div className="cat-card-icon">
                                        <i className={cat.icon}></i>
                                    </div>
                                    <div>
                                        <h3>{cat.label}</h3>
                                        <span>{getCategoryCount(cat.key)} {cat.key === 'all' ? 'items' : 'disponibles'}</span>
                                    </div>
                                </div>
                                {filter === cat.key && (
                                    <div className="cat-card-indicator" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="services-main">
                <div className="wrap">
                    {loading ? (
                        <div className="services-loading">
                            <div className="services-spinner"></div>
                            <span>Cargando flota...</span>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="services-empty">
                            <i className="fa-solid fa-car-side"></i>
                            <h3>No hay servicios disponibles</h3>
                            <p>No se encontraron vehículos para esta categoría.</p>
                        </div>
                    ) : (
                        <div>
                            {featured && (
                                <button
                                    className="showcase-card"
                                    onClick={() => openDrawer(featured)}
                                    type="button"
                                >
                                    <div className="showcase-img">
                                        {featured.image_url
                                            ? <img src={featured.image_url} alt={featured.name} />
                                            : <div className="showcase-img-placeholder"><i className="fa-solid fa-image"></i></div>
                                        }
                                        <div className="showcase-overlay"></div>
                                    </div>
                                    <div className="showcase-content">
                                        <div className="showcase-badge">
                                            <i className="fa-solid fa-crown"></i> Más elegido
                                        </div>
                                        <h2 className="showcase-title">{featured.name}</h2>
                                        <p className="showcase-desc">{featured.description}</p>
                                        <div className="showcase-footer">
                                            <div className="showcase-price">
                                                <span>{featured.price}€</span>/día
                                            </div>
                                            <div className="showcase-cta">
                                                Ver detalles <i className="fa-solid fa-arrow-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )}

                            {rest.length > 0 && (
                                <div className="services-grid-header">
                                    <h2>
                                        {filter === 'all' ? 'Todo el catálogo' :
                                            filter === 'car' ? 'Más coches' :
                                                filter === 'yacht' ? 'Más yates' : 'Más helicópteros'}
                                    </h2>
                                    <span className="services-count">{rest.length} vehículos</span>
                                </div>
                            )}

                            <div className="services-grid">
                                {rest.map((item, i) => (
                                    <motion.button
                                        key={item.id}
                                        className="grid-card"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i}
                                        onClick={() => openDrawer(item)}
                                        type="button"
                                    >
                                        <div className="grid-card-img">
                                            {item.image_url
                                                ? <img src={item.image_url} alt={item.name} loading="lazy" />
                                                : <div className="grid-card-placeholder"><i className="fa-solid fa-image"></i></div>
                                            }
                                            <div className="grid-card-overlay">
                                                <span className="grid-card-type">{item.type.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="grid-card-info">
                                            <h3>{item.name}</h3>
                                            <div className="grid-card-price">
                                                {item.price}€<span>/día</span>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ServiceDrawer
                item={drawerItem}
                isOpen={drawerOpen}
                onClose={closeDrawer}
            />
        </div>
    );
}
