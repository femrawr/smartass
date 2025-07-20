import gui from './gui/gui.js';

class Main {
    constructor() {
        this.init();
    }

    init() {
        gui.load(false);
    }
};

export default new Main();