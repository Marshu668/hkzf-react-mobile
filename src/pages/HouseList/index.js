import React from "react";
import { Flex } from "antd-mobile";
// 导入搜索框导航栏组件
import SearchHeader from "../../components/SearchHeader";
// 导入筛选栏父组件 Filter
import Filter from './components/Filter'

// 导入样式
import styles from "./index.module.css";


// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
          <SearchHeader cityName={label} className={styles.SearchHeader} />
        </Flex>
        {/* t条件筛选栏 */}
        <Filter />
      </div>
    );
  }
}
