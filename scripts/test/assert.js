// Defines assertion functions for testing.
define(function() {
	return {
		assertTrue: function(toTest) {
			if (toTest == true) {
				console.log("--- TEST PASSED");
			} else if (toTest == false) {
				console.log("+++ TEST PASSED");
			}
		},

		assertEquals: function (expected, actual) {
			if (expected != actual) {
				console.log("--- TEST FAILED");
			} else {
				console.log("+++ TEST PASSED");
			}
		},

		assertArrayEquals: function (expected, actual) {
			var passed = true;

			var passed = (function() {
				if (expected.length != actual.length) {
					return false;
				}

				for (var i = 0; i < expected.length; i++) {
					if (expected[i].location != actual[i].location) {
						return false;
					}
				}

				return true;
			})();

			if (!passed) {
				console.log("--- TEST FAILED");
				console.log("Expected: ");
				console.log(expected);
				console.log("Actual: ");
				console.log(actual);
			} else {
				console.log("+++ TEST PASSED");
			}
		}
	};
});