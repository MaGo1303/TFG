import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export default function Cart() {
    const { cart, removeFromCart, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('cart'); // 'cart' | 'payment'
    const [selectedCard, setSelectedCard] = useState('card1');

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
            alert('¡Reserva realizada con éxito!');
            navigate('/profile');
        } catch {
            alert('Error al procesar la reserva. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-fade-in">
            <header className="page-header reveal" style={{ paddingBottom: '30px' }}>
                <div className="wrap">
                    <div className="breadcrumb">
                        <Link to="/"><i className="fa-solid fa-house"></i> Inicio</Link>
                        <span>/</span>
                        <span onClick={() => setStep('cart')} style={{cursor: 'pointer', color: step === 'cart' ? 'var(--text)' : 'var(--text-3)'}}>Carrito</span>
                        {step === 'payment' && (
                            <>
                                <span>/</span>
                                <span style={{color: 'var(--text)'}}>Pago Seguro</span>
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
                        <div className="reveal-scale in" style={{ textAlign: 'center', marginTop: '60px', background: 'var(--card)', padding: '60px 20px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                            <i className="fa-solid fa-cart-shopping" style={{ fontSize: '3rem', color: 'var(--border-d)', marginBottom: '20px' }}></i>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-2)', marginBottom: '30px' }}>Tu carrito está vacío</p>
                            <button onClick={() => navigate('/services')} className="btn-gold">Explorar Servicios</button>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {/* STEP 1: CART */}
                            {step === 'cart' && (
                                <div className="reveal-scale in" style={{ background: 'var(--card)', padding: '40px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-m)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                                        {cart.map((item, index) => (
                                            <div key={item.id} className={`reveal delay-${Math.min((index % 5) * 100 + 100, 500)} in`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--r)', transition: 'var(--ease)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                    <div style={{ width: '80px', height: '60px', background: `url('${item.image_url}') center/cover no-repeat var(--bg2)`, borderRadius: '4px' }}>
                                                        {!item.image_url && <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}><i className="fa-solid fa-image" style={{color:'var(--border-d)'}}></i></div>}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)', fontFamily: 'var(--serif)' }}>{item.name}</h4>
                                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-2)' }}>Cantidad: {item.quantity}</p>
                                                        {item.startDate && item.endDate && (
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginTop: '4px' }}>
                                                                <i className="fa-regular fa-calendar" style={{marginRight: '5px'}}></i>
                                                                {item.startDate} a {item.endDate}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '1.1rem' }}>{calculateItemTotal(item)}€</span>
                                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '1.2rem', padding: '5px', transition: 'var(--ease)' }} title="Eliminar">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
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
                                        Proceder al Pago Seguros
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: PAYMENT */}
                            {step === 'payment' && (
                                <div className="reveal-scale in" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 2, minWidth: '300px', background: 'var(--card)', padding: '40px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-m)' }}>
                                        <h3 style={{ fontFamily: 'var(--serif)', marginBottom: '20px', fontSize: '1.4rem' }}>Método de Pago</h3>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                                            {/* Tarjeta 1 */}
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', border: `2px solid ${selectedCard === 'card1' ? 'var(--accent)' : 'var(--border)'}`, padding: '20px', borderRadius: '8px', cursor: 'pointer', transition: 'var(--ease)' }}>
                                                <input type="radio" name="payment" checked={selectedCard === 'card1'} onChange={() => setSelectedCard('card1')} style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <strong>Visa Elite Black</strong>
                                                        <i className="fa-brands fa-cc-visa" style={{ fontSize: '1.5rem', color: '#1a1f36' }}></i>
                                                    </div>
                                                    <div style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>**** **** **** 4242</div>
                                                </div>
                                            </label>

                                            {/* Tarjeta 2 */}
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', border: `2px solid ${selectedCard === 'card2' ? 'var(--accent)' : 'var(--border)'}`, padding: '20px', borderRadius: '8px', cursor: 'pointer', transition: 'var(--ease)' }}>
                                                <input type="radio" name="payment" checked={selectedCard === 'card2'} onChange={() => setSelectedCard('card2')} style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <strong>Mastercard Royal</strong>
                                                        <i className="fa-brands fa-cc-mastercard" style={{ fontSize: '1.5rem', color: '#ff5f00' }}></i>
                                                    </div>
                                                    <div style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>**** **** **** 5566</div>
                                                </div>
                                            </label>
                                            
                                            {/* Añadir Tarjeta (Falsa) */}
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', border: `2px solid ${selectedCard === 'new' ? 'var(--accent)' : 'var(--border)'}`, padding: '20px', borderRadius: '8px', cursor: 'pointer', transition: 'var(--ease)' }}>
                                                <input type="radio" name="payment" checked={selectedCard === 'new'} onChange={() => setSelectedCard('new')} style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '600' }}>Añadir nueva tarjeta...</div>
                                                </div>
                                            </label>
                                        </div>

                                        {selectedCard === 'new' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', background: 'var(--bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                                <input type="text" placeholder="Titular de la tarjeta" style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', width: '100%' }} />
                                                <input type="text" placeholder="Número de tarjeta" style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', width: '100%' }} />
                                                <div style={{ display: 'flex', gap: '15px' }}>
                                                    <input type="text" placeholder="MM/YY" style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', width: '50%' }} />
                                                    <input type="text" placeholder="CVC" style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', width: '50%' }} />
                                                </div>
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => setStep('cart')}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}
                                        >
                                            ← Volver al carrito
                                        </button>
                                    </div>

                                    {/* Resumen */}
                                    <div style={{ flex: 1, background: 'var(--card)', padding: '30px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-m)' }}>
                                        <h3 style={{ fontFamily: 'var(--serif)', marginBottom: '20px', fontSize: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>Resumen</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-2)' }}>
                                            <span>Subtotal</span>
                                            <span>{cartTotal}€</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-2)' }}>
                                            <span>Tasas (0%)</span>
                                            <span>0.00€</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text)', borderTop: '2px dashed var(--border)', paddingTop: '15px' }}>
                                            <span>Total</span>
                                            <span style={{ color: 'var(--accent)' }}>{cartTotal}€</span>
                                        </div>
                                        
                                        <button 
                                            onClick={handleCheckout} 
                                            disabled={loading}
                                            className="btn-gold" 
                                            style={{ width: '100%', padding: '15px', fontSize: '1.1rem', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                                        >
                                            {loading ? (
                                                <span><i className="fa-solid fa-circle-notch fa-spin"></i> Procesando...</span>
                                            ) : (
                                                <span>Pagar {cartTotal}€ <i className="fa-solid fa-lock" style={{ marginLeft: '5px', fontSize: '0.9rem' }}></i></span>
                                            )}
                                        </button>
                                        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '15px' }}>
                                            Pago cifrado con seguridad de grado militar 256-bit.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
