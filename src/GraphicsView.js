define(['models/Job', 'models/Graphics', 'models/Units', 'collections/Steps', 'models/LayerList',
    'collections/Histogram', 'collections/ZoomHistory', 'tools/ZoomAreaTool', 'tools/MeasureBetweenPointsTool',
    'tools/HighlightTool', 'tools/MeasurementTool', 'tools/PanByDragTool', 'models/UserSettings', 'models/FeatureInfo'],
function (job, graphics, units, steps, layers, histogram, history,
    ZoomAreaTool, MeasureBetweenPointsTool, HighlightTool, MeasurementTool, PanByDragTool, UserSettings, featureInfo) {
    /* Local variables */
    var _canvas;                   // drawing canvas
    var _context;                  // canvas drawing context
    var keyHome = 36;              // "Home" key
    var keyArrowLeft = 37;
    var keyArrowRight = 39;
    var keyArrowUp = 38;
    var keyArrowDown = 40;
    var keyToggleWidth = 87;       // "W" + ctrl - does not work
    var keyToggleDispNegative = 78; // 'N'
    var keyToggleBgColor = 66;	    // 'B'
    var keyToggleFlip = 70;         // 'F'
    var keyEnter = 13;
    var INCH2MM = 25.4;
    var keyZoomInPlus = 107;
    var keyZoomInShiftPlus = 187;
    var keyZoomOutMinus = 109;
    var keyZoomOutShiftMinus = 189;
    var keyZoomBack = 90;

    var Tools = {
        "zoom-area": ZoomAreaTool,
        "pan-by-drag" : PanByDragTool,
        "measure-between-points": MeasureBetweenPointsTool,
        "highlight-feature": HighlightTool,
        "measure-between-centers": MeasurementTool,
        "measure-between-features": MeasurementTool,
        "measure-annular-ring": MeasurementTool,
        "measure-between-profiles": MeasurementTool,
        /*
        "measurement": MeasurementTool*/
    };
    var _graphicsView;

    var lastResizeTime = new Date(1, 1, 2000, 12, 00, 00);
    var resizeTimeout = false;
    var resizeDelta = 200;
    var zoomTimer;
    var zoomInterval;
    var keyPanTimer;

    var GraphicsView = Backbone.View.extend({
        el: $("#main-container"),

        initialize: function () {
            _canvas = document.getElementById('canvas');
            _context = _canvas.getContext('2d');
            _graphicsView = this;

            // Add content editable to help ensure the canvas retains focus
            // http://stackoverflow.com/questions/1829586/how-do-i-give-an-html-canvas-the-keyboard-focus-using-jquery
            // $(_canvas).attr("contentEditable", "true");
            $(_canvas).attr("tabindex", "0");     /* Tabindex is better, contentEditable disable "default" cursor on IE. BL 28.01.15 BUG59679 */

            this.resize();
            /* Default origin will be in the center of the canvas */
            this.origin = { x: _canvas.width / 2, y: _canvas.height / 2 };
            this.resolution = 1;                     // Units (MM,Inch) to Pixels ratio
            this.zoomFactor = 1;                     // zoom factor  todo: update according to initial view
            this.xdir = 1;                           // axe "X" direction from left to right, -1 - from right to left
            this.ydir = -1;                          // axe "Y" direction from bottom to top, 1 - from top to bottom
            this.ctrl = false;                       // ctrl key pressed
            this.focus = false;                      // focus on canvas

            // Set default tool
            this.currentToolId = "zoom-area";
            $("#zoom-area").addClass('active');
            this.tool = new Tools[this.currentToolId]({ model: this });

            graphics.on('imageLoaded', this.imageLoaded, this);         // On image loaded, display image in canvas
            units.on('change', this.toggleUnits, this);            // On units change, change resolution
            job.on('change:name', this.clearCanvas, this);
            job.on('currentStepReady', this.setHomeView, this);
            job.on('change:currentStep', this.changeToDefaultTool, this);
            job.on('closed', this.clearCanvas, this);
            layers.on('add', this.attachLayerEvents, this);
            layers.on('getGraphics', this.getGraphics, this);
            histogram.on('histogramSelectionChanged', this.getHistogram, this);
            featureInfo.on('featureHighlightChanged', this.getFeatureInfo, this);
            $(window).on('resize', this.resizeCheck);
            graphics.on('change:respondMessage', this.showMessage, this);
            // Keyboard event
            // var _keydown = _.throttle(this.keydown, 100);
            $(document).on('keydown', this.keydown);
            var _keyup = _.throttle(this.keyup, 500);
            $(document).on('keyup', _keyup);
            UserSettings.on('colorSetUpdated', this.colorSetUpdated, this);
            graphics.set("colorSetUpdated", false);
            graphics.on('change:negMode', this.toggleDispNegativeIcon, this);
            graphics.on('change:widthMode', this.toggleWidthModeIcon, this);
            graphics.on('change:flipImage', this.flipImageFlagChanged, this);
        },

        events: {
            'mousewheel canvas': 'zoom',
            'DOMMouseScroll canvas': 'zoomFox',
            //'mousemove canvas': 'setFocus',
            'mouseleave': 'dropFocus',
            'click .tool-button': 'changeTool',
            //'click #highlight-feature': 'notImplemented',
            'click #zoom-home': 'goHome',
            'click #zoom-in': 'zoomInCenter',
            'click #zoom-out': 'zoomOutCenter',
            'click #zoom-back': 'zoomBack',
            'click #pan-to-coordinate': 'panToCoordinate',
            //'click #measure-between-centers': 'notImplemented',
            //'click #measure-annular-ring': 'notImplemented',
            'click #width-toggle': 'toggleWidthMode',
            'click #negative-toggle': 'toggleDispNegative',
            'click #bgcolor-toggle': 'toggleBgColor',
            'click #flip-toggle': 'toggleFlipImageFlag',

            'mousedown canvas': 'mouseDown',
            'mousemove canvas': 'mouseMove',
            'mouseup canvas': 'mouseUp'
        },

        colorSetUpdated: function () {
            this.updateBgColorStyles();
            graphics.set("colorSetUpdated", true);
            this.getGraphics();
        },

        showMessage: function () {
            if (graphics.get("respondMessage") == "") {
                $("#graphicViewMessages").tooltip("close");
            }
            else {
                $("#graphicViewMessages").tooltip({ items: "div", content: graphics.get("respondMessage"), tooltipClass: "graphicViewMessagesTooltip" });
                $("#graphicViewMessages").tooltip("open");
                $(".graphicViewMessagesTooltip").css({ "top": this.mouseCoordY + 100 + "px", "left": this.mouseCoordX + 100 + "px" });
            }
        },
        // Pan with mouse drag
        mouseDown: function (e) {
            e.preventDefault();

            var coordX = e.offsetX || e.originalEvent.layerX;    // layerX for Firefox
            var coordY = e.offsetY || e.originalEvent.layerY;    // layery for Firefox

            this.offset = { x: (_graphicsView.origin.x - coordX), y: (_graphicsView.origin.y - coordY) };
            this.startX = coordX;
            this.startY = coordY;

        },
        mouseMove: function (e) {
            this.mouseCoordX = e.offsetX || e.originalEvent.layerX;    // layerX for Firefox
            this.mouseCoordY = e.offsetY || e.originalEvent.layerY;    // layery for Firefox
            $(".graphicViewMessagesTooltip").css({ "top": this.mouseCoordY+100 + "px", "left": this.mouseCoordX + 100 + "px" });

            // _canvas.style.cursor = "default";
            
            /*
            if (this.startX != undefined && this.startY != undefined && this.offset != undefined &&
                Math.abs(this.mouseCoordX - this.startX) >= 5 && Math.abs(this.mouseCoordY - this.startY) >= 5) {
                if (!this.panStarted) {                  // we are about to start pan, add to History only once
                    _graphicsView.addToHistory();        // add current graphicsView status to History before this status was changed BUG58410
                }
                this.panStarted = true;
                _graphicsView.origin = { x: this.mouseCoordX + this.offset.x, y: (this.mouseCoordY + this.offset.y) };
                _canvas.style.cursor = "move";
                $('#canvasrb').css('cursor', 'move');

                graphics.set("inScreenPan", true);
                _graphicsView.render();
            }
            */

            this.displayCoordinates(this.mouseCoordX, this.mouseCoordY);

            $(_canvas).focus();
            this.focus = true;

        },
        mouseUp: function (e) {
            if (this.panStarted) {
                _graphicsView.getGraphics();
            }
            this.panStarted = false;
            this.offset = undefined;
            this.startX = undefined;
            this.startY = undefined;
            // _canvas.style.cursor = "default";
            // $('#canvasrb').css('cursor', 'default');
        },

        resizeCheck: function (e) {
            // Dirty fix for BUG58525: Enlarge "Features histogram" window disappear the layers display 
            // BL 29.07.14
            if (e != undefined && e.target != undefined && e.target.className != undefined) {
                if (e.target.className.indexOf("ui-dialog") > -1)
                    return;
            }

            lastResizeTime = new Date();
            if (resizeTimeout === false) {
                resizeTimeout = true;
                setTimeout(_graphicsView.resizeEnd, resizeDelta);
            }
        },
        resizeEnd : function () {
            if (new Date() - lastResizeTime < resizeDelta) {
                setTimeout(_graphicsView.resizeEnd, resizeDelta);
            } else {
                resizeTimeout = false;
                _graphicsView.resize();
            }
        },

        attachLayerEvents: function (layer) {
            layer.on('change:isSelected', this.toggleLayerSelection, this);
        },

        // Keyboard events. For some reason not works if defined in "events" section
        keydown: function (e) {
            // e.preventDefault();                  // prevent default disables F12 ...
            _graphicsView.ctrl = e.ctrlKey;
            switch (e.keyCode) {
                case keyHome:
                    if (e.target.id == "canvas") {
                        _graphicsView.goHome(true);   /* keep input coordinates == true */
                    }
                    break;

                case keyToggleWidth:
                    if (e.target.id == "canvas") {
                        _graphicsView.toggleWidthMode()      // toggle width On/Off in graphics model
                    }
                    break;

                case keyToggleBgColor:
                    if (e.target.id == "canvas") {
                        _graphicsView.toggleBgColor()
                    }
                    break;

                case keyToggleFlip:
                    if (e.target.id == "canvas") {
                        _graphicsView.toggleFlipImageFlag();
                    }
                    break;

                case keyArrowLeft:
                    if (e.target.id == "canvas") {
                        _graphicsView.panHorizontal(1, e.shiftKey);
                    }
                    break;
                case keyArrowRight:
                    if (e.target.id == "canvas") {
                        _graphicsView.panHorizontal(-1, e.shiftKey);
                    }
                    break;
                case keyArrowUp:
                    if (e.target.id == "canvas") {
                        _graphicsView.panVertical(1, e.shiftKey);
                    }
                    break;
                case keyArrowDown:
                    if (e.target.id == "canvas") {
                        _graphicsView.panVertical(-1, e.shiftKey);
                    }
                    break;
                case keyToggleDispNegative:
                    if (e.ctrlKey && e.altKey && e.target.id == "canvas") {
                        _graphicsView.toggleDispNegative();
                    }
                    break;
                case keyEnter:
                    if (e.target.id == "input-coordinate") {
                        _graphicsView.panToCoordinate();
                    }
                    break;
                case keyZoomInPlus:
                case keyZoomInShiftPlus:
                    if (e.target.id == "canvas") {
                       _graphicsView.zoomInCenter();
                    }
                    break;
                case keyZoomOutMinus:
                case keyZoomOutShiftMinus:
                    if (e.target.id == "canvas") {
                       _graphicsView.zoomOutCenter();
                    }
                    break;
                case keyZoomBack:
                    if (e.ctrlKey && e.target.id == "canvas") {
                        _graphicsView.zoomBack();
                    }
                default:
                    break;
            }
        },

        keyup: function (e) {
            _graphicsView.ctrl = e.ctrlKey;
            /* Get graphics if pan by arrow */
            if (e.target.id == "canvas") {
                if (e.keyCode == keyArrowLeft || e.keyCode == keyArrowRight ||
                    e.keyCode == keyArrowDown || e.keyCode == keyArrowUp) {

                    /* Set additional graphics call to overcome situation when last keyup event was omitted by throttle */
                    clearTimeout(keyPanTimer);
                    keyPanTimer = setTimeout(function () {
                        if (!graphics.hasImage()) return;
                        if (Math.round(_graphicsView.W2C_X(graphics.get('xmax'))) < _canvas.width ||
                            Math.round(_graphicsView.W2C_X(graphics.get('xmin'))) > 0 ||
                            Math.round(_graphicsView.W2C_Y(graphics.get('ymax'))) > 0 ||
                            Math.round(_graphicsView.W2C_Y(graphics.get('ymin'))) < _canvas.height) {
                            _graphicsView.getGraphics();
                        }
                    }, 1000);

                    _graphicsView.getGraphics();
                }
            }
        },

        toggleLayerSelection: function (singleLayer) {
            if (!singleLayer.get("skipLayerEvent")) {
                if (singleLayer.has("highlight")) {
                    graphics.clearClickFunction();
                }
                this.getGraphics();
            }
        },

        notImplemented: function () {
            alert("Not implemented yet");
        },
        goHome: function(keepInputCoordinates) {
            this.addToHistory();
            this.setHomeView(keepInputCoordinates);
        },
        setHomeView: function (keepInputCoordinates) {

            if (!keepInputCoordinates) {
                this.cleanInputCoordinates();
            }

            var limits = steps.getCurrentStepLimits();

            this.zoomFactor = 1;           // initial zoom factor

            var width = limits.xmax - limits.xmin;
            var height = limits.ymax - limits.ymin;

            // Set initial resolution - pixels to Units (MM,Inch) ratio
            this.initResolution(width, height);

            // set origin to world (0,0) coordinated of the image
            this.initOrigin(width, height, limits.xmin, limits.ymax);

            // require image that cover all canvas
            // this.addToHistory();
            this.getGraphics();
        },

        // Recalculate resolution and origin after resize window
        // zoomFactor will be set to 1 and zoom/pan history will be clear
        resizeView: function () {
            if (!graphics.hasImage()) return;

            this.zoomFactor = 1;           // initial zoom factor

            var width = graphics.get('xmax') - graphics.get('xmin');
            var height = graphics.get('ymax') - graphics.get('ymin');

            // Set initial resolution - pixels to Units (MM,Inch) ratio
            this.initResolution( width, height );

            // Match center of the canvas to the center of the image
            this.initOrigin( width, height, graphics.get('xmin'), graphics.get('ymax') );

            // clear history
            history.reset();

            // require image that cover all canvas
            this.addToHistory();
            this.getGraphics();
            var layerListHeight = $("aside").height() - $("#step-selection-dialog").height() - $("#featureinfo-substeps-area").height();
            $("#layer-list-widget").height(layerListHeight - 2);
        },

        initResolution: function(width, height) {
            this.resolution = Math.min(_canvas.width / width, _canvas.height / height);
        },

        /* ----------------------------------------------------------------------------------
        initOrigin 
        Function initializes coordinates of the (0,0) of the image in canvas coodinate system
        where
        width, height - image width and height,
        xmin, ymax - coordinates of the left upper corner of the image in the world coordinate system
        ------------------------------------------------------------------------------------*/
        initOrigin: function(width, height, xmin, ymax) {
            /* Image should be adjusted with respect to canvas:
            1) Center of the image conincident with the center of the canvas
            2) Either width or height of the image will be equal to width or height of the canvas */

            /* Under these conditions left upper corner of the image has following canvas coordinates:
            xleft = canvas_width/2 - width/2, ytop = canvas_height/2 - height/2 (one of them will be zero) */
            var xleft = _canvas.width / 2 - this.xdir * this.W2C_Scalar(width) / 2;
            var ytop = _canvas.height / 2 + this.ydir * this.W2C_Scalar(height) / 2;

            /* Calculate coordinates of the origin as O = C + vector(C,O) , 
            where in world coordinates O(0,0) - origin, C(xmin, ymax) - corner */
            this.origin = {
                x: xleft + this.xdir * (0 - this.W2C_Scalar(xmin)),
                y: ytop + this.ydir * (0 - this.W2C_Scalar(ymax))
            };
        },

        addToHistory: function () {
            if (job.get("name") == "" || job.get("currentStep") == "")
                return;

            var xmin = graphics.get('flipImage') ? this.C2W_X(_canvas.width) : this.C2W_X(0);
            var ymin = this.C2W_Y(_canvas.height);
            var xmax = graphics.get('flipImage') ? this.C2W_X(0) : this.C2W_X(_canvas.width);
            var ymax = this.C2W_Y(0);

            /* Do not store illegal coordinates in history. BL 22.02.16 BUG67840 */
            if (units.valid(xmin) && units.valid(ymin) &&
                units.valid(xmax) && units.valid(ymax)) {
                history.push({
                    xmin: xmin,
                    ymin: ymin,
                    xmax: xmax,
                    ymax: ymax,
                    zoomFactor: this.zoomFactor,
                    resolution: this.resolution
                });

                // limit  by 100 zoomBacks
                if (history.length > 100) {
                    history.shift();
                }
            }
        },
        getHistogram: function () {
            // clear feature highlight paramters in graphics object
            // TO DO: take highlight parameters to Feature Info model
            graphics.set("functionName", "");
            graphics.set("functionLayer", "");
            graphics.set("functionNextFeature", false);
            this.getGraphics();
        },
        getFeatureInfo: function () {
            histogram.clearAllNoGraphics();
            this.getGraphics();
        },
        getGraphics: function () {
            if (job.get("name") == "" || job.get("currentStep") == "")
                return;

            var xmin = graphics.get('flipImage') ? this.C2W_X(_canvas.width) : this.C2W_X(0);
            var ymin = this.C2W_Y(_canvas.height);
            var xmax = graphics.get('flipImage') ? this.C2W_X(0) : this.C2W_X(_canvas.width);
            var ymax = this.C2W_Y(0);

            if (units.valid(xmin) && units.valid(ymin) &&
                units.valid(xmax) && units.valid(ymax)) {
                graphics.set({
                    xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax,
                    width: _canvas.width, height: _canvas.height,
                    forceLoad: !graphics.get('forceLoad')
                });
            }
            else {
                this.drawRect();
                this.zoomBack();
            }
        },

        clearCanvas: function () {
            _canvas.width = _canvas.width; // clear canvas
        },

        imageLoaded: function () {
            this.render();

            if (this.mouseCoordX != undefined && this.mouseCoordY != undefined) {
                this.displayCoordinates(this.mouseCoordX, this.mouseCoordY);
            }
        },
        // Draw image 
        render: function () {
            if (!graphics.hasImage()) return;

            var xmin = graphics.get('xmin');
            var xmax = graphics.get('xmax');
            var ymin = graphics.get('ymin');
            var ymax = graphics.get('ymax');

            this.clearCanvas();

            var image = graphics.get('image');
            
            var scaleH = graphics.get('flipImage') ? - 1 : 1;           // Set horizontal scale to -1 if flip horizontal
            var scaleV = 1;                                             // Set verical scale to -1 if flip vertical
            var width = this.W2C_Scalar(xmax - xmin);
            var height = this.W2C_Scalar(ymax - ymin);

            var posX = graphics.get('flipImage') ? -this.W2C_X(xmax) : this.W2C_X(xmin);
            var posY = this.W2C_Y(ymax);

            if (graphics.get('flipImage'))
                _context.translate(width, 0);
            _context.scale(scaleH, scaleV);

            _context.drawImage(image, posX, posY, width, height);

        },

        displayCoordinates: function (mouseCoordX, mouseCoordY) {
            // this.mouseCoordX = e.offsetX || e.originalEvent.layerX;    // layerX for Firefox
            // this.mouseCoordY = e.offsetY || e.originalEvent.layerY;    // layery for Firefox

            var x = this.C2W_X(mouseCoordX).toFixed(7);
            var y = this.C2W_Y(mouseCoordY).toFixed(7);

            if (graphics.hasImage()) {
                var displ_el = document.getElementById('coordinates-display');
                $("#coordinates-display").html(x + ' ' + y);
            }
        },

        toggleUnits: function () {
            if (units.get("unitsName") == "inch") {         // toggle "mm" to "inch"
                this.resolution *= INCH2MM;
            }
            else if (units.get("unitsName") == "mm") {
                this.resolution /= INCH2MM;
            }
        },
        // Change canvas resolution on changing window size
        resize: function () {
            // set graphic section width
            var gsWidth = $(window).width() - $("div#main-section aside").width() - $("#splitter").width();
            $("#graphics-section").width(gsWidth);
            document.getElementById('graphics-section').style.left = $("div#main-section aside").width() + $("#splitter").width() + "px";

            var parent = $(_canvas).parent();
            _canvas.width = parent.width();
            _canvas.height = parent.height();

            // Resize also rubber bend canvas if exist
            _canvasrb = document.getElementById('canvasrb');
            if (_canvasrb) {
                _canvasrb.width = _canvas.width;
                _canvasrb.height = _canvas.height;
                _canvasrb.style.position = "absolute";
                _canvasrb.style.top = _canvas.offsetTop + "px";
                _canvasrb.style.left = _canvas.offsetLeft + "px";
            }

            _graphicsView.resizeView();
        },

        // Set focus flag true when mouse enter canvas;
        // Display coordinates
        //setFocus: function (e) {
        //    this.mouseCoordX = e.offsetX || e.originalEvent.layerX;    // layerX for Firefox
        //    this.mouseCoordY = e.offsetY || e.originalEvent.layerY;    // layery for Firefox
        //    if (graphics.hasImage()) {
        //        this.displayCoordinates(this.C2W_X(this.mouseCoordX).toFixed(7),
        //                                this.C2W_Y(this.mouseCoordY).toFixed(7));
        //    }
        //    this.focus = true;
        //},

        dropFocus: function () {
            _graphicsView.focus = false;
        },

        toggleWidthMode: function () {
            graphics.toggleWidthMode();
            this.getGraphics();
        },
        toggleBgColor: function () {
            if (UserSettings.get('selectedColorSet') == 'blackbg') {
                UserSettings.set('selectedColorSet', 'default');
            } else {
                UserSettings.set('selectedColorSet', 'blackbg');
            }
        },
        toggleDispNegative: function () {
            graphics.toggleDispNegative();
            this.getGraphics();
        },
        toggleDispNegativeIcon: function () {
            if (graphics.get("negMode")) {
                $("#negative-toggle").css({ "background-image": "url('/images/icons/NegativeOn.png')" });
            } else {
                $("#negative-toggle").css({ "background-image": "url('/images/icons/NegativeOff.png')" });
            }
        },
        toggleWidthModeIcon: function () {
            if (graphics.get("widthMode") == 1) {
                $("#width-toggle").css({ "background-image": "url('/images/icons/WidthOn.png')" });
            } else {
                $("#width-toggle").css({ "background-image": "url('/images/icons/WidthOff.png')" });
            }
        },
        updateBgColorStyles: function () {
            if (UserSettings.get('selectedColorSet') == 'blackbg') {
                $("#bgcolor-toggle").css({ "background-image": "url('/images/icons/bg-b.png')" });
                $("#coordinates-display").css({ "color": "white"});
                $("#coordinates-display").css({ "background-color" : "rgba(0,0,0,0.9)" });
	    } else {
                $("#bgcolor-toggle").css({ "background-image": "url('/images/icons/bg-w.png')" });
                $("#coordinates-display").css({ "color": "black"});
                $("#coordinates-display").css({ "background-color" : "rgba(255,255,255,0.9)" });
	    }
        },

        toggleFlipImageFlag: function() {
            graphics.set('flipImage', !graphics.get('flipImage'));
            $("#flip-toggle").toggleClass("flip-icon", graphics.get('flipImage'));
        },

        flipImageFlagChanged: function () {
            // change coordinate system

            this.xdir = (-1) * this.xdir;

            var width = graphics.get('xmax') - graphics.get('xmin');
            var height = graphics.get('ymax') - graphics.get('ymin');

            this.initOrigin(width, height, graphics.get('xmin'), graphics.get('ymax'));

            this.getGraphics();
        },

        changeTool: function (e) {
            if (Tools[e.target.id]) {
                this.resetTool();
                this.currentToolId = e.target.id;
                $("#" + e.target.id).addClass('active');
                this.tool = new Tools[this.currentToolId]({ model: this });
            }
        },
        resetTool : function () {
            graphics.set("functionName", "");
            graphics.set("highlightSteps", []);
            graphics.set("respondMessage", "");
            $("#" + this.currentToolId).removeClass('active');

            this.tool.stop();
            //this.currentToolId = "zoom-area";
            //this.tool = new Tools[this.currentToolId]({ model: this });
        },
        changeToDefaultTool: function () {
            this.resetTool();
            this.currentToolId = "zoom-area";
            $("#zoom-area").addClass('active');
            this.tool = new Tools[this.currentToolId]({ model: this });
        },
        zoomInCenter: function () {
            this.addToHistory();        // add current graphicsView status to History before this status was changed BUG58410
            this.zoomIn(_canvas.width / 2, _canvas.height / 2);
            // this.getGraphics();
        },
        zoomOutCenter: function () {
            this.addToHistory();        // add current graphicsView status to History before this status was changed BUG58410
            this.zoomOut(_canvas.width / 2, _canvas.height / 2);
            // this.getGraphics();
        },

        // Zoom with mouse wheel - all browsers except Firefox
        zoom: function (e) {
            e.preventDefault();
            //clearTimeout(zoomTimer);
            //zoomTimer = setTimeout(function () { _graphicsView.getGraphics(); }, 200); // Digital zoom

            var delta = e.originalEvent.detail || e.originalEvent.wheelDelta;
            if (delta != 0) {
                this.addToHistory();        // add current graphicsView status to History before this status was changed BUG58410
                delta < 0 ? this.zoomOut(e.offsetX, e.offsetY, 2, true) :
                    this.zoomIn(e.offsetX, e.offsetY, 2, true);
                //_graphicsView.render();
                //this.getGraphics();
            }
        },
        // Zoom with mouse wheel in Firefox browser
        zoomFox: function (e) {
            e.preventDefault();
            //clearTimeout(zoomTimer);
            //zoomTimer = setTimeout(function () { _graphicsView.getGraphics(); }, 200); // Digital zoom
            if (e.originalEvent.detail != 0) {
                var offset_x = e.originalEvent.layerX;
                var offset_y = e.originalEvent.layerY;
                this.addToHistory();        // add current graphicsView status to History before this status was changed BUG58410
                e.originalEvent.detail > 0 ? this.zoomOut(offset_x, offset_y, 2 , true) :
                    this.zoomIn(offset_x, offset_y, 2, true);
                //_graphicsView.render();
                //this.getGraphics();
            }
        },

        // Zoom with rectangular area
        zoomArea: function (startX, startY, endX, endY) {
            var width = 0;
            var height = 0;
            if (startX != undefined && startY != undefined &&
                endX != undefined && endY != undefined) {
                width = Math.abs(startX - endX);
                height = Math.abs(startY - endY);
            }

            if (width > 3 && height > 3) {    // avoid zero selection

                var zoomRatio = Math.min(_canvas.width / width, _canvas.height / height);

                // Low left corner
                var xmin = Math.min(startX, endX);
                var ymin = Math.max(startY, endY);
                // Upper right corner
                var xmax = Math.max(startX, endX);
                var ymax = Math.min(startY, endY);

                // Pan to center
                var xcenter = (xmin + xmax) / 2;
                var ycenter = (ymin + ymax) / 2;

                _graphicsView.addToHistory();        // add current graphicsView status to History before this status was changed

                _graphicsView.translateOrigin(_canvas.width / 2 - xcenter, _canvas.height / 2 - ycenter);

                // Recalculate new zoomFactor and origin
                _graphicsView.zoomIn(_canvas.width / 2, _canvas.height / 2, zoomRatio);

                // Get new graphics
                // _graphicsView.getGraphics();
            }
        },

        zoomBack: function () {
            if (history.length > 0) {
                var h = history.pop();
                if (h) {
                    var width = h.get('xmax') - h.get('xmin');
                    var height = h.get('ymax') - h.get('ymin');

                    this.zoomFactor = h.get('zoomFactor');
                    this.resolution = h.get('resolution');

                    this.initOrigin(width, height, h.get('xmin'), h.get('ymax'));

                    graphics.set({
                        xmin: h.get('xmin'), ymin: h.get('ymin'), xmax: h.get('xmax'), ymax: h.get('ymax'),
                        width: _canvas.width, height: _canvas.height,
                        forceLoad: !graphics.get('forceLoad')
                    });
                }
            }
        },
        //panToCoordinateWidget: function () {
        //    if (!graphics.hasImage()) return;
        //    var panToCoordinate = new PanToCoordinateWidget({ model: _graphicsView });
        //},
        cleanInputCoordinates: function() {
            $("#input-coordinate").val("");
            $("#input-coordinate").attr("placeholder", polyglot.t("header.toolbar.center-to-xy-placeholder", { _: "Center to X,Y" }));
        },
        panToCoordinate: function () {
            var el = $("#input-coordinate")[0]
            var str = el.value.trim();
            var xy = str.split(/[ ,]+/);
            if (!graphics.hasImage()) {
                alert(polyglot.t("graphics-section.job-not-open-message", { _: "Job isn't open!" }));
                this.cleanInputCoordinates();
            }
            else {
                if (xy.length == 2 && $.isNumeric(xy[0]) && $.isNumeric(xy[1])) {   // input consist of two numbers
                    var x = Number(xy[0]);
                    var y = Number(xy[1]);
                    this.panTo(x, y);
                }
                else {                                                              // illegal input
                    var errorStr = polyglot.t("graphics-section.illegal-coordinates-message", { _: "Illegal coordinates input" });
                    $("#errorPopup").html(errorStr);
                    $("#errorPopup").dialog({
                        modal: true,
                        title: polyglot.t("app.errors-title", { _: 'Error' })
                    });
                    $("#errorPopup").dialog("open");

                    this.cleanInputCoordinates();
                }
            }
            
        },
        panTo: function (x, y) {
            if (!graphics.hasImage()) return;
            var canvasX = this.W2C_X(x);
            var canvasY = this.W2C_Y(y);

            _graphicsView.addToHistory();        // add current graphicsView status to History before this status was changed

            _graphicsView.translateOrigin(_canvas.width / 2 - canvasX, _canvas.height / 2 - canvasY);

            // Get new graphics
            _graphicsView.getGraphics();
        },

        panHorizontal: function (dir, shiftKey) {
            var ratio = shiftKey ? 0.1 : 0.9;
            if (!graphics.hasImage()) return;
            if (!_graphicsView.focus) return;
            this.addToHistory();        // add current graphicsView status to History before this status was changed
            this.translateOrigin(ratio * _canvas.width * dir, 0);
            this.render();
        },
        panVertical: function (dir, shiftKey) {
            var ratio = shiftKey ? 0.1 : 0.9;
            if (!graphics.hasImage()) return;
            if (!_graphicsView.focus) return;
            this.addToHistory();        // add current graphicsView status to History before this status was changed
            this.translateOrigin(0, ratio * _canvas.height * dir);
            this.render();
        },
        scalingFactor: function () {
            return this.resolution * this.zoomFactor;
        },
        // Canvas to World coordinate transformation
        C2W_X: function (canvasX) {
            return ( this.xdir * (canvasX - this.origin.x) / this.scalingFactor());
        },
        C2W_Y: function(canvasY) {
            return ( this.ydir * (canvasY - this.origin.y) / this.scalingFactor());
        },
        // World to Canvas coordinate and scalar transformation
        W2C_X: function(worldX) {
            return ( this.origin.x + this.xdir * this.scalingFactor() * worldX);
        },
        W2C_Y: function(worldY) {
            return (this.origin.y + this.ydir * this.scalingFactor() * worldY);
        },
        C2W_Scalar: function(scalar) {
            return (scalar / this.scalingFactor());
        },
        W2C_Scalar: function(scalar) {
            return (this.scalingFactor()*scalar);
        },
        // Set new origin
        setOrigin: function(newOrigin) {
            this.origin.x = newOrigin.x;
            this.origin.y = newOrigin.y;
        },
        translateOrigin: function (deltaX, deltaY) {
            this.origin.x += deltaX;
            this.origin.y += deltaY;
        },
        // ZoomIn + "Focus follows mouse"
        zoomIn: function (focusX, focusY, ratio, animate) {
            var curRatio = ratio || 2;
            var counter = 15;
            var tmpRatio = Math.pow(2, 1 / counter);
            clearInterval(zoomInterval);
            if (animate) {
                zoomInterval = setInterval(function () {
                    //tmpRatio += curRatio / 10;
                    //tmpRatio *= 1.01;
                    counter--;
                    _graphicsView.recalcZoomFactorAndOrigin(focusX, focusY, true, tmpRatio);
                    _graphicsView.render();
                    
                    if (counter <= 0) {
                        clearInterval(zoomInterval);
                        _graphicsView.getGraphics();
                    }

                }, 20);
            }
            else {
                _graphicsView.recalcZoomFactorAndOrigin(focusX, focusY, true, curRatio);
                //_graphicsView.render();
                _graphicsView.getGraphics();
            }
            
            //_graphicsView.render();
        },
        // ZoomOut + "Focus follows mouse"
        zoomOut: function(focusX, focusY, ratio, animate) {
            var curRatio = ratio || 2;
            var counter = 15;
            var tmpRatio = Math.pow(2, 1 / counter);
            clearInterval(zoomInterval);
            if (animate) {
                zoomInterval = setInterval(function () {
                    //tmpRatio += curRatio / 10;
                    //tmpRatio *= 1.01;
                    counter--;
                    _graphicsView.recalcZoomFactorAndOrigin(focusX, focusY, false, tmpRatio);
                    _graphicsView.render();
                    if (counter <= 0) {
                        clearInterval(zoomInterval);
                        _graphicsView.getGraphics();
                    }

                }, 20);
            }
            else {
                _graphicsView.recalcZoomFactorAndOrigin(focusX, focusY, false, curRatio);
                _graphicsView.getGraphics();
            }
        },
        recalcZoomFactorAndOrigin: function (focusX, focusY, bIn, ratio) {
            var worldX = this.C2W_X(focusX);    // world coordinate of mouse focus before zoom
            var worldY = this.C2W_Y(focusY);

            bIn ? this.zoomFactor = Math.min(100000, ratio * this.zoomFactor) :
                this.zoomFactor = Math.max(0.001, this.zoomFactor / ratio);

            var newFocusX = this.W2C_X(worldX); // canvas coordinate after zoom
            var newFocusY = this.W2C_Y(worldY);

            this.translateOrigin(focusX - newFocusX, focusY - newFocusY);
        },

        // override remove to also unbind events
        remove: function () {
            $(document).off('keydown', this.keydown);
            Backbone.View.prototype.remove.call(this);
        },

        // red rectangle to mark illegal coordinates out of bounds
        drawRect: function () {
            _context.beginPath();
            _context.rect(0, 0, _canvas.width, _canvas.height);

            _context.lineWidth = 10;
            _context.setLineDash([20]);
            _context.strokeStyle = 'rgba(255, 3, 3, 0.8)';                     //'red';
            _context.stroke();
        }
    });
    return new GraphicsView();
});
