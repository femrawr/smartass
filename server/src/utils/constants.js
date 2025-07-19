export default {
    get debug() {
        return process.env.DEBUG === 'true';
    },

    status: {
        OK: 200,
        BAD_REQUEST: 400,
        INTERNAL_SERVER_ERROR: 500
    }
};