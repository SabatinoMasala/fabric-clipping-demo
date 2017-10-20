import $ from 'jquery'
export default class {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = options;
        this.clipRect = new fabric.Rect({
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 500,
            height: 249,
            fill: '#ff0000',
            strokeWidth: 0,
            selectable: false,
            evented: false,
        });
        this.uploadButton = document.createElement('button');
        this.uploadButton.innerHTML = 'Upload';
        this.uploadButton.style.position = 'absolute';
        document.body.append(this.uploadButton);
    }
    getCanvasPos() {
    }
    positionButton() {
    }
    render() {
        this.canvas.add(this.clipRect);
        this.positionButton();
    }
}