import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 导入antd-mobile样式
import 'antd-mobile/dist/antd-mobile.css'
// 导入字体图表库的样式文件
import './assets/fonts/iconfont.css'
// 注意：我们自己写到全局到样式需要放在组件库的样式的后面导入，这样样式才会生效
import './index.css';



ReactDOM.render(<App />, document.getElementById('root'));


