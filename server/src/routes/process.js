import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { createWorker } from 'tesseract.js';

import constants from '../utils/constants.js';
import genAI from '../utils/genAI.js';
import utils from '../utils/utils.js';

const router = express.Router();

router.post('/process', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { image } = req.body;
        if (!image) {
            return res
                .status(constants.status.BAD_REQUEST)
                .json({
                    success: false,
                    message: 'no image provided',
                    data: null
                });
        }

        const cleaned = image.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(cleaned, 'base64');

        const file = path.join(os.tmpdir(), utils.genStr(10) + '.png');
        fs.writeFileSync(file, buffer);

        const worker = await createWorker('eng');
        const question = await worker.recognize(file);

        const answer = await genAI.submit(question.data.text, 'gemini-2.5-flash');
        await worker.terminate();
        fs.unlinkSync(file);

        const index = answer.indexOf('|');
        const parts = index !== -1
            ? [answer.slice(0, index), answer.slice(index + 1)]
            : [answer, null];

        return res
            .status(constants.status.OK)
            .json({
                success: true,
                message: parts[0],
                data: parts[1]
            });
    } catch(e) {
        return res
            .status(constants.status.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: 'failed to process',
                data: e.message
            });
    }
});

router.options('/process', (_, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

export default router;