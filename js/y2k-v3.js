/* resume-y2k-v3 · 逐页虹彩流动：随当前栏目切换全局流动色 --sec-flow-a/b
   背景薄雾（body::after）与过渡由 css 的 @property 平滑接管。 */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAP = {
    hero:           ['#00E5FF', '#FF3DCB'],
    about:          ['#9B6BFF', '#00E5FF'],
    capability:     ['#FF3DCB', '#B8FF3C'],
    'stage-anker':  ['#00E5FF', '#B8FF3C'],
    'stage-kuaishou': ['#FF3DCB', '#9B6BFF'],
    'stage-bgy':    ['#B8FF3C', '#00E5FF'],
    'stage-project': ['#9B6BFF', '#FF3DCB'],
    photography:    ['#00E5FF', '#9B6BFF'],
    interests:      ['#FFB020', '#FF3DCB'],
    honors:         ['#00E5FF', '#B8FF3C'],
    contact:        ['#FF3DCB', '#9B6BFF'],
    works:          ['#00E5FF', '#FF3DCB']
  };
  function setFlow(id) {
    var p = MAP[id];
    if (!p) return;
    root.style.setProperty('--sec-flow-a', p[0]);
    root.style.setProperty('--sec-flow-b', p[1]);
  }
  var ids = ['hero', 'about', 'capability', 'stage-anker', 'stage-kuaishou',
             'stage-bgy', 'stage-project', 'photography', 'interests', 'honors', 'contact', 'works'];
  var secs = ids.map(function (i) { return document.getElementById(i); }).filter(Boolean);
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setFlow(e.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    secs.forEach(function (s) { io.observe(s); });
  } else if (secs.length) {
    setFlow(secs[0].id);
  }
})();
