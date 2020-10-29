
var modalCount = 0;


var modalCloseFlag = false;


var modalCloseAlert = false;

$(document).on('shown.bs.modal', '.modal', function () {
	
    var zIndex = 1040 + (10 * modalCount);
	
	
    $(this).css('z-index', zIndex);
	
	
    setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
	
	$(this).find(".kt-select2").select2({width: '100%'});
	
	
	if($(this).find(".kt-portlet[data-ktportlet=true]").length > 0){
		$.each($(this).find(".kt-portlet[data-ktportlet=true]"), function(idx, map){
			new KTPortlet($(map).attr("id"));
		});
	}
	
	
	$(this).focus();
	
	
    modalCount = modalCount + 1;
});


$(document).on('hidden.bs.modal', '.modal', function () {
	
	var draggie = $(this).data('draggabilly');
	if(!$.osl.isNull(draggie)){
		draggie.destroy();
	}
	
	
	if($('.modal:visible').length > 0){
		
		$(document.body).addClass('modal-open');
	}
	
	
	$(this).remove();
	
	
	modalCount = modalCount - 1;
});



$(document).on('hide.bs.modal', '.modal', function () {
	if(event){
		
		event.cancelable = true;
		event.stopPropagation();
		event.preventDefault();
		event.returnValue = false;
	}
	
	
	if(modalCloseAlert){
		return false;
	}
	
	var that = this;
	
	
	if(modalCloseFlag){
		modalCloseFlag = false;
		return true;
	}
	
	
	if(!$(that).data("closeconfirm")){
		modalCloseFlag = false;
		return true;
	}
	
	
	modalCloseAlert = true;
	
	$.osl.confirm("팝업 창을 닫으시겠습니까?",null,function(result) {
    	modalCloseAlert = false;
        if (result.value) {
        	
        	modalCloseFlag = true;
        	
        	
        	$(that).modal('hide');
        }
    });

	
	
	return false;
});

var modal_popup = function(url, data, opts){
	var options;
	var opts = opts;
	
	
	var defaultOptions = {
			modalSize: 'lg',
			fitScreen: true,
			backdrop: true,
			keyboard: true, 
			showLoading: true,
			closeConfirm: true,
			idKeyDuple: false,
			focus: false,
			autoHeight: true,
			draggable: true,
			'class': {
				
				"header": "",
				"body": "",
				"footer": ""
			}
	};
	
	
	options = $.extend(true, defaultOptions, opts, opts);
	
	
	if(!options.idKeyDuple){
		if($(".modal[data-idkeyduple=false]").length > 0 && $(".modal[data-idkeyduple=false]").data("idkey") == options.idKey){
			$.osl.alert("해당 기능 팝업은 중복으로 동작 할 수 없습니다.");
			return false;
		}
	}
	
	
	var layerIndex = $(".modal").length;
	var layerBoxDivId = "lpx"+layerIndex;
	
	
	var modalContentClass = '';
	var modalSize = "modal-"+options.modalSize;
	
	
	var modalTitle = '';
	if(options.hasOwnProperty("modalTitle")){
		modalTitle = $.osl.escapeHtml(options.modalTitle);
	}

	
	var footerBtnStr = '';
	if(options.hasOwnProperty("footerBtn")){
		footerBtnStr = options.footerBtn.join("");
	}
	
	var classHeader = options.class.header;
	var classHeaderTitle = classHeaderBtn = "";
	
	
	if(typeof options.class.header == "object"){
		if(options.class.header.hasOwnProperty("header")){
			classHeader = options.class.header.header;
		}
		if(options.class.header.hasOwnProperty("headerTitle")){
			classHeaderTitle = options.class.header.headerTitle;
		}
		if(options.class.header.hasOwnProperty("headerBtn")){
			classHeaderBtn = options.class.header.headerBtn;
		}
	}
	
	
	var mainModalFrameCss = "";
	if(options.modalSize != null && options.modalSize == "fs"){
		mainModalFrameCss = modalSize;
	}
	
	
	if(options.fitScreen){
		modalContentClass = "osl-modal__screen--fit";
	}
	
	$("body").prepend(
		'<div class="modal '+mainModalFrameCss+'" id="'+layerBoxDivId+'" role="dialog" tabIndex="-1" aria-labelledby="'+layerBoxDivId+'" aria-hidden="true" data-backdrop="'+options.backdrop+'" data-keyboard="'+options.keyboard+'" data-closeconfirm="'+options.closeConfirm+'" data-idkeyduple="'+options.idKeyDuple+'" data-idkey="'+options.idKey+'" data-focus="'+options.focus+'" data-draggable="'+options.draggable+'">'
			+'<div class="modal-dialog modal-dialog-centered '+modalSize+'" role="document">'
				+'<div class="modal-content '+modalContentClass+'">'
					+'<div class="modal-header clearfix '+classHeader+'">'
						+'<h5 class="modal-title kt-font-boldest '+classHeaderTitle+'">'+modalTitle+'</h5>'
						+'<button type="button" class="close '+classHeaderBtn+'" data-dismiss="modal" aria-hidden="true"><i class="pg-close fs-14"></i></button>&nbsp;'
					+'</div>'
					+'<div class="modal-body '+options.class.body+'" data-height="200">'
						
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	);
	
	
	if(options.draggable){
		var dragObj = new Draggabilly( '#'+layerBoxDivId+' .modal-dialog', {
			handle: '.modal-header'
		});
		$('#'+layerBoxDivId).data('draggabilly', dragObj);
		
		
		$('#'+layerBoxDivId+' .modal-header').addClass("osl-modal__cursor--move");
	}
	
	
	var loadingShowVal = options.showLoading;
	
	
	var ajaxObj = new $.osl.ajaxRequestAction(
			{"url":url,async:true, loadingShow: loadingShowVal}
			,data);
	
	ajaxObj.setFnSuccess(function(data, textStatus, xhr){
		$.osl.deferred= $.Deferred();
		
		
		$("#"+layerBoxDivId).modal('show');
		
		
		$("#"+layerBoxDivId+" .modal-body").html(data);

		
		var modalFooter = $("#"+layerBoxDivId+" .modal-body").find(".modal-footer");
		modalFooter.addClass(options.class.footer);
		
		if(modalFooter.length > 0){
			$("#"+layerBoxDivId+" .modal-body").after(modalFooter);
		}else{
			$("#"+layerBoxDivId+" .modal-body").after(
					'<div class="modal-footer'+options.class.footer+'">'
						+'<button type="button" class="btn btn-outline-brand" data-dismiss="modal">'+$.osl.lang("modal.close")+'</button>'
					+'</div>'
			);
		}
		
		
		var fnAutoHeight = function(){
			var height = parseInt(KTUtil.getViewPort().height);
            return parseInt(height*0.8);
		}
		
		
		if(!options.autoHeight){
			fnAutoHeight = $.noop;
		}
		
		
		KTUtil.scrollInit($("#"+layerBoxDivId).find(".modal-body")[0], {
	        disableForMobile: true, 
	        resetHeightOnDestroy: true, 
	        handleWindowResize: true, 
	        height: fnAutoHeight
	    });
		
		
		if(options.hasOwnProperty("callback")){
			$.each(options.callback, function(idx, map){
				var targetId = map.targetId;
				var actionFn = map.actionFn;
				var targetElem = $("#"+targetId);
				
				if(targetElem.length > 0 && typeof actionFn == "function"){
					targetElem.click(function(){
						actionFn(this);
					});
				}
				
			});
		}
		
		$.osl.deferred.resolve();
		return $.osl.deferred.promise();
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		if(xhr.status == '999'){
    		$.osl.alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    		document.location.href="/cmm/cmm4000/cmm4000/selectCmm4000View.do"
    		return;
    	}
		if(xhr.status == '404'){
			console.log(err);
			$.osl.alert('팝업 페이지에서 오류가 발생했습니다.');
    		$.osl.showLoadingBar(false);
    		
    		
    		modalCloseFlag = true;
    		$("#"+layerBoxDivId).modal("hide");
    		return;
    	}
		if(xhr.status == '401'){
			$.osl.alert('권한이 부족합니다.');
			$.osl.showLoadingBar(false);
    		
    		
    		modalCloseFlag = true;
    		$("#"+layerBoxDivId).modal("hide");
    		return;
    	}
	});
	
	
	ajaxObj.send();
	
	
	return layerBoxDivId;
}
