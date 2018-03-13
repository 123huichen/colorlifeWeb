
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
   
   
function HttpService() {
      
 
}

var revcData = function(data, name) {
		
		console.log('返回内容1：\n'+ JSON.stringify(data));
		
		// 转场
		this.pushService.doDispatch(name, data);
}
	
var errorInfo = function(data, name) {
		console.log('返回内容1：\n'+ JSON.stringify(data));
}

var faildInfo = function(data, name) {
		console.log('返回内容1：\n'+ JSON.stringify(data));
}


var idRecvCall = function (data, name) {
	console.log('返回内容1：\n'+ JSON.stringify(data));
}


HttpService.prototype.getRequestPath = function(name, dic) {
		
		var path = "";
		var url = SERVER_ROOT;
		if(SERVER_PATH_NAME != "") {
			url += "/";
			url += SERVER_PATH_NAME;
		}
		
		url += "/";
		url += name;
		
		for(var key in dic) {
			
			var value = dic[key];
			if(value instanceof Function) {
				break;
			}
			
			if(path != "") {
				path +="&";
			}
			
			 path += key;
			 path +="=";
			 path += value;
		}
		
		console.log(path);
		
		if(path != "") {
			path = url + "?" + path;
		}else{
			path = url;
		}
		
		console.log(path);
		
		return path;
	}

//
//HttpService.prototype.bjuiAjaxGet = function(http, name) {
//	
// 		BJUI.ajax('doajax',{
// 				url: http,
// 				type:"Get",  //GET OR POST
// 				data:null,
// 				validate: false,
//  			loadingmask: true,
//  			okalert: false,
// 				withCredentials : true,
// 				
// 				okCallback: function(json, options) {
//      		    
//      		    revcData(json, name);
// 				},
//  			
//  			errCallback: function(json, options){
//      			
//      			errorInfo(json, name);
//  			},
//  				
//  			failCallback: function(json,options){
//  				
//  				faildInfo(json, name);
//  			}
// 		});
//}
//
//HttpService.prototype.bjuiAjaxPost = function(http, data, name) {
//	
//	var body = "";
//	if(!isNull(data)) {
//	
//	
//		body = JSON.stringify(data);
//	}
//	
//	
// 		BJUI.ajax('doajax',{
// 				url: http,
// 				type:mthod,  //GET OR POST
// 				data:body,
// 				validate: false,
//  			loadingmask: true,
//  			okalert: false,
// 			withCredentials : true,
// 			
// 			okCallback: function(json, options) {
//      		    
//      		    revcData(json, name);
//      		    
// 			},
//  			
//  			errCallback: function(json, options){
//      			
//      			errorInfo(json, name);
//  			},
//  				
//  			failCallback: function(json,options){
//  				
//  				faildInfo(json, name);
//  			}
// 		});
// }
// 	
//HttpService.prototype.bjuiAjaxForm = function(form, mthod, http, name){
// 		 
// 		BJUI.ajax('ajaxform',
// 			{
// 				form: form,
// 				url: http,
// 				type:mthod,  //GET OR POST
// 				validate: false,
//  			loadingmask: true,
//  			okalert: false,
// 				closeCurrent: true,
// 				withCredentials : true,
// 				
// 				okCallback: function(json, options) {
// 					
//						revcData(json, name);
// 				},
//  			
//				errCallback: function(json, options){
//				
//					errorInfo(json, name);
//				},
//				
//				failCallback: function(json,options){
//				
//					faildInfo(json, name);
//				}
// 			});
//}


HttpService.prototype.bjuiAjaxDownload = function(mthod, http, name){
   		 
   		BJUI.ajax('ajaxdownload',
   			{
   				url: http,
   				type:mthod,  //GET OR POST
   				data: null,
   				confirmMsg:null,
   				withCredentials : true,

				successCallback: function(json, options) {
   					
        		    		revcData(json, name);
   				},
    			
    				failCallback: function(json,options){
    				
    					
    					faildInfo(json, name);
    				}
   			});
}



HttpService.prototype.doAjaxGet = function(http, serviceName) {
		
	$.ajax({
			url : http,
			type : "Get",
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : "doJsonCallback",
		
			beforeSend : function (data) {
			
				showLoading();
			},
			
			success : function(data){
                    
                    hideLoading();
                    
                    revcData(data, serviceName);
                    
             },
             
            error : function(e){
                
                hideLoading();
                
                faildInfo(e, serviceName);
                
            }
		});
		
		function doJsonCallback(jsonp) {
			
			console.log("doAjaxGet->doJsonCallback");
			
		}
}




HttpService.prototype.doAjaxPost = function(http, body, serviceName) {
		
	$.ajax({
			url:http,
			type : "Post",
			data : body,
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : "doJsonCallback",
		
			beforeSend : function (data) {
			
				showLoading();
			},
			success : function(data){
                    
                    hideLoading();
                    
                    revcData(data, serviceName);
             },
             
            error : function(e){
                
                hideLoading();
                 
                faildInfo(e, serviceName);
            }
		});
		
		function doJsonCallback(jsonp) {
			
			console.log("doAjaxPost->doJsonCallback");
			
		}
}






//GET方法   
HttpService.prototype.doGetRequest = function(serviceName, data) {
	
	var urlPath = this.getRequestPath(serviceName, data);
	
	this.doAjaxGet(urlPath, serviceName);
}


//POST方法
HttpService.prototype.doPostRequest = function(serviceName, data) {
 	// showLoading();
 	var urlPath = SERVER_ROOT + "/" + serviceName;
 	
 	this.doAjaxPost(urlPath, data, serviceName);
}


HttpService.prototype.doGetDownload = function(serviceName, data) {
		 
		console.log('doGetDownload()...');
		
		var urlPath = this.getRequestPath(serviceName, data);

		this.bjuiAjaxDownload("GET", urlPath, serviceName);
}




 
HttpService.prototype.doAjaxSubmit = function(type, formName, http, serviceName) {
	
	var options = {
		
		url : http,
		
		type : type,
		
		cache : false,
		
		async : false,
		
		ifModified : true,
		
		dataType : "json",
		
		xhrFields : {
           withCredentials: true
       	},
       	
       	crossDomain : true,
       	
		success : function(data, status, xhr, $form) {
	 	
	 		console.log("表单提交成功返回信息：" + data);
	 	
	 		hideLoading();
	 	
	 	 	revcData(data, serviceName);
	 	 	
	 	 	$form.resetForm();
	 	},
	 
	  	beforeSubmit: function(data, form, options){
			
			showLoading();

        },
        
        complete : function(xhr, status, $form){
        			
//      			var data = xhr.responseText;
//      			
//      			console.log("表单提交完成返回信息：" + data);
//      			
//      			var readyState = xhr.readyState;
//      			
//      			if(readyState == 4 && status == "success") {
//      				
//      				revcData(data, serviceName);
//      			} else {
//      				
//      				errorInfo(data, serviceName);
//      			}
        			
        			hideLoading();
        			
        			$form.resetForm();
        },
    
        
	 	error : function (xhr, status, error, $form) {
	 		console.log("表单提交产生错误: " + error);
	 	
	 		hideLoading();
	 	
	 		errorInfo(error, serviceName);
			
	 	}
	};
	
	// $(formName).ajaxForm(options).submit(function(){return true;}); 
	
	$(formName).ajaxSubmit(options); return false;
}



HttpService.prototype.doGetSubmit = function(formName, serviceName) {

	var urlPath = SERVER_ROOT + "/" + serviceName;
	
	var data = $(formName).serialize();
	
	urlPath += "?";
	urlPath += data;
	
	this.doAjaxGet(urlPath, serviceName);
	
	 // this.doAjaxSubmit("GET", formName, urlPath, serviceName);
}


HttpService.prototype.doPostSubmit = function(formName, serviceName) {

var urlPath = SERVER_ROOT + "/" + serviceName;
	
	this.doAjaxSubmit("POST", formName, urlPath, serviceName);
}



//
//HttpService.prototype.getHttpRequest = function() {
//	
//var isIe = this.isIeBrowser();
//
//var ieHttp = null;
//
// 	if(isIe == true) {
//	
//		var name = getIeVersionName();
//		if(name == "IE8" || name == "IE9") {
//			ieHttp = this.getXDomainRequest();
//		} else {
//			ieHttp = this.getXMLHttpRequest();
//		}
//	} else {
//		
//		ieHttp = this.getXMLHttpRequest();
//	}
//	
//	return ieHttp;
//}
//
//
//
//HttpService.prototype.getXMLHttpRequest = function() {
//	
//	var ieHttp = null;
//
//	if(window.ActiveXobject){
//		
//		var activeName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
//  		for(var i = 0; i < activeName.length; i++) {
//  			
//  			 try {
//   				 ieHttp = new ActiveXobject(activeName[i]);
//   				 break;
//   				 
//   		} catch(e) {
//   			
//   			console.log(e);
//   		}
//  		}
//  	
//	} else if (window.XMLHttpRequest) {
//		
//		ieHttp = new XMLHttpRequest();
//		
//	} else {
//		console.log("创建XMLHttpRequest请求对象失败!");
//	
//		return null;
//	}
//	
//	
//	ieHttp.withCredentials = true;
//	console.log("除IE8 9浏览器调用并已经做了跨域处理!");
//
//	return ieHttp;
//}
//
//
//HttpService.prototype.getXDomainRequest = function() {
//	
//	var ieHttp = null;
//	
//	if(window.XDomainRequest) {
//		
//		ieHttp = new XDomainRequest();
//	} else {
//		console.log("创建XDomainRequest请求对象失败!");
//	
//		return null;
//	}
//	
//	return ieHttp;
//}
//
//
//HttpService.prototype.isIeBrowser = function() {
//	
//	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//	console.log("IEBrowser->UserAgent:" + userAgent);
//	
//	var isIe = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
//	
//	return isIe;
//}
//
//HttpService.prototype.getIeVersionName = function() {
// 	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//
// 	var IE5 = IE55 = IE6 = IE7 = IE8 = IE9 = IE10 = IE11 = false;
// 	
//  var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
//  
//  reIE.test(userAgent);
//  
//  var ieVersion = parseFloat(RegExp["$1"]);
//  
//  console.log("IE_BROWSER_VERSION:" + ieVersion);
//  
//  IE55 = ieVersion == 5.5;
//  IE6 = ieVersion == 6.0;
//  IE7 = ieVersion == 7.0;
//  IE8 = ieVersion == 8.0;
//  IE9 = ieVersion == 9.0;
//  IE10 = ieVersion == 10.0;
//  IE11 = ieVersion == 11.0;
//  
//  
//  if (IE5) {
//  		return "IE5";
//  }
//  if (IE55) {
//      return "IE55";
//  }
//  if (IE6) {
//      return "IE6";
//  }
//  if (IE7) {
//      return "IE7";
//  }
//  if (IE8) {
//      return "IE8";
//  }
//  if (IE9) {
//      return "IE9";
//  }
//  
//   if (IE10) {
//      return "IE10";
//  }
//   
//   if (IE11) {
//      return "IE11";
//  }
//}

var httpService = new HttpService();
