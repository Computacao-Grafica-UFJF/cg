function getSegmentPositionByRelativeX(relativeX) {
    const width = 4;
    const segmentWidth = width / 5;
    const absoluteX = relativeX + width / 2;

    const segment = Math.floor(absoluteX / segmentWidth);
    return segment;
}
