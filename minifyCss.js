var fmtErr, minifyCss, targets;

import browserslist from 'browserslist';

import {
  red,
  gray,
  green,
  bgRed,
  white
} from 'ansis';

import {
  styleText
} from 'node:util';

import {
  transform,
  browserslistToTargets
} from 'lightningcss';

targets = browserslistToTargets(browserslist('> 3%'));

fmtErr = ({
    fileName,
    source,
    loc: {line, column},
    data: {
      type: errorType
    }
  }) => {
  var afterError, beforeError, endLine, errorCharFormatted, errorLineFormatted, li, lineContent, lineNumber, lines, startLine;
  lines = source.split('\n');
  startLine = Math.max(1, line - 3);
  endLine = Math.min(lines.length, line + 3);
  li = (function() {
    var j, ref, ref1, results;
    results = [];
    for (lineNumber = j = ref = startLine, ref1 = endLine; (ref <= ref1 ? j <= ref1 : j >= ref1); lineNumber = ref <= ref1 ? ++j : --j) {
      lineContent = lines[lineNumber - 1];
      results.push(gray(lineNumber + ' ') + (lineNumber === line ? (beforeError = red(lineContent.slice(0, column - 1)), afterError = red(lineContent.slice(column)), errorCharFormatted = bgRed(lineContent[column - 1] || ''), errorLineFormatted = `${beforeError}${errorCharFormatted}${afterError}`, errorLineFormatted) : gray(lineContent)));
    }
    return results;
  })();
  return `${green(fileName)} ${gray(':')} ${red(errorType)}
${li.join('\n')}`;
};

export default minifyCss = (css, filename, minify) => {
  var e, i, r, ref;
  try {
    r = transform({
      filename, // 可选，用于错误信息
      code: Buffer.from(css),
      minify,
      sourceMap: false,
      targets,
      outputStyle: 'expanded'
    });
  } catch (error) {
    e = error;
    if (e != null ? e.loc : void 0) {
      e = fmtErr(e);
    }
    console.error(e);
    return;
  }
  if (r.warnings.length) {
    if (filename) {
      console.warn(filename);
    }
    ref = r.warnings;
    for (i of ref) {
      console.warn(i);
    }
  }
  return r;
};

// console.log minifyCss('''
// .x {
//   background-color: #f;
// }
// .xx{color:#ff0000;
// }''','xx.css')
