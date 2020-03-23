import React, { Component, createRef } from 'react'
// 导入属性校验
import ProtoTypes from 'prop-types'
import styles from './index.module.css'

// dom.getBoundingClientRect() 获取元素的大小及其相对于视口的位置。

/* 
  条件筛选栏吸顶功能实现步骤：

  1 封装 Sticky 组件，实现吸顶功能。
  2 在 HouseList 页面中，导入 Sticky 组件。
  3 使用 Sticky 组件包裹要实现吸顶功能的 Filter 组件。

  4 在 Sticky 组件中，创建两个 ref 对象（placeholder、content），分别指向占位元素和内容元素。
  5 组件中，监听浏览器的 scroll 事件（注意销毁事件）。
  6 在 scroll 事件中，通过 getBoundingClientRect() 方法得到筛选栏占位元素当前位置（top）。
  7 判断 top 是否小于 0（是否在可视区内）。
  8 如果小于，就添加需要吸顶样式（fixed），同时设置占位元素高度（与条件筛选栏高度相同）。
  9 否则，就移除吸顶样式，同时让占位元素高度为 0。
*/

class Sticky extends Component {
  // 创建ref对象  占位符和内容
  placeholder = createRef()
  content = createRef()

  // scroll 事件的事件处理程序
  handleScroll = () => {
    // 将标题栏Filter高度解构出来
    const {height} =this.props
    // 获取两个ref对应的DOM对象
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current
    // 调用方法getBoundingClientRect()得到筛选栏占位元素当前位置，也就是距离顶部的
    const { top } = placeholderEl.getBoundingClientRect()
    // 当top<0  说明不在可视区域了，实现吸顶
    if (top < 0) {
      // 吸顶
      contentEl.classList.add(styles.fixed)
      // 设置占位元素的高度
      placeholderEl.style.height = `${height}px`
    } else {
      // 取消吸顶
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0px'
    }
  }

  // 监听 scroll 事件
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
// 组件销毁的时候解绑移除事件handleScroll
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder} />
        {/* 内容元素 */}
        {/* 通过this.props.children拿到需要实现吸顶的该子节点，就让该子节点作为最终渲染的内容 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}
Sticky.protoTypes = {
  // height为必填项的数值
  height : ProtoTypes.number.isRequired
}
export default Sticky
