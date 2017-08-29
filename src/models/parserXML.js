import { Job } from '../models/job';
import Flatten from 'flatten-js';

let {Point, Segment, Arc, Polygon} = Flatten;
let { vector } = Flatten;

export function parseXML(filename, str) {
    let job = new Job();

    job.filename = filename;

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(str, "text/xml");

    // Parse document title
    let titles = xmlDoc.getElementsByTagName('title');
    if (titles && titles.lenth > 0) {
        job.title = titles[0];          // take the first title if more than one
    }

    // Parse profiles and add polygons to the job
    let profilesXML = xmlDoc.getElementsByTagName('profile');
    for (let profileXML of profilesXML) {
        let polygon = parsePolygon(profileXML);
        job.profiles.push(polygon);
    }

    // Parse materials and add polygons to the job
    let materialXML = xmlDoc.getElementsByTagName('material');
    for (let shapeXML of materialXML) {
        let polygon = parsePolygon(shapeXML);
        job.materials.push(polygon);
    }

    return job;
}

function parsePolygon(polygonsXML) {
    let polygon = new Polygon();

    // let nedges = parseInt(profile.getAttribute("n_edges"), 10);

    // Augment Flatten object with style
    let color = polygonsXML.getAttribute("color");
    polygon.style = {
        stroke: color || undefined,
        fill: color || undefined,
        alpha: 1.0
    };

    // Add islands
    let islands = polygonsXML.getElementsByTagName('island');
    for (let island of islands) {
        let edgesXML = island.getElementsByTagName('edge');
        polygon.addFace(parseEdges(edgesXML));
    }

    // Add holes
    let holes = polygonsXML.getElementsByTagName('holes');
    for (let hole of holes) {
        let edgesXML = hole.getElementsByTagName('edge');
        polygon.addFace(parseEdges(edgesXML));
    }

    return polygon;
}

function parseEdges(edgesXML) {
    let edges = [];

    for (let edge of edgesXML) {
        let type = edge.getAttribute('type');

        if (type === "segment") {
            let ps = new Point(parseInt(edge.getAttribute('xs'),10), parseInt(edge.getAttribute('ys'),10));
            let pe = new Point(parseInt(edge.getAttribute('xe'),10), parseInt(edge.getAttribute('ye'),10));

            edges.push(new Segment(ps, pe));
        }

        if (type === "curve") {
            let ps = new Point(parseInt(edge.getAttribute('xs'),10), parseInt(edge.getAttribute('ys'),10));
            let pe = new Point(parseInt(edge.getAttribute('xe'),10), parseInt(edge.getAttribute('ye'),10));
            let pc = new Point(parseInt(edge.getAttribute('xc'),10), parseInt(edge.getAttribute('yc'),10));

            let counterClockwise = edge.getAttribute('cw') === 'no' ? true : false;

            let startAngle = vector(pc,ps).slope;
            let endAngle = vector(pc, pe).slope;

            let r = vector(pc, ps).length;

            edges.push(new Arc(pc, r, startAngle, endAngle, counterClockwise));
        }
    }

    return edges;
}