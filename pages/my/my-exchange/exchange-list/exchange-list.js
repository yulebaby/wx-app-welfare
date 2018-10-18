const app = getApp();
const Http = require('../../../../utils/request.js');
const getAddress = require('../../../../utils/getAddress.js');
const getUserInfo = require('../../../../utils/getUserInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unused:[],
    used:[],
    overDue:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('获取兑换电话号码')
    console.log(options)
    if(app.origin == 'app'){
      getUserInfo.login(options.phone, loginMsg => {
        console.log(loginMsg)
        this.getaddressIndex();
      })
    }else{
      this.getMsg();
    }
    
  },
  onUnload: function () {
    wx.switchTab({
      url: '../../my/personal/personal',
    })
  },
  /* ------------------- 获取用户地理位置信息 ------------------- */
  getaddressIndex() {
    getAddress(address => {
      console.log(address)
      app.userInfo.address = address;
      app.userInfo.city = address.address_component.city;
      app.userInfo.lng = address.location.lng;
      app.userInfo.lat = address.location.lat;
      this.getMsg();
      wx.hideLoading();
    })
  },

  /*兑换列表*/
  getMsg() {
    let that=this;
    Http.post('/exchangerRecord', { openId: app.userInfo.openid}).then(res => {
      console.log(res)
      if (res.result == 0) {
        that.setData({
          unused: res.unused,
          used: res.used,
          overDue: res.overDue
        })
      }
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });
  }

})