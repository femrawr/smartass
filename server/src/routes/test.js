import express from 'express';

import constants from '../utils/constants.js';

const router = express.Router();

router.get('/test', (_, res) => {
    const msg = 'debugging: ' + constants.debug;
    console.log(msg);

    return res
        .status(constants.status.OK)
        .json({
            success: true,
            message: msg,
            data: null
        });
});

export default router;