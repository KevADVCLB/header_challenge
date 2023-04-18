// Load in the Diagnostics module
const Diagnostics = require('Diagnostics');
const FaceTracking = require('FaceTracking');
const Scene = require('Scene');
const CameraInfo = require('CameraInfo');
const FaceTracking2D = require('FaceTracking2D');
const Time = require('Time');
const Reactive = require('Reactive');
const Patches = require('Patches');

export const ballAnimNonReact = async (fW, faceIsTracked) => {


    const ball = await Scene.root.findFirst('ball');

    const faceRect = await Scene.root.findFirst('faceRect');

    const previewSizeWidth = CameraInfo.previewSize.width
        .div(CameraInfo.previewScreenScale);
    const previewSizeHeight = CameraInfo.previewSize.height
        .div(CameraInfo.previewScreenScale);

    let score = 0;
    let isOver = false;
    let difficulty = 0;

    const isDebug = false;

    const ballWidth = previewSizeWidth.pinLastValue() * 0.3;
    const maxSpeed = 25;
    const gravity = 1.5;

    ball.width = ballWidth;
    ball.height = ballWidth;

    const ballRadius = ballWidth/2 + 25 // + offset
    let pos = {
        x: previewSizeWidth.mul(0.5).pinLastValue(),
        y: previewSizeHeight.mul(-0.5).pinLastValue()
    };

    let speed = {
        x: 0,
        y: 0
    };

    let acceleration = {
        x: 0,
        y: 0
    };

    let facePos = {
        x: -1,
        y: -1
    };

    await Patches.inputs.setScalar('score', score);
    await Patches.inputs.setScalar('difficulty', difficulty);
    await Patches.inputs.setBoolean('isOver', isOver);
    await Patches.inputs.setBoolean('isDebug', isDebug);


    Diagnostics.watch('screen width', previewSizeWidth);
    Diagnostics.watch('screen height', previewSizeHeight);
    Diagnostics.watch('ball X: ', ball.transform.position.x);
    Diagnostics.watch('ball Y: ', ball.transform.position.y);
    Diagnostics.watch('face X', faceRect.transform.x);
    Diagnostics.watch('face Y', faceRect.transform.y);
    Diagnostics.watch('speed Y', speed.y);

    //------------------------------------

    async function reset() {
        //reset
        pos = {
            x: previewSizeWidth.mul(0.5).pinLastValue(),
            y: 0
        };

        speed = {
            x: 0,
            y: 0
        };

        acceleration = {
            x: 0,
            y: 0
        };
        score = 0;
        difficulty = 0;
        isOver = false;
        await Patches.inputs.setBoolean('isOver', isOver);
    }

    // Store current frame.
    let frame = 0;

    Time.ms.monitor().subscribe(async evt => {
        // Count frames
        frame++;
        const now = evt.newValue;
        const delta = now - evt.oldValue;


        //gravity
        acceleration.y = gravity;
        speed.y += acceleration.y;


        const newPos = {
            x: pos.x + speed.x,
            y: pos.y + speed.y
        };


        if (!isOver) {

            if (newPos.x  < ballWidth / 2 || newPos.x > previewSizeWidth.pinLastValue() - ballWidth / 2) {
                speed.x *= -1;
            }

            const faceHeight = fW.pinLastValue();

            const faceY = faceRect.transform.position.y.pinLastValue();
            const faceX = faceRect.transform.position.x.pinLastValue();

            //only check if ball falling....
            if (speed.y > 0) {

                if (newPos.y + ballRadius > faceY - faceHeight / 2
                    && newPos.y + ballRadius < faceY + faceHeight / 2 && faceIsTracked.pinLastValue()) {

                    if (newPos.x > faceX && newPos.x < faceX + faceHeight) {

                        score += 1;

                        const speedUp = Math.min(5, faceY - facePos.y);

                        speed.y = speed.y * -1 + speedUp;// Math.min(speed.y * -1, -15);
                        difficulty = score ;

                        let offset = (pos.x - faceX) / faceHeight;
                        offset = offset * 2 - 1;
                        speed.x = offset * difficulty;

                    } else {
                        isOver = true;
                        await Patches.inputs.setBoolean('isOver', isOver);
                    }
                }
            }


            facePos.y = faceY;
            facePos.x = faceX;
        }
        //ball has passed through
        if (newPos.y > previewSizeHeight.pinLastValue()) {
            isOver = true;
            await Patches.inputs.setBoolean('isOver', isOver);
            if (isDebug) {
                await reset();
            }
        }


        //clamp speed
        let magnitude = speed.y * speed.y + speed.x * speed.x;
        if (magnitude > maxSpeed * maxSpeed) {
            magnitude = Math.sqrt(magnitude);
            speed.x = (speed.x / magnitude) * maxSpeed;
            speed.y = (speed.y / magnitude) * maxSpeed;
        }

        pos.y += speed.y;
        pos.x += speed.x;

        magnitude = Math.sqrt(speed.y * speed.y + speed.x * speed.x);

        //transform physics world to screen space
        ball.transform.y = pos.y;// - ballWidth / 2;
        ball.transform.x = pos.x - ballRadius;

        await Promise.all([Patches.inputs.setScalar('score', score),
            Patches.inputs.setScalar('difficulty', difficulty),
            Patches.inputs.setScalar('speed', magnitude | 0),
        ]);
    });


}
