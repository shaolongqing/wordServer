//定义公共组件
(function(global, $) {
	'use strict';

/**
 * 日志打印函数
 */
var log = function(msg, show) {
	if (global.console) {
		global.console.log(msg);
	} else {
		// console not supported.
		if (show) {
			alert(msg);
		}
	}
};

/**
 * 弹出提示
 */
var alert = function(msg,func) {
	var $alertModal = $("#alertModal");
	if ($alertModal.length > 0) {
		
		var display = $alertModal.css('display');
		if(display == 'none'){$alertModal.modal('show')};
		
		$(".modal-body", $alertModal).html(
				"<p class='alert-content'>" + msg + "</p>");
		
		$(".modal-footer .alert-info", $alertModal).unbind('click').click(function() {
			var hide = true;
			if (typeof (func) === "function") {
				hide = func.call();
			}
			if (hide == null || hide){$alertModal.modal('hide');}
		});
		
	} else {
		// Alert Modal not Exist!
		global.alert(msg);
	}
};

/**
 * 请求等待弹窗
 */
var loadTimeout = null;
var load = function(msg, loaded) {
	var $loadModal = $("#loadModal");
	if($loadModal.length > 0) {
		
		var display = $loadModal.css('display');
		if(display == 'none'){$loadModal.modal('show')};
		$(".modal-backdrop").hide();
		$(".load-body", $loadModal).html(
				"<p class='load-content'>"+msg+"</p>");
		
		if(loaded){
			if(loadTimeout != null){
				clearTimeout(loadTimeout);
				loadTimeout = null;
			}
			
			if(typeof loaded === 'number'){
				// n秒后关闭
				loaded *= 1000;
				setTimeout(function(){
					$loadModal.modal('hide');
				},loaded);
			}else{
				// 1秒后关闭
				setTimeout(function(){
					$loadModal.modal('hide');
				},2000);
			}
			
		}else{
			// 6秒后关闭
			loadTimeout = setTimeout(function(){
				$loadModal.modal('hide');
			},6000);
		}
	}
};

/**
 * 确认提示
 */
var confirm = function(msg, success, error) {
	var $confirmModal = $("#confirmModal");
	if ($confirmModal.length > 0) {
		
		var display = $confirmModal.css('display');
		if(display == 'none'){$confirmModal.modal('show')};
		
		$(".modal-body", $confirmModal).html(
				"<p class='alert-content'>" + msg + "</p>");

		$(".modal-footer .confirm-yes").unbind('click');
		$(".modal-footer .confirm-no").unbind('click');
		$(".modal-footer .confirm-yes", $confirmModal).click(function() {
			var hide = true;
			if (typeof (success) === "function") {
				hide = success.call();
			}
			if (hide == null || hide){$confirmModal.modal('hide');}
		});
		$(".modal-footer .confirm-no", $confirmModal).click(function() {
			if (typeof (error) === "function") {
				error.call();
			}
			$confirmModal.modal('hide');
		});
	} else {
		// Confirm Modal not Exist!
		var right = global.confirm(msg);
		if (right == true) {
			if (typeof (success) === "function") {
				success.call();
			}
		} else {
			if (typeof (error) === "function") {
				error.call();
			}
		}
	}
};


var autoForm = function(selector, formData) {
	this.self = this;
	// Target Container
	var $target = $(selector);
	
	var autoLine = function(){};
	autoLine.prototype.init = function(options){
		var options = options || {};
		// Default Config
		var defaults = {
			value: '',
			name: '',
			label: '',
			tag: '',
			type: '',
			placeholder: '',
			cssclass:''
		}
		
		this.opt = $.extend(defaults, options);
		this.tag = this.opt.tag;
		
		return this;
	}
	autoLine.prototype.buildHtml = function(){
		var htmlStr = '<div class="form-group zzrw_' + this.tag + '">';
		if (this.opt.hide) {
			htmlStr = '<div class="form-group zzrw_' + this.tag + '" style="display:none;">';
		}
		
		if (this.opt.labelClass){
			htmlStr += '<label class="lable_'+this.opt['labelClass']+'" for="' + this.opt['id'] + '">' + this.opt['label'] + '</label>';
		}else{
			htmlStr += '<label for="' + this.opt['id'] + '">' + this.opt['label'] + '</label>';
		}
		
		htmlStr += this.buildBody(this.tag);
		
		htmlStr += "</div>";
		return htmlStr;
	}
	autoLine.prototype.buildBody = function(tag){
		var method = tag + 'Build';
		if(this[method]){
			return this[method].apply(this,[this.opt]);
		}
		return "";
	}
	autoLine.prototype.inputBuild = function(formLine){
		var html = '<input id="' + formLine['id'] + '" name="'  
			+formLine['name'] + '" type="'  
			+formLine['type'] + '" class="form-control '  
			+formLine['cssclass']	+ '" value="'  
			+formLine['value'] + '" placeholder="'  
			+formLine['placeholder']+ '" />';
		
		if(formLine.tip != null ){
			var tip = formLine.tip;
			
			var text = '';
			if(typeof(tip) === 'string'){
				text = tip;
			} 
			if(tip.type == 'text'){
				text = tip.content;
			}
			var hrefValue = 'javascript:;';
			if(tip.href != null && tip.href != ''){
				hrefValue = tip.href;
			}
			
			html += '<a class="action tip" href="'+hrefValue+'">'+text+'</a>';
		}
		return html;
	}
	autoLine.prototype.fileBuild = function(formLine){
		var html = '<input id="' + formLine['id'] + '" name="'  
			+formLine['name'] + '" type="file" class="form-control '  
			+formLine['cssclass']	+ '" value="'  
			+formLine['value'] + '" placeholder="'  
			+formLine['placeholder']+ '" />';
		
		if(formLine.tip != null ){
			var tip = formLine.tip;
			
			var text = '';
			if(typeof(tip) === 'string'){
				text = tip;
			} 
			if(tip.type == 'text'){
				text = tip.content;
			}
			var hrefValue = 'javascript:;';
			if(tip.href != null && tip.href != ''){
				hrefValue = tip.href;
			}
			
			html += '<a class="action tip" href="'+hrefValue+'">'+text+'</a>';
		}
		return html;
	}
	autoLine.prototype.hiddenBuild = function(formLine){
		var html = '<input id="' + formLine['id'] + '" name="'
		+ formLine['name'] + '" type="hidden" value="'
		+ formLine['value'] + '" >';
		return html;
	}
	autoLine.prototype.displayBuild = function(formLine){
		var html = '<p id="' + formLine['id']
		+ '" class="form-control ' + formLine['cssclass']
		+ '">' + formLine['value'] + '</p>';
		return html;
	}
	autoLine.prototype.previewBuild = function(formLine){
		var html = '<p id="' + formLine['id']
		+ '" class="form-control ' + formLine['cssclass']
		+ '">' + formLine['value'] + '</p>';
		return html;
	}
	autoLine.prototype.labelBuild = function(formLine){
		var html = '';
		return html;
	}
	autoLine.prototype.textareaBuild = function(formLine){
		var html = '<textarea id="' + formLine['id'] + '" name="'
		+ formLine['name'] + '" class="form-control '
		+ formLine['cssclass'] + '" placeholder="'
		+ formLine['placeholder'] + '">'
		+ formLine['value'] + '</textarea>';
		return html;
	}
	autoLine.prototype.selectBuild = function(formLine){
		var html = '<select id="' + formLine['id']
		+ '" name="' + formLine['name']
		+ '" class="form-control '
		+ formLine['cssclass'] + '">';
		
		for (var i = 0, len = formLine.items.length; i < len; i++) {
			var formItem = formLine.items[i];
			if (formLine.value != null && formLine.value != '' && formLine.value == formItem.value) {
				html += '<option value="'+ formItem.value+ '" selected="selected" >'	+ formItem.name + '</option>';
			} else {
				html += '<option value="'+ formItem.value + '" >' + (formItem.name != null ? formItem.name : formItem.value) + '</option>';
			}
		}
		
		html += '</select><a class="action select" href="javascript:;"></a>';
		return html;
	}
	autoLine.prototype.checkboxBuild = function(formLine){
		var html = '<div>';
        for (var i = 0, len = formLine.items.length; i < len; i++) {
			var formItem = formLine.items[i];
			html += '<label class="checkbox-inline zzrw_checkbox ' + formLine['cssclass'] + '">';
			html += '<input type="checkbox" name="'+ formLine['name']+ '" id="'+ (formLine.id + i);
			
			if(formLine.value != null && formLine.value != '' && formLine.value.indexOf(formItem.value) >= 0){
				html += '" checked="checked" value="' + formItem.value + '" />' + (formItem.name != null ? formItem.name : formItem.value) + '<icon></icon></label>';
			}else{
				html += '" value="' + formItem.value + '" />' + (formItem.name != null ? formItem.name : formItem.value) + '<icon></icon></label>';
			}
		}

		html += '</div>';
		return html;
	}
	autoLine.prototype.radioBuild = function(formLine){
		var html = '';
		
		for (var i = 0, len = formLine.items.length; i < len; i++) {
			var formItem = formLine.items[i];
			if (i == 0) {
				html += '<label class="checkbox-inline zzrw_radio ' + formLine['cssclass'] + ' selected">'
				+ '<input type="radio" checked="checked" name="'+ formLine['name']+ '" id="'+ (formLine.id + i)
				+ '" value="' + formItem.value + '" />' + formItem.name + '<icon></icon></label>';
			}else{
				html += '<label class="checkbox-inline zzrw_radio ' + formLine['cssclass'] + '">'
				+ '<input type="radio" name="'+ formLine['name']+ '" id="'+ (formLine.id + i)
				+ '" value="' + formItem.value + '" />' + (formItem.name != null ? formItem.name : formItem.value) + '<icon></icon></label>';
			}
		}
		
		return html;
	}
	autoLine.prototype.areaBuild = function(formLine){
		var html = '<div class="form-control area">'
			+ '<div class="form-area"><select name="province" id="province"></select><a class="action select" href="javascript:;"></a></div>'
			+ '<div class="form-area"><select name="city" id="city"/></select><a class="action select" href="javascript:;"></a></div>'
			+ '<div class="form-area"><select name="county" id="area"/></select><a class="action select" href="javascript:;"></a></div>'
			+ '</div>';
		
		return html;
	}
	autoLine.prototype.UEditBuild = function(formLine){
		var html = '';
		if(window.UE){
			html = '<script id="'+formLine['id']+'" name="'+formLine['name']+'" type="text/plain" style="width: 100%; height: 300px;">'+formLine['value']+'</script>';
		}else{
			html = '<textarea id="'+formLine['id']+'" name="'+formLine['name']+'" class="form-control '+formLine['cssclass']+'" placeholder="'+formLine['placeholder']+'">'+formLine['value']+'</textarea>';
		}
		
		return html;
	}
	autoLine.prototype.dateBuild = function(formLine){
		var html = '<input id="' + formLine['id'] + '" name="'+ formLine['name']
		+ '" type="text" readonly class="form-control '
		+ formLine['cssclass'] + '" value="'
		+ formLine['value'] + '" placeholder="'
		+ formLine['placeholder'] + '" />';
		
		html += '<a id="'+ formLine['id']+ 'Action" class="action date" href="javascript:;"></a>';
		
		return html;
	}
	autoLine.prototype.randCodeBuild = function(formLine){
		var html = '<input id="' + formLine['id'] + '" name="'
		+ formLine['name']
		+ '" type="text" class="form-control randCode'
		+ formLine['cssclass'] + '" value="" placeholder="'
		+ formLine['placeholder'] + '" />';
		
		html += '<img id="rand' + formLine['id']
		+ '" class="form-image zzrw_randCode" src="'
		+ formLine.exts[0].value + '?t=' + Math.random()
		+ '" />';
		
		return html;
	}
	autoLine.prototype.smsCodeBuild = function(formLine){
		var html = '<input id="' + formLine['id'] + '" name="'
		+ formLine['name']
		+ '" type="text" class="form-control smsCode'
		+ formLine['cssclass'] + '" value="" placeholder="'
		+ formLine['placeholder'] + '" />';
		
		html += '<a id="btnSend' + formLine['id']
		+ '" class="action smsCode" data-target="'
		+ formLine['target']
		+ '" href="javascript:;">获取验证码</a>';
		
		html += '<input id="smsM' + formLine['id']
		+ '" name="mobileHide" type="hidden" />';
		
		return html;
	}
	
	if (formData.id && formData.id != '') {
		
		// Target Css
		$target.addClass('zzrw_form').addClass(formData['cssclass']);
		var formLineList = [];

		// form
		var $targetForm = $("#" + formData.id);
		var formExisted = true;
		if ($targetForm.length === 0) {
			$targetForm = $('<form id="' + formData.id + '"></form>');
			formExisted = false;
		}
		
		// form action & method
		if (formData.action != null && formData.action != '') {
			$targetForm.attr("action", formData.action);
		}
		if (formData.method != null && formData.method != '') {
			$targetForm.attr("method", formData.method);
		}
		
		// dom html
		var htmlStr = "";
		htmlStr += '<div class="form-inner">';
		for(var i=0,len = formData.formLines.length; i < len;i++){
			var line = new autoLine().init(formData.formLines[i]);
			htmlStr += line.buildHtml();
			
			formLineList.push(line);
		}
		htmlStr += '</div>';
		
		// 添加表单按钮
		if (formData.button) {
			htmlStr += '<div class="form-group zzrw_button">';
			if (formData.button == 'submit') {
				htmlStr += '<button id="btnSub'+ formData.id+ '" type="submit" class="btn btn-primary">提交</button>';

			} else if (formData.button == 'back') {
				htmlStr += '<button id="btnBack'+ formData.id+ '" type="button" class="btn btn-warning">返回</button>';
				htmlStr += '<button id="btnSub'	+ formData.id+ '" type="submit" class="btn btn-primary">提交</button>';
			}
			htmlStr += '</div>';
		}

		// 构成页面信息
		if (!formExisted) {
			$targetForm.html(htmlStr);
			$target.append($targetForm);
		}else{
			$target.html(htmlStr);
		}
		
		// radio 点击事件
		$("label.zzrw_radio", $target).click(function(e) {
			e = e || window.event;
			var elm = e.target || e.srcElement;
			if (elm.tagName == "INPUT") {
				$(this).siblings().removeClass('selected');
				$(this).addClass('selected');
			}
		});
		
		// checkbox 点击事件
		$("label.zzrw_checkbox", $target).click(function(e) {
			e = e || window.event;
			var elm = e.target || e.srcElement;
			if (elm.tagName == "INPUT") {
				$(this).toggleClass('selected');
			}
		});
		
		// 绑定返回按钮事件
		$("#btnBack" + formData.id).click(function() {
			var url = "javascript:history.go(-1);";
			window.location.href = url;
		});
		
		for (var i = 0; i < formLineList.length; i++) {
			var formLine = formLineList[i].opt;
			// 数据缓存值节点
			$("#" + formLine.id).data('line', formLineList[i]);
			// 添加exts属性值
			if (formLine.exts) {
				for (var j = 0; j < formLine.exts.length; j++) {
					if (formLine.id) {
						$("#" + formLine.id).attr(formLine.exts[j].name,
								formLine.exts[j].value);
					}
				}
			}
		}

		// 初始化日期控件
		if (window.WdatePicker) {
			for (i = 0; i < formData.formLines.length; i++) {
				var formLine = formData.formLines[i];
				if (formLine.tag == 'date') {
					if (formLine.id) {
						$("#" + formLine.id + "Action").hide();
						$("#" + formLine.id).removeAttr('readonly');
						$("#" + formLine.id)
								.attr('onclick','WdatePicker('+ (formLine['timepicker'].config || '')+ ')');
					}
				}
			}
		} else if ($.fn.datetimepicker) {
			for (i = 0; i < formData.formLines.length; i++) {
				var formLine = formData.formLines[i];
				if (formLine.tag == 'date') {
					if (formLine.id) {
						var modalHtml = '<div id="'+ formLine.id+ 'PickerModal" class="zzrw_date modal fade" aria-hidden="true">';
						modalHtml += '<div class="modal-dialog"><div class="modal-content">';
						modalHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">时间选择器</h4></div>';
						modalHtml += '<div class="modal-body"><div id="'
								+ formLine.id + 'Picker"></div></div>';
						modalHtml += '</div><!-- /.modal-content --></div><!-- /.modal-dialog --></div><!-- /.modal -->';

						$targetForm.append(modalHtml);
						$("#" + formLine.id + "Action").attr('data-toggle','modal').attr('data-target','#' + formLine.id + 'PickerModal');
						$("#" + formLine.id + "Picker").datetimepicker(formLine['timepicker']).on(
								'changeDate',
								function(ev) {
									var value = $(this).data('date');

									var id = $(this).attr('id');

									$("#" + id.replace('Picker', '')).val(
											value);
									$("#" + id + 'Modal').modal('hide');
								});

						/*
						 * 移动端不适用此种方式
						 * $("#"+formLine.id).datetimepicker(formLine['timepicker']).on('changeDate',
						 * function(ev){ var value = $(this).data('date');
						 * $("#"+formLine.id).val(value); });
						 */
					}
				}
			}
		} else {
			for (var i = 0; i < formData.formLines.length; i++) {
				var formLine = formData.formLines[i];
				if (formLine.tag == 'date') {
					if (formLine.id) {
						$("#" + formLine.id).removeAttr('readonly');
					}
				}
			}
		}

		// 初始化UEdit控件
		if (window.UE) {
			for (var i = 0; i < formData.formLines.length; i++) {
				var formLine = formData.formLines[i];
				if (formLine.tag == 'UEdit') {
					if (formLine.id) {
						var ue = UE.getEditor(formLine.id);
					}
				}
			}
		}

		// 初始化地址控件
		if (window.Location && window.Location.provinceList
				&& Location.provinceList.length > 0) {
			initLocationSelect();
		}
		
		// 短信验证码对象
		var smsCallback = function(){};
		smsCallback.prototype.init = function(id, smsUrl){
			this.id = id
			this.smsUrl = smsUrl;
			this.codeSend = {
				sending : false,
				time : 0,
				timer : null
			}
			
			return this;
		};
		
		smsCallback.prototype.send = function(btnSendId, smsUrl) {
			var smsBtn = $(this.id);
			if (!smsBtn.hasClass('active')) {
				var target = smsBtn.attr('data-target');

				if (target != "undefined" && target != "") {
					var mobile = $('input[name="' + target + '"]').val();
					if (/^\d{11}$/.test(target)) {
						mobile = target;
					}

					if (mobile == null || mobile == ""|| mobile.trim() == "") {
						alert("请输入手机号");
						return null;
					}

					if (!/^\d{11}$/.test(mobile)) {
						alert('手机号码格式错误');
						return null;
					}

					// 设置提交的手机号码
					$(this.id.replace('btnSend', 'smsM')).val(mobile);
					$(this.id).addClass('active');
					this.getCode(mobile, 90);
				} else {
					alert("未配置手机号输入input");
				}
			}
		};
			
		smsCallback.prototype.getCode = function(mobile, interval) {
			var smsBtn = $(this.id);
			var self = this;
			
			if (!self.codeSend.sending) {
				self.codeSend.sending = true;
				self.codeSend.time = interval;
				// 请求发送验证码
				$.ajax({
					url : self.smsUrl,
					type : 'POST',
					dataType : 'json',
					data : {
						'mobile' : mobile
					},
					success : function(data) {
						if (data.result == "1") {
							alert("业务异常，请稍后重试。");
							clearInterval(self.codeSend.timer);
							self.codeSend.time = 0;
							self.codeSend.sending = false;
							smsBtn.text('获取验证码').removeClass('active');
						}else if(data.result == "Z"){
							alert("系统异常，请稍后重试。");
							clearInterval(self.codeSend.timer);
							self.codeSend.time = 0;
							self.codeSend.sending = false;
							smsBtn.text('获取验证码').removeClass('active');
						}else if(data.result == "overThreshold"){
							alert("今日获取验证码次数超出限制，请明日再来！");
							clearInterval(self.codeSend.timer);
							self.codeSend.time = 0;
							self.codeSend.sending = false;
							smsBtn.text('获取验证码').removeClass('active');
						}
					}
				})

				this.getCode();
				this.codeSend.timer = setInterval(function() {
					self.getCode();
				}, 1000);
			} else {
				self.codeSend.time -= 1;
				if (self.codeSend.time > 0) {

					smsBtn.text('[' + this.codeSend.time + ']秒后重试');
				} else {

					smsBtn.text('获取验证码').removeClass('active');
					clearInterval(this.codeSend.timer);
					self.codeSend.sending = false;
				}
			}
		}

		// 初始化验证码控件
		for (i = 0; i < formData.formLines.length; i++) {
			var formLine = formData.formLines[i];
			if (formLine.tag == 'randCode') {
				if (formLine.id) {
					$("#rand" + formLine.id).click(function() {
						var id = $(this).attr('id').replace('rand','');
						var exts = $("#"+id).data('line').opt.exts;
						$(this).attr('src',exts[0].value + "?t="+ Math.random());
					});
				}
			} else if (formLine.tag == 'smsCode') {
				if (formLine.id) {
					var btnSendId = "#btnSend" + formLine.id;
					var smsUrl = formLine.exts[0].value;

					var smsAction = new smsCallback().init(btnSendId, smsUrl);
					$(btnSendId).click(function(){
						smsAction.send();
					});
				}
			}
		}

		// ie placeholder
		if ($.fn.placeholder) {
			$(':input[placeholder]').placeholder();
		}
		
		// 初始化collapse表格属性
		if ($.collapse) {
			$(".collapse", $target).collapse();
		}
		
		// 绑定formValidate验证
		if ($.formValidator) {
			var validate = formData.validate;
			validate.formID = formData.id;
			// 初始化formValidate
			$.formValidator.initConfig(validate);

			for (var i = 0; i < formData.formLines.length; i++) {
				var formLine = formData.formLines[i];

				if(formLine['id'] != null && formLine['id'] != ''){
					var $formLine = $("#" + formLine['id'], $target);
					if (formLine.input != null || formLine.regex != null) {

						if (formLine.input != null && formLine.regex != null) {
							$formLine.formValidator(formLine['validate'])
									.inputValidator(formLine['input'])
									.regexValidator(formLine['regex']);
						} else {
							// 输入验证
							if (formLine.input != null) {
								$formLine.formValidator(formLine['validate'])
										.inputValidator(formLine['input']);
							}
							// 正则验证
							if (formLine.regex != null) {
								$formLine.formValidator(formLine['validate'])
										.regexValidator(formLine['regex']);
							}
						}
					}
				}
			}
		}
	}
};
	
var ZZRW = {
	version : "1.2.0",
	alert : alert,
	load: load,
	confirm : confirm,
	log : log,
	createForm: autoForm
};

// 注册window对象
global.zzrw = ZZRW;

})(window, jQuery);