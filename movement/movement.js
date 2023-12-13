const keysState = {};
const maxspeed = 7.5;
const defaultSpeed = 3;
let speed = defaultSpeed;

const movement = (world, physicsOBJ) => {
    keysState[event.code] = true;
    if (physicsOBJ) {
        if (keysState['ShiftLeft']) {
            if (speed <= maxspeed) {
                speed += 0.1;
            } 
        } 
        let rotation;
        // Инициализация линейной скорости, если она еще не была установлена
        physicsOBJ.linearVelocity.x = 0;
        physicsOBJ.linearVelocity.z = 0;
        if (keysState['ArrowRight'] || keysState['KeyD']) {
            physicsOBJ.setRotation({x:physicsOBJ.orientation.x, y:physicsOBJ.orientation.y , z:physicsOBJ.orientation.z});
            physicsOBJ.controlRot = false;
            physicsOBJ.linearVelocity.x = -speed;
        }
        if (keysState['ArrowLeft'] || keysState['KeyA']) {
            physicsOBJ.setRotation({x:physicsOBJ.orientation.x, y:physicsOBJ.orientation.y , z:physicsOBJ.orientation.z});
            physicsOBJ.controlRot = false;
            physicsOBJ.linearVelocity.x = speed;
        }
        if (keysState['ArrowDown'] || keysState['KeyS']) {
            physicsOBJ.linearVelocity.z = -speed;
        }
        if (keysState['ArrowUp'] || keysState['KeyW']) {
            physicsOBJ.linearVelocity.z = speed;
        }
        if (keysState['KeyQ']) {
            // const orientation = physicsOBJ.orientation;
            // physicsOBJ.resetQuaternion({x:orientation.x, y:orientation.y + 0.1, z:orientation.z, w:orientation.w});
            rotation = world.Rotate(physicsOBJ, 0.1);
            physicsOBJ.resetQuaternion(rotation);
        }
        if (keysState['KeyE']) {
            rotation = world.Rotate(physicsOBJ, -0.1);
            physicsOBJ.resetQuaternion(rotation);
        }
        if (keysState['KeyR']) {
            world.Stop(physicsOBJ);
        }
        if (keysState['Space']) {
            jump(physicsOBJ);
        }
    }
};

const stopmovement = (physicsOBJ) => {
    keysState[event.code] = false;
};

const KeysControl = (world, phy) => {
    if (phy) {
        console.log('loaded');
        let rotation;
        // world.BindFunction(phy, jump);
        world.BindFunction(window, phy, movement, "keydown");
        world.BindFunction(window, phy, stopmovement, "keyup");
    }
}

const jump = (obj) => {
    if (obj.contactLink) {
        console.log("JUMP");
        obj.linearVelocity.y = 10;
    }
} 

export { KeysControl, keysState, speed, defaultSpeed, maxspeed };