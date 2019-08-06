// pages/founding/founding.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoadingMoreData: false,
    hasMoreData:true,
    isRefreshing: false,
    curPage:1,
    pageSize:10,
    createActivityList:[],
    fileServer:app.globalData.fileServer
  },
  toActivityDetail(e){
    wx.navigateTo({
      url: '../activitytheme/activitytheme?id=' + e.currentTarget.id
    })
  },
  toOpenPrizeRet(e) {
    wx.navigateTo({
      url: '../wishResults/wishResults?activityId=' + e.currentTarget.id
    })
  },
  getcreateActivityList(){//获取发起的活动列表
    var that = this;
    if(that.data.curPage==1){
      that.data.createActivityList=[];
    }
    wx.request({
      url: app.globalData.base_url + 'personal/getMyCreateActivity',
      method: 'GET',
      data:{
        curPage:that.data.curPage,
        pageSize:that.data.pageSize
      },
      header: app.globalData.header,
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          var list = [];
          if (data.datas) {
            list = that.data.createActivityList.concat(data.datas);
          }
          that.setData({
            createActivityList: list,
            curPage:that.data.curPage+1
          })
          that.setData({
            isRefreshing: false,
            isLoadingMoreData: false
          })
          if (!res.data.datas || res.data.datas.length < that.data.pageSize) {
            that.setData({
              hasMoreData: false
            })
          }
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
  //点击看大图
  cliekImg(e){
    var imgSrc=e.target.dataset.src
    wx.previewImage({
      current:imgSrc,
      urls: [imgSrc],
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcreateActivityList();
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
    this.data.curPage = 1;
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getcreateActivityList()//数据请求
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    this.setData({
      isLoadingMoreData: true
    })
    this.getcreateActivityList()//数据请求
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})