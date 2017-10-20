import $ from 'jquery'
import UploadHelper from '../helpers/UploadHelper'
import _ from 'lodash'
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
        let _this = this;
        UploadHelper.handleEvent(e, (fabricImage) => {
            fabricImage.set({
                left: this.clipRect.left,
                top: this.clipRect.top,
                width: fabricImage.width * this.clipRect.width,
                height: fabricImage.height * this.clipRect.width,
                clipTo(ctx) {
                    this.setCoords();
                    let scaleXTo1 = (1 / this.scaleX);
                    let scaleYTo1 = (1 / this.scaleY);
                    ctx.save();

                    let ctxLeft = -( this.width / 2 ) + _this.clipRect.strokeWidth;
                    let ctxTop = -( this.height / 2 ) + _this.clipRect.strokeWidth;
                    let ctxWidth = _this.clipRect.width - _this.clipRect.strokeWidth;
                    let ctxHeight = _this.clipRect.height - _this.clipRect.strokeWidth;

                    ctx.translate( ctxLeft, ctxTop );

                    ctx.rotate(_this._degToRad(this.angle * -1));
                    ctx.scale(scaleXTo1, scaleYTo1);
                    ctx.beginPath();
                    ctx.rect(
                        _this.clipRect.left - this.oCoords.tl.x,
                        _this.clipRect.top - this.oCoords.tl.y,
                        _this.clipRect.width,
                        _this.clipRect.height
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
        });
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
    positionButton() {
        let canvasPos = this.getCanvasPos();
        let objectPos = {
            top: this.clipRect.top,
            left: this.clipRect.left,
            width: this.clipRect.width,
            height: this.clipRect.height,
        };
        let buttonPos = {
            width: $(this.btnUpload).width(),
            height: $(this.btnUpload).height(),
        };
        $(this.btnUpload).offset({
            top: canvasPos.top + objectPos.top + objectPos.height / 2 - buttonPos.height / 2,
            left: canvasPos.left + objectPos.left + objectPos.width / 2 - buttonPos.width / 2,
        })
    }
    render() {
        this.canvas.add(this.clipRect);
        this.canvas.renderAll();
        this.positionButton();
    }
}