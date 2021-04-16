/*
 * @Date: 2021-04-06 10:40:17
 * @Author: Againss
 * @LastEditTime: 2021-04-06 17:55:26
 * @LastEditors: Againss
 * @Descripttion: popover组件  为避免每个定位窗（类似且参考于销售订单等工艺要求的那种弹窗）都在各自的文件里写一大堆定位代码 
 * 使用
 * <cc-popover trigger="click" ref="ccPopover" @hide="hide">
      <template slot="content">
         <div>弹窗内容</div> 
      </template>
      <span>click me</span>
    </cc-popover>
 */
export { default } from './main/index';