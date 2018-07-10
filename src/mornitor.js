import global from './scenes/global';
import resource from './scenes/resource';
import proxy from './scenes/proxy';
import ajax from './scenes/ajax'

module.exports = {
   init: function()  {
        global.run();
        resource.run();
        proxy.run();
        ajax.run();
   },
   tryCat: proxy.tryCat
}