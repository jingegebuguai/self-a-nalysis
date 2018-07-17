import addChineseUnit from '~/utils/addChineseUnit'

export const getOption = function ({xAxisName, xAxisData, series, tooltipFormatter}) {
    const config = {
        title: {
            show: false
        },
        tooltip: {
            backgroundColor: 'white',
            borderColor: 'green',
            borderWidth: 1,
            trigger: 'axis',
            textStyle: {
                color: 'black',
                fontSize: 12
            }
        },
        legend: {
            data: series.map(o => o.name)
        },
        xAxis: {
            name: xAxisName,
            nameLocation: 'end',
            data: xAxisData,
            inverse: true,
            axisLabel: {
                formatter: (value, index) => {
                    return value
                },
                rotate: 45
            }
        },
        yAxis: [{
            "type": "value",
            "name": '数值',
            "splitLine": {
                "show": true,
                "lineStyle": {
                    color: ['#c9cdd5']
                }
            },
            "splitArea": {
                "show": false
            },
            "axisLine": {
                "show": true
            },
            "axisLabel": {
                formatter: addChineseUnit
            },
            splitNumber: 8
        }],
        series
    }
    if (tooltipFormatter) {
        config.tooltip.formatter = tooltipFormatter
    }
    return config
}

export const showChartInfo = function (instance, infoStr) {
    const msgOption = {
        title: {
            show: true,
            textStyle: {
                color: 'grey',
                fontSize: 20
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
    }
    instance.clear()
    instance.hideLoading()
    instance.mergeOptions(msgOption)
}
