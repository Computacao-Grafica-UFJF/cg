import * as THREE from "three";

class AngleHandler {
    static invertAngleHorizontally(angle) {
        return this.invertAngleAboutNormal(angle, Math.PI / 2);
    }

    static invertAngleVertically(angle) {
        return this.invertAngleAboutNormal(angle, 0);
    }

    static invertAngleAboutNormal(angle, normalAngle) {
        const degreeAngle = THREE.MathUtils.radToDeg(angle);
        const degreeNormalAngle = THREE.MathUtils.radToDeg(normalAngle);

        const normalizedAngle = degreeAngle % 360;
        const invertedAngle = (2 * degreeNormalAngle - normalizedAngle) % 360;

        return THREE.MathUtils.degToRad(invertedAngle);
    }

    static invertAngleReflectionLaw(angle, normalAngle) {
        const invertedAngle = this.invertAngleAboutNormal(angle, normalAngle);
        return this.invertAngleVertically(invertedAngle);
    }

    static limitAngle(angle) {
        const degreeAngle = THREE.MathUtils.radToDeg(angle);

        if (degreeAngle > 150 && degreeAngle < 270) return THREE.MathUtils.degToRad(150);
        if (degreeAngle < 30 || degreeAngle > 270) return THREE.MathUtils.degToRad(30);

        return angle;
    }

    static checkWallDirectionIsCorrect(angle, wallDirection) {
        const degreeAngle = THREE.MathUtils.radToDeg(angle);

        const abs = degreeAngle < 0 ? degreeAngle + 360 : degreeAngle % 360;

        if (wallDirection === "left") {
            return abs > 90 && abs < 270;
        }

        if (wallDirection === "right") {
            return abs < 90 || abs > 270;
        }

        if (wallDirection === "top") {
            return abs < 180;
        }

        if (wallDirection === "bottom") {
            return abs > 180;
        }
    }
}

export default AngleHandler;
