function invertAngleAboutNormal(angle, normalAngle) {
    const degreeAngle = angle;
    const degreeNormalAngle = normalAngle;

    const normalizedAngle = degreeAngle % 360;
    const invertedAngle = (2 * degreeNormalAngle - normalizedAngle) % 360;
    return invertedAngle < 0 ? invertedAngle + 360 : invertedAngle;
}

console.log(invertAngleAboutNormal(60, 75));
