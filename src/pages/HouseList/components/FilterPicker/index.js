import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter";

// const province = [
//   {
//     label: '北京',
//     value: '01',
//     children: [
//       {
//         label: '东城区',
//         value: '01-1'
//       },
//       {
//         label: '西城区',
//         value: '01-2'
//       },
//       {
//         label: '崇文区',
//         value: '01-3'
//       },
//       {
//         label: '宣武区',
//         value: '01-4'
//       }
//     ]
//   },
//   {
//     label: '浙江',
//     value: '02',
//     children: [
//       {
//         label: '杭州',
//         value: '02-1',
//         children: [
//           {
//             label: '西湖区',
//             value: '02-1-1'
//           },
//           {
//             label: '上城区',
//             value: '02-1-2'
//           },
//           {
//             label: '江干区',
//             value: '02-1-3'
//           },
//           {
//             label: '下城区',
//             value: '02-1-4'
//           }
//         ]
//       },
//       {
//         label: '宁波',
//         value: '02-2',
//         children: [
//           {
//             label: 'xx区',
//             value: '02-2-1'
//           },
//           {
//             label: 'yy区',
//             value: '02-2-2'
//           }
//         ]
//       },
//       {
//         label: '温州',
//         value: '02-3'
//       },
//       {
//         label: '嘉兴',
//         value: '02-4'
//       },
//       {
//         label: '湖州',
//         value: '02-5'
//       },
//       {
//         label: '绍兴',
//         value: '02-6'
//       }
//     ]
//   }
// ]

export default class FilterPicker extends Component {
  // 添加状态value用于获取PickerView组件的选中值

  state = {
    // 父组件把什么样的值给子组件，子组件就把什么值设置为默认
    value: this.props.defaultValue
  };
  render() {
    // 拿到父组件传过来的onCancel方法 和 需要传递过来的方法和属性，进行调用
    const { onCancel, onSave, data, cols, type } = this.props;
    return (
      <>
        {/* 选择器组件： */}
        {/* 添加onChange，通过参数获取到点击的选中值，并更新状态value */}
        {/* 一定要设置PickerView组件value属性的值，为当前选中状态的值，否则，无法实现切换点击的选中项 */}
        <PickerView
          data={data}
          value={this.state.value}
          cols={cols}
          onChange={val => {
            this.setState({
              value: val
            });
          }}
        />

        {/* 底部按钮 */}
        {/* 确定按钮和取消按钮 被点击进行对话框隐藏 */}
        <FilterFooter
          onCancel={() => onCancel(type)}
          onOk={() => onSave(type, this.state.value)}
        />
      </>
    );
  }
}
