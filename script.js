$(function() {
	var $test1 = $('#test1'),
		$test2 = $('#test2'),
		$test3 = $('#test3'),
		$caption = $('div.caption'),
		$pause = $('#pause'),
		$resume = $('#resume'),
		$freeze = $('#freeze'),
		$stop = $('#stop'),
		$restart = $('#restart'),
		captions = ['Sand Castle', 'Sunflower', 'Flip Flops', 'Rubber Ring'],
		STOP = 1, RUN = 2, PAUSE = 3;

	$test1.crossSlide({
		sleep: 2,
		fade: 1
	}, [
		{ src: 'sand-castle.jpeg' },
		{ src: 'sunflower.jpeg'   },
		{ src: 'flip-flops.jpeg'  },
		{ src: 'rubber-ring.jpeg' }
	]);

	$test2.crossSlide({
		speed: 45,
		fade: 1
	}, [
		{ src: 'sand-castle.jpeg', dir: 'up'   },
		{ src: 'sunflower.jpeg',   dir: 'down' },
		{ src: 'flip-flops.jpeg',  dir: 'up'   },
		{ src: 'rubber-ring.jpeg', dir: 'down' }
	]);

	$test3.crossSlide({
		fade: 1
	}, [
		{
			src:  'sand-castle.jpeg',
			from: '100% 80% 1x',
			to:   '100% 0% 1.7x',
			time: 3
		}, {
			src:  'sunflower.jpeg',
			from: 'top left',
			to:   'bottom right 1.5x',
			time: 2
		}, {
			src:  'flip-flops.jpeg',
			from: '100% 80% 1.5x',
			to:   '80% 0% 1.1x',
			time: 2
		}, {
			src:  'rubber-ring.jpeg',
			from: '100% 50%',
			to:   '30% 50% 1.5x',
			time: 2
		}
	], function(idx, img, idxOut, imgOut) {
		if (idxOut == undefined) {
			$caption.text(captions[idx]).animate({ opacity: .7 })
		} else {
			$caption.animate({ opacity: 0 })
		}
	});
	$caption.show().css({ opacity: 0 })

	function state(state) {
		$pause.attr('disabled', state != RUN);
		$resume.attr('disabled', state != PAUSE);
		$freeze.attr('disabled', state == STOP);
		$stop.attr('disabled', state == STOP);
	}
	state(RUN);

	$pause.click(function() {
		$test3.crossSlidePause();
		state(PAUSE);
	});

	$resume.click(function() {
		$test3.crossSlideResume();
		state(RUN);
	})

	$freeze.click(function() {
		$test3.crossSlideFreeze();
		state(STOP);
	});

	$stop.click(function() {
		$test3.crossSlideStop();
		$caption.css({ opacity: 0 })
		state(STOP);
	});

	$restart.click(function() {
		$test3.crossSlideRestart();
		state(RUN);
	});
});
