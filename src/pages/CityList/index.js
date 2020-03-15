import React from "react";

// 导入axios
import axios from "axios";

// 导入antd-mobile组件
import { NavBar } from "antd-mobile";

// 导入react-virtualized中list组件
import { List, AutoSizer } from "react-virtualized";

// 导入样式
import "./index.scss";

// 导入utils中获取当前定位城市的方法
import { getCurrentCity } from "../../utils";

// 数据格式化的方式,将数据格式化成以拼音开头字母分类的方式。把原数据数组键值对格式("属性":"属性值")处理成一个可以分类的同一个字母开头的城市都放在一起为对象的数据格式(a开头:[{}, {}])，因为对象是无法分类的，我们获取到的分类的城市信息是没办法自行排序的，所以要把它最终变成一个数组的形式，进行展示，也就是最终的cityIndex的格式
// 把数据res.data.body作为参数传递给我们的方法formatCityData
const formatCityData = list => {
  const cityList = {};
  // const cityIndex =[]

  // 遍历list数组
  list.forEach(item => {
    // 获取每一个城市的首字母
    const first = item.short.substr(0, 1);
    // 判断cityList中是否有以这个字母开头的分类
    if (cityList[first]) {
      // 如果有   直接往这个分类中push数据
      // cityList[first] => [{},{}]
      cityList[first].push(item);
    } else {
      // 如果没有 就先创建一个数组，然后，把当前城市信息添加到数组中
      cityList[first] = [item];
    }
  });
  // 获取索引排列的字母数据,Object.keys通过这个方法遍历我们的cityList对象，把获取到到数组进行sort排序，最终得到一个按照字母排序的数据，通过它还可以渲染出右侧字母都在一起也就是右侧ABCD···排序的那一栏
  const cityIndex = Object.keys(cityList).sort();

  return {
    cityList,
    cityIndex
  };
};

// List data as an array of strings
// 列表数据的数据源
// const list = [
//   "Brian Vaughn"
//   // And so on...
// ];

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

// 封装处理字母索引的方法
const formatCityIndex = letter => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      //  将字母转化成大写
      return letter.toUpperCase();
  }
};

export default class CityList extends React.Component {
  state = {
    // 将cityList，cityIndex添加为组件的状态数据
    cityList: {},
    cityIndex: [],
    // 指定右侧字母列表需要高亮的索引号
    activeIndex: 0
  };
  //   希望一进入页面时 就拿到数据
  componentDidMount() {
    this.getCityList();
  }

  //   获取城市列表数据
  // 将请求地址作为参数传递进来
  async getCityList() {
    const res = await axios.get(`http://localhost:8080/area/city?level=1`);
    console.log("i am ", res);
    const { cityList, cityIndex } = formatCityData(res.data.body);

    //  获取热门城市数据
    const hotRes = await axios.get("http://localhost:8080/area/hot");
    // 往citylist里面添加一个属性为hot的值
    cityList["hot"] = hotRes.data.body;
    // 将索引添加到cityindex中，索引号为0的
    cityIndex.unshift("hot");
    // 获取当前定位城市
    const curCity = await getCurrentCity();
    // 将当前定位城市数据添加到cityList中
    cityList["#"] = [curCity];
    // 将当前定位城市的索引添加到cityIndex中
    cityIndex.unshift("#");
    console.log(cityList, cityIndex, curCity);

    // 更新当前数据
    this.setState({
      cityList,
      cityIndex
    });
  }

  // 渲染每一行数据的渲染函数
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否在滚动中
    isVisible, // 当前项在list中是可见的
    style // 重点属性，一定要给每一行数据添加该属性，鉴定每一行的位置
  }) => {
    // 获取每一行的字母索引
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    //  获取指定字母索引下的城市列表数据

    return (
      // 返回值就是最终渲染在页面的内容
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map(item => (
          <div className="name" key={item.value}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  //  创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    //  索引标题高度 + 城市数量 * 城市名称的高度
    const { cityIndex, cityList } = this.state;
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
  };

  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    //  获取到cityindex，并遍历，实现渲染
    return this.state.cityIndex.map((item, index) => (
      <li className="city-index-item" key={item}>
        <span
          className={this.state.activeIndex === index ? "index-active" : ""}
        >
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
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

        {/* 城市列表 */}
        {/* AutoSizer让屏幕占满内容 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>

        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
