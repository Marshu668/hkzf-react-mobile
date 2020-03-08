import React from "react";
// 导入自己的样式文件
import  './index.css'
// 导入路由
import { Route } from "react-router-dom";
// 导入子组件
import News from "../News";
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'

// 导入tabbar
import { TabBar } from "antd-mobile";


// TabBar数据
const tabItems = [
    {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
      },
      {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/list'
      },
      {
        title: '资讯',
        icon: 'icon-infom',
        path: '/home/news'
      },
      {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
      }
]

export default class Home extends React.Component {
//   在tabbar中做一些状态的设置
  state = {
    // 哪个显示高亮效果 默认选中的TabBar菜单项  路由地址是多少，对应的菜单显示高亮
    selectedTab: this.props.location.pathname
  }
//   放置tabBar的数据内容，进行遍历数据，渲染tabBar.item  
renderTabBarItem(){
    return tabItems.map(item => <TabBar.Item
        title={item.title}
        key={item.title}
        icon={
          <i  className={`iconfont ${item.icon}`}/>
        }
        selectedIcon={
          <i  className={`iconfont ${item.icon}`}/>
        }
      //   被选中的时候自己就显示高亮 selected 就是拿selectedTab和自己的路由进行对比，对比是对的就显示页面
        selected={this.state.selectedTab === item.path}
      //   点击菜单的时候也显示高亮
        onPress={() => {
          // 把页面的路由重新赋值给selectedTab
          this.setState({
            selectedTab: item.path
          })
          // 路由切换  通过编程式导航实现点击之后页面跳转
          this.props.history.push(item.path)
        }}
        data-seed="logId"
      >
      </TabBar.Item>)
}
  render() {
    return (
      <div className="home">
        {/* 首页 */}
        {/* 在外层父路由里面展示子路由实现嵌套路由 */}
        {/* 渲染子路由，嵌套路由的出口，子路由的出口在父路由里面 */}
        {/* exact 设置默认路由   */}
        <Route path="/home/news" component={News} />
        <Route exact path="/home" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/profile" component={Profile} />

       
        {/* TabBar的位置 */}
          <TabBar
            noRenderContent={true} 
            unselectedTintColor="#888"
            tintColor="#21b97a"
            barTintColor="white"
          >
           {/* 调用遍历数据之后的renderTabBarItem方法 */}
           {this.renderTabBarItem()}
          </TabBar>
      </div>
    );
  }
} 
