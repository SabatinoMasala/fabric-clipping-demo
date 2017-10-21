<template>
    <div>
        <github-corners repo="SabatinoMasala/fabric-clipping-demo"></github-corners>
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
        <h1 class="text-center heading">Fabric.js clipping & panning demo</h1>
        <div id="app">
            <div class="wrapper">
                <canvas id="canvas" width="500" height="500"></canvas>
                <div class="text-center">
                    <p class="help" v-if="helpMessage">{{ helpMessage }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueGitHubCorners from 'vue-gh-corners';
    import 'vue-gh-corners/dist/vue-github-corners.css';
    Vue.use(VueGitHubCorners);
    import $ from 'jquery'
    import ClipRect from './classes/ClipRect'
    import Panning from './classes/Panning'
    export default {
        name: 'fabric-clipping-demo',
        computed: {
            // Generate helpful messages to help the user
            helpMessage() {
                if (this.activeObject) {
                    return 'Press backspace to delete the object';
                }
                if (this.dragMode) {
                    return 'Drag the canvas to pan';
                }
                return false;
            }
        },
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
            this.canvas.backgroundColor = '#fff';

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
<style lang="scss">
    $colorPrimary: #fff;
    $colorDelete: #D64933;
    $colorText: #2B303A;
    $colorBg: #92DCE5;
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        background-color: $colorBg;
        font-family: HelveticaNeue,Helvetica Neue,Helvetica,Arial,sans-serif;
        color: $colorText;
    }
    .help {
        display: inline-block;
        padding: 10px;
        background-color: $colorPrimary;
    }
    .heading {
        padding-top: 100px;
    }
    #toolbar {
        background-color: $colorPrimary;
        padding: 10px;
        z-index: 999;
        .spacer {
            display: inline-block;
            width: 20px;
        }
        button.delete {
            background-color: $colorDelete;
            color: #fff;
        }
    }
    button {
        border: 0;
        background-color: $colorText;
        color: $colorPrimary;
        cursor: pointer;
        padding: 10px;
    }
    .text-center {
        text-align: center;
    }
    .canvas-container {
        border: 2px $colorPrimary solid;
        overflow: hidden;
        margin: 50px auto;
    }
    input[type=file] {
        position: absolute;
        opacity: 0;
    }
</style>