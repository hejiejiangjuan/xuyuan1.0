// pages/businessCooperation/businessCooperation.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataContent:'',
    state:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    wx:wx.request({
      url: app.globalData.base_url + 'wx/wish/public/getAllJoinHand',
      data:{},
      header:app.globalData.header,
      method: 'get',
      success: function(res) {
        let data = res.data
        if(data.code==200){
          for(let i=0;i<data.datas.length;i++){
            data.datas[i].status = false;
          }
        _this.setData({
          dataContent:data.datas,
        })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击内容快展开
  openContent:function(e){
    
    let index = e.currentTarget.dataset.index;
    var data = this.data.dataContent;
    data[index].status = !data[index].status;
      this.setData({
        dataContent: data,
        state: !this.data.state
      })
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