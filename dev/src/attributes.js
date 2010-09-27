/*
 * zepto.js - Element.attributes module
 */
 
 /**
  * @param {zepto} zepto
  */
(function(zepto){
	
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
	
}(zepto));