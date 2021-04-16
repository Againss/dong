/*
 * @Date: 2021-04-06 10:25:25
 * @Author: Againss
 * @LastEditTime: 2021-04-06 17:49:36
 * @LastEditors: Againss
 * @Descripttion: popover组件
 */
import Popover from './popover.vue';
Popover.install = function(Vue) {
  Vue.component(Popover.name, Popover);
  Vue.prototype.$clearPopover = function() {
    let ary = document.getElementsByClassName('cc-popover__content');
    for (let i = 0; i < ary.length; i++) {
        ary[i].style.display = 'none';
    }
  };
  // 监听指令
  window.addEventListener('scroll',()=>{
      Vue.prototype.$clearPopover()
  },false)
   
  Vue.directive('scroll-clear-popover', {
    bind: el => {
      el.addEventListener('scroll', ()=>{
          Vue.prototype.$clearPopover()
      }, false);
    }
  });
};

export default Popover;