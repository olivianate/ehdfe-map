var BMapLib = window.BMapLib = BMapLib || {};
if (typeof BMapLib._toolInUse == "undefined") {
	BMapLib._toolInUse = false
}(function() {
	var a = a || {
		guid: "$BAIDU$"
	};
	(function() {
		window[a.guid] = {};
		a.extend = function(e, c) {
			for (var d in c) {
				if (c.hasOwnProperty(d)) {
					e[d] = c[d]
				}
			}
			return e
		};
		a.lang = a.lang || {};
		a.lang.guid = function() {
			return "TANGRAM__" + (window[a.guid]._counter++).toString(36)
		};
		window[a.guid]._counter = window[a.guid]._counter || 1;
		window[a.guid]._instances = window[a.guid]._instances || {};
		a.lang.Class = function(c) {
			this.guid = c || a.lang.guid();
			window[a.guid]._instances[this.guid] = this
		};
		a.lang.isString = function(c) {
			return "[object String]" == Object.prototype.toString.call(c)
		};
		a.lang.isFunction = function(c) {
			return "[object Function]" == Object.prototype.toString.call(c)
		};
		a.lang.Class.prototype.toString = function() {
			return "[object " + (this._className || "Object") + "]"
		};
		a.lang.Class.prototype.dispose = function() {
			delete window[a.guid]._instances[this.guid];
			for (var c in this) {
				if (!a.lang.isFunction(this[c])) {
					delete this[c]
				}
			}
			this.disposed = true
		};
		a.lang.Event = function(c, d) {
			this.type = c;
			this.returnValue = true;
			this.target = d || null;
			this.currentTarget = null
		};
		a.lang.Class.prototype.addEventListener = function(f, e, d) {
			if (!a.lang.isFunction(e)) {
				return
			}!this.__listeners && (this.__listeners = {});
			var c = this.__listeners,
				g;
			if (typeof d == "string" && d) {
				if (/[^\w\-]/.test(d)) {
					throw ("nonstandard key:" + d)
				} else {
					e.hashCode = d;
					g = d
				}
			}
			f.indexOf("on") != 0 && (f = "on" + f);
			typeof c[f] != "object" && (c[f] = {});
			g = g || a.lang.guid();
			e.hashCode = g;
			c[f][g] = e
		};
		a.lang.Class.prototype.removeEventListener = function(e, d) {
			if (a.lang.isFunction(d)) {
				d = d.hashCode
			} else {
				if (!a.lang.isString(d)) {
					return
				}
			}!this.__listeners && (this.__listeners = {});
			e.indexOf("on") != 0 && (e = "on" + e);
			var c = this.__listeners;
			if (!c[e]) {
				return
			}
			c[e][d] && delete c[e][d]
		};
		a.lang.Class.prototype.dispatchEvent = function(f, c) {
			if (a.lang.isString(f)) {
				f = new a.lang.Event(f)
			}!this.__listeners && (this.__listeners = {});
			c = c || {};
			for (var e in c) {
				f[e] = c[e]
			}
			var e, d = this.__listeners,
				g = f.type;
			f.target = f.target || this;
			f.currentTarget = this;
			g.indexOf("on") != 0 && (g = "on" + g);
			a.lang.isFunction(this[g]) && this[g].apply(this, arguments);
			if (typeof d[g] == "object") {
				for (e in d[g]) {
					d[g][e].apply(this, arguments)
				}
			}
			return f.returnValue
		};
		a.lang.inherits = function(i, g, f) {
			var e, h, c = i.prototype,
				d = new Function();
			d.prototype = g.prototype;
			h = i.prototype = new d();
			for (e in c) {
				h[e] = c[e]
			}
			i.prototype.constructor = i;
			i.superClass = g.prototype;
			if ("string" == typeof f) {
				h._className = f
			}
		}
	})();
	var b = BMapLib.MarkerTool = function(d, c) {
			a.lang.Class.call(this);
			this._map = d;
			this._opts = {
				icon: b.SYS_ICONS[0],
				followText: "点击地图添加标注",
				autoClose: true
			};
			a.extend(this._opts, c);
			this._isOpen = false;
			this._opts.followText = this._checkStr(this._opts.followText);
			this._followMarker = null;
			this._followLabel = null
		};
	a.lang.inherits(b, a.lang.Class, "MarkerTool");
	b.prototype.open = function() {
		if (!this._map) {
			return false
		}
		if (this._isOpen == true) {
			return true
		}
		if (BMapLib._toolInUse) {
			return false
		}
		BMapLib._toolInUse = true;
		this._isOpen = true;
		if (!this._binded) {
			this._bind();
			this._binded = true
		}
		if (!this._followMarker) {
			this._followMarker = new BMap.Marker(this._map.getCenter(), {
				offset: new BMap.Size(-10, -10)
			});
			this._map.addOverlay(this._followMarker);
			this._followMarker.setZIndex(1000);
			this._followMarker.hide()
		}
		if (!this._followLabel) {
			this._followLabel = new BMap.Label(this._opts.followText, {
				offset: new BMap.Size(20, 0)
			})
		}
		this._preCursor = this._map.getDefaultCursor();
		this._map.setDefaultCursor("url(" + b.CUR_IMG + "), default");
		return true
	};
	b.prototype.close = function() {
		if (!this._isOpen) {
			return
		}
		this._map.removeEventListener("mousemove", this._mouseMoveHandler);
		this._map.removeEventListener("click", this._clickHandler);
		this._followMarker.hide();
		this._map.setDefaultCursor(this._preCursor);
		BMapLib._toolInUse = false;
		this._isOpen = false;
		this._binded = false
	};
	b.prototype.setIcon = function(c) {
		if (!c || !(c instanceof BMap.Icon)) {
			return
		}
		this._opts.icon = c
    };
    b.prototype.setlabel = function(c) {
		// if (!c || !(c instanceof BMap.Icon)) {
		// 	return
		// }
		// this._opts.icon = c
	};
	b.prototype.getIcon = function() {
		return this._opts.icon
    };
    
	b.prototype._checkStr = function(c) {
		if (!c) {
			return ""
		}
		return c.replace(/</g, "&lt;").replace(/>/g, "&gt;")
	};
	b.prototype._bind = function() {
		var c = this;
		if (!c._isOpen) {
			return
        }
        c._label = new BMap.Label('添加一个标注',{
            offset: new BMap.Size(25, 10)
		});
		
        c._label.setStyle({
            backgroundColor:'#000',
            position:'relative',
            color:'#fff',
            opacity:'0.6',
            width:'auto',
            border:'0',
            padding:'2px'
        });
		c._mouseMoveHandler = function(d) {
			var e = d.point;
			c._followMarker.setIcon(c._opts.icon);
            c._followMarker.setPosition(e);
            
            //鼠标跟随
            var gc = new BMap.Geocoder();
            gc.getLocation(e, function(rs) {
                var address = rs.address;
                c._label.setContent(address);
            })
            c._followMarker.setLabel(c._label);
            c._followMarker.show()
		};
		c._map.addEventListener("mousemove", c._mouseMoveHandler);
		c._clickHandler = function(d) {
			var i = d.pixel;
			var g = new BMap.Pixel(i.x - 10, i.y - 10);
			var h = c._map.pixelToPoint(g);
			var e = new BMap.Marker(h, {
                icon: c._opts.icon,
            });
            e.address = c._label.content;//地址储存
			var data = {
				address:e.address
			};
			e.data = data;//数据储存
			c._map.addOverlay(e);
			var f = new a.lang.Event("onmarkend");
			f.marker = e;
			c.dispatchEvent(f);
			if (c._opts.autoClose) {
				c.close()
			}
		};
		c._map.addEventListener("click", c._clickHandler)
	};
	b.CUR_IMG = "http://api.map.baidu.com/library/MarkerTool/1.2/src/images/transparent.cur";
	b.ICON_IMG = "http://api.map.baidu.com/library/MarkerTool/1.2/src/images/us_mk_icon.png";
})();