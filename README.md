# Webapp-loader

## About

This is a loader for webapps. 

## Requirements

 - jQuery

## Get started

	```
	var loader = new Loader(); 
	loader.show(); // equivalent to: loader.show(0);

	The loader implements jQuery chaining so that it can be used like the following:
	loader.showFor(1000).show(3000).fadeOut(6000);

	Use setWindowResizeEnabled(true) (default) to have the loader located in the center of the page.
	Use setWindowResizeEnabled(false) then setX(x) and setY(y) to manually set the loader's position.
	
	```

## API
 - reset(),
 - isVisible(),
 - setImageUrl(string imageUrl),
 - setX(float x),
 - getX(),
 - setY(float y),
 - setWindowResizeEnabled(boolean b),
 - isWindowResizeEnabled(),
 - show(),
 - hide(),
 - showIn(int delay),
 - showFor(int delay),
 - hideIn(int delay),
 - fadeIn(int delay),
 - fadeOut(int delay).


