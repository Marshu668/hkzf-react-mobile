import React from "react";

// 导入navbar组件
import { NavBar } from "antd-mobile";

// 导入withRouter高阶组件
import {withRouter} from 'react-router-dom'

// 导入props校验
import PropTypes from 'prop-types'

// 导入样式
// import './index.scss'
// 不需要普通的scss样式了，直接导入css module样式
// styles 变量名 是一个对象
import styles from './index.module.css'

// 把顶部导航栏封装成一个动态的函数，哪里需要就直接调用即可
// 将onLeftClick解构出来，如果用户有自己想要实现的行为，自己自定义按钮的点击事件即可，如果没有就默认我们设置的点击行为
function NavHeader({children,history,onLeftClick}) {
// 默认点击行为
  const  defaultHandler = () => history.go(-1)
  return (
    <NavBar
      className={styles.navBar}
      mode="light"
      icon={<i className="iconfont icon-back" />}
    //   在这进行一个判断用户使用自己自定义的onLeftClick，如果没有传入，就是使用默认点击行为defaultHandler
      onLeftClick={onLeftClick || defaultHandler}
    >
      {children}
    </NavBar>
  )
}

// 添加props校验
NavHeader.propTypes = {
    // children属性为必填项
    children:PropTypes.string.isRequired,
    // onLeftClick是一个函数
    onLeftClick: PropTypes.func
}



// withRouter(NavHeader)函数的返回值也是一个组件
export default withRouter(NavHeader)