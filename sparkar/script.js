// Load in the Diagnostics module
const Diagnostics = require('Diagnostics');
const FaceTracking = require('FaceTracking');
const Scene = require('Scene');
const CameraInfo = require('CameraInfo');
const FaceTracking2D = require('FaceTracking2D');
const Time = require('Time');
const Reactive = require('Reactive');
const {ballAnimNonReact} = require('./ballAnimNonReact.js');
const Patches = require('Patches');

const facePosition = {
    x: -1,
    y: -1,
    width: -1,
    height: -1
};

(async () => {
    const faceRect = await Scene.root.findFirst('faceRect');
    const face = FaceTracking2D.face(0);

// Calculate the width and height of the preview,
// correcting for the pixel resolution
    const previewSizeWidth = CameraInfo.previewSize.width
        .div(CameraInfo.previewScreenScale);

    const previewSizeHeight = CameraInfo.previewSize.height
        .div(CameraInfo.previewScreenScale);


    // Set the position of the rectangle to the position of the face,
    // multiplied by the preview size
        faceRect.transform.x = face.boundingBox.x.mul(previewSizeWidth).add(face.boundingBox.width.mul(previewSizeWidth).mul(0.5)).add(faceRect.width.mul(-0.5));
        faceRect.transform.y = face.boundingBox.y.mul(previewSizeHeight);

        faceRect.width = face.boundingBox.width.mul(previewSizeWidth);
        faceRect.height = face.boundingBox.width.mul(previewSizeWidth);


    const faceIsTracked = face.isTracked


    Patches.outputs.getBoolean('start_game').then(event => {
        event.monitor().subscribe(function (values) {
            if (values.newValue) {
                ballAnimNonReact(faceRect.width, faceIsTracked);
            }
        });
    });


})();
