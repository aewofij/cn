// Unit tests for util/kdtree.js

require(["util/kdtree", "test/assert"], function (KDTree, assert) {
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

	function nnNaive(pointlist, pt) {
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
	}

	function multiNnNaive(pointlist, pt, howMany) {
		var result = [];
		for (var i = 0; i < howMany; i++) {
			var nn = nnNaive(pointlist, pt);
			result.push(nn);

			// remove the last calculated nearest neighbor
			pointlist = pointlist.slice(0, pointlist.indexOf(nn))
								 .concat(pointlist.slice(pointlist.indexOf(nn) + 1, pointlist.length));
		}
		return result;
	}

	function testOne(pointlist) {
		var to = { location: [Math.random() * 100, 
							  Math.random() * 100, 
							  Math.random() * 100] };
		var kdt = new KDTree(pointlist);

		var expected = nnNaive(pointlist, to);
		var actual = kdt.nearestNeighbors(to, 1)[0];

		assert.assertEquals(expected, actual);
	}

	function testN(pointlist, n) {
		var to = { location: [Math.random() * 100, 
							  Math.random() * 100, 
							  Math.random() * 100] };
		var kdt = new KDTree(pointlist);

		var expected = multiNnNaive(pointlist, to, n);
		var actual = kdt.nearestNeighbors(to, n);

		// console.log("TO: " + to.location.join(", "));
		assert.assertArrayEquals(expected, actual);
	}

	for (var j = 0; j < 50; j++) {
		var random = [];
		for (var i = 0; i < 50; i++) {
			random.push({ location: [ Math.random() * 100, 
									  Math.random() * 100, 
									  Math.random() * 100 ] });
		};
		testOne(random);
	}

	for (var j = 0; j < 50; j++) {
		var random = [];
		for (var i = 0; i < 50; i++) {
			random.push({ location: [ Math.random() * 100, 
									  Math.random() * 100, 
									  Math.random() * 100 ] });
		};
		testN(random, 5);
	}
});