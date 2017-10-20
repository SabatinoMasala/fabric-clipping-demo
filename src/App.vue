<template>
    <div id="app">
        <canvas id="canvas" width="500" height="500"></canvas>
    </div>
</template>

<style>
    #button {
        position: absolute;
        z-index: 999;
    }
    * {
        margin: 0;
        padding: 0;
    }
    #app {
        background-color: #ccc;
        padding: 100px;
        height: 100vh;
    }
    canvas {
        margin: auto;
        border: 2px #000 solid;
    }
</style>

<script>

    import ClipRect from './classes/ClipRect'
    import _ from 'lodash'
    export default {
        name: 'app',
        components: {
        },
        mounted() {
            const canvas = new fabric.Canvas('canvas');

            let rect1 = new ClipRect(canvas, {
                left: 0,
                top: 0,
                width: 249,
                height: 249,
            });
            rect1.render();

            let rect2 = new ClipRect(canvas, {
                left: 251,
                top: 0,
                width: 249,
                height: 249,
            });
            rect2.render();

            let rect3 = new ClipRect(canvas, {
                left: 0,
                top: 251,
                width: 249,
                height: 249,
            });
            rect3.render();

            let rect4 = new ClipRect(canvas, {
                left: 251,
                top: 251,
                width: 249,
                height: 249,
            });
            rect4.render();

        }
    }
</script>