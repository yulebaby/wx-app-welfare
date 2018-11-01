Page({

  /**
   * 页面的初始数据
   */
  data: {
    orPosition:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  handleSetting(){
    if (!e.detail.authSetting['scope.userLocation']) {
      this.setData({ orPosition : true})
    }else{
      this.setData({ orPosition: false })
    }

  }
})