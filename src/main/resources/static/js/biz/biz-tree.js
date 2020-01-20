//查询树结构数据
function initTree() {
    var options = {
        // id: id,
        url: ctx + "basefile/house/districtBuildTreeData",
        check: {enable: true},
        expandLevel: 3,
        onClick: zOnClick,
        onCheck: zOnCheck
    };
    $.tree.init(options);
};
//勾选查询
function zOnCheck(event, treeId, treeNode) {
    var nodes = $._tree.getCheckedNodes(true);
    var builds = [];
    $.map(nodes, function (row) {
        var id = row["id"];
        var pId = row["pId"];
        if(pId == null){
            //则这条数据是 小区
        }else{
            //这条数据是楼栋的勾选框
            builds.push(id);
        }
    });
    $("#buildIds").val(builds.join());
    $.table.search();
}
//点击查询
function zOnClick(event, treeId, treeNode) {
    if(treeNode.pId == null){
        //点击的 上级（小区）
        $("#district").val(treeNode.id);
    }else{
        $("#district").val(treeNode.pId);
        $("#buildId").val(treeNode.id);
    }
    $.table.search();
}
//展开所有行
$('#btnExpand').click(function () {
    $._tree.expandAll(true);
    $(this).hide();
    $('#btnCollapse').show();
});
//关闭所有行
$('#btnCollapse').click(function () {
    $._tree.expandAll(false);
    $(this).hide();
    $('#btnExpand').show();
});
//刷新
$('#btnRefresh').click(function () {
    $("#keyword").val('');
    initTree();
});

//跳转树管理页面
function distract() {
    var url = ctx + "basefile/district";
    $.modal.openTab("小区信息", url);
}