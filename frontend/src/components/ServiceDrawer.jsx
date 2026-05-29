import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/useCart';
import { useToast } from '../context/useToast';
import InlineCalendar from './InlineCalendar';

const modalVariants = {
    hidden: {
        scale: 0.93,
        opacity: 0,
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
            mass: 0.8,
        },
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
    },
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 + i * 0.05, duration: 0.35, ease: [0.23, 1, 0.32, 1] },
    }),
};

function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

const isItemAvailable = (item) => item?.is_available === undefined || Boolean(item.is_available);
const fallbackImageByType = {
    car: '/img/ferrari_488.png',
    yacht: '/img/azimut_80.jpg',
    helicopter: '/img/bell_429.jpg',
};
const getFallbackImage = (item) => item?.image_url || fallbackImageByType[item?.type] || '';
const handleImageError = (event, item) => {
    const fallback = getFallbackImage(item);
    if (fallback && event.currentTarget.dataset.fallbackApplied !== 'true') {
        event.currentTarget.dataset.fallbackApplied = 'true';
        event.currentTarget.src = fallback;
    }
};

export default function ServiceDrawer({ item, isOpen, onClose }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeImage, setActiveImage] = useState(0);
    const { addToCart } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        setActiveImage(0);
    }, [item?.id]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleAdd = () => {
        if (!item) return;
        if (!isItemAvailable(item)) {
            addToast('Este vehículo no está disponible ahora mismo', 'error');
            return;
        }
        if (!startDate || !endDate) {
            addToast('Selecciona las fechas de alquiler', 'error');
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            addToast('La fecha de fin debe ser posterior a la de inicio', 'error');
            return;
        }
        addToCart({ ...item, startDate, endDate });
        addToast(`${item.name} añadido al carrito`, 'success');
        setStartDate('');
        setEndDate('');
        onClose();
    };

    const calculateDays = () => {
        if (!startDate || !endDate) return 1;
        const diff = Math.abs(new Date(endDate) - new Date(startDate));
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 1;
    };

    const days = calculateDays();
    const total = item ? parseFloat(item.price) * days : 0;
    const available = isItemAvailable(item);
    const galleryImages = item?.images?.length ? item.images : [getFallbackImage(item)].filter(Boolean);
    const currentImage = galleryImages[activeImage] || getFallbackImage(item);

    return createPortal(
        <AnimatePresence>
            {isOpen && item && (
                <>
                    <motion.div
                        className="drawer-overlay"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <motion.div
                        className="drawer-panel"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div className="drawer-body">
                            <div className="drawer-image">
                                {currentImage
                                    ? <img src={currentImage} alt={item.name} onError={(event) => handleImageError(event, item)} />
                                    : <div className="drawer-image-placeholder"><i className="fa-solid fa-image"></i></div>
                                }
                                <div className="drawer-image-badge">{item.type.toUpperCase()}</div>
                                {galleryImages.length > 1 && (
                                    <div className="drawer-gallery-thumbs">
                                        {galleryImages.map((imageUrl, index) => (
                                            <button
                                                key={`${imageUrl}-${index}`}
                                                type="button"
                                                className={`drawer-gallery-thumb ${activeImage === index ? 'active' : ''}`}
                                                onClick={() => setActiveImage(index)}
                                                aria-label={`Ver imagen ${index + 1}`}
                                            >
                                                <img src={imageUrl} alt={`${item.name} ${index + 1}`} onError={(event) => handleImageError(event, item)} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="drawer-content">
                                <div className="drawer-header">
                                    <motion.h2 className="drawer-title" custom={0} variants={contentVariants} initial="hidden" animate="visible">
                                        {item.name}
                                    </motion.h2>
                                    <motion.div className="drawer-price-row" custom={1} variants={contentVariants} initial="hidden" animate="visible">
                                        <span className="drawer-price">{item.price}€</span>
                                        <span className="drawer-price-unit">/día</span>
                                    </motion.div>
                                </div>

                                <motion.p className="drawer-desc" custom={2} variants={contentVariants} initial="hidden" animate="visible">
                                    {item.description}
                                </motion.p>

                                {available ? (
                                <motion.div className="drawer-calendar-section" custom={3} variants={contentVariants} initial="hidden" animate="visible">
                                    <div className="drawer-date-summary">
                                        <div className="date-summary-item">
                                            <i className="fa-regular fa-calendar"></i>
                                            <span>{startDate ? formatDateDisplay(startDate) : 'Recogida'}</span>
                                        </div>
                                        <i className="fa-solid fa-arrow-right date-arrow"></i>
                                        <div className="date-summary-item">
                                            <i className="fa-regular fa-calendar-check"></i>
                                            <span>{endDate ? formatDateDisplay(endDate) : 'Devolución'}</span>
                                        </div>
                                    </div>
                                    <InlineCalendar
                                        startDate={startDate}
                                        endDate={endDate}
                                        onStartDateChange={setStartDate}
                                        onEndDateChange={setEndDate}
                                    />
                                </motion.div>
                                ) : (
                                    <motion.div className="drawer-unavailable-note" custom={3} variants={contentVariants} initial="hidden" animate="visible">
                                        <i className="fa-solid fa-ban"></i>
                                        <div>
                                            <strong>No disponible</strong>
                                            <span>Este vehículo no se puede reservar ahora mismo.</span>
                                        </div>
                                    </motion.div>
                                )}

                                {available && startDate && endDate && (
                                    <motion.div
                                        className="drawer-total"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span>{days} {days === 1 ? 'día' : 'días'} × {item.price}€</span>
                                        <strong>{total}€ total</strong>
                                    </motion.div>
                                )}

                                <motion.div className="drawer-actions" custom={4} variants={contentVariants} initial="hidden" animate="visible">
                                    {available ? (
                                    <button className="drawer-add-btn" onClick={handleAdd} disabled={!available}>
                                        <i className={`fa-solid ${available ? 'fa-cart-plus' : 'fa-ban'}`}></i>
                                        Añadir al carrito
                                    </button>
                                    ) : (
                                        <button className="drawer-add-btn" disabled>
                                            <i className="fa-solid fa-ban"></i>
                                            No disponible
                                        </button>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
