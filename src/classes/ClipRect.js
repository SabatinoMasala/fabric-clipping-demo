import $ from 'jquery'
import UploadHelper from '../helpers/UploadHelper'
export default class {
    constructor(canvas, userOptions = {}) {

        let defaults = {
            originX: 'left',
            originY: 'top',
            fill: '#FF8552',
            strokeWidth: 0,
            selectable: false,
            evented: false,
        };

        let options = Object.assign(defaults, userOptions);

        this.state = {
            hasImage: false
        };

        this.canvas = canvas;
        this.clipRect = new fabric.Rect(options);
        this.clipRect.on('moving', _ => {
            this._positionButton();
        });
        this.canvas.on('moved', _ => {
            this._positionButton();
        });

        // Input upload
        this.inputUpload = document.createElement('input');
        this.inputUpload.type = 'file';
        document.body.append(this.inputUpload);

        // Button
        this.btnUpload = document.createElement('button');
        this.btnUpload.innerHTML = 'Upload';
        this.btnUpload.style.position = 'absolute';
        $('.canvas-container').append(this.btnUpload);

        // Events
        $(this.btnUpload).click(this._onClick.bind(this));
        $(this.inputUpload).change(this._handleUpload.bind(this));
    }
    _handleUpload(e) {
        UploadHelper.handleEvent(e, (fabricImage) => {
            this._loadImage(fabricImage)
        });
    }
    _loadImage(fabricImage) {
        let _this = this;
        let left = this.clipRect.left;
        let top = this.clipRect.top;
        let width = fabricImage.width * this.clipRect.width;
        let height = fabricImage.height * this.clipRect.width;
        fabricImage.set({
            left: left,
            top: top,
            width: width,
            height: height,
            clipTo(ctx) {
                let panLeft = this.canvas.viewportTransform[4];
                let panTop = this.canvas.viewportTransform[5];
                this.setCoords();
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.beginPath();
                ctx.rect(
                    _this._zoom(_this.clipRect.left) + _this._multiplied(panLeft),
                    _this._zoom(_this.clipRect.top) + _this._multiplied(panTop),
                    _this._zoom(_this.clipRect.width),
                    _this._zoom(_this.clipRect.height)
                );
                ctx.closePath();
                ctx.restore();
            }
        });
        fabricImage.on('removed', (e) => {
            this._setState({
                hasImage: false
            })
        });
        this.canvas.add(fabricImage).renderAll();
        this.canvas.setActiveObject(fabricImage);
        this._setState({
            hasImage: true
        })
    }
    _degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    _setState(state) {
        this.state = Object.assign(this.state, state);
        if (!this.state.hasImage) {
            $(this.btnUpload).show();
            this._positionButton();
        } else {
            $(this.btnUpload).hide();
        }
    }
    _onClick(e) {
        $(this.inputUpload).trigger('click');
    }
    _getDomCanvasPosition() {
        return $(this.canvas.upperCanvasEl).offset();
    }
    _multiplied(value) {
        return fabric.window.devicePixelRatio * value;
    }
    _zoom(value, needsDevicePixelRatio = true) {
        const multiplier = this.canvas.getZoom() * (needsDevicePixelRatio ? fabric.window.devicePixelRatio : 1); // Retina ready!
        return value * multiplier;
    }
    _positionButton() {

        // Get canvas position in the dom
        let domCanvasPos = this._getDomCanvasPosition();

        // Get the absolute panned values of the canvas
        let panLeft = this.canvas.viewportTransform[4];
        let panTop = this.canvas.viewportTransform[5];

        // Dom doesn't need correction for retina displays
        let objectPos = {
            top: this._zoom(this.clipRect.top, false),
            left: this._zoom(this.clipRect.left, false),
            width: this._zoom(this.clipRect.width, false),
            height: this._zoom(this.clipRect.height, false),
        };

        // Get the button size
        let domButtonSize = {
            width: $(this.btnUpload).outerWidth(),
            height: $(this.btnUpload).outerHeight(),
        };
        $(this.btnUpload).offset({
            top: objectPos.top + objectPos.height / 2 + panTop - domButtonSize.height / 2 + domCanvasPos.top,
            left: objectPos.left + objectPos.width / 2 + panLeft - domButtonSize.width / 2 + domCanvasPos.left,
        })
    }
    render() {
        this.canvas.add(this.clipRect);
        this.canvas.renderAll();
        this._positionButton();
    }
}