<!--
 * @Date: 2021-04-06 10:26:37
 * @Author: Againss
 * @LastEditTime: 2021-04-06 16:48:14
 * @LastEditors: Againss
 * @Descripttion: 
-->
<template>
  <div class="cc-popover" ref="popover">
    <transition name="fade">
      <div
        v-if="init"
        ref="content"
        v-show="show"
        class="cc-popover__content"
        :style="{
          // 定位
          top: top + 'px',
          left: left + 'px',
        }"
      >
        <div class="cc-popover__box">
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
    <slot />
  </div>
</template>
<script>
import { getPopoverPosition } from "./utils";
export default {
  name: "ccPopover",
  props: {
    // 事件类型用户自己传, 本次只支持两种模式
    trigger: {
      type: String,
      default: "click",
      // 这里为了扩展所以这样写
      // 只有两种情况可以优化为只要不是click就默认给hover
      validator: value => ["click", "hover"].indexOf(value) > -1
    },
    placement: {
      // 方位我们定位的范围是, 每个方向都有'开始','中间','结束'三种情况
      type: String,
      default: "right-middle",
      validator(value) {
        let dator = /^(top|bottom|left|right)(-start|-end|-middle)?$/g.test(
          value
        );
        return dator;
      }
    },
    disabled:Boolean
  },
  data() {
    return {
      init: false,
      show: false,
      top:0,
      left:0,
      options:null
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取到当前用户定义的事件类型
      let trigger = this.trigger,
        // 本次选择操作dom
        popover = this.$refs.popover;
      if (trigger === "hover") {
        // hover当然要监听 进入与离开的事件拉
        this.on(popover, "mouseenter", this.handleMouseEnter);
        this.on(popover, "mouseleave", this.handleMouseLeave);
      } else if (trigger === "click") {
        this.on(popover, "click", this.handlClick);
      }
    });
  },
  watch: {
    // 我们会监控v-if的情况, 第一次渲染的时候才做这里的操作, 而且只执行一次
    init() {
      this.$nextTick(() => {
        let trigger = this.trigger,
          dom = this.$refs.content,
          content = this.$refs.content;
        // 这里是因为append操作属于剪切, 所以不会出现两个元素
        // 其实这个元素出现之后就一直存在与页面上了, 除非销毁本组件
        // 组件销毁的时候, 我们会document.body.removeChild(content);
        document.body.appendChild(dom);
        if (trigger === "hover") {
          this.on(content, "mouseenter", this.handleMouseEnter);
          this.on(content, "mouseleave", this.handleMouseLeave);
        }
      });
    },
    // 这个才是每次显示隐藏都会触发的方法
    show(val) {
      // 判断只有显示提示框的时候才回去计算位置
      val ? this.$emit('show') : this.$emit('hide');
      if (this.show) {
        this.$nextTick(() => {
          let { popover, content } = this.$refs,
            { left, top, options } = getPopoverPosition(
              popover,
              content,
              this.placement
            );
          // 坐标
          this.left = left;
          this.top = top;
          // 这个配置是决定 '小三角' 的位置的
          this.options = options;
        });
      }
    }
  },
  methods: {
    // 移入
    handleMouseEnter() {
      clearTimeout(this.time);
      this.init = true;
      this.show = true;
    },
    // 移出
    handleMouseLeave() {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.show = false;
      }, 200);
    },
    on(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    },
    handlClick() {
      if(this.disabled) return
      // 不管怎么样只要触发一次, 这个值就会把v-if永远置成true;
      this.init = true;
      // 在他本身被css属性隐藏的时候
      if (this.$refs.content && this.$refs.content.style.display === "none") {
        // 必须这样强制写, 
        // 否则与之后的代码配合时, 有bug无法消失
        this.$refs.content.style.display = "block";
        this.show = true;
      } else {
        // 除了第一次之外, 之后都只是变换这个this.show的'真假'
        this.show = !this.show;
      }
      // 不要监听body, 因为可能height不是100%;
      // 这个document其实也可以由用户指定
      // 放入让popover消失的函数, 这样方便之后的移除事件操作
      this.show && document.addEventListener("click", this.close);
    },
    close(e) {
      // 肯定要判断事件源到底是不是咱们的popover组件
      if (this.isPopover(e)) {
        this.show = false;
        // 点击完就可以移除了, 下次操作再绑定就可以
        // 因为如果往document绑定太多事件, 会非常卡, 非常卡
        document.removeEventListener("click", this.close);
      }
    },
    isPopover(e) {
      let dom = e.target,
        popover = this.$refs.popover,
        content = this.$refs.content;
      // 1: 点击popover包裹的元素, 关闭popover
      // 2: 点击popover内容区元素, 不关闭popover
      return !(popover.contains(dom) || content.contains(dom));
    },
    off(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    }
  },
  beforeDestroy() {
    let { popover, content } = this.$refs;
    this.off(content, "mouseleave", this.handleMouseLeave);
    this.off(popover, "mouseleave", this.handleMouseLeave);
    this.off(content, "mouseenter", this.handleMouseEnter);
    this.off(popover, "mouseenter", this.handleMouseEnter);
    this.off(document, "click", this.close);
    content&&document.body.removeChild(content);
  }
}
  </script>
  <style scoped>
  .cc-popover__content {
    position: absolute;
    z-index: 9;
  }
  </style>