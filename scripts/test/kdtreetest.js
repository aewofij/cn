// Unit tests for util/kdtree.js

require(["util/kdtree"], function (KDTree) {
	function squaredDistance (a, b) {
		if (a.length != b.length) {
			console.log("ERROR: Dimension mismatch.");
			return;
		}

		var result = 0;

		for (var i = a.length - 1; i >= 0; i--) {
			result += (a[i] - b[i]) * (a[i] - b[i]);
		};

		return result;
	}

	var nnNaive = function (pointlist, pt) {
		var closest = { item: null, distance: Infinity };

		for (var i = pointlist.length - 1; i >= 0; i--) {
			var d = squaredDistance(pointlist[i].location, pt.location);
			if (d < closest.distance) {
				closest = { 
					item: pointlist[i], 
					distance: d 
				};
			}
		};

		return closest.item;
	};

	function test(pointlist) {
		var to = { location: [Math.random() * 100, 
							  Math.random() * 100, 
							  Math.random() * 100] };
		var kdt = new KDTree(pointlist);

		var expected = nnNaive(pointlist, to);
		var actual = kdt.nearestNeighbors(to, 1)[0];

		if (expected != actual) {
			console.log("--- TEST FAILED");
			console.log("To point: " + to.location.join(" "));
			console.log("\tExpected: " + (expected.location ? expected.location.join(" ") : "null") + "(" + squaredDistance(expected.location, to.location) + ")");
			console.log("\tActual: " + (actual.location ? actual.location.join(" ") : "null") + "(" + squaredDistance(actual.location, to.location) + ")");
		} else {
			console.log("+++ TEST PASSED");
		}
	}

	var a = [
		{ location: [1,2,3] },
		{ location: [12,1,3] },
		{ location: [34,3,3] },
		{ location: [-5,2,3] },
		{ location: [12,1,3] },
		{ location: [34,3,3] },
		{ location: [-5,2,3] },
		{ location: [3,1,3] },
		{ location: [354,3,3] },
		{ location: [-5,2,3] },
		{ location: [12,177,3] },
		{ location: [34,3,-43] },
		{ location: [-5,2,33] },
		{ location: [1,25,3] }
	];
	test(a);

	for (var j = 0; j < 50; j++) {
		var random = [];
		for (var i = 0; i < 50; i++) {
			random.push({ location: [ Math.random() * 100, 
									  Math.random() * 100, 
									  Math.random() * 100 ] });
		};
		test(random);
	}
});