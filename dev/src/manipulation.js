
//================================== zepto.js : HTML manipulation module ==================================//

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