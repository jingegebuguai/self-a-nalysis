export const showChartInfo = function (instance, infoStr) {
  var msgOption = {
    title: {
      show: true,
      textStyle:{
        color:'grey',
        fontSize:20
      },
      text: infoStr,
      left: 'center',
      top: 'center'
    },
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    series: []
  };
  instance.clear()
  instance.hideLoading()
  instance.mergeOptions(msgOption)
}
