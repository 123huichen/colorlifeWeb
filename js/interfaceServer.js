function include(path){
	
    var a=document.createElement("script");
    a.type = "text/javascript";
    
    console.log(path);
    console.log(a.src);
    a.src=path; 
    console.log(a.src);
    
    var head=document.getElementsByTagName("head")[0];
    head.appendChild(a);
}


 function InterfaceService() {
 	 	
 	console.log('------InterfaceService ()------');
 	
 }
 

 	// 登录服务接口调用
InterfaceService.prototype.doLogin = function(form) {
 	
 		httpService.doGetSubmit(form, SERVICE_NAME_LOGIN);
}
    
InterfaceService.prototype.doMain = function(sessionID) {
 	
 		var data = new Array();
 		
 		//data['sessionID'] = sessionID;
 		httpService.doGetRequest(SERVER_NAME_MAIN, data);
}

    //彩之云登录授权
InterfaceService.prototype.doCzyAuthor = function(sessionID) {
 	
 		var data = new Array();
 		
 		httpService.doGetRequest(SERVICE_NAME_COLORFULCLOUD, data);
}
 		
    //证照页面初始化
InterfaceService.prototype.getTreeData = function(orgUuid){
	
		console.log('orgUuid:' + orgUuid);
		
	    var data = new Array();
	    
	    // 传入orgUuid 请求子节点数据否则请求父节点数据 
		if(isNull(orgUuid) == false) {
			
			data['orgUuid'] = orgUuid;
		}
 	    
 		httpService.doGetRequest(SERVER_NAME_GET_TREEDATA, data);
}

    //法人架构维护 全部
InterfaceService.prototype.getTreeAllData = function(orgUuid){
	
		console.log('orgUuid:' + orgUuid);
		
	    var data = new Array();
	    
	    // 传入orgUuid 请求子节点数据否则请求父节点数据 
		if(!isNull(orgUuid)) {
			data['orgUuid'] = orgUuid;
		}
 	    
 		httpService.doGetRequest(SERVER_NAME_GET_ALLTREEDATA, data);
}

    //法人架构修改
InterfaceService.prototype.getLegalPersonEditName = function(form){
	
 		httpService.doGetSubmit(form, SERVER_NAME_GETUPDATETREEVIEW);
}

    //法人架构 禁用 启用
InterfaceService.prototype.LegalEnabledDisabled = function(orgUuid, status){
	    
	    var data = new Array();
 		data['orgUuid'] = orgUuid;
 		data['status'] = status; 
	
 		httpService.doGetRequest(SERVER_NAME_GETUPDATETREEVIEW, data);
}

    //类型维护
InterfaceService.prototype.getOrgType = function(type, familyTypeId){
	
	    var data = new Array();
 		data['type'] = "org_type";
 		data['familyTypeId'] = 2; 
 	
 		httpService.doGetRequest(SERVICE_NAME_ORG, data);
 		
}

    //类型维护表单提交
InterfaceService.prototype.getOrgTypeSave = function(form, type){
	
	    var data = new Array();

 		data['type'] = "org_type";
 	
 		httpService.doGetSubmit(form, SERVICE_NAME_ORGSAVE, data);
}

    //类型维护页面删除
InterfaceService.prototype.OrganiTypedelete = function(typeUuid){
	
	    var data = new Array();

 		data['typeUuid'] = typeUuid;
 	
 		httpService.doGetRequest(SERVICE_NAME_DELORGTYPE, data);
 		
}

    //类型维护页面修改
InterfaceService.prototype.getupdateOrgType = function(name, typeUuid){
	
	    var data = new Array();
        data['name'] = name;
 		data['typeUuid'] = typeUuid;
 	
 		httpService.doGetRequest(SERVICE_NAME_UPDATEORGTYPE, data);
 		
}

   //平台操作日志查询
InterfaceService.prototype.getLogSearch = function(start){
	
	    var data = new Array();
	    data['start'] = start;
 	
 		httpService.doGetRequest(SERVICE_NAME_GETFINDALLBYPAGE, data);
}

   //平台操作日志搜索
InterfaceService.prototype.getLogSearchFor = function(userName, start){
	
	    var data = new Array();
	    data['userName'] = userName;
	    data['start'] = start;
 	
 		httpService.doGetRequest(SERVICE_NAME_GETFINDLOGBYNAME, data);
}

    //树形添加请求
InterfaceService.prototype.addTreeBaseNode = function(pid, type, familyTypeId){
	
	    var data = new Array();
	    data['pid'] = 0;
 		data['type'] = "org_type";
 		data['familyTypeId'] = 2;
 	
 		httpService.doGetRequest(SERVER_ADD_TREE_BASENODE, data);
}

    //从ICE获取省信息
InterfaceService.prototype.addProvinces = function(pid){
	
	var data = new Array();
	if(pid == null || pid == ''){
		data['pid'] = 1;	
	} else{
		data['pid'] = pid;
	}
	
	httpService.doGetRequest(SERVER_ADD_PROVINCES, data);
}

    //证照添加表单提交
InterfaceService.prototype.doSaveTreeBaseNode = function(form){
	
	httpService.doGetSubmit(form, SERVICE_NAME_ADDTREE);	
}

/*    //获取组织架构数据
InterfaceService.prototype.getCorporationTree = function(orgUuid){
	
	console.log('orgUuid:' + orgUuid);
	var data = new Array();
	if (orgUuid == null || orgUuid == '') {
		data['orgUuid'] = '';	
	} else {
		data['orgUuid'] = orgUuid;
	}
	httpService.doGetRequest(SERVICE_NAME_GETCORPORATIONTREE, data);
}*/

    //法人架构详细表单保存
InterfaceService.prototype.doSaveLegalPersonDetails = function(form){
	
 		httpService.doPostSubmit(form, SERVICE_NAME_SAVELEGAL);	
}

    // 图片在线地址调取
InterfaceService.prototype.doFileFromLicPath = function(licPathId){
	
	    var data = new Array();
 	    data['fileId'] = licPathId;
 	    
 		httpService.doGetRequest(SERVICE_NAME_DOWNLOADFILEFROMFILEID, data);	
}    
    
    //股东信息填写
InterfaceService.prototype.doSaveShareholderInformation = function(form){
	
 		httpService.doGetSubmit(form, SERVICE_NAME_SHAREHOLDER);
}

    //股东信息查询
InterfaceService.prototype.doSharehoderList = function(lid){
	
	    var data = new Array();
 	    data['lid'] = lid;
 	    
 		httpService.doGetRequest(SERVICE_NAME_SHAREHODERLIST, data);
 		
}

    //股东信息删除
InterfaceService.prototype.shareholdersDeleted = function(id){
	
	    var data = new Array();
 	    data['id'] = id;
 	    
 		httpService.doGetRequest(SERVICE_NAME_DELSHARINFO, data);
 		
}

    //根据执照id获取工商信息和股东信息
/*InterfaceService.prototype.doSaveLicSha = function(licenseId){
	
	var data = new Array();
	data['licenseId'] = licenseId;
	console.log(licenseId);
	console.log('start doGetSubmit');
	httpService.doGetRequest(SERVICE_NAME_GETLICSHA, data);
 		
}*/

    //工商信息修改
InterfaceService.prototype.findTreeNodeInformation = function(orgUuid){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	
	httpService.doGetRequest(SERVICE_NAME_GETLIC, data);
 		
}

    //获取证照上传参数
InterfaceService.prototype.doSaveGetData = function(){
	
	var data = new Array();
	
	httpService.doGetRequest(SERVICE_NAME_GETDATA, data);
}

    //证照上传
InterfaceService.prototype.doStartuploading = function(form, uploadUrl, fileSize, fileName){
	
	var data = new Array();
	
	data['fileSize'] = fileSize;
	data['fileName'] = fileName;

	httpService.doPostSubmitzz(form,SERVICE_NAME_STARTUPLOADING, uploadUrl, data);
 		
}
    //电子签章 印章数据初始化
InterfaceService.prototype.dogetSignatureList = function(orgUuid,pageIndex){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	if (isNull(pageIndex)){
		data['pageIndex'] = 1;
	} else {
		data['pageIndex'] = pageIndex;
	}

	httpService.doGetRequest(SERVICE_NAME_GETSIGNATURELIST, data);
}

	//印章上传
InterfaceService.prototype.dosaveSignature = function(form){
	
	httpService.doPostSubmit(form, SERVICE_NAME_SAVESIGNATURE);
}
	// 合同上传
InterfaceService.prototype.dosaveContract = function(form){
	
	httpService.doPostSubmit(form, SERVICE_NAME_SAVECONTRACT);	
}

    //电子签章 合同数据初始化 合同列表
InterfaceService.prototype.dogetContractList = function(orgUuid,pageIndex){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	if(isNull(pageIndex)){
		data['pageIndex'] = 1;
	}else{
		data['pageIndex'] = pageIndex;
	}
	
	httpService.doGetRequest(SERVICE_NAME_GETCONTRACTLIST, data);		
}

	//删除电子签章
InterfaceService.prototype.dodelSignature = function(sid){
	
	var data = new Array();
	data['id'] = sid;

	httpService.doGetRequest(SERVICE_NAME_DELSIGNATURE, data);
}

	//删除合同
InterfaceService.prototype.dodelContract = function(cuuid){
	
	var data = new Array();
	data['cuuid'] = cuuid;
	
	httpService.doGetRequest(SERVICE_NAME_DELCONTRACT, data);

}

	//修改合同
InterfaceService.prototype.dogetContractOne = function(cuuid){
	
	var data = new Array();
	data['contractId'] = cuuid;
	
	httpService.doGetRequest(SERVICE_NAME_GETCONTRACTONE, data);
}

	//修改印章
InterfaceService.prototype.dogetSignatureOne = function(sid){
	
	var data = new Array();
	data['sid'] = sid;

	httpService.doGetRequest(SERVICE_NAME_GETSIGNATUREONE, data);

}

	//注册二级账号,设置企业证件信息接口
InterfaceService.prototype.doapplyCert = function(orgUuid){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;

	httpService.doGetRequest(SERVICE_NAME_APPLYCERT, data);

}

	//注册二级账号,上上签证书查询 接口
InterfaceService.prototype.docertStatus = function(orgUuid,taskId){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['taskId'] = taskId;

	httpService.doGetRequest(SERVICE_NAME_CERTSTATUS, data);
	
}

	//中税CA认证 接口
InterfaceService.prototype.doZhongShuiCert = function(orgUuid){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;

	httpService.doGetRequest(SERVICE_NAME_ZHONGSHUICERT, data);
	
}

	//中税证书查询 接口
InterfaceService.prototype.doZhongShuiCertStatus = function(orgUuid){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['certType']= 2;

	httpService.doGetRequest(SERVICE_NAME_ZSCERTSTATUS, data);
	
}


	//获取合同印章数据
InterfaceService.prototype.doshowConDetail = function(orgUuid,cuuid){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['cuuid'] = cuuid;

	httpService.doGetRequest(SERVICE_NAME_SHOWCONDETAIL, data);
}

	//设置印章
InterfaceService.prototype.dosetSignImage = function(sid){
	
	var data = new Array();
	data['sid'] = sid;

	httpService.doGetRequest(SERVICE_NAME_SETSIGNIMAGE, data);
}

   //搜索印章
InterfaceService.prototype.doSignatureSearch = function(orgUuid,skey,pageIndex){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['skey'] = skey;
	data['pageIndex'] = pageIndex;
	console.log('start doGetSubmit');
	httpService.doGetRequest(SERVICE_NAME_SEALSEARCH, data);
	
}

	//添加签署者
InterfaceService.prototype.doaddSigner = function(orgUuid,cuuid){
	
	var data = new Array();
	data['lpId'] = orgUuid;
	data['ecId'] = cuuid;
	console.log('start doGetSubmit');
	httpService.doGetRequest(SERVICE_NAME_ADDSIGNER, data);
	
}

	//执行印章动作
InterfaceService.prototype.dosignContract = function(cuuid,orgUuid,signPageNum,signX,signY,signWidth,signHeight){
	
	var data = new Array();
	data['cuuid'] = cuuid;
	data['orgUuid'] = orgUuid;
	data['signPageNum'] = signPageNum;
	data['signX'] = signX;
	data['signY'] = signY;
	data['signWidth'] = signWidth;
	data['signHeight'] = signHeight;
	console.log('start doGetSubmit');
	httpService.doGetRequest(SERVICE_NAME_SIGNCONTRACT, data);
}


	//下载合同
InterfaceService.prototype.downloadCon = function(publiccuuid){
	
	var data = new Array();
	data['cuuid'] = publiccuuid;

	httpService.doGetDownload(SERVICE_NAME_DOWNLOADCON, data);
}

	//结束合同
InterfaceService.prototype.dofinishCon = function(publiccuuid){
	
	var data = new Array();
	data['cuuid'] = publiccuuid;

	httpService.doGetRequest(SERVICE_NAME_FINISHCON, data);
}

	//锁定合同
InterfaceService.prototype.dolockCon = function(publiccuuid){
	
	var data = new Array();
	data['cuuid'] = publiccuuid;
	
	httpService.doGetRequest(SERVICE_NAME_LOCKCON, data);	
};



	//审阅合同
InterfaceService.prototype.doupdateReview = function(id,ecid,orgUuid){
	
	var data = new Array();
	data['id'] = id;
	data['ecId'] = ecid;
	data['orgUuid'] = orgUuid;

	httpService.doGetRequest(SERVICE_NAME_UPDATEREVIEW, data);
};

	//删除签署者
InterfaceService.prototype.doremoveSigner = function(id){
	
	var data = new Array();
	data['id'] = id;
	
	httpService.doGetRequest(SERVICE_NAME_REMOVESIGNER, data);	
};


	//搜索合同
InterfaceService.prototype.doContractSearch = function(orgUuid,skey,pageIndex) {
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['skey'] = skey;
	data['pageIndex'] = pageIndex;
	
	httpService.doGetRequest(SERVICE_NAME_DOCONTRACTSEARCH, data);	
};

	//搜索合同状态
InterfaceService.prototype.doContractSearchState = function(orgUuid,state,pageIndex) {
	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['state'] = state;
	if(isNull(pageIndex)){
		data['pageIndex'] = 1;
	} else {
		data['pageIndex'] = pageIndex;
	}
	httpService.doGetRequest(SERVICE_NAME_DOCONTRACTSEARCHSTATE, data);	
};



/**
 * 
 * @param {*} orgUuid 
 * 权限管理
 */

   //显示员工列表
InterfaceService.prototype.doshowUsers = function(orgUuid){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	
	httpService.doGetRequest(SERVICE_NAME_SHOWUSERS,data);
};

   //权限管理账户搜索
InterfaceService.prototype.dogetManagementSeal = function(publicorgUuid,user){
	
	var data = new Array();
	data['orgUuid'] = publicorgUuid;
	data['user'] = user;
	
	httpService.doGetRequest(SERVICE_NAME_DOSEARCHUSER,data);
};

/*   //获取管理组织架构
InterfaceService.prototype.dogetOrgStructure = function(orgUuid){
	
	var data = new Array();
	data['orgUuid'] = '';
	httpService.doGetRequest(SERVICE_NAME_GETORGSTRUCTURE,data);
};*/

   //获取管理组织架构员工列表
InterfaceService.prototype.dogetOrgStructureUsers = function(orgUuid){
	
	var data = new Array();
	data['orgUuid'] = orgUuid;
	
	httpService.doGetRequest(SERVICE_NAME_GETORGSTRUCTUREUSERS,data);
};

   //增加员工列表
InterfaceService.prototype.doaddUsers = function(orgUuid,users){

	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['users'] = users;
	
	httpService.doGetRequest(SERVICE_NAME_ADDUSERS, data);
};


   //移除员工列表
InterfaceService.prototype.doremoveUsers = function(orgUuid,ids){

	var data = new Array();
	data['orgUuid'] = orgUuid;
	data['ids'] = ids;
	
	httpService.doGetRequest(SERVICE_NAME_REMOVEUSERS, data);
};

   //设置子级权限
InterfaceService.prototype.dosetSubLevel = function(sid,sub,orgUuid){

	var data = new Array();
	data['uid'] = sid;
	data['sub'] = sub;
	data['orgUuid'] = orgUuid;
	
	httpService.doGetRequest(SERVICE_NAME_SETSUBLEVEL,data);
};


   //设置权限
InterfaceService.prototype.dosetPower = function(uid,power,orgUuid){

	var data = new Array();
	data['uid'] = uid;
	data['power'] = power;
	data['orgUuid'] = orgUuid;
	
	httpService.doGetRequest(SERVICE_NAME_SETPOWER,data);
};

/**
 *时间提醒结构块 
 */
	//模糊查询员工信息
InterfaceService.prototype.doselectEmployee = function(keyword){

	var data = new Array();
	data['keyword'] = keyword;
	httpService.doGetRequest(SERVICE_NAME_SELECTEMPLOYEE,data);
};

	// 时间提醒上传
InterfaceService.prototype.dosetTimeReminder = function(form){

	httpService.doGetSubmit(form, SERVICE_NAME_SETTIMEREMINDER);	
}


var interfaceServer = new InterfaceService();