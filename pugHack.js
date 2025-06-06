var CMD, bind, main, split;

import pugExtract from './pugExtract.js';

CMD = new Set('if else elif elseif key each await then catch html const debug'.split(' '));

split = (txt) => {
  var i, li, state, t;
  li = [];
  t = [];
  state = 0;
  for (i of txt) {
    if (state === 0) {
      if (i === '"') {
        state = 1;
        t.push(i);
        continue;
      }
      if (i === ' ') {
        li.push(t.join(''));
        t = [];
      } else {
        t.push(i);
      }
    } else if (state === 1) {
      if (i === '"') {
        if (t[t.length - 1] !== '\\') {
          state = 0;
        }
      }
      t.push(i);
    }
  }
  if (t.length) {
    li.push(t.join(''));
  }
  return li;
};

bind = (pug) => {
  return pugExtract(pug).map((txt) => {
    var last;
    last = txt.length - 1;
    if ((txt[0] !== '(') || (txt[last] !== ')')) {
      return txt;
    }
    txt = txt.slice(1, last);
    txt = split(txt).map((line) => {
      var attr, begin, end, pos, replace, set, wrap, 冒号, 等号;
      if (!line.trim()) {
        return line;
      }
      attr = line.trimStart();
      begin = line.length - attr.length;
      attr = attr.trimEnd();
      end = begin + attr.length;
      begin = line.slice(0, begin);
      end = line.slice(end);
      set = (txt) => {
        return line = begin + txt + end;
      };
      wrap = (txt, attr) => {
        if (!attr.startsWith('{')) {
          attr = '{' + attr + '}';
        }
        return set(txt + '"' + attr + '"');
      };
      replace = (key, to) => {
        var at_pos, pos;
        at_pos = attr.indexOf(key) + key.length;
        pos = attr.indexOf('=', at_pos) + 1;
        return wrap(attr.slice(0, at_pos - 1) + to + attr.slice(at_pos, pos), attr.slice(pos));
      };
      if (attr) {
        if (attr.indexOf('="') < 0) {
          if (attr.endsWith(':')) {
            set('{' + attr.slice(0, attr.length - 1) + '}');
          } else {
            switch (attr.charAt(0)) {
              case '@':
                if (attr.charAt(1) === '&') {
                  wrap('bind:this=', attr.slice(2));
                } else {
                  等号 = attr.indexOf('=');
                  if (等号 < 0) {
                    attr = attr.slice(1);
                    if (attr !== 'message') {
                      wrap('on' + attr + '=', attr.split('|', 1)[0]);
                    } else {
                      set('on' + attr);
                    }
                  } else {
                    replace('@', 'on');
                  }
                }
                break;
              case '&':
                wrap('bind:value=', attr.slice(1));
                break;
              default:
                pos = attr.indexOf('&');
                等号 = attr.indexOf('=');
                if (pos > 0 && 等号 < 0) {
                  wrap('bind:' + attr.slice(0, pos) + '=', attr.slice(pos + 1));
                } else {
                  pos = attr.indexOf(':');
                  if (pos > 0 && 等号 < 0) {
                    wrap(attr.slice(0, pos) + '=', attr.slice(pos + 1));
                  } else {
                    冒号 = attr.indexOf(':');
                    if (冒号 > 0 && 冒号 < 等号) {
                      wrap(attr.slice(0, +等号 + 1 || 9e9), attr.slice(等号 + 1));
                    }
                  }
                }
            }
          }
        }
      }
      return line;
    }).join(' ');
    return txt = '(' + txt + ')';
  });
};

export default main = (pug) => {
  var cmd, i, j, len, li, line, pos, pug_li, ref, ts;
  li = [];
  pug_li = bind(pug).join('');
  ref = pug_li.split('\n');
  for (j = 0, len = ref.length; j < len; j++) {
    line = ref[j];
    ts = line.trimStart();
    i = ts.trimEnd();
    if (i.charAt(0) === '+') {
      pos = i.indexOf(' ', 2);
      if (pos > 0) {
        cmd = i.slice(1, pos);
        if (CMD.has(cmd)) {
          if (cmd === 'elif') {
            cmd = 'elseif';
          }
          line = ''.padEnd(line.length - ts.length) + '+' + cmd + '(\'' + i.slice(pos + 1).replaceAll('\'', '\\\'') + '\')';
        }
      }
    }
    li.push(line);
  }
  return li.join('\n');
};
