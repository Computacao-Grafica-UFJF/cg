function tunnelAngle(angle) {
    if (angle < 0) {
        return angle + Math.PI * 2;
    }

    if (angle > Math.PI * 2) {
        return angle - Math.PI * 2;
    }

    return angle;
}

function invertHorizontally(angle) {
    console.log(angle);
    return Math.PI - angle;
}

function invertVertically(angle) {
    return tunnelAngle(2 * Math.PI - angle);
}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

console.log(radiansToDegrees(invertHorizontally(degreesToRadians(270))));
// console.log(radiansToDegrees(invertVertically(degreesToRadians(50))));
