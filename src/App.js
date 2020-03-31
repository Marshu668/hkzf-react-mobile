import React from "react";
// 导入路由
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'

// 导入首页和城市选择两个组件，页面
import Home  from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import HouseDetail from "./pages/HouseDetail";
// 登录
import Login from "./pages/Login"
// 注册
import Registe from './pages/Registe'

// 房源发布
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

// 导入登录访问控制，什么页面必须登录之后才可以查看 就可以使用这个
import AuthRoute from './components/AuthRoute'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置导航菜单 入口 通过点击去到哪个页面 */}
        {/* <Link to="/home">首页</Link> */}
        {/* <br /> */}
        {/* <Link to="/citylist">城市选择</Link> */}

        {/* 配置路由 出口 点击之后去到哪个要展示的页面*/}
        {/* 路由重定向redirect,to要跳转到的页面，重定向到首页。render属性是一个函数prop，用于指定要渲染的内容 */}
        <Route path="/" exact render={() => <Redirect to="/home" />} ></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/map" component={Map} />
        {/* 房源详情的路由规则 */}
        <Route path="/detail/:id" component={HouseDetail}/>
        {/* 登录页面 */}
        <Route  path="/login" component={Login}   />
        <Route path="/registe" component={Registe} />

        {/* 配置登录后，才能访问的页面 */}
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </div>
    </Router>
  );
}

export default App;
