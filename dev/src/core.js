
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