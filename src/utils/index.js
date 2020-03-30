// 导入axios
import axios from 'axios'

// 创建并导出获取定位城市的函数 getCurrentCity
export const getCurrentCity = () => {
  // 判断localStorage本地存储中是否有定位城市，获取本地存储的值
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'));
  if (!localCity) {
    //   如果localStorage没有  就使用首页中获取定位城市的代码来获取，并且存储到本地存储中，然后返回该城市数据
    // 使用promis解决异步的问题
    return new Promise((resolve,reject) => {
        const curCity = new window.BMap.LocalCity();
    curCity.get(async res => {
        try{
            console.log(res);
            const result = await axios.get(
              `http://localhost:8080/area/info?name=${res.name}`
            )
          //   存储到本地存储中,result.data.body 是一个对象，要转化成字符串
          localStorage.setItem('hkzf_city',JSON.stringify(result.data.body))
          // 返回该城市数据
        //   获取成功调用
          resolve(result.data.body)
        } catch(e){
            // 异步操作失败了调用它
            // 获取定位城市失败
            reject(e)
        }

    });
    })
  }
//   如果有  直接返回本地存储中的城市数据
//  因为上面为了处理异步操作，使用了promise，因为，为了该函数返回值的统一，此处，也应该使用promise，但是此处的promise不会失败，所以，只需要返回一个成功的promise即可
 return Promise.resolve(localCity)
};

export {API} from './api'
export {BASE_URL} from './url'