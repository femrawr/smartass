import express from 'express';
import { exec } from 'child_process';

const router = express.Router();

router.get('/test', (_, res) => {
    console.log('debugging: ' + process.env.DEBUG);

    exec('start calc', (err) => {
        if (!err) {
            return res
                .status(200)
                .send('BALLS');
        }

        return res
            .status(500)
            .send('failed to open calc');
    });
});

export default router;