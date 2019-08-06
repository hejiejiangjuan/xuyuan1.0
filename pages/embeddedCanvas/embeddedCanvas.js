// pages/embeddedCanvas/embeddedCanvas.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: "",
    canvasHeight: "",
    showDialog: false,
    showTopTips: false,
    imagePath:'',
    state:false,
    activeId:'',
    activeData:{},
    titleHeight: 18 
  },
  //canvas画布做适配
  myCanvas: function (activData,des, lotteryWay) {
    console.log(lotteryWay)
    var that = this
    var Rpx
    wx.getSystemInfo({
      success(res) {
        Rpx = res.windowWidth / 375;
        that.setData({
          canvasWidth: 300 * Rpx,
          canvasHeight: 280 * Rpx
        })
      },
    })

    var context = wx.createCanvasContext("firstCanvas")
    //画白色底部
    wx.showLoading({
      title: '加载中',
    })
    context.setFillStyle("#ffffff")
    context.fillRect((300 * Rpx - 280 * Rpx) / 2, (280 * Rpx - 260 * Rpx) / 2, 280 * Rpx, 260 * Rpx)
    //画商品图片
    var imgSrc = app.globalData.fileServer+activData.themeAddr
    wx.downloadFile({
      url: imgSrc,
      success(res){
       
        if (res.statusCode===200){
          var myImgSrc = res.tempFilePath
          var titleHeight = 18 * Rpx
          context.drawImage(myImgSrc, (300 * Rpx - 240 * Rpx) / 2, 30 * Rpx, 240 * Rpx, 140 * Rpx)

          //画文字
          context.setFontSize(18 * Rpx)
          context.setFillStyle('#000000')
          // context.fillText('活动主题:' + activData.activityTheme, (300 * Rpx - 240 * Rpx) / 2, 210 * Rpx)
          // 1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、标题高度 6、文本的宽度 7、字体大小
          that.drawText(context, '活动主题:' + activData.activityTheme, (300 * Rpx - 240 * Rpx) / 2, 210 * Rpx, 18* Rpx, 240 * Rpx, 18 * Rpx)
          
          context.setFontSize(16 * Rpx)
          context.setFillStyle('#727272')
          context.fillText(des + lotteryWay + '开奖 ', (300 * Rpx - 240 * Rpx) / 2, 220 * Rpx+that.data.titleHeight)
          console.log(that.data.titleHeight)

          // 画个框
          context.setLineWidth(10)
          context.setStrokeStyle("red")
          context.strokeRect(0, 0, 300 * Rpx, 280 * Rpx)

          //右上角框
          // context.setFillStyle('#919191')
          // context.fillRect(205*Rpx, 35*Rpx, 60 * Rpx, 20 * Rpx)
          // context.setFontSize(12*Rpx)
          // context.setFillStyle("#ffffff")
          // context.fillText('某某赞助')
          context.draw()
          setTimeout(() => {
            wx.hideLoading()
            that.imgSrc()
          }, 200);

        }
      }
    })
   
    
  },
  //保存图片
  saveImg: function() {
    console.log()
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success(res) {
        wx.showLoading({
          title: '已保存到相册',
          mask: true
        });
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })
        setTimeout(function () {
          wx.hideLoading()
        },400)
      }
    }, this)
  },
  //获取图片地址
  imgSrc: function () {
    var that=this
    wx.canvasToTempFilePath({
      canvasId: "firstCanvas",
      success: (res) => {
        if (res.tempFilePath){
          let tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
          });
       }else{
         console.log(122)
       } 
      }
    }, this);

  },
  //复制AppId
  copyApp:function(){
    wx.setClipboardData({
      data: 'pages/activitytheme/activitytheme',
      success:function(res){
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  //复制page
  copyPage:function(){
    wx.setClipboardData({
      data: 'pages/activitytheme/activitytheme',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
//嵌入模态框
  qianru(){
    wx.showModal({
      title: '',
      content: '',
    })
  },
  // 打开弹框
  modileTakue() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  // 关不弹框
  removeGb() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
//页面数据请求
imitPage(){
var that=this
  wx.request({
    url: app.globalData.base_url +'/wx/wish/activity/getDetailShare',
    method:"post",
    data:{
      activityId: that.data.activeId
      // that.data.activeId,
    },
    header: app.globalData.header,
    success(res) {
      console.log(res.data)
      if(res.data.code==200){
        that.setData({
          activeData: res.data.datas
        })
       
        if (res.data.datas.openPrizeCon==1){
            //  var lotteryWay="自动"
          that.myCanvas(res.data.datas,res.data.datas.openDescribe, "自动")
          // console.log(lotteryWay)
        } else if (res.data.datas.openPrizeCon == 2){
          // var lotteryWay = "达到"
          that.myCanvas(res.data.datas, "达到"+res.data.datas.openDescribe, "人")
         
        } else if (res.data.datas.openPrizeCon == 3){
          //  var lotteryWay = "发起者手动"
          that.myCanvas(res.data.datas,"", "发起者手动")
        }
      }
    }
  }) 
},
  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、标题高度 6、文本的宽度 7、字体大小
  drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, fontSize) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += fontSize + 5; //为字体的高度(行间距)
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += fontSize;
        this.setData({
          titleHeight: titleHeight
        })
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
        console.log(str)
      }
    }
    // 标题border-bottom 线距顶部距离
    // titleHeight = titleHeight + 10;
    return titleHeight
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
  
    that.setData({
      activeId: options.id

    })
    that.imitPage()
   
    console.log(that.data.activeId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that=this
    
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.imgSrc()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})