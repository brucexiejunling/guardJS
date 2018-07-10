import _ from '../libs/hook';
import tracer from '../tracer';

module.exports = {
    run: function() {
        // 获取请求类型，url
        _.before(XMLHttpRequest.prototype, 'open', function() {
            //自身发出的请求不做hook
            if(!this._guardJS) {
                this._reqMethod = arguments[0];
                this._reqUrl = arguments[1];
            }
        });
        
        //获取请求发送数据
        _.before(XMLHttpRequest.prototype, 'send', function() {
            if(!this._guardJS) {
                this._reqData = arguments[0] || {};
                const readyStateChangeHandler = this.onreadystatechange;
                this.onreadystatechange = function() {
                    if(this.readyState === 4) {
                        if(this.status >= 400) {
                            tracer('ajax', {
                                type: 'XhrError',
                                target: {
                                    method: this._reqMethod,
                                    url: this._reqUrl,
                                    data: this._reqData,
                                    status: this.status,
                                    res: this.response 
                                }
                            });
                        }
                    }
                    readyStateChangeHandler && readyStateChangeHandler.apply(this, arguments);
                }
            }
        })    
    }
}