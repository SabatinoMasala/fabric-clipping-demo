import $ from 'jquery'
import UploadHelper from '../helpers/UploadHelper'
import _ from 'lodash'
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
        let options = Object.assign({}, defaults, userOptions);
        // Keep track of the state
        this.state = {
            hasImage: false,
            hover: false,
            selected: false
        };
        // Store some instance variables
        this.canvas = canvas;
        this.clipRect = new fabric.Rect(options);
        // Events
        this.clipRect.on('moving', _ => {
            this._positionButtons();
        });
        this.canvas.on('moved', _ => {
            this._positionButtons();
        });
        this.canvas.on('mouse:move', _.throttle(data => {
            // If the image is selected, we allow clicks from outside the clipRect
            if (this.state.selected) {
                return;
            }
            // Check if the mouse is over the cliprect
            const event = data.e;
            const panLeft = this.canvas.viewportTransform[4];
            const panTop = this.canvas.viewportTransform[5];
            let hovering = false;
            const offsetX = event.offsetX;
            const offsetY = event.offsetY;
            if (offsetX > this._zoom(this.clipRect.left + panLeft, false) && offsetX < this._zoom(this.clipRect.left + this.clipRect.width + panLeft, false)) {
                if (offsetY > this._zoom(this.clipRect.top + panTop, false) && offsetY < this._zoom(this.clipRect.top + this.clipRect.height + panTop, false)) {
                    hovering = true;
                }
            }
            this._setState({
                hover: hovering
            })
        }, 500));

        // Input upload
        this.inputUpload = document.createElement('input');
        this.inputUpload.type = 'file';
        document.body.append(this.inputUpload);

        // Button
        this.btnUpload = document.createElement('button');
        this.btnUpload.innerHTML = 'Upload';
        this.btnUpload.style.position = 'absolute';
        $('.canvas-container').append(this.btnUpload);

        // Edit button
        this.btnSelect = document.createElement('button');
        this.btnSelect.innerHTML = 'Select';
        this.btnSelect.className = 'cliprect_toolbar__edit';
        this.btnSelect.style.position = 'absolute';
        $(this.btnSelect).hide();
        $('.canvas-container').append(this.btnSelect);

        // Delete button
        this.btnDelete = document.createElement('button');
        this.btnDelete.innerHTML = 'Delete';
        this.btnDelete.className = 'cliprect_toolbar__delete';
        this.btnDelete.style.position = 'absolute';
        $(this.btnDelete).hide();
        $('.canvas-container').append(this.btnDelete);

        // DOM Events
        $(this.btnUpload).click(this._onClickButtonUpload.bind(this));
        $(this.btnDelete).click(this._handleDelete.bind(this));
        $(this.btnSelect).click(this._handleEdit.bind(this));
        $(this.inputUpload).change(this._handleUpload.bind(this));
    }
    _handleEdit(e) {
        this.canvas.setActiveObject(this.fabricImage);
    }
    _handleDelete(e) {
        this.fabricImage.remove();
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
        // Store the image in an instance variable
        this.fabricImage = fabricImage;
        // Events on the image
        fabricImage.on('removed', (e) => {
            this._setState({
                hasImage: false
            })
        });
        // When the image is deselected, we set evented & selectable to false
        fabricImage.on('deselected', (e) => {
            fabricImage.set({
                // evented: false,
                // selectable: false
            });
            this._setState({
                selected: false
            })
        });
        // When the image is selected, we set evented & selectable to true, so we can move the image
        fabricImage.on('selected', (e) => {
            fabricImage.set({
                evented: true,
                selectable: true
            });
            this._setState({
                selected: true
            });
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
    _setState(newState) {
        // Merge old state and new state
        newState = Object.assign({}, this.state, newState);
        if (newState.hasImage !== this.state.hasImage) {
            // If we have no image, we show the upload button
            if (!newState.hasImage) {
                $(this.btnUpload).show();
                $(this.btnDelete).hide();
                $(this.btnSelect).hide();
            } else { // If we have an image, we hide the upload button
                $(this.btnUpload).hide();
                $(this.btnDelete).show();
            }
            this._positionButtons();
        }
        if (newState.hasImage) {
            if (newState.selected !== this.state.selected) {
                if (newState.selected) {
                    $(this.btnSelect).hide();
                } else {
                    $(this.btnSelect).show();
                }
                this._positionButtons();
            }
        }
        if (newState.hover !== this.state.hover) {
            // If we have an image, we make it selectable ONLY when the mouse is over the cliprect
            if (newState.hover) {
                if (this.fabricImage) {
                    this.fabricImage.set({
                        evented: true,
                        selectable: true
                    })
                }
            } else {
                if (this.fabricImage) {
                    this.fabricImage.set({
                        evented: false,
                        selectable: false
                    })
                }
            }
            this.canvas.renderAll();
        }
        // Overwrite the state
        this.state = newState;
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
    _positionButtons() {
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
        });
        // Set the offset on the upload button
        $(this.btnDelete).offset({
            top: objectPos.top + panTop + domCanvasPos.top + 7,
            left: objectPos.left + panLeft + domCanvasPos.left + 7,
        });
        // Set the offset on the upload button
        $(this.btnSelect).offset({
            top: objectPos.top + panTop + domCanvasPos.top + 50,
            left: objectPos.left + panLeft + domCanvasPos.left + 7,
        })
    }
    // Public method to add the cliprect to the canvas
    render() {
        // Add the cliprect to the canvas
        this.canvas.add(this.clipRect).renderAll();
        // Reposition the button
        this._positionButtons();
    }
}