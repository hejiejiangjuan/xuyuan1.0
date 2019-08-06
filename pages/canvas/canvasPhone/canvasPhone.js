// pages/contentShare/contentShare.js
// var apiHelper = require("../../utils/api.js");
var app=getApp()
function findBreakPoint(text, width, context) {
  var min = 0;
  var max = text.length - 1;
  while (min <= max) {
    var middle = Math.floor((min + max) / 2);
    var middleWidth = context.measureText(text.substr(0, middle)).width;
    var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
    if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
      return middle;
    }
    if (middleWidth < width) {
      min = middle + 1;
    } else {
      max = middle - 1;
    }
  }

  return -1;
}

function breakLinesForCanvas(context, text, width, font) {
  var result = [];
  if (font) {
    context.font = font;
  }
  var textArray = text.split('\r\n');
  for (let i = 0; i < textArray.length; i++) {
    let item = textArray[i];
    var breakPoint = 0;
    while ((breakPoint = findBreakPoint(item, width, context)) !== -1) {
      result.push(item.substr(0, breakPoint));
      item = item.substr(breakPoint);
    }
    if (item) {
      result.push(item);
    }
  }
  return result;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: '',
    screenHeight:"",
    scrolHeight:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let item = JSON.parse(options.id);
    var myCanvasHeight;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#d75e49',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        myCanvasHeight = res.windowHeight
      },
    })
    var linheit = item.activity_wish_list.length * 15;
    
    this.setData({
      screenHeight: myCanvasHeight + linheit,
      scrolHeight: myCanvasHeight -60
    })
   
    that.setData({
      info: item
    })
    const info = that.data.info
    that.drawInit(info);
   
  },
  
  canvasIdErrorCallback: function (e) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) { },
  /**
   * 绘制图片
   */

  drawInit: function (info) {
    console.log(info)
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var that = this
    var res = wx.getSystemInfoSync();
    var canvasWidth = res.windowWidth;
    // 获取canvas的的宽  自适应宽（设备宽/750) px
    var Rpx = (canvasWidth / 375).toFixed(2);
    //画布高度 -底部按钮高度
    var canvasHeight = that.data.screenHeight + Rpx * 120;
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('secondCanvas')
    //设置行高
    var lineHeight = Rpx * 30;
    //左边距
    var paddingLeft = Rpx * 24;
    //右边距
    var paddingRight = Rpx * 24;
    //当前行高
    var currentLineHeight = Rpx * 60;
    //背景颜色默认填充
    context.fillStyle = "#f8f8f8";
    context.fillRect(0, 0, canvasWidth + Rpx * 2, canvasHeight);
    //标题内容颜色默认
    context.fillStyle = "#fff";
    // //高度减去 图片高度
    context.fillRect(Rpx * 15, Rpx * 30, canvasWidth - Rpx * 30, canvasHeight);

    // 画昵称
    let str = info.user_join_activity[0].nickName
    let W = canvasWidth;
    context.setFontSize(16);
    context.setFillStyle('black');
    // 剩余宽度50%开始绘制文字
    context.fillText(str, (W - context.measureText(str).width) * 0.5, currentLineHeight += Rpx * 30);

    var imgUrlto = info.user_join_activity[0].imgAddr
    wx.getImageInfo({
      src: imgUrlto,//服务器返回的带参数的小程序码地址
      success: function (res) {
       
        //res.path是网络图片的本地地址
        //绘制头像
        var avatarurl_width = Rpx * 60; //绘制的头像宽度
        var avatarurl_heigth = Rpx * 60; //绘制的头像高度
        var avatarurl_x = canvasWidth - avatarurl_width; //绘制的头像在画布上的位置
        var avatarurl_y = Rpx * 5; //绘制的头像在画布上的位置
        var imgUrl = res.path;
        context.save();
        context.setStrokeStyle('rgba(0,0,0,0)')
        context.beginPath() //开始创建一个路径
        context.arc(avatarurl_width / 2 + avatarurl_x / 2, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false)
        context.stroke();
        context.clip() //裁剪
        context.drawImage(imgUrl, avatarurl_x / 2, avatarurl_y, avatarurl_width, avatarurl_heigth)
        context.restore() //恢复之前保存的绘图上下文\
        // 画文字
        let toptitle = '正在参与' + info.activityTheme + '主题活动,你也快来看看吧';
        var resultTitle = breakLinesForCanvas(context, toptitle, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 14).toFixed(0)}px PingFangSC-Regular`);
        //字体颜色
        context.fillStyle = '#494949';
        // context.setFontSize();
        resultTitle.forEach(function (line, index) {
          currentLineHeight += Rpx * 20;
          context.fillText(line, paddingLeft, currentLineHeight);
        });
        
        //绘制图片
        const imgto = 'https://file.heidouinfo.com/'+info.themeAddr;
        wx.getImageInfo({
          src: imgto,//服务器返回的带参数的小程序码地址
          success: function (res) {
            
            //res.path是网络图片的本地地址
            const img = res.path;
            let cWidth = canvasWidth - Rpx * 34;
            let cHeight = Rpx * 150;
            var width = res.width;
            var height = res.height;
            // 描绘图片
            drawImage(img, width, height);

            function drawImage(imgPath, imgWidth, imgHeight) {
              let dWidth = cWidth / imgWidth;  // canvas与图片的宽度比例
              let dHeight = cHeight / imgHeight;  // canvas与图片的高度比例
              if (imgWidth > cWidth && imgHeight > cHeight || imgWidth < cWidth && imgHeight < cHeight) {
                if (dWidth > dHeight) {
                  context.drawImage(imgPath, 0, (imgHeight - cHeight / dWidth) / 2, imgWidth, cHeight / dWidth, canvasWidth - cWidth - Rpx * 16, currentLineHeight += Rpx * 20, cWidth, cHeight)
                } else {
                  context.drawImage(imgPath, (imgWidth - cWidth / dHeight) / 2, 0, cWidth / dHeight, imgHeight, canvasWidth - cWidth - Rpx * 16, currentLineHeight += Rpx * 20, cWidth, cHeight)
                }
              } else {
                if (imgWidth < cWidth) {
                  context.drawImage(imgPath, 0, (imgHeight - cHeight / dWidth) / 2, imgWidth, cHeight / dWidth, canvasWidth - cWidth - Rpx * 16, currentLineHeight += Rpx * 20, cWidth, cHeight)
                } else {
                  context.drawImage(imgPath, (imgWidth - cWidth / dHeight) / 2, 0, cWidth / dHeight, imgHeight, canvasWidth - cWidth - Rpx * 16, currentLineHeight += Rpx * 20, cWidth, cHeight)
                }
              }
            }
            var imgHeight = Rpx * 150;

            context.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制

            //设置内容
            const leixinag = info.activity_wish_list
            for (var i in leixinag) {
              var leixinginfo = leixinag[i].wishName + ' | ' + '心愿：' + leixinag[i].prizeName + 'x' + leixinag[i].prizeNum
              var resultTitle = breakLinesForCanvas(context, leixinginfo, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 12).toFixed(0)}px PingFangSC-Regular`);
              //字体颜色
              context.fillStyle = '#a0a0a0';
              resultTitle.forEach(function (line, index) {
                currentLineHeight += Rpx * 20;
                context.fillText(line, paddingLeft, currentLineHeight + imgHeight);
              });
            }


            //画分割线
            currentLineHeight += Rpx * 30;
            context.setLineDash([Rpx * 6, Rpx * 3.75]);
            context.moveTo(paddingLeft, currentLineHeight + imgHeight - Rpx * 20);
            context.lineTo(canvasWidth - paddingRight, currentLineHeight + imgHeight - Rpx * 20);
            context.strokeStyle = '#cccccc';
            context.stroke();

            //画助力

            const openPrizeCon = info.openPrizeCon
            if (openPrizeCon == '1') {
              const number = info.openDescribe
              const isnumber = number + '自动开奖'
              var resultTitle = breakLinesForCanvas(context, isnumber, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 15).toFixed(0)}px PingFangSC-Regular`);
              //字体颜色
              context.fillStyle = 'black';
              resultTitle.forEach(function (line, index) {
                currentLineHeight += Rpx * 10;
                context.fillText(line, paddingLeft, currentLineHeight + imgHeight + Rpx * 20);
              });
            } else if (openPrizeCon == '2') {
              const number = info.openDescribe
              const isnumber = '参与人数达到' + number + '人时自动开奖'
              var resultTitle = breakLinesForCanvas(context, isnumber, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 14).toFixed(0)}px PingFangSC-Regular`);
              //字体颜色
              context.fillStyle = 'black';
              resultTitle.forEach(function (line, index) {
                currentLineHeight += Rpx * 10;
                context.fillText(line, paddingLeft, currentLineHeight + imgHeight + Rpx * 20);
              });
            } else {
              const isnumber = '活动人手动开奖'
              var resultTitle = breakLinesForCanvas(context, isnumber, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 14).toFixed(0)}px PingFangSC-Regular`);
              //字体颜色
              context.fillStyle = 'black';
              resultTitle.forEach(function (line, index) {
                currentLineHeight += Rpx * 20;
                context.fillText(line, paddingLeft, currentLineHeight + imgHeight + Rpx * 40);
              });
            }

            if (info.onlyFans == '1') {
              const isnumber = '参与条件：需要输入口令'
              var resultTitle = breakLinesForCanvas(context, isnumber, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 14).toFixed(0)}px PingFangSC-Regular`);
              //字体颜色
              context.fillStyle = 'black';
              resultTitle.forEach(function (line, index) {
                currentLineHeight;
                context.fillText(line, paddingLeft, currentLineHeight + imgHeight);
              });
            } else if (info.needHelp == '1') {
              const number = info.helpNum
              const isnumber = '需要' + number + '人助力'
              var resultTitle = breakLinesForCanvas(context, isnumber, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 14).toFixed(0)}px PingFangSC-Regular`);
              //字体颜色
              context.fillStyle = 'black';
              resultTitle.forEach(function (line, index) {
                currentLineHeight;
                context.fillText(line, paddingLeft, currentLineHeight + imgHeight);
              });
            }
            //绘制图片
  
            const erweiimgto = app.globalData.fileServer + info.codeAddr;
            wx.getImageInfo({
              src: erweiimgto,//服务器返回的带参数的小程序码地址
              success: function (res) {
                //res.path是网络图片的本地地址
                const erweiimg = res.path;
                const erweiimgWidth = canvasWidth - Rpx * 250;//图片宽度
                const erweiimgHeight = Rpx * 120;//图片高度
                var erweiimgurl_x = canvasWidth - erweiimgWidth; //绘制的在画布上的位置
                var erweiimgurl_y = currentLineHeight + imgHeight + Rpx * 40; //绘制的图片在画布上的位置
                context.save();
                context.beginPath(); //开始绘制
                context.drawImage(erweiimg, erweiimgurl_x / 2, erweiimgurl_y, erweiimgWidth, erweiimgHeight);
                context.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制

                // 识别小程序
                let weime = '扫描二维码识别小程序参与活动'
                let D = canvasWidth;
                context.setFontSize(15);
                context.setFillStyle('red');
                // 剩余宽度50%开始绘制文字
                context.fillText(weime, (D - context.measureText(weime).width) * 0.5, currentLineHeight + imgHeight + erweiimgHeight + Rpx * 60);
                context.stroke();
                
                context.draw();
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (res) {
                //失败回调
              }
            });
          },
          fail: function (res) {
            //失败回调
          }
        });
      },
      fail: function (res) {
        //失败回调
      }
    });

  },

  saveImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'secondCanvas',
      fileType: 'jpg',
      success: function (res) {
        debugger
        // 返回图片路径
        wx.showLoading({
          title: '保存中...',
          mask: true
        });
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.hideLoading()
          }
        })
      }
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.info.title,
      path: '/pages/content/content?id=' + this.data.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})