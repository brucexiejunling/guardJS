import action from './action';
import report from './report';
function getEnvironment() {
    return navigator.userAgent;
}

function getTimestamp() {
    return (new Date()).toLocaleString()
}

function trace(scene, error) {
    let info = {
        pageUrl: location.href,
        userAgent: getEnvironment(),
        timestamp: getTimestamp(),
        type: error.type,
        error: error.target
    }
    report(info);
}

module.exports = trace;