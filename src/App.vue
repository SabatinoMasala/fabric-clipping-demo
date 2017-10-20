<template>
    <div>
        <div id="toolbar" class="text-center">
            <button @click.stop.prevent="zoomIn">Zoom in</button>
            <button @click.stop.prevent="zoomOut">Zoom out</button>
            <div class="spacer">&nbsp;</div>
            <button @click.stop.prevent="dragMode = true" v-if="!dragMode">Start panning</button>
            <button @click.stop.prevent="dragMode = false" v-else>Stop panning</button>
            <div class="spacer">&nbsp;</div>
            <button @click.stop.prevent="reset()">Reset pan & zoom</button>
            <div class="spacer" v-if="activeObject">&nbsp;</div>
            <button class="delete" @click.stop.prevent="removeActiveObject()" v-if="activeObject">Delete object</button>
        </div>
        <div id="app">
            <div class="wrapper">
                <canvas id="canvas" width="500" height="500"></canvas>
            </div>
        </div>
    </div>
</template>

<script>

    import $ from 'jquery'
    import ClipRect from './classes/ClipRect'
    import Panning from './classes/Panning'
    export default {
        name: 'app',
        methods: {
            // Remove the active object
            removeActiveObject() {
                this.activeObject.remove();
                this.canvas.renderAll();
            },
            // Reset to initial values
            reset() {
                this.canvas.setZoom(1);
                this.canvas.absolutePan(
                    new fabric.Point(0, 0)
                );
                this.dragMode = false;
                this.canvas.trigger('moved');
            },
            // Zoom in handler
            zoomIn() {
                this.canvas.setZoom(this.canvas.getZoom() + 0.2);
                this.canvas.trigger('moved');
            },
            // Zoom out handler
            zoomOut() {
                this.canvas.setZoom(this.canvas.getZoom() - 0.2);
                this.canvas.trigger('moved');
            }
        },
        watch: {
            // Dragmode watcher, this will toggle the dragmode on the canvas whenever the 'dragMode' variable changes
            dragMode() {
                this.canvas.toggleDragMode(this.dragMode);
            }
        },
        mounted() {

            // Grid variables
            const numberOfRows = 3;
            const numberOfCols = 3;
            const gridWidth = 250;
            const spacer = 1;

            // Create the canvas
            this.canvas = new fabric.Canvas('canvas');

            // Listen to some events
            this.canvas.on('object:selected', e => {
                this.activeObject = e.target;
            });
            this.canvas.on('selection:cleared', _ => {
                this.activeObject = false;
            });

            // Create the grid
            for (let i = 0; i < numberOfRows; i++) {
                for (let j = 0; j < numberOfCols; j++) {
                    // Create the cliprect objects on the grid
                    let clipRect = new ClipRect(this.canvas, {
                        left: j * (gridWidth + spacer),
                        top: i * (gridWidth + spacer),
                        width: (gridWidth - spacer),
                        height: (gridWidth - spacer)
                    });
                    // Render it!
                    clipRect.render();
                }
            }

            // I didn't use Vue key bindings for the sake of this example
            const KEY_BACKSPACE = 8;
            $('body').keydown((e) => {
                if (e.keyCode === KEY_BACKSPACE) {
                    // Get the object and delete it if we have one
                    const obj = this.canvas.getActiveObject();
                    if (obj) {
                        obj.remove(); // This will trigger 'removed' on the image
                        this.canvas.renderAll();
                    }
                }
            });

        },
        data() {
            return {
                canvasVisible: true,
                activeObject: false,
                canvas: false,
                dragMode: false
            }
        }
    }
</script>
<style>
    #toolbar {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        background-color: #333;
        padding: 10px;
        z-index: 999;
    }
    #toolbar .spacer {
        display: inline-block;
        width: 20px;
    }
    #toolbar button {
        border: 0;
        background-color: #fff;
        color: #333;
        cursor: pointer;
    }
    #toolbar button.delete {
        background-color: #ff7b83;
        color: #fff;
    }
    .text-center {
        text-align: center;
    }
    button {
        padding: 10px;
    }
    .wrapper {
        display: flex;
        margin: auto;
    }
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    #app {
        display: flex;
        background-color: #fff;
        height: 100vh;
    }
    canvas {
        border: 2px #000 solid;
    }
    .canvas-container {
        overflow: hidden;
    }
    input[type=file] {
        position: absolute;
        opacity: 0;
    }
</style>