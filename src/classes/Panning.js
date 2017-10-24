/* global fabric */
const STATE_IDLE = 'idle';
const STATE_PANNING = 'panning';
// Remember the previous X and Y coordinates for delta calculations
let lastClientX;
let lastClientY;
// Keep track of the state
fabric.Canvas.prototype.panState = STATE_IDLE;
fabric.Canvas.prototype.panMouseMoveHandler = function(e) {
    if (this.panState === STATE_PANNING && e && e.e) {
        // let delta = new fabric.Point(e.e.movementX, e.e.movementY); // No Safari support for movementX and movementY
        // For cross-browser compatibility, I had to manually keep track of the delta

        // Calculate deltas
        let deltaX = 0;
        let deltaY = 0;
        if (lastClientX) {
            deltaX = e.e.clientX - lastClientX;
        }
        if (lastClientY) {
            deltaY = e.e.clientY - lastClientY;
        }
        // Update the last X and Y values
        lastClientX = e.e.clientX;
        lastClientY = e.e.clientY;

        let delta = new fabric.Point(deltaX, deltaY);
        this.relativePan(delta);
        this.trigger('moved');
    }
};
fabric.Canvas.prototype.panMouseUpHandler = function(e) {
    this.panState = STATE_IDLE;
};
fabric.Canvas.prototype.panMouseDownHandler = function(e) {
    this.panState = STATE_PANNING;
    lastClientX = e.e.clientX;
    lastClientY = e.e.clientY;
};
fabric.Canvas.prototype.toggleDragMode = function(dragMode) {
    // We're entering dragmode
    if (dragMode) {
        // Discard any active object
        this.discardActiveObject();
        // Set the cursor to 'move'
        this.defaultCursor = 'move';
        // Loop over all objects and disable events / selectable. We remember its value in a temp variable stored on each object
        this.forEachObject(function(object) {
            object.prevEvented = object.evented;
            object.prevSelectable = object.selectable;
            object.evented = false;
            object.selectable = false;
        });
        // Remove selection ability on the canvas
        this.selection = false;
        // When MouseUp fires, we set the state to idle
        this.on('mouse:up', this.panMouseUpHandler);
        // When MouseDown fires, we set the state to panning
        this.on('mouse:down', this.panMouseDownHandler);
        // When the mouse moves, and we're panning (mouse down), we continue
        this.on('mouse:move', this.panMouseMoveHandler);
    } else {
        // When we exit dragmode, we restore the previous values on all objects
        this.forEachObject(function(object) {
            object.evented = (object.prevEvented !== undefined) ? object.prevEvented : object.evented;
            object.selectable = (object.prevSelectable !== undefined) ? object.prevSelectable : object.selectable;
        });
        // Reset the cursor
        this.defaultCursor = 'default';
        // Remove the event listeners
        this.off('mouse:up', this.panMouseUpHandler);
        this.off('mouse:down', this.panMouseDownHandler);
        this.off('mouse:move', this.panMouseMoveHandler);
        // Restore selection ability on the canvas
        this.selection = true;
    }
};