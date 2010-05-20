CrossSlide
==========

CrossSlide is a jQuery plugin implementing in Javascript some common slide-show
animations, traditionally only available via Adobe Flash™ or other proprietary
plugins. CrossSlide builds upon jQuery's animation facility, so it is as
portable across browsers as jQuery itself (that is, a lot!)

CrossSlide can set up a few different effects, depending on how it's called.
See the bottom of this file if you are interested in a simple HOWTO.

Static cross-fade
-----------------

The simplest effect, a cross-fade between static pictures is also simple to set
up:

    $('#placeholder').crossSlide({
      sleep: 2,
      fade: 1
    }, [
      { src: 'picture1.jpeg' },
      { src: 'picture2.jpeg' },
      { src: 'picture3.jpeg' },
      { src: 'picture4.jpeg' }
    ]);

`#placeholder` is the block-level element (such as a `div`) whose contents will
be replaced with the animation. What you put inside it in your HTML is only
shown while the images are being preloaded, or if the user-agent has JavaScript
turned off. The current version of CrossSlide waits until all the images are
preloaded before starting the slideshow, so I usually put the first image as a
static background-image of the div too, so that users with a slow connection
won't see a big hole in the website while all the images are being loaded.

The first parameter to the `crossSlide()` function call is a dictionary of
options, which will be explained by example throughout this document. The
second parameter is an array of objects, defining the sequence of pictures,
each with its source path and various attributes.

To get this first kind of effect you must specify `sleep`, which is the time
every image will stay fixed on screen, and `fade`, the time taken by each
cross-fade animation between consecutive images. Both are expressed in seconds
and can accept decimal values.

Slide and cross-fade
--------------------

This is the kind of animation from which the plugin takes its name. It shows a
sequence of pictures moving at a constant speed in alternating directions, with
a cross-fade effect between any two pictures.

Here is the jQuery code to set it up:

    $('#placeholder').crossSlide({
      speed: 45,
      fade: 1
    }, [
      { src: 'picture1.jpeg' dir: 'up'   },
      { src: 'picture2.jpeg' dir: 'down' },
      { src: 'picture3.jpeg' dir: 'up'   },
      { src: 'picture4.jpeg' dir: 'down' }
    ]);

Notice how the `speed` parameter, expressed in pixels/second, has taken the
place of `sleep`, as the images aren't static anymore, but move with constant
speed. `fade` is still required and still expressed in seconds. You cannot use
both `speed` and `sleep` at the same time, because they trigger different
effects.

Additionally you have to specify the direction in which each image should be
moving. The plugin computes the rest, panning each image edge-to-egde at the
desired speed, in the desired direction. `dir` must be one of `up`, `down`,
`left` or `right`. For best results I recommend using an even number of
pictures and alternating directions, as in the example.

Ken Burns effect
----------------

Finally, CrossSlide can be brought up to the full visual power of a Ken Burns
effect: panning, zooming and fading each image to specific points, to guide the
eye of the viewer and convey meaning:

    $('#placeholder').crossSlide({
      fade: 1
    }, [
      {
        src:  'picture1.jpeg',
        from: '100% 80% 1x',
        to:   '100% 0% 0.7x',
        time: 3,
        href: 'http://website.com/some/url'
      }, {
        src:  'picture2.jpeg',
        from: 'top left',
        to:   'bottom right 0.5x',
        time: 2,
        href: 'http://website.com/some/url'
      }, {
        src:  'picture3.jpeg',
        from: '100% 80% 0.5x',
        to:   '80% 0% 1x',
        time: 2,
        href: 'http://website.com/some/url'
      }, {
        src:  'picture4.jpeg',
        from: '100% 50%',
        to:   '30% 50% 0.5x',
        time: 2,
        href: 'http://website.com/some/url'
      }
    ]);

Every picture's pan & zoom effect will last for `time` seconds plus the two
cross-fades, each taking an additional `fade` seconds. `from` and `to` define
the starting and ending points of the effect, including the cross-fade part.
They represent a background-position value, following the syntax of the CSS
property of the same name, plus an optional zoom factor. The zoom defaults to
1x if not provided. The background-position part only accepts keywords and
percent values, lengths are not supported. As in CSS, the percentages are
interpreted as horizontal followed by vertical, while the keywords can be put
in any order.

Every picture can be made a hyperlink, by adding a `href` parameter with a
relative or absolute URI. You can also add an `onclick` parameter, pointing to
a function that will handle click events. These options work in all the other
CrossSlide modes too.

Other options you can put in the first dictionary are: `loop` (numeric) to have
the animation loop just once, or a fixed number of times, and then stop;
`shuffle` (boolean) to have CrossSlide automatically shuffle the images before
starting the slideshow; and `doubleFade` (boolean) to have both a fade-out and
a fade-in effect when switching images (this is useful with transparent
images.)

Performance
-----------

This kind of effect relies on the browser for positioning, scaling and cropping
images, through CSS and the DOM. Thus it depends heavily on how the browser and
the underlying graphics platform optimize these operations. Compared to native
implementations of the same effects, CrossSlide is quite CPU-intensive, but
recent hardware handles a moderate usage without problems. A few combinations
of browsers and platforms seem to be less optimized than others, namely Firefox
on Mac OS X and Linux. Every other combination I've tested shows decent
performance: Firefox on Windows; Internet Explorer, Safari, Opera and Chrome.

Some browsers on some platforms apply a nice anti-alias filter to the images
when you use a zoom factor in the Ken Burns mode, but most don't. Therefore I
suggest keeping your zoom factors below 1x, in order to at least avoid ugly
'pixel mosaic' effects.

Newbie HOWTO
------------

Here is how to put CrossSlide in your website in four simple steps!

1.  Include the jQuery library and my plugin in the `head` section of your
    website:

        <script src="jquery.js"></script>
        <script src="jquery.cross-slide.js"></script>

2.  Put a block element somewhere in your page and give it an `id`:

        <div id="slideshow"></div>

3.  Make sure the element has a fixed size, even when emptied of its contents,
    for example by putting this piece of CSS in your webisite stylesheet:

        #slideshow {
          width: 600px;
          height: 200px;
        }

4.  Open a script tag, define a "document ready handler" (see the jQuery
    tutorial if you wonder what it means) and call my plugin on the `div` you
    created at step 2:

        <script>
          $(function() {
            $('#slideshow').crossSlide({
              sleep: 2,
              fade: 1
            }, [
              { src: 'test1.jpg' },
              { src: 'test2.jpg' },
              { src: 'test3.jpg' },
              { src: 'test4.jpg' }
            ])
          });
        </script>

Things to keep in mind:

* Keep an eye on the Error console (in Firefox it's under Tools menu) because
  that's where my script will post any error messages you are supposed to read,
  for example when the options you use don't make sense together.

* Make sure the browser can find the images you reference in the `src`
  attributes, relative to the path of the current page, because if the browser
  cannot load them, my plugin has no way to know and will just hangs there,
  without any error messages.

* Don't put a comma after the last element in an array or object (this means
  don't put a comma just before a closing brace or bracket, even if it's on the
  previous line) because Internet Explorer won't like it and will refuse to run
  the script, again without any error message.
