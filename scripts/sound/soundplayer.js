// Base object for audio playback.
define(function() {
	function soundplayer(file) {
		this.audio = new Audio(file);
	}

	soundplayer.prototype = {
		play: function() {
			this.audio.play();
		},

		stop: function() {
			this.audio.pause();
		},

		audio: function() {
			this.audio;
		}
	};

	return soundplayer;
});