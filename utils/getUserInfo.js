const app = getApp();

/**
 *
 * @module 获取用户信息
 * ---------------------------------------------------------------
 * 
 * @param gobind: boolean 默认为 true  =>  是否判断有无绑定信息并跳转到相关页面
 * @param latest: boolean 默认为 false =>  是否向服务器请求最新数据
 * 
 * @description 
 * 
 *      latest 为 true 则直接请求服务器最新数据
 * 
 *      判断App.js 是否存储用户信息（是否为第一次调用）
 *        
 *          第一次调用：
 *              监测用户登录状态是否过期：
 *                    未过期 => 获取本地存储用户信息并返回成功
 *                    已过期 => 调用登录方法，获取用户信息存储至本地并返回
 *          不是第一次：
 *              获取App.userInfo 并返回
 *
 * ---------------------------------------------------------------
 * @author phuhoang
 * @time 2018-06-05
 * ---------------------------------------------------------------
 */




/*-------------获取openid-------------------------------------------*/
const Login = (phone,callback) => {
  console.log(phone)
  let that = this;
  wx.login({
    success(res) {
      // console.log(res.code);
      // return false;
      wx.request({
        url: `${app.domain}/memberStatus`,
        method: "POST",
        data: { code: res.code, mobilePhone: phone },
        dataType: 'json',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('获取openID')
          console.log(res)
          app.userInfo.loginMsg = res.data;
          app.userInfo.openid = res.data.openid;
          app.userInfo.status = res.data.status;
          app.userInfo.member = res.data.isMember;
          app.userInfo.babyMsgStatus = res.data.baseInfo;
          app.userInfo.phone = res.data.mobilePhone;
          callback(res.data);
        },
        fail(err) {

        }
      })
    }
  })
  // if (app.userInfo.loginMsg){
  //   callback(app.userInfo.loginMsg);
  //   console.log('有')
  //   console.log(app.userInfo.loginMsg)
  // }else{
  //   console.log('无')
  //   console.log(app.userInfo.loginMsg)
  //   wx.login({
  //     success(res) {
  //       // console.log(res.code);
  //       // return false;
  //       wx.request({
  //         url: `${app.domain}/memberStatus`,
  //         method: "POST",
  //         data: { code: res.code, mobilePhone: phone },
  //         dataType: 'json',
  //         header: {
  //           'Content-Type': 'application/x-www-form-urlencoded'
  //         },
  //         success(res) {
  //           console.log('获取openID')
  //           console.log(res)
  //           app.userInfo.loginMsg = res.data;
  //           app.userInfo.openid = res.data.openid;
  //           app.userInfo.status = res.data.status;
  //           app.userInfo.member = res.data.isMember;
  //           app.userInfo.babyMsgStatus = res.data.baseInfo;
  //           app.userInfo.phone = res.data.mobilePhone;
  //           callback(res.data);
  //         },
  //         fail(err) {

  //         }
  //       })
  //     }
  //   })
  // }
  
}





const Source = (userInfo) => {
  /* --------- 判断是否绑定过信息 未绑定则跳转到绑定信息页 --------- */
  return new Promise((resolve, reject) => {
    if (userInfo.status == 0) {
      wx.navigateTo({
        url: '/pages/user/bind-phone/bind-phone',
      });
      reject(false);
    } else if (userInfo.baseInfo == 0) {
      wx.navigateTo({
        url: '/pages/user/bind-info/bind-info',
      });
      reject(false);
    } else {
      resolve(true)
    }
  })
}

const GetUserInfo = (gobind, latest) => {
  return new Promise((resolve, reject) => {
    if (latest) {
      Login().then(res => {
        if (gobind != false) {
          Source(res).then(success => { resolve(res) }).catch(err => { reject(null) });
        } else {
          resolve(res)
        }
      }).catch(err => {
        reject(null)
      })
    } else if (app.userInfo.openid) {
      if (gobind != false) {
        Source(app.userInfo).then(success => { resolve(app.userInfo) }).catch(err => { reject(null) });
      } else {
        resolve(app.userInfo);
      }
    } else {
      wx.checkSession({
        success(res) {
          try {
            let userInfo = wx.getStorageSync('userInfo');
            app.userInfo = JSON.parse(userInfo);
            if (gobind != false) {
              Source(app.userInfo).then(success => { resolve(app.userInfo) }).catch(err => { reject(null) });
            } else {
              resolve(app.userInfo);
            }
          } catch (e) {
            Login().then(res => {
              if (gobind != false) {
                Source(res).then(success => { resolve(res) }).catch(err => { reject(null) });
              } else {
                resolve(res)
              }
            }).catch(err => {
              reject(null)
            })
          }
        },
        fail() {
          Login().then(res => {
            if (gobind != false) {
              Source(res).then(success => { resolve(res) }).catch(err => { reject(null) });
            } else {
              resolve(res)
            }
          }).catch(err => {
            reject(null)
          })
        }
      });
    }

  })
}


module.exports = {
  login: Login,
  GetUserInfo: GetUserInfo
};