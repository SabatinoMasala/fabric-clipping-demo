<template>
    <div id="app">
        <div class="wrapper">
            <canvas id="canvas" width="500" height="500"></canvas>
        </div>
    </div>
</template>

<style>
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
        components: {
        },
        mounted() {

            const canvas = new fabric.Canvas('canvas');
            // canvas.setZoom(0.5);
//            canvas.absolutePan(
//                new fabric.Point(
//                    -50,
//                    -50,
//                )
//            );

//            let MyNewClass = fabric.util.createClass(fabric.Group, {
//                type: 'demo',
//                initialize: function () {
//                    this._objects.push(
//                        new fabric.Group([
//                            new fabric.Text('A', {top: 200, left: 200}),
//                            new fabric.Text('B', {top: 200, left: 200})
//                        ]));
//                    this._objects.push(
//                        new fabric.Group([
//                            new fabric.Text('C', {top: 200, left: 200}),
//                            new fabric.Text('D', {top: 200, left: 200})
//                        ]));
//                }
//            });
//
//            let example = new MyNewClass({
//                fill: '#ff0000',
//            });
//
//            canvas.add(example);
//            canvas.renderAll();
//            example.setCoords();
//            console.log(canvas.toJSON());
//
//            return;

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

            $('body').keydown((e) => {
                if (e.keyCode === 13) {
                    canvas.absolutePan(
                        new fabric.Point(
                            0,
                            0,
                        )
                    );
                    canvas.renderAll();
                    canvas.trigger('moved');
                }
                if (e.keyCode === 8) {
                    const obj = canvas.getActiveObject();
                    if (obj) {
                        obj.remove();
                    }
                    canvas.renderAll();
                }
            });

        }
    }
</script>