CREATE DATABASE IF NOT EXISTS royalrent;
USE royalrent;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('car', 'yacht', 'helicopter') NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    image_url TEXT NOT NULL,
    position INT DEFAULT 0,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Insert 40+ realistic vehicles
INSERT INTO items (type, name, description, price, image_url) VALUES
-- COCHES (20)
('car', 'Ferrari 488 GTB', '670 CV · Biturbo V8 · Rojo Ferrari.', 950.00, '/img/ferrari_488.png'),
('car', 'Ferrari F8 Tributo', '720 CV · V8 · La cúspide de berlinettas.', 1200.00, '/img/ferrari_488.png'),
('car', 'Ferrari Roma', '620 CV · V8 · Elegancia atemporal italiana.', 850.00, '/img/ferrari_488.png'),
('car', 'Ferrari SF90 Stradale', '1000 CV · Híbrido V8 · Potencia extrema.', 1800.00, '/img/ferrari_488.png'),
('car', 'Lamborghini Huracán EVO', '640 CV · V10 · Aerodinámica pura.', 1100.00, '/img/cat_coches.png'),
('car', 'Lamborghini Aventador SVJ', '770 CV · V12 · Radical e indomable.', 2000.00, '/img/cat_coches.png'),
('car', 'Lamborghini Urus', '650 CV · V8 Super SUV · Lujo extremo y espacio.', 1300.00, '/img/cat_coches.png'),
('car', 'Rolls-Royce Ghost', '563 CV · V12 Biturbo · Refinamiento absoluto.', 1200.00, '/img/rolls_ghost.jpg'),
('car', 'Rolls-Royce Phantom', '563 CV · V12 · El rey indiscutible del lujo.', 2500.00, '/img/rolls_ghost.jpg'),
('car', 'Rolls-Royce Cullinan', '571 CV · V12 · SUV de máximo prestigio.', 1800.00, '/img/rolls_ghost.jpg'),
('car', 'Bentley Continental GT', '635 CV · W12 biturbo · Gran Turismo perfecto.', 800.00, '/img/bentley_continental.jpg'),
('car', 'Bentley Bentayga', '550 CV · V8 · SUV de artesanía británica.', 900.00, '/img/bentley_continental.jpg'),
('car', 'Bentley Flying Spur', '635 CV · W12 · Sedán de altas prestaciones.', 950.00, '/img/bentley_continental.jpg'),
('car', 'Porsche 911 Turbo S', '650 CV · Bóxer biturbo · Precisión alemana.', 800.00, '/img/cat_coches.png'),
('car', 'Porsche Taycan Turbo S', '761 CV · Eléctrico puro · Aceleración letal.', 700.00, '/img/cat_coches.png'),
('car', 'Mercedes-AMG G63', '585 CV · V8 · El todoterreno más exclusivo.', 750.00, '/img/cat_coches.png'),
('car', 'Mercedes-Maybach S680', '612 CV · V12 · Primera clase sobre ruedas.', 1100.00, '/img/rolls_ghost.jpg'),
('car', 'Aston Martin DBS Superleggera', '725 CV · V12 · Belleza y furia británica.', 1350.00, '/img/cat_coches.png'),
('car', 'Aston Martin DBX707', '707 CV · V8 · El SUV más potente del mundo.', 1400.00, '/img/cat_coches.png'),
('car', 'McLaren 720S', '720 CV · V8 · Superdeportivo ultraligero.', 1450.00, '/img/cat_coches.png'),

-- YATES (12)
('yacht', 'Azimut Grande 80', '24 m · Fly Open · 4 camarotes suite.', 3200.00, '/img/azimut_80.jpg'),
('yacht', 'Azimut Magellano 66', '20 m · Diseño navetta · 3 camarotes suite.', 2400.00, '/img/azimut_80.jpg'),
('yacht', 'Azimut S8', '24.5 m · Sport Yacht · Altas prestaciones.', 3600.00, '/img/azimut_80.jpg'),
('yacht', 'Sunseeker Predator 75', '23 m de eslora · 3 camarotes.', 2500.00, '/img/sunseeker_75.jpg'),
('yacht', 'Sunseeker Manhattan 68', '21 m de eslora · Espaciosos interiores.', 2200.00, '/img/sunseeker_75.jpg'),
('yacht', 'Sunseeker 95 Yacht', '28 m de eslora · Trideck · Superyate de entrada.', 5800.00, '/img/sunseeker_75.jpg'),
('yacht', 'Ferretti 780', '23.7 m · Sport Flybridge · 3 suites.', 2800.00, '/img/ferretti_780.jpg'),
('yacht', 'Ferretti 850', '26 m · Máximo lujo · 4 suites completas.', 4200.00, '/img/ferretti_780.jpg'),
('yacht', 'Riva 76 Perseo', '23.3 m · Diseño icónico e inconfundible.', 3500.00, '/img/ferretti_780.jpg'),
('yacht', 'Riva 90 Argo', '28.5 m · Obra maestra del diseño náutico.', 6500.00, '/img/ferretti_780.jpg'),
('yacht', 'Princess X95', '29 m · Super flybridge · Volumen excepcional.', 7000.00, '/img/azimut_80.jpg'),
('yacht', 'Oasis 40M Benetti', '40 m · Superyate · Beach club espectacular.', 15000.00, '/img/sunseeker_75.jpg'),

-- HELICÓPTEROS (8)
('helicopter', 'Bell 429', 'Bimotor ligero de alto rendimiento · Hasta 7 pax.', 1200.00, '/img/bell_429.jpg'),
('helicopter', 'Bell 505 Jet Ranger', 'Monocavidad de cristal · Vuelos panorámicos.', 850.00, '/img/bell_429.jpg'),
('helicopter', 'Airbus H145', 'Helicóptero bimotor versátil · Hasta 9 pax.', 1000.00, '/img/airbus_h145.jpg'),
('helicopter', 'Airbus H135', 'Referencia mundial en bimotores ligeros.', 950.00, '/img/airbus_h145.jpg'),
('helicopter', 'Airbus ACH160', 'El diseño más innovador y lujoso de su clase.', 2500.00, '/img/airbus_h145.jpg'),
('helicopter', 'AgustaWestland AW109', 'Cabina ejecutiva · Traslados rápidos (285 km/h).', 1500.00, '/img/agusta_aw109.jpg'),
('helicopter', 'AgustaWestland AW139', 'Gran capacidad · VIP · Hasta 15 pax.', 2800.00, '/img/agusta_aw109.jpg'),
('helicopter', 'Sikorsky S-76D', 'Estándar oro para ejecutivos · VIP corporativo.', 3000.00, '/img/cat_helicopteros.png');

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin RoyalRent', 'admin@royalrent.com', '$2b$10$RyVtjZZvdEqOYzK0.GTDzO0..1XNq8y0aBzDrxy0h.TIyN52D8CF2', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';

