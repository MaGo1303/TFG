require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'royalrent',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth routes
// Basic validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password && password.length >= 6;

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }
        if (!email || !validateEmail(email)) {
            return res.status(400).json({ error: 'Formato de email inválido' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !validateEmail(email)) {
            return res.status(400).json({ error: 'Formato de email inválido' });
        }
        if (!password) {
            return res.status(400).json({ error: 'La contraseña es obligatoria' });
        }

        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.execute('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashedPassword, req.user.id]);
        } else {
            await pool.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.user.id]);
        }
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Items routes (Cars, Yachts, Helicopters)
app.get('/api/items', async (req, res) => {
    try {
        const { type } = req.query;
        let query = 'SELECT * FROM items';
        let params = [];
        
        if (type) {
            query += ' WHERE type = ?';
            params.push(type);
        }
        
        const [items] = await pool.execute(query, params);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Orders routes (Cart checkout & History)
app.post('/api/orders', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { items, totalPrice } = req.body; // items is [{ id, quantity, price }]
        
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
            [req.user.id, totalPrice]
        );
        
        const orderId = orderResult.insertId;
        
        for (const item of items) {
            await connection.execute(
                'INSERT INTO order_items (order_id, item_id, quantity, price, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price, item.startDate || null, item.endDate || null]
            );
        }
        
        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Failed to create order' });
    } finally {
        connection.release();
    }
});

app.get('/api/orders/history', authenticateToken, async (req, res) => {
    try {
        const [orders] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        
        for (let order of orders) {
            const [items] = await pool.execute(`
                SELECT oi.*, i.name, i.type, i.image_url 
                FROM order_items oi 
                JOIN items i ON oi.item_id = i.id 
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    }
});

// Contact route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // 1. Guardar copia en la base de datos
        await pool.execute(
            'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );

        // 2. Si hay configuración de email y no son valores de prueba, intentar enviar el correo
        const recipient = process.env.CONTACT_RECIPIENT || 'mj.martinezmajan@gmail.com';
        const isPlaceholder = !process.env.EMAIL_USER || 
                              process.env.EMAIL_USER === 'tu_correo_emisor@gmail.com' ||
                              !process.env.EMAIL_PASS ||
                              process.env.EMAIL_PASS === 'tu_contrase_de_aplicacion_gmail';

        if (!isPlaceholder) {
            try {
                const mailOptions = {
                    from: `"RoyalRent Contacto" <${process.env.EMAIL_USER}>`,
                    to: recipient,
                    subject: `Nuevo mensaje de contacto de ${name}`,
                    text: `Has recibido un nuevo mensaje desde el formulario de contacto de RoyalRent:\n\n` +
                          `Nombre: ${name}\n` +
                          `Email: ${email}\n` +
                          `Mensaje: ${message}\n\n` +
                          `Fecha: ${new Date().toLocaleString()}`,
                    html: `
                        <h2>Nuevo mensaje de contacto - RoyalRent</h2>
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Mensaje:</strong></p>
                        <blockquote style="background: #f4f4f4; padding: 15px; border-left: 5px solid #1a2d5a; color: #333;">
                            ${message.replace(/\n/g, '<br>')}
                        </blockquote>
                        <p style="font-size: 0.8em; color: #777;">Recibido el ${new Date().toLocaleString()}</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                res.status(201).json({ message: 'Mensaje guardado y correo enviado correctamente' });
            } catch (emailError) {
                console.error('⚠️ Error al enviar el correo (SMTP):', emailError);
                res.status(201).json({ 
                    message: 'Mensaje guardado en la base de datos, pero falló el envío del correo electrónico (revisa las credenciales SMTP en el .env).' 
                });
            }
        } else {
            console.log('⚠️ Configuración de email ausente o con valores de prueba. El mensaje se guardó en la BD pero no se envió correo.');
            res.status(201).json({ 
                message: 'Mensaje guardado en la base de datos. Configura las variables SMTP en tu .env para activar el envío de correos.' 
            });
        }
    } catch (error) {
        console.error('Error en /api/contact:', error);
        res.status(500).json({ error: 'Error del servidor al procesar el mensaje de contacto' });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
