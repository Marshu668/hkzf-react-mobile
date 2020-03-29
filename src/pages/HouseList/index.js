import React from "react";
import { Flex, Toast } from "antd-mobile";
// 导入当前定位城市的方法  在utils里面的
import {getCurrentCity} from '../../utils'
// 导入list组件  让List跟随页面滚动的高阶组件WindowScroller
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from "react-virtualized";
// 导入搜索框导航栏组件
import SearchHeader from "../../components/SearchHeader";
// 导入筛选栏父组件 Filter
import Filter from "./components/Filter";
// 导入封装的HouseItem组件
import HouseItem from "../../components/HouseItem";
// 导入封装的NoHouse组件
import NoHouse from '../../components/NoHouse'
// 导入API 发起axios请求
import { API } from "../../utils/api";
// 导入基础路径
import { BASE_URL } from "../../utils/url";
// 导入吸顶组件
import Sticky from "../../components/Sticky";
// 导入样式
import styles from "./index.module.css";

// 获取当前定位城市信息
// const { label } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends React.Component {
  /* 
    1 在 componentDidMount 钩子函数中，调用 searchHouseList，来获取房屋列表数据。
    2 给 HouseList 组件添加属性 filters，值为对象。
    3 添加两个状态：list 和 count（存储房屋列表数据和总条数）。
    4 将获取到的房屋数据，存储到 state 中。
  */

  state = {
    // 列表数据
    list: [],
    // 总条数
    count: 0,
    // 数据是否加载
    isLoading:false
  };

  // 初始化默认值
  label = ''
  value = ''

  // 初始化实例属性
  filters = {};

  //  一进页面就能够获取数据
  // 想要什么内容只要一进页面就执行，就在这调用
 async componentDidMount() {
   const {label, value} =  await getCurrentCity()
   this.label = label
   this.value = value
   this.searchHouseList();  this.searchHouseList();
  }
  /* 
    1 将筛选条件数据 filters 传递给父组件 HouseList。
    2 HouseList 组件中，创建方法 onFilter，通过参数接收 filters 数据，并存储到 this 中。
    3 创建方法 searchHouseList（用来获取房屋列表数据）。
    4 根据接口，获取当前定位城市 id 参数。
    5 将筛选条件数据与分页数据合并后，作为接口的参数，发送请求，获取房屋数据。
  */

  // 用来获取房屋列表数据
  async searchHouseList() {
    // 获取当前定位城市id
    // const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    // 只要发送请求，就开启isLoading，表示数据要加载了
    this.setState({
      isLoading:true
    })
    // 开启loading加载提示
    Toast.loading("加载中····", 0, null, false);
    const res = await API.get("/houses", {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    });
    const { list, count } = res.data.body;
    // 数据加载完成 关闭loading
    Toast.hide();
    // 提示房源数据
    // 解决没有房源也弹窗的bug
    // 没有房源就不提示 共找到${count}套房源
    if (count !== 0) {
      Toast.info(`共找到${count}套房源`, 2, null, false);
    }

    console.log(res);
    this.setState({
      list,
      count,
      // 数据加载完成就为false状态
      isLoading:false
    });
  }

  // 接收 Filter 组件中的筛选条件数据
  onFilter = filters => {
    // 数据展示之后，浏览到中间，重新选择再重新渲染展示的时候，不是直接回到数据页面顶部的，使用window.scrollTo方法，回到页面顶部
    window.scrollTo(0,0)
    this.filters = filters;

    // console.log('HouseList：', this.filters)

    // 调用获取房屋数据的方法
    this.searchHouseList();
  };
  /* 
    1 封装 HouseItem 组件，实现 Map 和 HouseList 页面中，房屋列表项的复用。
    2 使用 HouseItem 组件改造 Map 组件的房屋列表项。
    3 使用 react-virtualized 的 List 组件渲染房屋列表（参考 CityList 组件的使用）。
  */

  //  渲染房屋每一个列表的结构
  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state;
    const house = list[index];

    console.log(house);
    // 判断 house 是否存在,就是判断往下划能不能加载出数据
    // 如果不存在，就渲染 loading 元素占位，就是类名为loading的样式
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      );
    }
    return (
      // HouseItem里面有什么就要传入什么数据
      <HouseItem
        key={key}
        onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    );
  };
  // 判断列表中的每一行是否加载完成
  // InfiniteLoader文档的用法直接copy过来，
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  };

  /* 
    加载更多房屋列表数据：

    1 在 loadMoreRows 方法中，根据起始索引和结束索引，发送请求，获取更多房屋数据。
    2 获取到最新的数据后，与当前 list 中的数据合并，再更新 state，并调用 Promise 的 resolve()。
    3 在 renderHouseList 方法中，判断 house 是否存在。
    4 不存在的时候，就渲染一个 loading 元素（防止拿不到数据时报错）。
    5 存在的时候，再渲染 HouseItem 组件。
  */
  // 用来获取更多房屋列表数据
  // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让Promise对象的状态变为已完成。
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    //   .then(response => {
    //     // Store response data in list...
    //   })
    console.log(startIndex, stopIndex);
    // 获取当前定位城市id
    // const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    return new Promise(resolve => {
      API.get("/houses", {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        // console.log('loadMoreRows：', res)
        // 将新数据和旧数据展开再合并，成一个新数组
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        });

        // 数据加载完成时，调用 resolve 即可
        resolve();
      });
    });
  };

  // 渲染房屋列表数据
  renderList() {
    // 将this.state.count解构处理
    const { count , isLoading} = this.state;
    // 在数据加载完成后再选择性的展示这个页面，再进行count的判断
    // 如果数据加载中，则不展示NoHouse组件，数据加载完成后，并且该选择没有房源，再展示NoHouse组件,
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧～～</NoHouse>;
    }
    return (
      //  {/* InfiniteLoader滚动房屋列表时，划到底部时，动态加载更多房屋数据 */}
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {/* onRowsRendered设置list组件的方法，registerChild注册list组件，作为组件的ref使用 */}
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                    width={width} // 视口的宽度
                    height={height} // 视口的高度
                    rowCount={count} // List列表项的行数，列表一共多少行数据
                    rowHeight={120} // 每一行的高度
                    rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  }
  render() {
    // 将this.state.count解构处理
    // const { count } = this.state;
    return (
      <div className={styles.root}>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader cityName={this.label} className={styles.SearchHeader} />
        </Flex>

        {/* 条件筛选栏 */}
        {/* 想要哪个内容具有吸顶功能，就用Sticky包裹那个元素，让那个组件成为Sticky的子节点 */}
        {/* 把吸顶的高度在这里写，再传给Sticky，高度是变化点 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItem}>
          {/* 渲染结构 */}
          {this.renderList()}
        </div>
      </div>
    );
  }
}
