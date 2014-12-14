// Data structure for multi-dimensional data.
define(function() {
	function KDTree(initialPoints) {
		// construction function
		var build = function (points, depth) {
			if (points.length == 0) {
				// TODO: do something better here
				return null;
			}

			// number of dimensions
			this.k = initialPoints[0].location.length;

			var axis = depth % this.k;

			// Choose median by axis.
			points.sort(function(a, b) {
				return a.location[axis] - b.location[axis];
			});

			// console.log("Sorted: " + points.map(function (elt) { return elt.location; }).join("; "));

			var pivotIndex = Math.floor(points.length / 2);
			var pivot = points[pivotIndex];

			var node = {
				item: 		pivot,
				leftChild: 	build(points.slice(0, pivotIndex), 
								  depth + 1),
				rightChild: build(points.slice(pivotIndex + 1, points.length), 
								  depth + 1)
			};

			return node;
		};

		this.root = build(initialPoints, 0);
	}

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

	KDTree.prototype = {
		// Returns `howMany` nearest neighbors to the point `to`.
		nearestNeighbors: function (to, howMany) {
			var helper = function (currentNode, to, howMany, depth) {
				// Are we at a leaf node?
				if (currentNode.leftChild == null && currentNode.rightChild == null) {
					return [{ 
						item: currentNode.item, 
						distance: squaredDistance(currentNode.item.location, to.location)
					}];
				}

				// Walk down the tree as with insertion.
				var axis = depth % this.k;

				var best = [];
				if (to.location[axis] < currentNode.item.location[axis] && currentNode.leftChild) {
					// console.log("LEFT: Axis " + axis + ": " + to.location.join("•") + ", " + currentNode.item.location.join("•"));

					best = helper(currentNode.leftChild, to, howMany, depth + 1);
				} else if (currentNode.rightChild) {
					// console.log("RIGHT: Axis " + axis + ": " + to.location.join("•") + ", " + currentNode.item.location.join("•"));

					best = helper(currentNode.rightChild, to, howMany, depth + 1);
				}

				// If there are fewer than `howMany` current bests, or
				//   if this node is closer than the farthest of the current best...
				var currentNodeDistance = squaredDistance(currentNode.item.location, to.location);
				if (best.length < howMany || currentNodeDistance < best[best.length - 1].distance) {
					/* --- I THINK THE PROBLEM IS IN THIS BLOCK ---*/
					// All the failing tests hit this block; all the successful tests do not.

					// Something I noticed is that printing `best` here...
					// console.log(best)
					// (continued below)

					// Put it in the current best.
					best.push({ 
						item: currentNode.item, 
						distance: currentNodeDistance 
					});

					// ... and then printing it a second time...
					// console.log(best)
					// ... will show that two objects were added to the array, when there should only be one object added.

					// Resort, resize.
					best.sort(function(a, b) {
						a.distance - b.distance;
					});

					if (best.length > howMany) {
						best = best.slice(0, howMany);
					}
				}

				// If we need to search the other side of the node...
				if (Math.abs(to.location[axis] - currentNode.item.location[axis]) > best[length - 1]) {
					var alternateBest;
					if (to.location[axis] < currentNode.item.location[axis] && currentNode.rightChild) {
						alternateBest = helper(currentNode.rightChild, to, howMany, depth + 1);
					} else if (currentNode.leftChild) {
						alternateBest = helper(currentNode.leftChild, to, howMany, depth + 1);
					}
					best = best.concat(alternateBest);

					// Resort, resize.
					best.sort(function(a, b) {
						a.distance - b.distance;
					});
					best = best.slice(0, howMany);
				}

				return best;
			};

			return helper(this.root, to, howMany, 0).map(function(elt) { return elt.item; });
		},

		printNodes: function() {
			var helper = function(currentNode, depth) {
				var llocation = currentNode.leftChild ? currentNode.leftChild.item.location : "none";
				var rlocation = currentNode.rightChild ? currentNode.rightChild.item.location : "none";
				console.log(depth + ": " + currentNode.item.location + ": [ " + llocation + ", " + rlocation + " ]");

				if (currentNode.leftChild) {
					helper(currentNode.leftChild, depth + 1);
				}
				if (currentNode.rightChild) {
					helper(currentNode.rightChild, depth + 1);
				}
			}

			helper(this.root, 0);
		}
	};

	return KDTree;
});