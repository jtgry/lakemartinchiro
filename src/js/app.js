// Equivalent of jQuery .ready
document.addEventListener('DOMContentLoaded', function () {

	// Initialize variables
	var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop; // Scroll position of body

	// Listener to resizes
	window.onresize = function (event) {
		lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
	};

	// Helper functions
	// Detect offset of element
	function getOffset(el) {
		var _x = 0;
		var _y = 0;
		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return {
			top: _y,
			left: _x
		};
	};

	// Add class to element => https://www.sitepoint.com/add-remove-css-class-vanilla-js/
	function addNewClass(elements, myClass) {
		// if there are no elements, we're done
		if (!elements) {
			return;
		}
		// if we have a selector, get the chosen elements
		if (typeof (elements) === 'string') {
			elements = document.querySelectorAll(elements);
		}
		// if we have a single DOM element, make it an array to simplify behavior
		else if (elements.tagName) {
			elements = [elements];
		}
		// add class to all chosen elements
		for (var i = 0; i < elements.length; i++) {
			// if class is not already found
			if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) {
				// add class
				elements[i].className += ' ' + myClass;
			}
		}
	};

	// Remove class from element => https://www.sitepoint.com/add-remove-css-class-vanilla-js/
	function removeClass(elements, myClass) {
		// if there are no elements, we're done
		if (!elements) {
			return;
		}

		// if we have a selector, get the chosen elements
		if (typeof (elements) === 'string') {
			elements = document.querySelectorAll(elements);
		}
		// if we have a single DOM element, make it an array to simplify behavior
		else if (elements.tagName) {
			elements = [elements];
		}
		// create pattern to find class name
		var reg = new RegExp('(^| )' + myClass + '($| )', 'g');
		// remove class from all chosen elements
		for (var i = 0; i < elements.length; i++) {
			elements[i].className = elements[i].className.replace(reg, ' ');
		}
	}

	// Smooth scrolling => https://codepen.io/andylobban/pen/qOLKVW
	if ('querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
		// Function to animate the scroll
		var smoothScroll = function (anchor, duration) {
			// Calculate how far and how fast to scroll
			var startLocation = window.pageYOffset;
			var endLocation = anchor.offsetTop - 40; // Remove 40 pixels for padding
			var distance = endLocation - startLocation;
			var increments = distance / (duration / 16);
			var stopAnimation;
			// Scroll the page by an increment, and check if it's time to stop
			var animateScroll = function () {
				window.scrollBy(0, increments);
				stopAnimation();
			};
			// If scrolling down
			if (increments >= 0) {
				// Stop animation when you reach the anchor OR the bottom of the page
				stopAnimation = function () {
					var travelled = window.pageYOffset;
					if ((travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight)) {
						clearInterval(runAnimation);
					}
				};
			}
			// Loop the animation function
			var runAnimation = setInterval(animateScroll, 16);
		};
		// Define smooth scroll links
		var scrollToggle = document.querySelectorAll('.scroll');
		// For each smooth scroll link
		[].forEach.call(scrollToggle, function (toggle) {
			// When the smooth scroll link is clicked
			toggle.addEventListener('click', function (e) {
				// Prevent the default link behavior
				e.preventDefault();
				// Get anchor link and calculate distance from the top
				var dataTarget = document.querySelector('.landing__section');
				var dataSpeed = toggle.getAttribute('data-speed');
				// If the anchor exists
				if (dataTarget) {
					// Scroll to the anchor
					smoothScroll(dataTarget, dataSpeed || 700);
				}
			}, false);
		});
	}


	// Listen to scroll position changes
	window.addEventListener("scroll", function () {

		// NAVIGATION BAR ON LANDING FIXED
		// If there is a #navConverter element then attach listener to scroll events
		if (document.body.contains(document.getElementById("navConverter"))) {
			var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
			// if the current body position is less than 20 pixels away from our converter, convert
			if (lastScrollTop > (getOffset(document.getElementById('navConverter')).top - 60)) {
				removeClass(document.querySelector('.navbar'), 'navbar--extended');
			} else {
				addNewClass(document.querySelector('.navbar'), 'navbar--extended');
			}
		}

		// SCROLL TO NEXT ELEMENT ON LANDING
		if (document.body.contains(document.getElementById('scrollToNext'))) {
			var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
			// if the current body position is less than 20 pixels away from the top, hide the icon
			if (lastScrollTop > 20) {
				addNewClass(document.getElementById('scrollToNext'), 'invisible');
			} else {
				removeClass(document.getElementById('scrollToNext'), 'invisible');
			}
		}
	});
});
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f()
	} else if (typeof define === "function" && define.amd) {
		define([], f)
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window
		} else if (typeof global !== "undefined") {
			g = global
		} else if (typeof self !== "undefined") {
			g = self
		} else {
			g = this
		}
		g.flexibility = f()
	}
})(function () {
	var define, module, exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a) return a(o, !0);
					if (i) return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw f.code = "MODULE_NOT_FOUND", f
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e)
				}, l, l.exports, e, t, n, r)
			}
			return n[o].exports
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++) s(r[o]);
		return s
	})({
		1: [function (require, module, exports) {
			module.exports = function alignContent(target) {
				var start;
				var factor;

				if (target.lines.length < 2 || target.alignContent === 'stretch') {
					factor = target.crossSpace / target.lines.length;
					start = 0;

					target.lines.forEach(function (line) {
						line.crossStart = start;
						line.cross += factor;

						start += line.cross;
					});
				} else if (target.alignContent === 'flex-start') {
					start = 0;

					target.lines.forEach(function (line) {
						line.crossStart = start;

						start += line.cross;
					});
				} else if (target.alignContent === 'flex-end') {
					start = target.crossSpace;

					target.lines.forEach(function (line) {
						line.crossStart = start;

						start += line.cross;
					});
				} else if (target.alignContent === 'center') {
					start = target.crossSpace / 2;

					target.lines.forEach(function (line) {
						line.crossStart = start;

						start += line.cross;
					});
				} else if (target.alignContent === 'space-between') {
					factor = target.crossSpace / (target.lines.length - 1);
					start = 0;

					target.lines.forEach(function (line) {
						line.crossStart = start;

						start += line.cross + factor;
					});
				} else if (target.alignContent === 'space-around') {
					factor = target.crossSpace * 2 / (target.lines.length * 2);
					start = factor / 2;

					target.lines.forEach(function (line) {
						line.crossStart = start;

						start += line.cross + factor;
					});
				} else if (target.alignContent === 'stretch') {
					factor = target.crossSpace / target.lines.length;
					start = 0;

					target.lines.forEach(function (line) {
						line.crossStart = start;
						line.cross += factor;

						start += line.cross;
					});
				}
			};

		}, {}],
		2: [function (require, module, exports) {
			module.exports = function alignItems(target) {
				target.lines.forEach(function (line) {
					line.children.forEach(function (child) {
						if (child.alignSelf === 'flex-start') {
							child.crossStart = line.crossStart;
						} else if (child.alignSelf === 'flex-end') {
							child.crossStart = line.crossStart + line.cross - child.crossAround;
						} else if (child.alignSelf === 'center') {
							child.crossStart = line.crossStart + (line.cross - child.crossAround) / 2;
						} else if (child.alignSelf === 'stretch') {
							child.crossStart = line.crossStart;
							child.crossAround = line.cross;
						}
					});
				});
			};

		}, {}],
		3: [function (require, module, exports) {
			module.exports = function flexDirection(target, targetFlexDirection, targetAlignItems) {
				var clientRect = target.node.getBoundingClientRect();

				if (targetFlexDirection === 'row' || targetFlexDirection === 'row-reverse') {
					target.mainAxis = 'inline';
					target.crossAxis = 'block';

					if (typeof target.main === 'number' || typeof target.cross === 'number') {
						if (target.flexDirection === 'row' || targetFlexDirection === 'row-reverse') {
							target.width = target.main;
							target.height = target.cross;
						} else {
							target.width = target.cross;
							target.height = target.main;
						}
					}

					target.main = target.width;
					target.cross = target.height;

					target.mainClient = clientRect.width || target.node.offsetWidth;
					target.crossClient = clientRect.height || target.node.offsetHeight;

					target.mainBefore = target.marginLeft;
					target.mainAfter = target.marginRight;
					target.crossBefore = target.marginTop;
					target.crossAfter = target.marginBottom;
				} else {
					target.mainAxis = 'block';
					target.crossAxis = 'inline';

					target.main = target.height;
					target.cross = target.width;

					if (typeof target.main === 'number' || typeof target.cross === 'number') {
						if (target.flexDirection === 'column' || targetFlexDirection === 'column-reverse') {
							target.width = target.cross;
							target.height = target.main;
						} else {
							target.width = target.main;
							target.height = target.cross;
						}
					}

					target.mainClient = clientRect.height || target.node.offsetHeight;
					target.crossClient = clientRect.width || target.node.offsetWidth;

					target.mainBefore = target.marginTop;
					target.mainAfter = target.marginBottom;
					target.crossBefore = target.marginLeft;
					target.crossAfter = target.marginRight;
				}

				if (typeof target.flexBasis === 'number') {
					target.main = target.flexBasis;
				}

				if (target.main === 'auto') {
					target.mainAround = target.mainClient;
				} else {
					target.mainAround = target.main;
				}

				if (target.cross === 'auto') {
					target.crossAround = target.crossClient;
				} else {
					target.crossAround = target.cross;
				}

				if (typeof target.mainBefore === 'number') {
					target.mainAround += target.mainBefore;
				}

				if (typeof target.mainAfter === 'number') {
					target.mainAround += target.mainAfter;
				}

				if (typeof target.crossBefore === 'number') {
					target.crossAround += target.crossBefore;
				}

				if (typeof target.crossBefore === 'number') {
					target.crossAround += target.crossBefore;
				}

				if (target.alignSelf === 'auto') {
					target.alignSelf = targetAlignItems;
				}
			};

		}, {}],
		4: [function (require, module, exports) {
			module.exports = function flexGrow(line) {
				if (line.mainSpace > 0) {
					var growFactor = line.children.reduce(function (lastGrowFactor, child) {
						return lastGrowFactor + child.flexGrow;
					}, 0);

					if (growFactor > 0) {
						line.children.forEach(function (child) {
							child.mainAround += child.flexGrow / growFactor * line.mainSpace;
						});

						line.main = line.children.reduce(function (main, child) {
							return main + child.mainAround;
						}, 0);

						line.mainSpace = 0;
					}
				}
			};

		}, {}],
		5: [function (require, module, exports) {
			module.exports = function flexShrink(line) {
				if (line.mainSpace < 0) {
					var shrinkFactor = line.children.reduce(function (lastShrinkFactor, child) {
						return lastShrinkFactor + child.flexShrink;
					}, 0);

					if (shrinkFactor > 0) {
						line.children.forEach(function (child) {
							child.mainAround += child.flexShrink / shrinkFactor * line.mainSpace;
						});

						line.main = line.children.reduce(function (main, child) {
							return main + child.mainAround;
						}, 0);

						line.mainSpace = 0;
					}
				}
			};

		}, {}],
		6: [function (require, module, exports) {
			module.exports = function flexboxLines(target) {
				var line;

				target.lines = [line = {
					main: 0,
					cross: 0,
					children: []
				}];

				target.children.forEach(function (child) {
					if (
						target.flexWrap === 'nowrap' ||
						line.children.length === 0 ||
						target.mainAround >= line.main + child.mainAround
					) {
						line.main += child.mainAround;
						line.cross = Math.max(line.cross, child.crossAround);
					} else {
						target.lines.push(line = {
							main: child.mainAround,
							cross: child.crossAround,
							children: []
						});
					}

					line.children.push(child);
				});
			};

		}, {}],
		7: [function (require, module, exports) {
			module.exports = function flexbox(target) {
				target.descendants.forEach(function (descendant) {
					module.exports(descendant);
				});

				if (target.display === 'flex') {
					target.children.forEach(function (child) {
						require('./flex-direction')(child, target.flexDirection, target.alignItems);
					});
				} else {
					return target;
				}

				require('./order')(target);
				require('./flex-direction')(target, target.flexDirection, target.alignItems);
				require('./flexbox-lines')(target);

				if (target.main === 'auto') {
					target.main = Math.max(target.mainAround, target.lines.reduce(function (main, line) {
						return Math.max(main, line.main);
					}, 0));

					if (target.flexDirection === 'row') {
						target.mainAround = target.mainClient + target.mainBefore + target.mainAfter;
					} else {
						target.mainAround = target.main + target.mainBefore + target.mainAfter;
					}
				}

				if (target.cross === 'auto') {
					target.cross = target.lines.reduce(function (cross, line) {
						return cross + line.cross;
					}, 0);

					if (target.flexDirection === 'column') {
						target.crossAround = target.crossClient + target.crossBefore + target.crossAfter;
					} else {
						target.crossAround = target.cross + target.crossBefore + target.crossAfter;
					}

					target.crossSpace = target.crossAround - target.cross;
				} else {
					target.crossSpace = target.cross - target.lines.reduce(function (cross, line) {
						return cross + line.cross;
					}, 0);
				}

				require('./align-content')(target);

				target.lines.forEach(function (line) {
					line.mainSpace = target.main - line.main;

					require('./flex-grow')(line);
					require('./flex-shrink')(line);
					require('./margin-main')(line);
					require('./margin-cross')(line);
					require('./justify-content')(line, target.justifyContent);
				});

				require('./align-items')(target);

				return target;
			};

		}, {
			"./align-content": 1,
			"./align-items": 2,
			"./flex-direction": 3,
			"./flex-grow": 4,
			"./flex-shrink": 5,
			"./flexbox-lines": 6,
			"./justify-content": 8,
			"./margin-cross": 9,
			"./margin-main": 10,
			"./order": 11
		}],
		8: [function (require, module, exports) {
			module.exports = function justifyContent(line, targetJustifyContent) {
				var start;
				var factor;

				if (targetJustifyContent === 'flex-start') {
					start = 0;

					line.children.forEach(function (child) {
						child.mainStart = start;

						start += child.mainAround;
					});
				} else if (targetJustifyContent === 'flex-end') {
					start = line.mainSpace;

					line.children.forEach(function (child) {
						child.mainStart = start;

						start += child.mainAround;
					});
				} else if (targetJustifyContent === 'center') {
					start = line.mainSpace / 2;

					line.children.forEach(function (child) {
						child.mainStart = start;

						start += child.mainAround;
					});
				} else if (targetJustifyContent === 'space-between') {
					factor = line.mainSpace / (line.children.length - 1);

					start = 0;

					line.children.forEach(function (child) {
						child.mainStart = start;

						start += child.mainAround + factor;
					});
				} else if (targetJustifyContent === 'space-around') {
					factor = line.mainSpace * 2 / (line.children.length * 2);
					start = factor / 2;

					line.children.forEach(function (child) {
						child.mainStart = start;

						start += child.mainAround + factor;
					});
				}
			};

		}, {}],
		9: [function (require, module, exports) {
			module.exports = function marginCross(line) {
				line.children.forEach(function (child) {
					var count = 0;

					if (child.crossBefore === 'auto') {
						++count;
					}

					if (child.crossAfter === 'auto') {
						++count;
					}

					var childSpace = line.cross - child.crossAround;

					if (child.crossBefore === 'auto') {
						child.crossBefore = childSpace / count;

						child.crossAround += child.crossBefore;
					}

					if (child.crossAfter === 'auto') {
						child.crossAfter = childSpace / count;

						child.crossAround += child.crossAfter;
					}
				});
			};

		}, {}],
		10: [function (require, module, exports) {
			module.exports = function marginCross(line) {
				var count = 0;

				line.children.forEach(function (child) {
					if (child.mainBefore === 'auto') {
						++count;
					}

					if (child.mainAfter === 'auto') {
						++count;
					}
				});

				if (count > 0) {
					line.children.forEach(function (child) {
						if (child.mainBefore === 'auto') {
							child.mainBefore = line.mainSpace / count;

							child.mainAround += child.mainBefore;
						}

						if (child.mainAfter === 'auto') {
							child.mainAfter = line.mainSpace / count;

							child.mainAround += child.mainAfter;
						}
					});

					line.mainSpace = 0;
				}
			};

		}, {}],
		11: [function (require, module, exports) {
			module.exports = function order(target) {
				target.children.sort(function (childA, childB) {
					return childA.order - childB.order || childA.index - childB.index;
				});
			};

		}, {}],
		12: [function (require, module, exports) {
			module.exports = function getFlexStyles(target, data, isFlexChild) {
				var style = Object.assign(data, {
					alignContent: 'stretch',
					alignItems: 'stretch',
					alignSelf: 'auto',
					display: 'inline',
					flexBasis: 'auto',
					flexDirection: 'row',
					flexGrow: 0,
					flexShrink: 1,
					flexWrap: 'nowrap',
					justifyContent: 'flex-start',
					height: 'auto',
					marginTop: 0,
					marginRight: 0,
					marginLeft: 0,
					marginBottom: 0,
					maxHeight: 'none',
					maxWidth: 'none',
					minHeight: 0,
					minWidth: 0,
					order: 0,
					position: 'static',
					width: 'auto'
				});

				if (target.hasAttribute('data-style')) {
					target.setAttribute('style', target.getAttribute('data-style'));
				} else {
					target.setAttribute('data-style', target.getAttribute('style') || '');
				}

				var attr = (target.getAttribute('data-style') || '') + ';' + (target.getAttribute('data-flex') || '');
				var re = /([^\s:;]+)\s*:\s*([^;]+?)\s*(;|$)/g;
				var decl;

				while (decl = re.exec(attr)) {
					var name = decl[1].toLowerCase().replace(/-[a-z]/g, function (match) {
						return match.slice(1).toUpperCase();
					});

					style[name] = parseFloat(decl[2]);

					if (isNaN(style[name])) {
						style[name] = decl[2];
					}
				}

				if (isFlexChild) {
					target.style.display = 'inline-block';
					target.style.position = 'absolute';
				}

				var rect = target.getBoundingClientRect();

				style.clientWidth = rect.width || target.offsetWidth;
				style.clientHeight = rect.height || target.offsetHeight;

				return style;
			};

		}, {}],
		13: [function (require, module, exports) {
			/*! Flexibility 2.0.0 | MIT Licensed | github.com/10up/flexibility */

			module.exports = function flexibility(target) {
				var data1 = module.exports.walk(target);

				var data2 = module.exports.flexbox(data1);

				var data3 = module.exports.write(data2);

				return data3;
			};

			module.exports.flexbox = require('./flexbox');
			module.exports.getFlexStyles = require('./getFlexStyles');
			module.exports.walk = require('./walk');
			module.exports.write = require('./write');

			// module.exports.process = require('./process');
			// module.exports.support = require('./support');

		}, {
			"./flexbox": 7,
			"./getFlexStyles": 12,
			"./walk": 14,
			"./write": 15
		}],
		14: [function (require, module, exports) {
			var getFlexStyles = require('../getFlexStyles');

			module.exports = function walk(target, ancestorData, isFlexChild) {
				var flexContainerRE = /(^|;)\s*display\s*:\s*(inline-)?flex\s*(;|$)/i;
				var isFlexContainer = flexContainerRE.test(target.getAttribute('data-flex'));
				var data = {
					node: target,
					children: [],
					descendants: []
				};

				if (isFlexContainer) {
					if (ancestorData !== undefined) {
						ancestorData.descendants.push(data);
					}
				}

				if (isFlexContainer || !ancestorData) {
					ancestorData = data;
				}

				Array.prototype.forEach.call(target.childNodes, function (childNode) {
					if (isFlexContainer && childNode.nodeType === 3 && childNode.nodeValue.trim()) {
						var oldNode = childNode;

						childNode = target.insertBefore(document.createElement('flex-item'), oldNode);

						childNode.appendChild(oldNode);
					}

					if (childNode.nodeType === 1) {
						var childData = module.exports(childNode, ancestorData, isFlexContainer);

						if (isFlexContainer) {
							data.children.push(childData);
						}
					}
				});

				if (isFlexContainer || isFlexChild) {
					getFlexStyles(target, data, isFlexChild);
				}

				return data;
			};

		}, {
			"../getFlexStyles": 12
		}],
		15: [function (require, module, exports) {
			module.exports = function write(target) {
				target.descendants.filter(function (descendant) {
					return target.children.indexOf(descendant) === -1;
				}).forEach(function (descendant) {
					module.exports(descendant);
				});

				if (!target.display) {
					return;
				}

				var style = target.node.style;

				if ('mainStart' in target) {
					style.position = 'absolute';

					if (target.mainAxis === 'inline') {
						style.left = target.mainStart + 'px';
						style.top = target.crossStart + 'px';

						style.marginTop = target.crossBefore + 'px';
						style.marginRight = target.mainAfter + 'px';
						style.marginBottom = target.crossAfter + 'px';
						style.marginLeft = target.mainBefore + 'px';
					} else {
						style.left = target.crossStart + 'px';
						style.top = target.mainStart + 'px';

						style.marginTop = target.mainBefore + 'px';
						style.marginRight = target.crossAfter + 'px';
						style.marginBottom = target.mainAfter + 'px';
						style.marginLeft = target.crossBefore + 'px';
					}

					if (target.mainAxis === 'inline') {
						style.width = target.mainAround - target.mainBefore - target.mainAfter + 'px';
						style.height = target.crossAround - target.crossBefore - target.crossAfter + 'px';
					} else {
						if (target.cross === 'auto') {
							style.width = target.crossClient - target.crossBefore - target.crossAfter + 'px';
						} else {
							style.width = target.crossAround - target.crossBefore - target.crossAfter + 'px';
						}

						if (target.main === 'auto') {
							style.height = target.mainClient - target.mainBefore - target.mainAfter + 'px';
						} else {
							style.height = target.mainAround - target.mainBefore - target.mainAfter + 'px';
						}
					}
				} else {
					if (!style.position) {
						style.position = 'relative';
					}

					if (target.mainAxis === 'inline') {
						style.width = target.mainAround - target.mainBefore - target.mainAfter + 'px';
						style.height = target.crossAround - target.crossBefore - target.crossAfter + 'px';
					} else {
						style.width = target.crossAround - target.crossBefore - target.crossAfter + 'px';
						style.height = target.mainAround - target.mainBefore - target.mainAfter + 'px';
					}
				}

				if (target.children) {
					target.children.forEach(function (child) {
						module.exports(child);
					});
				}
			};

		}, {}]
	}, {}, [13])(13)
});
/*! responsive-nav.js 1.0.39
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2015 @viljamis
 * Available under the MIT license
 Licensed under the MIT license.

Copyright (c) 2013 Viljami Salminen, http://viljamis.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* global Event */
(function (document, window, index) {
	// Index is used to keep multiple navs on the same page namespaced

	"use strict";

	var responsiveNav = function (el, options) {

		var computed = !!window.getComputedStyle;

		/**
		 * getComputedStyle polyfill for old browsers
		 */
		if (!computed) {
			window.getComputedStyle = function (el) {
				this.el = el;
				this.getPropertyValue = function (prop) {
					var re = /(\-([a-z]){1})/g;
					if (prop === "float") {
						prop = "styleFloat";
					}
					if (re.test(prop)) {
						prop = prop.replace(re, function () {
							return arguments[2].toUpperCase();
						});
					}
					return el.currentStyle[prop] ? el.currentStyle[prop] : null;
				};
				return this;
			};
		}
		/* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */

		/**
		 * Add Event
		 * fn arg can be an object or a function, thanks to handleEvent
		 * read more at: http://www.thecssninja.com/javascript/handleevent
		 *
		 * @param  {element}  element
		 * @param  {event}    event
		 * @param  {Function} fn
		 * @param  {boolean}  bubbling
		 */
		var addEvent = function (el, evt, fn, bubble) {
				if ("addEventListener" in el) {
					// BBOS6 doesn't support handleEvent, catch and polyfill
					try {
						el.addEventListener(evt, fn, bubble);
					} catch (e) {
						if (typeof fn === "object" && fn.handleEvent) {
							el.addEventListener(evt, function (e) {
								// Bind fn as this and set first arg as event object
								fn.handleEvent.call(fn, e);
							}, bubble);
						} else {
							throw e;
						}
					}
				} else if ("attachEvent" in el) {
					// check if the callback is an object and contains handleEvent
					if (typeof fn === "object" && fn.handleEvent) {
						el.attachEvent("on" + evt, function () {
							// Bind fn as this
							fn.handleEvent.call(fn);
						});
					} else {
						el.attachEvent("on" + evt, fn);
					}
				}
			},

			/**
			 * Remove Event
			 *
			 * @param  {element}  element
			 * @param  {event}    event
			 * @param  {Function} fn
			 * @param  {boolean}  bubbling
			 */
			removeEvent = function (el, evt, fn, bubble) {
				if ("removeEventListener" in el) {
					try {
						el.removeEventListener(evt, fn, bubble);
					} catch (e) {
						if (typeof fn === "object" && fn.handleEvent) {
							el.removeEventListener(evt, function (e) {
								fn.handleEvent.call(fn, e);
							}, bubble);
						} else {
							throw e;
						}
					}
				} else if ("detachEvent" in el) {
					if (typeof fn === "object" && fn.handleEvent) {
						el.detachEvent("on" + evt, function () {
							fn.handleEvent.call(fn);
						});
					} else {
						el.detachEvent("on" + evt, fn);
					}
				}
			},

			/**
			 * Get the children of any element
			 *
			 * @param  {element}
			 * @return {array} Returns matching elements in an array
			 */
			getChildren = function (e) {
				if (e.children.length < 1) {
					throw new Error("The Nav container has no containing elements");
				}
				// Store all children in array
				var children = [];
				// Loop through children and store in array if child != TextNode
				for (var i = 0; i < e.children.length; i++) {
					if (e.children[i].nodeType === 1) {
						children.push(e.children[i]);
					}
				}
				return children;
			},

			/**
			 * Sets multiple attributes at once
			 *
			 * @param {element} element
			 * @param {attrs}   attrs
			 */
			setAttributes = function (el, attrs) {
				for (var key in attrs) {
					el.setAttribute(key, attrs[key]);
				}
			},

			/**
			 * Adds a class to any element
			 *
			 * @param {element} element
			 * @param {string}  class
			 */
			addClass = function (el, cls) {
				if (el.className.indexOf(cls) !== 0) {
					el.className += " " + cls;
					el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
				}
			},

			/**
			 * Remove a class from any element
			 *
			 * @param  {element} element
			 * @param  {string}  class
			 */
			removeClass = function (el, cls) {
				var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
				el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
			},

			/**
			 * forEach method that passes back the stuff we need
			 *
			 * @param  {array}    array
			 * @param  {Function} callback
			 * @param  {scope}    scope
			 */
			forEach = function (array, callback, scope) {
				for (var i = 0; i < array.length; i++) {
					callback.call(scope, i, array[i]);
				}
			};

		var nav,
			opts,
			navToggle,
			styleElement = document.createElement("style"),
			htmlEl = document.documentElement,
			hasAnimFinished,
			isMobile,
			navOpen;

		var ResponsiveNav = function (el, options) {
			var i;

			/**
			 * Default options
			 * @type {Object}
			 */
			this.options = {
				animate: true, // Boolean: Use CSS3 transitions, true or false
				transition: 284, // Integer: Speed of the transition, in milliseconds
				label: "Menu", // String: Label for the navigation toggle
				insert: "before", // String: Insert the toggle before or after the navigation
				customToggle: "", // Selector: Specify the ID of a custom toggle
				closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
				openPos: "relative", // String: Position of the opened nav, relative or static
				navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
				navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
				jsClass: "js", // String: 'JS enabled' class which is added to <html> element
				init: function () {}, // Function: Init callback
				open: function () {}, // Function: Open callback
				close: function () {} // Function: Close callback
			};

			// User defined options
			for (i in options) {
				this.options[i] = options[i];
			}

			// Adds "js" class for <html>
			addClass(htmlEl, this.options.jsClass);

			// Wrapper
			this.wrapperEl = el.replace("#", "");

			// Try selecting ID first
			if (document.getElementById(this.wrapperEl)) {
				this.wrapper = document.getElementById(this.wrapperEl);

				// If element with an ID doesn't exist, use querySelector
			} else if (document.querySelector(this.wrapperEl)) {
				this.wrapper = document.querySelector(this.wrapperEl);

				// If element doesn't exists, stop here.
			} else {
				throw new Error("The nav element you are trying to select doesn't exist");
			}

			// Inner wrapper
			this.wrapper.inner = getChildren(this.wrapper);

			// For minification
			opts = this.options;
			nav = this.wrapper;

			// Init
			this._init(this);
		};

		ResponsiveNav.prototype = {

			/**
			 * Unattaches events and removes any classes that were added
			 */
			destroy: function () {
				this._removeStyles();
				removeClass(nav, "closed");
				removeClass(nav, "opened");
				removeClass(nav, opts.navClass);
				removeClass(nav, opts.navClass + "-" + this.index);
				removeClass(htmlEl, opts.navActiveClass);
				nav.removeAttribute("style");
				nav.removeAttribute("aria-hidden");

				removeEvent(window, "resize", this, false);
				removeEvent(window, "focus", this, false);
				removeEvent(document.body, "touchmove", this, false);
				removeEvent(navToggle, "touchstart", this, false);
				removeEvent(navToggle, "touchend", this, false);
				removeEvent(navToggle, "mouseup", this, false);
				removeEvent(navToggle, "keyup", this, false);
				removeEvent(navToggle, "click", this, false);

				if (!opts.customToggle) {
					navToggle.parentNode.removeChild(navToggle);
				} else {
					navToggle.removeAttribute("aria-hidden");
				}
			},

			/**
			 * Toggles the navigation open/close
			 */
			toggle: function () {
				if (hasAnimFinished === true) {
					if (!navOpen) {
						this.open();
					} else {
						this.close();
					}
				}
			},

			/**
			 * Opens the navigation
			 */
			open: function () {
				if (!navOpen) {
					removeClass(nav, "closed");
					addClass(nav, "opened");
					addClass(htmlEl, opts.navActiveClass);
					addClass(navToggle, "active");
					nav.style.position = opts.openPos;
					setAttributes(nav, {
						"aria-hidden": "false"
					});
					navOpen = true;
					opts.open();
				}
			},

			/**
			 * Closes the navigation
			 */
			close: function () {
				if (navOpen) {
					addClass(nav, "closed");
					removeClass(nav, "opened");
					removeClass(htmlEl, opts.navActiveClass);
					removeClass(navToggle, "active");
					setAttributes(nav, {
						"aria-hidden": "true"
					});

					// If animations are enabled, wait until they finish
					if (opts.animate) {
						hasAnimFinished = false;
						setTimeout(function () {
							nav.style.position = "absolute";
							hasAnimFinished = true;
						}, opts.transition + 10);

						// Animations aren't enabled, we can do these immediately
					} else {
						nav.style.position = "absolute";
					}

					navOpen = false;
					opts.close();
				}
			},

			/**
			 * Resize is called on window resize and orientation change.
			 * It initializes the CSS styles and height calculations.
			 */
			resize: function () {

				// Resize watches navigation toggle's display state
				if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

					isMobile = true;
					setAttributes(navToggle, {
						"aria-hidden": "false"
					});

					// If the navigation is hidden
					if (nav.className.match(/(^|\s)closed(\s|$)/)) {
						setAttributes(nav, {
							"aria-hidden": "true"
						});
						nav.style.position = "absolute";
					}

					this._createStyles();
					this._calcHeight();
				} else {

					isMobile = false;
					setAttributes(navToggle, {
						"aria-hidden": "true"
					});
					setAttributes(nav, {
						"aria-hidden": "false"
					});
					nav.style.position = opts.openPos;
					this._removeStyles();
				}
			},

			/**
			 * Takes care of all even handling
			 *
			 * @param  {event} event
			 * @return {type} returns the type of event that should be used
			 */
			handleEvent: function (e) {
				var evt = e || window.event;

				switch (evt.type) {
					case "touchstart":
						this._onTouchStart(evt);
						break;
					case "touchmove":
						this._onTouchMove(evt);
						break;
					case "touchend":
					case "mouseup":
						this._onTouchEnd(evt);
						break;
					case "click":
						this._preventDefault(evt);
						break;
					case "keyup":
						this._onKeyUp(evt);
						break;
					case "focus":
					case "resize":
						this.resize(evt);
						break;
				}
			},

			/**
			 * Initializes the widget
			 */
			_init: function () {
				this.index = index++;

				addClass(nav, opts.navClass);
				addClass(nav, opts.navClass + "-" + this.index);
				addClass(nav, "closed");
				hasAnimFinished = true;
				navOpen = false;

				this._closeOnNavClick();
				this._createToggle();
				this._transitions();
				this.resize();

				/**
				 * On IE8 the resize event triggers too early for some reason
				 * so it's called here again on init to make sure all the
				 * calculated styles are correct.
				 */
				var self = this;
				setTimeout(function () {
					self.resize();
				}, 20);

				addEvent(window, "resize", this, false);
				addEvent(window, "focus", this, false);
				addEvent(document.body, "touchmove", this, false);
				addEvent(navToggle, "touchstart", this, false);
				addEvent(navToggle, "touchend", this, false);
				addEvent(navToggle, "mouseup", this, false);
				addEvent(navToggle, "keyup", this, false);
				addEvent(navToggle, "click", this, false);

				/**
				 * Init callback here
				 */
				opts.init();
			},

			/**
			 * Creates Styles to the <head>
			 */
			_createStyles: function () {
				if (!styleElement.parentNode) {
					styleElement.type = "text/css";
					document.getElementsByTagName("head")[0].appendChild(styleElement);
				}
			},

			/**
			 * Removes styles from the <head>
			 */
			_removeStyles: function () {
				if (styleElement.parentNode) {
					styleElement.parentNode.removeChild(styleElement);
				}
			},

			/**
			 * Creates Navigation Toggle
			 */
			_createToggle: function () {

				// If there's no toggle, let's create one
				if (!opts.customToggle) {
					var toggle = document.createElement("a");
					toggle.innerHTML = opts.label;
					setAttributes(toggle, {
						"href": "#",
						"class": "nav-toggle"
					});

					// Determine where to insert the toggle
					if (opts.insert === "after") {
						nav.parentNode.insertBefore(toggle, nav.nextSibling);
					} else {
						nav.parentNode.insertBefore(toggle, nav);
					}

					navToggle = toggle;

					// There is a toggle already, let's use that one
				} else {
					var toggleEl = opts.customToggle.replace("#", "");

					if (document.getElementById(toggleEl)) {
						navToggle = document.getElementById(toggleEl);
					} else if (document.querySelector(toggleEl)) {
						navToggle = document.querySelector(toggleEl);
					} else {
						throw new Error("The custom nav toggle you are trying to select doesn't exist");
					}
				}
			},

			/**
			 * Closes the navigation when a link inside is clicked.
			 */
			_closeOnNavClick: function () {
				if (opts.closeOnNavClick) {
					var links = nav.getElementsByTagName("a"),
						self = this;
					forEach(links, function (i, el) {
						addEvent(links[i], "click", function () {
							if (isMobile) {
								self.toggle();
							}
						}, false);
					});
				}
			},

			/**
			 * Prevents the default functionality.
			 *
			 * @param  {event} event
			 */
			_preventDefault: function (e) {
				if (e.preventDefault) {
					if (e.stopImmediatePropagation) {
						e.stopImmediatePropagation();
					}
					e.preventDefault();
					e.stopPropagation();
					return false;

					// This is strictly for old IE
				} else {
					e.returnValue = false;
				}
			},

			/**
			 * On touch start we get the location of the touch.
			 *
			 * @param  {event} event
			 */
			_onTouchStart: function (e) {
				if (!Event.prototype.stopImmediatePropagation) {
					this._preventDefault(e);
				}
				this.startX = e.touches[0].clientX;
				this.startY = e.touches[0].clientY;
				this.touchHasMoved = false;

				/**
				 * Remove mouseup event completely here to avoid
				 * double triggering the event.
				 */
				removeEvent(navToggle, "mouseup", this, false);
			},

			/**
			 * Check if the user is scrolling instead of tapping.
			 *
			 * @param  {event} event
			 */
			_onTouchMove: function (e) {
				if (Math.abs(e.touches[0].clientX - this.startX) > 10 ||
					Math.abs(e.touches[0].clientY - this.startY) > 10) {
					this.touchHasMoved = true;
				}
			},

			/**
			 * On touch end toggle the navigation.
			 *
			 * @param  {event} event
			 */
			_onTouchEnd: function (e) {
				this._preventDefault(e);
				if (!isMobile) {
					return;
				}

				// If the user isn't scrolling
				if (!this.touchHasMoved) {

					// If the event type is touch
					if (e.type === "touchend") {
						this.toggle();
						return;

						// Event type was click, not touch
					} else {
						var evt = e || window.event;

						// If it isn't a right click, do toggling
						if (!(evt.which === 3 || evt.button === 2)) {
							this.toggle();
						}
					}
				}
			},

			/**
			 * For keyboard accessibility, toggle the navigation on Enter
			 * keypress too.
			 *
			 * @param  {event} event
			 */
			_onKeyUp: function (e) {
				var evt = e || window.event;
				if (evt.keyCode === 13) {
					this.toggle();
				}
			},

			/**
			 * Adds the needed CSS transitions if animations are enabled
			 */
			_transitions: function () {
				if (opts.animate) {
					var objStyle = nav.style,
						transition = "max-height " + opts.transition + "ms";

					objStyle.WebkitTransition =
						objStyle.MozTransition =
						objStyle.OTransition =
						objStyle.transition = transition;
				}
			},

			/**
			 * Calculates the height of the navigation and then creates
			 * styles which are later added to the page <head>
			 */
			_calcHeight: function () {
				var savedHeight = 0;
				for (var i = 0; i < nav.inner.length; i++) {
					savedHeight += nav.inner[i].offsetHeight;
				}

				var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important} ." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened.dropdown-active {max-height:9999px !important}";

				if (styleElement.styleSheet) {
					styleElement.styleSheet.cssText = innerStyles;
				} else {
					styleElement.innerHTML = innerStyles;
				}

				innerStyles = "";
			}

		};

		/**
		 * Return new Responsive Nav
		 */
		return new ResponsiveNav(el, options);


	};

	if (typeof module !== "undefined" && module.exports) {
		module.exports = responsiveNav;
	} else {
		window.responsiveNav = responsiveNav;
	}
	// Responsive mobile menu
	// Create the menu 
	if (document.getElementsByClassName("nav__mobile") && document.getElementsByClassName('nav__mobile').length > 0) {
		var navElements = document.getElementsByClassName('navbar__menu')[0].innerHTML;
		document.getElementsByClassName('nav__mobile')[0].innerHTML = navElements;
		// Load 
		var nav = responsiveNav(".nav__mobile", { // Selector
			animate: true, // Boolean: Use CSS3 transitions, true or false
			transition: 284, // Integer: Speed of the transition, in milliseconds
			label: "Menu", // String: Label for the navigation toggle
			insert: "before", // String: Insert the toggle before or after the navigation
			customToggle: "toggle", // Selector: Specify the ID of a custom toggle
			openPos: "relative", // String: Position of the opened nav, relative or static
			navClass: "nav__mobile", // String: Default CSS class. If changed, you need to edit the CSS too!
		});
	} else {
		addNewClass(document.querySelector('.navbar__menu'), 'navbar__menu--noMob');
		addNewClass(document.querySelector('.navbar__menu-mob'), 'navbar__menu-mob--noMob');
	};

}(document, window, 0));

window.onload = function () {
	// good to go!
	document.getElementById('page').className = "load";
};

/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////             /////    /////
/////             /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
         /////    /////
         /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////

/**
 * ScrollReveal
 * ------------
 * Version : 3.4.0
 * Website : scrollrevealjs.org
 * Repo    : github.com/jlmakes/scrollreveal.js
 * Author  : Julian Lloyd (@jlmakes)
 */

;(function () {
  'use strict'

  var sr
  var _requestAnimationFrame

  function ScrollReveal (config) {
    // Support instantiation without the `new` keyword.
    if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
      return new ScrollReveal(config)
    }

    sr = this // Save reference to instance.
    sr.version = '3.4.0'
    sr.tools = new Tools() // *required utilities

    if (sr.isSupported()) {
      sr.tools.extend(sr.defaults, config || {})

      sr.defaults.container = _resolveContainer(sr.defaults)

      sr.store = {
        elements: {},
        containers: []
      }

      sr.sequences = {}
      sr.history = []
      sr.uid = 0
      sr.initialized = false
    } else if (typeof console !== 'undefined' && console !== null) {
      // Note: IE9 only supports console if devtools are open.
      console.log('ScrollReveal is not supported in this browser.')
    }

    return sr
  }

  /**
   * Configuration
   * -------------
   * This object signature can be passed directly to the ScrollReveal constructor,
   * or as the second argument of the `reveal()` method.
   */

  ScrollReveal.prototype.defaults = {
    // 'bottom', 'left', 'top', 'right'
    origin: 'bottom',

    // Can be any valid CSS distance, e.g. '5rem', '10%', '20vw', etc.
    distance: '20px',

    // Time in milliseconds.
    duration: 500,
    delay: 0,

    // Starting angles in degrees, will transition from these values to 0 in all axes.
    rotate: { x: 0, y: 0, z: 0 },

    // Starting opacity value, before transitioning to the computed opacity.
    opacity: 0,

    // Starting scale value, will transition from this value to 1
    scale: 0.9,

    // Accepts any valid CSS easing, e.g. 'ease', 'ease-in-out', 'linear', etc.
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',

    // `<html>` is the default reveal container. You can pass either:
    // DOM Node, e.g. document.querySelector('.fooContainer')
    // Selector, e.g. '.fooContainer'
    container: window.document.documentElement,

    // true/false to control reveal animations on mobile.
    mobile: true,

    // true:  reveals occur every time elements become visible
    // false: reveals occur once as elements become visible
    reset: false,

    // 'always' — delay for all reveal animations
    // 'once'   — delay only the first time reveals occur
    // 'onload' - delay only for animations triggered by first load
    useDelay: 'always',

    // Change when an element is considered in the viewport. The default value
    // of 0.20 means 20% of an element must be visible for its reveal to occur.
    viewFactor: 0.2,

    // Pixel values that alter the container boundaries.
    // e.g. Set `{ top: 48 }`, if you have a 48px tall fixed toolbar.
    // --
    // Visual Aid: https://scrollrevealjs.org/assets/viewoffset.png
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },

    // Callbacks that fire for each triggered element reveal, and reset.
    beforeReveal: function (domEl) {},
    beforeReset: function (domEl) {},

    // Callbacks that fire for each completed element reveal, and reset.
    afterReveal: function (domEl) {},
    afterReset: function (domEl) {}
  }

  /**
   * Check if client supports CSS Transform and CSS Transition.
   * @return {boolean}
   */
  ScrollReveal.prototype.isSupported = function () {
    var style = document.documentElement.style
    return 'WebkitTransition' in style && 'WebkitTransform' in style ||
      'transition' in style && 'transform' in style
  }

  /**
   * Creates a reveal set, a group of elements that will animate when they
   * become visible. If [interval] is provided, a new sequence is created
   * that will ensure elements reveal in the order they appear in the DOM.
   *
   * @param {Node|NodeList|string} [target]   The node, node list or selector to use for animation.
   * @param {Object}               [config]   Override the defaults for this reveal set.
   * @param {number}               [interval] Time between sequenced element animations (milliseconds).
   * @param {boolean}              [sync]     Used internally when updating reveals for async content.
   *
   * @return {Object} The current ScrollReveal instance.
   */
  ScrollReveal.prototype.reveal = function (target, config, interval, sync) {
    var container
    var elements
    var elem
    var elemId
    var sequence
    var sequenceId

    // No custom configuration was passed, but a sequence interval instead.
    // let’s shuffle things around to make sure everything works.
    if (config !== undefined && typeof config === 'number') {
      interval = config
      config = {}
    } else if (config === undefined || config === null) {
      config = {}
    }

    container = _resolveContainer(config)
    elements = _getRevealElements(target, container)

    if (!elements.length) {
      console.log('ScrollReveal: reveal on "' + target + '" failed, no elements found.')
      return sr
    }

    // Prepare a new sequence if an interval is passed.
    if (interval && typeof interval === 'number') {
      sequenceId = _nextUid()

      sequence = sr.sequences[sequenceId] = {
        id: sequenceId,
        interval: interval,
        elemIds: [],
        active: false
      }
    }

    // Begin main loop to configure ScrollReveal elements.
    for (var i = 0; i < elements.length; i++) {
      // Check if the element has already been configured and grab it from the store.
      elemId = elements[i].getAttribute('data-sr-id')
      if (elemId) {
        elem = sr.store.elements[elemId]
      } else {
        // Otherwise, let’s do some basic setup.
        elem = {
          id: _nextUid(),
          domEl: elements[i],
          seen: false,
          revealing: false
        }
        elem.domEl.setAttribute('data-sr-id', elem.id)
      }

      // Sequence only setup
      if (sequence) {
        elem.sequence = {
          id: sequence.id,
          index: sequence.elemIds.length
        }

        sequence.elemIds.push(elem.id)
      }

      // New or existing element, it’s time to update its configuration, styles,
      // and send the updates to our store.
      _configure(elem, config, container)
      _style(elem)
      _updateStore(elem)

      // We need to make sure elements are set to visibility: visible, even when
      // on mobile and `config.mobile === false`, or if unsupported.
      if (sr.tools.isMobile() && !elem.config.mobile || !sr.isSupported()) {
        elem.domEl.setAttribute('style', elem.styles.inline)
        elem.disabled = true
      } else if (!elem.revealing) {
        // Otherwise, proceed normally.
        elem.domEl.setAttribute('style',
          elem.styles.inline +
          elem.styles.transform.initial
        )
      }
    }

    // Each `reveal()` is recorded so that when calling `sync()` while working
    // with asynchronously loaded content, it can re-trace your steps but with
    // all your new elements now in the DOM.

    // Since `reveal()` is called internally by `sync()`, we don’t want to
    // record or intiialize each reveal during syncing.
    if (!sync && sr.isSupported()) {
      _record(target, config, interval)

      // We push initialization to the event queue using setTimeout, so that we can
      // give ScrollReveal room to process all reveal calls before putting things into motion.
      // --
      // Philip Roberts - What the heck is the event loop anyway? (JSConf EU 2014)
      // https://www.youtube.com/watch?v=8aGhZQkoFbQ
      if (sr.initTimeout) {
        window.clearTimeout(sr.initTimeout)
      }
      sr.initTimeout = window.setTimeout(_init, 0)
    }

    return sr
  }

  /**
   * Re-runs `reveal()` for each record stored in history, effectively capturing
   * any content loaded asynchronously that matches existing reveal set targets.
   * @return {Object} The current ScrollReveal instance.
   */
  ScrollReveal.prototype.sync = function () {
    if (sr.history.length && sr.isSupported()) {
      for (var i = 0; i < sr.history.length; i++) {
        var record = sr.history[i]
        sr.reveal(record.target, record.config, record.interval, true)
      }
      _init()
    } else {
      console.log('ScrollReveal: sync failed, no reveals found.')
    }
    return sr
  }

  /**
   * Private Methods
   * ---------------
   */

  function _resolveContainer (config) {
    if (config && config.container) {
      if (typeof config.container === 'string') {
        return window.document.documentElement.querySelector(config.container)
      } else if (sr.tools.isNode(config.container)) {
        return config.container
      } else {
        console.log('ScrollReveal: invalid container "' + config.container + '" provided.')
        console.log('ScrollReveal: falling back to default container.')
      }
    }
    return sr.defaults.container
  }

  /**
   * check to see if a node or node list was passed in as the target,
   * otherwise query the container using target as a selector.
   *
   * @param {Node|NodeList|string} [target]    client input for reveal target.
   * @param {Node}                 [container] parent element for selector queries.
   *
   * @return {array} elements to be revealed.
   */
  function _getRevealElements (target, container) {
    if (typeof target === 'string') {
      return Array.prototype.slice.call(container.querySelectorAll(target))
    } else if (sr.tools.isNode(target)) {
      return [target]
    } else if (sr.tools.isNodeList(target)) {
      return Array.prototype.slice.call(target)
    } else if (Array.isArray(target)) {
      return target.filter(sr.tools.isNode)
    }
    return []
  }

  /**
   * A consistent way of creating unique IDs.
   * @returns {number}
   */
  function _nextUid () {
    return ++sr.uid
  }

  function _configure (elem, config, container) {
    // If a container was passed as a part of the config object,
    // let’s overwrite it with the resolved container passed in.
    if (config.container) config.container = container
    // If the element hasn’t already been configured, let’s use a clone of the
    // defaults extended by the configuration passed as the second argument.
    if (!elem.config) {
      elem.config = sr.tools.extendClone(sr.defaults, config)
    } else {
      // Otherwise, let’s use a clone of the existing element configuration extended
      // by the configuration passed as the second argument.
      elem.config = sr.tools.extendClone(elem.config, config)
    }

    // Infer CSS Transform axis from origin string.
    if (elem.config.origin === 'top' || elem.config.origin === 'bottom') {
      elem.config.axis = 'Y'
    } else {
      elem.config.axis = 'X'
    }
  }

  function _style (elem) {
    var computed = window.getComputedStyle(elem.domEl)

    if (!elem.styles) {
      elem.styles = {
        transition: {},
        transform: {},
        computed: {}
      }

      // Capture any existing inline styles, and add our visibility override.
      // --
      // See section 4.2. in the Documentation:
      // https://github.com/jlmakes/scrollreveal.js#42-improve-user-experience
      elem.styles.inline = elem.domEl.getAttribute('style') || ''
      elem.styles.inline += '; visibility: visible; '

      // grab the elements existing opacity.
      elem.styles.computed.opacity = computed.opacity

      // grab the elements existing transitions.
      if (!computed.transition || computed.transition === 'all 0s ease 0s') {
        elem.styles.computed.transition = ''
      } else {
        elem.styles.computed.transition = computed.transition + ', '
      }
    }

    // Create transition styles
    elem.styles.transition.instant = _generateTransition(elem, 0)
    elem.styles.transition.delayed = _generateTransition(elem, elem.config.delay)

    // Generate transform styles, first with the webkit prefix.
    elem.styles.transform.initial = ' -webkit-transform:'
    elem.styles.transform.target = ' -webkit-transform:'
    _generateTransform(elem)

    // And again without any prefix.
    elem.styles.transform.initial += 'transform:'
    elem.styles.transform.target += 'transform:'
    _generateTransform(elem)
  }

  function _generateTransition (elem, delay) {
    var config = elem.config

    return '-webkit-transition: ' + elem.styles.computed.transition +
      '-webkit-transform ' + config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's, opacity ' +
      config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's; ' +

      'transition: ' + elem.styles.computed.transition +
      'transform ' + config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's, opacity ' +
      config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's; '
  }

  function _generateTransform (elem) {
    var config = elem.config
    var cssDistance
    var transform = elem.styles.transform

    // Let’s make sure our our pixel distances are negative for top and left.
    // e.g. origin = 'top' and distance = '25px' starts at `top: -25px` in CSS.
    if (config.origin === 'top' || config.origin === 'left') {
      cssDistance = /^-/.test(config.distance)
        ? config.distance.substr(1)
        : '-' + config.distance
    } else {
      cssDistance = config.distance
    }

    if (parseInt(config.distance)) {
      transform.initial += ' translate' + config.axis + '(' + cssDistance + ')'
      transform.target += ' translate' + config.axis + '(0)'
    }
    if (config.scale) {
      transform.initial += ' scale(' + config.scale + ')'
      transform.target += ' scale(1)'
    }
    if (config.rotate.x) {
      transform.initial += ' rotateX(' + config.rotate.x + 'deg)'
      transform.target += ' rotateX(0)'
    }
    if (config.rotate.y) {
      transform.initial += ' rotateY(' + config.rotate.y + 'deg)'
      transform.target += ' rotateY(0)'
    }
    if (config.rotate.z) {
      transform.initial += ' rotateZ(' + config.rotate.z + 'deg)'
      transform.target += ' rotateZ(0)'
    }
    transform.initial += '; opacity: ' + config.opacity + ';'
    transform.target += '; opacity: ' + elem.styles.computed.opacity + ';'
  }

  function _updateStore (elem) {
    var container = elem.config.container

    // If this element’s container isn’t already in the store, let’s add it.
    if (container && sr.store.containers.indexOf(container) === -1) {
      sr.store.containers.push(elem.config.container)
    }

    // Update the element stored with our new element.
    sr.store.elements[elem.id] = elem
  }

  function _record (target, config, interval) {
    // Save the `reveal()` arguments that triggered this `_record()` call, so we
    // can re-trace our steps when calling the `sync()` method.
    var record = {
      target: target,
      config: config,
      interval: interval
    }
    sr.history.push(record)
  }

  function _init () {
    if (sr.isSupported()) {
      // Initial animate call triggers valid reveal animations on first load.
      // Subsequent animate calls are made inside the event handler.
      _animate()

      // Then we loop through all container nodes in the store and bind event
      // listeners to each.
      for (var i = 0; i < sr.store.containers.length; i++) {
        sr.store.containers[i].addEventListener('scroll', _handler)
        sr.store.containers[i].addEventListener('resize', _handler)
      }

      // Let’s also do a one-time binding of window event listeners.
      if (!sr.initialized) {
        window.addEventListener('scroll', _handler)
        window.addEventListener('resize', _handler)
        sr.initialized = true
      }
    }
    return sr
  }

  function _handler () {
    _requestAnimationFrame(_animate)
  }

  function _setActiveSequences () {
    var active
    var elem
    var elemId
    var sequence

    // Loop through all sequences
    sr.tools.forOwn(sr.sequences, function (sequenceId) {
      sequence = sr.sequences[sequenceId]
      active = false

      // For each sequenced elemenet, let’s check visibility and if
      // any are visible, set it’s sequence to active.
      for (var i = 0; i < sequence.elemIds.length; i++) {
        elemId = sequence.elemIds[i]
        elem = sr.store.elements[elemId]
        if (_isElemVisible(elem) && !active) {
          active = true
        }
      }

      sequence.active = active
    })
  }

  function _animate () {
    var delayed
    var elem

    _setActiveSequences()

    // Loop through all elements in the store
    sr.tools.forOwn(sr.store.elements, function (elemId) {
      elem = sr.store.elements[elemId]
      delayed = _shouldUseDelay(elem)

      // Let’s see if we should revealand if so,
      // trigger the `beforeReveal` callback and
      // determine whether or not to use delay.
      if (_shouldReveal(elem)) {
        elem.config.beforeReveal(elem.domEl)
        if (delayed) {
          elem.domEl.setAttribute('style',
            elem.styles.inline +
            elem.styles.transform.target +
            elem.styles.transition.delayed
          )
        } else {
          elem.domEl.setAttribute('style',
            elem.styles.inline +
            elem.styles.transform.target +
            elem.styles.transition.instant
          )
        }

        // Let’s queue the `afterReveal` callback
        // and mark the element as seen and revealing.
        _queueCallback('reveal', elem, delayed)
        elem.revealing = true
        elem.seen = true

        if (elem.sequence) {
          _queueNextInSequence(elem, delayed)
        }
      } else if (_shouldReset(elem)) {
        //Otherwise reset our element and
        // trigger the `beforeReset` callback.
        elem.config.beforeReset(elem.domEl)
        elem.domEl.setAttribute('style',
          elem.styles.inline +
          elem.styles.transform.initial +
          elem.styles.transition.instant
        )
        // And queue the `afterReset` callback.
        _queueCallback('reset', elem)
        elem.revealing = false
      }
    })
  }

  function _queueNextInSequence (elem, delayed) {
    var elapsed = 0
    var delay = 0
    var sequence = sr.sequences[elem.sequence.id]

    // We’re processing a sequenced element, so let's block other elements in this sequence.
    sequence.blocked = true

    // Since we’re triggering animations a part of a sequence after animations on first load,
    // we need to check for that condition and explicitly add the delay to our timer.
    if (delayed && elem.config.useDelay === 'onload') {
      delay = elem.config.delay
    }

    // If a sequence timer is already running, capture the elapsed time and clear it.
    if (elem.sequence.timer) {
      elapsed = Math.abs(elem.sequence.timer.started - new Date())
      window.clearTimeout(elem.sequence.timer)
    }

    // Start a new timer.
    elem.sequence.timer = { started: new Date() }
    elem.sequence.timer.clock = window.setTimeout(function () {
      // Sequence interval has passed, so unblock the sequence and re-run the handler.
      sequence.blocked = false
      elem.sequence.timer = null
      _handler()
    }, Math.abs(sequence.interval) + delay - elapsed)
  }

  function _queueCallback (type, elem, delayed) {
    var elapsed = 0
    var duration = 0
    var callback = 'after'

    // Check which callback we’re working with.
    switch (type) {
      case 'reveal':
        duration = elem.config.duration
        if (delayed) {
          duration += elem.config.delay
        }
        callback += 'Reveal'
        break

      case 'reset':
        duration = elem.config.duration
        callback += 'Reset'
        break
    }

    // If a timer is already running, capture the elapsed time and clear it.
    if (elem.timer) {
      elapsed = Math.abs(elem.timer.started - new Date())
      window.clearTimeout(elem.timer.clock)
    }

    // Start a new timer.
    elem.timer = { started: new Date() }
    elem.timer.clock = window.setTimeout(function () {
      // The timer completed, so let’s fire the callback and null the timer.
      elem.config[callback](elem.domEl)
      elem.timer = null
    }, duration - elapsed)
  }

  function _shouldReveal (elem) {
    if (elem.sequence) {
      var sequence = sr.sequences[elem.sequence.id]
      return sequence.active &&
        !sequence.blocked &&
        !elem.revealing &&
        !elem.disabled
    }
    return _isElemVisible(elem) &&
      !elem.revealing &&
      !elem.disabled
  }

  function _shouldUseDelay (elem) {
    var config = elem.config.useDelay
    return config === 'always' ||
      (config === 'onload' && !sr.initialized) ||
      (config === 'once' && !elem.seen)
  }

  function _shouldReset (elem) {
    if (elem.sequence) {
      var sequence = sr.sequences[elem.sequence.id]
      return !sequence.active &&
        elem.config.reset &&
        elem.revealing &&
        !elem.disabled
    }
    return !_isElemVisible(elem) &&
      elem.config.reset &&
      elem.revealing &&
      !elem.disabled
  }

  function _getContainer (container) {
    return {
      width: container.clientWidth,
      height: container.clientHeight
    }
  }

  function _getScrolled (container) {
    // Return the container scroll values, plus the its offset.
    if (container && container !== window.document.documentElement) {
      var offset = _getOffset(container)
      return {
        x: container.scrollLeft + offset.left,
        y: container.scrollTop + offset.top
      }
    } else {
      // Otherwise, default to the window object’s scroll values.
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    }
  }

  function _getOffset (domEl) {
    var offsetTop = 0
    var offsetLeft = 0

      // Grab the element’s dimensions.
    var offsetHeight = domEl.offsetHeight
    var offsetWidth = domEl.offsetWidth

    // Now calculate the distance between the element and its parent, then
    // again for the parent to its parent, and again etc... until we have the
    // total distance of the element to the document’s top and left origin.
    do {
      if (!isNaN(domEl.offsetTop)) {
        offsetTop += domEl.offsetTop
      }
      if (!isNaN(domEl.offsetLeft)) {
        offsetLeft += domEl.offsetLeft
      }
      domEl = domEl.offsetParent
    } while (domEl)

    return {
      top: offsetTop,
      left: offsetLeft,
      height: offsetHeight,
      width: offsetWidth
    }
  }

  function _isElemVisible (elem) {
    var offset = _getOffset(elem.domEl)
    var container = _getContainer(elem.config.container)
    var scrolled = _getScrolled(elem.config.container)
    var vF = elem.config.viewFactor

      // Define the element geometry.
    var elemHeight = offset.height
    var elemWidth = offset.width
    var elemTop = offset.top
    var elemLeft = offset.left
    var elemBottom = elemTop + elemHeight
    var elemRight = elemLeft + elemWidth

    return confirmBounds() || isPositionFixed()

    function confirmBounds () {
      // Define the element’s functional boundaries using its view factor.
      var top = elemTop + elemHeight * vF
      var left = elemLeft + elemWidth * vF
      var bottom = elemBottom - elemHeight * vF
      var right = elemRight - elemWidth * vF

      // Define the container functional boundaries using its view offset.
      var viewTop = scrolled.y + elem.config.viewOffset.top
      var viewLeft = scrolled.x + elem.config.viewOffset.left
      var viewBottom = scrolled.y - elem.config.viewOffset.bottom + container.height
      var viewRight = scrolled.x - elem.config.viewOffset.right + container.width

      return top < viewBottom &&
        bottom > viewTop &&
        left < viewRight &&
        right > viewLeft
    }

    function isPositionFixed () {
      return (window.getComputedStyle(elem.domEl).position === 'fixed')
    }
  }

  /**
   * Utilities
   * ---------
   */

  function Tools () {}

  Tools.prototype.isObject = function (object) {
    return object !== null && typeof object === 'object' && object.constructor === Object
  }

  Tools.prototype.isNode = function (object) {
    return typeof window.Node === 'object'
      ? object instanceof window.Node
      : object && typeof object === 'object' &&
        typeof object.nodeType === 'number' &&
        typeof object.nodeName === 'string'
  }

  Tools.prototype.isNodeList = function (object) {
    var prototypeToString = Object.prototype.toString.call(object)
    var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/

    return typeof window.NodeList === 'object'
      ? object instanceof window.NodeList
      : object && typeof object === 'object' &&
        regex.test(prototypeToString) &&
        typeof object.length === 'number' &&
        (object.length === 0 || this.isNode(object[0]))
  }

  Tools.prototype.forOwn = function (object, callback) {
    if (!this.isObject(object)) {
      throw new TypeError('Expected "object", but received "' + typeof object + '".')
    } else {
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          callback(property)
        }
      }
    }
  }

  Tools.prototype.extend = function (target, source) {
    this.forOwn(source, function (property) {
      if (this.isObject(source[property])) {
        if (!target[property] || !this.isObject(target[property])) {
          target[property] = {}
        }
        this.extend(target[property], source[property])
      } else {
        target[property] = source[property]
      }
    }.bind(this))
    return target
  }

  Tools.prototype.extendClone = function (target, source) {
    return this.extend(this.extend({}, target), source)
  }

  Tools.prototype.isMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * Polyfills
   * --------
   */

  _requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }

  /**
   * Module Wrapper
   * --------------
   */
  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(function () {
      return ScrollReveal
    })
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollReveal
  } else {
    window.ScrollReveal = ScrollReveal
	}
	// Changing the defaults
	window.sr = ScrollReveal();

	// Customizing a reveal set
	sr.reveal('.expanded__media', { 
		duration: 800,
		distance: '50px'
	});
	sr.reveal('.expanded__content', { 
		duration: 1000,
		distance: '50px'
	});
	sr.reveal('.cta__inner', { 
		duration: 800
	});
	
	sr.reveal('.step', { duration: 1000 }, 50);
})();



