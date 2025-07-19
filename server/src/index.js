import express from 'express';
import env from 'dotenv';
import http from 'http';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

import { fileURLToPath } from 'url';

const PORT = '34781';

env.config();

const app = express();
app.use(cors());
app.use(express.json({
    limit: '50mb'
}));

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