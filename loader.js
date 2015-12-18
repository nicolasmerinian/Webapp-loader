/**
 * Loader for webapps.
 * 
 * Public methods :
 * 		- reset(),
 * 		- isVisible(),
 * 		- setImageUrl(string imageUrl),
 * 		- setX(float x),
 * 		- getX(),
 * 		- setY(float y),
 * 		- setWindowResizeEnabled(boolean b),
 * 		- isWindowResizeEnabled(),
 * 		- show(),
 * 		- hide(),
 * 		- showIn(int delay),
 * 		- showFor(int delay),
 * 		- hideIn(int delay),
 * 		- fadeIn(int delay),
 * 		- fadeOut(int delay).
 * 
 * Usage:
 * 		var loader = new loader();
 * 		loader.show(); // equivalent to: loader.show(0);
 * 
 * 		The loader implements jQuery chaining so that it can be used like the following:
 * 		loader.showFor(1000).show(3000).fadeOut(6000);
 * 
 * 		Use setWindowResizeEnabled(true) (default) to have the loader located in the center of the page.
 * 		Use setWindowResizeEnabled(false), then setX(x) and setY(y) to manually set the loader's position.
 * 
 * @author Nicolas Merinian
 * @date 17/12/2015
 * @version 1.63
 * @param {string} imageUrl 
 * @returns
 */
var Loader = function (imageUrl) {

	// Store the given path to the loader image or use a default one
	this.imageUrl = imageUrl || "PATH_FOR_YOUR_GIF";
	this.$element = null;

	// Initialize the loader properties
	this.reset();
};

/**
 * Initialize the loader properties: DOM, CSS and events.
 * 
 * @returns {Loader}
 */
Loader.prototype.reset = function () {

	// Some properties
	this.visible = false;
	this.positionX = null;
	this.positionY = null;
	this.imageWidth = 0;
	this.imageHeight = 0;
	this._getImageSize();
	
	// Create the element and hide it
	this.$element = $('<div>').hide();

	// Attributes
	this.$element.attr('id', 'Loader');
	this.$element.addClass('Loader');
	this.$element.attr('width', this.imageWidth);
	this.$element.attr('height', this.imageHeight);

	// CSS
	this.$element.css('width', this.imageWidth);
	this.$element.css('height', this.imageHeight);
	this.$element.css('z-index', '20000');
	this.$element.css('position', 'absolute');
	this._move();

	// Create the image element
	var $img = $('<img>');
	this._updateImage();
	this.$element.append($img);
	this._updateImage();

	// Append the element into the body
	$('body').append(this.$element);

	// Move it when the window is resized
	this.windowResizeEnabled = true;
	var self = this;
	this.resizeId;
	$(window).resize(function () {
		clearTimeout(self.resizeId);
		self.resizeId = setTimeout(function () {
			if (self.windowResizeEnabled) {
				self._move();
			}
		}, 500);
	});

	return this;
};

/**
 * Return true if the loader is visible, false otherwise.
 * 
 * @returns boolean
 */
Loader.prototype.isVisible = function () {
	return this.visible;
};

/**
 * Update the size stored in the Loader instance. <br />
 * This is a private function which is not expected to be used directly.
 */
Loader.prototype._getImageSize = function() {
	// Create a new image
	var img = new Image();
	var self = this;
	
	// When it's loaded (async)
	img.onload = function() {
		
		// If there is no error
		if (this.complete) {
			console.log("complete");
			// Update the the size stored in the Loader instance
			self.imageWidth = this.width;
			self.imageHeight = this.height;
		}
	};
	
	// Set the path of the image
	img.src = this.imageUrl;
};

/**
 * Update the image according to the imageUrl property in case of it has been changed. <br />
 * This is a private function which is not expected to be used directly.
 */
Loader.prototype._updateImage = function () {
	// Update the src attribute of the img element 
	this.$element.children('img').attr('src', this.imageUrl);
};

/**
 * Update the loader's image url.
 * 
 * @param {string} imageUrl 
 * @returns {Loader}
 */
Loader.prototype.setImageUrl = function (imageUrl) {
	// Update the imageUrl property
	this.imageUrl = imageUrl;
	
	// Update the DOM img element
	this._updateImage();
	
	// Update the size stored in the Loader instance to set its lcoation properly
	this._getImageSize();
	return this;
};

/**
 * Return the loader's image url.
 * 
 * @returns string
 */
Loader.prototype.getX = function () {
	return this.imageUrl;
};

/**
 * Update the loader's x-position.
 * 
 * @param {float} x 
 * @returns {Loader}
 */
Loader.prototype.setX = function (x) {
	this.positionX = x;
	
	// Update on the screen
	this._move();
	return this;
};

/**
 * Return the loader's x-position.
 * 
 * @returns float
 */
Loader.prototype.getX = function () {
	return this.left;
};

/**
 * Update the loader's y-position.
 * 
 * @param {float} y 
 * @returns {Loader}
 */
Loader.prototype.setY = function (y) {
	this.positionY = y;
	
	// Update on the screen
	this._move();
	return this;
};

/**
 * Return the loader's y-position.
 * 
 * @returns float
 */
Loader.prototype.getY = function () {
	return this.top;
};

/**
 * If true, the loader will center itself into the page even if the page is resized. <br />
 * If false, the re-positionning on window resizing will be prevented.
 * 
 * @param {boolean} isEnabled 
 * @returns {Loader}
 */
Loader.prototype.setWindowResizeEnabled = function (isEnabled) {
	// Update windowResizeEnabled property
	this.windowResizeEnabled = isEnabled;
	
	// If it is set to enabled
	if (isEnabled) {
		// Nullify the positionX and positionY properties (do not need them any longer) as the loader's location will
		// be set according to the window's size
		this.positionX = null;
		this.positionY = null;
		
		// Update on the screen
		this._move();
	}
	else { // if it is disabled
		// Initialize the positionX and positionY properties to the previous location
		this.positionX = this.left;
		this.positionY = this.top;
	}
	return this;
};

/**
 * Return true if the loader's position is updated on window resizing.
 * 
 * @returns boolean
 */
Loader.prototype.isWindowResizeEnabled = function () {
	return this.windowResizeEnabled;
};

/**
 * Update the loader's position according to its left and top values. <br />
 * If the loader updates its position on window resizing, it will be centered into the page, <br />
 * otherwise its location will be set by its positionX and position Y properties. <br />
 * This is a private function which is not expected to be used directly.
 */
Loader.prototype._move = function () {
	// If any of positionX or positionY properties is null, then the windowResizeEnabled property may be set to true,
	// so the loader's location will is set according to the window's size
	if (this.positionX == null || this.positionY == null) {
		this.left = ($(window).width() - 54) / 2;
		this.top = ($(window).height() - 55) / 2;
	}
	else { // The location is manually defined by positionX and positionY properties
		this.left = this.positionX;
		this.top = this.positionY;
	}
	
	// Update loader's lcoation on the screen
	this.$element.css('left', this.left);
	this.$element.css('top', this.top);
};

/**
 * Show the loader.
 * When a delay is provided, show() becomes an animation method (like fadeIn).
 * 
 * @param {int} delay 
 * @returns {Loader}
 */
Loader.prototype.show = function (delay) {
	if (typeof delay == "undefined") {
		this.$element.show();
	}
	else {debugger;
		if (!(!isNaN(Number(delay)) && delay >= 0)) {
			delay = 400;
		}
		this.$element.show(delay);
	}
	this.visible = true;
	return this;
};

/**
 * Hide the loader.
 * When a delay is provided, hide() becomes an animation method (like fadeIn).
 * 
 * @param {int} delay 
 * @returns {Loader}
 */
Loader.prototype.hide = function (delay) {
	if (typeof delay == "undefined") {
		this.$element.hide();
	}
	else {
		if (!(!isNaN(Number(delay)) && delay >= 0)) {
			delay = 400;
		}
		this.$element.hide(delay);
	}
	this.visible = false;
	return this;
};

/**
 * Show the loader for delay ms.
 * 
 * @param {int} delay 
 * @returns {Loader}
 */
Loader.prototype.showFor = function (delay) {
	if (delay < 0) {
		throw new Error("Loader.showFor: delay must be a positive number: " + delay);
	}
	
	// Firstly show the loader
	this.show();
	var self = this;
	
	// Then, hide it after delay ms
	var timer = setTimeout(function () {
		self.hide();
	}, delay);
	return this;
};

/**
 * Show the loader in delay ms.
 * 
 * @param {int} delay 
 * @returns {Loader}
 */
Loader.prototype.showIn = function (delay) {
	if (delay < 0) {
		throw new Error("Loader.showIn: delay must be a positive number: " + delay);
	}
	var self = this;
	
	// Show after delay ms
	var timer = setTimeout(function () {
		self.show();
	}, delay);
	return this;
};

/**
 * Hide the loader for delay ms.
 * 
 * @param {int} delay 
 * @returns {Loader}
 */
Loader.prototype.hideIn = function (delay) {
	if (delay < 0) {
		throw new Error("Loader.hideIn: delay must be a positive number: " + delay);
	}
	var self = this;
	
	// Hide after delay ms
	var timer = setTimeout(function () {
		self.hide();
	}, delay);
	return this;
};

/**
 * Show the loader by fading them to opaque in delay ms.
 * @param {int} delay 
 * @since 1.5
 * @returns {Loader}
 */
Loader.prototype.fadeIn = function (delay) {
	if (!delay || delay < 0 || isNaN(Number(delay))) {
		delay = 400;
	}
	this.$element.fadeIn(delay);
	this.visible = true;
	return this;
};

/**
 * Show the loader by fading them to transparent in delay ms.
 * @param {int} delay 
 * @since 1.5
 * @returns {Loader}
 */
Loader.prototype.fadeOut = function (delay) {
	if (!delay || delay < 0 || isNaN(Number(delay))) {
		delay = 400;
	}
	this.$element.fadeOut(delay);
	this.visible = true;
	return this;
};

