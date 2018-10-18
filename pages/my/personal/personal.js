const app = getApp();
const Http = require('../../../utils/request.js');
const getUserInfo = require('../../../utils/getUserInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMsg: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // this.statusMsg()
    console.log('拿去到手机号')
    console.log(app.userInfo.phone)
    this.statusMsg();
  },
  statusMsg(){
    let that = this;
    console.log('我的')
    console.log(app.userInfo.member)
    if(app.userInfo.member == 1){
      this.getUserMsg();
    }else{
      getUserInfo.login(app.userInfo.phone, loginMsg => {
        if (app.userInfo.status == 1){
          if (app.userInfo.babyMsgStatus == 1) {
            this.getUserMsg();
          } else if (app.userInfo.babyMsgStatus == 0) {
            wx.hideLoading();
            wx.navigateTo({
              url: '../base-msg/base-msg',
            })
          }
        }else{
          wx.navigateTo({
            url: '../bind-phone/bind-phone',
          })
        }
        
      })
    }




    // Http.post('/babyInfo', { openId: app.userInfo.openid }).then(res => {
    //   console.log(res)
    //   if (res.result == 0) {
        
    //     app.userInfo.member = res.isMember;
    //     app.userInfo.babyMsgStatus = res.baseInfo;
    //     that.orPerfect()
    //   }
    // }, _ => {
    //   wx.hideLoading();
    // });
  },
  orPerfect() {
    console.log('我的页面')
    console.log(app.userInfo.member)
    let that = this;
    if (app.userInfo.status == 1){
      if (app.userInfo.member == 1){
        console.log('是会员')
        this.getUserMsg();
      }else{
        console.log('不是会员')
        if (app.userInfo.babyMsgStatus == 1) {
          this.getUserMsg();
        } else if (app.userInfo.babyMsgStatus == 0) {
          wx.navigateTo({
            url: '../base-msg/base-msg',
          })
        }
      }
    } else if (app.userInfo.status == 0){
      wx.navigateTo({
        url: '../bind-phone/bind-phone',
      })
    }


    // if (app.userInfo.member == 1){
    //   this.getUserMsg();
    // }else if(app.userInfo.status==1){
    //   if (app.userInfo.babyMsgStatus == 1) {
    //     this.getUserMsg();
    //   } else if (app.userInfo.babyMsgStatus == 0) {
    //     wx.navigateTo({
    //       url: '../base-msg/base-msg',
    //     })
    //   } else {
    //     Http.post('/babyInfo', { openId: app.userInfo.openid }).then(res => {
    //       if (res.result == 0) {
    //         console.log(res)
    //         app.userInfo.babyMsgStatus = res.baseInfo;
    //         that.orPerfect()            
    //         wx.hideLoading();
    //       }
    //     }, _ => {
    //       wx.hideLoading();
    //     });
    //   }
    // }else{
    //   wx.navigateTo({
    //     url: '../bind-phone/bind-phone',
    //   })
    // }
    
  },
  getUserMsg(){
    Http.post('/welfareUserIntegral', { openId: app.userInfo.openid }).then(res => {
      if (res.result == 0) {
        console.log(res)
        app.userInfo.member = res.data.isMember;
        this.setData({
          userMsg: res.data,
          member: res.data.isMember
        })
        wx.hideLoading();
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  tel() {
    wx.makePhoneCall({
      phoneNumber: '4006321531',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }

})