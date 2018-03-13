//法人架构修改，管理组织架构，添加签署者，添加管理员
function ZtreeList (){

	//树形列表对象event,number为1，2，3，4 分别对应 (法人架构修改，管理组织架构，添加签署者，添加管理员)
	this.ztreelistnode = function (ztreeevent,number){
		//请求串
		var ztreeUrl;

		//判断是请求组织架构接口还是法人架构接口(SERVER_NAME_GET_TREEDATA法人架构)，(SERVICE_NAME_GETORGSTRUCTURE组织架构)
		if (number == 1 || number == 3) {
			ztreeUrl = SERVER_ROOT + '/' + SERVER_NAME_GET_TREEDATA;
		};
		if (number == 2 || number == 4) {
			ztreeUrl = SERVER_ROOT + '/' + SERVICE_NAME_GETORGSTRUCTURE;
		};
		var setting = {
			view: {
				addHoverDom: addHoverDom,
				removeHoverDom: removeHoverDom,
				selectedMulti: false,
				showIcon :false
			},
			async: {
				enable: true,
				url : ztreeUrl,
				autoParam: ["orgUuid"],
				type : "get",
				dataType : "jsonp",
				jsonp : "callback",
				jsonpCallback : "doJsonCallback",
				dataFilter: ajaxDataFilter
			},
			edit: {
				enable: true,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			data: {
				keep: {
					parent:true,
					leaf:true
				},
				simpleData: {
					enable: true,
					idKey: "orgUuid",
					pIdKey: "parentId",
					rootPId: 0
				},
			},
			callback: {
				onClick: zTreeOnClick,
				onExpand: zTreeOnExpand
			}
		};
		
		//定义ztree组件使用的数据
		var zNodes = [];
		
		console.log(ztreeUrl);
		
		//对 子集请求 返回数据进行 预处理的函数
		function ajaxDataFilter(treeId, parentNode, responseData) {
			if (!isNull(responseData)) {
				if (responseData.code == -1) {
				    responseData = null;
			    }
			    return responseData;
			}
		};
		
		function doJsonCallback(jsonp) {
			
			console.log("jsonp mssage:" + jsonp);
		}
				
		//点击 节点 判断对象选择 事件 （dropdownMenuObj法人架构修改），  （SignerListDemoObj 添加签署者）
		//点击 节点 判断对象选择 事件 （1法人架构修改），（2管理组织架构），  （3添加签署者）, （4添加管理员）
		function zTreeOnClick(event, treeId, treeNode, clickFlag){
			if (number == 1) {
				$("#cancelParentId").val(treeNode.name);
				$("#hiddenParentId").val(treeNode.orgUuid);
				$("#DropdownMenuBackground").hide();
			}
			if (number == 2) {
				$("#manageName").val(treeNode.name);
				$("#manageId").val(treeNode.orgUuid);
				$("#manageZtreeDiv").hide();
			}
			if (number == 3) {
				return;
			}
			if (number == 4) {
				var orgUuid = treeNode.orgUuid;
				adminorgUuid = orgUuid;
				interfaceServer.dogetOrgStructureUsers(orgUuid);//获取组织架构员工信息
			}
		};
		
		function zTreeOnExpand(event,treeId,treeNode){
			console.log(treeNode);
			$("#cancelParentId").val("");
		}
		
		//鼠标经过树形列表事件
		function addHoverDom(treeId, treeNode){
			try {
				var sObj = $("#" + treeNode.tId + "_span");
				if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
				
				if (number == 3) {
					var addStr = "<span class='add button' style='margin-top: 9px; float: right;' id='addBtn_" + treeNode.tId + "' title='添加签署者' onfocus='this.blur();'></span>  ";
					sObj.after(addStr);
					var btn = $("#addBtn_"+treeNode.tId);
					if (btn) btn.bind("click", function(){
						//添加签署者要获取orgUuid和cuuid
						var orgUuid = treeNode.orgUuid;
						console.log("orguuid" + orgUuid);
						var cuuid = publiccuuid;//合同ID
						interfaceServer.doaddSigner(orgUuid,cuuid);
					});
				}
				
			} catch (error) {
				console.log(error);
			}
				
		};
		
		//鼠标离开树形列表事件
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};
		
		$(document).ready(function(){
			$.fn.zTree.init($(ztreeevent), setting, zNodes);
		}); 
	}
	
}

var ztreeList = new ZtreeList();
