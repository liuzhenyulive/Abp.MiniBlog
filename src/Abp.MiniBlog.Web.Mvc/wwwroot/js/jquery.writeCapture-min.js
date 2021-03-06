(function(E, a) {
    var j = a.document;

    function A(Q) {
        var Z = j.createElement("div");
        j.body.insertBefore(Z, null);
        E.replaceWith(Z, '<script type="text/javascript">' + Q + "<\/script>")
    }
    E = E || (function(Q) {
        return {
            ajax: Q.ajax,
            $: function(Z) {
                return Q(Z)[0]
            },
            replaceWith: function(Z, ad) {
                var ac = Q(Z)[0];
                var ab = ac.nextSibling,
                    aa = ac.parentNode;
                Q(ac).remove();
                if (ab) {
                    Q(ab).before(ad)
                } else {
                    Q(aa).append(ad)
                }
            },
            onLoad: function(Z) {
                Q(Z)
            },
            copyAttrs: function(af, ab) {
                var ad = Q(ab),
                    aa = af.attributes;
                for (var ac = 0, Z = aa.length; ac < Z; ac++) {
                    if (aa[ac] && aa[ac].value) {
                        try {
                            ad.attr(aa[ac].name, aa[ac].value)
                        } catch (ae) {}
                    }
                }
            }
        }
    })(a.jQuery);
    E.copyAttrs = E.copyAttrs || function() {};
    E.onLoad = E.onLoad || function() {
        throw "error: autoAsync cannot be used without jQuery or defining writeCaptureSupport.onLoad"
    };

    function P(ab, aa) {
        for (var Z = 0, Q = ab.length; Z < Q; Z++) {
            if (aa(ab[Z]) === false) {
                return
            }
        }
    }

    function v(Q) {
        return Object.prototype.toString.call(Q) === "[object Function]"
    }

    function p(Q) {
        return Object.prototype.toString.call(Q) === "[object String]"
    }

    function u(aa, Z, Q) {
        return Array.prototype.slice.call(aa, Z || 0, Q || aa && aa.length)
    }

    function D(ab, aa) {
        var Q = false;
        P(ab, Z);

        function Z(ac) {
            return !(Q = aa(ac))
        }
        return Q
    }

    function L(Q) {
        this._queue = [];
        this._children = [];
        this._parent = Q;
        if (Q) {
            Q._addChild(this)
        }
    }
    L.prototype = {
        _addChild: function(Q) {
            this._children.push(Q)
        },
        push: function(Q) {
            this._queue.push(Q);
            this._bubble("_doRun")
        },
        pause: function() {
            this._bubble("_doPause")
        },
        resume: function() {
            this._bubble("_doResume")
        },
        _bubble: function(Z) {
            var Q = this;
            while (!Q[Z]) {
                Q = Q._parent
            }
            return Q[Z]()
        },
        _next: function() {
            if (D(this._children, Q)) {
                return true
            }

            function Q(aa) {
                return aa._next()
            }
            var Z = this._queue.shift();
            if (Z) {
                Z()
            }
            return !!Z
        }
    };

    function i(Q) {
        if (Q) {
            return new L(Q)
        }
        L.call(this);
        this.paused = 0
    }
    i.prototype = (function() {
        function Q() {}
        Q.prototype = L.prototype;
        return new Q()
    })();
    i.prototype._doRun = function() {
        if (!this.running) {
            this.running = true;
            try {
                while (this.paused < 1 && this._next()) {}
            } finally {
                this.running = false
            }
        }
    };
    i.prototype._doPause = function() {
        this.paused++
    };
    i.prototype._doResume = function() {
        this.paused--;
        this._doRun()
    };

    function M() {}
    M.prototype = {
        _html: "",
        open: function() {
            this._opened = true;
            if (this._delegate) {
                this._delegate.open()
            }
        },
        write: function(Q) {
            if (this._closed) {
                return
            }
            this._written = true;
            if (this._delegate) {
                this._delegate.write(Q)
            } else {
                this._html += Q
            }
        },
        writeln: function(Q) {
            this.write(Q + "\n")
        },
        close: function() {
            this._closed = true;
            if (this._delegate) {
                this._delegate.close()
            }
        },
        copyTo: function(Q) {
            this._delegate = Q;
            Q.foobar = true;
            if (this._opened) {
                Q.open()
            }
            if (this._written) {
                Q.write(this._html)
            }
            if (this._closed) {
                Q.close()
            }
        }
    };
    var e = (function() {
        var Q = {
            f: j.getElementById
        };
        try {
            Q.f.call(j, "abc");
            return true
        } catch (Z) {
            return false
        }
    })();

    function I(Q) {
        P(Q, function(Z) {
            var aa = j.getElementById(Z.id);
            if (!aa) {
                l("<proxyGetElementById - finish>", "no element in writen markup with id " + Z.id);
                return
            }
            P(Z.el.childNodes, function(ab) {
                aa.appendChild(ab)
            });
            if (aa.contentWindow) {
                a.setTimeout(function() {
                    Z.el.contentWindow.document.copyTo(aa.contentWindow.document)
                }, 1)
            }
            E.copyAttrs(Z.el, aa)
        })
    }

    function s(Z, Q) {
        if (Q && Q[Z] === false) {
            return false
        }
        return Q && Q[Z] || o[Z]
    }

    function x(Z, ai) {
        var ae = [],
            ad = s("proxyGetElementById", ai),
            ag = s("writeOnGetElementById", ai),
            Q = {
                write: j.write,
                writeln: j.writeln,
                finish: function() {},
                out: ""
            };
        Z.state = Q;
        j.write = ah;
        j.writeln = aa;
        if (ad || ag) {
            Q.getEl = j.getElementById;
            j.getElementById = ab;
            if (ag) {
                findEl = af
            } else {
                findEl = ac;
                Q.finish = function() {
                    I(ae)
                }
            }
        }

        function ah(aj) {
            Q.out += aj
        }

        function aa(aj) {
            Q.out += aj + "\n"
        }

        function ac(ak) {
            var aj = j.createElement("div");
            ae.push({
                id: ak,
                el: aj
            });
            aj.contentWindow = {
                document: new M()
            };
            return aj
        }

        function af(al) {
            var aj = E.$(Z.target);
            var ak = j.createElement("div");
            aj.parentNode.insertBefore(ak, aj);
            E.replaceWith(ak, Q.out);
            Q.out = "";
            return e ? Q.getEl.call(j, al) : Q.getEl(al)
        }

        function ab(ak) {
            var aj = e ? Q.getEl.call(j, ak) : Q.getEl(ak);
            return aj || findEl(ak)
        }
        return Q
    }

    function V(Q) {
        j.write = Q.write;
        j.writeln = Q.writeln;
        if (Q.getEl) {
            j.getElementById = Q.getEl
        }
        return Q.out
    }

    function N(Q) {
        return Q && Q.replace(/^\s*<!(\[CDATA\[|--)/, "").replace(/(\]\]|--)>\s*$/, "")
    }

    function b() {}

    function d(Z, Q) {
        console.error("Error", Q, "executing code:", Z)
    }
    var l = v(a.console && console.error) ? d : b;

    function S(aa, Z, Q) {
        var ab = x(Z, Q);
        try {
            A(N(aa))
        } catch (ac) {
            l(aa, ac)
        } finally {
            V(ab)
        }
        return ab
    }

    function O(Z) {
        var Q = /^(\w+:)?\/\/([^\/?#]+)/.exec(Z);
        return Q && (Q[1] && Q[1] != location.protocol || Q[2] != location.host)
    }

    function T(Q) {
        return new RegExp(Q + "=(?:([\"'])([\\s\\S]*?)\\1|([^\\s>]+))", "i")
    }

    function k(Q) {
        var Z = T(Q);
        return function(aa) {
            var ab = Z.exec(aa) || [];
            return ab[2] || ab[3]
        }
    }
    var r = /(<script[\s\S]*?>)([\s\S]*?)<\/script>/ig,
        n = T("src"),
        X = k("src"),
        q = k("type"),
        Y = k("language"),
        C = "__document_write_ajax_callbacks__",
        B = "__document_write_ajax_div-",
        g = "window['" + C + "']['%d']();",
        m = a[C] = {},
        w = '<script type="text/javascript">' + g + "<\/script>",
        H = 0;

    function c() {
        return (++H).toString()
    }

    function G(Z, aa) {
        var Q;
        if (v(Z)) {
            Q = Z;
            Z = null
        }
        Z = Z || {};
        Q = Q || Z && Z.done;
        Z.done = aa ? function() {
            aa(Q)
        } : Q;
        return Z
    }
    var z = new i();
    var y = [];
    var f = window._debugWriteCapture ? function() {} : function(Q, aa, Z) {
        y.push({
            type: Q,
            src: aa,
            data: Z
        })
    };
    var K = window._debugWriteCapture ? function() {} : function() {
        y.push(arguments)
    };

    function W(Q) {
        var Z = c();
        m[Z] = function() {
            Q();
            delete m[Z]
        };
        return Z
    }

    function J(Q) {
        return w.replace(/%d/, W(Q))
    }

    function R(ac, ag, aa, ae) {
        var ad = aa && new i(aa) || z;
        ag = G(ag);
        var ab = s("done", ag);
        var Q = "";
        var Z = s("fixUrls", ag);
        if (!v(Z)) {
            Z = function(ah) {
                return ah
            }
        }
        if (v(ab)) {
            Q = J(function() {
                ad.push(ab)
            })
        }
        return ac.replace(r, af) + Q;

        function af(aj, av, ai) {
            var an = X(av),
                am = q(av) || "",
                aB = Y(av) || "",
                aA = (!am && !aB) || am.toLowerCase().indexOf("javascript") !== -1 || aB.toLowerCase().indexOf("javascript") !== -1;
            f("replace", an, aj);
            if (!aA) {
                return aj
            }
            var aw = W(ap),
                ao = B + aw,
                au, al = {
                    target: "#" + ao,
                    parent: ae
                };

            function ap() {
                ad.push(au)
            }
            if (an) {
                an = Z(an);
                av = av.replace(n, "");
                if (O(an)) {
                    au = az
                } else {
                    if (s("asyncAll", ag)) {
                        au = ay()
                    } else {
                        au = at
                    }
                }
            } else {
                au = ax
            }

            function ax() {
                ah(ai)
            }

            function at() {
                E.ajax({
                    url: an,
                    type: "GET",
                    dataType: "text",
                    async: false,
                    success: function(aC) {
                        ah(aC)
                    }
                })
            }

            function ak(aE, aC, aD) {
                l("<XHR for " + an + ">", aD);
                ad.resume()
            }

            function aq() {
                return J(function() {
                    ad.resume()
                })
            }

            function ay() {
                var aE, aD;

                function aC(aG, aF) {
                    if (!aE) {
                        aD = aG;
                        return
                    }
                    try {
                        ah(aG, aq())
                    } catch (aH) {
                        l(aG, aH)
                    }
                }
                E.ajax({
                    url: an,
                    type: "GET",
                    dataType: "text",
                    async: true,
                    success: aC,
                    error: ak
                });
                return function() {
                    aE = true;
                    if (aD) {
                        ah(aD)
                    } else {
                        ad.pause()
                    }
                }
            }

            function az(aC) {
                var aE = x(al, ag);
                ad.pause();
                f("pause", an);
                E.ajax({
                    url: an,
                    type: "GET",
                    dataType: "script",
                    success: aD,
                    error: ak
                });

                function aD(aH, aG, aF) {
                    f("out", an, aE.out);
                    ar(V(aE), J(aE.finish) + aq());
                    f("resume", an)
                }
            }

            function ah(aD, aC) {
                var aE = S(aD, al, ag);
                aC = J(aE.finish) + (aC || "");
                ar(aE.out, aC)
            }

            function ar(aD, aC) {
                E.replaceWith(al.target, R(aD, null, ad, al) + (aC || ""))
            }
            return '<div style="display: none" id="' + ao + '"></div>' + av + g.replace(/%d/, aw) + "<\/script>"
        }
    }

    function F(Z, aa) {
        var Q = z;
        P(Z, function(ab) {
            Q.push(ac);

            function ac() {
                ab.action(R(ab.html, ab.options, Q), ab)
            }
        });
        if (aa) {
            Q.push(aa)
        }
    }

    function U(Q) {
        var Z = Q;
        while (Z && Z.nodeType === 1) {
            Q = Z;
            Z = Z.lastChild;
            while (Z && Z.nodeType !== 1) {
                Z = Z.previousSibling
            }
        }
        return Q
    }

    function h(Q) {
        var aa = j.write,
            ad = j.writeln,
            Z, ab = [];
        j.writeln = function(ae) {
            j.write(ae + "\n")
        };
        var ac;
        j.write = function(af) {
            var ae = U(j.body);
            if (ae !== Z) {
                Z = ae;
                ab.push(ac = {
                    el: ae,
                    out: []
                })
            }
            ac.out.push(af)
        };
        E.onLoad(function() {
            var ah, ak, af, aj, ai;
            Q = G(Q);
            ai = Q.done;
            Q.done = function() {
                j.write = aa;
                j.writeln = ad;
                if (ai) {
                    ai()
                }
            };
            for (var ag = 0, ae = ab.length; ag < ae; ag++) {
                ah = ab[ag].el;
                ak = j.createElement("div");
                ah.parentNode.insertBefore(ak, ah.nextSibling);
                af = ab[ag].out.join("");
                aj = ae - ag === 1 ? R(af, Q) : R(af);
                E.replaceWith(ak, aj)
            }
        })
    }
    var t = "writeCapture";
    var o = a[t] = {
        _original: a[t],
        fixUrls: function(Q) {
            return Q.replace(/&amp;/g, "&")
        },
        noConflict: function() {
            a[t] = this._original;
            return this
        },
        debug: y,
        proxyGetElementById: false,
        _forTest: {
            Q: i,
            GLOBAL_Q: z,
            $: E,
            matchAttr: k,
            slice: u,
            capture: x,
            uncapture: V,
            captureWrite: S
        },
        replaceWith: function(Q, aa, Z) {
            E.replaceWith(Q, R(aa, Z))
        },
        html: function(Q, ab, Z) {
            var aa = E.$(Q);
            aa.innerHTML = "<span/>";
            E.replaceWith(aa.firstChild, R(ab, Z))
        },
        load: function(Q, aa, Z) {
            E.ajax({
                url: aa,
                dataType: "text",
                type: "GET",
                success: function(ab) {
                    o.html(Q, ab, Z)
                }
            })
        },
        autoAsync: h,
        sanitize: R,
        sanitizeSerial: F
    }
})(this.writeCaptureSupport, this);
(function(g, d, n) {
    var c = {
        html: h
    };
    g.each(["append", "prepend", "after", "before", "wrap", "wrapAll", "replaceWith", "wrapInner"], function() {
        c[this] = i(this)
    });

    function a(q) {
        return Object.prototype.toString.call(q) == "[object String]"
    }

    function p(u, t, s, r) {
        if (arguments.length == 0) {
            return o.call(this)
        }
        var q = c[u];
        if (u == "load") {
            return l.call(this, t, s, r)
        }
        if (!q) {
            j(u)
        }
        return b.call(this, t, s, q)
    }
    g.fn.writeCapture = p;
    var k = "__writeCaptureJsProxied-fghebd__";

    function o() {
        if (this[k]) {
            return this
        }
        var r = this;

        function q() {
            var t = this,
                s = false;
            this[k] = true;
            g.each(c, function(v) {
                var u = r[v];
                if (!u) {
                    return
                }
                t[v] = function(y, x, w) {
                    if (!s && a(y)) {
                        try {
                            s = true;
                            return p.call(t, v, y, x, w)
                        } finally {
                            s = false
                        }
                    }
                    return u.apply(t, arguments)
                }
            });
            this.pushStack = function() {
                return o.call(r.pushStack.apply(t, arguments))
            };
            this.endCapture = function() {
                return r
            }
        }
        q.prototype = r;
        return new q()
    }

    function b(t, s, u) {
        var q, r = this;
        if (s && s.done) {
            q = s.done;
            delete s.done
        } else {
            if (g.isFunction(s)) {
                q = s;
                s = null
            }
        }
        d.sanitizeSerial(g.map(this, function(v) {
            return {
                html: t,
                options: s,
                action: function(w) {
                    u.call(v, w)
                }
            }
        }), q && function() {
            q.call(r)
        } || q);
        return this
    }

    function h(q) {
        g(this).html(q)
    }

    function i(q) {
        return function(r) {
            g(this)[q](r)
        }
    }

    function l(t, s, v) {
        var r = this,
            q, u = t.indexOf(" ");
        if (u >= 0) {
            q = t.slice(u, t.length);
            t = t.slice(0, u)
        }
        if (g.isFunction(v)) {
            s = s || {};
            s.done = v
        }
        return g.ajax({
            url: t,
            type: s && s.type || "GET",
            dataType: "html",
            data: s && s.params,
            complete: f(r, s, q)
        })
    }

    function f(r, s, q) {
        return function(u, t) {
            if (t == "success" || t == "notmodified") {
                var v = m(u.responseText, q);
                b.call(r, v, s, h)
            }
        }
    }
    var e = /jquery-writeCapture-script-placeholder-(\d+)-wc/g;

    function m(s, r) {
        if (!r || !s) {
            return s
        }
        var t = 0,
            q = {};
        return g("<div/>").append(s.replace(/<script(.|\s)*?\/script>/g, function(u) {
            q[t] = u;
            return "jquery-writeCapture-script-placeholder-" + (t++) + "-wc"
        })).find(r).html().replace(e, function(u, v) {
            return q[v]
        })
    }

    function j(q) {
        throw "invalid method parameter " + q
    }
    g.writeCapture = d
})(jQuery, writeCapture.noConflict());