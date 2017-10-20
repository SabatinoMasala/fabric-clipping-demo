/* global fabric */
export default {
    handleEvent(e, callback) {
        if (e.target.files.length === 0) { return; }
        const file = e.target.files[0];
        const reader = new FileReader();
        let size = file.size/1024/1024;
        if (size > 5) {
            alert('Deze afbeelding is te groot.');
            return;
        }
        reader.onload = (f) => {
            let data = f.target.result;
            fabric.Image.fromURL(data, (img) => {
                let aspect = 0;
                let fabricImage = null;
                if (img.width > img.height) {
                    aspect = img.width / img.height;
                    fabricImage = img.set({
                        left: 0,
                        top: 0,
                        originX: 'left',
                        originY: 'top',
                        angle: 0,
                        width: 1,
                        height: 1 / aspect
                    }).scale(1.0);
                } else {
                    aspect = img.height / img.width;
                    fabricImage = img.set({
                        left: 0,
                        top: 0,
                        originX: 'left',
                        originY: 'top',
                        angle: 0,
                        width: 1 / aspect,
                        height: 1
                    }).scale(1.0);
                }
                callback(fabricImage);
            });
        };
        reader.readAsDataURL(file);
    }
}