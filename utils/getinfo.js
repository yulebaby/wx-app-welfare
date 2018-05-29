/**
 * @function GetUserInfo
 * @param callBack<用户信息>
 * 
 * @function Login
 * @param callBack<用户code>
 *
 * @function GetAddress
 * @param callBack<经纬度, 所在城市>
 * 
 * @export <getUserInfo: function, login: function, GetAddress: function>
 * 
 * @author phuhoang
 * @time 2018-01-16
 */
const app = getApp();

/* ------------------------- 获取用户信息 ------------------------- */
const GetUserInfo = (callback) => {
  if (app.globalData.userInfo) {
    callback(app.globalData.userInfo);
  }
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      app.globalData.userInfo = res.userInfo;
      callback(app.globalData.userInfo);
    },
    fail: err => {
      wx.showModal({
        title: '获取用户信息失败',
        content: '请在设置页允许获取个人信息',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                wx.getUserInfo({
                  withCredentials: true,
                  success(res) {
                    app.globalData.userInfo = res.userInfo;
                    callback(app.globalData.userInfo);
                  }
                })
              },
              complete(err) {
                GetUserInfo(callback)
              }
            })
          }
        }
      })
    }
  });

}

/* ------------------------- 获取地理位置 ------------------------- */
const GetAddress = (callback) => {
  /* --------- 如果app已经存储地址信息则直接返回 --------- */
  if (app.globalData.address) {
    callback(app.globalData.address)
  } else {
    /* --------- 获取用户经纬度, 成功存储并返回,失败则提示用户授权 --------- */
    wx.getLocation({
      type: 'wgs84',
      success(address) {
        app.globalData.address = address;
        callback(app.globalData.address);
      },
      fail(err) {
        /* --------- 提示用户授权 --------- */
        wx.showModal({
          title: '获取用户地址失败',
          content: '请在设置页允许获取所在地址',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  wx.getLocation({
                    type: 'wgs84',
                    success(address) {
                      app.globalData.address = address;
                      callback(app.globalData.address);
                    }
                  })
                },
                complete(err) {
                  /* --------- 用户未授权直接退出则再次提示用户授权 --------- */
                  GetAddress(callback)
                }
              })
            }
          }
        })
      }
    })
  }
}


/* ------------------------- 获取用户标示 ------------------------- */
const GetOpenId = () => {
  return new Promise((resolve, reject) => {
    if (app.globalData.openId) {
      resolve({ openId: app.globalData.openId, sessionKey: app.globalData.sessionKey });
    } else {
      wx.checkSession({
        success: function () {
          let [openId, sessionKey] = [wx.getStorageSync('openId'), wx.getStorageSync('sessionKey')];
          if (openId && sessionKey) {
            app.globalData.openId = openId;
            app.globalData.sessionKey = sessionKey;
            resolve({ openId: app.globalData.openId, sessionKey: app.globalData.sessionKey });
          } else {
            wx.login({
              success(res) {
                wx.request({
                  url: `${app.domain}/getCodeAndLogin/${JSON.stringify({ code: res.code })}`,
                  method: "POST",
                  dataType: 'json',
                  success(res) {
                    if (res.data.success) {
                      app.globalData.openId = res.data.result.openId;
                      app.globalData.sessionKey = res.data.result.sessionKey;
                      resolve({ openId: app.globalData.openId, sessionKey: app.globalData.sessionKey });
                      
                      wx.setStorageSync('openId', res.data.result.openId);
                      wx.setStorageSync('sessionKey', res.data.result.sessionKey);
                    } else {
                      resolve(null);
                    }
                  },
                  fail(err) {
                    reject(err);
                  }
                })
              }
            })
          }
        },
        fail: function () {
          wx.login({
            success(res) {
              wx.request({
                url: `${app.domain}/getCodeAndLogin/${JSON.stringify({ code: res.code })}`,
                method: "POST",
                dataType: 'json',
                success(res) {
                  if (res.data.success) {
                    app.globalData.openId = res.data.result.openId;
                    app.globalData.sessionKey = res.data.result.sessionKey;
                    resolve({ openId: app.globalData.openId, sessionKey: app.globalData.sessionKey });
                    wx.setStorage('openId', res.data.result.openId);
                    wx.setStorage('sessionKey', res.data.result.sessionKey);
                  } else {
                    resolve(null);
                  }
                },
                fail(err) {
                  reject(err);
                }
              })
            }
          })
        }
      })
    }
  })
}


module.exports = {
  getUserInfo: GetUserInfo,
  getOpenId: GetOpenId,
  getAddress: GetAddress
}