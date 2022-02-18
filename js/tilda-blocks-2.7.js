/**
 * Инициализация анимации
 * @param {node} recid - идентификатор блока
 */
 function t826_init(recid) {
  var el = document.querySelector('#rec' + recid);
  t826_startAnimation(recid);
  if (!window.isMobile) {
    window.addEventListener(
      'resize',
      t_throttle(function () {
        var el = document.querySelector('div:not(.t826__animation) > div[data-galaxy-id="' + recid + '"]');
        if (el) {
          if (el.parentNode !== null) {
            el.parentNode.removeChild(el);
          }
        }
        t826_startAnimation(recid);
      })
    );
  }
  if (window.isMobile) {
    window.addEventListener('orientationchange', function () {
      var el = document.querySelector('div:not(.t826__animation) > div[data-galaxy-id="' + recid + '"]');
      if (el) {
        if (el.parentNode !== null) {
          el.parentNode.removeChild(el);
        }
      }
      t826_startAnimation(recid);
    });
  }
  el.querySelector('.t826').addEventListener('displayChanged', function () {
    var el = document.querySelector('div:not(.t826__animation) > div[data-galaxy-id="' + recid + '"]');
    if (el) {
      if (el.parentNode !== null) {
        el.parentNode.removeChild(el);
      }
    }
    t826_startAnimation(recid);
  });
}

/**
* Старт анимации
* @param {node} recid - идентификатор блока
* исполльзуется в других фунцкиях
*/
function t826_startAnimation(recid) {
  var el = document.querySelector('#rec' + recid);
  var GalaxyEl = el.querySelector('.t826__galaxy');
  var wr = el.querySelector('.t826');
  var recs = wr.getAttribute('data-galaxy-rec-ids');
  var wholepage = wr.getAttribute('data-galaxy-whole-page');
  var vertFlip = wr.getAttribute('data-galaxy-vflip');
  var color = wr.getAttribute('data-element-color');
  var opacity = wr.getAttribute('data-element-opacity');
  var options = { color: !color ? '#fff' : color, opacity: !opacity ? 1 : opacity.replace(/^0?.([0-9])0?$/g, '.$1') };
  if (options.color.indexOf('#') !== -1) {
    var color = options.color;
    if (color[1] === color[2] && color[3] === color[4] && color[5] === color[6]) {
      options.color = '#' + color[1] + color[3] + color[5];
    }
  }
  if (vertFlip === 'yes') {
    GalaxyEl.classList.add('t826__galaxy_flip');
  }
  if (document.querySelector('#allrecords').getAttribute('data-tilda-mode') === 'edit') {
    t826_addAnimation(el.querySelector('.t826__demo'), GalaxyEl, options);
    return;
  }
  if (typeof recs !== 'undefined' && recs !== null) {
    recs = recs.split(',');
    Array.prototype.forEach.call(recs, function (rec) {
      var curRec = document.querySelector('#rec' + rec);
      var curGalaxyEl = GalaxyEl.cloneNode(true);
      curGalaxyEl.style.position = 'absolute';
      t826_addAnimation(curRec, curGalaxyEl, options);
    });
  } else {
    var nextBlock = el.nextElementSibling;
    var prevBlock = el.previousElementSibling;
    var curGalaxyEl = GalaxyEl.cloneNode(true);
    curGalaxyEl.style.position = 'absolute';
    if (nextBlock !== null) {
      t826_addAnimation(nextBlock, curGalaxyEl, options);
    } else if (prevBlock !== null) {
      t826_addAnimation(prevBlock, curGalaxyEl, options);
    }
  }
  if (wholepage === 'yes') {
    el.querySelector('.t826__animation').style.display = 'block';
    GalaxyEl.style.position = 'fixed';
    t826_addAnimation(document.querySelector('#allrecords'), GalaxyEl, options);
  }
}

/**
* Создать анимацию
* @param {node} recid - идентификатор блока
* исполльзуется в других фунцкиях
*/
function t826_addAnimation(curRec, GalaxyEl, options) {
  curRec.setAttribute('data-animationappear', 'off')
  curRec.classList.remove('r_hidden');
  var curRecType = curRec.getAttribute('data-record-type');
  var curRecId = curRec.getAttribute('id');
  if (curRecType === '396') {
    curRec.querySelector('.t396__filter').after(GalaxyEl);
    GalaxyEl.style.zIndex = '0';
  } else if (curRecId === 'allrecords') {
    GalaxyEl.style.zIndex = '-1';
  } else {
    var coverWrapper = curRec.querySelector('.t-cover');
    var coverWrapperFilter = coverWrapper.querySelector('.t-cover__filter');
    if (coverWrapperFilter) {
      coverWrapperFilter.after(GalaxyEl);
      GalaxyEl.style.zIndex = '0';
    } else {
      var wrapper = curRec;
      if (wrapper.length === 0) {
        return !0;
      }
      coverWrapper.appendChild(GalaxyEl);
      wrapper.style.position = 'relative';
      wrapper.children[0].style.position = 'relative';
      wrapper.children[0].style.zIndex = '1';
      if (curRecType == '734' || curRecType == '675' || curRecType == '215') {
        return;
      }
      var excludesBlocks = [754, 776, 778, 786, 770];
      if (excludesBlocks.indexOf(parseInt(curRecType, 10)) !== -1) {
          wrapper.children[0].style.zIndex = '';
        GalaxyEl.style.zIndex = '-1';
      } else {
        GalaxyEl.style.zIndex = '0';
      }
    }
  }
  t826_runningAnimation(curRec, options);
}

/**
* Запуск анимации
* @param {node} curRec - текущий блок
* @param {object} options - опции (color, opacity)
* исполльзуется в других фунцкиях
*/
function t826_runningAnimation(curRec, options) {
  var starsSetting;
  if (window.isMobile) {
    starsSetting = [
      { name: 'near', count: 25, speed: 50 },
      { name: 'mid', count: 50, speed: 100 },
      { name: 'far', count: 175, speed: 150 },
    ];
  } else {
    starsSetting = [
      { name: 'near', count: 100, speed: 50 },
      { name: 'mid', count: 200, speed: 100 },
      { name: 'far', count: 700, speed: 150 },
    ];
  }
  var curRecId = curRec.getAttribute('id');
  var maxHeight = curRec.offsetHeight;
  var maxWidth = curRec.offsetWidth;
  if (typeof curRecId === 'undefined') {
    curRecId = 'demo';
  } else if (curRecId === 'allrecords') {
    maxHeight = window.document.documentElement.clientHeight;
    maxWidth = window.document.documentElement.clientWidth;
  }
  var animationName = 't826__galaxy-' + curRecId;
  var curRecAnimName = curRec.querySelector('#' + animationName);
  if (curRecAnimName) {
    if (curRecAnimName.parentNode !== null) {
      curRecAnimName.parentNode.removeChild(curRecAnimName);
    }
  }
  var newStyle = document.createElement('style');
  newStyle.id = animationName;
  newStyle.innerHTML = '@keyframes ' + animationName + '{' + 'to{' + 'transform:translateY(' + -maxHeight + 'px)' + '}' + '}';
  Array.prototype.forEach.call(starsSetting, function (value, index, array) {
    var x = Math.round(Math.random() * maxHeight);
    var y = Math.round(Math.random() * maxWidth);
    var dot = '';
    if (options.color.indexOf('#') !== -1) {
      dot = x + 'px ' + y + 'px';
    } else {
      if (options.opacity < 1) {
        dot = x + 'px ' + y + 'px rgba(' + options.color + ',' + options.opacity + ')';
      } else {
        dot = x + 'px ' + y + 'px rgb(' + options.color + ')';
      }
    }
    var countDots = Math.round((array[index].count * maxHeight) / 2000);
    for (var i = 0; i < countDots; i++) {
      var x = Math.round(Math.random() * maxWidth);
      var y = Math.round(Math.random() * maxHeight);
      if (options.color.indexOf('#') !== -1) {
        dot += ', ' + x + 'px ' + y + 'px';
        dot += ', ' + x + 'px ' + (y + maxHeight) + 'px';
      } else {
        if (options.opacity < 1) {
          dot += ', ' + x + 'px ' + y + 'px rgba(' + options.color + ',' + options.opacity + ')';
          dot += ', ' + x + 'px ' + (y + maxHeight) + 'px rgba(' + options.color + ',' + options.opacity + ')';
        } else {
          dot += ', ' + x + 'px ' + y + 'px rgb(' + options.color + ')';
          dot += ', ' + x + 'px ' + (y + maxHeight) + 'px rgb(' + options.color + ')';
        }
      }
    }
    var animationDuration = Math.round((array[index].speed * maxHeight) / 2000);
    className = 't826__galaxy-' + array[index].name + '-' + curRecId;
    newStyle.innerHTML +=
      '.' +
      className +
      ':after, .' +
      className +
      '{' +
      'box-shadow:' +
      dot +
      ';' +
      'animation-duration:' +
      animationDuration +
      's;' +
      'animation-name:' +
      animationName +
      ';' +
      (options.color.indexOf('#') !== -1 ? 'color:' + options.color + ';' : '') +
      (options.color.indexOf('#') !== -1 && options.opacity < 1 ? 'opacity:' + options.opacity : '') +
      '}' +
      '.' +
      className +
      ':after{' +
      "content:' ';" +
      'position:absolute;' +
      'top:' +
      maxHeight +
      'px' +
      '}';
    var galaxyArray = curRec.querySelector('.t826__galaxy > .t826__galaxy-wrapper > .t826__galaxy-' + array[index].name);
    if (galaxyArray) {
      galaxyArray.classList.add(className);
    }
  });
  curRec.insertBefore(newStyle, parent.firstChild);
  var galaxyFading = curRec.querySelector('.t826__galaxy > .t826__galaxy-wrapper');
  if (galaxyFading) {
    galaxyFading.style.animationName = 't826__galaxy-fadeIn';
  }
}
