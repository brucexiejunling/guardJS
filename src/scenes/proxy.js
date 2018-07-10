import _ from '../libs/hook';
import {isFunc} from '../libs/utils';
import tracer from '../tracer';

function run() {
    _.before(window, 'setTimeout setInterval', catArgs);
    _.before(XMLHttpRequest.prototype, 'send', function() {                         
        if (this.onreadystatechange) {                                              
            this.onreadystatechange = cat(this.onreadystatechange);                 
        }                                                                           
    }); 
    _.modify(window, 'define require', funArgsFilter(catArgs));
    _.modify(window, 'Jquery Zepto', function($) {
        if ($ && $.fn) {
            _.modify($.fn, 'on bind', funArgsFilter(catArgs));
            _.modify($.fn, 'off unbind', funArgsFilter(uncatArgs));
        }
        return $;
    }); 
}

function cat(foo) {
    if(foo._guardJS) {
        return foo;
    }
    if (!isFunc(foo) || foo.__try) {
        return foo;
    }
    if (foo.__tryer) {
        return foo.__tryer;
    }
    var fun = function() {
        try {
            return foo.apply(this, arguments);
        } catch (e) {
            throwHandler(e);
        }
    };
    foo.__tryer = fun;
    fun.__try = foo;
    fun.__proto__ = foo;
    return fun;
}

function catArgs() {
    return [].slice.call(arguments).map(function(fun) {
        return isFunc(fun) ? cat(fun) : fun;
    });
}

function uncatArgs() {
    return [].slice.call(arguments).map(function(fun) {
        return isFunc(fun) && fun.__tryer ? fun.__tryer : fun;
    });
}

function funArgsFilter(filter) {
    return function(_fun) {
        if (!isFunc(_fun) || _fun.__filting) {
            return _fun;
        }
        if (_fun.__filter) {
            return _fun.__filter;
        }
        var fun = function() {
            var args = filter.apply(this, arguments);
            return _fun.apply(this, args);
        };
        _fun.__filter = fun;
        fun.__filting = _fun;
        fun.__proto__ = _fun;
        return fun;
    };
}

function throwHandler(e) {
    const {stack, message} = e;
    tracer('proxy', {
        type: stack.split(':').length > 0 ? stack.split(':')[0] : 'ScriptError',
        target: {
            message,
            stack
        }
    });
};

module.exports = {
    run: run,
    tryCat: cat //暴露方法，用于主动包裹
}

