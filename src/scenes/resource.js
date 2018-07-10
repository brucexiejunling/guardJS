import tracer from '../tracer';
module.exports = {
    run: function () {
        window.addEventListener('error', function(e) {
            if(!e.message) {
                const target  = e.target ? e.target : e.srcElement;
                let {outerHTML, src, tagName, id, className, name} = target;
                //避免过长
                if(outerHTML.length > 200) {
                    outerHTML = outerHTML.slice(0,200);
                }
                if(target.src && window.XMLHttpRequest) {
                    let xhr = new XMLHttpRequest();
                    xhr._guardJS = true; //标识是guard发出的请求，捕获ajax异常时忽略;
                    xhr.open("OPTIONS", target.src);
                    xhr.send();
                    xhr.onload = function(e) {
                        if(200 !== e.target.status) {
                            const status = e.target.status;
                            const statusText = e.target.statusText;
                            const error = {
                                type: 'resourceError',
                                target: {
                                    outerHTML,
                                    src,
                                    tagName,
                                    id,
                                    className,
                                    name,
                                    status,
                                    res: statusText
                                }
                            }
                            tracer('resource', error)
                        }
                    }
                }
            }
        }, true)
    }
}