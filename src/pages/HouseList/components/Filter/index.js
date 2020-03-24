import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

// 导入自定义的API  axios请求
import { API } from "../../../../utils/api";

import styles from "./index.module.css";

// 标题高亮状态
// true表示高亮，false表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
};

// 提供FilterPicker和FilterMore组件的选中值的状态
// mode，price被选中就是非null，就是有被选中的值，所以他们默认未选中的就是null
// 但是area有两个需要选择的项
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: []
};

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制FilterPicker和FilterMore对话框展示或隐藏，
    openType: "",
    // 所有筛选条件数据
    filtersData: {},
    // 筛选条件的选中值
    selectedValues
  };

  componentDidMount() {
    // 获取到body
    this.htmlBody = document.body
    this.getFilterData();
  }

  // 封装获取  所有筛选条件  的方法
  async getFilterData() {
    // 获取 当前定位城市的id  解构为value
    const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    const res = await API.get(`/houses/condition?id=${value}`);
    // 更新数据状态
    this.setState({
      filtersData: res.data.body
    });
  }

  // 被点击的标题菜单实现高亮，使用箭头函数保证this指向问题,应该指向 父组件
  // 父组件通过type接收到子组件传递过来的类型item.type
  onTitleClick = type => {
    // 给body添加样式, 这样每次点开的时候就有样式设置的效果，就不会滚动了
    this.htmlBody.className = 'body-fixed'
    const { titleSelectedStatus, selectedValues } = this.state;
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    // 遍历 标题选中状态 对象
    // 通过Object.keys() 得到的是['area','mode','price','more']
    // key代表的是每一个项
    Object.keys(titleSelectedStatus).forEach(key => {
      //  key 表示数组的每一项，此处，就是每个标题的type值
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true;
        //  如果当前代码执行了，后面的代码就不会执行了
        return;
      }
      // 其他标题
      // 拿到当前选中类型的值
      const selectedVal = selectedValues[key];
      // 判断每一个当前选中值跟默认值是否相同
      if (
        key === "area" &&
        (selectedVal.length !== 2 || selectedVal[0] !== "area")
      ) {
        //  高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "mode" && selectedVal[0] !== "null") {
        //  高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "price" && selectedVal[0] !== "null") {
        //  高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "more" && selectedVal.length !== 0) {
        //  高亮
        newTitleSelectedStatus[key] = true;
      } else {
        //  更多选择项FilterMore组件
        newTitleSelectedStatus[key] = false;
      }
    });
    this.setState({
      // 展示对话框
      openType: type,
      // 使用新的标题选中状态来更新  旧的状态
      titleSelectedStatus: newTitleSelectedStatus
    });

    // this.setState(prevState => {
    //   return {
    //     titleSelectedStatus: {
    //       // 使用扩展运算符，获取当前对象中所有属性的值，再给他重新修改值，后面的值会把前面的值给覆盖掉
    //       ...prevState.titleSelectedStatus,
    //       [type]: true
    //     },

    //     // 展示对话框
    //     openType: type
    //   };
    // });
  };

  //  隐藏对话框
  // 因为oncancel这个方法中，没有type这个参数，所以就要在调用oncancel这个方法时，来传递type参数
  onCancel = type => {
    this.htmlBody.className = ''
    // 菜单高亮的逻辑处理
    const { titleSelectedStatus, selectedValues } = this.state;
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    // 拿到当前选中类型的值
    const selectedVal = selectedValues[type];
    // 判断每一个当前选中值跟默认值是否相同
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else {
      //  更多选择项FilterMore组件
      newTitleSelectedStatus[type] = false;
    }
    this.setState({
      openType: "",
      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus
    });
  };

  // 点击onsave按钮  隐藏对话框
  // 接收子组件FilterMore点击确定按钮之后传递过来的选中值，并更新状态selectedValues
  onSave = (type, value) => {
    // 点击确定或者取消  让该样式消失，页面恢复滚动
    this.htmlBody.className = ''
    // 菜单高亮的逻辑处理
    const { titleSelectedStatus } = this.state;
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };
    // 拿到当前选中类型的值
    const selectedVal = value;
    // 判断每一个当前选中值跟默认值是否相同
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      //  高亮
      newTitleSelectedStatus[type] = true;
    } else {
      //  更多选择项FilterMore组件
      newTitleSelectedStatus[type] = false;
    }

    /* 
      组装筛选条件：

      1 在 Filter 组件的 onSave 方法中，根据最新 selectedValues 组装筛选条件数据 filters。
      2 获取区域数据的参数名：area 或 subway（选中值数组的第一个元素）。
      3 获取区域数据的值（以最后一个 value 为准）。
      4 获取方式和租金的值（选中值的第一个元素）。
      5 获取筛选（more）的值（将选中值数组转化为以逗号分隔的字符串）。

      {
        area: 'AREA|67fad918-f2f8-59df', // 或 subway: '...'
        mode: 'true', // 或 'null'
        price: 'PRICE|2000',
        more: 'ORIEN|80795f1a-e32f-feb9,ROOM|d4a692e4-a177-37fd'
      }
    */
    // 点击确定按钮拼装选中的值
    const newSelectedValues = {
      ...this.state.selectedValues,
      // 只更新当前 type 对应的选中值
      [type]: value
    };

    console.log("最新的选中值：", newSelectedValues);
    const { area, mode, price, more } = newSelectedValues;

    // 声明 筛选条件数据
    const filters = {};

    // 区域  area
    const areaKey = area[0];
    let areaValue = "null";
    if (area.length === 3) {
      areaValue = area[2] !== "null" ? area[2] : area[1];
    }
    filters[areaKey] = areaValue;

    // 方式和租金   mode  price
    filters.mode = mode[0];
    filters.price = price[0];

    // 更多筛选条件 more
    filters.more = more.join(",");

    console.log(filters);
   // 调用父组件中的方法，来将筛选数据传递给父组件
   this.props.onFilter(filters)

    this.setState({
      openType: "",
      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues
      // 当前type是谁 就把当前谁的值进行更新
      // selectedValues: { 
      //   // 拿到原来对象的所有值
      //   ...this.state.selectedValues,
      //   // 只更新当前type对应的选中值
      //   [type]: value
      // }
    });
  };

  // 渲染FilterPicker组件的方法
  renderFilterPicker() {
    // 从state中解构出openType
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state;
    // 如果opentype不等于三个存在的标题的数据类型，则为null ，否则渲染FilterPicker
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    // 根据opentype 来拿到当前筛选条件数据
    let data = [];
    // 展示数据的列数
    let cols = 3;
    // 获取当前type的默认值
    let defaultValue = selectedValues[openType];
    switch (openType) {
      case "area":
        // 获取到区域数据
        data = [area, subway];
        cols = 3;
        break;

      case "mode":
        data = rentType;
        cols = 1;
        break;

      case "price":
        data = price;
        cols = 1;
        break;
      default:
        break;
    }
    // 将数据data传递给组件data={data}
    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    );
  }
  // 渲染FilterMore组件的方法
  renderFilterMore() {
    //  从filtersData中获取数据{roomType,oriented,floor,characteristic}，通过props把条件删选数据传递给data属性再通过data属性传递给FilterMore组件
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state;
    if (openType !== "more") {
      return null;
    }
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    };
    const defaultValue = selectedValues.more;
    // 当opentype等于more的时候渲染这个组件，不等于的时候就返回空
    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        defaultValue={defaultValue}
      />
    );
  }
  render() {
    // 从state中将titleSelectedStatus解构出来，再传递给当前的组件
    const { titleSelectedStatus, openType } = this.state;

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* 遮罩层的显示与隐藏也要进行判断 */}
        {openType === "area" || openType === "mode" || openType === "price" ? (
          <div
            className={styles.mask}
            onClick={() => this.onCancel(openType)}
          />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {/* FilterPicker组件的展示和隐藏的判断 */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
