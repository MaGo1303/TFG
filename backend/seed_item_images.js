require('dotenv').config();
const mysql = require('mysql2/promise');

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const MIN_IMAGES_PER_ITEM = 4;
const REFRESH_IMAGES = process.argv.includes('--refresh');

const typeSearchTerms = {
    car: ['car', 'automobile', 'vehicle', 'exterior', 'interior'],
    yacht: ['yacht', 'boat', 'superyacht', 'ship', 'interior', 'exterior'],
    helicopter: ['helicopter', 'aircraft', 'rotorcraft', 'cockpit', 'exterior'],
};

const typeRequiredTerms = {
    car: ['car', 'cars', 'auto', 'automobile', 'vehicle', 'roadster', 'coupe', 'sedan', 'suv'],
    yacht: ['yacht', 'yachts', 'boat', 'boats', 'superyacht', 'ship', 'vessel', 'marine'],
    helicopter: ['helicopter', 'helicopters', 'aircraft', 'rotorcraft', 'cockpit'],
};

const blockedTerms = [
    'portrait', 'people', 'person', 'woman', 'man', 'child', 'family', 'wedding',
    'painting', 'drawing', 'engraving', 'statue', 'grave', 'cemetery', 'church',
    'map', 'logo', 'badge', 'coat_of_arms', 'seal', 'poster', 'book', 'document',
    'album', 'film', 'actor', 'actress', 'writer', 'politician', 'composer',
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeText = (text = '') => text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]+/g, ' ');

const getModelTokens = (name) => normalizeText(name)
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 3 || /^\d{2,}$/.test(token));

function isRelevantImage(item, result) {
    const searchableText = normalizeText(`${result.title || ''} ${decodeURIComponent(result.url || '')}`);
    const modelTokens = getModelTokens(item.name);
    const typeTerms = typeRequiredTerms[item.type] || [];
    const hasBlockedTerm = blockedTerms.some(term => searchableText.includes(term));
    const hasTypeTerm = typeTerms.some(term => searchableText.includes(term));
    const matchedModelTokens = modelTokens.filter(token => searchableText.includes(token));
    const hasDigitToken = modelTokens.some(token => /^\d{2,}$/.test(token));
    const matchedDigitToken = modelTokens.some(token => /^\d{2,}$/.test(token) && searchableText.includes(token));
    const hasExactModel = searchableText.includes(normalizeText(item.name));

    if (hasBlockedTerm) return false;
    if (hasExactModel) return true;
    if (matchedModelTokens.length >= 2 && (hasTypeTerm || matchedDigitToken)) return true;
    if (hasDigitToken && matchedModelTokens.length >= 2) return true;
    return matchedModelTokens.length >= Math.min(3, modelTokens.length) && hasTypeTerm;
}

async function commonsSearch(query, limit = 8, attempt = 1) {
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrnamespace: '6',
        gsrlimit: String(limit),
        gsrsearch: `${query} filetype:bitmap`,
        prop: 'imageinfo',
        iiprop: 'url',
        format: 'json',
        origin: '*',
    });

    const response = await fetch(`${COMMONS_API}?${params.toString()}`, {
        headers: { 'User-Agent': 'RoyalRent-TFG/1.0 (image seeding script)' },
    });

    if (response.status === 429 && attempt <= 4) {
        const retryAfter = Number(response.headers.get('retry-after'));
        const waitMs = Number.isFinite(retryAfter)
            ? retryAfter * 1000
            : 5000 * attempt;
        console.log(`Wikimedia limit reached. Waiting ${Math.ceil(waitMs / 1000)}s before retrying "${query}"...`);
        await sleep(waitMs);
        return commonsSearch(query, limit, attempt + 1);
    }

    if (!response.ok) {
        throw new Error(`Wikimedia request failed: ${response.status}`);
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});

    return pages
        .map(page => ({ title: page.title || '', url: page.imageinfo?.[0]?.url }))
        .filter(result => result.url)
        .filter(result => /\.(jpe?g|png|webp)$/i.test(result.url.split('?')[0]));
}

async function findImagesForItem(item) {
    const queries = [
        `"${item.name}"`,
        ...(typeSearchTerms[item.type] || []).map(term => `"${item.name}" ${term}`),
        ...(typeSearchTerms[item.type] || []).map(term => `${item.name} ${term}`),
    ];

    const images = [];
    for (const query of queries) {
        let results = [];
        try {
            results = await commonsSearch(query, 12);
        } catch (error) {
            console.log(`Skipping query "${query}": ${error.message}`);
            await sleep(5000);
            continue;
        }
        for (const result of results) {
            if (!isRelevantImage(item, result)) continue;
            const url = result.url;
            if (!images.includes(url)) images.push(url);
            if (images.length >= MIN_IMAGES_PER_ITEM) return images;
        }
        await sleep(1500);
    }

    return images;
}

async function seedItemImages() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'royalrent',
    });

    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS item_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_id INT NOT NULL,
                image_url TEXT NOT NULL,
                position INT DEFAULT 0,
                FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
            )
        `);
        await connection.execute('ALTER TABLE item_images MODIFY image_url TEXT NOT NULL');

        const [items] = await connection.execute('SELECT id, type, name, image_url FROM items ORDER BY id ASC');

        for (const item of items) {
            const [[existing]] = await connection.execute(
                'SELECT COUNT(*) as count FROM item_images WHERE item_id = ?',
                [item.id]
            );

            if (!REFRESH_IMAGES && existing.count >= MIN_IMAGES_PER_ITEM) {
                console.log(`OK ${item.name}: already has ${existing.count} images`);
                continue;
            }

            console.log(`Searching images for ${item.name}...`);
            const images = await findImagesForItem(item);

            if (images.length < MIN_IMAGES_PER_ITEM && item.image_url && !images.includes(item.image_url)) {
                images.push(item.image_url);
            }

            const uniqueImages = images.slice(0, MIN_IMAGES_PER_ITEM);
            await connection.execute('DELETE FROM item_images WHERE item_id = ?', [item.id]);

            for (const [index, imageUrl] of uniqueImages.entries()) {
                await connection.execute(
                    'INSERT INTO item_images (item_id, image_url, position) VALUES (?, ?, ?)',
                    [item.id, imageUrl, index]
                );
            }

            console.log(`Saved ${uniqueImages.length} images for ${item.name}`);
            await sleep(2000);
        }

        console.log('Image seeding completed.');
    } finally {
        await connection.end();
    }
}

seedItemImages().catch(error => {
    console.error('Image seeding failed:', error);
    process.exitCode = 1;
});
