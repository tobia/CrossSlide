# CrossSlide

CrossSlide was a jQuery plugin I developed in 2007 to create slideshow animations using plain Javascript, doing away with the need to use Adobe Flash™ or other binary plugins.

It did so by creating a `<div style="overflow:hidden">` container that would hold several `<img style="position:absolute">` elements, so that the images could be moved around inside the container while staying clipped to the container's edges. It would then build a chain of *closures* that would call jQuery's `animate()` method for each animation phase, between each pair of keyframes, passing around the callback for the next phase. This was before jQuery's support for animation queues.

**This code is obsolete** in more that one way. There are much better alternatives around to build slideshows without using binary plugins, including CSS3 animations and the Canvas element. Therefore **this plugin is unmaintained and unsupported**.

In other words, **2007 called and wants its Javascript back**. CrossSlide users are encouraged to switch to one of the current slideshow packages, built on modern technologies.

That being said, this project was released under the GPLv2 license, so anyone is free to fork it and continue development as they see fit. You can see any existing forks in the upper right corner of this project page.

_–Tobia_
