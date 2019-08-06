// pages/richtext_demo/richtext_demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datail:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(JSON.parse(options.detail))
    this.setData({
      datail: JSON.parse(options.detail)
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
  saveData(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    // console.log(pages)
    prevPage.setData({
      detail_content: e.detail
    })
    wx.navigateBack({
      delta: 1
    })
  }
})