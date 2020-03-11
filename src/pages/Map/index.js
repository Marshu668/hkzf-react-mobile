import React from 'react'
// 导入样式 。
import './index.scss'


export default class Map extends React.Component{
    // 在钩子函数里面初始化地图实例
    componentDidMount(){
        // 初始化地图实例
        // 在react脚手架中全局对象需要使用window来访问，否则会造成ESLint校验错误
        const map = new window.BMap.Map('container')
        // 设置中心坐标
        const point = new window.BMap.Point(116.404, 39.915)
        // 初始化地图 将实例和中心点结合起来
        map.centerAndZoom(point, 15)
    }
    render(){
        return (
          <div className="map">
            {/* 地图容器元素 */}
           <div id="container"/> 
          </div>
        )
    }
}