
//================================== zepto.js : swipe plugin ==================================//

(function(zepto){
	
	/**
	 * @author Miller Medeiros <http://www.millermedeiros.com/>
	 * @version 0.3 (2010/10/21)
	 * @param {string} direction	Swipe direction ('left', 'right', 'up', 'down')
	 * @param {function({direction: string, changeX: number, changeY: number})} endCallback	Called on touch end.
	 * @param {{x: number, y: number}} [threshold]	Defaults to {x:30, y:30}
	 * @param {boolean} [preventScroll]	If touchmove should block scroll, IMPORTANT: defaults to `false`.
	 */
	zepto.fn.swipe = function(direction, endCallback, threshold, preventScroll){
		
		var thold = {x:30, y:30}, //default threshold
			origin = {x:0, y:0},
			dest = {x:0, y:0},
			isVertical = (direction === 'up' || direction === 'down');
		
		if(threshold) zepto.extend(thold, threshold); //overwrite default threshold
		
		function updateCords(cordsObj, evt){
			cordsObj.x = evt.targetTouches[0].pageX;
			cordsObj.y = evt.targetTouches[0].pageY;
		}
		
		function onTouchStart(evt){
			updateCords(origin, evt);
		}
		
		function onTouchMove(evt){
			if(preventScroll) evt.preventDefault();
			updateCords(dest, evt);
		}
		
		function getEventInfo(){
			var changeX = origin.x - dest.x,
				changeY = origin.y - dest.y,
				distX = Math.abs(changeX),
				distY = Math.abs(changeY);
							
			return {
				changeX : changeX,
				changeY : changeY,
				direction : direction
			};
		}
		
		function onTouchEnd(evt){
			var evtInfo = getEventInfo(),
				shouldDispatch;
			
			if(!isVertical && distX >= thold.x && distY <= thold.y){
				shouldDispatch = (direction === 'left' && changeX > 0) || (direction === 'right' && changeX < 0);
			}else if(isVertical && distX <= thold.x && distY >= thold.y){
				shouldDispatch = (direction === 'up' && changeY > 0) || (direction === 'down' && changeY < 0);
			}
			
			if(shouldDispatch) endCallback.call(evt.currentTarget, evtInfo); //assign `this` to element (used "currentTarget" instead of "target" because of event bubbling)
		}
		
		this.bind('touchstart', onTouchStart);
		this.bind('touchmove', onTouchMove);
		this.bind('touchend', onTouchEnd);
		//swipe doesn't require 'touchcancel' since 'touchend' won't be called then.
		
		return this; //chain
	};
	
}(zepto));