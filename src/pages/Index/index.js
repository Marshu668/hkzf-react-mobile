import React from "react";

// 导入组件
import { Carousel, Flex } from "antd-mobile";

// 导入axios
import axios from "axios";

// 导入导航菜单图片
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
// 导入样式文件
import "./index.css";

// 导航菜单的数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    //   实现点击之后路由跳转
    path: "/home/list"
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/home/list"
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map"
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/rent/add"
  }
];

export default class Index extends React.Component {
  state = {
    //   轮播图状态数据, 
    // 轮播图出现的问题：不会自动播放，和去到其他页面返回之后高度不够，因为轮播图数据是动态加载的，加载完成前后轮播图数据不一致
    // 解决方案：在state中添加表示轮播图加载完成的数据，在轮播图数据加载完成时，修改该数据状态值为true，只有在轮播图加载完成时，才渲染轮播图组件
    swipers: [],
    isSwiperLoaded:false
  };
  //   获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get("http://localhost:8080/home/swiper");
    console.log("这是", res);
    // 获取到数据并且更新轮播图的状态
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded:true
    });
  }
  //   修改状态,生命周期函数  实现一进页面就调用轮播图页面的功能
  componentDidMount() {
    this.getSwipers();
  }
  //   渲染轮播图结构  把逻辑单独抽离到这个方法里面
  renderSwipers() {
    {
      /* 遍历数据 来生成每一块内容*/
    }
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://www.baidu.com"
        style={{
          display: "inline-block",
          width: "100%",
          height: 212
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
        />
      </a>
    ));
  }
//   导航菜单的代码重构，先实现功能再重构代码
  //   渲染导航菜单,逻辑结构写在外面，下面直接调用，结构更加清晰，将数据单独列出来，这里直接循环navs拿到数据并渲染出来，并且绑定点击事件，实现页面跳转
  renderNavs() {
    return navs.map(item => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }
  render() {
    return (
      // 外面是需要一个盒子来包裹的
      <div className="index">
        {/* 轮播图 */}
        {/* 写一个三元表达式判断 轮播图是否加载完成  加载完成才渲染结构 */}
        <div className="swiper">
         {
            this.state.isSwiperLoaded?
            <Carousel
                //   自动播放
                autoplay={true}
                //   循环播放
                infinite
                //   多久切换一张图片
                autoplayInterval={5000}
            >
             {/* 直接调用上面渲染的轮播图的方法 */}
             {this.renderSwipers()}
           </Carousel> : ''
        }
        </div>
        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>
      </div>
    );
  }
}
