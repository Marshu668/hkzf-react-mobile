import React from "react";

// 导入axios 
import axios from 'axios'

// 导入antd-mobile组件
import { NavBar } from "antd-mobile";
// 导入样式
import './index.scss'

// 导入utils中获取当前定位城市的方法
import { getCurrentCity} from '../../utils'

// 数据格式化的方式,将数据格式化成以拼音开头字母分类的方式。把原数据数组键值对格式("属性":"属性值")处理成一个可以分类的同一个字母开头的城市都放在一起为对象的数据格式(a开头:[{}, {}])，因为对象是无法分类的，我们获取到的分类的城市信息是没办法自行排序的，所以要把它最终变成一个数组的形式，进行展示，也就是最终的cityIndex的格式
// 把数据res.data.body作为参数传递给我们的方法formatCityData 
const formatCityData = (list) => {
    const cityList ={}
    // const cityIndex =[]
    
    // 遍历list数组
    list.forEach(item => {
       // 获取每一个城市的首字母
       const first = item.short.substr(0,1)
       // 判断cityList中是否有以这个字母开头的分类
       if(cityList[first]){
            // 如果有   直接往这个分类中push数据
            // cityList[first] => [{},{}]
            cityList[first].push(item)
       }else{
          // 如果没有 就先创建一个数组，然后，把当前城市信息添加到数组中
          cityList[first] =[item]
       }
     
      
    })
    // 获取索引排列的字母数据,Object.keys通过这个方法遍历我们的cityList对象，把获取到到数组进行sort排序，最终得到一个按照字母排序的数据，通过它还可以渲染出右侧字母都在一起也就是右侧ABCD···排序的那一栏
    const cityIndex= Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex
    }
}


export default class CityList extends React.Component {
//   希望一进入页面时 就拿到数据
  componentDidMount(){
     this.getCityList()
  }
//   获取城市列表数据
// 将请求地址作为参数传递进来
  async getCityList(){
     const res = await axios.get(`http://localhost:8080/area/city?level=1`)
     console.log('i am ' ,res);
     const {cityList,cityIndex} =formatCityData(res.data.body)
     
    //  获取热门城市数据
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // 往citylist里面添加一个属性为hot的值
    cityList['hot'] = hotRes.data.body
    // 将索引添加到cityindex中，索引号为0的
    cityIndex.unshift('hot')
    // 获取当前定位城市
    const curCity = await getCurrentCity()
    // 将当前定位城市数据添加到cityList中
    cityList['#'] = [curCity]
    // 将当前定位城市的索引添加到cityIndex中
    cityIndex.unshift('#')
    console.log(cityList,cityIndex,curCity);

  }
  render() {
    return (
      <div className="citylist">
        {/* 顶部导航栏 */}
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
         城市选择
        </NavBar>
      </div>
    );
  }
}
