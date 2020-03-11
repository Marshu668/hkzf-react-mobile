import React from "react";

// 导入组件
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";

// 导入axios
import axios from "axios";

// 导入导航菜单图片
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
// 导入样式文件
import "./index.scss";

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

// H5中的地理位置API
// 获取地理位置信息，主要是用于获取用户手机定位
// 地理位置API通过navigator.geolocation对象提供，通过getCurrentPosition方法获取
// navigator.geolocation.getCurrentPosition(position => {
      //  其中经纬度 属性 被使用较多
// })
//  在实际中，主要还是通过百度地图等地图软件来获取用户位置


export default class Index extends React.Component {
  state = {
    //   轮播图状态数据,
    // 轮播图出现的问题：不会自动播放，和去到其他页面返回之后高度不够，因为轮播图数据是动态加载的，加载完成前后轮播图数据不一致
    // 解决方案：在state中添加表示轮播图加载完成的数据，在轮播图数据加载完成时，修改该数据状态值为true，只有在轮播图加载完成时，才渲染轮播图组件
    swipers: [],
    isSwiperLoaded: false,
    // 租房小组数据
    groups: [],
    // 最新资讯
    news: [],
    // 当前城市名称
    curCityName:''
  };
  //   获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get("http://localhost:8080/home/swiper");
    console.log("这是", res);
    // 获取到数据并且更新轮播图的状态
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded: true
    });
  }

  //   获取租房小组数据的方法
  async getGroups() {
    const res = await axios.get("http://localhost:8080/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0"
      }
    });
    this.setState({
      groups: res.data.body
    });
  }
  // 获取最新资讯数据
  async getNews() {
    const res = await axios.get(
      "http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0"
    );
    this.setState({
      news: res.data.body
    });
  }

  //   修改状态,生命周期函数  实现一进页面就调用轮播图页面的功能
  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();

    // 通过IP定位获取当前城市名称  百度地图
    const curCity = new window.BMap.LocalCity();
     curCity.get( async res => {
         console.log(res);
        const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
        this.setState({
          curCityName: result.data.body.label
        })
     }); 
  }

  //   渲染轮播图结构  把逻辑单独抽离到这个方法里面
  renderSwipers() {
    // {/* 遍历数据 来生成每一块内容*/}
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
  //   最新资讯的代码结构
  // 遍历news数据,结构是由左侧的图片区域和右侧的文字区域组成，右侧是flex布局,右侧又分为两块，上面是标题，下面依旧是flex布局
  renderNews() {
       return this.state.news.map(item => (
           <div className="news-item" key={item.id}>
              <div className="imgwrap">
                <img  className="img" src={`http://localhost:8080${item.imgSrc}`} alt=""  />
              </div>
              <Flex className="content" direction="column" justify="between">
                 <h3 className="title">{item.title}</h3>
                 <Flex className="info" justify="between">
                    <span>{item.from} </span>
                    <span>{item.date} </span>
                 </Flex>
              </Flex>
           </div>
       ))
  }

  render() {
    return (
      // 外面是需要一个盒子来包裹的
      <div className="index">
        {/* 轮播图 */}
        {/* 写一个三元表达式判断 轮播图是否加载完成  加载完成才渲染结构 */}
        <div className="swiper">
          {this.state.isSwiperLoaded ? (
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
            </Carousel>
          ) : (
            ""
          )}

          {/* 顶部搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
             <Flex className="search">
               {/* 位置 */}
               {/* this.props.history.push('/citylist') 给地址区域绑定点击事件，实现路由跳转到城市选择页面  同时给搜索框和地图图标也要绑定路由跳转页面*/}
               <div className="location" onClick={() => this.props.history.push('/citylist')}>
                 <span className="name">{this.state.curCityName}</span>
                 <i className="iconfont icon-arrow" />
               </div>
               {/* 搜索表单 */}
               <div className="form" onClick={() => this.props.history.push('/search')}>
                 <i className="iconfont icon-seach"/>
                 <span className="text">请输入小区或地址</span>
               </div>
             </Flex>
             {/* 右侧地图图标 */}
             <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}/>
          </Flex>
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>
        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组
            <span className="more">更多</span>
          </h3>
          {/* 宫格组件  this.state.groups拿到租房小组数据*/}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯  */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
