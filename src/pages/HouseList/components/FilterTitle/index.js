import React from "react";

import { Flex } from "antd-mobile";

import styles from "./index.module.css";

// 条件筛选栏标题数组：
const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" }
];

// 通过props接收，高亮状态对象 titleSelectedStatus,子组件接收，父组件就要传递
export default function FilterTitle({ titleSelectedStatus,onClick }) {
  return (
    <Flex align="center" className={styles.root}>
      {/* 遍历titleList数组 */}
      {
       titleList.map(item => {
        //  item.type就是type的类型，在这就可以访问area的值，area是一个布尔值
        const isSelected = titleSelectedStatus[item.type]
         return (
          //  绑定单击事件，并且调用父组件的方法，调用父组件传递过来的onClick(),并且把类型item.type作为参数传递进去，既然是父组件的方法就要通过props来接收，在上面声明
          <Flex.Item key={item.type} onClick={ () => onClick(item.type)}>
            {/* 选中类名： selected */}
            {/* 在这里声明一个三元表达式，如果isSelected值为true就添加selected，如果不为true就是‘’，即选中就为高亮 */}
            <span className={[styles.dropdown,isSelected ? styles.selected: ''].join(" ")}>
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        );
      })}
    </Flex>
  );
}
