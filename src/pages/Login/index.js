import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

// 导入withFormik，使用withFormik高阶组件包裹Login组件
import {withFormik, Form, Field,ErrorMessage} from 'formik'

// 导入yup  表单校验
import * as Yup from 'yup'

// 导入发送请求的代码
import {API} from '../../utils'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：   一个是账号的   一个是密码的
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
    // 自己之前写的就没用了
//   state = {
//       username:'',
//       password: ''
//   }
// //   获取并更新username的值
//   getUserName = (e) => {
//      this.setState({
//          username:e.target.value
//      })
//   }  
//   //   获取并更新password的值
//   getPassword = (e) => {
//     this.setState({
//         password:e.target.value
//     })
//   }
// //   表单提交之后触发的事件处理程序
//   handleSubmit = async e => {
//     //   阻止表单提交时的默认行为
//     e.preventDefault();
//     // 获取账号和密码
//     const {username, password} = this.state 
//     // 发送请求
//     const res = await API.post('/user/login', {
//         username,
//         password
//       })
//       console.log('登录结果：', res)
//     const { status, body, description} = res.data
//     if(status === 200 ){
//         // 登录成功  把token保存到本地存储中hkzf_token，返回上一个页面
//        localStorage.setItem('hkzf_token', body.token)
//        this.props.history.go(-1)
//     }else{
//         // 登录失败    提示错误信息
//         Toast.info(description,2 ,null,false)
//     }
//   }


  render() {
    // 自己之前写的就没用了
    //  const {username, password} = this.state 

    //  通过props  获取高阶组件传递进来的属性, 去掉所有的props
    // const {values, handleSubmit, handleChange,handleBlur, errors, touched} = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
            {/* 添加提交之后事件处理程序 */}
            {/* 使用handleSubmit 设置为表单的onSubmit */}
          <Form>
            {/* 账号 */}
            <div className={styles.formItem}>
            {/* 使用 Filed 代替 input */}
              <Field className={styles.input} name="username"
                placeholder="请输入账号"></Field>
              {/* <input
                className={styles.input}
                // 使用values 提供的值， 设置表单元素的value
                value = {values.username}
                // 绑定事件处理程序
                // 使用handleChange 设置表单元素的onChange
                // 在给表单
                onChange={handleChange}
                // 失去焦点的时候触发 的事件
                onBlur = {handleBlur}
                name="username"
                placeholder="请输入账号"
              /> */}
            </div>
            {/* 失去焦点的事件才开始校验，判断用户输入的是否符合校验规则，不符合展示错误消息 */}
            <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>

            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* 密码  */}
            <div className={styles.formItem}>
            <Field className={styles.input}  name="password"
                type="password"
                placeholder="请输入密码"></Field>
              {/* <input
                className={styles.input}
                value={values.password}
                onChange={handleChange}
                onBlur = {handleBlur}
                name="password"
                type="password"
                placeholder="请输入密码"
              /> */}
            </div>
           <ErrorMessage className={styles.error} name="password" component="div"></ErrorMessage>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 使用withFormik高阶组件包装 Login组件，为Login组件提供属性和方法,withFormik()(Login)第一个阔号是传入配置项的，要把高阶组件返回的组件赋值给Login，返回的是高阶组件包装后的组件
Login = withFormik({
  // 提供状态   数据
    mapPropsToValues: ()  => ({username : '' , password :''}),
    // 添加表单校验规则
    validationSchema: Yup.object().shape({
       username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
       password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
    }),
    // 表单的提交事件
    handleSubmit:async (values,{props}) => {
      console.log('formik',values);
       // 获取账号和密码
    const {username, password} = values
    // 发送请求
    const res = await API.post('/user/login', {
        username,
        password
      })
      console.log('登录结果：', res)
    const { status, body, description} = res.data
    if(status === 200 ){
        // 登录成功  把token保存到本地存储中hkzf_token，返回上一个页面
       localStorage.setItem('hkzf_token', body.token)
        // 无法在该方法中，通过this来获取到路由信息，所以需要通过handleSubmit:async (values,{props})，第二个对象参数中获取到props来使用props
       props.history.go(-1)
    }else{
        // 登录失败    提示错误信息
        Toast.info(description,2 ,null,false)
    }
    }
})(Login)


export default Login
