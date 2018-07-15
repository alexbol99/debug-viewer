import { Job } from '../models/job';
import Flatten from 'flatten-js';

let {point} = Flatten;
let { vector } = Flatten;

const micron2pixels = 400;
function MicronToPixels(str) {
    return Math.round(Number(str)*micron2pixels,0);
}

export function parseCSV(filename, str) {
    let job = new Job();
    job.filename = filename;

    let arrayOfLines = str.match(/[^\r\n]+/g);

    for (let i = 0; i < arrayOfLines.length; i++) {
        let line = arrayOfLines[i];
        let terms = line.split(',');

        let x = MicronToPixels(terms[0]);
        let y = MicronToPixels(terms[1]);
        let shape = point(x,y);
        job.shapes.push(shape)
    }

    return job
}