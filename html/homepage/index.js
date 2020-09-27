var layer, form;
layui.use(['form', 'layer', 'laydate'], function () {
    form = layui.form, layer = layui.layer;
    var laydate = layui.laydate;
    laydate.render({
        elem: '#operateTime',
        type: 'datetime',
    });

    // console.log(userInfo)
    _m.post("dossier/achieveRemind", {id: userInfo.id, department: userInfo.department}).then(function (res) {
        // console.log(res);

        var divContent = "";
        var data = res.data;
        if (data.load ) {
            var load = data.load;
            for (var i in load) {
                divContent += "<div class='oneDayTipContent' title='" +
                    load[i].acceptCases+"需存入"+load[i].description
                    +"'>" +
                    load[i].acceptCases + "<span style='color:#5FB878 '>需存入</span>"+load[i].description+
                  /*  "<span class='tipContent'>"+ load[i].acceptCases + "需存入"+load[i].description+"</span>"+*/
                    "</div>";
            }
        }  if (data.take) {
            var take = data.take;
            for (var i in take) {
                divContent += "<div class='oneDayTipContent' title='" +
                    take[i].acceptCases +"需取出"+take[i].description+
                    "'>" +
                    take[i].acceptCases + "<span style='color:#615fb8e3 '>需取出</span>"+take[i].description+
                  /*  "<span class='tipContent'>"+ load[i].acceptCases + "需取出"+load[i].description+"</span>"+*/
                    "</div>";
            }
        } 
		//if((!data.load  && !data.take) || (!data.load  && data.take) ||(data.load  && !data.take)  ) {
        //    divContent += "<div class='oneDayTipContent'>无</div>";

       // }

        $("#oneDayTipContentGroup").append(divContent);

    });
});


