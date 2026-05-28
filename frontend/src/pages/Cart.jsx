import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentForm from '../components/PaymentForm';

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } },
    exit: { opacity: 0, x: 60, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } },
};

export default function Cart() {
    const { cart, removeFromCart, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('cart');
    const [selectedCard, setSelectedCard] = useState('card1');
    const [newCardValid, setNewCardValid] = useState(false);

    const calculateItemTotal = (item) => {
        let days = 1;
        if (item.startDate && item.endDate) {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            days = diffDays > 0 ? diffDays : 1;
        }
        return parseFloat(item.price) * days * item.quantity;
    };

    const handleProceedToPayment = () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        setStep('payment');
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
                items: cart,
                totalPrice: cartTotal
            });
            clearCart();
            setStep('cart');
            addToast('¡Reserva realizada con éxito!', 'success');
            navigate('/profile');
        } catch {
            addToast('Error al procesar la reserva. Inténtalo de nuevo.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (itemId, itemName) => {
        removeFromCart(itemId);
        addToast(`${itemName} eliminado del carrito`, 'info');
    };

    return (
        <div>
            <header className="page-header reveal" style={{ paddingBottom: '30px' }}>
                <div className="wrap">
                    <div className="breadcrumb">
                        <Link to="/"><i className="fa-solid fa-house"></i> Inicio</Link>
                        <span>/</span>
                        <span onClick={() => setStep('cart')} style={{ cursor: 'pointer', color: step === 'cart' ? 'var(--text)' : 'var(--text-3)' }}>Carrito</span>
                        {step === 'payment' && (
                            <>
                                <span>/</span>
                                <span style={{ color: 'var(--text)' }}>Pago Seguro</span>
                            </>
                        )}
                    </div>
                    <h1>Tu <em>{step === 'cart' ? 'Carrito' : 'Pago Seguro'}</em></h1>
                    <p>{step === 'cart' ? 'Revisa los servicios seleccionados antes de confirmar la reserva.' : 'Selecciona tu método de pago para finalizar.'}</p>
                </div>
            </header>

            <main className="cat-main" style={{ minHeight: '60vh' }}>
                <div className="wrap">
                    {cart.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            style={{ textAlign: 'center', marginTop: '60px', background: 'var(--card)', padding: '60px 20px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
                        >
                            <i className="fa-solid fa-cart-shopping" style={{ fontSize: '3rem', color: 'var(--border-d)', marginBottom: '20px' }}></i>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-2)', marginBottom: '30px' }}>Tu carrito está vacío</p>
                            <button onClick={() => navigate('/services')} className="btn-gold">Explorar Servicios</button>
                        </motion.div>
                    ) : (
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <AnimatePresence mode="wait">
                                {step === 'cart' && (
                                    <motion.div
                                        key="cart"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        style={{ background: 'var(--card)', padding: '40px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-m)' }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                                            <AnimatePresence>
                                                {cart.map((item) => (
                                                    <motion.div
                                                        key={item.id}
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        layout
                                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--r)' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                            <div style={{ width: '80px', height: '60px', background: `url('${item.image_url}') center/cover no-repeat var(--bg2)`, borderRadius: '4px' }}>
                                                                {!item.image_url && <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-image" style={{ color: 'var(--border-d)' }}></i></div>}
                                                            </div>
                                                            <div>
                                                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)', fontFamily: 'var(--serif)' }}>{item.name}</h4>
                                                                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-2)' }}>Cantidad: {item.quantity}</p>
                                                                {item.startDate && item.endDate && (
                                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginTop: '4px' }}>
                                                                        <i className="fa-regular fa-calendar" style={{ marginRight: '5px' }}></i>
                                                                        {item.startDate} a {item.endDate}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                                            <span style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '1.1rem' }}>{calculateItemTotal(item)}€</span>
                                                            <button onClick={() => handleRemove(item.id, item.name)} style={{ background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }} title="Eliminar">
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text)' }}>Total a Pagar:</span>
                                            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--serif)' }}>{cartTotal}€</span>
                                        </div>

                                        <button
                                            onClick={handleProceedToPayment}
                                            className="btn-gold"
                                            style={{ width: '100%', marginTop: '30px', padding: '16px', fontSize: '1.1rem', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                                        >
                                            Proceder al Pago Seguro
                                        </button>
                                    </motion.div>
                                )}

                                {step === 'payment' && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}
                                    >
                                        <div style={{ flex: 2, minWidth: '300px', background: 'var(--card)', padding: '40px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-m)' }}>
                                            <h3 style={{ fontFamily: 'var(--serif)', marginBottom: '24px', fontSize: '1.4rem' }}>Método de Pago</h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                                                <label className={`payment-method-card ${selectedCard === 'card1' ? 'active' : ''}`}>
                                                    <input type="radio" name="payment" checked={selectedCard === 'card1'} onChange={() => setSelectedCard('card1')} style={{ display: 'none' }} />
                                                    <div className="method-info">
                                                        <div className="method-name">Visa Elite Black</div>
                                                        <div className="method-number">**** **** **** 4242</div>
                                                    </div>
                                                    <i className="fa-brands fa-cc-visa method-brand" style={{ color: '#1a1f73' }}></i>
                                                </label>

                                                <label className={`payment-method-card ${selectedCard === 'card2' ? 'active' : ''}`}>
                                                    <input type="radio" name="payment" checked={selectedCard === 'card2'} onChange={() => setSelectedCard('card2')} style={{ display: 'none' }} />
                                                    <div className="method-info">
                                                        <div className="method-name">Mastercard Royal</div>
                                                        <div className="method-number">**** **** **** 5566</div>
                                                    </div>
                                                    <i className="fa-brands fa-cc-mastercard method-brand" style={{ color: '#eb001b' }}></i>
                                                </label>

                                                <label className={`payment-method-card ${selectedCard === 'new' ? 'active' : ''}`}>
                                                    <input type="radio" name="payment" checked={selectedCard === 'new'} onChange={() => setSelectedCard('new')} style={{ display: 'none' }} />
                                                    <div className="method-info">
                                                        <div className="method-name">Añadir nueva tarjeta</div>
                                                        <div className="method-number">Visa, Mastercard, Amex</div>
                                                    </div>
                                                    <i className="fa-solid fa-plus method-brand" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}></i>
                                                </label>
                                            </div>

                                            <AnimatePresence>
                                                {selectedCard === 'new' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                                        style={{ marginBottom: '28px', overflow: 'hidden' }}
                                                    >
                                                        <PaymentForm onFormValid={setNewCardValid} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="secure-badge">
                                                <i className="fa-solid fa-shield-halved"></i>
                                                Pago cifrado con seguridad 256-bit SSL
                                            </div>

                                            <button
                                                onClick={() => setStep('cart')}
                                                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.8rem' }}></i> Volver al carrito
                                            </button>
                                        </div>

                                        <div style={{ flex: 1, background: 'var(--card)', padding: '30px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-m)', position: 'sticky', top: '100px' }}>
                                            <h3 style={{ fontFamily: 'var(--serif)', marginBottom: '20px', fontSize: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>Resumen del pedido</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                                {cart.map(item => (
                                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                                        <span style={{ color: 'var(--text-2)' }}>{item.name} ×{item.quantity}</span>
                                                        <span style={{ color: 'var(--text)', fontWeight: '600' }}>{calculateItemTotal(item)}€</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                                                    <span>Subtotal</span>
                                                    <span>{cartTotal}€</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                                                    <span>Tasas</span>
                                                    <span>0.00€</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)', borderTop: '2px dashed var(--border)', paddingTop: '14px' }}>
                                                <span>Total</span>
                                                <span style={{ color: 'var(--accent)' }}>{cartTotal}€</span>
                                            </div>

                                            <button
                                                onClick={handleCheckout}
                                                disabled={loading || (selectedCard === 'new' && !newCardValid)}
                                                className="btn-gold"
                                                style={{
                                                    width: '100%', padding: '15px', fontSize: '1rem', fontWeight: '700',
                                                    border: 'none', cursor: (loading || (selectedCard === 'new' && !newCardValid)) ? 'not-allowed' : 'pointer',
                                                    borderRadius: '10px', opacity: (loading || (selectedCard === 'new' && !newCardValid)) ? 0.6 : 1,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                                }}
                                            >
                                                {loading ? (
                                                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Procesando...</>
                                                ) : (
                                                    <><i className="fa-solid fa-lock"></i> Pagar {cartTotal}€</>
                                                )}
                                            </button>
                                            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '14px' }}>
                                                <i className="fa-solid fa-shield-halved" style={{ marginRight: '4px' }}></i>
                                                Transacción segura y protegida
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
