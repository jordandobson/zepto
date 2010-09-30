# zepto.js - modular branch #

This is a fork of [Thomas Fuchs](http://mir.aculo.us/) minimalistic JavaScript framework [zepto.js](http://github.com/madrobby/zepto).

It was based on a *early stage* of the framework but **branched into a completely different direction**, the core structure was totally refactored. **It may have extra/missing features** and/or **different API** than the original.

**The code structure/implementations are diverging from the original at each day.**

To know more about why this branch was created and what should come next see this [pull request](http://github.com/madrobby/zepto/pull/5).

The main idea is to keep the API as close as possible to jQuery without bloating the code size but focusing on the most important/used methods, features will be added as needed and will try to unit test 100% of the API.

**Some changes implemented on this branch may be added to the main one but probably most of them won't**.


## Targets ##

Modern mobile browsers.


## Syntax & features ##

### Basic call ###
   
    $('some css selector').html('set contents').css('set styles');


### Element functions ###
  
 - `.each(fn)` : Execute a function for each matched element.
 - `.get()` : Return array of all elements found.
 - `.get(0)` : Return first element found.
 - `.eq(1)` : Reduce matched elements to a single el0ement by index.
 - `.find('selector')` : Match descendant element(s) based on selector.
 - `.html('new html')` : Set the contents of the element(s).
 - `.css('css properties')` : Set styles of the element(s).
 - `.append`, `prepend`, `after`, `before` : Like `html`, but append/prepend to element contents or before/after element.
 - `.anim(transform, opacity, duration)` : Use -webkit-transform/opacity and do an animation.
 - `.delegate(selector, eventType, handler)` : Attach an Event listener to matched elements using the event delegation pattern.
 - `.hasClass(className)` : Check if any matched element has given class.
 - `.addClass(className)` : Add one or more classes (separated by spaces) into each matched element.
 - `.removeClass(className)` : Removes one or more class names (separated by spaces) from matched elements, removes all classes if `null`.
 - `.toggleClass(className, switch)` : Add or remove one or more classes from each element in the set of matched elements.
 - `.add(elementsArray)` : Add a set of elements to the matched elements set.
 - `.map(callbackFn(i, element))` : Pass each element in the current matched set through a function, producing a new zepto object containing the return values.
 - `.attr(name, value)` : Set/get attribute value.

### Helpers ###
  
 - `$.isDef(param)` : Check if parameter is different than `undefined`.
 - `$.isFunction(param)` : Check if parameter is a `Function`.
 - `$.isArray(param)` : Check if parameter is an `Array`.
 - `$.unique(array)` : Return a new array that contain only unique items.
 - `$.makeArray(obj)` : Convert an array-like Object into an real array.
 - `$.extend(firstObj, secondObj)` : Mixin, copy properties from one object into another, will extend `zepto` by default if second parameter is omitted.
 - `$.map(array, callbackFn)` : Translate all items in an array or array-like object to another array of items. (similar to similar to `jQuery.map` and not to `Array.prototype.map`)
 - `$.each(collection, callbackFn(i|key, value))` : Call method over each array/object item.
 - `$.noop` : Empty function.
 - `$.trim(str)` : Remove white spaces from begining and end of string.
 - `$.ready(fn)` : Specify a method to be called after DOM is "ready" (fully loaded).

### Event Handlers ###

#### bind/unbind ####

 - `.bind(eventType, eventHandler)` : Attach event listener onto each matched element.
 - `.unbind(eventType, eventHandler)` : Remove event listener from each matched element, *(both parameters are required)*.

##### example #####

    var handler = function(evt){
        $(this).unbind('touchstart', handler); //remove listener after first call, so it will be called only once per matched element
        alert("yay!");
    };
	
    $('#my_div').bind('touchstart', handler); //add listener


#### delegate ("live" event) ####

`.delegate(selector, eventType, eventHandler)` : Listen for events triggered by descendant nodes of matched elements - A.K.A "event delegation".

    //will trigger when any descendant element of "#my_div" that has the class ".touchable" is touched
    $('#my_div').delegate('.touchable', 'touchstart', function(evt){
        alert("I'm touched!");
    });


### Ajax: ###

 - `$.ajax(method, url, succesCallback, errorCallback)`
 - `$.get(url, succesCallback, errorCallback)`
 - `$.post(url, succesCallback, errorCallback)`
 - `$.getJSON(url, succesCallback, errorCallback)`


## Notes ##

### Future improvements ###

 - Add sniffing based on feature detection, maybe only load *zepto.min.js* and subsequent files if browser support required features.
 - Maybe create different builds that removes specific modules.
 - Add JSLint to build process.

### Recommendations ###

 - Make sure the site still works without JavaScript since many devices doesn't support it! **Use it as an enhancement and not as a prerequisite.**
 - Compress all your JavaScript files before deploying.
 
### Unit Test ###

 - **Tests may be created before features are implemented**, so don't get scared if a few of them throws errors telling that method doesn't exist (unless method is described on the README file).
