const App = getApp();
const format = require('./../..//utils/util.js');

Page({
  data: {
    nowDate  : null,                     // 记录当前年月日
    birthday : null,                     // 宝宝生日
    sex      : 1,                        // 宝宝性别                       
  },    
  onLoad: function (options) {
    
  },

  onReady() {
    this.setData({
      nowDate: format.format(new Date())
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /* ---------------- 宝宝生日改变事件 ---------------- */
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  /* ---------------- 宝宝性别改变事件 ---------------- */
  sexChange(e) {
    this.setData({
      sex: e.detail.value
    })
  }
})