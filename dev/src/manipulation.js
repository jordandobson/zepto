
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