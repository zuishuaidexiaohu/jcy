/**
 * @Description:
 * @author DJ Ya
 * @date 2019/7/2
 */

layui.config({
    base: '/lib/layui_exts/formSelect/' //此处路径请自行处理, 可以使用绝对路径
});
var table, layer, form, PERSON_WINDOW, PERSON_DEL_WINDOW, DEPARTMENT_WINDOW, updateOrInsert = '',
    formSelects, cacheDelData = {}
SARK_NUMBER = [
    {name: "1", value: 1},
    {name: "2", value: 2},
    {name: "3", value: 3},
    {name: "4", value: 4},
    {name: "5", value: 5},
    {name: "6", value: 6},
    {name: "7", value: 7},
    {name: "8", value: 8},
    {name: "9", value: 9},
    {name: "10", value: 10},
    {name: "11", value: 11},
    {name: "12", value: 12},
    {name: "13", value: 13},
    {name: "14", value: 14}
];
layui.use(['form', 'layer', 'table', 'laydate', 'formSelects'], function () {
    form = layui.form, table = layui.table, layer = layui.layer;
    var laydate = layui.laydate;
    formSelects = layui.formSelects;
    laydate.render({
        elem: '#operateTime',
        type: 'datetime',
    });
    table.render({
        id: 'infoTableId',
        elem: '#infoTable',
        parseData: function (res) {
            return {
                "code": res.code,
                "msg": res.msg,
                "count": res.count,
                "data": res.data
            };
        },
        data: [
            // {name:'djy',ICCard:'3205001111',role:'超级管理员',dept:'系统集成部',identity:'组长'}
        ],
        page: true,
        height: 'full-150',
        limit: 10,
        cols: [
            [
                {type: 'radio'},
                {type: 'numbers', title: '序号', sort: true},
                {field: 'username', title: '姓名', align: 'center', sort: true},
                {field: 'icNumber', title: 'IC卡编号', align: 'center', sort: true},
                {field: 'roleDescription', title: '系统角色', align: 'center', sort: true},
                {field: 'department', title: '部门', align: 'center', sort: true},
                {
                    field: 'containerNumber', title: '柜号', width: 160, align: 'center', sort: true,
                    templet: function (d) {
                        if (d.containerNumber== "all") {
                            return "全部柜子";
                        }else if (!d.containerNumber){
                            return "";
                        }else {
                            return d.containerNumber;
                        }
                    }
                },
                {field: '', title: '操作', align: 'center', toolbar: "#operateBtn"},
            ]
        ],
        loading: true,
        text: {
            none: '暂无相关数据'
        }
    });


    table.render({
        id: 'departmentTableId',
        elem: '#departmentTable',
        // parseData: function (res) {
        //     return {
        //         "code": res.code,
        //         "msg": res.msg,
        //         "count": res.count,
        //         "data": res.data
        //     };
        // },
        data: [
            // {name:'djy',ICCard:'3205001111',role:'超级管理员',dept:'系统集成部',identity:'组长'}
        ],
        page: false,
        height: '300',
        limit: 1000,
        cols: [
            [

                {field: 'description', title: '部门', align: 'center', sort: true},
            ]
        ],
        loading: true,
        text: {
            none: '暂无相关数据'
        }
    });

    table.on('tool(infoTableFilter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var tr = obj.tr;
        if (layEvent == 'edit') {
            showWindow("/assest/image/personEditTitle.png", "update");
            assignmentData(data);
            form.render('select');
        }
    })

    form.on('submit(updateORInsert)', function (data) {
        var data = data.field;
        data.containerNumber= data.containerNumber.split(",").length==14?"all":data.containerNumber;
        if (updateOrInsert == "insert") {
            insert(data);
        } else {
            update(data, "");
        }
        $("#save").attr("disabled", "true");
        return false;
    });
    search(false);

    init();


    form.on('select(roleFilter)', function (data) {
        var department = $("select[name='department']").val();
        if(data.value == '2'){
            formSelects.value('containerNumberSelectId', [1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
        }else if ((data.value== "3" || data.value == "4") && department== "1"){
            formSelects.value('containerNumberSelectId', [1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
        }else {
            formSelects.value('containerNumberSelectId',[]);
        }

    });

    form.on('select(departmentFilter)', function (data) {
        var role = $("select[name='role']").val();

        if ((role== "3" || role == "4") && data.value== "1"){
            formSelects.value('containerNumberSelectId', [1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
        }

    });


    formSelects.btns('containerNumberSelectId', ['select', 'remove'], {show: 'name', space: '10px'});


    // formSelects.render('containerNumberSelectId');


});


function init() {
    _m.post("/users/achievePersonManageDropDown").then(function (res) {

        var data = res.data;
        var department = data.departmentList;

        var role = data.roleList;
        var roleOptions = "<option value=''>请选择角色</option>";

        var departmentOptions = "<option value=''>请选择部门</option>";

        for (var i in role) {
            roleOptions += "<option value='" + role[i].id + "'>" + role[i].roleDescription + "</option>";
        }

        for (var i in department) {
            departmentOptions += "<option value='" + department[i].id + "'>" + department[i].department + "</option>";
        }
        $("select[name ='role'] option").remove();
        $("select[name ='role']").append(roleOptions);
        $("select[name ='department'] option").remove();
        $("select[name ='department']").append(departmentOptions);
        form.render("select");
    });
}


function search(isReset) {


    var data = {
        url: api + '/users/achieve',
        method: 'post',
        where: {
            username: $("#searchName").val()
        }
    };
    if (isReset) {
        data.page = {};
        data.page.curr = 1;
    }
    table.reload('infoTableId', data);
}


function searchDepartment() {

    table.reload('departmentTableId', {
        url: api + '/department/achieve',
        method: 'post',
        where: {}
    });
}


function insertDepartment() {
    var description = $("input[name='description']").val();
    if ($.trim(description)) {
        _m.post("/department/insert", {description: description}).then(function (res) {
            if (res.code == 0) {
                MSG.success("新增部门", "成功");
                searchDepartment();
                $("input[name='description']").val();
                init();
            }
        });
    } else {
        MSG.warning("新增部门", "请填写部门");
    }

    // searchDepartment();
}


function showDepartmentWindow() {
    searchDepartment();
    DEPARTMENT_WINDOW = layer.open({
        id: 'departmentWindowId',
        type: 1,
        area: ['400px', '600px'],
        content: $('#departmentWindow')
        // , btn: ['关闭']
        // , yes: function (index, layero) {
        //     layer.close(index);
        // }
    });
}


function closeDepartment() {
    layer.close(DEPARTMENT_WINDOW);
}


function resetTable() {
    $("#resetSearchForm").click();
    search(true);
}

function showWindow(titleBg, operatorType) {
    updateOrInsert = operatorType;
    setPersonTitle(titleBg);
    PERSON_WINDOW = layer.open({
        id: 'personWindowId',
        type: 1,
        area: ['500px', '600px'],
        content: $('#personWindow'),
        success: function () {

        },
        end: function () {

        }
    });
}


function insert(data) {
    _m.post("/users/insert", data).then(
        function (res) {
            $("#save").removeAttr("disabled");
            if (res.code == 0) {
                $('#reset').click();
                MSG.success("人员添加操作", res.msg);
                closeWindow();
                search();
            }
        }
    );
}

function update(data, type) {
    _m.post("/users/update", data).then(
        function (res) {
            $("#save").removeAttr("disabled");
            if (res.code == 0) {

                if (type) {
                    MSG.success("人员删除操作", res.msg);
                    closeDelWindow();
                    search();
                } else {
                    MSG.success("人员修改操作", res.msg);
                    closeWindow();
                    search();
                }

            }
        }
    );
}


function setPersonTitle(title) {

    $("#personTitle").attr("src", title);
}

function assignmentData(data) {
    $("input[name='id']").val(data.id);
    $("select[name='role']").val(data.role);
    $("input[name='username']").val(data.username);
    $("input[name='icNumber']").val(data.icNumber);
    $("input[name='containerNumber']").val(data.containerNumber);
    $("select[name='department']").val(data.departmentId);
    if(data.containerNumber == "all"){
        formSelects.value("containerNumberSelectId",[1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
    }else  if(!data.containerNumber){
        formSelects.value("containerNumberSelectId",[]);
    }else {
        formSelects.value("containerNumberSelectId",data.containerNumber.split(","));
    }

}


function getSelectedTableData() {
    var checkStatus = table.checkStatus('infoTableId');
    return checkStatus.data;
}


function del() {
    var data = getSelectedTableData();
    if (data.length == 0) {
        MSG.warning("删除人员操作", "未选择数据");
        return;
    }
    cacheDelData = data[0];
    cacheDelData.isDel = 1;
    PERSON_DEL_WINDOW = layer.open({
        id: 'personDelWindowId',
        type: 1,
        area: ['400px', '400px'],
        content: $('#personDelWindow'),
        success: function () {

        },
        end: function () {
        }
    });
}

function delData() {
    update(cacheDelData, "del");
}

function closeWindow() {
    $('#reset').click();
    layer.close(PERSON_WINDOW);
    updateOrInsert = '';
}

function closeDelWindow() {
    cacheDelData = {};
    layer.close(PERSON_DEL_WINDOW);
}