// example of usage //
// renderclock(document.getElementById('canvas'));

var renderclock = function () {
  let o            = (x               => Math.PI * (x - .5)),
      angle        = ((val, incircle) => val * 2.0 / incircle),
      framespersec = (x               => 1000.0 / x),
      lawnch       = ((fn, fps)       => setInterval(fn,framespersec(fps)));

  function Render(x,y,clockradius,canvas,ctxsettings) {
    let ctx = canvas.getContext('2d');

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
        ].forEach(k => ctx[k] = ctxsettings[k]);
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
      let dte = new Date(),
          s   = dte.getSeconds() + dte.getMilliseconds() / 1000.0,
          m   = dte.getMinutes() + s                     / 60.0,
          h   = dte.getHours  () + m                     / 60.0;

      function tostr(x) {
        let strx = x.toString().slice(0,2);
        return strx.charAt(1) === '.' ? '0' + strx.slice(0,1) : strx;
      }

      return {
        h,m,s,
        n: tostr(h) + ':' + tostr(m) + ':' + tostr(s)
      };
    }

    return function () {
      let now = time();
      return {
        h: angle(now.h,24.0),
        m: angle(now.m,60.0),
        s: angle(now.s,60.0),
        n: now.n
      }
    }
  }();

  return function (canvas,ctxsettings,fps) {
    let cr = (canvas.height < canvas.width ? canvas.height : canvas.width) / 2,
        fontsize = cr / 5,
        cs = {
          strokeStyle: '#28d1fa',
          lineCap:     'round',
          shadowColor: '#28d1fa',
          fillStyle:   '#000',
          font:        fontsize + 'px monospace',
          lineWidth:   cr / 10,
          shadowBlur:  cr / 10
        };
    for (let sett in ctxsettings) cs[sett] = ctxsettings[sett];

    let R = Render(0,0,cr,canvas,cs),
        h = cr - cs.shadowBlur - 6,
        m = h - cs.lineWidth - cs.shadowBlur / 2,
        s = m - cs.lineWidth - cs.shadowBlur / 2,
        radiuses = { h,m,s };

    lawnch(function () {
      R.clr();
      let s = state();
      ['h','m','s'].forEach(i => R.drawarc(s[i],radiuses[i]));
      R.drawtxt(s.n,fontsize);
    },fps || 15.0);
  }
}();
