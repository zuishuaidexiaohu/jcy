var table, layer, form,cacheDocumentType;
layui.use(['form', 'layer', 'table', 'laydate'], function () {
    form = layui.form, table = layui.table, layer = layui.layer;
    var laydate = layui.laydate;
    laydate.render({
        elem: '#month',
        type: 'date',
        range: '~'
    });
    laydate.render({
        elem: '#deptTime',
        type: 'date',
        range: '~'
    });

    $("#month").val("2019-07-01 ~ " + new Date().Format("yyyy-MM-dd"));

    // $("#month").val(new Date().Format("yyyy-MM-dd")+" 00:00:00 ~ "+new Date().Format("yyyy-MM-dd hh:mm:ss"));

    $("#deptTime").val( "2019-07-01  ~ " + new Date().Format("yyyy-MM-dd"));


    _m.post('code/achieveDropDown', {})
        .then(function (res) {
            var data =cacheDocumentType =res.data;
            loadSaveAndTake();

        });


    loadDept();
});


var chartOption = {
    title: {
        text: '存入数量',
        textStyle: {
            fontSize: 15,
        }
    },
    tooltip: {},
    radar: {

        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
            }
        },
        indicator: []
    },
    series: [{
        name: '存入',
        type: 'radar',
        data: [
            {
                value: [],
                name: '存入量'
            }

        ]
    }]
};


function loadSaveAndTake() {

    var month = $("#month").val().split("~");

    var data = {startDate: '', endDate: ''};

    if (month) {
        data.startDate = $.trim(month[0]) + " 00:00:00";
        data.endDate = $.trim(month[1]) + " 00:00:00";
    }
    _m.post("/dossier/achievePic1", data).then(function (res) {

        initSaveOrTakeChart(formatSaveAndDeptData(res.data.resultListForLoad, '存入'), 'saveChart');
        initSaveOrTakeChart(formatSaveAndDeptData(res.data.resultListForTake, '取出'), 'takeChart');

    })
}


function formatSaveAndDeptData(data, title) {
    var obj = {};
    var num = [], dept = [];
    var max = 10 ;
    for(var j in cacheDocumentType){
        var load = cacheDocumentType[j];
        load.name = load.description;

        var val  = 0;
        for (var i in data) {
           if(max == 10 && data[i].num>max){
               max = data[i].num;
           }
           if(load.description ==data[i].department){
               val =data[i].num;
           }
        }

        load.max = max;
        dept.push(load);
        num.push(val?val:0);
    }
    obj.dept = dept;
    obj.title = title;
    obj.num = num;
    return obj;
}


function initSaveOrTakeChart(obj, id) {
    var chart = echarts.init(document.getElementById(id));

    chartOption.title.text = obj.title + '数量';

    chartOption.radar.indicator = obj.dept;

    chartOption.series[0].name = obj.title;
    chartOption.series[0].data[0].name = obj.title + '量';
    chartOption.series[0].data[0].value = obj.num;

    chart.setOption(chartOption);
}


function loadDept() {

    var deptTime = $("#deptTime").val().split("~");

    var data = {startDate: '', endDate: ''};

    if (deptTime) {
        data.startDate = $.trim(deptTime[0]) + " 00:00:00";
        data.endDate = $.trim(deptTime[1]) + " 00:00:00";
    }
    _m.post("/dossier/achievePic2", data).then(function (res) {
        var takeNumList = res.data.resultListForTakeNum;
        var loadNumList = res.data.resultListForLoadNum;
        var name = [];
        var takeNum = [];
        var loadNum = [];

        for (var i in takeNumList) {
            name.push(takeNumList[i].department);
            takeNum.push(takeNumList[i].num);
        }

        for (var i in loadNumList) {
            loadNum.push(loadNumList[i].num);
        }

        initDeptChart(name, takeNum, loadNum);

    })

}


function initDeptChart(name, takeNum, loadNum) {
    var deptChart = echarts.init(document.getElementById('deptChart'));


    deptChartOption.xAxis[0].data = name;

    deptChartOption.series[0].data = loadNum;

    deptChartOption.series[1].data = takeNum;

    deptChart.setOption(deptChartOption);

}


var deptChartOption = {
    title: {
        text: '各部门人员存入/取出量',
        // subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['存入量', '取出量']
    },
    toolbox: {
        show: true,
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '存入量',
            type: 'bar',
            barWidth: 40,
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        },
        {
            name: '取出量',
            type: 'bar',
            barWidth: 40,
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        }
    ]
};



