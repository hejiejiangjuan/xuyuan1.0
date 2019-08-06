// pages/elect/elect.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    love: [],
    hatred: {},
    fileServer: app.globalData.fileServer,
    isShow: false,
    currentIndex: ''
  },
  // 自定义类型
  eleZdingyi() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  bindblurinput(e) {

    var arr = [{
      name: {
        id: e.currentTarget.id,
        wishName: e.detail.value
      }
    }];
    this.setData({
      isShow: !this.data.isShow,
      hatred: arr
    })
  },
  //点击保存
  btnqued() {
   
    var that = this;
    if (that.data.hatred[0] == undefined) {
      wx.showModal({
        title: '提示',
        content: '你还未选择类型！',
      })
      return
    }
    const chooseType = that.data.hatred[0].name;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    const info = prevPage.data.info;
    //设置值
    info[that.data.currentIndex].chooseType = chooseType;

    prevPage.setData({
      info: info
    })
    //返回上一页面
    wx.navigateBack({
      delta: 1
    })
  },
  //点击选择
  showRule(e) {
    var arr = [];
    var that = this;
    arr.push(e.currentTarget.dataset);
    that.setData({
      hatred: arr
    })

  },
  //点击删除
  gunbi(e) {
    var that = this;
    var arr = that.data.hatred;
    var love = that.data.love;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].name.id == e.currentTarget.id) {
        arr.splice(i, 1);
      }
    }
    for (var i in love) {
      if (love[i].id == e.currentTarget.id) {
        love.splice(i, 1);
      }
    }
    that.setData({
      hatred: arr,
      love: love
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取排序
    this.setData({
      currentIndex: options.id
    })
    this.getWishType();
  },
  //获取类型
  getWishType: function () {
    const that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/public/getWishType',
      header: app.globalData.header,
      method: 'GET',
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            list: data.datas
          })
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(this)
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