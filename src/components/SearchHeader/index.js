import React from 'react'
import { Flex } from 'antd-mobile'
// 导入withRouter可以通过它包装函数接收路由传过来的信息
import {withRouter} from 'react-router-dom'
// 导入props校验
import PropTypes from 'prop-types'
// 导入样式
import  './index.scss'

// 直接把把之前写的导航栏的结构拿过来用
function SearchHeader({history,cityName,className}){
    return (
         <Flex className={["search-box",className || ''].join(' ')}>
         {/* 左侧白色区域 */}
         <Flex className="search">
           {/* 位置 */}
           {/* this.props.history.push('/citylist') 给地址区域绑定点击事件，实现路由跳转到城市选择页面  同时给搜索框和地图图标也要绑定路由跳转页面*/}
           <div
             className="location"
             onClick={() => history.push("/citylist")}
           >
             <span className="name">{cityName}</span>
             <i className="iconfont icon-arrow" />
           </div>
           {/* 搜索表单 */}
           <div
             className="form"
             onClick={() => history.push("/search")}
           >
             <i className="iconfont icon-seach" />
             <span className="text">请输入小区或地址</span>
           </div>
         </Flex>
         {/* 右侧地图图标 */}
         <i
           className="iconfont icon-map"
           onClick={() => history.push("/map")}
         />
       </Flex>
    )
}

// 添加属性校验
SearchHeader.propTypes = {
    cityName : PropTypes.string.isRequired,
    className:PropTypes.string
} 

export default withRouter(SearchHeader)