<template>
    <div>
        <div id="toolbar">
            <button @click.stop.prevent="zoomIn">Zoom in</button>
            <button @click.stop.prevent="zoomOut">Zoom out</button>
        </div>
        <div id="app">
            <div class="wrapper">
                <canvas id="canvas" width="500" height="500"></canvas>
            </div>
        </div>
    </div>
</template>

<style>
    #toolbar {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        background-color: #333;
        padding: 10px;
    }
    .wrapper {
        display: flex;
        margin: auto;
    }
    * {
        margin: 0;
        padding: 0;
    }
    #app {
        display: flex;
        background-color: #fff;
        height: 100vh;
    }
    canvas {
        border: 2px #000 solid;
    }
</style>

<script>

    import $ from 'jquery'
    import ClipRect from './classes/ClipRect'
    export default {
        name: 'app',
        methods: {
            zoomIn() {
                this.canvas.setZoom(this.canvas.getZoom() + 0.2);
            },
            zoomOut() {
                this.canvas.setZoom(this.canvas.getZoom() - 0.2);
            }
        },
        mounted() {

            this.canvas = new fabric.Canvas('canvas');

            let rect1 = new ClipRect(this.canvas, {
                left: 0,
                top: 0,
                width: 249,
                height: 249,
            });
            rect1.render();

            let rect2 = new ClipRect(this.canvas, {
                left: 251,
                top: 0,
                width: 249,
                height: 249,
            });
            rect2.render();

            let rect3 = new ClipRect(this.canvas, {
                left: 0,
                top: 251,
                width: 249,
                height: 249,
            });
            rect3.render();

            let rect4 = new ClipRect(this.canvas, {
                left: 251,
                top: 251,
                width: 249,
                height: 249,
            });
            rect4.render();

            $('body').keydown((e) => {
                if (e.keyCode === 13) {
                    this.absolutePan(
                        new fabric.Point(
                            0,
                            0,
                        )
                    );
                    this.renderAll();
                    this.trigger('moved');
                }
                if (e.keyCode === 8) {
                    const obj = this.getActiveObject();
                    if (obj) {
                        obj.remove();
                    }
                    this.renderAll();
                }
            });

        }
    }
</script>