(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // <stdin>
  var require_stdin = __commonJS({
    "<stdin>"(exports, module) {
      !function(e, n) {
        "object" == typeof exports && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ? define(["exports"], n) : n(e.quicklink = {});
      }(exports, function(e) {
        function n(e2) {
          return new Promise(function(n2, r2, t2) {
            (t2 = new XMLHttpRequest()).open("GET", e2, t2.withCredentials = true), t2.onload = function() {
              200 === t2.status ? n2() : r2();
            }, t2.send();
          });
        }
        var r, t = (r = document.createElement("link")).relList && r.relList.supports && r.relList.supports("prefetch") ? function(e2) {
          return new Promise(function(n2, r2, t2) {
            (t2 = document.createElement("link")).rel = "prefetch", t2.href = e2, t2.onload = n2, t2.onerror = r2, document.head.appendChild(t2);
          });
        } : n, o = window.requestIdleCallback || function(e2) {
          var n2 = Date.now();
          return setTimeout(function() {
            e2({ didTimeout: false, timeRemaining: function() {
              return Math.max(0, 50 - (Date.now() - n2));
            } });
          }, 1);
        }, i = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), u = false;
        function a(e2) {
          if (e2) {
            if (e2.saveData)
              return new Error("Save-Data is enabled");
            if (/2g/.test(e2.effectiveType))
              return new Error("network conditions are poor");
          }
          return true;
        }
        function s(e2, r2, o2) {
          var s2 = a(navigator.connection);
          return s2 instanceof Error ? Promise.reject(new Error("Cannot prefetch, " + s2.message)) : (c.size > 0 && !u && console.warn("[Warning] You are using both prefetching and prerendering on the same document"), Promise.all([].concat(e2).map(function(e3) {
            if (!i.has(e3))
              return i.add(e3), (r2 ? function(e4) {
                return window.fetch ? fetch(e4, { credentials: "include" }) : n(e4);
              } : t)(new URL(e3, location.href).toString());
          })));
        }
        function f(e2, n2) {
          var r2 = a(navigator.connection);
          if (r2 instanceof Error)
            return Promise.reject(new Error("Cannot prerender, " + r2.message));
          if (!HTMLScriptElement.supports("speculationrules"))
            return s(e2), Promise.reject(new Error("This browser does not support the speculation rules API. Falling back to prefetch."));
          if (document.querySelector('script[type="speculationrules"]'))
            return Promise.reject(new Error("Speculation Rules is already defined and cannot be altered."));
          for (var t2 = 0, o2 = [].concat(e2); t2 < o2.length; t2 += 1) {
            var f2 = o2[t2];
            if (window.location.origin !== new URL(f2, window.location.href).origin)
              return Promise.reject(new Error("Only same origin URLs are allowed: " + f2));
            c.add(f2);
          }
          i.size > 0 && !u && console.warn("[Warning] You are using both prefetching and prerendering on the same document");
          var l = function(e3) {
            var n3 = document.createElement("script");
            n3.type = "speculationrules", n3.text = '{"prerender":[{"source": "list","urls": ["' + Array.from(e3).join('","') + '"]}]}';
            try {
              document.head.appendChild(n3);
            } catch (e4) {
              return e4;
            }
            return true;
          }(c);
          return true === l ? Promise.resolve() : Promise.reject(l);
        }
        e.listen = function(e2) {
          if (e2 || (e2 = {}), window.IntersectionObserver) {
            var n2 = function(e3) {
              e3 = e3 || 1;
              var n3 = [], r3 = 0;
              function t3() {
                r3 < e3 && n3.length > 0 && (n3.shift()(), r3++);
              }
              return [function(e4) {
                n3.push(e4) > 1 || t3();
              }, function() {
                r3--, t3();
              }];
            }(e2.throttle || 1 / 0), r2 = n2[0], t2 = n2[1], a2 = e2.limit || 1 / 0, l = e2.origins || [location.hostname], d = e2.ignores || [], h = e2.delay || 0, p = [], m = e2.timeoutFn || o, w = "function" == typeof e2.hrefFn && e2.hrefFn, g = e2.prerender || false;
            u = e2.prerenderAndPrefetch || false;
            var v = new IntersectionObserver(function(n3) {
              n3.forEach(function(n4) {
                if (n4.isIntersecting)
                  p.push((n4 = n4.target).href), function(e3, n5) {
                    n5 ? setTimeout(e3, n5) : e3();
                  }(function() {
                    -1 !== p.indexOf(n4.href) && (v.unobserve(n4), (u || g) && c.size < 1 ? f(w ? w(n4) : n4.href).catch(function(n5) {
                      if (!e2.onError)
                        throw n5;
                      e2.onError(n5);
                    }) : i.size < a2 && !g && r2(function() {
                      s(w ? w(n4) : n4.href, e2.priority).then(t2).catch(function(n5) {
                        t2(), e2.onError && e2.onError(n5);
                      });
                    }));
                  }, h);
                else {
                  var o2 = p.indexOf((n4 = n4.target).href);
                  o2 > -1 && p.splice(o2);
                }
              });
            }, { threshold: e2.threshold || 0 });
            return m(function() {
              (e2.el || document).querySelectorAll("a").forEach(function(e3) {
                l.length && !l.includes(e3.hostname) || function e4(n3, r3) {
                  return Array.isArray(r3) ? r3.some(function(r4) {
                    return e4(n3, r4);
                  }) : (r3.test || r3).call(r3, n3.href, n3);
                }(e3, d) || v.observe(e3);
              });
            }, { timeout: e2.timeout || 2e3 }), function() {
              i.clear(), v.disconnect();
            };
          }
        }, e.prefetch = s, e.prerender = f;
      });
    }
  });
  require_stdin();
})();
