module.exports = {
    // aop 注入
    before: function(obj, props, hook) {
        props.split(/\s+/).forEach(function(prop) {
            var _fun = obj[prop];
            obj[prop] = function() {
                var args = hook.apply(this, arguments) || arguments;
                return _fun.apply(this, args);
            };
        });
    },
    // 监听修改属性
    modify: function(obj, props, modifier) {
        if (!obj.__defineSetter__) {
            return;
        }
        props.split(/\s+/).forEach(function(prop) {
            var value = obj[prop];
            // 如果属性已经存在
            if (typeof value !== 'undefined') {
                value = modifier.call(this, value);
            }
            obj.__defineSetter__(prop, function(_value) {
                if (_value !== value) {
                    value = modifier.call(this, _value);
                }
            });
            obj.__defineGetter__(prop, function() {
                return value;
            });
        });
    }
};

                                                                       
