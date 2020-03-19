import React from "react";

// 导入toast
import { Toast } from "antd-mobile";
// 导入axios
// import axios from "axios";
// 导入创建的axios实例，并且代替公共路径http://localhost:8080
import {API} from '../../utils/api'

// 导入封装好的NavHeader组件
import NavHeader from "../../components/NavHeader";

// 导入BASE_URL,代替本地地址http://localhost:8080
import {BASE_URL} from '../../utils/url'

// 导入样式 。
// import './index.scss' 不需要你了
// 导入module样式   声明一个变量styles接收这个样式，是一个对象，
import styles from "./index.module.css";

// 声明一个全局变量，解决脚手架全局变量访问的问题
const BMap = window.BMap;

// 覆盖物样式
const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center"
};

export default class Map extends React.Component {
  state = {
    // 小区的房源列表
    houseList: [],
    // 表示是否展示房源列表
    isShowList: false
  };
  componentDidMount() {
    this.initMap();
  }

  //  初始化地图
  // 初始化地图实例
  initMap() {
    //  获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
    console.log(label, value);

    // 初始化地图实例
    // 在react脚手架中全局对象需要使用window来访问，否则会造成ESLint校验错误
    const map = new BMap.Map("container");
    // 能够 在其他方法中通过this来获取到地图对象
    this.map = map;
    // 设置中心坐标
    // const point = new window.BMap.Point(116.404, 39.915);

    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async point => {
        if (point) {
          map.centerAndZoom(point, 11);
          // map.addOverlay(new BMap.Marker(point));
          // 添加常用控件
          map.addControl(new BMap.NavigationControl());
          map.addControl(new BMap.ScaleControl());

          // 调用renderOverlays方法
          this.renderOverlays(value);

          // 获取房源数据
          // const res = await  axios.get(`http://localhost:8080/area/map?id=${value}`)
          // console.log(res);
          // res.data.body.forEach(item => {

          //   // 为每一条数据创造覆盖物
          //   // 拿到位置的经纬度
          //   const { coord: {longitude,latitude}, label: areaName, count, value} = item
          //   // 创造覆盖物
          //   const label = new BMap.Label("", {
          //     // 根据经纬度创造坐标对象
          //     position: new BMap.Point(longitude,latitude),
          //     // 设置偏移,让房源覆盖物正好在坐标的位置
          //     offset: new BMap.Size(-35, -35)
          //   });
          //   // 给覆盖物label对象添加一个唯一标识
          //  label.id = value
          //   //  设置房源覆盖物，里面是使用的纯html模版
          //   label.setContent(
          //     `
          //        <div class="${styles.bubble}">
          //           <p class="${styles.name}">${areaName}</P>
          //           <p>${count}套</P>
          //        </div>
          //      `
          //   )
          //   // 设置样式
          //   label.setStyle(labelStyle);
          //   // 添加单击事件
          //   label.addEventListener("click", () => {
          //     console.log("你被点击了",label.id);

          //     // 点击之后放大地图，以当前点击的覆盖物为中心放大地图
          //     // 第一个参数是坐标对象，第二个参数是以坐标为中心放大的级别
          //     map.centerAndZoom(new BMap.Point(longitude,latitude),13)

          //     // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
          //     setTimeout(() => {
          //       // 点击之后，清除当前所有覆盖物信息
          //     map.clearOverlays()
          //     }, 0)
          //   });
          //   // 添加覆盖物到地图中
          //   map.addOverlay(label);
          // })

          // 创建Label实例,创建文本标注
          // 设置setcontent之后，第一个参数设置的文本内容就失效了，因此，直接清空即可
          // const label = new BMap.Label("", {
          //   position: point,
          //   // 设置偏移,让房源覆盖物正好在坐标的位置
          //   offset: new BMap.Size(-35, -35)
          // });

          //  设置房源覆盖物，里面是使用的纯html模版
          // label.setContent(
          //   `
          //      <div class="${styles.bubble}">
          //         <p class="${styles.name}">浦东</P>
          //         <p>99套</P>
          //      </div>
          //    `
          // );

          // // 设置样式
          // label.setStyle(labelStyle);
          // // 添加单击事件
          // label.addEventListener("click", () => {
          //   console.log("你被点击了");
          // });
          // // 添加覆盖物到地图中
          // map.addOverlay(label);
        }
      },
      label
    );
    // 初始化地图 将实例和中心点结合起来
    // map.centerAndZoom(point, 15);
    // 给地图绑定移动事件，地图移动的时候小区展示列表隐藏起来
    map.addEventListener("movestart", () => {
      // console.log('movestart')
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        });
      }
    });
  }

  // 渲染覆盖物入口
  // 接收id参数，获取该区域下的房源数据
  async renderOverlays(id) {
    try {
      // 开启loading，获取数据之前开启
      Toast.loading("加载中···", 0, null, false);
      // 获取房源数据
      // 去掉前缀http://localhost:8080，只留当前接口地址，
      const res = await API.get(`/area/map?id=${id}`);
      // 关闭toast，获取完了关闭
      Toast.hide();
      console.log("enter", res);
      const data = res.data.body;

      //  调用getTypeAndZoom 方法获取级别和类型
      const { nextZoom, type } = this.getTypeAndZoom();

      //  给每一个对象坐标创建覆盖物
      data.forEach(item => {
        this.createOverlays(item, nextZoom, type);
      });
    } catch (e) {
      // 出错来就关闭toast
      Toast.hide();
    }
  }

  //  计算要绘制的覆盖物和下一个缩放级别
  getTypeAndZoom() {
    //  调用地图的getZoom()方法，来获取当前 缩放级别
    const zoom = this.map.getZoom();
    console.log("second", zoom);
    let nextZoom, type;

    // 当zoom为区时
    if (zoom >= 10 && zoom < 12) {
      // 那么 下一个缩放级别
      nextZoom = 13;
      // circle表示绘制圆形覆盖物， 区和镇的
      type = "circle";
    } else if (zoom >= 12 && zoom < 15) {
      nextZoom = 15;
      type = "circle";
    } else if (zoom >= 14 && zoom < 16) {
      // 小区不需要缩放级别，直接绘制一个矩形的形状
      type = "rect";
    }
    return {
      nextZoom,
      type
    };
  }

  // 创建覆盖物
  createOverlays(data, zoom, type) {
    // 拿到位置的经纬度,解构出来的需要渲染的数据，当作参数传入的
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = data;
    // 创建坐标对象
    const areaPoint = new BMap.Point(longitude, latitude);

    if (type === "circle") {
      //  区 镇的  覆盖物
      this.createCircle(areaPoint, areaName, count, value, zoom);
    } else {
      //  小区的覆盖物
      this.createRect(areaPoint, areaName, count, value);
    }
  }

  // 创建区，镇覆盖物
  // 根据传入的类型等数据，调用相应的创建覆盖物，并提供参数
  createCircle(point, name, count, id, zoom) {
    // 创造覆盖物
    const label = new BMap.Label("", {
      // 根据经纬度创造坐标对象
      position: point,
      // 设置偏移,让房源覆盖物正好在坐标的位置
      offset: new BMap.Size(-35, -35)
    });
    // 给覆盖物label对象添加一个唯一标识
    label.id = id;
    //  设置房源覆盖物，里面是使用的纯html模版，结构
    label.setContent(
      `
                 <div class="${styles.bubble}">
                    <p class="${styles.name}">${name}</P>
                    <p>${count}套</P>
                 </div>
               `
    );
    // 设置样式
    label.setStyle(labelStyle);
    // 添加单击事件
    label.addEventListener("click", () => {
      // console.log("你被点击了", label.id);
      // 调用renderOverlays 方法，获取被点击该区域下的房源数据
      this.renderOverlays(id);
      // 点击之后放大地图，以当前点击的覆盖物为中心放大地图
      // 第一个参数是坐标对象，第二个参数是以坐标为中心放大的级别
      this.map.centerAndZoom(point, zoom);

      // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
      setTimeout(() => {
        // 点击之后，清除当前所有覆盖物信息
        this.map.clearOverlays();
      }, 0);
    });
    // 添加覆盖物到地图中
    this.map.addOverlay(label);
  }

  // 创建小区覆盖物
  createRect(point, name, count, id) {
    // 创造覆盖物
    const label = new BMap.Label("", {
      // 根据经纬度创造坐标对象
      position: point,
      // 设置偏移,让房源覆盖物正好在坐标的位置
      offset: new BMap.Size(-50, -28)
    });
    // 给覆盖物label对象添加一个唯一标识
    label.id = id;
    //  设置房源覆盖物，里面是使用的纯html模版，结构
    label.setContent(
      `
                 <div class="${styles.rect}">
                    <span class="${styles.housename}">${name}</span>
                    <span class="${styles.housenum}">${count}套</span>
                    <i class="${styles.arrow}"></i>
                 </div>
               `
    );
    // 设置样式
    label.setStyle(labelStyle);
    // 添加单击事件
    label.addEventListener("click", e => {
      console.log("小区被点击了");
      this.getHouseList(id);

      // 获取当前被点击项
      const target = e.changedTouches[0];
      //  将被点击小区放在地图中心点的位置
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      );
    });
    // 添加覆盖物到地图中
    this.map.addOverlay(label);
  }

  // 获取到小区的房源数据
  async getHouseList(id) {
    try {
      // 开启loading，获取数据之前开启
      Toast.loading("加载中···", 0, null, false);
      const res = await API.get(`/houses?cityId=${id}`);
      // console.log(res);
      // 关闭toast，获取完了关闭
      Toast.hide();
      this.setState({
        houseList: res.data.body.list,
        // 展示房源列表
        isShowList: true
      });
    } catch (e) {
      // 数据请求失败了也关闭toast
      Toast.hide();
    }
  }
  // 封装渲染房屋列表的结构的方法
  renderHousesList() {
    // {
    //   /* 房屋结构 */
    // }
    return this.state.houseList.map(item => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={BASE_URL + item.houseImg}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.tilte}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {item.tags.map((tag, index) => {
              const tagClass = "tag" + (index + 1);
              return (
                <span
                  className={[styles.tag, styles[tagClass]].join(" ")}
                  key={tag}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ));
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

        {/* 房源列表 */}
        {/* styles.show 做判断，未点击小区获取房源信息则不显示，点击小区之后才显示房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ""
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    );
  }
}
