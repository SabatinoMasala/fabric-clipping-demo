import $ from 'jquery'
import UploadHelper from '../helpers/UploadHelper'
export default class {
    constructor(canvas, userOptions = {}) {

        let defaults = {
            originX: 'left',
            originY: 'top',
            fill: '#ccc',
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
            this.positionButton();
        });
        this.canvas.on('moved', _ => {
            this.positionButton();
        });

        // Input upload
        this.inputUpload = document.createElement('input');
        this.inputUpload.type = 'file';
        document.body.append(this.inputUpload);

        // Button
        this.btnUpload = document.createElement('button');
        this.btnUpload.innerHTML = 'Upload';
        this.btnUpload.style.position = 'absolute';
        document.body.append(this.btnUpload);

        // Events
        $(this.btnUpload).click(this.onClick.bind(this));
        $(this.inputUpload).change(this.handleUpload.bind(this));
    }
    handleUpload(e) {
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
                let panLeft = 0;
                let panTop = 0;
                this.setCoords();
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.beginPath();
                console.log(_this.clipRect.width);
                ctx.rect(
                    _this.zoom(_this.clipRect.left) + panLeft,
                    _this.zoom(_this.clipRect.top) + panTop,
                    _this.zoom(_this.clipRect.width),
                    _this.zoom(_this.clipRect.height)
                );
                ctx.closePath();
                ctx.restore();
            }
        });
        fabricImage.on('removed', (e) => {
            this.setState({
                hasImage: false
            })
        });
        this.canvas.add(fabricImage).renderAll();
        this.canvas.setActiveObject(fabricImage);
        this.setState({
            hasImage: true
        })
    }
    _degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    setState(state) {
        this.state = Object.assign(this.state, state);
        if (!this.state.hasImage) {
            $(this.btnUpload).show();
        } else {
            $(this.btnUpload).hide();
        }
    }
    onClick(e) {
        $(this.inputUpload).trigger('click');
    }
    getCanvasPos() {
        return $(this.canvas.upperCanvasEl).offset();
    }
    zoom(value) {
        return value * this.canvas.getZoom();
    }
    positionButton() {
        let domCanvasPos = this.getCanvasPos();
        let panLeft = this.canvas.viewportTransform[4];
        let panTop = this.canvas.viewportTransform[5];
        let objectPos = {
            top: this.zoom(this.clipRect.top),
            left: this.zoom(this.clipRect.left),
            width: this.zoom(this.clipRect.width),
            height: this.zoom(this.clipRect.height),
        };
        let domButtonSize = {
            width: $(this.btnUpload).width(),
            height: $(this.btnUpload).height(),
        };
        $(this.btnUpload).offset({
            top: domCanvasPos.top + objectPos.top + objectPos.height / 2 - domButtonSize.height / 2 + panTop,
            left: domCanvasPos.left + objectPos.left + objectPos.width / 2 - domButtonSize.width / 2 + panLeft,
        })
    }
    render() {
        this.canvas.add(this.clipRect);
        this.canvas.renderAll();
        this.positionButton();
    }
}