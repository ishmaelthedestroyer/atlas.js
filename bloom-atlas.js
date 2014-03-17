(function(_BA) {
  'use strict';
  var Atlas, checkCookie, extend, gbi, getAllElementsWithAttribute, gvi, loaded, random, setCookie, uuid, wrapOnload;
  loaded = false;
  wrapOnload = function(fn, context) {
    var combined, current;
    if (loaded) {
      return fn();
    }
    if (window.attachEvent) {
      return window.attachEvent('onload', function() {
        loaded = true;
        if (!context) {
          return fn();
        }
        return fn.call(context);
      });
    } else {
      if (window.onload) {
        current = window.onload;
        combined = function() {
          loaded = true;
          current();
          if (!context) {
            return fn();
          }
          return fn.call(context);
        };
        return window.onload = combined;
      } else {
        return window.onload = function() {
          loaded = true;
          if (!context) {
            return fn();
          }
          return fn.call(context);
        };
      }
    }
  };
  extend = function(one, two) {
    var k, _i, _len, _ref;
    if (!one && !two) {
      return {};
    }
    if (!two || typeof two !== 'object') {
      return one;
    }
    if (!one || typeof one !== 'object') {
      return two;
    }
    _ref = Object.keys(two);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      one[k] = two[k];
    }
    return one;
  };
  getAllElementsWithAttribute = function(attr) {
    var all, el, matching, _i, _len;
    matching = [];
    all = document.getElementsByTagName('*');
    for (_i = 0, _len = all.length; _i < _len; _i++) {
      el = all[_i];
      if (el.getAttribute(attr)) {
        matching.push(el);
      }
    }
    return matching;
  };
  uuid = function() {
    var d;
    d = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r;
      r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : r & 0x7 | 0x8).toString(16);
    });
  };
  random = function(l) {
    var i, list, token;
    l = l || 10;
    token = "";
    list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    i = 0;
    while (i < l) {
      token += list.charAt(Math.floor(Math.random() * list.length));
      i++;
    }
    return token;
  };
  checkCookie = function(name) {
    var end, start, val;
    val = document.cookie;
    start = val.indexOf(" " + name + "=");
    if (start === -1) {
      start = val.indexOf(name + "=");
    }
    if (start === -1) {
      val = null;
    } else {
      start = val.indexOf("=", start) + 1;
      end = val.indexOf(";", start);
      if (end === -1) {
        end = val.length;
      }
      val = unescape(val.substring(start, end));
    }
    return ((val != null) && val !== "null" && val !== "" ? val : null);
  };
  setCookie = function(name, val, minutes) {
    var expires;
    expires = new Date();
    expires.setMinutes(expires.getMinutes() + minutes);
    document.cookie = name + '=' + val + '; expires=' + expires.toUTCString() + '; path=/;';
    return val;
  };
  gbi = function(data) {
    var M, N, r, tem, ua;
    data = data || {};
    N = navigator.appName;
    ua = navigator.userAgent;
    tem = void 0;
    r = /(crios|opera|chrome|safari|firefox|msie|android|iphone|ipad)\/?\s*(\.?\d+(\.\d+)*)/i;
    M = ua.match(r);
    if (M && ((tem = ua.match(/version\/([\.\d]+)/i)) != null)) {
      M[2] = tem[1];
    }
    data.b = M[1];
    data.bv = M[2];
    data.sw = screen.width;
    data.sh = screen.height;
    data.bw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
    data.bh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (r.test(navigator.userAgent)) {
      data.bm = true;
    } else {
      data.bm = false;
    }
    if (navigator.appVersion.indexOf("Win") !== -1) {
      data.os = "Windows";
    } else if (navigator.appVersion.indexOf("iPad") !== -1) {
      data.os = "iOS";
    } else if (navigator.appVersion.indexOf("iPhone") !== -1) {
      data.os = "iOS";
    } else if (navigator.appVersion.indexOf("Android") !== -1) {
      data.os = "Android";
    } else if (navigator.appVersion.indexOf("Mac") !== -1) {
      data.os = "Mac";
    } else if (navigator.appVersion.indexOf("Linux") !== -1) {
      data.os = "Linux";
    } else if (navigator.appVersion.indexOf("X11") !== -1) {
      data.os = "Unix";
    } else {
      data.os = "Unknown";
    }
    return data;
  };
  gvi = function(data) {
    var rf, rh, _t;
    data = data || {};
    _t = new Date();
    data.tl = new Date();
    _t = _t.toString();
    data.tz = (_t.indexOf("(") > -1 ? _t.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join("") : _t.match(/[A-Z]{3,4}/)[0]);
    if (_BA._tz === "GMT" && /(GMT\W*\d{4})/.test(_t)) {
      data.tz = RegExp.$1;
    }
    data.h = window.location.host;
    data.hf = window.location.href;
    rh = document.referrer.split("/")[2];
    if (rh) {
      data.rh = rh;
    }
    rf = document.referrer;
    if (rf) {
      data.rf = rf;
    }
    return data;
  };
  /*
  # translations
  data =
    c: (if typeof params.c isnt 'undefined' then params.c else null) # campaign
    s: (if typeof params.s isnt 'undefined' then params.s else null) # secret
    cs: [] # secondary campaigns
    bz: [] # bloom zones
    be: [] # bloom event listeners
    BIRD: null  # Bloom Internal Referral Data
    vt: null # visitor token (long term)
    st: null # session token (short term)
    it: null # impression token (unique)
    rv: false # returning visitor
    tz: null # time zone
    tl: null # time local
    sw: null # screen width
    sh: null # screen height
    bw: null # browser width
    bh: null # browser height
    b: null # browser
    bv: null # browser version
    bm: false # browser mobile
    os: null # operating system
    h: null # host
    hf: null # host full
    rh: null # referrer host
    rf: null # referrer full
  */

  Atlas = function(params) {
    var e;
    if (!(this instanceof Atlas)) {
      return new Atlas(params);
    }
    this.useBIRD = (typeof params.BIRD !== 'undefined' ? params.BIRD : false);
    this.c = (typeof params.c !== 'undefined' ? params.c : null);
    this.it = null;
    if (!this.c) {
      e = 'Atlas could not instantiate - no campaign specified!';
      throw new Error(e);
    }
    wrapOnload(this.initBells, this);
    this.capture();
    return this;
  };
  Atlas.prototype.reload = function(c) {
    this.c = c || this.c || uuid();
    wrapOnload(this.initBells, this);
    wrapOnload(this.initGazelle, this);
    return this.capture();
  };
  Atlas.prototype.initBells = function() {
    var bell, bells, e, _i, _len, _results,
      _this = this;
    bells = getAllElementsWithAttribute('data-BELL');
    console.log('Got bells.', bells);
    e = 'click';
    _results = [];
    for (_i = 0, _len = bells.length; _i < _len; _i++) {
      bell = bells[_i];
      _results.push((function(bell) {
        var campaign, cb;
        campaign = bell.getAttribute('data-BELL');
        cb = function() {
          console.log('Someone rang the bell.', campaign);
          _this.save({
            c: campaign
          }, 'event');
          return bell.removeEventListener(e, cb);
        };
        bell.addEventListener(e, cb);
        return bell.removeAttribute('data-BELL');
      })(bell));
    }
    return _results;
  };
  Atlas.prototype.initGazelle = function() {
    var p, placeholders, requests, _fn, _i, _len;
    placeholders = getAllElementsWithAttribute('data-GAZELLE');
    requests = [];
    _fn = function(p) {
      var data, e, r;
      data = p.getAttribute('data-GAZELLE');
      try {
        r = JSON.parse(data);
        return requests.push(r);
      } catch (_error) {
        e = _error;
        throw new Error('Error! Badly formatted Gazelle parameters.');
      }
    };
    for (_i = 0, _len = placeholders.length; _i < _len; _i++) {
      p = placeholders[_i];
      _fn(p);
    }
    return console.log('Initialized requests.', requests);
  };
  Atlas.prototype.BIRD = function() {
    var anchors, data, hash, hashes, href, i, useBIRD;
    data = data || {};
    data.BIRD = null;
    useBIRD = this.useBIRD || false;
    hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    i = 0;
    while (i < hashes.length) {
      hash = hashes[i].split("=");
      if (hash[0] === "BIRD") {
        if (useBIRD === false) {
          data.BIRD = hash[1];
          return data;
        } else {
          data.BIRD = hash[1];
          break;
        }
      }
      i++;
    }
    anchors = document.getElementsByTagName('a');
    href = '';
    i = 0;
    while (i < anchors.length) {
      href = anchors[i].getAttribute("href");
      if (href !== "#") {
        href += (href.indexOf("?") !== 0 ? "&" : "?");
        href += "BIRD=" + _BA._c;
        anchors[i].setAttribute("href", href);
      }
      i++;
    }
    console.log('got BIRD.', data.BIRD);
    return data;
  };
  Atlas.prototype.capture = function(data) {
    data = data || {};
    data = extend(data, gbi());
    data = extend(data, gvi());
    data = extend(data, this.BIRD());
    data.it = this.it = uuid();
    data.c = data.c || this.c;
    this.save(data, 'impression');
    return this;
  };
  Atlas.prototype.save = function(data, type) {
    var img, src,
      _this = this;
    data.vt = (function() {
      var val;
      val = checkCookie('_BA_vt');
      if (val && type === 'impression') {
        data.rv = true;
      }
      return val;
    })() || (function() {
      data.rv = false;
      return setCookie('_BA_vt', uuid(), 60 * 24 * 365 * 2);
    })();
    data.st = checkCookie('_BA_st');
    data.st = setCookie('_BA_st', data.st || uuid(), 30);
    data.it = this.it || (function() {
      _this.it = uuid();
      return _this.it;
    });
    type = type || 'meta';
    if (type !== 'impression' && type !== 'event' && type !== 'meta') {
      type = 'meta';
    }
    data.type = type;
    img = new Image();
    src = 'http://localhost:1337/bat.gif?';
    console.log('Sending data.', data);
    src += 'data=' + encodeURIComponent(JSON.stringify(data));
    src += '&';
    src += Date.now();
    img.src = src;
    console.log('Created image src.', src);
    return this;
  };
  return window.Atlas = new Atlas(_BA);
})(window._BA || {});
