// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personNum: 4,
    formShow: false,
    birthday: '',
    items: [
      { value: '1', name: '男', checked: 'true' },
      { value: '2', name: '女' }
    ],
    gender: '',
    uncheckUrl: '../../img/checkbg.png',
    checkedUrl: '../../img/checkedbg.png',
    mackFlag: true,
    popFlag1: false,
    popFlag2: true
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  closeForm() {
    this.setData({
      formShow: false,
      mackFlag: false
    })
  },
  closePop() {
    this.setData({
      popFlag1: false,
      mackFlag: false
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    // var items = this.data.items;
    // for (var i = 0, len = items.length; i < len; i++) {
    //   items[i].checked = items[i].value == e.detail.value;
    // }
    // this.setData({
    //   items: items
    // });
    this.setData({
      gender: e.detail.value
    })
    console.log(e.detail.value)
    if (this.data.gender == 1) {
      this.setData({
        checkedUrl: '../../img/checkedbg.png',
        uncheckUrl: '../../img/checkbg.png'
      });
    }
    if (this.data.gender == 2) {
      this.setData({
        checkedUrl: '../../img/checkbg.png',
        uncheckUrl: '../../img/checkedbg.png'
      });
    }

  },
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  getGiftClk() {
    this.setData({
      formShow: true,
      mackFlag: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1111)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})