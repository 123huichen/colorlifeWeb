//权限管理类
function AuthorityManagement(){
	
	this.dogetOrgStructure = function (){
		try {
			interfaceServer.dogetOrgStructure();
		} catch (error) {
			console.log(error);
		}
	}
	
	//权限管理账户搜索
	this.domanagementSeal = function(){
		var user = $("#managementSealText").val();
		if (!isNull(user)) {
			interfaceServer.dogetManagementSeal(publicorgUuid,user);
		} else {
			interfaceServer.doshowUsers(publicorgUuid);
		}
		
	}
	
	//获取员工信息
	this.getUsersInfo = function (orgUuid){
		try {
			if(isNull(orgUuid)){
				BJUI.alertmsg('warn', '请选择左侧选择法人架构公司名');
				return;
			}
			interfaceServer.doshowUsers(orgUuid);
		} catch (error) {
			console.log(error);
		}
	};

	//获得管理组织架构
	this.getManagementList = function(orgUuid){
		try {
			if(isNull(orgUuid)){
				BJUI.alertmsg('warn', '请选择左侧选择法人架构公司名');
				return;
			};
			interfaceServer.dogetOrgStructure(orgUuid);
		} catch (error) {
			console.log(error);
		}
	};
    
	//添加员工列表
	this.addUserInfo = function(orgUuid,users){
		try {
			if(isNull(orgUuid)){
				BJUI.alertmsg('warn', '请选择左侧选择法人架构公司名');
				return;
			};
			if(isNull(users)){
				BJUI.alertmsg('warn', '员工列表选择为空');
				return;
			};
			interfaceServer.doaddUsers(orgUuid,users);
		} catch (error) {
			console.log(error);
		}
	};

	//设置子级权限
	this.setSetSubLevel = function(sid,myself){
		try {
			var sub = 0;
			if( $(myself).is(':checked')){
				sub = 1;
			}
			if(isNull(publicorgUuid)){
				BJUI.alertmsg('info','法人架构不能为空');
				return;
			}
			interfaceServer.dosetSubLevel(sid,sub,publicorgUuid);
		} catch (error) {
			console.log(error);
		}
	};

	//设置权限证照
	this.setSetLevelZZ = function(sid,myself){
		try {
			var power = 0;
			var tempPar = $(myself).parent().parent().children("div").eq(1).children("input").eq(0);
			console.log(tempPar);
			if($(myself).is(':checked')&&tempPar.is(':checked')){
				power = 3;
			} else if ($(myself).is(':checked')){
				power = 1;
			} else if (tempPar.is(':checked')){
				power = 2;
			}
			if(isNull(publicorgUuid)){
				BJUI.alertmsg('info','法人架构不能为空');
				return;
			}
			interfaceServer.dosetPower(sid,power,publicorgUuid);
		} catch (error) {
			console.log(error);
		}
	};
	//设置权限签章
	this.setSetLevelQZ = function(sid,myself){
		try {
			var power = 0;
			var tempPar = $(myself).parent().parent().children("div").eq(0).children("input").eq(0);
			console.log(tempPar);
			if($(myself).is(':checked')&&tempPar.is(':checked')){
				power = 3;
			} else if ($(myself).is(':checked')){
				power = 2;
			} else if(tempPar.is(':checked')){
				power = 1;
			}
			if(isNull(publicorgUuid)){
				BJUI.alertmsg('info','法人架构不能为空');
				return;
			}
			interfaceServer.dosetPower(sid,power,publicorgUuid);
		} catch (error) {
			console.log(error);
		}
	};
}

var authorityManagement = new AuthorityManagement();//权限管理实例化

/**
 * 
 * @param {*liaozw} data 
 * 统一处理数据回调
 */

// 显示员工信息 数据回调
function upshowUsers(data){
	try {
		var data ;
		if(!isNull(data.content)){
			data = JSON.parse(data.content);
		}
		
		var html = '';
		for( var i = 0; i < data.length; i++ ) {
			
			html += "<tr>";
			html +=     "<td>" + (i+1) + "</td>";
			html +=     "<td>" + data[i].username + "</td>";
			html +=     "<td>" + data[i].name + "</td>";
			html +=     "<td>" + data[i].jobType +"</td>";
			html +=     "<td><input type='checkbox' name='subset' id='subset"+i+"' onclick='authorityManagement.setSetSubLevel("+data[i].id+",this)' vaule=''></td>";//0禁止 1允许
			html +=     "<td><div class='row-input' style='float: left; margin-right: 10px;'><input type='checkbox' id='subsetZZ"+i+"' vaule='证照' onclick='authorityManagement.setSetLevelZZ("+data[i].id+",this)'>证照</div><div class='row-input'><input type='checkbox' id='subsetQZ"+i+"' vaule='电子签章' onclick='authorityManagement.setSetLevelQZ("+data[i].id+",this)'>电子签章</div></td>";// 1有权访问证照  2有权访问电子签章 3 两者都可以访问
			html += "</tr>"; 
		}
		$("#tbodyAdmin").html(html);
		
		for( var i = 0; i < data.length; i++ ) {
			if (data[i].sub == 0) {    	
				$("#subset"+i).attr("checked",false);	
			} else {
				$("#subset"+i).attr("checked", true);
			}
			if(data[i].power == 1) {    	
				$("#subsetZZ"+i).attr("checked",true);	
			} else if (data[i].power == 2) {
				$("#subsetQZ"+i).attr("checked", true);
			} else if (data[i].power == 3) {
				$("#subsetZZ"+i).attr("checked",true);	
				$("#subsetQZ"+i).attr("checked", true);
			} else {
				$("#subsetZZ"+i).attr("checked",false);	
				$("#subsetQZ"+i).attr("checked", false);;
			}
		};
	} catch (error) {
		console.log(error);
	}
};	

//权限管理账户搜索 数据回调
function pugetManagementSeal(data){
	console.log(data);
}

// 增加员工列表 数据回调
function upaddUsers(data){
	try {
		//BJUI.alertmsg('info', data.result);
		$("#organizationDataDisplay").empty();
		electronicSignature.operationRequest(showList,addshowList,null);
		authorityManagement.getUsersInfo(publicorgUuid);
	} catch (error) {
		console.log(error);
	}
};

// 移除员工列表 数据回调
function upremoveUsers(data){
	console.log('移除员工列表数据回调'+data);
};

//获取管理组织架构员工 数据回调
function upgetOrgStructureUsers(data){
	try {
		var data = data;
		if(!isNull(data.content)){
			data = JSON.parse(data.content);
		}
		console.log('管理组织架构员工数据回调'+data);
		var html='';
		for(var i =0; i<data.length; i++){
			html += "<tr>";
			html +=     "<td>" + (i+1) + "</td>";
			html +=     "<td><div class='row-input'><input type='checkbox' name='UserEntity' id='' vaule=''></div></td>";
			html +=     "<td>" + data[i].username + "</td>";
			html +=     "<td>" + data[i].name + "</td>";
			html +=     "<td>" + data[i].jobType + "</td>";
			html +=     "<td style='display:none;'>" + data[i].accountUuid + "</td>";
			html +=     "<td style='display:none;'>" + data[i].corpId + "</td>";
			html +=     "<td style='display:none;'>" + data[i].mobile + "</td>";
			html +=     "<td style='display:none;'>" + data[i].email + "</td>";
			html +=     "<td style='display:none;'>" + data[i].sex + "</td>";
			html +=     "<td style='display:none;'>" + data[i].jobUuid + "</td>";
			html +=     "<td style='display:none;'>" + data[i].enabled + "</td>";
			html +=     "<td style='display:none;'>" + data[i].comment + "</td>";
			html += "</tr>";
		};
		$("#organizationDataDisplay").html(html);
	} catch (error) {
		console.log(error);
	}
};

//设置子级权限回调 数据会调
function upsetSubLevel(data){
	try {
		BJUI.alertmsg('info',"子级权限设置成功");
	} catch (error) {
		console.log(error);
	}
};

//设置权限 数据回调
function upsetPower(data){
	try {
		BJUI.alertmsg('info',"权限设置成功");
	} catch (error) {
		console.log(error);
	}
};
