/**
 *
 * ATE - Ad Template Engine
 * https://github.com/jsaddict - Gopi M
 * 
 */
var adFormatter = (function(){
	// check inbuilt functionalities - begin
	Number.isInteger = Number.isInteger || function(value) { return typeof value === "number" && isFinite(value) && Math.floor(value) === value; };
	if(!Array.isArray) {
		Array.isArray = function(arg) { return Object.prototype.toString.call(arg) === '[object Array]'; };
	}
	// check inbuilt functionalities - end
	var afConfig = {
		classes : {
			element : {
				element : 'custom-element',
				text : 'text-element',
				image : 'image-element',
				container : 'container-element',
				group : 'group-element',
				rowBreak : 'row-break',
				columnBreak : 'column-break'
			},
			prefix : {
				elements : 'el-',
				colorCombos : 'cc-'
			}	
		},
		applicableStyles : {
			text : [
				'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
				'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
				'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
				'font-size', 'font-weight', 'font-family', 'font-style'
			],
			image : [
				'width', 'height',
				'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
				'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'
			],
			container : [
				'width', 'height',
				'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
				'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
				'font-size', 'font-weight', 'font-family', 'font-style'
			]
		},
		validElements : ['heading', 'subheading', 'content', 'icon', 'image', 'logo', 'container'],
		validColorCombos : ['primary', 'secondary', 'heading', 'subheading', 'content'],
		validStyles : {
			'dimensions' : {
				'all' : [15, 800],
				'container' : [15, 800],
				'group' : [15, 800],
				'icon' : [15, 50],
				'logo' : [15, 200],
				'image' : [15, 800]
			},
			'margin' : [0, 40],
			'padding' : [0, 40],
			'border' : [0, 5],
			'flex-direction' : ['row', 'column'],
			'justify-content' : ['center', 'flex-start', 'flex-end', 'space-between', 'space-around'],
			'align-content' : ['center', 'flex-start', 'flex-end', 'space-between', 'space-around'],
			'font-size' : [10, 40],
			'font-weight' : [100, 700],
			'font-style' : ['normal', 'italic', 'oblique']
		},
		validDataLengths : {
			url : 2000,
			heading : 500,
			content : 5000
		},
		// minColorDifference : 60,
		minColorDifference : 20,
		DOM : {
			cssStyles : 'af-css-styles',
			afAd : 'af-ad'
		},
		data : {
			adId : null,
			adData : {},
			adUrl : null,
			subAdData : {},
			subAdUrl : {}
		},
		/*
		elementObj : {
			cmpl : {
				group : { styles : '', classes : ''},
				element : {styles : '', classes : ''}
			},
			element : '',
			data : '',
			styles : {},
			body : []
		}
		*/
	};
	var templateDefaults = {
		styles : {},
		groups : {},
		elements : {}
	};
	/*var adDetails = {
		view : {
			background : 'light',
			group : 'row',
			type : 'carousal',
			adElement : null,
			dimensions : null,
		},
		advertiser : null,
		provider : null
	},*/
	var DOM = {
		columnBreak : '<div class="'+afConfig.classes.element.columnBreak+'"></div>\n',
		rowBreak : '<div class="'+afConfig.classes.element.rowBreak+'"></div>\n'
	}
	var util = {
		isObject : function(obj){
			if(typeof obj === "object" && !Array.isArray(obj) && obj !== null){
				return true;
			};
			return false;
		},
		isDefined : function(val){
			if(typeof(val) === 'undefined'){
				return false;
			};
			return true;
		},
		isArray : function(arr){
			return Array.isArray(arr);
		},
		isInteger : function(num){
			return Number.isInteger(num);
		},
		isString : function(str){
			return (typeof(str) === 'string');
		},
		isURL : function(str) {
		    var urlRegex =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
			if (!urlRegex.test(str)){
				return false;
			}else{
				return true;
			}
		},
		cloneObj : function(obj){
			return JSON.parse(JSON.stringify(obj));;
		},
		extendObj : function(target, source) {
		    if(!util.isObject(target)){
		        target = {};
		    }
		    if(!util.isObject(source)){
		        source = {};
		    }
		    var clonedTarget = util.extend({}, target);
		    var extended = util.extend(clonedTarget, source)
		    return extended;
		},
		extend : function(target, source) {
		    target = target || {};
		    for (var prop in source) {
		        if (util.isObject(source[prop])) {
		            if (source[prop] instanceof Array) {
		                target[prop] = source[prop].slice()
		            } else {
		            	target[prop] = {};
		                if(Object.keys(source[prop]).length !== 0){
		                    target[prop] = util.extend(target[prop], source[prop]);
		                }
		            }
		        } else {
		            target[prop] = source[prop];
		        }
		    }
		    return target;
		},
		isDataKey : function(key, keyPath, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			if(util.isString(key)){
				if(key.match("^[a-zA-Z0-9]+$") && key.length <=100 && key != 'ad' && key != 'subAd'){
					/*if(keyPath){
						var kp = keyPath+'.'+key;
						if(dataKeys.indexOf(kp) == -1){
							dataKeys.push(kp);
							result.data = dataKey;
							result.status = 'success';
							return result;
						}else{
							result.message = "'data' key '"+dataKey+"' is already defined";
							if(path){
								result.message = result.message+' : '+path;
							}
							return result;
						}
					}*/
					result.data = key;
					result.status = 'success';
					return result;
				}else{
					result.message = "'data' key '"+key+"' should be an alphanumeric String and should not be 'ad' or 'subAd'. Max length is 100";
					if(path){
						result.message = result.message+' : '+path;
					}
					return result;
				}
			}else{
				result.message = "'data' key should be a String";
				if(path){
					result.message = result.message+' : '+path;
				}
				return result;
			}
		},
		isColor : function(color, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			if(util.isArray(color) && color.length == 3){
				var clr = null;
				for(var i=0; i<3; i++){
					clr = color[i];
					if(!util.isInteger(clr) || clr<0 || clr>255){
						result.message = 'color should be an Array of R, G and B values with range 0 to 255 : '+path;
						return result;
					}
				}
				result.status = 'success';
				result.data = color;
				return result;
			}else{
				result.message = 'color should be an Array of R, G and B values with range 0 to 255 : '+path;
				return result;
			}
		}
	};
	var styleOperations = {
		getDimensions : function (styles, element, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var cssStyles = {};
			if(util.isDefined(styles.dimensions)){
				var dimensions = styles.dimensions;
				var dimensionsArray = [];
				if(dimensions !== null && dimensions !== 'auto'){
					if((util.isArray(dimensions) && dimensions.length == 2)|| util.isInteger(dimensions)){
						var validDimensions = afConfig.validStyles.dimensions.all;
						if(element){
							validDimensions = afConfig.validStyles.dimensions[element];
						}
						if(util.isInteger(dimensions)){
							dimensions = [dimensions, dimensions];
						}
						for(var i=0; i<2; i++){
							var dimension = dimensions[i];
							if(util.isInteger(dimension) && (dimension >= validDimensions[0] && dimension <= validDimensions[1])){
								dimensionsArray[i] = dimension+'px';
							}else{
								result.message = "dimensions 'width' or 'height' should be more than "+validDimensions[0]+" and less than "+validDimensions[1];
								if(path){
									result.message = result.message + ' : '+path;
								}
								return result;
							}
						}
					}else{
						result.message = "'dimensions' should be either an Integer or an Array of Integers with lenght 2";
						if(path){
							result.message = result.message + ' : '+path;
						}
						return result;
					}
				}else{
					dimensionsArray = [null, null];
				}
				cssStyles['width'] = dimensionsArray[0];
				cssStyles['height'] = dimensionsArray[1];
			}
			result.status = 'success';
			result.data = cssStyles;
			return result;
		},
		getMargin : function(styles, element, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var cssStyles = {};
			if(util.isDefined(styles.margin)){
				var margin = styles.margin;
				var marginArray = [];
				if(margin !== null && margin !== 'auto'){
					if((util.isArray(margin) && (margin.length == 2 || margin.length ==4))|| util.isInteger(margin)){
						var validMargin = afConfig.validStyles.margin;
						if(util.isInteger(margin)){
							marginArray = [margin, margin, margin, margin];
						}else{
							if(margin.length == 2){
								marginArray = [margin[0], margin[1], margin[0], margin[1]]
							}
						}
						for(var i=0; i<4; i++){
							var mg = marginArray[i];
							if(util.isInteger(mg) && (mg >= validMargin[0] && mg <= validMargin[1])){
								marginArray[i] = mg+'px';
							}else{
								result.message = "'margin' should be more than "+validMargin[0]+" and less than "+validMargin[1];
								if(path){
									result.message = result.message + ' : '+path;
								}
								return result;
							}
						}
					}else{
						result.message = "'margin' should be either an Integer or an Array of Integers with lenght 2 or 4";
						if(path){
							result.message = result.message + ' : '+path;
						}
						return result;
					}
				}else{
					marginArray = [null, null, null, null]
				}
				cssStyles['margin-top'] = marginArray[0];
				cssStyles['margin-right'] = marginArray[1];
				cssStyles['margin-bottom'] = marginArray[2];
				cssStyles['margin-left'] = marginArray[3];
			}
			result.status = 'success';
			result.data = cssStyles;
			return result;
		},
		getPadding : function(styles, element, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var cssStyles = {};
			if(util.isDefined(styles.padding)){
				var padding = styles.padding;
				var paddingArray = [];
				if(padding !== null && padding !== 'auto'){
					if((util.isArray(padding) && (padding.length == 2 || padding.length ==4))|| util.isInteger(padding)){
						var validPadding = afConfig.validStyles.padding;
						if(util.isInteger(padding)){
							paddingArray = [padding, padding, padding, padding];
						}else{
							if(padding.length == 2){
								paddingArray = [padding[0], padding[1], padding[0], padding[1]]
							}
						}
						for(var i=0; i<4; i++){
							var pd = paddingArray[i];
							if(util.isInteger(pd) && (pd >= validPadding[0] && pd <= validPadding[1])){
								paddingArray[i] = pd+'px';
							}else{
								result.message = "'padding' should be more than "+validPadding[0]+" and less than "+validPadding[1];
								if(path){
									result.message = result.message + ' : '+path;
								}
								return result;
							}
						}
					}else{
						result.message = "'padding' should be either an Integer or an Array of Integers with lenght 2 or 4";
						if(path){
							result.message = result.message + ' : '+path;
						}
						return result;
					}
				}else{
					paddingArray = [null, null, null, null];
				}
				cssStyles['padding-top'] = paddingArray[0];
				cssStyles['padding-right'] = paddingArray[1];
				cssStyles['padding-bottom'] = paddingArray[2];
				cssStyles['padding-left'] = paddingArray[3];
			}
			result.status = 'success';
			result.data = cssStyles;
			return result;
		},
		getBorder : function(styles, element, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var cssStyles = {};
			if(util.isDefined(styles.border)){
				var border = styles.border;
				var borderArray = border;
				if(border !== null && border !== 'auto'){
					if((util.isArray(border) && (border.length == 2 || border.length ==4))|| util.isInteger(border)){
						var validBorder = afConfig.validStyles.border;
						if(util.isInteger(border)){
							borderArray = [border, border, border, border];
						}else{
							if(border.length == 2){
								borderArray = [border[0], border[1], border[0], border[1]]
							}
						}
						for(var i=0; i<4; i++){
							var bd = borderArray[i];
							if(util.isInteger(bd) && (bd >= validBorder[0] && bd <= validBorder[1])){
								borderArray[i] = bd+'px';
							}else{
								result.message = "'border' should be more than "+validBorder[0]+" and less than "+validBorder[1];
								if(path){
									result.message = result.message + ' : '+path;
								}
								return result;
							}
						}
					}else{
						result.message = "'border' should be either an Integer or an Array of Integers with lenght 2 or 4";
						if(path){
							result.message = result.message + ' : '+path;
						}
						return result;
					}
				}else{
					borderArray = [null, null, null, null];
				}
				cssStyles['border-top-width'] = borderArray[0];
				cssStyles['border-right-width'] = borderArray[1];
				cssStyles['border-bottom-width'] = borderArray[2];
				cssStyles['border-left-width'] = borderArray[3];
			}
			result.status = 'success';
			result.data = cssStyles;
			return result;
		},
		getFont : function (styles, element, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var cssStyles = {};
			if(util.isDefined(styles.font)){
				var font = styles.font;
				if(font === null){
					font = [null, null, null, null]
				}
				if(util.isArray(font)){
					var fontStyles = ['font-size', 'font-style', 'font-weight', 'font-family'];
					var validStyles = afConfig.validStyles;
					if(util.isDefined(font[0])){
						var fontSize = font[0];
						if(fontSize !== null && fontSize !== 'auto'){
							if(!util.isInteger(fontSize)){
								result.message = "'font-size', should be an Integer";
								if(path){
									result.message = result.message + ' : '+path+'.font[0]';
								}
								return result;
							}
							var validFontSize = validStyles['font-size'];
							if(fontSize < validFontSize[0] || fontSize > validFontSize[1]){
								result.message = "'font-size' should be more than "+validFontSize[0]+" and less than "+validFontSize[1];
								if(path){
									result.message = result.message + ' : '+path+'.font[0]';
								}
								return result;
							}
							cssStyles['font-size'] = fontSize+'px';
						}else{
							cssStyles['font-size'] = null;
						}
					}
					if(util.isDefined(font[1])){
						var fontStyle = font[1];
						if(fontStyle !== null && fontStyle !== 'auto'){
							if(!util.isString(fontStyle)){
								result.message = "'font-style' should be a String";
								if(path){
									result.message = result.message + ' : '+path+'.font[1]';
								}
								return result;
							}
							var validFontStyles = validStyles['font-style'];
							if(validFontStyles.indexOf(fontStyle) == -1){
								result.message = "'font-style' is invalid";
								if(path){
									result.message = result.message + ' : '+path+'.font[1]';
								}
								return result;
							}
							cssStyles['font-style'] = fontStyle;
						}else{
							cssStyles['font-style'] = null;
						}
					}
					if(util.isDefined(font[2])){
						var fontWeight = font[2];
						if(fontWeight !== null && fontWeight !== 'auto'){
							if(!util.isInteger(fontWeight)){
								result.message = "'font-weight', should be an Integer";
								if(path){
									result.message = result.message + ' : '+path+'.font[2]';
								}
								return result;
							}
							var validFontWeight = validStyles['font-weight'];
							if(fontWeight < validFontWeight[0] || fontWeight > validFontWeight[1]){
								result.message = "'font-weight' should be more than "+validFontWeight[0]+" and less than "+validFontWeight[1];
								if(path){
									result.message = result.message + ' : '+path+'.font[2]';
								}
								return result;
							}
							cssStyles['font-weight'] = fontWeight;
						}else{
							cssStyles['font-weight'] = null;
						}
					}
					if(util.isDefined(font[3])){
						var fontFamily = font[3];
						if(fontFamily !== null && fontFamily !== 'auto'){
							if(!util.isString(fontFamily)){
								result.message = "'font-family' should be a String";
								if(path){
									result.message = result.message + ' : '+path+'.font[3]';
								}
								return result;
							}
							cssStyles['font-family'] = fontFamily;
						}else{
							cssStyles['font-family'] = null;
						}
					}
					result.status = 'success';
					result.data = cssStyles;
					return result;
				}else{
					result.message = "'font' should be an Array ";
					if(path){
						result.message = result.message + ' : '+path;
					}
					return result;
				}
			}
			result.status = 'success';
			result.data = cssStyles;
			return result;
		},
		getFlow : function(styles, element, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var cssStyles = {};
			if(util.isDefined(styles.flow)){
				var flow = styles.flow;
				if(flow == null){
					flow = [null, null, null]
				}
				if(util.isArray(flow)){
					var flowStyles = ['flex-direction', 'justify-content', 'align-content'];
					var validStyles = afConfig.validStyles;
					for(var i=0; i<flow.length; i++){
						var flowStyle = flowStyles[i];
						if(flow[i] === 'auto'){
							continue;
						}
						if(flow[i] === null){
							cssStyles[flowStyle] = null;
						}else{
							if(validStyles[flowStyle].indexOf(flow[i]) != -1){
								cssStyles[flowStyle] = flow[i];
							}else{
								result.message = "'"+flowStyle+"', '"+flow[i]+"' is not valid ";
								if(path){
									result.message = result.message + ' : '+path+'.flow['+i+']';
								}
								return result;
							}
						}
					}
					result.status = 'success';
					result.data = cssStyles;
					return result;
				}else{
					result.message = "'flow' should be an Array with values for 'flex-direction', 'justify-content' and 'align-content'";
					if(path){
						result.message = result.message + ' : '+path;
					}
					return result;
				}
			}
			result.status = 'success';
			result.data = cssStyles;
			return result;
		},
		getFormattedStyles : function(styles, element, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			var cssStyles = {};
			var getStyles = ['getDimensions', 'getPadding', 'getMargin', 'getFont', 'getFlow', 'getBorder'];
			switch (element) {
				case "container":
					getStyles = ['getDimensions', 'getMargin', 'getFont', 'getFlow', 'getBorder'];
					break;
				case "heading":
				case "subheading":
				case "content":
					getStyles = ['getPadding', 'getMargin', 'getFont', 'getBorder'];
				    break;
				case "icon":
				case "logo":
				case "image":
					getStyles = ['getDimensions', 'getMargin', 'getBorder'];
				    break;
			}
			for(var i=0; i<getStyles.length; i++){
				var cssResult = styleOperations[getStyles[i]].call(null, styles, element, path)
				if(cssResult.status === 'error'){
					return cssResult;
				}
				var css = cssResult.data;
				for(var key in css){
					cssStyles[key] = css[key];
				}
			}
			var otherStyles = {};
			if(styles.color){
				var combo = styles.color;
				if(afConfig.validColorCombos.indexOf(combo) == -1){
					result.message = "colorCombo '"+combo+"' is not valid ";
					if(path){
						result.message = result.message+' : '+path;
					}
					return result;
				}
				otherStyles.color = afConfig.classes.prefix.colorCombos+combo;
			}
			if(styles.flowBreak){
				var flowBreak = styles.flowBreak;
				if(util.isInteger(flowBreak) || util.isArray(flowBreak)){
					if(util.isArray(flowBreak)){
						var fb = [];
						for(var j=0; j<flowBreak.length; j++){
							if(!util.isInteger(flowBreak[j])){
								result.message = "'flowBreak' can be an Array of Integers or an Integer";
								if(path){
									result.message = result.message+' : '+path;
								}
								return result;
							}
							fb.push(flowBreak[j]);
						}
						otherStyles.flowBreak = fb;
					}else{
						otherStyles.flowBreak = flowBreak;
					}	
				}else{
					result.message = "'flowBreak' can be an Array of Integers or an Integer";
					if(path){
						result.message = result.message+' : '+path;
					}
					return result;
				}
			}
			result.status = 'success';
			result.data = {
				css : cssStyles,
				other : otherStyles
			};
			return result;
		}
	}
	var dataOperations = {
		// UPDATE_subAdData : function(edata, path){
		updateSubAdData : function(eData, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var afData = afConfig.data;
			if(eData.subAd){
				if(util.isObject(eData.subAd)){
					var subAd = eData.subAd;
					if(subAd.id){
						if(afData.subAdData[subAd.id]){
							result.message = "subAd 'id', '"+subAd.id+"' is already defined : "+path+".subAd";
							return result;
						}else{
							afData.subAdData[subAd.id] = {};
							if(subAd.url){
								var url = subAd.url;
								if(util.isString(url) && util.isURL(url)){
									afData.subAdUrl[subAd.id] = url;
								}else{
									result.message = "subAd 'url' is not an URL : "+path+".subAd";
									return result
								}
							}
							if(subAd.data){
								if(util.isObject(subAd.data)){
									var subAdData = subAd.data;
									var keyData = null;
									for(var key in subAdData){
										keyData = dataOperations.getDataObject(subAdData[key], path+".subAd.data."+key, key);
										if(keyData.status == 'success'){
											/**
											 * extendAdSubAdData -> if data in subAdData -> its final.
											 * no need to look for adData again
											 */
											afData.subAdData[subAd.id][key] = dataOperations.extendAdSubAdData(keyData.data, subAd.id);
										}else{
											return keyData;
										}
									}
								}else{
									result.message = "subAd 'data' is not an Object : "+path+".subAd";
									return result
								}
							}
						}
						result.status = 'success';
						result.data = {
							id : subAd.id
						}
						return result;
					}else{
						result.message = "subAd 'id' is not defined : "+path+".subAd";
						return result
					}
				}else{
					result.message = "'subAd' is not an Object : "+path;
					return result
				}
			}else{
				result.message = "'subAd' is not defined : "+path;
				return result
			}
		},
		getElementData : function(eData, dataKey, element, path, link, subAdId){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			if(util.isDefined(eData)){
				if(!util.isObject(eData) && !util.isString(eData)){
					result.message = "data '"+dataKey+"' is neither an object nor a string : "+path;
					return result;
				}
				if(util.isString(eData)){
					eData = {
						content : eData
					}
				}
				if(eData.content && eData.url){
					return dataOperations.validateElementData(eData, dataKey, element, link, path, true);
				}
				if(link == false){
					if(eData.content){
						if(!eData.url){
							eData.url = null;
						}
						return dataOperations.validateElementData(eData, dataKey, element, link, path, true);
					}
				}
				var defaultData = dataOperations.getDefaultData(dataKey, subAdId);
				if(!eData.content){
					eData.content = defaultData.content;
				}
				if(!eData.url){
					eData.url = defaultData.url;
				}
				return dataOperations.validateElementData(eData, dataKey, element, link, path, true);
			}else{
				return dataOperations.validateElementData(dataOperations.getDefaultData(dataKey, subAdId), dataKey, element, link, path, false);
			}
		},
		getDefaultData : function(key, subAdId){
			var adData = {
				'content' : null,
				'url' : afConfig.data.adUrl
			}
			if(afConfig.data.subAdData[subAdId] && afConfig.data.subAdData[subAdId][key]){
				return subAdData[subAdId][key];
			}
			if(afConfig.data.adData[key]){
				var defaultAdKeyData = afConfig.data.adData[key];
				if(defaultAdKeyData.content){
					adData.content = defaultAdKeyData.content;
				}
				if(defaultAdKeyData.url){
					adData.url = defaultAdKeyData.url;
				}
			}
			if(afConfig.data.subAdUrl[subAdId]){
				adData.url = afConfig.data.subAdUrl[subAdId]
			}
			if(subAdId == null){
				return adData;
			}
			return adData;
		},
		extendAdSubAdData : function(data, subAdId){
			var subAdData = {
				content : null,
				url : null
			}
			if(data.url){
				subAdData.url = data.url;
			}else
			if(afConfig.data.subAdUrl[subAdId]){
				subAdData.url = afConfig.data.subAdUrl[subAdId];
			}else{
				subAdData.url = adUrl;
			}
			
			if(data.content){
				subAdData.content = data.content;
			}else{
				subAdData.url = null;
			}
			return subAdData;
		},
		validateElementData : function(data, dataKey, element, link, path, isKeyDefined){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			var elementData = {
				url : null,
				content : null
			};
			if(!isKeyDefined){
				if(
					(link == true && (data.content == null || data.url == null)) || 
					(link == false && (data.content == null)) 
				){
					result.message = "'data', '"+dataKey+"' is not defined : "+path;
					return result;
				}
			}
			var contentType = null; // text/url
			var maxChar = null;
			switch (element) {
				case "heading":
				case "subheading":
					contentType = 'text';
					maxChar = afConfig.validDataLengths.heading;
				    break;
				case "content":
					contentType = 'text';
					maxChar = afConfig.validDataLengths.content;
				    break;
				case "icon":
				case "logo":
				case "image":
					contentType = 'url';
					maxChar = afConfig.validDataLengths.url;
				    break;
			}
			if(util.isString(data.content)){
				var dataContent = data.content;
				if(contentType == 'url'){
					if(util.isURL(dataContent)){
						elementData.content = dataContent;
					}else{
						result.message = "'content' is not an URL : "+path;
						return result;
					}
				}else{
					if(util.isString(dataContent) && dataContent.length <= maxChar){
						elementData.content = dataContent;
					}else{
						result.message = "'content' should be less than '"+maxChar+"' characters : "+path;
						return result;
					}
				}
			}else{
				result.message = "'content' is not a string : "+path;
				return result;
			}
			if(link == true){
				var dataUrl = data.url;
				if(util.isURL(dataUrl)){
					elementData.url = dataUrl;
				}else{
					result.message = "'url' is not an URL : "+path;
					return result;
				}
			}
			result.data = elementData;
			result.status = 'success';
			return result;
		},
		getDataObject : function(data, path, key){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			var eData = {
				url : null,
				content : null
			};
			if(util.isObject(data) || util.isString(data)){
				if(util.isObject(data)){
					if(data.url){
						if(util.isURL(data.url)){
							eData.url = data.url;
						}else{
							result.message = "url should be a String : "+path+'.'+key;
							return result;
						}
					}
					if(data.content){
						if(util.isString(data.content)){
							eData.content = data.content;
						}else{
							result.message = "content should be a String : "+path+'.'+key;
							return result;
						}
					}
				}
				if(util.isString(data)){
					eData.content = data;
				}
				result.status = 'success';
				result.data = eData;
				return result;
			}else{
				result.message = "data should be either an Object or a String : "+path+'.'+key;
				return result;
			}
		}
	}
	var colorOperations = {
		getLAB : function(rgbArray) {
		    var r, g, b, x, y, z;
		    r = rgbArray[0] / 255;
		    g = rgbArray[1] / 255;
		    b = rgbArray[2] / 255;
		    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
		    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
		    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
		    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
		    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
		    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
		    x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
		    y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
		    z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
		    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
		},
		getDeltaE : function(lab1, lab2) {
		    var dL = lab1[0] - lab2[0];
		    var dA = lab1[1] - lab2[1];
		    var dB = lab1[2] - lab2[2];
		    var c1 = Math.sqrt(lab1[1] * lab1[1] + lab1[2] * lab1[2]);
		    var c2 = Math.sqrt(lab2[1] * lab2[1] + lab2[2] * lab2[2]);
		    var dC = c1 - c2;
		    var dH = dA * dA + dB * dB - (dC * dC);
		    dH = dH < 0 ? 0 : Math.sqrt(dH);
		    var sl = 1.0;
		    var kl = kc = kh = 1;
		    var sc = 1.0 + 0.045 * c1;
		    var sh = 1.0 + 0.015 * c1;
		    var dLksL = dL / sl;
		    var dCksC = dC / sc;
		    var dHksH = dH / sh;
		    var dE = dLksL * dLksL + dCksC * dCksC + dHksH * dHksH;
		    dE = dE < 0 ? 0 : Math.sqrt(dE);
		    return dE;
		},
		getColorDifference : function(color1, color2){
			var lab1 = colorOperations.getLAB(color1);
			var lab2 = colorOperations.getLAB(color2);
			var dE = colorOperations.getDeltaE(lab1, lab2);
			return parseInt(dE, 10);
		}
	}

	var templateOperations = {
		getResetCSS : function(styles, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			var cssText = '';
			var elPrefix = afConfig.classes.prefix.elements;
			var validElements = afConfig.validElements;
			var getStyles = null;
			for(var element in styles){
				if(validElements.indexOf(element) != -1){
					switch (element) {
						case "container":
							getStyles = ['getPadding', 'getMargin', 'getFont', 'getFlow'];
							break;
						case "heading":
						case "subheading":
						case "content":
							getStyles = ['getPadding', 'getMargin', 'getFont'];
						    break;
						case "icon":
						case "logo":
						case "image":
							getStyles = ['getDimensions', 'getMargin'];
						    break;
					}
					cssText = cssText + '.'+elPrefix+element+'{\n';
					for(var i=0; i<getStyles.length; i++){
						var cssResult = styleOperations[getStyles[i]].call(null, styles[element], element, path)
						if(cssResult.status === 'error'){
							return cssResult;
						}
						var css = cssResult.data;
						for(var key in css){
							if(css[key] !== null){
								cssText = cssText + key + ' : '+ css[key]+';\n';
							}
						}
					}
					cssText = cssText + '}\n';
				}
			}
			result.status = 'success';
			result.data = cssText;
			return result;
		},
		attachElementStyles : function(paintData){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			var publisherConfig = paintData.publisher;
			var advertiserData = paintData.advertiser;
			// var adElement = paintData.adElement;

			var cssString = '';
			var colorCombos = null;
			var colorCombosPath = null;
			// resetStyles
			if(advertiserData.resetStyles){
				var elStyles = advertiserData.resetStyles;
				if(!util.isObject(elStyles)){
					result.message = "'resetStyles' is not an Object";
					return result;
				};
				var resetCSS = templateOperations.getResetCSS(elStyles, 'resetStyles');
				if(resetCSS.status === 'error'){
					return resetCSS;
				}
				cssString = cssString + resetCSS.data;
			}
			// color combos - give priority to publisher
			// if any error - don't throw, it will use default colors
			// getColorComboStyles
			if(advertiserData.colorCombos){
				colorCombos = advertiserData.colorCombos;
				colorCombosPath = 'advertiser';
			}
			if(publisherConfig.colorCombos){
				colorCombos = publisherConfig.colorCombos;
				colorCombosPath = 'publisher';
			}
			if(colorCombos !== null){
				colorCombos = templateOperations.getColorComboCSS(colorCombos, colorCombosPath);
				console.log('colorCombos', colorCombos)
				if(colorCombos.status === 'success'){
					cssString = cssString + colorCombos.data;
				}
			}
			document.getElementById(afConfig.DOM.cssStyles).innerHTML = cssString;
			result.status = 'success';
			return result;
		},
		initTemplateDefaults : function(tmplDefaults){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			if(tmplDefaults){
				if(!util.isObject(tmplDefaults)){
					result.message = "'templateDefaults' is not an Object";
					return result;
				}
				var defaultStyles = tmplDefaults.styles;
				var defaultGroups = tmplDefaults.groups;
				var defaultElements = tmplDefaults.elements;
				if(defaultStyles){
					if(!util.isObject(defaultStyles)){
						result.message = "'styles' in 'templateDefaults' is not an Object";
						return result;
					}
					for(var sKey in defaultStyles){
						if(templateDefaults.styles[sKey]){
							result.message = "'"+sKey+"'"+" 'styles' is a duplicate in 'templateDefaults'";
							return result;
						}
						var styles = defaultStyles[sKey];
						if(!util.isObject(styles)){
							result.message = "'"+sKey+"'"+" 'styles' in 'templateDefaults' is not an Object";
							return result;
						}
						styles = styleOperations.getFormattedStyles(styles, null, "templateDefaults.styles."+sKey);
						if(styles.status === 'error'){
							return styles;
						}
						templateDefaults.styles[sKey] = styles.data;
					}
				}
				if(defaultGroups){
					if(!util.isObject(defaultGroups)){
						result.message = "'groups' in 'templateDefaults' is not an Object";
						return result;
					}
					for(var gKey in defaultGroups){
						if(templateDefaults.groups[gKey]){
							result.message = "'"+gKey+"'"+" 'groups' is a duplicate in 'templateDefaults'";
							return result;
						}
						var group = defaultGroups[gKey];
						group = templateOperations.getGroup(group, "templateDefaults.groups."+gKey);
						if(group.status === 'error'){
							return group;
						}
						templateDefaults.groups[gKey] = group.data;
					}
				}
				if(defaultElements){
					if(!util.isObject(defaultElements)){
						result.message = "'elements' in 'templateDefaults' is not an Object";
						return result;
					}
					for(var eKey in defaultElements){
						if(templateDefaults.elements[eKey]){
							result.message = "'"+eKey+"'"+" 'elements' is a duplicate in 'templateDefaults'";
							return result;
						}
						var defaultElement = defaultElements[eKey];
						if(!util.isObject(defaultElement)){
							result.message = "'"+eKey+"'"+" 'elements' in 'templateDefaults' is not an Object";
							return result;
						}
						// element
						if(defaultElement.element){
							if(afConfig.validElements.indexOf(defaultElement.element) == -1){
								result.message = "'element' is not valid : "+"templateDefaults.elements."+eKey;
								return result;
							}
						}else{
							result.message = "'element' is not defined : "+"templateDefaults.elements."+eKey;
							return result;
						}
						// data
						if(defaultElement.data){
							var dataKey = util.isDataKey(defaultElement.data, null, "templateDefaults.elements."+eKey+".data");
							if(dataKey.status === 'error'){
								return dataKey;
							}
						}
						// link
						if(defaultElement.link && defaultElement.link != true && defaultElement.link != false){
							result.message = "'link' is not valid. Should be either true or false : "+"templateDefaults.elements."+eKey;
							return result;
						}
						// subAd
						if(defaultElement.subAd && defaultElement.subAd != true && defaultElement.subAd != false){
							result.message = "'subAd' is not valid. Should be either true or false : "+"templateDefaults.elements."+eKey;
							return result;
						}
						// styles
						if(defaultElement.styles){
							var defaultElementStyles = defaultElement.styles;
							defaultElementStyles = templateOperations.getStyles(defaultElementStyles, "templateDefaults.elements."+eKey+".styles");
							if(defaultElementStyles.status === 'error'){
								return defaultElementStyles;
							}
							defaultElement.styles = util.cloneObj(defaultElementStyles.data);
						}
						// group
						if(defaultElement.group){
							var defaultElementGroup = defaultElement.group;
							defaultElementGroup = templateOperations.getGroup(defaultElementGroup, "templateDefaults.elements."+eKey+".group");
							if(defaultElementGroup.status === 'error'){
								return defaultElementGroup;
							}
							defaultElement.group = util.cloneObj(defaultElementGroup.data);
						}
						templateDefaults.elements[eKey] = defaultElement;
					}
				}
			}
			result.status = 'success';
			return result;
		},
		getStyles : function(styles, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			if(!util.isObject(styles) && !util.isString(styles)){
				result.message = "'styles' should be either a String or an Object";
				if(path){
					result.message = result.message + ' : '+path;
				}
				return result;
			}
			if(util.isObject(styles)){
				styles = styleOperations.getFormattedStyles(styles, null, path);
				if(styles.status === 'error'){
					return styles;
				}
				styles = styles.data;
			}else{
				if(styles[0] != '#'){
					result.message = "'styles' reference should begin with '#'";
					if(path){
						result.message = result.message + ' : '+path;
					}
					return result;
				}
				styles = styles.replace('#', '');
				if(templateDefaults.styles[styles]){
					styles = util.cloneObj(templateDefaults.styles[styles])
				}else{
					result.message = "'styles' reference is not defined";
					if(path){
						result.message = result.message+' : '+path;
					}
					return result;
				}
			}
			result.status = 'success';
			result.data = styles;
			return result;
		},
		getGroup : function(group, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			}
			var groupObj = null;
			if(!util.isObject(group) && !util.isString(group)){
				result.message = "'group' should be either a String or an Object";
				if(path){
					result.message = result.message + ' : '+path;
				}
				return result;
			}
			if(util.isObject(group)){
				if(group.styles){
					var styles = styleOperations.getFormattedStyles(group.styles, null, path+'.styles');
					if(styles.status === 'error'){
						return styles;
					}
					groupObj = {
						styles : styles.data
					}
				}else{
					result.message = "'group' should contain 'styles'";
					if(path){
						result.message = result.message + ' : '+path;
					}
					return result;
				}
			}else{
				if(group[0] != '#'){
					result.message = "'group' reference should begin with '#'";
					if(path){
						result.message = result.message + ' : '+path;
					}
					return result;
				}
				group = group.replace('#', '');
				if(templateDefaults.groups[group]){
					groupObj = util.cloneObj(templateDefaults.groups[group])
				}else{
					result.message = "'group' reference is not defined";
					if(path){
						result.message = result.message+' : '+path;
					}
					return result;
				}
			}
			result.status = 'success';
			result.data = groupObj;
			return result;
		},
		getTemplateHTML : function(elementObj, data){
			var initialState = {
				dataPath : 'data',
				templatePath : 'template',
		    	subAdId : null,
				link : true
		    }
			var templateArray = templateOperations.getTemplateArray([], elementObj, data, initialState);
		    if(templateArray.status === 'error'){
		    	return templateArray;
		    }else{
		    	return {
		    		'status' : 'success',
		    		'data' : templateArray.data.join(''),
		    		'message' : null,
		    		'details' : null
		    	}
		    }
		},
		getTemplateArray : function(tmplArray, elementObj, data, config){
	    	var result = {
				'status' : 'success',
				'message' : null,
				'data' : null,
				'details' : null
			};
			/*
			we haven't updated subAdId of config yet. if subAd is ture and config.subAdId is not null
			then it is nested subAd. an Error
			*/
			var elementInfo = templateOperations.getCompiledElement(elementObj, config);
			if(elementInfo.status === 'error'){
				return elementInfo;
			}
			elementInfo = elementInfo.data;
	    	var cmplArray = [];
	    	var dataKey = null;
	    	var elData = data;
	    	var dataPath = config.dataPath;
	    	if(elementObj.data){
				dataKey = elementObj.data;
				elData = data[dataKey];
				dataPath = config.dataPath+'.'+dataKey;
			}
			var cmplArray = [];
			var elConfig = null;
	    	if(util.isDefined(elementObj.group) && util.isObject(elementObj.group)){
	    		var group = elementObj.group;
				var breakElement = DOM.columnBreak;		
				var flowBreak = elementObj.group.styles.other.flowBreak;
				if(group.styles['flex-direction'] && group.styles['flex-direction'] == 'row'){
					groupBreakElement = DOM.rowBreak;
				}
				if(!util.isArray(elData)){;
					result.message = "'"+dataKey+"' is not an Array : "+dataPath;
					return result;
				};
				tmplArray.push('<div class="'+elementInfo.cmpl.group.classes+'" style="'+elementInfo.cmpl.group.styles+'">\n');
				for(var i = 0; i < elData.length; i++){;
					if(flowBreak){
						if(flowBreak && ((util.isInteger(flowBreak) && (i%flowBreak === 0)) || (util.isArray(flowBreak) && flowBreak.indexOf(i) != -1))){
							tmplArray.push(breakElement);
						}
					}
					elConfig = util.cloneObj(config);
					elConfig.dataPath = dataPath+'['+i+']';
					cmplArray = templateOperations.getCompiledArray(tmplArray, elementObj, elData[i], elConfig, dataKey+'['+i+']');
					if(cmplArray.status === 'error'){
						return cmplArray;
					}
					tmplArray.push(cmplArray.data);
				};
				tmplArray.push('</div>\n');
				result.data = tmplArray;
				return result;
			}
			elConfig = util.cloneObj(config);
			elConfig.dataPath = dataPath;
			cmplArray = templateOperations.getCompiledArray(tmplArray, elementObj, elData, elConfig, dataKey);
			if(cmplArray.status === 'error'){
				return cmplArray;
			}
			tmplArray.push(cmplArray.data);
			result.data = tmplArray;
			return result;
	    },
	    getCompiledArray : function(tmplArray, elementObj, data, config, dataElement){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			var element = elementObj.element;
			var link = config.link;
			var subAdId = null;
			if(util.isDefined(elementObj.link) && elementObj.link !== null){
				link = elementObj.link;
			}
			if(util.isDefined(elementObj.subAd) && elementObj.subAd === true){
				if(!util.isObject(data)){
					result.message = "data '"+dataElement+"' is not an Object : "+config.dataPath;
					return result;
				};
				var updateSubAd = dataOperations.updateSubAdData(data, config.dataPath);
				if(updateSubAd.status === 'error'){
					return updateSubAd;
				};
				subAdId = updateSubAd.data.id;
			}
			if(element === 'container'){
				tmplArray.push('<div class="'+elementObj.cmpl.element.classes+'" style="'+elementObj.cmpl.element.styles+'">');
				if(util.isArray(elementObj.body)){
		        	var elements = elementObj.body;
		        	var bodyElement = null;
		    		for(var i=0 ; i<elements.length ; i++){
		    			bodyElement = elements[i];
		    			if(!util.isObject(bodyElement)){
		    				result.status = 'error';
		    				result.message = 'Element is not an Object : '+config.templatePath+'.body['+i+']';
		    				return result;
		    			}
		    			var flowBreak = elementObj.styles.other.flowBreak;
		    			if(flowBreak && flowBreak !== null){
		    				var breakElement = DOM.columnBreak;
		    				if(elementObj.styles.css['flex-direction'] && elementObj.styles.css['flex-direction'] === 'row'){
		    					breakElement = DOM.rowBreak;
		    				}
		    				if(util.isInteger(flowBreak)){
		    					if(i%flowBreak === 0){
		    						tmplArray.push(breakElement);
		    					}
		    				}
		    				if(util.isArray(flowBreak)){
		    					if(flowBreak.indexOf(i) != -1){
		    						tmplArray.push(breakElement);
		    					}
		    				}
		    			}
		    			var elConfig = util.cloneObj(config);
		    			elConfig.subAdId = subAdId;
		    			elConfig.templatePath = elConfig.templatePath+'.body['+i+']';
		    			var bodyTmplArray = templateOperations.getTemplateArray(tmplArray, bodyElement, data, elConfig);
		    			if(bodyTmplArray.status === 'error'){
				        	return bodyTmplArray;
				        }
				        tmplArray.push(bodyTmplArray.data);
		    		}
		        }
		        tmplArray.push('</div>\n');
			}else{
				var elData = dataOperations.getElementData(data, elementObj.data, elementObj.element, config.dataPath, link, config.subAdId);
				if(elData.status === 'error'){
					return elData;
				}
				elData = elData.data
				if(link == true){
					if(element === 'icon' || element === 'logo' || element === 'image'){
						tmplArray.push('<a href="'+elData.url+'"><img class="'+elementObj.cmpl.element.classes+'" src="'+elData.content+'" style="'+elementObj.cmpl.element.styles+'"></a>\n');
					}else{
						tmplArray.push('<a href="'+elData.url+'" class="'+elementObj.cmpl.element.classes+'" style="'+elementObj.cmpl.element.styles+'">'+elData.content+'</a>\n');
					}
				}else{
					if(element === 'icon' || element === 'logo' || element === 'image'){
						tmplArray.push('<img class="'+elementObj.cmpl.element.classes+'" src="'+elData.content+'" style="'+elementObj.cmpl.element.styles+'">\n');
					}else{
						tmplArray.push('<p class="'+elementObj.cmpl.element.classes+'" style="'+elementObj.cmpl.element.styles+'">'+elData.content+'</p>\n');
					}
				}
			}
			result.status = 'success';
	        result.data = tmplArray;
	        return result;
		},
		getElementObj : function(elementObj, config){
			var result = {
				"status": "error",
				"data": null,
				"message": null,
				"details" : null
			};
			var element = '';
			var defaultElement = {};
			if(!util.isObject(elementObj)){
				result.message = 'Element is not an Object : '+config.templatePath;
				return result;
			}
			if(!elementObj.element){
				result.message = "'element' is not defined : "+config.templatePath;
				return result;
			}
			element = elementObj.element;
			if(!util.isString(element)){
				result.message = "'element' is not a string : "+config.templatePath;
				return result;
			}
			if(afConfig.validElements.indexOf(element) == -1){
				if(element[0] === '#'){
					defaultElement = element.replace('#', '');
					if(templateDefaults.elements[defaultElement]){
						defaultElement = templateDefaults.elements[defaultElement];
						elementObj.element = defaultElement.element;
						element = elementObj.element;
					}else{
						result.message = "'element' reference '#"+defaultElement+"' is not defined : "+config.templatePath;
						return result;
					}
				}else{
					result.message = "'element' reference should begin with '#' : "+config.templatePath;
					return result;
				}
			}

			// data
			if(elementObj.data){
				var dataKey = util.isDataKey(elementObj.data, null, config.templatePath);
				if(dataKey.status === 'error'){
					return dataKey;
				}
			}else
			if(defaultElement.data){
				elementObj.data = defaultElement.data;
			}else{
				if(element !== 'container' || elementObj.group || elementObj.subAd ){
					result.message = "'data' key is not defined : "+config.templatePath;
					return result;
				}
			}
			// link
			if(util.isDefined(elementObj.link)){
				if(elementObj.link != true && elementObj.link != false){
					result.message = "'link' is not valid. Should be either true or false : "+config.templatePath;
					return result;
				}
			}else
			if(util.isDefined(defaultElement.link)){
				elementObj.link = defaultElement.link;
			}
			// subAd
			if(util.isDefined(elementObj.subAd)){
				if(elementObj.subAd != true && elementObj.subAd != false){
					result.message = "'subAd' is not valid. Should be either true or false : "+config.templatePath;
					return result;
				}
				// first inspect subAd then checking for subAdId in data
				// if subAdId is already present, it is invalid
				if(elementObj.subAd === true && config.subAdId !== null){
					result.message = "'subAd' inside 'subAd' is not allowed : "+config.templatePath;
					return result;
				}
			}else
			if(util.isDefined(defaultElement.subAd)){
				elementObj.subAd = defaultElement.subAd;
			}
			// styles
			if(util.isDefined(elementObj.styles)){
				var elementStyles = elementObj.styles;
				elementStyles = templateOperations.getStyles(elementObj.styles, config.templatePath+'.styles');
				if(elementStyles.status === 'error'){
					return elementStyles;
				}
				elementStyles = elementStyles.data;
				if(util.isObject(defaultElement.styles)){
					elementObj.styles = util.extendObj(defaultElement.styles, elementStyles);
				}else{
					elementObj.styles = util.cloneObj(elementStyles);
				}
			}else
			if(util.isObject(defaultElement.styles)){
				elementObj.styles = util.cloneObj(defaultElement.styles);
			}
			// group 
			if(util.isDefined(elementObj.group)){
				var elementGroup = elementObj.group;
				elementGroup = templateOperations.getGroup(elementObj.group, config.templatePath+'.group');
				if(elementGroup.status === 'error'){
					return elementGroup;
				}
				elementGroup = elementGroup.data;
				if(util.isObject(defaultElement.group)){
					elementObj.group = util.extendObj(defaultElement.group, elementGroup);
				}else{
					elementObj.group = util.cloneObj(elementGroup);
				}
			}else
			if(util.isObject(defaultElement.group)){
				elementObj.group = util.cloneObj(defaultElement.group);
			}
			// body
			if(util.isDefined(elementObj.body)){
				if(element !== 'container'){
					result.message = "only 'container' element should have 'body' : "+config.templatePath;
					return result;
				}
				if(!util.isArray(elementObj.body)){
					result.message = "'body' should be an Array: "+config.templatePath;
					return result;
				}
			}
			result.status = 'success';
			result.data = elementObj;
			return result;
		},
		getCompiledElement : function(elementObj, config){
			var result = {
				"status": "error",
				"data": null,
				"message": null,
				"details" : null
			};
			if(elementObj.cmpl){
				result.status = 'success';
				result.data = elementObj;
				return result;
			}
			var elObj = templateOperations.getElementObj(elementObj, config);
			if(elObj.status === 'error'){
				return elObj;
			}
			var element = elementObj.element;
			elementObj.cmpl = {};
			var classNames = afConfig.classes.element;
			var classPrefix = afConfig.classes.prefix;
			var elementClasses = classNames.element;
			switch (element) {
				case "heading":
				case "subheading":
				case "content":
					elementClasses = elementClasses+' '+classNames.text+' '+classPrefix.elements+element;
				    break;
				case "icon":
				case "logo":
				case "image":
					elementClasses = elementClasses+' '+classNames.image+' '+classPrefix.elements+element;
				    break;
				case "container":
					elementClasses = elementClasses+' '+classNames.container+' '+classPrefix.elements+element;
					if(util.isObject(elementObj.styles) && elementObj.styles.other.color){
						elementClasses = elementClasses+' '+elementObj.styles.other.color;
					}
				    break;
			}
			elementObj.cmpl.element = {
				styles : '',
				classes : elementClasses
			}
			if(util.isObject(elementObj.styles)){
				var cmplStyles = templateOperations.getCompiledStyles(elementObj.styles, element, config);
				if(cmplStyles.status === 'error'){
					return cmplStyles;
				}
				elementObj.cmpl.element.styles = cmplStyles.data;
			}
			if(util.isObject(elementObj.group) && util.isObject(elementObj.group.styles)){
				var groupConfig = util.cloneObj(config);
				groupConfig.templatePath = groupConfig.templatePath + '.group';
				var groupStyles = elementObj.group.styles;
				var cmplGroupStyles = templateOperations.getCompiledStyles(groupStyles, 'container', groupConfig);
				if(cmplGroupStyles.status === 'error'){
					return cmplGroupStyles;
				}
				elementObj.cmpl.group = {
					styles : cmplGroupStyles.data,
					classes : classNames.element+' '+classNames.container+' '+classNames.group
				};
				if(groupStyles.other.color){
					elementObj.cmpl.group.classes = elementObj.cmpl.group.classes+' '+groupStyles.other.color;
				}
			}
			result.status = 'success';
			result.data = elementObj;
			return result;
		},
		getCompiledStyles : function(styles, element, config){
			var result = {
				"status": "error",
				"data": null,
				"message": null,
				"details" : null
			};
			var dimensionsRequired = false;
			var elementType = null;
			var applicableStyles = null;
			var dimensionLimits = null;
			var cmplStyles = '';
			switch (element) {
				case "heading":
				case "subheading":
					elementType = 'text';
					applicableStyles = afConfig.applicableStyles.text;
				    break;
				case "content":
					elementType = 'text';
					applicableStyles = afConfig.applicableStyles.text;
				    break;
				case "icon":
					elementType = 'image';
					applicableStyles = afConfig.applicableStyles.image;
					dimensionsRequired = true;
					dimensionLimits = afConfig.validStyles.dimensions.icon;
					break;
				case "logo":
					elementType = 'image';
					applicableStyles = afConfig.applicableStyles.image;
					dimensionsRequired = true;
					dimensionLimits = afConfig.validStyles.dimensions.logo;
				    break;
				case "image":
					elementType = 'image';
					applicableStyles = afConfig.applicableStyles.image;
					dimensionsRequired = true;
					dimensionLimits = afConfig.validStyles.dimensions.image;
				    break;
				case "container":
					elementType = 'container';
					applicableStyles = afConfig.applicableStyles.container;
					dimensionsRequired = true;
					dimensionLimits = afConfig.validStyles.dimensions.container;
				    break;
			}
			if(dimensionsRequired){
				if(!styles.css.width || !styles.css.height){
					result.message = "'dimensions' width and height are required : "+config.templatePath;
					return result;
				}
				var width = parseInt(styles.css.width.replace('px', ''), 10);
				var height = parseInt(styles.css.height.replace('px', ''), 10);
				if(width < dimensionLimits[0] || width > dimensionLimits[1]){
					result.message = "'"+element+"' width should be greater than "+dimensionLimits[0]+", and less than "+dimensionLimits[1]+" : "+config.templatePath;
					return result;
				}
				if(height < dimensionLimits[0] || height > dimensionLimits[1]){
					result.message = "'"+element+"' height should be greater than "+dimensionLimits[0]+", and less than "+dimensionLimits[1]+" : "+config.templatePath;
					return result;
				}
			}
			if(styles && util.isObject(styles.css)){
				var css = styles.css;
				for(var cssStyle in css){
					if(applicableStyles.indexOf(cssStyle) != -1){
						cmplStyles = cmplStyles+cssStyle+':'+css[cssStyle]+';';
					}
				}
			}
			result.status = 'success';
			result.data = cmplStyles;
			return result;
		},
		getColorComboCSS : function(colorCombos, path){
			var result = {
				"status": "error",
				"data": null,
				"message": null,
				"details" : null
			};
			var validColorCombos = afConfig.validColorCombos;
			var cssText = '';
			if(!util.isObject(colorCombos)){
				result.message = "'colorCombos' is not an Object : "+path;
				return result;
			}
			var cssClass = null;
			var combo = null;
			var color = null;
			var ccPrefix = afConfig.classes.prefix.colorCombos;
			var elPrefix = afConfig.classes.prefix.elements;
			for(var i=0; i<validColorCombos.length; i++){
				combo = validColorCombos[i];
				if(colorCombos[combo]){
					if(util.isArray(colorCombos[combo]) && colorCombos[combo].length == 3){
						var colors = colorCombos[combo];
						cssClass = null
						switch (combo) {
							case "heading":
								cssClass = elPrefix+'heading';
								break;
							case "subheading":
								cssClass = elPrefix+'subheading';
								break;
							case "content":
								cssClass = elPrefix+'content';
								break;
							case "primary":
								cssClass = ccPrefix+'primary';
								break;
							case "secondary":
								cssClass = ccPrefix+'secondary';
								break;
						}
						if(cssClass){
							for(var clr = 0; clr<3; clr++){
								color = util.isColor(colors[clr], path+'.colorCombos.'+combo+'['+clr+']');
								if(color.status === 'error'){
									return color;
								}
							}
							if(colorOperations.getColorDifference(colors[0], colors[1]) < afConfig.minColorDifference){
								result.message = " 'color' and 'background-color' difference is less : "+path+'.colorCombos.'+combo;
								return result;
							}
							cssText = cssText+'.'+cssClass+'{\n';
							cssText = cssText+'color : '+'rgb('+colors[0][0]+', '+colors[0][1]+', '+colors[0][2]+');\n';
							cssText = cssText+'background-color : '+'rgb('+colors[1][0]+', '+colors[1][1]+', '+colors[1][2]+');\n';
							cssText = cssText+'border-color : '+'rgb('+colors[2][0]+', '+colors[2][1]+', '+colors[2][2]+');\n';
							cssText = cssText+'}\n';
						}
					}else{
						result.message = "colorCombo '"+combo+"' should be an Array with three colors : "+path+'.colorCombos';
						return result;
					}
				}
			}
			result.status = 'success';
			result.data = cssText;
			return result;
		}
	}
	var paintAd = {
		updateAdData : function(adData, path){
			var result = {
				'status' : 'error',
				'message' : null,
				'data' : null,
				'details' : null
			};
			if(adData.ad){
				if(util.isObject(adData.ad)){
					var ad = adData.ad;
					if(ad.id){
						afConfig.data.adId = ad.id;
						if(ad.url){
							var url = ad.url;
							if(util.isString(url) && util.isURL(url)){
								afConfig.data.adUrl = url;
							}else{
								result.message = "ad 'url' is not an URL : "+path;
								return result
							}
						}
						if(adData.data){
							if(util.isObject(adData.data)){
								var data = adData.data;
								var keyData = null;
								for(var key in data){
									keyData = dataOperations.getDataObject(data[key], path+".data."+key, key);
									if(keyData.status == 'success'){
										afConfig.data.adData[key] = keyData.data;
									}else{
										return keyData;
									}
								}
							}else{
								result.message = "ad 'data' is not an Object : "+path;
								return result
							}
						}
						result.status = 'success';
						return result;
					}else{
						result.message = "ad 'id' is not defined : "+path;
						return result
					}
				}else{
					result.message = "'ad' is not an Object : "+path;
					return result
				}
			}else{
				result.message = "'ad' is not defined : "+path;
				return result
			}
		},
		init : function(paintData){
			var result = {
				status: "error",
				data: null,
				message: null,
				details : null
			};
			var publisherConfig = paintData.publisher;
			var advertiserData = paintData.advertiser;
			var adElement = paintData.adElement;
			
			var attachElStyles = templateOperations.attachElementStyles(paintData);
			if(attachElStyles.status === 'error'){
				return attachElStyles;
			}
			var initTmplDefaults = templateOperations.initTemplateDefaults(advertiserData.templateDefaults);
			if(initTmplDefaults.status === 'error'){
				return initTmplDefaults;
			}
			if(advertiserData.template){
				if(!util.isObject(advertiserData.template)){
					result.message = "'template' is not an Object";
					return result;
				}
			}else{
				result.message = "'template' is not defined";
				return result;
			}
			if(advertiserData.data){
				if(!util.isObject(advertiserData.data)){
					result.message = "'data' is not an Object";
					return result;
				}
			}else{
				result.message = "'data' is not defined";
				return result;
			}

			var updateAdData = paintAd.updateAdData(advertiserData.data, "data");
			if(updateAdData.status === 'error'){
				return updateAdData;
			}

			var adTemplate = templateOperations.getTemplateHTML(advertiserData.template, advertiserData.data);
			if(adTemplate.status === 'success'){
				adTemplate = adTemplate.data
			}else{
				return adTemplate;
			}
			adElement.innerHTML = adTemplate;
			result.data = adTemplate;
			result.status = 'success';
			return result;
		}
	}
	return {
		paintAd : paintAd.init
	}
}());