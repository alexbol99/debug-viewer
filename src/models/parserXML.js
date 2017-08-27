import Flatten from 'flatten-js';

let {Point, Segment, Arc, Polygon} = Flatten;
let { vector } = Flatten;

export function parseXML(str) {
    let parser = new DOMParser();

    let xmlDoc = parser.parseFromString(str, "text/xml");

    let profiles = xmlDoc.getElementsByTagName('profile');

    let material_shapes = xmlDoc.getElementsByTagName('material');

    let polygon = new Polygon();

    for (let profile of profiles) {
        // let nedges = parseInt(profile.getAttribute("n_edges"), 10);
        let edgesXML = profile.getElementsByTagName('edge');
        polygon.addFace(parseEdges(edgesXML));
    }

    for (let shape of material_shapes) {
        let edgesXML = shape.getElementsByTagName('edge');
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