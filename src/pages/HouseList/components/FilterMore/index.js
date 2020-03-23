import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    // 添加状态表示选中项的值
    selectedValues: this.props.defaultValue
  };
  // 点击之后触发的行为，事件处理程序
  onTagClick(value) {
    const { selectedValues } = this.state;
    // 使用扩展运算符，展开旧数组，创建新数组
    const newSelectedValues = [...selectedValues];
    if (newSelectedValues.indexOf(value) <= -1) {
      //  如果当前 项不存在，没有当前项的值，就添加到新数组
      newSelectedValues.push(value);
    } else {
      // 如果点击的时候，点击该项存在，那就把它删掉，说明是点击了第二次，点击第二次是筛除该项的行为，根据当前索引号来进行删除
      const index = newSelectedValues.findIndex(item => item === value);
      newSelectedValues.splice(index, 1);
    }
    // 处理完毕行为之后要更新状态
    this.setState({
      selectedValues: newSelectedValues
    });
  }
  // 渲染标签
  // 通过参数data拿到这些数据，去遍历这个数据，为每一个数据生成一个tab标签，再将它渲染在组件中
  renderFilters(data) {
    const { selectedValues } = this.state;
    // 高亮类名： styles.tagActive
    return data.map(item => {
      // 判断当前 数组中有没有当前的选中项，是不是>-1，是的话就是有就添加高亮，不是的话就为空
      const isSelected = selectedValues.indexOf(item.value) > -1;
      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")}
          onClick={() => this.onTagClick(item.value)}
        >
          {item.label}
        </span>
      );
    });
  }
  // 取消按钮的事件处理程序
  onCancel = () => {
    //  点击取消按钮的时候，清空所以选中项的值
    this.setState({
      selectedValues: []
    });
  };
  // 确定按钮的事件处理程序
  // type,onSave都是父组件通过props传递给子组件的
  onOk = () => {
    const { type, onSave } = this.props;
    //  onSave是父组件中的方法，在这里调用进行确定按钮也就是选中项和type的数据传递
    onSave(type, this.state.selectedValues);
  };
  render() {
    // 把删选数据从props解构出来
    const {
      data: { roomType, oriented, floor, characteristic },
      onCancel,
      type
    } = this.props;

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {/* 这里的onCancel是父组件点击遮罩层关闭对话框的方法 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onCancel}
          onOk={this.onOk}
        />
      </div>
    );
  }
}
