//	电子签章类
function ElectronicSignature(){
    /**
     * 操作签章方法
     * @param {*合同对象} contractImage 
     * @param {*操作的印章对象} nameImage 
     * @param {*印章left偏移} iOffsetLeft 
     * @param {*印章top偏移} topYCanvas 
     */
    this.operatingSignature = function(contractImage,nameImage,iOffsetLeft,topYCanvas){
        try {
            var canvas = document.createElement('canvas');
            var cxt = canvas.getContext('2d');
            var newImg = new Image();
            newImg.onload = function (){
                canvas.width = newImg.width;//合同width
                canvas.height = newImg.height;//合同height
                cxt.drawImage(newImg,0,0,newImg.width,newImg.height,0,0,newImg.width,newImg.height);
                cxt.save();
                try {
                    var tempImage = new Image();
                    tempImage.onload = function(){
                        var tempImageX = iOffsetLeft*(canvas.width/cW);//图片在canvas上的X坐标 
                        var tempImageY = topYCanvas*(canvas.height/cH);//图片在canvas上的Y坐标
                        var tempImageW = iw*(canvas.width/cW);//图片width
                        var tempImageH = iH*(canvas.height/cH);//图片height
                        cxt.drawImage(tempImage,tempImageX,tempImageY,tempImageW,tempImageH);   
                        var canvasImage = canvas.toDataURL("image/jpg");
                        contractImage.attr("src",canvasImage);
                    }
                    tempImage.crossOrigin = 'Anonymous';//解决跨域问题
                    tempImage.src = nameImage.attr("src");
                    var iw = nameImage.width();
                    var iH = nameImage.height();
                } catch (error) {
                    console.log(error);
                }
            }
            newImg.crossOrigin = 'Anonymous';//解决跨域问题
            newImg.src =  contractImage.attr("src");//获取路劲
            var cW = contractImage.width();//展示的宽
            var cH = contractImage.height();
        } catch (error) {
            console.log(error);
        }
    }
    

    /**
     * 获取签名的XY轴
     * @param {*e} event 
     * @param {*需要操作的印章对象，即自身} self 
     */
    this.getSignatureXY = function(event,self) {
        try {
            $($(self).siblings()).css({"position":"static"});
            $($(self).siblings()).css({"left":"0px"});
            $($(self).siblings()).css({"top":"0px"});
            $(self).css({'position':"absolute"});
            // $(self).removeAttr("left");
            // $(self).removeAttr("top");
            var defaultX = 0 ;
            var defaultY = 0 ; 
            defaultX = event.clientX-self.offsetLeft;//获取边界到鼠标的距离 offsetLeft父坐标的计算左侧位置 
            defaultY = event.clientY-self.offsetTop;  
        
            // 拖动将执行这下面的函数
            document.onmousemove = function(ev){
                try {
                    var oEvent = ev || event;  
                    var x = oEvent.clientX-defaultX;  
                    var y = oEvent.clientY-defaultY;   
                    if (y<0) {  
                        y=0;  
                    }  
                     var tempx = -($(self).width());
                    if (x>tempx) {  
                        x=tempx;  
                    }  
                    self.style.left=x+'px';    //根据鼠标位置相对定位，得到left，top值  
                    self.style.top=y+'px';  
                    return false;
                } catch (error) {
                    console.log(error);
                }
            } 
            // 鼠标放下时 
            document.onmouseup = function(){  
                document.onmousemove = null;  
                document.onmouseup = null;  
            }
            
            //  双击点击执行签署操作
            document.ondblclick = function(){
                try {
                    var tempSid = $(self).attr('sid');
                    interfaceServer.dosetSignImage(tempSid);//请求设置印章
                    var cHeigth = Math.round(contractSrcObj["0"].scrollHeight);
                    console.log("合同实际高度scrollHeight"+cHeigth);
                    
                    var cWidth = Math.round(contractSrcObj["0"].scrollWidth);
                    console.log("合同宽度scrollWidth"+cWidth);

                    var cOffsetLeft = Math.round(contractSrcObj.offset().left);
                    console.log("合同左侧偏移量"+cOffsetLeft);

                    var cOffsetTop = Math.round(contractSrcObj.offset().top);
                    console.log("合同顶部偏移量"+cOffsetTop);

                    var cScrollTop = Math.round(contractSrcObj["0"].scrollTop);
                    console.log("卷起的部分cScrollTop"+cScrollTop);

                    var cclientHeight = Math.round(contractSrcObj["0"].clientHeight);
                    console.log("可视区域高度clientHeight"+cclientHeight);

                    var iHeigth = Math.round($(self).height());
                    console.log("印章的高度"+iHeigth);

                    var iWidth = Math.round($(self).width());
                    console.log("印章的宽度"+iWidth);

                    var contractHeight = Math.round(cHeigth/publicContrackPages);
                    console.log("获得每个合同的实际高度"+contractHeight);

                    var iOffsetLeft = Math.round($(self).offset().left);
                    console.log("印章左测偏移量"+iOffsetLeft);

                    var iOffsetTop = Math.round($(self).offset().top);
                    console.log("印章顶部偏移量"+iOffsetTop);
                    
                    var tempAllHeight =  cScrollTop+(iOffsetTop-cOffsetTop);
                    console.log('卷起的加印章的'+tempAllHeight);

                    var tempPage = Math.ceil(tempAllHeight/contractHeight);
                    if(tempPage==0){
                        tempPage=1;
                    }
                    console.log("向上取整,操作的是第"+tempPage+"合同");
                
                    var contractImgList0Obj = $("#contractImgList"+tempPage);
                    console.log("是一个对象"+contractImgList0Obj);

                    var contractImgList0ObjWidth = contractImgList0Obj.width();
                    console.log("合同的宽度"+contractImgList0ObjWidth);

                    var contractImgList0ObjHeight = contractImgList0Obj.height();
                    console.log("合同的高度"+contractImgList0ObjHeight);

                    var signX = (iOffsetLeft-cOffsetLeft)/contractImgList0ObjWidth;
                    console.log("获得X坐标"+signX);

                    var signY = "0."+((iOffsetTop-cOffsetTop+(cScrollTop%contractImgList0ObjHeight))/contractImgList0ObjHeight).toString().split(".")[1];
                    console.log("获的Y坐标"+signY);

                    var leftXCanvas = iOffsetLeft-cOffsetLeft;
                    console.log("X偏移"+leftXCanvas);

                    var topYCanvas = (iOffsetTop-cOffsetTop+(cScrollTop%contractImgList0ObjHeight))%contractImgList0ObjHeight;
                    console.log("Y偏移"+topYCanvas);

                    console.log("获取TOP值"+(iOffsetTop-cOffsetTop)+"卷起部分"+(cScrollTop%contractImgList0ObjHeight));
                    self.style.position="static";
                    self.style.top="0";
                    self.style.left="0";
                    // electronicSignature.operatingSignature(contractImgList0Obj,$(self),leftXCanvas,topYCanvas); 
                    publictempPage = tempPage;//全局 实际操作的页码数据
                    publicsignX = signX;//全局X
                    publicsignY = signY; //全局Y
                    publiciWidth = iWidth ;//全局width
                    publiciHeigth = iHeigth;//全度height
                } catch (error) {
                    console.log(error);
                } finally {
                    document.ondblclick = null;//取消全局绑定双击 
                }         
            };
        } catch (error) {
            console.log(error);
        } finally {
            return false;
        }

    }
    
    // 锁定合同
    this.lockTheContract = function(){
        try {
            if(isNull(publiccuuid)){
                return;
            }
            interfaceServer.dolockCon(publiccuuid);
        } catch (error) {
            console.log(error);
        }
    }

    // 完成合同 结束合同
    this.finishTheContract = function(){
        try {
            if(isNull(publiccuuid)){
                return;
            }
            interfaceServer.dofinishCon(publiccuuid);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 操作显示     其余隐藏
     * @param {*第一个参数显示} theFirst 
     * @param {*隐藏} second 
     * @param {*隐藏} three 
     */
    this.operationRequest = function(theFirst,second,three) {
        try {
            if(theFirst!==null){
                theFirst.show();
            }
            if(second!==null){
                second.hide();
            }
            if(three!==null){
                three.hide();
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    //操作显示 隐藏   第一个参数显示 其余隐藏
    this.showORhidden = function(one,two,three,four) {
        try {
            if(!isNull(one)){
                one.show();
            }
            if(!isNull(two)){
                two.hide();
            }
            if(!isNull(three)){
                three.hide();
            }
            if(!isNull(four)){
                four.hide();
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    //操作显示 隐藏     第一，第二个参数显示 其余隐藏
    this.towshowORhidden = function(one,two,three,four) {
        try {
            if(!isNull(one)){
                one.show();
            }
            if(!isNull(two)){
                two.show();
            }
            if(!isNull(three)){
                three.hide();
            }
            if(!isNull(four)){
                four.hide();
            }
        } catch (error) {
            console.log(error);
        }
    }

    //弹窗显示
    this.operationUpload = function(popUpsObj,second){
       try {
            if(!isNull(popUpsObj)){
                popUpsObj.show();
            }
            if(!isNull(second)){
                second.hide();
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * 执行删除操纵 印章
     * @param {*印章ID} sidData 
     */
    this.runDelSignature = function(sidData){
        try {
            if(isNull(sidData)){
                return;
            }
            interfaceServer.dodelSignature(sidData);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * 执行删除操纵 
     * @param {*合同ID} cuuidData 
     */
    this.runDelContract = function(cuuidData){
        try {
            if(isNull(cuuidData)){
                return;
            }
            interfaceServer.dodelContract(cuuidData);
        } catch (error) {
            console.log(error);   
        }
    };

    //执行合同修改
    this.runGetContractOne = function(itself) {
        try {
            var itselfObj = $(itself);
            var trData = itselfObj.parent().parent().parent().parent();
            var cuuidData = trData.attr('contractid');
            interfaceServer.dodelContract(cuuidData);
        } catch (error) {
            console.log(error);
        }
    };

    //执行修改合同操作
    this.runUpdateContract = function(itself){
        try {
            var itselfObj = $(itself);
            var trData = itselfObj.parent().parent().parent().parent();
            var cuuidData = trData.attr('contractid');
            interfaceServer.dogetContractOne(cuuidData);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * 执行修改印章操作
     * @param {*当前自身对象} itself 
     */
    this.runUpdateSignature = function(itself){
        try {        
            var itselfObj = $(itself);
            var trData = itselfObj.parent().parent().parent().parent();
            var sidData = trData.attr('id');
            interfaceServer.dogetSignatureOne(sidData);
        } catch (error) {
            console.log(error);
        }
    };

    //执行添加后 willShow显示参数 willShow隐藏参数
    this.runAddOperating = function(willShow,willHide){
        willShow.show();
        willHide.hide();
    };
    
    // 签章查看 签署
    this.runSignedView = function(itself){
        try {
            var itselfObj = $(itself);
            var trData = itselfObj.parent().parent().parent().parent();
            publiccuuid = trData.attr('contractID');
            $("#pCompany").text(publicCompany+"章列表"); 
            if(publicorgUuid!==null){
                var orgUuid = publicorgUuid;
                interfaceServer.doshowConDetail(orgUuid,publiccuuid);
            } else {
                BJUI.alertmsg('info', '请选择左侧选择法人架构公司名');
            }
        } catch (error) {
            console.log(error);
        }
    };

    //下载合同
    this.downloadContract = function(itself){
        try {
            if(publiccuuid==null){
                var itselfObj = $(itself);
                var trData = itselfObj.parent().parent().parent().parent();
                publiccuuid = trData.attr('contractid');
            }
            interfaceServer.downloadCon(publiccuuid);
        } catch (error) {
            console.log(error);
        }
    };

    //审阅合同
    this.reviewContract = function(id){
        try {
            if(isNull(publicorgUuid)){
                BJUI.alertmsg('info','法人架构ID不能为空');
                return;
            }
            if(isNull(publiccuuid)){
                BJUI.alertmsg('info','合同ID不能为空');
                return;
            }
            interfaceServer.doupdateReview(id,publiccuuid,publicorgUuid);             
        } catch (error) {
            console.log();
        }
    };

    /**
     * 删除签署者
     * @param {*合同ID} id 
     */
    this.delSigner = function(id){
        try {
            if(isNull(id)){
                BJUI.alertmsg('info','合同ID不能为空');
                return;
            }
            interfaceServer.doremoveSigner(id);          
        } catch (error) {
            console.log(error);
        }
    };

    
    /**
     * 搜索合同 关键字搜索
     * @param {*法人架构ID} orgUuid 
     * @param {*搜索关键字} skey 
     * @param {*对应页码} pageIndex 
     */
    this.searchCon = function(orgUuid,skey,state,pageIndex){
        try {
            if(isNull(orgUuid)||isNull(skey)){
                BJUI.alertmsg("warn","搜索字段不能为空");
                return;
            }
            interfaceServer.doContractSearch(orgUuid,skey,state,pageIndex);
        } catch (error) {
            console.log(error);
        }
    }
    
    /**
     * 搜索印章 关键字
     * @param {*法人架构ID} orgUuid 
     * @param {*搜索关键字} skey 
     */
    this.doSignatureSearch = function(orgUuid,skey,pageIndex){
    	try{
    		if (isNull(orgUuid)||isNull(skey)) {
    			BJUI.alertmsg("warn","搜索字段不能为空");
                return;
            }
            if (isNull(pageIndex)||isNull(pageIndex)) {
                pageIndex = 1;
            }
    		interfaceServer.doSignatureSearch(orgUuid,skey,pageIndex);
    	} catch (error) {
    		console.log(error);
    	}
    };

    /**
     * 合同状态检索
     * @param {*当前对象} self 
     */
    this.searchConState = function(self){
    	try{
            var orgUuid = publicorgUuid;
            var state = $(self).val();
    		if (isNull(state)) {
    			BJUI.alertmsg("warn","搜索字段不能为空");
                return;
            }
            if (isNull(orgUuid)) {
                BJUI.alertmsg("warn","法人数据为空");
                return;
            }
            statusContract = state;
    		interfaceServer.doContractSearchState(orgUuid,state,publicPageCon);
    	} catch(error) {
    		console.log(error);
    	}
    };
 
}
 

// 查看合同 数据回调
function upshowConDetail(data){
    try {
        document.getElementById("stampBlock").oncontextmenu =function(){
            return false;
        }
        // $("").clientWidth

        $("#contractSrc").height($(window).height()-260)//css("height",$(window).height()*0.6+"px");
        var data = data;
        if(!isNull(data)){
            data = JSON.parse(data.content);
        }
        stampObj.show();
        contractObj.hide();
        var tempListImg = "";
        var tempContract = SERVER_ROOT+'/contract';   
        publicContrackPages = data.imgList.length;
        for (var index = 0; index < data.imgList.length; index++) {
            tempListImg += '<img id="contractImgList'+(index+1)+'" width="100%" src='+(tempContract+data.imgList[index])+'>';
        }
        contractSrcObj.html(tempListImg);
    
        //印章结构块
        if(data.seal.length==0){
            console.log('无印章,无法执行签署操作');
        }
        var sealListImg = "";
        var tempSealName = SERVER_ROOT+'/signature/';
        for (var index = 0; index < data.seal.length; index++) {
            sealListImg += '<img sid='+data.seal[index].id+' src='+(tempSealName+data.seal[index].name)+' onmousedown="electronicSignature.getSignatureXY(event,this)">';
            sealListImg += '<p>'+data.seal[index].title+'</p>'
        }
        sealListBlockObj.html(sealListImg);
        if(data.signers.length==0){
            isSingleSign = true;
        } else {
            isSingleSign = false;
        }
        //签署者数据
        var signerhtml = "";
        var temptext = "";
        var isDisplay = '';//是否允许操作
        for(var i = 0; i < data.signers.length; i++ ) {
            var isDelete = '';//是否允许删除
            var t = "'confirm'";
            var z = "'你确定要执行该操作吗?'";
            isDelete = 'data-options="{type:'+t+', msg:'+z+', okCall:function(){electronicSignature.delSigner('+data.signers[i].id+')}}"';
            if(data.signers[i].state==0){
                tempText="未签署";
            } else if (data.signers[i].state==1){
                tempText="签署中";
            }else if (data.signers[i].state==2){
                isDisplay = 'isaddDisplayStyle';
                tempText="已完成";
            } else {
                tempText="初始化";
            }
            if ( data.signers[i].state==2){
                signerhtml += "<tr id="+data.signers[i].id+">";
                signerhtml +=     "<td>" + (i+1) + "</td>";
                signerhtml +=     "<td>" + data.signers[i].cName + "</td>";
                signerhtml +=     "<td>" + tempText + "</td>";
                signerhtml +=     "<td><div class='datagrid-toolbar'><div class='btn-group' style='width:60px; text-align: center;' role='group'><a class='hand_type "+isDisplay+"' > 删除</a></div></div></td>";
                signerhtml += "</tr>";
            } else {
                signerhtml += "<tr id="+data.signers[i].id+">";
                signerhtml +=     "<td>" + (i+1) + "</td>";
                signerhtml +=     "<td>" + data.signers[i].cName + "</td>";
                signerhtml +=     "<td>" + tempText + "</td>";
                signerhtml +=     "<td><div class='datagrid-toolbar'><div class='btn-group' style='width:60px; text-align: center;' role='group'><a class='hand_type' data-toggle='alertmsg' "+isDelete+"> 删除</a></div></div></td>";
                signerhtml += "</tr>";
            }
        }
        tbodySignerObj.html(signerhtml);          
    } catch (error) {
        console.log(error);
    }
}

//签章数据处理  印章 回调
function upgetSignatureList(data){
    try {
        if(!isNull(data.content)){
            data = JSON.parse(data.content);
        }
        if(!isNull(data.allPage)){
            allPageSin = data.allPage;
        }
        $("#pageIndexSeal").html( publicPageSin + '/' +allPageSin);
        var html = "";
        var tempSealName = SERVER_ROOT+'/signature/';//onerror="this.src='img/onError.png'"
        var imgError = "this.src='img/onError.png'";
        var onErrorImg = 'onerror="'+imgError+'"';
        if(data.dataList.length!=0){
            for( var i = 0; i < data.dataList.length; i++ ) {
                var isDelete = '';//是否允许删除
                var t = "'confirm'";
                var z = "'你确定要执行该操作吗?'";
                isDelete = 'data-options="{type:'+t+', msg:'+z+', okCall:function(){electronicSignature.runDelSignature('+data.dataList[i].id+')}}"';
                html += "<tr id="+data.dataList[i].id+">";
                html +=     "<td>" + (i+1) + "</td>";
                html +=     "<td>" + data.dataList[i].title + "</td>";
                html +=     "<td>" + data.dataList[i].fileName + "</td>";
                html +=     "<td><img style='height:20px;' src="+ (tempSealName+data.dataList[i].name) +"  "+onErrorImg+" ></td>";
                html +=     '<td><div class="datagrid-toolbar"><div class="btn-group" role="group"><button type="button" class="btn btn-white" data-icon="times" onclick="electronicSignature.runUpdateSignature(this)"><span class="but-badge"><img src="img/icon-Edit.svg"/> </span></button><button type="button" class="btn btn-white" data-icon="times" data-toggle="alertmsg" '+isDelete+'><span class="but-badge"><img src="img/icon-Delete.svg"/></span></button></div></div> </td>';
                html += "</tr>";
            }
        } else {
            html = '<h4>暂无数据</h4>'
        }
        
        $("#tbodySeal").html(html);
    } catch (error) {
         console.log(error);   
    }
};


//处理合同列表 回调
function upgetContractList(data) {
    try {
        if(!isNull(data.content)){
            data = JSON.parse(data.content);
            if(!isNull(data.allPage)){
                allPageCon = data.allPage;
            }
            if(!isNull(data.dataList)){
                data = data.dataList;
            }
            if (allPageCon == 0) {
            	publicPageCon=0;
            }
            
			$("#pageIndexContract").html( publicPageCon + '/' +allPageCon);
			if(publicPageCon == 1 || publicPageCon == 0){
				$("#incrementContract").addClass("isaddDisplayStyle");
			} else {
				$("#incrementContract").removeClass("isaddDisplayStyle");
            }
            if(publicPageCon>=allPageCon){
                $("#decreasingContract").addClass("isaddDisplayStyle");
            } else {
                $("#decreasingContract").removeClass("isaddDisplayStyle");
            }
        }
        
        var html = "";
        if(!isNull(data.length)){
            for( var i = 0; i < data.length; i++ ) {
                var contractStatus = '合同状态';
                var isDownload = '';//是否允许下载
                var isDisplayDownload = '';//是否禁用下载
                var isDisplayEdit = '';//是否禁用编辑
                var isDisplayDetele = '';//是否禁用删除 
                var isDelete = '';//是否允许删除
                var isEdit = '';//是否允许修改
                var t = "'confirm'";
                var z = "'你确定要执行该操作吗?'";
                var tempLock = "签署";
                if(data[i].state ==0){
                    contractStatus = '未签署';
                    isDelete = 'data-options="{type:'+t+', msg:'+z+', okCall:function(){electronicSignature.runDelContract('+data[i].id+')}}"';
                    isEdit = 'onclick="electronicSignature.runUpdateContract(this)"';
                    isDisplayDownload = 'isaddDisplayStyle';
                } else if(data[i].state ==1){
                    contractStatus = '签署中';
                    isDisplayDownload = 'isaddDisplayStyle';
                    isDisplayEdit = 'isaddDisplayStyle';
                    isDisplayDetele = 'isaddDisplayStyle';
                } else if(data[i].state ==2){
                    contractStatus = '已完成';
                    isDownload = "onclick='electronicSignature.downloadContract(this)'";
                    isDisplayEdit = 'isaddDisplayStyle';
                    isDisplayDetele = 'isaddDisplayStyle';
                    tempLock="查看"
                } else {
                    contractStatus = '初始化';
                    isDisplayDownload = 'isaddDisplayStyle';
                    isDelete = 'data-options="{type:'+t+', msg:'+z+', okCall:function(){electronicSignature.runDelContract('+data[i].id+')}}"';
                    isEdit = 'onclick="electronicSignature.runUpdateContract(this)"';
                }
                html += "<tr contractID="+data[i].id+" >";//合同ID
                html +=     "<td>" + (i+1) + "</td>";
                html +=     "<td>" + data[i].title + "</td>";
                html +=     "<td>" + data[i].fileName + "</td>";
                html +=     "<td>"+ contractStatus +"</td>";
                html +=     '<td><div class="datagrid-toolbar"><div class="btn-group" role="group"><a class="hand_type" onclick="electronicSignature.runSignedView(this)">'+tempLock+'</a><a class="hand_type '+isDisplayDownload+'" '+isDownload+'> 下载</a></div><div class="btn-group text-left" role="group"><button type="button" class="btn btn-white '+isDisplayEdit+'" '+isEdit+' data-icon="times" ><span class="but-badge"><img src="img/icon-Edit.svg"/> </span></button><button type="button" class="btn btn-white '+isDisplayDetele+'" data-icon="times" data-toggle="alertmsg" '+isDelete+'><span class="but-badge"><img src="img/icon-Delete.svg"/></span></button></div></div></td>';
                html += "</tr>";
            };
        }else{
            html = '<h4>暂无数据</h4>';
        }
        
        $("#tbodyContract").html(html);       
    } catch (error) {
        console.log(error);
    }
};


// 删除印章 	数据回调
function updelSignature(data){
    try {
        if(isNull(publicorgUuid)) {
            return;
        }
        publicPageSin = 1;//默认展示第一页
        interfaceServer.dogetSignatureList(publicorgUuid,publicPageSin);    
    } catch (error) {
        console.log(error);   
    };
};

// 删除合同		数据回调
function updelContract(data){
    try {
        if(isNull(publicorgUuid)){
            return;
        }
        publicPageCon = 1;//默认展示第一页
        interfaceServer.dogetContractList(publicorgUuid,publicPageCon);
    } catch (error) {
        console.log(error);    
    };
};

//修改合同列数据 数据回调
function upgetContractOne(data) {
    try {
        electronicSignature.operationUpload(uploadContractObj,contractObj);
        if(!isNull(data.content)){
            data = JSON.parse(data.content);
        }
        if(!isNull(data.title)){
            $("#cname").val(data.title);
        }
        if(!isNull(data.deadline)){
            $("#deadline").val(data.deadline);
        }
        if(!isNull(data.summary)){
            $("#summary").val(data.summary);
        }
        if(!isNull(data.id)){
            $("#cuuidA").val(data.id);
        }  
        $("#PDF_block").hide();//隐藏文件上传结构块
        $("#fileNameCon").val(data.fileName);
        $("#nameCon").val(data.name);
    } catch (error) {
        console.log(error);	
    }
};

//修改印章列数据 数据回调
function upgetSignatureOne(data) {
    try {
        electronicSignature.operationUpload(uploadSealObj,sealObj);
        if(!isNull(data.content)){
            data = JSON.parse(data.content);
        }
        if(!isNull(data.title)){
            $("#sname").val(data.title);
        }
        if(!isNull(data.summary)){
            $("#summaryB").val(data.summary);
        }
        if(!isNull(data.id)){
            $("#sid").val(data.id);
        }
        $("#PNG_block").hide(); 
        $("#fileNameSin").val(data.fileName);
        $("#nameSin").val(data.name);
    } catch (error) {
        console.log(error);	
    }
};

// 注册二级账号,设置企业证件信息接口    数据回调
function upapplyCert(data) {  
    try {
        var data ;
        if(!isNull(data.content)){
            data = JSON.parse(data.content);
        }
        certificateCABlockObj.show();
        contractObj.hide();
        if(!isNull(data.taskId)){
            tempTaskId = data.taskId;
        }
        interfaceServer.docertStatus(publicorgUuid,tempTaskId);
    } catch (error) {
        console.log(error);
    }
};
    
// 上上签查询证书申请情况     数据回调
function upcertStatus(data) {
    try {
        var data ;
        if(!isNull(data.content)){
            data = JSON.parse(data.content);
        }
        if(!isNull(data.message)){
            if(!isNull(data.message.info)){
                ShangShangQianCAInfoObj.text(data.message.info);
            }
        }
        certificateCABlockObj.show();
        contractObj.hide();	
        //中税ca认证 申请
        //interfaceServer.doZhongShuiCert(publicorgUuid);
        interfaceServer.doZhongShuiCertStatus(publicorgUuid);
    } catch (error) {
        console.log(error);	
    }
};

//中税ca证书查询  数据回调
function upZhongShuiCertStatus(data){
	try{
		console.log(data);
		if (!isNull(data.content)) {
			var errcodeData = data.content;
			errcodeData = JSON.parse(errcodeData);
		}
		if (errcodeData.errcode !== 0) {
			//中税ca认证 申请
        	interfaceServer.doZhongShuiCert(publicorgUuid);
		} else{
			ZhongShuiCAInfoObj.text("数字证书申请成功");
		}
		
	}catch(e){
		console.log(e);
	}
}

//中税ca认证 申请   数据回调
function upZhongShuiCert(data){
	try{
		console.log(data);
		if(!isNull(data.content)){
	        data = JSON.parse(data.content);
	    }
		if(!isNull(data.message)){
	        if(!isNull(data.message.info)){
	            ZhongShuiCAInfoObj.text(data.message.info);
	        }
	    }
		//中税ca认证证书申请情况  查询
		certificateCABlockObj.show();
	    contractObj.hide();
	}catch(error){
		console.log(error);
	}
	
}



//签署者信息获取树形列表信息
function doGetTreeData(){
    try {
        signatory = true;
        stampObj.hide();
        signerListObj.show();
        ztreeList.ztreelistnode(SignerListDemoObj,3);
    } catch (error) {
        console.log(error);	
    }
};

//添加签署者 获取树状结构数据
function upsignatorydata(data){
    try {
        SignerListDemo(data);
    } catch (error) {
        console.log(error);   
    }
};

// 设置印章数据回调
function updosetSignImage(data){
    try {
        // console.log("设置印章数据"+data);
        if(isSingleSign){
            var r = confirm("温馨提示\n您未增加其他签署者，是否执行单方签署操作？");
            if (r==true){
                interfaceServer.dosignContract(publiccuuid,publicorgUuid,publictempPage,publicsignX,publicsignY,publiciWidth,publiciHeigth);      
            }
        } else {
            var r = confirm("确定执行签署操作吗？");
            if (r==true){
                interfaceServer.dosignContract(publiccuuid,publicorgUuid,publictempPage,publicsignX,publicsignY,publiciWidth,publiciHeigth);      
            }
        }
    } catch (error) {
        console.log(error);	
    }    
};


//添加签署者数据返回
function upaddSigner(data){
    try {
        var data;
        if(!isNull(data)){
            data = JSON.parse(data.content);
        }
        signerListObj.hide();
        stampObj.show();
        if(data.signers.length==0){
            isSingleSign = true;
        } else{
            isSingleSign = false;
        }
        var signerhtml = "";
        var tempText = "";//签署状态
        var isDisplay = '';//是否允许操作
        for(var i = 0; i < data.signers.length; i++ ) {
            var isDelete = '';//是否允许删除
            var t = "'confirm'";
            var z = "'你确定要执行该操作吗?'";
            
            isDelete = 'data-options="{type:'+t+', msg:'+z+', okCall:function(){electronicSignature.delSigner('+data.signers[i].id+')}}"';
            if ( data.signers[i].state==0) {
                tempText="未签署";
            } else if ( data.signers[i].state==1){
                tempText="签署中";
            }else if ( data.signers[i].state==2){
                isDisplay = 'isaddDisplayStyle';
                tempText="已完成";
            } else {
                tempText="初始化";
            }
            if ( data.signers[i].state==2){
                signerhtml += "<tr id="+data.signers[i].id+">";
                signerhtml +=     "<td>" + (i+1) + "</td>";
                signerhtml +=     "<td>" + data.signers[i].cName + "</td>";
                signerhtml +=     "<td>" + tempText + "</td>";
                signerhtml +=     "<td><div class='datagrid-toolbar'><div class='btn-group' style='width:60px; text-align: center;' role='group'><a class='hand_type "+isDisplay+"' > 删除</a></div></div></td>";
                signerhtml += "</tr>";
            } else {
                signerhtml += "<tr id="+data.signers[i].id+">";
                signerhtml +=     "<td>" + (i+1) + "</td>";
                signerhtml +=     "<td>" + data.signers[i].cName + "</td>";
                signerhtml +=     "<td>" + tempText + "</td>";
                signerhtml +=     "<td><div class='datagrid-toolbar'><div class='btn-group' style='width:60px; text-align: center;' role='group'><a class='hand_type' data-toggle='alertmsg' "+isDelete+"> 删除</a></div></div></td>";
                signerhtml += "</tr>";
            }
        }
        tbodySignerObj.html(signerhtml);
    } catch (error) {
        console.log(error);	
    }
};

//执行签署动作 回调
function upsignContract(data){
    try {
        BJUI.alertmsg("info","签署成功");
        interfaceServer.doshowConDetail(publicorgUuid,publiccuuid);
        console.log("执行签署动作"+data); 
    } catch (error) {
        console.log(error);	
    }
};

//下载合同数据返回
function updownloadCon(data){
    console.log("合同下载成功");
    console.log(data);
};

//完成合同数据返回 回调
function upfinishCon(data){
    console.log("完成合同"+data);
    alert(data.message);
};

//锁定合同数据返回 回调
function uplockCon(data){
    console.log("锁定合同"+data);
    alert(data.message);
};

//签章上传成功回调参数
function upsaveSignature(data){
    try {
        if(isNull(publicorgUuid)) {
           return;
        }
        interfaceServer.dogetSignatureList(publicorgUuid,publicPageSin);
    } catch (error) {
        console.log(error);	
    } finally {
        electronicSignature.runAddOperating(sealObj,uploadSealObj);
    }
};

//合同上传成功回调参数
function upsaveContract(data){
    try {
        if(isNull(publicorgUuid)){
            return;
        }
        publicPageCon=1;
        interfaceServer.dogetContractList(publicorgUuid,publicPageCon);
    } catch (error) {
        console.log(error);
    } finally {
        electronicSignature.runAddOperating(contractObj,uploadContractObj);
    }
};


//审阅合同数据回调
function upupdateReview(data){
    try {
        console.log('审阅合同数据回调'+data);
        interfaceServer.doshowConDetail(publicorgUuid,publiccuuid);
    } catch (error) {
        console.log(error);
    }
};

//删除签署者的数据回调
function upremoveSigner(data){
    try {
        if(isNull(publicorgUuid)){
            return;
        }
        if(isNull(publiccuuid)){
            return;
        }
        interfaceServer.doshowConDetail(publicorgUuid,publiccuuid);    
    } catch (error) {
        console.log(error);
    }
};

/**
 * 时间提醒结构块
 */

function ReminderTime(){
    console.log("操作时间提醒模块");
}

/**
 * 
 * @param {*搜索关键字} keyword 
 * @param {*doCallBack} callback 
 */
ReminderTime.prototype.doselectEmployee = function(keyword){
    if(isNull(keyword)){
        return;
    }
    interfaceServer.doselectEmployee(keyword);
};
var recipientsList = new Array();
// 操作结构块
ReminderTime.prototype.blockHide = function(self){
    var addData = $(self).attr("tempData");
    $("#emlieTempInfo").append("<span tempData='"+addData+"' >"+$(self).html()+"<i class='fa fa-times-circle' onclick='reminderTime.removeNameInfo(this)'></i></span>");
    $("#timeSearchInfo").hide();
    recipientsList.unshift(addData);
    $("#oaListTime").val("["+recipientsList+"]");
    $("#timeSearch").css({"padding-left":$("#emlieTempInfo").width()});
    $("#timeSearch").val("");
};

//删除选中 收件人
ReminderTime.prototype.removeNameInfo = function(self){
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i] == val) {
            this.splice(i, 1);
            break;
            }
        }
    }
    var selfobj = $(self);
    var removeDataList = selfobj.parent().attr('tempData');
    recipientsList.removeByValue(removeDataList);
    $("#oaListTime").val("["+recipientsList+"]");
    selfobj.parent().remove();
    $("#timeSearch").css({"padding-left":$("#emlieTempInfo").width()});
}; 



// 模糊查询员工信息 数据回调
function upselectEmployee(data){
    var tempLI = "";
    $("#timeSearchInfo").show();
    if(isNull(data)){
        return;
    }
    $("#timeSearchInfo").height("300px");
    if(isNull(data.content)){
        return;
    }
    var tempcontent = JSON.parse(data.content);
    for (var index = 0; index < tempcontent.length; index++) {
        var tempDataInfo = JSON.stringify(tempcontent[index]);
        var showOAInfo = tempcontent[index].uname +"( "+tempcontent[index].uid+" ) ";
        tempLI += "<li tempData="+tempDataInfo+" onclick='reminderTime.blockHide(this)'>"+showOAInfo+"</li>";
    }
    $("#timeSearchInfo").html(tempLI);
}

// 设置时间提醒数据回调 点击提交成功后
function upsetTimeReminder(data){
    try {
        var tempData = JSON.parse(data.content);
        console.log("设置时间提醒数据回调"+tempData.remindTime);
        $("#emlieTempInfo").html("");//页面显示值
        $("#oaListTime").val("");//隐藏绑定值
        $("#timeSearch").val("");//输入框
        $("#timeReminder").hide();//时间弹窗结构块
        interfaceServer.findTreeNodeInformation(publicorgUuid);
        $("#CorpoInform").show();//工商信息结构块
    } catch (error) {
        console.log(error);
    }
}
