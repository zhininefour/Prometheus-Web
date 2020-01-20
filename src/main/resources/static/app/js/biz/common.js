'use strict';
// 初始化字典表下拉框
function initCodeType(codeType, id, title, input) {
    let code_selects = [];
    ajaxSyncPost(ctx + "app/common/selectDictDataList/" + codeType, {}, function (result) {
        let data = result.data;
        $.each(data, function (i) {
            let level = {
                label: data[i].dataName,
                value: data[i].dataCode,
                children: []
            };
            //TODO 编辑的时候，默认选择
            // if(input != undefined && input == data[i].data_value){
            //     $('#' + id).attr('data-values', data[i].data_value);//设置 value值。PS：attr(属性，值)
            //     inputValue =  data[i].display_value;
            // }
            if (level.children.length <= 0) {
                level.children.push({label: "", value: ""});
            }
            code_selects.push(level);
        });
    });
    $("#" + id + "").on('click', function () {
        weui.picker(code_selects, {
            onChange: function (result) {
                let data = result[0];
                $("#" + id + "").val(data.label);
                $("#" + id + "Value").val(data.value);
            }
        });
    });
}


//初始化小区楼栋房屋的选择框
function initDistrictBuildHouse() {
    let house_selects = [];
    ajaxSyncPost(ctx + "app/device/water/selectDistrictBuildHouseData", {}, function (result) {
        let districts = result.district, builds = result.build, houses = result.house;
        $.each(districts, function (i) {
            let level1 = {
                label: districts[i].dataName,
                value: districts[i].dataCode,
                children: []
            };
            $.each(builds, function (j) {
                if (districts[i].dataCode == builds[j].parentCode) {
                    let level2 = {
                        label: builds[j].dataName,
                        value: builds[j].dataCode,
                        children: []
                    };
                    $.each(houses, function (x) {
                        if (builds[j].dataCode == houses[x].parentCode) {
                            let level3 = {
                                label: houses[x].dataName,
                                value: houses[x].dataCode
                            };
                            level2.children.push(level3);
                        }
                    });
                    if (level2.children.length <= 0) {
                        level2.children.push({label: "", value: ""});
                    }
                    level1.children.push(level2);
                }
            });
            house_selects.push(level1);
        });
    });
    $('#districtBuildHouse').on('click', function () {
        weui.picker(house_selects, {
            onConfirm: function (result) {
                let district = result[0], build = result[1], house = result[2];
                $("#districtBuildHouse").val(district.label + " " + build.label + " " + house.label);
                //适用一个房间只能装一个水表情况
                // $.ajaxSettings.async = false;
                // $.post(ctx + "app/device/water/checkHouseBindling/" + house.value, function (result) {
                //     if (result.code != undefined && result.code == 0) {
                //         $.alert("该房间已经绑定过水表");
                //     }
                // });
                $("#districtId").val(district.value);
                $("#buildId").val(build.value);
                $("#houseId").val(house.value);
            }
        });
    });
}

//初始化安装位置的选择框
function initInstallAddr() {
    let install_addr_selects = [];
    ajaxSyncPost(ctx + "app/device/water/selectInstallAddrData", {}, function (result) {
        let addrClass = result.addrClass, addrType = result.addrType;
        $.each(addrClass, function (i) {
            let level1 = {
                label: addrClass[i].dataName,
                value: addrClass[i].dataCode,
                children: []
            };
            $.each(addrType, function (j) {
                if (addrClass[i].dataCode == addrType[j].parentCode) {
                    let level2 = {
                        label: addrType[j].dataName,
                        value: addrType[j].dataCode
                    };
                    level1.children.push(level2);
                }
            });
            if (level1.children.length <= 0) {
                level1.children.push({label: "", value: ""});
            }
            install_addr_selects.push(level1);
        });
        return install_addr_selects;
    });
    $('#installAddr').on('click', function () {
        weui.picker(install_addr_selects, {
            onChange: function (result) {
                let addrClass = result[0], addrType = result[1];
                $("#installAddr").val(addrClass.label + " " + addrType.label);
                $("#installAddrClass").val(addrClass.value);
                $("#installAddrType").val(addrType.value);
            }
        });
    });
}
