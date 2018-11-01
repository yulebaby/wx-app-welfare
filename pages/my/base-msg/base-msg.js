const app=getApp();
const Http = require('../../../utils/request.js');
const Util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameValue:'',
    nameError:'',
    birthdayError:'',
    relationError:'',
    relationshipIndex:null,
    relationshipArray: ['爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '其他'],
    date: '宝宝生日',
    dateEnd: Util.formatTime(new Date).split(' ')[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  nameInput: function (e) {
    this.setData({
      nameValue: e.detail.value
    })
  },
  /*提交宝宝信息*/
  babyBaseMsg() {
    let that=this;
    var nameTest = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/;
    if (!this.data.nameValue){
      this.errorPrompt('昵称不能为空','','')
      console.log(this.data.relationshipIndex)
    } else if (!nameTest.test(this.data.nameValue)){
      this.errorPrompt('昵称为1-10个数字、中文或英文', '', '')
    } else if (this.data.date && this.data.date=='宝宝生日'){
      this.errorPrompt('', '请选择宝宝生日', '')
    } else if (this.data.relationshipIndex == null){
      console.log(this.data.relationshipIndex)
      this.errorPrompt('', '', '请选择您与宝宝的关系')
    }else{
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.errorPrompt('', '', '');
      Http.post('/saveUserBaseInfo', { openId: app.userInfo.openid, mobilePhone: app.userInfo.phone, nick: this.data.nameValue, relationship: this.data.relationshipArray[this.data.relationshipIndex], birthday: this.data.date }).then(res => {
        console.log('提交宝宝信息')
        console.log(res)
        if (res.result == 0) {
          app.userInfo.babyMsgStatus=1;
          // Http.post('http://192.168.1.110:8090/customerDetail/checkNoVerifyNum', { spreadId: 36, phone: app.userInfo.phone, babyName: that.data.nameValue, birthday: that.data.date }).then(res => {
          Http.post('https://sale.beibeiyue.com/kb/customerDetail/checkNoVerifyNum', { spreadId: 36, phone: app.userInfo.phone, babyName: that.data.nameValue, birthday: that.data.date }).then(res => {
            if (res.code == 1000) {

              wx.showToast({
                title: '提交成功',
                icon: 'succes',
                duration: 1000,
                mask: true
              });
              wx.navigateBack({})
            }
            wx.hideLoading();
          }, _ => {
            wx.hideLoading();
          });
          wx.navigateBack({})
        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  /*日期选择器*/
  bindPickerChange(e){
    console.log(e.detail.value)
    this.setData({index : e.detail.value})
  },
  /*关系选择器*/
  relationshipChange(e) {
    this.setData({
      relationshipIndex: Number(e.detail.value)
    })
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  errorPrompt(nameError, birthdayError, relationError){
    this.setData({
      nameError: nameError,
      birthdayError: birthdayError,
      relationError: relationError
    })
  }
})