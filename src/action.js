let store = [];
const clickTypeEls = ['a', 'button', 'input[button]', 'input[submit]', 'input[radio]', 'input[checkbox]'];
      valChangeTypeEls = ['input[text]', 'input[password]', 'textarea', 'select'];

function init() {
    //记录页面跳转
    if(document.referrer) {
        
    }
    //记录console和alert
    
    if (window.addEventListener) {
      document.addEventListener('click', clickHandler, true) // 标准浏览器在捕获阶段触发
      document.addEventListener('blur', valChangeHandler, true)
    } else if (window.attachEvent) {
      document.attachEvent('onclick', clickHandler)
      document.attachEvent('onfocusout', valChangeHandler) // document内部有元素发生blur就会触发
    }
}

function clickHandler(e) {
    const target = e.target || e.srcElement
    if (target == document || target == window || target == document.documentElement || target == document.body) {
      return
    }
    if(should(target, clickTypeEls)) {
       this.record(target, 'click');
    }
}

function valChangeHandler() {

}

function should(el, els) {
    let tag = el.tagName.toLowerCase()
    if (tag === 'input' && el.type) {
      tag += '[' + el.type + ']'
    }
    return els.indexOf(tag) > -1;
}

  function getAttrs(element) {
    var result = {}
    var attributes = element.attributes
    // 在ie6-7下面，会获取到很多内置的attribute，使用specified属性来区分，在版本浏览器下，都会输出正确的属性，同时specified也是true。不保存非checkbox、radio的value属性的信息
    var len = attributes.length
    for (var i = 0; i < len; ++i) {
      var item = attributes[i]
      if (item.specified) {
        if (item.name == 'value' && this.accept(element, ['textarea', 'input[text]', 'input[password]'])) {
          continue
        }
        result[item.name] = item.value
      }
    }
    return result
  }

  /**
   * 根据不同的元素，记录不同的内容，input[password]不记录value，input[text]和textarea只记录文本长度，input[checkbox]、input[radio]需要记录value和checked属性，select记录选中的value和index
   * @param  {HTMLElement} target
   * @param  {String} lowercaseTagName 小写的标签tag
   * @param  {String} action           动作标示，'click','input'
   * @return {String}                  成功返回这个log的guid
   */
  function record (element, lowercaseTagName, action) {
    var attributes = this.attributes(element)
    var log = {
      tag: lowercaseTagName,
      action: action,
      time: util.isoDate(),
      attribute: attributes,
      extra: {}
    }
    if (lowercaseTagName === 'input') {
      switch (element.type) {
        case 'text':
          log.extra.length = element.value.length
          break
        case 'checkbox':
        case 'radio':
          log.extra.checked = element.checked
          break
      }
    }
    else if (lowercaseTagName === 'textarea') {
      log.extra.length = element.value.length
    }
    else if (lowercaseTagName === 'select') {
      log.extra.selectedIndex = element.selectedIndex
      log.extra.value = element.value
    }
    return this.store.add(log, 'act')
  }

module.exports = action