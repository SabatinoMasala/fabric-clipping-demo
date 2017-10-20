/* global fabric */
import $ from 'jquery';
export default {
    handleEvent(e, callback) {

        // If the user cancelled, we want to return
        if (e.target.files.length === 0) { return; }
        // Get the first file
        const file = e.target.files[0];
        // Create a FileReader
        const reader = new FileReader();

        // Uncomment the following lines to check the filesize before loading the image

        // let size = file.size/1024/1024;
        // if (size > 5) {
        //     alert('Images larger than 5MB are not accepted.');
        //     return;
        // }

        // Set the onload event handler
        reader.onload = (f) => {
            // Get the result
            let data = f.target.result;
            // Create an image from the data we got back
            fabric.Image.fromURL(data, (img) => {
                let aspect = 0;
                let fabricImage = null;
                const imageProps = {
                    left: 0,
                    top: 0,
                    originX: 'left',
                    originY: 'top',
                    angle: 0
                };
                let props = {};
                // Landscape image
                if (img.width > img.height) {
                    // Set the aspect
                    aspect = img.width / img.height;
                    // Set the props
                    props = Object.assign(defaultProps, {
                        width: 1,
                        height: 1 / aspect
                    });
                } else { // Portrait image
                    // Set the aspect
                    aspect = img.height / img.width;
                    // Set the props
                    props = Object.assign(imageProps, {
                        width: 1 / aspect,
                        height: 1
                    })
                }
                // Assign the props to the fabric image
                fabricImage = img.set(props);
                // Callback
                callback(fabricImage);
            });
        };
        // Start the reader
        reader.readAsDataURL(file);
        // Reset the input[type="file"]
        $(e.currentTarget).val('');
    }
}