import mornitor from  './src/mornitor';

class Guard {
    constructor() {
        this.guard = mornitor.tryCat;
        mornitor.init();
    }
}

if(!window.GuardJS) {
    window.GuardJS = new Guard();
}
