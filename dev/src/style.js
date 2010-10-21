
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