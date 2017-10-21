import $ from 'jquery'
import UploadHelper from '../helpers/UploadHelper'
export default class {
    constructor(canvas, userOptions = {}) {
        // Set some defaults
        let defaults = {
            originX: 'left',
            originY: 'top',
            fill: '#FF8552',
            strokeWidth: 0,
            selectable: false,
            evented: false,
        };
        // Overwrite the defaults with the user options
        let options = Object.assign(defaults, userOptions);
        // Keep track of the state
        this.state = {
            hasImage: false
        };
        // Store some instance variables
        this.canvas = canvas;
        this.clipRect = new fabric.Rect(options);
        // Events
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

        // DOM Events
        $(this.btnUpload).click(this._onClickButtonUpload.bind(this));
        $(this.inputUpload).change(this._handleUpload.bind(this));
    }
    _handleUpload(e) {
        UploadHelper.handleEvent(e, (fabricImage) => {
            this._loadImage(fabricImage)
        });
    }
    _loadImage(fabricImage) {
        // Store a reference to this
        let _this = this;
        // Set values on the image
        fabricImage.set({
            left: this.clipRect.left,
            top: this.clipRect.top,
            width: fabricImage.width * this.clipRect.width,
            height: fabricImage.height * this.clipRect.width,
            clipTo(ctx) {
                // Get the viewport absolute panning X and Y
                let panLeft = this.canvas.viewportTransform[4];
                let panTop = this.canvas.viewportTransform[5];
                this.setCoords();
                ctx.save();
                // Reset the context
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                // Start drawing
                ctx.beginPath();
                // Get the values
                ctx.rect(
                    _this._zoom(_this.clipRect.left) + _this._multiplied(panLeft),
                    _this._zoom(_this.clipRect.top) + _this._multiplied(panTop),
                    _this._zoom(_this.clipRect.width),
                    _this._zoom(_this.clipRect.height)
                );
                // Stop drawing
                ctx.closePath();
                // Restore
                ctx.restore();
            }
        });
        // Events on the image
        fabricImage.on('removed', (e) => {
            this._setState({
                hasImage: false
            })
        });
        // Add the image to the canvas
        this.canvas.add(fabricImage).renderAll();
        // Set the active image
        this.canvas.setActiveObject(fabricImage);
        // Update the state
        this._setState({
            hasImage: true
        })
    }
    // Helper method to convert degrees to radians
    _degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    // Update the current state
    _setState(state) {
        // Overwrite the state
        this.state = Object.assign(this.state, state);
        // If we have no image, we show the upload button
        if (!this.state.hasImage) {
            $(this.btnUpload).show();
            this._positionButton();
        } else { // If we have an image, we hide the upload button
            $(this.btnUpload).hide();
        }
    }
    // Click handler for the upload button
    _onClickButtonUpload(e) {
        // We trigger the click event on the upload input
        $(this.inputUpload).trigger('click');
    }
    // Helper method to get the position of the canvas element
    _getDomCanvasPosition() {
        return $(this.canvas.upperCanvasEl).offset();
    }
    // When we're on retina displays (iPad/MBP) the devicePixelRatio isn't 1, we have to multiply values manually
    _multiplied(value) {
        return fabric.window.devicePixelRatio * value;
    }
    // Get the canvas zoom and multiply the given value, dom elements don't need the multiplication with devicePixelRatio
    _zoom(value, needsDevicePixelRatio = true) {
        const multiplier = this.canvas.getZoom() * (needsDevicePixelRatio ? fabric.window.devicePixelRatio : 1); // Retina ready!
        return value * multiplier;
    }
    // Position the upload button
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
        // Set the offset on the upload button
        $(this.btnUpload).offset({
            top: objectPos.top + objectPos.height / 2 + panTop - domButtonSize.height / 2 + domCanvasPos.top,
            left: objectPos.left + objectPos.width / 2 + panLeft - domButtonSize.width / 2 + domCanvasPos.left,
        })
    }
    // Public method to add the cliprect to the canvas
    render() {
        // Add the cliprect to the canvas
        this.canvas.add(this.clipRect).renderAll();
        // Reposition the button
        this._positionButton();
    }
}