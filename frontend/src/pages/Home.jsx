import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useScrollReveal, useCountUp } from '../hooks/useAnimations';
import { useToast } from '../context/useToast';
import TiltCard from '../components/TiltCard';

function StatItem({ target, suffix, label }) {
    const { ref, count } = useCountUp(target, 2000);
    return (
        <div className="stat-item" ref={ref}>
            <div className="stat-number">{count}{suffix}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export default function Home() {
    useScrollReveal();
    const { addToast } = useToast();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, {
                name: nombre,
                email,
                message: mensaje
            });
            addToast(res.data.message, 'success');
            setNombre('');
            setEmail('');
            setMensaje('');
        } catch (error) {
            console.error('Error sending message:', error);
            const errorText = error.response?.data?.error || 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
            addToast(errorText, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="hero" id="inicio">
                <video className="hero-video" autoPlay muted loop playsInline poster="/img/banner.png">
                    <source src="/img/hero-bg.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay" />
                <div className="hero-content">
                    <div className="hero-eyebrow reveal-scale in">
                        <span className="eyebrow-line"></span>
                        <span className="eyebrow-text">Proyecto Fin de Ciclo · DAM 2025</span>
                    </div>
                    <h1 className="reveal delay-100 in">El Lujo que<br /><em>Mereces</em></h1>
                    <p className="reveal delay-200 in">RoyalRent centraliza el alquiler de vehículos y servicios premium en una sola plataforma.</p>
                    <div className="hero-btns reveal delay-300 in">
                        <Link to="/services" className="btn-gold">Explorar Servicios</Link>
                    </div>
                </div>
            </section>

            <section className="section alt" id="confianza">
                <div className="wrap">
                    <div className="confianza-header reveal">
                        <h2 className="sec-title conf-title">Han confiado en nosotros</h2>
                        <p className="sec-sub conf-sub">Más de 200 clientes ya han vivido la experiencia RoyalRent. Sus opiniones nos avalan.</p>
                    </div>

                    <div className="gm-marquee-box reveal">
                        <div className="gm-marquee-track">
                            <div className="gm-marquee-group">
                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">AV</div>
                                        <div>
                                            <strong>Alejandro V.</strong>
                                            <span className="gm-date">Hace 2 semanas</span>
                                        </div>
                                        <div className="gm-stars">★★★★★</div>
                                    </div>
                                    <p>"Atención completamente VIP. El coche estaba impecable y el proceso de recogida y entrega fue muy ágil. Repetiré sin duda."</p>
                                </div>

                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">ER</div>
                                        <div>
                                            <strong>Elena R.</strong>
                                            <span className="gm-date">Hace 1 mes</span>
                                        </div>
                                        <div className="gm-stars">★★★★★</div>
                                    </div>
                                    <p>"Impecable y discreto. Los vehículos están en perfecto estado y el trato recibido fue excelente. Muy recomendable."</p>
                                </div>

                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">PL</div>
                                        <div>
                                            <strong>Pablo L.</strong>
                                            <span className="gm-date">Hace 3 semanas</span>
                                        </div>
                                        <div className="gm-stars">★★☆☆☆</div>
                                    </div>
                                    <p>"El coche era correcto pero llegó con algo de retraso y el depósito no estaba lleno del todo. Esperaba más por el precio."</p>
                                </div>

                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">MG</div>
                                        <div>
                                            <strong>Marta G.</strong>
                                            <span className="gm-date">Hace 2 meses</span>
                                        </div>
                                        <div className="gm-stars">★★★★★</div>
                                    </div>
                                    <p>"El yate superó todas nuestras expectativas. Tripulación profesional y atención al detalle espectacular. Una experiencia única."</p>
                                </div>

                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">SJ</div>
                                        <div>
                                            <strong>Sara J.</strong>
                                            <span className="gm-date">Hace 1 mes</span>
                                        </div>
                                        <div className="gm-stars">★★★★☆</div>
                                    </div>
                                    <p>"Muy buena experiencia en general. El helicóptero increíble, aunque el proceso de reserva online fue un poco confuso."</p>
                                </div>

                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">DR</div>
                                        <div>
                                            <strong>David R.</strong>
                                            <span className="gm-date">Hace 3 meses</span>
                                        </div>
                                        <div className="gm-stars">★★★☆☆</div>
                                    </div>
                                    <p>"Bien pero mejorable. El coche era de lujo pero el servicio de entrega a domicilio no estaba disponible ese día."</p>
                                </div>

                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">CM</div>
                                        <div>
                                            <strong>Carlos M.</strong>
                                            <span className="gm-date">Hace 3 semanas</span>
                                        </div>
                                        <div className="gm-stars">★★★★★</div>
                                    </div>
                                    <p>"Experiencia inmejorable. Reservé un helicóptero para una ocasión especial y todo fue perfecto. Staff muy atento a cada detalle."</p>
                                </div>

                                <div className="gm-review-card">
                                    <div className="gm-review-header">
                                        <div className="gm-avatar">LG</div>
                                        <div>
                                            <strong>Laura G.</strong>
                                            <span className="gm-date">Hace 2 meses</span>
                                        </div>
                                        <div className="gm-stars">★★★★★</div>
                                    </div>
                                    <p>"Un servicio de 10. Alquiler para una boda y todo salió perfecto. El Ferrari era espectacular, volveremos a repetir."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section stats-section reveal" id="stats">
                <div className="wrap">
                    <div className="stats-grid">
                        <StatItem target={200} suffix="+" label="Clientes satisfechos" />
                        <StatItem target={15} suffix="+" label="Vehículos premium" />
                        <StatItem target={5} suffix="★" label="Valoración media" />
                        <StatItem target={3} suffix="" label="Años de experiencia" />
                    </div>
                </div>
            </section>

            <section className="section" id="servicios">
                <div className="wrap">
                    <h2 className="sec-title reveal">Nuestros <span>Servicios</span></h2>
                    <p className="sec-sub reveal delay-100">Todo lo que necesitas para una experiencia de lujo, en un solo lugar.</p>
                    <div className="services-grid">
                        <TiltCard className="service-card reveal delay-100">
                            <Link to="/services?type=car" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <i className="fa-solid fa-car-side"></i>
                                <h3>Coches de Lujo</h3>
                                <p>Ferrari, Lamborghini, Rolls-Royce y más modelos premium.</p>
                                <span className="price">Desde 500€/día</span>
                                <span className="sc-more">Ver modelos →</span>
                            </Link>
                        </TiltCard>
                        <TiltCard className="service-card reveal delay-200">
                            <Link to="/services?type=yacht" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <i className="fa-solid fa-sailboat"></i>
                                <h3>Yates & Barcos</h3>
                                <p>Navega en embarcaciones exclusivas con tripulación.</p>
                                <span className="price">Desde 2.000€/día</span>
                                <span className="sc-more">Ver embarcaciones →</span>
                            </Link>
                        </TiltCard>
                        <TiltCard className="service-card reveal delay-300">
                            <Link to="/services?type=helicopter" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <i className="fa-solid fa-helicopter"></i>
                                <h3>Helicópteros</h3>
                                <p>Traslados VIP y tours aéreos a destinos exclusivos.</p>
                                <span className="price">Desde 1.200€/h</span>
                                <span className="sc-more">Ver flota →</span>
                            </Link>
                        </TiltCard>
                    </div>
                </div>
            </section>

            <section className="section" id="equipo">
                <div className="wrap">
                    <h2 className="sec-title reveal">El <span>Equipo</span></h2>
                    <p className="sec-sub reveal delay-100">PFC desarrollado por dos estudiantes de Desarrollo de Aplicaciones Multiplataforma.</p>
                    <div className="team-row">
                        <div className="team-card reveal delay-100">
                            <div className="avatar gold-av">GV</div>
                            <h3>Gonzalo Velasco</h3>
                            <p>Desarrollo Android · Backend · MySQL</p>
                            <div className="tags">
                                <span>Android</span><span>Java/Kotlin</span><span>MySQL</span>
                            </div>
                        </div>
                        <div className="team-card reveal delay-200">
                            <div className="avatar purple-av">MJ</div>
                            <h3>Miguel José</h3>
                            <p>Desarrollo Web · UI/UX · Firebase</p>
                            <div className="tags">
                                <span>HTML/CSS/React</span><span>Node</span><span>UI/UX</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section alt" id="contacto">
                <div className="wrap narrow">
                    <h2 className="sec-title reveal">¿Hablamos?</h2>
                    <p className="sec-sub reveal delay-100">Cualquier consulta sobre el proyecto o los servicios, escríbenos.</p>
                    <form className="form reveal delay-200" id="contactForm" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input 
                                type="text" 
                                id="nombre" 
                                placeholder="Tu nombre" 
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required 
                                disabled={loading}
                            />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Tu email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                disabled={loading}
                            />
                        </div>
                        <textarea 
                            id="mensaje" 
                            placeholder="Tu mensaje..." 
                            rows="4" 
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            required 
                            disabled={loading}
                        ></textarea>
                        <button type="submit" className="btn-gold" id="submitBtn" disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
                            <i className="fa-solid fa-paper-plane"></i> {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
