import utils from '../libs/utils';
import tracer from '../tracer';

bindEvents = function() {
    const oldHandler = window.onerror;
    window.onerror = function(message, file, line, column, innerError) {
        // 后4个参数，在跨域异常的时候，会有不同的数据。
        // file       在ie系列下面永远有数据，chrome非cors没有数据，ff都有
        // line       非cors都没有，但是ie通过window.event可以获取
        // column     ie没有这个参数，其他同上
        // innerRrror ie下没有，chrome只有.name .message .stack三个属性，ff下还包含.fileName .lineNumber .columnNumber额外三个属性，跨域策略同上

        oldHandler && oldHandler.apply(window, arguments);

        const error = patchError.apply(window, Array.prototype.slice.call(arguments))

        let type = error.stack && error.stack.split(':').length > 0 ? error.stack.split(':')[0] : 'ScriptError';
        tracer('global', {
            type,
            target: error
        });
        return false;
    };

    window.addEventListener("unhandledrejection", function(e) {
        let error = {}
        const reason = e.reason;
        const {message, stack} = reason;
        if(message) {
            error.type = stack && stack.split(':').length > 0 ? stack.split(':')[0] : 'ScriptError';
            error.target = {
                message,
                stack
            }
        } else {
            error.type = 'UnhandledRejection';
            error.target = {
                rejection: reason
            }
        }
        tracer('promise', error);
    });
}

function patchError(message, file, line, column, innerError) {
    let stack = null
    if (utils.isIE()) {
      let evt = window.event
      message = message || evt.errorMessage
      file = file || evt.errorUrl
      line = line || evt.errorLine
      column = column || evt.errorCharacter
    } else {
      file = file || (innerError && innerError.fileName) || null
      line = line || (innerError && innerError.lineNumber) || null
      column = column || (innerError && innerError.columnNumber) || null
      stack = (innerError && innerError.stack) || null
    }
  
    return {
      message,
      file,
      line,
      column,
      stack
    }
}

module.exports = {
    run: bindEvents
}