import Level from "../../lib/Level/index.js";

const matrix = [
    [0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
];

const level1 = new Level(matrix);

export default level1;
