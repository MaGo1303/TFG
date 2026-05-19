import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <section className="hero" id="inicio">
                <video className="hero-video" autoPlay muted loop playsInline poster="/img/banner.png">
                    <source src="/img/hero-bg.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        <span className="eyebrow-line"></span>
                        <span className="eyebrow-text">Proyecto Fin de Ciclo · DAM 2025</span>
                    </div>
                    <h1>El Lujo que<br /><em>Mereces</em></h1>
                    <p>RoyalRent centraliza el alquiler de vehículos y servicios premium en una sola plataforma.</p>
                    <div className="hero-btns">
                        <Link to="/services" className="btn-gold">Explorar Servicios</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hstat"><strong>500+</strong><span>Servicios</span></div>
                        <div className="hstat-sep"></div>
                        <div className="hstat"><strong>3</strong><span>Categorías</span></div>
                        <div className="hstat-sep"></div>
                        <div className="hstat"><strong>24/7</strong><span>Soporte</span></div>
                    </div>
                </div>
                <div className="hero-scroll-hint">
                    <span>Scroll</span>
                    <div className="scroll-line"></div>
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

            <section className="section" id="servicios">
                <div className="wrap">
                    <h2 className="sec-title">Nuestros <span>Servicios</span></h2>
                    <p className="sec-sub">Todo lo que necesitas para una experiencia de lujo, en un solo lugar.</p>
                    <div className="services-grid">
                        <Link className="service-card" to="/services?type=car">
                            <i className="fa-solid fa-car-side"></i>
                            <h3>Coches de Lujo</h3>
                            <p>Ferrari, Lamborghini, Rolls-Royce y más modelos premium.</p>
                            <span className="price">Desde 500€/día</span>
                            <span className="sc-more">Ver modelos →</span>
                        </Link>
                        <Link className="service-card" to="/services?type=yacht">
                            <i className="fa-solid fa-sailboat"></i>
                            <h3>Yates & Barcos</h3>
                            <p>Navega en embarcaciones exclusivas con tripulación.</p>
                            <span className="price">Desde 2.000€/día</span>
                            <span className="sc-more">Ver embarcaciones →</span>
                        </Link>
                        <Link className="service-card" to="/services?type=helicopter">
                            <i className="fa-solid fa-helicopter"></i>
                            <h3>Helicópteros</h3>
                            <p>Traslados VIP y tours aéreos a destinos exclusivos.</p>
                            <span className="price">Desde 1.200€/h</span>
                            <span className="sc-more">Ver flota →</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section" id="equipo">
                <div className="wrap">
                    <h2 className="sec-title">El <span>Equipo</span></h2>
                    <p className="sec-sub">PFC desarrollado por dos estudiantes de Desarrollo de Aplicaciones Multiplataforma.</p>
                    <div className="team-row">
                        <div className="team-card">
                            <div className="avatar gold-av">GV</div>
                            <h3>Gonzalo Velasco</h3>
                            <p>Desarrollo Android · Backend · MySQL</p>
                            <div className="tags">
                                <span>Android</span><span>Java/Kotlin</span><span>MySQL</span>
                            </div>
                        </div>
                        <div className="team-card">
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
                    <h2 className="sec-title">¿Hablamos?</h2>
                    <p className="sec-sub">Cualquier consulta sobre el proyecto o los servicios, escríbenos.</p>
                    <form className="form" id="contactForm">
                        <div className="form-row">
                            <input type="text" id="nombre" placeholder="Tu nombre" required />
                            <input type="email" id="email" placeholder="Tu email" required />
                        </div>
                        <textarea id="mensaje" placeholder="Tu mensaje..." rows="4" required></textarea>
                        <button type="submit" className="btn-gold" id="submitBtn">
                            <i className="fa-solid fa-paper-plane"></i> Enviar
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
