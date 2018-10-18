const app = getApp();
const Http = require('../../../utils/request.js');
Page({
  data: {
    phoneValue: null,
    codeInput:null,
    clickSendCode: true,
    clickBindPhone: true,
    time: '获取验证码',
    currentTime:61,
    phonePrompt:'',
    codePrompt:''
  },
  onLoad: function (options) {
    
  },
  searchInput: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  codeInput: function (e) {
    this.setData({
      codeInput: e.detail.value
    })
  },
  errorPrompt(phoneMsg,codeMsg){
    this.setData({
      phonePrompt: phoneMsg,
      codePrompt: codeMsg
    })
  },
  /*获取手机验证码*/
  getCode() {
    console.log(this.data.clickSendCode)
    var that = this;
    var currentTime = that.data.currentTime;
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          clickSendCode: true
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    var that =this;
    if (that.data.phoneValue){
      if (that.data.clickSendCode) {
        that.errorPrompt('', '');
        if (that.data.phoneValue.length == 11) {
          console.log(that.data.clickSendCode)
          that.getCode();
          that.setData({
            clickSendCode: false
          })
          console.log(that.data.clickSendCode)
          Http.post('/sendVerification', { mobilePhone: that.data.phoneValue }).then(res => {
            if (res.result == 0) {}
          }, _ => {

          });
        } else {
          that.errorPrompt('手机号不存在，请重新输入','')
        }
      }
    }else{
      that.errorPrompt('请输入手机号','')
    }
  },
  
  /*绑定手机*/
  orClickBtn(){
    var that=this;
    that.setData({
      clickBindPhone: true
    })
  },
  bindPhone(){
    let that=this;
    if (!that.data.phoneValue){
      that.errorPrompt('请输入手机号','');
    } else if (that.data.phoneValue.length != 11){
      that.errorPrompt('手机号不存在，请重新输入' , '')
    } else if (!that.data.codeInput){
      that.errorPrompt('','请输入验证码');
    } else if (that.data.codeInput.length != 4){
      that.errorPrompt('','验证码不正确');
    }else{
      if (that.data.clickBindPhone){
        that.setData({
          clickBindPhone: false
        })
        Http.get('/checkVerification', { mobilePhone: that.data.phoneValue, verification: that.data.codeInput }).then(res => {
          if (res.result == 0) {
            Http.get('/saveBindingUser', { mobilePhone: that.data.phoneValue, openId: app.userInfo.openid }).then(res => {
              if (res.result == 0) {
                app.userInfo.status=1;
                app.userInfo.phone =that.data.phoneValue;
                wx.showToast({
                  title: '绑定成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
                })
                that.orClickBtn();
                Http.post('/babyInfo', { openId: app.userInfo.openid }).then(res => {
                  if (res.result == 0) {
                    app.userInfo.member = res.isMember;
                    console.log('会员与否')
                    console.log(app.userInfo.member)
                    if (app.userInfo.member == 1) {
                      console.log('会员返回')
                      wx.navigateBack({})
                    } else if (app.userInfo.member == 0) {
                      wx.redirectTo({
                        url: '../base-msg/base-msg'
                      })
                    }
                    wx.hideLoading();
                  }
                }, _ => {
                  wx.hideLoading();
                });
              }else{
                that.orClickBtn();
                that.errorPrompt('',res.message)
              }
              wx.hideLoading();
            }, _ => {
              wx.hideLoading();
              that.orClickBtn();
            });
          }else{
            that.orClickBtn();
            that.errorPrompt('', res.message)
          }
          wx.hideLoading();
        }, _ => {
          wx.hideLoading();
          that.orClickBtn();
        });
      }
    }
  }
})