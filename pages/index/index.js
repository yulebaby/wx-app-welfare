const App = getApp();
const format = require('./../..//utils/util.js');
const GetInfo = require('./../../utils/getinfo.js');
const Http = require('./../../utils/request.js');

Page({
  data: {
    showModal: null,                     // 是否显示弹出层
    groupInfo: null,                     // 团信息   
    groupId  : null,                     // 分享的团Id
    isJoin   : false,                    // 是否参加过活动
    location : null,
    shopInfo : null
  },

  onLoad: function (options) {
    // let params = {};
    // if (options.groupId) {
    //   this.setData({ groupId: options.groupId });
    //   params.groupId = options.groupId;
    // }

    wx.showLoading({
      title: '加载中...',
    })

    /* ----------------- 根据 openId 查询参团信息 ----------------- */
    GetInfo.getOpenId().then(res => {
      console.log(res)
      params.openId = res;
      Http.get('/findGroupInfo', params).then( group => {
        this.setData({ isJoin: group.code == 10034 });
        this.setData({ groupInfo: group.result });
        wx.hideLoading();
      });
    });

    GetInfo.getAddress( res => {
      this.setData({ location: res });
    });

    Http.get('/returnShopInfo').then( res => {
      this.setData({ shopInfo: res.result });
    });

  },

  onReady() {
    this.setData({
      nowDate: format.format(new Date())
    })
  },

  /* ----------------- 提交信息参团 ----------------- */
  formSubmit(e) {
    let params = e.detail.value;
    params.formId = e.detail.formId;
    let [ nameReg, phoneReg ] = [ /^[\u0391-\uFFE5A-Za-z]{2,30}$/, /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/ ];
    if (!nameReg.test(params.name)) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    if (!params.birthday) {
      wx.showToast({
        title: '请选择宝宝生日',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    if (!phoneReg.test(params.phone)) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    wx.showLoading({
      title: '信息提交中...',
      mask: true
    });
    GetInfo.getOpenId().then(openId => {
      params.openId = openId;
      params.longitude = this.data.location.longitude;
      params.latitude = this.data.location.latitude;
      if (this.data.groupId) { params.groupId = this.data.groupId; }
      Http.post('/submitInfo', params).then( res => {
        wx.hideLoading();
        if (res.code == 1000) {
          /* ------------- 参团成功 ------------- */
          this.setData({ showModal: res.result.num == 0 ? null : 'group', groupInfo: res.result, isJoin: true });
        } else if (res.code == 10035) {
          /* -------- 用户距离太远无法参加 -------- */
          this.setData({ showModal: 'distance' });
        }
      }, err => {
        wx.hideLoading();
      });
    })
    
  },
  /* ---------------- 获取用户电话号码 ---------------- */
  getPhoneNumber(e) {
    console.log(e)
  },
  /* ---------------- 显示/关闭弹出层 ---------------- */
  showModal(e) {
    let type = e.target.dataset.type || null
    this.setData({ showModal: type });
  },
  closeModal() {
    this.setData({ showModal: null });
  },
  /* -------------------- 分享 -------------------- */
  onShareAppMessage: function (res) {
    let _this = this;
    return {
      title: '参团免费领礼包，快来参加吧',
      path: `pages/index/index?groupId=${this.data.groupInfo.groupId || this.data.groupId}`,
      imageUrl: 'https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/activity/share.jpg',
      success(res) {
        _this.setData({ showModal: null });
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})