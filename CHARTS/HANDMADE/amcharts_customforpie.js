if (!AmCharts) var AmCharts = {};
AmCharts.inheriting = {};
AmCharts.Class = function (a) {
    var b = function () {
        arguments[0] !== AmCharts.inheriting && (this.events = {}, this.construct.apply(this, arguments))
    };
    a.inherits ? (b.prototype = new a.inherits(AmCharts.inheriting), b.base = a.inherits.prototype, delete a.inherits) : (b.prototype.createEvents = function () {
        for (var a = 0, b = arguments.length; a < b; a++) this.events[arguments[a]] = []
    }, b.prototype.listenTo = function (a, b, c) {
        a.events[b].push({
            handler: c,
            scope: this
        })
    }, b.prototype.addListener = function (a, b, c) {
        this.events[a].push({
            handler: b,
            scope: c
        })
    },
        b.prototype.removeListener = function (a, b, c) {
        a = a.events[b];
        for (b = a.length - 1; 0 <= b; b--) a[b].handler === c && a.splice(b, 1)
    }, b.prototype.fire = function (a, b) {
        for (var c = this.events[a], g = 0, h = c.length; g < h; g++) {
            var j = c[g];
            j.handler.call(j.scope, b)
        }
    });
    for (var c in a) b.prototype[c] = a[c];
    return b
};
AmCharts.charts = [];
AmCharts.addChart = function (a) {
    AmCharts.charts.push(a)
};
AmCharts.removeChart = function (a) {
    for (var b = AmCharts.charts, c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1)
};
AmCharts.IEversion = 0; - 1 != navigator.appVersion.indexOf("MSIE") && document.documentMode && (AmCharts.IEversion = Number(document.documentMode));
if (document.addEventListener || window.opera) AmCharts.isNN = !0, AmCharts.isIE = !1, AmCharts.dx = 0.5, AmCharts.dy = 0.5;
document.attachEvent && (AmCharts.isNN = !1, AmCharts.isIE = !0, 9 > AmCharts.IEversion && (AmCharts.dx = 0, AmCharts.dy = 0));
window.chrome && (AmCharts.chrome = !0);
AmCharts.handleResize = function () {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var c = a[b];
        c && c.div && c.handleResize()
    }
};
AmCharts.handleMouseUp = function (a) {
    for (var b = AmCharts.charts, c = 0; c < b.length; c++) {
        var d = b[c];
        d && d.handleReleaseOutside(a)
    }
};
AmCharts.handleMouseMove = function (a) {
    for (var b = AmCharts.charts, c = 0; c < b.length; c++) {
        var d = b[c];
        d && d.handleMouseMove(a)
    }
};
AmCharts.resetMouseOver = function () {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var c = a[b];
        c && (c.mouseIsOver = !1)
    }
};
AmCharts.onReadyArray = [];
AmCharts.ready = function (a) {
    AmCharts.onReadyArray.push(a)
};
AmCharts.handleLoad = function () {
    for (var a = AmCharts.onReadyArray, b = 0; b < a.length; b++)(0, a[b])()
};
AmCharts.useUTC = !1;
AmCharts.updateRate = 40;
AmCharts.uid = 0;
AmCharts.getUniqueId = function () {
    AmCharts.uid++;
    return "AmChartsEl-" + AmCharts.uid
};
AmCharts.isNN && (document.addEventListener("mousemove", AmCharts.handleMouseMove, !0), window.addEventListener("resize", AmCharts.handleResize, !0), document.addEventListener("mouseup", AmCharts.handleMouseUp, !0), window.addEventListener("load", AmCharts.handleLoad, !0));
AmCharts.isIE && (document.attachEvent("onmousemove", AmCharts.handleMouseMove), window.attachEvent("onresize", AmCharts.handleResize), document.attachEvent("onmouseup", AmCharts.handleMouseUp), window.attachEvent("onload", AmCharts.handleLoad));
AmCharts.clear = function () {
    var a = AmCharts.charts;
    if (a) for (var b = 0; b < a.length; b++) a[b].clear();
    AmCharts.charts = null;
    AmCharts.isNN && (document.removeEventListener("mousemove", AmCharts.handleMouseMove, !0), window.removeEventListener("resize", AmCharts.handleResize, !0), document.removeEventListener("mouseup", AmCharts.handleMouseUp, !0), window.removeEventListener("load", AmCharts.handleLoad, !0));
    AmCharts.isIE && (document.detachEvent("onmousemove", AmCharts.handleMouseMove), window.detachEvent("onresize", AmCharts.handleResize),
        document.detachEvent("onmouseup", AmCharts.handleMouseUp), window.detachEvent("onload", AmCharts.handleLoad))
};
AmCharts.AmChart = AmCharts.Class({
    construct: function () {
        this.version = "2.10.0";
        AmCharts.addChart(this);
        this.createEvents("dataUpdated", "init");
        this.height = this.width = "100%";
        this.dataChanged = !0;
        this.chartCreated = !1;
        this.previousWidth = this.previousHeight = 0;
        this.backgroundColor = "#FFFFFF";
        this.borderAlpha = this.backgroundAlpha = 0;
        this.color = this.borderColor = "#000000";
        this.fontFamily = "Verdana";
        this.fontSize = 11;
        this.numberFormatter = {
            precision: -1,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.percentFormatter = {
            precision: 2,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.labels = [];
        this.allLabels = [];
        this.titles = [];
        this.marginRight = this.marginLeft = this.autoMarginOffset = 0;
        this.timeOuts = [];
        var a = document.createElement("div"),
            b = a.style;
        b.overflow = "hidden";
        b.position = "relative";
        b.textAlign = "left";
        this.chartDiv = a;
        a = document.createElement("div");
        b = a.style;
        b.overflow = "hidden";
        b.position = "relative";
        b.textAlign = "left";
        this.legendDiv = a;
        this.balloon = new AmCharts.AmBalloon;
        this.balloon.chart = this;
        this.titleHeight = 0;
        this.prefixesOfBigNumbers = [{
                number: 1E3,
                prefix: "k"
            }, {
                number: 1E6,
                prefix: "M"
            }, {
                number: 1E9,
                prefix: "G"
            }, {
                number: 1E12,
                prefix: "T"
            }, {
                number: 1E15,
                prefix: "P"
            }, {
                number: 1E18,
                prefix: "E"
            }, {
                number: 1E21,
                prefix: "Z"
            }, {
                number: 1E24,
                prefix: "Y"
            }
        ];
        this.prefixesOfSmallNumbers = [{
                number: 1E-24,
                prefix: "y"
            }, {
                number: 1E-21,
                prefix: "z"
            }, {
                number: 1E-18,
                prefix: "a"
            }, {
                number: 1E-15,
                prefix: "f"
            }, {
                number: 1E-12,
                prefix: "p"
            }, {
                number: 1E-9,
                prefix: "n"
            }, {
                number: 1E-6,
                prefix: "\u03bc"
            }, {
                number: 0.001,
                prefix: "m"
            }
        ];
        this.panEventsEnabled = !1;
        AmCharts.bezierX =
            3;
        AmCharts.bezierY = 6;
        this.product = "amcharts"
    },
    drawChart: function () {
        this.drawBackground();
        this.redrawLabels();
        this.drawTitles()
    },
    drawBackground: function () {
        AmCharts.remove(this.background);
        var a = this.container,
            b = this.backgroundColor,
            c = this.backgroundAlpha,
            d = this.set,
            e = this.updateWidth();
        this.realWidth = e;
        var f = this.updateHeight();
        this.realHeight = f;
        this.background = b = AmCharts.polygon(a, [0, e - 1, e - 1, 0], [0, 0, f - 1, f - 1], b, c, 1, this.borderColor, this.borderAlpha);
        d.push(b);
        if (b = this.backgroundImage) this.path && (b =
                this.path + b), this.bgImg = a = a.image(b, 0, 0, e, f), d.push(a)
    },
    drawTitles: function () {
        var a = this.titles;
        if (AmCharts.ifArray(a)) {
            var b = 20,
                c;
            for (c = 0; c < a.length; c++) {
                var d = a[c],
                    e = d.color;
                void 0 === e && (e = this.color);
                var f = d.size;
                isNaN(d.alpha);
                var g = this.marginLeft,
                    e = AmCharts.text(this.container, d.text, e, this.fontFamily, f);
                e.translate(g + (this.realWidth - this.marginRight - g) / 2, b);
                g = !0;
                void 0 !== d.bold && (g = d.bold);
                g && e.attr({
                    "font-weight": "bold"
                });
                b += f + 6;
                this.freeLabelsSet.push(e)
            }
        }
    },
    write: function (a) {
        var b = this.balloon;
        b && !b.chart && (b.chart = this);
        a = "object" != typeof a ? document.getElementById(a) : a;
        a.innerHTML = "";
        this.div = a;
        a.style.overflow = "hidden";
        a.style.textAlign = "left";
        var b = this.chartDiv,
            c = this.legendDiv,
            d = this.legend,
            e = c.style,
            f = b.style;
        this.measure();
        var g, h;
        if (d) switch (d.position) {
            case "bottom":
                a.appendChild(b);
                a.appendChild(c);
                break;
            case "top":
                a.appendChild(c);
                a.appendChild(b);
                break;
            case "absolute":
                g = document.createElement("div");
                h = g.style;
                h.position = "relative";
                h.width = a.style.width;
                h.height = a.style.height;
                a.appendChild(g);
                e.position = "absolute";
                f.position = "absolute";
                void 0 !== d.left && (e.left = d.left + "px");
                void 0 !== d.right && (e.right = d.right + "px");
                void 0 !== d.top && (e.top = d.top + "px");
                void 0 !== d.bottom && (e.bottom = d.bottom + "px");
                d.marginLeft = 0;
                d.marginRight = 0;
                g.appendChild(b);
                g.appendChild(c);
                break;
            case "right":
                g = document.createElement("div");
                h = g.style;
                h.position = "relative";
                h.width = a.style.width;
                h.height = a.style.height;
                a.appendChild(g);
                e.position = "relative";
                f.position = "absolute";
                g.appendChild(b);
                g.appendChild(c);
                break;
            case "left":
                g = document.createElement("div");
                h = g.style;
                h.position = "relative";
                h.width = a.style.width;
                h.height = a.style.height;
                a.appendChild(g);
                e.position = "absolute";
                f.position = "relative";
                g.appendChild(b);
                g.appendChild(c);
                break;
            case "outside":
                a.appendChild(b)
        } else a.appendChild(b);
        this.listenersAdded || (this.addListeners(), this.listenersAdded = !0);
        this.initChart()
    },
    createLabelsSet: function () {
        AmCharts.remove(this.labelsSet);
        this.labelsSet = this.container.set();
        this.freeLabelsSet.push(this.labelsSet)
    },
    initChart: function () {
        this.divIsFixed = AmCharts.findIfFixed(this.chartDiv);
        this.previousHeight = this.realHeight;
        this.previousWidth = this.realWidth;
        this.destroy();
        var a = 0;
        document.attachEvent && !window.opera && (a = 1);
        this.dmouseX = this.dmouseY = 0;
        var b = document.getElementsByTagName("html")[0];
        if (b && window.getComputedStyle && (b = window.getComputedStyle(b, null))) this.dmouseY = AmCharts.removePx(b.getPropertyValue("margin-top")), this.dmouseX = AmCharts.removePx(b.getPropertyValue("margin-left"));
        this.mouseMode = a;
        this.container =
            new AmCharts.AmDraw(this.chartDiv, this.realWidth, this.realHeight);
        if (AmCharts.VML || AmCharts.SVG) a = this.container, this.set = a.set(), this.gridSet = a.set(), this.graphsBehindSet = a.set(), this.bulletBehindSet = a.set(), this.columnSet = a.set(), this.graphsSet = a.set(), this.trendLinesSet = a.set(), this.axesLabelsSet = a.set(), this.axesSet = a.set(), this.cursorSet = a.set(), this.scrollbarsSet = a.set(), this.bulletSet = a.set(), this.freeLabelsSet = a.set(), this.balloonsSet = a.set(), this.balloonsSet.setAttr("id", "balloons"), this.zoomButtonSet =
                a.set(), this.linkSet = a.set(), this.drb(), this.renderFix()
    },
    measure: function () {
        var a = this.div,
            b = this.chartDiv,
            c = a.offsetWidth,
            d = a.offsetHeight,
            e = this.container;
        a.clientHeight && (c = a.clientWidth, d = a.clientHeight);
        var f = AmCharts.removePx(AmCharts.getStyle(a, "padding-left")),
            g = AmCharts.removePx(AmCharts.getStyle(a, "padding-right")),
            h = AmCharts.removePx(AmCharts.getStyle(a, "padding-top")),
            j = AmCharts.removePx(AmCharts.getStyle(a, "padding-bottom"));
        isNaN(f) || (c -= f);
        isNaN(g) || (c -= g);
        isNaN(h) || (d -= h);
        isNaN(j) ||
            (d -= j);
        f = a.style;
        a = f.width;
        f = f.height; - 1 != a.indexOf("px") && (c = AmCharts.removePx(a)); - 1 != f.indexOf("px") && (d = AmCharts.removePx(f));
        a = AmCharts.toCoordinate(this.width, c);
        f = AmCharts.toCoordinate(this.height, d);
        if (a != this.previousWidth || f != this.previousHeight) b.style.width = a + "px", b.style.height = f + "px", e && e.setSize(a, f), this.balloon.setBounds(2, 2, a - 2, f);
        this.realWidth = a;
        this.realHeight = f;
        this.divRealWidth = c;
        this.divRealHeight = d
    },
    destroy: function () {
        this.chartDiv.innerHTML = "";
        this.clearTimeOuts()
    },
    clearTimeOuts: function () {
        var a =
            this.timeOuts;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) clearTimeout(a[b])
        }
        this.timeOuts = []
    },
    clear: function (a) {
        AmCharts.callMethod("clear", [this.chartScrollbar, this.scrollbarV, this.scrollbarH, this.chartCursor]);
        this.chartCursor = this.scrollbarH = this.scrollbarV = this.chartScrollbar = null;
        this.clearTimeOuts();
        this.container && (this.container.remove(this.chartDiv), this.container.remove(this.legendDiv));
        a || AmCharts.removeChart(this)
    },
    setMouseCursor: function (a) {
        "auto" == a && AmCharts.isNN && (a = "default");
        this.chartDiv.style.cursor =
            a;
        this.legendDiv.style.cursor = a
    },
    redrawLabels: function () {
        this.labels = [];
        var a = this.allLabels;
        this.createLabelsSet();
        var b;
        for (b = 0; b < a.length; b++) this.drawLabel(a[b])
    },
    drawLabel: function (a) {
        if (this.container) {
            var b = a.y,
                c = a.text,
                d = a.align,
                e = a.size,
                f = a.color,
                g = a.rotation,
                h = a.alpha,
                j = a.bold,
                k = AmCharts.toCoordinate(a.x, this.realWidth),
                b = AmCharts.toCoordinate(b, this.realHeight);
            k || (k = 0);
            b || (b = 0);
            void 0 === f && (f = this.color);
            isNaN(e) && (e = this.fontSize);
            d || (d = "start");
            "left" == d && (d = "start");
            "right" == d && (d =
                "end");
            "center" == d && (d = "middle", g ? b = this.realHeight - b + b / 2 : k = this.realWidth / 2 - k);
            void 0 === h && (h = 1);
            void 0 === g && (g = 0);
            b += e / 2;
            c = AmCharts.text(this.container, c, f, this.fontFamily, e, d, j, h);
            c.translate(k, b);
            0 !== g && c.rotate(g);
            a.url && (c.setAttr("cursor", "pointer"), c.click(function () {
                AmCharts.getURL(a.url)
            }));
            this.labelsSet.push(c);
            this.labels.push(c)
        }
    },
    addLabel: function (a, b, c, d, e, f, g, h, j, k) {
        a = {
            x: a,
            y: b,
            text: c,
            align: d,
            size: e,
            color: f,
            alpha: h,
            rotation: g,
            bold: j,
            url: k
        };
        this.container && this.drawLabel(a);
        this.allLabels.push(a)
    },
    clearLabels: function () {
        var a = this.labels,
            b;
        for (b = a.length - 1; 0 <= b; b--) a[b].remove();
        this.labels = [];
        this.allLabels = []
    },
    updateHeight: function () {
        var a = this.divRealHeight,
            b = this.legend;
        if (b) {
            var c = this.legendDiv.offsetHeight,
                b = b.position;
            if ("top" == b || "bottom" == b) a -= c, 0 > a && (a = 0), this.chartDiv.style.height = a + "px"
        }
        return a
    },
    updateWidth: function () {
        var a = this.divRealWidth,
            b = this.divRealHeight,
            c = this.legend;
        if (c) {
            var d = this.legendDiv,
                e = d.offsetWidth,
                f = d.offsetHeight,
                d = d.style,
                g = this.chartDiv.style,
                c = c.position;
            if ("right" == c || "left" == c) a -= e, 0 > a && (a = 0), g.width = a + "px", "left" == c ? g.left = e + "px" : d.left = a + "px", d.top = (b - f) / 2 + "px"
        }
        return a
    },
    getTitleHeight: function () {
        var a = 0,
            b = this.titles;
        if (0 < b.length) {
            var a = 15,
                c;
            for (c = 0; c < b.length; c++) a += b[c].size + 6
        }
        return a
    },
    addTitle: function (a, b, c, d, e) {
        isNaN(b) && (b = this.fontSize + 2);
        a = {
            text: a,
            size: b,
            color: c,
            alpha: d,
            bold: e
        };
        this.titles.push(a);
        return a
    },
    addListeners: function () {
        var a = this,
            b = a.chartDiv;
        AmCharts.isNN && (a.panEventsEnabled && "ontouchstart" in document.documentElement &&
            (b.addEventListener("touchstart", function (b) {
            a.handleTouchMove.call(a, b);
            a.handleTouchStart.call(a, b)
        }, !0), b.addEventListener("touchmove", function (b) {
            a.handleTouchMove.call(a, b)
        }, !0), b.addEventListener("touchend", function (b) {
            a.handleTouchEnd.call(a, b)
        }, !0)), b.addEventListener("mousedown", function (b) {
            a.handleMouseDown.call(a, b)
        }, !0), b.addEventListener("mouseover", function (b) {
            a.handleMouseOver.call(a, b)
        }, !0), b.addEventListener("mouseout", function (b) {
            a.handleMouseOut.call(a, b)
        }, !0));
        AmCharts.isIE && (b.attachEvent("onmousedown", function (b) {
            a.handleMouseDown.call(a, b)
        }), b.attachEvent("onmouseover", function (b) {
            a.handleMouseOver.call(a, b)
        }), b.attachEvent("onmouseout", function (b) {
            a.handleMouseOut.call(a, b)
        }))
    },
    dispDUpd: function () {
        var a;
        this.dispatchDataUpdated && (this.dispatchDataUpdated = !1, a = "dataUpdated", this.fire(a, {
            type: a,
            chart: this
        }));
        this.chartCreated || (a = "init", this.fire(a, {
            type: a,
            chart: this
        }))
    },
    drb: function () {
        var a = this.product,
            b = a + ".com",
            c = window.location.hostname.split("."),
            d;
        2 <= c.length && (d = c[c.length - 2] + "." + c[c.length -
            1]);
        AmCharts.remove(this.bbset);
        if (d != b) {
            var b = b + "/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo" + a,
                e = "chart by ",
                c = 145;
            "ammap" == a && (e = "tool by ", c = 125);
            d = AmCharts.rect(this.container, c, 20, "#FFFFFF", 1);
            e = AmCharts.text(this.container, e + a + ".com", "#000000", "Verdana", 11, "start");
            e.translate(7, 9);
            d = this.container.set([d, e]);
            "ammap" == a && d.translate(this.realWidth - c, 0);
            this.bbset = d;
            this.linkSet.push(d);
            d.setAttr("cursor", "pointer");
            d.click(function () {
                window.location.href = "http://" + b
            });
            for (a = 0; a < d.length; a++) d[a].attr({
                    cursor: "pointer"
                })
        }
    },
    validateSize: function () {
        var a = this;
        a.measure();
        var b = a.legend;
        if ((a.realWidth != a.previousWidth || a.realHeight != a.previousHeight) && 0 < a.realWidth && 0 < a.realHeight) {
            a.sizeChanged = !0;
            if (b) {
                clearTimeout(a.legendInitTO);
                var c = setTimeout(function () {
                    b.invalidateSize()
                }, 100);
                a.timeOuts.push(c);
                a.legendInitTO = c
            }
            a.marginsUpdated = !1;
            clearTimeout(a.initTO);
            c = setTimeout(function () {
                a.initChart()
            }, 150);
            a.timeOuts.push(c);
            a.initTO = c
        }
        a.renderFix();
        b && b.renderFix()
    },
    invalidateSize: function () {
        var a = this;
        a.previousWidth =
            NaN;
        a.previousHeight = NaN;
        a.marginsUpdated = !1;
        clearTimeout(a.validateTO);
        var b = setTimeout(function () {
            a.validateSize()
        }, 5);
        a.timeOuts.push(b);
        a.validateTO = b
    },
    validateData: function (a) {
        this.chartCreated && (this.dataChanged = !0, this.marginsUpdated = !1, this.initChart(a))
    },
    validateNow: function () {
        this.listenersAdded = !1;
        this.write(this.div)
    },
    showItem: function (a) {
        a.hidden = !1;
        this.initChart()
    },
    hideItem: function (a) {
        a.hidden = !0;
        this.initChart()
    },
    hideBalloon: function () {
        var a = this;
        a.hoverInt = setTimeout(function () {
            a.hideBalloonReal.call(a)
        },
            80)
    },
    cleanChart: function () {},
    hideBalloonReal: function () {
        var a = this.balloon;
        a && a.hide()
    },
    showBalloon: function (a, b, c, d, e) {
        var f = this;
        clearTimeout(f.balloonTO);
        f.balloonTO = setTimeout(function () {
            f.showBalloonReal.call(f, a, b, c, d, e)
        }, 1)
    },
    showBalloonReal: function (a, b, c, d, e) {
        this.handleMouseMove();
        var f = this.balloon;
        f.enabled && (f.followCursor(!1), f.changeColor(b), c || f.setPosition(d, e), f.followCursor(c), a && f.showBalloon(a))
    },
    handleTouchMove: function (a) {
        this.hideBalloon();
        var b = this.chartDiv;
        a.touches && (a =
            a.touches.item(0), this.mouseX = a.pageX - AmCharts.findPosX(b), this.mouseY = a.pageY - AmCharts.findPosY(b))
    },
    handleMouseOver: function () {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0
    },
    handleMouseOut: function () {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !1
    },
    handleMouseMove: function (a) {
        if (this.mouseIsOver) {
            var b = this.chartDiv;
            a || (a = window.event);
            var c, d;
            if (a) {
                this.posX = AmCharts.findPosX(b);
                this.posY = AmCharts.findPosY(b);
                switch (this.mouseMode) {
                case 1:
                    c = a.clientX - this.posX;
                    d = a.clientY - this.posY;
                    if (!this.divIsFixed) {
                        a =
                            document.body;
                        var e, f;
                        a && (e = a.scrollLeft, y1 = a.scrollTop);
                        if (a = document.documentElement) f = a.scrollLeft, y2 = a.scrollTop;
                        e = Math.max(e, f);
                        f = Math.max(y1, y2);
                        c += e;
                        d += f
                    }
                    break;
                case 0:
                    this.divIsFixed ? (c = a.clientX - this.posX, d = a.clientY - this.posY) : (c = a.pageX - this.posX, d = a.pageY - this.posY)
                }
                this.mouseX = c - this.dmouseX;
                this.mouseY = d - this.dmouseY
            }
        }
    },
    handleTouchStart: function (a) {
        this.handleMouseDown(a)
    },
    handleTouchEnd: function (a) {
        AmCharts.resetMouseOver();
        this.handleReleaseOutside(a)
    },
    handleReleaseOutside: function () {},
    handleMouseDown: function (a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0;
        a && a.preventDefault && a.preventDefault()
    },
    addLegend: function (a, b) {
        AmCharts.extend(a, new AmCharts.AmLegend);
        var c;
        c = "object" != typeof b ? document.getElementById(b) : b;
        this.legend = a;
        a.chart = this;
        c ? (a.div = c, a.position = "outside", a.autoMargins = !1) : a.div = this.legendDiv;
        c = this.handleLegendEvent;
        this.listenTo(a, "showItem", c);
        this.listenTo(a, "hideItem", c);
        this.listenTo(a, "clickMarker", c);
        this.listenTo(a, "rollOverItem", c);
        this.listenTo(a,
            "rollOutItem", c);
        this.listenTo(a, "rollOverMarker", c);
        this.listenTo(a, "rollOutMarker", c);
        this.listenTo(a, "clickLabel", c)
    },
    removeLegend: function () {
        this.legend = void 0;
        this.legendDiv.innerHTML = ""
    },
    handleResize: function () {
        (AmCharts.isPercents(this.width) || AmCharts.isPercents(this.height)) && this.invalidateSize();
        this.renderFix()
    },
    renderFix: function () {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    },
    getSVG: function () {
        if (AmCharts.hasSVG) return this.container
    }
});
AmCharts.Slice = AmCharts.Class({
    construct: function () {}
});
AmCharts.SerialDataItem = AmCharts.Class({
    construct: function () {}
});
AmCharts.GraphDataItem = AmCharts.Class({
    construct: function () {}
});
AmCharts.Guide = AmCharts.Class({
    construct: function () {}
});
AmCharts.toBoolean = function (a, b) {
    if (void 0 === a) return b;
    switch (String(a).toLowerCase()) {
    case "true":
    case "yes":
    case "1":
        return !0;
    case "false":
    case "no":
    case "0":
    case null:
        return !1;
    default:
        return Boolean(a)
    }
};
AmCharts.removeFromArray = function (a, b) {
    var c;
    for (c = a.length - 1; 0 <= c; c--) a[c] == b && a.splice(c, 1)
};
AmCharts.getStyle = function (a, b) {
    var c = "";
    document.defaultView && document.defaultView.getComputedStyle ? c = document.defaultView.getComputedStyle(a, "").getPropertyValue(b) : a.currentStyle && (b = b.replace(/\-(\w)/g, function (a, b) {
        return b.toUpperCase()
    }), c = a.currentStyle[b]);
    return c
};
AmCharts.removePx = function (a) {
    return Number(a.substring(0, a.length - 2))
};
AmCharts.getURL = function (a, b) {
    if (a) if ("_self" == b || !b) window.location.href = a;
        else if ("_top" == b && window.top) window.top.location.href = a;
    else if ("_parent" == b && window.parent) window.parent.location.href = a;
    else {
        var c = document.getElementsByName(b)[0];
        c ? c.src = a : window.open(a)
    }
};
AmCharts.formatMilliseconds = function (a, b) {
    if (-1 != a.indexOf("fff")) {
        var c = b.getMilliseconds(),
            d = String(c);
        10 > c && (d = "00" + c);
        10 <= c && 100 > c && (d = "0" + c);
        a = a.replace(/fff/g, d)
    }
    return a
};
AmCharts.ifArray = function (a) {
    return a && 0 < a.length ? !0 : !1
};
AmCharts.callMethod = function (a, b) {
    var c;
    for (c = 0; c < b.length; c++) {
        var d = b[c];
        if (d) {
            if (d[a]) d[a]();
            var e = d.length;
            if (0 < e) {
                var f;
                for (f = 0; f < e; f++) {
                    var g = d[f];
                    if (g && g[a]) g[a]()
                }
            }
        }
    }
};
AmCharts.toNumber = function (a) {
    return "number" == typeof a ? a : Number(String(a).replace(/[^0-9\-.]+/g, ""))
};
AmCharts.toColor = function (a) {
    if ("" !== a && void 0 !== a) if (-1 != a.indexOf(",")) {
            a = a.split(",");
            var b;
            for (b = 0; b < a.length; b++) {
                var c = a[b].substring(a[b].length - 6, a[b].length);
                a[b] = "#" + c
            }
        } else a = a.substring(a.length - 6, a.length), a = "#" + a;
    return a
};
AmCharts.toCoordinate = function (a, b, c) {
    var d;
    void 0 !== a && (a = String(a), c && c < b && (b = c), d = Number(a), -1 != a.indexOf("!") && (d = b - Number(a.substr(1))), -1 != a.indexOf("%") && (d = b * Number(a.substr(0, a.length - 1)) / 100));
    return d
};
AmCharts.fitToBounds = function (a, b, c) {
    a < b && (a = b);
    a > c && (a = c);
    return a
};
AmCharts.isDefined = function (a) {
    return void 0 === a ? !1 : !0
};
AmCharts.stripNumbers = function (a) {
    return a.replace(/[0-9]+/g, "")
};
AmCharts.extractPeriod = function (a) {
    var b = AmCharts.stripNumbers(a),
        c = 1;
    b != a && (c = Number(a.slice(0, a.indexOf(b))));
    return {
        period: b,
        count: c
    }
};
AmCharts.resetDateToMin = function (a, b, c, d) {
    void 0 === d && (d = 1);
    var e = a.getFullYear(),
        f = a.getMonth(),
        g = a.getDate(),
        h = a.getHours(),
        j = a.getMinutes(),
        k = a.getSeconds(),
        l = a.getMilliseconds();
    a = a.getDay();
    switch (b) {
    case "YYYY":
        e = Math.floor(e / c) * c;
        f = 0;
        g = 1;
        l = k = j = h = 0;
        break;
    case "MM":
        f = Math.floor(f / c) * c;
        g = 1;
        l = k = j = h = 0;
        break;
    case "WW":
        0 === a && 0 < d && (a = 7);
        g = g - a + d;
        l = k = j = h = 0;
        break;
    case "DD":
        g = Math.floor(g / c) * c;
        l = k = j = h = 0;
        break;
    case "hh":
        h = Math.floor(h / c) * c;
        l = k = j = 0;
        break;
    case "mm":
        j = Math.floor(j / c) * c;
        l = k = 0;
        break;
    case "ss":
        k =
            Math.floor(k / c) * c;
        l = 0;
        break;
    case "fff":
        l = Math.floor(l / c) * c
    }
    return a = new Date(e, f, g, h, j, k, l)
};
AmCharts.getPeriodDuration = function (a, b) {
    void 0 === b && (b = 1);
    var c;
    switch (a) {
    case "YYYY":
        c = 316224E5;
        break;
    case "MM":
        c = 26784E5;
        break;
    case "WW":
        c = 6048E5;
        break;
    case "DD":
        c = 864E5;
        break;
    case "hh":
        c = 36E5;
        break;
    case "mm":
        c = 6E4;
        break;
    case "ss":
        c = 1E3;
        break;
    case "fff":
        c = 1
    }
    return c * b
};
AmCharts.roundTo = function (a, b) {
    if (0 > b) return a;
    var c = Math.pow(10, b);
    return Math.round(a * c) / c
};
AmCharts.toFixed = function (a, b) {
    var c = String(Math.round(a * Math.pow(10, b)));
    if (0 < b) {
        var d = c.length;
        if (d < b) {
            var e;
            for (e = 0; e < b - d; e++) c = "0" + c
        }
        d = c.substring(0, c.length - b);
        "" === d && (d = 0);
        return d + "." + c.substring(c.length - b, c.length)
    }
    return String(c)
};
AmCharts.intervals = {
    s: {
        nextInterval: "ss",
        contains: 1E3
    },
    ss: {
        nextInterval: "mm",
        contains: 60,
        count: 0
    },
    mm: {
        nextInterval: "hh",
        contains: 60,
        count: 1
    },
    hh: {
        nextInterval: "DD",
        contains: 24,
        count: 2
    },
    DD: {
        nextInterval: "",
        contains: Infinity,
        count: 3
    }
};
AmCharts.getMaxInterval = function (a, b) {
    var c = AmCharts.intervals;
    return a >= c[b].contains ? (a = Math.round(a / c[b].contains), b = c[b].nextInterval, AmCharts.getMaxInterval(a, b)) : "ss" == b ? c[b].nextInterval : b
};
AmCharts.formatDuration = function (a, b, c, d, e, f) {
    var g = AmCharts.intervals,
        h = f.decimalSeparator;
    if (a >= g[b].contains) {
        var j = a - Math.floor(a / g[b].contains) * g[b].contains;
        "ss" == b && (j = AmCharts.formatNumber(j, f), 1 == j.split(h)[0].length && (j = "0" + j));
        if (("mm" == b || "hh" == b) && 10 > j) j = "0" + j;
        c = j + "" + d[b] + "" + c;
        a = Math.floor(a / g[b].contains);
        b = g[b].nextInterval;
        return AmCharts.formatDuration(a, b, c, d, e, f)
    }
    "ss" == b && (a = AmCharts.formatNumber(a, f), 1 == a.split(h)[0].length && (a = "0" + a));
    if (("mm" == b || "hh" == b) && 10 > a) a = "0" + a;
    c = a + "" +
        d[b] + "" + c;
    if (g[e].count > g[b].count) for (a = g[b].count; a < g[e].count; a++) b = g[b].nextInterval, "ss" == b || "mm" == b || "hh" == b ? c = "00" + d[b] + "" + c : "DD" == b && (c = "0" + d[b] + "" + c);
    ":" == c.charAt(c.length - 1) && (c = c.substring(0, c.length - 1));
    return c
};
AmCharts.formatNumber = function (a, b, c, d, e) {
    a = AmCharts.roundTo(a, b.precision);
    isNaN(c) && (c = b.precision);
    var f = b.decimalSeparator;
    b = b.thousandsSeparator;
    var g;
    g = 0 > a ? "-" : "";
    a = Math.abs(a);
    var h = String(a),
        j = !1; - 1 != h.indexOf("e") && (j = !0);
    0 <= c && (0 !== a && !j) && (h = AmCharts.toFixed(a, c));
    var k = "";
    if (j) k = h;
    else {
        var h = h.split("."),
            j = String(h[0]),
            l;
        for (l = j.length; 0 <= l; l -= 3) k = l != j.length ? 0 !== l ? j.substring(l - 3, l) + b + k : j.substring(l - 3, l) + k : j.substring(l - 3, l);
        void 0 !== h[1] && (k = k + f + h[1]);
        void 0 !== c && (0 < c && "0" != k) && (k =
            AmCharts.addZeroes(k, f, c))
    }
    k = g + k;
    "" === g && (!0 === d && 0 !== a) && (k = "+" + k);
    !0 === e && (k += "%");
    return k
};
AmCharts.addZeroes = function (a, b, c) {
    a = a.split(b);
    void 0 === a[1] && 0 < c && (a[1] = "0");
    return a[1].length < c ? (a[1] += "0", AmCharts.addZeroes(a[0] + b + a[1], b, c)) : void 0 !== a[1] ? a[0] + b + a[1] : a[0]
};
AmCharts.scientificToNormal = function (a) {
    var b;
    a = String(a).split("e");
    var c;
    if ("-" == a[1].substr(0, 1)) {
        b = "0.";
        for (c = 0; c < Math.abs(Number(a[1])) - 1; c++) b += "0";
        b += a[0].split(".").join("")
    } else {
        var d = 0;
        b = a[0].split(".");
        b[1] && (d = b[1].length);
        b = a[0].split(".").join("");
        for (c = 0; c < Math.abs(Number(a[1])) - d; c++) b += "0"
    }
    return b
};
AmCharts.toScientific = function (a, b) {
    if (0 === a) return "0";
    var c = Math.floor(Math.log(Math.abs(a)) * Math.LOG10E);
    Math.pow(10, c);
    mantissa = String(mantissa).split(".").join(b);
    return String(mantissa) + "e" + c
};
AmCharts.randomColor = function () {
    return "#" + ("00000" + (16777216 * Math.random() << 0).toString(16)).substr(-6)
};
AmCharts.hitTest = function (a, b, c) {
    var d = !1,
        e = a.x,
        f = a.x + a.width,
        g = a.y,
        h = a.y + a.height,
        j = AmCharts.isInRectangle;
    d || (d = j(e, g, b));
    d || (d = j(e, h, b));
    d || (d = j(f, g, b));
    d || (d = j(f, h, b));
    !d && !0 !== c && (d = AmCharts.hitTest(b, a, !0));
    return d
};
AmCharts.isInRectangle = function (a, b, c) {
    return a >= c.x - 5 && a <= c.x + c.width + 5 && b >= c.y - 5 && b <= c.y + c.height + 5 ? !0 : !1
};
AmCharts.isPercents = function (a) {
    if (-1 != String(a).indexOf("%")) return !0
};
AmCharts.dayNames = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
AmCharts.shortDayNames = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
AmCharts.monthNames = "January February March April May June July August September October November December".split(" ");
AmCharts.shortMonthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
AmCharts.getWeekNumber = function (a) {
    a = new Date(a);
    a.setHours(0, 0, 0);
    a.setDate(a.getDate() + 4 - (a.getDay() || 7));
    var b = new Date(a.getFullYear(), 0, 1);
    return Math.ceil(((a - b) / 864E5 + 1) / 7)
};
AmCharts.formatDate = function (a, b) {
    var c, d, e, f, g, h, j, k, l = AmCharts.getWeekNumber(a);
    AmCharts.useUTC ? (c = a.getUTCFullYear(), d = a.getUTCMonth(), e = a.getUTCDate(), f = a.getUTCDay(), g = a.getUTCHours(), h = a.getUTCMinutes(), j = a.getUTCSeconds(), k = a.getUTCMilliseconds()) : (c = a.getFullYear(), d = a.getMonth(), e = a.getDate(), f = a.getDay(), g = a.getHours(), h = a.getMinutes(), j = a.getSeconds(), k = a.getMilliseconds());
    var n = String(c).substr(2, 2),
        q = d + 1;
    9 > d && (q = "0" + q);
    var m = e;
    10 > e && (m = "0" + e);
    var r = "0" + f;
    b = b.replace(/W/g, l);
    l = g;
    24 ==
        l && (l = 0);
    var p = l;
    10 > p && (p = "0" + p);
    b = b.replace(/JJ/g, p);
    b = b.replace(/J/g, l);
    l = g;
    0 === l && (l = 24);
    p = l;
    10 > p && (p = "0" + p);
    b = b.replace(/HH/g, p);
    b = b.replace(/H/g, l);
    l = g;
    11 < l && (l -= 12);
    p = l;
    10 > p && (p = "0" + p);
    b = b.replace(/KK/g, p);
    b = b.replace(/K/g, l);
    l = g;
    0 === l && (l = 12);
    12 < l && (l -= 12);
    p = l;
    10 > p && (p = "0" + p);
    b = b.replace(/LL/g, p);
    b = b.replace(/L/g, l);
    l = h;
    10 > l && (l = "0" + l);
    b = b.replace(/NN/g, l);
    b = b.replace(/N/g, h);
    h = j;
    10 > h && (h = "0" + h);
    b = b.replace(/SS/g, h);
    b = b.replace(/S/g, j);
    j = k;
    10 > j && (j = "00" + j);
    100 > j && (j = "0" + j);
    h = k;
    10 > h && (h = "00" +
        h);
    b = b.replace(/QQQ/g, j);
    b = b.replace(/QQ/g, h);
    b = b.replace(/Q/g, k);
    b = 12 > g ? b.replace(/A/g, "am") : b.replace(/A/g, "pm");
    b = b.replace(/YYYY/g, "@IIII@");
    b = b.replace(/YY/g, "@II@");
    b = b.replace(/MMMM/g, "@XXXX@");
    b = b.replace(/MMM/g, "@XXX@");
    b = b.replace(/MM/g, "@XX@");
    b = b.replace(/M/g, "@X@");
    b = b.replace(/DD/g, "@RR@");
    b = b.replace(/D/g, "@R@");
    b = b.replace(/EEEE/g, "@PPPP@");
    b = b.replace(/EEE/g, "@PPP@");
    b = b.replace(/EE/g, "@PP@");
    b = b.replace(/E/g, "@P@");
    b = b.replace(/@IIII@/g, c);
    b = b.replace(/@II@/g, n);
    b = b.replace(/@XXXX@/g,
        AmCharts.monthNames[d]);
    b = b.replace(/@XXX@/g, AmCharts.shortMonthNames[d]);
    b = b.replace(/@XX@/g, q);
    b = b.replace(/@X@/g, d + 1);
    b = b.replace(/@RR@/g, m);
    b = b.replace(/@R@/g, e);
    b = b.replace(/@PPPP@/g, AmCharts.dayNames[f]);
    b = b.replace(/@PPP@/g, AmCharts.shortDayNames[f]);
    b = b.replace(/@PP@/g, r);
    return b = b.replace(/@P@/g, f)
};
AmCharts.findPosX = function (a) {
    var b = a,
        c = a.offsetLeft;
    if (a.offsetParent) {
        for (; a = a.offsetParent;) c += a.offsetLeft;
        for (;
        (b = b.parentNode) && b != document.body;) c -= b.scrollLeft || 0
    }
    return c
};
AmCharts.findPosY = function (a) {
    var b = a,
        c = a.offsetTop;
    if (a.offsetParent) {
        for (; a = a.offsetParent;) c += a.offsetTop;
        for (;
        (b = b.parentNode) && b != document.body;) c -= b.scrollTop || 0
    }
    return c
};
AmCharts.findIfFixed = function (a) {
    if (a.offsetParent) for (; a = a.offsetParent;) if ("fixed" == AmCharts.getStyle(a, "position")) return !0;
    return !1
};
AmCharts.findIfAuto = function (a) {
    return a.style && "auto" == AmCharts.getStyle(a, "overflow") ? !0 : a.parentNode ? AmCharts.findIfAuto(a.parentNode) : !1
};
AmCharts.findScrollLeft = function (a, b) {
    a.scrollLeft && (b += a.scrollLeft);
    return a.parentNode ? AmCharts.findScrollLeft(a.parentNode, b) : b
};
AmCharts.findScrollTop = function (a, b) {
    a.scrollTop && (b += a.scrollTop);
    return a.parentNode ? AmCharts.findScrollTop(a.parentNode, b) : b
};
AmCharts.formatValue = function (a, b, c, d, e, f, g, h) {
    if (b) {
        void 0 === e && (e = "");
        var j;
        for (j = 0; j < c.length; j++) {
            var k = c[j],
                l = b[k];
            void 0 !== l && (l = f ? AmCharts.addPrefix(l, h, g, d) : AmCharts.formatNumber(l, d), a = a.replace(RegExp("\\[\\[" + e + "" + k + "\\]\\]", "g"), l))
        }
    }
    return a
};
AmCharts.formatDataContextValue = function (a, b) {
    if (a) {
        var c = a.match(/\[\[.*?\]\]/g),
            d;
        for (d = 0; d < c.length; d++) {
            var e = c[d],
                e = e.substr(2, e.length - 4);
            void 0 !== b[e] && (a = a.replace(RegExp("\\[\\[" + e + "\\]\\]", "g"), b[e]))
        }
    }
    return a
};
AmCharts.massReplace = function (a, b) {
    for (var c in b) if (b.hasOwnProperty(c)) {
            var d = b[c];
            void 0 === d && (d = "");
            a = a.replace(c, d)
        }
    return a
};
AmCharts.cleanFromEmpty = function (a) {
    return a.replace(/\[\[[^\]]*\]\]/g, "")
};
AmCharts.addPrefix = function (a, b, c, d, e) {
    var f = AmCharts.formatNumber(a, d),
        g = "",
        h, j, k;
    if (0 === a) return "0";
    0 > a && (g = "-");
    a = Math.abs(a);
    if (1 < a) for (h = b.length - 1; - 1 < h; h--) {
            if (a >= b[h].number && (j = a / b[h].number, k = Number(d.precision), 1 > k && (k = 1), c = AmCharts.roundTo(j, k), !(e && j != c))) {
                f = g + "" + c + "" + b[h].prefix;
                break
            }
    } else for (h = 0; h < c.length; h++) if (a <= c[h].number) {
                j = a / c[h].number;
                k = Math.abs(Math.round(Math.log(j) * Math.LOG10E));
                j = AmCharts.roundTo(j, k);
                f = g + "" + j + "" + c[h].prefix;
                break
            } return f
};
AmCharts.remove = function (a) {
    a && a.remove()
};
AmCharts.copyProperties = function (a, b) {
    for (var c in a) a.hasOwnProperty(c) && "events" != c && (void 0 !== a[c] && "function" != typeof a[c]) && (b[c] = a[c])
};
AmCharts.recommended = function () {
    var a = "js";
    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || swfobject && swfobject.hasFlashPlayerVersion("8") && (a = "flash");
    return a
};
AmCharts.getEffect = function (a) {
    ">" == a && (a = "easeOutSine");
    "<" == a && (a = "easeInSine");
    "elastic" == a && (a = "easeOutElastic");
    return a
};
AmCharts.extend = function (a, b) {
    for (var c in b) void 0 !== b[c] && void 0 === a[c] && (a[c] = b[c])
};
AmCharts.fixNewLines = function (a) {
    9 > AmCharts.IEversion && 0 < AmCharts.IEversion && (a = AmCharts.massReplace(a, {
        "\n": "\r"
    }));
    return a
};
AmCharts.deleteObject = function (a, b) {
    if (a) {
        if (void 0 === b || null === b) b = 20;
        if (0 != b) if ("[object Array]" === Object.prototype.toString.call(a)) for (var c = 0; c < a.length; c++) AmCharts.deleteObject(a[c], b - 1), a[c] = null;
            else try {
                    for (c in a) a[c] && ("object" == typeof a[c] && AmCharts.deleteObject(a[c], b - 1), "function" != typeof a[c] && (a[c] = null))
            } catch (d) {}
    }
};
AmCharts.changeDate = function (a, b, c, d, e) {
    var f = -1;
    void 0 === d && (d = !0);
    void 0 === e && (e = !1);
    !0 === d && (f = 1);
    switch (b) {
    case "YYYY":
        a.setFullYear(a.getFullYear() + c * f);
        !d && !e && a.setDate(a.getDate() + 1);
        break;
    case "MM":
        a.setMonth(a.getMonth() + c * f);
        !d && !e && a.setDate(a.getDate() + 1);
        break;
    case "DD":
        a.setDate(a.getDate() + c * f);
        break;
    case "WW":
        a.setDate(a.getDate() + 7 * c * f + 1);
        break;
    case "hh":
        a.setHours(a.getHours() + c * f);
        break;
    case "mm":
        a.setMinutes(a.getMinutes() + c * f);
        break;
    case "ss":
        a.setSeconds(a.getSeconds() + c * f);
        break;
    case "fff":
        a.setMilliseconds(a.getMilliseconds() + c * f)
    }
    return a
};
AmCharts.Bezier = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g, h, j, k) {
        "object" == typeof g && (g = g[0]);
        "object" == typeof h && (h = h[0]);
        f = {
            fill: g,
            "fill-opacity": h,
            "stroke-width": f
        };
        void 0 !== j && 0 < j && (f["stroke-dasharray"] = j);
        isNaN(e) || (f["stroke-opacity"] = e);
        d && (f.stroke = d);
        d = "M" + Math.round(b[0]) + "," + Math.round(c[0]);
        e = [];
        for (j = 0; j < b.length; j++) e.push({
                x: Number(b[j]),
                y: Number(c[j])
            });
        1 < e.length && (b = this.interpolate(e), d += this.drawBeziers(b));
        k ? d += k : AmCharts.VML || (d += "M0,0 L0,0");
        this.path = a.path(d).attr(f)
    },
    interpolate: function (a) {
        var b = [];
        b.push({
            x: a[0].x,
            y: a[0].y
        });
        var c = a[1].x - a[0].x,
            d = a[1].y - a[0].y,
            e = AmCharts.bezierX,
            f = AmCharts.bezierY;
        b.push({
            x: a[0].x + c / e,
            y: a[0].y + d / f
        });
        var g;
        for (g = 1; g < a.length - 1; g++) {
            var h = a[g - 1],
                j = a[g],
                d = a[g + 1],
                c = d.x - j.x,
                d = d.y - h.y,
                h = j.x - h.x;
            h > c && (h = c);
            b.push({
                x: j.x - h / e,
                y: j.y - d / f
            });
            b.push({
                x: j.x,
                y: j.y
            });
            b.push({
                x: j.x + h / e,
                y: j.y + d / f
            })
        }
        d = a[a.length - 1].y - a[a.length - 2].y;
        c = a[a.length - 1].x - a[a.length - 2].x;
        b.push({
            x: a[a.length - 1].x - c / e,
            y: a[a.length - 1].y - d / f
        });
        b.push({
            x: a[a.length - 1].x,
            y: a[a.length - 1].y
        });
        return b
    },
    drawBeziers: function (a) {
        var b = "",
            c;
        for (c = 0; c < (a.length - 1) / 3; c++) b += this.drawBezierMidpoint(a[3 * c], a[3 * c + 1], a[3 * c + 2], a[3 * c + 3]);
        return b
    },
    drawBezierMidpoint: function (a, b, c, d) {
        var e = Math.round,
            f = this.getPointOnSegment(a, b, 0.75),
            g = this.getPointOnSegment(d, c, 0.75),
            h = (d.x - a.x) / 16,
            j = (d.y - a.y) / 16,
            k = this.getPointOnSegment(a, b, 0.375);
        a = this.getPointOnSegment(f, g, 0.375);
        a.x -= h;
        a.y -= j;
        b = this.getPointOnSegment(g, f, 0.375);
        b.x += h;
        b.y += j;
        c = this.getPointOnSegment(d, c, 0.375);
        h = this.getMiddle(k,
            a);
        f = this.getMiddle(f, g);
        g = this.getMiddle(b, c);
        k = " Q" + e(k.x) + "," + e(k.y) + "," + e(h.x) + "," + e(h.y);
        k += " Q" + e(a.x) + "," + e(a.y) + "," + e(f.x) + "," + e(f.y);
        k += " Q" + e(b.x) + "," + e(b.y) + "," + e(g.x) + "," + e(g.y);
        return k += " Q" + e(c.x) + "," + e(c.y) + "," + e(d.x) + "," + e(d.y)
    },
    getMiddle: function (a, b) {
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    },
    getPointOnSegment: function (a, b, c) {
        return {
            x: a.x + (b.x - a.x) * c,
            y: a.y + (b.y - a.y) * c
        }
    }
});
AmCharts.Cuboid = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g, h, j, k, l, n, q) {
        this.set = a.set();
        this.container = a;
        this.h = Math.round(c);
        this.w = Math.round(b);
        this.dx = d;
        this.dy = e;
        this.colors = f;
        this.alpha = g;
        this.bwidth = h;
        this.bcolor = j;
        this.balpha = k;
        this.colors = f;
        q ? 0 > b && 0 === l && (l = 180) : 0 > c && 270 == l && (l = 90);
        this.gradientRotation = l;
        0 === d && 0 === e && (this.cornerRadius = n);
        this.draw()
    },
    draw: function () {
        var a = this.set;
        a.clear();
        var b = this.container,
            c = this.w,
            d = this.h,
            e = this.dx,
            f = this.dy,
            g = this.colors,
            h = this.alpha,
            j =
                this.bwidth,
            k = this.bcolor,
            l = this.balpha,
            n = this.gradientRotation,
            q = this.cornerRadius,
            m = g,
            r = g;
        "object" == typeof g && (m = g[0], r = g[g.length - 1]);
        var p, u, t, s, w, x, v, y, A;
        if (0 < e || 0 < f) v = r, r = AmCharts.adjustLuminosity(m, -0.2), r = AmCharts.adjustLuminosity(m, -0.2), p = AmCharts.polygon(b, [0, e, c + e, c, 0], [0, f, f, 0, 0], r, h, 0, 0, 0, n), 0 < l && (A = AmCharts.line(b, [0, e, c + e], [0, f, f], k, l, j)), u = AmCharts.polygon(b, [0, 0, c, c, 0], [0, d, d, 0, 0], r, h, 0, 0, 0, 0, n), u.translate(e, f), 0 < l && (t = AmCharts.line(b, [e, e], [f, f + d], k, 1, j)), s = AmCharts.polygon(b, [0, 0, e, e, 0], [0, d, d + f, f, 0], r, h, 0, 0, 0, n), w = AmCharts.polygon(b, [c, c, c + e, c + e, c], [0, d, d + f, f, 0], r, h, 0, 0, 0, n), 0 < l && (x = AmCharts.line(b, [c, c + e, c + e, c], [0, f, d + f, d], k, l, j)), r = AmCharts.adjustLuminosity(v, 0.2), v = AmCharts.polygon(b, [0, e, c + e, c, 0], [d, d + f, d + f, d, d], r, h, 0, 0, 0, n), 0 < l && (y = AmCharts.line(b, [0, e, c + e], [d, d + f, d + f], k, l, j));
        1 > Math.abs(d) && (d = 0);
        1 > Math.abs(c) && (c = 0);
        b = 0 === d ? AmCharts.line(b, [0, c], [0, 0], m, l, j) : 0 === c ? AmCharts.line(b, [0, 0], [0, d], m, l, j) : 0 < q ? AmCharts.rect(b, c, d, g, h, j, k, l, q, n) : AmCharts.polygon(b, [0,
            0, c, c, 0
        ], [0, d, d, 0, 0], g, h, j, k, l, n);
        d = 0 > d ? [p, A, u, t, s, w, x, v, y, b] : [v, y, u, t, s, w, p, A, x, b];
        for (p = 0; p < d.length; p++)(u = d[p]) && a.push(u)
    },
    width: function (a) {
        this.w = a;
        this.draw()
    },
    height: function (a) {
        this.h = a;
        this.draw()
    },
    animateHeight: function (a, b) {
        var c = this;
        c.easing = b;
        c.totalFrames = 1E3 * a / AmCharts.updateRate;
        c.rh = c.h;
        c.frame = 0;
        c.height(1);
        setTimeout(function () {
            c.updateHeight.call(c)
        }, AmCharts.updateRate)
    },
    updateHeight: function () {
        var a = this;
        a.frame++;
        var b = a.totalFrames;
        a.frame <= b && (b = a.easing(0, a.frame, 1, a.rh -
            1, b), a.height(b), setTimeout(function () {
            a.updateHeight.call(a)
        }, AmCharts.updateRate))
    },
    animateWidth: function (a, b) {
        var c = this;
        c.easing = b;
        c.totalFrames = 1E3 * a / AmCharts.updateRate;
        c.rw = c.w;
        c.frame = 0;
        c.width(1);
        setTimeout(function () {
            c.updateWidth.call(c)
        }, AmCharts.updateRate)
    },
    updateWidth: function () {
        var a = this;
        a.frame++;
        var b = a.totalFrames;
        a.frame <= b && (b = a.easing(0, a.frame, 1, a.rw - 1, b), a.width(b), setTimeout(function () {
            a.updateWidth.call(a)
        }, AmCharts.updateRate))
    }
});
AmCharts.AmLegend = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "rollOverItem", "rollOutItem", "clickLabel");
        this.position = "bottom";
        this.borderColor = this.color = "#000000";
        this.borderAlpha = 0;
        this.markerLabelGap = 5;
        this.verticalGap = 10;
        this.align = "left";
        this.horizontalGap = 0;
        this.spacing = 10;
        this.markerDisabledColor = "#AAB3B3";
        this.markerType = "square";
        this.markerSize = 16;
        this.markerBorderThickness = 1;
        this.marginBottom =
            this.marginTop = 0;
        this.marginLeft = this.marginRight = 20;
        this.autoMargins = !0;
        this.valueWidth = 50;
        this.switchable = !0;
        this.switchType = "x";
        this.switchColor = "#FFFFFF";
        this.rollOverColor = "#CC0000";
        this.reversedOrder = !1;
        this.labelText = "[[title]]";
        this.valueText = "[[value]]";
        this.useMarkerColorForLabels = !1;
        this.rollOverGraphAlpha = 1;
        this.textClickEnabled = !1;
        this.equalWidths = !0;
        this.dateFormat = "DD-MM-YYYY";
        this.backgroundColor = "#FFFFFF";
        this.backgroundAlpha = 0;
        this.showEntries = !0
    },
    setData: function (a) {
        this.data = a;
        this.invalidateSize()
    },
    invalidateSize: function () {
        this.destroy();
        this.entries = [];
        this.valueLabels = [];
        AmCharts.ifArray(this.data) && this.drawLegend()
    },
    drawLegend: function () {
        var a = this.chart,
            b = this.position,
            c = this.width,
            d = a.divRealWidth,
            e = a.divRealHeight,
            f = this.div,
            g = this.data;
        isNaN(this.fontSize) && (this.fontSize = a.fontSize);
        if ("right" == b || "left" == b) this.maxColumns = 1, this.marginLeft = this.marginRight = 10;
        else if (this.autoMargins) {
            this.marginRight = a.marginRight;
            this.marginLeft = a.marginLeft;
            var h = a.autoMarginOffset;
            "bottom" == b ? (this.marginBottom = h, this.marginTop = 0) : (this.marginTop = h, this.marginBottom = 0)
        }
        c = void 0 !== c ? AmCharts.toCoordinate(c, d) : a.realWidth;
        "outside" == b ? (c = f.offsetWidth, e = f.offsetHeight, f.clientHeight && (c = f.clientWidth, e = f.clientHeight)) : (f.style.width = c + "px", f.className = "amChartsLegend");
        this.divWidth = c;
        this.container = new AmCharts.AmDraw(f, c, e);
        this.lx = 0;
        this.ly = 8;
        b = this.markerSize;
        b > this.fontSize && (this.ly = b / 2 - 1);
        0 < b && (this.lx += b + this.markerLabelGap);
        this.titleWidth = 0;
        if (b = this.title) a = AmCharts.text(this.container,
                b, this.color, a.fontFamily, this.fontSize, "start", !0), a.translate(0, this.marginTop + this.verticalGap + this.ly + 1), a = a.getBBox(), this.titleWidth = a.width + 15, this.titleHeight = a.height + 6;
        this.index = this.maxLabelWidth = 0;
        if (this.showEntries) {
            for (a = 0; a < g.length; a++) this.createEntry(g[a]);
            for (a = this.index = 0; a < g.length; a++) this.createValue(g[a])
        }
        this.arrangeEntries();
        this.updateValues()
    },
    arrangeEntries: function () {
        var a = this.position,
            b = this.marginLeft + this.titleWidth,
            c = this.marginRight,
            d = this.marginTop,
            e = this.marginBottom,
            f = this.horizontalGap,
            g = this.div,
            h = this.divWidth,
            j = this.maxColumns,
            k = this.verticalGap,
            l = this.spacing,
            n = h - c - b,
            q = 0,
            m = 0,
            r = this.container,
            p = r.set();
        this.set = p;
        r = r.set();
        p.push(r);
        var u = this.entries,
            t, s;
        for (s = 0; s < u.length; s++) {
            t = u[s].getBBox();
            var w = t.width;
            w > q && (q = w);
            t = t.height;
            t > m && (m = t)
        }
        var x = w = 0,
            v = f;
        for (s = 0; s < u.length; s++) {
            var y = u[s];
            this.reversedOrder && (y = u[u.length - s - 1]);
            t = y.getBBox();
            var A;
            this.equalWidths ? A = f + x * (q + l + this.markerLabelGap) : (A = v, v = v + t.width + f + l);
            A + t.width > n && (0 < s && 0 != x) && (w++, x = 0, A =
                f, v = A + t.width + f + l, skipNewRow = !0);
            y.translate(A, (m + k) * w);
            x++;
            !isNaN(j) && x >= j && (x = 0, w++);
            r.push(y)
        }
        t = r.getBBox();
        j = t.height + 2 * k - 1;
        "left" == a || "right" == a ? (h = t.width + 2 * f, g.style.width = h + b + c + "px") : h = h - b - c - 1;
        c = AmCharts.polygon(this.container, [0, h, h, 0], [0, 0, j, j], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        p.push(c);
        p.translate(b, d);
        c.toBack();
        b = f;
        if ("top" == a || "bottom" == a || "absolute" == a || "outside" == a) "center" == this.align ? b = f + (h - t.width) / 2 : "right" == this.align && (b = f + h - t.width);
        r.translate(b, k + 1);
        this.titleHeight > j && (j = this.titleHeight);
        a = j + d + e + 1;
        0 > a && (a = 0);
        g.style.height = Math.round(a) + "px"
    },
    createEntry: function (a) {
        if (!1 !== a.visibleInLegend) {
            var b = this.chart,
                c = a.markerType;
            c || (c = this.markerType);
            var d = a.color,
                e = a.alpha;
            a.legendKeyColor && (d = a.legendKeyColor());
            a.legendKeyAlpha && (e = a.legendKeyAlpha());
            !0 === a.hidden && (d = this.markerDisabledColor);
            var f = this.createMarker(c, d, e);
            this.addListeners(f, a);
            e = this.container.set([f]);
            this.switchable && e.setAttr("cursor", "pointer");
            var g =
                this.switchType;
            if (g) {
                var h;
                h = "x" == g ? this.createX() : this.createV();
                h.dItem = a;
                !0 !== a.hidden ? "x" == g ? h.hide() : h.show() : "x" != g && h.hide();
                this.switchable || h.hide();
                this.addListeners(h, a);
                a.legendSwitch = h;
                e.push(h)
            }
            g = this.color;
            a.showBalloon && (this.textClickEnabled && void 0 !== this.selectedColor) && (g = this.selectedColor);
            this.useMarkerColorForLabels && (g = d);
            !0 === a.hidden && (g = this.markerDisabledColor);
            var d = AmCharts.massReplace(this.labelText, {
                "[[title]]": a.title
            }),
                j = this.fontSize,
                k = this.markerSize;
            if (f && k <=
                j) {
                var l = 0;
                if ("bubble" == c || "circle" == c) l = k / 2;
                c = l + this.ly - j / 2 + (j + 2 - k) / 2;
                f.translate(l, c);
                h && h.translate(l, c)
            }
            var n;
            d && (n = AmCharts.text(this.container, d, g, b.fontFamily, j, "start"), n.translate(this.lx, this.ly), e.push(n), b = n.getBBox().width, this.maxLabelWidth < b && (this.maxLabelWidth = b));
            this.entries[this.index] = e;
            a.legendEntry = this.entries[this.index];
            a.legendLabel = n;
            this.index++
        }
    },
    addListeners: function (a, b) {
        var c = this;
        a && a.mouseover(function () {
            c.rollOverMarker(b)
        }).mouseout(function () {
            c.rollOutMarker(b)
        }).click(function () {
            c.clickMarker(b)
        })
    },
    rollOverMarker: function (a) {
        this.switchable && this.dispatch("rollOverMarker", a);
        this.dispatch("rollOverItem", a)
    },
    rollOutMarker: function (a) {
        this.switchable && this.dispatch("rollOutMarker", a);
        this.dispatch("rollOutItem", a)
    },
    clickMarker: function (a) {
        this.switchable ? !0 === a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a) : this.textClickEnabled && this.dispatch("clickMarker", a)
    },
    rollOverLabel: function (a) {
        a.hidden || (this.textClickEnabled && a.legendLabel && a.legendLabel.attr({
            fill: this.rollOverColor
        }),
            this.dispatch("rollOverItem", a))
    },
    rollOutLabel: function (a) {
        if (!a.hidden) {
            if (this.textClickEnabled && a.legendLabel) {
                var b = this.color;
                void 0 !== this.selectedColor && a.showBalloon && (b = this.selectedColor);
                this.useMarkerColorForLabels && (b = a.lineColor, void 0 === b && (b = a.color));
                a.legendLabel.attr({
                    fill: b
                })
            }
            this.dispatch("rollOutItem", a)
        }
    },
    clickLabel: function (a) {
        this.textClickEnabled ? a.hidden || this.dispatch("clickLabel", a) : this.switchable && (!0 === a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a))
    },
    dispatch: function (a, b) {
        this.fire(a, {
            type: a,
            dataItem: b,
            target: this,
            chart: this.chart
        })
    },
    createValue: function (a) {
        var b = this,
            c = b.fontSize;
        if (!1 !== a.visibleInLegend) {
            var d = b.maxLabelWidth;
            b.equalWidths || (b.valueAlign = "left");
            "left" == b.valueAlign && (d = a.legendEntry.getBBox().width);
            var e = d;
            if (b.valueText) {
                var f = b.color;
                b.useMarkerColorForValues && (f = a.color, a.legendKeyColor && (f = a.legendKeyColor()));
                !0 === a.hidden && (f = b.markerDisabledColor);
                var g = b.valueText,
                    d = d + b.lx + b.markerLabelGap + b.valueWidth,
                    h = "end";
                "left" ==
                    b.valueAlign && (d -= b.valueWidth, h = "start");
                f = AmCharts.text(b.container, g, f, b.chart.fontFamily, c, h);
                f.translate(d, b.ly);
                b.entries[b.index].push(f);
                e += b.valueWidth + 2 * b.markerLabelGap;
                f.dItem = a;
                b.valueLabels.push(f)
            }
            b.index++;
            f = b.markerSize;
            f < c + 7 && (f = c + 7, AmCharts.VML && (f += 3));
            c = b.container.rect(b.markerSize, 0, e, f, 0, 0).attr({
                stroke: "none",
                fill: "#ffffff",
                "fill-opacity": 0.005
            });
            c.dItem = a;
            b.entries[b.index - 1].push(c);
            c.mouseover(function () {
                b.rollOverLabel(a)
            }).mouseout(function () {
                b.rollOutLabel(a)
            }).click(function () {
                b.clickLabel(a)
            })
        }
    },
    createV: function () {
        var a = this.markerSize;
        return AmCharts.polygon(this.container, [a / 5, a / 2, a - a / 5, a / 2], [a / 3, a - a / 5, a / 5, a / 1.7], this.switchColor)
    },
    createX: function () {
        var a = this.markerSize - 3,
            b = {
                stroke: this.switchColor,
                "stroke-width": 3
            }, c = this.container,
            d = AmCharts.line(c, [3, a], [3, a]).attr(b),
            a = AmCharts.line(c, [3, a], [a, 3]).attr(b);
        return this.container.set([d, a])
    },
    createMarker: function (a, b, c) {
        var d = this.markerSize,
            e = this.container,
            f, g = this.markerBorderColor;
        g || (g = b);
        var h = this.markerBorderThickness,
            j = this.markerBorderAlpha;
        switch (a) {
        case "square":
            f = AmCharts.polygon(e, [0, d, d, 0], [0, 0, d, d], b, c, h, g, j);
            break;
        case "circle":
            f = AmCharts.circle(e, d / 2, b, c, h, g, j);
            f.translate(d / 2, d / 2);
            break;
        case "line":
            f = AmCharts.line(e, [0, d], [d / 2, d / 2], b, c, h);
            break;
        case "dashedLine":
            f = AmCharts.line(e, [0, d], [d / 2, d / 2], b, c, h, 3);
            break;
        case "triangleUp":
            f = AmCharts.polygon(e, [0, d / 2, d, d], [d, 0, d, d], b, c, h, g, j);
            break;
        case "triangleDown":
            f = AmCharts.polygon(e, [0, d / 2, d, d], [0, d, 0, 0], b, c, h, g, j);
            break;
        case "bubble":
            f = AmCharts.circle(e, d / 2, b, c, h, g, j, !0), f.translate(d /
                2, d / 2)
        }
        return f
    },
    validateNow: function () {
        this.invalidateSize()
    },
    updateValues: function () {
        var a = this.valueLabels,
            b = this.chart,
            c;
        for (c = 0; c < a.length; c++) {
            var d = a[c],
                e = d.dItem;
            if (void 0 !== e.type) {
                var f = e.currentDataItem;
                if (f) {
                    var g = this.valueText;
                    e.legendValueText && (g = e.legendValueText);
                    e = g;
                    e = b.formatString(e, f);
                    d.text(e)
                } else d.text(" ")
            } else f = b.formatString(this.valueText, e), d.text(f)
        }
    },
    renderFix: function () {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    },
    destroy: function () {
        this.div.innerHTML =
            "";
        AmCharts.remove(this.set)
    }
});
AmCharts.AmBalloon = AmCharts.Class({
    construct: function () {
        this.enabled = !0;
        this.fillColor = "#CC0000";
        this.fillAlpha = 1;
        this.borderThickness = 2;
        this.borderColor = "#FFFFFF";
        this.borderAlpha = 1;
        this.cornerRadius = 6;
        this.maximumWidth = 220;
        this.horizontalPadding = 8;
        this.verticalPadding = 5;
        this.pointerWidth = 10;
        this.pointerOrientation = "V";
        this.color = "#FFFFFF";
        this.textShadowColor = "#000000";
        this.adjustBorderColor = !1;
        this.showBullet = !0;
        this.show = this.follow = !1;
        this.bulletSize = 3;
        this.textAlign = "middle"
    },
    draw: function () {
        var a =
            this.pointToX,
            b = this.pointToY,
            c = this.textAlign;
        if (!isNaN(a)) {
            var d = this.chart,
                e = d.container,
                f = this.set;
            AmCharts.remove(f);
            AmCharts.remove(this.pointer);
            this.set = f = e.set();
            d.balloonsSet.push(f);
            if (this.show) {
                var g = this.l,
                    h = this.t,
                    j = this.r,
                    k = this.b,
                    l = this.textShadowColor;
                this.color == l && (l = void 0);
                var n = this.balloonColor,
                    q = this.fillColor,
                    m = this.borderColor;
                void 0 != n && (this.adjustBorderColor ? m = n : q = n);
                var r = this.horizontalPadding,
                    n = this.verticalPadding,
                    p = this.pointerWidth,
                    u = this.pointerOrientation,
                    t = this.cornerRadius,
                    s = d.fontFamily,
                    w = this.fontSize;
                void 0 == w && (w = d.fontSize);
                d = AmCharts.text(e, this.text, this.color, s, w, c);
                f.push(d);
                var x;
                void 0 != l && (x = AmCharts.text(e, this.text, l, s, w, c, !1, 0.4), f.push(x));
                s = d.getBBox();
                l = s.height + 2 * n;
                s = s.width + 2 * r;
                window.opera && (l += 2);
                var v, w = w / 2 + n;
                switch (c) {
                case "middle":
                    v = s / 2;
                    break;
                case "left":
                    v = r;
                    break;
                case "right":
                    v = s - r
                }
                d.translate(v, w);
                x && x.translate(v + 1, w + 1);
                "H" != u ? (v = a - s / 2, c = b < h + l + 10 && "down" != u ? b + p : b - l - p) : (2 * p > l && (p = l / 2), c = b - l / 2, v = a < g + (j - g) / 2 ? a + p : a - s - p);
                c + l >= k && (c = k - l);
                c < h &&
                    (c = h);
                v < g && (v = g);
                v + s > j && (v = j - s);
                0 < t || 0 === p ? (m = AmCharts.rect(e, s, l, q, this.fillAlpha, this.borderThickness, m, this.borderAlpha, this.cornerRadius), this.showBullet && (e = AmCharts.circle(e, this.bulletSize, q, this.fillAlpha), e.translate(a, b), this.pointer = e)) : (k = [], t = [], "H" != u ? (g = a - v, g > s - p && (g = s - p), g < p && (g = p), k = [0, g - p, a - v, g + p, s, s, 0, 0], t = b < h + l + 10 && "down" != u ? [0, 0, b - c, 0, 0, l, l, 0] : [l, l, b - c, l, l, 0, 0, l]) : (h = b - c, h > l - p && (h = l - p), h < p && (h = p), t = [0, h - p, b - c, h + p, l, l, 0, 0], k = a < g + (j - g) / 2 ? [0, 0, v < a ? 0 : a - v, 0, 0, s, s, 0] : [s, s, v + s > a ? s : a -
                        v, s, s, 0, 0, s
                ]), m = AmCharts.polygon(e, k, t, q, this.fillAlpha, this.borderThickness, m, this.borderAlpha));
                f.push(m);
                m.toFront();
                x && x.toFront();
                d.toFront();
                a = 1;
                9 > AmCharts.IEversion && this.follow && (a = 6);
                f.translate(v - a, c);
                f = d.getBBox();
                this.bottom = c + f.y + f.height + 2 * n + 2;
                this.yPos = f.y + c
            }
        }
    },
    followMouse: function () {
        if (this.follow && this.show) {
            var a = this.chart.mouseX,
                b = this.chart.mouseY - 3;
            this.pointToX = a;
            this.pointToY = b;
            if (a != this.previousX || b != this.previousY) if (this.previousX = a, this.previousY = b, 0 === this.cornerRadius) this.draw();
                else {
                    var c = this.set;
                    if (c) {
                        var d = c.getBBox(),
                            a = a - d.width / 2,
                            e = b - d.height - 10;
                        a < this.l && (a = this.l);
                        a > this.r - d.width && (a = this.r - d.width);
                        e < this.t && (e = b + 10);
                        c.translate(a, e)
                    }
                }
        }
    },
    changeColor: function (a) {
        this.balloonColor = a
    },
    setBounds: function (a, b, c, d) {
        this.l = a;
        this.t = b;
        this.r = c;
        this.b = d
    },
    showBalloon: function (a) {
        this.text = a;
        this.show = !0;
        this.draw()
    },
    hide: function () {
        this.follow = this.show = !1;
        this.destroy()
    },
    setPosition: function (a, b, c) {
        this.pointToX = a;
        this.pointToY = b;
        c && (a != this.previousX || b != this.previousY) &&
            this.draw();
        this.previousX = a;
        this.previousY = b
    },
    followCursor: function (a) {
        var b = this;
        (b.follow = a) ? (b.pShowBullet = b.showBullet, b.showBullet = !1) : void 0 !== b.pShowBullet && (b.showBullet = b.pShowBullet);
        clearInterval(b.interval);
        var c = b.chart.mouseX,
            d = b.chart.mouseY;
        !isNaN(c) && a && (b.pointToX = c, b.pointToY = d - 3, b.interval = setInterval(function () {
            b.followMouse.call(b)
        }, 40))
    },
    destroy: function () {
        clearInterval(this.interval);
        AmCharts.remove(this.set);
        this.set = null;
        AmCharts.remove(this.pointer);
        this.pointer = null
    }
});
AmCharts.AmCoordinateChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function () {
        AmCharts.AmCoordinateChart.base.construct.call(this);
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem");
        this.plotAreaFillColors = "#FFFFFF";
        this.plotAreaFillAlphas = 0;
        this.plotAreaBorderColor = "#000000";
        this.plotAreaBorderAlpha = 0;
        this.startAlpha = 1;
        this.startDuration = 0;
        this.startEffect = "elastic";
        this.sequencedAnimation = !0;
        this.colors = "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
        this.balloonDateFormat = "MMM DD, YYYY";
        this.valueAxes = [];
        this.graphs = []
    },
    initChart: function () {
        AmCharts.AmCoordinateChart.base.initChart.call(this);
        this.createValueAxes();
        AmCharts.VML && (this.startAlpha = 1);
        var a = this.legend;
        a && a.setData(this.graphs)
    },
    createValueAxes: function () {
        if (0 === this.valueAxes.length) {
            var a = new AmCharts.ValueAxis;
            this.addValueAxis(a)
        }
    },
    parseData: function () {
        this.processValueAxes();
        this.processGraphs()
    },
    parseSerialData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        var a =
            this.graphs,
            b, c = {}, d = this.seriesIdField;
        d || (d = this.categoryField);
        this.chartData = [];
        var e = this.dataProvider;
        if (e) {
            var f = !1,
                g, h = this.categoryAxis;
            if (h) {
                var f = h.parseDates,
                    j = h.forceShowField;
                g = h.categoryFunction
            }
            var k, l;
            f && (b = AmCharts.extractPeriod(h.minPeriod), k = b.period, l = b.count);
            var n = {};
            this.lookupTable = n;
            var q;
            for (q = 0; q < e.length; q++) {
                var m = {}, r = e[q];
                b = r[this.categoryField];
                m.category = g ? g(b, r, h) : String(b);
                j && (m.forceShow = r[j]);
                n[r[d]] = m;
                f && (b = h.categoryFunction ? h.categoryFunction(b, r, h) : isNaN(b) ?
                    new Date(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds(), b.getMilliseconds()) : new Date(b), b = AmCharts.resetDateToMin(b, k, l), m.category = b, m.time = b.getTime());
                var p = this.valueAxes;
                m.axes = {};
                m.x = {};
                var u;
                for (u = 0; u < p.length; u++) {
                    var t = p[u].id;
                    m.axes[t] = {};
                    m.axes[t].graphs = {};
                    var s;
                    for (s = 0; s < a.length; s++) {
                        b = a[s];
                        var w = b.id,
                            x = b.periodValue;
                        if (b.valueAxis.id == t) {
                            m.axes[t].graphs[w] = {};
                            var v = {};
                            v.index = q;
                            b.dataProvider && (r = c);
                            v.values = this.processValues(r, b, x);
                            this.processFields(b,
                                v, r);
                            v.category = m.category;
                            v.serialDataItem = m;
                            v.graph = b;
                            m.axes[t].graphs[w] = v
                        }
                    }
                }
                this.chartData[q] = m
            }
        }
        for (c = 0; c < a.length; c++) b = a[c], b.dataProvider && this.parseGraphData(b)
    },
    processValues: function (a, b, c) {
        var d = {}, e, f = !1;
        if (("candlestick" == b.type || "ohlc" == b.type) && "" !== c) f = !0;
        e = Number(a[b.valueField + c]);
        isNaN(e) || (d.value = e);
        f && (c = "Open");
        e = Number(a[b.openField + c]);
        isNaN(e) || (d.open = e);
        f && (c = "Close");
        e = Number(a[b.closeField + c]);
        isNaN(e) || (d.close = e);
        f && (c = "Low");
        e = Number(a[b.lowField + c]);
        isNaN(e) || (d.low =
            e);
        f && (c = "High");
        e = Number(a[b.highField + c]);
        isNaN(e) || (d.high = e);
        return d
    },
    parseGraphData: function (a) {
        var b = a.dataProvider,
            c = a.seriesIdField;
        c || (c = this.seriesIdField);
        c || (c = this.categoryField);
        var d;
        for (d = 0; d < b.length; d++) {
            var e = b[d],
                f = this.lookupTable[String(e[c])],
                g = a.valueAxis.id;
            f && (g = f.axes[g].graphs[a.id], g.serialDataItem = f, g.values = this.processValues(e, a, a.periodValue), this.processFields(a, g, e))
        }
    },
    addValueAxis: function (a) {
        a.chart = this;
        this.valueAxes.push(a);
        this.validateData()
    },
    removeValueAxesAndGraphs: function () {
        var a =
            this.valueAxes,
            b;
        for (b = a.length - 1; - 1 < b; b--) this.removeValueAxis(a[b])
    },
    removeValueAxis: function (a) {
        var b = this.graphs,
            c;
        for (c = b.length - 1; 0 <= c; c--) {
            var d = b[c];
            d && d.valueAxis == a && this.removeGraph(d)
        }
        b = this.valueAxes;
        for (c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1);
        this.validateData()
    },
    addGraph: function (a) {
        this.graphs.push(a);
        this.chooseGraphColor(a, this.graphs.length - 1);
        this.validateData()
    },
    removeGraph: function (a) {
        var b = this.graphs,
            c;
        for (c = b.length - 1; 0 <= c; c--) b[c] == a && (b.splice(c, 1), a.destroy());
        this.validateData()
    },
    processValueAxes: function () {
        var a = this.valueAxes,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.id || (c.id = "valueAxis" + b + "_" + (new Date).getTime());
            if (!0 === this.usePrefixes || !1 === this.usePrefixes) c.usePrefixes = this.usePrefixes
        }
    },
    processGraphs: function () {
        var a = this.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.valueAxis || (c.valueAxis = this.valueAxes[0]);
            c.id || (c.id = "graph" + b + "_" + (new Date).getTime())
        }
    },
    formatString: function (a, b) {
        var c = b.graph,
            d = c.valueAxis;
        d.duration && b.values.value &&
            (d = AmCharts.formatDuration(b.values.value, d.duration, "", d.durationUnits, d.maxInterval, d.numberFormatter), a = a.split("[[value]]").join(d));
        a = AmCharts.massReplace(a, {
            "[[title]]": c.title,
            "[[description]]": b.description,
            "<br>": "\n"
        });
        a = AmCharts.fixNewLines(a);
        return a = AmCharts.cleanFromEmpty(a)
    },
    getBalloonColor: function (a, b) {
        var c = a.lineColor,
            d = a.balloonColor,
            e = a.fillColors;
        "object" == typeof e ? c = e[0] : void 0 !== e && (c = e);
        if (b.isNegative) {
            var e = a.negativeLineColor,
                f = a.negativeFillColors;
            "object" == typeof f ?
                e = f[0] : void 0 !== f && (e = f);
            void 0 !== e && (c = e)
        }
        void 0 !== b.color && (c = b.color);
        void 0 === d && (d = c);
        return d
    },
    getGraphById: function (a) {
        return this.getObjById(this.graphs, a)
    },
    getValueAxisById: function (a) {
        return this.getObjById(this.valueAxes, a)
    },
    getObjById: function (a, b) {
        var c, d;
        for (d = 0; d < a.length; d++) {
            var e = a[d];
            e.id == b && (c = e)
        }
        return c
    },
    processFields: function (a, b, c) {
        if (a.itemColors) {
            var d = a.itemColors,
                e = b.index;
            b.color = e < d.length ? d[e] : AmCharts.randomColor()
        }
        d = "lineColor color alpha fillColors description bullet customBullet bulletSize bulletConfig url labelColor".split(" ");
        for (e = 0; e < d.length; e++) {
            var f = d[e],
                g = a[f + "Field"];
            g && (g = c[g], AmCharts.isDefined(g) && (b[f] = g))
        }
        b.dataContext = c
    },
    chooseGraphColor: function (a, b) {
        if (void 0 == a.lineColor) {
            var c;
            c = this.colors.length > b ? this.colors[b] : AmCharts.randomColor();
            a.lineColor = c
        }
    },
    handleLegendEvent: function (a) {
        var b = a.type;
        if (a = a.dataItem) {
            var c = a.hidden,
                d = a.showBalloon;
            switch (b) {
            case "clickMarker":
                d ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                break;
            case "clickLabel":
                d ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                break;
            case "rollOverItem":
                c || this.highlightGraph(a);
                break;
            case "rollOutItem":
                c || this.unhighlightGraph();
                break;
            case "hideItem":
                this.hideGraph(a);
                break;
            case "showItem":
                this.showGraph(a)
            }
        }
    },
    highlightGraph: function (a) {
        var b = this.graphs,
            c, d = 0.2;
        this.legend && (d = this.legend.rollOverGraphAlpha);
        if (1 != d) for (c = 0; c < b.length; c++) {
                var e = b[c];
                e != a && e.changeOpacity(d)
        }
    },
    unhighlightGraph: function () {
        this.legend && (alpha = this.legend.rollOverGraphAlpha);
        if (1 != alpha) {
            var a = this.graphs,
                b;
            for (b = 0; b < a.length; b++) a[b].changeOpacity(1)
        }
    },
    showGraph: function (a) {
        a.hidden = !1;
        this.dataChanged = !0;
        this.marginsUpdated = !1;
        this.chartCreated && this.initChart()
    },
    hideGraph: function (a) {
        this.dataChanged = !0;
        this.marginsUpdated = !1;
        a.hidden = !0;
        this.chartCreated && this.initChart()
    },
    hideGraphsBalloon: function (a) {
        a.showBalloon = !1;
        this.updateLegend()
    },
    showGraphsBalloon: function (a) {
        a.showBalloon = !0;
        this.updateLegend()
    },
    updateLegend: function () {
        this.legend && this.legend.invalidateSize()
    },
    resetAnimation: function () {
        var a = this.graphs;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) a[b].animationPlayed = !1
        }
    },
    animateAgain: function () {
        this.resetAnimation();
        this.validateNow()
    }
});
AmCharts.AmRectangularChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,
    construct: function () {
        AmCharts.AmRectangularChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 20;
        this.verticalPosition = this.horizontalPosition = this.depth3D = this.angle = 0;
        this.heightMultiplier = this.widthMultiplier = 1;
        this.zoomOutText = "Show all";
        this.zoomOutButton = {
            backgroundColor: "#b2e1ff",
            backgroundAlpha: 1
        };
        this.trendLines = [];
        this.autoMargins = !0;
        this.marginsUpdated = !1;
        this.autoMarginOffset = 10
    },
    initChart: function () {
        AmCharts.AmRectangularChart.base.initChart.call(this);
        this.updateDxy();
        var a = !0;
        !this.marginsUpdated && this.autoMargins && (this.resetMargins(), a = !1);
        this.updateMargins();
        this.updatePlotArea();
        this.updateScrollbars();
        this.updateTrendLines();
        this.updateChartCursor();
        this.updateValueAxes();
        a && (this.scrollbarOnly || this.updateGraphs())
    },
    drawChart: function () {
        AmCharts.AmRectangularChart.base.drawChart.call(this);
        this.drawPlotArea();
        if (AmCharts.ifArray(this.chartData)) {
            var a =
                this.chartCursor;
            a && a.draw();
            a = this.zoomOutText;
            "" !== a && a && this.drawZoomOutButton()
        }
    },
    resetMargins: function () {
        var a = {}, b;
        if ("serial" == this.chartType) {
            var c = this.valueAxes;
            for (b = 0; b < c.length; b++) {
                var d = c[b];
                d.ignoreAxisWidth || (d.setOrientation(this.rotate), d.fixAxisPosition(), a[d.position] = !0)
            }
            if ((b = this.categoryAxis) && !b.ignoreAxisWidth) b.setOrientation(!this.rotate), b.fixAxisPosition(), b.fixAxisPosition(), a[b.position] = !0
        } else {
            d = this.xAxes;
            c = this.yAxes;
            for (b = 0; b < d.length; b++) {
                var e = d[b];
                e.ignoreAxisWidth ||
                    (e.setOrientation(!0), e.fixAxisPosition(), a[e.position] = !0)
            }
            for (b = 0; b < c.length; b++) d = c[b], d.ignoreAxisWidth || (d.setOrientation(!1), d.fixAxisPosition(), a[d.position] = !0)
        }
        a.left && (this.marginLeft = 0);
        a.right && (this.marginRight = 0);
        a.top && (this.marginTop = 0);
        a.bottom && (this.marginBottom = 0);
        this.fixMargins = a
    },
    measureMargins: function () {
        var a = this.valueAxes,
            b, c = this.autoMarginOffset,
            d = this.fixMargins,
            e = this.realWidth,
            f = this.realHeight,
            g = c,
            h = c,
            j = e - c;
        b = f - c;
        var k;
        for (k = 0; k < a.length; k++) b = this.getAxisBounds(a[k],
                g, j, h, b), g = b.l, j = b.r, h = b.t, b = b.b;
        if (a = this.categoryAxis) b = this.getAxisBounds(a, g, j, h, b), g = b.l, j = b.r, h = b.t, b = b.b;
        d.left && g < c && (this.marginLeft = Math.round(-g + c));
        d.right && j > e - c && (this.marginRight = Math.round(j - e + c));
        d.top && h < c + this.titleHeight && (this.marginTop = Math.round(this.marginTop - h + c + this.titleHeight));
        d.bottom && b > f - c && (this.marginBottom = Math.round(b - f + c));
        this.resetAnimation();
        this.initChart()
    },
    getAxisBounds: function (a, b, c, d, e) {
        if (!a.ignoreAxisWidth) {
            var f = a.labelsSet,
                g = a.tickLength;
            a.inside &&
                (g = 0);
            if (f) switch (f = a.getBBox(), a.position) {
                case "top":
                    a = f.y;
                    d > a && (d = a);
                    break;
                case "bottom":
                    a = f.y + f.height;
                    e < a && (e = a);
                    break;
                case "right":
                    a = f.x + f.width + g + 3;
                    c < a && (c = a);
                    break;
                case "left":
                    a = f.x - g, b > a && (b = a)
            }
        }
        return {
            l: b,
            t: d,
            r: c,
            b: e
        }
    },
    drawZoomOutButton: function () {
        var a = this,
            b = a.container.set();
        a.zoomButtonSet.push(b);
        var c = a.color,
            d = a.fontSize,
            e = a.zoomOutButton;
        e && (e.fontSize && (d = e.fontSize), e.color && (c = e.color));
        c = AmCharts.text(a.container, a.zoomOutText, c, a.fontFamily, d, "start");
        d = c.getBBox();
        c.translate(29,
            6 + d.height / 2);
        e = AmCharts.rect(a.container, d.width + 40, d.height + 15, e.backgroundColor, e.backgroundAlpha);
        b.push(e);
        a.zbBG = e;
        void 0 !== a.pathToImages && (e = a.container.image(a.pathToImages + "lens.png", 0, 0, 16, 16), e.translate(7, d.height / 2 - 1), e.toFront(), b.push(e));
        c.toFront();
        b.push(c);
        e = b.getBBox();
        b.translate(a.marginLeftReal + a.plotAreaWidth - e.width, a.marginTopReal);
        b.hide();
        b.mouseover(function () {
            a.rollOverZB()
        }).mouseout(function () {
            a.rollOutZB()
        }).click(function () {
            a.clickZB()
        }).touchstart(function () {
            a.rollOverZB()
        }).touchend(function () {
            a.rollOutZB();
            a.clickZB()
        });
        for (e = 0; e < b.length; e++) b[e].attr({
                cursor: "pointer"
            });
        a.zbSet = b
    },
    rollOverZB: function () {
        this.zbBG.show()
    },
    rollOutZB: function () {
        this.zbBG.hide()
    },
    clickZB: function () {
        this.zoomOut()
    },
    zoomOut: function () {
        this.updateScrollbar = !0;
        this.zoom()
    },
    drawPlotArea: function () {
        var a = this.dx,
            b = this.dy,
            c = this.marginLeftReal,
            d = this.marginTopReal,
            e = this.plotAreaWidth - 1,
            f = this.plotAreaHeight - 1,
            g = this.plotAreaFillColors,
            h = this.plotAreaFillAlphas,
            j = this.plotAreaBorderColor,
            k = this.plotAreaBorderAlpha;
        this.trendLinesSet.clipRect(c,
            d, e, f);
        "object" == typeof h && (h = h[0]);
        g = AmCharts.polygon(this.container, [0, e, e, 0], [0, 0, f, f], g, h, 1, j, k, this.plotAreaGradientAngle);
        g.translate(c + a, d + b);
        g.node.setAttribute("class", "amChartsPlotArea");
        this.set.push(g);
        0 !== a && 0 !== b && (g = this.plotAreaFillColors, "object" == typeof g && (g = g[0]), g = AmCharts.adjustLuminosity(g, -0.15), e = AmCharts.polygon(this.container, [0, a, e + a, e, 0], [0, b, b, 0, 0], g, h, 1, j, k), e.translate(c, d + f), this.set.push(e), a = AmCharts.polygon(this.container, [0, 0, a, a, 0], [0, f, f + b, b, 0], g, h, 1, j, k), a.translate(c,
            d), this.set.push(a))
    },
    updatePlotArea: function () {
        var a = this.updateWidth(),
            b = this.updateHeight(),
            c = this.container;
        this.realWidth = a;
        this.realWidth = b;
        c && this.container.setSize(a, b);
        a = a - this.marginLeftReal - this.marginRightReal - this.dx;
        b = b - this.marginTopReal - this.marginBottomReal;
        1 > a && (a = 1);
        1 > b && (b = 1);
        this.plotAreaWidth = Math.round(a);
        this.plotAreaHeight = Math.round(b)
    },
    updateDxy: function () {
        this.dx = Math.round(this.depth3D * Math.cos(this.angle * Math.PI / 180));
        this.dy = Math.round(-this.depth3D * Math.sin(this.angle *
            Math.PI / 180))
    },
    updateMargins: function () {
        var a = this.getTitleHeight();
        this.titleHeight = a;
        this.marginTopReal = this.marginTop - this.dy + a;
        this.marginBottomReal = this.marginBottom;
        this.marginLeftReal = this.marginLeft;
        this.marginRightReal = this.marginRight
    },
    updateValueAxes: function () {
        var a = this.valueAxes,
            b = this.marginLeftReal,
            c = this.marginTopReal,
            d = this.plotAreaHeight,
            e = this.plotAreaWidth,
            f;
        for (f = 0; f < a.length; f++) {
            var g = a[f];
            g.axisRenderer = AmCharts.RecAxis;
            g.guideFillRenderer = AmCharts.RecFill;
            g.axisItemRenderer =
                AmCharts.RecItem;
            g.dx = this.dx;
            g.dy = this.dy;
            g.viW = e - 1;
            g.viH = d - 1;
            g.marginsChanged = !0;
            g.viX = b;
            g.viY = c;
            this.updateObjectSize(g)
        }
    },
    updateObjectSize: function (a) {
        a.width = (this.plotAreaWidth - 1) * this.widthMultiplier;
        a.height = (this.plotAreaHeight - 1) * this.heightMultiplier;
        a.x = this.marginLeftReal + this.horizontalPosition;
        a.y = this.marginTopReal + this.verticalPosition
    },
    updateGraphs: function () {
        var a = this.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.x = this.marginLeftReal + this.horizontalPosition;
            c.y = this.marginTopReal +
                this.verticalPosition;
            c.width = this.plotAreaWidth * this.widthMultiplier;
            c.height = this.plotAreaHeight * this.heightMultiplier;
            c.index = b;
            c.dx = this.dx;
            c.dy = this.dy;
            c.rotate = this.rotate;
            c.chartType = this.chartType
        }
    },
    updateChartCursor: function () {
        var a = this.chartCursor;
        a && (a.x = this.marginLeftReal, a.y = this.marginTopReal, a.width = this.plotAreaWidth - 1, a.height = this.plotAreaHeight - 1, a.chart = this)
    },
    updateScrollbars: function () {},
    addChartCursor: function (a) {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        a && (this.listenTo(a,
            "changed", this.handleCursorChange), this.listenTo(a, "zoomed", this.handleCursorZoom));
        this.chartCursor = a
    },
    removeChartCursor: function () {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        this.chartCursor = null
    },
    zoomTrendLines: function () {
        var a = this.trendLines,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.valueAxis.recalculateToPercents ? c.set && c.set.hide() : (c.x = this.marginLeftReal + this.horizontalPosition, c.y = this.marginTopReal + this.verticalPosition, c.draw())
        }
    },
    addTrendLine: function (a) {
        this.trendLines.push(a)
    },
    removeTrendLine: function (a) {
        var b = this.trendLines,
            c;
        for (c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1)
    },
    adjustMargins: function (a, b) {
        var c = a.scrollbarHeight;
        "top" == a.position ? b ? this.marginLeftReal += c : this.marginTopReal += c : b ? this.marginRightReal += c : this.marginBottomReal += c
    },
    getScrollbarPosition: function (a, b, c) {
        a.position = b ? "bottom" == c || "left" == c ? "bottom" : "top" : "top" == c || "right" == c ? "bottom" : "top"
    },
    updateChartScrollbar: function (a, b) {
        if (a) {
            a.rotate = b;
            var c = this.marginTopReal,
                d = this.marginLeftReal,
                e = a.scrollbarHeight,
                f = this.dx,
                g = this.dy;
            "top" == a.position ? b ? (a.y = c, a.x = d - e) : (a.y = c - e + g, a.x = d + f) : b ? (a.y = c + g, a.x = d + this.plotAreaWidth + f) : (a.y = c + this.plotAreaHeight + 1, a.x = this.marginLeftReal)
        }
    },
    showZB: function (a) {
        var b = this.zbSet;
        b && (a ? b.show() : b.hide(), this.zbBG.hide())
    },
    handleReleaseOutside: function (a) {
        AmCharts.AmRectangularChart.base.handleReleaseOutside.call(this, a);
        (a = this.chartCursor) && a.handleReleaseOutside()
    },
    handleMouseDown: function (a) {
        AmCharts.AmRectangularChart.base.handleMouseDown.call(this, a);
        var b = this.chartCursor;
        b && b.handleMouseDown(a)
    },
    handleCursorChange: function () {}
});
AmCharts.TrendLine = AmCharts.Class({
    construct: function () {
        this.createEvents("click");
        this.isProtected = !1;
        this.dashLength = 0;
        this.lineColor = "#00CC00";
        this.lineThickness = this.lineAlpha = 1
    },
    draw: function () {
        var a = this;
        a.destroy();
        var b = a.chart,
            c = b.container,
            d, e, f, g, h = a.categoryAxis,
            j = a.initialDate,
            k = a.initialCategory,
            l = a.finalDate,
            n = a.finalCategory,
            q = a.valueAxis,
            m = a.valueAxisX,
            r = a.initialXValue,
            p = a.finalXValue,
            u = a.initialValue,
            t = a.finalValue,
            s = q.recalculateToPercents;
        h && (j && (d = h.dateToCoordinate(j)), k && (d =
            h.categoryToCoordinate(k)), l && (e = h.dateToCoordinate(l)), n && (e = h.categoryToCoordinate(n)));
        m && !s && (isNaN(r) || (d = m.getCoordinate(r)), isNaN(p) || (e = m.getCoordinate(p)));
        q && !s && (isNaN(u) || (f = q.getCoordinate(u)), isNaN(t) || (g = q.getCoordinate(t)));
        !isNaN(d) && (!isNaN(e) && !isNaN(f) && !isNaN(f)) && (b.rotate ? (h = [f, g], e = [d, e]) : (h = [d, e], e = [f, g]), f = a.lineColor, d = AmCharts.line(c, h, e, f, a.lineAlpha, a.lineThickness, a.dashLength), e = AmCharts.line(c, h, e, f, 0.005, 5), c = c.set([d, e]), c.translate(b.marginLeftReal, b.marginTopReal),
            b.trendLinesSet.push(c), a.line = d, a.set = c, e.mouseup(function () {
            a.handleLineClick()
        }).mouseover(function () {
            a.handleLineOver()
        }).mouseout(function () {
            a.handleLineOut()
        }), e.touchend && e.touchend(function () {
            a.handleLineClick()
        }))
    },
    handleLineClick: function () {
        var a = {
            type: "click",
            trendLine: this,
            chart: this.chart
        };
        this.fire(a.type, a)
    },
    handleLineOver: function () {
        var a = this.rollOverColor;
        void 0 !== a && this.line.attr({
            stroke: a
        })
    },
    handleLineOut: function () {
        this.line.attr({
            stroke: this.lineColor
        })
    },
    destroy: function () {
        AmCharts.remove(this.set)
    }
});
AmCharts.AmSerialChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,
    construct: function () {
        AmCharts.AmSerialChart.base.construct.call(this);
        this.createEvents("changed");
        this.columnSpacing = 5;
        this.columnWidth = 0.8;
        this.updateScrollbar = !0;
        var a = new AmCharts.CategoryAxis;
        a.chart = this;
        this.categoryAxis = a;
        this.chartType = "serial";
        this.zoomOutOnDataUpdate = !0;
        this.skipZoom = !1;
        this.minSelectedTime = 0
    },
    initChart: function () {
        AmCharts.AmSerialChart.base.initChart.call(this);
        this.updateCategoryAxis();
        this.dataChanged &&
            (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        var a = this.chartCursor;
        a && a.updateData();
        var a = this.countColumns(),
            b = this.graphs,
            c;
        for (c = 0; c < b.length; c++) b[c].columnCount = a;
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins())
    },
    validateData: function (a) {
        this.marginsUpdated = !1;
        this.zoomOutOnDataUpdate && !a && (this.endTime = this.end = this.startTime = this.start = NaN);
        AmCharts.AmSerialChart.base.validateData.call(this)
    },
    drawChart: function () {
        AmCharts.AmSerialChart.base.drawChart.call(this);
        var a = this.chartData;
        if (AmCharts.ifArray(a)) {
            var b = this.chartScrollbar;
            b && b.draw();
            if (0 < this.realWidth && 0 < this.realHeight) {
                var a = a.length - 1,
                    c, b = this.categoryAxis;
                if (b.parseDates && !b.equalSpacing) {
                    if (b = this.startTime, c = this.endTime, isNaN(b) || isNaN(c)) b = this.firstTime, c = this.lastTime
                } else if (b = this.start, c = this.end, isNaN(b) || isNaN(c)) b = 0, c = a;
                this.endTime = this.startTime = this.end = this.start = void 0;
                this.zoom(b, c)
            }
        } else this.cleanChart();
        this.dispDUpd();
        this.chartCreated = !0
    },
    cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.categoryAxis, this.chartScrollbar, this.chartCursor])
    },
    updateCategoryAxis: function () {
        var a = this.categoryAxis;
        a.id = "categoryAxis";
        a.rotate = this.rotate;
        a.axisRenderer = AmCharts.RecAxis;
        a.guideFillRenderer = AmCharts.RecFill;
        a.axisItemRenderer = AmCharts.RecItem;
        a.setOrientation(!this.rotate);
        a.x = this.marginLeftReal;
        a.y = this.marginTopReal;
        a.dx = this.dx;
        a.dy = this.dy;
        a.width = this.plotAreaWidth -
            1;
        a.height = this.plotAreaHeight - 1;
        a.viW = this.plotAreaWidth - 1;
        a.viH = this.plotAreaHeight - 1;
        a.viX = this.marginLeftReal;
        a.viY = this.marginTopReal;
        a.marginsChanged = !0
    },
    updateValueAxes: function () {
        AmCharts.AmSerialChart.base.updateValueAxes.call(this);
        var a = this.valueAxes,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b],
                d = this.rotate;
            c.rotate = d;
            c.setOrientation(d);
            d = this.categoryAxis;
            if (!d.startOnAxis || d.parseDates) c.expandMinMax = !0
        }
    },
    updateData: function () {
        this.parseData();
        var a = this.graphs,
            b, c = this.chartData;
        for (b = 0; b <
            a.length; b++) a[b].data = c;
        0 < c.length && (this.firstTime = this.getStartTime(c[0].time), this.lastTime = this.getEndTime(c[c.length - 1].time))
    },
    getStartTime: function (a) {
        var b = this.categoryAxis;
        return AmCharts.resetDateToMin(new Date(a), b.minPeriod, 1, b.firstDayOfWeek).getTime()
    },
    getEndTime: function (a) {
        var b = this.categoryAxis;
        b.minDuration();
        return AmCharts.changeDate(new Date(a), b.minPeriod, 1, !0).getTime() - 1
    },
    updateMargins: function () {
        AmCharts.AmSerialChart.base.updateMargins.call(this);
        var a = this.chartScrollbar;
        a && (this.getScrollbarPosition(a, this.rotate, this.categoryAxis.position), this.adjustMargins(a, this.rotate))
    },
    updateScrollbars: function () {
        this.updateChartScrollbar(this.chartScrollbar, this.rotate)
    },
    zoom: function (a, b) {
        var c = this.categoryAxis;
        c.parseDates && !c.equalSpacing ? this.timeZoom(a, b) : this.indexZoom(a, b)
    },
    timeZoom: function (a, b) {
        var c = this.maxSelectedTime;
        isNaN(c) || (b != this.endTime && b - a > c && (a = b - c, this.updateScrollbar = !0), a != this.startTime && b - a > c && (b = a + c, this.updateScrollbar = !0));
        var d = this.minSelectedTime;
        if (0 < d && b - a < d) {
            var e = Math.round(a + (b - a) / 2),
                d = Math.round(d / 2);
            a = e - d;
            b = e + d
        }
        var f = this.chartData,
            e = this.categoryAxis;
        if (AmCharts.ifArray(f) && (a != this.startTime || b != this.endTime)) {
            var g = e.minDuration(),
                d = this.firstTime,
                h = this.lastTime;
            a || (a = d, isNaN(c) || (a = h - c));
            b || (b = h);
            a > h && (a = h);
            b < d && (b = d);
            a < d && (a = d);
            b > h && (b = h);
            b < a && (b = a + g);
            b - a < g / 5 && (b < h ? b = a + g / 5 : a = b - g / 5);
            this.startTime = a;
            this.endTime = b;
            c = f.length - 1;
            g = this.getClosestIndex(f, "time", a, !0, 0, c);
            f = this.getClosestIndex(f, "time", b, !1, g, c);
            e.timeZoom(a, b);
            e.zoom(g,
                f);
            this.start = AmCharts.fitToBounds(g, 0, c);
            this.end = AmCharts.fitToBounds(f, 0, c);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            a != d || b != h ? this.showZB(!0) : this.showZB(!1);
            this.updateColumnsDepth();
            this.dispatchTimeZoomEvent()
        }
    },
    indexZoom: function (a, b) {
        var c = this.maxSelectedSeries;
        isNaN(c) || (b != this.end && b - a > c && (a = b - c, this.updateScrollbar = !0), a != this.start && b - a > c && (b = a + c, this.updateScrollbar = !0));
        if (a != this.start || b != this.end) {
            var d = this.chartData.length - 1;
            isNaN(a) && (a = 0, isNaN(c) || (a = d - c));
            isNaN(b) &&
                (b = d);
            b < a && (b = a);
            b > d && (b = d);
            a > d && (a = d - 1);
            0 > a && (a = 0);
            this.start = a;
            this.end = b;
            this.categoryAxis.zoom(a, b);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            0 !== a || b != this.chartData.length - 1 ? this.showZB(!0) : this.showZB(!1);
            this.updateColumnsDepth();
            this.dispatchIndexZoomEvent()
        }
    },
    updateGraphs: function () {
        AmCharts.AmSerialChart.base.updateGraphs.call(this);
        var a = this.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.columnWidth = this.columnWidth;
            c.categoryAxis = this.categoryAxis
        }
    },
    updateColumnsDepth: function () {
        var a,
            b = this.graphs,
            c;
        AmCharts.remove(this.columnsSet);
        this.columnsArray = [];
        for (a = 0; a < b.length; a++) {
            c = b[a];
            var d = c.columnsArray;
            if (d) {
                var e;
                for (e = 0; e < d.length; e++) this.columnsArray.push(d[e])
            }
        }
        this.columnsArray.sort(this.compareDepth);
        if (0 < this.columnsArray.length) {
            b = this.container.set();
            this.columnSet.push(b);
            for (a = 0; a < this.columnsArray.length; a++) b.push(this.columnsArray[a].column.set);
            c && b.translate(c.x, c.y);
            this.columnsSet = b
        }
    },
    compareDepth: function (a, b) {
        return a.depth > b.depth ? 1 : -1
    },
    zoomScrollbar: function () {
        var a =
            this.chartScrollbar,
            b = this.categoryAxis;
        a && this.updateScrollbar && (b.parseDates && !b.equalSpacing ? a.timeZoom(this.startTime, this.endTime) : a.zoom(this.start, this.end), this.updateScrollbar = !0)
    },
    updateTrendLines: function () {
        var a = this.trendLines,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.valueAxis || (c.valueAxis = this.valueAxes[0]);
            c.categoryAxis = this.categoryAxis
        }
    },
    zoomAxesAndGraphs: function () {
        if (!this.scrollbarOnly) {
            var a = this.valueAxes,
                b;
            for (b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
            a =
                this.graphs;
            for (b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
            this.zoomTrendLines();
            (b = this.chartCursor) && b.zoom(this.start, this.end, this.startTime, this.endTime)
        }
    },
    countColumns: function () {
        var a = 0,
            b = this.valueAxes.length,
            c = this.graphs.length,
            d, e, f = !1,
            g, h;
        for (h = 0; h < b; h++) {
            e = this.valueAxes[h];
            var j = e.stackType;
            if ("100%" == j || "regular" == j) {
                f = !1;
                for (g = 0; g < c; g++) d = this.graphs[g], !d.hidden && (d.valueAxis == e && "column" == d.type) && (!f && d.stackable && (a++, f = !0), d.stackable || a++, d.columnIndex = a - 1)
            }
            if ("none" ==
                j || "3d" == j) for (g = 0; g < c; g++) d = this.graphs[g], !d.hidden && (d.valueAxis == e && "column" == d.type) && (d.columnIndex = a, a++);
            if ("3d" == j) {
                for (h = 0; h < c; h++) d = this.graphs[h], d.depthCount = a;
                a = 1
            }
        }
        return a
    },
    parseData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        this.parseSerialData()
    },
    getCategoryIndexByValue: function (a) {
        var b = this.chartData,
            c, d;
        for (d = 0; d < b.length; d++) b[d].category == a && (c = d);
        return c
    },
    handleCursorChange: function (a) {
        this.updateLegendValues(a.index)
    },
    handleCursorZoom: function (a) {
        this.updateScrollbar = !0;
        this.zoom(a.start, a.end)
    },
    handleScrollbarZoom: function (a) {
        this.updateScrollbar = !1;
        this.zoom(a.start, a.end)
    },
    dispatchTimeZoomEvent: function () {
        if (this.prevStartTime != this.startTime || this.prevEndTime != this.endTime) {
            var a = {
                type: "zoomed"
            };
            a.startDate = new Date(this.startTime);
            a.endDate = new Date(this.endTime);
            a.startIndex = this.start;
            a.endIndex = this.end;
            this.startIndex = this.start;
            this.endIndex = this.end;
            this.startDate = a.startDate;
            this.endDate = a.endDate;
            this.prevStartTime = this.startTime;
            this.prevEndTime =
                this.endTime;
            var b = this.categoryAxis,
                c = AmCharts.extractPeriod(b.minPeriod).period,
                b = b.dateFormatsObject[c];
            a.startValue = AmCharts.formatDate(a.startDate, b);
            a.endValue = AmCharts.formatDate(a.endDate, b);
            a.chart = this;
            a.target = this;
            this.fire(a.type, a)
        }
    },
    dispatchIndexZoomEvent: function () {
        if (this.prevStartIndex != this.start || this.prevEndIndex != this.end) {
            this.startIndex = this.start;
            this.endIndex = this.end;
            var a = this.chartData;
            if (AmCharts.ifArray(a) && !isNaN(this.start) && !isNaN(this.end)) {
                var b = {
                    chart: this,
                    target: this,
                    type: "zoomed"
                };
                b.startIndex = this.start;
                b.endIndex = this.end;
                b.startValue = a[this.start].category;
                b.endValue = a[this.end].category;
                this.categoryAxis.parseDates && (this.startTime = a[this.start].time, this.endTime = a[this.end].time, b.startDate = new Date(this.startTime), b.endDate = new Date(this.endTime));
                this.prevStartIndex = this.start;
                this.prevEndIndex = this.end;
                this.fire(b.type, b)
            }
        }
    },
    updateLegendValues: function (a) {
        var b = this.graphs,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            d.currentDataItem = isNaN(a) ? void 0 : this.chartData[a].axes[d.valueAxis.id].graphs[d.id]
        }
        this.legend &&
            this.legend.updateValues()
    },
    getClosestIndex: function (a, b, c, d, e, f) {
        0 > e && (e = 0);
        f > a.length - 1 && (f = a.length - 1);
        var g = e + Math.round((f - e) / 2),
            h = a[g][b];
        if (1 >= f - e) {
            if (d) return e;
            d = a[f][b];
            return Math.abs(a[e][b] - c) < Math.abs(d - c) ? e : f
        }
        return c == h ? g : c < h ? this.getClosestIndex(a, b, c, d, e, g) : this.getClosestIndex(a, b, c, d, g, f)
    },
    zoomToIndexes: function (a, b) {
        this.updateScrollbar = !0;
        var c = this.chartData;
        if (c) {
            var d = c.length;
            0 < d && (0 > a && (a = 0), b > d - 1 && (b = d - 1), d = this.categoryAxis, d.parseDates && !d.equalSpacing ? this.zoom(c[a].time,
                this.getEndTime(c[b].time)) : this.zoom(a, b))
        }
    },
    zoomToDates: function (a, b) {
        this.updateScrollbar = !0;
        var c = this.chartData;
        if (this.categoryAxis.equalSpacing) {
            var d = this.getClosestIndex(c, "time", a.getTime(), !0, 0, c.length),
                c = this.getClosestIndex(c, "time", b.getTime(), !1, 0, c.length);
            this.zoom(d, c)
        } else this.zoom(a.getTime(), b.getTime())
    },
    zoomToCategoryValues: function (a, b) {
        this.updateScrollbar = !0;
        this.zoom(this.getCategoryIndexByValue(a), this.getCategoryIndexByValue(b))
    },
    formatString: function (a, b) {
        var c = b.graph;
        if (-1 != a.indexOf("[[category]]")) {
            var d = b.serialDataItem.category;
            if (this.categoryAxis.parseDates) {
                var e = this.balloonDateFormat,
                    f = this.chartCursor;
                f && (e = f.categoryBalloonDateFormat); - 1 != a.indexOf("[[category]]") && (e = AmCharts.formatDate(d, e), -1 != e.indexOf("fff") && (e = AmCharts.formatMilliseconds(e, d)), d = e)
            }
            a = a.replace(/\[\[category\]\]/g, String(d))
        }
        c = c.numberFormatter;
        c || (c = this.numberFormatter);
        d = b.graph.valueAxis;
        if ((e = d.duration) && !isNaN(b.values.value)) d = AmCharts.formatDuration(b.values.value, e,
                "", d.durationUnits, d.maxInterval, c), a = a.replace(RegExp("\\[\\[value\\]\\]", "g"), d);
        d = "value open low high close total".split(" ");
        e = this.percentFormatter;
        a = AmCharts.formatValue(a, b.percents, d, e, "percents\\.");
        a = AmCharts.formatValue(a, b.values, d, c, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        a = AmCharts.formatValue(a, b.values, ["percents"], e); - 1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
        return a = AmCharts.AmSerialChart.base.formatString.call(this,
            a, b)
    },
    addChartScrollbar: function (a) {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        a && (a.chart = this, this.listenTo(a, "zoomed", this.handleScrollbarZoom));
        this.rotate ? void 0 === a.width && (a.width = a.scrollbarHeight) : void 0 === a.height && (a.height = a.scrollbarHeight);
        this.chartScrollbar = a
    },
    removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        this.chartScrollbar = null
    },
    handleReleaseOutside: function (a) {
        AmCharts.AmSerialChart.base.handleReleaseOutside.call(this, a);
        AmCharts.callMethod("handleReleaseOutside", [this.chartScrollbar])
    }
});
AmCharts.AmRadarChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,
    construct: function () {
        AmCharts.AmRadarChart.base.construct.call(this);
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 0;
        this.chartType = "radar";
        this.radius = "35%"
    },
    initChart: function () {
        AmCharts.AmRadarChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.drawChart()
    },
    updateData: function () {
        this.parseData();
        var a = this.graphs,
            b;
        for (b = 0; b < a.length; b++) a[b].data =
                this.chartData
    },
    updateGraphs: function () {
        var a = this.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.index = b;
            c.width = this.realRadius;
            c.height = this.realRadius;
            c.x = this.marginLeftReal;
            c.y = this.marginTopReal;
            c.chartType = this.chartType
        }
    },
    parseData: function () {
        AmCharts.AmRadarChart.base.parseData.call(this);
        this.parseSerialData()
    },
    updateValueAxes: function () {
        var a = this.valueAxes,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.axisRenderer = AmCharts.RadAxis;
            c.guideFillRenderer = AmCharts.RadarFill;
            c.axisItemRenderer = AmCharts.RadItem;
            c.autoGridCount = !1;
            c.x = this.marginLeftReal;
            c.y = this.marginTopReal;
            c.width = this.realRadius;
            c.height = this.realRadius
        }
    },
    drawChart: function () {
        AmCharts.AmRadarChart.base.drawChart.call(this);
        var a = this.updateWidth(),
            b = this.updateHeight(),
            c = this.marginTop + this.getTitleHeight(),
            d = this.marginLeft,
            b = b - c - this.marginBottom;
        this.marginLeftReal = d + (a - d - this.marginRight) / 2;
        this.marginTopReal = c + b / 2;
        this.realRadius = AmCharts.toCoordinate(this.radius, a, b);
        this.updateValueAxes();
        this.updateGraphs();
        a = this.chartData;
        if (AmCharts.ifArray(a)) {
            if (0 < this.realWidth && 0 < this.realHeight) {
                a = a.length - 1;
                d = this.valueAxes;
                for (c = 0; c < d.length; c++) d[c].zoom(0, a);
                d = this.graphs;
                for (c = 0; c < d.length; c++) d[c].zoom(0, a);
                (a = this.legend) && a.invalidateSize()
            }
        } else this.cleanChart();
        this.dispDUpd();
        this.chartCreated = !0
    },
    formatString: function (a, b) {
        var c = b.graph; - 1 != a.indexOf("[[category]]") && (a = a.replace(/\[\[category\]\]/g, String(b.serialDataItem.category)));
        c = c.numberFormatter;
        c || (c = this.numberFormatter);
        a = AmCharts.formatValue(a, b.values, ["value"], c, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        return a = AmCharts.AmRadarChart.base.formatString.call(this, a, b)
    },
    cleanChart: function () {
        this.callMethod("destroy", [this.valueAxes, this.graphs])
    }
});
AmCharts.AxisBase = AmCharts.Class({
    construct: function () {
        this.viY = this.viX = this.y = this.x = this.dy = this.dx = 0;
        this.axisThickness = 1;
        this.axisColor = "#000000";
        this.axisAlpha = 1;
        this.gridCount = this.tickLength = 5;
        this.gridAlpha = 0.15;
        this.gridThickness = 1;
        this.gridColor = "#000000";
        this.dashLength = 0;
        this.labelFrequency = 1;
        this.showLastLabel = this.showFirstLabel = !0;
        this.fillColor = "#FFFFFF";
        this.fillAlpha = 0;
        this.labelsEnabled = !0;
        this.labelRotation = 0;
        this.autoGridCount = !0;
        this.valueRollOverColor = "#CC0000";
        this.offset =
            0;
        this.guides = [];
        this.visible = !0;
        this.counter = 0;
        this.guides = [];
        this.ignoreAxisWidth = this.inside = !1;
        this.minGap = 75;
        this.titleBold = !0
    },
    zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.dataChanged = !0;
        this.draw()
    },
    fixAxisPosition: function () {
        var a = this.position;
        "H" == this.orientation ? ("left" == a && (a = "bottom"), "right" == a && (a = "top")) : ("bottom" == a && (a = "left"), "top" == a && (a = "right"));
        this.position = a
    },
    draw: function () {
        var a = this.chart;
        void 0 === this.titleColor && (this.titleColor = a.color);
        isNaN(this.titleFontSize) &&
            (this.titleFontSize = a.fontSize + 1);
        this.allLabels = [];
        this.counter = 0;
        this.destroy();
        this.fixAxisPosition();
        this.labels = [];
        var b = a.container,
            c = b.set();
        a.gridSet.push(c);
        this.set = c;
        b = b.set();
        a.axesLabelsSet.push(b);
        this.labelsSet = b;
        this.axisLine = new this.axisRenderer(this);
        this.autoGridCount && ("V" == this.orientation ? (a = this.height / 35, 3 > a && (a = 3)) : a = this.width / this.minGap, this.gridCount = Math.max(a, 1));
        this.axisWidth = this.axisLine.axisWidth;
        this.addTitle()
    },
    setOrientation: function (a) {
        this.orientation = a ? "H" :
            "V"
    },
    addTitle: function () {
        var a = this.title;
        if (a) {
            var b = this.chart;
            this.titleLabel = AmCharts.text(b.container, a, this.titleColor, b.fontFamily, this.titleFontSize, "middle", this.titleBold)
        }
    },
    positionTitle: function () {
        var a = this.titleLabel;
        if (a) {
            var b, c, d = this.labelsSet,
                e = {};
            0 < d.length() ? e = d.getBBox() : (e.x = 0, e.y = 0, e.width = this.viW, e.height = this.viH);
            d.push(a);
            var d = e.x,
                f = e.y;
            AmCharts.VML && (this.rotate ? d -= this.x : f -= this.y);
            var g = e.width,
                e = e.height,
                h = this.viW,
                j = this.viH;
            a.getBBox();
            var k = 0,
                l = this.titleFontSize /
                    2,
                n = this.inside;
            switch (this.position) {
            case "top":
                b = h / 2;
                c = f - 10 - l;
                break;
            case "bottom":
                b = h / 2;
                c = f + e + 10 + l;
                break;
            case "left":
                b = d - 10 - l;
                n && (b -= 5);
                c = j / 2;
                k = -90;
                break;
            case "right":
                b = d + g + 10 + l - 3, n && (b += 7), c = j / 2, k = -90
            }
            this.marginsChanged ? (a.translate(b, c), this.tx = b, this.ty = c) : a.translate(this.tx, this.ty);
            this.marginsChanged = !1;
            0 !== k && a.rotate(k)
        }
    },
    pushAxisItem: function (a, b) {
        var c = a.graphics();
        0 < c.length() && (b ? this.labelsSet.push(c) : this.set.push(c));
        (c = a.getLabel()) && this.labelsSet.push(c)
    },
    addGuide: function (a) {
        this.guides.push(a)
    },
    removeGuide: function (a) {
        var b = this.guides,
            c;
        for (c = 0; c < b.length; c++) b[c] == a && b.splice(c, 1)
    },
    handleGuideOver: function (a) {
        clearTimeout(this.chart.hoverInt);
        var b = a.graphics.getBBox(),
            c = b.x + b.width / 2,
            b = b.y + b.height / 2,
            d = a.fillColor;
        void 0 === d && (d = a.lineColor);
        this.chart.showBalloon(a.balloonText, d, !0, c, b)
    },
    handleGuideOut: function () {
        this.chart.hideBalloon()
    },
    addEventListeners: function (a, b) {
        var c = this;
        a.mouseover(function () {
            c.handleGuideOver(b)
        });
        a.mouseout(function () {
            c.handleGuideOut(b)
        })
    },
    getBBox: function () {
        var a =
            this.labelsSet.getBBox();
        AmCharts.VML || (a = {
            x: a.x + this.x,
            y: a.y + this.y,
            width: a.width,
            height: a.height
        });
        return a
    },
    destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.labelsSet);
        var a = this.axisLine;
        a && AmCharts.remove(a.set);
        AmCharts.remove(this.grid0)
    }
});
AmCharts.ValueAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,
    construct: function () {
        this.createEvents("axisChanged", "logarithmicAxisFailed", "axisSelfZoomed", "axisZoomed");
        AmCharts.ValueAxis.base.construct.call(this);
        this.dataChanged = !0;
        this.gridCount = 8;
        this.stackType = "none";
        this.position = "left";
        this.unitPosition = "right";
        this.recalculateToPercents = this.includeHidden = this.includeGuidesInMinMax = this.integersOnly = !1;
        this.durationUnits = {
            DD: "d. ",
            hh: ":",
            mm: ":",
            ss: ""
        };
        this.scrollbar = !1;
        this.baseValue = 0;
        this.radarCategoriesEnabled = !0;
        this.gridType = "polygons";
        this.useScientificNotation = !1;
        this.axisTitleOffset = 10;
        this.minMaxMultiplier = 1
    },
    updateData: function () {
        0 >= this.gridCount && (this.gridCount = 1);
        this.totals = [];
        this.data = this.chart.chartData;
        "xy" != this.chart.chartType && (this.stackGraphs("smoothedLine"), this.stackGraphs("line"), this.stackGraphs("column"), this.stackGraphs("step"));
        this.recalculateToPercents && this.recalculate();
        this.synchronizationMultiplier && this.synchronizeWithAxis ? this.foundGraphs = !0 : (this.foundGraphs = !1, this.getMinMax())
    },
    draw: function () {
        AmCharts.ValueAxis.base.draw.call(this);
        var a = this.chart,
            b = this.set;
        "duration" == this.type && (this.duration = "ss");
        !0 === this.dataChanged && (this.updateData(), this.dataChanged = !1);
        if (this.logarithmic && (0 >= this.getMin(0, this.data.length - 1) || 0 >= this.minimum)) this.fire("logarithmicAxisFailed", {
                type: "logarithmicAxisFailed",
                chart: a
            });
        else {
            this.grid0 = null;
            var c, d, e = a.dx,
                f = a.dy,
                g = !1,
                h = this.logarithmic,
                j = a.chartType;
            if (!isNaN(this.min) && !isNaN(this.max) && this.foundGraphs && Infinity != this.min && -Infinity !=
                this.max) {
                var k = this.labelFrequency,
                    l = this.showFirstLabel,
                    n = this.showLastLabel,
                    q = 1,
                    m = 0,
                    r = Math.round((this.max - this.min) / this.step) + 1,
                    p;
                !0 === h ? (p = Math.log(this.max) * Math.LOG10E - Math.log(this.minReal) * Math.LOG10E, this.stepWidth = this.axisWidth / p, 2 < p && (r = Math.ceil(Math.log(this.max) * Math.LOG10E) + 1, m = Math.round(Math.log(this.minReal) * Math.LOG10E), r > this.gridCount && (q = Math.ceil(r / this.gridCount)))) : this.stepWidth = this.axisWidth / (this.max - this.min);
                c = 0;
                1 > this.step && -1 < this.step && (c = this.getDecimals(this.step));
                this.integersOnly && (c = 0);
                c > this.maxDecCount && (c = this.maxDecCount);
                var u = this.precision;
                isNaN(u) || (c = u);
                this.max = AmCharts.roundTo(this.max, this.maxDecCount);
                this.min = AmCharts.roundTo(this.min, this.maxDecCount);
                var t = {};
                t.precision = c;
                t.decimalSeparator = a.numberFormatter.decimalSeparator;
                t.thousandsSeparator = a.numberFormatter.thousandsSeparator;
                this.numberFormatter = t;
                var s, w = this.guides,
                    x = w.length;
                if (0 < x) {
                    var v = this.fillAlpha;
                    for (d = this.fillAlpha = 0; d < x; d++) {
                        var y = w[d],
                            A = NaN,
                            J = y.above;
                        isNaN(y.toValue) ||
                            (A = this.getCoordinate(y.toValue), s = new this.axisItemRenderer(this, A, "", !0, NaN, NaN, y), this.pushAxisItem(s, J));
                        var E = NaN;
                        isNaN(y.value) || (E = this.getCoordinate(y.value), s = new this.axisItemRenderer(this, E, y.label, !0, NaN, (A - E) / 2, y), this.pushAxisItem(s, J));
                        isNaN(A - E) || (s = new this.guideFillRenderer(this, E, A, y), this.pushAxisItem(s, J), s = s.graphics(), y.graphics = s, y.balloonText && this.addEventListeners(s, y))
                    }
                    this.fillAlpha = v
                }
                w = !1;
                for (d = m; d < r; d += q) s = AmCharts.roundTo(this.step * d + this.min, c), -1 != String(s).indexOf("e") &&
                        (w = !0, String(s).split("e"));
                this.duration && (this.maxInterval = AmCharts.getMaxInterval(this.max, this.duration));
                for (d = m; d < r; d += q) if (m = this.step * d + this.min, m = AmCharts.roundTo(m, this.maxDecCount + 1), !(this.integersOnly && Math.round(m) != m) && (isNaN(u) || Number(AmCharts.toFixed(m, u)) == m)) {
                        !0 === h && (0 === m && (m = this.minReal), 2 < p && (m = Math.pow(10, d)), w = -1 != String(m).indexOf("e") ? !0 : !1);
                        this.useScientificNotation && (w = !0);
                        this.usePrefixes && (w = !1);
                        w ? (s = -1 == String(m).indexOf("e") ? m.toExponential(15) : String(m), s = s.split("e"),
                            c = Number(s[0]), s = Number(s[1]), c = AmCharts.roundTo(c, 14), 10 == c && (c = 1, s += 1), s = c + "e" + s, 0 === m && (s = "0"), 1 == m && (s = "1")) : (h && (c = String(m).split("."), t.precision = c[1] ? c[1].length : -1), s = this.usePrefixes ? AmCharts.addPrefix(m, a.prefixesOfBigNumbers, a.prefixesOfSmallNumbers, t, !0) : AmCharts.formatNumber(m, t, t.precision));
                        this.duration && (s = AmCharts.formatDuration(m, this.duration, "", this.durationUnits, this.maxInterval, t));
                        this.recalculateToPercents ? s += "%" : (c = this.unit) && (s = "left" == this.unitPosition ? c + s : s + c);
                        Math.round(d /
                            k) != d / k && (s = void 0);
                        if (0 === d && !l || d == r - 1 && !n) s = " ";
                        c = this.getCoordinate(m);
                        this.labelFunction && (s = this.labelFunction(m, s, this));
                        s = new this.axisItemRenderer(this, c, s);
                        this.pushAxisItem(s);
                        if (m == this.baseValue && "radar" != j) {
                            var O, K, x = this.viW,
                                v = this.viH,
                                m = this.viX;
                            s = this.viY;
                            "H" == this.orientation ? 0 <= c && c <= x + 1 && (O = [c, c, c + e], K = [v, 0, f]) : 0 <= c && c <= v + 1 && (O = [0, x, x + e], K = [c, c, c + f]);
                            O && (c = AmCharts.fitToBounds(2 * this.gridAlpha, 0, 1), c = AmCharts.line(a.container, O, K, this.gridColor, c, 1, this.dashLength), c.translate(m,
                                s), this.grid0 = c, a.axesSet.push(c), c.toBack())
                        }
                    }
                d = this.baseValue;
                this.min > this.baseValue && this.max > this.baseValue && (d = this.min);
                this.min < this.baseValue && this.max < this.baseValue && (d = this.max);
                h && d < this.minReal && (d = this.minReal);
                this.baseCoord = this.getCoordinate(d);
                a = {
                    type: "axisChanged",
                    target: this,
                    chart: a
                };
                a.min = h ? this.minReal : this.min;
                a.max = this.max;
                this.fire("axisChanged", a);
                this.axisCreated = !0
            } else g = !0;
            h = this.axisLine.set;
            a = this.labelsSet;
            this.positionTitle();
            "radar" != j ? (j = this.viX, d = this.viY, b.translate(j,
                d), a.translate(j, d)) : h.toFront();
            !this.visible || g ? (b.hide(), h.hide(), a.hide()) : (b.show(), h.show(), a.show())
        }
    },
    getDecimals: function (a) {
        var b = 0;
        isNaN(a) || (a = String(a), -1 != a.indexOf("e-") ? b = Number(a.split("-")[1]) : -1 != a.indexOf(".") && (b = a.split(".")[1].length));
        return b
    },
    stackGraphs: function (a) {
        var b = this.stackType;
        "stacked" == b && (b = "regular");
        "line" == b && (b = "none");
        "100% stacked" == b && (b = "100%");
        this.stackType = b;
        var c = [],
            d = [],
            e = [],
            f = [],
            g, h = this.chart.graphs,
            j, k, l, n, q = this.baseValue,
            m = !1;
        if ("line" == a ||
            "step" == a || "smoothedLine" == a) m = !0;
        if (m && ("regular" == b || "100%" == b)) for (n = 0; n < h.length; n++) l = h[n], l.hidden || (k = l.type, l.chart == this.chart && (l.valueAxis == this && a == k && l.stackable) && (j && (l.stackGraph = j), j = l));
        for (j = this.start; j <= this.end; j++) {
            var r = 0;
            for (n = 0; n < h.length; n++) if (l = h[n], !l.hidden && (k = l.type, l.chart == this.chart && (l.valueAxis == this && a == k && l.stackable) && (k = this.data[j].axes[this.id].graphs[l.id], g = k.values.value, !isNaN(g)))) {
                    var p = this.getDecimals(g);
                    r < p && (r = p);
                    f[j] = isNaN(f[j]) ? Math.abs(g) : f[j] +
                        Math.abs(g);
                    f[j] = AmCharts.roundTo(f[j], r);
                    l = l.fillToGraph;
                    if (m && l && (l = this.data[j].axes[this.id].graphs[l.id])) k.values.open = l.values.value;
                    "regular" == b && (m && (isNaN(c[j]) ? (c[j] = g, k.values.close = g, k.values.open = this.baseValue) : (k.values.close = isNaN(g) ? c[j] : g + c[j], k.values.open = c[j], c[j] = k.values.close)), "column" == a && !isNaN(g) && (k.values.close = g, 0 > g ? (k.values.close = g, isNaN(d[j]) ? k.values.open = q : (k.values.close += d[j], k.values.open = d[j]), d[j] = k.values.close) : (k.values.close = g, isNaN(e[j]) ? k.values.open =
                        q : (k.values.close += e[j], k.values.open = e[j]), e[j] = k.values.close)))
                }
        }
        for (j = this.start; j <= this.end; j++) for (n = 0; n < h.length; n++) l = h[n], l.hidden || (k = l.type, l.chart == this.chart && (l.valueAxis == this && a == k && l.stackable) && (k = this.data[j].axes[this.id].graphs[l.id], g = k.values.value, isNaN(g) || (c = 100 * (g / f[j]), k.values.percents = c, k.values.total = f[j], "100%" == b && (isNaN(d[j]) && (d[j] = 0), isNaN(e[j]) && (e[j] = 0), 0 > c ? (k.values.close = AmCharts.fitToBounds(c + d[j], -100, 100), k.values.open = d[j], d[j] = k.values.close) : (k.values.close =
                    AmCharts.fitToBounds(c + e[j], -100, 100), k.values.open = e[j], e[j] = k.values.close)))))
    },
    recalculate: function () {
        var a = this.chart.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            if (c.valueAxis == this) {
                var d = "value";
                if ("candlestick" == c.type || "ohlc" == c.type) d = "open";
                var e, f, g = this.end + 2,
                    g = AmCharts.fitToBounds(this.end + 1, 0, this.data.length - 1),
                    h = this.start;
                0 < h && h--;
                var j;
                for (j = this.start; j <= g && !(f = this.data[j].axes[this.id].graphs[c.id], e = f.values[d], !isNaN(e)); j++);
                for (d = h; d <= g; d++) {
                    f = this.data[d].axes[this.id].graphs[c.id];
                    f.percents = {};
                    var h = f.values,
                        k;
                    for (k in h) f.percents[k] = "percents" != k ? 100 * (h[k] / e) - 100 : h[k]
                }
            }
        }
    },
    getMinMax: function () {
        var a = !1,
            b = this.chart,
            c = b.graphs,
            d;
        for (d = 0; d < c.length; d++) {
            var e = c[d].type;
            if ("line" == e || "step" == e || "smoothedLine" == e) this.expandMinMax && (a = !0)
        }
        a && (0 < this.start && this.start--, this.end < this.data.length - 1 && this.end++);
        "serial" == b.chartType && !0 === b.categoryAxis.parseDates && !a && this.end < this.data.length - 1 && this.end++;
        a = this.minMaxMultiplier;
        this.min = this.getMin(this.start, this.end);
        this.max =
            this.getMax();
        a = (this.max - this.min) * (a - 1);
        this.min -= a;
        this.max += a;
        a = this.guides.length;
        if (this.includeGuidesInMinMax && 0 < a) for (b = 0; b < a; b++) c = this.guides[b], c.toValue < this.min && (this.min = c.toValue), c.value < this.min && (this.min = c.value), c.toValue > this.max && (this.max = c.toValue), c.value > this.max && (this.max = c.value);
        isNaN(this.minimum) || (this.min = this.minimum);
        isNaN(this.maximum) || (this.max = this.maximum);
        this.min > this.max && (a = this.max, this.max = this.min, this.min = a);
        isNaN(this.minTemp) || (this.min = this.minTemp);
        isNaN(this.maxTemp) || (this.max = this.maxTemp);
        this.minReal = this.min;
        this.maxReal = this.max;
        0 === this.min && 0 === this.max && (this.max = 9);
        this.min > this.max && (this.min = this.max - 1);
        a = this.min;
        b = this.max;
        c = this.max - this.min;
        d = 0 === c ? Math.pow(10, Math.floor(Math.log(Math.abs(this.max)) * Math.LOG10E)) / 10 : Math.pow(10, Math.floor(Math.log(Math.abs(c)) * Math.LOG10E)) / 10;
        isNaN(this.maximum) && isNaN(this.maxTemp) && (this.max = Math.ceil(this.max / d) * d + d);
        isNaN(this.minimum) && isNaN(this.minTemp) && (this.min = Math.floor(this.min /
            d) * d - d);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        "100%" == this.stackType && (this.min = 0 > this.min ? -100 : 0, this.max = 0 > this.max ? 0 : 100);
        c = this.max - this.min;
        d = Math.pow(10, Math.floor(Math.log(Math.abs(c)) * Math.LOG10E)) / 10;
        this.step = Math.ceil(c / this.gridCount / d) * d;
        c = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E));
        c = c.toExponential(0).split("e");
        d = Number(c[1]);
        9 == Number(c[0]) && d++;
        c = this.generateNumber(1, d);
        d = Math.ceil(this.step / c);
        5 < d && (d = 10);
        5 >= d && 2 < d && (d = 5);
        this.step =
            Math.ceil(this.step / (c * d)) * c * d;
        1 > c ? (this.maxDecCount = Math.abs(Math.log(Math.abs(c)) * Math.LOG10E), this.maxDecCount = Math.round(this.maxDecCount), this.step = AmCharts.roundTo(this.step, this.maxDecCount + 1)) : this.maxDecCount = 0;
        this.min = this.step * Math.floor(this.min / this.step);
        this.max = this.step * Math.ceil(this.max / this.step);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        1 < this.minReal && 1 < this.max - this.minReal && (this.minReal = Math.floor(this.minReal));
        c = Math.pow(10, Math.floor(Math.log(Math.abs(this.minReal)) *
            Math.LOG10E));
        0 === this.min && (this.minReal = c);
        0 === this.min && 1 < this.minReal && (this.minReal = 1);
        0 < this.min && 0 < this.minReal - this.step && (this.minReal = this.min + this.step < this.minReal ? this.min + this.step : this.min);
        c = Math.log(b) * Math.LOG10E - Math.log(a) * Math.LOG10E;
        this.logarithmic && (2 < c ? (this.minReal = this.min = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)), this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(b)) * Math.LOG10E))) : (b = Math.pow(10, Math.floor(Math.log(Math.abs(this.min)) * Math.LOG10E)) / 10, a =
            Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)) / 10, b < a && (this.minReal = this.min = 10 * a)))
    },
    generateNumber: function (a, b) {
        var c = "",
            d;
        d = 0 > b ? Math.abs(b) - 1 : Math.abs(b);
        var e;
        for (e = 0; e < d; e++) c += "0";
        return 0 > b ? Number("0." + c + String(a)) : Number(String(a) + c)
    },
    getMin: function (a, b) {
        var c, d;
        for (d = a; d <= b; d++) {
            var e = this.data[d].axes[this.id].graphs,
                f;
            for (f in e) if (e.hasOwnProperty(f)) {
                    var g = this.chart.getGraphById(f);
                    if (g.includeInMinMax && (!g.hidden || this.includeHidden)) {
                        isNaN(c) && (c = Infinity);
                        this.foundGraphs = !0;
                        g = e[f].values;
                        this.recalculateToPercents && (g = e[f].percents);
                        var h;
                        if (this.minMaxField) h = g[this.minMaxField], h < c && (c = h);
                        else for (var j in g) g.hasOwnProperty(j) && ("percents" != j && "total" != j) && (h = g[j], h < c && (c = h))
                    }
                }
        }
        return c
    },
    getMax: function () {
        var a, b;
        for (b = this.start; b <= this.end; b++) {
            var c = this.data[b].axes[this.id].graphs,
                d;
            for (d in c) if (c.hasOwnProperty(d)) {
                    var e = this.chart.getGraphById(d);
                    if (e.includeInMinMax && (!e.hidden || this.includeHidden)) {
                        isNaN(a) && (a = -Infinity);
                        this.foundGraphs = !0;
                        e = c[d].values;
                        this.recalculateToPercents && (e = c[d].percents);
                        var f;
                        if (this.minMaxField) f = e[this.minMaxField], f > a && (a = f);
                        else for (var g in e) e.hasOwnProperty(g) && ("percents" != g && "total" != g) && (f = e[g], f > a && (a = f))
                    }
                }
        }
        return a
    },
    dispatchZoomEvent: function (a, b) {
        var c = {
            type: "axisZoomed",
            startValue: a,
            endValue: b,
            target: this,
            chart: this.chart
        };
        this.fire(c.type, c)
    },
    zoomToValues: function (a, b) {
        if (b < a) {
            var c = b;
            b = a;
            a = c
        }
        a < this.min && (a = this.min);
        b > this.max && (b = this.max);
        c = {
            type: "axisSelfZoomed"
        };
        c.chart = this.chart;
        c.valueAxis = this;
        c.multiplier = this.axisWidth / Math.abs(this.getCoordinate(b) - this.getCoordinate(a));
        c.position = "V" == this.orientation ? this.reversed ? this.getCoordinate(a) : this.getCoordinate(b) : this.reversed ? this.getCoordinate(b) : this.getCoordinate(a);
        this.fire(c.type, c)
    },
    coordinateToValue: function (a) {
        if (isNaN(a)) return NaN;
        var b = this.axisWidth,
            c = this.stepWidth,
            d = this.reversed,
            e = this.rotate,
            f = this.min,
            g = this.minReal;
        return !0 === this.logarithmic ? Math.pow(10, (e ? !0 === d ? (b - a) / c : a / c : !0 === d ? a / c : (b - a) / c) + Math.log(g) * Math.LOG10E) : !0 === d ? e ? f - (a - b) / c : a / c + f : e ? a / c + f : f - (a - b) / c
    },
    getCoordinate: function (a) {
        if (isNaN(a)) return NaN;
        var b = this.rotate,
            c = this.reversed,
            d = this.axisWidth,
            e = this.stepWidth,
            f = this.min,
            g = this.minReal;
        !0 === this.logarithmic ? (a = Math.log(a) * Math.LOG10E - Math.log(g) * Math.LOG10E, b = b ? !0 === c ? d - e * a : e * a : !0 === c ? e * a : d - e * a) : b = !0 === c ? b ? d - e * (a - f) : e * (a - f) : b ? e * (a - f) : d - e * (a - f);
        b = this.rotate ? b + (this.x - this.viX) : b + (this.y - this.viY);
        return Math.round(b)
    },
    synchronizeWithAxis: function (a) {
        this.synchronizeWithAxis = a;
        this.removeListener(this.synchronizeWithAxis,
            "axisChanged", this.handleSynchronization);
        this.listenTo(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization)
    },
    handleSynchronization: function () {
        var a = this.synchronizeWithAxis,
            b = a.min,
            c = a.max,
            a = a.step,
            d = this.synchronizationMultiplier;
        d && (this.min = b * d, this.max = c * d, this.step = a * d, b = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E)), b = Math.abs(Math.log(Math.abs(b)) * Math.LOG10E), this.maxDecCount = b = Math.round(b), this.draw())
    }
});
AmCharts.CategoryAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,
    construct: function () {
        AmCharts.CategoryAxis.base.construct.call(this);
        this.minPeriod = "DD";
        this.equalSpacing = this.parseDates = !1;
        this.position = "bottom";
        this.startOnAxis = !1;
        this.firstDayOfWeek = 1;
        this.gridPosition = "middle";
        this.boldPeriodBeginning = !0;
        this.periods = [{
                period: "ss",
                count: 1
            }, {
                period: "ss",
                count: 5
            }, {
                period: "ss",
                count: 10
            }, {
                period: "ss",
                count: 30
            }, {
                period: "mm",
                count: 1
            }, {
                period: "mm",
                count: 5
            }, {
                period: "mm",
                count: 10
            }, {
                period: "mm",
                count: 30
            }, {
                period: "hh",
                count: 1
            }, {
                period: "hh",
                count: 3
            }, {
                period: "hh",
                count: 6
            }, {
                period: "hh",
                count: 12
            }, {
                period: "DD",
                count: 1
            }, {
                period: "DD",
                count: 2
            }, {
                period: "DD",
                count: 3
            }, {
                period: "DD",
                count: 4
            }, {
                period: "DD",
                count: 5
            }, {
                period: "WW",
                count: 1
            }, {
                period: "MM",
                count: 1
            }, {
                period: "MM",
                count: 2
            }, {
                period: "MM",
                count: 3
            }, {
                period: "MM",
                count: 6
            }, {
                period: "YYYY",
                count: 1
            }, {
                period: "YYYY",
                count: 2
            }, {
                period: "YYYY",
                count: 5
            }, {
                period: "YYYY",
                count: 10
            }, {
                period: "YYYY",
                count: 50
            }, {
                period: "YYYY",
                count: 100
            }
        ];
        this.dateFormats = [{
                period: "fff",
                format: "JJ:NN:SS"
            }, {
                period: "ss",
                format: "JJ:NN:SS"
            }, {
                period: "mm",
                format: "JJ:NN"
            }, {
                period: "hh",
                format: "JJ:NN"
            }, {
                period: "DD",
                format: "MMM DD"
            }, {
                period: "WW",
                format: "MMM DD"
            }, {
                period: "MM",
                format: "MMM"
            }, {
                period: "YYYY",
                format: "YYYY"
            }
        ];
        this.nextPeriod = {};
        this.nextPeriod.fff = "ss";
        this.nextPeriod.ss = "mm";
        this.nextPeriod.mm = "hh";
        this.nextPeriod.hh = "DD";
        this.nextPeriod.DD = "MM";
        this.nextPeriod.MM = "YYYY"
    },
    draw: function () {
        AmCharts.CategoryAxis.base.draw.call(this);
        this.generateDFObject();
        var a = this.chart.chartData;
        this.data = a;
        if (AmCharts.ifArray(a)) {
            var b,
                c = this.chart,
                d = this.start,
                e = this.labelFrequency,
                f = 0;
            b = this.end - d + 1;
            var g = this.gridCount,
                h = this.showFirstLabel,
                j = this.showLastLabel,
                k, l = "",
                l = AmCharts.extractPeriod(this.minPeriod);
            k = AmCharts.getPeriodDuration(l.period, l.count);
            var n, q, m, r, p;
            n = this.rotate;
            var u = this.firstDayOfWeek,
                t = this.boldPeriodBeginning,
                a = AmCharts.resetDateToMin(new Date(a[a.length - 1].time + 1.05 * k), this.minPeriod, 1, u).getTime(),
                s;
            this.endTime > a && (this.endTime = a);
            if (this.parseDates && !this.equalSpacing) {
                if (this.timeDifference = this.endTime -
                    this.startTime, d = this.choosePeriod(0), e = d.period, n = d.count, a = AmCharts.getPeriodDuration(e, n), a < k && (e = l.period, n = l.count, a = k), q = e, "WW" == q && (q = "DD"), this.stepWidth = this.getStepWidth(this.timeDifference), g = Math.ceil(this.timeDifference / a) + 1, l = AmCharts.resetDateToMin(new Date(this.startTime - a), e, n, u).getTime(), q == e && 1 == n && (m = a * this.stepWidth), this.cellWidth = k * this.stepWidth, b = Math.round(l / a), d = -1, b / 2 == Math.round(b / 2) && (d = -2, l -= a), 0 < this.gridCount) for (b = d; b <= g; b++) {
                        r = l + 1.5 * a;
                        r = AmCharts.resetDateToMin(new Date(r),
                            e, n, u).getTime();
                        k = (r - this.startTime) * this.stepWidth;
                        p = !1;
                        this.nextPeriod[q] && (p = this.checkPeriodChange(this.nextPeriod[q], 1, r, l));
                        s = !1;
                        p ? (l = this.dateFormatsObject[this.nextPeriod[q]], s = !0) : l = this.dateFormatsObject[q];
                        t || (s = !1);
                        l = AmCharts.formatDate(new Date(r), l);
                        if (b == d && !h || b == g && !j) l = " ";
                        this.labelFunction && (l = this.labelFunction(l, new Date(r), this));
                        l = new this.axisItemRenderer(this, k, l, !1, m, 0, !1, s);
                        this.pushAxisItem(l);
                        l = r
                }
            } else if (this.parseDates) {
                if (this.parseDates && this.equalSpacing) {
                    f = this.start;
                    this.startTime = this.data[this.start].time;
                    this.endTime = this.data[this.end].time;
                    this.timeDifference = this.endTime - this.startTime;
                    d = this.choosePeriod(0);
                    e = d.period;
                    n = d.count;
                    a = AmCharts.getPeriodDuration(e, n);
                    a < k && (e = l.period, n = l.count, a = k);
                    q = e;
                    "WW" == q && (q = "DD");
                    this.stepWidth = this.getStepWidth(b);
                    g = Math.ceil(this.timeDifference / a) + 1;
                    l = AmCharts.resetDateToMin(new Date(this.startTime - a), e, n, u).getTime();
                    this.cellWidth = this.getStepWidth(b);
                    b = Math.round(l / a);
                    d = -1;
                    b / 2 == Math.round(b / 2) && (d = -2, l -= a);
                    b = this.start;
                    b / 2 == Math.round(b / 2) && b--;
                    0 > b && (b = 0);
                    m = this.end + 2;
                    m >= this.data.length && (m = this.data.length);
                    u = !1;
                    this.end - this.start > this.gridCount && (u = !0);
                    for (this.previousPos = 0; b < m; b++) if (r = this.data[b].time, this.checkPeriodChange(e, n, r, l)) {
                            k = this.getCoordinate(b - this.start);
                            p = !1;
                            this.nextPeriod[q] && (p = this.checkPeriodChange(this.nextPeriod[q], 1, r, l));
                            s = !1;
                            p ? (l = this.dateFormatsObject[this.nextPeriod[q]], s = !0) : l = this.dateFormatsObject[q];
                            l = AmCharts.formatDate(new Date(r), l);
                            if (b == d && !h || b == g && !j) l = " ";
                            u ? u = !1 : (t ||
                                (s = !1), 40 < k - this.previousPos && (this.labelFunction && (l = this.labelFunction(l, new Date(r), this)), l = new this.axisItemRenderer(this, k, l, void 0, void 0, void 0, void 0, s), a = l.graphics(), this.pushAxisItem(l), this.previousPos = k + a.getBBox().width));
                            l = r
                        }
                }
            } else if (this.cellWidth = this.getStepWidth(b), b < g && (g = b), f += this.start, this.stepWidth = this.getStepWidth(b), 0 < g) {
                t = Math.floor(b / g);
                b = f;
                b / 2 == Math.round(b / 2) && b--;
                0 > b && (b = 0);
                for (g = 0; b <= this.end + 2; b++) if (0 <= b && b < this.data.length ? (q = this.data[b], l = q.category) : l = "",
                        b / t == Math.round(b / t) || q.forceShow) {
                        k = this.getCoordinate(b - f);
                        m = 0;
                        "start" == this.gridPosition && (k -= this.cellWidth / 2, m = this.cellWidth / 2);
                        if (b == d && !h || b == this.end && !j) l = void 0;
                        Math.round(g / e) != g / e && (l = void 0);
                        g++;
                        u = this.cellWidth;
                        n && (u = NaN);
                        this.labelFunction && (l = this.labelFunction(l, q, this));
                        l = AmCharts.fixNewLines(l);
                        l = new this.axisItemRenderer(this, k, l, !0, u, m, void 0, !1, m);
                        this.pushAxisItem(l)
                    }
            }
            for (b = 0; b < this.data.length; b++) if (h = this.data[b]) j = this.parseDates && !this.equalSpacing ? Math.round((h.time -
                        this.startTime) * this.stepWidth + this.cellWidth / 2) : this.getCoordinate(b - f), h.x[this.id] = j;
            h = this.guides.length;
            for (b = 0; b < h; b++) j = this.guides[b], k = k = k = g = t = NaN, d = j.above, j.toCategory && (k = c.getCategoryIndexByValue(j.toCategory), isNaN(k) || (t = this.getCoordinate(k - f), l = new this.axisItemRenderer(this, t, "", !0, NaN, NaN, j), this.pushAxisItem(l, d))), j.category && (k = c.getCategoryIndexByValue(j.category), isNaN(k) || (g = this.getCoordinate(k - f), k = (t - g) / 2, l = new this.axisItemRenderer(this, g, j.label, !0, NaN, k, j), this.pushAxisItem(l,
                    d))), j.toDate && (this.equalSpacing ? (k = c.getClosestIndex(this.data, "time", j.toDate.getTime(), !1, 0, this.data.length - 1), isNaN(k) || (t = this.getCoordinate(k - f))) : t = (j.toDate.getTime() - this.startTime) * this.stepWidth, l = new this.axisItemRenderer(this, t, "", !0, NaN, NaN, j), this.pushAxisItem(l, d)), j.date && (this.equalSpacing ? (k = c.getClosestIndex(this.data, "time", j.date.getTime(), !1, 0, this.data.length - 1), isNaN(k) || (g = this.getCoordinate(k - f))) : g = (j.date.getTime() - this.startTime) * this.stepWidth, k = (t - g) / 2, l = "H" == this.orientation ?
                    new this.axisItemRenderer(this, g, j.label, !1, 2 * k, NaN, j) : new this.axisItemRenderer(this, g, j.label, !1, NaN, k, j), this.pushAxisItem(l, d)), t = new this.guideFillRenderer(this, g, t, j), g = t.graphics(), this.pushAxisItem(t, d), j.graphics = g, g.index = b, j.balloonText && this.addEventListeners(g, j)
        }
        this.axisCreated = !0;
        c = this.x;
        f = this.y;
        this.set.translate(c, f);
        this.labelsSet.translate(c, f);
        this.positionTitle();
        (c = this.axisLine.set) && c.toFront()
    },
    choosePeriod: function (a) {
        var b = AmCharts.getPeriodDuration(this.periods[a].period,
            this.periods[a].count),
            c = Math.ceil(this.timeDifference / b),
            d = this.periods;
        return this.timeDifference < b && 0 < a ? d[a - 1] : c <= this.gridCount ? d[a] : a + 1 < d.length ? this.choosePeriod(a + 1) : d[a]
    },
    getStepWidth: function (a) {
        var b;
        this.startOnAxis ? (b = this.axisWidth / (a - 1), 1 == a && (b = this.axisWidth)) : b = this.axisWidth / a;
        return b
    },
    getCoordinate: function (a) {
        a *= this.stepWidth;
        this.startOnAxis || (a += this.stepWidth / 2);
        return Math.round(a)
    },
    timeZoom: function (a, b) {
        this.startTime = a;
        this.endTime = b
    },
    minDuration: function () {
        var a = AmCharts.extractPeriod(this.minPeriod);
        return AmCharts.getPeriodDuration(a.period, a.count)
    },
    checkPeriodChange: function (a, b, c, d) {
        d = new Date(d);
        var e = this.firstDayOfWeek;
        c = AmCharts.resetDateToMin(new Date(c), a, b, e).getTime();
        a = AmCharts.resetDateToMin(d, a, b, e).getTime();
        return c != a ? !0 : !1
    },
    generateDFObject: function () {
        this.dateFormatsObject = {};
        var a;
        for (a = 0; a < this.dateFormats.length; a++) {
            var b = this.dateFormats[a];
            this.dateFormatsObject[b.period] = b.format
        }
    },
    xToIndex: function (a) {
        var b = this.data,
            c = this.chart,
            d = c.rotate,
            e = this.stepWidth;
        this.parseDates && !this.equalSpacing ? (a = this.startTime + Math.round(a / e) - this.minDuration() / 2, c = c.getClosestIndex(b, "time", a, !1, this.start, this.end + 1)) : (this.startOnAxis || (a -= e / 2), c = this.start + Math.round(a / e));
        var c = AmCharts.fitToBounds(c, 0, b.length - 1),
            f;
        b[c] && (f = b[c].x[this.id]);
        d ? f > this.height + 1 && c-- : f > this.width + 1 && c--;
        0 > f && c++;
        return c = AmCharts.fitToBounds(c, 0, b.length - 1)
    },
    dateToCoordinate: function (a) {
        return this.parseDates && !this.equalSpacing ? (a.getTime() - this.startTime) * this.stepWidth : this.parseDates && this.equalSpacing ?
            (a = this.chart.getClosestIndex(this.data, "time", a.getTime(), !1, 0, this.data.length - 1), this.getCoordinate(a - this.start)) : NaN
    },
    categoryToCoordinate: function (a) {
        return this.chart ? (a = this.chart.getCategoryIndexByValue(a), this.getCoordinate(a - this.start)) : NaN
    },
    coordinateToDate: function (a) {
        return this.equalSpacing ? (a = this.xToIndex(a), new Date(this.data[a].time)) : new Date(this.startTime + a / this.stepWidth)
    }
});
AmCharts.RecAxis = AmCharts.Class({
    construct: function (a) {
        var b = a.chart,
            c = a.axisThickness,
            d = a.axisColor,
            e = a.axisAlpha,
            f = a.offset,
            g = a.dx,
            h = a.dy,
            j = a.viX,
            k = a.viY,
            l = a.viH,
            n = a.viW,
            q = b.container;
        "H" == a.orientation ? (d = AmCharts.line(q, [0, n], [0, 0], d, e, c), this.axisWidth = a.width, "bottom" == a.position ? (a = c / 2 + f + l + k - 1, c = j) : (a = -c / 2 - f + k + h, c = g + j)) : (this.axisWidth = a.height, "right" == a.position ? (d = AmCharts.line(q, [0, 0, -g], [0, l, l - h], d, e, c), a = k + h, c = c / 2 + f + g + n + j - 1) : (d = AmCharts.line(q, [0, 0], [0, l], d, e, c), a = k, c = -c / 2 - f + j));
        d.translate(c,
            a);
        b.axesSet.push(d);
        this.set = d
    }
});
AmCharts.RecItem = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g, h, j) {
        b = Math.round(b);
        void 0 == c && (c = "");
        j || (j = 0);
        void 0 == d && (d = !0);
        var k = a.chart.fontFamily,
            l = a.fontSize;
        void 0 == l && (l = a.chart.fontSize);
        var n = a.color;
        void 0 == n && (n = a.chart.color);
        var q = a.chart.container,
            m = q.set();
        this.set = m;
        var r = a.axisThickness,
            p = a.axisColor,
            u = a.axisAlpha,
            t = a.tickLength,
            s = a.gridAlpha,
            w = a.gridThickness,
            x = a.gridColor,
            v = a.dashLength,
            y = a.fillColor,
            A = a.fillAlpha,
            J = a.labelsEnabled,
            E = a.labelRotation,
            O = a.counter,
            K = a.inside,
            T = a.dx,
            S = a.dy,
            da = a.orientation,
            L = a.position,
            U = a.previousCoord,
            ea = a.viH,
            ba = a.viW,
            ca = a.offset,
            la, V;
        g ? (J = !0, isNaN(g.tickLength) || (t = g.tickLength), void 0 != g.lineColor && (x = g.lineColor), isNaN(g.lineAlpha) || (s = g.lineAlpha), isNaN(g.dashLength) || (v = g.dashLength), isNaN(g.lineThickness) || (w = g.lineThickness), !0 === g.inside && (K = !0), isNaN(g.labelRotation) || (E = g.labelRotation), isNaN(g.fontSize) || (l = g.fontSize), g.position && (L = g.position)) : "" === c && (t = 0);
        V = "start";
        e && (V = "middle");
        var P = E * Math.PI / 180,
            $, F = 0,
            D = 0,
            z = 0,
            fa =
                $ = 0;
        "V" == da && (E = 0);
        var W;
        J && (W = AmCharts.text(q, c, n, k, l, V, h), fa = W.getBBox().width);
        if ("H" == da) {
            if (0 <= b && b <= ba + 1 && (0 < t && (0 < u && b + j <= ba + 1) && (la = AmCharts.line(q, [b + j, b + j], [0, t], p, u, w), m.push(la)), 0 < s && (V = AmCharts.line(q, [b, b + T, b + T], [ea, ea + S, S], x, s, w, v), m.push(V))), D = 0, F = b, g && 90 == E && (F -= l), !1 === d ? (V = "start", D = "bottom" == L ? K ? D + t : D - t : K ? D - t : D + t, F += 3, e && (F += e / 2, V = "middle"), 0 < E && (V = "middle")) : V = "middle", 1 == O && (0 < A && !g && U < ba) && (d = AmCharts.fitToBounds(b, 0, ba), U = AmCharts.fitToBounds(U, 0, ba), $ = d - U, 0 < $ && (fill = AmCharts.rect(q,
                $, a.height, y, A), fill.translate(d - $ + T, S), m.push(fill))), "bottom" == L ? (D += ea + l / 2 + ca, K ? 0 < E ? (D = ea - fa / 2 * Math.sin(P) - t - 3, F += fa / 2 * Math.cos(P)) : D -= t + l + 3 + 3 : 0 < E ? (D = ea + fa / 2 * Math.sin(P) + t + 3, F -= fa / 2 * Math.cos(P)) : D += t + r + 3 + 3) : (D += S + l / 2 - ca, F += T, K ? 0 < E ? (D = fa / 2 * Math.sin(P) + t + 3, F -= fa / 2 * Math.cos(P)) : D += t + 3 : 0 < E ? (D = -(fa / 2) * Math.sin(P) - t - 6, F += fa / 2 * Math.cos(P)) : D -= t + l + 3 + r + 3), "bottom" == L ? $ = (K ? ea - t - 1 : ea + r - 1) + ca : (z = T, $ = (K ? S : S - t - r + 1) - ca), f && (F += f), S = F, 0 < E && (S += fa / 2 * Math.cos(P)), W && (L = 0, K && (L = fa / 2 * Math.cos(P)), S + L > ba + 1 || 0 > S)) W.remove(),
            W = null
        } else {
            0 <= b && b <= ea + 1 && (0 < t && (0 < u && b + j <= ea + 1) && (la = AmCharts.line(q, [0, t], [b + j, b + j], p, u, w), m.push(la)), 0 < s && (V = AmCharts.line(q, [0, T, ba + T], [b, b + S, b + S], x, s, w, v), m.push(V)));
            V = "end";
            if (!0 === K && "left" == L || !1 === K && "right" == L) V = "start";
            D = b - l / 2;
            1 == O && (0 < A && !g) && (d = AmCharts.fitToBounds(b, 0, ea), U = AmCharts.fitToBounds(U, 0, ea), P = d - U, fill = AmCharts.polygon(q, [0, a.width, a.width, 0], [0, 0, P, P], y, A), fill.translate(T, d - P + S), m.push(fill));
            D += l / 2;
            "right" == L ? (F += T + ba + ca, D += S, K ? (F -= t + 4, f || (D -= l / 2 + 3)) : (F += t + 4 + r, D -= 2)) :
                K ? (F += t + 4 - ca, f || (D -= l / 2 + 3), g && (F += T, D += S)) : (F += -t - r - 4 - 2 - ca, D -= 2);
            la && ("right" == L ? (z += T + ca + ba, $ += S, z = K ? z - r : z + r) : (z -= ca, K || (z -= t + r)));
            f && (D += f);
            K = -3;
            "right" == L && (K += S);
            if (W && (D > ea + 1 || D < K)) W.remove(), W = null
        }
        la && la.translate(z, $);
        !1 === a.visible && (la && la.remove(), W && (W.remove(), W = null));
        W && (W.attr({
            "text-anchor": V
        }), W.translate(F, D), 0 !== E && W.rotate(-E), a.allLabels.push(W), " " != c && (this.label = W));
        a.counter = 0 === O ? 1 : 0;
        a.previousCoord = b;
        0 === this.set.node.childNodes.length && this.set.remove()
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {
        return this.label
    }
});
AmCharts.RecFill = AmCharts.Class({
    construct: function (a, b, c, d) {
        var e = a.dx,
            f = a.dy,
            g = a.orientation,
            h = 0;
        if (c < b) {
            var j = b;
            b = c;
            c = j
        }
        var k = d.fillAlpha;
        isNaN(k) && (k = 0);
        j = a.chart.container;
        d = d.fillColor;
        "V" == g ? (b = AmCharts.fitToBounds(b, 0, a.viH), c = AmCharts.fitToBounds(c, 0, a.viH)) : (b = AmCharts.fitToBounds(b, 0, a.viW), c = AmCharts.fitToBounds(c, 0, a.viW));
        c -= b;
        isNaN(c) && (c = 4, h = 2, k = 0);
        0 > c && "object" == typeof d && (d = d.join(",").split(",").reverse());
        "V" == g ? (a = AmCharts.rect(j, a.width, c, d, k), a.translate(e, b - h + f)) : (a = AmCharts.rect(j,
            c, a.height, d, k), a.translate(b - h + e, f));
        this.set = j.set([a])
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {}
});
AmCharts.RadAxis = AmCharts.Class({
    construct: function (a) {
        var b = a.chart,
            c = a.axisThickness,
            d = a.axisColor,
            e = a.axisAlpha,
            f = a.x,
            g = a.y;
        this.set = b.container.set();
        b.axesSet.push(this.set);
        var h = a.axisTitleOffset,
            j = a.radarCategoriesEnabled,
            k = a.chart.fontFamily,
            l = a.fontSize;
        void 0 === l && (l = a.chart.fontSize);
        var n = a.color;
        void 0 === n && (n = a.chart.color);
        if (b) {
            this.axisWidth = a.height;
            a = b.chartData;
            var q = a.length,
                m;
            for (m = 0; m < q; m++) {
                var r = 180 - 360 / q * m,
                    p = f + this.axisWidth * Math.sin(r / 180 * Math.PI),
                    u = g + this.axisWidth * Math.cos(r /
                        180 * Math.PI);
                0 < e && (p = AmCharts.line(b.container, [f, p], [g, u], d, e, c), this.set.push(p));
                if (j) {
                    var t = "start",
                        p = f + (this.axisWidth + h) * Math.sin(r / 180 * Math.PI),
                        u = g + (this.axisWidth + h) * Math.cos(r / 180 * Math.PI);
                    if (180 == r || 0 === r) t = "middle", p -= 5;
                    0 > r && (t = "end", p -= 10);
                    180 == r && (u -= 5);
                    0 === r && (u += 5);
                    r = AmCharts.text(b.container, a[m].category, n, k, l, t);
                    r.translate(p + 5, u);
                    this.set.push(r);
                    r.getBBox()
                }
            }
        }
    }
});
AmCharts.RadItem = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g) {
        void 0 === c && (c = "");
        var h = a.chart.fontFamily,
            j = a.fontSize;
        void 0 === j && (j = a.chart.fontSize);
        var k = a.color;
        void 0 === k && (k = a.chart.color);
        var l = a.chart.container;
        this.set = d = l.set();
        var n = a.axisColor,
            q = a.axisAlpha,
            m = a.tickLength,
            r = a.gridAlpha,
            p = a.gridThickness,
            u = a.gridColor,
            t = a.dashLength,
            s = a.fillColor,
            w = a.fillAlpha,
            x = a.labelsEnabled;
        e = a.counter;
        var v = a.inside,
            y = a.gridType,
            A;
        b -= a.height;
        var J;
        f = a.x;
        var E = a.y;
        g ? (x = !0, isNaN(g.tickLength) ||
            (m = g.tickLength), void 0 != g.lineColor && (u = g.lineColor), isNaN(g.lineAlpha) || (r = g.lineAlpha), isNaN(g.dashLength) || (t = g.dashLength), isNaN(g.lineThickness) || (p = g.lineThickness), !0 === g.inside && (v = !0)) : c || (r /= 3, m /= 2);
        var O = "end",
            K = -1;
        v && (O = "start", K = 1);
        var T;
        x && (T = AmCharts.text(l, c, k, h, j, O), T.translate(f + (m + 3) * K, b), d.push(T), this.label = T, J = AmCharts.line(l, [f, f + m * K], [b, b], n, q, p), d.push(J));
        b = a.y - b;
        c = [];
        h = [];
        if (0 < r) {
            if ("polygons" == y) {
                A = a.data.length;
                for (j = 0; j < A; j++) k = 180 - 360 / A * j, c.push(b * Math.sin(k / 180 * Math.PI)),
                h.push(b * Math.cos(k / 180 * Math.PI));
                c.push(c[0]);
                h.push(h[0]);
                r = AmCharts.line(l, c, h, u, r, p, t)
            } else r = AmCharts.circle(l, b, "#FFFFFF", 0, p, u, r);
            r.translate(f, E);
            d.push(r)
        }
        if (1 == e && 0 < w && !g) {
            g = a.previousCoord;
            if ("polygons" == y) {
                for (j = A; 0 <= j; j--) k = 180 - 360 / A * j, c.push(g * Math.sin(k / 180 * Math.PI)), h.push(g * Math.cos(k / 180 * Math.PI));
                A = AmCharts.polygon(l, c, h, s, w)
            } else A = AmCharts.wedge(l, 0, 0, 0, -360, b, b, g, 0, {
                    fill: s,
                    "fill-opacity": w,
                    stroke: 0,
                    "stroke-opacity": 0,
                    "stroke-width": 0
                });
            d.push(A);
            A.translate(f, E)
        }!1 === a.visible &&
            (J && J.hide(), T && T.hide());
        a.counter = 0 === e ? 1 : 0;
        a.previousCoord = b
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {
        return this.label
    }
});
AmCharts.RadarFill = AmCharts.Class({
    construct: function (a, b, c, d) {
        b -= a.axisWidth;
        c -= a.axisWidth;
        var e = Math.max(b, c);
        b = c = Math.min(b, c);
        c = a.chart.container;
        var f = d.fillAlpha,
            g = d.fillColor,
            e = Math.abs(e - a.y);
        b = Math.abs(b - a.y);
        var h = Math.max(e, b);
        b = Math.min(e, b);
        e = h;
        h = -d.angle;
        d = -d.toAngle;
        isNaN(h) && (h = 0);
        isNaN(d) && (d = -360);
        this.set = c.set();
        void 0 === g && (g = "#000000");
        isNaN(f) && (f = 0);
        if ("polygons" == a.gridType) {
            d = [];
            var j = [],
                k = a.data.length,
                l;
            for (l = 0; l < k; l++) h = 180 - 360 / k * l, d.push(e * Math.sin(h / 180 * Math.PI)), j.push(e *
                    Math.cos(h / 180 * Math.PI));
            d.push(d[0]);
            j.push(j[0]);
            for (l = k; 0 <= l; l--) h = 180 - 360 / k * l, d.push(b * Math.sin(h / 180 * Math.PI)), j.push(b * Math.cos(h / 180 * Math.PI));
            this.fill = AmCharts.polygon(c, d, j, g, f)
        } else this.fill = AmCharts.wedge(c, 0, 0, h, d - h, e, e, b, 0, {
                fill: g,
                "fill-opacity": f,
                stroke: 0,
                "stroke-opacity": 0,
                "stroke-width": 0
            });
        this.set.push(this.fill);
        this.fill.translate(a.x, a.y)
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {}
});
AmCharts.AmGraph = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem");
        this.type = "line";
        this.stackable = !0;
        this.columnCount = 1;
        this.columnIndex = 0;
        this.centerCustomBullets = this.showBalloon = !0;
        this.maxBulletSize = 50;
        this.minBulletSize = 0;
        this.balloonText = "[[value]]";
        this.hidden = this.scrollbar = this.animationPlayed = !1;
        this.columnWidth = 0.8;
        this.pointPosition = "middle";
        this.depthCount = 1;
        this.includeInMinMax = !0;
        this.negativeBase = 0;
        this.visibleInLegend = !0;
        this.showAllValueLabels = !1;
        this.showBalloonAt = "close";
        this.lineThickness = 1;
        this.dashLength = 0;
        this.connect = !0;
        this.lineAlpha = 1;
        this.bullet = "none";
        this.bulletBorderThickness = 2;
        this.bulletAlpha = this.bulletBorderAlpha = 1;
        this.bulletSize = 8;
        this.hideBulletsCount = this.bulletOffset = 0;
        this.labelPosition = "top";
        this.cornerRadiusTop = 0;
        this.cursorBulletAlpha = 1;
        this.gradientOrientation = "vertical";
        this.dy = this.dx = 0;
        this.periodValue = "";
        this.y = this.x = 0
    },
    draw: function () {
        var a =
            this.chart,
            b = a.container;
        this.container = b;
        this.destroy();
        var c = b.set(),
            d = b.set();
        this.behindColumns ? (a.graphsBehindSet.push(c), a.bulletBehindSet.push(d)) : (a.graphsSet.push(c), a.bulletSet.push(d));
        this.bulletSet = d;
        if (!this.scrollbar) {
            var e = a.marginLeftReal,
                a = a.marginTopReal;
            c.translate(e, a);
            d.translate(e, a)
        }
        b = b.set();
        AmCharts.remove(this.columnsSet);
        c.push(b);
        this.set = c;
        this.columnsSet = b;
        this.columnsArray = [];
        this.ownColumns = [];
        this.allBullets = [];
        this.animationArray = [];
        AmCharts.ifArray(this.data) &&
            (c = !1, "xy" == this.chartType ? this.xAxis.axisCreated && this.yAxis.axisCreated && (c = !0) : this.valueAxis.axisCreated && (c = !0), !this.hidden && c && this.createGraph())
    },
    createGraph: function () {
        var a = this.chart;
        "inside" == this.labelPosition && (this.labelPosition = "bottom");
        this.startAlpha = a.startAlpha;
        this.seqAn = a.sequencedAnimation;
        this.baseCoord = this.valueAxis.baseCoord;
        this.fillColors || (this.fillColors = this.lineColor);
        void 0 === this.fillAlphas && (this.fillAlphas = 0);
        void 0 === this.bulletColor && (this.bulletColor = this.lineColor,
            this.bulletColorNegative = this.negativeLineColor);
        void 0 === this.bulletAlpha && (this.bulletAlpha = this.lineAlpha);
        this.bulletBorderColor || (this.bulletBorderAlpha = 0);
        if (!isNaN(this.valueAxis.min) && !isNaN(this.valueAxis.max)) {
            switch (this.chartType) {
            case "serial":
                this.createSerialGraph();
                "candlestick" == this.type && 1 > this.valueAxis.minMaxMultiplier && this.positiveClip(this.set);
                break;
            case "radar":
                this.createRadarGraph();
                break;
            case "xy":
                this.createXYGraph(), this.positiveClip(this.set)
            }
            this.animationPlayed = !0
        }
    },
    createXYGraph: function () {
        var a = [],
            b = [],
            c = this.xAxis,
            d = this.yAxis;
        this.pmh = d.viH + 1;
        this.pmw = c.viW + 1;
        this.pmy = this.pmx = 0;
        var e;
        for (e = this.start; e <= this.end; e++) {
            var f = this.data[e].axes[c.id].graphs[this.id],
                g = f.values,
                h = g.x,
                j = g.y,
                g = c.getCoordinate(h),
                k = d.getCoordinate(j);
            if (!isNaN(h) && !isNaN(j) && (a.push(g), b.push(k), (h = this.createBullet(f, g, k, e)) || (h = 0), j = this.labelText)) f = this.createLabel(f, g, k, j), this.allBullets.push(f), this.positionLabel(g, k, f, this.labelPosition, h)
        }
        this.drawLineGraph(a, b);
        this.launchAnimation()
    },
    createRadarGraph: function () {
        var a = this.valueAxis.stackType,
            b = [],
            c = [],
            d, e, f;
        for (f = this.start; f <= this.end; f++) {
            var g = this.data[f].axes[this.valueAxis.id].graphs[this.id],
                h;
            h = "none" == a || "3d" == a ? g.values.value : g.values.close;
            if (isNaN(h)) this.drawLineGraph(b, c), b = [], c = [];
            else {
                var j = this.y - (this.valueAxis.getCoordinate(h) - this.height),
                    k = 180 - 360 / (this.end - this.start + 1) * f;
                h = j * Math.sin(k / 180 * Math.PI);
                j *= Math.cos(k / 180 * Math.PI);
                b.push(h);
                c.push(j);
                (k = this.createBullet(g, h, j, f)) || (k = 0);
                var l = this.labelText;
                l && (g = this.createLabel(g, h, j, l), this.allBullets.push(g), this.positionLabel(h, j, g, this.labelPosition, k));
                isNaN(d) && (d = h);
                isNaN(e) && (e = j)
            }
        }
        b.push(d);
        c.push(e);
        this.drawLineGraph(b, c);
        this.launchAnimation()
    },
    positionLabel: function (a, b, c, d, e) {
        var f = c.getBBox();
        switch (d) {
        case "left":
            a -= (f.width + e) / 2 + 2;
            break;
        case "top":
            b -= (e + f.height) / 2 + 1;
            break;
        case "right":
            a += (f.width + e) / 2 + 2;
            break;
        case "bottom":
            b += (e + f.height) / 2 + 1
        }
        c.translate(a, b)
    },
    createSerialGraph: function () {
        var a = this.id,
            b = this.index,
            c = this.data,
            d =
                this.chart.container,
            e = this.valueAxis,
            f = this.type,
            g = this.columnWidth,
            h = this.width,
            j = this.height,
            k = this.y,
            l = this.rotate,
            n = this.columnCount,
            q = AmCharts.toCoordinate(this.cornerRadiusTop, g / 2),
            m = this.connect,
            r = [],
            p = [],
            u, t, s = this.chart.graphs.length,
            w, x = this.dx / this.depthCount,
            v = this.dy / this.depthCount,
            y = e.stackType,
            A = this.labelPosition,
            J = this.start,
            E = this.end,
            O = this.scrollbar,
            K = this.categoryAxis,
            T = this.baseCoord,
            S = this.negativeBase,
            da = this.columnIndex,
            L = this.lineThickness,
            U = this.lineAlpha,
            ea = this.lineColor,
            ba = this.dashLength,
            ca = this.set;
        "above" == A && (A = "top");
        "below" == A && (A = "bottom");
        var la = A,
            V = 270;
        "horizontal" == this.gradientOrientation && (V = 0);
        this.gradientRotation = V;
        var P = this.chart.columnSpacing,
            $ = K.cellWidth,
            F = ($ * g - n) / n;
        P > F && (P = F);
        var D, z, fa, W = j + 1,
            Va = h + 1,
            Oa = 0,
            Wa = 0,
            Xa, Ya, Pa, Qa, Ab = this.fillColors,
            Ea = this.negativeFillColors,
            xa = this.negativeLineColor,
            Fa = this.fillAlphas,
            Ga = this.negativeFillAlphas;
        "object" == typeof Fa && (Fa = Fa[0]);
        "object" == typeof Ga && (Ga = Ga[0]);
        var Ra = e.getCoordinate(e.min);
        e.logarithmic &&
            (Ra = e.getCoordinate(e.minReal));
        this.minCoord = Ra;
        this.resetBullet && (this.bullet = "none");
        if (!O && ("line" == f || "smoothedLine" == f || "step" == f)) if (1 == c.length && ("step" != f && "none" == this.bullet) && (this.bullet = "round", this.resetBullet = !0), Ea || void 0 != xa) {
                var Ba = S;
                Ba > e.max && (Ba = e.max);
                Ba < e.min && (Ba = e.min);
                e.logarithmic && (Ba = e.minReal);
                var sa = e.getCoordinate(Ba),
                    mb = e.getCoordinate(e.max);
                l ? (W = j, Va = Math.abs(mb - sa), Xa = j, Ya = Math.abs(Ra - sa), Qa = Wa = 0, e.reversed ? (Oa = 0, Pa = sa) : (Oa = sa, Pa = 0)) : (Va = h, W = Math.abs(mb - sa), Ya =
                    h, Xa = Math.abs(Ra - sa), Pa = Oa = 0, e.reversed ? (Qa = k, Wa = sa) : Qa = sa + 1)
            }
        var ta = Math.round;
        this.pmx = ta(Oa);
        this.pmy = ta(Wa);
        this.pmh = ta(W);
        this.pmw = ta(Va);
        this.nmx = ta(Pa);
        this.nmy = ta(Qa);
        this.nmh = ta(Xa);
        this.nmw = ta(Ya);
        g = "column" == f ? ($ * g - P * (n - 1)) / n : $ * g;
        1 > g && (g = 1);
        var M;
        if ("line" == f || "step" == f || "smoothedLine" == f) {
            if (0 < J) for (M = J - 1; - 1 < M; M--) if (D = c[M], z = D.axes[e.id].graphs[a], fa = z.values.value) {
                        J = M;
                        break
                    }
            if (E < c.length - 1) for (M = E + 1; M < c.length; M++) if (D = c[M], z = D.axes[e.id].graphs[a], fa = z.values.value) {
                        E = M;
                        break
                    }
        }
        E < c.length -
            1 && E++;
        var ga = [],
            ha = [],
            Ha = !1;
        if ("line" == f || "step" == f || "smoothedLine" == f) if (this.stackable && "regular" == y || "100%" == y || this.fillToGraph) Ha = !0;
        for (M = J; M <= E; M++) {
            D = c[M];
            z = D.axes[e.id].graphs[a];
            z.index = M;
            var H, I, G, Y, na = NaN,
                C = NaN,
                B = NaN,
                Q = NaN,
                N = NaN,
                Ia = NaN,
                ya = NaN,
                Ja = NaN,
                za = NaN,
                X = NaN,
                aa = NaN,
                oa = NaN,
                pa = NaN,
                R = NaN,
                Za = NaN,
                $a = NaN,
                ia = NaN,
                ja = void 0,
                ua = Ab,
                Ka = Fa,
                ma = ea,
                ka, qa;
            void 0 != z.color && (ua = z.color);
            z.fillColors && (ua = z.fillColors);
            isNaN(z.alpha) || (Ka = z.alpha);
            var ra = z.values;
            e.recalculateToPercents && (ra = z.percents);
            if (ra) {
                R = !this.stackable || "none" == y || "3d" == y ? ra.value : ra.close;
                if ("candlestick" == f || "ohlc" == f) R = ra.close, $a = ra.low, ya = e.getCoordinate($a), Za = ra.high, za = e.getCoordinate(Za);
                ia = ra.open;
                B = e.getCoordinate(R);
                isNaN(ia) || (N = e.getCoordinate(ia));
                if (!O) switch (this.showBalloonAt) {
                    case "close":
                        z.y = B;
                        break;
                    case "open":
                        z.y = N;
                        break;
                    case "high":
                        z.y = za;
                        break;
                    case "low":
                        z.y = ya
                }
                var na = D.x[K.id],
                    va = Math.floor($ / 2),
                    La = va;
                "start" == this.pointPosition && (na -= $ / 2, va = 0, La = $);
                O || (z.x = na); - 1E5 > na && (na = -1E5);
                na > h + 1E5 && (na = h +
                    1E5);
                l ? (C = B, Q = N, N = B = na, isNaN(ia) && !this.fillToGraph && (Q = T), Ia = ya, Ja = za) : (Q = C = na, isNaN(ia) && !this.fillToGraph && (N = T));
                R < ia && (z.isNegative = !0, Ea && (ua = Ea), Ga && (Ka = Ga), void 0 != xa && (ma = xa));
                switch (f) {
                case "line":
                    isNaN(R) ? m || (this.drawLineGraph(r, p, ga, ha), r = [], p = [], ga = [], ha = []) : (z.isNegative = R < S ? !0 : !1, r.push(C), p.push(B), X = C, aa = B, oa = C, pa = B, Ha && (!isNaN(N) && !isNaN(Q)) && (ga.push(Q), ha.push(N)));
                    break;
                case "smoothedLine":
                    isNaN(R) ? m || (this.drawSmoothedGraph(r, p, ga, ha), r = [], p = [], ga = [], ha = []) : (z.isNegative = R <
                        S ? !0 : !1, r.push(C), p.push(B), X = C, aa = B, oa = C, pa = B, Ha && (!isNaN(N) && !isNaN(Q)) && (ga.push(Q), ha.push(N)));
                    break;
                case "step":
                    isNaN(R) ? m || (t = NaN, this.drawLineGraph(r, p, ga, ha), r = [], p = [], ga = [], ha = []) : (z.isNegative = R < S ? !0 : !1, l ? (isNaN(u) || (r.push(u), p.push(B - va)), p.push(B - va), r.push(C), p.push(B + La), r.push(C), Ha && (!isNaN(N) && !isNaN(Q)) && (ga.push(Q), ha.push(N - va), ga.push(Q), ha.push(N + La))) : (isNaN(t) || (p.push(t), r.push(C - va)), r.push(C - va), p.push(B), r.push(C + La), p.push(B), Ha && (!isNaN(N) && !isNaN(Q)) && (ga.push(Q - va),
                        ha.push(N), ga.push(Q + La), ha.push(N))), u = C, t = B, X = C, aa = B, oa = C, pa = B);
                    break;
                case "column":
                    ka = ma;
                    void 0 != z.lineColor && (ka = z.lineColor);
                    if (!isNaN(R)) {
                        R < S ? (z.isNegative = !0, Ea && (ua = Ea), void 0 != xa && (ma = xa)) : z.isNegative = !1;
                        var nb = e.min,
                            ob = e.max;
                        if (!(R < nb && ia < nb || R > ob && ia > ob)) if (l) {
                                "3d" == y ? (I = B - 0.5 * (g + P) + P / 2 + v * da, H = Q + x * da) : (I = B - (n / 2 - da) * (g + P) + P / 2, H = Q);
                                G = g;
                                X = C;
                                aa = I + g / 2;
                                oa = C;
                                pa = I + g / 2;
                                I + G > j && (G = j - I);
                                0 > I && (G += I, I = 0);
                                Y = C - Q;
                                var Bb = H;
                                H = AmCharts.fitToBounds(H, 0, h);
                                Y += Bb - H;
                                Y = AmCharts.fitToBounds(Y, -H, h - H + x * da);
                                if (I <
                                    j && 0 < G && (ja = new AmCharts.Cuboid(d, Y, G, x, v, ua, Ka, L, ka, U, V, q, l), "bottom" != A)) if (A = e.reversed ? "left" : "right", 0 > R) A = e.reversed ? "right" : "left";
                                    else if ("regular" == y || "100%" == y) X += this.dx
                            } else {
                                "3d" == y ? (H = C - 0.5 * (g + P) + P / 2 + x * da, I = N + v * da) : (H = C - (n / 2 - da) * (g + P) + P / 2, I = N);
                                G = g;
                                X = H + g / 2;
                                aa = B;
                                oa = H + g / 2;
                                pa = B;
                                H + G > h + da * x && (G = h - H + da * x);
                                0 > H && (G += H, H = 0);
                                Y = B - N;
                                var Cb = I;
                                I = AmCharts.fitToBounds(I, this.dy, j);
                                Y += Cb - I;
                                Y = AmCharts.fitToBounds(Y, -I + v * da, j - I);
                                if (H < h + da * x && 0 < G) if (ja = new AmCharts.Cuboid(d, G, Y, x, v, ua, Ka, L, ka, this.lineAlpha,
                                        V, q, l), 0 > R && "middle" != A) A = "bottom";
                                    else if (A = la, "regular" == y || "100%" == y) aa += this.dy
                            }
                        if (ja && (qa = ja.set, qa.translate(H, I), this.columnsSet.push(qa), z.url && qa.setAttr("cursor", "pointer"), !O)) {
                            "none" == y && (w = l ? (this.end + 1 - M) * s - b : s * M + b);
                            "3d" == y && (l ? (w = (s - b) * (this.end + 1 - M), X += x * this.columnIndex, oa += x * this.columnIndex, z.y += x * this.columnIndex) : (w = (s - b) * (M + 1), X += 3, aa += v * this.columnIndex + 7, pa += v * this.columnIndex, z.y += v * this.columnIndex));
                            if ("regular" == y || "100%" == y) A = "middle", w = l ? 0 < ra.value ? (this.end + 1 - M) * s + b :
                                    (this.end + 1 - M) * s - b : 0 < ra.value ? s * M + b : s * M - b;
                            this.columnsArray.push({
                                column: ja,
                                depth: w
                            });
                            z.x = l ? I + G / 2 : H + G / 2;
                            this.ownColumns.push(ja);
                            this.animateColumns(ja, M, C, Q, B, N);
                            this.addListeners(qa, z)
                        }
                    }
                    break;
                case "candlestick":
                    if (!isNaN(ia) && !isNaN(R)) {
                        var Sa, ab;
                        ka = ma;
                        void 0 != z.lineColor && (ka = z.lineColor);
                        if (l) {
                            if (I = B - g / 2, H = Q, G = g, I + G > j && (G = j - I), 0 > I && (G += I, I = 0), I < j && 0 < G) {
                                var bb, cb;
                                R > ia ? (bb = [C, Ja], cb = [Q, Ia]) : (bb = [Q, Ja], cb = [C, Ia]);
                                !isNaN(Ja) && !isNaN(Ia) && (B < j && 0 < B) && (Sa = AmCharts.line(d, bb, [B, B], ka, U, L), ab = AmCharts.line(d,
                                    cb, [B, B], ka, U, L));
                                Y = C - Q;
                                ja = new AmCharts.Cuboid(d, Y, G, x, v, ua, Fa, L, ka, U, V, q, l)
                            }
                        } else if (H = C - g / 2, I = N + L / 2, G = g, H + G > h && (G = h - H), 0 > H && (G += H, H = 0), Y = B - N, H < h && 0 < G) {
                            var ja = new AmCharts.Cuboid(d, G, Y, x, v, ua, Ka, L, ka, U, V, q, l),
                                db, eb;
                            R > ia ? (db = [B, za], eb = [N, ya]) : (db = [N, za], eb = [B, ya]);
                            !isNaN(za) && !isNaN(ya) && (C < h && 0 < C) && (Sa = AmCharts.line(d, [C, C], db, ka, U, L), ab = AmCharts.line(d, [C, C], eb, ka, U, L))
                        }
                        ja && (qa = ja.set, ca.push(qa), qa.translate(H, I), z.url && qa.setAttr("cursor", "pointer"), Sa && (ca.push(Sa), ca.push(ab)), X = C, aa = B, oa = C,
                            pa = B, O || (z.x = l ? I + G / 2 : H + G / 2, this.animateColumns(ja, M, C, Q, B, N), this.addListeners(qa, z)))
                    }
                    break;
                case "ohlc":
                    if (!isNaN(ia) && !isNaN(Za) && !isNaN($a) && !isNaN(R)) {
                        R < ia && (z.isNegative = !0, void 0 != xa && (ma = xa));
                        var fb, gb, hb;
                        if (l) {
                            var ib = B - g / 2,
                                ib = AmCharts.fitToBounds(ib, 0, j),
                                pb = AmCharts.fitToBounds(B, 0, j),
                                jb = B + g / 2,
                                jb = AmCharts.fitToBounds(jb, 0, j);
                            gb = AmCharts.line(d, [Q, Q], [ib, pb], ma, U, L, ba);
                            0 < B && B < j && (fb = AmCharts.line(d, [Ia, Ja], [B, B], ma, U, L, ba));
                            hb = AmCharts.line(d, [C, C], [pb, jb], ma, U, L, ba)
                        } else {
                            var kb = C - g / 2,
                                kb = AmCharts.fitToBounds(kb,
                                    0, h),
                                qb = AmCharts.fitToBounds(C, 0, h),
                                lb = C + g / 2,
                                lb = AmCharts.fitToBounds(lb, 0, h);
                            gb = AmCharts.line(d, [kb, qb], [N, N], ma, U, L, ba);
                            0 < C && C < h && (fb = AmCharts.line(d, [C, C], [ya, za], ma, U, L, ba));
                            hb = AmCharts.line(d, [qb, lb], [B, B], ma, U, L, ba)
                        }
                        ca.push(gb);
                        ca.push(fb);
                        ca.push(hb);
                        X = C;
                        aa = B;
                        oa = C;
                        pa = B
                    }
                }
                if (!O && !isNaN(R)) {
                    var rb = this.hideBulletsCount;
                    if (this.end - this.start <= rb || 0 === rb) {
                        var Ca = this.createBullet(z, oa, pa, M);
                        Ca || (Ca = 0);
                        var sb = this.labelText;
                        if (sb) {
                            var Z = this.createLabel(z, 0, 0, sb),
                                wa = 0,
                                Aa = 0,
                                tb = Z.getBBox(),
                                Ta = tb.width,
                                Ua = tb.height;
                            switch (A) {
                            case "left":
                                wa = -(Ta / 2 + Ca / 2 + 3);
                                break;
                            case "top":
                                Aa = -(Ua / 2 + Ca / 2 + 3);
                                break;
                            case "right":
                                wa = Ca / 2 + 2 + Ta / 2;
                                break;
                            case "bottom":
                                l && "column" == f ? (X = T, 0 > R ? (wa = -6, Z.attr({
                                    "text-anchor": "end"
                                })) : (wa = 6, Z.attr({
                                    "text-anchor": "start"
                                }))) : (Aa = Ca / 2 + Ua / 2, Z.x = -(Ta / 2 + 2));
                                break;
                            case "middle":
                                "column" == f && (l ? (Aa = -(Ua / 2) + this.fontSize / 2, wa = -(C - Q) / 2 - x, 0 > Y && (wa += x), Math.abs(C - Q) < Ta && !this.showAllValueLabels && (Z.remove(), Z = null)) : (Aa = -(B - N) / 2, 0 > Y && (Aa -= v), Math.abs(B - N) < Ua && !this.showAllValueLabels && (Z.remove(),
                                    Z = null)))
                            }
                            if (Z) {
                                if (!isNaN(aa) && !isNaN(X)) if (X += wa, aa += Aa, Z.translate(X, aa), l) {
                                        if (0 > aa || aa > j) Z.remove(), Z = null
                                    } else {
                                        var ub = 0;
                                        "3d" == y && (ub = x * da);
                                        if (0 > X || X > h + ub) Z.remove(), Z = null
                                    } else Z.remove(), Z = null;
                                Z && this.allBullets.push(Z)
                            }
                        }
                        if ("column" == f && "regular" == y || "100%" == y) {
                            var vb = e.totalText;
                            if (vb) {
                                var Da = this.createLabel(z, 0, 0, vb);
                                this.allBullets.push(Da);
                                var wb = Da.getBBox(),
                                    xb = wb.width,
                                    yb = wb.height,
                                    Ma, Na, zb = e.totals[M];
                                zb && zb.remove();
                                l ? (Na = B, Ma = 0 > R ? C - xb / 2 - 2 : C + xb / 2 + 3) : (Ma = C, Na = 0 > R ? B + yb / 2 : B - yb / 2 - 3);
                                Da.translate(Ma,
                                    Na);
                                e.totals[M] = Da;
                                l ? (0 > Na || Na > j) && Da.remove() : (0 > Ma || Ma > h) && Da.remove()
                            }
                        }
                    }
                }
            }
        }
        if ("line" == f || "step" == f || "smoothedLine" == f) "smoothedLine" == f ? this.drawSmoothedGraph(r, p, ga, ha) : this.drawLineGraph(r, p, ga, ha), O || this.launchAnimation()
    },
    animateColumns: function (a, b) {
        var c = this,
            d = c.chart.startDuration;
        0 < d && !c.animationPlayed && (c.seqAn ? (a.set.hide(), c.animationArray.push(a), d = setTimeout(function () {
            c.animate.call(c)
        }, 1E3 * d / (c.end - c.start + 1) * (b - c.start)), c.timeOuts.push(d)) : c.animate(a))
    },
    createLabel: function (a,
        b, c, d) {
        var e = this.chart,
            f = a.labelColor;
        void 0 == f && (f = this.color);
        void 0 == f && (f = e.color);
        var g = this.fontSize;
        void 0 === g && (this.fontSize = g = e.fontSize);
        a = e.formatString(d, a, this);
        a = AmCharts.cleanFromEmpty(a);
        e = AmCharts.text(this.container, a, f, e.fontFamily, g);
        e.translate(b, c);
        this.bulletSet.push(e);
        return e
    },
    positiveClip: function (a) {
        a.clipRect(this.pmx, this.pmy, this.pmw, this.pmh)
    },
    negativeClip: function (a) {
        a.clipRect(this.nmx, this.nmy, this.nmw, this.nmh)
    },
    drawLineGraph: function (a, b, c, d) {
        if (1 < a.length) {
            var e =
                this.set,
                f = this.container,
                g = f.set(),
                h = f.set();
            e.push(g);
            e.push(h);
            var j = this.lineAlpha,
                k = this.lineThickness,
                l = this.dashLength,
                e = this.fillAlphas,
                n = this.fillColors,
                q = this.negativeLineColor,
                m = this.negativeFillColors,
                r = this.negativeFillAlphas,
                p = this.baseCoord,
                u = AmCharts.line(f, a, b, this.lineColor, j, k, l, !1, !0);
            g.push(u);
            void 0 !== q && (j = AmCharts.line(f, a, b, q, j, k, l, !1, !0), h.push(j));
            if (0 < e && (j = a.join(";").split(";"), k = b.join(";").split(";"), "serial" == this.chartType && (0 < c.length ? (c.reverse(), d.reverse(), j =
                a.concat(c), k = b.concat(d)) : this.rotate ? (k.push(k[k.length - 1]), j.push(p), k.push(k[0]), j.push(p), k.push(k[0]), j.push(j[0])) : (j.push(j[j.length - 1]), k.push(p), j.push(j[0]), k.push(p), j.push(a[0]), k.push(k[0]))), a = AmCharts.polygon(f, j, k, n, e, 0, 0, 0, this.gradientRotation), g.push(a), m || void 0 !== q)) isNaN(r) && (r = e), m || (m = q), f = AmCharts.polygon(f, j, k, m, r, 0, 0, 0, this.gradientRotation), h.push(f);
            this.applyMask(h, g)
        }
    },
    applyMask: function (a, b) {
        var c = a.length();
        "serial" == this.chartType && !this.scrollbar && (this.positiveClip(b),
            0 < c && this.negativeClip(a))
    },
    drawSmoothedGraph: function (a, b, c, d) {
        if (1 < a.length) {
            var e = this.set,
                f = this.container,
                g = f.set(),
                h = f.set();
            e.push(g);
            e.push(h);
            var j = this.lineAlpha,
                k = this.lineThickness,
                e = this.dashLength,
                l = this.fillAlphas,
                n = this.fillColors,
                q = this.negativeLineColor,
                m = this.negativeFillColors,
                r = this.negativeFillAlphas,
                p = this.baseCoord,
                u = new AmCharts.Bezier(f, a, b, this.lineColor, j, k, n, 0, e);
            g.push(u.path);
            void 0 !== q && (j = new AmCharts.Bezier(f, a, b, q, j, k, n, 0, e), h.push(j.path));
            if (0 < l && (k = a.join(";").split(";"),
                u = b.join(";").split(";"), j = "", 0 < c.length ? (c.reverse(), d.reverse(), k = a.concat(c), u = b.concat(d)) : (this.rotate ? (j += " L" + p + "," + b[b.length - 1], j += " L" + p + "," + b[0]) : (j += " L" + a[a.length - 1] + "," + p, j += " L" + a[0] + "," + p), j += " L" + a[0] + "," + b[0]), c = new AmCharts.Bezier(f, k, u, NaN, 0, 0, n, l, e, j), g.push(c.path), m || void 0 !== q)) r || (r = l), m || (m = q), a = new AmCharts.Bezier(f, a, b, NaN, 0, 0, m, r, e, j), h.push(a.path);
            this.applyMask(h, g)
        }
    },
    launchAnimation: function () {
        var a = this,
            b = a.chart.startDuration;
        if (0 < b && !a.animationPlayed) {
            var c = a.set,
                d = a.bulletSet;
            AmCharts.VML || (c.attr({
                opacity: a.startAlpha
            }), d.attr({
                opacity: a.startAlpha
            }));
            c.hide();
            d.hide();
            a.seqAn ? (b = setTimeout(function () {
                a.animateGraphs.call(a)
            }, 1E3 * a.index * b), a.timeOuts.push(b)) : a.animateGraphs()
        }
    },
    animateGraphs: function () {
        var a = this.chart,
            b = this.set,
            c = this.bulletSet,
            d = this.x,
            e = this.y;
        b.show();
        c.show();
        var f = a.startDuration,
            a = a.startEffect;
        b && (this.rotate ? (b.translate(-1E3, e), c.translate(-1E3, e)) : (b.translate(d, -1E3), c.translate(d, -1E3)), b.animate({
            opacity: 1,
            translate: d + "," + e
        }, f, a), c.animate({
            opacity: 1,
            translate: d + "," + e
        }, f, a))
    },
    animate: function (a) {
        var b = this.chart,
            c = this.container,
            d = this.animationArray;
        !a && 0 < d.length && (a = d[0], d.shift());
        c = c[AmCharts.getEffect(b.startEffect)];
        b = b.startDuration;
        a && (this.rotate ? a.animateWidth(b, c) : a.animateHeight(b, c), a.set.show())
    },
    legendKeyColor: function () {
        var a = this.legendColor,
            b = this.lineAlpha;
        void 0 === a && (a = this.lineColor, 0 === b && (b = this.fillColors) && (a = "object" == typeof b ? b[0] : b));
        return a
    },
    legendKeyAlpha: function () {
        var a = this.legendAlpha;
        void 0 === a && (a = this.lineAlpha, 0 === a && this.fillAlphas && (a = this.fillAlphas), 0 === a && (a = this.bulletAlpha), 0 === a && (a = 1));
        return a
    },
    createBullet: function (a, b, c) {
        var d = this.container,
            e = this.bulletOffset,
            f = this.bulletSize;
        isNaN(a.bulletSize) || (f = a.bulletSize);
        if (!isNaN(this.maxValue)) {
            var g = a.values.value;
            isNaN(g) || (f = g / this.maxValue * this.maxBulletSize)
        }
        f < this.minBulletSize && (f = this.minBulletSize);
        this.rotate ? b += e : c -= e;
        var h;
        if ("none" != this.bullet || a.bullet) {
            var j = this.bulletColor;
            a.isNegative && void 0 !==
                this.bulletColorNegative && (j = this.bulletColorNegative);
            void 0 !== a.color && (j = a.color);
            e = this.bullet;
            a.bullet && (e = a.bullet);
            var g = this.bulletBorderThickness,
                k = this.bulletBorderColor,
                l = this.bulletBorderAlpha,
                n = j,
                q = this.bulletAlpha,
                j = a.alpha;
            isNaN(j) || (q = j);
            j = 0;
            switch (e) {
            case "round":
                h = AmCharts.circle(d, f / 2, n, q, g, k, l);
                break;
            case "square":
                h = AmCharts.polygon(d, [0, f, f, 0], [0, 0, f, f], n, q, g, k, l);
                b -= f / 2;
                c -= f / 2;
                j = -f / 2;
                break;
            case "triangleUp":
                h = AmCharts.triangle(d, f, 0, n, q, g, k, l);
                break;
            case "triangleDown":
                h = AmCharts.triangle(d,
                    f, 180, n, q, g, k, l);
                break;
            case "triangleLeft":
                h = AmCharts.triangle(d, f, 270, n, q, g, k, l);
                break;
            case "triangleRight":
                h = AmCharts.triangle(d, f, 90, n, q, g, k, l);
                break;
            case "bubble":
                h = AmCharts.circle(d, f / 2, n, q, g, k, l, !0)
            }
        }
        g = e = 0;
        if (this.customBullet || a.customBullet) k = this.customBullet, a.customBullet && (k = a.customBullet), k && (h && h.remove(), "function" == typeof k ? (h = new k, h.chart = this.chart, a.bulletConfig && (h.availableSpace = c, h.graph = this, a.bulletConfig.minCoord = this.minCoord - c, h.bulletConfig = a.bulletConfig), h.write(d),
                h = h.set) : (this.chart.path && (k = this.chart.path + k), h = d.image(k, 0, 0, f, f), this.centerCustomBullets && (b -= f / 2, c -= f / 2, e -= f / 2, g -= f / 2)));
        if (h) {
            a.url && h.setAttr("cursor", "pointer");
            if ("serial" == this.chartType && (b - e < j || b - e > this.width || c < -f / 2 || c - g > this.height)) h.remove(), h = null;
            h && (this.bulletSet.push(h), h.translate(b, c), this.addListeners(h, a), this.allBullets.push(h))
        }
        return f
    },
    showBullets: function () {
        var a = this.allBullets,
            b;
        for (b = 0; b < a.length; b++) a[b].show()
    },
    hideBullets: function () {
        var a = this.allBullets,
            b;
        for (b =
            0; b < a.length; b++) a[b].hide()
    },
    addListeners: function (a, b) {
        var c = this;
        a.mouseover(function () {
            c.handleRollOver(b)
        }).mouseout(function () {
            c.handleRollOut(b)
        }).touchend(function () {
            c.handleRollOver(b)
        }).touchstart(function () {
            c.handleRollOver(b)
        }).click(function () {
            c.handleClick(b)
        }).dblclick(function () {
            c.handleDoubleClick(b)
        }).contextmenu(function () {
            c.handleRightClick(b)
        })
    },
    handleRollOver: function (a) {
        if (a) {
            var b = this.chart,
                c = {
                    type: "rollOverGraphItem",
                    item: a,
                    index: a.index,
                    graph: this,
                    target: this,
                    chart: this.chart
                };
            this.fire("rollOverGraphItem", c);
            b.fire("rollOverGraphItem", c);
            clearTimeout(b.hoverInt);
            c = this.showBalloon;
            b.chartCursor && "serial" == this.chartType && (c = !1, !b.chartCursor.valueBalloonsEnabled && this.showBalloon && (c = !0));
            c && (c = b.formatString(this.balloonText, a, a.graph), c = AmCharts.cleanFromEmpty(c), a = b.getBalloonColor(this, a), b.balloon.showBullet = !1, b.balloon.pointerOrientation = "V", b.showBalloon(c, a, !0))
        }
    },
    handleRollOut: function (a) {
        this.chart.hideBalloon();
        a && (a = {
            type: "rollOutGraphItem",
            item: a,
            index: a.index,
            graph: this,
            target: this,
            chart: this.chart
        }, this.fire("rollOutGraphItem", a), this.chart.fire("rollOutGraphItem", a))
    },
    handleClick: function (a) {
        if (a) {
            var b = {
                type: "clickGraphItem",
                item: a,
                index: a.index,
                graph: this,
                target: this,
                chart: this.chart
            };
            this.fire("clickGraphItem", b);
            this.chart.fire("clickGraphItem", b);
            AmCharts.getURL(a.url, this.urlTarget)
        }
    },
    handleRightClick: function (a) {
        a && (a = {
            type: "rightClickGraphItem",
            item: a,
            index: a.index,
            graph: this,
            target: this,
            chart: this.chart
        }, this.fire("rightClickGraphItem", a), this.chart.fire("rightClickGraphItem",
            a))
    },
    handleDoubleClick: function (a) {
        a && (a = {
            type: "doubleClickGraphItem",
            item: a,
            index: a.index,
            graph: this,
            target: this,
            chart: this.chart
        }, this.fire("doubleClickGraphItem", a), this.chart.fire("doubleClickGraphItem", a))
    },
    zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.draw()
    },
    changeOpacity: function (a) {
        var b = this.set;
        b && b.setAttr("opacity", a);
        if (b = this.ownColumns) {
            var c;
            for (c = 0; c < b.length; c++) {
                var d = b[c].set;
                d && d.setAttr("opacity", a)
            }
        }(b = this.bulletSet) && b.setAttr("opacity", a)
    },
    destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.bulletSet);
        var a = this.timeOuts;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) clearTimeout(a[b])
        }
        this.timeOuts = []
    }
});
AmCharts.ChartCursor = AmCharts.Class({
    construct: function () {
        this.createEvents("changed", "zoomed", "onHideCursor", "draw", "selected");
        this.enabled = !0;
        this.cursorAlpha = 1;
        this.selectionAlpha = 0.2;
        this.cursorColor = "#CC0000";
        this.categoryBalloonAlpha = 1;
        this.color = "#FFFFFF";
        this.type = "cursor";
        this.zoomed = !1;
        this.zoomable = !0;
        this.pan = !1;
        this.animate = !0;
        this.categoryBalloonDateFormat = "MMM DD, YYYY";
        this.categoryBalloonEnabled = this.valueBalloonsEnabled = !0;
        this.rolledOver = !1;
        this.cursorPosition = "middle";
        this.bulletsEnabled =
            this.skipZoomDispatch = !1;
        this.bulletSize = 8;
        this.selectWithoutZooming = this.oneBalloonOnly = !1
    },
    draw: function () {
        var a = this;
        a.destroy();
        var b = a.chart,
            c = b.container;
        a.rotate = b.rotate;
        a.container = c;
        c = c.set();
        c.translate(a.x, a.y);
        a.set = c;
        b.cursorSet.push(c);
        c = new AmCharts.AmBalloon;
        c.chart = b;
        a.categoryBalloon = c;
        c.cornerRadius = 0;
        c.borderThickness = 0;
        c.borderAlpha = 0;
        c.showBullet = !1;
        var d = a.categoryBalloonColor;
        void 0 === d && (d = a.cursorColor);
        c.fillColor = d;
        c.fillAlpha = a.categoryBalloonAlpha;
        c.borderColor = d;
        c.color =
            a.color;
        a.rotate && (c.pointerOrientation = "H");
        if (a.valueBalloonsEnabled) for (c = 0; c < b.graphs.length; c++) d = new AmCharts.AmBalloon, d.chart = b, AmCharts.copyProperties(b.balloon, d), b.graphs[c].valueBalloon = d;
        "cursor" == a.type ? a.createCursor() : a.createCrosshair();
        a.interval = setInterval(function () {
            a.detectMovement.call(a)
        }, 40)
    },
    updateData: function () {
        var a = this.chart;
        this.data = a.chartData;
        this.firstTime = a.firstTime;
        this.lastTime = a.lastTime
    },
    createCursor: function () {
        var a = this.chart,
            b = this.cursorAlpha,
            c = a.categoryAxis,
            d = c.position,
            e = c.inside,
            f = c.axisThickness,
            g = this.categoryBalloon,
            h, j, k = a.dx,
            l = a.dy,
            n = this.x,
            q = this.y,
            m = this.width,
            r = this.height,
            a = a.rotate,
            p = c.tickLength;
        g.pointerWidth = p;
        a ? (h = [0, m, m + k], j = [0, 0, l]) : (h = [k, 0, 0], j = [l, 0, r]);
        this.line = b = AmCharts.line(this.container, h, j, this.cursorColor, b, 1);
        this.set.push(b);
        a ? (e && (g.pointerWidth = 0), "right" == d ? e ? g.setBounds(n, q + l, n + m + k, q + r + l) : g.setBounds(n + m + k + f, q + l, n + m + 1E3, q + r + l) : e ? g.setBounds(n, q, m + n, r + q) : g.setBounds(-1E3, -1E3, n - p - f, q + r + 15)) : (g.maxWidth = m, c.parseDates &&
            (p = 0, g.pointerWidth = 0), "top" == d ? e ? g.setBounds(n + k, q + l, m + k + n, r + q) : g.setBounds(n + k, -1E3, m + k + n, q + l - p - f) : e ? g.setBounds(n, q, m + n, r + q - p) : g.setBounds(n, q + r + p + f - 1, n + m, q + r + p + f));
        this.hideCursor()
    },
    createCrosshair: function () {
        var a = this.cursorAlpha,
            b = this.container,
            c = AmCharts.line(b, [0, 0], [0, this.height], this.cursorColor, a, 1),
            a = AmCharts.line(b, [0, this.width], [0, 0], this.cursorColor, a, 1);
        this.set.push(c);
        this.set.push(a);
        this.vLine = c;
        this.hLine = a;
        this.hideCursor()
    },
    detectMovement: function () {
        var a = this.chart;
        if (a.mouseIsOver) {
            var b =
                a.mouseX - this.x,
                c = a.mouseY - this.y;
            0 < b && b < this.width && 0 < c && c < this.height ? (this.drawing ? this.rolledOver || a.setMouseCursor("crosshair") : this.pan && (this.rolledOver || a.setMouseCursor("move")), this.rolledOver = !0, this.setPosition()) : this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
        } else this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
    },
    getMousePosition: function () {
        var a, b = this.width,
            c = this.height;
        a = this.chart;
        this.rotate ? (a = a.mouseY - this.y, 0 > a && (a = 0), a > c && (a = c)) : (a = a.mouseX - this.x, 0 >
            a && (a = 0), a > b && (a = b));
        return a
    },
    updateCrosshair: function () {
        var a = this.chart,
            b = a.mouseX - this.x,
            c = a.mouseY - this.y,
            d = this.vLine,
            e = this.hLine,
            b = AmCharts.fitToBounds(b, 0, this.width),
            c = AmCharts.fitToBounds(c, 0, this.height);
        0 < this.cursorAlpha && (d.show(), e.show(), d.translate(b, 0), e.translate(0, c));
        this.zooming && (a.hideXScrollbar && (b = NaN), a.hideYScrollbar && (c = NaN), this.updateSelectionSize(b, c));
        !a.mouseIsOver && !this.zooming && this.hideCursor()
    },
    updateSelectionSize: function (a, b) {
        AmCharts.remove(this.selection);
        var c = this.selectionPosX,
            d = this.selectionPosY,
            e = 0,
            f = 0,
            g = this.width,
            h = this.height;
        isNaN(a) || (c > a && (e = a, g = c - a), c < a && (e = c, g = a - c), c == a && (e = a, g = 0));
        isNaN(b) || (d > b && (f = b, h = d - b), d < b && (f = d, h = b - d), d == b && (f = b, h = 0));
        0 < g && 0 < h && (c = AmCharts.rect(this.container, g, h, this.cursorColor, this.selectionAlpha), c.translate(e + this.x, f + this.y), this.selection = c)
    },
    arrangeBalloons: function () {
        var a = this.valueBalloons,
            b = this.x,
            c = this.y,
            d = this.height + c;
        a.sort(this.compareY);
        var e;
        for (e = 0; e < a.length; e++) {
            var f = a[e].balloon;
            f.setBounds(b,
                c, b + this.width, d);
            f.draw();
            d = f.yPos - 3
        }
        this.arrangeBalloons2()
    },
    compareY: function (a, b) {
        return a.yy < b.yy ? 1 : -1
    },
    arrangeBalloons2: function () {
        var a = this.valueBalloons;
        a.reverse();
        var b, c = this.x,
            d, e;
        for (e = 0; e < a.length; e++) {
            var f = a[e].balloon;
            b = f.bottom;
            var g = f.bottom - f.yPos;
            0 < e && b - g < d + 3 && (f.setBounds(c, d + 3, c + this.width, d + g + 3), f.draw());
            f.set && f.set.show();
            d = f.bottom
        }
    },
    showBullets: function () {
        AmCharts.remove(this.allBullets);
        var a = this.container,
            b = a.set();
        this.set.push(b);
        this.set.show();
        this.allBullets =
            b;
        var b = this.chart.graphs,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            if (!d.hidden && d.balloonText) {
                var e = this.data[this.index].axes[d.valueAxis.id].graphs[d.id],
                    f = e.y;
                if (!isNaN(f)) {
                    var g, h;
                    g = e.x;
                    this.rotate ? (h = f, f = g) : h = g;
                    d = AmCharts.circle(a, this.bulletSize / 2, this.chart.getBalloonColor(d, e), d.cursorBulletAlpha);
                    d.translate(h, f);
                    this.allBullets.push(d)
                }
            }
        }
    },
    destroy: function () {
        this.clear();
        AmCharts.remove(this.selection);
        this.selection = null;
        var a = this.categoryBalloon;
        a && a.destroy();
        this.destroyValueBalloons();
        AmCharts.remove(this.set)
    },
    clear: function () {
        clearInterval(this.interval)
    },
    destroyValueBalloons: function () {
        var a = this.valueBalloons;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) a[b].balloon.hide()
        }
    },
    zoom: function (a, b, c, d) {
        var e = this.chart;
        this.destroyValueBalloons();
        this.zooming = !1;
        var f;
        this.rotate ? this.selectionPosY = f = e.mouseY : this.selectionPosX = f = e.mouseX;
        this.start = a;
        this.end = b;
        this.startTime = c;
        this.endTime = d;
        this.zoomed = !0;
        var g = e.categoryAxis,
            e = this.rotate;
        f = this.width;
        var h = this.height;
        g.parseDates && !g.equalSpacing ? (a = d - c + g.minDuration(), a = e ? h / a : f / a) : a = e ? h / (b - a) : f / (b - a);
        this.stepWidth = a;
        this.setPosition();
        this.hideCursor()
    },
    hideObj: function (a) {
        a && a.hide()
    },
    hideCursor: function (a) {
        void 0 === a && (a = !0);
        this.hideObj(this.set);
        this.hideObj(this.categoryBalloon);
        this.hideObj(this.line);
        this.hideObj(this.vLine);
        this.hideObj(this.hLine);
        this.hideObj(this.allBullets);
        this.destroyValueBalloons();
        this.selectWithoutZooming || AmCharts.remove(this.selection);
        this.previousIndex = NaN;
        a && this.fire("onHideCursor", {
            type: "onHideCursor",
            chart: this.chart,
            target: this
        });
        this.drawing || this.chart.setMouseCursor("auto")
    },
    setPosition: function (a, b) {
        void 0 === b && (b = !0);
        if ("cursor" == this.type) {
            if (AmCharts.ifArray(this.data)) {
                isNaN(a) && (a = this.getMousePosition());
                if ((a != this.previousMousePosition || !0 === this.zoomed || this.oneBalloonOnly) && !isNaN(a)) {
                    var c = this.chart.categoryAxis.xToIndex(a);
                    if (c != this.previousIndex || this.zoomed || "mouse" == this.cursorPosition || this.oneBalloonOnly) this.updateCursor(c, b), this.zoomed = !1
                }
                this.previousMousePosition =
                    a
            }
        } else this.updateCrosshair()
    },
    updateCursor: function (a, b) {
        var c = this.chart,
            d = c.mouseX - this.x,
            e = c.mouseY - this.y;
        this.drawingNow && (AmCharts.remove(this.drawingLine), this.drawingLine = AmCharts.line(this.container, [this.x + this.drawStartX, this.x + d], [this.y + this.drawStartY, this.y + e], this.cursorColor, 1, 1));
        if (this.enabled) {
            void 0 === b && (b = !0);
            this.index = a;
            var f = c.categoryAxis,
                g = c.dx,
                h = c.dy,
                j = this.x,
                k = this.y,
                l = this.width,
                n = this.height,
                q = this.data[a];
            if (q) {
                var m = q.x[f.id],
                    r = c.rotate,
                    p = f.inside,
                    u = this.stepWidth,
                    t = this.categoryBalloon,
                    s = this.firstTime,
                    w = this.lastTime,
                    x = this.cursorPosition,
                    v = f.position,
                    y = this.zooming,
                    A = this.panning,
                    J = c.graphs,
                    E = f.axisThickness;
                if (c.mouseIsOver || y || A || this.forceShow) if (this.forceShow = !1, A) {
                        var g = this.panClickPos,
                            c = this.panClickEndTime,
                            y = this.panClickStartTime,
                            O = this.panClickEnd,
                            j = this.panClickStart,
                            d = (r ? g - e : g - d) / u;
                        if (!f.parseDates || f.equalSpacing) d = Math.round(d);
                        0 !== d && (g = {
                            type: "zoomed",
                            target: this
                        }, g.chart = this.chart, f.parseDates && !f.equalSpacing ? (c + d > w && (d = w - c), y + d < s && (d =
                            s - y), g.start = y + d, g.end = c + d, this.fire(g.type, g)) : O + d >= this.data.length || 0 > j + d || (g.start = j + d, g.end = O + d, this.fire(g.type, g)))
                    } else {
                        "start" == x && (m -= f.cellWidth / 2);
                        "mouse" == x && c.mouseIsOver && (m = r ? e - 2 : d - 2);
                        if (r) {
                            if (0 > m) if (y) m = 0;
                                else {
                                    this.hideCursor();
                                    return
                                }
                            if (m > n + 1) if (y) m = n + 1;
                                else {
                                    this.hideCursor();
                                    return
                                }
                        } else {
                            if (0 > m) if (y) m = 0;
                                else {
                                    this.hideCursor();
                                    return
                                }
                            if (m > l) if (y) m = l;
                                else {
                                    this.hideCursor();
                                    return
                                }
                        }
                        0 < this.cursorAlpha && (s = this.line, r ? s.translate(0, m + h) : s.translate(m, 0), s.show());
                        this.linePos = r ? m + h :
                            m;
                        y && (r ? this.updateSelectionSize(NaN, m) : this.updateSelectionSize(m, NaN));
                        s = !0;
                        y && (s = !1);
                        this.categoryBalloonEnabled && s ? (r ? (p && ("right" == v ? t.setBounds(j, k + h, j + l + g, k + m + h) : t.setBounds(j, k + h, j + l + g, k + m)), "right" == v ? p ? t.setPosition(j + l + g, k + m + h) : t.setPosition(j + l + g + E, k + m + h) : p ? t.setPosition(j, k + m) : t.setPosition(j - E, k + m)) : "top" == v ? p ? t.setPosition(j + m + g, k + h) : t.setPosition(j + m + g, k + h - E + 1) : p ? t.setPosition(j + m, k + n) : t.setPosition(j + m, k + n + E - 1), f.parseDates ? (f = AmCharts.formatDate(q.category, this.categoryBalloonDateFormat), -1 != f.indexOf("fff") && (f = AmCharts.formatMilliseconds(f, q.category)), t.showBalloon(f)) : t.showBalloon(q.category)) : t.hide();
                        J && this.bulletsEnabled && this.showBullets();
                        this.destroyValueBalloons();
                        if (J && this.valueBalloonsEnabled && s && c.balloon.enabled) {
                            this.valueBalloons = s = [];
                            if (this.oneBalloonOnly) {
                                h = Infinity;
                                for (f = 0; f < J.length; f++) u = J[f], u.showBalloon && (!u.hidden && u.balloonText) && (t = q.axes[u.valueAxis.id].graphs[u.id], w = t.y, isNaN(w) || (r ? Math.abs(d - w) < h && (h = Math.abs(d - w), O = u) : Math.abs(e - w) < h && (h = Math.abs(e -
                                        w), O = u)));
                                this.mostCloseGraph && (O = this.mostCloseGraph)
                            }
                            for (f = 0; f < J.length; f++) if (u = J[f], !(this.oneBalloonOnly && u != O) && (u.showBalloon && !u.hidden && u.balloonText) && (t = q.axes[u.valueAxis.id].graphs[u.id], w = t.y, !isNaN(w))) {
                                    m = t.x;
                                    p = !0;
                                    if (r) {
                                        if (h = w, 0 > m || m > n) p = !1
                                    } else if (h = m, m = w, 0 > h || h > l + g) p = !1;
                                    p && (p = u.valueBalloon, v = c.getBalloonColor(u, t), p.setBounds(j, k, j + l, k + n), p.pointerOrientation = "H", p.changeColor(v), void 0 !== u.balloonAlpha && (p.fillAlpha = u.balloonAlpha), void 0 !== u.balloonTextColor && (p.color = u.balloonTextColor),
                                        p.setPosition(h + j, m + k), u = c.formatString(u.balloonText, t, u), "" !== u && p.showBalloon(u), !r && p.set && p.set.hide(), s.push({
                                        yy: w,
                                        balloon: p
                                    }))
                                }
                            r || this.arrangeBalloons()
                        }
                        b ? (g = {
                            type: "changed"
                        }, g.index = a, g.target = this, g.chart = this.chart, g.zooming = y, g.mostCloseGraph = O, g.position = r ? e : d, g.target = this, c.fire("changed", g), this.fire("changed", g), this.skipZoomDispatch = !1) : (this.skipZoomDispatch = !0, c.updateLegendValues(a));
                        this.previousIndex = a
                    }
            }
        } else this.hideCursor()
    },
    enableDrawing: function (a) {
        this.enabled = !a;
        this.hideCursor();
        this.rolledOver = !1;
        this.drawing = a
    },
    isZooming: function (a) {
        a && a != this.zooming && this.handleMouseDown("fake");
        !a && a != this.zooming && this.handleMouseUp()
    },
    handleMouseOut: function () {
        if (this.enabled) if (this.zooming) this.setPosition();
            else {
                this.index = void 0;
                var a = {
                    type: "changed",
                    index: void 0,
                    target: this
                };
                a.chart = this.chart;
                this.fire("changed", a);
                this.hideCursor()
            }
    },
    handleReleaseOutside: function () {
        this.handleMouseUp()
    },
    handleMouseUp: function () {
        var a = this.chart,
            b = this.data,
            c;
        if (a) {
            var d = a.mouseX - this.x,
                e = a.mouseY -
                    this.y;
            if (this.drawingNow) {
                this.drawingNow = !1;
                AmCharts.remove(this.drawingLine);
                c = this.drawStartX;
                var f = this.drawStartY;
                if (2 < Math.abs(c - d) || 2 < Math.abs(f - e)) c = {
                        type: "draw",
                        target: this,
                        chart: a,
                        initialX: c,
                        initialY: f,
                        finalX: d,
                        finalY: e
                }, this.fire(c.type, c)
            }
            if (this.enabled && 0 < b.length) {
                if (this.pan) this.rolledOver = !1;
                else if (this.zoomable && this.zooming) {
                    c = this.selectWithoutZooming ? {
                        type: "selected"
                    } : {
                        type: "zoomed"
                    };
                    c.target = this;
                    c.chart = a;
                    if ("cursor" == this.type) this.rotate ? this.selectionPosY = e : this.selectionPosX =
                            e = d, 2 > Math.abs(e - this.initialMouse) && this.fromIndex == this.index || (this.index < this.fromIndex ? (c.end = this.fromIndex, c.start = this.index) : (c.end = this.index, c.start = this.fromIndex), e = a.categoryAxis, e.parseDates && !e.equalSpacing && (c.start = b[c.start].time, c.end = a.getEndTime(b[c.end].time)), this.skipZoomDispatch || this.fire(c.type, c));
                    else {
                        var g = this.initialMouseX,
                            h = this.initialMouseY;
                        3 > Math.abs(d - g) && 3 > Math.abs(e - h) || (b = Math.min(g, d), f = Math.min(h, e), d = Math.abs(g - d), e = Math.abs(h - e), a.hideXScrollbar && (b = 0,
                            d = this.width), a.hideYScrollbar && (f = 0, e = this.height), c.selectionHeight = e, c.selectionWidth = d, c.selectionY = f, c.selectionX = b, this.skipZoomDispatch || this.fire(c.type, c))
                    }
                    this.selectWithoutZooming || AmCharts.remove(this.selection)
                }
                this.panning = this.zooming = this.skipZoomDispatch = !1
            }
        }
    },
    showCursorAt: function (a) {
        var b = this.chart.categoryAxis;
        a = b.parseDates ? b.dateToCoordinate(a) : b.categoryToCoordinate(a);
        this.previousMousePosition = NaN;
        this.forceShow = !0;
        this.setPosition(a, !1)
    },
    handleMouseDown: function (a) {
        if (this.zoomable ||
            this.pan || this.drawing) {
            var b = this.rotate,
                c = this.chart,
                d = c.mouseX - this.x,
                e = c.mouseY - this.y;
            if (0 < d && d < this.width && 0 < e && e < this.height || "fake" == a) this.setPosition(), this.selectWithoutZooming && AmCharts.remove(this.selection), this.drawing ? (this.drawStartY = e, this.drawStartX = d, this.drawingNow = !0) : this.pan ? (this.zoomable = !1, c.setMouseCursor("move"), this.panning = !0, this.panClickPos = b ? e : d, this.panClickStart = this.start, this.panClickEnd = this.end, this.panClickStartTime = this.startTime, this.panClickEndTime = this.endTime) :
                    this.zoomable && ("cursor" == this.type ? (this.fromIndex = this.index, b ? (this.initialMouse = e, this.selectionPosY = this.linePos) : (this.initialMouse = d, this.selectionPosX = this.linePos)) : (this.initialMouseX = d, this.initialMouseY = e, this.selectionPosX = d, this.selectionPosY = e), this.zooming = !0)
        }
    }
});
AmCharts.SimpleChartScrollbar = AmCharts.Class({
    construct: function () {
        this.createEvents("zoomed");
        this.backgroundColor = "#D4D4D4";
        this.backgroundAlpha = 1;
        this.selectedBackgroundColor = "#EFEFEF";
        this.scrollDuration = this.selectedBackgroundAlpha = 1;
        this.resizeEnabled = !0;
        this.hideResizeGrips = !1;
        this.scrollbarHeight = 20;
        this.updateOnReleaseOnly = !1;
        9 > document.documentMode && (this.updateOnReleaseOnly = !0);
        this.dragIconWidth = 11;
        this.dragIconHeight = 18
    },
    draw: function () {
        var a = this;
        a.destroy();
        a.interval = setInterval(function () {
            a.updateScrollbar.call(a)
        },
            40);
        var b = a.chart.container,
            c = a.rotate,
            d = a.chart,
            e = b.set();
        a.set = e;
        d.scrollbarsSet.push(e);
        var f, g;
        c ? (f = a.scrollbarHeight, g = d.plotAreaHeight) : (g = a.scrollbarHeight, f = d.plotAreaWidth);
        a.width = f;
        if ((a.height = g) && f) {
            var h = AmCharts.rect(b, f, g, a.backgroundColor, a.backgroundAlpha);
            a.bg = h;
            e.push(h);
            h = AmCharts.rect(b, f, g, "#000", 0.005);
            e.push(h);
            a.invisibleBg = h;
            h.click(function () {
                a.handleBgClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            }).touchend(function () {
                a.handleBgClick()
            });
            h = AmCharts.rect(b, f, g, a.selectedBackgroundColor, a.selectedBackgroundAlpha);
            a.selectedBG = h;
            e.push(h);
            f = AmCharts.rect(b, f, g, "#000", 0.005);
            a.dragger = f;
            e.push(f);
            f.mousedown(function (b) {
                a.handleDragStart(b)
            }).mouseup(function () {
                a.handleDragStop()
            }).mouseover(function () {
                a.handleDraggerOver()
            }).mouseout(function () {
                a.handleMouseOut()
            }).touchstart(function (b) {
                a.handleDragStart(b)
            }).touchend(function () {
                a.handleDragStop()
            });
            f = d.pathToImages;
            c ? (h = f + "dragIconH.gif", f = a.dragIconWidth, c = a.dragIconHeight) : (h = f +
                "dragIcon.gif", c = a.dragIconWidth, f = a.dragIconHeight);
            g = b.image(h, 0, 0, c, f);
            var h = b.image(h, 0, 0, c, f),
                j = 10,
                k = 20;
            d.panEventsEnabled && (j = 25, k = a.scrollbarHeight);
            var l = AmCharts.rect(b, j, k, "#000", 0.005),
                n = AmCharts.rect(b, j, k, "#000", 0.005);
            n.translate(-(j - c) / 2, -(k - f) / 2);
            l.translate(-(j - c) / 2, -(k - f) / 2);
            c = b.set([g, n]);
            b = b.set([h, l]);
            a.iconLeft = c;
            e.push(a.iconLeft);
            a.iconRight = b;
            e.push(b);
            c.mousedown(function () {
                a.leftDragStart()
            }).mouseup(function () {
                a.leftDragStop()
            }).mouseover(function () {
                a.iconRollOver()
            }).mouseout(function () {
                a.iconRollOut()
            }).touchstart(function () {
                a.leftDragStart()
            }).touchend(function () {
                a.leftDragStop()
            });
            b.mousedown(function () {
                a.rightDragStart()
            }).mouseup(function () {
                a.rightDragStop()
            }).mouseover(function () {
                a.iconRollOver()
            }).mouseout(function () {
                a.iconRollOut()
            }).touchstart(function () {
                a.rightDragStart()
            }).touchend(function () {
                a.rightDragStop()
            });
            AmCharts.ifArray(d.chartData) ? e.show() : e.hide();
            a.hideDragIcons()
        }
        e.translate(a.x, a.y);
        a.clipDragger(!1)
    },
    updateScrollbarSize: function (a, b) {
        var c = this.dragger,
            d, e, f, g;
        this.rotate ? (d = 0, e = a, f = this.width + 1, g = b - a, c.setAttr("height", b - a), c.setAttr("y", e)) : (d = a, e =
            0, f = b - a, g = this.height + 1, c.setAttr("width", b - a), c.setAttr("x", d));
        this.clipAndUpdate(d, e, f, g)
    },
    updateScrollbar: function () {
        var a, b = !1,
            c, d, e = this.x,
            f = this.y,
            g = this.dragger,
            h = this.getDBox();
        c = h.x + e;
        d = h.y + f;
        var j = h.width,
            h = h.height,
            k = this.rotate,
            l = this.chart,
            n = this.width,
            q = this.height,
            m = l.mouseX,
            r = l.mouseY;
        a = this.initialMouse;
        l.mouseIsOver && (this.dragging && (l = this.initialCoord, k ? (a = l + (r - a), 0 > a && (a = 0), l = q - h, a > l && (a = l), g.setAttr("y", a)) : (a = l + (m - a), 0 > a && (a = 0), l = n - j, a > l && (a = l), g.setAttr("x", a))), this.resizingRight &&
            (k ? (a = r - d, a + d > q + f && (a = q - d + f), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 === a && (a = 0.1), g.setAttr("height", a))) : (a = m - c, a + c > n + e && (a = n - c + e), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 === a && (a = 0.1), g.setAttr("width", a)))), this.resizingLeft && (k ? (c = d, d = r, d < f && (d = f), d > q + f && (d = q + f), a = !0 === b ? c - d : h + c - d, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, g.setAttr("y", c + h - f)) : (0 === a && (a = 0.1), g.setAttr("y", d - f), g.setAttr("height", a))) : (d = m, d < e && (d = e), d > n + e && (d = n + e), a = !0 === b ? c - d : j + c - d, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, g.setAttr("x", c + j - e)) : (0 === a && (a = 0.1), g.setAttr("x", d - e), g.setAttr("width", a)))), this.clipDragger(!0))
    },
    clipDragger: function (a) {
        var b = this.getDBox(),
            c = b.x,
            d = b.y,
            e = b.width,
            b = b.height,
            f = !1;
        if (this.rotate) {
            if (c = 0, e = this.width + 1, this.clipY != d || this.clipH != b) f = !0
        } else if (d = 0, b = this.height + 1, this.clipX != c || this.clipW != e) f = !0;
        f && (this.clipAndUpdate(c, d, e, b), a && (this.updateOnReleaseOnly || this.dispatchScrollbarEvent()))
    },
    maskGraphs: function () {},
    clipAndUpdate: function (a, b, c, d) {
        this.clipX =
            a;
        this.clipY = b;
        this.clipW = c;
        this.clipH = d;
        this.selectedBG.clipRect(a, b, c, d);
        this.updateDragIconPositions();
        this.maskGraphs(a, b, c, d)
    },
    dispatchScrollbarEvent: function () {
        if (this.skipEvent) this.skipEvent = !1;
        else {
            var a = this.chart;
            a.hideBalloon();
            var b = this.getDBox(),
                c = b.x,
                d = b.y,
                e = b.width,
                b = b.height;
            this.rotate ? (c = d, e = this.height / b) : e = this.width / e;
            a = {
                type: "zoomed",
                position: c,
                chart: a,
                target: this,
                multiplier: e
            };
            this.fire(a.type, a)
        }
    },
    updateDragIconPositions: function () {
        var a = this.getDBox(),
            b = a.x,
            c = a.y,
            d = this.iconLeft,
            e = this.iconRight,
            f, g, h = this.scrollbarHeight;
        this.rotate ? (f = this.dragIconWidth, g = this.dragIconHeight, d.translate((h - g) / 2, c - f / 2), e.translate((h - g) / 2, c + a.height - f / 2)) : (f = this.dragIconHeight, g = this.dragIconWidth, d.translate(b - g / 2, (h - f) / 2), e.translate(b + -g / 2 + a.width, (h - f) / 2))
    },
    showDragIcons: function () {
        this.resizeEnabled && (this.iconLeft.show(), this.iconRight.show())
    },
    hideDragIcons: function () {
        !this.resizingLeft && (!this.resizingRight && !this.dragging) && (this.hideResizeGrips && (this.iconLeft.hide(), this.iconRight.hide()),
            this.removeCursors())
    },
    removeCursors: function () {
        this.chart.setMouseCursor("auto")
    },
    relativeZoom: function (a, b) {
        this.dragger.stop();
        this.multiplier = a;
        this.position = b;
        this.updateScrollbarSize(b, this.rotate ? b + this.height / a : b + this.width / a)
    },
    destroy: function () {
        this.clear();
        AmCharts.remove(this.set)
    },
    clear: function () {
        clearInterval(this.interval)
    },
    handleDragStart: function () {
        var a = this.chart;
        this.dragger.stop();
        this.removeCursors();
        this.dragging = !0;
        var b = this.getDBox();
        this.rotate ? (this.initialCoord = b.y, this.initialMouse =
            a.mouseY) : (this.initialCoord = b.x, this.initialMouse = a.mouseX)
    },
    handleDragStop: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent());
        this.dragging = !1;
        this.mouseIsOver && this.removeCursors();
        this.updateScrollbar()
    },
    handleDraggerOver: function () {
        this.handleMouseOver()
    },
    leftDragStart: function () {
        this.dragger.stop();
        this.resizingLeft = !0
    },
    leftDragStop: function () {
        this.resizingLeft = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    rightDragStart: function () {
        this.dragger.stop();
        this.resizingRight = !0
    },
    rightDragStop: function () {
        this.resizingRight = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    iconRollOut: function () {
        this.removeCursors()
    },
    iconRollOver: function () {
        this.rotate ? this.chart.setMouseCursor("n-resize") : this.chart.setMouseCursor("e-resize");
        this.handleMouseOver()
    },
    getDBox: function () {
        return this.dragger.getBBox()
    },
    handleBgClick: function () {
        if (!this.resizingRight && !this.resizingLeft) {
            this.zooming = !0;
            var a, b, c = this.scrollDuration,
                d = this.dragger;
            a = this.getDBox();
            var e = a.height,
                f = a.width;
            b = this.chart;
            var g = this.y,
                h = this.x,
                j = this.rotate;
            j ? (a = "y", b = b.mouseY - e / 2 - g, b = AmCharts.fitToBounds(b, 0, this.height - e)) : (a = "x", b = b.mouseX - f / 2 - h, b = AmCharts.fitToBounds(b, 0, this.width - f));
            this.updateOnReleaseOnly ? (this.skipEvent = !1, d.setAttr(a, b), this.dispatchScrollbarEvent(), this.clipDragger()) : (b = Math.round(b), j ? d.animate({
                y: b
            }, c, ">") : d.animate({
                x: b
            }, c, ">"))
        }
    },
    updateOnRelease: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent())
    },
    handleReleaseOutside: function () {
        if (this.set) {
            if (this.resizingLeft || this.resizingRight || this.dragging) this.updateOnRelease(), this.removeCursors();
            this.mouseIsOver = this.dragging = this.resizingRight = this.resizingLeft = !1;
            this.hideDragIcons();
            this.updateScrollbar()
        }
    },
    handleMouseOver: function () {
        this.mouseIsOver = !0;
        this.showDragIcons()
    },
    handleMouseOut: function () {
        this.mouseIsOver = !1;
        this.hideDragIcons()
    }
});
AmCharts.ChartScrollbar = AmCharts.Class({
    inherits: AmCharts.SimpleChartScrollbar,
    construct: function () {
        AmCharts.ChartScrollbar.base.construct.call(this);
        this.graphLineColor = "#BBBBBB";
        this.graphLineAlpha = 0;
        this.graphFillColor = "#BBBBBB";
        this.graphFillAlpha = 1;
        this.selectedGraphLineColor = "#888888";
        this.selectedGraphLineAlpha = 0;
        this.selectedGraphFillColor = "#888888";
        this.selectedGraphFillAlpha = 1;
        this.gridCount = 0;
        this.gridColor = "#FFFFFF";
        this.gridAlpha = 0.7;
        this.skipEvent = this.autoGridCount = !1;
        this.color = "#FFFFFF";
        this.scrollbarCreated = !1
    },
    init: function () {
        var a = this.categoryAxis,
            b = this.chart;
        a || (this.categoryAxis = a = new AmCharts.CategoryAxis);
        a.chart = b;
        a.id = "scrollbar";
        a.dateFormats = b.categoryAxis.dateFormats;
        a.boldPeriodBeginning = b.categoryAxis.boldPeriodBeginning;
        a.axisItemRenderer = AmCharts.RecItem;
        a.axisRenderer = AmCharts.RecAxis;
        a.guideFillRenderer = AmCharts.RecFill;
        a.inside = !0;
        a.fontSize = this.fontSize;
        a.tickLength = 0;
        a.axisAlpha = 0;
        this.graph && (a = this.valueAxis, a || (this.valueAxis = a = new AmCharts.ValueAxis, a.visible = !1, a.scrollbar = !0, a.axisItemRenderer = AmCharts.RecItem, a.axisRenderer = AmCharts.RecAxis, a.guideFillRenderer = AmCharts.RecFill, a.labelsEnabled = !1, a.chart = b), b = this.unselectedGraph, b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.unselectedGraph = b, b.negativeBase = this.graph.negativeBase), b = this.selectedGraph, b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.selectedGraph = b, b.negativeBase = this.graph.negativeBase));
        this.scrollbarCreated = !0
    },
    draw: function () {
        var a = this;
        AmCharts.ChartScrollbar.base.draw.call(a);
        a.scrollbarCreated || a.init();
        var b = a.chart,
            c = b.chartData,
            d = a.categoryAxis,
            e = a.rotate,
            f = a.x,
            g = a.y,
            h = a.width,
            j = a.height,
            k = b.categoryAxis,
            l = a.set;
        d.setOrientation(!e);
        d.parseDates = k.parseDates;
        d.rotate = e;
        d.equalSpacing = k.equalSpacing;
        d.minPeriod = k.minPeriod;
        d.startOnAxis = k.startOnAxis;
        d.viW = h;
        d.viH = j;
        d.width = h;
        d.height = j;
        d.gridCount = a.gridCount;
        d.gridColor = a.gridColor;
        d.gridAlpha = a.gridAlpha;
        d.color = a.color;
        d.autoGridCount = a.autoGridCount;
        d.parseDates && !d.equalSpacing && d.timeZoom(b.firstTime, b.lastTime);
        d.zoom(0, c.length - 1);
        if (k = a.graph) {
            var n = a.valueAxis,
                q = k.valueAxis;
            n.id = q.id;
            n.rotate = e;
            n.setOrientation(e);
            n.width = h;
            n.height = j;
            n.viW = h;
            n.viH = j;
            n.dataProvider = c;
            n.reversed = q.reversed;
            n.logarithmic = q.logarithmic;
            n.gridAlpha = 0;
            n.axisAlpha = 0;
            l.push(n.set);
            e ? n.y = g : n.x = f;
            var f = Infinity,
                g = -Infinity,
                m;
            for (m = 0; m < c.length; m++) {
                var r = c[m].axes[q.id].graphs[k.id].values,
                    p;
                for (p in r) if (r.hasOwnProperty(p) && "percents" != p && "total" != p) {
                        var u = r[p];
                        u < f && (f = u);
                        u > g && (g = u)
                    }
            }
            Infinity != f && (n.minimum = f); - Infinity != g &&
                (n.maximum = g + 0.1 * (g - f));
            f == g && (n.minimum -= 1, n.maximum += 1);
            n.zoom(0, c.length - 1);
            p = a.unselectedGraph;
            p.id = k.id;
            p.rotate = e;
            p.chart = b;
            p.chartType = b.chartType;
            p.data = c;
            p.valueAxis = n;
            p.chart = k.chart;
            p.categoryAxis = a.categoryAxis;
            p.valueField = k.valueField;
            p.openField = k.openField;
            p.closeField = k.closeField;
            p.highField = k.highField;
            p.lowField = k.lowField;
            p.lineAlpha = a.graphLineAlpha;
            p.lineColor = a.graphLineColor;
            p.fillAlphas = a.graphFillAlpha;
            p.fillColors = a.graphFillColor;
            p.connect = k.connect;
            p.hidden = k.hidden;
            p.width = h;
            p.height = j;
            q = a.selectedGraph;
            q.id = k.id;
            q.rotate = e;
            q.chart = b;
            q.chartType = b.chartType;
            q.data = c;
            q.valueAxis = n;
            q.chart = k.chart;
            q.categoryAxis = d;
            q.valueField = k.valueField;
            q.openField = k.openField;
            q.closeField = k.closeField;
            q.highField = k.highField;
            q.lowField = k.lowField;
            q.lineAlpha = a.selectedGraphLineAlpha;
            q.lineColor = a.selectedGraphLineColor;
            q.fillAlphas = a.selectedGraphFillAlpha;
            q.fillColors = a.selectedGraphFillColor;
            q.connect = k.connect;
            q.hidden = k.hidden;
            q.width = h;
            q.height = j;
            b = a.graphType;
            b || (b =
                k.type);
            p.type = b;
            q.type = b;
            c = c.length - 1;
            p.zoom(0, c);
            q.zoom(0, c);
            q.set.click(function () {
                a.handleBackgroundClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            });
            p.set.click(function () {
                a.handleBackgroundClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            });
            l.push(p.set);
            l.push(q.set)
        }
        l.push(d.set);
        l.push(d.labelsSet);
        a.bg.toBack();
        a.invisibleBg.toFront();
        a.dragger.toFront();
        a.iconLeft.toFront();
        a.iconRight.toFront()
    },
    timeZoom: function (a,
        b) {
        this.startTime = a;
        this.endTime = b;
        this.timeDifference = b - a;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    dispatchScrollbarEvent: function () {
        if (this.skipEvent) this.skipEvent = !1;
        else {
            var a = this.chart.chartData,
                b, c, d = this.dragger.getBBox();
            b = d.x;
            c = d.y;
            var e = d.width,
                f = d.height,
                d = this.chart;
            this.rotate ? (b = c, c = f) : c = e;
            e = {
                type: "zoomed",
                target: this
            };
            e.chart = d;
            var f = this.categoryAxis,
                g = this.stepWidth;
            if (f.parseDates && !f.equalSpacing) {
                if (a =
                    d.firstTime, f.minDuration(), d = Math.round(b / g) + a, a = this.dragging ? d + this.timeDifference : Math.round((b + c) / g) + a, d > a && (d = a), d != this.startTime || a != this.endTime) this.startTime = d, this.endTime = a, e.start = d, e.end = a, e.startDate = new Date(d), e.endDate = new Date(a), this.fire(e.type, e)
            } else if (f.startOnAxis || (b += g / 2), c -= this.stepWidth / 2, d = f.xToIndex(b), b = f.xToIndex(b + c), d != this.start || this.end != b) f.startOnAxis && (this.resizingRight && d == b && b++, this.resizingLeft && d == b && (0 < d ? d-- : b = 1)), this.start = d, this.end = this.dragging ?
                    this.start + this.difference : b, e.start = this.start, e.end = this.end, f.parseDates && (a[this.start] && (e.startDate = new Date(a[this.start].time)), a[this.end] && (e.endDate = new Date(a[this.end].time))), this.fire(e.type, e)
        }
    },
    zoomScrollbar: function () {
        var a, b;
        a = this.chart;
        var c = a.chartData,
            d = this.categoryAxis;
        d.parseDates && !d.equalSpacing ? (c = d.stepWidth, d = a.firstTime, a = c * (this.startTime - d), b = c * (this.endTime - d)) : (a = c[this.start].x[d.id], b = c[this.end].x[d.id], c = d.stepWidth, d.startOnAxis || (d = c / 2, a -= d, b += d));
        this.stepWidth =
            c;
        this.updateScrollbarSize(a, b)
    },
    maskGraphs: function (a, b, c, d) {
        var e = this.selectedGraph;
        e && e.set.clipRect(a, b, c, d)
    },
    handleDragStart: function () {
        AmCharts.ChartScrollbar.base.handleDragStart.call(this);
        this.difference = this.end - this.start;
        this.timeDifference = this.endTime - this.startTime;
        0 > this.timeDifference && (this.timeDifference = 0)
    },
    handleBackgroundClick: function () {
        AmCharts.ChartScrollbar.base.handleBackgroundClick.call(this);
        this.dragging || (this.difference = this.end - this.start, this.timeDifference = this.endTime -
            this.startTime, 0 > this.timeDifference && (this.timeDifference = 0))
    }
});
AmCharts.circle = function (a, b, c, d, e, f, g, h) {
    if (void 0 == e || 0 === e) e = 1;
    void 0 === f && (f = "#000000");
    void 0 === g && (g = 0);
    d = {
        fill: c,
        stroke: f,
        "fill-opacity": d,
        "stroke-width": e,
        "stroke-opacity": g
    };
    a = a.circle(0, 0, b).attr(d);
    h && a.gradient("radialGradient", [c, AmCharts.adjustLuminosity(c, -0.6)]);
    return a
};
AmCharts.text = function (a, b, c, d, e, f, g, h) {
    f || (f = "middle");
    "right" == f && (f = "end");
    c = {
        fill: c,
        "font-family": d,
        "font-size": e,
        opacity: h
    };
    !0 === g && (c["font-weight"] = "bold");
    c["text-anchor"] = f;
    return a.text(b, c)
};
AmCharts.polygon = function (a, b, c, d, e, f, g, h, j) {
    isNaN(f) && (f = 0);
    isNaN(h) && (h = e);
    var k = d,
        l = !1;
    "object" == typeof k && 1 < k.length && (l = !0, k = k[0]);
    void 0 === g && (g = k);
    e = {
        fill: k,
        stroke: g,
        "fill-opacity": e,
        "stroke-width": f,
        "stroke-opacity": h
    };
    f = AmCharts.dx;
    g = AmCharts.dy;
    h = Math.round;
    var k = "M" + (h(b[0]) + f) + "," + (h(c[0]) + g),
        n;
    for (n = 1; n < b.length; n++) k += " L" + (h(b[n]) + f) + "," + (h(c[n]) + g);
    a = a.path(k + " Z").attr(e);
    l && a.gradient("linearGradient", d, j);
    return a
};
AmCharts.rect = function (a, b, c, d, e, f, g, h, j, k) {
    isNaN(f) && (f = 0);
    void 0 === j && (j = 0);
    void 0 === k && (k = 270);
    isNaN(e) && (e = 0);
    var l = d,
        n = !1;
    "object" == typeof l && (l = l[0], n = !0);
    void 0 === g && (g = l);
    void 0 === h && (h = e);
    b = Math.round(b);
    c = Math.round(c);
    var q = 0,
        m = 0;
    0 > b && (b = Math.abs(b), q = -b);
    0 > c && (c = Math.abs(c), m = -c);
    q += AmCharts.dx;
    m += AmCharts.dy;
    e = {
        fill: l,
        stroke: g,
        "fill-opacity": e,
        "stroke-opacity": h
    };
    a = a.rect(q, m, b, c, j, f).attr(e);
    n && a.gradient("linearGradient", d, k);
    return a
};
AmCharts.triangle = function (a, b, c, d, e, f, g, h) {
    if (void 0 === f || 0 === f) f = 1;
    void 0 === g && (g = "#000");
    void 0 === h && (h = 0);
    d = {
        fill: d,
        stroke: g,
        "fill-opacity": e,
        "stroke-width": f,
        "stroke-opacity": h
    };
    b /= 2;
    var j;
    0 === c && (j = " M" + -b + "," + b + " L0," + -b + " L" + b + "," + b + " Z");
    180 == c && (j = " M" + -b + "," + -b + " L0," + b + " L" + b + "," + -b + " Z");
    90 == c && (j = " M" + -b + "," + -b + " L" + b + ",0 L" + -b + "," + b + " Z");
    270 == c && (j = " M" + -b + ",0 L" + b + "," + b + " L" + b + "," + -b + " Z");
    return a.path(j).attr(d)
};
AmCharts.line = function (a, b, c, d, e, f, g, h, j, k) {
    f = {
        fill: "none",
        "stroke-width": f
    };
    void 0 !== g && 0 < g && (f["stroke-dasharray"] = g);
    isNaN(e) || (f["stroke-opacity"] = e);
    d && (f.stroke = d);
    d = Math.round;
    k && (d = AmCharts.doNothing);
    k = AmCharts.dx;
    e = AmCharts.dy;
    g = "M" + (d(b[0]) + k) + "," + (d(c[0]) + e);
    for (h = 1; h < b.length; h++) g += " L" + (d(b[h]) + k) + "," + (d(c[h]) + e);
    if (AmCharts.VML) return a.path(g, void 0, !0).attr(f);
    j && (g += " M0,0 L0,0");
    return a.path(g).attr(f)
};
AmCharts.doNothing = function (a) {
    return a
};
AmCharts.wedge = function (a, b, c, d, e, f, g, h, j, k, l) {
    var n = Math.round;
    f = n(f);
    g = n(g);
    h = n(h);
    var q = n(g / f * h),
        m = AmCharts.VML,
        r = -359.5 - f / 100; - 359.95 > r && (r = -359.95);
    e <= r && (e = r);
    var p = 1 / 180 * Math.PI,
        r = b + Math.cos(d * p) * h,
        u = c + Math.sin(-d * p) * q,
        t = b + Math.cos(d * p) * f,
        s = c + Math.sin(-d * p) * g,
        w = b + Math.cos((d + e) * p) * f,
        x = c + Math.sin((-d - e) * p) * g,
        v = b + Math.cos((d + e) * p) * h,
        p = c + Math.sin((-d - e) * p) * q,
        y = {
            fill: AmCharts.adjustLuminosity(k.fill, -0.2),
            "stroke-opacity": 0
        }, A = 0;
    180 < Math.abs(e) && (A = 1);
    d = a.set();
    var J;
    m && (r = n(10 * r), t = n(10 * t), w =
        n(10 * w), v = n(10 * v), u = n(10 * u), s = n(10 * s), x = n(10 * x), p = n(10 * p), b = n(10 * b), j = n(10 * j), c = n(10 * c), f *= 10, g *= 10, h *= 10, q *= 10, 1 > Math.abs(e) && (1 >= Math.abs(w - t) && 1 >= Math.abs(x - s)) && (J = !0));
    e = "";
    if (0 < j) {
        m ? (path = " M" + r + "," + (u + j) + " L" + t + "," + (s + j), J || (path += " A" + (b - f) + "," + (j + c - g) + "," + (b + f) + "," + (j + c + g) + "," + t + "," + (s + j) + "," + w + "," + (x + j)), path += " L" + v + "," + (p + j), 0 < h && (J || (path += " B" + (b - h) + "," + (j + c - q) + "," + (b + h) + "," + (j + c + q) + "," + v + "," + (j + p) + "," + r + "," + (j + u)))) : (path = " M" + r + "," + (u + j) + " L" + t + "," + (s + j), path += " A" + f + "," + g + ",0," + A +
            ",1," + w + "," + (x + j) + " L" + v + "," + (p + j), 0 < h && (path += " A" + h + "," + q + ",0," + A + ",0," + r + "," + (u + j)));
        path += " Z";
        var E = a.path(path, void 0, void 0, "1000,1000").attr(y);
        d.push(E);
        E = a.path(" M" + r + "," + u + " L" + r + "," + (u + j) + " L" + t + "," + (s + j) + " L" + t + "," + s + " L" + r + "," + u + " Z", void 0, void 0, "1000,1000").attr(y);
        j = a.path(" M" + w + "," + x + " L" + w + "," + (x + j) + " L" + v + "," + (p + j) + " L" + v + "," + p + " L" + w + "," + x + " Z", void 0, void 0, "1000,1000").attr(y);
        d.push(E);
        d.push(j)
    }
    m ? (J || (e = " A" + n(b - f) + "," + n(c - g) + "," + n(b + f) + "," + n(c + g) + "," + n(t) + "," + n(s) + "," +
        n(w) + "," + n(x)), f = " M" + n(r) + "," + n(u) + " L" + n(t) + "," + n(s) + e + " L" + n(v) + "," + n(p)) : f = " M" + r + "," + u + " L" + t + "," + s + (" A" + f + "," + g + ",0," + A + ",1," + w + "," + x) + " L" + v + "," + p;
    0 < h && (m ? J || (f += " B" + (b - h) + "," + (c - q) + "," + (b + h) + "," + (c + q) + "," + v + "," + p + "," + r + "," + u) : f += " A" + h + "," + q + ",0," + A + ",0," + r + "," + u);
    a = a.path(f + " Z", void 0, void 0, "1000,1000").attr(k);
    if (l) {
        b = [];
        for (c = 0; c < l.length; c++) b.push(AmCharts.adjustLuminosity(k.fill, l[c]));
        0 < b.length && a.gradient("linearGradient", b)
    }
    d.push(a);
    return d
};
AmCharts.adjustLuminosity = function (a, b) {
    a = String(a).replace(/[^0-9a-f]/gi, "");
    6 > a.length && (a = String(a[0]) + String(a[0]) + String(a[1]) + String(a[1]) + String(a[2]) + String(a[2]));
    b = b || 0;
    var c = "#",
        d, e;
    for (e = 0; 3 > e; e++) d = parseInt(a.substr(2 * e, 2), 16), d = Math.round(Math.min(Math.max(0, d + d * b), 255)).toString(16), c += ("00" + d).substr(d.length);
    return c
};
AmCharts.AmPieChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function (color) {
        this.createEvents("rollOverSlice", "rollOutSlice", "clickSlice", "pullOutSlice", "pullInSlice", "rightClickSlice");
        AmCharts.AmPieChart.base.construct.call(this);
		
        this.colors = color;
        this.pieAlpha = 1;
        this.pieBrightnessStep = 30;
        this.groupPercent = 0;
        this.groupedTitle = "Other";
        this.groupedPulled = !1;
        this.groupedAlpha = 1;
        this.marginLeft = 0;
        this.marginBottom = this.marginTop = 10;
        this.marginRight = 0;
        this.minRadius = 10;
        this.hoverAlpha = 1;
        this.depth3D = 0;
        this.startAngle = 90;
        this.angle = this.innerRadius = 0;
        this.outlineColor = "#FFFFFF";
        this.outlineAlpha = 0;
        this.outlineThickness = 1;
        this.startRadius = "500%";
        this.startDuration = this.startAlpha = 1;
        this.startEffect = "bounce";
        this.sequencedAnimation = !1;
        this.pullOutRadius = "20%";
        this.pullOutDuration = 1;
        this.pullOutEffect = "bounce";
        this.pullOnHover =
        this.pullOutOnlyOne = !1;
        this.labelsEnabled = !0;
        this.labelRadius = 30;
        this.labelTickColor = "#000000";
        this.labelTickAlpha = 0.2;
        this.labelText = "[[title]]";
        this.hideLabelsPercent = 0;
        this.balloonText = "[[title]]";
        this.urlTarget = "_self";
        this.previousScale = 1;
        this.autoMarginOffset = 10;
        this.gradientRatio = []
    },
    initChart: function () {
        AmCharts.AmPieChart.base.initChart.call(this);
        this.dataChanged && (this.parseData(), this.dispatchDataUpdated = !0, this.dataChanged = !1,
            this.legend && this.legend.setData(this.chartData));
        this.drawChart()
    },
    handleLegendEvent: function (a) {
        var b = a.type;
        if (a = a.dataItem) {
            var c = a.hidden;
            switch (b) {
            case "clickMarker":
                c || this.clickSlice(a);
                break;
            case "clickLabel":
                c || this.clickSlice(a);
                break;
            case "rollOverItem":
                c || this.rollOverSlice(a, !1);
                break;
            case "rollOutItem":
                c || this.rollOutSlice(a);
                break;
            case "hideItem":
                this.hideSlice(a);
                break;
            case "showItem":
                this.showSlice(a)
            }
        }
    },
    invalidateVisibility: function () {
        this.recalculatePercents();
        this.initChart();
        var a = this.legend;
        a && a.invalidateSize()
    },
    drawChart: function () {
        var a = this;
        AmCharts.AmPieChart.base.drawChart.call(a);
        var b = a.chartData;
        if (AmCharts.ifArray(b)) {
            if (0 < a.realWidth && 0 < a.realHeight) {
                AmCharts.VML && (a.startAlpha = 1);
                var c = a.startDuration,
                    d = a.container,
                    e = a.updateWidth();
                a.realWidth = e;
                var f = a.updateHeight();
                a.realHeight = f;
                var g = AmCharts.toCoordinate,
                    h = g(a.marginLeft, e),
                    j = g(a.marginRight, e),
                    k = g(a.marginTop, f) + a.getTitleHeight(),
                    l = g(a.marginBottom, f);
                a.chartDataLabels = [];
                a.ticks = [];
                var n, q, m, r =
                        AmCharts.toNumber(a.labelRadius),
                    p = a.measureMaxLabel();
                if (!a.labelText || !a.labelsEnabled) r = p = 0;
                n = void 0 === a.pieX ? (e - h - j) / 2 + h : g(a.pieX, a.realWidth);
                q = void 0 === a.pieY ? (f - k - l) / 2 + k : g(a.pieY, f);
                m = g(a.radius, e, f);
                a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, m);
                m || (e = 0 <= r ? e - h - j - 2 * p : e - h - j, f = f - k - l, m = Math.min(e, f), f < e && (m /= 1 - a.angle / 90, m > e && (m = e)), a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, m), m = 0 <= r ? m - 1.8 * (r + a.pullOutRadiusReal) : m - 1.8 * a.pullOutRadiusReal, m /= 2);
                m < a.minRadius && (m =
                    a.minRadius);
                a.pullOutRadiusReal = g(a.pullOutRadius, m);
                g = g(a.innerRadius, m);
                g >= m && (g = m - 1);
                f = AmCharts.fitToBounds(a.startAngle, 0, 360);
                0 < a.depth3D && (f = 270 <= f ? 270 : 90);
                k = m - m * a.angle / 90;
                for (l = 0; l < b.length; l++) if (e = b[l], !0 !== e.hidden && 0 < e.percents) {
                        var j = 360 * -e.percents / 100,
                            p = Math.cos((f + j / 2) / 180 * Math.PI),
                            u = Math.sin((-f - j / 2) / 180 * Math.PI) * (k / m),
                            h = {
                                fill: e.color,
                                stroke: a.outlineColor,
                                "stroke-width": a.outlineThickness,
                                "stroke-opacity": a.outlineAlpha
                            };
                        e.url && (h.cursor = "pointer");
                        h = AmCharts.wedge(d, n, q, f, j, m,
                            k, g, a.depth3D, h, a.gradientRatio);
                        a.addEventListeners(h, e);
                        e.startAngle = f;
                        b[l].wedge = h;
                        if (0 < c) {
                            var t = a.startAlpha;
                            a.chartCreated && (t = e.alpha);
                            h.setAttr("opacity", t)
                        }
                        e.ix = p;
                        e.iy = u;
                        e.wedge = h;
                        e.index = l;
                        if (a.labelsEnabled && a.labelText && e.percents >= a.hideLabelsPercent) {
                            var s = f + j / 2;
                            0 >= s && (s += 360);
                            j = r;
                            isNaN(e.labelRadius) || (j = e.labelRadius);
                            var p = n + p * (m + j),
                                u = q + u * (m + j),
                                w, t = 0;
                            /*if (0 <= j) {
                                var x;
                                90 >= s && 0 <= s ? (x = 0, w = "start", t = 8) : 360 >= s && 270 < s ? (x = 1, w = "start", t = 8) : 270 >= s && 180 < s ? (x = 2, w = "end", t = -8) : 180 >= s && 90 < s && (x = 3,
                                    w = "end", t = -8);
                                e.labelQuarter = x
                            } else w = "middle";*/
                            var s = a.formatString(a.labelText, e),
                                v = e.labelColor;
                            void 0 == v && (v = a.color);
                            s = AmCharts.text(d, s, v, a.fontFamily, a.fontSize, w);
                            s.translate(p + 1.5 * t, u);
                            //e.tx = p + 1.5 * t;
                            //e.ty = u;
                            0 <= j ? h.push(s) : a.freeLabelsSet.push(s);
                            //e.label = s;
                            //a.chartDataLabels[l] = s;
                            //e.tx = p;
                            //e.tx2 = p + t
                        }
                        a.graphsSet.push(h);
                        (0 === e.alpha || 0 < c && !a.chartCreated) && h.hide();
                        f -= 360 * e.percents / 100;
                        0 >= f && (f += 360)
                    }
                b = setTimeout(function () {
                    a.showLabels.call(a)
                }, 1E3 * c);
                a.timeOuts.push(b);
                0 < r && !a.labelRadiusField &&
                    a.arrangeLabels();
                a.pieXReal = n;
                a.pieYReal = q;
                a.radiusReal = m;
                a.innerRadiusReal = g;
                0 < r && a.drawTicks();
                a.chartCreated ? a.pullSlices(!0) : (c = setTimeout(function () {
                    a.pullSlices.call(a)
                }, 1200 * c), a.timeOuts.push(c));
                a.chartCreated || a.startSlices();
                a.setDepths()
            }(c = a.legend) && c.invalidateSize()
        } else a.cleanChart();
        a.dispDUpd();
        a.chartCreated = !0
    },
    setDepths: function () {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b],
                d = c.wedge,
                c = c.startAngle;
            90 >= c && 0 <= c || 360 >= c && 270 < c ? d.toFront() : (270 >= c && 180 < c || 180 >= c &&
                90 < c) && d.toBack()
        }
    },
    addEventListeners: function (a, b) {
        var c = this;
        a.mouseover(function () {
            c.rollOverSlice(b, !0)
        }).mouseout(function () {
            c.rollOutSlice(b)
        }).click(function () {
            c.clickSlice(b)
        }).contextmenu(function () {
            c.handleRightClick(b)
        })
    },
    formatString: function (a, b) {
        a = AmCharts.formatValue(a, b, ["value"], this.numberFormatter, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        a = AmCharts.formatValue(a, b, ["percents"], this.percentFormatter);
        a = AmCharts.massReplace(a, {
            "[[title]]": b.title,
            "[[description]]": b.description,
            "<br>": "\n"
        });
        a = AmCharts.fixNewLines(a);
        return a = AmCharts.cleanFromEmpty(a)
    },
    drawTicks: function () {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) if (this.chartDataLabels[b]) {
                var c = a[b],
                    d = c.ty,
                    e = this.radiusReal,
                    d = AmCharts.line(this.container, [this.pieXReal + c.ix * e, c.tx, c.tx2], [this.pieYReal + c.iy * e, d, d], this.labelTickColor, this.labelTickAlpha);
                c.wedge.push(d);
                this.ticks[b] = d
            }
    },
    arrangeLabels: function () {
        var a = this.chartData,
            b = a.length,
            c, d;
        for (d = b - 1; 0 <= d; d--) c = a[d], 0 === c.labelQuarter && !c.hidden && this.checkOverlapping(d, c, 0, !0, 0);
        for (d = 0; d < b; d++) c = a[d], 1 == c.labelQuarter && !c.hidden && this.checkOverlapping(d, c, 1, !1, 0);
        for (d = b - 1; 0 <= d; d--) c = a[d], 2 == c.labelQuarter && !c.hidden && this.checkOverlapping(d, c, 2, !0, 0);
        for (d = 0; d < b; d++) c = a[d], 3 == c.labelQuarter && !c.hidden && this.checkOverlapping(d, c, 3, !1, 0)
    },
    checkOverlapping: function (a, b, c, d, e) {
        var f, g, h = this.chartData,
            j = h.length,
            k = b.label;
        if (k) {
            if (!0 === d) for (g = a + 1; g < j; g++)(f = this.checkOverlappingReal(b, h[g], c)) && (g = j);
            else for (g = a - 1; 0 <= g; g--)(f =
                        this.checkOverlappingReal(b, h[g], c)) && (g = 0);
            !0 === f && 100 > e && (f = b.ty + 3 * b.iy, b.ty = f, k.translate(b.tx2, f), this.checkOverlapping(a, b, c, d, e + 1))
        }
    },
    checkOverlappingReal: function (a, b, c) {
        var d = !1,
            e = a.label,
            f = b.label;
        a.labelQuarter == c && (!a.hidden && !b.hidden && f) && (e = e.getBBox(), c = {}, c.width = e.width, c.height = e.height, c.y = a.ty, c.x = a.tx, a = f.getBBox(), f = {}, f.width = a.width, f.height = a.height, f.y = b.ty, f.x = b.tx, AmCharts.hitTest(c, f) && (d = !0));
        return d
    },
    startSlices: function () {
        var a;
        for (a = 0; a < this.chartData.length; a++) 0 <
                this.startDuration && this.sequencedAnimation ? this.setStartTO(a) : this.startSlice(this.chartData[a])
    },
    setStartTO: function (a) {
        var b = this;
        a = setTimeout(function () {
            b.startSequenced.call(b)
        }, 500 * (b.startDuration / b.chartData.length) * a);
        b.timeOuts.push(a)
    },
    pullSlices: function (a) {
        var b = this.chartData,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            d.pulled && this.pullSlice(d, 1, a)
        }
    },
    startSequenced: function () {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) if (!a[b].started) {
                this.startSlice(this.chartData[b]);
                break
            }
    },
    startSlice: function (a) {
        a.started = !0;
        var b = a.wedge,
            c = this.startDuration;
        if (b && 0 < c) {
            0 < a.alpha && b.show();
            var d = AmCharts.toCoordinate(this.startRadius, this.radiusReal);
            b.translate(Math.round(a.ix * d), Math.round(a.iy * d));
            b.animate({
                opacity: a.alpha,
                translate: "0,0"
            }, c, this.startEffect)
        }
    },
    showLabels: function () {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) if (0 < a[b].alpha) {
                var c = this.chartDataLabels[b];
                c && c.show();
                (c = this.ticks[b]) && c.show()
            }
    },
    showSlice: function (a) {
        isNaN(a) ? a.hidden = !1 : this.chartData[a].hidden = !1;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    hideSlice: function (a) {
        isNaN(a) ? a.hidden = !0 : this.chartData[a].hidden = !0;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    rollOverSlice: function (a, b) {
        isNaN(a) || (a = this.chartData[a]);
        clearTimeout(this.hoverInt);
        this.pullOnHover && this.pullSlice(a, 1);
        var c = this.innerRadiusReal + (this.radiusReal - this.innerRadiusReal) / 2;
        a.pulled && (c += this.pullOutRadiusReal);
        1 > this.hoverAlpha && a.wedge && a.wedge.attr({
            opacity: this.hoverAlpha
        });
        var d = a.ix * c + this.pieXReal,
            c = a.iy * c + this.pieYReal,
            e = this.formatString(this.balloonText,
                a),
            f = AmCharts.adjustLuminosity(a.color, -0.15);
        this.showBalloon(e, f, b, d, c);
        d = {
            type: "rollOverSlice",
            dataItem: a,
            chart: this
        };
        this.fire(d.type, d)
    },
    rollOutSlice: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        a.wedge && a.wedge.attr({
            opacity: a.alpha
        });
        this.hideBalloon();
        a = {
            type: "rollOutSlice",
            dataItem: a,
            chart: this
        };
        this.fire(a.type, a)
    },
    clickSlice: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        this.hideBalloon();
        a.pulled ? this.pullSlice(a, 0) : this.pullSlice(a, 1);
        AmCharts.getURL(a.url, this.urlTarget);
        a = {
            type: "clickSlice",
            dataItem: a,
            chart: this
        };
        this.fire(a.type, a)
    },
    handleRightClick: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        a = {
            type: "rightClickSlice",
            dataItem: a,
            chart: this
        };
        this.fire(a.type, a)
    },
    pullSlice: function (a, b, c) {
        var d = a.ix,
            e = a.iy,
            f = this.pullOutDuration;
        !0 === c && (f = 0);
        c = a.wedge;
        var g = this.pullOutRadiusReal;
        c && c.animate({
            translate: b * d * g + "," + b * e * g
        }, f, this.pullOutEffect);
        1 == b ? (a.pulled = !0, this.pullOutOnlyOne && this.pullInAll(a.index), a = {
            type: "pullOutSlice",
            dataItem: a,
            chart: this
        }) : (a.pulled = !1, a = {
            type: "pullInSlice",
            dataItem: a,
            chart: this
        });
        this.fire(a.type, a)
    },
    pullInAll: function (a) {
        var b = this.chartData,
            c;
        for (c = 0; c < this.chartData.length; c++) c != a && b[c].pulled && this.pullSlice(b[c], 0)
    },
    pullOutAll: function () {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) a[b].pulled || this.pullSlice(a[b], 1)
    },
    parseData: function () {
        var a = [];
        this.chartData = a;
        var b = this.dataProvider;
        if (void 0 !== b) {
            var c = b.length,
                d = 0,
                e, f, g;
            for (e = 0; e < c; e++) {
                f = {};
                var h = b[e];
                f.dataContext = h;
                f.value = Number(h[this.valueField]);
                (g = h[this.titleField]) || (g = "");
                f.title =
                    g;
                f.pulled = AmCharts.toBoolean(h[this.pulledField], !1);
                (g = h[this.descriptionField]) || (g = "");
                f.description = g;
                f.labelRadius = Number(h[this.labelRadiusField]);
                f.url = h[this.urlField];
                f.visibleInLegend = AmCharts.toBoolean(h[this.visibleInLegendField], !0);
                g = h[this.alphaField];
                f.alpha = void 0 !== g ? Number(g) : this.pieAlpha;
                g = h[this.colorField];
                void 0 !== g && (f.color = AmCharts.toColor(g));
                f.labelColor = AmCharts.toColor(h[this.labelColorField]);
                d += f.value;
                f.hidden = !1;
                a[e] = f
            }
            for (e = b = 0; e < c; e++) f = a[e], f.percents = 100 * (f.value /
                    d), f.percents < this.groupPercent && b++;
            1 < b && (this.groupValue = 0, this.removeSmallSlices(), a.push({
                title: this.groupedTitle,
                value: this.groupValue,
                percents: 100 * (this.groupValue / d),
                pulled: this.groupedPulled,
                color: this.groupedColor,
                url: this.groupedUrl,
                description: this.groupedDescription,
                alpha: this.groupedAlpha
            }));
            for (e = 0; e < a.length; e++) this.pieBaseColor ? g = AmCharts.adjustLuminosity(this.pieBaseColor, e * this.pieBrightnessStep / 100) : (g = this.colors[e], void 0 === g && (g = AmCharts.randomColor())), void 0 === a[e].color &&
                    (a[e].color = g);
            this.recalculatePercents()
        }
    },
    recalculatePercents: function () {
        var a = this.chartData,
            b = 0,
            c, d;
        for (c = 0; c < a.length; c++) d = a[c], !d.hidden && 0 < d.value && (b += d.value);
        for (c = 0; c < a.length; c++) d = this.chartData[c], d.percents = !d.hidden && 0 < d.value ? 100 * d.value / b : 0
    },
    removeSmallSlices: function () {
        var a = this.chartData,
            b;
        for (b = a.length - 1; 0 <= b; b--) a[b].percents < this.groupPercent && (this.groupValue += a[b].value, a.splice(b, 1))
    },
    animateAgain: function () {
        var a = this;
        a.startSlices();
        var b = setTimeout(function () {
            a.pullSlices.call(a)
        },
            1200 * a.startDuration);
        a.timeOuts.push(b)
    },
    measureMaxLabel: function () {
        var a = this.chartData,
            b = 0,
            c;
        for (c = 0; c < a.length; c++) {
            var d = this.formatString(this.labelText, a[c]),
                d = AmCharts.text(this.container, d, this.color, this.fontFamily, this.fontSize),
                e = d.getBBox().width;
            e > b && (b = e);
            d.remove()
        }
        return b
    }
});
AmCharts.AmXYChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,
    construct: function () {
        AmCharts.AmXYChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.maxZoomFactor = 20;
        this.chartType = "xy"
    },
    initChart: function () {
        AmCharts.AmXYChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins());
        var a = this.marginLeftReal,
            b = this.marginTopReal,
            c = this.plotAreaWidth,
            d = this.plotAreaHeight;
        this.graphsSet.clipRect(a, b, c, d);
        this.bulletSet.clipRect(a, b, c, d);
        this.trendLinesSet.clipRect(a, b, c, d)
    },
    createValueAxes: function () {
        var a = [],
            b = [];
        this.xAxes = a;
        this.yAxes = b;
        var c = this.valueAxes,
            d, e;
        for (e = 0; e < c.length; e++) {
            d = c[e];
            var f = d.position;
            if ("top" == f || "bottom" == f) d.rotate = !0;
            d.setOrientation(d.rotate);
            f = d.orientation;
            "V" == f && b.push(d);
            "H" == f && a.push(d)
        }
        0 === b.length && (d = new AmCharts.ValueAxis, d.rotate = !1, d.setOrientation(!1), c.push(d),
            b.push(d));
        0 === a.length && (d = new AmCharts.ValueAxis, d.rotate = !0, d.setOrientation(!0), c.push(d), a.push(d));
        for (e = 0; e < c.length; e++) this.processValueAxis(c[e], e);
        a = this.graphs;
        for (e = 0; e < a.length; e++) this.processGraph(a[e], e)
    },
    drawChart: function () {
        AmCharts.AmXYChart.base.drawChart.call(this);
        AmCharts.ifArray(this.chartData) ? (this.chartScrollbar && this.updateScrollbars(), this.zoomChart()) : this.cleanChart();
        if (this.hideXScrollbar) {
            var a = this.scrollbarH;
            a && (this.removeListener(a, "zoomed", this.handleHSBZoom),
                a.destroy());
            this.scrollbarH = null
        }
        if (this.hideYScrollbar) {
            if (a = this.scrollbarV) this.removeListener(a, "zoomed", this.handleVSBZoom), a.destroy();
            this.scrollbarV = null
        }
        if (!this.autoMargins || this.marginsUpdated) this.dispDUpd(), this.chartCreated = !0, this.zoomScrollbars()
    },
    cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.scrollbarV, this.scrollbarH, this.chartCursor])
    },
    zoomChart: function () {
        this.toggleZoomOutButton();
        this.zoomObjects(this.valueAxes);
        this.zoomObjects(this.graphs);
        this.zoomTrendLines();
        this.dispatchAxisZoom()
    },
    toggleZoomOutButton: function () {
        1 == this.heightMultiplier && 1 == this.widthMultiplier ? this.showZB(!1) : this.showZB(!0)
    },
    dispatchAxisZoom: function () {
        var a = this.valueAxes,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            if (!isNaN(c.min) && !isNaN(c.max)) {
                var d, e;
                "V" == c.orientation ? (d = c.coordinateToValue(-this.verticalPosition), e = c.coordinateToValue(-this.verticalPosition + this.plotAreaHeight)) : (d = c.coordinateToValue(-this.horizontalPosition), e = c.coordinateToValue(-this.horizontalPosition +
                    this.plotAreaWidth));
                if (!isNaN(d) && !isNaN(e)) {
                    if (d > e) {
                        var f = e;
                        e = d;
                        d = f
                    }
                    c.dispatchZoomEvent(d, e)
                }
            }
        }
    },
    zoomObjects: function (a) {
        var b = a.length,
            c;
        for (c = 0; c < b; c++) {
            var d = a[c];
            this.updateObjectSize(d);
            d.zoom(0, this.chartData.length - 1)
        }
    },
    updateData: function () {
        this.parseData();
        var a = this.chartData,
            b = a.length - 1,
            c = this.graphs,
            d = this.dataProvider,
            e = 0,
            f, g;
        for (f = 0; f < c.length; f++) if (g = c[f], g.data = a, g.zoom(0, b), g = g.valueField) {
                var h;
                for (h = 0; h < d.length; h++) {
                    var j = d[h][g];
                    j > e && (e = j)
                }
            }
        for (f = 0; f < c.length; f++) g = c[f], g.maxValue =
                e;
        if (a = this.chartCursor) a.updateData(), a.type = "crosshair", a.valueBalloonsEnabled = !1
    },
    zoomOut: function () {
        this.verticalPosition = this.horizontalPosition = 0;
        this.heightMultiplier = this.widthMultiplier = 1;
        this.zoomChart();
        this.zoomScrollbars()
    },
    processValueAxis: function (a) {
        a.chart = this;
        a.minMaxField = "H" == a.orientation ? "x" : "y";
        a.minTemp = NaN;
        a.maxTemp = NaN;
        this.listenTo(a, "axisSelfZoomed", this.handleAxisSelfZoom)
    },
    processGraph: function (a) {
        a.xAxis || (a.xAxis = this.xAxes[0]);
        a.yAxis || (a.yAxis = this.yAxes[0])
    },
    parseData: function () {
        AmCharts.AmXYChart.base.parseData.call(this);
        this.chartData = [];
        var a = this.dataProvider,
            b = this.valueAxes,
            c = this.graphs,
            d;
        for (d = 0; d < a.length; d++) {
            var e = {
                axes: {},
                x: {},
                y: {}
            }, f = a[d],
                g;
            for (g = 0; g < b.length; g++) {
                var h = b[g].id;
                e.axes[h] = {};
                e.axes[h].graphs = {};
                var j;
                for (j = 0; j < c.length; j++) {
                    var k = c[j],
                        l = k.id;
                    if (k.xAxis.id == h || k.yAxis.id == h) {
                        var n = {};
                        n.serialDataItem = e;
                        n.index = d;
                        var q = {}, m = Number(f[k.valueField]);
                        isNaN(m) || (q.value = m);
                        m = Number(f[k.xField]);
                        isNaN(m) || (q.x = m);
                        m = Number(f[k.yField]);
                        isNaN(m) || (q.y = m);
                        n.values = q;
                        this.processFields(k, n, f);
                        n.serialDataItem =
                            e;
                        n.graph = k;
                        e.axes[h].graphs[l] = n
                    }
                }
            }
            this.chartData[d] = e
        }
    },
    formatString: function (a, b) {
        var c = b.graph.numberFormatter;
        c || (c = this.numberFormatter);
        a = AmCharts.formatValue(a, b.values, ["value", "x", "y"], c); - 1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
        return a = AmCharts.AmSerialChart.base.formatString.call(this, a, b)
    },
    addChartScrollbar: function (a) {
        AmCharts.callMethod("destroy", [this.chartScrollbar, this.scrollbarH, this.scrollbarV]);
        if (a) {
            this.chartScrollbar = a;
            this.scrollbarHeight =
                a.scrollbarHeight;
            var b = "backgroundColor backgroundAlpha selectedBackgroundColor selectedBackgroundAlpha scrollDuration resizeEnabled hideResizeGrips scrollbarHeight updateOnReleaseOnly".split(" ");
            if (!this.hideYScrollbar) {
                var c = new AmCharts.SimpleChartScrollbar;
                c.skipEvent = !0;
                c.chart = this;
                this.listenTo(c, "zoomed", this.handleVSBZoom);
                AmCharts.copyProperties(a, c, b);
                c.rotate = !0;
                this.scrollbarV = c
            }
            this.hideXScrollbar || (c = new AmCharts.SimpleChartScrollbar, c.skipEvent = !0, c.chart = this, this.listenTo(c, "zoomed",
                this.handleHSBZoom), AmCharts.copyProperties(a, c, b), c.rotate = !1, this.scrollbarH = c)
        }
    },
    updateTrendLines: function () {
        var a = this.trendLines,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.valueAxis || (c.valueAxis = this.yAxes[0]);
            c.valueAxisX || (c.valueAxisX = this.xAxes[0])
        }
    },
    updateMargins: function () {
        AmCharts.AmXYChart.base.updateMargins.call(this);
        var a = this.scrollbarV;
        a && (this.getScrollbarPosition(a, !0, this.yAxes[0].position), this.adjustMargins(a, !0));
        if (a = this.scrollbarH) this.getScrollbarPosition(a, !1,
                this.xAxes[0].position), this.adjustMargins(a, !1)
    },
    updateScrollbars: function () {
        var a = this.scrollbarV;
        a && (this.updateChartScrollbar(a, !0), a.draw());
        if (a = this.scrollbarH) this.updateChartScrollbar(a, !1), a.draw()
    },
    zoomScrollbars: function () {
        var a = this.scrollbarH;
        a && a.relativeZoom(this.widthMultiplier, -this.horizontalPosition / this.widthMultiplier);
        (a = this.scrollbarV) && a.relativeZoom(this.heightMultiplier, -this.verticalPosition / this.heightMultiplier)
    },
    fitMultiplier: function (a) {
        a > this.maxZoomFactor && (a = this.maxZoomFactor);
        return a
    },
    handleHSBZoom: function (a) {
        var b = this.fitMultiplier(a.multiplier);
        a = -a.position * b;
        var c = -(this.plotAreaWidth * b - this.plotAreaWidth);
        a < c && (a = c);
        this.widthMultiplier = b;
        this.horizontalPosition = a;
        this.zoomChart()
    },
    handleVSBZoom: function (a) {
        var b = this.fitMultiplier(a.multiplier);
        a = -a.position * b;
        var c = -(this.plotAreaHeight * b - this.plotAreaHeight);
        a < c && (a = c);
        this.heightMultiplier = b;
        this.verticalPosition = a;
        this.zoomChart()
    },
    handleAxisSelfZoom: function (a) {
        if ("H" == a.valueAxis.orientation) {
            var b = this.fitMultiplier(a.multiplier);
            a = -a.position * b;
            var c = -(this.plotAreaWidth * b - this.plotAreaWidth);
            a < c && (a = c);
            this.horizontalPosition = a;
            this.widthMultiplier = b
        } else b = this.fitMultiplier(a.multiplier), a = -a.position * b, c = -(this.plotAreaHeight * b - this.plotAreaHeight), a < c && (a = c), this.verticalPosition = a, this.heightMultiplier = b;
        this.zoomChart();
        this.zoomScrollbars()
    },
    handleCursorZoom: function (a) {
        var b = this.widthMultiplier * this.plotAreaWidth / a.selectionWidth,
            c = this.heightMultiplier * this.plotAreaHeight / a.selectionHeight,
            b = this.fitMultiplier(b),
            c = this.fitMultiplier(c);
        this.horizontalPosition = (this.horizontalPosition - a.selectionX) * b / this.widthMultiplier;
        this.verticalPosition = (this.verticalPosition - a.selectionY) * c / this.heightMultiplier;
        this.widthMultiplier = b;
        this.heightMultiplier = c;
        this.zoomChart();
        this.zoomScrollbars()
    },
    removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.scrollbarH, this.scrollbarV]);
        this.scrollbarV = this.scrollbarH = null
    },
    handleReleaseOutside: function (a) {
        AmCharts.AmXYChart.base.handleReleaseOutside.call(this,
            a);
        AmCharts.callMethod("handleReleaseOutside", [this.scrollbarH, this.scrollbarV])
    }
});
AmCharts.AmDraw = AmCharts.Class({
    construct: function (a, b, c) {
        AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
        AmCharts.SVG_XLINK = "http://www.w3.org/1999/xlink";
        AmCharts.hasSVG = !! document.createElementNS && !! document.createElementNS(AmCharts.SVG_NS, "svg").createSVGRect;
        1 > b && (b = 10);
        1 > c && (c = 10);
        this.div = a;
        this.width = b;
        this.height = c;
        this.rBin = document.createElement("div");
        if (AmCharts.hasSVG) {
            AmCharts.SVG = !0;
            var d = this.createSvgElement("svg");
            d.style.position = "absolute";
            d.style.width = b + "px";
            d.style.height = c + "px";
            d.setAttribute("version", "1.1");
            a.appendChild(d);
            this.container = d;
            this.R = new AmCharts.SVGRenderer(this)
        } else AmCharts.isIE && AmCharts.VMLRenderer && (AmCharts.VML = !0, AmCharts.vmlStyleSheet || (document.namespaces.add("amvml", "urn:schemas-microsoft-com:vml"), b = document.createStyleSheet(), b.addRule(".amvml", "behavior:url(#default#VML); display:inline-block; antialias:true"), AmCharts.vmlStyleSheet = b), this.container = a, this.R = new AmCharts.VMLRenderer(this), this.R.disableSelection(a))
    },
    createSvgElement: function (a) {
        return document.createElementNS(AmCharts.SVG_NS,
            a)
    },
    circle: function (a, b, c, d) {
        var e = new AmCharts.AmDObject("circle", this);
        e.attr({
            r: c,
            cx: a,
            cy: b
        });
        this.addToContainer(e.node, d);
        return e
    },
    setSize: function (a, b) {
        0 < a && 0 < b && (this.container.style.width = a + "px", this.container.style.height = b + "px")
    },
    rect: function (a, b, c, d, e, f, g) {
        var h = new AmCharts.AmDObject("rect", this);
        AmCharts.VML && (e = 100 * e / Math.min(c, d), c += 2 * f, d += 2 * f, h.bw = f, h.node.style.marginLeft = -f, h.node.style.marginTop = -f);
        1 > c && (c = 1);
        1 > d && (d = 1);
        h.attr({
            x: a,
            y: b,
            width: c,
            height: d,
            rx: e,
            ry: e,
            "stroke-width": f
        });
        this.addToContainer(h.node, g);
        return h
    },
    image: function (a, b, c, d, e, f) {
        var g = new AmCharts.AmDObject("image", this);
        g.attr({
            x: b,
            y: c,
            width: d,
            height: e
        });
        this.R.path(g, a);
        this.addToContainer(g.node, f);
        return g
    },
    addToContainer: function (a, b) {
        b || (b = this.container);
        b.appendChild(a)
    },
    text: function (a, b, c) {
        return this.R.text(a, b, c)
    },
    path: function (a, b, c, d) {
        var e = new AmCharts.AmDObject("path", this);
        d || (d = "100,100");
        e.attr({
            cs: d
        });
        c ? e.attr({
            dd: a
        }) : e.attr({
            d: a
        });
        this.addToContainer(e.node, b);
        return e
    },
    set: function (a) {
        return this.R.set(a)
    },
    remove: function (a) {
        if (a) {
            var b = this.rBin;
            b.appendChild(a);
            b.innerHTML = ""
        }
    },
    bounce: function (a, b, c, d, e) {
        return (b /= e) < 1 / 2.75 ? d * 7.5625 * b * b + c : b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + c : b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + c
    },
    easeInSine: function (a, b, c, d, e) {
        return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
    },
    easeOutSine: function (a, b, c, d, e) {
        return d * Math.sin(b / e * (Math.PI / 2)) + c
    },
    easeOutElastic: function (a, b, c, d, e) {
        a = 1.70158;
        var f = 0,
            g = d;
        if (0 === b) return c;
        if (1 == (b /= e)) return c +
                d;
        f || (f = 0.3 * e);
        g < Math.abs(d) ? (g = d, a = f / 4) : a = f / (2 * Math.PI) * Math.asin(d / g);
        return g * Math.pow(2, -10 * b) * Math.sin((b * e - a) * 2 * Math.PI / f) + d + c
    },
    renderFix: function () {
        var a = this.container,
            b = a.style,
            c;
        try {
            c = a.getScreenCTM() || a.createSVGMatrix()
        } catch (d) {
            c = a.createSVGMatrix()
        }
        a = 1 - c.e % 1;
        c = 1 - c.f % 1;
        0.5 < a && (a -= 1);
        0.5 < c && (c -= 1);
        a && (b.left = a + "px");
        c && (b.top = c + "px")
    }
});
AmCharts.AmDObject = AmCharts.Class({
    construct: function (a, b) {
        this.D = b;
        this.R = b.R;
        this.node = this.R.create(this, a);
        this.y = this.x = 0;
        this.scale = 1
    },
    attr: function (a) {
        this.R.attr(this, a);
        return this
    },
    getAttr: function (a) {
        return this.node.getAttribute(a)
    },
    setAttr: function (a, b) {
        this.R.setAttr(this, a, b);
        return this
    },
    clipRect: function (a, b, c, d) {
        this.R.clipRect(this, a, b, c, d)
    },
    translate: function (a, b, c, d) {
        d || (a = Math.round(a), b = Math.round(b));
        this.R.move(this, a, b, c);
        this.x = a;
        this.y = b;
        this.scale = c;
        this.angle && this.rotate(this.angle)
    },
    rotate: function (a) {
        this.R.rotate(this, a);
        this.angle = a
    },
    animate: function (a, b, c) {
        for (var d in a) if (a.hasOwnProperty(d)) {
                var e = d,
                    f = a[d];
                c = AmCharts.getEffect(c);
                this.R.animate(this, e, f, b, c)
            }
    },
    push: function (a) {
        if (a) {
            var b = this.node;
            b.appendChild(a.node);
            var c = a.clipPath;
            c && b.appendChild(c);
            (a = a.grad) && b.appendChild(a)
        }
    },
    text: function (a) {
        this.R.setText(this, a)
    },
    remove: function () {
        this.R.remove(this)
    },
    clear: function () {
        var a = this.node;
        if (a.hasChildNodes()) for (; 1 <= a.childNodes.length;) a.removeChild(a.firstChild)
    },
    hide: function () {
        this.setAttr("visibility", "hidden")
    },
    show: function () {
        this.setAttr("visibility", "visible")
    },
    getBBox: function () {
        return this.R.getBBox(this)
    },
    toFront: function () {
        var a = this.node;
        if (a) {
            var b = a.parentNode;
            b && b.appendChild(a)
        }
    },
    toBack: function () {
        var a = this.node;
        if (a) {
            var b = a.parentNode;
            if (b) {
                var c = b.firstChild;
                c && b.insertBefore(a, c)
            }
        }
    },
    mouseover: function (a) {
        this.R.addListener(this, "mouseover", a);
        return this
    },
    mouseout: function (a) {
        this.R.addListener(this, "mouseout", a);
        return this
    },
    click: function (a) {
        this.R.addListener(this,
            "click", a);
        return this
    },
    dblclick: function (a) {
        this.R.addListener(this, "dblclick", a);
        return this
    },
    mousedown: function (a) {
        this.R.addListener(this, "mousedown", a);
        return this
    },
    mouseup: function (a) {
        this.R.addListener(this, "mouseup", a);
        return this
    },
    touchstart: function (a) {
        this.R.addListener(this, "touchstart", a);
        return this
    },
    touchend: function (a) {
        this.R.addListener(this, "touchend", a);
        return this
    },
    contextmenu: function (a) {
        this.node.addEventListener ? this.node.addEventListener("contextmenu", a) : this.R.addListener(this,
            "contextmenu", a);
        return this
    },
    stop: function () {
        var a = this.animationX;
        a && AmCharts.removeFromArray(this.R.animations, a);
        (a = this.animationY) && AmCharts.removeFromArray(this.R.animations, a)
    },
    length: function () {
        return this.node.childNodes.length
    },
    gradient: function (a, b, c) {
        this.R.gradient(this, a, b, c)
    }
});
AmCharts.VMLRenderer = AmCharts.Class({
    construct: function (a) {
        this.D = a;
        this.cNames = {
            circle: "oval",
            rect: "roundrect",
            path: "shape"
        };
        this.styleMap = {
            x: "left",
            y: "top",
            width: "width",
            height: "height",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            visibility: "visibility"
        };
        this.animations = []
    },
    create: function (a, b) {
        var c;
        if ("group" == b) c = document.createElement("div"), a.type = "div";
        else if ("text" == b) c = document.createElement("div"), a.type = "text";
        else if ("image" == b) c = document.createElement("img"), a.type = "image";
        else {
            a.type =
                "shape";
            a.shapeType = this.cNames[b];
            c = document.createElement("amvml:" + this.cNames[b]);
            var d = document.createElement("amvml:stroke");
            c.appendChild(d);
            a.stroke = d;
            var e = document.createElement("amvml:fill");
            c.appendChild(e);
            a.fill = e;
            e.className = "amvml";
            d.className = "amvml";
            c.className = "amvml"
        }
        c.style.position = "absolute";
        c.style.top = 0;
        c.style.left = 0;
        return c
    },
    path: function (a, b) {
        a.node.setAttribute("src", b)
    },
    setAttr: function (a, b, c) {
        if (void 0 !== c) {
            var d;
            8 === document.documentMode && (d = !0);
            var e = a.node,
                f = a.type,
                g = e.style;
            "r" == b && (g.width = 2 * c, g.height = 2 * c);
            if ("roundrect" == a.shapeType && ("width" == b || "height" == b)) c -= 1;
            "cursor" == b && (g.cursor = c);
            "cx" == b && (g.left = c - AmCharts.removePx(g.width) / 2);
            "cy" == b && (g.top = c - AmCharts.removePx(g.height) / 2);
            var h = this.styleMap[b];
            void 0 !== h && (g[h] = c);
            "text" == f && ("text-anchor" == b && (a.anchor = c, h = e.clientWidth, "end" == c && (g.marginLeft = -h + "px"), "middle" == c && (g.marginLeft = -(h / 2) + "px"), "start" == c && (g.marginLeft = "0px")), "fill" == b && (g.color = c), "font-weight" == b && (g.fontWeight = c));
            if (g =
                a.children) for (h = 0; h < g.length; h++) g[h].setAttr(b, c);
            if ("shape" == f) {
                "cs" == b && (e.style.width = "100px", e.style.height = "100px", e.setAttribute("coordsize", c));
                "d" == b && e.setAttribute("path", this.svgPathToVml(c));
                "dd" == b && e.setAttribute("path", c);
                f = a.stroke;
                a = a.fill;
                "stroke" == b && (d ? f.color = c : f.setAttribute("color", c));
                "stroke-width" == b && (d ? f.weight = c : f.setAttribute("weight", c));
                "stroke-opacity" == b && (d ? f.opacity = c : f.setAttribute("opacity", c));
                "stroke-dasharray" == b && (g = "solid", 0 < c && 3 > c && (g = "dot"), 3 <= c && 6 >=
                    c && (g = "dash"), 6 < c && (g = "longdash"), d ? f.dashstyle = g : f.setAttribute("dashstyle", g));
                if ("fill-opacity" == b || "opacity" == b) 0 === c ? d ? a.on = !1 : a.setAttribute("on", !1) : d ? a.opacity = c : a.setAttribute("opacity", c);
                "fill" == b && (d ? a.color = c : a.setAttribute("color", c));
                "rx" == b && (d ? e.arcSize = c + "%" : e.setAttribute("arcsize", c + "%"))
            }
        }
    },
    attr: function (a, b) {
        for (var c in b) b.hasOwnProperty(c) && this.setAttr(a, c, b[c])
    },
    text: function (a, b, c) {
        var d = new AmCharts.AmDObject("text", this.D),
            e = d.node;
        e.style.whiteSpace = "pre";
        a = document.createTextNode(a);
        e.appendChild(a);
        this.D.addToContainer(e, c);
        this.attr(d, b);
        return d
    },
    getBBox: function (a) {
        return this.getBox(a.node)
    },
    getBox: function (a) {
        var b = a.offsetLeft,
            c = a.offsetTop,
            d = a.offsetWidth,
            e = a.offsetHeight,
            f;
        if (a.hasChildNodes()) {
            var g, h, j;
            for (j = 0; j < a.childNodes.length; j++) {
                f = this.getBox(a.childNodes[j]);
                var k = f.x;
                isNaN(k) || (isNaN(g) ? g = k : k < g && (g = k));
                var l = f.y;
                isNaN(l) || (isNaN(h) ? h = l : l < h && (h = l));
                k = f.width + k;
                isNaN(k) || (d = Math.max(d, k));
                f = f.height + l;
                isNaN(f) || (e = Math.max(e, f))
            }
            0 > g && (b += g);
            0 > h && (c += h)
        }
        return {
            x: b,
            y: c,
            width: d,
            height: e
        }
    },
    setText: function (a, b) {
        var c = a.node;
        c && (c.removeChild(c.firstChild), c.appendChild(document.createTextNode(b)));
        this.setAttr(a, "text-anchor", a.anchor)
    },
    addListener: function (a, b, c) {
        a.node["on" + b] = c
    },
    move: function (a, b, c) {
        var d = a.node,
            e = d.style;
        "text" == a.type && (c -= AmCharts.removePx(e.fontSize) / 2 - 1);
        "oval" == a.shapeType && (b -= AmCharts.removePx(e.width) / 2, c -= AmCharts.removePx(e.height) / 2);
        a = a.bw;
        isNaN(a) || (b -= a, c -= a);
        !isNaN(b) && !isNaN(c) && (d.style.left = b + "px", d.style.top = c + "px")
    },
    svgPathToVml: function (a) {
        var b =
            a.split(" ");
        a = "";
        var c, d = Math.round,
            e;
        for (e = 0; e < b.length; e++) {
            var f = b[e],
                g = f.substring(0, 1),
                f = f.substring(1),
                h = f.split(","),
                j = d(h[0]) + "," + d(h[1]);
            "M" == g && (a += " m " + j);
            "L" == g && (a += " l " + j);
            "Z" == g && (a += " x e");
            if ("Q" == g) {
                var k = c.length,
                    l = c[k - 1],
                    n = h[0],
                    q = h[1],
                    j = h[2],
                    m = h[3];
                c = d(c[k - 2] / 3 + 2 / 3 * n);
                l = d(l / 3 + 2 / 3 * q);
                n = d(2 / 3 * n + j / 3);
                q = d(2 / 3 * q + m / 3);
                a += " c " + c + "," + l + "," + n + "," + q + "," + j + "," + m
            }
            "A" == g && (a += " wa " + f);
            "B" == g && (a += " at " + f);
            c = h
        }
        return a
    },
    animate: function (a, b, c, d, e) {
        var f = this,
            g = a.node;
        if ("translate" == b) {
            var h =
                c.split(",");
            b = h[1];
            c = g.offsetTop;
            g = {
                obj: a,
                frame: 0,
                attribute: "left",
                from: g.offsetLeft,
                to: h[0],
                time: d,
                effect: e
            };
            f.animations.push(g);
            d = {
                obj: a,
                frame: 0,
                attribute: "top",
                from: c,
                to: b,
                time: d,
                effect: e
            };
            f.animations.push(d);
            a.animationX = g;
            a.animationY = d
        }
        f.interval || (f.interval = setInterval(function () {
            f.updateAnimations.call(f)
        }, AmCharts.updateRate))
    },
    updateAnimations: function () {
        var a;
        for (a = this.animations.length - 1; 0 <= a; a--) {
            var b = this.animations[a],
                c = 1E3 * b.time / AmCharts.updateRate,
                d = b.frame + 1,
                e = b.obj,
                f = b.attribute;
            if (d <= c) {
                b.frame++;
                var g = Number(b.from),
                    h = Number(b.to) - g,
                    b = this.D[b.effect](0, d, g, h, c);
                0 === h ? this.animations.splice(a, 1) : e.node.style[f] = b
            } else e.node.style[f] = Number(b.to), this.animations.splice(a, 1)
        }
    },
    clipRect: function (a, b, c, d, e) {
        a = a.node;
        0 == b && 0 == c ? (a.style.width = d + "px", a.style.height = e + "px", a.style.overflow = "hidden") : a.style.clip = "rect(" + c + "px " + (b + d) + "px " + (c + e) + "px " + b + "px)"
    },
    rotate: function (a, b) {
        if (0 != Number(b)) {
            var c = a.node,
                d = c.style,
                e = this.getBGColor(c.parentNode);
            d.backgroundColor = e;
            d.paddingLeft =
                1;
            var e = b * Math.PI / 180,
                f = Math.cos(e),
                g = Math.sin(e),
                h = AmCharts.removePx(d.left),
                j = AmCharts.removePx(d.top),
                k = c.offsetWidth,
                c = c.offsetHeight,
                l = b / Math.abs(b);
            d.left = h + k / 2 - k / 2 * Math.cos(e) - l * c / 2 * Math.sin(e) + 3;
            d.top = j - l * k / 2 * Math.sin(e) + l * c / 2 * Math.sin(e);
            d.cssText = d.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + f + "', M12='" + -g + "', M21='" + g + "', M22='" + f + "', sizingmethod='auto expand');"
        }
    },
    getBGColor: function (a) {
        var b = "#FFFFFF";
        if (a.style) {
            var c = a.style.backgroundColor;
            "" !== c ? b = c : a.parentNode &&
                (b = this.getBGColor(a.parentNode))
        }
        return b
    },
    set: function (a) {
        var b = new AmCharts.AmDObject("group", this.D);
        this.D.container.appendChild(b.node);
        if (a) {
            var c;
            for (c = 0; c < a.length; c++) b.push(a[c])
        }
        return b
    },
    gradient: function (a, b, c, d) {
        var e = "";
        "radialGradient" == b && (b = "gradientradial", c.reverse());
        "linearGradient" == b && (b = "gradient");
        var f;
        for (f = 0; f < c.length; f++) {
            var g = Math.round(100 * f / (c.length - 1)),
                e = e + (g + "% " + c[f]);
            f < c.length - 1 && (e += ",")
        }
        a = a.fill;
        90 == d ? d = 0 : 270 == d ? d = 180 : 180 == d ? d = 90 : 0 === d && (d = 270);
        8 === document.documentMode ?
            (a.type = b, a.angle = d) : (a.setAttribute("type", b), a.setAttribute("angle", d));
        e && (a.colors.value = e)
    },
    remove: function (a) {
        a.clipPath && this.D.remove(a.clipPath);
        this.D.remove(a.node)
    },
    disableSelection: function (a) {
        void 0 !== typeof a.onselectstart && (a.onselectstart = function () {
            return !1
        });
        a.style.cursor = "default"
    }
});
AmCharts.SVGRenderer = AmCharts.Class({
    construct: function (a) {
        this.D = a;
        this.animations = []
    },
    create: function (a, b) {
        return document.createElementNS(AmCharts.SVG_NS, b)
    },
    attr: function (a, b) {
        for (var c in b) b.hasOwnProperty(c) && this.setAttr(a, c, b[c])
    },
    setAttr: function (a, b, c) {
        void 0 !== c && a.node.setAttribute(b, c)
    },
    animate: function (a, b, c, d, e) {
        var f = this,
            g = a.node;
        "translate" == b ? (g = (g = g.getAttribute("transform")) ? String(g).substring(10, g.length - 1) : "0,0", g = g.split(", ").join(" "), g = g.split(" ").join(","), 0 === g && (g =
            "0,0")) : g = g.getAttribute(b);
        b = {
            obj: a,
            frame: 0,
            attribute: b,
            from: g,
            to: c,
            time: d,
            effect: e
        };
        f.animations.push(b);
        a.animationX = b;
        f.interval || (f.interval = setInterval(function () {
            f.updateAnimations.call(f)
        }, AmCharts.updateRate))
    },
    updateAnimations: function () {
        var a;
        for (a = this.animations.length - 1; 0 <= a; a--) {
            var b = this.animations[a],
                c = 1E3 * b.time / AmCharts.updateRate,
                d = b.frame + 1,
                e = b.obj,
                f = b.attribute,
                g, h, j;
            d <= c ? (b.frame++, "translate" == f ? (g = b.from.split(","), f = Number(g[0]), g = Number(g[1]), h = b.to.split(","), j = Number(h[0]),
                h = Number(h[1]), j = 0 === j - f ? j : Math.round(this.D[b.effect](0, d, f, j - f, c)), b = 0 === h - g ? h : Math.round(this.D[b.effect](0, d, g, h - g, c)), f = "transform", b = "translate(" + j + "," + b + ")") : (g = Number(b.from), j = Number(b.to), j -= g, b = this.D[b.effect](0, d, g, j, c), 0 === j && this.animations.splice(a, 1)), this.setAttr(e, f, b)) : ("translate" == f ? (h = b.to.split(","), j = Number(h[0]), h = Number(h[1]), e.translate(j, h)) : (j = Number(b.to), this.setAttr(e, f, j)), this.animations.splice(a, 1))
        }
    },
    getBBox: function (a) {
        if (a = a.node) try {
                return a.getBBox()
        } catch (b) {}
        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }
    },
    path: function (a, b) {
        a.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", b)
    },
    clipRect: function (a, b, c, d, e) {
        var f = a.node,
            g = a.clipPath;
        g && this.D.remove(g);
        var h = f.parentNode;
        h && (f = document.createElementNS(AmCharts.SVG_NS, "clipPath"), g = AmCharts.getUniqueId(), f.setAttribute("id", g), this.D.rect(b, c, d, e, 0, 0, f), h.appendChild(f), b = "#", AmCharts.baseHref && !AmCharts.isIE && (b = window.location.href + b), this.setAttr(a, "clip-path", "url(" + b + g + ")"), this.clipPathC++, a.clipPath = f)
    },
    text: function (a, b,
        c) {
        var d = new AmCharts.AmDObject("text", this.D);
        a = String(a).split("\n");
        var e = b["font-size"],
            f;
        for (f = 0; f < a.length; f++) {
            var g = this.create(null, "tspan");
            g.appendChild(document.createTextNode(a[f]));
            g.setAttribute("y", (e + 2) * f + e / 2 + 0);
            g.setAttribute("x", 0);
            d.node.appendChild(g)
        }
        d.node.setAttribute("y", e / 2 + 0);
        this.attr(d, b);
        this.D.addToContainer(d.node, c);
        return d
    },
    setText: function (a, b) {
        var c = a.node;
        c && (c.removeChild(c.firstChild), c.appendChild(document.createTextNode(b)))
    },
    move: function (a, b, c, d) {
        b = "translate(" +
            b + "," + c + ")";
        d && (b = b + " scale(" + d + ")");
        this.setAttr(a, "transform", b)
    },
    rotate: function (a, b) {
        var c = a.node.getAttribute("transform"),
            d = "rotate(" + b + ")";
        c && (d = c + " " + d);
        this.setAttr(a, "transform", d)
    },
    set: function (a) {
        var b = new AmCharts.AmDObject("g", this.D);
        this.D.container.appendChild(b.node);
        if (a) {
            var c;
            for (c = 0; c < a.length; c++) b.push(a[c])
        }
        return b
    },
    addListener: function (a, b, c) {
        a.node["on" + b] = c
    },
    gradient: function (a, b, c, d) {
        var e = a.node,
            f = a.grad;
        f && this.D.remove(f);
        b = document.createElementNS(AmCharts.SVG_NS,
            b);
        f = AmCharts.getUniqueId();
        b.setAttribute("id", f);
        if (!isNaN(d)) {
            var g = 0,
                h = 0,
                j = 0,
                k = 0;
            90 == d ? j = 100 : 270 == d ? k = 100 : 180 == d ? g = 100 : 0 === d && (h = 100);
            b.setAttribute("x1", g + "%");
            b.setAttribute("x2", h + "%");
            b.setAttribute("y1", j + "%");
            b.setAttribute("y2", k + "%")
        }
        for (d = 0; d < c.length; d++) g = document.createElementNS(AmCharts.SVG_NS, "stop"), h = 100 * d / (c.length - 1), 0 === d && (h = 0), g.setAttribute("offset", h + "%"), g.setAttribute("stop-color", c[d]), b.appendChild(g);
        e.parentNode.appendChild(b);
        c = "#";
        AmCharts.baseHref && !AmCharts.isIE &&
            (c = window.location.href + c);
        e.setAttribute("fill", "url(" + c + f + ")");
        a.grad = b
    },
    remove: function (a) {
        a.clipPath && this.D.remove(a.clipPath);
        a.grad && this.D.remove(a.grad);
        this.D.remove(a.node)
    }
});
AmCharts.AmDSet = AmCharts.Class({
    construct: function () {
        this.create("g")
    },
    attr: function (a) {
        this.R.attr(this.node, a)
    },
    move: function (a, b) {
        this.R.move(this.node, a, b)
    }
});