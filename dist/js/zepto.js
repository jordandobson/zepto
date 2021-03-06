/**!
 * @license zepto.js v0.1.7.2
 * - original by Thomas Fuchs (http://github.com/madrobby/zepto), forked by Miller Medeiros (http://github.com/millermedeiros/zepto).
 * Released under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Build: 27 - Date: 10/21/2010 01:27 PM
 */
 
(function(window, document){

//================================== zepto.js : core module ==================================//
	

	var 
		/**
		 * zepto.js
		 * @constructor
		 * @namespace
		 * @param {(string|zepto|HTMLElement|Function)} [selector]
		 * @param {(HTMLElement|Document|zepto)} [context]
		 * @return {zepto}
		 */
		zepto = function(selector, context){
			if(this instanceof zepto){ //enforce `new` on constructor (scope-safe).
				context = context || document;
				
				var	matched;
				
				//inspired by jQuery.init method (highly simplified)
				if(selector){
					if(selector === window){
						context = null;
						matched = [window];
					}else if(selector.nodeType){ //DOMElement
						context = selector;
						matched = [selector];
						selector = null;
					}else if(selector instanceof zepto){ //"clone" zepto object
						selector = selector.selector;
						context = selector.context;
					}else if(zepto.isFunction(selector)){ //shotcut for "DOM ready"
						zepto.ready(selector);
						return this; //prevents adding selector/context/items
					}
					
					if(context instanceof zepto){ //if finding descendant node(s) of all matched elements
						matched = [];
						context.each(function(el){
							matched = matched.concat( zepto.makeArray(el.querySelectorAll(selector)) );
						});
						matched = zepto.unique(matched);
					}else if(context && ! matched){ //avoid querySelector if `selector` is a DOMElement
						matched = zepto.makeArray( context.querySelectorAll(selector) );
					}
				}
				
				this.selector = selector;
				this.context = context;
				this.add(matched);
				
			}else{
				return new zepto(selector, context);
			}
		},
		
		/**
		 * @type {RegExp}	remove white spaces from beginning and end of the string
		 */
		_regexTrim = /^\s+|\s+$/g,
		
		/**
		 * @type {boolean}
		 */
		_hasReadyFix;
	
	/**
	 * zepto.js
	 * @constructor
	 * @namespace
	 * @param {(string|zepto|HTMLElement|Function)} [selector]
	 * @param {(HTMLElement|Document|zepto)} [context]
	 * @return {zepto}
	 */
	window['zepto'] = window['$'] = zepto; //export '$' and 'zepto' to global scope (used string to make closure compiler advanced happy)
	
	
	/**
	 * @namespace reference to zepto.prototype for easy plugin developement
	 */
	zepto.fn = zepto.prototype = {
		
		/**
		 * @type {number}	Number of matched elements.
		 */
		length : 0,
		
		/**
		 * Execute a function for each matched element.
		 * @param {function(this:zepto, HTMLElement)} fn
		 * @return {zepto}
		 */
		each : function(fn){
			this.get().forEach(function(el){
				fn.call(this, el); //bind `this` to zepto object
			}, this);
			return this;
		},
		
		/**
		 * Find descendant node based on selector.
		 * @param {string} selector
		 * @return {zepto}
		 */
		find : function(selector){
			return zepto(selector, this);
		},
		
		/**
		 * Retrieve matched DOM elements.
		 * @param {number} [index]	Element index
		 * @return {Array|HTMLElement} All matched elements if `index` is `undefined` or a single element if `index` is specified.
		 */
		get : function(index){
			return zepto.isDef(index)? this[parseInt(index, 10)] : zepto.makeArray(this);
		},
		
		/**
		 * Reduce matched elements to a single element by index.
		 * @param {number} index Element Index
		 * @return {zepto}
		 */
		eq : function(index){
			return zepto(this.get(index));
		},
		
		/**
		 * Add a set of elements to the stack. 
		 * @param {Array} elements	Selector string or Elements to be added to current stack.
		 * @return {zepto}
		 */
		add : function(elements){
			Array.prototype.push.apply(this, elements); //copy reference of elements to $[n] and update length (convert `zepto` into a pseudo-array object)
			return this;
		},
		
		/**
		 * Pass each element in the current matched set through a function, producing a new zepto object containing the return values. 
		 * @param {function(this:Element, number, Element):*} callback	Function that will be called for each element.
		 * @return {zepto}
		 */
		map : function(callback){
			return zepto().add(zepto.map(this, function(el, i){
				return callback.call(el, i, el);
			}));
		}
		
	};
	
	//------------------------------ Helpers ------------------------------//
	
	/**
	 * Copy properties from one Object into another (mixin).
	 * - will extend `zepto` or `zepto.fn` by default if `second` is `undefined`.
	 * @param {Object} first
	 * @param {Object} [second]
	 * @return {Object}
	 */
	zepto.extend = zepto.fn.extend = function(first, second){
		var key;
		if(! second){ //extend zepto by default
			second = first;
			first = this;
		}
		for(key in second){
			if(second.hasOwnProperty(key)){ //avoid copying properties from prototype and makes JSLint happy! :)
				first[key] = second[key];
			}
		}
		return first;
	};
	
	//generics (static methods)
	zepto.extend({
	
		/**
		 * Return Array without any duplicate items.
		 * @param {Array} array
		 * @return {Array}
		 */
		unique : function(array){
			function unique(item, i, arr){
				return arr.indexOf(item) === i;
			}
			return array.filter(unique);
		},
		
		/**
		 * Convert Array-like object into a true Array
		 * @param {Array} obj
		 * @return {Array}
		 */
		makeArray : function(obj){
			return Array.prototype.slice.call(obj);
		},
		
		/**
		 * Check if parameter is different than `undefined`.
		 * @return {boolean} `true` if parameter isn't `undefined`.
		 */
		isDef : function(param){
			return (typeof param !== 'undefined');
		},
		
		/**
		 * Check if parameter is a Function
		 * @return {boolean} `true` if parameter is a Function.
		 */
		isFunction : function(param){
			return (typeof param === 'function'); //be aware that this method doesn't work for all the browsers (used it since it works on the newest browsers)
		},
		
		/**
		 * Check if parameter is an Array
		 * @return {boolean} `true` if parameter is an Array.
		 */
		isArray : function(param){
			return (Object.prototype.toString.call(param) === '[object Array]');
		},
		
		/**
		 * An empty function
		 * @type Function
		 */
		noop : function(){},
		
		/**
		 * Translate all items in an array or array-like object to another array of items.
		 * - similar to `jQuery.map` and not to `Array.prototype.map`
		 * @param {Array} target	Array or Array-like Object to be mapped.
		 * @param {function(*, number): *} callback	Function called for each item on the array passing "item" as first parameter and "index" as second parameter and "base array" as 3rd, if callback returns any value besides `null` will add value to "mapped" array.
		 * @return {Array}  
		 */
		map : function(target, callback){
			//didn't used `Array.prototype.map` because `jQuery.map` works different than JavaScript 1.6 `Array.map`
			var ret = [],
				value,
				i,
				n = target.length;
			for(i = 0; i < n; i++){
				value = callback(target[i], i);
				if(value != null){
					ret[ret.length] = value; //faster than push
				}
			}
			return ret;
		},
		
		/**
		 * Call method over each array/object item.
		 * @param {(Object|Array)} collection
		 * @param {function((number|string), *)} callback
		 * @return {(Object|Array)}	Return collection for chaining.
		 */
		each : function(collection, callback){
			var key,
				value, 
				i,
				n = collection.length;
			if(zepto.isDef(n)){ //is array or array like object
				for(i = 0; i<n; i++){
					value = collection[i];
					if(callback.call(value, i, value) === false) break; //stop loop
				}
			}else{ //is regular object
				for(key in collection){
					value = collection[key];
					if(callback.call(value, key, value) === false) break; //stop loop
				}
			}
			return collection;
		},
		
		/**
		 * Remove white spaces from begining and end of string
		 * - as of 2010/09/24 Safari Mobile (iOS 4) doesn't support `String.prototype.trim`
		 * @param {string} [str]
		 * @return {string}
		 */
		trim : function(str){
			return (str || '').replace(_regexTrim, '');
		},
		
		/**
		 * Specify a method to be called after DOM is "ready" (fully loaded). 
		 * @param {function(zepto)} fn
		 */
		ready : function(fn){
			if(! _hasReadyFix){
				//fix back-forward button on browsers that caches JS state (iOS4, FF 1.5+) - see: https://developer.mozilla.org/En/Using_Firefox_1.5_caching
				window.addEventListener('unload', zepto.noop, false); //prevents page from caching since `pageshow` doesn't solve problem on the iPhone (iOS4).
				_hasReadyFix = true;
			}
			
			if(document.readyState === 'complete'){ //if the document was already loaded
				fn(zepto);
			}else{ //if not ready yet
				document.addEventListener('DOMContentLoaded', function(){
					document.removeEventListener('DOMContentLoaded', arguments.callee, false);
					fn(zepto);
				}, false);
			}
		}
		
	});

//================================== zepto.js : HTML manipulation module ==================================//

(function(zepto, document){
	
	var stripHtmlRegex = /(?:<[^>]*>)+/g; //match HTML tags
	
	zepto.fn.extend({
		
		/**
		 * Get/Set elements innerHTML.
		 * @param {string} [html]
		 * @return {zepto|string}
		 */
		html : function(html){
			if(zepto.isDef(html)){
				return this.each(function(el){ 
					el.innerHTML = html;
				});
			}else{
				return this.get(0).innerHTML;
			}
		},
		
		/**
		 * Get/Set element text content.
		 * @param {string} [txt]
		 * @return {zepto|string}
		 */
		text : function(txt){
			var tmp = [];
			if(zepto.isDef(txt)){
				return this.append(document.createTextNode(txt));
			}else{
				//jquery returns the combined text of all the matched elements.
				this.each(function(el){
					tmp.push(el.innerHTML);
				});
				return tmp.join(' ').replace(stripHtmlRegex, ' '); //FIXME: should add space between each tag, maybe switch to `Element.nodeValue` instead of regexp.
			}
		},
		
		/**
		 * Insert HTML text at specified position, similar to DOM Element `insertAdjacentHTML`.
		 * @param {string} position	['beforeEnd', 'afterBegin', 'beforeBegin', 'afterEnd']
		 * @param {string} html
		 * @return {zepto}
		 */
		insertHTML : function(position, html){
			return this.each(function(el){
				el.insertAdjacentHTML(position, html); 
			});
		},
		
		/**
		 * Insert HTML text before end of element.
		 * @param {string} html
		 * @return {zepto}
		 */
		append : function(html){
			return this.insertHTML('beforeEnd', html);
		},
		
		/**
		 * Insert HTML text after begin of element.
		 * @param {string} html
		 * @return {zepto}
		 */
		prepend : function(html){
			return this.insertHTML('afterBegin', html);
		},
		
		/**
		 * Insert HTML text before element.
		 * @param {string} html
		 * @return {zepto}
		 */
		before : function(html){
			return this.insertHTML('beforeBegin', html);
		},
		
		/**
		 * Insert HTML text after element.
		 * @param {string} html
		 * @return {zepto}
		 */
		after : function(html){
			return this.insertHTML('afterEnd', html);
		}
		
	});
	
}(zepto, document));

//================================== zepto.js : style module ==================================//
 
	zepto.fn.extend({
		
		/**
		 * Set style of matched elements. 
		 * @param {string} css	CSS string.
		 * @return {zepto}
		 */
		css : function(css){
			//TODO: change the way it works to match jQuery.
			return this.each(function(el){
				el.style.cssText += ';'+ css; 
			});
		},
		
		/**
		 * Apply webkit transition to matched elements.
		 * @param {string} transform
		 * @param {number} opacity
		 * @param {number} [duration] defaults to `500`
		 * @param {number} [delay] defaults to `0`
		 * @param {number} [ease] defaults to `"ease"`
		 * @return {zepto}
		 */
		transition : function(transform, opacity, duration, delay, ease){
			duration = zepto.isDef(duration)? duration : 500;
			//TODO: change the way transition works, since it's overwriting the "-webkit-transition:" it's hard to change other CSS values later with animation. It's also impossible to animate other values besides `transform` and `opacity`. Maybe create a separate plugin that does the heavy lift with callbacks, etc..
			var str = zepto.isDef(transform)? '-webkit-transform:'+ transform +';' : '';
			str += zepto.isDef(opacity)? 'opacity:'+ opacity +';' : ''; 
			return this.css('-webkit-transition:-webkit-transform, opacity '+ duration +'ms,'+ duration +'ms '+ (ease||'ease')+' '+ (delay||0) +'ms;' + str);
		}
		
	});

//================================== zepto.js : event module ==================================//

	zepto.fn.extend({
		
		/**
		 * @param {string} eventType	Event type.
		 * @param {function(Event)}	handler	Event handler.
		 * @return {zepto}
		 */
		bind : function(eventType, handler){
			return this.each(function(el){
				el.addEventListener(eventType, handler, false);
			});
		},
		
		/**
		 * @param {string} eventType	Event type.
		 * @param {function(Event)}	handler	Event handler.
		 * @return {zepto}
		 */
		unbind : function(eventType, handler){
			return this.each(function(el){
				el.removeEventListener(eventType, handler, false);
			});
		},
		
		/**
		 * @param {string} selector	Selector
		 * @param {string} eventType	Event type that it should listen to. (supports a single kind of event)
		 * @param {function(this:HTMLElement, Event)} callback
		 * @return {zepto}
		 */
		delegate : function(selector, eventType, callback){
			var targets = this.find(selector).get();
			return this.each(function(el){
				function delegateHandler(evt){
					var node = evt.target;
					while(node && targets.indexOf(node)<0){
						node = node.parentNode;
					}
					if(node && node !== el){
						callback.call(node, evt);
					}
				}
				el.addEventListener(eventType, delegateHandler, false);
			});
		}
		
	});

//================================== zepto.js : ajax module ==================================//

	//generics (static methods)
	zepto.extend({
	
		/**
		 * XML Http Request
		 * @param {string} method	Request Method
		 * @param {string} url	Request URL
		 * @param {Function} [success]	Success Callback
		 * @param {Function} [error]	Error Callback
		 * @return {zepto}
		 */
		ajax : function(method, url, success, error){
			var xhr = new XMLHttpRequest();
			
			function xhrStateHandler(){
				if(xhr.readyState == 4){
					if(xhr.status == 200 && success){
						success(xhr.responseText);
					}else if(error){
						error(xhr.status, xhr.statusText);
					}
					xhr.removeEventListener('readystatechange', xhrStateHandler);
				}
			}
			
			if(success || error){ //only attach listener if required
				xhr.addEventListener('readystatechange', xhrStateHandler, false);
			}
			
			xhr.open(method, url, true);
			xhr.send(null);
			
			return this;
		},
		
		/**
		 * Ajax GET
		 * @param {string} url	Request URL
		 * @param {Function} [success]	Success Callback
		 * @param {Function} [error]	Error Callback
		 * @return {zepto}
		 */
		get : function(url, success, error){
			return zepto.ajax('GET', url, success, error);
		},
		
		/**
		 * Ajax POST
		 * @param {string} url	Request URL
		 * @param {Function} [success]	Success Callback
		 * @param {Function} [error]	Error Callback
		 * @return {zepto}
		 */
		post : function(url, success, error){
			return zepto.ajax('POST', url, success, error);
		},
		
		/**
		 * Ajax GET with pre-built JSON.parse 
		 * @param {string} url	Request URL
		 * @param {Function} [success]	Success Callback
		 * @param {Function} [error]	Error Callback
		 * @return {zepto}
		 */
		getJSON : function(url, success, error){
			return zepto.get(url, function(data){
				success(JSON.parse(data));
			}, error);
		}
	
	});

//================================== zepto.js : Element.attributes module ==================================//

	zepto.fn.extend({
		
		/**
		 * Set one or more attributes for the set of matched elements.
		 * @param {string} attributeName	The name of the attribute to set/get.
		 * @param {string} [value]	The value of the attribute. If `null` will get value.
		 * @return {(zepto|string)}	Attribute value or `zepto` object (for chaining).
		 */
		attr : function(attributeName, value){
			//XXX: currently doesn't work like jQuery, maybe allow object of attributes and also a "map" function.
			var ret;
			if(zepto.isDef(value)){
				ret = this.each(function(el){
					el.setAttribute(attributeName, value);
				});
			}else{
				ret = this.get(0).getAttribute(attributeName);
			}
			return (ret === null)? undefined : ret;
		},
		
		/**
		 * Remove an attribute from each element in the set of matched elements.
		 * @param {string} attributeName
		 * @return {zepto}
		 */
		removeAttr : function(attributeName){
			return this.each(function(el){
				el.removeAttribute(attributeName);
			});
		}
		
	});

//================================== zepto.js : Element.classList module ==================================//
 
	/**
	 * @param {zepto} zepto
	 */
	(function(zepto){
		
		//--- As of 2010/09/23 native HTML5 Element.classList is only supported by Firefox 3.6+ ---//
		
		var _regexSpaces = /\s+/g;
		
		/**
		 * remove multiple spaces and trailing spaces
		 * @param {string} className
		 * @return {string}
		 */
		function sanitize(className){
			return zepto.trim( className.replace(_regexSpaces, ' ') );
		}
		
		/**
		 * @param {Element} el
		 * @param {string} className
		 */
		function addClasses(el, className){
			className = el.className +' '+ className; //all classes including repeated ones
			var classesArr = zepto.unique( sanitize(className).split(_regexSpaces) ); //avoid adding replicated items
			el.className = classesArr.join(' ');
		}
		
		/**
		 * @param {string} className
		 * @return {RegExp}
		 */
		function createMatchClassRegExp(className){
			return new RegExp('(?:^| )'+ sanitize(className).replace(_regexSpaces, '|') +'(?: |$)', 'g'); //match all words contained on `className` string
		}
		
		/**
		 * @param {Element} el
		 * @param {RegExp} regexMatch
		 */
		function removeClasses(el, regexMatch){
			el.className = sanitize(el.className.replace(regexMatch, ' '));
		}
		
		zepto.fn.extend({
			
			/**
			 * Check if any matched element has given class.
			 * @param {string} className
			 * @return {boolean}
			 */
			hasClass : function(className){
				var 
					regexHasClass = createMatchClassRegExp(className),
					n = 0,
					el;
					
				while(el = this[n++]){
					if(el.className.match(regexHasClass)){
						return true
					}
				}
				return false;
			},
			
			/**
			 * Add one or more class(es) into each matched element.
			 * @param {string} className	One or more class names separated by spaces.
			 * @return {zepto}
			 */
			addClass : function(className){
				return this.each(function(el){
					addClasses(el, className);
				});
			},
			
			/**
			 * Remove class(es) from each matched element.
			 * @param {string} [className]	One or more class names separated by spaces, removes all classes if `null`.
			 * @return {zepto}
			 */
			removeClass : function(className){
				className = className || '.+'; //'.+' will match any class name
				var regex = createMatchClassRegExp(className);
				return this.each(function(el){
					removeClasses(el, regex);
				});
			},
			
			/**
			 * Add or remove one or more classes from each element in the set of matched elements.
			 * @param {string} className	One or more class names (separate by space) to be toggled.
			 * @param {boolean} [isAdd]	Switch value, if `true` add class is `false` removes it.
			 * @return {zepto}
			 */
			toggleClass : function(className, isAdd){
				if(zepto.isDef(isAdd)){
					(isAdd)? this.addClass(className) : this.removeClass(className); 
				}else{
					var classes = zepto.trim(className).split(' '),
						regex,
						elements = this.get(); //for scope and performance
					classes.forEach(function(c){
						//replicated hasClass and removeClass functionality to avoid creating multiple RegExp objects and also because it needs to toggle classes individually
						regex = createMatchClassRegExp(c);
						elements.forEach(function(el){
							if(el.className.match(regex)){
								removeClasses(el, regex);
							}else{
								addClasses(el, c);
							}
						});
					});
				}
				return this;
			}
		});
		
	}(zepto));

}(window, window.document));
