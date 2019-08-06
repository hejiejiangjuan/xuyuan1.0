// pages/irole/irole.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    showTopTips: false,
    detalvue:"0",
    radioItems: [
      { name: '我是管理员', value: '0', checked: true  },
      { name: '我不是管理员', value: '1'}
    ]
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 300);
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      detalvue: e.detail.value
    })
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  toadmin(){
    wx.navigateTo({
      url: '../iadmin/iadmin',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData({
      showDialog: false
    });
  },
  // 打开弹框
  modileTakue(){
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  // 关不弹框
  removeGb(){
    this.setData({
      showDialog: !this.data.showDialog
    });
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