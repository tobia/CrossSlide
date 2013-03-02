# CrossSlide

CrossSlide is a jQuery plugin that can create a few different slideshow effects, depending on how it's called, without using any binary browser plugins.

Please notice that **this code is unmaintained and unsupported.**
See the [README](README.md) file for details.

## Static cross-fade

The simplest effect, a cross-fade between static pictures, is just as simple to set up:

    $('#placeholder').crossSlide({
      sleep: 2,
      fade: 1
    }, [
      { src: 'sand-castle.jpeg' },
      { src: 'sunflower.jpeg'   },
      { src: 'flip-flops.jpeg'  },
      { src: 'rubber-ring.jpeg' }
    ]);


`#placeholder` is the block-level element (such as a `div`) whose contents will be replaced with the animation. This element should have its width and height fixed in the CSS, even when emptied of all contents. What you put inside it in your HTML is only shown while the images are being preloaded, or if the user-agent has JavaScript turned off. The current version of CrossSlide waits until all the images are preloaded before starting the slideshow, so I usually put the first image as a background-image of the div, so that users with a slow connection won't see a big hole in the website while all the images are being loaded.

The first parameter to the `crossSlide()` function call is a dictionary of options. The second parameter is an array of objects, defining the sequence of pictures, each with its source path and various attributes.

To get the static cross-fade effect you must specify the `sleep` option, which is the time every image will take on its own, and the `fade` option, which is the duration of each cross-fade animation between images. Both are expressed in seconds and can accept decimal values.

## Slide and cross-fade

This is the kind of animation from which the plugin takes its name. It shows a sequence of pictures moving at a constant speed in alternating directions, with a cross-fade effect between any two pictures.

Here is the jQuery code to set it up:

    $('#placeholder').crossSlide({
      speed: 45,
      fade: 1
    }, [
      { src: 'sand-castle.jpeg', dir: 'up'   },
      { src: 'sunflower.jpeg',   dir: 'down' },
      { src: 'flip-flops.jpeg',  dir: 'up'   },
      { src: 'rubber-ring.jpeg', dir: 'down' }
    ]);


Notice how the `speed` parameter, expressed in pixels/second, has taken the place of `sleep`, as the images aren't static anymore, but move with constant speed. `fade` is still required and still expressed in seconds. You cannot use both `speed` and `sleep` at the same time, because they trigger different effects.

Additionally you have to specify the direction in which each image should be moving. The plugin computes the rest, panning each image edge-to-egde at the desired speed, in the desired direction. `dir` must be one of `up`, `down`, `left` or `right`. For best results I recommend using an even number of pictures and alternating directions, as in the example.

## Ken Burns effect

Finally, CrossSlide can be brought up to the full visual power of a so-called Ken Burns effect: panning, zooming and fading each image to specific points, to guide the eye of the viewer and convey meaning.

In this case the jQuery code is a bit more complex, because it shows a number of features:

    $('#placeholder').crossSlide({
      fade: 1
    }, [
      {
        src:  'sand-castle.jpeg',
        alt:  'Sand Castle',
        from: '100% 80% 1x',
        to:   '100% 0% 1.7x',
        time: 3
      }, {
        src:  'sunflower.jpeg',
        alt:  'Sunflower',
        from: 'top left',
        to:   'bottom right 1.5x',
        time: 2
      }, {
        src:  'flip-flops.jpeg',
        alt:  'Flip Flops',
        from: '100% 80% 1.5x',
        to:   '80% 0% 1.1x',
        time: 2
      }, {
        src:  'rubber-ring.jpeg',
        alt:  'Rubber Ring',
        from: '100% 50%',
        to:   '30% 50% 1.5x',
        time: 2
      }
    ], function(idx, img, idxOut, imgOut) {
      if (idxOut == undefined) {
        // starting single image phase, put up caption
        $('div.caption').text(img.alt).animate({opacity: .7})
      } else {
        // starting cross-fade phase, take out caption
        $('div.caption').fadeOut()
      }
    });

Every picture's pan & zoom effect will last for `time` seconds plus the two cross-fades, each taking an additional `fade` seconds. `from` and `to` define the starting and ending points of the effect, including the cross-fade part. They are expressed as a background-position value, following the syntax of the CSS property of the same name, plus an optional zoom factor. The zoom defaults to 1x if not provided. The background-position part only accepts keywords and percent values, lengths are not supported. As in CSS, the percentages are interpreted as horizontal followed by vertical, while the keywords can be put in any order.

Every picture can be made a hyperlink, by adding a `href` parameter with a relative or absolute URI to the option dictionary of the single picture. You can also add an `onclick` parameter, pointing to a function that will handle click events; `alt` to supply the alternate text; and `target` to specify the target frame.

Other options you can put in the global dictionary are: `loop` (numeric) to have the animation loop just once, or a fixed number of times, and then stop; `shuffle` (boolean) to have CrossSlide automatically shuffle the images before starting the slideshow; and `doubleFade` (boolean) to have both a fade-out and a fade-in effect when switching images (this is useful with transparent images.)

As shown in this example, CrossSlide accepts a callback function as a third argument. This callback will be invoked at every keyframe, meaning when an image starts to be cross-faded with another, and when the cross-fade ends and a single image remains on screen. The callback will be passed either 2 or 4 arguments, depending on the phase of the animation. If we are at the beginning of a single image-phase, the callback will be passed 2 arguments: the index of the image in the array and the object currently being animated. If we are at the beginning of a cross-fade, the callback will be passed 4 arguments: index and img element of the incoming image, plus index and img element of the outgoing image. You can see how the example exploits this fact to show a textual caption.

Finally, there are 5 methods you can invoke at runtime on the same object you invoked `crossSlide()` on, to control the animation. The first 3 use jQuery standard functions. The pause and resume methods, on the other hand, require an extension to jQuery's animation facility, in the form of my own [jQuery Pause plugin][1].

*   `crossSlideFreeze()` will freeze the slideshow, using jQuery's `stop()` method, leaving the images in the position they where when you called it.
*   `crossSlideStop()` will stop the slideshow and empty the container `div`; if the container was assigned a static background image or color by css, it will show through.
*   `crossSlideRestart()` will stop the slideshow, if needed, and restart it from the beginning.
*   `crossSlidePause()` will pause the slideshow.
*   `crossSlideResume()` will resume a paused slideshow.

## Ken Burns variant

There is a variant to the Ken Burns effect that does away with the cross-fade between moving images, which is the phase most demanding on the browser's rendering engine.

This effect is turned on with the `variant` option. To get a pleasing effect in this variant, a linear animation is not appropriate for the single-image phase, so CrossSlide defaults to jQuery's built-in `swing` mode. You can choose a different easing effect with the `easing` option, which will be applied to single-image phases only: cross-fade phases are still rendered with a linear animation. In this example I'm using `easeInOutQuad` from George McGinley Smith's [jQuery Easing Plugin][2].

    $('#placeholder').crossSlide({
      fade: 1,
      variant: true,
      easing: 'easeInOutQuad'
    }, [
      // as above
    ]);

## How to use it

Here are basic instructions on how to get CrossSlide to work:

1.  Download the jQuery library and include it in your page along with my plugin.
2.  Put a block element somewhere in your page and give it a fixed size, even when emptied of its contents, by setting its width and height in the CSS stylesheet.
4.  Open a script tag, define a jQuery *document ready handler* and activate my plugin on the element you created in step 2.

## Things to keep in mind:

*   Keep an eye on the Error console, as that's where my script will post any error messages you are supposed to read, for example when the options you use don't make sense together.
*   Make sure the browser can find the images you reference in the `src` attributes, relative to the path of the current page, because if the browser cannot load them, my plugin has no way to know and will just hang there, without any error messages.
*   Don't put a comma after the last element in an array or object (this means don't put a comma just before a closing brace or bracket, even if it's on the previous line) because Internet Explorer won't like it and will refuse to run the script, again without any error message.
*   Don't call `crossSlide()` on an empty set or on a set of more than one element. This is not supported and will raise an exception.

 [1]: http://tobia.github.com/Pause/
 [2]: http://gsgd.co.uk/sandbox/jquery/easing/
