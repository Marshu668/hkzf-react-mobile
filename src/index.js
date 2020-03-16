import React from 'react';
import ReactDOM from 'react-dom';


// 导入antd-mobile样式
import 'antd-mobile/dist/antd-mobile.css'
// 导入react-virtualized组件的样式
import 'react-virtualized/styles.css'
// 导入字体图表库的样式文件
import './assets/fonts/iconfont.css'
// 注意：我们自己写到全局到样式需要放在组件库的样式的后面导入，这样样式才会生效
import './index.css';

// 应该将组件导入放在样式导入后面，避免样式覆盖的问题
import App from './App';


ReactDOM.render(<App />, document.getElementById('root'));


