//证照管理类
function LicenseManagement(){
   
  	//获取 当前选中省的id 获取 市 信息
  	this.doAddCity = function (pid){
		try {
			reqType = 2;
			interfaceServer.addProvinces(pid); 
			//重新选择省的时候清空市区的数据
			$("#city").empty();
			$("#region").empty();
		} catch (error) {
			console.log(error);	
		}
  	}
  	
  	//获取 当前选中市的id 获取 县/区 信息
  	this.doAddArea = function (pid){
		try {
			reqType = 3;
			interfaceServer.addProvinces(pid);
			//重新选择 市 的时候清空 区 的数据
			$("#region").empty();
		} catch (error) {
			console.log(error);
		}
  	}
    
    //工商信息修改
    this.businInformModify = function (){
		try {
			BusinessFormOrBusinessDetails = true;
			$("#orgUuid").val(publicorgUuid);  //当前绑定工商信息的法人架构id回填到工商信息表单
			electronicSignature.operationRequest(addlegalUpsObj,corpoInformObj,null);
			//通过法人架构id请求工商信息数据
			interfaceServer.findTreeNodeInformation(publicorgUuid);
		} catch (error) {
			console.log(error);
		}
    }
    
    //股东信息填写    
    this.doSaveShareholderInformation = function(){
		try {
			//股东信息填写校验
			if(isNull($("#shareholderName").val()) || isNull($("#fund").val()) || isNull($("#realFund").val())){
				return;
			};
			if(!nonNegative($("#fund").val())){
				return;
			};
			if (!nonNegative($("#realFund").val())) {
				return;
			}
			var inforform = $("#inforform"); //获取保存的股东信息表单
			interfaceServer.doSaveShareholderInformation(inforform);
		} catch (error) {
			console.log(error);
		}
    }
    
    //股东信息修改
    this.shareInformModify = function (){
		try {
			electronicSignature.operationRequest(sharInforObj,corpoInformObj,null);
			$("#tbMain").empty();
			var lid = $("#id").val();
			interfaceServer.doSharehoderList(lid);
		} catch (error) {
			console.log(error);
		}
    }
    
	//法人架构树形列表
	this.gettreeRequest = function(){

    	var treeNodeztree = null; //定义当前节点对象
		var SubsetProhibited = 0; //是否拥有子级权限 0无 1有
		var tempSuper = null; //是否为超管 true为超管 false非超管
		var temporaryStorage = getStorage(SERVICE_NAME_DATA_TEMP);// 接收登录返回的法人架构和权限数据
		var zNodes = []; //存储树形列表数据

		//树状图插件开始
		var setting = {
			view: {
				addHoverDom: addHoverDom,
				removeHoverDom: removeHoverDom,
				selectedMulti: false,
				showIcon :false
			},
			async: {
				enable: true,
				url: SERVER_ROOT + '/' + SERVER_NAME_GET_TREEDATA, //通过getTree接口获取树状数据
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
				onClick:zTreeOnClick,  //节点点击事件
				beforeAsync: zTreeBeforeAsync, //节点展开事件
				beforeDrag: beforeDrag, //节点拖拽事件
				onAsyncSuccess: zTreeOnAsyncSuccess, //异步加载正常结束的事件
				onAsyncError: zTreeOnAsyncError, //异步加载出现异常错误的事件
			}
		};
		
		if(!isNull(temporaryStorage)){
			temporaryStorage = JSON.parse(temporaryStorage);
			tempSuper = temporaryStorage.super;
		};
		
		//超管通过getTree获取树形列表数据 非超管使用zNodes
		if(tempSuper == "true"){
			zNodes = [];
		}else{
			if(!isNull(temporaryStorage.legalPersons)){
				zNodes = JSON.parse(temporaryStorage.legalPersons);
			}
		};

		//点击当前节点时获取当前节点的orgUuid，并向服务器传orgUuid获取响应的数据
		function zTreeOnClick(event, treeId, treeNode, clickFlag){
			try {
				var orgUuid = treeNode.orgUuid ;
				publicorgUuid = orgUuid ; //orgUuid赋值
				publicCompany = treeNode.name;//设置公司名
				electronicSignature.operationRequest(null,signatureObj,managementObj);
				electronicSignature.operationRequest(null,licenseObj,$("#timeReminder"));
				$("#emlieTempInfo").html("");//置空
				$("#oaListTime").val("");
				publicPageCon=1;
				//判断是否拥有证照，签章权限 超管拥有全部权限 非超管tempPower为1证照权限，2签章权限，3有证照和签章权限
				if ( tempSuper == "true" ) {
					var datatempInfo = temporaryStorage.powerInfo;
					if (!isNull(datatempInfo)) {
						var datatempUser = datatempInfo.superUser;
						if (!isNull(datatempUser)) {
							tempPower = datatempUser.power;
						}
					}
				} else {
					var tmep = temporaryStorage.powerInfo[orgUuid];
					if (!isNull(tmep)) {
						tempPower = tmep.power;
					}
					if( tempPower == 1 ) {
						$("#license").show();
						$("#signature").hide();						
					} else if( tempPower == 2 ) {
						$("#license").hide();
						$("#signature").show();
					} else if ( tempPower == 3 ) {
						$("#license").show();
						$("#signature").show();
					} else {
						$("#license").hide();
						$("#signature").hide();
					}
				};
				
				if ( (licenseORsignature == 1 && tempPower == 1) ||(licenseORsignature == 1 && tempPower == 3)) {
					electronicSignature.operationRequest(licenseObj,signatureObj,managementObj);
					BusinessFormOrBusinessDetails = false;
					//获取节点的工商信息和股东信息
					interfaceServer.findTreeNodeInformation(publicorgUuid);
					//工商信息表单显示
					electronicSignature.showORhidden(null,addlegalUpsObj,sharInforObj,null);
					
					$("#id").val(""); 	//创建新工商信息的时候清除多余的工商信息id
					$("#legalPersonId").val("");//创建新工商信息的时候清除多余的法人id
					$("#picturebackfill").val(""); //图片回填数据清除
					$("#dd > div").remove();
					document.getElementById("myform").reset();
					
					//清除回填地区数据
					backfillProvince = null; 
					backfillCity = null;
					backfillRegion = null;
					
				} else if ( (licenseORsignature == 2 && tempPower == 2) || (licenseORsignature == 2 && tempPower == 3) ){
					interfaceServer.dogetContractList(orgUuid,1);
					electronicSignature.operationRequest(signatureObj,licenseObj,managementObj);
					//印章隐藏 合同显示
					electronicSignature.operationRequest(contractObj,sealObj,null);
					//印章弹窗 或 合同弹窗隐藏
					electronicSignature.operationRequest(null,uploadContractObj,uploadSealObj);
					//合同签署隐藏
					electronicSignature.operationRequest(null,stampObj,null);
					electronicSignature.operationRequest(null,signerListObj,certificateCABlockObj);
					
					//合同页数返回默认第一页
					$("#pageIndexContract").html(1);
					//印章页数返回默认第一页
					$("#pageIndexSeal").html(1);
					//合同页码初始化
					// tempPage = 1;
				} else if ( licenseORsignature == 3 && temporaryStorage.super == "true") {
					authorityManagement.getUsersInfo(orgUuid);
					$("#managementBlock").show();
				} else {
					if ( tempSuper == "true" ) {
						$("#license").show();
						$("#signature").show();
						$("#management").show();
					} else {
						var datatempInfo = temporaryStorage.powerInfo;
						if (!isNull(datatempInfo)) {
							var datatempUser = datatempInfo.superUser;
							if (!isNull(datatempUser)) {
								tempPower = datatempUser.power;
							}
						}
						if (tempPower==1) {
							$("#license").show();
						} else if(tempPower==2) {
							$("#signature").show();
						} else if(tempPower==3) {
							$("#license").show();
							$("#signature").show();
						}
					};
				};
			} catch (error) {
				console.log(error);
			}
		}
		
		function doJsonCallback(jsonp) {
			
			console.log("jsonp mssage:" + jsonp);
		};
		
		//用于捕获异步加载出现异常错误的事件回调函数
		function zTreeOnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    				
    				var msg = errorThrown.message;
    				console.log("error:" + msg);
    				
		};
		
		//用于捕获异步加载正常结束的事件回调函数
		function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    					//console.log(msg);
		};

		//展开节点
		function zTreeBeforeAsync(treeId,treeNode){
			try {
				treeNodeztree = treeNode;
				var temporgUuid ;
				if( !isNull(treeNode) ){
					temporgUuid = treeNode.orgUuid;
				}
				if ( tempSuper == "true" ) {
					
					SubsetProhibited = 1;
					
				} else {
					var dataUuidInfo = temporaryStorage.powerInfo;
					var dataorgUuid;
					for (var dataorgUuid in dataUuidInfo) {
                        //当前节点id配对，查看的、节点权限
						if(dataorgUuid == temporgUuid){					
							if (dataUuidInfo[dataorgUuid].sub == 0) {
								SubsetProhibited = 0;
							} else {
								SubsetProhibited = 1;
							}
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
		
		
		//对 子节点请求  返回  数据进行预处理的函数
		function ajaxDataFilter(treeId, parentNode, responseData) {
			if (!isNull(responseData)) {
				if (responseData.code == -1) {
				    responseData = null;
				    BJUI.alertmsg('info', '没有下一级了');
			    }
				
				if(SubsetProhibited == 0){
					responseData = null;
					BJUI.alertmsg('info', '无法访问子级权限');
				}
			    return responseData;
			}
		};
		
		//用于捕获节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作
		function beforeDrag(treeId, treeNodes) {
			return false;		
		};
		
		//鼠标经过节点事件
		function addHoverDom(treeId, treeNode){
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;

		};
		
		//鼠标离开节点事件
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};
		//zTree 初始化方法  
		$(document).ready(function(){
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		});
	}

    //文件上传动态创建input
    this.setupinputFile = function(e){
    	var newFileInput = "<input type='file' name='file' id='doc" + inputFileData + "' style='width:150px; opacity: 0; height: 40px;'  accept='image/jpeg, image/jpg,image/png' onchange='licenseManagement.setImagePreviews(this);'/>";
        $("#fileDiv").prepend($(newFileInput));
       	$("#doc" + inputFileData).click();
        inputFileData++;
    }
    //文件上传预览功能
    this.setImagePreviews = function(e){
    	//var docObj = document.getElementById("doc");
    	var dd = document.getElementById("dd");
        var fileList = e.files;
        var result = dd.children.length;
        var amountimg = dd.children.length + fileList.length;
        
        var aa=e.value.toLowerCase().split('.');//以“.”分隔上传文件字符串
        if(!(aa[aa.length-1]=='jpg'||aa[aa.length-1]=='png'||aa[aa.length-1]=='jpeg'))
        {
            BJUI.alertmsg('info', '图片类型必须是.jpeg,jpg,png格式');
          	return false;
        } if (amountimg > 5) {
        	BJUI.alertmsg('info', '最多上传5张');
        	$("#fileDiv > input:first").remove();
    	} else {
        	for (var i = 0; i < fileList.length; i++) {
        		if(fileList[i].size > 5242880){
        			BJUI.alertmsg('info', '图片不能大于5M');
          			return false;
        		}else{
	            	var ddinnerhtml = "<div id='ddimgdivhtml" + (i + result) + "' style='float:left;padding:10px;width:130px;margin-top: 5px;position: relative; margin-right: 5px; border: 3px solid #e9e9e9;' > <img style='height: 78px;' id='img" + (i + result) + "'  /> <div style='width: 100%; position: absolute; height: 25px;background-color: rgba(0,0,0,0.5);top: 0px; left: 0px;'><div style='width:20px;float:right;padding-top: 2px;'><img onclick='deletImg(this);' id='imgAdd' style='width:20px' src='img/icon-Deletewhite.svg'/></div></div></div>";
	            	$(dd).prepend($(ddinnerhtml));
	            	var imgObjPreview = document.getElementById("img"+ (i + result));
	            	if (e.files && e.files[i]) {
		                //火狐下，直接设img属性
		                imgObjPreview.style.display = 'block';
		                imgObjPreview.style.width = '100%';
		                //imgObjPreview.src = docObj.files[0].getAsDataURL();
		                //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
		                imgObjPreview.src = window.URL.createObjectURL(e.files[i]);
		            }else {
		                //IE下，使用滤镜
		                e.select();
		                var imgSrc = document.selection.createRange().text;
		                //alert(imgSrc)
		                 BJUI.alertmsg('info', imgSrc);
		                var localImagId = document.getElementById("img" + (i + result));
		                
		                //必须设置初始大小
		                localImagId.style.width = "100%";
		                //localImagId.style.height = "180px";
		                //图片异常的捕捉，防止用户修改后缀来伪造图片
		                try {
		                    localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
		                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
		
		                }catch (e) {
		                    //alert("您上传的图片格式不正确，请重新选择!");
		                    BJUI.alertmsg('info', '您上传的图片格式不正确，请重新选择!');
		                    return false;
		                }
		                imgObjPreview.style.display = 'none';
		                document.selection.empty();
		            }
        		}
	        }
        	
        }
        return true;
    }
    
    //从股东信息页面返回工商信息页面
    this.doSaveLicSha = function (){
		try {
			if (isNull(publicorgUuid)) {
				return;
			}
			//获取节点的工商信息和股东信息
			interfaceServer.findTreeNodeInformation(publicorgUuid);
			electronicSignature.operationRequest(corpoInformObj,sharInforObj,null);
			$("#inquireShareholder").empty();
			document.getElementById("inforform").reset();
		} catch (error) {
			console.log(error);
		}
    }
    
    //股东信息删除
    this.shareholdersDeleted = function (id){
		try {
    		interfaceServer.shareholdersDeleted(id);
		} catch (error) {
			console.log(error);
		}
    }

}
    
    
    //获取省信息
    function doAddProvince(){
  		reqType = 1;
  		interfaceServer.addProvinces();
  	}

	//ICE省信息返回填充
	function upaddProvinces(data){
		try {
			var name = "#province";
			if(reqType == 1) {
				name = "#province";
			} else if (reqType == 2) {
				name = "#city";
			} else if (reqType == 3) {
				name = "#region";
			};
			
			var typeList=data.content;
			var addnew = {name : '--请选择--', id: 0}
			typeList.unshift(addnew);
			for(var i=0;i<typeList.length;i++){ 
				//动态获取设置下拉框 并插入option
				  $(name).append('<option value="'+typeList[i].name+'" id="' + typeList[i].id + '" >'+typeList[i].name+'</option>');  
				
				 //数据会写绑定为选中状态
				 if(name == "#province"){
					if(typeList[i].name == backfillProvince){
						  $("#"+typeList[i].id).attr("selected",true);
						  reqType = 2;
						  interfaceServer.addProvinces(typeList[i].id);
						  
						  backfillProvince = null;
					  }
				}
				
				if (name == "#city") {
					if(typeList[i].name == backfillCity){
						  $("#"+typeList[i].id).attr("selected",true);
						  reqType = 3;
						  interfaceServer.addProvinces(typeList[i].id);
						  
						  backfillCity = null;
					  }
				}
				
				if (name == "#region") {
					if(typeList[i].name == backfillRegion){
						  $("#"+typeList[i].id).attr("selected",true);
						  
						  backfillRegion = null;
					  }
				}
				
			}
		} catch (error) {
			console.log(error);
		}
	}
	
    //类型设置数据绑定
    function updateAddTreeBaseNode(data) {
		try {	
			doAddProvince();//获取省市区
			var orgTypeobj=document.getElementById('orgType');
			orgTypeobj.options.length=0
			
			for(var i=0;i<data.length;i++){ //动态获取设置下拉框 并插入option
				$("#orgType").append('<option id="' + data[i].typeUuid + '" value="'+data[i].name+'" >'+data[i].name+'</option>');
				
				if (data[i].name == orgTypeData) {
					$("#"+data[i].typeUuid).attr("selected",true);
					orgTypeData = null;
				}
			}
			
		} catch (error) {
			console.log(error);	
		}
	}
    
    //工商信息详细表单保存
    function doSaveLegalPersonDetails(){
		try {
			var myform = document.getElementById("myform");
			var name = $("#CompanyName").text();
			$("#cNameA").val(name);
			var code = $("#uscCode").val();
			$("#regNum").val(code);
			$("#orgCode").val(code);
			if(isNull($("#province").val())||$("#province").val()=="--请选择--"){
				BJUI.alertmsg('warn', '请选择地区');
				return;
			};
			if(isNull($("#city").val())||$("#city").val()=="--请选择--"){
				BJUI.alertmsg('warn', '请选择地区');
				return;
			};
			if(isNull($("#region").val())||$("#region").val()=="--请选择--"){
				BJUI.alertmsg('warn', '请选择地区');
				return;
			};
			if(isNull($("#manageName").val())){
				BJUI.alertmsg('warn', '请选择组织架构');
				return;
			};
			if(isNull($("#uscCode").val()) || isNull($("#legalName").val()) || isNull($("#legalPerson").val()) || isNull($("#identity").val()) || isNull($("#phone").val()) || isNull($("#capital").val()) || isNull($("#ra").val()) || isNull($("#aDate").val()) || isNull($("#eDate").val()) || isNull($("#startDate").val())){
				return;
			};
			if(!testUscCode($("#uscCode").val())){
				BJUI.alertmsg('warn', '请填写正确的统一社会信用代码');
				return; //统一社会信用代码不为大写字母和数字
			};
			if(!nonNegative($("#capital").val())){
				return; //注册资本
			};
			if(!testPhone($("#phone").val())){
				return;//手机号码
			};
			interfaceServer.doSaveLegalPersonDetails(myform);
		} catch (error) {
			console.log(error);	
		}
    }
    
    //工商信息详细表单数据返回
    function updateSaveLegalPersonDetails(data){
		try {
			var data = JSON.parse(data);
			//数据填充前做数据清除
			$("#tbMain").empty();
			//清除残余图片div
			$("#documentBisplay > div").remove(); 
			
			electronicSignature.operationRequest(corpoInformObj,addlegalUpsObj,null);
			//工商信息修改id赋值
			var licenseId = data.licList.id;
			$("#licenseId").val(licenseId);
			//工商信息修改法人id赋值
			$("#legalPersonId").val(data.legalPerson.id); 
			
			$("#identityType option[value='"+ data.legalPerson.identityType +"']").attr("selected","selected");
			var legalPersonIdentityType = $("#identityType option[value='"+ data.legalPerson.identityType +"']").text();
			
			$("#id").val(data.licList.id);
			$("#uscCode1").html(data.licList.uscCode);
			$("#orgCode1").html(data.licList.orgCode);
			var address = data.licList.province + data.licList.city + data.licList.region;
			$("#area").html(address);
			$("#address1").html(data.licList.address);
			$("#capital1").html(data.licList.capital);
			$("#licScope1").html(data.licList.licScope);
			$("#legalName1").html(data.licList.legalName);
			$("#ra1").html(data.licList.ra);
			$("#remark1").html(data.licList.remark);
			$("#eDate1").html(data.licList.eDate);
			$("#aDate1").html(data.licList.aDate);
			$("#orgType1").html(data.licList.orgType);
			$("#legalPerson1").html(data.legalPerson.legalPerson);
			$("#legalPersonIdentity1").html(data.legalPerson.identity);
			$("#legalPersonIdentityType1").html(legalPersonIdentityType);
			$("#contactMobile1").html(data.legalPerson.phone);	
			
			//营业期限  到期时间
			var endDate = data.licList.endDate;
			if (isNull(endDate)) {
				endDate = "";
			}
			var OperatingPeriod = data.licList.startDate + "至" + endDate;
			$("#OperatingPeriod").html(OperatingPeriod);
			
			//公司节点返回判空
			var dataLegalOrgName = data.legalOrg;
			if (!isNull(dataLegalOrgName)) {
				$("#name1").html(dataLegalOrgName.name);
			}
			
			//组织架构异常判断
			if(data.manageOrg == ''){
				BJUI.alertmsg('info', '组织架构异常');
			}else{
				var mangeOrgUuid = data.manageOrg;
				if(!isNull(mangeOrgUuid)){
					var mangeOrgUuidData = '';
					for(var i=mangeOrgUuid.length - 1; i >= 0; i--) {
						mangeOrgUuidData += mangeOrgUuid[i].name;
					}
					$("#mangeOrgUuid1").html(mangeOrgUuidData);
				}
			}
			
			//动态返回图片
//			var dataLiclist = data.licList.licPath;
//			if (!isNull(dataLiclist)) {
//				var strs = dataLiclist.split(","); //字符分割 
//				var docBis = document.getElementById('documentBisplay');
//				for (i=0 ;i<strs.length ;i++ ){
//					docBis.innerHTML += "<div style='width: 130px;float: left;padding: 0 10px;'> <img onclick='javascript:licPathClick(this);' id='Iimg" + i + "' style='width:100%;' /> </div>";
//					var imgdocBis = document.getElementById("Iimg"+i);
//					$("#Iimg" + i).attr("src", SERVER_ROOT + "/" + SERVICE_NAME_LICENSE + "/" +strs[i]);
//				}
//			}
            var licPathId = data.licList.licPath;
            if (!isNull(licPathId)) {
            	var strs = licPathId.split(","); //字符分割 
            	for (i=0 ;i<strs.length ;i++ ){
            		interfaceServer.doFileFromLicPath(licPathId);
            	}
            }
			
			//股东信息展示
			var shareholders = data.shareholders;
			if (!isNull(shareholders)) {
				var html = "";
				for (var i = 0; i < shareholders.length; i++) {
					html += "<tr>";
					html += "<td class='textcentbg'>" + (i+1) + "</td>";
					html += "<td class='textcentbg'>" + shareholders[i].name +"</td>";
					html += "<td class='textcentbg'>" + shareholders[i].fund + "万" + "</td>";
					html += "<td class='textcentbg'>" + shareholders[i].realFund + "万" + "</td>";
					html += "</tr>";
				}
				$("#tbMain").append(html);
			}	
		} catch (error) {
			console.log(error);	
		}
    }
    
    
    //股东信息填写保存页面 展示 数据
    function upSaveShareholderInformation(data){
    	try {
			console.log(data);
			$("#inquireShareholder").empty();
			var lid = $("#id").val();
			interfaceServer.doSharehoderList(lid);
    	} catch (error) {
			console.log(error);	
		}
    }
    
    //股东信息填写保存页面展示数据
    function upSharehoderList(body){
		try {
			var body = JSON.parse(body);
			$("#inquireShareholder").empty(); //清除股东页面股东信息
			var html = "";
			for (var i=0; i<body.length; i++) {
				var isDelete = '';//是否允许删除
				var t = "'confirm'";
				var z = "'你确定要执行该操作吗?'";
				isDelete = 'data-options="{type:'+t+', msg:'+z+', okCall:function(){licenseManagement.shareholdersDeleted('+body[i].id+')}}"';
				html += "<tr>";
				html += "<td class='textcentbg'>" + (i+1) + "</td>";
				html += "<td class='textcentbg'>" + body[i].name + "</td>";
				html += "<td class='textcentbg'>" + body[i].fund +"万元</td>";
				html += "<td class='textcentbg'>" + body[i].realFund + "万元</td>";
				html += '<td><div class="datagrid-toolbar"><div class="btn-group" role="group"><button data-toggle="alertmsg" '+isDelete+' type="button" class="btn btn-white" data-icon="times" id="'+ body[i].id +'"><span class="but-badge"><img src="img/icon-Delete.svg"/></span></button></div></div> </td>';
				html += "</tr>";
			}
			$("#inquireShareholder").append(html);
			$("#tbMain").empty();
			document.getElementById("inforform").reset();
		} catch (error) {
			console.log(error);
		}
    }
    
    //股东信息删除
    function upshareholdersDeleted(body){
		try {
			$("#inquireShareholder").empty();
			var lid = $("#id").val();
			interfaceServer.doSharehoderList(lid);
		} catch (error) {
			console.log(error);	
		}
    }
    
    //点击法人架构查询相应节点工商信息 数据回调
    function upfindTreeNodeInformation(bodydata){
    	try {
    		bodydata = JSON.parse(bodydata);
    		//数据填充前做数据清除
    		$("#province").empty(); //清除省数据
			$("#city").empty();  //清除市数据
			$("#region").empty();  //清除县区数据
			$("#checkboxTime").attr("checked",false);
			stateSelected();//修改时间提醒的选中状态
			document.getElementById("myform").reset();
			
			if(BusinessFormOrBusinessDetails == false){
				if(!isNull(bodydata.licList)){
					
					$("#tbMain").empty(); //清除工商页面股东信息
					$("#documentBisplay > div").remove(); //清除残余图片div
					
					electronicSignature.operationRequest(corpoInformObj,addlegalUpsObj,null);
					//工商信息修改法人id赋值
					$("#legalPersonId").val(bodydata.legalPerson.id);

					$("#identityType option[value='"+ bodydata.legalPerson.identityType +"']").attr("selected","selected");
					var legalPersonIdentityType = $("#identityType option[value='"+ bodydata.legalPerson.identityType +"']" 	).text();
		
					$("#id").val(bodydata.licList.id);
					$("#uscCode1").html(bodydata.licList.uscCode);
					var address = bodydata.licList.province + bodydata.licList.city + bodydata.licList.region;
					$("#area").html(address);
					$("#address1").html(bodydata.licList.address);
					$("#capital1").html(bodydata.licList.capital + "万元");
					$("#licScope1").html(bodydata.licList.licScope);
					$("#legalName1").html(bodydata.licList.legalName);
					$("#ra1").html(bodydata.licList.ra);
					$("#remark1").html(bodydata.licList.remark);
					$("#eDate1").html(bodydata.licList.eDate);
					$("#aDate1").html(bodydata.licList.aDate);
					$("#orgType1").html(bodydata.licList.orgType);
					$("#legalPerson1").html(bodydata.legalPerson.legalPerson);
					$("#legalPersonIdentity1").html(bodydata.legalPerson.identity);
					$("#legalPersonIdentityType1").html(legalPersonIdentityType);
					$("#contactMobile1").html(bodydata.legalPerson.phone);
					$("#lidTime").val(bodydata.licList.id);
					
					//营业期限 结束时间 
					var endDate = bodydata.licList.endDate;
					if (isNull(endDate)) {
						endDate = "";
					}
					var OperatingPeriod = bodydata.licList.startDate + "至" + endDate;
					$("#OperatingPeriod").html(OperatingPeriod);
					
					//设置时间提醒
					if(!isNull(bodydata.licList.reminder_expire)){
						$("#timeEnd").val(bodydata.licList.reminder_expire);
					} else {
						$("#timeEnd").val(bodydata.licList.endDate);
					}
					if (!isNull(bodydata.licList.reminder_content)){
						$("#bodytime").val(bodydata.licList.reminder_content);
					} else {
						var bodyInfo = ""+getStorage(USER_NAME)+"("+getStorage(OAACCOUNT)+")，您好!\n"+bodydata.legalOrg.name+"的营业执照将于"+endDate+"到期，请您及时办理相关手续.\n祝您生活愉快\n工商信息证照系统";
						$("#bodytime").val(bodyInfo);
					}
					if(!isNull(bodydata.licList.reminder_days)){
						if(bodydata.licList.reminder_days==0){
							$("#daysTime").val('30');
						}else{
							$("#daysTime").val(bodydata.licList.reminder_days);
						}
						
					}
					if(!isNull(bodydata.licList.reminder_oa)){
						$("#oaListTime").val(bodydata.licList.reminder_oa);
						var tempOAList = JSON.parse(bodydata.licList.reminder_oa);
						for (var index = 0; index < tempOAList.length; index++) {
							var jsontempOAList = JSON.stringify(tempOAList[index]);
							var tempNameandOA = tempOAList[index].uid +"( "+tempOAList[index].uname+" )";
							recipientsList.unshift(jsontempOAList);
							$("#emlieTempInfo").append("<span tempData='"+jsontempOAList+"' >"+tempNameandOA+"<i class='fa fa-times-circle' onclick='reminderTime.removeNameInfo(this)'></i></span>");	
						}
						
					}
					
					//公司节点返回判空
					var dataLegalOrgName = bodydata.legalOrg;
					if (!isNull(dataLegalOrgName)) {
						$("#name1").html(dataLegalOrgName.name);
					}
					
					//组织架构 填充并对异常判断
					if (isNull(bodydata.manageOrg)) {
						BJUI.alertmsg('info', '组织架构异常');
						$("#mangeOrgUuid1").html();
					} else {
						var mangeOrgUuid = bodydata.manageOrg;
						if(!isNull(mangeOrgUuid)){
							var mangeOrgUuidData = '';
							for(var i=mangeOrgUuid.length - 1; i >= 0; i--) {
								mangeOrgUuidData += mangeOrgUuid[i].name;
							}
							$("#mangeOrgUuid1").html(mangeOrgUuidData);
						}
					}
					
					var Id = bodydata.licList.id; //获取工商信息对应的id
					$("#licenseId").val(Id);
					var html = "";
					for (var i = 0; i < bodydata.shareholders.length; i++) {
						html += "<tr>";
						html += "<td class='textcentbg'>" + (i+1) + "</td>";
						html += "<td class='textcentbg'>" + bodydata.shareholders[i].name +"</td>";
						html += "<td class='textcentbg'>" + bodydata.shareholders[i].fund + "万元" + "</td>";
						html += "<td class='textcentbg'>" + bodydata.shareholders[i].realFund + "万元" + "</td>";
						html += "</tr>";
					}
					$("#tbMain").append(html);
					
					//动态返回图片
//					var dataLiclist = bodydata.licList.licPath;
//					console.log(dataLiclist);
//					if (!isNull(dataLiclist)) {
//						var strs = dataLiclist.split(","); //字符分割 
//						var docBis = document.getElementById('documentBisplay');
//						for (i=0 ;i<strs.length ;i++ ){
//							docBis.innerHTML += "<div style='width: 130px;float: left;padding: 0 10px;'> <img onclick='javascript:licPathClick(this);' id='img" + i + "' style='width:100%;' /></div>";
//							var imgdocBis = document.getElementById("img"+i);
//							$("#img" + i).attr("src", SERVER_ROOT + "/" + SERVICE_NAME_LICENSE + "/" +strs[i]);
//						}
//					}
                    var licPathId = bodydata.licList.licPath;
		            if (!isNull(licPathId)) {
		            	interfaceServer.doFileFromLicPath(licPathId);
		            }
					
				} else {
					electronicSignature.operationRequest(addlegalUpsObj,corpoInformObj,null);
					$("#CompanyName").html(bodydata.legalOrg.name);
					$("#orgUuid").val(bodydata.legalOrg.orgUuid);
					//获取类型设置
					interfaceServer.addTreeBaseNode();
				}
			} else {//修改数据反写填充表单
				if(!isNull(bodydata)){
					if (!isNull(bodydata.legalOrg)) {
						$("#CompanyName").html(bodydata.legalOrg.name);
					}
					if (!isNull(bodydata.manageOrg)) {
						var manageName = bodydata.manageOrg
						for (var i = 0; i<manageName.length; i++) {
							$("#manageName").val(manageName[0].name);
						}
					}
					$("#manageId").val(bodydata.manageOrgUuid);
					$("#uscCode").val(bodydata.licList.uscCode);
					$("#address").val(bodydata.licList.address);
					$("#legalName").val(bodydata.licList.legalName);
					$("#legalPerson").val(bodydata.legalPerson.legalPerson);
					$("#identity").val(bodydata.legalPerson.identity);
					$("#phone").val(bodydata.legalPerson.phone);
					$("#capital").val(bodydata.licList.capital);
					$("#eDate").val(bodydata.licList.eDate);
					$("#startDate").val(bodydata.licList.startDate);
					$("#licScope").val(bodydata.licList.licScope);
					$("#ra").val(bodydata.licList.ra);
					$("#aDate").val(bodydata.licList.aDate);
					$("#remark").val(bodydata.licList.remark);
					
					if (isNull(bodydata.licList.endDate)) {
						$("#endDate").val("");
					} else {
						$("#endDate").val(bodydata.licList.endDate);
					}
					
					
					//图片回填处理
					var dd = document.getElementById("dd");
        			dd.innerHTML = "";
        			var strsdata;
        			var licPathId = bodydata.licList.licPath
        			if (!isNull(licPathId)) {
        				FileFromLicPath = true;
//						var strs = dataLiclist.split(","); //字符分割 
//						strsdata = strs.length;
//						for (i=0 ;i<strs.length ;i++ ){
//							dd.innerHTML += "<div id='imgDivde" + i + "' tampdata='"+ strs[i]+"' style='float:left;padding:10px;width:130px;margin-top: 5px; margin-right: 5px; border: 3px solid #e9e9e9;position: relative;' > <img style='width: 100%;height: 78px;' id='imgbackfill"+ i +"' /><div style='width: 100%; position: absolute; height: 25px;background-color: rgba(0,0,0,0.5);top: 0px; left: 0px;'><div style='width:20px;float:right;padding-top: 2px;'><img onclick='deletImg(this);' id='imgdele" + i + "' style='width:20px' src='img/icon-Deletewhite.svg'/></div></div></div>";
//							$("#imgbackfill" + i).attr("src", SERVER_ROOT + "/" + SERVICE_NAME_LICENSE + "/" +strs[i]);
//						}
                        interfaceServer.doFileFromLicPath(licPathId);
                        picturebackfill = licPathId; //图片路径存储
					} else {
						//获取类型设置
						interfaceServer.addTreeBaseNode();
					}
					
					orgTypeData =  bodydata.licList.orgType;  //公司类型
					
					backfillProvince = bodydata.licList.province; //省名称全局赋值
					backfillCity = bodydata.licList.city; //市名称全局赋值
					backfillRegion = bodydata.licList.region; //县区名称全局赋值
					
					
					
					BusinessFormOrBusinessDetails = false;
				}
				
			}
		} catch (error) {
			console.log(error);	
		}
    }
    
    //图片在线地址调取
    function upFileFromLicPath(data){
    	console.log(data);
    	//获取类型设置
		interfaceServer.addTreeBaseNode();
    	if (FileFromLicPath == false) {
    		var docBis = document.getElementById('documentBisplay');
	    	docBis.innerHTML += "<div style='width: 130px;float: left;padding: 0 10px;'> <img onclick='javascript:licPathClick(this);' id='Iimg' style='width:100%;' /> </div>";
			var imgdocBis = document.getElementById("Iimg");
			$("#Iimg").attr("src", data);
    	} else {
    		var dd = document.getElementById("dd");
			dd.innerHTML = "";
			dd.innerHTML += "<div id='imgDivde' tampdata='"+ data+"' style='float:left;padding:10px;width:130px;margin-top: 5px; margin-right: 5px; border: 3px solid #e9e9e9;position: relative;' > <img style='width: 100%;height: 78px;' id='imgbackfill' /><div style='width: 100%; position: absolute; height: 25px;background-color: rgba(0,0,0,0.5);top: 0px; left: 0px;'><div style='width:20px;float:right;padding-top: 2px;'><img onclick='deletImg(this);' id='imgdele' style='width:20px' src='img/icon-Deletewhite.svg'/></div></div></div>";
			$("#imgbackfill").attr("src", data);
			//picturebackfill = picturebackfill.split(","); //转换成数组
			$("#picturebackfill").val(picturebackfill); //保存到工商信息表单回传到服务器
			FileFromLicPath = false;
    	}
    }
    
    //回填图片删除
    function deletImg(e){
    	var imgdiveven = e.parentNode.parentNode.parentNode;
    	var removefilename = $(imgdiveven).attr('tampdata');
    	//var removeimgcurrentSrc = removefilename.currentSrc;
    	Array.prototype.removeByValue = function(val) {
		  	for(var i=0; i<this.length; i++) {
		    	if(this[i] == val) {
		     	this.splice(i, 1);
		      	break;
		    	}
		  	}
		}
    	//picturebackfill.removeByValue(removefilename);
    	$("#picturebackfill").val(''); 
    	//删除当前图片的同时删除对应的input=file控件
    	$("#dd > div").eq($(imgdiveven).index()).remove();
    	$("#fileDiv input").eq($(imgdiveven).index()).remove();
		//imgdiveven.remove();
	}
    
    //点击工商信息小图片  index页面Image-zoom展示全屏大图
	function licPathClick(licPathId){
		console.log(licPathId);
		$("#Image-zoom").fadeIn(500);
		$("#licPathImage").attr("src", licPathId.src);
		//点击展开大图
		$("#Image-zoom").click(function() {
			$("#Image-zoom").hide();
		})
	}
	
	
	function IsJsonString(str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	}
    
    
    //表单校验
    //表单非负数校验
    function nonNegative(str_username){	
		var p=/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;	
		if(p.test(str_username)){		
			return true;	
		}else{		
			return false;	
		}
	}	
	
	//表单手机号码校验
    function testPhone(testPhone){	
		var p=/^(((13[0-9]{1})|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;	
		if(p.test(testPhone)){		
			return true;	
		}else{		
			return false;	
		}
	} 
	
	//表单 统一社会信用代码校验
    function testUscCode(testUscCode){	
		var p=/^[0-9A-Z]{18}$/;	
		if(p.test(testUscCode)){		
			return true;	
		}else{		
			return false;	
		}
	}    
	
    //分辨率处理
    