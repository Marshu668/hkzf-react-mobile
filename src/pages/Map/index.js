import React from "react";

// 导入封装好的NavHeader组件
import NavHeader from "../../components/NavHeader";

// 导入样式 。
// import './index.scss' 不需要你了
// 导入module样式   声明一个变量styles接收这个样式，是一个对象，
import styles from "./index.module.css";

export default class Map extends React.Component {
  // 在钩子函数里面初始化地图实例
  componentDidMount() {
    // 初始化地图实例
    // 在react脚手架中全局对象需要使用window来访问，否则会造成ESLint校验错误
    const map = new window.BMap.Map("container");
    // 设置中心坐标
    const point = new window.BMap.Point(116.404, 39.915);
    // 初始化地图 将实例和中心点结合起来
    map.centerAndZoom(point, 15);
  }

  render() {
    return (
      // 通过styles对象访问对象中的样式名类名来设置样式
      <div className={styles.map}>
        {/* 顶部导航栏组件 */}
        {/* 每一个组件都有children属性，在这里把内容写上，再去封装的NavHeader里面进行接收children属性，再把它作为值进行插入内容，即可 */}
        <NavHeader>地图找房</NavHeader>
        {/* 地图容器元素 */}
        <div id="container" className={styles.container} />
      </div>
    );
  }
}
