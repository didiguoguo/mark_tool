function Vector2(e, t) {
    this.x = e;
    this.y = t
}
var Vector = function (e, t) {
    this.x = e;
    this.y = t
};
Vector.prototype.add = function (e) {
    return new Vector(this.x + e.x, this.y + e.y)
};
Vector.prototype.subtract = function (e) {
    return new Vector(this.x - e.x, this.y - e.y)
};
Vector.prototype.vectorWithinDist = function (e, t) {
    var n = this.distanceSquared(e);
    return n <= t * t
};
Vector.prototype.vectorsWithinDist = function (e, n) {
    var i = false;
    $.each(e, function (e, t) {
            if (this.vectorWithinDist(t, n))
                i = true;
            return false
        }
        .bind(this));
    return i
};
Vector.prototype.distanceSquared = function (e) {
    var t = e.y - this.y;
    var n = e.x - this.x;
    return t * t + n * n
};
Vector.prototype.withinRect = function (e) {
    var t = false;
    var n = e.x;
    var i = e.x + e.width;
    var r = e.y;
    var o = e.y + e.height;
    if (this.x >= n && this.x <= i) {
        if (this.y >= r && this.y <= o) {
            t = true
        }
    }
    return t
};
Vector.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
};
Vector2.prototype.add = function (e) {
    return new Vector2(this.x + e.x, this.y + e.y)
};
Vector2.prototype.subtract = function (e) {
    return new Vector2(this.x - e.x, this.y - e.y)
};
Vector2.prototype.multiply = function (e) {
    return new Vector2(this.x * e, this.y * e)
};
Vector2.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
};
Vector2.prototype.normalize = function () {
    return this.multiply(1 / this.magnitude())
};
Vector2.prototype.distance = function (e) {
    var t = e.y - this.y;
    var n = e.x - this.x;
    return Math.sqrt(t * t + n * n)
};
Vector2.prototype.distanceSquared = function (e) {
    var t = e.y - this.y;
    var n = e.x - this.x;
    return t * t + n * n
};
Vector2.prototype.vectorIsWithinDist = function (e, t) {
    var n = this.distanceSquared(e);
    return n <= t * t
};
var DEBUG_LINE_SEGMENT = false;
var DEBUG = false;

function LineSegment(e, t) {
    this.startPoint = e;
    this.endPoint = t
}
LineSegment.prototype.calculateIntersectionWithLineSegment = function (e) {
    var t = .1;
    var n = new Line(this.startPoint, this.endPoint);
    var i = new Line(e.startPoint, e.endPoint);
    var r = n.calculateSlopeIntercept();
    var o = i.calculateSlopeIntercept();
    if (isNaN(r.m) || isNaN(o.m))
        return false;
    if (Math.abs(r.m) == Infinity) {
        if (Math.abs(o.m) == Infinity)
            return false;
        var a = this.__calculateIntersectionAsStraightLine(e, o, t);
        if (a)
            return a
    } else if (Math.abs(o.m) == Infinity) {
        var a = e.__calculateIntersectionAsStraightLine(this, r, t);
        if (a)
            return a
    }
    var s = (o.b - r.b) / (r.m - o.m);
    var l = r.m * s + r.b;
    var u = new Vector2(s, l);
    var c = this.pointInDomainAndRange(u, t) && e.pointInDomainAndRange(u, t);
    if (DEBUG_DRAW && DEBUG_LINE_SEGMENT) {
        var f = new Line(DEBUG_TRANSFORM_FUNCTION(this.startPoint), DEBUG_TRANSFORM_FUNCTION(this.endPoint));
        var h = f.extendPoints(999999);
        var d = new Line(DEBUG_TRANSFORM_FUNCTION(i.startPoint), DEBUG_TRANSFORM_FUNCTION(i.endPoint));
        var p = d.extendPoints(999999);
        var v = DEBUG_TRANSFORM_FUNCTION(u);
        DEBUG_DRAWER.drawLineSegment(h.startPoint, h.endPoint, {
            strokeStyle: "blue"
        });
        DEBUG_DRAWER.drawLineSegment(f.startPoint, f.endPoint, {
            strokeStyle: "cyan"
        });
        DEBUG_DRAWER.drawLineSegment(p.startPoint, p.endPoint, {
            strokeStyle: "DarkGoldenRod"
        });
        DEBUG_DRAWER.drawLineSegment(d.startPoint, d.endPoint, {
            strokeStyle: "yellow"
        });
        if (c) {
            DEBUG_DRAWER.drawX(v.x, v.y, 25, 25, {
                strokeStyle: "red"
            })
        }
    }
    return c ? u : false
};
LineSegment.prototype.__calculateIntersectionAsStraightLine = function (e, t, n) {
    if (e.isInDomain(this.startPoint.x, n)) {
        var i = new Vector2(this.startPoint.x, t.m * this.startPoint.x + t.b);
        if (this.isInRange(i.y, n) && e.isInRange(i.y, n)) {
            return i
        }
    }
    return false
};
LineSegment.prototype.calculateIntersectionWithPoint = function (e) {
    var t = new Line(this.startPoint, this.endPoint);
    var n = t.calculateSlopeIntercept();
    var i = e.x;
    var r = n.m * i + n.b;
    var o = new Vector2(i, r);
    var a = .2;
    var s = this.pointInDomainAndRange(o, a);
    var l = s && o.vectorIsWithinDist(e, a);
    if (DEBUG_DRAW && DEBUG_LINE_SEGMENT) {
        var u = new Line(DEBUG_TRANSFORM_FUNCTION(this.startPoint), DEBUG_TRANSFORM_FUNCTION(this.endPoint));
        var c = u.extendPoints(999999);
        var f = DEBUG_TRANSFORM_FUNCTION(o);
        DEBUG_DRAWER.drawLineSegment(c.startPoint, c.endPoint, {
            strokeStyle: "blue"
        });
        DEBUG_DRAWER.drawLineSegment(u.startPoint, u.endPoint, {
            strokeStyle: "cyan"
        });
        if (l) {
            DEBUG_DRAWER.drawX(f.x, f.y, 25, 25, {
                strokeStyle: "red"
            })
        }
    }
    return l ? o : false
};
LineSegment.prototype.pointInDomainAndRange = function (e, t) {
    if (t == undefined)
        t = 0;
    var n = this.isInDomain(e.x, t);
    var i = this.isInRange(e.y, t);
    return n && i
};
LineSegment.prototype.isInDomain = function (e, t) {
    if (t == undefined)
        t = 0;
    var n = Math.min(this.startPoint.x, this.endPoint.x);
    var i = Math.max(this.startPoint.x, this.endPoint.x);
    return e >= n - t && e <= i + t
};
LineSegment.prototype.isInRange = function (e, t) {
    if (t == undefined)
        t = 0;
    var n = Math.min(this.startPoint.y, this.endPoint.y);
    var i = Math.max(this.startPoint.y, this.endPoint.y);
    return e >= n - t && e <= i + t
};
LineSegment.prototype.domain = function () {
    var e = Math.min(this.startPoint.x, this.endPoint.x);
    var t = Math.max(this.startPoint.x, this.endPoint.x);
    return new Vector2(e, t)
};
LineSegment.prototype.range = function () {
    var e = Math.min(this.startPoint.y, this.endPoint.y);
    var t = Math.max(this.startPoint.y, this.endPoint.y);
    return new Vector2(e, t)
};

function Line(e, t) {
    this.startPoint = e;
    this.endPoint = t
}
Line.prototype.extendPoints = function (e) {
    var t = this.endPoint.subtract(this.startPoint).normalize();
    var n = t.multiply(e);
    return new Line(this.startPoint.subtract(n), this.startPoint.add(n))
};
Line.prototype.calculateSlopeIntercept = function () {
    var e = (this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x);
    var t = this.endPoint.y - e * this.endPoint.x;
    return {
        m: e,
        b: t
    }
};
var DEBUG_RAY = false;
var Ray = function (e, t) {
    this.startPoint = e;
    this.endPoint = t
};
Ray.prototype.extendPoint = function (e) {
    var t = this.endPoint.subtract(this.startPoint).normalize();
    var n = t.multiply(e);
    return new Ray(this.startPoint, this.startPoint.add(n))
};
Ray.prototype.calculateIntersectionWithLineSegment = function (e) {
    var t = this.extendPoint(999999);
    var n = new LineSegment(t.startPoint, t.endPoint);
    return n.calculateIntersectionWithLineSegment(e)
};
Ray.prototype.calculateIntersectionWithLineSegment = function (e) {
    var t = this.extendPoint(999999);
    var n = new LineSegment(t.startPoint, t.endPoint);
    return n.calculateIntersectionWithLineSegment(e)
};
Ray.prototype.calculateIntersectionWithPoint = function (e) {
    var t = this.extendPoint(999999);
    var n = new LineSegment(t.startPoint, t.endPoint);
    return n.calculateIntersectionWithPoint(e)
};
Ray.prototype.calculateIntersectionWithPoints = function (e) {
    var i = [];
    $.each(e, function (e, t) {
            var n = this.calculateIntersectionWithPoint(t);
            if (n)
                i.push(n)
        }
        .bind(this));
    return i
};
var DEBUG_POLYGON = false;
var Polygon = function (e) {
    this.points = e;
    this.centerPoint = this.calculateCenterPoint(this.points);
    this.lines = this.calculateLines(this.points)
};
Polygon.prototype.doesContainsPoint = function (e) {
    this.lines = this.calculateLines(this.points);
    if (e.vectorsWithinDist(this.points))
        return false;
    var i;
    var t;
    var n;
    var r = 0;
    do {
        r++;
        i = new Ray(e, new Vector2(e.x + Math.random() * 10 + 1, e.y + Math.random() * 10 + 1));
        t = i.calculateIntersectionWithPoints(this.points);
        n = t.length > 0
    } while (n && r < 15);
    var o = [];
    $.each(this.lines, function (e, t) {
        var n = i.calculateIntersectionWithLineSegment(t);
        if (n)
            o.push(n)
    });
    var a = o.length;
    var s = a % 2 == 0;
    var l = !Boolean(s);
    if (DEBUG_DRAW && DEBUG_POLYGON) {
        var u = new Ray(DEBUG_TRANSFORM_FUNCTION(i.startPoint), DEBUG_TRANSFORM_FUNCTION(i.endPoint));
        DEBUG_DRAWER.drawLineSegment(u.startPoint, u.extendPoint(999999).endPoint, {
            strokeStyle: "green"
        });
        $.each(this.lines, function (e, t) {
            var n = new LineSegment(DEBUG_TRANSFORM_FUNCTION(t.startPoint), DEBUG_TRANSFORM_FUNCTION(t.endPoint));
            DEBUG_DRAWER.drawLineSegment(n.startPoint, n.endPoint, {
                strokeStyle: "yellow"
            })
        });
        $.each(o, function (e, t) {
            var n = DEBUG_TRANSFORM_FUNCTION(t);
            DEBUG_DRAWER.drawX(n.x, n.y, 25, 25, {
                strokeStyle: "red"
            })
        })
    }
    return l
};
Polygon.prototype.calculateCenterPoint = function (e) {
    var n = 0;
    var i = 0;
    $.each(e, function (e, t) {
        n += t.x;
        i += t.y
    });
    var t = e.length;
    n /= t;
    i /= t;
    var r = new Vector2(n, i);
    if (DEBUG_DRAW && DEBUG_POLYGON) {
        var o = DEBUG_TRANSFORM_FUNCTION(r);
        DEBUG_DRAWER.drawCircle(o.x, o.y, 10, {
            fillStyle: "green"
        })
    }
    return r
};
Polygon.prototype.calculateLines = function (r) {
    var o = r.length;
    var a = [];
    $.each(r, function (e, t) {
            if (o > 1 && e != o - 1) {
                var n = r[e + 1];
                var i = new LineSegment(t, n);
                a.push(i)
            }
        }
        .bind(this));
    var e = new LineSegment(r[o - 1], r[0]);
    a.push(e);
    return a
};

var Drawer = function (ctx) {
    if (ctx)
        this.context = ctx;
    this.__noContextError = "You must define a context before drawing:\nvar myDrawer = new Drawer(context);\nor\nmyDrawer.context = canvas.getContext('2d');"
};
Drawer.prototype.drawLineSegment = function (startPoint, targetPoint, options) {
    this.__startDraw(options);
    this.context.beginPath();
    this.context.moveTo(startPoint.x, startPoint.y);
    this.context.lineTo(targetPoint.x, targetPoint.y);
    this.__stroke(options);
    this.context.closePath()
};
Drawer.prototype.drawDoubleLineSegment = function (e, t, n, i) {
    this.drawLineSegment(e, t, n);
    this.drawLineSegment(e, t, i)
};
Drawer.prototype.drawDoublePoly = function (e, t, n) {
    this.drawPoly(e, t);
    this.drawPoly(e, n)
};
Drawer.prototype.drawPoly = function (i, r) {
    $.each(i, function (e, t) {
            var n = e == i.length - 1 ? i[0] : i[e + 1];
            this.drawLineSegment(t, n, r)
        }
        .bind(this))
};
Drawer.prototype.drawConnectedPoints = function (arr, options) {
    $.each(arr, function (i, point) {
            if (i == arr.length - 1)
                return false;
            var next = arr[i + 1];
            this.drawLineSegment(point, next, options)
        }
        .bind(this))
};
Drawer.prototype.drawDoubleConnectedPoints = function (e, t, n) {
    this.drawConnectedPoints(e, t);
    this.drawConnectedPoints(e, n)
};
Drawer.prototype.drawLine = function (e, t) {
    e = e.extendPoints(999999);
    this.drawLineSegment(e.startPoint, e.endPoint, t)
};
Drawer.prototype.drawCircle = function (x, y, radius, options) {
    this.__startDraw(options);
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.__stroke(options);
    this.__fill(options);
    this.context.closePath()
};
Drawer.prototype.drawDoubleCircle = function (e, t, n, i, r) {
    this.drawCircle(e, t, n, i);
    this.drawCircle(e, t, n, r)
};
Drawer.prototype.drawConcentricCircles = function (e, t, n, i, r, o) {
    this.drawCircle(e, t, n, r);
    this.drawCircle(e, t, i, o)
};
Drawer.prototype.drawX = function (e, t, n, i, r) {
    this.__startDraw(r);
    var o = n / 2;
    var a = i / 2;
    this.context.beginPath();
    this.context.moveTo(e - o, t - o);
    this.context.lineTo(e + o, t + o);
    this.context.moveTo(e + o, t - o);
    this.context.lineTo(e - o, t + o);
    this.context.stroke();
    this.context.closePath()
};
Drawer.prototype.__startDraw = function (e) {
    if (!this.context)
        throw this.__noContextError;
    this.__resetStyle();
    this.__applyStyle(e)
};
Drawer.prototype.__applyStyle = function (e) {
    if (!e)
        return;
    if (e.fillStyle)
        this.context.fillStyle = e.fillStyle;
    if (e.strokeStyle)
        this.context.strokeStyle = e.strokeStyle;
    if (e.lineWidth)
        this.context.lineWidth = e.lineWidth;
    if (e.lineCap)
        this.context.lineCap = e.lineCap
};
Drawer.prototype.__resetStyle = function (e) {
    this.context.fillStyle = null;
    this.context.strokeStyle = null;
    this.context.lineWidth = 0
};
Drawer.prototype.__fill = function (e) {
    if (e && e.fillStyle)
        this.context.fill()
};
Drawer.prototype.__stroke = function (options) {
    if (options && (options.strokeStyle || options.lineWidth))
        this.context.stroke()
};

var SelectedBBDrawer = function () {
    this.BB_STROKE_STYLE = "rgb(65, 244, 226)";
    this.BB_LINE_WIDTH = 1;
    this.BB_LINE_DASH = [5];
    this.BB_PADDING = 10;
    this.BB_OUTER_LINE_STROKE_STYLE = "#0e6b9c";
    this.BB_INNER_LINE_STROKE_STYLE = "#7bc9f5";
    this.BB_OUTER_LINE_WIDTH = 3;
    this.BB_INNER_LINE_WIDTH = 1;
    this.DELETE_RADIUS = 8;
    this.IDLED_DELETE_FILL_STYLE = "rgba(255, 0, 0, .8)";
    this.HOVERED_DELETE_FILL_STYLE = "rgba(120, 0, 0, .8)";
    this.outerLineStyle = {
        strokeStyle: this.BB_OUTER_LINE_STROKE_STYLE,
        lineWidth: this.BB_OUTER_LINE_WIDTH,
        lineCap: "square"
    };
    this.innerLineStyle = {
        strokeStyle: this.BB_INNER_LINE_STROKE_STYLE,
        lineWidth: this.BB_INNER_LINE_WIDTH,
        lineCap: "square"
    };
    this.__drawer = new Drawer
};
SelectedBBDrawer.prototype.drawBB = function (e, t, n) {
    this.drawRect(e, t);
    this.drawDeleteCircle(e, t, n);
    this.drawDeleteCross(e, t)
};
SelectedBBDrawer.prototype.drawRect = function (e, t) {
    var n = {
        x: t.x + t.width / 2 + this.BB_PADDING - this.DELETE_RADIUS,
        y: t.y - t.height / 2 - this.BB_PADDING
    };
    var i = {
        x: t.x - t.width / 2 - this.BB_PADDING,
        y: t.y - t.height / 2 - this.BB_PADDING
    };
    var r = {
        x: t.x - t.width / 2 - this.BB_PADDING,
        y: t.y + t.height / 2 + this.BB_PADDING
    };
    var o = {
        x: t.x + t.width / 2 + this.BB_PADDING,
        y: t.y + t.height / 2 + this.BB_PADDING
    };
    var a = {
        x: t.x + t.width / 2 + this.BB_PADDING,
        y: t.y - t.height / 2 - this.BB_PADDING + this.DELETE_RADIUS
    };
    var s = [n, i, r, o, a];
    this.__drawer.context = e;
    e.setLineDash(this.BB_LINE_DASH);
    this.__drawer.drawDoubleConnectedPoints(s, this.outerLineStyle, this.innerLineStyle);
    e.setLineDash([])
};
SelectedBBDrawer.prototype.getDeleteButtonPos = function (e) {
    var t = e.x + e.width / 2 + this.BB_PADDING;
    var n = e.y + -e.height / 2 - this.BB_PADDING;
    return new Vector(t, n)
};
SelectedBBDrawer.prototype.drawDeleteCircle = function (e, t, n) {
    var i = t.x;
    var r = t.y;
    var o = this.IDLED_DELETE_FILL_STYLE;
    if (n)
        o = this.HOVERED_DELETE_FILL_STYLE;
    e.beginPath();
    e.arc(i + t.width / 2 + this.BB_PADDING, r - t.height / 2 - this.BB_PADDING, this.DELETE_RADIUS, 0, 2 * Math.PI);
    e.fillStyle = o;
    e.fill();
    e.closePath()
};
SelectedBBDrawer.prototype.drawDeleteCross = function (e, t) {
    var n = t.x;
    var i = t.y;
    e.strokeStyle = "white";
    e.lineWidth = 2;
    var r = .7;
    e.beginPath();
    e.moveTo(n + t.width / 2 + this.BB_PADDING - this.DELETE_RADIUS / Math.sqrt(2) * r, i - t.height / 2 - this.BB_PADDING - this.DELETE_RADIUS / Math.sqrt(2) * r);
    e.lineTo(n + t.width / 2 + this.BB_PADDING + this.DELETE_RADIUS / Math.sqrt(2) * r, i - t.height / 2 - this.BB_PADDING + this.DELETE_RADIUS / Math.sqrt(2) * r);
    e.moveTo(n + t.width / 2 + this.BB_PADDING - this.DELETE_RADIUS / Math.sqrt(2) * r, i - t.height / 2 - this.BB_PADDING + this.DELETE_RADIUS / Math.sqrt(2) * r);
    e.lineTo(n + t.width / 2 + this.BB_PADDING + this.DELETE_RADIUS / Math.sqrt(2) * r, i - t.height / 2 - this.BB_PADDING - this.DELETE_RADIUS / Math.sqrt(2) * r);
    e.stroke();
    e.closePath()
};
var PointDrawer = function () {
    this.OUTER_DOT_RADIUS = 10;
    this.INNER_DOT_RADIUS = .6 * this.OUTER_DOT_RADIUS;
    this.IDLED_DOT_OUTER_FILL_STYLE = "rgba(0, 124, 189, .75)";
    this.IDLED_DOT_INNER_FILL_STYLE = "rgba(131, 211, 255, .9)";
    this.HOVERED_DOT_OUTER_FILL_STYLE = "rgba(133, 52, 122, .75)";
    this.HOVERED_DOT_INNER_FILL_STYLE = "rgba(255, 131, 247, .9)";
    this.SELECTED_DOT_OUTER_FILL_STYLE = "rgba(20, 119, 65, .9)";
    this.SELECTED_DOT_INNER_FILL_STYLE = "rgba(178, 241, 130, .75)";
    this.__drawer = new Drawer
};
PointDrawer.prototype.drawPointScaled = function (e, t, n, i, r, o) {
    var a = this.IDLED_DOT_OUTER_FILL_STYLE;
    var s = this.IDLED_DOT_INNER_FILL_STYLE;
    if (i) {
        a = this.HOVERED_DOT_OUTER_FILL_STYLE;
        s = this.HOVERED_DOT_INNER_FILL_STYLE
    }
    if (r) {
        a = this.SELECTED_DOT_OUTER_FILL_STYLE;
        s = this.SELECTED_DOT_INNER_FILL_STYLE
    }
    this.__drawer.context = e;
    this.__drawer.drawConcentricCircles(t, n, this.OUTER_DOT_RADIUS * o, this.INNER_DOT_RADIUS * o, {
        fillStyle: a
    }, {
        fillStyle: s
    })
};
PointDrawer.prototype.drawPoint = function (e, t, n, i, r) {
    var o = this.IDLED_DOT_OUTER_FILL_STYLE;
    var a = this.IDLED_DOT_INNER_FILL_STYLE;
    if (i) {
        o = this.HOVERED_DOT_OUTER_FILL_STYLE;
        a = this.HOVERED_DOT_INNER_FILL_STYLE
    }
    if (r) {
        o = this.SELECTED_DOT_OUTER_FILL_STYLE;
        a = this.SELECTED_DOT_INNER_FILL_STYLE
    }
    this.__drawer.context = e;
    this.__drawer.drawConcentricCircles(t, n, this.OUTER_DOT_RADIUS, this.INNER_DOT_RADIUS, {
        fillStyle: o
    }, {
        fillStyle: a
    })
};
var PolyDrawer = function () {
    this.IDLED_OUTER_STROKE_STYLE = "rgba(0, 124, 189, 1)";
    this.IDLED_INNER_STROKE_STYLE = "rgba(131, 211, 255, 1)";
    this.HOVERED_OUTER_STROKE_STYLE = "rgba(133, 52, 122, 1)";
    this.HOVERED_INNER_STROKE_STYLE = "rgba(255, 131, 247, 1)";
    this.SELECTED_OUTER_STROKE_STYLE = "rgba(20, 119, 65, 1)";
    this.SELECTED_INNER_STROKE_STYLE = "rgba(178, 241, 130, 1)";
    this.OUTER_LINE_WIDTH = 3;
    this.INNER_LINE_WIDTH = 1;
    this.IDLED_OUTER_LINE_STYLE = {
        strokeStyle: this.IDLED_OUTER_STROKE_STYLE,
        lineWidth: this.OUTER_LINE_WIDTH,
        lineCap: "square"
    };
    this.IDLED_INNER_LINE_STYLE = {
        strokeStyle: this.IDLED_INNER_STROKE_STYLE,
        lineWidth: this.INNER_LINE_WIDTH,
        lineCap: "square"
    };
    this.HOVERED_OUTER_LINE_STYLE = {
        strokeStyle: this.HOVERED_OUTER_STROKE_STYLE,
        lineWidth: this.OUTER_LINE_WIDTH,
        lineCap: "square"
    };
    this.HOVERED_INNER_LINE_STYLE = {
        strokeStyle: this.HOVERED_INNER_STROKE_STYLE,
        lineWidth: this.INNER_LINE_WIDTH,
        lineCap: "square"
    };
    this.SELECTED_OUTER_LINE_STYLE = {
        strokeStyle: this.SELECTED_OUTER_STROKE_STYLE,
        lineWidth: this.OUTER_LINE_WIDTH,
        lineCap: "square"
    };
    this.SELECTED_INNER_LINE_STYLE = {
        strokeStyle: this.SELECTED_INNER_STROKE_STYLE,
        lineWidth: this.INNER_LINE_WIDTH,
        lineCap: "square"
    };
    this.IDLED_LINE_COLOR = "black";
    this.HOVERED_LINE_COLOR = "rgb(133, 52, 122)";
    this.SELECTED_LINE_COLOR = "rgb(178, 241, 130)";
    this.VERTEX_OUTER_RADIUS = 5;
    this.VERTEX_INNER_RADIUS = .6 * this.VERTEX_OUTER_RADIUS;
    this.IDLED_VERTEX_OUTER_FILL_STYLE = "rgba(0, 124, 189, .75)";
    this.IDLED_VERTEX_INNER_FILL_STYLE = "rgba(131, 211, 255, .9)";
    this.HOVERED_VERTEX_OUTER_FILL_STYLE = "rgba(133, 52, 122, .75)";
    this.HOVERED_VERTEX_INNER_FILL_STYLE = "rgba(255, 131, 247, .9)";
    this.SELECTED_VERTEX_OUTER_FILL_STYLE = "rgba(20, 119, 65, .9)";
    this.SELECTED_VERTEX_INNER_FILL_STYLE = "rgba(178, 241, 130, .75)";
    this.FIRST_VERTEX_SCALE = 2;
    this.X_WIDTH = this.X_HEIGHT = 10;
    this.X_STROKE_STYLE = "red";
    this.X_LINE_WIDTH = 2;
    this.__drawer = new Drawer
};
PolyDrawer.prototype.drawVertex = function (e, t, n, i, r, o, a) {
    var s = this.IDLED_VERTEX_OUTER_FILL_STYLE;
    var l = this.IDLED_VERTEX_INNER_FILL_STYLE;
    if (i || o) {
        s = this.HOVERED_VERTEX_OUTER_FILL_STYLE;
        l = this.HOVERED_VERTEX_INNER_FILL_STYLE
    }
    if (r || a) {
        s = this.SELECTED_VERTEX_OUTER_FILL_STYLE;
        l = this.SELECTED_VERTEX_INNER_FILL_STYLE
    }
    this.__drawer.context = e;
    this.__drawer.drawConcentricCircles(t, n, this.VERTEX_OUTER_RADIUS, this.VERTEX_INNER_RADIUS, {
        fillStyle: s
    }, {
        fillStyle: l
    })
};
PolyDrawer.prototype.drawFirstVertex = function (e, t, n) {
    this.drawVertex(e, t, n, false, true, false, false);
    return;
    this.__drawer.context = e;
    this.__drawer.drawConcentricCircles(t, n, this.VERTEX_OUTER_RADIUS * this.FIRST_VERTEX_SCALE, this.VERTEX_INNER_RADIUS * this.FIRST_VERTEX_SCALE, {
        fillStyle: this.SELECTED_VERTEX_OUTER_FILL_STYLE
    }, {
        fillStyle: this.SELECTED_VERTEX_INNER_FILL_STYLE
    })
};
PolyDrawer.prototype.drawLineSegment = function (e, t, n, i, r) {
    var o = this.IDLED_LINE_COLOR;
    var a = this.IDLED_OUTER_STROKE_STYLE;
    var s = this.IDLED_INNER_STROKE_STYLE;
    if (i) {
        o = this.HOVERED_LINE_COLOR
    }
    if (r) {
        o = this.SELECTED_LINE_COLOR
    }
    this.__drawer.context = e;
    this.__drawer.drawLineSegment(t, n, {
        strokeStyle: o,
        lineWidth: 1
    })
};
PolyDrawer.prototype.drawIntersection = function (e, t) {
    this.__drawer.context = e;
    this.__drawer.drawX(t.x, t.y, this.X_WIDTH, this.X_HEIGHT, {
        lineWidth: this.X_LINE_WIDTH,
        strokeStyle: this.X_STROKE_STYLE
    })
};
PolyDrawer.prototype.drawPoly = function (e, t, n, i, r, o) {
    this.__drawer.context = e;
    var a = this.IDLED_OUTER_LINE_STYLE;
    var s = this.IDLED_INNER_LINE_STYLE;
    if (n) {
        a = this.HOVERED_OUTER_LINE_STYLE;
        s = this.HOVERED_INNER_LINE_STYLE
    }
    if (i) {
        a = this.SELECTED_OUTER_LINE_STYLE;
        s = this.SELECTED_INNER_LINE_STYLE
    }
    this.__drawer.drawDoublePoly(t, a, s);
    this.drawVertices(e, t, n, i, r, o)
};
PolyDrawer.prototype.__drawLines = function (i, r, o, a) {
    $.each(r, function (e, t) {
            if (r.length > 1 && e != r.length - 1) {
                var n = r[e + 1];
                this.drawLineSegment(i, t, n, o, a)
            }
        }
        .bind(this));
    this.drawLineSegment(i, r[r.length - 1], r[0], o, a)
};
PolyDrawer.prototype.drawVertices = function (n, e, i, r, o, a) {
    $.each(e, function (e, t) {
            this.drawVertex(n, t.x, t.y, i, r, e == o, e == a)
        }
        .bind(this))
};
PolyDrawer.prototype.drawSlopeIntercept = function (e, t, n) {
    var i = {
        x: 0,
        y: t.b
    };
    var r = {
        x: 500,
        y: t.m * 500 + t.b
    };
    var o = ii.imageToCanvasCoords(i.x, i.y);
    var a = ii.imageToCanvasCoords(r.x, r.y);
    this.drawLineSegment(e, o, a, false, false)
};

var Tooltip = function () {
    $("body").append('<div id="tooltip"><div id="tooltip_inner"></div></div>');
    $("body").append('<div id="tooltip_arrow"></div>');
    this.hide();
    var e = "#FFF";
    this.BACKGROUND_COLOR = "rgba(17, 17, 17, .9)";
    this.TEXT_PADDING = 10;
    var t = this.TEXT_PADDING + "px";
    var n = "2px";
    this.TRIANGLE_WIDTH = "10px";
    var i = "solid 1px #333";
    this.makeDownArrow();
    $("#tooltip").css("max-width", "50%");
    $("#tooltip_inner").css("max-width", "500px");
    $("#tooltip_inner").css("display", "table-cell");
    $("#tooltip").css({
        position: "absolute",
        transform: "perspective(1px) translate(-50%, 0)"
    });
    $("#tooltip_arrow").css({
        position: "absolute",
        transform: "perspective(1px) translate(0, -50%)"
    });
    $("#tooltip").css("color", e);
    $("#tooltip").css("background-color", this.BACKGROUND_COLOR);
    $("#tooltip").css("padding", t);
    $("#tooltip").css("border-radius", n);
    $("#tooltip").css("box-shadow", "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)");
    $("#tooltip").css("z-index", "1000002");
    $("#tooltip_arrow").css("z-index", "1000002")
};
Tooltip.prototype.makeRightArrow = function (e, t, n) {
    $("#tooltip_arrow").css("width", "0");
    $("#tooltip_arrow").css("height", "0");
    $("#tooltip_arrow").css("border-bottom", this.TRIANGLE_WIDTH + " solid transparent");
    $("#tooltip_arrow").css("border-top", this.TRIANGLE_WIDTH + " solid transparent");
    $("#tooltip_arrow").css("border-left", this.TRIANGLE_WIDTH + " solid " + this.BACKGROUND_COLOR);
    $("#tooltip_arrow").css("border-right", "")
};
Tooltip.prototype.makeUpArrow = function (e, t, n) {
    $("#tooltip_arrow").css("width", "0");
    $("#tooltip_arrow").css("height", "0");
    $("#tooltip_arrow").css("border-left", this.TRIANGLE_WIDTH + " solid transparent");
    $("#tooltip_arrow").css("border-right", this.TRIANGLE_WIDTH + " solid transparent");
    $("#tooltip_arrow").css("border-top", this.TRIANGLE_WIDTH + " solid " + this.BACKGROUND_COLOR);
    $("#tooltip_arrow").css("border-bottom", "")
};
Tooltip.prototype.makeDownArrow = function (e, t, n) {
    $("#tooltip_arrow").css("width", "0");
    $("#tooltip_arrow").css("height", "0");
    $("#tooltip_arrow").css("border-left", this.TRIANGLE_WIDTH + " solid transparent");
    $("#tooltip_arrow").css("border-right", this.TRIANGLE_WIDTH + " solid transparent");
    $("#tooltip_arrow").css("border-bottom", this.TRIANGLE_WIDTH + " solid " + this.BACKGROUND_COLOR);
    $("#tooltip_arrow").css("border-top", "")
};
Tooltip.prototype.show = function (c, f, e, t) {
    $("#tooltip_arrow").show();
    e = e.replace("background-color: rgb(255, 255, 255);", "");
    var h = 10;
    if (t == "right") {
        var n = $("#tooltip").outerWidth();
        this.makeRightArrow();
        $("#tooltip_inner").html(e);
        $("#tooltip_arrow").css({
            position: "absolute",
            left: c,
            top: f,
            transform: "perspective(1px) translate(0, -50%)"
        });
        $("#tooltip").css({
            position: "absolute",
            left: c - n,
            top: f,
            transform: "perspective(1px) translate(0, -50%)"
        });
        $("#tooltip").show()
    } else {
        $("#tooltip").css({
            position: "absolute",
            left: 0,
            width: "500px",
            top: f,
            transform: "perspective(1px) translate(-50%, 0)"
        });
        $("#tooltip").show().promise().done(function () {
                $("#tooltip_inner").html(e).promise().done(function () {
                        var e = $("#tooltip_inner").outerWidth() + this.TEXT_PADDING * 2;
                        var t = c - e / 2;
                        var n = c + e / 2;
                        var i = $(window).scrollLeft() + $(window).width();
                        var r = $("#tooltip").outerHeight();
                        var o = f + h + +r;
                        var a = $(window).scrollTop() + $(window).height();
                        var s = f;
                        var l = 1;
                        if (o > a) {
                            this.makeUpArrow();
                            f -= r;
                            s -= 3 * h;
                            h *= -3;
                            l *= -1
                        } else {
                            this.makeDownArrow()
                        }
                        var u;
                        if (t < 0 && n > i) {} else if (t < 0) {
                            u = c - t
                        } else if (n > i) {
                            u = c - (n - i)
                        } else {
                            u = c
                        }
                        $("#tooltip_arrow").css({
                            position: "absolute",
                            left: c,
                            top: s + l,
                            transform: "perspective(1px) translate(-50%, 0)"
                        });
                        $("#tooltip").css({
                            position: "absolute",
                            left: u,
                            top: f + h,
                            width: e - this.TEXT_PADDING * 2 + "px"
                        })
                    }
                    .bind(this))
            }
            .bind(this))
    }
};
Tooltip.prototype.hide = function () {
    $("#tooltip").hide();
    $("#tooltip_arrow").hide()
};

var Tool = function (e, t, n, i, r) {
    this.name = e;
    this.selector = t;
    this.annotator = n;
    this.interactiveImage = i;
    this.hotkey = r
};
Tool.prototype.activate = function () {
    $(this).trigger("change")
};
Tool.prototype.deactivate = function () {
    $(this).trigger("change")
};
Tool.prototype.draw = function (e) {};
Tool.prototype.onMouseOut = function (e) {};
Tool.prototype.onCanvasDblClick = function (e) {};
Tool.prototype.onCanvasMouseDown = function (e) {};
Tool.prototype.onDocumentMouseUp = function (e) {};
Tool.prototype.onImageMouseMove = function (e, t) {};
Tool.prototype.onDocumentKeyPress = function (e, t) {};
var Toolbox = function (e) {
    this.interactiveImage = e;
    this.canvas = this.interactiveImage.canvas;
    this.context = this.canvas.getContext("2d");
    this.activeTool = null;
    this.tools = {};
    this.hotkeys = {
        99: "c",
        67: "c",
        68: "d",
        98: "b",
        66: "b",
        114: "r",
        82: "r",
        118: "v",
        86: "v"
    };
    this.tooltip = new Tooltip;
    e.addToolbox(this);
    $("body").mouseout(this.__onMouseOut.bind(this));
    $(document).on("mousemove", this.__onDocumentMouseMove.bind(this));
    $(this.interactiveImage.canvas).on("mousedown", this.__onCanvasMouseDown.bind(this));
    $(document).on("mouseup", this.__onDocumentMouseUp.bind(this));
    $(this.interactiveImage.canvas).on("dblclick", this.__onCanvasDblClick.bind(this));
    $(document).on("keydown", this.__onDocumentKeyDown.bind(this));
    $(document).on("keypress", this.__onDocumentKeyPress.bind(this))
};
Toolbox.prototype.draw = function (n) {
    $.each(this.tools, function (e, t) {
            if (t != this.activeTool)
                return true;
            t.draw(n, null, this.interactiveImage)
        }
        .bind(this))
};
Toolbox.prototype.addTool = function (e) {
    this.tools[e.name] = e;
    if (!this.activeTool)
        this.selectTool(e.name);
    var t = $(this.tools[e.name].selector);
    t.on("click", this.toolSelectorClick.bind(this));
    t.hover(this.showToolTip.bind(this), this.hideToolTip.bind(this));
    $(e).on("change", this.__onToolChange.bind(this))
};
Toolbox.prototype.showToolTip = function (e) {
    var t = $(e.target).position().left;
    var n = $(e.target).position().top;
    var i = $(e.target).width();
    var r = $(e.target).height();
    var o = "#" + e.target.id;
    var a = null;
    $.each(this.tools, function (e, t) {
        if (t.selector == o)
            a = t
    });
    var s = a.name;
    if (s == "DOT")
        s = "POINT";
    s = s.toLowerCase();
    s = s.charAt(0).toUpperCase() + s.slice(1);
    hotkey = this.hotkeys[a.hotkey[0]];
    this.tooltip.show(t + i / 2, n + r, "<b>" + s + "</b> (" + hotkey + ")")
};
Toolbox.prototype.hideToolTip = function (e) {
    this.tooltip.hide()
};
Toolbox.prototype.getTool = function (e) {
    return this.tools[e]
};
Toolbox.prototype.__onToolChange = function (e) {
    $(this).triggerHandler("change")
};
Toolbox.prototype.selectTool = function (e) {
    if (this.activeTool) {
        $(this.activeTool.selector).removeClass("selected");
        this.activeTool.deactivate()
    }
    this.activeTool = this.tools[e];
    $(this.activeTool.selector).addClass("selected");
    this.activeTool.activate()
};
Toolbox.prototype.toolSelectorClick = function (e) {
    var n = "#" + e.target.id;
    var i = null;
    $.each(this.tools, function (e, t) {
        if (t.selector == n)
            i = t
    });
    this.selectTool(i.name)
};
Toolbox.prototype.release = function () {
    $.each(this.tools, function (e, t) {
            var n = $(this.tools[t.name].selector);
            n.off("click")
        }
        .bind(this))
};
Toolbox.prototype.__onMouseOut = function (n) {
    if (n.toElement != null || n.relatedTarget != null)
        return;
    $.each(this.tools, function (e, t) {
            if (t != this.activeTool)
                return true;
            t.onMouseOut(n)
        }
        .bind(this))
};
Toolbox.prototype.__onDocumentKeyDown = function (e) {
    this.__onDocumentKeyPress(e)
};
Toolbox.prototype.__onDocumentKeyPress = function (n) {
    if (document.activeElement != document.body)
        return;
    $.each(this.tools, function (e, t) {
            if (t.hotkey.includes(n.keyCode)) {
                this.selectTool(t.name);
                return false
            }
            if (t != this.activeTool)
                return true;
            t.onDocumentKeyPress(n)
        }
        .bind(this))
};
Toolbox.prototype.__onDocumentMouseMove = function (e) {
    var n = this.interactiveImage.pageToImageCoords(e.pageX, e.pageY);
    var i = this.interactiveImage.getSize();
    $.each(this.tools, function (e, t) {
            if (t != this.activeTool)
                return true;
            t.onImageMouseMove(new Vector(n.x, n.y), i, this.interactiveImage)
        }
        .bind(this))
};
Toolbox.prototype.__onCanvasMouseDown = function (n) {
    var i = this.interactiveImage.pageToImageCoords(n.pageX, n.pageY);
    $.each(this.tools, function (e, t) {
            if (t != this.activeTool)
                return true;
            t.onCanvasMouseDown(n, new Vector(i.x, i.y))
        }
        .bind(this))
};
Toolbox.prototype.__onDocumentMouseUp = function (e) {
    var n = this.interactiveImage.pageToImageCoords(e.pageX, e.pageY);
    $.each(this.tools, function (e, t) {
            if (t != this.activeTool)
                return true;
            t.onDocumentMouseUp(new Vector(n.x, n.y))
        }
        .bind(this))
};
Toolbox.prototype.__onCanvasDblClick = function (e) {
    var n = this.interactiveImage.pageToImageCoords(e.pageX, e.pageY);
    $.each(this.tools, function (e, t) {
            if (t != this.activeTool)
                return true;
            t.onCanvasDblClick(n)
        }
        .bind(this))
};
var ii;
var SelectTool = function (e, t, n, i) {
    ii = i;
    Tool.call(this, e, t, n, i, [118, 86]);
    this.hoveredAnnotation = null;
    this.selectedAnnotation = null;
    this.selectedBBDrawer = new SelectedBBDrawer;
    this.__deleteIsHovered = false;
    this.__isDragging = false;
    // shortcut.add("Ctrl+Shift+A", function () {
    //         if (this.selectedAnnotation)
    //             this.__deselectAnnotation(this.selectedAnnotation);
    //         this.selectedAnnotation = null
    //     }
    //     .bind(this))
};
SelectTool.prototype = Object.create(Tool.prototype);
SelectTool.prototype.constructor = Tool;
SelectTool.prototype.deactivate = function () {
    if (this.selectedAnnotation)
        this.__deselectAnnotation(this.selectedAnnotation);
    if (this.hoveredAnnotation)
        this.hoveredAnnotation.dehover();
    this.selectedAnnotation = null;
    this.hoveredAnnotation = null;
    this.__deleteIsHovered = false;
    this.__isDragging = false;
    Tool.prototype.deactivate.call(this)
};
SelectTool.prototype.onDocumentKeyPress = function (e) {
    if (e.keyCode == 127 || e.keyCode == 46) {
        if (this.selectedAnnotation) {
            var t = this.selectedAnnotation;
            this.__deselectAnnotation(this.selectedAnnotation);
            this.annotator.deleteAnnotation(t);
            this.hoveredAnnotation = null;
            $("body").css("cursor", "default")
        }
    }
};
SelectTool.prototype.draw = function (e) {
    $("body").css("cursor", "default");
    if (this.hoveredAnnotation || this.__isDragging)
        $("body").css("cursor", "move");
    if (this.selectedAnnotation) {
        var t = this.selectedAnnotation.getBB();
        var n = this.interactiveImage.imageToCanvasCoords(t.x, t.y);
        t.x = n.x;
        t.y = n.y;
        this.selectedBBDrawer.drawBB(e, t, this.__deleteIsHovered)
    }
    if (this.__deleteIsHovered) {
        $("body").css("cursor", "pointer")
    }
};
SelectTool.prototype.__hoverAnnotation = function (e) {
    if (this.hoveredAnnotation == e)
        return;
    this.hoveredAnnotation = e;
    e.hover();
    $(this).trigger("change");
    console.log("SelectTool.__hoverAnnotation")
};
SelectTool.prototype.__dehoverAnnotation = function (e) {
    if (!e.isHovered || !this.hoveredAnnotation)
        return;
    this.hoveredAnnotation = null;
    e.dehover();
    $(this).trigger("change");
    console.log("SelectTool.__dehoverAnnotation")
};
SelectTool.prototype.__selectAnnotation = function (e) {
    if (this.selectedAnnotation == e)
        return;
    if (this.selectedAnnotation)
        this.__deselectAnnotation(this.selectedAnnotation, true);
    this.selectedAnnotation = e;
    e.select();
    this.annotator.deleteAnnotation(e);
    this.annotator.addAnnotation(e, true);
    $(this).trigger("change");
    $(this).trigger("ACTIVE_ANNOTATION_CHANGE", e);
    console.log("__selectAnnotation")
};
SelectTool.prototype.__deselectAnnotation = function (e, t) {
    if (!e || !e.isSelected)
        return;
    console.log("SelectTool.__deselectAnnotation");
    e.deselect();
    this.selectedAnnotation = null;
    $(this).trigger("change");
    if (!t)
        $(this).trigger("ACTIVE_ANNOTATION_CHANGE", false)
};
SelectTool.prototype.__startAnnotationDrag = function (e) {
    var t = this.__isDragging;
    e.startDrag();
    this.__isDragging = true;
    if (this.__isDragging != t)
        $(this).trigger("change");
    console.log("SelectTool.__startAnnotationDrag")
};
SelectTool.prototype.__handleAnnotationDrag = function (e, t, n, i) {
    if (this.__isDragging) {
        var r = _.clamp(e.x, 0, n.width);
        var o = _.clamp(e.y, 0, n.height);
        var a = e.x - t.x;
        var s = e.y - t.y;
        if (this.selectedAnnotation.type == "DOT" || this.selectedAnnotation.type == "CIRCLE") {
            this.selectedAnnotation.addPosition(a, s)
        } else {
            this.selectedAnnotation.addPosition(a, s)
        }
        $(this).triggerHandler("change");
        console.log("__handleAnnotationDrag")
    }
};
SelectTool.prototype.onCanvasMouseDown = function (e, t) {
    var n = false;
    var i = null;
    var r = this.selectedAnnotation;
    var o;
    $.each(this.annotator.annotations, function (e, t) {
            if (!t)
                return;
            if (this.__deleteIsHovered) {
                o = r;
                this.__deselectAnnotation(r)
            } else {
                if (!i && t == this.hoveredAnnotation) {
                    this.__selectAnnotation(t);
                    i = t;
                    this.__startAnnotationDrag(t);
                    n = true
                } else {
                    if (i != t)
                        this.__deselectAnnotation(t)
                }
            }
        }
        .bind(this));
    if (o) {
        this.annotator.deleteAnnotation(o);
        $("body").css("cursor", "default")
    }
    this.selectedAnnotation = i;
    $(this).trigger("change");
    console.log("MOUSEDOWN");
    if (n)
        e.stopImmediatePropagation()
};
SelectTool.prototype.onImageMouseMove = function (n, e, t) {
    if (!this.oldImageMousePos) {
        this.oldImageMousePos = {
            x: 0,
            y: 0
        }
    }
    var i = null;
    if (!this.__isDragging) {
        var r = _.clone(this.annotator.annotations);
        r.reverse();
        $.each(r, function (e, t) {
                if (t.pointWithinObj(n)) {
                    i = t
                } else {
                    this.__dehoverAnnotation(t)
                }
            }
            .bind(this));
        if (i) {
            this.__hoverAnnotation(i)
        }
    }
    var o = this.__deleteIsHovered;
    this.__deleteIsHovered = this.__checkIfDeleteIsHovered(n);
    if (o != this.__deleteIsHovered) {
        $(this).trigger("change");
        console.log("culprit")
    }
    this.__handleAnnotationDrag(n, this.oldImageMousePos, e, t);
    this.oldImageMousePos = n
};
SelectTool.prototype.onDocumentMouseUp = function (e) {
    this.__isDragging = false
};
SelectTool.prototype.__checkIfDeleteIsHovered = function (e) {
    if (this.selectedAnnotation == null)
        return false;
    var t = this.selectedAnnotation.getBB();
    var n = this.selectedBBDrawer.getDeleteButtonPos(t);
    if (e.vectorWithinDist(n, this.selectedBBDrawer.DELETE_RADIUS)) {
        return true
    } else {
        return false
    }
};
var DotTool = function (e, t, n, i) {
    Tool.call(this, e, t, n, i, [68]);
    this.imageX = null;
    this.imageY = null;
    this.__pointDrawer = new PointDrawer
};
DotTool.prototype = Object.create(Tool.prototype);
DotTool.prototype.constructor = Tool;
DotTool.prototype.draw = function (e) {
    $("body").css("cursor", "crosshair");
    if (this.imageX != null) {
        var t = this.interactiveImage.imageToCanvasCoords(this.imageX, this.imageY);
        this.__pointDrawer.drawPoint(e, t.x, t.y, false, true)
    }
};
DotTool.prototype.onImageMouseMove = function (e, t) {
    this.imageX = e.x;
    this.imageY = e.y;
    $(this).trigger("change")
};
DotTool.prototype.onCanvasMouseDown = function (e, t) {
    e.stopImmediatePropagation();
    var n = new PointAnnotation(t.x, t.y, "");
    this.annotator.addAnnotation(n)
};
var DEBUG_DRAW;
var DEBUG_CONTEXT;
var DEBUG_TRANSFORM_FUNCTION;
var DEBUG_DRAWER;
var POLY_TOOL_DEBUG = false;
var transformFunction;
var PolyTool = function (e, t, n, i) {
    DEBUG_DRAW = true;
    DEBUG_CONTEXT = i.context;
    DEBUG_DRAWER = new Drawer(DEBUG_CONTEXT);
    this.transformFunction = function (e) {
        var t = i.imageToCanvasCoords(e.x, e.y);
        return new Vector2(t.x, t.y)
    };
    DEBUG_TRANSFORM_FUNCTION = transformFunction;
    Tool.call(this, e, t, n, i, [98, 66]);
    this.pointRadius = 5;
    this.snapRadius = 30;
    polyResetVars(this);
    this.__polyDrawer = new PolyDrawer;
    this.__drawer = new Drawer
};

function polyResetVars(e) {
    e.draggedPoint = null;
    e.draggedAnnotation = null;
    e.isDrawing = false;
    e.isColliding = false;
    e.lastPoint = null;
    e.isSnapped = false;
    e.snapPoint = null;
    e.activeShape = null;
    e.currentPoly = [];
    e.shapes = [];
    e.hoverShapes = [];
    e.canReleaseDrag = true;
    e.__pointsBeingDrawn = []
}
PolyTool.prototype = Object.create(Tool.prototype);
PolyTool.prototype.constructor = Tool;
PolyTool.prototype.deactivate = function () {
    polyResetVars(this);
    $(this).trigger("change")
};
PolyTool.prototype.addShape = function (e) {
    var t = new PolyAnnotation(e, "");
    this.annotator.addAnnotation(t)
};
PolyTool.prototype.draw = function (i, e, o) {
    console.log("PolyTool draw");
    $("body").css("cursor", "crosshair");
    if (this.hoveredPoint != null || this.draggedPoint != null) {
        $("body").css("cursor", "move");
        return
    }
    if (!this.isDrawing && this.draggedPoint == null) {
        var e = o.imageToCanvasCoords(this.imageMouseX, this.imageMouseY);
        this.__polyDrawer.drawFirstVertex(i, e.x, e.y, "black")
    }
    this.isColliding = false;
    var t = _.clone(this.__pointsBeingDrawn);
    if (this.isDrawing) {
        var n = this.__pointsBeingDrawn[this.__pointsBeingDrawn.length - 1];
        var r = new Vector2(this.imageMouseX, this.imageMouseY);
        var a = this.__pointsBeingDrawn[0];
        var s = this.__attemptSnapPoint(r, a, this.snapRadius);
        this.isSnapped = false;
        if (_.isEqual(s, a)) {
            this.isSnapped = true;
            this.snapPoint = a
        }
        var l = new LineSegment(n, s);
        var u = this.__calculateLinesFromPoints(this.__pointsBeingDrawn);
        var c = this.__calculateIntersectionsOfLineWithLines(l, u);
        var f = [a, n];
        var h = .1;
        c = this.__cleanPointsWithinDistance(c, f, h);
        if (c.length > 0) {
            this.isColliding = true
        }
        var d = "black";
        if (this.isColliding)
            d = "red";
        t.push(s)
    }
    this.__drawLinesBetweenPoints(i, t, this.transformFunction);
    if (this.isDrawing) {
        $.each(c, function (e, t) {
                this.__polyDrawer.drawIntersection(i, this.transformFunction(t))
            }
            .bind(this))
    }
    $.each(this.currentPoly, function (e, t) {
            var n = o.imageToCanvasCoords(t.x, t.y);
            if (this.currentPoly.length > 1 && e != this.currentPoly.length - 1) {
                var i = this.currentPoly[e + 1];
                var r = o.imageToCanvasCoords(i.x, i.y)
            }
        }
        .bind(this));
    $.each(this.currentPoly, function (e, t) {
            var n = o.imageToCanvasCoords(t.x, t.y);
            if (e == 0) {
                this.__polyDrawer.drawFirstVertex(i, n.x, n.y)
            } else {
                this.__polyDrawer.drawVertex(i, n.x, n.y, false, true)
            }
        }
        .bind(this))
};
PolyTool.prototype.__checkPointsHover = function (i) {
    var r = null;
    var o = null;
    $.each(this.annotator.annotations, function (e, n) {
            if (n.type == "POLY") {
                n.setHoveredPoint(null);
                $.each(n.polygon.points, function (e, t) {
                        if (t.vectorIsWithinDist(i, this.__polyDrawer.VERTEX_OUTER_RADIUS * 2)) {
                            r = t;
                            o = n
                        }
                    }
                    .bind(this))
            }
        }
        .bind(this));
    this.hoveredPoint = r;
    this.hoveredAnnotation = o;
    if (this.hoveredAnnotation)
        this.hoveredAnnotation.setHoveredPoint(this.hoveredPoint)
};
PolyTool.prototype.drawIntersections = function (n, e) {
    $.each(e, function (e, t) {
            this.__polyDrawer.drawIntersection(n, this.transformFunction(t))
        }
        .bind(this))
};
PolyTool.prototype.__checkIfDragAllowed = function () {
    if (this.draggedAnnotation == null || this.draggedPoint == null)
        return;
    this.canReleaseDrag = true;
    var l = this.draggedAnnotation.polygon.calculateLines(this.draggedAnnotation.polygon.points);
    $.each(this.draggedAnnotation.polygon.points, function (e, t) {
            if (t.x == this.draggedPoint.x && t.y == this.draggedPoint.y) {
                if (e == 0) {
                    var n = [t, this.draggedAnnotation.polygon.points[e + 1]];
                    var i = [t, this.draggedAnnotation.polygon.points[this.draggedAnnotation.polygon.points.length - 1]]
                } else if (e == this.draggedAnnotation.polygon.points.length - 1) {
                    var n = [t, this.draggedAnnotation.polygon.points[0]];
                    var i = [t, this.draggedAnnotation.polygon.points[e - 1]]
                } else {
                    var n = [t, this.draggedAnnotation.polygon.points[e - 1]];
                    var i = [t, this.draggedAnnotation.polygon.points[e + 1]]
                }
                n = new LineSegment(n[0], n[1]);
                i = new LineSegment(i[0], i[1]);
                var r = this.__calculateIntersectionsOfLineWithLines(n, l);
                var o = this.__calculateIntersectionsOfLineWithLines(i, l);
                var a = [n.startPoint, n.endPoint, i.startPoint, i.endPoint];
                var s = .1;
                r = this.__cleanPointsWithinDistance(r, a, s);
                o = this.__cleanPointsWithinDistance(o, a, s);
                if (r.length > 0 || o.length > 0)
                    this.canReleaseDrag = false;
                this.drawIntersections(this.interactiveImage.context, r);
                this.drawIntersections(this.interactiveImage.context, o)
            }
        }
        .bind(this))
};
PolyTool.prototype.onImageMouseMove = function (e, t) {
    this.imageMouseX = e.x;
    this.imageMouseY = e.y;
    if (!this.isDrawing) {
        this.__checkPointsHover(e)
    }
    if (this.draggedPoint != null) {
        this.draggedPoint.x = this.imageMouseX;
        this.draggedPoint.y = this.imageMouseY
    }
    $(this).trigger("change");
    if (this.draggedPoint != null) {
        this.__checkIfDragAllowed()
    }
};
PolyTool.prototype.onDocumentKeyPress = function (e) {
    if (e.keyCode == 127 || e.keyCode == 27) {
        this.stopDraw(true)
    }
};
PolyTool.prototype.stopDraw = function (e) {
    this.__pointsBeingDrawn = [];
    this.isSnapped = false;
    this.snapPoint = null;
    this.isDrawing = false;
    this.isColliding = false;
    this.lastPoint = null;
    if (!e) {
        this.addShape(this.currentPoly)
    }
    this.currentPoly = [];
    $(this).trigger("change")
};
PolyTool.prototype.__attemptSnapPoint = function (e, t, n) {
    if (this.__pointsBeingDrawn.length <= 2)
        return e;
    if (e.vectorIsWithinDist(t, n)) {
        return t
    } else {
        return e
    }
};

function pointsWithinDist(e, t, n) {
    var i = t.x - e.x;
    var r = t.y - e.y;
    return i * i + r * r <= n * n
}
PolyTool.prototype.onDocumentMouseUp = function (e, t) {
    if (this.canReleaseDrag) {
        if (this.draggedPoint && this.draggedAnnotation) {
            this.draggedAnnotation.setDraggedPoint(null)
        }
        this.draggedPoint = null;
        this.draggedAnnotation = null
    }
};
PolyTool.prototype.onCanvasMouseDown = function (e, t) {
    if (this.draggedPoint != null)
        return;
    e.stopImmediatePropagation();
    if (this.isColliding)
        return;
    if (this.hoveredPoint != null) {
        this.draggedPoint = this.hoveredPoint;
        this.draggedAnnotation = this.hoveredAnnotation;
        this.draggedAnnotation.setDraggedPoint(this.draggedPoint);
        e.stopImmediatePropagation();
        return
    }
    if (!this.isDrawing && !this.hoveredPoint) {
        if (this.hoverShapes.length > 0) {
            this.activeShape = this.hoverShapes[0];
            $(this).trigger("change");
            return
        } else {
            this.isDrawing = true
        }
    }
    this.activeShape = null;
    if (this.isSnapped) {
        t = this.snapPoint;
        this.stopDraw();
        return
    }
    this.__startDraw(t.x, t.y);
    this.currentPoly.push(t);
    this.lastPoint = {
        x: t.x,
        y: t.y
    };
    $(this).trigger("change")
};
PolyTool.prototype.__startDraw = function (e, t) {
    var n = new Vector2(e, t);
    this.__pointsBeingDrawn.push(n)
};
PolyTool.prototype.__calculateLinesFromPoints = function (a) {
    var s = [];
    $.each(a, function (e, t) {
            var n = a.length > 1;
            var i = e == a.length - 1;
            if (n && !i) {
                var r = this.__pointsBeingDrawn[e + 1];
                var o = new LineSegment(t, r);
                s.push(o)
            }
        }
        .bind(this));
    return s
};
PolyTool.prototype.__drawLinesBetweenPoints = function (o, a, s) {
    var e = "rgba(20, 119, 65, 1)";
    var t = "rgba(178, 241, 130, 1)";
    var n = [];
    $.each(a, function (e, t) {
        if (s)
            t = s(t);
        n.push(t)
    });
    this.__drawer.context = o;
    this.__drawer.drawDoubleConnectedPoints(n, {
        lineWidth: 3,
        strokeStyle: e
    }, {
        lineWidth: 1,
        strokeStyle: t
    });
    return;
    $.each(a, function (e, t) {
            if (s)
                t = s(t);
            console.log("lorem", s);
            var n = a.length > 1;
            var i = e == a.length - 1;
            if (n && !i) {
                var r = this.__pointsBeingDrawn[e + 1];
                if (s)
                    r = s(r);
                this.__polyDrawer.drawLineSegment(o, t, r, false, true)
            }
        }
        .bind(this))
};
PolyTool.prototype.__calculateIntersectionsOfLineWithLines = function (i, e) {
    var r = [];
    $.each(e, function (e, t) {
            var n = i.calculateIntersectionWithLineSegment(t);
            if (n)
                r.push(n)
        }
        .bind(this));
    return r
};
PolyTool.prototype.__cleanPointsWithinDistance = function (e, t, r) {
    var o = [];
    $.each(e, function (e, n) {
        var i = false;
        $.each(t, function (e, t) {
            if (n.vectorIsWithinDist(t, r)) {
                i = true;
                return false
            }
        });
        if (!i)
            o.push(n)
    });
    return o
};
var RectTool = function (e, t, n, i) {
    Tool.call(this, e, t, n, i, [114, 82]);
    this.imageMousePos = null;
    this.startRectPos = null;
    this.__polyDrawer = new PolyDrawer
};
RectTool.prototype = Object.create(Tool.prototype);
RectTool.prototype.constructor = Tool;
RectTool.prototype.draw = function (e, t, i) {
    $("body").css("cursor", "crosshair");
    if (this.startRectPos != null) {
        if (this.imageMousePos != null) {
            var n = this.getPoly();
            var r = [];
            $.each(n, function (e, t) {
                var n = i.imageToCanvasCoords(t.x, t.y);
                r.push(new Vector(n.x, n.y))
            });
            this.__polyDrawer.drawPoly(e, r, false, true)
        }
    }
};
RectTool.prototype.getPoly = function () {
    var e = this.imageMousePos.x - this.startRectPos.x;
    var t = this.imageMousePos.y - this.startRectPos.y;
    var n = [];
    n.push(new Vector(this.startRectPos.x, this.startRectPos.y));
    n.push(new Vector(this.startRectPos.x, this.startRectPos.y + t));
    n.push(new Vector(this.startRectPos.x + e, this.startRectPos.y + t));
    n.push(new Vector(this.startRectPos.x + e, this.startRectPos.y));
    return n
};
RectTool.prototype.onImageMouseMove = function (e, t) {
    this.imageMousePos = e;
    if (this.startRectPos != null)
        $(this).trigger("change")
};
RectTool.prototype.onCanvasMouseDown = function (e, t) {
    e.stopImmediatePropagation();
    this.startRectPos = t
};
RectTool.prototype.deactivate = function () {
    this.stopDraw()
};
RectTool.prototype.stopDraw = function () {
    if (this.startRectPos == null || this.imageMousePos == null)
        return;
    this.startRectPos = null;
    this.imageMousePos = null;
    $(this).trigger("change")
};
RectTool.prototype.onDocumentKeyPress = function (e) {
    if (e.keyCode == 127 || e.keyCode == 27) {
        this.stopDraw()
    }
};
RectTool.prototype.onDocumentMouseUp = function (e, t) {
    if (this.startRectPos == null || this.imageMousePos == null)
        return;
    var n = this.getPoly();
    var i = new PolyAnnotation(n, "");
    this.annotator.addAnnotation(i);
    this.startRectPos = null;
    this.imageMousePos = null;
    $(this).trigger("change")
};
var CircleTool = function (e, t, n, i) {
    Tool.call(this, e, t, n, i, [99, 67]);
    this.isDrawing = false;
    this.imageX = null;
    this.imageY = null;
    this.startDrawX = null;
    this.startDrawY = null;
    this.__drawer = new Drawer;
    this.__pointDrawer = new PointDrawer;
    this.SELECTED_STROKE_STYLE = "rgb(178, 241, 130)"
};
CircleTool.prototype = Object.create(Tool.prototype);
CircleTool.prototype.constructor = Tool;
CircleTool.prototype.draw = function (e) {
    $("body").css("cursor", "crosshair");
    var t = this.interactiveImage.imageToCanvasCoords(this.imageX, this.imageY);
    if (this.isDrawing) {
        var n = this.interactiveImage.imageToCanvasCoords(this.startDrawX, this.startDrawY);
        var i = new Vector2(n.x, n.y);
        var r = new Vector2(t.x, t.y);
        var o = i.distance(r);
        var a = r.subtract(i);
        this.__drawer.context = this.interactiveImage.context;
        this.__drawer.drawLineSegment(i, r, {
            strokeStyle: this.SELECTED_STROKE_STYLE,
            lineWidth: 3
        });
        var s = "rgba(20, 119, 65, 1)";
        var l = "rgba(178, 241, 130, 1)";
        this.__drawer.drawDoubleCircle(t.x - a.x, t.y - a.y, o, {
            strokeStyle: s,
            lineWidth: 3
        }, {
            strokeStyle: l,
            lineWidth: 1
        });
        this.__pointDrawer.drawPointScaled(e, i.x, i.y, false, true, .75);
        this.__pointDrawer.drawPointScaled(e, t.x, t.y, false, true, .75)
    } else {
        if (this.imageX != null) {}
    }
};
CircleTool.prototype.deactivate = function () {
    this.stopDraw()
};
CircleTool.prototype.stopDraw = function () {
    if (this.startDrawX == null)
        return;
    this.startDrawX = null;
    this.startDrawY = null;
    this.isDrawing = false;
    $(this).trigger("change")
};
CircleTool.prototype.onDocumentKeyPress = function (e) {
    if (e.keyCode == 127 || e.keyCode == 27) {
        this.stopDraw()
    }
};
CircleTool.prototype.onImageMouseMove = function (e, t) {
    this.imageX = e.x;
    this.imageY = e.y;
    if (this.isDrawing)
        $(this).trigger("change")
};
CircleTool.prototype.onCanvasMouseDown = function (e, t) {
    this.startDrawX = t.x;
    this.startDrawY = t.y;
    this.isDrawing = true;
    e.stopImmediatePropagation()
};
CircleTool.prototype.onDocumentMouseUp = function (e, t) {
    if (this.startDrawX == null)
        return;
    var n = new Vector2(this.startDrawX, this.startDrawY);
    var i = new Vector2(this.imageX, this.imageY);
    var r = n.distance(i);
    var o = new CircleAnnotation(n.x, n.y, r, "");
    this.annotator.addAnnotation(o);
    this.startDrawX = null;
    this.startDrawY = null;
    this.isDrawing = false;
    $(this).trigger("change")
};

var CanvasView = function () {
    this.__init()
};
CanvasView.prototype.__init = function () {
    this.DELETE_KEYCODE = 46;
    this.CANVAS_ID = "canvas"
};
CanvasView.prototype.showLoading = function (e) {
    $("#canvas_area").html("");
    var t = "";
    t += '<img src="./img/loading.svg" />';
    $("#work_area").html(t)
};
CanvasView.prototype.showUploadWidget = function (e) {
    $("#canvas_area").html("");
    var t = "";
    t += '<div id="upload_text">';
    t += "<span>Upload a new image:&nbsp;</span>";
    t += '<input id="image_upload" type="file" name="image_file" accept="image/*" />';
    t += "</div>";
    $("#work_area").html(t);
    $("#image_upload").attr("data-url", e);
    $("#image_upload").fileupload({
        dataType: "json",
        add: function (e, t) {
                $(this).trigger("IMAGE_UPLOAD_STARTED", t)
            }
            .bind(this),
        done: function (e, t) {
                console.log(e, t);
                $(this).trigger("IMAGE_UPLOAD_DONE", t)
            }
            .bind(this),
        error: function (e, t, n) {
            console.log(e);
            console.log(t);
            console.log(n);
            console.log("c", e.responseText);
            document.write(e.responseText)
        }
    })
};
CanvasView.prototype.createCanvas = function () {
    $("#work_area").html("");
    $("#canvas_area").html('<canvas id="' + this.CANVAS_ID + '"></canvas>');
    $("#canvas").hide();
    var e = $("#" + this.CANVAS_ID)[0];
    this.context = e.getContext("2d");
    this.createListeners()
};
CanvasView.prototype.createListeners = function () {
    var u = this;
    $("#" + this.CANVAS_ID).on("mousedown touchstart", function (e) {
            $(this).trigger("CANVAS_MOUSE_DOWN", e);
            if (e.type == "touchstart") {
                var t = e.timeStamp;
                var n = $(this).data("lastTouch") || t;
                var i = t - n;
                var r = e.originalEvent.touches.length;
                $(this).data("lastTouch", t);
                var o = e.originalEvent.touches[0];
                var a = new Vector(o.screenX, o.screenY);
                var s = $(this).data("lastTouchCoords");
                $(this).data("lastTouchCoords", a);
                if (!i || i > 500 || r > 1) {
                    return
                }
                if (s) {
                    var l = a.distanceSquared(s);
                    console.log(l);
                    if (l > 125 * 125)
                        return
                }
                e.preventDefault();
                $(e.target).trigger("click");
                $(u).trigger("CANVAS_DOUBLE_CLICK", e);
                $(this).data("lastTouchCoords", null)
            }
        }
        .bind(this)).on("dblclick", function (e) {
        $(u).trigger("CANVAS_DOUBLE_CLICK", e)
    });
    $(document).on("mousemove touchmove", function (e) {
        $(u).trigger("DOCUMENT_MOUSE_MOVE", e)
    }).on("mouseup touchend", function (e) {
        $(u).trigger("DOCUMENT_MOUSE_UP", e)
    });
    $(document).keydown(function (e) {
        if (e.keyCode == u.DELETE_KEYCODE) {
            $(u).trigger("DOCUMENT_DELETE_KEY_DOWN", e)
        }
    });
    $(window).resize(function () {
        $(u).trigger("WINDOW_RESIZE")
    });
    // quill.on("text-change", function (e, t, n) {
    //     if (!suppressQuillEvents)
    //         $(u).trigger("DOT_TEXT_CHANGE")
    // });
    $("#dot_text").keyup(function (e) {
        if (!suppressQuillEvents)
            $(u).trigger("DOT_TEXT_CHANGE", e)
    });
    $("#scale_slider").on("input", function (e) {
        $(u).trigger("CANVAS_SCALE_CHANGE", e)
    })
};
CanvasView.prototype.destroyListeners = function () {
    quill.off("text-change");
    $("#" + this.CANVAS_ID).off("mousedown").off("touchstart").off("dblclick");
    $(document).off("mousemove").off("touchmove").off("mouseup").off("touchend");
    $(document).off("keydown");
    $(window).off("resize");
    $("#dot_text").off("keyup")
};
CanvasView.prototype.loadImageToCanvas = function (e, t) {
    var n = this;
    var i = $("<img>", {
        src: e
    });
    i.on("load", function () {
        n.image = this;
        n.sizeImage(t)
    })
};
CanvasView.prototype.updateSelectedDotTextarea = function (e) {
    quill.root.innerHTML = e
};
CanvasView.prototype.sizeImage = function (e) {
    this.scale = e;
    this.imageWidth = this.image.width * this.scale;
    this.imageHeight = this.image.height * this.scale;
    var t = $(window).width();
    var n = $("footer").position().top - $("#work_area").position().top;
    var i;
    var r;
    var o;
    var a = $("#work_area").position().top;
    if (t < this.imageWidth) {
        i = t;
        o = 0
    } else {
        i = this.imageWidth;
        o = (t - this.imageWidth) / 2
    }
    if (n < this.imageHeight) {
        r = n
    } else {
        r = this.imageHeight;
        a += (n - this.imageHeight) / 2
    }
    $("#canvas").attr("width", i);
    $("#canvas").attr("height", r);
    $("#canvas").css({
        position: "absolute",
        top: a,
        left: o
    });
    $("#canvas").show();
    this.canvasWidth = i;
    this.canvasHeight = r
};
CanvasView.prototype.draw = function (i, r, e, o, a, t) {
    return;
    if (!this.image)
        return;
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.drawImage(this.image, i, r, this.imageWidth, this.imageHeight);
    $("body").css("cursor", "default");
    if (o != -1) {
        $("body").css("cursor", "move")
    }
    if (t) {
        $("body").css("cursor", "pointer")
    }
    var s = this;
    $.each(e, function (e, t) {
        var n = e == a || e == o;
        if (e != a) {
            s.drawDot(t.x + i, t.y + r, n, e == a)
        }
    });
    if (a != -1) {
        var n = e[a];
        this.drawDot(n.x + i, n.y + r, true, true);
        this.activeBBDrawer.drawBB(this.context, n.x + i, n.y + r)
    }
};
CanvasView.prototype.drawDot = function (e, t, n, i) {
    return;
    this.dotDrawer.drawDot(this.context, e, t, n);
    return;
    this.context.beginPath();
    this.context.arc(e, t, this.DOT_RADIUS, 0, 2 * Math.PI);
    var r;
    if (n) {
        r = this.HIGHLIGHT_DOT_COLOR
    } else {
        r = this.DOT_COLOR
    }
    this.context.fillStyle = "rgba(" + r + ", " + this.DOT_OPACITY + ")";
    this.context.fill();
    this.context.closePath();
    if (i) {
        this.context.lineWidth = 0;
        this.context.rect(e - this.DOT_RADIUS / 2 - this.BOUNDING_BOX_PADDING, t - this.DOT_RADIUS / 2 - this.BOUNDING_BOX_PADDING, this.DOT_RADIUS + 2 * this.BOUNDING_BOX_PADDING, this.DOT_RADIUS + 2 * this.BOUNDING_BOX_PADDING);
        this.context.strokeStyle = "black";
        this.context.stroke();
        var o = {
            x: e + this.DOT_RADIUS / 2 + this.BOUNDING_BOX_PADDING,
            y: t - this.DOT_RADIUS / 2 - this.BOUNDING_BOX_PADDING
        };
        this.context.beginPath();
        this.context.arc(o.x, o.y, this.DELETE_SYMBOL_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = "red";
        this.context.fill();
        this.context.lineWidth = 1;
        this.context.stroke();
        this.context.closePath();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.strokeStyle = "white";
        this.context.moveTo(o.x - this.DELETE_SYMBOL_RADIUS / 2, o.y - this.DELETE_SYMBOL_RADIUS / 2);
        this.context.lineTo(o.x + this.DELETE_SYMBOL_RADIUS / 2, o.y + this.DELETE_SYMBOL_RADIUS / 2);
        this.context.moveTo(o.x + this.DELETE_SYMBOL_RADIUS / 2, o.y - this.DELETE_SYMBOL_RADIUS / 2);
        this.context.lineTo(o.x - this.DELETE_SYMBOL_RADIUS / 2, o.y + this.DELETE_SYMBOL_RADIUS / 2);
        this.context.stroke();
        this.context.closePath()
    }
};
CanvasView.prototype.imageUploadElement = function () {
    return $("#image_upload")
};
CanvasView.prototype.imageUploading = function () {
    $("#work_area").html("<span>Uploading...</span>")
};
CanvasView.prototype.imageLoading = function () {
    $("#work_area").html("<span>Loading...</span>")
};
CanvasView.prototype.badOpen = function () {
    this.sessionController.prompt(["There was a problem opening the file..."], null)
};
CanvasView.prototype.enableSaveAsButton = function () {
    $("#file_menu option[value=SAVE_AS]").prop("disabled", false);
    $("#file_menu").niceSelect("update")
};
CanvasView.prototype.disableSaveAsButton = function () {
    $("#file_menu option[value=SAVE_AS]").prop("disabled", true);
    $("#file_menu").niceSelect("update")
};

var CanvasController = function (e, t) {
    this.canvasView = t;
    this.image = null;
    this.interactiveImage = null;
    this.TIMESTEP = 100;
    this.__init()
};
CanvasController.prototype.__init = function () {
    this.__createViewHandlers()
};
CanvasController.prototype.__createModelHandlers = function () {
    this.model.imageManager.on("transitioned", function (e) {
            var t = this.model.imageManager.compositeState();
            this.__imageManagerStateChange(t, e);
            if (e.action == "image_uploading.INVALID_FILE_TYPE") {
                $.confirm(["<strong>Invalid Upload:</strong> You must upload a jpeg, png, or gif image."])
            } else if (e.action == "image_uploading.INVALID_FILE_SIZE") {
                $.confirm(["Invalid Upload: Your image must be < 10 mb in size."])
            }
            if (e.fromState == "editing_new_locus" || e.fromState == "editing_old_locus") {
                this.removeRender()
            }
        }
        .bind(this));
    shortcut.add("Ctrl+Q", function () {
        if (document.activeElement != document.body)
            return;
        setTimeout(function () {
            quill.focus()
        }, 1)
    })
};
CanvasController.prototype.__createViewHandlers = function () {
    $(this.canvasView).on("IMAGE_UPLOAD_STARTED", this.__imageUploadStarted.bind(this));
    $(this.canvasView).on("IMAGE_UPLOAD_DONE", this.__imageUploadDone.bind(this));
    $(this.canvasView).on("CANVAS_MOUSE_DOWN", this.canvasMouseDown.bind(this));
    $(this.canvasView).on("CANVAS_DOUBLE_CLICK", this.canvasDoubleClick.bind(this));
    $(this.canvasView).on("DOCUMENT_MOUSE_MOVE", this.documentMouseMove.bind(this));
    $(this.canvasView).on("DOCUMENT_MOUSE_UP", this.documentMouseUp.bind(this));
    $(this.canvasView).on("DOCUMENT_DELETE_KEY_DOWN", this.documentDeleteKeyDown.bind(this));
    $(this.canvasView).on("WINDOW_RESIZE", this.windowResize.bind(this));
    $(this.canvasView).on("DOT_TEXT_CHANGE", this.dotTextChange.bind(this));
    $(this.canvasView).on("CANVAS_SCALE_CHANGE", this.canvasScaleChange.bind(this))
};
CanvasController.prototype.canvasScaleChange = function (e) {
    this.setScale(this.getScale());
    this.resetScroll();
    this.canvasView.sizeImage(this.scale)
};
CanvasController.prototype.getScale = function () {
    return Number(ii.zoomer.zoom)
};
CanvasController.prototype.setScale = function (e) {
    this.scale = e;
    var t = e < 1 ? (e - 1) * 5 / .8 : (e - 1) / .8;
    var n = Math.round(t);
    $("#scale_slider").val(n)
};
CanvasController.prototype.resetUI = function () {
    // quill.root.innerHTML = "";
    var e = this.interactiveImage.toolbox;
    // disableQuill()
};
var toolbox;
CanvasController.prototype.__ResetImage = function (e) {
    if (this.interactiveImage) {
        this.interactiveImage.destroy()
    }
};
CanvasController.prototype.__loadNewImage = function (e) {
    var l;
    if (this.interactiveImage) {
        l = toolbox.activeTool.name;
        this.interactiveImage.destroy()
    }
    var u = e.scale ? e.scale : 1;
    var t = this.model.imageManager.locusId ? "/uploads/img/" + this.model.imageManager.locusId : this.model.imageManager.imagePath;
    var c = this.model.imageManager.dots;
    var f = this;
    $("<img>", {
        src: t
    }).on("load", function () {
        var II = new InteractiveImage;
        II.setSize(250, 250);
        II.setImg(this);
        var t = new Zoomer(II);
        II.addZoomer(t);
        II.zoomer.setZoom(u);
        var n = new AnnotatorNew(c, II);
        II.addAnnotator(n);
        toolbox = new Toolbox(II);
        toolbox.addTool(new SelectTool("SELECT", "#select_tool", n, II));
        toolbox.addTool(new DotTool("DOT", "#dot_tool", n, II));
        toolbox.addTool(new PolyTool("POLY", "#poly_tool", n, II));
        toolbox.addTool(new RectTool("RECT", "#rect_tool", n, II));
        toolbox.addTool(new CircleTool("CIRCLE", "#circle_tool", n, II));
        console.log(l);
        toolbox.selectTool(l ? l : "SELECT");
        var i = toolbox.getTool("SELECT");
        $(i).on("ACTIVE_ANNOTATION_CHANGE", f.activeAnnotationChange);
        // var r = new Scroller;
        // r.addBehavior(new DraggableScrollerBehavior(II.canvas));
        // var o = new KeyboardScrollerBehavior;
        // r.addBehavior(o);
        // o.init();
        II.addScroller(r);
        var a = new LocusImagePositioner(II);
        II.addPositioner(a);
        var s = new OverlayUI(II);
        a.position();
        $("#popups").append($(II.canvas));
        f.interactiveImage = II;
        f.canvasView.createListeners();
        f.resetUI()
    })
};
CanvasController.prototype.__imageManagerStateChange = function (e, t) {
    if (e == "no_image_loaded") {
        this.__ResetImage();
        this.canvasView.showUploadWidget(this.model.imageManager.imageUploadUrl)
    } else if (e == "editing_old_locus" || e == "editing_new_locus") {
        if (this.model.imageManager.scale) {
            var n = this.model.imageManager.scale
        } else {
            n = 1
        }
        if (t.fromState != "awaiting_save_as_info") {
            this.__loadNewImage(this.model.imageManager)
        }
    } else if (e == "image_loading" || e == "image_uploading" || e == "saving_locus" || e == "saving_locus_as" || e == "deleting") {
        this.canvasView.showLoading()
    }
};
CanvasController.prototype.resetScroll = function () {
    this.scrollX = 0;
    this.scrollY = 0;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.hasProcessedTouchStart = false
};
CanvasController.prototype.__setupNewImage = function (e, t) {
    this.isDraggingImage = false;
    this.isDraggingDot = false;
    this.activeDotIndex = -1;
    this.resetScroll();
    this.setScale(t);
    this.canvasView.createCanvas();
    this.canvasView.loadImageToCanvas(e, this.scale);
    this.renderInterval = setInterval(this.render.bind(this), this.TIMESTEP);
    this.render()
};
CanvasController.prototype.removeRender = function () {
    clearInterval(this.renderInterval)
};
CanvasController.prototype.__imageUploadStarted = function (e, t) {
    this.model.imageManager.uploadStart(t)
};
CanvasController.prototype.__imageUploadDone = function (e, t) {
    this.model.imageManager.uploadDone(t)
};
var scaleDots = function (e, i) {
    dotsModified = [];
    $.each(e, function (e, t) {
        var n = $.extend({}, t);
        n.x = t.x * i;
        n.y = t.y * i;
        dotsModified.push(n)
    });
    return dotsModified
};
CanvasController.prototype.render = function () {
    if (!this.model.imageManager.doRender()) {
        return
    }
    this.canvasView.draw(this.scrollX, this.scrollY, scaleDots(this.model.imageManager.getDots(), this.scale), this.getHoverDotIndex(), this.activeDotIndex, this.isHoveringDelete)
};
CanvasController.prototype.getHoverDotIndex = function (a) {
    return;
    var s = this.canvasView.activeBBDrawer.DELETE_RADIUS;
    var l = this.canvasView.activeBBDrawer.BB_WIDTH;
    if (!a) {
        a = false
    }
    hoverDotIndex = -1;
    var u = this;
    var e = scaleDots(this.model.imageManager.getDots(), this.scale);
    $.each(e, function (e, t) {
        var n = u.imageToPageCoords(t.x, t.y);
        var i = {
            x: u.mouseX,
            y: u.mouseY
        };
        var r = u.canvasView.DOT_RADIUS;
        if (a) {
            r = r * 3
        }
        if (pointsWithinDist(n, i, r)) {
            hoverDotIndex = e;
            u.isHoveringDot = true
        }
        if (u.activeDotIndex != -1 && u.activeDotIndex == e) {
            var o = {
                x: n.x + l / 2,
                y: n.y - l / 2
            };
            if (pointsWithinDist(o, i, s)) {
                u.isHoveringDelete = true
            } else {
                u.isHoveringDelete = false
            }
        }
    });
    return hoverDotIndex
};
CanvasController.prototype.selectDot = function (e) {
    this.activeDotIndex = e;
    // var t = this.model.imageManager.getDot(e).text;
    // this.canvasView.updateSelectedDotTextarea(t)
};
CanvasController.prototype.canvasMouseDown = function (e, t) {
    var n;
    var i;
    if (t.type == "mousedown") {
        n = t.pageX;
        i = t.pageY
    } else if (t.type == "touchstart") {
        var r = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0];
        n = r.pageX;
        i = r.pageY
    }
    this.mouseX = n;
    this.mouseY = i;
    var o = false;
    if (this.isHoveringDelete) {
        this.model.imageManager.deleteDot(this.activeDotIndex);
        this.isHoveringDelete = false;
        o = true
    }
    if (!o) {
        var a = this.getHoverDotIndex(t.type == "touchstart");
        if (a != -1) {
            this.selectDot(a);
            this.isDraggingDot = true
        } else {
            this.isDraggingImage = true
        }
    }
    this.hasProcessedTouchStart = false
};
CanvasController.prototype.canvasDoubleClick = function (e, t) {
    var n = this.getHoverDotIndex();
    var i;
    var r;
    if (t.type == "touchstart") {
        var o = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0];
        i = o.pageX;
        r = o.pageY
    } else {
        i = t.pageX;
        r = t.pageY
    }
    if (n == -1) {
        var a = this.pageToImageCoords(i, r);
        this.model.imageManager.createDot(a.x, a.y);
        this.selectDot(this.model.imageManager.getDots().length - 1)
    } else {
        this.model.imageManager.deleteDot(n)
    }
};
CanvasController.prototype.documentMouseMove = function (e, t) {
    var n;
    var i;
    if (t.type == "mousemove") {
        n = t.pageX;
        i = t.pageY
    } else if (t.type == "touchmove") {
        var r = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0];
        n = r.pageX;
        i = r.pageY
    }
    this.mouseX = n;
    this.mouseY = i;
    if (!this.hasProcessedTouchStart) {
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        this.hasProcessedTouchStart = true;
        if (this.isDraggingDot) {
            var o = this.pageToImageCoords(this.mouseX, this.mouseY);
            var a = this.model.imageManager.getDots()[this.activeDotIndex];
            this.dragOffsetX = a.x - o.x;
            this.dragOffsetY = a.y - o.y
        }
    }
    if (this.canvasView.image)
        this.handleDrag();
    this.lastMouseX = n;
    this.lastMouseY = i
};
CanvasController.prototype.documentMouseUp = function (e, t) {
    this.isDraggingImage = false;
    this.isDraggingDot = false
};
CanvasController.prototype.documentDeleteKeyDown = function (e, t) {
    if (this.activeDotIndex == -1)
        return;
    this.model.imageManager.deleteDot(this.activeDotIndex)
};
CanvasController.prototype.windowResize = function () {
    this.canvasView.sizeImage();
    this.scrollX = 0;
    this.scrollY = 0;
    this.render()
};
var suppressQuillEvents;

function disableQuill() {
    suppressQuillEvents = true;
    quill.enable(false);
    quill.setText("Use the Select Tool to select an annotation and edit its text using this textbox.");
    $(".ql-editor").css("background-color", "#DDD")
}

function enableQuill() {
    suppressQuillEvents = false;
    quill.enable(true);
    $(".ql-editor").css("background-color", "white")
}
CanvasController.prototype.activeAnnotationChange = function (e, t) {
    if (!t) {
        disableQuill();
        return
    }
    enableQuill();
    if (typeof t.text == "string") {
        quill.setText(t.text)
    } else {
        quill.setContents(t.text)
    }
};
CanvasController.prototype.dotTextChange = function () {
    var e = this.interactiveImage.toolbox.activeTool;
    if (!e.name == "SELECT")
        return;
    if (!e.selectedAnnotation)
        return;
    var t = quill.getContents();
    e.selectedAnnotation.setText(t)
};
CanvasController.prototype.handleDrag = function () {
    if (this.isDraggingImage) {
        var e = $("#canvas").width();
        var t = $("#canvas").height();
        if (this.canvasView.imageWidth > e) {
            var n = this.mouseX - this.lastMouseX;
            this.scrollX += n;
            this.scrollX = Math.min(0, this.scrollX);
            this.scrollX = Math.max(-(this.canvasView.imageWidth - e), this.scrollX)
        }
        if (this.canvasView.imageHeight > t) {
            var i = this.mouseY - this.lastMouseY;
            this.scrollY += i;
            this.scrollY = Math.min(0, this.scrollY);
            this.scrollY = Math.max(-(this.canvasView.imageHeight - t), this.scrollY)
        }
    } else if (this.isDraggingDot) {
        var r = this.model.imageManager.getDots()[this.activeDotIndex];
        mousePointRelImage = this.pageToImageCoords(this.mouseX, this.mouseY);
        image_abs_x = Math.max(0, mousePointRelImage.x);
        image_abs_y = Math.max(0, mousePointRelImage.y);
        image_abs_x = Math.min(this.canvasView.imageWidth, mousePointRelImage.x);
        image_abs_y = Math.min(this.canvasView.imageHeight, mousePointRelImage.y);
        var o = mousePointRelImage.x + this.dragOffsetX;
        var a = mousePointRelImage.y + this.dragOffsetY;
        o = Math.max(0, o);
        a = Math.max(0, a);
        o = Math.min(this.canvasView.imageWidth / this.scale, o);
        a = Math.min(this.canvasView.imageHeight / this.scale, a);
        this.model.imageManager.updateDot(this.activeDotIndex, o, a)
    }
    this.render()
};
CanvasController.prototype.pageToImageCoords = function (e, t) {
    var n = e - $("#canvas").position().left - this.scrollX;
    var i = t - $("#canvas").position().top - this.scrollY;
    return {
        x: n / this.scale,
        y: i / this.scale
    }
};
CanvasController.prototype.imageToPageCoords = function (e, t) {
    var n = e + $("#canvas").position().left + this.scrollX;
    var i = t + $("#canvas").position().top + this.scrollY;
    return {
        x: n,
        y: i
    }
};

var InteractiveImage = function (e) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.__isDirty = true;
    setInterval(this.__step.bind(this), 25)
};
InteractiveImage.prototype.__step = function (e) {
    if (this.__isDirty)
        this.draw()
};
InteractiveImage.prototype.serialize = function (e) {
    return this.annotator.serialize(this.zoomer.zoom)
};
InteractiveImage.prototype.onModuleChange = function () {
    this.__isDirty = true
};
InteractiveImage.prototype.draw = function () {
    if (!this.img) {
        throw "InteractiveImage.draw(): No img set. Set using InteractiveImage.setImg(img)"
    }
    var e = 1;
    if (this.zoomer)
        e = this.zoomer.zoom;
    var t = this.getScroll();
    if (!DEBUG)
        this.context.clearRect(0, 0, this.img.width, this.img.height);
    var n = Math.floor(t.x / e);
    var i = Math.floor(t.y / e);
    this.context.drawImage(this.img, n, i, Math.floor(this.img.width - n), Math.floor(this.img.height - i), 0, 0, Math.floor(this.img.width * e - n * e), Math.floor(this.img.height * e - i * e));
    if (this.annotator)
        this.annotator.draw(this.context, this.scroller);
    if (this.toolbox)
        this.toolbox.draw(this.context, this.scroller);
    this.__isDirty = false
};
InteractiveImage.prototype.getScroll = function () {
    var e = 0;
    var t = 0;
    if (this.scroller) {
        e = this.scroller.scrollX;
        t = this.scroller.scrollY
    }
    return {
        x: e,
        y: t
    }
};
InteractiveImage.prototype.getSize = function () {
    var e = {
        width: this.img.width * this.zoomer.zoom,
        height: this.img.height * this.zoomer.zoom
    };
    return e
};
InteractiveImage.prototype.setSize = function (e, t) {
    this.width = e;
    this.height = t;
    $(this.canvas)[0].setAttribute("width", this.width);
    $(this.canvas)[0].setAttribute("height", this.height);
    if (this.img && this.scroller) {
        var n = 1;
        if (this.zoomer)
            n = this.zoomer.zoom;
        this.scroller.setBounds(this.img.width * n - this.width, this.img.height * n - this.height)
    }
};
InteractiveImage.prototype.getBounds = function () {
    var e = parseInt($(this.canvas).css("left"), 10);
    var t = parseInt($(this.canvas).css("top"), 10);
    var n = {
        x: e,
        y: t,
        width: this.width,
        height: this.height
    };
    return n
};
InteractiveImage.prototype.setImg = function (e) {
    this.img = e;
    if (this.scroller)
        this.scroller.setBounds(this.img.width - this.width, this.img.height - this.height);
    this.draw();
    if (this.positioner)
        this.positioner.position()
};
InteractiveImage.prototype.addScroller = function (e) {
    this.scroller = e;
    $(this.scroller).change(this.onModuleChange.bind(this))
};
InteractiveImage.prototype.addAnnotator = function (e) {
    this.annotator = e;
    var t = this;
    $(this.annotator).change(function () {
            t.onModuleChange()
        }
        .bind(this));
    if (this.zoomer)
        this.zoomer.setOrigAnnotations(this.annotator.annotations);
    if (this.zoomer)
        this.zoomer.updateAnnotator(this.zoomer.zoom, 1);
    this.draw()
};
InteractiveImage.prototype.addPincherPanner = function (e) {
    this.pincherPanner = e;
    if (this.width)
        this.draw()
};
InteractiveImage.prototype.addZoomer = function (e) {
    this.zoomer = e;
    $(this.zoomer).change(this.onModuleChange.bind(this));
    if (this.width)
        this.draw();
    if (this.positioner)
        this.positioner.position()
};
InteractiveImage.prototype.addPositioner = function (e) {
    this.positioner = e;
    this.positioner.position();
    $(this).triggerHandler("change")
};
InteractiveImage.prototype.addToolbox = function (e) {
    this.toolbox = e;
    $(this).triggerHandler("change");
    $(this.toolbox).on("change", function () {
            this.onModuleChange()
        }
        .bind(this))
};
InteractiveImage.prototype.destroy = function () {
    this.canvas.remove();
    if (this.ui)
        this.ui.destroy();
    if (this.pincherPanner)
        this.pincherPanner.destroy()
};
InteractiveImage.prototype.pageToImageCoords = function (e, t) {
    var n = $(this.canvas).position();
    var i = this.getScroll();
    var r = i.x + e - n.left;
    var o = i.y + t - n.top;
    return {
        x: r,
        y: o
    }
};
InteractiveImage.prototype.imageToPageCoords = function (e, t) {
    var n = $(this.canvas).position();
    var i = this.getScroll();
    var r = n.left + e - i.x;
    var o = n.top + t - i.y;
    return {
        x: r,
        y: o
    }
};
InteractiveImage.prototype.imageToCanvasCoords = function (e, t) {
    var n = this.getScroll();
    var i = e - n.x;
    var r = t - n.y;
    return {
        x: i,
        y: r
    }
};

var PLUS = 187;
var MINUS = 189;
var ZERO = 48;
var Zoomer = function (e) {
    this.interactiveImage = e;
    $(document).on("keydown", this.__onDocumentKeyDown.bind(this));
    $(document).on("keypress", this.__onDocumentKeyPress.bind(this))
};
Zoomer.prototype.__onDocumentKeyDown = function (e) {
    if (document.activeElement != document.body)
        return;
    if (e.keyCode == PLUS)
        this.setZoom(this.zoom * 2);
    if (e.keyCode == MINUS)
        this.setZoom(this.zoom * .5)
};
Zoomer.prototype.__onDocumentKeyPress = function (e) {
    if (e.keyCode == ZERO)
        this.setZoom(this.origZoom)
};
Zoomer.prototype.setOrigAnnotations = function (e) {
    this.origAnnotations = _.cloneDeep(e)
};
Zoomer.prototype.setZoom = function (e) {
    if (this.zoom == e)
        return;
    if (!this.zoom)
        this.origZoom = e;
    var t = this.zoom;
    this.zoom = e;
    if (this.interactiveImage.scroller) {
        var n = this.interactiveImage.getBounds();
        var i = this.interactiveImage.scroller.scrollX;
        var r = this.interactiveImage.scroller.scrollY;
        var o = (i + n.width / 2) / t;
        var a = (r + n.height / 2) / t
    }
    if (this.interactiveImage.annotator)
        this.updateAnnotator(e, t);
    this.__updateImage(true);
    if (this.interactiveImage.scroller) {
        var n = this.interactiveImage.getBounds();
        var s = o * e;
        var l = a * e;
        var u = s - n.width / 2;
        var c = l - n.height / 2;
        this.interactiveImage.scroller.setScroll(u, c)
    }
    this.interactiveImage.__isDirty = true;
    this.interactiveImage.draw()
};
Zoomer.prototype.updateAnnotator = function (r, o) {
    $.each(this.interactiveImage.annotator.annotations, function (e, t) {
            var t = this.interactiveImage.annotator.annotations[e];
            if (t.x) {
                t.x = this.origAnnotations[e].x * this.zoom;
                t.y = this.origAnnotations[e].y * this.zoom
            } else {
                if (t.type == "DOT") {
                    var n = r / o * t.pos.x;
                    var i = r / o * t.pos.y;
                    t.setPosition(n, i)
                } else if (t.type == "POLY" || t.type == "CIRCLE") {
                    t.zoom(r / o)
                }
            }
        }
        .bind(this))
};
Zoomer.prototype.__updateImage = function (e) {
    var t = this.interactiveImage.img.width * this.zoom;
    var n = this.interactiveImage.img.height * this.zoom;
    this.interactiveImage.setSize(50, 50);
    if (this.interactiveImage.positioner)
        this.interactiveImage.positioner.position(e)
};

var AnnotatorNew = function (e, t) {
    this.interactiveImage = t;
    this.__loadAnnotations(e);
    $(document).on("mousemove", this.__onDocumentMouseMove.bind(this));
    $(this.interactiveImage.canvas).on("mousedown", this.__onCanvasMouseDown.bind(this));
    $(document).on("mouseup", this.__onDocumentMouseUp.bind(this));
    $(this.interactiveImage.canvas).on("dblclick", this.__onCanvasDblClick.bind(this));
    $(this.interactiveImage.scroller).on("change", this.__onScrollerChange.bind(this));
    this.show = true;
};
AnnotatorNew.prototype.serialize = function (n) {
    var i = [];
    $.each(this.annotations, function (e, t) {
        i.push(t.serialize(n))
    });
    return i
};
AnnotatorNew.prototype.__loadAnnotations = function (e) {
    this.annotations = [];
    $.each(e, function (e, t) {
            var n = t.type ? t.type : "DOT";
            var i;
            if (n == "DOT") {
                i = new PointAnnotation(t.x, t.y, t.text)
            } else if (n == "CIRCLE") {
                i = new CircleAnnotation(t.x, t.y, t.radius, t.text)
            } else if (n == "POLY") {
                i = new PolyAnnotation(t.points, t.text)
            }
            this.addAnnotation(i)
        }
        .bind(this))
};
AnnotatorNew.prototype.addAnnotation = function (e, t) {
    if (t) {
        this.annotations.unshift(e)
    } else {
        this.annotations.push(e)
    }
    $(e).on("change", this.__onAnnotationChange.bind(this));
    $(this).triggerHandler("change")
};
AnnotatorNew.prototype.deleteAnnotation = function (e) {
    var t = this.annotations.indexOf(e);
    if (t == -1)
        return;
    this.annotations.splice(t, 1);
    e.delete();
    $(this).triggerHandler("change")
};
AnnotatorNew.prototype.draw = function () {
    if (!this.show)
        return;
    var e = _.clone(this.annotations);
    e.reverse();
    $.each(e, function (e, t) {
            var n = this.interactiveImage.imageToCanvasCoords(t.pos.x, t.pos.y);
            t.draw(this.interactiveImage.context, n, this.interactiveImage)
        }
        .bind(this))
};
AnnotatorNew.prototype.__onScrollerChange = function (e) {
    $(this).triggerHandler("change")
};
AnnotatorNew.prototype.__onAnnotationChange = function (e) {
    $(this).triggerHandler("change")
};
AnnotatorNew.prototype.__onDocumentMouseMove = function (e) {};
AnnotatorNew.prototype.__onCanvasMouseDown = function (e) {};
AnnotatorNew.prototype.__onDocumentMouseUp = function (e) {};
AnnotatorNew.prototype.__onCanvasDblClick = function (e) {};

var toolbox
$(document).ready(function () {
    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext('2d')

    var canvasView = new CanvasView;
    var canvasController = new CanvasController({}, canvasView);

    var dots = [];
    var img = new Image();
    img.src = './images/pic.png'
    img.onload = function () {
        var II = new InteractiveImage;
        II.setSize(250, 250);
        II.setImg(this);
        var zoomer = new Zoomer(II);
        II.addZoomer(zoomer);
        II.zoomer.setZoom(1);
        var annoNew = new AnnotatorNew(dots, II);
        II.addAnnotator(annoNew);
        toolbox = new Toolbox(II);
        toolbox.addTool(new SelectTool("SELECT", "#select_tool", annoNew, II));
        toolbox.addTool(new DotTool("DOT", "#dot_tool", annoNew, II));
        toolbox.addTool(new PolyTool("POLY", "#poly_tool", annoNew, II));
        toolbox.addTool(new RectTool("RECT", "#rect_tool", annoNew, II));
        toolbox.addTool(new CircleTool("CIRCLE", "#circle_tool", annoNew, II));
        toolbox.selectTool("SELECT");
        var sTool = toolbox.getTool("SELECT");
        $(sTool).on("ACTIVE_ANNOTATION_CHANGE", canvasController.activeAnnotationChange);
        // var r = new Scroller;
        // r.addBehavior(new DraggableScrollerBehavior(II.canvas));
        // var o = new KeyboardScrollerBehavior;
        // r.addBehavior(o);
        // o.init();
        // II.addScroller(r);
        // var a = new LocusImagePositioner(II);
        // II.addPositioner(a);
        // var s = new OverlayUI(II);
        // a.position();
        $("#popups").append($(II.canvas));
        canvasController.interactiveImage = II;
        canvasController.canvasView.createListeners();
        canvasController.resetUI()
    }
})