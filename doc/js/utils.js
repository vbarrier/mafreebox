if (typeof(console) === "undefined") {
    function log() {
        var a = (arguments.length > 1) ? Array.prototype.join.call(arguments, " ") : arguments[0];
        try {
            opera.postError(a)
        } catch (b) {}
    }
    console = {
        error: log,
        log: log,
        debug: log
    }
}
function number_format(f, b, m, e) {
    var a = f,
        l = isNaN(b = Math.abs(b)) ? 2 : b;
    var k = m == undefined ? "," : m;
    var o = e == undefined ? "." : e,
        p = a < 0 ? "-" : "";
    var h = parseInt(a = Math.abs(+a || 0).toFixed(l)) + "",
        g = (g = h.length) > 3 ? g % 3 : 0;
    return p + (g ? h.substr(0, g) + o : "") + h.substr(g).replace(/(\d{3})(?=\d)/g, "$1" + o) + (l ? k + Math.abs(a - h).toFixed(l).slice(2) : "")
}
function format_size(a) {
    if (a == null) {
        return null
    }
    if (a >= 1073741824) {
        return number_format(a / 1073741824, 2, ",", "") + " Gio"
    }
    if (a >= 1048576) {
        return number_format(a / 1048576, 2, ",", "") + " Mio"
    }
    if (a >= 1024) {
        return number_format(a / 1024, 0) + " Kio"
    }
    return number_format(a, 0) + " octets"
}
function format_size_kilo(a) {
    if (a == null) {
        return null
    }
    if (a >= 1000000000) {
        return number_format(a / 1000000000, 2, ",", "") + " Go"
    }
    if (a >= 1000000) {
        return number_format(a / 1000000, 2, ",", "") + " Mo"
    }
    if (a >= 1000) {
        return number_format(a / 1000, 0) + " Ko"
    }
    return number_format(a, 0) + " octets"
}
function format_rate(a) {
    if (a == null) {
        return null
    }
    if (a >= 1000000000) {
        return number_format(a / 1000000000, 2, ",", " ") + " Go/s"
    }
    if (a >= 1000000) {
        return number_format(a / 1000000, 2, ",", " ") + " Mo/s"
    }
    if (a >= 1000) {
        return number_format(a / 1000, 0) + " Ko/s"
    }
    return number_format(a, 0) + " octets/s"
}
function format_duration(e) {
    var d = "";
    if (e == null) {
        return null
    }
    if (e >= 3600 * 24) {
        var b = Math.floor(e / 3600 * 24);
        d += b + " jour" + (b > 1 ? "s " : " ");
        e -= b * 3600 * 24
    }
    if (e >= 3600) {
        var c = Math.floor(e / 3600);
        d += c + " heure" + (c > 1 ? "s " : " ");
        e -= c * 3600
    }
    if (e >= 60) {
        var a = Math.floor(e / 60);
        d += a + " minute" + (a > 1 ? "s " : " ");
        e -= a * 60
    }
    if (e >= 0) {
        d += e + " seconde" + (e > 1 ? "s " : " ")
    }
    return d
}
function format_timestamp(b) {
    function c(g, d) {
        var h = "" + g;
        while (h.length < d) {
            h = "0" + h
        }
        return h
    }
    var f = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    var a = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    if (b == null) {
        return ""
    }
    var e = new Date(b * 1000);
    return f[e.getDay()] + " " + e.getDate() + " " + a[e.getMonth()] + " à " + c(e.getHours(), 2) + ":" + c(e.getMinutes(), 2) + ":" + c(e.getSeconds(), 2)
}
var MAX_DUMP_DEPTH = 10;

function dumpObj(g, c, a, h) {
    if (h > MAX_DUMP_DEPTH) {
        return a + c + ": <Maximum Depth Reached>\n"
    }
    if (typeof g == "object") {
        var i = null;
        var b = a + c + "\n";
        a += "\t";
        for (var d in g) {
            try {
                i = g[d]
            } catch (f) {
                i = "<Unable to Evaluate>"
            }
            if (typeof i == "object") {
                b += dumpObj(i, d, a, h + 1)
            } else {
                b += a + d + ": " + i + "\n"
            }
        }
        return b
    } else {
        return g
    }
}
function ipv4_to_uint32(h, e) {
    if (h.search(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        return null
    }
    var c = h.split(/\./);
    for (var f = 0; f < 4; f++) {
        if (c[f] > 255) {
            return null
        }
    }
    var b = (c[0] << 24) | (c[1] << 16) | (c[2] << 8) | c[3];
    switch (e) {
    case "ip":
    default:
        if (c[3] == 0) {
            return null
        }
        break;
    case "network":
        break;
    case "mask":
        var g = 0,
            d = b;
        for (f = 0; f < 32; f++) {
            if ((d & 1) != g) {
                if (g == 0) {
                    g = 1
                } else {
                    return null
                }
            }
            d = d >> 1
        }
        break
    }
    return b
}
function getQueryParams(a) {
    a = a.split("+").join(" ");
    var d = {};
    var c;
    var b = /[?&]?([^=]+)=([^&]*)/g;
    while (c = b.exec(a)) {
        d[decodeURIComponent(c[1])] = decodeURIComponent(c[2])
    }
    return d
}
function check_ipv4(b, a) {
    b = ipv4_to_uint32(b, a);
    return b != null && b != 0
}
function check_port(a) {
    var b = /^\d+$/;
    if (!b.test(a)) {
        return false
    }
    if (a <= 0 || a > 65535) {
        return false
    }
    return true
}
function check_ipv4_in_network(c, b, a) {
    c = ipv4_to_uint32(c);
    b = ipv4_to_uint32(b, "network");
    a = ipv4_to_uint32(a, "mask");
    if (c == null || b == null || a == null) {
        return false
    }
    return ((c & a) == (b & a))
}
function check_mac(b) {
    var a = /^([0-9a-f]{2}([:]|$)){6}$|[0-9a-f]{12}$/i;
    return a.test(b)
}
ejs = {
    cache: {},
    cache_proto: {},
    waitlist: {},
    esc: function(a) {
        if (typeof(a) == "string") {
            return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        if (a === undefined) {
            return ""
        }
        return a
    },
    urlencode: function(a) {
        return escape(a).replace(/\+/g, "%2B")
    },
    urldecode: function(a) {
        return unescape(a.replace(/\+/g, " "))
    },
    escape_quotes: function(a) {
        return (a || "").replace(/\"/g, '\\"')
    },
    array_len: function(a) {
        return a.length
    },
    tostring: function(a) {
        return a
    },
    trim: function(a) {
        return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    },
    get: function(script, env, cb) {
        function get_inputvar(env) {
            var proto = ejs.cache_proto[script],
                ret = [];
            for (var i = 0; i < proto.length; i++) {
                ret.push(env[proto[i]])
            }
            return ret
        }
        if (ejs.cache[script]) {
            try {
                cb($(ejs.cache[script].apply(this, get_inputvar(env))))
            } catch (err) {
                console.error(err)
            }
        } else {
            if (ejs.waitlist[script]) {
                ejs.waitlist[script].push({
                    cb: cb,
                    env: env
                })
            } else {
                var proto = [];
                for (var x in env) {
                    proto.push(x)
                }
                ejs.waitlist[script] = [{
                    cb: cb,
                    env: env
                }];
                $.get(script, {
                    name: script,
                    proto: proto.join(",")
                }, function(js_code) {
                    try {
                        eval(js_code);
                        ejs.cache_proto[script] = proto
                    } catch (err) {
                        console.debug("error loading ejs template: " + err.message, err);
                        ejs.cache[script] = null;
                        ejs.cache_proto[script] = null;
                        ejs.waitlist[script] = null;
                        return
                    }
                    for (var x in ejs.waitlist[script]) {
                        try {
                            var cl = ejs.waitlist[script][x];
                            cl.cb($(ejs.cache[script].apply(this, get_inputvar(cl.env))))
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            }
        }
    }
};
(function(b) {
    b.jsonrpc = function(k) {
        var c = b.extend({
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            gresult: []
        }, k);
        var f = b.isArray(c.batch);
        if (typeof c.url != "string") {
            if (typeof c.method == "string") {
                c.url = c.method.match(/^[^\.]+/) + ".cgi"
            }
        }
        var h = c.success;
        var d = c.error;
        c.error = function(o) {
            var m;
            try {
                if (c.debug || !d) {
                    console.error("jsonrpc '" + c.method + "' http error: ", o.status, o.statusText)
                }
                if (o.status == 403 && o.getResponseHeader("X-Reason") == "please log-in") {
                    document.location.href = "/login.php"
                }
                m = o.statusText
            } catch (n) {
                m = "timeout"
            }
            if (d) {
                try {
                    d.call(c.context, 500, m)
                } catch (l) {
                    console.error(l)
                }
            }
        };

        function e(n, l) {
            if (!l.error) {
                if (c.debug && n.method) {
                    console.debug("jsonrpc '" + n.method + "' ok: ", l.result)
                }
                c.gresult.push(l.result);
                if (n.success) {
                    try {
                        n.success.call(c.context, l.result, l.id)
                    } catch (m) {
                        console.error(m)
                    }
                }
                return false
            } else {
                if (l.error) {
                    if ((!n.error || c.debug) && n.method) {
                        console.error("jsonrpc '" + n.method + "' failed: ", l.error.message, l.error.debug)
                    }
                    if (n.error) {
                        try {
                            n.error.call(c.context, l.error.code, l.error.message, l.id)
                        } catch (m) {
                            console.error(m)
                        }
                    }
                    return true
                } else {
                    console.error("bad jsonrpc reply, request:", n, "answer: ", l);
                    return true
                }
            }
        }
        if (f) {
            c.success = function(o) {
                var n = false;
                for (var l in o) {
                    var m = o[l];
                    if (m.id in c.batch) {
                        n |= e(c.batch[m.id], m)
                    }
                }
                e(k, {
                    error: n,
                    result: c.gresult
                })
            }
        } else {
            c.success = function(l) {
                e(k, l || {})
            }
        }
        var g = function(l, n) {
                var m = {
                    jsonrpc: "2.0",
                    method: l.method,
                    id: n
                };
                if (typeof l.method != "string") {
                    throw Error("jsonrpc: missing 'method' property")
                }
                if (b.isFunction(l.data)) {
                    l.data = l.data.call(l.context)
                }
                if (b.isArray(l.data)) {
                    m.params = l.data
                } else {
                    if (l.data != undefined) {
                        m.params = [l.data]
                    }
                }
                return m
            };
        if (f) {
            var j = [];
            for (var i in c.batch) {
                j.push(g(c.batch[i], i))
            }
            c.data = JSON.stringify(j)
        } else {
            c.data = JSON.stringify(g(c, c.id))
        }
        b.ajax(c)
    };
    b.fn.rpcform = function(c) {
        return b(this).each(function() {
            var f = b.extend({
                dataType: "json",
                data: {}
            }, c);
            var d = f.success;
            var g = f.error;
            var e = b(this);
            var h;
            if (f.method) {
                h = f.data.method = f.method;
                b(this).find("[name=method]").remove()
            } else {
                if (f.data.method) {
                    h = f.data.method;
                    b(this).find("[name=method]").remove()
                } else {
                    if (b(this).find("[name=method]").val()) {
                        h = b(this).find("[name=method]").val()
                    } else {
                        throw Error("rpcform: missing 'method' property")
                    }
                }
            }
            f.error = function(l, i, k) {
                if (l && l.status == 403 && l.getResponseHeader("X-Reason") == "please log-in") {
                    document.location.href = "/login.php"
                }
                if (!k && l) {
                    k = {
                        errcode: l.status,
                        error: l.statusText
                    }
                } else {
                    if (!k) {
                        k = {
                            errcode: -1,
                            error: "Erreur"
                        }
                    }
                }
                if (f.debug || !g) {
                    console.error("jsonrpc form '" + h + "' " + (l ? "http" : "method") + " error: ", k)
                }
                if (g) {
                    try {
                        g.call(e, k)
                    } catch (j) {
                        console.error(j)
                    }
                }
            };
            f.success = function(m, i, l, j) {
                if (m.error) {
                    f.error(undefined, undefined, m)
                } else {
                    if (d) {
                        if (f.debug) {
                            console.log("jsonrpc form '" + h + "' succeed: ", m.result)
                        }
                        try {
                            d.call(j, m.result)
                        } catch (k) {
                            console.error(k)
                        }
                    }
                }
            };
            if (b(this).attr("enctype") == "multipart/form-data") {
                f.data.ajax_iform = 1
            }
            b(this).find("[name=redirect_after]").remove();
            b(this).ajaxForm(f)
        })
    };
    b.fn.formrpc = b.fn.rpcform;
    var a = {
        init: function(d) {
            var e = b.extend({
                jsonrpc: {},
                ejs: {},
                interval: 5000,
                key: "key",
                ejs_update_if_present: false
            }, d);
            var c = e.jsonrpc.success;
            e.jsonrpc.success = function(j) {
                if (e.jsonfield) {
                    j = e.jsonfield(j)
                }
                if (!b.isArray(j)) {
                    throw Error("dynamiclist: jsonrpc call must return an array")
                }
                var i = b(this).data("dyli_elems");
                var h = b(this);
                var f;
                for (f in i) {
                    i[f].check = false
                }
                for (f in j) {
                    var g;
                    if (e.jsonkey) {
                        g = e.jsonkey(j[f])
                    } else {
                        g = j[f][e.key]
                    }
                    if (g == null) {
                        continue
                    }
                    if (e.filter && !e.filter(j[f])) {
                        if (i[g]) {
                            i[g].check = false
                        }
                        continue
                    }
                    var l = i[g];
                    if (l) {
                        l.check = true;
                        if (e.ejs_update_if_present) {
                            ejs.get(e.ejs.url, e.ejs.data(j[f]), (function(m, n) {
                                return function(o) {
                                    var k = b("[" + e.key + "=" + m + "]:first", h);
                                    k.replaceWith(o).trigger("dynamiclist.update", o, n)
                                }
                            })(g, j[f]))
                        }
                        continue
                    }
                    i[g] = {
                        check: true
                    };
                    ejs.get(e.ejs.url, e.ejs.data(j[f]), (function(m, n) {
                        return function(k) {
                            if (i[m]) {
                                h.append(k).trigger("dynamiclist.new", k, n)
                            }
                        }
                    })(g, j[f]))
                }
                for (f in i) {
                    if (!i[f].check) {
                        var l = b("[" + e.key + "=" + f + "]", h);
                        l.trigger("dynamiclist.del", l).remove();
                        delete i[f]
                    }
                }
                if (c) {
                    c.call(this, j)
                }
                if (e.interval > 0) {
                    b(this).data("dyli_to", setTimeout(function() {
                        b.jsonrpc(h.data("dyli_jsonopt"))
                    }, e.interval))
                }
            };
            return b(this).each(function() {
                var g = b(this);
                var f = {};
                var h = b.extend({}, e.jsonrpc);
                h.context = g;
                g.children().each(function() {
                    var i = b(this).attr(e.key);
                    f[i] = {}
                });
                g.data("dyli_elems", f);
                g.data("dyli_jsonopt", h);
                g.data("dyli_opt", e);
                if (e.interval > 0) {
                    g.data("dyli_to", setTimeout(function() {
                        b.jsonrpc(h)
                    }, e.interval))
                }
            })
        },
        refresh: function() {
            if (b(this).data("dyli_jsonopt")) {
                clearTimeout(b(this).data("dyli_to"));
                b.jsonrpc(b(this).data("dyli_jsonopt"))
            }
            return b(this)
        },
        interval: function(c) {
            var d = b(this).data("dyli_opt");
            clearTimeout(b(this).data("dyli_to"));
            if (c && c > 0) {
                b(this).data("dyli_to", setTimeout(function() {
                    b.jsonrpc(d.jsonopt)
                }, c))
            } else {
                b(this).data("dyli_to", undefined)
            }
            d.interval = c;
            b(this).data("dyli_opt", d);
            return b(this)
        }
    };
    b.fn.dynamiclist = function(c) {
        if (a[c]) {
            return a[c].apply(this, Array.prototype.slice.call(arguments, 1))
        }
        if (typeof c === "object" || !c) {
            return a.init.apply(this, arguments)
        }
        b.error("Method " + c + " does not exist on jQuery.dynamiclist");
        return undefined
    }
})(jQuery);
var Base = function() {};
Base.extend = function(b, e) {
    var f = Base.prototype.extend;
    Base._prototyping = true;
    var d = new this;
    f.call(d, b);
    d.base = function() {};
    delete Base._prototyping;
    var c = d.constructor;
    var a = d.constructor = function() {
            if (!Base._prototyping) {
                if (this._constructing || this.constructor == a) {
                    this._constructing = true;
                    c.apply(this, arguments);
                    delete this._constructing
                } else {
                    if (arguments[0] != null) {
                        return (arguments[0].extend || f).call(arguments[0], d)
                    }
                }
            }
        };
    a.ancestor = this;
    a.extend = this.extend;
    a.forEach = this.forEach;
    a.implement = this.implement;
    a.prototype = d;
    a.toString = this.toString;
    a.valueOf = function(g) {
        return (g == "object") ? a : c.valueOf()
    };
    f.call(a, e);
    if (typeof a.init == "function") {
        a.init()
    }
    return a
};
Base.prototype = {
    extend: function(b, h) {
        if (arguments.length > 1) {
            var e = this[b];
            if (e && (typeof h == "function") && (!e.valueOf || e.valueOf() != h.valueOf()) && /\bbase\b/.test(h)) {
                var a = h.valueOf();
                h = function() {
                    var k = this.base || Base.prototype.base;
                    this.base = e;
                    var i = a.apply(this, arguments);
                    this.base = k;
                    return i
                };
                h.valueOf = function(i) {
                    return (i == "object") ? h : a
                };
                h.toString = Base.toString
            }
            this[b] = h
        } else {
            if (b) {
                var g = Base.prototype.extend;
                if (!Base._prototyping && typeof this != "function") {
                    g = this.extend || g
                }
                var d = {
                    toSource: null
                };
                var f = ["constructor", "toString", "valueOf"];
                var c = Base._prototyping ? 0 : 1;
                while ((j = f[c++])) {
                    if (b[j] != d[j]) {
                        g.call(this, j, b[j])
                    }
                }
                for (var j in b) {
                    if (!d[j]) {
                        g.call(this, j, b[j])
                    }
                }
            }
        }
        return this
    }
};
Base = Base.extend({
    constructor: function() {
        this.extend(arguments[0])
    }
}, {
    ancestor: Object,
    version: "1.1",
    forEach: function(a, d, c) {
        for (var b in a) {
            if (this.prototype[b] === undefined) {
                d.call(c, a[b], b, a)
            }
        }
    },
    implement: function() {
        for (var a = 0; a < arguments.length; a++) {
            if (typeof arguments[a] == "function") {
                arguments[a](this.prototype)
            } else {
                this.prototype.extend(arguments[a])
            }
        }
        return this
    },
    toString: function() {
        return String(this.valueOf())
    }
});
var SBarBase = Base.extend({
    constructor: function() {
        this._duration_error = 7000;
        this._duration_text = 4000;
        this._errmsg = {}
    },
    show: function(f, a, d) {
        var b = this;
        var c = $('<p class="container ' + a + '">' + ejs.esc(f) + "</p>");
        $("#sbar").empty().append(c);
        $("#sbar").animate({
            bottom: "-2px"
        });
        if (this._to) {
            clearTimeout(this._to)
        }
        this._to = setTimeout(function() {
            b.hide()
        }, d)
    },
    hide: function() {
        $("#sbar").animate({
            bottom: "-40px"
        });
        if (this._to) {
            clearTimeout(this._to);
            this._to = undefined
        }
    },
    error: function(b, c) {
        var a = this;
        if (b) {
            c = this._errmsg[b]
        }
        if (!c) {
            c = "Erreur interne, l'opération a échoué."
        }
        this.show(c, "error", this._duration_error)
    },
    text: function(a) {
        this.show(a, "text", this._duration_text)
    }
});
$(document).ready(function() {});
