
function canvasLibraryLeaflet() {
    // L.DomUtil.setTransform = L.DomUtil.setTransform || function (el, offset, scale) {
    //     var pos = offset || new L.Point(0, 0);
    //     el.style[L.DomUtil.TRANSFORM] =
    //         (L.Browser.ie3d ?
    //             'translate(' + pos.x + 'px,' + pos.y + 'px)' :
    //             'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
    //         (scale ? ' scale(' + scale + ')' : '');
    // };

    // -- support for both  0.0.7 and 1.0.0 rc2 leaflet
    L.CanvasLayer = (L.Layer ? L.Layer : L.Class).extend({
        // -- initialized is called on prototype 
        name,

        initialize: function (options) {
            console.log('options', options);
            this._map = null;
            this._canvas = null;
            this._frame = null;
            this._delegate = null;
            L.setOptions(this, options);
            console.log(this, options);
            console.log('canvA setOptions', L.setOptions(this, options))
        },

        delegate: function (del) {
            this._delegate = del;
            return this;
        },

        needRedraw: function () {
            if (!this._frame) {
                console.log(this._frame)
                this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
            }
            return this;
        },

        //-------------------------------------------------------------
        _onLayerDidResize: function (resizeEvent) {
            console.log('resized')
            this._canvas.width = resizeEvent.newSize.x;
            this._canvas.height = resizeEvent.newSize.y;
        },
        //-------------------------------------------------------------
        _onLayerDidMove: function () {
            console.log('moved')
            var topLeft = this._map.containerPointToLayerPoint([0, 0]);
            L.DomUtil.setPosition(this._canvas, topLeft);
            this.drawLayer();
        },
        //-------------------------------------------------------------
        getEvents: function () {
            console.log('clicked', this);
            var events = {
                resize: this._onLayerDidResize,
                moveend: this._onLayerDidMove,
                zoom: this._onLayerDidMove
            };
            if (this._map.options.zoomAnimation && L.Browser.any3d) {
                console.log('events', events)
                events.zoomanim = this._animateZoom;
            }

            return events;
        },
        //-------------------------------------------------------------
        onAdd: function (map) {
            console.log('canvas added')
            this._map = map;
            this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
            this.tiles = {};

            var size = this._map.getSize();
            this._canvas.width = size.x;
            this._canvas.height = size.y;

            var animated = this._map.options.zoomAnimation && L.Browser.any3d;
            L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


            map._panes.overlayPane.appendChild(this._canvas);

            map.on(this.getEvents(), this);

            var del = this._delegate || this;
            del.onLayerDidMount && del.onLayerDidMount(); // -- callback
            this.needRedraw();
            console.log('called')
        },

        //-------------------------------------------------------------
        onRemove: function (map) {
            var del = this._delegate || this;
            del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback

            if (this._frame) {
                L.Util.cancelAnimFrame(this._frame);
            }

            map.getPanes().overlayPane.removeChild(this._canvas);

            map.off(this.getEvents(), this);

            this._canvas = null;

        },

        //------------------------------------------------------------
        addTo: function (map) {
            console.log('map', map)
            console.log('this', this)
            map.addLayer(this);
            return this;
        },
        // --------------------------------------------------------------------------------
        LatLonToMercator: function (latlon) {
            return {
                x: latlon.lng * 6378137 * Math.PI / 180,
                y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
            };
        },
        getData: function () {
            // calls an API and gets Data
            console.log("Fetching Data ..");
        },
        //------------------------------------------------------------------------------
        drawLayer: function () {
            console.log('fired');
            var size = this._map.getSize();
            var bounds = this._map.getBounds();
            var zoom = this._map.getZoom();

            var center = this.LatLonToMercator(this._map.getCenter());
            var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

            var del = this._delegate || this;
            var obj = {
                layer: this,
                canvas: this._canvas,
                bounds: bounds,
                size: size,
                zoom: zoom,
                center: center,
                corner: corner
            }
            del.onDrawLayer && del.onDrawLayer(obj);
            this._frame = null;
        },

        debounce: function () {
            console.log('hey there')
            let timer;
            // return function () {
            //     let context = this;
            //     let args = arguments;
            //     console.log
            //     clearTimeout(timer);
            //     timer = setTimeout(() => {
            //         this.drawLayer.apply(context, arguments);
            //     }, d);
            // }
            //return 300;
            var del = this._delegate || this;
            del.debounce && del.debounce('hi');
        },
        // -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
        //------------------------------------------------------------------------------
        _setTransform: function (el, offset, scale) {
            var pos = offset || new L.Point(0, 0);

            el.style[L.DomUtil.TRANSFORM] =
                (L.Browser.ie3d ?
                    'translate(' + pos.x + 'px,' + pos.y + 'px)' :
                    'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
                (scale ? ' scale(' + scale + ')' : '');
        },

        //------------------------------------------------------------------------------
        _animateZoom: function (e) {
            var scale = this._map.getZoomScale(e.zoom);
            // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1 
            var offset = L.Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min :
                this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

            L.DomUtil.setTransform(this._canvas, offset, scale);


        }
    });

    L.canvasLayer = function () {
        return new L.CanvasLayer();
    };

    return L;
}