/*
 * @Date: 2021-04-06 11:21:58
 * @Author: Againss
 * @LastEditTime: 2021-04-06 11:25:00
 * @LastEditors: Againss
 * @Descripttion: 
 */
function getPopoverPosition(popover, content, direction, CONTANT) {
  // 这个show本次用不到, 为以后的组件做准备
  let result = { show: true };
  // 1: 让这个函数去初始化'参与运算的所有参数';
  // 把处理好的值, 付给result对象
  getOptions(result, popover, content, direction, CONTANT);
  // 2: 拿到屏幕的偏移
  // let { left, top } = getScrollOffset();
  // 3: return出去的坐标, 一定是针对当前可视区域的
  result.left +=  window.scrollX;
  result.top += window.scrollY;
  return result;
}
function getOptions(result, popover, content, direction, CONTANT = 10) {
  const list = [
    'top-end',
    'left-end',
    'top-start',
    'right-end',
    'top-middle',
    'bottom-end',
    'left-start',
    'right-start',
    'left-middle',
    'right-middle',
    'bottom-start',
    'bottom-middle'
  ];
  // 1: 可能会反复的调用, 所以来个深复制
  let myList = list.concat(),
    client = popover.getBoundingClientRect();// 获取popover的可视区距离
  // 2: 每次使用一种模式, 就把这个模式从list中干掉, 这样直到数组为空, 就是所有可能性都尝试过了
  myList.splice(list.indexOf(direction), 1);
  // 3: 把参数整理好, 传给处理函数
 getDirection(result, {
    myList,
    direction,
    CONTANT,
    top: client.top,
    left: client.left,
    popoverWidth: popover.offsetWidth,
    contentWidth: content.offsetWidth,
    popoverHeight: popover.offsetHeight,
    contentHeight: content.offsetHeight
  });
};
function  getDirection(result, options) {
  let {
    top,
    left,
    CONTANT,
    direction,
    contentWidth,
    popoverWidth,
    contentHeight,
    popoverHeight
  } = options;
  result.options = options;
  let main = direction.split('-')[0],
    around = direction.split('-')[1];
  if (main === 'top' || main === 'bottom') {
    if (around === 'start') {
      result.left = left;
    } else if (around === 'end') {
      result.left = left + popoverWidth - contentWidth;
    } else if (around === 'middle') {
      result.left = left + popoverWidth / 2 - contentWidth / 2;
    }
    if (main === 'top') {
      result.top = top - contentHeight - CONTANT;
    } else {
      result.top = top + popoverHeight + CONTANT;
    }
  } else if (main === 'left' || main === 'right') {
    if (around === 'start') {
      result.top = top;
    } else if (around === 'end') {
      result.top = top + popoverHeight - contentHeight;
    } else if (around === 'middle') {
      result.top = top + popoverHeight / 2 - contentHeight / 2;
    }
    if (main === 'left') {
      result.left = left - contentWidth - CONTANT;
    } else {
      result.left = left + popoverWidth + CONTANT;
    }
  }

  testDirection(result, options);
};
function testDirection(result, options) {
  let { left, top } = result,
    width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight;
  if (
    top < 0 ||
    left < 0 ||
    top + options.contentHeight > height ||
    left + options.contentWidth > width
  ) {
    // 还有可以循环的
    if (options.myList.length) {
      options.direction = options.myList.shift();
      getDirection(result, options);
    } else {
      // 实在不行就在父级身上
      result.left = options.left;
      result.right = options.right;
    }
  } else {
    result.show = true;
  }
};

export  { getPopoverPosition }