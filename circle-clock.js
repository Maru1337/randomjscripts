// example of use //
// renderclock(document.getElementById('canvas'));

var renderclock = function () {
  function o            (x)            { return Math.PI   * (x - .5); }
  function angle        (val,incircle) { return val * 2.0 / incircle; }
  function framespersec (x)            { return 1000.0    / x       ; }

  function lawnch (fn,fps) { setInterval(fn,framespersec(fps)); }

  function Render(x,y,clockradius,canvas,ctxsettings) {
    var ctx = canvas.getContext('2d');

    return {
      clr: function () {
        ctx.shadowBlur = 0;
        ctx.fillStyle = ctxsettings.fillStyle;
        ctx.fillRect(x,y,canvas.width,canvas.height);
      },

      drawarc: function (angle,radius) {
        [ 'shadowBlur'
        , 'shadowColor'
        , 'lineWidth'
        , 'lineCap'
        , 'strokeStyle'
        ].forEach(function (k) { ctx[k] = ctxsettings[k]; });
        ctx.beginPath();
        ctx.arc(x + clockradius,y + clockradius,radius,o(.0),o(angle));
        ctx.stroke();
      },

      drawtxt: function (txt,height) {
        ctx.fillStyle = ctxsettings.strokeStyle;
        ctx.font = ctxsettings.font;
        ctx.fillText(txt, x + clockradius - ctx.measureText(txt).width / 2
                        , y + clockradius + height / 4);
      }
    }
  }

  var state = function() {
    function time() {
      var dte = new Date(),
          s   = dte.getSeconds() + dte.getMilliseconds() / 1000.0,
          m   = dte.getMinutes() + s                     / 60.0,
          h   = dte.getHours  () + m                     / 60.0;

      function tostr(x) {
        var strx = x.toString().slice(0,2);
        return strx.charAt(1) === '.' ? '0' + strx.slice(0,1) : strx;
      }

      return {
        h: h, m: m, s: s,
        n: tostr(h) + ':' + tostr(m) + ':' + tostr(s)
      };
    }

    return function () {
      var now = time();
      return {
        h: angle(now.h,24.0),
        m: angle(now.m,60.0),
        s: angle(now.s,60.0),
        n: now.n
      }
    }
  }();

  return function (canvas,ctxsettings,fps) {
    var cr = (canvas.height < canvas.width ? canvas.height : canvas.width) / 2,
        fontsize = cr / 5,
        cs = {
          strokeStyle: '#28d1fa',
          lineCap:     'round',
          shadowColor: '#28d1fa',
          fillStyle:   '#000',
          font:        fontsize + 'px monospace'
        };
    for (var s in ctxsettings) cs[s] = ctxsettings[s];
    cs['lineWidth' ] = cs.lineWidth  || cr / 10;
    cs['shadowBlur'] = cs.shadowBlur || cs.lineWidth;
    var R  = Render(0,0,cr,canvas,cs),
        hr = cr - cs.shadowBlur - 6,
        mr = hr - cs.lineWidth - cs.shadowBlur / 2,
        sr = mr - cs.lineWidth - cs.shadowBlur / 2,
        radiuses = { h: hr, m: mr, s: sr };

    lawnch(function () {
      R.clr();
      var s = state();
      ['h','m','s'].forEach(function (i) { R.drawarc(s[i],radiuses[i]); });
      R.drawtxt(s.n,fontsize);
    },fps || 15.0);
  }
}();
