//法人架构类
function LegalZtree (){
	
	//法人架构树形列表
	this.getOrganization = function(){

		//树状图插件开始
		var setting = {
			view: {
				selectedMulti: false,
				showIcon :false,
				addDiyDom: addDiyDom
			},
			async: {
				enable: true,
				url: SERVER_ROOT + '/' + SERVER_NAME_GET_ALLTREEDATA,//通过getTree接口获取树状数据
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
				beforeDrag: beforeDrag,
			}
		};
		console.log(setting.async.url);
		var zNodes = [];
		
				
		function doJsonCallback(jsonp) {
			console.log("jsonp mssage:" + jsonp);
		}
		
		
		//对 子节点请求 返回数据进行预处理的函数
		function ajaxDataFilter(treeId, parentNode, responseData) {
			console.log(responseData);
			if (!isNull(responseData)) {
				if (responseData.code == -1) {
				    responseData = null;
				    BJUI.alertmsg('info', '没有下一级了');
			   }
			    return responseData;
			}
		};
		
		//用于捕获节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作
		function beforeDrag(treeId, treeNodes) {
			return false;
		};
		
		//节点上固定显示法人架构 状态 和操作控件（启用，禁用，添加，修改）
		function addDiyDom(treeId, treeNode) {
			var enabledStatus = ''; //禁用取消高亮
			var editStatus = ''; //启用取消高亮
			var statusColour = ''; //法人状态颜色
			var orgUuid = treeNode.orgUuid; //获取当前节点的id
			if (treeNode.status == 0) {
				treeNode.status = "正常"
				editStatus = 'isaddDisplayStyle';
				enabledStatus = '';
				statusColour = 'status-colour-black';
			}
			if (treeNode.status == 1) {
				treeNode.status = "禁用"
				editStatus = '';
				enabledStatus = 'isaddDisplayStyle';
				statusColour = 'status-colour-red';
				
			}
			var sObj = $("#" + treeNode.tId + "_span");
			if ($("#nodeStatusBtn_"+treeNode.tId).length>0 || $("#enabledBtn_"+treeNode.tId).length>0 || $("#disabledBtn_"+treeNode.tId).length>0 || $("#addBtn_"+treeNode.tId).length>0 || $("#editBtn_"+treeNode.tId).length>0) return;
			
			//节点状态
			var nodeStatus = "<span class='"+statusColour+"' style='margin: 0px 50px 0px 0px;float: right;' id='nodeStatusBtn_" + treeNode.tId + "' title=''>" + treeNode.status + "</span>  ";
			sObj.after(nodeStatus);
			
			//启用 按钮
			var enabled = "<span class='"+editStatus+"' style='margin: 0px 5px;float: right;color:#2db7f5' id='enabledBtn_" + treeNode.tId + "' title='启用'>启用</span>  ";
			sObj.after(enabled);
			
			//禁用 按钮
			var disabled = "<span class='"+enabledStatus+"' style='margin: 0px 5px;float: right;color:#2db7f5' id='disabledBtn_" + treeNode.tId + "' title='禁用'>禁用</span>  ";
			sObj.after(disabled);
			
			//添加子节点  按钮
			var addStr = "<span class='' style='margin: 0px 5px;float: right;color:#2db7f5' id='addBtn_" + treeNode.tId + "' title='新增'>新增</span>  ";
			sObj.after(addStr);
			
			//修改  按钮
			var editStr = "<span class='' style='margin: 0px 5px;float: right;color:#2db7f5' id='editBtn_" + treeNode.tId + "' title='修改'>修改</span>  ";
			sObj.after(editStr);
			
			//获取启用  对象
			var enab = $("#enabledBtn_"+treeNode.tId);
			//获取禁用  对象
			var disab = $("#disabledBtn_"+treeNode.tId);
			//获取修改按钮  对象
			var edit = $("#editBtn_"+treeNode.tId);
			//获取添加子节点  对象
			var btn = $("#addBtn_"+treeNode.tId);
			
			//启用 方法
			if (enab) enab.bind("click", function(){
				var status = 0;
				statusMark = 1;
				legalZtree.LegalEnabledDisabled(treeNode,status);
			});
			//禁用 方法
			if (disab) disab.bind("click", function(){
				var status = 1;
				statusMark = 1;
				legalZtree.LegalEnabledDisabled(treeNode,status);
			});
			//修改点击   方法
			if (edit) edit.bind("click", function(){
				electronicSignature.towshowORhidden(allLegalObj,legalPersonModify,addsave,null);
				$("#orgUuidModify").val(treeNode.orgUuid);
				$("#newname").val(treeNode.name);
				$("#cancelParentId").val('');
				$("#hiddenParentId").val('');
			});
			//添加点击   方法
			if (btn) btn.bind("click", function(){
				console.log(treeNode);
				treeztreeNode = treeNode; // 获取当前节点对象
				electronicSignature.towshowORhidden(allLegalObj,addsave,legalPersonModify,null);
				$("#parentId").val(orgUuid);
				
			});
		};
		
		$(document).ready(function(){
			$.fn.zTree.init($("#LegalPersonZtree"), setting, zNodes);
		});
		
		//增加树状父节点和子节点
		$.fn.setAddTreeData = function (data){			
			var value = $("#fName").val();
			var parentId = $("#parentId").val();
			var orgUuid = data.content.orgUuid;
            //添加法人架构调用
			addNodes(value,orgUuid);	 	
		}
		
        //添加新节点
		function addNodes(value,orgUuid){
			var treeObj  = $.fn.zTree.getZTreeObj("LegalPersonZtree"),
			nodes = treeObj.getSelectedNodes(),
			treeNode = treeztreeNode;
			var treeNode_data = JSON.stringify(nodes);
            console.log(treeObj);				
			if (treeNode) {
				//newNode = treeObj.addNodes(treeNode, 0, newNode, false);
				console.log("是否插入子节点"+newNode);
				treeObj.reAsyncChildNodes(treeNode, "refresh",true);
				return false
			} else {
				var newNode	= {name:value,orgUuid:orgUuid};
				newNode = treeObj.addNodes(null,newNode);
				return false
			}
		}
		
	}
	
	//法人架构 启用 禁用
	this.LegalEnabledDisabled = function(treeNode,status){
		var id = treeNode.orgUuid;
		var status = status;
		interfaceServer.LegalEnabledDisabled(id,status);
	}
	
	    
    //法人架构父节点添加
    this.doSaveTreeBaseNode = function(){
		try {
			//法人架构节点添加校验
			if(isNull($("#fName").val())){
				BJUI.alertmsg('info', '公司名称不能为空');
				return;
			};
			var myform = document.getElementById("addform");			
			interfaceServer.doSaveTreeBaseNode(myform);
			
		} catch (error) {
			console.log(error);	
		}	
    }
    
    //法人架构 修改 节点
    this.doLegalPersonModify = function(){
    	try{
    		var legalPersonModifyForm = $("#legalPersonModifyForm");
    		interfaceServer.getLegalPersonEditName(legalPersonModifyForm);
    	}catch(e){
    		console.log(e);
    	}
    	
    }
    
}



//机构类型类
function OrganizationType (){
	
	//类型维护表单提交
	this.doSetUp = function (){
    	if(isNull($("#name").val())){
			return;	
    	}else{
    		var myform = document.getElementById("organiAddForm"); //获取需要提交的表单
    		interfaceServer.getOrgTypeSave(myform);
    	}
    	
    }
	
	//类型维护页面删除
    this.OrganiTypedelete = function(even){
    	var typeUuid = even.id; //删除对象  的id
    	interfaceServer.OrganiTypedelete(typeUuid);
    }
    
     //类型维护页面修改
    this.updateOrgTypemodify = function (node) {
    	electronicSignature.towshowORhidden(allBombObj,organitypeModifyObj,organitypeAddObj,null);
        var tr1 = node.parentNode.parentNode.parentNode.parentNode; //获取当前对象的的tr级对象 
    	var element = tr1.cells[1]; //获取修改的td对象
		var oldhtml = element.innerHTML; //获取对象的name
		var typeuuid = tr1.id; //获取对象的id
		$("#organitypeModifyName").val(oldhtml); 
		$("#organitypeuuid").val(typeuuid);
    }
    
    //类型维护页面修改  保存
    this.organitypeModifyName = function (){
    	var typeuuid = $("#organitypeuuid").val(); //修改的对象id
    	var value = $("#organitypeModifyName").val(); //修改对象的 新name
    	interfaceServer.getupdateOrgType(value,typeuuid);
    }

}




//日志模块
function GetLogModule(){
	
	//平台操作日志 查询
	this.logInitialization = function (){
		start = 1; //默认初始页面
		interfaceServer.getLogSearch(start);
		
	}
	
}


//机构类型实例化
var organizationType = new OrganizationType();
//法人架构类实例化
var legalZtree = new LegalZtree();
//平台操作日志实例化
var getLogModule = new GetLogModule();


/**
 * 
 * @param {*liaozw} data 
 * 法人架构统一处理数据回调
 */

//父节点 添加数据 返回 添加公司
function updateSaveTreeBaseNode(data){
	try {
		//添加成功弹窗隐藏
		electronicSignature.operationRequest(null,allLegalObj,null);
		//父节点添加数据返回调用setAddTreeData()填充树形列表
		$().setAddTreeData(data);	
	} catch (error) {
		console.log(error);
	}
}

//法人架构节点修改 ，启用，禁用 返回  处理
function upLegalPersonEditName(data){
	if (statusMark == 0) {
		//修改成功后重新获取法人架构列表
	    legalZtree.getOrganization();
	    //法人架构修改 隐藏
		electronicSignature.operationRequest(null,allLegalObj,null);
	} if (statusMark == 1) {
		statusMark = 0;
		//修改成功后重新获取法人架构列表
	    legalZtree.getOrganization();
	}
    statusMark = 0;
}




/**
 * 
 * @param {*liaozw} data 
 * 机构类型统一处理数据回调
 */
//机构类型数据返回处理
function updateOrg(data){
    try{
    	//绑定数据前清空原有的数据
    	$("#name").val('');
		$("#tbodysetting").html('');
		var html = "";
		data = data.content;
		if (!isNull(data)) {
			for(var i=0;i<data.length;i++){
				/*var isDelete = '';//是否允许删除
				var t = "'confirm'";
				var z = "'你确定要执行该操作吗?'";
				isDelete = 'data-options="{type:'+t+', msg:'+z+', okCall:function(){organizationType.OrganiTypedelete('+data[i].id+')}}"';*/
				html += "<tr id=" + data[i].typeUuid + ">";
	            html +=     "<td style='padding-left: 20px;'>" + (i+1) + "</td>";
	            html +=     "<td id='" +(i+101)+"_type" + "' style='padding-left: 20px;'>" + data[i].name + "</td>";
				html +=     '<td><div class="datagrid-toolbar"><div class="btn-group" role="group"><button type="button" class="btn btn-white" data-icon="times" id="' + (i+1) + "_Typemodify" + '" onclick="organizationType.updateOrgTypemodify(this);"><span class="but-badge"><img src="img/icon-Edit.svg"/> </span></button><button type="button" class="btn btn-white" onclick="organizationType.OrganiTypedelete(this)" data-icon="times" id="' + data[i].typeUuid + '"><span class="but-badge"><img src="img/icon-Delete.svg"/></span></button></div></div> </td>';    
	            html += "</tr>";
			}
		}
		$("#tbodysetting").append(html);
    }catch(e){
    	console.log(e);
    }   
}

//类型维护新增表单提交成功并刷新数据
function updateOrgSave(data){
	
	$("#tbodysetting").html("");
	interfaceServer.getOrgType();
	electronicSignature.operationRequest(null,allBombObj,null);
}

//类型维护 删除成功并刷新数据
function upOrganiTypedelete(data) {
	
	$("#tbodysetting").html("");
	interfaceServer.getOrgType();
}

//类型维护  修改  
function updateOrgType(data){
	interfaceServer.getOrgType();
	electronicSignature.operationRequest(null,allBombObj,null);
}




/**
 * 
 * @param {*liaozw} data 
 * 日志模块统一处理数据回调
 */

function upLogByPageSearch (data){
	try{
		$("#logSearchData").html('');
		if(!isNull(data.content)){
			data = data.content;
			var data = JSON.parse(data);
			totalPage = data.totalPage; //总页数
			if (!isNull(data.list)) {
				data = data.list; 
				var html = '';
				for (var i=0; i<data.length; i++) {
					
					//操作状态装换
					var state = data[i].state;
					if (state == "true") {
						data[i].state = "成功";
					} else {
						data[i].state = "失败";
					}
					
					//时间戳转换成"yyyy--mm--dd"格式
					/*var date = data[i].date;
					date =  new Date(date);
				    var y = 1900+date.getYear();
				    var m = "0"+(date.getMonth()+1);
				    var d = "0"+date.getDate();
				    date = y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);*/
					
					$("#logPagination").html(start + '/' + totalPage);  //分页码
					
					html += "<tr>";
					html += "<td style='padding-left: 20px;'>" + (i+1) + "</td>";
					html += "<td>" + data[i].userName + "</td>";  //用户账号
					html += "<td>" + data[i].handle + "</td>";  //什么操作
					html += "<td>" + data[i].date + "</td>"; //操作时间
					html += "<td>" + data[i].state + "</td>"; //状态
					html += "<td>" + data[i].comment + "</td>"; //反馈信息
				}
				$("#logSearchData").append(html);
			}
		}
	}catch(e){
		console.log(e);
	}
	
	
}
