import express from 'express';
import env from 'dotenv';
import http from 'http';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

const PORT = '34781';

env.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = path.join(__dirname, 'routes');
fs.readdirSync(routes).forEach(async file => {
    if (!file.endsWith('.js')) return;

    const route = await import('./routes/' + file);
    app.use(route.default);
});

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});