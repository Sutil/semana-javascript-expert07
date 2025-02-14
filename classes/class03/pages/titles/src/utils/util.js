import { knownGetures, gestureStrings } from "./gestures.js";

// https://github.com/tensorflow/tfjs-models/tree/a345f0c58522af25d80153ec27c6e999e45fdd42/hand-pose-detection#keypoint-diagram
const fingerLookupIndexes = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [5, 6, 7, 8],
  middleFinger: [9, 10, 11, 12],
  ringFinger: [13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
  fingersBase: [2, 5, 9, 13, 17]
}

export { fingerLookupIndexes, knownGetures, gestureStrings }
