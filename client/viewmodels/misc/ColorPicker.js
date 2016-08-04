import EventedViewModel from '../shared/EventedViewModel';

export default class ColorPicker extends EventedViewModel {

    static eventTypes() {
        return [
            'change',
            'colorSelected'
        ];
    }

    constructor() {
        super();

        this.active = false;
        this.target = null;
    }

    //region publics

    activate(target) {
        this.active = true;
        this.target = target;
        this.emit('change');
    }

    deactivate() {
        this.active = false;
        this.emit('change');
    }

    //endregion

    //region handlers

    onColorSelected(color) {
        this.emit('colorSelected', color);
    }

    //endregion

}