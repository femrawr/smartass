export default {
    CHARS: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',

    genStr(len) {
        let str = '';
        for (let i = 0; i < len; i++) {
            str += this.CHARS.charAt(Math.floor(Math.random() * this.CHARS.length));
        }

        return str;
    }
};