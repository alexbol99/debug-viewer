/**
 * Created by alexbol on 3/19/14.
 */
function Editor(canvasElement) {
    var _editor = this;

    this.stage = new createjs.Stage(canvasElement);
    var _stage = this.stage;
    var _context = _stage.canvas.getContext('2d');

    this.resolution = 3;

    createjs.Touch.enable(_stage);
    _stage.mouseMoveOutside = false;   // true;
    _stage.enableMouseOver(50);

    this.da = new DrawingArea();
    var _da = this.da;

    var _panStarted = false;

    var _axesGraphics = {x: new createjs.Graphics(), y: new createjs.Graphics()};

    var _coordWidget = createCoordinateWidget();   /* CREATEJS HTML DOM element, class = 'coords' */

    // TBD: if default document exist, load it
    // if not - create empty document
    // var _eucDoc = null;         // new EuclidDocument();
    //_eucDoc.ready = true;
    // _eucDoc.load(_defaultFileName);

    // var _currentItem = null;
    // var _widget = null;  // properties widget

    /** @const */  var KEY_DELETE = 46;

    this.add = function(geom, label, draggable) {
        var el = new GraphicElement(geom, label, draggable);
        var child = _stage.addChild(el);        // Add child to stage
        child.render();
        this.refresh();
        return child;
    };

    this.refresh = function() {
        _stage.update();
        drawAxes();
    };

    this.redraw = function() {
        var i;
        if (arguments.length > 0) {
            var args = Array.prototype.slice.call(arguments);
            for (i=0; i < arguments.length; i++) {
                args[i].render();
            }
        }
        else {
            var num = _stage.getNumChildren();
            for (i=0; i < num; i++) {
                _stage.getChildAt(i).render();
            }
        }
        this.refresh();
    };

    this.update = function(el, geom) {
        el.update(geom);
        this.refresh();
    };

    this.remove = function(el) {
        el.parent.removeChild(el);
    };

    // Service methods for mouse pan tool
    // Simple return _da.origin does not work properly for some reason
    this.getOriginX = function() {
        return _da.origin.x;
    };
    this.getOriginY = function() {
        return _da.origin.y;
    };

    this.setOrigin = function(newOrigin) {
        _da.panTo(newOrigin);
    };

    // ZoomIn + "Focus follows mouse"
    this.zoomIn = function(focusX, focusY, ratio) {
        var curRatio = ratio || 1.1;
        _da.zoom(focusX, focusY, true, curRatio);
    };
    // ZoomOut + "Focus follows mouse"
    this.zoomOut = function(focusX, focusY, ratio) {
        var curRatio = ratio || 1.1;
        _da.zoom(focusX, focusY, false, curRatio);
    };

    this.resizeCanvas = function(w, h) {
        _stage.canvas.width = w || 950;
        _stage.canvas.height  = h || 400;
        _da.resize();
        this.redraw();
    };

    this.cancelPan = function() {
        _panStarted = false;
    };

    /**
     * @return {number}
     */
    this.CanvasToModelX = function(canvasX) {
        return _da.C2W_X(canvasX);
    };

    /**
     * @return {number}
     */
    this.CanvasToModelY = function(canvasY) {
        return _da.C2W_Y(canvasY);
    };

    /**
     * @return {number}
     */
    this.CanvasToModelScalar = function(scalar) {
        return _da.C2W_Scalar(scalar);
    };

    this.getCanvasLimits = function() {
        return new Flatten.Box(this.CanvasToModelX(0),
            this.CanvasToModelY(_stage.canvas.height),
            this.CanvasToModelX(_stage.canvas.width),
            this.CanvasToModelY(0)
        )
    };

    this.mate = function(elements, callback) {
        elements.forEach( function(elem) {
            elem.on("move", callback);
        });
    };

    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);

    /* Add mouse wheel event listener - zoom-in/zoom-out */
    /* Non-FF browsers */
    _stage.canvas.addEventListener("mousewheel", function(e) {
        e.preventDefault();
        var delta = e.detail || e.wheelDelta;
        if (delta != 0) {
            delta < 0 ? _editor.zoomOut(e.offsetX, e.offsetY) :
                _editor.zoomIn(e.offsetX, e.offsetY);
            _editor.redraw();
        }
    }, false);

    /* Same for Firefox */
    _stage.canvas.addEventListener("DOMMouseScroll", function(e) {
        e.preventDefault();
        if (e.detail != 0) {
            var offset_x = e.layerX - e.currentTarget.offsetLeft;
            var offset_y = e.layerY - e.currentTarget.offsetTop;
            e.detail > 0 ? _editor.zoomOut(offset_x, offset_y) :
                _editor.zoomIn(offset_x, offset_y);
            _editor.redraw();
        }
    }, false);

    /* Add pan tool */
   _stage.on("stagemousedown", function(event) {
       this.offset = {x: (_editor.getOriginX() - event.stageX), y: (_editor.getOriginY() - event.stageY)};
       _panStarted = true;
   });

    _stage.on("stagemousemove", function(event) {
        if (_panStarted) {
            var newOrigin = {x: event.stageX + this.offset.x, y: (event.stageY + this.offset.y) };
            _editor.setOrigin(newOrigin);
            _editor.redraw();
        }

        var coordX = _editor.CanvasToModelX(event.stageX).toFixed(Flatten.DECIMALS);
        var coordY = _editor.CanvasToModelY(event.stageY).toFixed(Flatten.DECIMALS);
        _coordWidget.htmlElement.innerHTML = coordX + ', ' + coordY;
    });

    _stage.on("stagemouseup", function() {
        if (_panStarted) {
            _panStarted = false;
            this.offset = undefined;
        }
    });

    /* Add multi-touch zoom tool for devices supporting touch-event */
    _stage.canvas.addEventListener("touchstart", function(event) {
        event.preventDefault();
        _stage.touchDist = 0;
        if (event.touches.length == 2) {
            var touch1 = event.touches[0];
            var touch2 = event.touches[1];
            _stage.touchDist = touchDist(touch1, touch2);
        }
    }, false);

    _stage.canvas.addEventListener("touchmove", function(event) {
        event.preventDefault();
        if (event.touches.length == 2) {
            var touch1 = event.touches[0];
            var touch2 = event.touches[1];
            var dist = touchDist(touch1, touch2);
            if (dist != 0 && dist/_stage.touchDist != 0) {
                var focusX = (touch1.clientX + touch2.clientX)/2;
                var focusY = (touch1.clientY + touch2.clientY)/2;
                var ratio = dist/_stage.touchDist;
                ratio < 1 ? _editor.zoomOut(focusX, focusY, 1/ratio) : _editor.zoomIn(focusX, focusY, ratio);
                _editor.redraw();
            }
            _stage.touchDist = dist;
        }
        else {
            _stage.touchDist = 0;
        }
    }, false);

    //noinspection JSUnusedLocalSymbols
    _stage.canvas.addEventListener("touchend", function(event) {
        _stage.touchDist = 0;
    }, false);

    // The following methods extend shapes classes with ability to create graphic

    // Draw point as circle of 3pix radius
    Flatten.Point.prototype.setGraphics = function(editor, graphics) {
        if (!graphics) return;

        var radius = 3;
        graphics.beginFill("red").drawCircle(editor.da.W2C_X(this.x), editor.da.W2C_Y(this.y), radius);
    };
    Flatten.Point.prototype.setBounds = function(editor, shape) {
        var x = editor.da.W2C_X(this.x);
        var y = editor.da.W2C_Y(this.y);
        shape.setBounds(x, y, 1, 1);
    };
    Flatten.Point.prototype.setLabelLocation = function(editor, label_el) {
        label_el.x = editor.da.W2C_X(this.x) + 5;
        label_el.y = editor.da.W2C_Y(this.y) - 18;
    };

    Flatten.Segment.prototype.setGraphics = function(editor, graphics) {
        if (!graphics) return;

        var ps = {x:editor.da.W2C_X(this.ps.x), y:editor.da.W2C_Y(this.ps.y)};
        var pe = {x:editor.da.W2C_X(this.pe.x), y:editor.da.W2C_Y(this.pe.y)};
        graphics.setStrokeStyle(2).beginStroke("black").moveTo(ps.x,ps.y).lineTo(pe.x,pe.y).endStroke();
    };
    Flatten.Segment.prototype.setBounds = function(editor, shape) {
        var limits = this.getLimits();
        var x = editor.da.W2C_X(limits.xmin);
        var y = editor.da.W2C_Y(limits.ymin);
        var width = W2C_Scalar(limits.xmax - limits.xmin);
        var height = W2C_Scalar(limits.ymax - limits.ymin);
        shape.setBounds( x, y, width, height );
    };
    Flatten.Segment.prototype.setLabelLocation = function(editor, label_el) {
        var middle = this.middle();
        label_el.x = editor.da.W2C_X(middle.x) + 5;
        label_el.y = editor.da.W2C_Y(middle.y) - 18;
    };

    Flatten.Arc.prototype.setGraphics = function(editor, graphics) {
        if (!graphics) return;

        var pcx = editor.da.W2C_X(this.pc.x);
        var pcy = editor.da.W2C_Y(this.pc.y);
        var r = editor.da.W2C_Scalar(this.r);
        var startAngle = 2*Math.PI-this.startAngle;
        var endAngle = 2*Math.PI-this.endAngle;
        graphics.setStrokeStyle(2).beginStroke("black").arc(pcx, pcy, r, startAngle, endAngle, this.counterClockwise).endStroke();
    };
    Flatten.Arc.prototype.setLabelLocation = function(editor, label_el) {
        var middle = this.middle();
        var vec = this.pc.vectorTo(middle);
        vec = vec.multiply(1.1);
        var pt = this.pc.translate(vec);
        label_el.x = editor.da.W2C_X(pt.x); // + 5;
        label_el.y = editor.da.W2C_Y(pt.y); // - 18;
    };
    Flatten.Arc.prototype.setBounds = function(editor, shape) {
        var limits = this.getLimits();
        var x = editor.da.W2C_X(limits.xmin);
        var y = editor.da.W2C_Y(limits.ymin);
        var width = W2C_Scalar(limits.xmax - limits.xmin);
        var height = W2C_Scalar(limits.ymax - limits.ymin);
        shape.setBounds( x, y, width, height );
    };

    Flatten.Circle.prototype.setGraphics = function(editor, graphics) {
        if (!graphics) return;

        var pcx = editor.da.W2C_X(this.pc.x);
        var pcy = editor.da.W2C_Y(this.pc.y);
        var r = editor.da.W2C_Scalar(this.r);
        // graphics.setStrokeStyle(2).beginStroke("black").beginFill("red").drawCircle(pcx, pcy, r);
        graphics.setStrokeStyle(2).beginStroke("black").drawCircle(pcx, pcy, r);
    };

    Flatten.Line.prototype.setGraphics = function(editor, graphics) {
        if (!graphics) return;

        var line = this;
        var ips = line2canvasIntersect(editor, line);

        if (ips.length == 2) {
            var ps = {x:editor.da.W2C_X(ips[0].x), y:editor.da.W2C_Y(ips[0].y)};
            var pe = {x:editor.da.W2C_X(ips[1].x), y:editor.da.W2C_Y(ips[1].y)};
            graphics.setStrokeStyle(2).beginStroke("black").moveTo(ps.x,ps.y).lineTo(pe.x,pe.y).endStroke();
        }
    };
    Flatten.Line.prototype.setLabelLocation = function(editor, label_el) {
        var line = this;
        var ips = line2canvasIntersect(editor, line);
        if (ips.length == 2) {
            var middle = { x: (ips[0].x + ips[1].x)/2, y: (ips[0].y + ips[1].y)/2 };
            label_el.x = editor.da.W2C_X(middle.x) + 5;
            label_el.y = editor.da.W2C_Y(middle.y) - 18;
        }
    };

    Flatten.Polygon.prototype.setGraphics = function(editor, graphics) {
        if (!graphics) return;

        graphics.setStrokeStyle(2);
        graphics.beginStroke("black");
        graphics.beginFill("#C0FFFF");
        this.forEachFace( function(face) {
            face.setGraphics(editor, graphics);
        });
        graphics.endStroke();
    };
    Flatten.Segment.prototype.setEdgeGraphics = function(editor, graphics) {
        var pe = {x:editor.da.W2C_X(this.pe.x), y:editor.da.W2C_Y(this.pe.y)};
        graphics.lineTo(pe.x,pe.y);
    };
    Flatten.Arc.prototype.setEdgeGraphics = function(editor, graphics) {
        var pcx = editor.da.W2C_X(this.pc.x);
        var pcy = editor.da.W2C_Y(this.pc.y);
        var r = editor.da.W2C_Scalar(this.r);
        var startAngle = 2*Math.PI-this.startAngle;
        var endAngle = 2*Math.PI-this.endAngle;
        graphics.arc(pcx, pcy, r, startAngle, endAngle, this.counterClockwise);
    };
    Flatten.Face.prototype.setGraphics = function(editor, graphics) {
        var start = this.first.shape.getStart();
        var ps = {x: editor.da.W2C_X(start.x), y: editor.da.W2C_Y(start.y)};
        graphics.moveTo(ps.x,ps.y);

        this.forEachEdge( function(edge) {
            edge.shape.setEdgeGraphics(editor, graphics);
        });
    };
    Flatten.Polygon.prototype.setLabelLocation = function(editor, label_el) {
        var center = this.center();
        label_el.x = editor.da.W2C_X(center.x);
        label_el.y = editor.da.W2C_Y(center.y) - 18;
    };

    // private Drawing Area Class
    // Drawing Area object is responsible on adoption of drawing area
    // object in Real World coordinates to the canvas object in canvas
    // coordinates
    function DrawingArea() {
        this.origin = new Flatten.Point(_stage.canvas.width / 2, _stage.canvas.height / 2);
        //noinspection JSPotentiallyInvalidUsageOfThis
        this.resolution = _editor.resolution;  // MM 2 Pixels when zoomFactor = 1;
        this.zoomFactor = 10.0;
    }
    DrawingArea.prototype.scalingFactor = function() {
        //noinspection JSPotentiallyInvalidUsageOfThis
        return this.resolution*this.zoomFactor;
    };

    /**
     * @return {number}
     */
    DrawingArea.prototype.C2W_Scalar = function(scalar) {
        return (scalar/this.scalingFactor());
    };
    /**
     * @return {number}
     */
    DrawingArea.prototype.W2C_Scalar = function(scalar) {
        return (this.scalingFactor()*scalar);
    };
    // Canvas to World coordinate transformation
    /**
     * @return {number}
     */
    DrawingArea.prototype.C2W_X = function(canvasX) {
        return ((canvasX - this.origin.x)/this.scalingFactor());
    };
    /**
     * @return {number}
     */
    DrawingArea.prototype.C2W_Y = function(canvasY) {
        return ((this.origin.y - canvasY)/this.scalingFactor());
    };
    // World to Canvas coordinate transformation
    DrawingArea.prototype.W2C_X = function(worldX) {
        return (this.scalingFactor()*worldX + this.origin.x);
    };
    /**
     * @return {number}
     */
    DrawingArea.prototype.W2C_Y = function(worldY) {
        return (this.origin.y - this.scalingFactor()*worldY);
    };

    DrawingArea.prototype.limits = function() {
        var minX = this.C2W_X(0);
        var minY = this.C2W_Y(_stage.canvas.height);
        var maxX = this.C2W_X(_stage.canvas.width);
        var maxY = this.C2W_Y(0);

        return ( new Flatten.Limits(minX, minY, maxX, maxY) );
    };

    DrawingArea.prototype.panTo = function(newOrigin) {
        this.origin.x = newOrigin.x;
        this.origin.y = newOrigin.y;
    };
    DrawingArea.prototype.panBy = function(deltaX, deltaY) {
        this.origin.x += deltaX;
        this.origin.y += deltaY;
    };

    // zoom by 10% each time
    DrawingArea.prototype.zoomIn = function(ratio) {
        var curRatio = ratio || 1.1;
        this.zoomFactor = Math.min(100000, curRatio * this.zoomFactor);
    };
    DrawingArea.prototype.zoomOut = function(ratio) {
        var curRatio = ratio || 1.1;
        this.zoomFactor = Math.max(0.1, this.zoomFactor/curRatio);
    };

    // ZoomIn/Out + "Focus follows mouse"
    DrawingArea.prototype.zoom = function(focusX, focusY, bIn, ratio) {
        var worldX = this.C2W_X(focusX);    // world coordinate of mouse focus before zoom
        var worldY = this.C2W_Y(focusY);

        //noinspection JSPotentiallyInvalidUsageOfThis
        bIn ? this.zoomIn(ratio) : this.zoomOut(ratio);

        var newFocusX = this.W2C_X(worldX); // canvas coordinate after zoom
        var newFocusY = this.W2C_Y(worldY);

        this.panBy(focusX-newFocusX, focusY-newFocusY);
    };

    DrawingArea.prototype.resize = function() {
        this.origin.x = _stage.canvas.width / 2;
        this.origin.y = _stage.canvas.height / 2;
    };

    var GraphicElement = function(geom, label, draggable) {
        this.initialize(geom, label, draggable);
    };
    var p = GraphicElement.prototype = new createjs.Container();      // inherit from Container
    GraphicElement.prototype.Container_initialize = p.initialize;     // keep aside reference to Container initializer

    // overwrite Container initializer
    GraphicElement.prototype.initialize = function(geom, labelText, draggable) {
        // Call base class Container initializer
        this.Container_initialize();

        // Add GraphicElement initialization logic

        // create Shape and fill Graphics property
        var shape = new createjs.Shape();
        geom.setGraphics(_editor, shape.graphics);      // set graphics property according to geom
        this.addChild(shape);                           // add shape to GraphicElement Container
        this.shapeId = this.getNumChildren() - 1;       // store index of shape in array of children

        this.geom = geom;                               // add geom property to GraphicElement
        this.label = labelText;                         // add label property to GraphicElement
        this.draggable = (draggable === undefined ? true : draggable);   // add draggable property

        // this.editor = _editor;                          // add editor property - for usage in external models

        this.on("mouseover", function() {
            if (this.draggable) {
                this.shadow = new createjs.Shadow("#000000", 0, 0, 10);
                _editor.refresh();
            }
        });

        this.on("mouseout", function() {
            this.shadow = null;
            _editor.refresh();
        });

        this.on("mousedown", function(event) {
            if (this.draggable) {
                this.startX = event.stageX;
                this.startY = event.stageY;
                this.orig = this.geom.clone();
                this.started = true;
                _editor.cancelPan();
            }
        });

        this.on("pressmove", function(event) {
            if (this.started) {
                var dx = _editor.CanvasToModelScalar(event.stageX - this.startX);
                var dy = -_editor.CanvasToModelScalar(event.stageY - this.startY);
                this.geom = this.orig.translate(dx, dy);

                var customEvent = new createjs.Event("move");
                //var event = new CustomEvent("move",
                //    {
                //        detail: {
                //            el: this,
                //            dx: dx,
                //            dy: dy
                //        },
                //        bubbles: true,
                //        cancelable: false
                //    });
                this.dispatchEvent(customEvent);

                this.render();
                _editor.refresh();
            }
        });

        this.on("pressup", function() {
            this.started = false;
            this.orig = null;
        });
    };

    GraphicElement.prototype.getShape = function() {
        return this.geom.clone();
    };

    GraphicElement.prototype.update = function(geom) {
        this.geom = geom;
        this.render();
    };

    GraphicElement.prototype.render = function() {
        /* Recalc geom */
        var shape = this.getChildAt(this.shapeId);
        if (this.geom) {
            shape.graphics.clear();
            this.geom.setGraphics(_editor, shape.graphics);
        }
        /* Recalc bounds if once ever calculated */
//            if (shape.getBounds() != undefined) {
//                shape.geom.setBounds(_editor, shape);
//            }
        /* Recalc label location and label text */
        if (this.label != undefined) {
            var label_el;
            if (this.labelId) {      // label exist - update
                label_el = this.getChildAt(this.labelId);
                if (label_el && this.geom) {
                    this.geom.setLabelLocation(_editor, label_el);
                    label_el.htmlElement.innerText = this.label;
                }
            }
            else {                  // add label to element
                this.addLabel(this.label);
            }
        }
    };

    GraphicElement.prototype.addLabel = function(labelText) {
        // Create label and add to GraphicElement Container
        var label_el = null;
        if (labelText != undefined && typeof(labelText) == "string") {
            label_el = createLabel(labelText);
            this.geom.setLabelLocation(_editor, label_el);
            this.addChild(label_el);                      // add label to GraphicElement Container
            this.labelId = this.getNumChildren() - 1;
            this.label = labelText;
        }
        return label_el;
    };

    function touchDist(touch1, touch2) {
        var dist = 0;
        if (touch1 && touch2) {
            var p1 = new Flatten.Point(touch1.clientX, touch1.clientY);
            var p2 = new Flatten.Point(touch2.clientX, touch2.clientY);
            dist = p1.distTo(p2);
        }
        return dist;
    }

    function drawAxes() {
        _context.globalCompositeOperation = 'destination-over';
        drawAxeX();
        drawAxeY();
        _context.globalCompositeOperation = 'source-over';
    }
    function drawAxeX() {
//        var origin = new Flatten.Point(_editor.getOriginX(), _editor.getOriginY());
//        var line = new Flatten.Line(origin, new Flatten.Vector(0,1));
        var xs = _editor.getOriginX() - 10;
        var xe = _editor.getOriginX() + 10;
        var ys = _editor.getOriginY();
        var ye = _editor.getOriginY();
//        var ips = line2canvasIntersect(line);
//        if (ips.length == 2) {
//            var xs = Math.min(ips[0].x, ips[1].x);
//            var xe = Math.max(ips[0].x, ips[1].x);
//            var ys = Math.min(ips[0].y, ips[1].y);
//            var ye = Math.max(ips[0].y, ips[1].y);

            _axesGraphics.x.clear();
            _axesGraphics.x.setStrokeStyle(1).beginStroke("black").moveTo(xs, ys).lineTo(xe, ye).endStroke();
            _axesGraphics.x.draw(_context);
//        }
    }
    function drawAxeY() {
//        var origin = new Flatten.Point(_editor.getOriginX(), _editor.getOriginY());
//        var line = new Flatten.Line(origin, new Flatten.Vector(1,0));
        var xs = _editor.getOriginX();
        var xe = _editor.getOriginX();
        var ys = _editor.getOriginY() - 10;
        var ye = _editor.getOriginY() + 10;
//        var ips = line2canvasIntersect(line);
//        if (ips.length == 2) {
//            var xs = Math.min(ips[0].x, ips[1].x);
//            var xe = Math.max(ips[0].x, ips[1].x);
//            var ys = Math.min(ips[0].y, ips[1].y);
//            var ye = Math.max(ips[0].y, ips[1].y);

            _axesGraphics.y.clear();
            _axesGraphics.y.setStrokeStyle(1).beginStroke("black").moveTo(xs, ys).lineTo(xe, ye).endStroke();
            _axesGraphics.y.draw(_context);
//        }
    }

    function line2canvasIntersect(editor, line) {
        var box = editor.getCanvasLimits();
        var pts = [
            new Flatten.Point(box.xmin, box.ymin),
            new Flatten.Point(box.xmax, box.ymin),
            new Flatten.Point(box.xmax, box.ymax),
            new Flatten.Point(box.xmin, box.ymax)
        ];
        var segs = [
            new Flatten.Segment(pts[0], pts[1]),
            new Flatten.Segment(pts[1], pts[2]),
            new Flatten.Segment(pts[2], pts[3]),
            new Flatten.Segment(pts[3], pts[0])
        ];

        var ips =  [];

        segs.forEach( function(seg) {
            var ips_tmp = Flatten.intersect(seg, line);
            ips_tmp.forEach( function( ip)  {
                ips.push(ip);
            })
        });
        return ips;
    }

    /* Display label as HTML element on canvas */
    function createLabel(text) {
        var el = document.createElement('div');
        el.setAttribute('class', 'label');
        el.innerHTML = text;
        _stage.canvas.parentNode.insertBefore(el, _stage.canvas);
        return new createjs.DOMElement(el);
    }

    /* Coordinate widget */
    function createCoordinateWidget() {
        var el = document.createElement('div');
        el.setAttribute('class','coords');
        _stage.canvas.parentNode.insertBefore(el, _stage.canvas);
        return new createjs.DOMElement(el);
    }
}
