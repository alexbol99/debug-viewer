import { Job } from '../models/job';
import Flatten from 'flatten-js';
import {Parser} from '../models/parser';

let {point, vector, line} = Flatten;

export function parseTXT(filename, str) {
    let job = new Job();
    job.filename = filename;

    let parser = new Parser();

    let shapesArray = parser.parse(str);

    if (shapesArray.length > 0) {
        for (let shape of shapesArray) {
            job.shapes.push(shape)
        }
    }

    return job
}