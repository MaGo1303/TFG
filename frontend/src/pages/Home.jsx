import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <section className="hero" id="inicio">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        <span className="eyebrow-line"></span>
                        <span className="eyebrow-text">Proyecto Fin de Ciclo · DAM 2025</span>
                    </div>
                    <h1>El Lujo que<br /><em>Mereces</em></h1>
                    <p>RoyalRent centraliza el alquiler de vehículos y servicios premium en una sola plataforma — disponible en web y app Android.</p>
                    <div className="hero-btns">
                        <Link to="/services" className="btn-gold">Explorar Servicios</Link>
                        <a href="#app" className="btn-ghost">App Android</a>
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
                        <p className="sec-sub conf-sub">Experiencias reales de clientes que eligen RoyalRent para sus traslados, estancias y momentos más exclusivos.</p>
                    </div>

                    <div className="confianza-box reveal">
                        <div className="marquee-track">
                            <div className="marquee-content">
                                <span className="m-item">"Atención completamente VIP. Un servicio 10/10." <br /><strong>— Alejandro V.</strong></span>
                                <span className="m-dot">•</span>
                                <span className="m-item">"Impecable y discreto. Los vehículos perfectos." <br /><strong>— Elena R.</strong></span>
                                <span className="m-dot">•</span>
                                <span className="m-item">"Experiencia inmejorable. Staff atento a todo." <br /><strong>— Carlos M.</strong></span>
                                <span className="m-dot">•</span>
                                <span className="m-item">"Conseguimos una experiencia espectacular." <br /><strong>— Marta G.</strong></span>
                                <span className="m-dot">•</span>
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

            <section className="section alt" id="app">
                <div className="wrap">
                    <h2 className="sec-title">App <span>Android</span></h2>
                    <p className="sec-sub">Gestiona tus reservas, explora el catálogo y contacta con soporte desde tu móvil.</p>
                    <div className="app-features">
                        <div className="app-feat"><i className="fa-solid fa-magnifying-glass"></i><span>Búsqueda avanzada</span></div>
                        <div className="app-feat"><i className="fa-solid fa-calendar-check"></i><span>Reservas en tiempo real</span></div>
                        <div className="app-feat"><i className="fa-solid fa-star"></i><span>Valoraciones y reseñas</span></div>
                        <div className="app-feat"><i className="fa-solid fa-lock"></i><span>Login seguro</span></div>
                        <div className="app-feat"><i className="fa-solid fa-bell"></i><span>Notificaciones push</span></div>
                        <div className="app-feat"><i className="fa-solid fa-list-check"></i><span>Historial de reservas</span></div>
                    </div>
                    <div className="tech-row">
                        <span className="tech"><i className="fa-brands fa-android"></i> Android Studio</span>
                        <span className="tech">Kotlin / Java</span>
                        <span className="tech"><i className="fa-solid fa-database"></i> Firebase</span>
                        <span className="tech">MySQL</span>
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
