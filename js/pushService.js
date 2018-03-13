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
   
   
function PushService () {

	console.log('------PushService ()------');
	
}

PushService.prototype.doDispatch = function (name, data) {
	if(isNull(data)) {
		
		return;
	}
    if (typeof(data) == 'string') {
    	
    	data = JSON.parse(data);
    }
    
	var type = data.type;
	var code = data.code;
	var message = data.message;
	console.log("协议message输出:" + message);
	
	if(code != SUCCESSED) {
		
		if(type == PROTOCOL_TYPE_ICE) {
				
			var value = message;
			var list = message.split(":");
			var len = list.length;
			if(len == 2) {
				var key = list[0];
				console.log("key:" + key);
				
				value = list[1];
				console.log("value:" + value);
			}
			
			BJUI.alertmsg('warn', value);
			
		} else {
			
			if(!isNull(message)) {
				
				var show = message.show;
				if(show == true) {
					
					var info = message.info;
					
					BJUI.alertmsg('warn',info);
				}
			}
		}
		
		return;
	} else {
		if(!isNull(message)) {
				
				var show = message.show;
				if(show == true) {
					
					var info = message.info;
					
					BJUI.alertmsg('info',info);
				}
			}
	}
		
	
	var body = data.content;
	
	console.log(body);

	switch(name) {
		//彩之云登录授权
		case SERVICE_NAME_COLORFULCLOUD:
		{
			upCzyAuthor(data);
		};
		
		break;
		
		//登录返回
		case SERVICE_NAME_LOGIN:
		{
			updateLogin(data);
		};
		
		break;
		
		//登录鉴权跳转返回
		case SERVER_NAME_MAIN:
		{
			updateMain(data);
		};
		
		break;
		
	    //证照页面初始化返回
		case SERVER_NAME_GET_TREEDATA:
		{   
			if(signatory == true){
				
				upsignatorydata(data);
				
			}else{
				
				upTreeData(data);
				
			}

		};
		
		break;
		
		//法人架构 全部 
		case SERVER_NAME_GET_ALLTREEDATA:
		{   
			upTreeAllData(body);
		};
		
		break;
		
		//法人架构修改
		case SERVER_NAME_GETUPDATETREEVIEW:
		{
			upLegalPersonEditName(data);
		};
		
		break;
		
		//从ICE获取省信息
		case SERVER_ADD_PROVINCES:
		{
			upaddProvinces(data);
		};
		
		break;
		
		//类型维护页面初始化
		case SERVICE_NAME_ORG:
		{
			updateOrg(data);
		};
		
		break;
		
		//类型维护页面删除
		case SERVICE_NAME_DELORGTYPE:
		{
			upOrganiTypedelete(data);
		};
		
		break;
		
		//类型维护页面修改
		case SERVICE_NAME_UPDATEORGTYPE:
		{
			updateOrgType(data);
		};
		
		break;
		
		//平台操作日志  查询
		case SERVICE_NAME_GETFINDALLBYPAGE:
		{
			upLogByPageSearch(data);
		};
		
		break;
		
		//平台操作日志  搜索
		case SERVICE_NAME_GETFINDLOGBYNAME:
		{
			upLogByPageSearch(data);
		};
		
		break;
		
		//类型维护表单提交
		case SERVICE_NAME_ORGSAVE:
		{
			updateOrgSave(data);
		};
		
		break;
		
		//法人架构节点添加数据返回
		case SERVER_ADD_TREE_BASENODE:
		{
			updateAddTreeBaseNode(body);
		};
		
		break;
		
		//树形添加弹窗提交  SaveTreeBaseNode
		case SERVICE_NAME_ADDTREE:
		{
			updateSaveTreeBaseNode(data);
		};
		
		break;
		
		/*//获取组织架构数据返回
		case SERVICE_NAME_GETCORPORATIONTREE:
		{
			upgetCorporationTree(data);
		};*/
		
		break;
		
		//法人架构详细表单保存
		case SERVICE_NAME_SAVELEGAL:
		{
			updateSaveLegalPersonDetails(body);
			//upfindTreeNodeInformation(body);
		};
		
		break;
		
		//图片在线地址调取
		case SERVICE_NAME_DOWNLOADFILEFROMFILEID:
		{
			upFileFromLicPath(body);
		};
		
		break;
		
		//股东信息填写数据返回
		case SERVICE_NAME_SHAREHOLDER:
		{
			upSaveShareholderInformation(data);
		};
		
		break;
		
		//根据执照id获取执照信息和股东信息
		//case SERVICE_NAME_GETLICSHA:
		//{
		//	upSaveLicSha(data);
		//};
		
		//break;
		
		//树形列表根据orgUuid获取工商信息和股东信息
		case SERVICE_NAME_GETLIC:
		{
			upfindTreeNodeInformation(body);
		};
		
		break;
		
		//获取证照上传参数
		case SERVICE_NAME_GETDATA:
		{
			upSaveGetData(data);
		};
		break;
		
		//证照上传
		case SERVICE_NAME_STARTUPLOADING:
		{
			upSaveGetData(data);
		};
		break;
		
		//证照路径返回
		case SERVICE_NAME_STARTUPLOADING:
		{
			upStartuploading(data);
		};
		break;
		
		//股东查询
		case SERVICE_NAME_SHAREHODERLIST:
		{
			upSharehoderList(body);
		};
		break;
		
		//股东删除
		case SERVICE_NAME_DELSHARINFO:
		{
			upshareholdersDeleted(body);
		};
		break;


		//签章数据 印章初始化
		case SERVICE_NAME_GETSIGNATURELIST:
		{
			upgetSignatureList(data);
		};	
		break;

		//印章上传
		case SERVICE_NAME_SAVESIGNATURE:
		{
			upsaveSignature(data);
		};
		break;

		//签章数据 合同列表初始化
		case SERVICE_NAME_GETCONTRACTLIST:
		{
			upgetContractList(data);
		};
		break;

		//合同上传
		case SERVICE_NAME_SAVECONTRACT:
		{
			upsaveContract(data);
		};
		break;

		//删除电子签章
		case SERVICE_NAME_DELSIGNATURE:
		{
			updelSignature(data);
		};
		break;

		//删除合同
		case SERVICE_NAME_DELCONTRACT:
		{
			updelContract(data);
		};
		break;

		//修改合同
		case SERVICE_NAME_GETCONTRACTONE:
		{
			upgetContractOne(data);
		}
		break;

		//修改印章
		case SERVICE_NAME_GETSIGNATUREONE:
		{
			upgetSignatureOne(data);
		}
		break;
		
		//搜索印章
		case SERVICE_NAME_SEALSEARCH:
		{
			//upSignatureSearch(data);
			upgetSignatureList(data);
		}
		break;

		// 注册二级账号,设置企业证件信息接口
		case SERVICE_NAME_APPLYCERT:
		{
			upapplyCert(data);
		}
		break;
		
		// 中税CA认证 接口
		case SERVICE_NAME_ZHONGSHUICERT:
		{
			upZhongShuiCert(data);
		}
		break;

		// 查询上上签证书申请情况
		case SERVICE_NAME_CERTSTATUS:
		{
			upcertStatus(data);
		}
		break;
		
		// 查询中税证书申请情况
		case SERVICE_NAME_ZSCERTSTATUS:
		{
			upZhongShuiCertStatus(data);
		}
		break;

		//查看合同印章
		case SERVICE_NAME_SHOWCONDETAIL:
		{
			upshowConDetail(data);
		}
		break;

		//设置图片印章
		case SERVICE_NAME_SETSIGNIMAGE:
		{
			updosetSignImage(data);
		}
		break;
		
		//添加签署者
		case SERVICE_NAME_ADDSIGNER:
		{
			upaddSigner(data);
		}
		break;

		//执行签章动作
		case SERVICE_NAME_SIGNCONTRACT:
		{
			upsignContract(data);
		}
		break;
		
		//下载合同
		case SERVICE_NAME_DOWNLOADCON:
		{
			updownloadCon(data);
		}
		break;

		//结束合同
		case SERVICE_NAME_FINISHCON:
		{
			upfinishCon(data);
		}
		break;

		//锁定合同
		case SERVICE_NAME_LOCKCON:
		{
			uplockCon(data);
		}
		break;

		//审阅合同
		case SERVICE_NAME_UPDATEREVIEW:
		{
			upupdateReview(data);
		}
		break;

		//删除签署者
		case SERVICE_NAME_REMOVESIGNER:
		{
			upremoveSigner(data);
		}
		break;

		//搜索合同列表
		case SERVICE_NAME_DOCONTRACTSEARCH:
		{
			upgetContractList(data);
		}
		break;

		//合同状态检索
		case SERVICE_NAME_DOCONTRACTSEARCHSTATE:
		{
			upgetContractList(data);
		}
		break;
		/**
		 * 权限管理
		 */
		//显示员工列表
		case SERVICE_NAME_SHOWUSERS:
		{
			upshowUsers(data);
		}
		break;
		
		//权限管理账户搜索
		case SERVICE_NAME_DOSEARCHUSER:
		{
			//pugetManagementSeal(data);
			upgetOrgStructureUsers(data)
		}
		break;

		//获取管理组织架构
		case SERVICE_NAME_GETORGSTRUCTURE:
		{
			upgetOrgStructure(body);
		}
		break;


		//增加员工列表
		case SERVICE_NAME_ADDUSERS:
		{
			upaddUsers(data);
		}
		break;

		//移除员工列表
		case SERVICE_NAME_REMOVEUSERS:
		{
			upremoveUsers(data);
		}
		break;
		
		//获取管理组织架构
		case SERVICE_NAME_GETORGSTRUCTUREUSERS:
		{
			upgetOrgStructureUsers(data);
		}
		break;

		//设置子级权限
		case SERVICE_NAME_SETSUBLEVEL:
		{
			upsetSubLevel(data);
		}
		break;

		//设置权限
		case SERVICE_NAME_SETPOWER:
		{
			upsetPower(data);
		}
		break;

		/**
		 * 时间提醒结构块
		 */
		//模糊查询员工信息
		case SERVICE_NAME_SELECTEMPLOYEE:
		{
			upselectEmployee(data);
		}
		break;

		//设置时间提醒
		case SERVICE_NAME_SETTIMEREMINDER:
		{
			upsetTimeReminder(data);
		}
		break;
	}	
}	


var pushService = new PushService();

