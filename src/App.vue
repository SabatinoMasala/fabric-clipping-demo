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
        border: 10px #000 solid;
    }
</style>

<script>

    import ClipRect from './ClipRect'
    import _ from 'lodash'
    export default {
        name: 'app',
        components: {
        },
        mounted() {
            const canvas = new fabric.Canvas('canvas');

            let rect = new ClipRect(canvas);
            rect.render();
            return;

            let clipRect1 = new fabric.Rect({
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                width: 500,
                height: 249,
                fill: '#fff', /* use transparent for no fill */
                strokeWidth: 0,
                selectable: false,
                evented: false,
            });

            clipRect1.set({
                clipFor: 'tl1'
            });
            canvas.add(clipRect1);

            let clipRect2 = new fabric.Rect({
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 251,
                width: 249,
                height: 249,
                fill: '#fff', /* use transparent for no fill */
                strokeWidth: 0,
                selectable: false,
                evented: false,
            });
            clipRect2.set({
                clipFor: 'tl2'
            });
            canvas.add(clipRect2);

            let clipRect3 = new fabric.Rect({
                originX: 'left',
                originY: 'top',
                left: 251,
                top: 251,
                width: 249,
                height: 249,
                fill: '#fff', /* use transparent for no fill */
                strokeWidth: 0,
                selectable: false,
                evented: false,
            });
            clipRect3.set({
                clipFor: 'tl3'
            });
            canvas.add(clipRect3);

            function findByClipName(name) {
                return _.find(canvas.getObjects(), {
                    clipFor: name
                })
            }

            // Since the `angle` property of the Image object is stored
            // in degrees, we'll use this to convert it to radians.
            function degToRad(degrees) {
                return degrees * (Math.PI / 180);
            }

            let clipByName = function (ctx) {
                this.setCoords();
                let clipRect = findByClipName(this.clipName);
                let scaleXTo1 = (1 / this.scaleX);
                let scaleYTo1 = (1 / this.scaleY);
                ctx.save();

                let ctxLeft = -( this.width / 2 ) + clipRect.strokeWidth;
                let ctxTop = -( this.height / 2 ) + clipRect.strokeWidth;
                let ctxWidth = clipRect.width - clipRect.strokeWidth;
                let ctxHeight = clipRect.height - clipRect.strokeWidth;

                ctx.translate( ctxLeft, ctxTop );

                ctx.rotate(degToRad(this.angle * -1));
                ctx.scale(scaleXTo1, scaleYTo1);
                ctx.beginPath();
                ctx.rect(
                    clipRect.left - this.oCoords.tl.x,
                    clipRect.top - this.oCoords.tl.y,
                    clipRect.width,
                    clipRect.height
                );
                ctx.closePath();
                ctx.restore();
            };

            let img1 = new Image();
            img1.onload = function (img) {
                let m = 1.2;
                let image = new fabric.Image(img1, {
                    width: 450 * m,
                    height: 300 * m,
                    left: 0,
                    top: -110,
                    scaleX: 1.0,
                    scaleY: 1.0,
                    clipName: 'tl1',
                    clipTo(ctx) {
                        return _.bind(clipByName, image)(ctx)
                    }
                });
                canvas.add(image);
            };
            img1.src = 'https://images.pexels.com/photos/583837/pexels-photo-583837.jpeg?h=300';

            let img2 = new Image();
            img2.onload = function (img) {
                let image = new fabric.Image(img2, {
                    width: 535,
                    height: 300,
                    left: -280,
                    top: 251,
                    scaleX: 1.0,
                    scaleY: 1.0,
                    clipName: 'tl2',
                    clipTo(ctx) {
                        return _.bind(clipByName, image)(ctx)
                    }
                });
                canvas.add(image);
            };
            img2.src = 'https://images.pexels.com/photos/277262/pexels-photo-277262.jpeg?h=300';

            let img3 = new Image();
            img3.onload = function (img) {
                let image = new fabric.Image(img3, {
                    width: 450,
                    height: 300,
                    left: 251,
                    top: 251,
                    scaleX: 1.0,
                    scaleY: 1.0,
                    clipName: 'tl3',
                    clipTo(ctx) {
                        return _.bind(clipByName, image)(ctx)
                    }
                });
                canvas.add(image);
            };
            img3.src = 'https://images.pexels.com/photos/566564/pexels-photo-566564.jpeg?h=300';

        }
    }
</script>