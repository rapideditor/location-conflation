var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@ideditor/country-coder/dist/country-coder.cjs
var require_country_coder = __commonJS({
  "node_modules/@ideditor/country-coder/dist/country-coder.cjs"(exports) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule2 = (target) => __defProp2(target, "__esModule", { value: true });
    var __commonJS2 = (cb, mod) => function __require() {
      return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport2 = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames2(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc2(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule2 = (module22) => {
      return __reExport2(__markAsModule2(__defProp2(module22 != null ? __create2(__getProtoOf2(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    var require_quickselect = __commonJS2({
      "node_modules/quickselect/quickselect.js"(exports2, module22) {
        (function(global, factory) {
          typeof exports2 === "object" && typeof module22 !== "undefined" ? module22.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.quickselect = factory();
        })(exports2, function() {
          "use strict";
          function quickselect(arr, k, left, right, compare) {
            quickselectStep(arr, k, left || 0, right || arr.length - 1, compare || defaultCompare);
          }
          function quickselectStep(arr, k, left, right, compare) {
            while (right > left) {
              if (right - left > 600) {
                var n = right - left + 1;
                var m = k - left + 1;
                var z = Math.log(n);
                var s = 0.5 * Math.exp(2 * z / 3);
                var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                quickselectStep(arr, k, newLeft, newRight, compare);
              }
              var t = arr[k];
              var i = left;
              var j = right;
              swap(arr, left, k);
              if (compare(arr[right], t) > 0)
                swap(arr, left, right);
              while (i < j) {
                swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0)
                  i++;
                while (compare(arr[j], t) > 0)
                  j--;
              }
              if (compare(arr[left], t) === 0)
                swap(arr, left, j);
              else {
                j++;
                swap(arr, j, right);
              }
              if (j <= k)
                left = j + 1;
              if (k <= j)
                right = j - 1;
            }
          }
          function swap(arr, i, j) {
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
          }
          function defaultCompare(a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
          }
          return quickselect;
        });
      }
    });
    var require_rbush = __commonJS2({
      "node_modules/rbush/index.js"(exports2, module22) {
        "use strict";
        module22.exports = rbush;
        module22.exports.default = rbush;
        var quickselect = require_quickselect();
        function rbush(maxEntries, format) {
          if (!(this instanceof rbush))
            return new rbush(maxEntries, format);
          this._maxEntries = Math.max(4, maxEntries || 9);
          this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
          if (format) {
            this._initFormat(format);
          }
          this.clear();
        }
        rbush.prototype = {
          all: function() {
            return this._all(this.data, []);
          },
          search: function(bbox) {
            var node = this.data, result = [], toBBox = this.toBBox;
            if (!intersects(bbox, node))
              return result;
            var nodesToSearch = [], i, len, child, childBBox;
            while (node) {
              for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;
                if (intersects(bbox, childBBox)) {
                  if (node.leaf)
                    result.push(child);
                  else if (contains(bbox, childBBox))
                    this._all(child, result);
                  else
                    nodesToSearch.push(child);
                }
              }
              node = nodesToSearch.pop();
            }
            return result;
          },
          collides: function(bbox) {
            var node = this.data, toBBox = this.toBBox;
            if (!intersects(bbox, node))
              return false;
            var nodesToSearch = [], i, len, child, childBBox;
            while (node) {
              for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;
                if (intersects(bbox, childBBox)) {
                  if (node.leaf || contains(bbox, childBBox))
                    return true;
                  nodesToSearch.push(child);
                }
              }
              node = nodesToSearch.pop();
            }
            return false;
          },
          load: function(data) {
            if (!(data && data.length))
              return this;
            if (data.length < this._minEntries) {
              for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
              }
              return this;
            }
            var node = this._build(data.slice(), 0, data.length - 1, 0);
            if (!this.data.children.length) {
              this.data = node;
            } else if (this.data.height === node.height) {
              this._splitRoot(this.data, node);
            } else {
              if (this.data.height < node.height) {
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
              }
              this._insert(node, this.data.height - node.height - 1, true);
            }
            return this;
          },
          insert: function(item) {
            if (item)
              this._insert(item, this.data.height - 1);
            return this;
          },
          clear: function() {
            this.data = createNode([]);
            return this;
          },
          remove: function(item, equalsFn) {
            if (!item)
              return this;
            var node = this.data, bbox = this.toBBox(item), path = [], indexes = [], i, parent, index, goingUp;
            while (node || path.length) {
              if (!node) {
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
              }
              if (node.leaf) {
                index = findItem(item, node.children, equalsFn);
                if (index !== -1) {
                  node.children.splice(index, 1);
                  path.push(node);
                  this._condense(path);
                  return this;
                }
              }
              if (!goingUp && !node.leaf && contains(node, bbox)) {
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];
              } else if (parent) {
                i++;
                node = parent.children[i];
                goingUp = false;
              } else
                node = null;
            }
            return this;
          },
          toBBox: function(item) {
            return item;
          },
          compareMinX: compareNodeMinX,
          compareMinY: compareNodeMinY,
          toJSON: function() {
            return this.data;
          },
          fromJSON: function(data) {
            this.data = data;
            return this;
          },
          _all: function(node, result) {
            var nodesToSearch = [];
            while (node) {
              if (node.leaf)
                result.push.apply(result, node.children);
              else
                nodesToSearch.push.apply(nodesToSearch, node.children);
              node = nodesToSearch.pop();
            }
            return result;
          },
          _build: function(items, left, right, height) {
            var N = right - left + 1, M = this._maxEntries, node;
            if (N <= M) {
              node = createNode(items.slice(left, right + 1));
              calcBBox(node, this.toBBox);
              return node;
            }
            if (!height) {
              height = Math.ceil(Math.log(N) / Math.log(M));
              M = Math.ceil(N / Math.pow(M, height - 1));
            }
            node = createNode([]);
            node.leaf = false;
            node.height = height;
            var N2 = Math.ceil(N / M), N1 = N2 * Math.ceil(Math.sqrt(M)), i, j, right2, right3;
            multiSelect(items, left, right, N1, this.compareMinX);
            for (i = left; i <= right; i += N1) {
              right2 = Math.min(i + N1 - 1, right);
              multiSelect(items, i, right2, N2, this.compareMinY);
              for (j = i; j <= right2; j += N2) {
                right3 = Math.min(j + N2 - 1, right2);
                node.children.push(this._build(items, j, right3, height - 1));
              }
            }
            calcBBox(node, this.toBBox);
            return node;
          },
          _chooseSubtree: function(bbox, node, level, path) {
            var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;
            while (true) {
              path.push(node);
              if (node.leaf || path.length - 1 === level)
                break;
              minArea = minEnlargement = Infinity;
              for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = bboxArea(child);
                enlargement = enlargedArea(bbox, child) - area;
                if (enlargement < minEnlargement) {
                  minEnlargement = enlargement;
                  minArea = area < minArea ? area : minArea;
                  targetNode = child;
                } else if (enlargement === minEnlargement) {
                  if (area < minArea) {
                    minArea = area;
                    targetNode = child;
                  }
                }
              }
              node = targetNode || node.children[0];
            }
            return node;
          },
          _insert: function(item, level, isNode) {
            var toBBox = this.toBBox, bbox = isNode ? item : toBBox(item), insertPath = [];
            var node = this._chooseSubtree(bbox, this.data, level, insertPath);
            node.children.push(item);
            extend(node, bbox);
            while (level >= 0) {
              if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
              } else
                break;
            }
            this._adjustParentBBoxes(bbox, insertPath, level);
          },
          _split: function(insertPath, level) {
            var node = insertPath[level], M = node.children.length, m = this._minEntries;
            this._chooseSplitAxis(node, m, M);
            var splitIndex = this._chooseSplitIndex(node, m, M);
            var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
            newNode.height = node.height;
            newNode.leaf = node.leaf;
            calcBBox(node, this.toBBox);
            calcBBox(newNode, this.toBBox);
            if (level)
              insertPath[level - 1].children.push(newNode);
            else
              this._splitRoot(node, newNode);
          },
          _splitRoot: function(node, newNode) {
            this.data = createNode([node, newNode]);
            this.data.height = node.height + 1;
            this.data.leaf = false;
            calcBBox(this.data, this.toBBox);
          },
          _chooseSplitIndex: function(node, m, M) {
            var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;
            minOverlap = minArea = Infinity;
            for (i = m; i <= M - m; i++) {
              bbox1 = distBBox(node, 0, i, this.toBBox);
              bbox2 = distBBox(node, i, M, this.toBBox);
              overlap = intersectionArea(bbox1, bbox2);
              area = bboxArea(bbox1) + bboxArea(bbox2);
              if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;
                minArea = area < minArea ? area : minArea;
              } else if (overlap === minOverlap) {
                if (area < minArea) {
                  minArea = area;
                  index = i;
                }
              }
            }
            return index;
          },
          _chooseSplitAxis: function(node, m, M) {
            var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX, compareMinY = node.leaf ? this.compareMinY : compareNodeMinY, xMargin = this._allDistMargin(node, m, M, compareMinX), yMargin = this._allDistMargin(node, m, M, compareMinY);
            if (xMargin < yMargin)
              node.children.sort(compareMinX);
          },
          _allDistMargin: function(node, m, M, compare) {
            node.children.sort(compare);
            var toBBox = this.toBBox, leftBBox = distBBox(node, 0, m, toBBox), rightBBox = distBBox(node, M - m, M, toBBox), margin = bboxMargin(leftBBox) + bboxMargin(rightBBox), i, child;
            for (i = m; i < M - m; i++) {
              child = node.children[i];
              extend(leftBBox, node.leaf ? toBBox(child) : child);
              margin += bboxMargin(leftBBox);
            }
            for (i = M - m - 1; i >= m; i--) {
              child = node.children[i];
              extend(rightBBox, node.leaf ? toBBox(child) : child);
              margin += bboxMargin(rightBBox);
            }
            return margin;
          },
          _adjustParentBBoxes: function(bbox, path, level) {
            for (var i = level; i >= 0; i--) {
              extend(path[i], bbox);
            }
          },
          _condense: function(path) {
            for (var i = path.length - 1, siblings; i >= 0; i--) {
              if (path[i].children.length === 0) {
                if (i > 0) {
                  siblings = path[i - 1].children;
                  siblings.splice(siblings.indexOf(path[i]), 1);
                } else
                  this.clear();
              } else
                calcBBox(path[i], this.toBBox);
            }
          },
          _initFormat: function(format) {
            var compareArr = ["return a", " - b", ";"];
            this.compareMinX = new Function("a", "b", compareArr.join(format[0]));
            this.compareMinY = new Function("a", "b", compareArr.join(format[1]));
            this.toBBox = new Function("a", "return {minX: a" + format[0] + ", minY: a" + format[1] + ", maxX: a" + format[2] + ", maxY: a" + format[3] + "};");
          }
        };
        function findItem(item, items, equalsFn) {
          if (!equalsFn)
            return items.indexOf(item);
          for (var i = 0; i < items.length; i++) {
            if (equalsFn(item, items[i]))
              return i;
          }
          return -1;
        }
        function calcBBox(node, toBBox) {
          distBBox(node, 0, node.children.length, toBBox, node);
        }
        function distBBox(node, k, p, toBBox, destNode) {
          if (!destNode)
            destNode = createNode(null);
          destNode.minX = Infinity;
          destNode.minY = Infinity;
          destNode.maxX = -Infinity;
          destNode.maxY = -Infinity;
          for (var i = k, child; i < p; i++) {
            child = node.children[i];
            extend(destNode, node.leaf ? toBBox(child) : child);
          }
          return destNode;
        }
        function extend(a, b) {
          a.minX = Math.min(a.minX, b.minX);
          a.minY = Math.min(a.minY, b.minY);
          a.maxX = Math.max(a.maxX, b.maxX);
          a.maxY = Math.max(a.maxY, b.maxY);
          return a;
        }
        function compareNodeMinX(a, b) {
          return a.minX - b.minX;
        }
        function compareNodeMinY(a, b) {
          return a.minY - b.minY;
        }
        function bboxArea(a) {
          return (a.maxX - a.minX) * (a.maxY - a.minY);
        }
        function bboxMargin(a) {
          return a.maxX - a.minX + (a.maxY - a.minY);
        }
        function enlargedArea(a, b) {
          return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) * (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
        }
        function intersectionArea(a, b) {
          var minX = Math.max(a.minX, b.minX), minY = Math.max(a.minY, b.minY), maxX = Math.min(a.maxX, b.maxX), maxY = Math.min(a.maxY, b.maxY);
          return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
        }
        function contains(a, b) {
          return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
        }
        function intersects(a, b) {
          return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
        }
        function createNode(children) {
          return {
            children,
            height: 1,
            leaf: true,
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
          };
        }
        function multiSelect(arr, left, right, n, compare) {
          var stack = [left, right], mid;
          while (stack.length) {
            right = stack.pop();
            left = stack.pop();
            if (right - left <= n)
              continue;
            mid = left + Math.ceil((right - left) / n / 2) * n;
            quickselect(arr, mid, left, right, compare);
            stack.push(left, mid, mid, right);
          }
        }
      }
    });
    var require_lineclip = __commonJS2({
      "node_modules/lineclip/index.js"(exports2, module22) {
        "use strict";
        module22.exports = lineclip;
        lineclip.polyline = lineclip;
        lineclip.polygon = polygonclip;
        function lineclip(points, bbox, result) {
          var len = points.length, codeA = bitCode(points[0], bbox), part = [], i, a, b, codeB, lastCode;
          if (!result)
            result = [];
          for (i = 1; i < len; i++) {
            a = points[i - 1];
            b = points[i];
            codeB = lastCode = bitCode(b, bbox);
            while (true) {
              if (!(codeA | codeB)) {
                part.push(a);
                if (codeB !== lastCode) {
                  part.push(b);
                  if (i < len - 1) {
                    result.push(part);
                    part = [];
                  }
                } else if (i === len - 1) {
                  part.push(b);
                }
                break;
              } else if (codeA & codeB) {
                break;
              } else if (codeA) {
                a = intersect(a, b, codeA, bbox);
                codeA = bitCode(a, bbox);
              } else {
                b = intersect(a, b, codeB, bbox);
                codeB = bitCode(b, bbox);
              }
            }
            codeA = lastCode;
          }
          if (part.length)
            result.push(part);
          return result;
        }
        function polygonclip(points, bbox) {
          var result, edge, prev, prevInside, i, p, inside;
          for (edge = 1; edge <= 8; edge *= 2) {
            result = [];
            prev = points[points.length - 1];
            prevInside = !(bitCode(prev, bbox) & edge);
            for (i = 0; i < points.length; i++) {
              p = points[i];
              inside = !(bitCode(p, bbox) & edge);
              if (inside !== prevInside)
                result.push(intersect(prev, p, edge, bbox));
              if (inside)
                result.push(p);
              prev = p;
              prevInside = inside;
            }
            points = result;
            if (!points.length)
              break;
          }
          return result;
        }
        function intersect(a, b, edge, bbox) {
          return edge & 8 ? [a[0] + (b[0] - a[0]) * (bbox[3] - a[1]) / (b[1] - a[1]), bbox[3]] : edge & 4 ? [a[0] + (b[0] - a[0]) * (bbox[1] - a[1]) / (b[1] - a[1]), bbox[1]] : edge & 2 ? [bbox[2], a[1] + (b[1] - a[1]) * (bbox[2] - a[0]) / (b[0] - a[0])] : edge & 1 ? [bbox[0], a[1] + (b[1] - a[1]) * (bbox[0] - a[0]) / (b[0] - a[0])] : null;
        }
        function bitCode(p, bbox) {
          var code = 0;
          if (p[0] < bbox[0])
            code |= 1;
          else if (p[0] > bbox[2])
            code |= 2;
          if (p[1] < bbox[1])
            code |= 4;
          else if (p[1] > bbox[3])
            code |= 8;
          return code;
        }
      }
    });
    var require_which_polygon = __commonJS2({
      "node_modules/which-polygon/index.js"(exports2, module22) {
        "use strict";
        var rbush = require_rbush();
        var lineclip = require_lineclip();
        module22.exports = whichPolygon2;
        function whichPolygon2(data) {
          var bboxes = [];
          for (var i = 0; i < data.features.length; i++) {
            var feature22 = data.features[i];
            var coords = feature22.geometry.coordinates;
            if (feature22.geometry.type === "Polygon") {
              bboxes.push(treeItem(coords, feature22.properties));
            } else if (feature22.geometry.type === "MultiPolygon") {
              for (var j = 0; j < coords.length; j++) {
                bboxes.push(treeItem(coords[j], feature22.properties));
              }
            }
          }
          var tree = rbush().load(bboxes);
          function query(p, multi) {
            var output = [], result = tree.search({
              minX: p[0],
              minY: p[1],
              maxX: p[0],
              maxY: p[1]
            });
            for (var i2 = 0; i2 < result.length; i2++) {
              if (insidePolygon(result[i2].coords, p)) {
                if (multi)
                  output.push(result[i2].props);
                else
                  return result[i2].props;
              }
            }
            return multi && output.length ? output : null;
          }
          query.tree = tree;
          query.bbox = function queryBBox(bbox) {
            var output = [];
            var result = tree.search({
              minX: bbox[0],
              minY: bbox[1],
              maxX: bbox[2],
              maxY: bbox[3]
            });
            for (var i2 = 0; i2 < result.length; i2++) {
              if (polygonIntersectsBBox(result[i2].coords, bbox)) {
                output.push(result[i2].props);
              }
            }
            return output;
          };
          return query;
        }
        function polygonIntersectsBBox(polygon, bbox) {
          var bboxCenter = [
            (bbox[0] + bbox[2]) / 2,
            (bbox[1] + bbox[3]) / 2
          ];
          if (insidePolygon(polygon, bboxCenter))
            return true;
          for (var i = 0; i < polygon.length; i++) {
            if (lineclip(polygon[i], bbox).length > 0)
              return true;
          }
          return false;
        }
        function insidePolygon(rings, p) {
          var inside = false;
          for (var i = 0, len = rings.length; i < len; i++) {
            var ring = rings[i];
            for (var j = 0, len2 = ring.length, k = len2 - 1; j < len2; k = j++) {
              if (rayIntersect(p, ring[j], ring[k]))
                inside = !inside;
            }
          }
          return inside;
        }
        function rayIntersect(p, p1, p2) {
          return p1[1] > p[1] !== p2[1] > p[1] && p[0] < (p2[0] - p1[0]) * (p[1] - p1[1]) / (p2[1] - p1[1]) + p1[0];
        }
        function treeItem(coords, props) {
          var item = {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
            coords,
            props
          };
          for (var i = 0; i < coords[0].length; i++) {
            var p = coords[0][i];
            item.minX = Math.min(item.minX, p[0]);
            item.minY = Math.min(item.minY, p[1]);
            item.maxX = Math.max(item.maxX, p[0]);
            item.maxY = Math.max(item.maxY, p[1]);
          }
          return item;
        }
      }
    });
    __markAsModule2(exports);
    __export2(exports, {
      aggregateFeature: () => aggregateFeature2,
      borders: () => borders,
      callingCodes: () => callingCodes,
      ccTLD: () => ccTLD,
      ccTLDs: () => ccTLDs,
      driveSide: () => driveSide,
      emojiFlag: () => emojiFlag,
      emojiFlags: () => emojiFlags,
      feature: () => feature2,
      featuresContaining: () => featuresContaining,
      featuresIn: () => featuresIn,
      isIn: () => isIn,
      isInEuropeanUnion: () => isInEuropeanUnion,
      isInUnitedNations: () => isInUnitedNations,
      iso1A2Code: () => iso1A2Code,
      iso1A2Codes: () => iso1A2Codes,
      iso1A3Code: () => iso1A3Code,
      iso1A3Codes: () => iso1A3Codes,
      iso1N3Code: () => iso1N3Code,
      iso1N3Codes: () => iso1N3Codes,
      m49Code: () => m49Code,
      m49Codes: () => m49Codes,
      roadHeightUnit: () => roadHeightUnit,
      roadSpeedUnit: () => roadSpeedUnit,
      wikidataQID: () => wikidataQID,
      wikidataQIDs: () => wikidataQIDs
    });
    var import_which_polygon = __toModule2(require_which_polygon());
    var type = "FeatureCollection";
    var features = [
      { type: "Feature", properties: { wikidata: "Q21", nameEn: "England", aliases: ["GB-ENG"], country: "GB", groups: ["Q23666", "Q3336843", "154", "150", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-6.03913, 51.13217], [-7.74976, 48.64773], [1.17405, 50.74239], [2.18458, 51.52087], [2.56575, 51.85301], [0.792, 57.56437], [-2.30613, 55.62698], [-2.17058, 55.45916], [-2.6095, 55.28488], [-2.63532, 55.19452], [-3.02906, 55.04606], [-3.09361, 54.94924], [-3.38407, 54.94278], [-4.1819, 54.57861], [-3.5082, 53.54318], [-3.08228, 53.25526], [-3.03675, 53.25092], [-2.92329, 53.19383], [-2.92022, 53.17685], [-2.98598, 53.15589], [-2.90649, 53.10964], [-2.87469, 53.12337], [-2.89131, 53.09374], [-2.83133, 52.99184], [-2.7251, 52.98389], [-2.72221, 52.92969], [-2.80549, 52.89428], [-2.85897, 52.94487], [-2.92401, 52.93836], [-2.97243, 52.9651], [-3.13576, 52.895], [-3.15744, 52.84947], [-3.16105, 52.79599], [-3.08734, 52.77504], [-3.01001, 52.76636], [-2.95581, 52.71794], [-3.01724, 52.72083], [-3.04398, 52.65435], [-3.13648, 52.58208], [-3.12926, 52.5286], [-3.09746, 52.53077], [-3.08662, 52.54811], [-3.00929, 52.57774], [-2.99701, 52.551], [-3.03603, 52.49969], [-3.13359, 52.49174], [-3.22971, 52.45344], [-3.22754, 52.42526], [-3.04687, 52.34504], [-2.95364, 52.3501], [-2.99701, 52.323], [-3.00785, 52.2753], [-3.09289, 52.20546], [-3.12638, 52.08114], [-2.97111, 51.90456], [-2.8818, 51.93196], [-2.78742, 51.88833], [-2.74277, 51.84367], [-2.66234, 51.83555], [-2.66336, 51.59504], [-3.20563, 51.31615], [-6.03913, 51.13217]]]] } },
      { type: "Feature", properties: { wikidata: "Q22", nameEn: "Scotland", aliases: ["GB-SCT"], country: "GB", groups: ["Q23666", "Q3336843", "154", "150", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44"] }, geometry: { type: "MultiPolygon", coordinates: [[[[0.792, 57.56437], [-0.3751, 61.32236], [-14.78497, 57.60709], [-6.82333, 55.83103], [-4.69044, 54.3629], [-3.38407, 54.94278], [-3.09361, 54.94924], [-3.02906, 55.04606], [-2.63532, 55.19452], [-2.6095, 55.28488], [-2.17058, 55.45916], [-2.30613, 55.62698], [0.792, 57.56437]]]] } },
      { type: "Feature", properties: { wikidata: "Q25", nameEn: "Wales", aliases: ["GB-WLS"], country: "GB", groups: ["Q23666", "Q3336843", "154", "150", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-3.5082, 53.54318], [-5.37267, 53.63269], [-6.03913, 51.13217], [-3.20563, 51.31615], [-2.66336, 51.59504], [-2.66234, 51.83555], [-2.74277, 51.84367], [-2.78742, 51.88833], [-2.8818, 51.93196], [-2.97111, 51.90456], [-3.12638, 52.08114], [-3.09289, 52.20546], [-3.00785, 52.2753], [-2.99701, 52.323], [-2.95364, 52.3501], [-3.04687, 52.34504], [-3.22754, 52.42526], [-3.22971, 52.45344], [-3.13359, 52.49174], [-3.03603, 52.49969], [-2.99701, 52.551], [-3.00929, 52.57774], [-3.08662, 52.54811], [-3.09746, 52.53077], [-3.12926, 52.5286], [-3.13648, 52.58208], [-3.04398, 52.65435], [-3.01724, 52.72083], [-2.95581, 52.71794], [-3.01001, 52.76636], [-3.08734, 52.77504], [-3.16105, 52.79599], [-3.15744, 52.84947], [-3.13576, 52.895], [-2.97243, 52.9651], [-2.92401, 52.93836], [-2.85897, 52.94487], [-2.80549, 52.89428], [-2.72221, 52.92969], [-2.7251, 52.98389], [-2.83133, 52.99184], [-2.89131, 53.09374], [-2.87469, 53.12337], [-2.90649, 53.10964], [-2.98598, 53.15589], [-2.92022, 53.17685], [-2.92329, 53.19383], [-3.03675, 53.25092], [-3.08228, 53.25526], [-3.5082, 53.54318]]]] } },
      { type: "Feature", properties: { wikidata: "Q26", nameEn: "Northern Ireland", aliases: ["GB-NIR"], country: "GB", groups: ["Q22890", "Q3336843", "154", "150", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-6.34755, 55.49206], [-7.2471, 55.06933], [-7.34464, 55.04688], [-7.4033, 55.00391], [-7.40004, 54.94498], [-7.44404, 54.9403], [-7.4473, 54.87003], [-7.47626, 54.83084], [-7.54508, 54.79401], [-7.54671, 54.74606], [-7.64449, 54.75265], [-7.75041, 54.7103], [-7.83352, 54.73854], [-7.93293, 54.66603], [-7.70315, 54.62077], [-7.8596, 54.53671], [-7.99812, 54.54427], [-8.04538, 54.48941], [-8.179, 54.46763], [-8.04555, 54.36292], [-7.87101, 54.29299], [-7.8596, 54.21779], [-7.81397, 54.20159], [-7.69501, 54.20731], [-7.55812, 54.12239], [-7.4799, 54.12239], [-7.44567, 54.1539], [-7.32834, 54.11475], [-7.30553, 54.11869], [-7.34005, 54.14698], [-7.29157, 54.17191], [-7.28017, 54.16714], [-7.29687, 54.1354], [-7.29493, 54.12013], [-7.26316, 54.13863], [-7.25012, 54.20063], [-7.14908, 54.22732], [-7.19145, 54.31296], [-7.02034, 54.4212], [-6.87775, 54.34682], [-6.85179, 54.29176], [-6.81583, 54.22791], [-6.74575, 54.18788], [-6.70175, 54.20218], [-6.6382, 54.17071], [-6.66264, 54.0666], [-6.62842, 54.03503], [-6.47849, 54.06947], [-6.36605, 54.07234], [-6.36279, 54.11248], [-6.32694, 54.09337], [-6.29003, 54.11278], [-6.26218, 54.09785], [-5.83481, 53.87749], [-4.69044, 54.3629], [-6.34755, 55.49206]]]] } },
      { type: "Feature", properties: { wikidata: "Q35", nameEn: "Denmark", country: "DK", groups: ["EU", "154", "150", "UN"], callingCodes: ["45"] }, geometry: { type: "MultiPolygon", coordinates: [[[[12.16597, 56.60205], [10.40861, 58.38489], [7.28637, 57.35913], [8.02459, 55.09613], [8.45719, 55.06747], [8.55769, 54.91837], [8.63979, 54.91069], [8.76387, 54.8948], [8.81178, 54.90518], [8.92795, 54.90452], [9.04629, 54.87249], [9.14275, 54.87421], [9.20571, 54.85841], [9.24631, 54.84726], [9.23445, 54.83432], [9.2474, 54.8112], [9.32771, 54.80602], [9.33849, 54.80233], [9.36496, 54.81749], [9.38532, 54.83968], [9.41213, 54.84254], [9.43155, 54.82586], [9.4659, 54.83131], [9.58937, 54.88785], [9.62734, 54.88057], [9.61187, 54.85548], [9.73563, 54.8247], [9.89314, 54.84171], [10.16755, 54.73883], [10.31111, 54.65968], [11.00303, 54.63689], [11.90309, 54.38543], [12.85844, 54.82438], [13.93395, 54.84044], [15.36991, 54.73263], [15.79951, 55.54655], [14.89259, 55.5623], [14.28399, 55.1553], [12.84405, 55.13257], [12.60345, 55.42675], [12.88472, 55.63369], [12.6372, 55.91371], [12.65312, 56.04345], [12.07466, 56.29488], [12.16597, 56.60205]]]] } },
      { type: "Feature", properties: { wikidata: "Q55", nameEn: "Netherlands", country: "NL", groups: ["EU", "155", "150", "UN"], callingCodes: ["31"] }, geometry: { type: "MultiPolygon", coordinates: [[[[5.45168, 54.20039], [2.56575, 51.85301], [3.36263, 51.37112], [3.38696, 51.33436], [3.35847, 51.31572], [3.38289, 51.27331], [3.41704, 51.25933], [3.43488, 51.24135], [3.52698, 51.2458], [3.51502, 51.28697], [3.58939, 51.30064], [3.78999, 51.25766], [3.78783, 51.2151], [3.90125, 51.20371], [3.97889, 51.22537], [4.01957, 51.24504], [4.05165, 51.24171], [4.16721, 51.29348], [4.24024, 51.35371], [4.21923, 51.37443], [4.33265, 51.37687], [4.34086, 51.35738], [4.39292, 51.35547], [4.43777, 51.36989], [4.38064, 51.41965], [4.39747, 51.43316], [4.38122, 51.44905], [4.47736, 51.4778], [4.5388, 51.48184], [4.54675, 51.47265], [4.52846, 51.45002], [4.53521, 51.4243], [4.57489, 51.4324], [4.65442, 51.42352], [4.72935, 51.48424], [4.74578, 51.48937], [4.77321, 51.50529], [4.78803, 51.50284], [4.84139, 51.4799], [4.82409, 51.44736], [4.82946, 51.4213], [4.78314, 51.43319], [4.76577, 51.43046], [4.77229, 51.41337], [4.78941, 51.41102], [4.84988, 51.41502], [4.90016, 51.41404], [4.92152, 51.39487], [5.00393, 51.44406], [5.0106, 51.47167], [5.03281, 51.48679], [5.04774, 51.47022], [5.07891, 51.4715], [5.10456, 51.43163], [5.07102, 51.39469], [5.13105, 51.34791], [5.13377, 51.31592], [5.16222, 51.31035], [5.2002, 51.32243], [5.24244, 51.30495], [5.22542, 51.26888], [5.23814, 51.26064], [5.26461, 51.26693], [5.29716, 51.26104], [5.33886, 51.26314], [5.347, 51.27502], [5.41672, 51.26248], [5.4407, 51.28169], [5.46519, 51.2849], [5.48476, 51.30053], [5.515, 51.29462], [5.5569, 51.26544], [5.5603, 51.22249], [5.65145, 51.19788], [5.65528, 51.18736], [5.70344, 51.1829], [5.74617, 51.18928], [5.77735, 51.17845], [5.77697, 51.1522], [5.82564, 51.16753], [5.85508, 51.14445], [5.80798, 51.11661], [5.8109, 51.10861], [5.83226, 51.10585], [5.82921, 51.09328], [5.79903, 51.09371], [5.79835, 51.05834], [5.77258, 51.06196], [5.75961, 51.03113], [5.77688, 51.02483], [5.76242, 50.99703], [5.71864, 50.96092], [5.72875, 50.95428], [5.74752, 50.96202], [5.75927, 50.95601], [5.74644, 50.94723], [5.72545, 50.92312], [5.72644, 50.91167], [5.71626, 50.90796], [5.69858, 50.91046], [5.67886, 50.88142], [5.64504, 50.87107], [5.64009, 50.84742], [5.65259, 50.82309], [5.70118, 50.80764], [5.68995, 50.79641], [5.70107, 50.7827], [5.68091, 50.75804], [5.69469, 50.75529], [5.72216, 50.76398], [5.73904, 50.75674], [5.74356, 50.7691], [5.76533, 50.78159], [5.77513, 50.78308], [5.80673, 50.7558], [5.84548, 50.76542], [5.84888, 50.75448], [5.88734, 50.77092], [5.89129, 50.75125], [5.89132, 50.75124], [5.95942, 50.7622], [5.97545, 50.75441], [6.01976, 50.75398], [6.02624, 50.77453], [5.97497, 50.79992], [5.98404, 50.80988], [6.00462, 50.80065], [6.02328, 50.81694], [6.01921, 50.84435], [6.05623, 50.8572], [6.05702, 50.85179], [6.07431, 50.84674], [6.07693, 50.86025], [6.08805, 50.87223], [6.07486, 50.89307], [6.09297, 50.92066], [6.01615, 50.93367], [6.02697, 50.98303], [5.95282, 50.98728], [5.90296, 50.97356], [5.90493, 51.00198], [5.87849, 51.01969], [5.86735, 51.05182], [5.9134, 51.06736], [5.9541, 51.03496], [5.98292, 51.07469], [6.16706, 51.15677], [6.17384, 51.19589], [6.07889, 51.17038], [6.07889, 51.24432], [6.16977, 51.33169], [6.22674, 51.36135], [6.22641, 51.39948], [6.20654, 51.40049], [6.21724, 51.48568], [6.18017, 51.54096], [6.09055, 51.60564], [6.11759, 51.65609], [6.02767, 51.6742], [6.04091, 51.71821], [5.95003, 51.7493], [5.98665, 51.76944], [5.94568, 51.82786], [5.99848, 51.83195], [6.06705, 51.86136], [6.10337, 51.84829], [6.16902, 51.84094], [6.11551, 51.89769], [6.15349, 51.90439], [6.21443, 51.86801], [6.29872, 51.86801], [6.30593, 51.84998], [6.40704, 51.82771], [6.38815, 51.87257], [6.47179, 51.85395], [6.50231, 51.86313], [6.58556, 51.89386], [6.68386, 51.91861], [6.72319, 51.89518], [6.82357, 51.96711], [6.83035, 51.9905], [6.68128, 52.05052], [6.76117, 52.11895], [6.83984, 52.11728], [6.97189, 52.20329], [6.9897, 52.2271], [7.03729, 52.22695], [7.06365, 52.23789], [7.02703, 52.27941], [7.07044, 52.37805], [7.03417, 52.40237], [6.99041, 52.47235], [6.94293, 52.43597], [6.69507, 52.488], [6.71641, 52.62905], [6.77307, 52.65375], [7.04557, 52.63318], [7.07253, 52.81083], [7.21694, 53.00742], [7.17898, 53.13817], [7.22681, 53.18165], [7.21679, 53.20058], [7.19052, 53.31866], [7.00198, 53.32672], [6.91025, 53.44221], [5.45168, 54.20039]], [[4.93295, 51.44945], [4.95244, 51.45207], [4.9524, 51.45014], [4.93909, 51.44632], [4.93295, 51.44945]], [[4.91493, 51.4353], [4.91935, 51.43634], [4.92227, 51.44252], [4.91811, 51.44621], [4.92287, 51.44741], [4.92811, 51.4437], [4.92566, 51.44273], [4.92815, 51.43856], [4.92879, 51.44161], [4.93544, 51.44634], [4.94025, 51.44193], [4.93416, 51.44185], [4.93471, 51.43861], [4.94265, 51.44003], [4.93986, 51.43064], [4.92952, 51.42984], [4.92652, 51.43329], [4.91493, 51.4353]]]] } },
      { type: "Feature", properties: { wikidata: "Q782", nameEn: "Hawaii", aliases: ["US-HI"], country: "US", groups: ["Q35657", "061", "009", "UN"], roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-177.8563, 29.18961], [-179.49839, 27.86265], [-151.6784, 9.55515], [-154.05867, 45.51124], [-177.5224, 27.7635], [-177.8563, 29.18961]]]] } },
      { type: "Feature", properties: { wikidata: "Q797", nameEn: "Alaska", aliases: ["US-AK"], country: "US", groups: ["Q35657", "021", "003", "019", "UN"], roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[169.34848, 52.47228], [180, 51.0171], [179.84401, 55.10087], [169.34848, 52.47228]]], [[[-168.95635, 65.98512], [-169.03888, 65.48473], [-172.76104, 63.77445], [-179.55295, 57.62081], [-179.55295, 50.81807], [-133.92876, 54.62289], [-130.61931, 54.70835], [-130.64499, 54.76912], [-130.44184, 54.85377], [-130.27203, 54.97174], [-130.18765, 55.07744], [-130.08035, 55.21556], [-129.97513, 55.28029], [-130.15373, 55.74895], [-130.00857, 55.91344], [-130.00093, 56.00325], [-130.10173, 56.12178], [-130.33965, 56.10849], [-130.77769, 56.36185], [-131.8271, 56.62247], [-133.38523, 58.42773], [-133.84645, 58.73543], [-134.27175, 58.8634], [-134.48059, 59.13231], [-134.55699, 59.1297], [-134.7047, 59.2458], [-135.00267, 59.28745], [-135.03069, 59.56208], [-135.48007, 59.79937], [-136.31566, 59.59083], [-136.22381, 59.55526], [-136.33727, 59.44466], [-136.47323, 59.46617], [-136.52365, 59.16752], [-136.82619, 59.16198], [-137.4925, 58.89415], [-137.60623, 59.24465], [-138.62145, 59.76431], [-138.71149, 59.90728], [-139.05365, 59.99655], [-139.20603, 60.08896], [-139.05831, 60.35205], [-139.68991, 60.33693], [-139.98024, 60.18027], [-140.45648, 60.30919], [-140.5227, 60.22077], [-141.00116, 60.30648], [-140.97446, 84.39275], [-168.25765, 71.99091], [-168.95635, 65.98512]]]] } },
      { type: "Feature", properties: { wikidata: "Q3492", nameEn: "Sumatra", aliases: ["ID-SM"], country: "ID", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["62"] }, geometry: { type: "MultiPolygon", coordinates: [[[[109.82788, 2.86812], [110.90339, 7.52694], [105.01437, 3.24936], [104.56723, 1.44271], [104.34728, 1.33529], [104.12282, 1.27714], [104.03085, 1.26954], [103.74084, 1.12902], [103.66049, 1.18825], [103.56591, 1.19719], [103.03657, 1.30383], [96.11174, 6.69841], [74.28481, -3.17525], [102.92489, -8.17146], [106.32259, -5.50116], [106.38511, -5.16715], [109.17017, -4.07401], [109.3962, -2.07276], [108.50935, -2.01066], [107.94791, 1.06924], [109.82788, 2.86812]]]] } },
      { type: "Feature", properties: { wikidata: "Q3757", nameEn: "Java", aliases: ["ID-JW"], country: "ID", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["62"] }, geometry: { type: "MultiPolygon", coordinates: [[[[109.17017, -4.07401], [106.38511, -5.16715], [106.32259, -5.50116], [102.92489, -8.17146], [116.22542, -10.49172], [114.39575, -8.2889], [114.42235, -8.09762], [114.92859, -7.49253], [116.33992, -7.56171], [116.58433, -5.30385], [109.17017, -4.07401]]]] } },
      { type: "Feature", properties: { wikidata: "Q3795", nameEn: "Kalimantan", aliases: ["ID-KA"], country: "ID", groups: ["Q36117", "035", "142", "UN"], driveSide: "left", callingCodes: ["62"] }, geometry: { type: "MultiPolygon", coordinates: [[[[120.02464, 2.83703], [118.06469, 4.16638], [117.67641, 4.16535], [117.47313, 4.18857], [117.25801, 4.35108], [115.90217, 4.37708], [115.58276, 3.93499], [115.53713, 3.14776], [115.11343, 2.82879], [115.1721, 2.49671], [114.80706, 2.21665], [114.80706, 1.92351], [114.57892, 1.5], [114.03788, 1.44787], [113.64677, 1.23933], [113.01448, 1.42832], [113.021, 1.57819], [112.48648, 1.56516], [112.2127, 1.44135], [112.15679, 1.17004], [111.94553, 1.12016], [111.82846, 0.99349], [111.55434, 0.97864], [111.22979, 1.08326], [110.62374, 0.873], [110.49182, 0.88088], [110.35354, 0.98869], [109.66397, 1.60425], [109.66397, 1.79972], [109.57923, 1.80624], [109.53794, 1.91771], [109.62558, 1.99182], [109.82788, 2.86812], [107.94791, 1.06924], [108.50935, -2.01066], [109.3962, -2.07276], [109.17017, -4.07401], [116.58433, -5.30385], [120.02464, 2.83703]]]] } },
      { type: "Feature", properties: { wikidata: "Q3803", nameEn: "Lesser Sunda Islands", aliases: ["ID-NU"], country: "ID", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["62"] }, geometry: { type: "MultiPolygon", coordinates: [[[[116.96967, -8.01483], [114.92859, -7.49253], [114.42235, -8.09762], [114.39575, -8.2889], [116.22542, -10.49172], [122.14954, -11.52517], [125.68138, -9.85176], [125.09025, -9.46406], [124.97892, -9.19281], [125.04044, -9.17093], [125.09434, -9.19669], [125.18907, -9.16434], [125.18632, -9.03142], [125.11764, -8.96359], [124.97742, -9.08128], [124.94011, -8.85617], [124.46701, -9.13002], [124.45971, -9.30263], [124.38554, -9.3582], [124.35258, -9.43002], [124.3535, -9.48493], [124.28115, -9.50453], [124.28115, -9.42189], [124.21247, -9.36904], [124.14517, -9.42324], [124.10539, -9.41206], [124.04286, -9.34243], [124.04628, -9.22671], [124.33472, -9.11416], [124.92337, -8.75859], [125.87688, -7.49892], [116.96967, -8.01483]]]] } },
      { type: "Feature", properties: { wikidata: "Q3812", nameEn: "Sulawesi", aliases: ["ID-SL"], country: "ID", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["62"] }, geometry: { type: "MultiPolygon", coordinates: [[[[128.34321, 3.90322], [126.69413, 6.02692], [119.56457, 0.90759], [116.58433, -5.30385], [116.33992, -7.56171], [116.96967, -8.01483], [125.87688, -7.49892], [123.78965, -0.86805], [128.34321, 3.90322]]]] } },
      { type: "Feature", properties: { wikidata: "Q3827", nameEn: "Maluku Islands", aliases: ["ID-ML"], country: "ID", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["62"] }, geometry: { type: "MultiPolygon", coordinates: [[[[129.63187, 2.21409], [128.34321, 3.90322], [123.78965, -0.86805], [125.87688, -7.49892], [125.58506, -7.95311], [125.87691, -8.31789], [127.42116, -8.22471], [127.55165, -9.05052], [135.49042, -9.2276], [135.35517, -5.01442], [132.8312, -4.70282], [130.8468, -2.61103], [128.40647, -2.30349], [129.71519, -0.24692], [129.63187, 2.21409]]]] } },
      { type: "Feature", properties: { wikidata: "Q3845", nameEn: "Western New Guinea", aliases: ["ID-PP"], country: "ID", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["62"] }, geometry: { type: "MultiPolygon", coordinates: [[[[135.49042, -9.2276], [141.01842, -9.35091], [141.01763, -6.90181], [140.90448, -6.85033], [140.85295, -6.72996], [140.99813, -6.3233], [141.02352, 0.08993], [129.63187, 2.21409], [129.71519, -0.24692], [128.40647, -2.30349], [130.8468, -2.61103], [132.8312, -4.70282], [135.35517, -5.01442], [135.49042, -9.2276]]]] } },
      { type: "Feature", properties: { wikidata: "Q5765", nameEn: "Balearic Islands", aliases: ["ES-IB"], country: "ES", groups: ["EU", "039", "150", "UN"], callingCodes: ["34 971"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.27707, 35.35051], [5.10072, 39.89531], [3.75438, 42.33445], [-2.27707, 35.35051]]]] } },
      { type: "Feature", properties: { wikidata: "Q5823", nameEn: "Ceuta", aliases: ["ES-CE"], country: "ES", groups: ["EA", "EU", "015", "002", "UN"], level: "subterritory", callingCodes: ["34"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-5.38491, 35.92591], [-5.37338, 35.88417], [-5.35844, 35.87375], [-5.34379, 35.8711], [-5.21179, 35.90091], [-5.38491, 35.92591]]]] } },
      { type: "Feature", properties: { wikidata: "Q5831", nameEn: "Melilla", aliases: ["ES-ML"], country: "ES", groups: ["EA", "EU", "015", "002", "UN"], level: "subterritory", callingCodes: ["34"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.91909, 35.33927], [-2.96038, 35.31609], [-2.96648, 35.30475], [-2.96978, 35.29459], [-2.97035, 35.28852], [-2.96507, 35.28801], [-2.96826, 35.28296], [-2.96516, 35.27967], [-2.95431, 35.2728], [-2.95065, 35.26576], [-2.93893, 35.26737], [-2.92272, 35.27509], [-2.91909, 35.33927]]]] } },
      { type: "Feature", properties: { wikidata: "Q7835", nameEn: "Crimea", country: "RU", groups: ["151", "150", "UN"], level: "subterritory", callingCodes: ["7"] }, geometry: { type: "MultiPolygon", coordinates: [[[[33.5, 44], [36.4883, 45.0488], [36.475, 45.2411], [36.5049, 45.3136], [36.6545, 45.3417], [36.6645, 45.4514], [35.0498, 45.7683], [34.9601, 45.7563], [34.7991, 45.8101], [34.8015, 45.9005], [34.7548, 45.907], [34.6668, 45.9714], [34.6086, 45.9935], [34.5589, 45.9935], [34.5201, 45.951], [34.4873, 45.9427], [34.4415, 45.9599], [34.4122, 46.0025], [34.3391, 46.0611], [34.2511, 46.0532], [34.181, 46.068], [34.1293, 46.1049], [34.0731, 46.1177], [34.0527, 46.1084], [33.9155, 46.1594], [33.8523, 46.1986], [33.7972, 46.2048], [33.7405, 46.1855], [33.646, 46.2303], [33.6152, 46.2261], [33.6385, 46.1415], [33.6147, 46.1356], [33.5732, 46.1032], [33.5909, 46.0601], [33.5597, 46.0307], [31.5, 45.5], [33.5, 44]]]] } },
      { type: "Feature", properties: { wikidata: "Q12837", nameEn: "Iberia", level: "sharedLandform" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q14056", nameEn: "Jan Mayen", aliases: ["NO-22"], country: "NO", groups: ["SJ", "154", "150", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[-9.18243, 72.23144], [-10.71459, 70.09565], [-5.93364, 70.76368], [-9.18243, 72.23144]]]] } },
      { type: "Feature", properties: { wikidata: "Q19188", nameEn: "Mainland China", country: "CN", groups: ["030", "142", "UN"], callingCodes: ["86"] }, geometry: { type: "MultiPolygon", coordinates: [[[[125.6131, 53.07229], [125.17522, 53.20225], [124.46078, 53.21881], [123.86158, 53.49391], [123.26989, 53.54843], [122.85966, 53.47395], [122.35063, 53.49565], [121.39213, 53.31888], [120.85633, 53.28499], [120.0451, 52.7359], [120.04049, 52.58773], [120.46454, 52.63811], [120.71673, 52.54099], [120.61346, 52.32447], [120.77337, 52.20805], [120.65907, 51.93544], [120.10963, 51.671], [119.13553, 50.37412], [119.38598, 50.35162], [119.27996, 50.13348], [119.11003, 50.00276], [118.61623, 49.93809], [117.82343, 49.52696], [117.48208, 49.62324], [117.27597, 49.62544], [116.71193, 49.83813], [116.03781, 48.87014], [116.06565, 48.81716], [115.78876, 48.51781], [115.811, 48.25699], [115.52082, 48.15367], [115.57128, 47.91988], [115.94296, 47.67741], [116.21879, 47.88505], [116.4465, 47.83662], [116.67405, 47.89039], [116.9723, 47.87285], [117.37875, 47.63627], [117.50181, 47.77216], [117.80196, 48.01661], [118.03676, 48.00982], [118.11009, 48.04], [118.22677, 48.03853], [118.29654, 48.00246], [118.55766, 47.99277], [118.7564, 47.76947], [119.12343, 47.66458], [119.13995, 47.53997], [119.35892, 47.48104], [119.31964, 47.42617], [119.54918, 47.29505], [119.56019, 47.24874], [119.62403, 47.24575], [119.71209, 47.19192], [119.85518, 46.92196], [119.91242, 46.90091], [119.89261, 46.66423], [119.80455, 46.67631], [119.77373, 46.62947], [119.68127, 46.59015], [119.65265, 46.62342], [119.42827, 46.63783], [119.32827, 46.61433], [119.24978, 46.64761], [119.10448, 46.65516], [119.00541, 46.74273], [118.92616, 46.72765], [118.89974, 46.77139], [118.8337, 46.77742], [118.78747, 46.68689], [118.30534, 46.73519], [117.69554, 46.50991], [117.60748, 46.59771], [117.41782, 46.57862], [117.36609, 46.36335], [116.83166, 46.38637], [116.75551, 46.33083], [116.58612, 46.30211], [116.26678, 45.96479], [116.24012, 45.8778], [116.27366, 45.78637], [116.16989, 45.68603], [115.60329, 45.44717], [114.94546, 45.37377], [114.74612, 45.43585], [114.54801, 45.38337], [114.5166, 45.27189], [113.70918, 44.72891], [112.74662, 44.86297], [112.4164, 45.06858], [111.98695, 45.09074], [111.76275, 44.98032], [111.40498, 44.3461], [111.96289, 43.81596], [111.93776, 43.68709], [111.79758, 43.6637], [111.59087, 43.51207], [111.0149, 43.3289], [110.4327, 42.78293], [110.08401, 42.6411], [109.89402, 42.63111], [109.452, 42.44842], [109.00679, 42.45302], [108.84489, 42.40246], [107.57258, 42.40898], [107.49681, 42.46221], [107.29755, 42.41395], [107.24774, 42.36107], [106.76517, 42.28741], [105.0123, 41.63188], [104.51667, 41.66113], [104.52258, 41.8706], [103.92804, 41.78246], [102.72403, 42.14675], [102.07645, 42.22519], [101.80515, 42.50074], [100.84979, 42.67087], [100.33297, 42.68231], [99.50671, 42.56535], [97.1777, 42.7964], [96.37926, 42.72055], [96.35658, 42.90363], [95.89543, 43.2528], [95.52594, 43.99353], [95.32891, 44.02407], [95.39772, 44.2805], [95.01191, 44.25274], [94.71959, 44.35284], [94.10003, 44.71016], [93.51161, 44.95964], [91.64048, 45.07408], [90.89169, 45.19667], [90.65114, 45.49314], [90.70907, 45.73437], [91.03026, 46.04194], [90.99672, 46.14207], [90.89639, 46.30711], [91.07696, 46.57315], [91.0147, 46.58171], [91.03649, 46.72916], [90.84035, 46.99525], [90.76108, 46.99399], [90.48542, 47.30438], [90.48854, 47.41826], [90.33598, 47.68303], [90.10871, 47.7375], [90.06512, 47.88177], [89.76624, 47.82745], [89.55453, 48.0423], [89.0711, 47.98528], [88.93186, 48.10263], [88.8011, 48.11302], [88.58316, 48.21893], [88.58939, 48.34531], [87.96361, 48.58478], [88.0788, 48.71436], [87.73822, 48.89582], [87.88171, 48.95853], [87.81333, 49.17354], [87.48983, 49.13794], [87.478, 49.07403], [87.28386, 49.11626], [86.87238, 49.12432], [86.73568, 48.99918], [86.75343, 48.70331], [86.38069, 48.46064], [85.73581, 48.3939], [85.5169, 48.05493], [85.61067, 47.49753], [85.69696, 47.2898], [85.54294, 47.06171], [85.22443, 47.04816], [84.93995, 46.87399], [84.73077, 47.01394], [83.92184, 46.98912], [83.04622, 47.19053], [82.21792, 45.56619], [82.58474, 45.40027], [82.51374, 45.1755], [81.73278, 45.3504], [80.11169, 45.03352], [79.8987, 44.89957], [80.38384, 44.63073], [80.40229, 44.23319], [80.40031, 44.10986], [80.75156, 43.44948], [80.69718, 43.32589], [80.77771, 43.30065], [80.78817, 43.14235], [80.62913, 43.141], [80.3735, 43.01557], [80.58999, 42.9011], [80.38169, 42.83142], [80.26886, 42.8366], [80.16892, 42.61137], [80.26841, 42.23797], [80.17807, 42.21166], [80.17842, 42.03211], [79.92977, 42.04113], [78.3732, 41.39603], [78.15757, 41.38565], [78.12873, 41.23091], [77.81287, 41.14307], [77.76206, 41.01574], [77.52723, 41.00227], [77.3693, 41.0375], [77.28004, 41.0033], [76.99302, 41.0696], [76.75681, 40.95354], [76.5261, 40.46114], [76.33659, 40.3482], [75.96168, 40.38064], [75.91361, 40.2948], [75.69663, 40.28642], [75.5854, 40.66874], [75.22834, 40.45382], [75.08243, 40.43945], [74.82013, 40.52197], [74.78168, 40.44886], [74.85996, 40.32857], [74.69875, 40.34668], [74.35063, 40.09742], [74.25533, 40.13191], [73.97049, 40.04378], [73.83006, 39.76136], [73.9051, 39.75073], [73.92354, 39.69565], [73.94683, 39.60733], [73.87018, 39.47879], [73.59831, 39.46425], [73.59241, 39.40843], [73.5004, 39.38402], [73.55396, 39.3543], [73.54572, 39.27567], [73.60638, 39.24534], [73.75823, 39.023], [73.81728, 39.04007], [73.82964, 38.91517], [73.7445, 38.93867], [73.7033, 38.84782], [73.80656, 38.66449], [73.79806, 38.61106], [73.97933, 38.52945], [74.17022, 38.65504], [74.51217, 38.47034], [74.69619, 38.42947], [74.69894, 38.22155], [74.80331, 38.19889], [74.82665, 38.07359], [74.9063, 38.03033], [74.92416, 37.83428], [75.00935, 37.77486], [74.8912, 37.67576], [74.94338, 37.55501], [75.06011, 37.52779], [75.15899, 37.41443], [75.09719, 37.37297], [75.12328, 37.31839], [74.88887, 37.23275], [74.80605, 37.21565], [74.49981, 37.24518], [74.56453, 37.03023], [75.13839, 37.02622], [75.40481, 36.95382], [75.45562, 36.71971], [75.72737, 36.7529], [75.92391, 36.56986], [76.0324, 36.41198], [76.00906, 36.17511], [75.93028, 36.13136], [76.15325, 35.9264], [76.14913, 35.82848], [76.33453, 35.84296], [76.50961, 35.8908], [76.77323, 35.66062], [76.84539, 35.67356], [76.96624, 35.5932], [77.44277, 35.46132], [77.70232, 35.46244], [77.80532, 35.52058], [78.11664, 35.48022], [78.03466, 35.3785], [78.00033, 35.23954], [78.22692, 34.88771], [78.18435, 34.7998], [78.27781, 34.61484], [78.54964, 34.57283], [78.56475, 34.50835], [78.74465, 34.45174], [79.05364, 34.32482], [78.99802, 34.3027], [78.91769, 34.15452], [78.66225, 34.08858], [78.65657, 34.03195], [78.73367, 34.01121], [78.77349, 33.73871], [78.67599, 33.66445], [78.73636, 33.56521], [79.15252, 33.17156], [79.14016, 33.02545], [79.46562, 32.69668], [79.26768, 32.53277], [79.13174, 32.47766], [79.0979, 32.38051], [78.99322, 32.37948], [78.96713, 32.33655], [78.7831, 32.46873], [78.73916, 32.69438], [78.38897, 32.53938], [78.4645, 32.45367], [78.49609, 32.2762], [78.68754, 32.10256], [78.74404, 32.00384], [78.78036, 31.99478], [78.69933, 31.78723], [78.84516, 31.60631], [78.71032, 31.50197], [78.77898, 31.31209], [78.89344, 31.30481], [79.01931, 31.42817], [79.14016, 31.43403], [79.30694, 31.17357], [79.59884, 30.93943], [79.93255, 30.88288], [80.20721, 30.58541], [80.54504, 30.44936], [80.83343, 30.32023], [81.03953, 30.20059], [81.12842, 30.01395], [81.24362, 30.0126], [81.29032, 30.08806], [81.2623, 30.14596], [81.33355, 30.15303], [81.39928, 30.21862], [81.41018, 30.42153], [81.5459, 30.37688], [81.62033, 30.44703], [81.99082, 30.33423], [82.10135, 30.35439], [82.10757, 30.23745], [82.19475, 30.16884], [82.16984, 30.0692], [82.38622, 30.02608], [82.5341, 29.9735], [82.73024, 29.81695], [83.07116, 29.61957], [83.28131, 29.56813], [83.44787, 29.30513], [83.63156, 29.16249], [83.82303, 29.30513], [83.97559, 29.33091], [84.18107, 29.23451], [84.24801, 29.02783], [84.2231, 28.89571], [84.47528, 28.74023], [84.62317, 28.73887], [84.85511, 28.58041], [85.06059, 28.68562], [85.19135, 28.62825], [85.18668, 28.54076], [85.10729, 28.34092], [85.38127, 28.28336], [85.4233, 28.32996], [85.59765, 28.30529], [85.60854, 28.25045], [85.69105, 28.38475], [85.71907, 28.38064], [85.74864, 28.23126], [85.84672, 28.18187], [85.90743, 28.05144], [85.97813, 27.99023], [85.94946, 27.9401], [86.06309, 27.90021], [86.12069, 27.93047], [86.08333, 28.02121], [86.088, 28.09264], [86.18607, 28.17364], [86.22966, 27.9786], [86.42736, 27.91122], [86.51609, 27.96623], [86.56265, 28.09569], [86.74181, 28.10638], [86.75582, 28.04182], [87.03757, 27.94835], [87.11696, 27.84104], [87.56996, 27.84517], [87.72718, 27.80938], [87.82681, 27.95248], [88.13378, 27.88015], [88.1278, 27.95417], [88.25332, 27.9478], [88.54858, 28.06057], [88.63235, 28.12356], [88.83559, 28.01936], [88.88091, 27.85192], [88.77517, 27.45415], [88.82981, 27.38814], [88.91901, 27.32483], [88.93678, 27.33777], [88.96947, 27.30319], [89.00216, 27.32532], [88.95355, 27.4106], [88.97213, 27.51671], [89.0582, 27.60985], [89.12825, 27.62502], [89.59525, 28.16433], [89.79762, 28.23979], [90.13387, 28.19178], [90.58842, 28.02838], [90.69894, 28.07784], [91.20019, 27.98715], [91.25779, 28.07509], [91.46327, 28.0064], [91.48973, 27.93903], [91.5629, 27.84823], [91.6469, 27.76358], [91.84722, 27.76325], [91.87057, 27.7195], [92.27432, 27.89077], [92.32101, 27.79363], [92.42538, 27.80092], [92.7275, 27.98662], [92.73025, 28.05814], [92.65472, 28.07632], [92.67486, 28.15018], [92.93075, 28.25671], [93.14635, 28.37035], [93.18069, 28.50319], [93.44621, 28.67189], [93.72797, 28.68821], [94.35897, 29.01965], [94.2752, 29.11687], [94.69318, 29.31739], [94.81353, 29.17804], [95.0978, 29.14446], [95.11291, 29.09527], [95.2214, 29.10727], [95.26122, 29.07727], [95.3038, 29.13847], [95.41091, 29.13007], [95.50842, 29.13487], [95.72086, 29.20797], [95.75149, 29.32063], [95.84899, 29.31464], [96.05361, 29.38167], [96.31316, 29.18643], [96.18682, 29.11087], [96.20467, 29.02325], [96.3626, 29.10607], [96.61391, 28.72742], [96.40929, 28.51526], [96.48895, 28.42955], [96.6455, 28.61657], [96.85561, 28.4875], [96.88445, 28.39452], [96.98882, 28.32564], [97.1289, 28.3619], [97.34547, 28.21385], [97.41729, 28.29783], [97.47085, 28.2688], [97.50518, 28.49716], [97.56835, 28.55628], [97.70705, 28.5056], [97.79632, 28.33168], [97.90069, 28.3776], [98.15337, 28.12114], [98.13964, 27.9478], [98.32641, 27.51385], [98.42529, 27.55404], [98.43353, 27.67086], [98.69582, 27.56499], [98.7333, 26.85615], [98.77547, 26.61994], [98.72741, 26.36183], [98.67797, 26.24487], [98.7329, 26.17218], [98.66884, 26.09165], [98.63128, 26.15492], [98.57085, 26.11547], [98.60763, 26.01512], [98.70818, 25.86241], [98.63128, 25.79937], [98.54064, 25.85129], [98.40606, 25.61129], [98.31268, 25.55307], [98.25774, 25.6051], [98.16848, 25.62739], [98.18084, 25.56298], [98.12591, 25.50722], [98.14925, 25.41547], [97.92541, 25.20815], [97.83614, 25.2715], [97.77023, 25.11492], [97.72216, 25.08508], [97.72903, 24.91332], [97.79949, 24.85655], [97.76481, 24.8289], [97.73127, 24.83015], [97.70181, 24.84557], [97.64354, 24.79171], [97.56648, 24.76475], [97.56383, 24.75535], [97.5542, 24.74943], [97.54675, 24.74202], [97.56525, 24.72838], [97.56286, 24.54535], [97.52757, 24.43748], [97.60029, 24.4401], [97.66998, 24.45288], [97.7098, 24.35658], [97.65624, 24.33781], [97.66723, 24.30027], [97.71941, 24.29652], [97.76799, 24.26365], [97.72998, 24.2302], [97.72799, 24.18883], [97.75305, 24.16902], [97.72903, 24.12606], [97.62363, 24.00506], [97.5247, 23.94032], [97.64667, 23.84574], [97.72302, 23.89288], [97.79456, 23.94836], [97.79416, 23.95663], [97.84328, 23.97603], [97.86545, 23.97723], [97.88811, 23.97446], [97.8955, 23.97758], [97.89676, 23.97931], [97.89683, 23.98389], [97.88814, 23.98605], [97.88414, 23.99405], [97.88616, 24.00463], [97.90998, 24.02094], [97.93951, 24.01953], [97.98691, 24.03897], [97.99583, 24.04932], [98.04709, 24.07616], [98.05302, 24.07408], [98.05671, 24.07961], [98.0607, 24.07812], [98.06703, 24.08028], [98.07806, 24.07988], [98.20666, 24.11406], [98.54476, 24.13119], [98.59256, 24.08371], [98.85319, 24.13042], [98.87998, 24.15624], [98.89632, 24.10612], [98.67797, 23.9644], [98.68209, 23.80492], [98.79607, 23.77947], [98.82933, 23.72921], [98.81775, 23.694], [98.88396, 23.59555], [98.80294, 23.5345], [98.82877, 23.47908], [98.87683, 23.48995], [98.92104, 23.36946], [98.87573, 23.33038], [98.93958, 23.31414], [98.92515, 23.29535], [98.88597, 23.18656], [99.05975, 23.16382], [99.04601, 23.12215], [99.25741, 23.09025], [99.34127, 23.13099], [99.52214, 23.08218], [99.54218, 22.90014], [99.43537, 22.94086], [99.45654, 22.85726], [99.31243, 22.73893], [99.38247, 22.57544], [99.37972, 22.50188], [99.28771, 22.4105], [99.17318, 22.18025], [99.19176, 22.16983], [99.1552, 22.15874], [99.33166, 22.09656], [99.47585, 22.13345], [99.85351, 22.04183], [99.96612, 22.05965], [99.99084, 21.97053], [99.94003, 21.82782], [99.98654, 21.71064], [100.04956, 21.66843], [100.12679, 21.70539], [100.17486, 21.65306], [100.10757, 21.59945], [100.12542, 21.50365], [100.1625, 21.48704], [100.18447, 21.51898], [100.25863, 21.47043], [100.35201, 21.53176], [100.42892, 21.54325], [100.4811, 21.46148], [100.57861, 21.45637], [100.72143, 21.51898], [100.87265, 21.67396], [101.11744, 21.77659], [101.15156, 21.56129], [101.2124, 21.56422], [101.19349, 21.41959], [101.26912, 21.36482], [101.2229, 21.23271], [101.29326, 21.17254], [101.54563, 21.25668], [101.6068, 21.23329], [101.59491, 21.18621], [101.60886, 21.17947], [101.66977, 21.20004], [101.70548, 21.14911], [101.7622, 21.14813], [101.79266, 21.19025], [101.76745, 21.21571], [101.83887, 21.20983], [101.84412, 21.25291], [101.74014, 21.30967], [101.74224, 21.48276], [101.7727, 21.51794], [101.7475, 21.5873], [101.80001, 21.57461], [101.83257, 21.61562], [101.74555, 21.72852], [101.7791, 21.83019], [101.62566, 21.96574], [101.57525, 22.13026], [101.60675, 22.13513], [101.53638, 22.24794], [101.56789, 22.28876], [101.61306, 22.27515], [101.68973, 22.46843], [101.7685, 22.50337], [101.86828, 22.38397], [101.90714, 22.38688], [101.91344, 22.44417], [101.98487, 22.42766], [102.03633, 22.46164], [102.1245, 22.43372], [102.14099, 22.40092], [102.16621, 22.43336], [102.26428, 22.41321], [102.25339, 22.4607], [102.41061, 22.64184], [102.38415, 22.67919], [102.42618, 22.69212], [102.46665, 22.77108], [102.51802, 22.77969], [102.57095, 22.7036], [102.60675, 22.73376], [102.8636, 22.60735], [102.9321, 22.48659], [103.0722, 22.44775], [103.07843, 22.50097], [103.17961, 22.55705], [103.15782, 22.59873], [103.18895, 22.64471], [103.28079, 22.68063], [103.32282, 22.8127], [103.43179, 22.75816], [103.43646, 22.70648], [103.52675, 22.59155], [103.57812, 22.65764], [103.56255, 22.69499], [103.64506, 22.79979], [103.87904, 22.56683], [103.93286, 22.52703], [103.94513, 22.52553], [103.95191, 22.5134], [103.96352, 22.50584], [103.96783, 22.51173], [103.97384, 22.50634], [103.99247, 22.51958], [104.01088, 22.51823], [104.03734, 22.72945], [104.11384, 22.80363], [104.27084, 22.8457], [104.25683, 22.76534], [104.35593, 22.69353], [104.47225, 22.75813], [104.58122, 22.85571], [104.60457, 22.81841], [104.65283, 22.83419], [104.72755, 22.81984], [104.77114, 22.90017], [104.84942, 22.93631], [104.86765, 22.95178], [104.8334, 23.01484], [104.79478, 23.12934], [104.87382, 23.12854], [104.87992, 23.17141], [104.91435, 23.18666], [104.9486, 23.17235], [104.96532, 23.20463], [104.98712, 23.19176], [105.07002, 23.26248], [105.11672, 23.25247], [105.17276, 23.28679], [105.22569, 23.27249], [105.32376, 23.39684], [105.40782, 23.28107], [105.42805, 23.30824], [105.49966, 23.20669], [105.56037, 23.16806], [105.57594, 23.075], [105.72382, 23.06641], [105.8726, 22.92756], [105.90119, 22.94168], [105.99568, 22.94178], [106.00179, 22.99049], [106.19705, 22.98475], [106.27022, 22.87722], [106.34961, 22.86718], [106.49749, 22.91164], [106.51306, 22.94891], [106.55976, 22.92311], [106.60179, 22.92884], [106.6516, 22.86862], [106.6734, 22.89587], [106.71387, 22.88296], [106.71128, 22.85982], [106.78422, 22.81532], [106.81271, 22.8226], [106.83685, 22.8098], [106.82404, 22.7881], [106.76293, 22.73491], [106.72321, 22.63606], [106.71698, 22.58432], [106.65316, 22.5757], [106.61269, 22.60301], [106.58395, 22.474], [106.55665, 22.46498], [106.57221, 22.37], [106.55976, 22.34841], [106.6516, 22.33977], [106.69986, 22.22309], [106.67495, 22.1885], [106.6983, 22.15102], [106.70142, 22.02409], [106.68274, 21.99811], [106.69276, 21.96013], [106.72551, 21.97923], [106.74345, 22.00965], [106.81038, 21.97934], [106.9178, 21.97357], [106.92714, 21.93459], [106.97228, 21.92592], [106.99252, 21.95191], [107.05634, 21.92303], [107.06101, 21.88982], [107.00964, 21.85948], [107.02615, 21.81981], [107.10771, 21.79879], [107.20734, 21.71493], [107.24625, 21.7077], [107.29296, 21.74674], [107.35834, 21.6672], [107.35989, 21.60063], [107.38636, 21.59774], [107.41593, 21.64839], [107.47197, 21.6672], [107.49532, 21.62958], [107.49065, 21.59774], [107.54047, 21.5934], [107.56537, 21.61945], [107.66967, 21.60787], [107.80355, 21.66141], [107.86114, 21.65128], [107.90006, 21.5905], [107.92652, 21.58906], [107.95232, 21.5388], [107.96774, 21.53601], [107.97074, 21.54072], [107.97383, 21.53961], [107.97932, 21.54503], [108.02926, 21.54997], [108.0569, 21.53604], [108.10003, 21.47338], [108.00365, 17.98159], [111.60491, 13.57105], [118.41371, 24.06775], [118.11703, 24.39734], [118.28244, 24.51231], [118.35291, 24.51645], [118.42453, 24.54644], [118.56434, 24.49266], [120.49232, 25.22863], [121.03532, 26.8787], [123.5458, 31.01942], [122.29378, 31.76513], [122.80525, 33.30571], [123.85601, 37.49093], [123.90497, 38.79949], [124.17532, 39.8232], [124.23201, 39.9248], [124.35029, 39.95639], [124.37089, 40.03004], [124.3322, 40.05573], [124.38556, 40.11047], [124.40719, 40.13655], [124.86913, 40.45387], [125.71172, 40.85223], [125.76869, 40.87908], [126.00335, 40.92835], [126.242, 41.15454], [126.53189, 41.35206], [126.60631, 41.65565], [126.90729, 41.79955], [127.17841, 41.59714], [127.29712, 41.49473], [127.92943, 41.44291], [128.02633, 41.42103], [128.03311, 41.39232], [128.12967, 41.37931], [128.18546, 41.41279], [128.20061, 41.40895], [128.30716, 41.60322], [128.15119, 41.74568], [128.04487, 42.01769], [128.94007, 42.03537], [128.96068, 42.06657], [129.15178, 42.17224], [129.22285, 42.26491], [129.22423, 42.3553], [129.28541, 42.41574], [129.42882, 42.44702], [129.54701, 42.37254], [129.60482, 42.44461], [129.72541, 42.43739], [129.75294, 42.59409], [129.77183, 42.69435], [129.7835, 42.76521], [129.80719, 42.79218], [129.83277, 42.86746], [129.85261, 42.96494], [129.8865, 43.00395], [129.95082, 43.01051], [129.96409, 42.97306], [130.12957, 42.98361], [130.09764, 42.91425], [130.26095, 42.9027], [130.23068, 42.80125], [130.2385, 42.71127], [130.41826, 42.6011], [130.44361, 42.54849], [130.50123, 42.61636], [130.55143, 42.52158], [130.62107, 42.58413], [130.56576, 42.68925], [130.40213, 42.70788], [130.44361, 42.76205], [130.66524, 42.84753], [131.02438, 42.86518], [131.02668, 42.91246], [131.135, 42.94114], [131.10274, 43.04734], [131.20414, 43.13654], [131.19031, 43.21385], [131.30324, 43.39498], [131.29402, 43.46695], [131.19492, 43.53047], [131.21105, 43.82383], [131.26176, 43.94011], [131.23583, 43.96085], [131.25484, 44.03131], [131.30365, 44.04262], [131.1108, 44.70266], [130.95639, 44.85154], [131.48415, 44.99513], [131.68466, 45.12374], [131.66852, 45.2196], [131.76532, 45.22609], [131.86903, 45.33636], [131.99417, 45.2567], [132.83978, 45.05916], [132.96373, 45.0212], [133.12293, 45.1332], [133.09279, 45.25693], [133.19419, 45.51913], [133.41083, 45.57723], [133.48457, 45.86203], [133.60442, 45.90053], [133.67569, 45.9759], [133.72695, 46.05576], [133.68047, 46.14697], [133.88097, 46.25066], [133.91496, 46.4274], [133.84104, 46.46681], [134.03538, 46.75668], [134.20016, 47.33458], [134.50898, 47.4812], [134.7671, 47.72051], [134.55508, 47.98651], [134.67098, 48.1564], [134.75328, 48.36763], [134.49516, 48.42884], [132.66989, 47.96491], [132.57309, 47.71741], [131.90448, 47.68011], [131.2635, 47.73325], [131.09871, 47.6852], [130.95985, 47.6957], [130.90915, 47.90623], [130.65103, 48.10052], [130.84462, 48.30942], [130.52147, 48.61745], [130.66946, 48.88251], [130.43232, 48.90844], [130.2355, 48.86741], [129.85416, 49.11067], [129.67598, 49.29596], [129.50685, 49.42398], [129.40398, 49.44194], [129.35317, 49.3481], [129.23232, 49.40353], [129.11153, 49.36813], [128.72896, 49.58676], [127.83476, 49.5748], [127.53516, 49.84306], [127.49299, 50.01251], [127.60515, 50.23503], [127.37384, 50.28393], [127.36009, 50.43787], [127.28765, 50.46585], [127.36335, 50.58306], [127.28165, 50.72075], [127.14586, 50.91152], [126.93135, 51.0841], [126.90369, 51.3238], [126.68349, 51.70607], [126.44606, 51.98254], [126.558, 52.13738], [125.6131, 53.07229]], [[113.56865, 22.20973], [113.57123, 22.20416], [113.60504, 22.20464], [113.63011, 22.10782], [113.57191, 22.07696], [113.54839, 22.10909], [113.54942, 22.14519], [113.54093, 22.15497], [113.52659, 22.18271], [113.53552, 22.20607], [113.53301, 22.21235], [113.53591, 22.21369], [113.54093, 22.21314], [113.54333, 22.21688], [113.5508, 22.21672], [113.56865, 22.20973]], [[114.50148, 22.15017], [113.92195, 22.13873], [113.83338, 22.1826], [113.81621, 22.2163], [113.86771, 22.42972], [114.03113, 22.5065], [114.05438, 22.5026], [114.05729, 22.51104], [114.06272, 22.51617], [114.07267, 22.51855], [114.07817, 22.52997], [114.08606, 22.53276], [114.09048, 22.53716], [114.09692, 22.53435], [114.1034, 22.5352], [114.11181, 22.52878], [114.11656, 22.53415], [114.12665, 22.54003], [114.13823, 22.54319], [114.1482, 22.54091], [114.15123, 22.55163], [114.1597, 22.56041], [114.17247, 22.55944], [114.18338, 22.55444], [114.20655, 22.55706], [114.22185, 22.55343], [114.22888, 22.5436], [114.25154, 22.55977], [114.44998, 22.55977], [114.50148, 22.15017]]]] } },
      { type: "Feature", properties: { wikidata: "Q22890", nameEn: "Ireland", level: "sharedLandform" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q23666", nameEn: "Great Britain", country: "GB", level: "sharedLandform" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q23681", nameEn: "Northern Cyprus", groups: ["Q644636", "145", "142"], driveSide: "left", callingCodes: ["90 392"] }, geometry: { type: "MultiPolygon", coordinates: [[[[33.67678, 35.03866], [33.67742, 35.05963], [33.68474, 35.06602], [33.69095, 35.06237], [33.70861, 35.07644], [33.7161, 35.07279], [33.70209, 35.04882], [33.71482, 35.03722], [33.73824, 35.05321], [33.76106, 35.04253], [33.78581, 35.05104], [33.82067, 35.07826], [33.84168, 35.06823], [33.8541, 35.07201], [33.87479, 35.08881], [33.87097, 35.09389], [33.87622, 35.10457], [33.87224, 35.12293], [33.88561, 35.12449], [33.88943, 35.12007], [33.88737, 35.11408], [33.89853, 35.11377], [33.91789, 35.08688], [33.91299, 35.07579], [33.90247, 35.07686], [33.89485, 35.06873], [33.88367, 35.07877], [33.85261, 35.0574], [33.8355, 35.05777], [33.82051, 35.0667], [33.8012, 35.04786], [33.81524, 35.04192], [33.83055, 35.02865], [33.82875, 35.01685], [33.84045, 35.00616], [33.85216, 35.00579], [33.85891, 35.001], [33.85621, 34.98956], [33.83505, 34.98108], [33.84811, 34.97075], [33.86432, 34.97592], [33.90075, 34.96623], [33.98684, 34.76642], [35.48515, 34.70851], [35.51152, 36.10954], [32.82353, 35.70297], [32.46489, 35.48584], [32.60361, 35.16647], [32.64864, 35.19967], [32.70947, 35.18328], [32.70779, 35.14127], [32.85733, 35.07742], [32.86406, 35.1043], [32.94471, 35.09422], [33.01192, 35.15639], [33.08249, 35.17319], [33.11105, 35.15639], [33.15138, 35.19504], [33.27068, 35.16815], [33.3072, 35.16816], [33.31955, 35.18096], [33.35056, 35.18328], [33.34964, 35.17803], [33.35596, 35.17942], [33.35612, 35.17402], [33.36569, 35.17479], [33.3717, 35.1788], [33.37248, 35.18698], [33.38575, 35.2018], [33.4076, 35.20062], [33.41675, 35.16325], [33.46813, 35.10564], [33.48136, 35.0636], [33.47825, 35.04103], [33.45178, 35.02078], [33.45256, 35.00288], [33.47666, 35.00701], [33.48915, 35.06594], [33.53975, 35.08151], [33.57478, 35.06049], [33.567, 35.04803], [33.59658, 35.03635], [33.61215, 35.0527], [33.63765, 35.03869], [33.67678, 35.03866]]]] } },
      { type: "Feature", properties: { wikidata: "Q25231", nameEn: "Svalbard", aliases: ["NO-21"], country: "NO", groups: ["SJ", "154", "150", "UN"], level: "subterritory", callingCodes: ["47 79"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-7.49892, 77.24208], [32.07813, 72.01005], [36.85549, 84.09565], [-7.49892, 77.24208]]]] } },
      { type: "Feature", properties: { wikidata: "Q25263", nameEn: "Azores", aliases: ["PT-20"], country: "PT", groups: ["Q3320166", "Q2914565", "Q105472", "EU", "039", "150", "UN"], callingCodes: ["351"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-23.12984, 40.26428], [-36.43765, 41.39418], [-22.54767, 33.34416], [-23.12984, 40.26428]]]] } },
      { type: "Feature", properties: { wikidata: "Q25359", nameEn: "Navassa Island", aliases: ["UM-76"], country: "US", groups: ["UM", "Q1352230", "029", "003", "419", "019", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft" }, geometry: { type: "MultiPolygon", coordinates: [[[[-74.7289, 18.71009], [-75.71816, 18.46438], [-74.76465, 18.06252], [-74.7289, 18.71009]]]] } },
      { type: "Feature", properties: { wikidata: "Q25396", nameEn: "Bonaire", aliases: ["BQ-BO", "NL-BQ1"], country: "NL", groups: ["Q1451600", "BQ", "029", "003", "419", "019", "UN"], level: "subterritory", callingCodes: ["599 7"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-67.89186, 12.4116], [-68.90012, 12.62309], [-68.33524, 11.78151], [-68.01417, 11.77722], [-67.89186, 12.4116]]]] } },
      { type: "Feature", properties: { wikidata: "Q25528", nameEn: "Saba", aliases: ["BQ-SA", "NL-BQ2"], country: "NL", groups: ["Q1451600", "BQ", "029", "003", "419", "019", "UN"], level: "subterritory", callingCodes: ["599 4"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-63.07669, 17.79659], [-63.81314, 17.95045], [-63.22932, 17.32592], [-63.07669, 17.79659]]]] } },
      { type: "Feature", properties: { wikidata: "Q26180", nameEn: "Sint Eustatius", aliases: ["BQ-SE", "NL-BQ3"], country: "NL", groups: ["Q1451600", "BQ", "029", "003", "419", "019", "UN"], level: "subterritory", callingCodes: ["599 3"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-63.07669, 17.79659], [-63.34999, 16.94218], [-62.76692, 17.64353], [-63.07669, 17.79659]]]] } },
      { type: "Feature", properties: { wikidata: "Q26253", nameEn: "Madeira", aliases: ["PT-30"], country: "PT", groups: ["Q3320166", "Q2914565", "Q105472", "EU", "039", "150", "UN"], callingCodes: ["351"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-19.30302, 33.65304], [-16.04789, 29.65076], [-11.68307, 33.12333], [-19.30302, 33.65304]]]] } },
      { type: "Feature", properties: { wikidata: "Q26927", nameEn: "Lakshadweep", aliases: ["IN-LD"], country: "IN", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["91"] }, geometry: { type: "MultiPolygon", coordinates: [[[[67.64074, 11.57295], [76.59015, 5.591], [72.67494, 13.58102], [67.64074, 11.57295]]]] } },
      { type: "Feature", properties: { wikidata: "Q27329", nameEn: "Asian Russia", country: "RU", groups: ["142", "UN"], callingCodes: ["7"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-179.99933, 64.74703], [-172.76104, 63.77445], [-169.03888, 65.48473], [-168.95635, 65.98512], [-168.25765, 71.99091], [-179.9843, 71.90735], [-179.99933, 64.74703]]], [[[59.99809, 51.98263], [60.19925, 51.99173], [60.48915, 52.15175], [60.72581, 52.15538], [60.78201, 52.22067], [61.05417, 52.35096], [60.98021, 52.50068], [60.84709, 52.52228], [60.84118, 52.63912], [60.71693, 52.66245], [60.71989, 52.75923], [61.05842, 52.92217], [61.23462, 53.03227], [62.0422, 52.96105], [62.12799, 52.99133], [62.14574, 53.09626], [61.19024, 53.30536], [61.14291, 53.41481], [61.29082, 53.50992], [61.37957, 53.45887], [61.57185, 53.50112], [61.55706, 53.57144], [60.90626, 53.62937], [61.22574, 53.80268], [61.14283, 53.90063], [60.99796, 53.93699], [61.26863, 53.92797], [61.3706, 54.08464], [61.47603, 54.08048], [61.56941, 53.95703], [61.65318, 54.02445], [62.03913, 53.94768], [62.00966, 54.04134], [62.38535, 54.03961], [62.45931, 53.90737], [62.56876, 53.94047], [62.58651, 54.05871], [63.80604, 54.27079], [63.91224, 54.20013], [64.02715, 54.22679], [63.97686, 54.29763], [64.97216, 54.4212], [65.11033, 54.33028], [65.24663, 54.35721], [65.20174, 54.55216], [68.21308, 54.98645], [68.26661, 55.09226], [68.19206, 55.18823], [68.90865, 55.38148], [69.34224, 55.36344], [69.74917, 55.35545], [70.19179, 55.1476], [70.76493, 55.3027], [70.96009, 55.10558], [71.08288, 54.71253], [71.24185, 54.64965], [71.08706, 54.33376], [71.10379, 54.13326], [71.96141, 54.17736], [72.17477, 54.36303], [72.43415, 53.92685], [72.71026, 54.1161], [73.37963, 53.96132], [73.74778, 54.07194], [73.68921, 53.86522], [73.25412, 53.61532], [73.39218, 53.44623], [75.07405, 53.80831], [75.43398, 53.98652], [75.3668, 54.07439], [76.91052, 54.4677], [76.82266, 54.1798], [76.44076, 54.16017], [76.54243, 53.99329], [77.90383, 53.29807], [79.11255, 52.01171], [80.08138, 50.77658], [80.4127, 50.95581], [80.44819, 51.20855], [80.80318, 51.28262], [81.16999, 51.15662], [81.06091, 50.94833], [81.41248, 50.97524], [81.46581, 50.77658], [81.94999, 50.79307], [82.55443, 50.75412], [83.14607, 51.00796], [83.8442, 50.87375], [84.29385, 50.27257], [84.99198, 50.06793], [85.24047, 49.60239], [86.18709, 49.50259], [86.63674, 49.80136], [86.79056, 49.74787], [86.61307, 49.60239], [86.82606, 49.51796], [87.03071, 49.25142], [87.31465, 49.23603], [87.28386, 49.11626], [87.478, 49.07403], [87.48983, 49.13794], [87.81333, 49.17354], [87.98977, 49.18147], [88.15543, 49.30314], [88.17223, 49.46934], [88.42449, 49.48821], [88.82499, 49.44808], [89.70687, 49.72535], [89.59711, 49.90851], [91.86048, 50.73734], [92.07173, 50.69585], [92.44714, 50.78762], [93.01109, 50.79001], [92.99595, 50.63183], [94.30823, 50.57498], [94.39258, 50.22193], [94.49477, 50.17832], [94.6121, 50.04239], [94.97166, 50.04725], [95.02465, 49.96941], [95.74757, 49.97915], [95.80056, 50.04239], [96.97388, 49.88413], [97.24639, 49.74737], [97.56811, 49.84265], [97.56432, 49.92801], [97.76871, 49.99861], [97.85197, 49.91339], [98.29481, 50.33561], [98.31373, 50.4996], [98.06393, 50.61262], [97.9693, 50.78044], [98.01472, 50.86652], [97.83305, 51.00248], [98.05257, 51.46696], [98.22053, 51.46579], [98.33222, 51.71832], [98.74142, 51.8637], [98.87768, 52.14563], [99.27888, 51.96876], [99.75578, 51.90108], [99.89203, 51.74903], [100.61116, 51.73028], [101.39085, 51.45753], [101.5044, 51.50467], [102.14032, 51.35566], [102.32194, 50.67982], [102.71178, 50.38873], [103.70343, 50.13952], [105.32528, 50.4648], [106.05562, 50.40582], [106.07865, 50.33474], [106.47156, 50.31909], [106.49628, 50.32436], [106.51122, 50.34408], [106.58373, 50.34044], [106.80326, 50.30177], [107.00007, 50.1977], [107.1174, 50.04239], [107.36407, 49.97612], [107.96116, 49.93191], [107.95387, 49.66659], [108.27937, 49.53167], [108.53969, 49.32325], [109.18017, 49.34709], [109.51325, 49.22859], [110.24373, 49.16676], [110.39891, 49.25083], [110.64493, 49.1816], [113.02647, 49.60772], [113.20216, 49.83356], [114.325, 50.28098], [114.9703, 50.19254], [115.26068, 49.97367], [115.73602, 49.87688], [116.22402, 50.04477], [116.62502, 49.92919], [116.71193, 49.83813], [117.27597, 49.62544], [117.48208, 49.62324], [117.82343, 49.52696], [118.61623, 49.93809], [119.11003, 50.00276], [119.27996, 50.13348], [119.38598, 50.35162], [119.13553, 50.37412], [120.10963, 51.671], [120.65907, 51.93544], [120.77337, 52.20805], [120.61346, 52.32447], [120.71673, 52.54099], [120.46454, 52.63811], [120.04049, 52.58773], [120.0451, 52.7359], [120.85633, 53.28499], [121.39213, 53.31888], [122.35063, 53.49565], [122.85966, 53.47395], [123.26989, 53.54843], [123.86158, 53.49391], [124.46078, 53.21881], [125.17522, 53.20225], [125.6131, 53.07229], [126.558, 52.13738], [126.44606, 51.98254], [126.68349, 51.70607], [126.90369, 51.3238], [126.93135, 51.0841], [127.14586, 50.91152], [127.28165, 50.72075], [127.36335, 50.58306], [127.28765, 50.46585], [127.36009, 50.43787], [127.37384, 50.28393], [127.60515, 50.23503], [127.49299, 50.01251], [127.53516, 49.84306], [127.83476, 49.5748], [128.72896, 49.58676], [129.11153, 49.36813], [129.23232, 49.40353], [129.35317, 49.3481], [129.40398, 49.44194], [129.50685, 49.42398], [129.67598, 49.29596], [129.85416, 49.11067], [130.2355, 48.86741], [130.43232, 48.90844], [130.66946, 48.88251], [130.52147, 48.61745], [130.84462, 48.30942], [130.65103, 48.10052], [130.90915, 47.90623], [130.95985, 47.6957], [131.09871, 47.6852], [131.2635, 47.73325], [131.90448, 47.68011], [132.57309, 47.71741], [132.66989, 47.96491], [134.49516, 48.42884], [134.75328, 48.36763], [134.67098, 48.1564], [134.55508, 47.98651], [134.7671, 47.72051], [134.50898, 47.4812], [134.20016, 47.33458], [134.03538, 46.75668], [133.84104, 46.46681], [133.91496, 46.4274], [133.88097, 46.25066], [133.68047, 46.14697], [133.72695, 46.05576], [133.67569, 45.9759], [133.60442, 45.90053], [133.48457, 45.86203], [133.41083, 45.57723], [133.19419, 45.51913], [133.09279, 45.25693], [133.12293, 45.1332], [132.96373, 45.0212], [132.83978, 45.05916], [131.99417, 45.2567], [131.86903, 45.33636], [131.76532, 45.22609], [131.66852, 45.2196], [131.68466, 45.12374], [131.48415, 44.99513], [130.95639, 44.85154], [131.1108, 44.70266], [131.30365, 44.04262], [131.25484, 44.03131], [131.23583, 43.96085], [131.26176, 43.94011], [131.21105, 43.82383], [131.19492, 43.53047], [131.29402, 43.46695], [131.30324, 43.39498], [131.19031, 43.21385], [131.20414, 43.13654], [131.10274, 43.04734], [131.135, 42.94114], [131.02668, 42.91246], [131.02438, 42.86518], [130.66524, 42.84753], [130.44361, 42.76205], [130.40213, 42.70788], [130.56576, 42.68925], [130.62107, 42.58413], [130.55143, 42.52158], [130.56835, 42.43281], [130.60805, 42.4317], [130.64181, 42.41422], [130.66367, 42.38024], [130.65022, 42.32281], [131.95041, 41.5445], [140.9182, 45.92937], [145.82343, 44.571], [145.23667, 43.76813], [153.94307, 38.42848], [180, 62.52334], [180, 71.53642], [155.31937, 81.93282], [76.13964, 83.37843], [64.18965, 69.94255], [66.1708, 67.61252], [61.98014, 65.72191], [60.74386, 64.95767], [59.63945, 64.78384], [59.80579, 64.13948], [59.24834, 63.01859], [59.61398, 62.44915], [59.36223, 61.3882], [59.50685, 60.91162], [58.3853, 59.487], [59.15636, 59.14682], [59.40376, 58.45822], [58.71104, 58.07475], [58.81412, 57.71602], [58.13789, 57.68097], [58.07604, 57.08308], [57.28024, 56.87898], [57.51527, 56.08729], [59.28419, 56.15739], [59.49035, 55.60486], [58.81825, 55.03378], [57.25137, 55.26262], [57.14829, 54.84204], [57.95234, 54.39672], [59.95217, 54.85853], [59.70487, 54.14846], [58.94336, 53.953], [58.79644, 52.43392], [59.22409, 52.28437], [59.25033, 52.46803], [60.17516, 52.39457], [60.17253, 52.25814], [59.91279, 52.06924], [59.99809, 51.98263]]]] } },
      { type: "Feature", properties: { wikidata: "Q34366", nameEn: "Tasmania", aliases: ["AU-TAS"], country: "AU", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["61"] }, geometry: { type: "MultiPolygon", coordinates: [[[[123.64533, -39.13605], [159.69067, -56.28945], [159.74028, -39.1978], [123.64533, -39.13605]]]] } },
      { type: "Feature", properties: { wikidata: "Q34497", nameEn: "Saint Helena", aliases: ["SH-HL"], country: "GB", groups: ["SH", "BOTS", "011", "202", "002", "UN"], level: "subterritory", driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["290"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-8.3824, -13.9131], [-6.17428, -19.07236], [-3.29308, -15.22647], [-8.3824, -13.9131]]]] } },
      { type: "Feature", properties: { wikidata: "Q35657", nameEn: "US States", country: "US", level: "subcountryGroup" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q36117", nameEn: "Borneo", level: "sharedLandform" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q36678", nameEn: "West Bank", country: "PS", groups: ["145", "142"], callingCodes: ["970"] }, geometry: { type: "MultiPolygon", coordinates: [[[[35.47672, 31.49578], [35.55941, 31.76535], [35.52758, 31.9131], [35.54375, 31.96587], [35.52012, 32.04076], [35.57111, 32.21877], [35.55807, 32.38674], [35.42078, 32.41562], [35.41048, 32.43706], [35.41598, 32.45593], [35.42034, 32.46009], [35.40224, 32.50136], [35.35212, 32.52047], [35.30685, 32.51024], [35.29306, 32.50947], [35.25049, 32.52453], [35.2244, 32.55289], [35.15937, 32.50466], [35.10882, 32.4757], [35.10024, 32.47856], [35.09236, 32.47614], [35.08564, 32.46948], [35.07059, 32.4585], [35.05423, 32.41754], [35.05311, 32.4024], [35.0421, 32.38242], [35.05142, 32.3667], [35.04243, 32.35008], [35.01772, 32.33863], [35.01119, 32.28684], [35.02939, 32.2671], [35.01841, 32.23981], [34.98885, 32.20758], [34.95703, 32.19522], [34.96009, 32.17503], [34.99039, 32.14626], [34.98507, 32.12606], [34.99437, 32.10962], [34.9863, 32.09551], [35.00261, 32.027], [34.98682, 31.96935], [35.00124, 31.93264], [35.03489, 31.92448], [35.03978, 31.89276], [35.03489, 31.85919], [34.99712, 31.85569], [34.9724, 31.83352], [35.01978, 31.82944], [35.05617, 31.85685], [35.07677, 31.85627], [35.14174, 31.81325], [35.18603, 31.80901], [35.18169, 31.82542], [35.19461, 31.82687], [35.21469, 31.81835], [35.216, 31.83894], [35.21128, 31.863], [35.20381, 31.86716], [35.20673, 31.88151], [35.20791, 31.8821], [35.20945, 31.8815], [35.21016, 31.88237], [35.21276, 31.88153], [35.2136, 31.88241], [35.22014, 31.88264], [35.22294, 31.87889], [35.22567, 31.86745], [35.22817, 31.8638], [35.2249, 31.85433], [35.2304, 31.84222], [35.24816, 31.8458], [35.25753, 31.8387], [35.251, 31.83085], [35.26404, 31.82567], [35.25573, 31.81362], [35.26058, 31.79064], [35.25225, 31.7678], [35.26319, 31.74846], [35.25182, 31.73945], [35.24981, 31.72543], [35.2438, 31.7201], [35.24315, 31.71244], [35.23972, 31.70896], [35.22392, 31.71899], [35.21937, 31.71578], [35.20538, 31.72388], [35.18023, 31.72067], [35.16478, 31.73242], [35.15474, 31.73352], [35.15119, 31.73634], [35.13931, 31.73012], [35.12933, 31.7325], [35.11895, 31.71454], [35.10782, 31.71594], [35.08226, 31.69107], [35.00879, 31.65426], [34.95249, 31.59813], [34.9415, 31.55601], [34.94356, 31.50743], [34.93258, 31.47816], [34.89756, 31.43891], [34.87833, 31.39321], [34.88932, 31.37093], [34.92571, 31.34337], [35.02459, 31.35979], [35.13033, 31.3551], [35.22921, 31.37445], [35.39675, 31.49572], [35.47672, 31.49578]]]] } },
      { type: "Feature", properties: { wikidata: "Q37362", nameEn: "Akrotiri and Dhekelia", aliases: ["SBA"], country: "GB" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q38095", nameEn: "Gal\xE1pagos Islands", aliases: ["EC-W"], country: "EC", groups: ["005", "419", "019", "UN"], callingCodes: ["593"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-93.12365, 2.64343], [-92.46744, -2.52874], [-87.07749, -0.8849], [-93.12365, 2.64343]]]] } },
      { type: "Feature", properties: { wikidata: "Q39760", nameEn: "Gaza Strip", country: "PS", groups: ["145", "142"], callingCodes: ["970"] }, geometry: { type: "MultiPolygon", coordinates: [[[[34.052, 31.46619], [34.21853, 31.32363], [34.23572, 31.2966], [34.24012, 31.29591], [34.26742, 31.21998], [34.29417, 31.24194], [34.36523, 31.28963], [34.37381, 31.30598], [34.36505, 31.36404], [34.40077, 31.40926], [34.48892, 31.48365], [34.56797, 31.54197], [34.48681, 31.59711], [34.29262, 31.70393], [34.052, 31.46619]]]] } },
      { type: "Feature", properties: { wikidata: "Q40888", nameEn: "Andaman and Nicobar Islands", aliases: ["IN-AN"], country: "IN", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["91"] }, geometry: { type: "MultiPolygon", coordinates: [[[[94.42132, 5.96581], [94.6371, 13.81803], [86.7822, 13.41052], [94.42132, 5.96581]]]] } },
      { type: "Feature", properties: { wikidata: "Q41684", nameEn: "Stewart Island", country: "NZ", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["64"] }, geometry: { type: "MultiPolygon", coordinates: [[[[166.59185, -47.61313], [169.70504, -47.56021], [167.52103, -46.41337], [166.59185, -47.61313]]]] } },
      { type: "Feature", properties: { wikidata: "Q43296", nameEn: "Wake Island", aliases: ["WK", "WAK", "WKUM", "872", "UM-79"], country: "US", groups: ["UM", "Q1352230", "057", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[167.34779, 18.97692], [166.67967, 20.14834], [165.82549, 18.97692], [167.34779, 18.97692]]]] } },
      { type: "Feature", properties: { wikidata: "Q46275", nameEn: "New Zealand Subantarctic Islands", country: "NZ", groups: ["Q851132", "053", "009", "UN"], driveSide: "left" }, geometry: { type: "MultiPolygon", coordinates: [[[[164.30551, -47.88072], [161.96603, -56.07661], [179.49541, -50.04657], [179.49541, -47.2902], [169.91032, -47.66283], [164.30551, -47.88072]]]] } },
      { type: "Feature", properties: { wikidata: "Q46395", nameEn: "British Overseas Territories", aliases: ["BOTS", "UKOTS"], country: "GB", level: "subcountryGroup" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q46772", nameEn: "Kerguelen Islands", country: "FR", groups: ["TF", "Q1451600", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[61.9216, -49.39746], [70.67507, -51.14192], [74.25129, -45.45074], [61.9216, -49.39746]]]] } },
      { type: "Feature", properties: { wikidata: "Q46879", nameEn: "Baker Island", aliases: ["UM-81"], country: "US", groups: ["UM", "Q1352230", "061", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft" }, geometry: { type: "MultiPolygon", coordinates: [[[[-175.33482, -1.40631], [-175.31323, 0.5442], [-177.91421, 0.39582], [-175.33482, -1.40631]]]] } },
      { type: "Feature", properties: { wikidata: "Q47863", nameEn: "Midway Atoll", aliases: ["MI", "MID", "MIUM", "488", "UM-71"], country: "US", groups: ["UM", "Q1352230", "061", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-176.29741, 29.09786], [-177.77531, 29.29793], [-177.5224, 27.7635], [-176.29741, 29.09786]]]] } },
      { type: "Feature", properties: { wikidata: "Q62218", nameEn: "Jarvis Island", aliases: ["UM-86"], country: "US", groups: ["UM", "Q1352230", "061", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft" }, geometry: { type: "MultiPolygon", coordinates: [[[[-160.42921, -1.4364], [-159.12443, 0.19975], [-160.38779, 0.30331], [-160.42921, -1.4364]]]] } },
      { type: "Feature", properties: { wikidata: "Q105472", nameEn: "Macaronesia", level: "sharedLandform" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q114935", nameEn: "Kermadec Islands", country: "NZ", groups: ["Q851132", "053", "009", "UN"], driveSide: "left", callingCodes: ["64"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-174.40891, -29.09438], [-180, -24.21376], [-179.96512, -35.00791], [-174.40891, -29.09438]]]] } },
      { type: "Feature", properties: { wikidata: "Q115459", nameEn: "Chatham Islands", aliases: ["NZ-CIT"], country: "NZ", groups: ["Q851132", "053", "009", "UN"], driveSide: "left", callingCodes: ["64"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-179.93224, -45.18423], [-172.47015, -45.17912], [-176.30998, -41.38382], [-179.93224, -45.18423]]]] } },
      { type: "Feature", properties: { wikidata: "Q118863", nameEn: "North Island", country: "NZ", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["64"] }, geometry: { type: "MultiPolygon", coordinates: [[[[179.49541, -47.2902], [179.49541, -36.79303], [174.17679, -32.62487], [170.27492, -36.38133], [174.58663, -40.80446], [174.46634, -41.55028], [179.49541, -47.2902]]]] } },
      { type: "Feature", properties: { wikidata: "Q120755", nameEn: "South Island", country: "NZ", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["64"] }, geometry: { type: "MultiPolygon", coordinates: [[[[169.70504, -47.56021], [179.49541, -47.2902], [174.46634, -41.55028], [174.58663, -40.80446], [170.27492, -36.38133], [166.56976, -39.94841], [164.8365, -46.0205], [167.52103, -46.41337], [169.70504, -47.56021]]]] } },
      { type: "Feature", properties: { wikidata: "Q123076", nameEn: "Palmyra Atoll", aliases: ["UM-95"], country: "US", groups: ["UM", "Q1352230", "061", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-161.06795, 5.2462], [-161.0731, 7.1291], [-163.24478, 5.24198], [-161.06795, 5.2462]]]] } },
      { type: "Feature", properties: { wikidata: "Q130574", nameEn: "Chafarinas Islands", country: "ES", groups: ["EU", "Q191011", "015", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.40316, 35.16893], [-2.43262, 35.20652], [-2.45965, 35.16527], [-2.40316, 35.16893]]]] } },
      { type: "Feature", properties: { wikidata: "Q130895", nameEn: "Kingman Reef", aliases: ["UM-89"], country: "US", groups: ["UM", "Q1352230", "061", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft" }, geometry: { type: "MultiPolygon", coordinates: [[[[-161.0731, 7.1291], [-163.16627, 7.15036], [-163.24478, 5.24198], [-161.0731, 7.1291]]]] } },
      { type: "Feature", properties: { wikidata: "Q131008", nameEn: "Johnston Atoll", aliases: ["JT", "JTN", "JTUM", "396", "UM-67"], country: "US", groups: ["UM", "Q1352230", "061", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-170.65691, 16.57199], [-168.87689, 16.01159], [-169.2329, 17.4933], [-170.65691, 16.57199]]]] } },
      { type: "Feature", properties: { wikidata: "Q131305", nameEn: "Howland Island", aliases: ["UM-84"], country: "US", groups: ["UM", "Q1352230", "061", "009", "UN"], level: "subterritory", roadSpeedUnit: "mph", roadHeightUnit: "ft" }, geometry: { type: "MultiPolygon", coordinates: [[[[-177.91421, 0.39582], [-175.31323, 0.5442], [-176.74464, 2.28109], [-177.91421, 0.39582]]]] } },
      { type: "Feature", properties: { wikidata: "Q133888", nameEn: "Ashmore and Cartier Islands", country: "AU", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["61"] }, geometry: { type: "MultiPolygon", coordinates: [[[[123.7463, -11.1783], [120.6877, -13.59408], [125.29076, -12.33139], [123.7463, -11.1783]]]] } },
      { type: "Feature", properties: { wikidata: "Q153732", nameEn: "Mariana Islands", level: "sharedLandform" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q172216", nameEn: "Coral Sea Islands", country: "AU", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["61"] }, geometry: { type: "MultiPolygon", coordinates: [[[[159.77159, -28.41151], [156.73836, -14.50464], [145.2855, -9.62524], [147.69992, -17.5933], [152.93188, -20.92631], [154.02855, -24.43238], [159.77159, -28.41151]]]] } },
      { type: "Feature", properties: { wikidata: "Q179313", nameEn: "Alderney", country: "GB", groups: ["GG", "830", "Q185086", "154", "150", "UN"], level: "subterritory", driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44 01481"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.36485, 49.48223], [-2.09454, 49.46288], [-2.02963, 49.91866], [-2.49556, 49.79012], [-2.36485, 49.48223]]]] } },
      { type: "Feature", properties: { wikidata: "Q185086", nameEn: "Crown Dependencies", country: "GB", level: "subcountryGroup" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q190571", nameEn: "Scattered Islands", country: "FR", groups: ["TF", "Q1451600", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[53.53458, -16.36909], [54.96649, -16.28353], [54.61476, -15.02273], [53.53458, -16.36909]]], [[[38.55969, -20.75596], [40.68027, -23.38889], [43.52893, -15.62903], [38.55969, -20.75596]]], [[[47.03092, -11.05648], [47.11593, -12.08552], [47.96702, -11.46447], [47.03092, -11.05648]]]] } },
      { type: "Feature", properties: { wikidata: "Q191011", nameEn: "Plazas de soberan\xEDa", country: "ES" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q191146", nameEn: "Pe\xF1\xF3n de V\xE9lez de la Gomera", country: "ES", groups: ["EU", "Q191011", "015", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[-4.30191, 35.17419], [-4.30112, 35.17058], [-4.29436, 35.17149], [-4.30191, 35.17419]]]] } },
      { type: "Feature", properties: { wikidata: "Q201698", nameEn: "Crozet Islands", country: "FR", groups: ["TF", "Q1451600", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[55.03425, -43.65017], [46.31615, -46.28749], [54.5587, -47.93013], [55.03425, -43.65017]]]] } },
      { type: "Feature", properties: { wikidata: "Q578170", nameEn: "Contiguous United States", aliases: ["CONUS"], country: "US", groups: ["Q35657", "021", "003", "019", "UN"], roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-97.13927, 25.96583], [-96.92418, 25.97377], [-80.57035, 24.0565], [-78.91214, 27.76553], [-61.98255, 37.34815], [-67.16117, 44.20069], [-66.93432, 44.82597], [-66.96824, 44.83078], [-66.98249, 44.87071], [-66.96824, 44.90965], [-67.0216, 44.95333], [-67.11316, 45.11176], [-67.15965, 45.16179], [-67.19603, 45.16771], [-67.20349, 45.1722], [-67.22751, 45.16344], [-67.27039, 45.1934], [-67.29748, 45.18173], [-67.29754, 45.14865], [-67.34927, 45.122], [-67.48201, 45.27351], [-67.42394, 45.37969], [-67.50578, 45.48971], [-67.42144, 45.50584], [-67.43815, 45.59162], [-67.6049, 45.60725], [-67.80705, 45.69528], [-67.80653, 45.80022], [-67.75654, 45.82324], [-67.80961, 45.87531], [-67.75196, 45.91814], [-67.78111, 45.9392], [-67.78578, 47.06473], [-67.87993, 47.10377], [-67.94843, 47.1925], [-68.23244, 47.35712], [-68.37458, 47.35851], [-68.38332, 47.28723], [-68.57914, 47.28431], [-68.60575, 47.24659], [-68.70125, 47.24399], [-68.89222, 47.1807], [-69.05039, 47.2456], [-69.05073, 47.30076], [-69.05148, 47.42012], [-69.22119, 47.46461], [-69.99966, 46.69543], [-70.05812, 46.41768], [-70.18547, 46.35357], [-70.29078, 46.18832], [-70.23855, 46.1453], [-70.31025, 45.96424], [-70.24694, 45.95138], [-70.25976, 45.89675], [-70.41523, 45.79497], [-70.38934, 45.73215], [-70.54019, 45.67291], [-70.68516, 45.56964], [-70.72651, 45.49771], [-70.62518, 45.42286], [-70.65383, 45.37592], [-70.78372, 45.43269], [-70.82638, 45.39828], [-70.80236, 45.37444], [-70.84816, 45.22698], [-70.89864, 45.2398], [-70.91169, 45.29849], [-70.95193, 45.33895], [-71.0107, 45.34819], [-71.01866, 45.31573], [-71.08364, 45.30623], [-71.14568, 45.24128], [-71.19723, 45.25438], [-71.22338, 45.25184], [-71.29371, 45.29996], [-71.37133, 45.24624], [-71.44252, 45.2361], [-71.40364, 45.21382], [-71.42778, 45.12624], [-71.48735, 45.07784], [-71.50067, 45.01357], [-73.35025, 45.00942], [-74.32699, 44.99029], [-74.66689, 45.00646], [-74.8447, 45.00606], [-74.99101, 44.98051], [-75.01363, 44.95608], [-75.2193, 44.87821], [-75.41441, 44.76614], [-75.76813, 44.51537], [-75.8217, 44.43176], [-75.95947, 44.34463], [-76.00018, 44.34896], [-76.16285, 44.28262], [-76.1664, 44.23051], [-76.244, 44.19643], [-76.31222, 44.19894], [-76.35324, 44.13493], [-76.43859, 44.09393], [-76.79706, 43.63099], [-79.25796, 43.54052], [-79.06921, 43.26183], [-79.05512, 43.25375], [-79.05544, 43.21224], [-79.05002, 43.20133], [-79.05384, 43.17418], [-79.04652, 43.16396], [-79.0427, 43.13934], [-79.06881, 43.12029], [-79.05671, 43.10937], [-79.07486, 43.07845], [-79.01055, 43.06659], [-78.99941, 43.05612], [-79.02424, 43.01983], [-79.02074, 42.98444], [-78.98126, 42.97], [-78.96312, 42.95509], [-78.93224, 42.95229], [-78.90905, 42.93022], [-78.90712, 42.89733], [-78.93684, 42.82887], [-82.67862, 41.67615], [-83.11184, 41.95671], [-83.14962, 42.04089], [-83.12724, 42.2376], [-83.09837, 42.28877], [-83.07837, 42.30978], [-83.02253, 42.33045], [-82.82964, 42.37355], [-82.64242, 42.55594], [-82.58873, 42.54984], [-82.57583, 42.5718], [-82.51858, 42.611], [-82.51063, 42.66025], [-82.46613, 42.76615], [-82.4826, 42.8068], [-82.45331, 42.93139], [-82.4253, 42.95423], [-82.4146, 42.97626], [-82.42469, 42.992], [-82.48419, 45.30225], [-83.59589, 45.82131], [-83.43746, 45.99749], [-83.57017, 46.105], [-83.83329, 46.12169], [-83.90453, 46.05922], [-83.95399, 46.05634], [-84.1096, 46.23987], [-84.09756, 46.25512], [-84.11615, 46.2681], [-84.11254, 46.32329], [-84.13451, 46.39218], [-84.11196, 46.50248], [-84.12885, 46.53068], [-84.17723, 46.52753], [-84.1945, 46.54061], [-84.2264, 46.53337], [-84.26351, 46.49508], [-84.29893, 46.49127], [-84.34174, 46.50683], [-84.42101, 46.49853], [-84.4481, 46.48972], [-84.47607, 46.45225], [-84.55635, 46.45974], [-84.85871, 46.88881], [-88.37033, 48.30586], [-89.48837, 48.01412], [-89.57972, 48.00023], [-89.77248, 48.02607], [-89.89974, 47.98109], [-90.07418, 48.11043], [-90.56312, 48.09488], [-90.56444, 48.12184], [-90.75045, 48.09143], [-90.87588, 48.2484], [-91.08016, 48.18096], [-91.25025, 48.08522], [-91.43248, 48.04912], [-91.45829, 48.07454], [-91.58025, 48.04339], [-91.55649, 48.10611], [-91.70451, 48.11805], [-91.71231, 48.19875], [-91.86125, 48.21278], [-91.98929, 48.25409], [-92.05339, 48.35958], [-92.14732, 48.36578], [-92.202, 48.35252], [-92.26662, 48.35651], [-92.30939, 48.31251], [-92.27167, 48.25046], [-92.37185, 48.22259], [-92.48147, 48.36609], [-92.45588, 48.40624], [-92.50712, 48.44921], [-92.65606, 48.43471], [-92.71323, 48.46081], [-92.69927, 48.49573], [-92.62747, 48.50278], [-92.6342, 48.54133], [-92.7287, 48.54005], [-92.94973, 48.60866], [-93.25391, 48.64266], [-93.33946, 48.62787], [-93.3712, 48.60599], [-93.39758, 48.60364], [-93.40693, 48.60948], [-93.44472, 48.59147], [-93.47022, 48.54357], [-93.66382, 48.51845], [-93.79267, 48.51631], [-93.80939, 48.52439], [-93.80676, 48.58232], [-93.83288, 48.62745], [-93.85769, 48.63284], [-94.23215, 48.65202], [-94.25104, 48.65729], [-94.25172, 48.68404], [-94.27153, 48.70232], [-94.4174, 48.71049], [-94.44258, 48.69223], [-94.53826, 48.70216], [-94.54885, 48.71543], [-94.58903, 48.71803], [-94.69335, 48.77883], [-94.69669, 48.80918], [-94.70486, 48.82365], [-94.70087, 48.8339], [-94.687, 48.84077], [-94.75017, 49.09931], [-94.77355, 49.11998], [-94.82487, 49.29483], [-94.8159, 49.32299], [-94.85381, 49.32492], [-94.95681, 49.37035], [-94.99532, 49.36579], [-95.01419, 49.35647], [-95.05825, 49.35311], [-95.12903, 49.37056], [-95.15357, 49.384], [-95.15355, 48.9996], [-123.32163, 49.00419], [-123.0093, 48.83186], [-123.0093, 48.76586], [-123.26565, 48.6959], [-123.15614, 48.35395], [-123.50039, 48.21223], [-125.03842, 48.53282], [-133.98258, 38.06389], [-118.48109, 32.5991], [-117.1243, 32.53427], [-115.88053, 32.63624], [-114.71871, 32.71894], [-114.76736, 32.64094], [-114.80584, 32.62028], [-114.81141, 32.55543], [-114.79524, 32.55731], [-114.82011, 32.49609], [-111.07523, 31.33232], [-108.20979, 31.33316], [-108.20899, 31.78534], [-106.529, 31.784], [-106.52266, 31.77509], [-106.51251, 31.76922], [-106.50962, 31.76155], [-106.50111, 31.75714], [-106.48815, 31.74769], [-106.47298, 31.75054], [-106.46726, 31.75998], [-106.45244, 31.76523], [-106.43419, 31.75478], [-106.41773, 31.75196], [-106.38003, 31.73151], [-106.3718, 31.71165], [-106.34864, 31.69663], [-106.33419, 31.66303], [-106.30305, 31.62154], [-106.28084, 31.56173], [-106.24612, 31.54193], [-106.23711, 31.51262], [-106.20346, 31.46305], [-106.09025, 31.40569], [-106.00363, 31.39181], [-104.77674, 30.4236], [-104.5171, 29.64671], [-104.3969, 29.57105], [-104.39363, 29.55396], [-104.37752, 29.54255], [-103.15787, 28.93865], [-102.60596, 29.8192], [-101.47277, 29.7744], [-101.05686, 29.44738], [-101.01128, 29.36947], [-100.96725, 29.3477], [-100.94579, 29.34523], [-100.94056, 29.33371], [-100.87982, 29.296], [-100.79696, 29.24688], [-100.67294, 29.09744], [-100.63689, 28.90812], [-100.59809, 28.88197], [-100.52313, 28.75598], [-100.5075, 28.74066], [-100.51222, 28.70679], [-100.50029, 28.66117], [-99.55409, 27.61314], [-99.51478, 27.55836], [-99.52955, 27.49747], [-99.50208, 27.50021], [-99.48045, 27.49016], [-99.482, 27.47128], [-99.49744, 27.43746], [-99.53573, 27.30926], [-99.08477, 26.39849], [-99.03053, 26.41249], [-99.00546, 26.3925], [-98.35126, 26.15129], [-98.30491, 26.10475], [-98.27075, 26.09457], [-98.24603, 26.07191], [-97.97017, 26.05232], [-97.95155, 26.0625], [-97.66511, 26.01708], [-97.52025, 25.88518], [-97.49828, 25.89877], [-97.45669, 25.86874], [-97.42511, 25.83969], [-97.37332, 25.83854], [-97.35946, 25.92189], [-97.13927, 25.96583]]]] } },
      { type: "Feature", properties: { wikidata: "Q620634", nameEn: "Bir Tawil", groups: ["015", "002"], level: "territory" }, geometry: { type: "MultiPolygon", coordinates: [[[[33.17563, 22.00405], [33.57251, 21.72406], [33.99686, 21.76784], [34.0765, 22.00501], [33.17563, 22.00405]]]] } },
      { type: "Feature", properties: { wikidata: "Q639185", nameEn: "Peros Banhos", country: "GB", groups: ["IO", "BOTS", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[72.12587, -4.02588], [70.1848, -6.37445], [72.09518, -5.61768], [72.12587, -4.02588]]]] } },
      { type: "Feature", properties: { wikidata: "Q644636", nameEn: "Cyprus", level: "sharedLandform" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q851132", nameEn: "New Zealand Outlying Islands", country: "NZ", level: "subcountryGroup" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q875134", nameEn: "European Russia", country: "RU", groups: ["151", "150", "UN"], callingCodes: ["7"] }, geometry: { type: "MultiPolygon", coordinates: [[[[18.57853, 55.25302], [19.64312, 54.45423], [19.8038, 54.44203], [20.63871, 54.3706], [21.41123, 54.32395], [22.79705, 54.36264], [22.7253, 54.41732], [22.70208, 54.45312], [22.67788, 54.532], [22.71293, 54.56454], [22.68021, 54.58486], [22.7522, 54.63525], [22.74225, 54.64339], [22.75467, 54.6483], [22.73397, 54.66604], [22.73631, 54.72952], [22.87317, 54.79492], [22.85083, 54.88711], [22.76422, 54.92521], [22.68723, 54.9811], [22.65451, 54.97037], [22.60075, 55.01863], [22.58907, 55.07085], [22.47688, 55.04408], [22.31562, 55.0655], [22.14267, 55.05345], [22.11697, 55.02131], [22.06087, 55.02935], [22.02582, 55.05078], [22.03984, 55.07888], [21.99543, 55.08691], [21.96505, 55.07353], [21.85521, 55.09493], [21.64954, 55.1791], [21.55605, 55.20311], [21.51095, 55.18507], [21.46766, 55.21115], [21.38446, 55.29348], [21.35465, 55.28427], [21.26425, 55.24456], [20.95181, 55.27994], [20.60454, 55.40986], [18.57853, 55.25302]]], [[[26.32936, 60.00121], [26.90044, 59.63819], [27.85643, 59.58538], [28.04187, 59.47017], [28.19061, 59.39962], [28.21137, 59.38058], [28.20537, 59.36491], [28.19284, 59.35791], [28.14215, 59.28934], [28.00689, 59.28351], [27.90911, 59.24353], [27.87978, 59.18097], [27.80482, 59.1116], [27.74429, 58.98351], [27.36366, 58.78381], [27.55489, 58.39525], [27.48541, 58.22615], [27.62393, 58.09462], [27.67282, 57.92627], [27.81841, 57.89244], [27.78526, 57.83963], [27.56689, 57.83356], [27.50171, 57.78842], [27.52615, 57.72843], [27.3746, 57.66834], [27.40393, 57.62125], [27.31919, 57.57672], [27.34698, 57.52242], [27.56832, 57.53728], [27.52453, 57.42826], [27.86101, 57.29402], [27.66511, 56.83921], [27.86101, 56.88204], [28.04768, 56.59004], [28.13526, 56.57989], [28.10069, 56.524], [28.19057, 56.44637], [28.16599, 56.37806], [28.23716, 56.27588], [28.15217, 56.16964], [28.30571, 56.06035], [28.36888, 56.05805], [28.37987, 56.11399], [28.43068, 56.09407], [28.5529, 56.11705], [28.68337, 56.10173], [28.63668, 56.07262], [28.73418, 55.97131], [29.08299, 56.03427], [29.21717, 55.98971], [29.44692, 55.95978], [29.3604, 55.75862], [29.51283, 55.70294], [29.61446, 55.77716], [29.80672, 55.79569], [29.97975, 55.87281], [30.12136, 55.8358], [30.27776, 55.86819], [30.30987, 55.83592], [30.48257, 55.81066], [30.51346, 55.78982], [30.51037, 55.76568], [30.63344, 55.73079], [30.67464, 55.64176], [30.72957, 55.66268], [30.7845, 55.58514], [30.86003, 55.63169], [30.93419, 55.6185], [30.95204, 55.50667], [30.90123, 55.46621], [30.93144, 55.3914], [30.8257, 55.3313], [30.81946, 55.27931], [30.87944, 55.28223], [30.97369, 55.17134], [31.02071, 55.06167], [31.00972, 55.02783], [30.94243, 55.03964], [30.9081, 55.02232], [30.95754, 54.98609], [30.93144, 54.9585], [30.81759, 54.94064], [30.8264, 54.90062], [30.75165, 54.80699], [30.95479, 54.74346], [30.97127, 54.71967], [31.0262, 54.70698], [30.98226, 54.68872], [30.99187, 54.67046], [31.19339, 54.66947], [31.21399, 54.63113], [31.08543, 54.50361], [31.22945, 54.46585], [31.3177, 54.34067], [31.30791, 54.25315], [31.57002, 54.14535], [31.89599, 54.0837], [31.88744, 54.03653], [31.85019, 53.91801], [31.77028, 53.80015], [31.89137, 53.78099], [32.12621, 53.81586], [32.36663, 53.7166], [32.45717, 53.74039], [32.50112, 53.68594], [32.40499, 53.6656], [32.47777, 53.5548], [32.74968, 53.45597], [32.73257, 53.33494], [32.51725, 53.28431], [32.40773, 53.18856], [32.15368, 53.07594], [31.82373, 53.10042], [31.787, 53.18033], [31.62496, 53.22886], [31.56316, 53.19432], [31.40523, 53.21406], [31.36403, 53.13504], [31.3915, 53.09712], [31.33519, 53.08805], [31.32283, 53.04101], [31.24147, 53.031], [31.35667, 52.97854], [31.592, 52.79011], [31.57277, 52.71613], [31.50406, 52.69707], [31.63869, 52.55361], [31.56316, 52.51518], [31.61397, 52.48843], [31.62084, 52.33849], [31.57971, 52.32146], [31.70735, 52.26711], [31.6895, 52.1973], [31.77877, 52.18636], [31.7822, 52.11406], [31.81722, 52.09955], [31.85018, 52.11305], [31.96141, 52.08015], [31.92159, 52.05144], [32.08813, 52.03319], [32.23331, 52.08085], [32.2777, 52.10266], [32.34044, 52.1434], [32.33083, 52.23685], [32.38988, 52.24946], [32.3528, 52.32842], [32.54781, 52.32423], [32.69475, 52.25535], [32.85405, 52.27888], [32.89937, 52.2461], [33.18913, 52.3754], [33.51323, 52.35779], [33.48027, 52.31499], [33.55718, 52.30324], [33.78789, 52.37204], [34.05239, 52.20132], [34.11199, 52.14087], [34.09413, 52.00835], [34.41136, 51.82793], [34.42922, 51.72852], [34.07765, 51.67065], [34.17599, 51.63253], [34.30562, 51.5205], [34.22048, 51.4187], [34.33446, 51.363], [34.23009, 51.26429], [34.31661, 51.23936], [34.38802, 51.2746], [34.6613, 51.25053], [34.6874, 51.18], [34.82472, 51.17483], [34.97304, 51.2342], [35.14058, 51.23162], [35.12685, 51.16191], [35.20375, 51.04723], [35.31774, 51.08434], [35.40837, 51.04119], [35.32598, 50.94524], [35.39307, 50.92145], [35.41367, 50.80227], [35.47704, 50.77274], [35.48116, 50.66405], [35.39464, 50.64751], [35.47463, 50.49247], [35.58003, 50.45117], [35.61711, 50.35707], [35.73659, 50.35489], [35.80388, 50.41356], [35.8926, 50.43829], [36.06893, 50.45205], [36.20763, 50.3943], [36.30101, 50.29088], [36.47817, 50.31457], [36.58371, 50.28563], [36.56655, 50.2413], [36.64571, 50.218], [36.69377, 50.26982], [36.91762, 50.34963], [37.08468, 50.34935], [37.48204, 50.46079], [37.47243, 50.36277], [37.62486, 50.29966], [37.62879, 50.24481], [37.61113, 50.21976], [37.75807, 50.07896], [37.79515, 50.08425], [37.90776, 50.04194], [38.02999, 49.94482], [38.02999, 49.90592], [38.21675, 49.98104], [38.18517, 50.08161], [38.32524, 50.08866], [38.35408, 50.00664], [38.65688, 49.97176], [38.68677, 50.00904], [38.73311, 49.90238], [38.90477, 49.86787], [38.9391, 49.79524], [39.1808, 49.88911], [39.27968, 49.75976], [39.44496, 49.76067], [39.59142, 49.73758], [39.65047, 49.61761], [39.84548, 49.56064], [40.13249, 49.61672], [40.16683, 49.56865], [40.03636, 49.52321], [40.03087, 49.45452], [40.1141, 49.38798], [40.14912, 49.37681], [40.18331, 49.34996], [40.22176, 49.25683], [40.01988, 49.1761], [39.93437, 49.05709], [39.6836, 49.05121], [39.6683, 48.99454], [39.71353, 48.98959], [39.72649, 48.9754], [39.74874, 48.98675], [39.78368, 48.91596], [39.98967, 48.86901], [40.03636, 48.91957], [40.08168, 48.87443], [39.97182, 48.79398], [39.79466, 48.83739], [39.73104, 48.7325], [39.71765, 48.68673], [39.67226, 48.59368], [39.79764, 48.58668], [39.84548, 48.57821], [39.86196, 48.46633], [39.88794, 48.44226], [39.94847, 48.35055], [39.84136, 48.33321], [39.84273, 48.30947], [39.90041, 48.3049], [39.91465, 48.26743], [39.95248, 48.29972], [39.9693, 48.29904], [39.97325, 48.31399], [39.99241, 48.31768], [40.00752, 48.22445], [39.94847, 48.22811], [39.83724, 48.06501], [39.88256, 48.04482], [39.77544, 48.04206], [39.82213, 47.96396], [39.73935, 47.82876], [38.87979, 47.87719], [38.79628, 47.81109], [38.76379, 47.69346], [38.35062, 47.61631], [38.28679, 47.53552], [38.28954, 47.39255], [38.22225, 47.30788], [38.33074, 47.30508], [38.32112, 47.2585], [38.23049, 47.2324], [38.22955, 47.12069], [38.3384, 46.98085], [38.12112, 46.86078], [37.62608, 46.82615], [35.23066, 45.79231], [35.04991, 45.76827], [36.6645, 45.4514], [36.6545, 45.3417], [36.5049, 45.3136], [36.475, 45.2411], [36.4883, 45.0488], [33.5943, 44.03313], [39.81147, 43.06294], [40.0078, 43.38551], [40.00853, 43.40578], [40.01552, 43.42025], [40.01007, 43.42411], [40.03312, 43.44262], [40.04445, 43.47776], [40.10657, 43.57344], [40.65957, 43.56212], [41.64935, 43.22331], [42.40563, 43.23226], [42.66667, 43.13917], [42.75889, 43.19651], [43.03322, 43.08883], [43.0419, 43.02413], [43.81453, 42.74297], [43.73119, 42.62043], [43.95517, 42.55396], [44.54202, 42.75699], [44.70002, 42.74679], [44.80941, 42.61277], [44.88754, 42.74934], [45.15318, 42.70598], [45.36501, 42.55268], [45.78692, 42.48358], [45.61676, 42.20768], [46.42738, 41.91323], [46.5332, 41.87389], [46.58924, 41.80547], [46.75269, 41.8623], [46.8134, 41.76252], [47.00955, 41.63583], [46.99554, 41.59743], [47.03757, 41.55434], [47.10762, 41.59044], [47.34579, 41.27884], [47.49004, 41.26366], [47.54504, 41.20275], [47.62288, 41.22969], [47.75831, 41.19455], [47.87973, 41.21798], [48.07587, 41.49957], [48.22064, 41.51472], [48.2878, 41.56221], [48.40277, 41.60441], [48.42301, 41.65444], [48.55078, 41.77917], [48.5867, 41.84306], [48.80971, 41.95365], [49.2134, 44.84989], [49.88945, 46.04554], [49.32259, 46.26944], [49.16518, 46.38542], [48.54988, 46.56267], [48.51142, 46.69268], [49.01136, 46.72716], [48.52326, 47.4102], [48.45173, 47.40818], [48.15348, 47.74545], [47.64973, 47.76559], [47.41689, 47.83687], [47.38731, 47.68176], [47.12107, 47.83687], [47.11516, 48.27188], [46.49011, 48.43019], [46.78392, 48.95352], [47.00857, 49.04921], [47.04658, 49.19834], [46.78398, 49.34026], [46.9078, 49.86707], [47.18319, 49.93721], [47.34589, 50.09308], [47.30448, 50.30894], [47.58551, 50.47867], [48.10044, 50.09242], [48.24519, 49.86099], [48.42564, 49.82283], [48.68352, 49.89546], [48.90782, 50.02281], [48.57946, 50.63278], [48.86936, 50.61589], [49.12673, 50.78639], [49.41959, 50.85927], [49.39001, 51.09396], [49.76866, 51.11067], [49.97277, 51.2405], [50.26859, 51.28677], [50.59695, 51.61859], [51.26254, 51.68466], [51.301, 51.48799], [51.77431, 51.49536], [51.8246, 51.67916], [52.36119, 51.74161], [52.54329, 51.48444], [53.46165, 51.49445], [53.69299, 51.23466], [54.12248, 51.11542], [54.46331, 50.85554], [54.41894, 50.61214], [54.55797, 50.52006], [54.71476, 50.61214], [54.56685, 51.01958], [54.72067, 51.03261], [55.67774, 50.54508], [56.11398, 50.7471], [56.17906, 50.93204], [57.17302, 51.11253], [57.44221, 50.88354], [57.74986, 50.93017], [57.75578, 51.13852], [58.3208, 51.15151], [58.87974, 50.70852], [59.48928, 50.64216], [59.51886, 50.49937], [59.81172, 50.54451], [60.01288, 50.8163], [60.17262, 50.83312], [60.31914, 50.67705], [60.81833, 50.6629], [61.4431, 50.80679], [61.56889, 51.23679], [61.6813, 51.25716], [61.55114, 51.32746], [61.50677, 51.40687], [60.95655, 51.48615], [60.92401, 51.61124], [60.5424, 51.61675], [60.36787, 51.66815], [60.50986, 51.7964], [60.09867, 51.87135], [59.99809, 51.98263], [59.91279, 52.06924], [60.17253, 52.25814], [60.17516, 52.39457], [59.25033, 52.46803], [59.22409, 52.28437], [58.79644, 52.43392], [58.94336, 53.953], [59.70487, 54.14846], [59.95217, 54.85853], [57.95234, 54.39672], [57.14829, 54.84204], [57.25137, 55.26262], [58.81825, 55.03378], [59.49035, 55.60486], [59.28419, 56.15739], [57.51527, 56.08729], [57.28024, 56.87898], [58.07604, 57.08308], [58.13789, 57.68097], [58.81412, 57.71602], [58.71104, 58.07475], [59.40376, 58.45822], [59.15636, 59.14682], [58.3853, 59.487], [59.50685, 60.91162], [59.36223, 61.3882], [59.61398, 62.44915], [59.24834, 63.01859], [59.80579, 64.13948], [59.63945, 64.78384], [60.74386, 64.95767], [61.98014, 65.72191], [66.1708, 67.61252], [64.18965, 69.94255], [76.13964, 83.37843], [36.85549, 84.09565], [32.07813, 72.01005], [31.59909, 70.16571], [30.84095, 69.80584], [30.95011, 69.54699], [30.52662, 69.54699], [30.16363, 69.65244], [29.97205, 69.41623], [29.27631, 69.2811], [29.26623, 69.13794], [29.0444, 69.0119], [28.91738, 69.04774], [28.45957, 68.91417], [28.78224, 68.86696], [28.43941, 68.53366], [28.62982, 68.19816], [29.34179, 68.06655], [29.66955, 67.79872], [30.02041, 67.67523], [29.91155, 67.51507], [28.9839, 66.94139], [29.91155, 66.13863], [30.16363, 65.66935], [29.97205, 65.70256], [29.74013, 65.64025], [29.84096, 65.56945], [29.68972, 65.31803], [29.61914, 65.23791], [29.8813, 65.22101], [29.84096, 65.1109], [29.61914, 65.05993], [29.68972, 64.80789], [30.05271, 64.79072], [30.12329, 64.64862], [30.01238, 64.57513], [30.06279, 64.35782], [30.4762, 64.25728], [30.55687, 64.09036], [30.25437, 63.83364], [29.98213, 63.75795], [30.49637, 63.46666], [31.23244, 63.22239], [31.29294, 63.09035], [31.58535, 62.91642], [31.38369, 62.66284], [31.10136, 62.43042], [29.01829, 61.17448], [28.82816, 61.1233], [28.47974, 60.93365], [27.77352, 60.52722], [27.71177, 60.3893], [27.44953, 60.22766], [26.32936, 60.00121]]]] } },
      { type: "Feature", properties: { wikidata: "Q1083368", nameEn: "Mainland Finland", country: "FI", groups: ["EU", "154", "150", "UN"], callingCodes: ["358"] }, geometry: { type: "MultiPolygon", coordinates: [[[[29.12697, 69.69193], [28.36883, 69.81658], [28.32849, 69.88605], [27.97558, 69.99671], [27.95542, 70.0965], [27.57226, 70.06215], [27.05802, 69.92069], [26.64461, 69.96565], [26.40261, 69.91377], [25.96904, 69.68397], [25.69679, 69.27039], [25.75729, 68.99383], [25.61613, 68.89602], [25.42455, 68.90328], [25.12206, 68.78684], [25.10189, 68.63307], [24.93048, 68.61102], [24.90023, 68.55579], [24.74898, 68.65143], [24.18432, 68.73936], [24.02299, 68.81601], [23.781, 68.84514], [23.68017, 68.70276], [23.13064, 68.64684], [22.53321, 68.74393], [22.38367, 68.71561], [22.27276, 68.89514], [21.63833, 69.27485], [21.27827, 69.31281], [21.00732, 69.22755], [20.98641, 69.18809], [21.11099, 69.10291], [21.05775, 69.0356], [20.72171, 69.11874], [20.55258, 69.06069], [20.78802, 69.03087], [20.91658, 68.96764], [20.85104, 68.93142], [20.90649, 68.89696], [21.03001, 68.88969], [22.00429, 68.50692], [22.73028, 68.40881], [23.10336, 68.26551], [23.15377, 68.14759], [23.26469, 68.15134], [23.40081, 68.05545], [23.65793, 67.9497], [23.45627, 67.85297], [23.54701, 67.59306], [23.39577, 67.46974], [23.75372, 67.43688], [23.75372, 67.29914], [23.54701, 67.25435], [23.58735, 67.20752], [23.56214, 67.17038], [23.98563, 66.84149], [23.98059, 66.79585], [23.89488, 66.772], [23.85959, 66.56434], [23.63776, 66.43568], [23.67591, 66.3862], [23.64982, 66.30603], [23.71339, 66.21299], [23.90497, 66.15802], [24.15791, 65.85385], [24.14798, 65.83466], [24.15107, 65.81427], [24.14112, 65.39731], [20.15877, 63.06556], [19.23413, 60.61414], [20.96741, 60.71528], [21.15143, 60.54555], [21.08159, 60.20167], [21.02509, 60.12142], [21.35468, 59.67511], [20.5104, 59.15546], [26.32936, 60.00121], [27.44953, 60.22766], [27.71177, 60.3893], [27.77352, 60.52722], [28.47974, 60.93365], [28.82816, 61.1233], [29.01829, 61.17448], [31.10136, 62.43042], [31.38369, 62.66284], [31.58535, 62.91642], [31.29294, 63.09035], [31.23244, 63.22239], [30.49637, 63.46666], [29.98213, 63.75795], [30.25437, 63.83364], [30.55687, 64.09036], [30.4762, 64.25728], [30.06279, 64.35782], [30.01238, 64.57513], [30.12329, 64.64862], [30.05271, 64.79072], [29.68972, 64.80789], [29.61914, 65.05993], [29.84096, 65.1109], [29.8813, 65.22101], [29.61914, 65.23791], [29.68972, 65.31803], [29.84096, 65.56945], [29.74013, 65.64025], [29.97205, 65.70256], [30.16363, 65.66935], [29.91155, 66.13863], [28.9839, 66.94139], [29.91155, 67.51507], [30.02041, 67.67523], [29.66955, 67.79872], [29.34179, 68.06655], [28.62982, 68.19816], [28.43941, 68.53366], [28.78224, 68.86696], [28.45957, 68.91417], [28.91738, 69.04774], [28.81248, 69.11997], [28.8629, 69.22395], [29.31664, 69.47994], [29.12697, 69.69193]]]] } },
      { type: "Feature", properties: { wikidata: "Q1184963", nameEn: "Alhucemas Islands", country: "ES", groups: ["EU", "Q191011", "015", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[-3.90602, 35.21494], [-3.88372, 35.20767], [-3.89343, 35.22728], [-3.90602, 35.21494]]]] } },
      { type: "Feature", properties: { wikidata: "Q1298289", nameEn: "Egmont Islands", country: "GB", groups: ["IO", "BOTS", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[70.1848, -6.37445], [70.67958, -8.2663], [72.17991, -6.68509], [70.1848, -6.37445]]]] } },
      { type: "Feature", properties: { wikidata: "Q1352230", nameEn: "US Territories", country: "US", level: "subcountryGroup" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q1451600", nameEn: "Overseas Countries and Territories of the EU", aliases: ["OCT"], level: "subunion" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q1544253", nameEn: "Great Chagos Bank", country: "GB", groups: ["IO", "BOTS", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[70.1848, -6.37445], [72.17991, -6.68509], [73.20573, -5.20727], [70.1848, -6.37445]]]] } },
      { type: "Feature", properties: { wikidata: "Q1585511", nameEn: "Salomon Atoll", country: "GB", groups: ["IO", "BOTS", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[72.09518, -5.61768], [73.20573, -5.20727], [72.12587, -4.02588], [72.09518, -5.61768]]]] } },
      { type: "Feature", properties: { wikidata: "Q1681727", nameEn: "Saint-Paul and Amsterdam", country: "FR", groups: ["TF", "Q1451600", "014", "202", "002", "UN"], level: "subterritory" }, geometry: { type: "MultiPolygon", coordinates: [[[[76.31747, -42.16264], [80.15867, -36.04977], [71.22311, -38.75287], [76.31747, -42.16264]]]] } },
      { type: "Feature", properties: { wikidata: "Q1901211", nameEn: "East Malaysia", country: "MY", groups: ["Q36117", "035", "142", "UN"], driveSide: "left", callingCodes: ["60"] }, geometry: { type: "MultiPolygon", coordinates: [[[[110.90339, 7.52694], [109.82788, 2.86812], [109.62558, 1.99182], [109.53794, 1.91771], [109.57923, 1.80624], [109.66397, 1.79972], [109.66397, 1.60425], [110.35354, 0.98869], [110.49182, 0.88088], [110.62374, 0.873], [111.22979, 1.08326], [111.55434, 0.97864], [111.82846, 0.99349], [111.94553, 1.12016], [112.15679, 1.17004], [112.2127, 1.44135], [112.48648, 1.56516], [113.021, 1.57819], [113.01448, 1.42832], [113.64677, 1.23933], [114.03788, 1.44787], [114.57892, 1.5], [114.80706, 1.92351], [114.80706, 2.21665], [115.1721, 2.49671], [115.11343, 2.82879], [115.53713, 3.14776], [115.58276, 3.93499], [115.90217, 4.37708], [117.25801, 4.35108], [117.47313, 4.18857], [117.67641, 4.16535], [118.06469, 4.16638], [118.93936, 4.09009], [119.52945, 5.35672], [117.98544, 6.27477], [117.93857, 6.89845], [117.17735, 7.52841], [116.79524, 7.43869], [115.02521, 5.35005], [115.16236, 5.01011], [115.15092, 4.87604], [115.20737, 4.8256], [115.27819, 4.63661], [115.2851, 4.42295], [115.36346, 4.33563], [115.31275, 4.30806], [115.09978, 4.39123], [115.07737, 4.53418], [115.04064, 4.63706], [115.02278, 4.74137], [115.02955, 4.82087], [115.05038, 4.90275], [114.99417, 4.88201], [114.96982, 4.81146], [114.88841, 4.81905], [114.8266, 4.75062], [114.77303, 4.72871], [114.83189, 4.42387], [114.88039, 4.4257], [114.78539, 4.12205], [114.64211, 4.00694], [114.49922, 4.13108], [114.4416, 4.27588], [114.32176, 4.2552], [114.32176, 4.34942], [114.26876, 4.49878], [114.15813, 4.57], [114.07448, 4.58441], [114.10166, 4.76112], [110.90339, 7.52694]]]] } },
      { type: "Feature", properties: { wikidata: "Q1973345", nameEn: "Peninsular Malaysia", country: "MY", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["60"] }, geometry: { type: "MultiPolygon", coordinates: [[[[102.46318, 7.22462], [102.09086, 6.23546], [102.08127, 6.22679], [102.07732, 6.193], [102.09182, 6.14161], [102.01835, 6.05407], [101.99209, 6.04075], [101.97114, 6.01992], [101.9714, 6.00575], [101.94712, 5.98421], [101.92819, 5.85511], [101.91776, 5.84269], [101.89188, 5.8386], [101.80144, 5.74505], [101.75074, 5.79091], [101.69773, 5.75881], [101.58019, 5.93534], [101.25524, 5.78633], [101.25755, 5.71065], [101.14062, 5.61613], [100.98815, 5.79464], [101.02708, 5.91013], [101.087, 5.9193], [101.12388, 6.11411], [101.06165, 6.14161], [101.12618, 6.19431], [101.10313, 6.25617], [100.85884, 6.24929], [100.81045, 6.45086], [100.74822, 6.46231], [100.74361, 6.50811], [100.66986, 6.45086], [100.43027, 6.52389], [100.42351, 6.51762], [100.41791, 6.5189], [100.41152, 6.52299], [100.35413, 6.54932], [100.31929, 6.65413], [100.32607, 6.65933], [100.32671, 6.66526], [100.31884, 6.66423], [100.31618, 6.66781], [100.30828, 6.66462], [100.29651, 6.68439], [100.19511, 6.72559], [100.12, 6.42105], [100.0756, 6.4045], [99.91873, 6.50233], [99.50117, 6.44501], [99.31854, 5.99868], [99.75778, 3.86466], [103.03657, 1.30383], [103.56591, 1.19719], [103.62738, 1.35255], [103.67468, 1.43166], [103.7219, 1.46108], [103.74161, 1.4502], [103.76395, 1.45183], [103.81181, 1.47953], [103.86383, 1.46288], [103.89565, 1.42841], [103.93384, 1.42926], [104.00131, 1.42405], [104.02277, 1.4438], [104.04622, 1.44691], [104.07348, 1.43322], [104.08871, 1.42015], [104.09162, 1.39694], [104.08072, 1.35998], [104.12282, 1.27714], [104.34728, 1.33529], [104.56723, 1.44271], [105.01437, 3.24936], [102.46318, 7.22462]]]] } },
      { type: "Feature", properties: { wikidata: "Q2093907", nameEn: "Three Kings Islands", country: "NZ", groups: ["Q851132", "053", "009", "UN"], driveSide: "left" }, geometry: { type: "MultiPolygon", coordinates: [[[[174.17679, -32.62487], [170.93268, -32.97889], [171.97383, -34.64644], [174.17679, -32.62487]]]] } },
      { type: "Feature", properties: { wikidata: "Q2298216", nameEn: "Solander Islands", country: "NZ", groups: ["Q851132", "053", "009", "UN"], driveSide: "left" }, geometry: { type: "MultiPolygon", coordinates: [[[[167.39068, -46.49187], [166.5534, -46.39484], [166.84561, -46.84889], [167.39068, -46.49187]]]] } },
      { type: "Feature", properties: { wikidata: "Q2872203", nameEn: "Mainland Australia", country: "AU", groups: ["053", "009", "UN"], level: "subcountryGroup", driveSide: "left", callingCodes: ["61"] }, geometry: { type: "MultiPolygon", coordinates: [[[[88.16419, -23.49578], [123.64533, -39.13605], [159.74028, -39.1978], [159.76765, -29.76946], [154.02855, -24.43238], [152.93188, -20.92631], [147.69992, -17.5933], [145.2855, -9.62524], [143.87386, -9.02382], [143.29772, -9.33993], [142.48658, -9.36754], [142.19246, -9.15378], [141.88934, -9.36111], [141.01842, -9.35091], [135.49042, -9.2276], [127.55165, -9.05052], [125.29076, -12.33139], [88.16419, -23.49578]]]] } },
      { type: "Feature", properties: { wikidata: "Q2914565", nameEn: "Autonomous Regions of Portugal", country: "PT", level: "subcountryGroup" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q2915956", nameEn: "Mainland Portugal", country: "PT", groups: ["Q12837", "EU", "039", "150", "UN"], level: "subcountryGroup", callingCodes: ["351"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-10.39881, 36.12218], [-7.37282, 36.96896], [-7.39769, 37.16868], [-7.41133, 37.20314], [-7.41854, 37.23813], [-7.43227, 37.25152], [-7.43974, 37.38913], [-7.46878, 37.47127], [-7.51759, 37.56119], [-7.41981, 37.75729], [-7.33441, 37.81193], [-7.27314, 37.90145], [-7.24544, 37.98884], [-7.12648, 38.00296], [-7.10366, 38.04404], [-7.05966, 38.01966], [-7.00375, 38.01914], [-6.93418, 38.21454], [-7.09389, 38.17227], [-7.15581, 38.27597], [-7.32529, 38.44336], [-7.265, 38.61674], [-7.26174, 38.72107], [-7.03848, 38.87221], [-7.051, 38.907], [-6.95211, 39.0243], [-6.97004, 39.07619], [-7.04011, 39.11919], [-7.10692, 39.10275], [-7.14929, 39.11287], [-7.12811, 39.17101], [-7.23566, 39.20132], [-7.23403, 39.27579], [-7.3149, 39.34857], [-7.2927, 39.45847], [-7.49477, 39.58794], [-7.54121, 39.66717], [-7.33507, 39.64569], [-7.24707, 39.66576], [-7.01613, 39.66877], [-6.97492, 39.81488], [-6.91463, 39.86618], [-6.86737, 40.01986], [-6.94233, 40.10716], [-7.00589, 40.12087], [-7.02544, 40.18564], [-7.00426, 40.23169], [-6.86085, 40.26776], [-6.86085, 40.2976], [-6.80218, 40.33239], [-6.78426, 40.36468], [-6.84618, 40.42177], [-6.84944, 40.46394], [-6.7973, 40.51723], [-6.80218, 40.55067], [-6.84292, 40.56801], [-6.79567, 40.65955], [-6.82826, 40.74603], [-6.82337, 40.84472], [-6.79892, 40.84842], [-6.80707, 40.88047], [-6.84292, 40.89771], [-6.8527, 40.93958], [-6.9357, 41.02888], [-6.913, 41.03922], [-6.88843, 41.03027], [-6.84781, 41.02692], [-6.80942, 41.03629], [-6.79241, 41.05397], [-6.75655, 41.10187], [-6.77319, 41.13049], [-6.69711, 41.1858], [-6.68286, 41.21641], [-6.65046, 41.24725], [-6.55937, 41.24417], [-6.38551, 41.35274], [-6.38553, 41.38655], [-6.3306, 41.37677], [-6.26777, 41.48796], [-6.19128, 41.57638], [-6.29863, 41.66432], [-6.44204, 41.68258], [-6.49907, 41.65823], [-6.54633, 41.68623], [-6.56426, 41.74219], [-6.51374, 41.8758], [-6.56752, 41.88429], [-6.5447, 41.94371], [-6.58544, 41.96674], [-6.61967, 41.94008], [-6.75004, 41.94129], [-6.76959, 41.98734], [-6.81196, 41.99097], [-6.82174, 41.94493], [-6.94396, 41.94403], [-6.95537, 41.96553], [-6.98144, 41.9728], [-7.01078, 41.94977], [-7.07596, 41.94977], [-7.08574, 41.97401], [-7.14115, 41.98855], [-7.18549, 41.97515], [-7.18677, 41.88793], [-7.32366, 41.8406], [-7.37092, 41.85031], [-7.42864, 41.80589], [-7.42854, 41.83262], [-7.44759, 41.84451], [-7.45566, 41.86488], [-7.49803, 41.87095], [-7.52737, 41.83939], [-7.62188, 41.83089], [-7.58603, 41.87944], [-7.65774, 41.88308], [-7.69848, 41.90977], [-7.84188, 41.88065], [-7.88055, 41.84571], [-7.88751, 41.92553], [-7.90707, 41.92432], [-7.92336, 41.8758], [-7.9804, 41.87337], [-8.01136, 41.83453], [-8.0961, 41.81024], [-8.16455, 41.81753], [-8.16944, 41.87944], [-8.19551, 41.87459], [-8.2185, 41.91237], [-8.16232, 41.9828], [-8.08796, 42.01398], [-8.08847, 42.05767], [-8.11729, 42.08537], [-8.18178, 42.06436], [-8.19406, 42.12141], [-8.18947, 42.13853], [-8.1986, 42.15402], [-8.22406, 42.1328], [-8.24681, 42.13993], [-8.2732, 42.12396], [-8.29809, 42.106], [-8.32161, 42.10218], [-8.33912, 42.08358], [-8.36353, 42.09065], [-8.38323, 42.07683], [-8.40143, 42.08052], [-8.42512, 42.07199], [-8.44123, 42.08218], [-8.48185, 42.0811], [-8.52837, 42.07658], [-8.5252, 42.06264], [-8.54563, 42.0537], [-8.58086, 42.05147], [-8.59493, 42.05708], [-8.63791, 42.04691], [-8.64626, 42.03668], [-8.65832, 42.02972], [-8.6681, 41.99703], [-8.69071, 41.98862], [-8.7478, 41.96282], [-8.74606, 41.9469], [-8.75712, 41.92833], [-8.81794, 41.90375], [-8.87157, 41.86488], [-11.19304, 41.83075], [-10.39881, 36.12218]]]] } },
      { type: "Feature", properties: { wikidata: "Q3311985", nameEn: "Guernsey", country: "GB", groups: ["GG", "830", "Q185086", "154", "150", "UN"], level: "subterritory", driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44 01481"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.49556, 49.79012], [-3.28154, 49.57329], [-2.65349, 49.15373], [-2.36485, 49.48223], [-2.49556, 49.79012]]]] } },
      { type: "Feature", properties: { wikidata: "Q3320166", nameEn: "Outermost Regions of the EU", aliases: ["OMR"], level: "subunion" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q3336843", nameEn: "Countries of the United Kingdom", country: "GB", level: "subcountryGroup" }, geometry: null },
      { type: "Feature", properties: { wikidata: "Q6736667", nameEn: "Mainland India", country: "IN", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["91"] }, geometry: { type: "MultiPolygon", coordinates: [[[[89.08044, 21.41871], [89.07114, 22.15335], [88.9367, 22.58527], [88.94614, 22.66941], [88.9151, 22.75228], [88.96713, 22.83346], [88.87063, 22.95235], [88.88327, 23.03885], [88.86377, 23.08759], [88.99148, 23.21134], [88.71133, 23.2492], [88.79254, 23.46028], [88.79351, 23.50535], [88.74841, 23.47361], [88.56507, 23.64044], [88.58087, 23.87105], [88.66189, 23.87607], [88.73743, 23.91751], [88.6976, 24.14703], [88.74841, 24.1959], [88.68801, 24.31464], [88.50934, 24.32474], [88.12296, 24.51301], [88.08786, 24.63232], [88.00683, 24.66477], [88.15515, 24.85806], [88.14004, 24.93529], [88.21832, 24.96642], [88.27325, 24.88796], [88.33917, 24.86803], [88.46277, 25.07468], [88.44766, 25.20149], [88.94067, 25.18534], [89.00463, 25.26583], [89.01105, 25.30303], [88.85278, 25.34679], [88.81296, 25.51546], [88.677, 25.46959], [88.4559, 25.59227], [88.45103, 25.66245], [88.242, 25.80811], [88.13138, 25.78773], [88.08804, 25.91334], [88.16581, 26.0238], [88.1844, 26.14417], [88.34757, 26.22216], [88.35153, 26.29123], [88.51649, 26.35923], [88.48749, 26.45855], [88.36938, 26.48683], [88.35153, 26.45241], [88.33093, 26.48929], [88.41196, 26.63837], [88.4298, 26.54489], [88.62144, 26.46783], [88.69485, 26.38353], [88.67837, 26.26291], [88.78961, 26.31093], [88.85004, 26.23211], [89.05328, 26.2469], [88.91321, 26.37984], [88.92357, 26.40711], [88.95612, 26.4564], [89.08899, 26.38845], [89.15869, 26.13708], [89.35953, 26.0077], [89.53515, 26.00382], [89.57101, 25.9682], [89.63968, 26.22595], [89.70201, 26.15138], [89.73581, 26.15818], [89.77865, 26.08387], [89.77728, 26.04254], [89.86592, 25.93115], [89.80585, 25.82489], [89.84388, 25.70042], [89.86129, 25.61714], [89.81208, 25.37244], [89.84086, 25.31854], [89.83371, 25.29548], [89.87629, 25.28337], [89.90478, 25.31038], [90.1155, 25.22686], [90.40034, 25.1534], [90.65042, 25.17788], [90.87427, 25.15799], [91.25517, 25.20677], [91.63648, 25.12846], [92.0316, 25.1834], [92.33957, 25.07593], [92.39147, 25.01471], [92.49887, 24.88796], [92.38626, 24.86055], [92.25854, 24.9191], [92.15796, 24.54435], [92.11662, 24.38997], [91.96603, 24.3799], [91.89258, 24.14674], [91.82596, 24.22345], [91.76004, 24.23848], [91.73257, 24.14703], [91.65292, 24.22095], [91.63782, 24.1132], [91.55542, 24.08687], [91.37414, 24.10693], [91.35741, 23.99072], [91.29587, 24.0041], [91.22308, 23.89616], [91.25192, 23.83463], [91.15579, 23.6599], [91.28293, 23.37538], [91.36453, 23.06612], [91.40848, 23.07117], [91.4035, 23.27522], [91.46615, 23.2328], [91.54993, 23.01051], [91.61571, 22.93929], [91.7324, 23.00043], [91.81634, 23.08001], [91.76417, 23.26619], [91.84789, 23.42235], [91.95642, 23.47361], [91.95093, 23.73284], [92.04706, 23.64229], [92.15417, 23.73409], [92.26541, 23.70392], [92.38214, 23.28705], [92.37665, 22.9435], [92.5181, 22.71441], [92.60029, 22.1522], [92.56616, 22.13554], [92.60949, 21.97638], [92.67532, 22.03547], [92.70416, 22.16017], [92.86208, 22.05456], [92.89504, 21.95143], [92.93899, 22.02656], [92.99804, 21.98964], [92.99255, 22.05965], [93.04885, 22.20595], [93.15734, 22.18687], [93.14224, 22.24535], [93.19991, 22.25425], [93.18206, 22.43716], [93.13537, 22.45873], [93.11477, 22.54374], [93.134, 22.59573], [93.09417, 22.69459], [93.134, 22.92498], [93.12988, 23.05772], [93.2878, 23.00464], [93.38478, 23.13698], [93.36862, 23.35426], [93.38781, 23.36139], [93.39981, 23.38828], [93.38805, 23.4728], [93.43475, 23.68299], [93.3908, 23.7622], [93.3908, 23.92925], [93.36059, 23.93176], [93.32351, 24.04468], [93.34735, 24.10151], [93.41415, 24.07854], [93.46633, 23.97067], [93.50616, 23.94432], [93.62871, 24.00922], [93.75952, 24.0003], [93.80279, 23.92549], [93.92089, 23.95812], [94.14081, 23.83333], [94.30215, 24.23752], [94.32362, 24.27692], [94.45279, 24.56656], [94.50729, 24.59281], [94.5526, 24.70764], [94.60204, 24.70889], [94.73937, 25.00545], [94.74212, 25.13606], [94.57458, 25.20318], [94.68032, 25.47003], [94.80117, 25.49359], [95.18556, 26.07338], [95.11428, 26.1019], [95.12801, 26.38397], [95.05798, 26.45408], [95.23513, 26.68499], [95.30339, 26.65372], [95.437, 26.7083], [95.81603, 27.01335], [95.93002, 27.04149], [96.04949, 27.19428], [96.15591, 27.24572], [96.40779, 27.29818], [96.55761, 27.29928], [96.73888, 27.36638], [96.88445, 27.25046], [96.85287, 27.2065], [96.89132, 27.17474], [97.14675, 27.09041], [97.17422, 27.14052], [96.91431, 27.45752], [96.90112, 27.62149], [97.29919, 27.92233], [97.35824, 27.87256], [97.38845, 28.01329], [97.35412, 28.06663], [97.31292, 28.06784], [97.34547, 28.21385], [97.1289, 28.3619], [96.98882, 28.32564], [96.88445, 28.39452], [96.85561, 28.4875], [96.6455, 28.61657], [96.48895, 28.42955], [96.40929, 28.51526], [96.61391, 28.72742], [96.3626, 29.10607], [96.20467, 29.02325], [96.18682, 29.11087], [96.31316, 29.18643], [96.05361, 29.38167], [95.84899, 29.31464], [95.75149, 29.32063], [95.72086, 29.20797], [95.50842, 29.13487], [95.41091, 29.13007], [95.3038, 29.13847], [95.26122, 29.07727], [95.2214, 29.10727], [95.11291, 29.09527], [95.0978, 29.14446], [94.81353, 29.17804], [94.69318, 29.31739], [94.2752, 29.11687], [94.35897, 29.01965], [93.72797, 28.68821], [93.44621, 28.67189], [93.18069, 28.50319], [93.14635, 28.37035], [92.93075, 28.25671], [92.67486, 28.15018], [92.65472, 28.07632], [92.73025, 28.05814], [92.7275, 27.98662], [92.42538, 27.80092], [92.32101, 27.79363], [92.27432, 27.89077], [91.87057, 27.7195], [91.84722, 27.76325], [91.6469, 27.76358], [91.55819, 27.6144], [91.65007, 27.48287], [92.01132, 27.47352], [92.12019, 27.27829], [92.04702, 27.26861], [92.03457, 27.07334], [92.11863, 26.893], [92.05523, 26.8692], [91.83181, 26.87318], [91.50067, 26.79223], [90.67715, 26.77215], [90.48504, 26.8594], [90.39271, 26.90704], [90.30402, 26.85098], [90.04535, 26.72422], [89.86124, 26.73307], [89.63369, 26.74402], [89.42349, 26.83727], [89.3901, 26.84225], [89.38319, 26.85963], [89.37913, 26.86224], [89.1926, 26.81329], [89.12825, 26.81661], [89.09554, 26.89089], [88.95807, 26.92668], [88.92301, 26.99286], [88.8714, 26.97488], [88.86984, 27.10937], [88.74219, 27.144], [88.91901, 27.32483], [88.82981, 27.38814], [88.77517, 27.45415], [88.88091, 27.85192], [88.83559, 28.01936], [88.63235, 28.12356], [88.54858, 28.06057], [88.25332, 27.9478], [88.1278, 27.95417], [88.13378, 27.88015], [88.1973, 27.85067], [88.19107, 27.79285], [88.04008, 27.49223], [88.07277, 27.43007], [88.01646, 27.21612], [88.01587, 27.21388], [87.9887, 27.11045], [88.11719, 26.98758], [88.13422, 26.98705], [88.12302, 26.95324], [88.19107, 26.75516], [88.1659, 26.68177], [88.16452, 26.64111], [88.09963, 26.54195], [88.09414, 26.43732], [88.00895, 26.36029], [87.90115, 26.44923], [87.89085, 26.48565], [87.84193, 26.43663], [87.7918, 26.46737], [87.76004, 26.40711], [87.67893, 26.43501], [87.66803, 26.40294], [87.59175, 26.38342], [87.55274, 26.40596], [87.51571, 26.43106], [87.46566, 26.44058], [87.37314, 26.40815], [87.34568, 26.34787], [87.26568, 26.37294], [87.26587, 26.40592], [87.24682, 26.4143], [87.18863, 26.40558], [87.14751, 26.40542], [87.09147, 26.45039], [87.0707, 26.58571], [87.04691, 26.58685], [87.01559, 26.53228], [86.95912, 26.52076], [86.94543, 26.52076], [86.82898, 26.43919], [86.76797, 26.45892], [86.74025, 26.42386], [86.69124, 26.45169], [86.62686, 26.46891], [86.61313, 26.48658], [86.57073, 26.49825], [86.54258, 26.53819], [86.49726, 26.54218], [86.31564, 26.61925], [86.26235, 26.61886], [86.22513, 26.58863], [86.13596, 26.60651], [86.02729, 26.66756], [85.8492, 26.56667], [85.85126, 26.60866], [85.83126, 26.61134], [85.76907, 26.63076], [85.72315, 26.67471], [85.73483, 26.79613], [85.66239, 26.84822], [85.61621, 26.86721], [85.59461, 26.85161], [85.5757, 26.85955], [85.56471, 26.84133], [85.47752, 26.79292], [85.34302, 26.74954], [85.21159, 26.75933], [85.18046, 26.80519], [85.19291, 26.86909], [85.15883, 26.86966], [85.02635, 26.85381], [85.05592, 26.88991], [85.00536, 26.89523], [84.97186, 26.9149], [84.96687, 26.95599], [84.85754, 26.98984], [84.82913, 27.01989], [84.793, 26.9968], [84.64496, 27.04669], [84.69166, 27.21294], [84.62161, 27.33885], [84.29315, 27.39], [84.25735, 27.44941], [84.21376, 27.45218], [84.10791, 27.52399], [84.02229, 27.43836], [83.93306, 27.44939], [83.86182, 27.4241], [83.85595, 27.35797], [83.61288, 27.47013], [83.39495, 27.4798], [83.38872, 27.39276], [83.35136, 27.33885], [83.29999, 27.32778], [83.2673, 27.36235], [83.27197, 27.38309], [83.19413, 27.45632], [82.94938, 27.46036], [82.93261, 27.50328], [82.74119, 27.49838], [82.70378, 27.72122], [82.46405, 27.6716], [82.06554, 27.92222], [81.97214, 27.93322], [81.91223, 27.84995], [81.47867, 28.08303], [81.48179, 28.12148], [81.38683, 28.17638], [81.32923, 28.13521], [81.19847, 28.36284], [81.03471, 28.40054], [80.55142, 28.69182], [80.50575, 28.6706], [80.52443, 28.54897], [80.44504, 28.63098], [80.37188, 28.63371], [80.12125, 28.82346], [80.06957, 28.82763], [80.05743, 28.91479], [80.18085, 29.13649], [80.23178, 29.11626], [80.26602, 29.13938], [80.24112, 29.21414], [80.28626, 29.20327], [80.31428, 29.30784], [80.24322, 29.44299], [80.37939, 29.57098], [80.41858, 29.63581], [80.38428, 29.68513], [80.36803, 29.73865], [80.41554, 29.79451], [80.43458, 29.80466], [80.48997, 29.79566], [80.56247, 29.86661], [80.57179, 29.91422], [80.60226, 29.95732], [80.67076, 29.95732], [80.8778, 30.13384], [80.86673, 30.17321], [80.91143, 30.22173], [80.92547, 30.17193], [81.03953, 30.20059], [80.83343, 30.32023], [80.54504, 30.44936], [80.20721, 30.58541], [79.93255, 30.88288], [79.59884, 30.93943], [79.30694, 31.17357], [79.14016, 31.43403], [79.01931, 31.42817], [78.89344, 31.30481], [78.77898, 31.31209], [78.71032, 31.50197], [78.84516, 31.60631], [78.69933, 31.78723], [78.78036, 31.99478], [78.74404, 32.00384], [78.68754, 32.10256], [78.49609, 32.2762], [78.4645, 32.45367], [78.38897, 32.53938], [78.73916, 32.69438], [78.7831, 32.46873], [78.96713, 32.33655], [78.99322, 32.37948], [79.0979, 32.38051], [79.13174, 32.47766], [79.26768, 32.53277], [79.46562, 32.69668], [79.14016, 33.02545], [79.15252, 33.17156], [78.73636, 33.56521], [78.67599, 33.66445], [78.77349, 33.73871], [78.73367, 34.01121], [78.65657, 34.03195], [78.66225, 34.08858], [78.91769, 34.15452], [78.99802, 34.3027], [79.05364, 34.32482], [78.74465, 34.45174], [78.56475, 34.50835], [78.54964, 34.57283], [78.27781, 34.61484], [78.18435, 34.7998], [78.22692, 34.88771], [78.00033, 35.23954], [78.03466, 35.3785], [78.11664, 35.48022], [77.80532, 35.52058], [77.70232, 35.46244], [77.44277, 35.46132], [76.96624, 35.5932], [76.84539, 35.67356], [76.77323, 35.66062], [76.75475, 35.52617], [76.85088, 35.39754], [76.93465, 35.39866], [77.11796, 35.05419], [76.99251, 34.93349], [76.87193, 34.96906], [76.74514, 34.92488], [76.74377, 34.84039], [76.67648, 34.76371], [76.47186, 34.78965], [76.15463, 34.6429], [76.04614, 34.67566], [75.75438, 34.51827], [75.38009, 34.55021], [75.01479, 34.64629], [74.6663, 34.703], [74.58083, 34.77386], [74.31239, 34.79626], [74.12897, 34.70073], [73.96423, 34.68244], [73.93401, 34.63386], [73.93951, 34.57169], [73.89419, 34.54568], [73.88732, 34.48911], [73.74999, 34.3781], [73.74862, 34.34183], [73.8475, 34.32935], [73.90517, 34.35317], [73.98208, 34.2522], [73.90677, 34.10504], [73.88732, 34.05105], [73.91341, 34.01235], [74.21554, 34.03853], [74.25262, 34.01577], [74.26086, 33.92237], [74.14001, 33.83002], [74.05898, 33.82089], [74.00891, 33.75437], [73.96423, 33.73071], [73.98968, 33.66155], [73.97367, 33.64061], [74.03576, 33.56718], [74.10115, 33.56392], [74.18121, 33.4745], [74.17983, 33.3679], [74.08782, 33.26232], [74.01366, 33.25199], [74.02144, 33.18908], [74.15374, 33.13477], [74.17571, 33.07495], [74.31854, 33.02891], [74.34875, 32.97823], [74.31227, 32.92795], [74.41467, 32.90563], [74.45312, 32.77755], [74.6289, 32.75561], [74.64675, 32.82604], [74.7113, 32.84219], [74.65345, 32.71225], [74.69542, 32.66792], [74.64424, 32.60985], [74.65251, 32.56416], [74.67431, 32.56676], [74.68362, 32.49298], [74.84725, 32.49075], [74.97634, 32.45367], [75.03265, 32.49538], [75.28259, 32.36556], [75.38046, 32.26836], [75.25649, 32.10187], [75.00793, 32.03786], [74.9269, 32.0658], [74.86236, 32.04485], [74.79919, 31.95983], [74.58907, 31.87824], [74.47771, 31.72227], [74.57498, 31.60382], [74.61517, 31.55698], [74.59319, 31.50197], [74.64713, 31.45605], [74.59773, 31.4136], [74.53223, 31.30321], [74.51629, 31.13829], [74.56023, 31.08303], [74.60281, 31.10419], [74.60006, 31.13711], [74.6852, 31.12771], [74.67971, 31.05479], [74.5616, 31.04153], [73.88993, 30.36305], [73.95736, 30.28466], [73.97225, 30.19829], [73.80299, 30.06969], [73.58665, 30.01848], [73.3962, 29.94707], [73.28094, 29.56646], [73.05886, 29.1878], [73.01337, 29.16422], [72.94272, 29.02487], [72.40402, 28.78283], [72.29495, 28.66367], [72.20329, 28.3869], [71.9244, 28.11555], [71.89921, 27.96035], [70.79054, 27.68423], [70.60927, 28.02178], [70.37307, 28.01208], [70.12502, 27.8057], [70.03136, 27.56627], [69.58519, 27.18109], [69.50904, 26.74892], [69.88555, 26.56836], [70.05584, 26.60398], [70.17532, 26.55362], [70.17532, 26.24118], [70.08193, 26.08094], [70.0985, 25.93238], [70.2687, 25.71156], [70.37444, 25.67443], [70.53649, 25.68928], [70.60378, 25.71898], [70.67382, 25.68186], [70.66695, 25.39314], [70.89148, 25.15064], [70.94002, 24.92843], [71.09405, 24.69017], [70.97594, 24.60904], [71.00341, 24.46038], [71.12838, 24.42662], [71.04461, 24.34657], [70.94985, 24.3791], [70.85784, 24.30903], [70.88393, 24.27398], [70.71502, 24.23517], [70.57906, 24.27774], [70.5667, 24.43787], [70.11712, 24.30915], [70.03428, 24.172], [69.73335, 24.17007], [69.59579, 24.29777], [69.29778, 24.28712], [69.19341, 24.25646], [69.07806, 24.29777], [68.97781, 24.26021], [68.90914, 24.33156], [68.7416, 24.31904], [68.74643, 23.97027], [68.39339, 23.96838], [68.20763, 23.85849], [68.11329, 23.53945], [76.59015, 5.591], [79.50447, 8.91876], [79.42124, 9.80115], [80.48418, 10.20786], [89.08044, 21.41871]]]] } },
      { type: "Feature", properties: { wikidata: "Q9143535", nameEn: "Akrotiri", country: "GB", groups: ["Q644636", "Q37362", "BOTS", "145", "142", "UN"], level: "subterritory", driveSide: "left", callingCodes: ["357"] }, geometry: { type: "MultiPolygon", coordinates: [[[[32.86014, 34.70585], [32.82717, 34.70622], [32.79433, 34.67883], [32.76136, 34.68318], [32.75515, 34.64985], [32.74412, 34.43926], [33.26744, 34.49942], [33.0138, 34.64424], [32.96968, 34.64046], [32.96718, 34.63446], [32.95891, 34.62919], [32.95323, 34.64075], [32.95471, 34.64528], [32.94976, 34.65204], [32.94796, 34.6587], [32.95325, 34.66462], [32.97079, 34.66112], [32.97736, 34.65277], [32.99014, 34.65518], [32.98668, 34.67268], [32.99135, 34.68061], [32.95539, 34.68471], [32.94683, 34.67907], [32.94379, 34.67111], [32.93693, 34.67027], [32.93449, 34.66241], [32.92807, 34.66736], [32.93043, 34.67091], [32.91398, 34.67343], [32.9068, 34.66102], [32.86167, 34.68734], [32.86014, 34.70585]]]] } },
      { type: "Feature", properties: { wikidata: "Q9206745", nameEn: "Dhekelia", country: "GB", groups: ["Q644636", "Q37362", "BOTS", "145", "142", "UN"], level: "subterritory", driveSide: "left", callingCodes: ["357"] }, geometry: { type: "MultiPolygon", coordinates: [[[[33.70575, 34.97947], [33.83531, 34.73974], [33.98684, 34.76642], [33.90075, 34.96623], [33.86432, 34.97592], [33.84811, 34.97075], [33.83505, 34.98108], [33.85621, 34.98956], [33.85891, 35.001], [33.85216, 35.00579], [33.84045, 35.00616], [33.82875, 35.01685], [33.83055, 35.02865], [33.81524, 35.04192], [33.8012, 35.04786], [33.82051, 35.0667], [33.8355, 35.05777], [33.85261, 35.0574], [33.88367, 35.07877], [33.89485, 35.06873], [33.90247, 35.07686], [33.91299, 35.07579], [33.91789, 35.08688], [33.89853, 35.11377], [33.88737, 35.11408], [33.88943, 35.12007], [33.88561, 35.12449], [33.87224, 35.12293], [33.87622, 35.10457], [33.87097, 35.09389], [33.87479, 35.08881], [33.8541, 35.07201], [33.84168, 35.06823], [33.82067, 35.07826], [33.78581, 35.05104], [33.76106, 35.04253], [33.73824, 35.05321], [33.71482, 35.03722], [33.70209, 35.04882], [33.7161, 35.07279], [33.70861, 35.07644], [33.69095, 35.06237], [33.68474, 35.06602], [33.67742, 35.05963], [33.67678, 35.03866], [33.69938, 35.03123], [33.69731, 35.01754], [33.71514, 35.00294], [33.70639, 34.99303], [33.70575, 34.97947]], [[33.77312, 34.9976], [33.77553, 34.99518], [33.78516, 34.99582], [33.79191, 34.98914], [33.78917, 34.98854], [33.78571, 34.98951], [33.78318, 34.98699], [33.78149, 34.98854], [33.77843, 34.988], [33.7778, 34.98981], [33.76738, 34.99188], [33.76605, 34.99543], [33.75682, 34.99916], [33.75994, 35.00113], [33.77312, 34.9976]], [[33.74144, 35.01053], [33.7343, 35.01178], [33.73781, 35.02181], [33.74265, 35.02329], [33.74983, 35.02274], [33.7492, 35.01319], [33.74144, 35.01053]]]] } },
      { type: "Feature", properties: { wikidata: "Q16390686", nameEn: "Peninsular Spain", country: "ES", groups: ["Q12837", "EU", "039", "150", "UN"], callingCodes: ["34"] }, geometry: { type: "MultiPolygon", coordinates: [[[[3.75438, 42.33445], [3.17156, 42.43545], [3.11379, 42.43646], [3.10027, 42.42621], [3.08167, 42.42748], [3.03734, 42.47363], [2.96518, 42.46692], [2.94283, 42.48174], [2.92107, 42.4573], [2.88413, 42.45938], [2.86983, 42.46843], [2.85675, 42.45444], [2.84335, 42.45724], [2.77464, 42.41046], [2.75497, 42.42578], [2.72056, 42.42298], [2.65311, 42.38771], [2.6747, 42.33974], [2.57934, 42.35808], [2.55516, 42.35351], [2.54382, 42.33406], [2.48457, 42.33933], [2.43508, 42.37568], [2.43299, 42.39423], [2.38504, 42.39977], [2.25551, 42.43757], [2.20578, 42.41633], [2.16599, 42.42314], [2.12789, 42.41291], [2.11621, 42.38393], [2.06241, 42.35906], [2.00488, 42.35399], [1.96482, 42.37787], [1.9574, 42.42401], [1.94084, 42.43039], [1.94061, 42.43333], [1.94292, 42.44316], [1.93663, 42.45439], [1.88853, 42.4501], [1.83037, 42.48395], [1.76335, 42.48863], [1.72515, 42.50338], [1.70571, 42.48867], [1.66826, 42.50779], [1.65674, 42.47125], [1.58933, 42.46275], [1.57953, 42.44957], [1.55937, 42.45808], [1.55073, 42.43299], [1.5127, 42.42959], [1.44529, 42.43724], [1.43838, 42.47848], [1.41648, 42.48315], [1.46661, 42.50949], [1.44759, 42.54431], [1.41245, 42.53539], [1.4234, 42.55959], [1.44529, 42.56722], [1.42512, 42.58292], [1.44197, 42.60217], [1.35562, 42.71944], [1.15928, 42.71407], [1.0804, 42.78569], [0.98292, 42.78754], [0.96166, 42.80629], [0.93089, 42.79154], [0.711, 42.86372], [0.66121, 42.84021], [0.65421, 42.75872], [0.67873, 42.69458], [0.40214, 42.69779], [0.36251, 42.72282], [0.29407, 42.67431], [0.25336, 42.7174], [0.17569, 42.73424], [-0.02468, 42.68513], [-0.10519, 42.72761], [-0.16141, 42.79535], [-0.17939, 42.78974], [-0.3122, 42.84788], [-0.38833, 42.80132], [-0.41319, 42.80776], [-0.44334, 42.79939], [-0.50863, 42.82713], [-0.55497, 42.77846], [-0.67637, 42.88303], [-0.69837, 42.87945], [-0.72608, 42.89318], [-0.73422, 42.91228], [-0.72037, 42.92541], [-0.75478, 42.96916], [-0.81652, 42.95166], [-0.97133, 42.96239], [-1.00963, 42.99279], [-1.10333, 43.0059], [-1.22881, 43.05534], [-1.25244, 43.04164], [-1.30531, 43.06859], [-1.30052, 43.09581], [-1.27118, 43.11961], [-1.32209, 43.1127], [-1.34419, 43.09665], [-1.35272, 43.02658], [-1.44067, 43.047], [-1.47555, 43.08372], [-1.41562, 43.12815], [-1.3758, 43.24511], [-1.40942, 43.27272], [-1.45289, 43.27049], [-1.50992, 43.29481], [-1.55963, 43.28828], [-1.57674, 43.25269], [-1.61341, 43.25269], [-1.63052, 43.28591], [-1.62481, 43.30726], [-1.69407, 43.31378], [-1.73074, 43.29481], [-1.7397, 43.32979], [-1.75079, 43.3317], [-1.75334, 43.34107], [-1.77068, 43.34396], [-1.78714, 43.35476], [-1.78332, 43.36399], [-1.79319, 43.37497], [-1.77289, 43.38957], [-1.81005, 43.59738], [-10.14298, 44.17365], [-11.19304, 41.83075], [-8.87157, 41.86488], [-8.81794, 41.90375], [-8.75712, 41.92833], [-8.74606, 41.9469], [-8.7478, 41.96282], [-8.69071, 41.98862], [-8.6681, 41.99703], [-8.65832, 42.02972], [-8.64626, 42.03668], [-8.63791, 42.04691], [-8.59493, 42.05708], [-8.58086, 42.05147], [-8.54563, 42.0537], [-8.5252, 42.06264], [-8.52837, 42.07658], [-8.48185, 42.0811], [-8.44123, 42.08218], [-8.42512, 42.07199], [-8.40143, 42.08052], [-8.38323, 42.07683], [-8.36353, 42.09065], [-8.33912, 42.08358], [-8.32161, 42.10218], [-8.29809, 42.106], [-8.2732, 42.12396], [-8.24681, 42.13993], [-8.22406, 42.1328], [-8.1986, 42.15402], [-8.18947, 42.13853], [-8.19406, 42.12141], [-8.18178, 42.06436], [-8.11729, 42.08537], [-8.08847, 42.05767], [-8.08796, 42.01398], [-8.16232, 41.9828], [-8.2185, 41.91237], [-8.19551, 41.87459], [-8.16944, 41.87944], [-8.16455, 41.81753], [-8.0961, 41.81024], [-8.01136, 41.83453], [-7.9804, 41.87337], [-7.92336, 41.8758], [-7.90707, 41.92432], [-7.88751, 41.92553], [-7.88055, 41.84571], [-7.84188, 41.88065], [-7.69848, 41.90977], [-7.65774, 41.88308], [-7.58603, 41.87944], [-7.62188, 41.83089], [-7.52737, 41.83939], [-7.49803, 41.87095], [-7.45566, 41.86488], [-7.44759, 41.84451], [-7.42854, 41.83262], [-7.42864, 41.80589], [-7.37092, 41.85031], [-7.32366, 41.8406], [-7.18677, 41.88793], [-7.18549, 41.97515], [-7.14115, 41.98855], [-7.08574, 41.97401], [-7.07596, 41.94977], [-7.01078, 41.94977], [-6.98144, 41.9728], [-6.95537, 41.96553], [-6.94396, 41.94403], [-6.82174, 41.94493], [-6.81196, 41.99097], [-6.76959, 41.98734], [-6.75004, 41.94129], [-6.61967, 41.94008], [-6.58544, 41.96674], [-6.5447, 41.94371], [-6.56752, 41.88429], [-6.51374, 41.8758], [-6.56426, 41.74219], [-6.54633, 41.68623], [-6.49907, 41.65823], [-6.44204, 41.68258], [-6.29863, 41.66432], [-6.19128, 41.57638], [-6.26777, 41.48796], [-6.3306, 41.37677], [-6.38553, 41.38655], [-6.38551, 41.35274], [-6.55937, 41.24417], [-6.65046, 41.24725], [-6.68286, 41.21641], [-6.69711, 41.1858], [-6.77319, 41.13049], [-6.75655, 41.10187], [-6.79241, 41.05397], [-6.80942, 41.03629], [-6.84781, 41.02692], [-6.88843, 41.03027], [-6.913, 41.03922], [-6.9357, 41.02888], [-6.8527, 40.93958], [-6.84292, 40.89771], [-6.80707, 40.88047], [-6.79892, 40.84842], [-6.82337, 40.84472], [-6.82826, 40.74603], [-6.79567, 40.65955], [-6.84292, 40.56801], [-6.80218, 40.55067], [-6.7973, 40.51723], [-6.84944, 40.46394], [-6.84618, 40.42177], [-6.78426, 40.36468], [-6.80218, 40.33239], [-6.86085, 40.2976], [-6.86085, 40.26776], [-7.00426, 40.23169], [-7.02544, 40.18564], [-7.00589, 40.12087], [-6.94233, 40.10716], [-6.86737, 40.01986], [-6.91463, 39.86618], [-6.97492, 39.81488], [-7.01613, 39.66877], [-7.24707, 39.66576], [-7.33507, 39.64569], [-7.54121, 39.66717], [-7.49477, 39.58794], [-7.2927, 39.45847], [-7.3149, 39.34857], [-7.23403, 39.27579], [-7.23566, 39.20132], [-7.12811, 39.17101], [-7.14929, 39.11287], [-7.10692, 39.10275], [-7.04011, 39.11919], [-6.97004, 39.07619], [-6.95211, 39.0243], [-7.051, 38.907], [-7.03848, 38.87221], [-7.26174, 38.72107], [-7.265, 38.61674], [-7.32529, 38.44336], [-7.15581, 38.27597], [-7.09389, 38.17227], [-6.93418, 38.21454], [-7.00375, 38.01914], [-7.05966, 38.01966], [-7.10366, 38.04404], [-7.12648, 38.00296], [-7.24544, 37.98884], [-7.27314, 37.90145], [-7.33441, 37.81193], [-7.41981, 37.75729], [-7.51759, 37.56119], [-7.46878, 37.47127], [-7.43974, 37.38913], [-7.43227, 37.25152], [-7.41854, 37.23813], [-7.41133, 37.20314], [-7.39769, 37.16868], [-7.37282, 36.96896], [-7.2725, 35.73269], [-5.10878, 36.05227], [-2.27707, 35.35051], [3.75438, 42.33445]], [[-5.27801, 36.14942], [-5.34064, 36.03744], [-5.40526, 36.15488], [-5.34536, 36.15501], [-5.33822, 36.15272], [-5.27801, 36.14942]]], [[[1.99838, 42.44682], [2.01564, 42.45171], [1.99216, 42.46208], [1.98579, 42.47486], [1.99766, 42.4858], [1.98916, 42.49351], [1.98022, 42.49569], [1.97697, 42.48568], [1.97227, 42.48487], [1.97003, 42.48081], [1.96215, 42.47854], [1.95606, 42.45785], [1.96125, 42.45364], [1.98378, 42.44697], [1.99838, 42.44682]]]] } },
      { type: "Feature", properties: { wikidata: "Q98059339", nameEn: "Mainland Norway", country: "NO", groups: ["154", "150", "UN"], callingCodes: ["47"] }, geometry: { type: "MultiPolygon", coordinates: [[[[10.40861, 58.38489], [10.64958, 58.89391], [11.08911, 58.98745], [11.15367, 59.07862], [11.34459, 59.11672], [11.4601, 58.99022], [11.45199, 58.89604], [11.65732, 58.90177], [11.8213, 59.24985], [11.69297, 59.59442], [11.92112, 59.69531], [11.87121, 59.86039], [12.15641, 59.8926], [12.36317, 59.99259], [12.52003, 60.13846], [12.59133, 60.50559], [12.2277, 61.02442], [12.69115, 61.06584], [12.86939, 61.35427], [12.57707, 61.56547], [12.40595, 61.57226], [12.14746, 61.7147], [12.29187, 62.25699], [12.07085, 62.6297], [12.19919, 63.00104], [11.98529, 63.27487], [12.19919, 63.47935], [12.14928, 63.59373], [12.74105, 64.02171], [13.23411, 64.09087], [13.98222, 64.00953], [14.16051, 64.18725], [14.11117, 64.46674], [13.64276, 64.58402], [14.50926, 65.31786], [14.53778, 66.12399], [15.05113, 66.15572], [15.49318, 66.28509], [15.37197, 66.48217], [16.35589, 67.06419], [16.39154, 67.21653], [16.09922, 67.4364], [16.12774, 67.52106], [16.38441, 67.52923], [16.7409, 67.91037], [17.30416, 68.11591], [17.90787, 67.96537], [18.13836, 68.20874], [18.1241, 68.53721], [18.39503, 68.58672], [18.63032, 68.50849], [18.97255, 68.52416], [19.93508, 68.35911], [20.22027, 68.48759], [19.95647, 68.55546], [20.22027, 68.67246], [20.33435, 68.80174], [20.28444, 68.93283], [20.0695, 69.04469], [20.55258, 69.06069], [20.72171, 69.11874], [21.05775, 69.0356], [21.11099, 69.10291], [20.98641, 69.18809], [21.00732, 69.22755], [21.27827, 69.31281], [21.63833, 69.27485], [22.27276, 68.89514], [22.38367, 68.71561], [22.53321, 68.74393], [23.13064, 68.64684], [23.68017, 68.70276], [23.781, 68.84514], [24.02299, 68.81601], [24.18432, 68.73936], [24.74898, 68.65143], [24.90023, 68.55579], [24.93048, 68.61102], [25.10189, 68.63307], [25.12206, 68.78684], [25.42455, 68.90328], [25.61613, 68.89602], [25.75729, 68.99383], [25.69679, 69.27039], [25.96904, 69.68397], [26.40261, 69.91377], [26.64461, 69.96565], [27.05802, 69.92069], [27.57226, 70.06215], [27.95542, 70.0965], [27.97558, 69.99671], [28.32849, 69.88605], [28.36883, 69.81658], [29.12697, 69.69193], [29.31664, 69.47994], [28.8629, 69.22395], [28.81248, 69.11997], [28.91738, 69.04774], [29.0444, 69.0119], [29.26623, 69.13794], [29.27631, 69.2811], [29.97205, 69.41623], [30.16363, 69.65244], [30.52662, 69.54699], [30.95011, 69.54699], [30.84095, 69.80584], [31.59909, 70.16571], [32.07813, 72.01005], [-11.60274, 67.73467], [7.28637, 57.35913], [10.40861, 58.38489]]]] } },
      { type: "Feature", properties: { wikidata: "Q98543636", nameEn: "Mainland Ecuador", country: "EC", groups: ["005", "419", "019", "UN"], callingCodes: ["593"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-84.52388, -3.36941], [-80.30602, -3.39149], [-80.20647, -3.431], [-80.24123, -3.46124], [-80.24586, -3.48677], [-80.23651, -3.48652], [-80.22629, -3.501], [-80.20535, -3.51667], [-80.21642, -3.5888], [-80.19848, -3.59249], [-80.18741, -3.63994], [-80.19926, -3.68894], [-80.13232, -3.90317], [-80.46386, -4.01342], [-80.4822, -4.05477], [-80.45023, -4.20938], [-80.32114, -4.21323], [-80.46386, -4.41516], [-80.39256, -4.48269], [-80.13945, -4.29786], [-79.79722, -4.47558], [-79.59402, -4.46848], [-79.26248, -4.95167], [-79.1162, -4.97774], [-79.01659, -5.01481], [-78.85149, -4.66795], [-78.68394, -4.60754], [-78.34362, -3.38633], [-78.24589, -3.39907], [-78.22642, -3.51113], [-78.14324, -3.47653], [-78.19369, -3.36431], [-77.94147, -3.05454], [-76.6324, -2.58397], [-76.05203, -2.12179], [-75.57429, -1.55961], [-75.3872, -0.9374], [-75.22862, -0.95588], [-75.22862, -0.60048], [-75.53615, -0.19213], [-75.60169, -0.18708], [-75.61997, -0.10012], [-75.40192, -0.17196], [-75.25764, -0.11943], [-75.82927, 0.09578], [-76.23441, 0.42294], [-76.41215, 0.38228], [-76.4094, 0.24015], [-76.89177, 0.24736], [-77.52001, 0.40782], [-77.49984, 0.64476], [-77.67815, 0.73863], [-77.66416, 0.81604], [-77.68613, 0.83029], [-77.7148, 0.85003], [-77.85677, 0.80197], [-78.42749, 1.15389], [-78.87137, 1.47457], [-82.12561, 4.00341], [-84.52388, -3.36941]]]] } },
      { type: "Feature", properties: { m49: "001", wikidata: "Q2", nameEn: "World", aliases: ["Earth", "Planet"], level: "world" }, geometry: null },
      { type: "Feature", properties: { m49: "002", wikidata: "Q15", nameEn: "Africa", level: "region" }, geometry: null },
      { type: "Feature", properties: { m49: "003", wikidata: "Q49", nameEn: "North America", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "005", wikidata: "Q18", nameEn: "South America", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { m49: "009", wikidata: "Q538", nameEn: "Oceania", level: "region" }, geometry: null },
      { type: "Feature", properties: { m49: "011", wikidata: "Q4412", nameEn: "Western Africa", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { m49: "013", wikidata: "Q27611", nameEn: "Central America", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { m49: "014", wikidata: "Q27407", nameEn: "Eastern Africa", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { m49: "015", wikidata: "Q27381", nameEn: "Northern Africa", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "017", wikidata: "Q27433", nameEn: "Middle Africa", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { m49: "018", wikidata: "Q27394", nameEn: "Southern Africa", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { m49: "019", wikidata: "Q828", nameEn: "Americas", level: "region" }, geometry: null },
      { type: "Feature", properties: { m49: "021", wikidata: "Q2017699", nameEn: "Northern America", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "029", wikidata: "Q664609", nameEn: "Caribbean", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { m49: "030", wikidata: "Q27231", nameEn: "Eastern Asia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "034", wikidata: "Q771405", nameEn: "Southern Asia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "035", wikidata: "Q11708", nameEn: "South-eastern Asia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "039", wikidata: "Q27449", nameEn: "Southern Europe", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "053", wikidata: "Q45256", nameEn: "Australia and New Zealand", aliases: ["Australasia"], level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "054", wikidata: "Q37394", nameEn: "Melanesia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "057", wikidata: "Q3359409", nameEn: "Micronesia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "061", wikidata: "Q35942", nameEn: "Polynesia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "142", wikidata: "Q48", nameEn: "Asia", level: "region" }, geometry: null },
      { type: "Feature", properties: { m49: "143", wikidata: "Q27275", nameEn: "Central Asia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "145", wikidata: "Q27293", nameEn: "Western Asia", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "150", wikidata: "Q46", nameEn: "Europe", level: "region" }, geometry: null },
      { type: "Feature", properties: { m49: "151", wikidata: "Q27468", nameEn: "Eastern Europe", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "154", wikidata: "Q27479", nameEn: "Northern Europe", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "155", wikidata: "Q27496", nameEn: "Western Europe", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "202", wikidata: "Q132959", nameEn: "Sub-Saharan Africa", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "419", wikidata: "Q72829598", nameEn: "Latin America and the Caribbean", level: "subregion" }, geometry: null },
      { type: "Feature", properties: { m49: "680", wikidata: "Q3405693", nameEn: "Sark", country: "GB", groups: ["GG", "830", "Q185086", "154", "150", "UN"], level: "subterritory", driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44 01481"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.36485, 49.48223], [-2.65349, 49.15373], [-2.09454, 49.46288], [-2.36485, 49.48223]]]] } },
      { type: "Feature", properties: { m49: "830", wikidata: "Q42314", nameEn: "Channel Islands", level: "intermediateRegion" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "AC", iso1A3: "ASC", wikidata: "Q46197", nameEn: "Ascension Island", aliases: ["SH-AC"], country: "GB", groups: ["SH", "BOTS", "011", "202", "002", "UN"], isoStatus: "excRes", driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["247"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-14.82771, -8.70814], [-13.33271, -8.07391], [-14.91926, -6.63386], [-14.82771, -8.70814]]]] } },
      { type: "Feature", properties: { iso1A2: "AD", iso1A3: "AND", iso1N3: "020", wikidata: "Q228", nameEn: "Andorra", groups: ["Q12837", "039", "150", "UN"], callingCodes: ["376"] }, geometry: { type: "MultiPolygon", coordinates: [[[[1.72515, 42.50338], [1.73683, 42.55492], [1.7858, 42.57698], [1.72588, 42.59098], [1.73452, 42.61515], [1.68267, 42.62533], [1.6625, 42.61982], [1.63485, 42.62957], [1.60085, 42.62703], [1.55418, 42.65669], [1.50867, 42.64483], [1.48043, 42.65203], [1.46718, 42.63296], [1.47986, 42.61346], [1.44197, 42.60217], [1.42512, 42.58292], [1.44529, 42.56722], [1.4234, 42.55959], [1.41245, 42.53539], [1.44759, 42.54431], [1.46661, 42.50949], [1.41648, 42.48315], [1.43838, 42.47848], [1.44529, 42.43724], [1.5127, 42.42959], [1.55073, 42.43299], [1.55937, 42.45808], [1.57953, 42.44957], [1.58933, 42.46275], [1.65674, 42.47125], [1.66826, 42.50779], [1.70571, 42.48867], [1.72515, 42.50338]]]] } },
      { type: "Feature", properties: { iso1A2: "AE", iso1A3: "ARE", iso1N3: "784", wikidata: "Q878", nameEn: "United Arab Emirates", groups: ["145", "142", "UN"], callingCodes: ["971"] }, geometry: { type: "MultiPolygon", coordinates: [[[[56.26534, 25.62825], [56.25341, 25.61443], [56.26636, 25.60643], [56.25365, 25.60211], [56.20473, 25.61119], [56.18363, 25.65508], [56.14826, 25.66351], [56.13579, 25.73524], [56.17416, 25.77239], [56.13963, 25.82765], [56.19334, 25.9795], [56.15498, 26.06828], [56.08666, 26.05038], [55.81777, 26.18798], [55.14145, 25.62624], [53.97892, 24.64436], [52.82259, 25.51697], [52.35509, 25.00368], [52.02277, 24.75635], [51.83108, 24.71675], [51.58834, 24.66608], [51.41644, 24.39615], [51.58871, 24.27256], [51.59617, 24.12041], [52.56622, 22.94341], [55.13599, 22.63334], [55.2137, 22.71065], [55.22634, 23.10378], [55.57358, 23.669], [55.48677, 23.94946], [55.73301, 24.05994], [55.8308, 24.01633], [56.01799, 24.07426], [55.95472, 24.2172], [55.83367, 24.20193], [55.77658, 24.23476], [55.76558, 24.23227], [55.75257, 24.23466], [55.75382, 24.2466], [55.75939, 24.26114], [55.76781, 24.26209], [55.79145, 24.27914], [55.80747, 24.31069], [55.83395, 24.32776], [55.83271, 24.41521], [55.76461, 24.5287], [55.83271, 24.68567], [55.83408, 24.77858], [55.81348, 24.80102], [55.81116, 24.9116], [55.85094, 24.96858], [55.90849, 24.96771], [55.96316, 25.00857], [56.05715, 24.95727], [56.05106, 24.87461], [55.97467, 24.89639], [55.97836, 24.87673], [56.03535, 24.81161], [56.06128, 24.74457], [56.13684, 24.73699], [56.20062, 24.78565], [56.20568, 24.85063], [56.30269, 24.88334], [56.34873, 24.93205], [56.3227, 24.97284], [56.86325, 25.03856], [56.82555, 25.7713], [56.26534, 25.62825]], [[56.26062, 25.33108], [56.3005, 25.31815], [56.3111, 25.30107], [56.35172, 25.30681], [56.34438, 25.26653], [56.27628, 25.23404], [56.24341, 25.22867], [56.20872, 25.24104], [56.20838, 25.25668], [56.24465, 25.27505], [56.25008, 25.28843], [56.23362, 25.31253], [56.26062, 25.33108]]], [[[56.28423, 25.26344], [56.29379, 25.2754], [56.28102, 25.28486], [56.2716, 25.27916], [56.27086, 25.26128], [56.28423, 25.26344]]]] } },
      { type: "Feature", properties: { iso1A2: "AF", iso1A3: "AFG", iso1N3: "004", wikidata: "Q889", nameEn: "Afghanistan", groups: ["034", "142", "UN"], callingCodes: ["93"] }, geometry: { type: "MultiPolygon", coordinates: [[[[70.61526, 38.34774], [70.60407, 38.28046], [70.54673, 38.24541], [70.4898, 38.12546], [70.17206, 37.93276], [70.1863, 37.84296], [70.27694, 37.81258], [70.28243, 37.66706], [70.15015, 37.52519], [69.95971, 37.5659], [69.93362, 37.61378], [69.84435, 37.60616], [69.80041, 37.5746], [69.51888, 37.5844], [69.44954, 37.4869], [69.36645, 37.40462], [69.45022, 37.23315], [69.39529, 37.16752], [69.25152, 37.09426], [69.03274, 37.25174], [68.96407, 37.32603], [68.88168, 37.33368], [68.91189, 37.26704], [68.80889, 37.32494], [68.81438, 37.23862], [68.6798, 37.27906], [68.61851, 37.19815], [68.41888, 37.13906], [68.41201, 37.10402], [68.29253, 37.10621], [68.27605, 37.00977], [68.18542, 37.02074], [68.02194, 36.91923], [67.87917, 37.0591], [67.7803, 37.08978], [67.78329, 37.1834], [67.51868, 37.26102], [67.2581, 37.17216], [67.2224, 37.24545], [67.13039, 37.27168], [67.08232, 37.35469], [66.95598, 37.40162], [66.64699, 37.32958], [66.55743, 37.35409], [66.30993, 37.32409], [65.72274, 37.55438], [65.64137, 37.45061], [65.64263, 37.34388], [65.51778, 37.23881], [64.97945, 37.21913], [64.61141, 36.6351], [64.62514, 36.44311], [64.57295, 36.34362], [64.43288, 36.24401], [64.05385, 36.10433], [63.98519, 36.03773], [63.56496, 35.95106], [63.53475, 35.90881], [63.29579, 35.85985], [63.12276, 35.86208], [63.10318, 35.81782], [63.23262, 35.67487], [63.10079, 35.63024], [63.12276, 35.53196], [63.0898, 35.43131], [62.90853, 35.37086], [62.74098, 35.25432], [62.62288, 35.22067], [62.48006, 35.28796], [62.29878, 35.13312], [62.29191, 35.25964], [62.15871, 35.33278], [62.05709, 35.43803], [61.97743, 35.4604], [61.77693, 35.41341], [61.58742, 35.43803], [61.27371, 35.61482], [61.18187, 35.30249], [61.0991, 35.27845], [61.12831, 35.09938], [61.06926, 34.82139], [61.00197, 34.70631], [60.99922, 34.63064], [60.72316, 34.52857], [60.91321, 34.30411], [60.66502, 34.31539], [60.50209, 34.13992], [60.5838, 33.80793], [60.5485, 33.73422], [60.57762, 33.59772], [60.69573, 33.56054], [60.91133, 33.55596], [60.88908, 33.50219], [60.56485, 33.12944], [60.86191, 32.22565], [60.84541, 31.49561], [61.70929, 31.37391], [61.80569, 31.16167], [61.80957, 31.12576], [61.83257, 31.0452], [61.8335, 30.97669], [61.78268, 30.92724], [61.80829, 30.84224], [60.87231, 29.86514], [62.47751, 29.40782], [63.5876, 29.50456], [64.12966, 29.39157], [64.19796, 29.50407], [64.62116, 29.58903], [65.04005, 29.53957], [66.24175, 29.85181], [66.36042, 29.9583], [66.23609, 30.06321], [66.34869, 30.404], [66.28413, 30.57001], [66.39194, 30.9408], [66.42645, 30.95309], [66.58175, 30.97532], [66.68166, 31.07597], [66.72561, 31.20526], [66.83273, 31.26867], [67.04147, 31.31561], [67.03323, 31.24519], [67.29964, 31.19586], [67.78854, 31.33203], [67.7748, 31.4188], [67.62374, 31.40473], [67.58323, 31.52772], [67.72056, 31.52304], [67.86887, 31.63536], [68.00071, 31.6564], [68.1655, 31.82691], [68.25614, 31.80357], [68.27605, 31.75863], [68.44222, 31.76446], [68.57475, 31.83158], [68.6956, 31.75687], [68.79997, 31.61665], [68.91078, 31.59687], [68.95995, 31.64822], [69.00939, 31.62249], [69.11514, 31.70782], [69.20577, 31.85957], [69.3225, 31.93186], [69.27032, 32.14141], [69.27932, 32.29119], [69.23599, 32.45946], [69.2868, 32.53938], [69.38155, 32.56601], [69.44747, 32.6678], [69.43649, 32.7302], [69.38018, 32.76601], [69.47082, 32.85834], [69.5436, 32.8768], [69.49854, 32.88843], [69.49004, 33.01509], [69.57656, 33.09911], [69.71526, 33.09911], [69.79766, 33.13247], [69.85259, 33.09451], [70.02563, 33.14282], [70.07369, 33.22557], [70.13686, 33.21064], [70.32775, 33.34496], [70.17062, 33.53535], [70.20141, 33.64387], [70.14785, 33.6553], [70.14236, 33.71701], [70.00503, 33.73528], [69.85671, 33.93719], [69.87307, 33.9689], [69.90203, 34.04194], [70.54336, 33.9463], [70.88119, 33.97933], [71.07345, 34.06242], [71.06933, 34.10564], [71.09307, 34.11961], [71.09453, 34.13524], [71.13078, 34.16503], [71.12815, 34.26619], [71.17662, 34.36769], [71.02401, 34.44835], [71.0089, 34.54568], [71.11602, 34.63047], [71.08718, 34.69034], [71.28356, 34.80882], [71.29472, 34.87728], [71.50329, 34.97328], [71.49917, 35.00478], [71.55273, 35.02615], [71.52938, 35.09023], [71.67495, 35.21262], [71.5541, 35.28776], [71.54294, 35.31037], [71.65435, 35.4479], [71.49917, 35.6267], [71.55273, 35.71483], [71.37969, 35.95865], [71.19505, 36.04134], [71.60491, 36.39429], [71.80267, 36.49924], [72.18135, 36.71838], [72.6323, 36.84601], [73.82685, 36.91421], [74.04856, 36.82648], [74.43389, 37.00977], [74.53739, 36.96224], [74.56453, 37.03023], [74.49981, 37.24518], [74.80605, 37.21565], [74.88887, 37.23275], [74.8294, 37.3435], [74.68383, 37.3948], [74.56161, 37.37734], [74.41055, 37.3948], [74.23339, 37.41116], [74.20308, 37.34208], [73.8564, 37.26158], [73.82552, 37.22659], [73.64974, 37.23643], [73.61129, 37.27469], [73.76647, 37.33913], [73.77197, 37.4417], [73.29633, 37.46495], [73.06884, 37.31729], [72.79693, 37.22222], [72.66381, 37.02014], [72.54095, 37.00007], [72.31676, 36.98115], [71.83229, 36.68084], [71.67083, 36.67346], [71.57195, 36.74943], [71.51502, 36.89128], [71.48481, 36.93218], [71.46923, 36.99925], [71.45578, 37.03094], [71.43097, 37.05855], [71.44127, 37.11856], [71.4494, 37.18137], [71.4555, 37.21418], [71.47386, 37.2269], [71.48339, 37.23937], [71.4824, 37.24921], [71.48536, 37.26017], [71.50674, 37.31502], [71.49821, 37.31975], [71.4862, 37.33405], [71.47685, 37.40281], [71.49612, 37.4279], [71.5256, 37.47971], [71.50616, 37.50733], [71.49693, 37.53527], [71.5065, 37.60912], [71.51972, 37.61945], [71.54186, 37.69691], [71.55234, 37.73209], [71.53053, 37.76534], [71.54324, 37.77104], [71.55752, 37.78677], [71.59255, 37.79956], [71.58843, 37.92425], [71.51565, 37.95349], [71.32871, 37.88564], [71.296, 37.93403], [71.2809, 37.91995], [71.24969, 37.93031], [71.27278, 37.96496], [71.27622, 37.99946], [71.28922, 38.01272], [71.29878, 38.04429], [71.36444, 38.15358], [71.37803, 38.25641], [71.33869, 38.27335], [71.33114, 38.30339], [71.21291, 38.32797], [71.1451, 38.40106], [71.10957, 38.40671], [71.10592, 38.42077], [71.09542, 38.42517], [71.0556, 38.40176], [71.03545, 38.44779], [70.98693, 38.48862], [70.92728, 38.43021], [70.88719, 38.46826], [70.84376, 38.44688], [70.82538, 38.45394], [70.81697, 38.44507], [70.80521, 38.44447], [70.79766, 38.44944], [70.78702, 38.45031], [70.78581, 38.45502], [70.77132, 38.45548], [70.75455, 38.4252], [70.72485, 38.4131], [70.69807, 38.41861], [70.67438, 38.40597], [70.6761, 38.39144], [70.69189, 38.37031], [70.64966, 38.34999], [70.61526, 38.34774]]]] } },
      { type: "Feature", properties: { iso1A2: "AG", iso1A3: "ATG", iso1N3: "028", wikidata: "Q781", nameEn: "Antigua and Barbuda", groups: ["029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 268"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-61.66959, 18.6782], [-62.58307, 16.68909], [-62.1023, 16.97277], [-61.23098, 16.62484], [-61.66959, 18.6782]]]] } },
      { type: "Feature", properties: { iso1A2: "AI", iso1A3: "AIA", iso1N3: "660", wikidata: "Q25228", nameEn: "Anguilla", country: "GB", groups: ["BOTS", "029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 264"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-63.79029, 19.11219], [-63.35989, 18.06012], [-62.62718, 18.26185], [-63.79029, 19.11219]]]] } },
      { type: "Feature", properties: { iso1A2: "AL", iso1A3: "ALB", iso1N3: "008", wikidata: "Q222", nameEn: "Albania", groups: ["039", "150", "UN"], callingCodes: ["355"] }, geometry: { type: "MultiPolygon", coordinates: [[[[20.07761, 42.55582], [20.01834, 42.54622], [20.00842, 42.5109], [19.9324, 42.51699], [19.82333, 42.46581], [19.76549, 42.50237], [19.74731, 42.57422], [19.77375, 42.58517], [19.73244, 42.66299], [19.65972, 42.62774], [19.4836, 42.40831], [19.42352, 42.36546], [19.42, 42.33019], [19.28623, 42.17745], [19.40687, 42.10024], [19.37548, 42.06835], [19.36867, 42.02564], [19.37691, 41.96977], [19.34601, 41.95675], [19.33812, 41.90669], [19.37451, 41.8842], [19.37597, 41.84849], [19.26406, 41.74971], [19.0384, 40.35325], [19.95905, 39.82857], [19.97622, 39.78684], [19.92466, 39.69533], [19.98042, 39.6504], [20.00957, 39.69227], [20.05189, 39.69112], [20.12956, 39.65805], [20.15988, 39.652], [20.22376, 39.64532], [20.22707, 39.67459], [20.27412, 39.69884], [20.31961, 39.72799], [20.29152, 39.80421], [20.30804, 39.81563], [20.38572, 39.78516], [20.41475, 39.81437], [20.41546, 39.82832], [20.31135, 39.99438], [20.37911, 39.99058], [20.42373, 40.06777], [20.48487, 40.06271], [20.51297, 40.08168], [20.55593, 40.06524], [20.61081, 40.07866], [20.62566, 40.0897], [20.67162, 40.09433], [20.71789, 40.27739], [20.78234, 40.35803], [20.7906, 40.42726], [20.83688, 40.47882], [20.94925, 40.46625], [20.96908, 40.51526], [21.03932, 40.56299], [21.05833, 40.66586], [20.98134, 40.76046], [20.95752, 40.76982], [20.98396, 40.79109], [20.97887, 40.85475], [20.97693, 40.90103], [20.94305, 40.92399], [20.83671, 40.92752], [20.81567, 40.89662], [20.73504, 40.9081], [20.71634, 40.91781], [20.65558, 41.08009], [20.63454, 41.0889], [20.59832, 41.09066], [20.58546, 41.11179], [20.59715, 41.13644], [20.51068, 41.2323], [20.49432, 41.33679], [20.52119, 41.34381], [20.55976, 41.4087], [20.51301, 41.442], [20.49039, 41.49277], [20.45331, 41.51436], [20.45809, 41.5549], [20.52103, 41.56473], [20.55508, 41.58113], [20.51769, 41.65975], [20.52937, 41.69292], [20.51301, 41.72433], [20.53405, 41.78099], [20.57144, 41.7897], [20.55976, 41.87068], [20.59524, 41.8818], [20.57946, 41.91593], [20.63069, 41.94913], [20.59434, 42.03879], [20.55633, 42.08173], [20.56955, 42.12097], [20.48857, 42.25444], [20.3819, 42.3029], [20.34479, 42.32656], [20.24399, 42.32168], [20.21797, 42.41237], [20.17127, 42.50469], [20.07761, 42.55582]]]] } },
      { type: "Feature", properties: { iso1A2: "AM", iso1A3: "ARM", iso1N3: "051", wikidata: "Q399", nameEn: "Armenia", groups: ["145", "142", "UN"], callingCodes: ["374"] }, geometry: { type: "MultiPolygon", coordinates: [[[[45.0133, 41.29747], [44.93493, 41.25685], [44.81437, 41.30371], [44.80053, 41.25949], [44.81749, 41.23488], [44.84358, 41.23088], [44.89911, 41.21366], [44.87887, 41.20195], [44.82084, 41.21513], [44.72814, 41.20338], [44.61462, 41.24018], [44.59322, 41.1933], [44.46791, 41.18204], [44.34417, 41.2382], [44.34337, 41.20312], [44.32139, 41.2079], [44.18148, 41.24644], [44.16591, 41.19141], [43.84835, 41.16329], [43.74717, 41.1117], [43.67712, 41.13398], [43.4717, 41.12611], [43.44984, 41.0988], [43.47319, 41.02251], [43.58683, 40.98961], [43.67712, 40.93084], [43.67712, 40.84846], [43.74872, 40.7365], [43.7425, 40.66805], [43.63664, 40.54159], [43.54791, 40.47413], [43.60862, 40.43267], [43.59928, 40.34019], [43.71136, 40.16673], [43.65221, 40.14889], [43.65688, 40.11199], [43.92307, 40.01787], [44.1057, 40.03555], [44.1778, 40.02845], [44.26973, 40.04866], [44.46635, 39.97733], [44.61845, 39.8281], [44.75779, 39.7148], [44.88354, 39.74432], [44.92869, 39.72157], [45.06604, 39.79277], [45.18554, 39.67846], [45.17464, 39.58614], [45.21784, 39.58074], [45.23535, 39.61373], [45.30385, 39.61373], [45.29606, 39.57654], [45.46992, 39.49888], [45.70547, 39.60174], [45.80804, 39.56716], [45.83, 39.46487], [45.79225, 39.3695], [45.99774, 39.28931], [46.02303, 39.09978], [46.06973, 39.0744], [46.14785, 38.84206], [46.20601, 38.85262], [46.34059, 38.92076], [46.53497, 38.86548], [46.51805, 38.94982], [46.54296, 39.07078], [46.44022, 39.19636], [46.52584, 39.18912], [46.54141, 39.15895], [46.58032, 39.21204], [46.63481, 39.23013], [46.56476, 39.24942], [46.50093, 39.33736], [46.43244, 39.35181], [46.37795, 39.42039], [46.4013, 39.45405], [46.53051, 39.47809], [46.51027, 39.52373], [46.57721, 39.54414], [46.57098, 39.56694], [46.52117, 39.58734], [46.42465, 39.57534], [46.40286, 39.63651], [46.18493, 39.60533], [45.96543, 39.78859], [45.82533, 39.82925], [45.7833, 39.9475], [45.60895, 39.97733], [45.59806, 40.0131], [45.78642, 40.03218], [45.83779, 39.98925], [45.97944, 40.181], [45.95609, 40.27846], [45.65098, 40.37696], [45.42994, 40.53804], [45.45484, 40.57707], [45.35366, 40.65979], [45.4206, 40.7424], [45.55914, 40.78366], [45.60584, 40.87436], [45.40814, 40.97904], [45.44083, 41.01663], [45.39725, 41.02603], [45.35677, 40.99784], [45.28859, 41.03757], [45.26162, 41.0228], [45.25897, 41.0027], [45.1994, 41.04518], [45.16493, 41.05068], [45.1634, 41.08082], [45.1313, 41.09369], [45.12923, 41.06059], [45.06784, 41.05379], [45.08028, 41.10917], [45.19942, 41.13299], [45.1969, 41.168], [45.11811, 41.19967], [45.05201, 41.19211], [45.02932, 41.2101], [45.05497, 41.2464], [45.0133, 41.29747]], [[45.21324, 40.9817], [45.21219, 40.99001], [45.20518, 40.99348], [45.19312, 40.98998], [45.18382, 41.0066], [45.20625, 41.01484], [45.23487, 41.00226], [45.23095, 40.97828], [45.21324, 40.9817]], [[45.00864, 41.03411], [44.9903, 41.05657], [44.96031, 41.06345], [44.95383, 41.07553], [44.97169, 41.09176], [45.00864, 41.09407], [45.03406, 41.07931], [45.04517, 41.06653], [45.03792, 41.03938], [45.00864, 41.03411]]], [[[45.50279, 40.58424], [45.56071, 40.64765], [45.51825, 40.67382], [45.47927, 40.65023], [45.50279, 40.58424]]]] } },
      { type: "Feature", properties: { iso1A2: "AO", iso1A3: "AGO", iso1N3: "024", wikidata: "Q916", nameEn: "Angola", groups: ["017", "202", "002", "UN"], callingCodes: ["244"] }, geometry: { type: "MultiPolygon", coordinates: [[[[16.55507, -5.85631], [13.04371, -5.87078], [12.42245, -6.07585], [11.95767, -5.94705], [12.20376, -5.76338], [12.26557, -5.74031], [12.52318, -5.74353], [12.52301, -5.17481], [12.53599, -5.1618], [12.53586, -5.14658], [12.51589, -5.1332], [12.49815, -5.14058], [12.46297, -5.09408], [12.60251, -5.01715], [12.63465, -4.94632], [12.70868, -4.95505], [12.8733, -4.74346], [13.11195, -4.67745], [13.09648, -4.63739], [12.91489, -4.47907], [12.87096, -4.40315], [12.76844, -4.38709], [12.64835, -4.55937], [12.40964, -4.60609], [12.32324, -4.78415], [12.25587, -4.79437], [12.20901, -4.75642], [12.16068, -4.90089], [12.00924, -5.02627], [11.50888, -5.33417], [10.5065, -17.25284], [11.75063, -17.25013], [12.07076, -17.15165], [12.52111, -17.24495], [12.97145, -16.98567], [13.36212, -16.98048], [13.95896, -17.43141], [14.28743, -17.38814], [18.39229, -17.38927], [18.84226, -17.80375], [21.14283, -17.94318], [21.42741, -18.02787], [23.47474, -17.62877], [23.20038, -17.47563], [22.17217, -16.50269], [22.00323, -16.18028], [21.97988, -13.00148], [24.03339, -12.99091], [23.90937, -12.844], [24.06672, -12.29058], [23.98804, -12.13149], [24.02603, -11.15368], [24.00027, -10.89356], [23.86868, -11.02856], [23.45631, -10.946], [23.16602, -11.10577], [22.54205, -11.05784], [22.25951, -11.24911], [22.17954, -10.85884], [22.32604, -10.76291], [22.19039, -9.94628], [21.84856, -9.59871], [21.79824, -7.29628], [20.56263, -7.28566], [20.61689, -6.90876], [20.31846, -6.91953], [20.30218, -6.98955], [19.5469, -7.00195], [19.33698, -7.99743], [18.33635, -8.00126], [17.5828, -8.13784], [16.96282, -7.21787], [16.55507, -5.85631]]]] } },
      { type: "Feature", properties: { iso1A2: "AQ", iso1A3: "ATA", iso1N3: "010", wikidata: "Q51", nameEn: "Antarctica", level: "region", callingCodes: ["672"] }, geometry: { type: "MultiPolygon", coordinates: [[[[180, -60], [-180, -60], [-180, -90], [180, -90], [180, -60]]]] } },
      { type: "Feature", properties: { iso1A2: "AR", iso1A3: "ARG", iso1N3: "032", wikidata: "Q414", nameEn: "Argentina", aliases: ["RA"], groups: ["005", "419", "019", "UN"], callingCodes: ["54"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-72.31343, -50.58411], [-72.33873, -51.59954], [-71.99889, -51.98018], [-69.97824, -52.00845], [-68.41683, -52.33516], [-68.60702, -52.65781], [-68.60733, -54.9125], [-68.01394, -54.8753], [-67.46182, -54.92205], [-67.11046, -54.94199], [-66.07313, -55.19618], [-63.67376, -55.11859], [-54.78916, -36.21945], [-57.83001, -34.69099], [-58.34425, -34.15035], [-58.44442, -33.84033], [-58.40475, -33.11777], [-58.1224, -32.98842], [-58.22362, -32.52416], [-58.10036, -32.25338], [-58.20252, -31.86966], [-58.00076, -31.65016], [-58.0023, -31.53084], [-58.07569, -31.44916], [-57.98127, -31.3872], [-57.9908, -31.34924], [-57.86729, -31.06352], [-57.89476, -30.95994], [-57.8024, -30.77193], [-57.89115, -30.49572], [-57.64859, -30.35095], [-57.61478, -30.25165], [-57.65132, -30.19229], [-57.09386, -29.74211], [-56.81251, -29.48154], [-56.62789, -29.18073], [-56.57295, -29.11357], [-56.54171, -29.11447], [-56.05265, -28.62651], [-56.00458, -28.60421], [-56.01729, -28.51223], [-55.65418, -28.18304], [-55.6262, -28.17124], [-55.33303, -27.94661], [-55.16872, -27.86224], [-55.1349, -27.89759], [-54.90805, -27.73149], [-54.90159, -27.63132], [-54.67657, -27.57214], [-54.50416, -27.48232], [-54.41888, -27.40882], [-54.19268, -27.30751], [-54.19062, -27.27639], [-54.15978, -27.2889], [-53.80144, -27.09844], [-53.73372, -26.6131], [-53.68269, -26.33359], [-53.64505, -26.28089], [-53.64186, -26.25976], [-53.64632, -26.24798], [-53.63881, -26.25075], [-53.63739, -26.2496], [-53.65237, -26.23289], [-53.65018, -26.19501], [-53.73968, -26.10012], [-53.73391, -26.07006], [-53.7264, -26.0664], [-53.73086, -26.05842], [-53.73511, -26.04211], [-53.83691, -25.94849], [-53.90831, -25.55513], [-54.52926, -25.62846], [-54.5502, -25.58915], [-54.59398, -25.59224], [-54.62063, -25.91213], [-54.60664, -25.9691], [-54.67359, -25.98607], [-54.69333, -26.37705], [-54.70732, -26.45099], [-54.80868, -26.55669], [-55.00584, -26.78754], [-55.06351, -26.80195], [-55.16948, -26.96068], [-55.25243, -26.93808], [-55.39611, -26.97679], [-55.62322, -27.1941], [-55.59094, -27.32444], [-55.74475, -27.44485], [-55.89195, -27.3467], [-56.18313, -27.29851], [-56.85337, -27.5165], [-58.04205, -27.2387], [-58.59549, -27.29973], [-58.65321, -27.14028], [-58.3198, -26.83443], [-58.1188, -26.16704], [-57.87176, -25.93604], [-57.57431, -25.47269], [-57.80821, -25.13863], [-58.25492, -24.92528], [-58.33055, -24.97099], [-59.33886, -24.49935], [-59.45482, -24.34787], [-60.03367, -24.00701], [-60.28163, -24.04436], [-60.99754, -23.80934], [-61.0782, -23.62932], [-61.9756, -23.0507], [-62.22768, -22.55807], [-62.51761, -22.37684], [-62.64455, -22.25091], [-62.8078, -22.12534], [-62.81124, -21.9987], [-63.66482, -21.99918], [-63.68113, -22.0544], [-63.70963, -21.99934], [-63.93287, -21.99934], [-64.22918, -22.55807], [-64.31489, -22.88824], [-64.35108, -22.73282], [-64.4176, -22.67692], [-64.58888, -22.25035], [-64.67174, -22.18957], [-64.90014, -22.12136], [-64.99524, -22.08255], [-65.47435, -22.08908], [-65.57743, -22.07675], [-65.58694, -22.09794], [-65.61166, -22.09504], [-65.7467, -22.10105], [-65.9261, -21.93335], [-66.04832, -21.9187], [-66.03836, -21.84829], [-66.24077, -21.77837], [-66.29714, -22.08741], [-66.7298, -22.23644], [-67.18382, -22.81525], [-66.99632, -22.99839], [-67.33563, -24.04237], [-68.24825, -24.42596], [-68.56909, -24.69831], [-68.38372, -25.08636], [-68.57622, -25.32505], [-68.38372, -26.15353], [-68.56909, -26.28146], [-68.59048, -26.49861], [-68.27677, -26.90626], [-68.43363, -27.08414], [-68.77586, -27.16029], [-69.22504, -27.95042], [-69.66709, -28.44055], [-69.80969, -29.07185], [-69.99507, -29.28351], [-69.8596, -30.26131], [-70.14479, -30.36595], [-70.55832, -31.51559], [-69.88099, -33.34489], [-69.87386, -34.13344], [-70.49416, -35.24145], [-70.38008, -36.02375], [-70.95047, -36.4321], [-71.24279, -37.20264], [-70.89532, -38.6923], [-71.37826, -38.91474], [-71.92726, -40.72714], [-71.74901, -42.11711], [-72.15541, -42.15941], [-72.14828, -42.85321], [-71.64206, -43.64774], [-71.81318, -44.38097], [-71.16436, -44.46244], [-71.26418, -44.75684], [-72.06985, -44.81756], [-71.35687, -45.22075], [-71.75614, -45.61611], [-71.68577, -46.55385], [-71.94152, -47.13595], [-72.50478, -47.80586], [-72.27662, -48.28727], [-72.54042, -48.52392], [-72.56894, -48.81116], [-73.09655, -49.14342], [-73.45156, -49.79461], [-73.55259, -49.92488], [-73.15765, -50.78337], [-72.31343, -50.58411]]]] } },
      { type: "Feature", properties: { iso1A2: "AS", iso1A3: "ASM", iso1N3: "016", wikidata: "Q16641", nameEn: "American Samoa", aliases: ["US-AS"], country: "US", groups: ["Q1352230", "061", "009", "UN"], roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1 684"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-171.39864, -10.21587], [-170.99605, -15.1275], [-166.32598, -15.26169], [-171.39864, -10.21587]]]] } },
      { type: "Feature", properties: { iso1A2: "AT", iso1A3: "AUT", iso1N3: "040", wikidata: "Q40", nameEn: "Austria", groups: ["EU", "155", "150", "UN"], callingCodes: ["43"] }, geometry: { type: "MultiPolygon", coordinates: [[[[15.34823, 48.98444], [15.28305, 48.98831], [15.26177, 48.95766], [15.16358, 48.94278], [15.15534, 48.99056], [14.99878, 49.01444], [14.97612, 48.96983], [14.98917, 48.90082], [14.95072, 48.79101], [14.98032, 48.77959], [14.9782, 48.7766], [14.98112, 48.77524], [14.9758, 48.76857], [14.95641, 48.75915], [14.94773, 48.76268], [14.81545, 48.7874], [14.80821, 48.77711], [14.80584, 48.73489], [14.72756, 48.69502], [14.71794, 48.59794], [14.66762, 48.58215], [14.60808, 48.62881], [14.56139, 48.60429], [14.4587, 48.64695], [14.43076, 48.58855], [14.33909, 48.55852], [14.20691, 48.5898], [14.09104, 48.5943], [14.01482, 48.63788], [14.06151, 48.66873], [13.84023, 48.76988], [13.82266, 48.75544], [13.81863, 48.73257], [13.79337, 48.71375], [13.81791, 48.69832], [13.81283, 48.68426], [13.81901, 48.6761], [13.82609, 48.62345], [13.80038, 48.59487], [13.80519, 48.58026], [13.76921, 48.55324], [13.7513, 48.5624], [13.74816, 48.53058], [13.72802, 48.51208], [13.66113, 48.53558], [13.65186, 48.55092], [13.62508, 48.55501], [13.59705, 48.57013], [13.57535, 48.55912], [13.51291, 48.59023], [13.50131, 48.58091], [13.50663, 48.57506], [13.46967, 48.55157], [13.45214, 48.56472], [13.43695, 48.55776], [13.45727, 48.51092], [13.42527, 48.45711], [13.43929, 48.43386], [13.40709, 48.37292], [13.30897, 48.31575], [13.26039, 48.29422], [13.18093, 48.29577], [13.126, 48.27867], [13.0851, 48.27711], [13.02083, 48.25689], [12.95306, 48.20629], [12.87126, 48.20318], [12.84475, 48.16556], [12.836, 48.1647], [12.8362, 48.15876], [12.82673, 48.15245], [12.80676, 48.14979], [12.78595, 48.12445], [12.7617, 48.12796], [12.74973, 48.10885], [12.76141, 48.07373], [12.8549, 48.01122], [12.87476, 47.96195], [12.91683, 47.95647], [12.9211, 47.95135], [12.91985, 47.94069], [12.92668, 47.93879], [12.93419, 47.94063], [12.93642, 47.94436], [12.93886, 47.94046], [12.94163, 47.92927], [13.00588, 47.84374], [12.98543, 47.82896], [12.96311, 47.79957], [12.93202, 47.77302], [12.94371, 47.76281], [12.9353, 47.74788], [12.91711, 47.74026], [12.90274, 47.72513], [12.91333, 47.7178], [12.92969, 47.71094], [12.98578, 47.7078], [13.01382, 47.72116], [13.07692, 47.68814], [13.09562, 47.63304], [13.06407, 47.60075], [13.06641, 47.58577], [13.04537, 47.58183], [13.05355, 47.56291], [13.03252, 47.53373], [13.04537, 47.49426], [12.9998, 47.46267], [12.98344, 47.48716], [12.9624, 47.47452], [12.85256, 47.52741], [12.84672, 47.54556], [12.80699, 47.54477], [12.77427, 47.58025], [12.82101, 47.61493], [12.76492, 47.64485], [12.77777, 47.66689], [12.7357, 47.6787], [12.6071, 47.6741], [12.57438, 47.63238], [12.53816, 47.63553], [12.50076, 47.62293], [12.44117, 47.6741], [12.43883, 47.6977], [12.37222, 47.68433], [12.336, 47.69534], [12.27991, 47.68827], [12.26004, 47.67725], [12.24017, 47.69534], [12.26238, 47.73544], [12.2542, 47.7433], [12.22571, 47.71776], [12.18303, 47.70065], [12.16217, 47.70105], [12.16769, 47.68167], [12.18347, 47.66663], [12.18507, 47.65984], [12.19895, 47.64085], [12.20801, 47.61082], [12.20398, 47.60667], [12.18568, 47.6049], [12.17737, 47.60121], [12.18145, 47.61019], [12.17824, 47.61506], [12.13734, 47.60639], [12.05788, 47.61742], [12.02282, 47.61033], [12.0088, 47.62451], [11.85572, 47.60166], [11.84052, 47.58354], [11.63934, 47.59202], [11.60681, 47.57881], [11.58811, 47.55515], [11.58578, 47.52281], [11.52618, 47.50939], [11.4362, 47.51413], [11.38128, 47.47465], [11.4175, 47.44621], [11.33804, 47.44937], [11.29597, 47.42566], [11.27844, 47.39956], [11.22002, 47.3964], [11.25157, 47.43277], [11.20482, 47.43198], [11.12536, 47.41222], [11.11835, 47.39719], [10.97111, 47.39561], [10.97111, 47.41617], [10.98513, 47.42882], [10.92437, 47.46991], [10.93839, 47.48018], [10.90918, 47.48571], [10.87061, 47.4786], [10.86945, 47.5015], [10.91268, 47.51334], [10.88814, 47.53701], [10.77596, 47.51729], [10.7596, 47.53228], [10.6965, 47.54253], [10.68832, 47.55752], [10.63456, 47.5591], [10.60337, 47.56755], [10.56912, 47.53584], [10.48849, 47.54057], [10.47329, 47.58552], [10.43473, 47.58394], [10.44992, 47.5524], [10.4324, 47.50111], [10.44291, 47.48453], [10.46278, 47.47901], [10.47446, 47.43318], [10.4359, 47.41183], [10.4324, 47.38494], [10.39851, 47.37623], [10.33424, 47.30813], [10.23257, 47.27088], [10.17531, 47.27167], [10.17648, 47.29149], [10.2147, 47.31014], [10.19998, 47.32832], [10.23757, 47.37609], [10.22774, 47.38904], [10.2127, 47.38019], [10.17648, 47.38889], [10.16362, 47.36674], [10.11805, 47.37228], [10.09819, 47.35724], [10.06897, 47.40709], [10.1052, 47.4316], [10.09001, 47.46005], [10.07131, 47.45531], [10.03859, 47.48927], [10.00003, 47.48216], [9.96029, 47.53899], [9.92407, 47.53111], [9.87733, 47.54688], [9.87499, 47.52953], [9.8189, 47.54688], [9.82591, 47.58158], [9.80254, 47.59419], [9.76748, 47.5934], [9.72736, 47.53457], [9.55125, 47.53629], [9.56312, 47.49495], [9.58208, 47.48344], [9.59482, 47.46305], [9.60205, 47.46165], [9.60484, 47.46358], [9.60841, 47.47178], [9.62158, 47.45858], [9.62475, 47.45685], [9.6423, 47.45599], [9.65728, 47.45383], [9.65863, 47.44847], [9.64483, 47.43842], [9.6446, 47.43233], [9.65043, 47.41937], [9.65136, 47.40504], [9.6629, 47.39591], [9.67334, 47.39191], [9.67445, 47.38429], [9.6711, 47.37824], [9.66243, 47.37136], [9.65427, 47.36824], [9.62476, 47.36639], [9.59978, 47.34671], [9.58513, 47.31334], [9.55857, 47.29919], [9.54773, 47.2809], [9.53116, 47.27029], [9.56766, 47.24281], [9.55176, 47.22585], [9.56981, 47.21926], [9.58264, 47.20673], [9.56539, 47.17124], [9.62623, 47.14685], [9.63395, 47.08443], [9.61216, 47.07732], [9.60717, 47.06091], [9.87935, 47.01337], [9.88266, 46.93343], [9.98058, 46.91434], [10.10715, 46.84296], [10.22675, 46.86942], [10.24128, 46.93147], [10.30031, 46.92093], [10.36933, 47.00212], [10.48376, 46.93891], [10.47197, 46.85698], [10.54783, 46.84505], [10.66405, 46.87614], [10.75753, 46.82258], [10.72974, 46.78972], [11.00764, 46.76896], [11.10618, 46.92966], [11.33355, 46.99862], [11.50739, 47.00644], [11.74789, 46.98484], [12.19254, 47.09331], [12.21781, 47.03996], [12.11675, 47.01241], [12.2006, 46.88854], [12.27591, 46.88651], [12.38708, 46.71529], [12.59992, 46.6595], [12.94445, 46.60401], [13.27627, 46.56059], [13.64088, 46.53438], [13.7148, 46.5222], [13.89837, 46.52331], [14.00422, 46.48474], [14.04002, 46.49117], [14.12097, 46.47724], [14.15989, 46.43327], [14.28326, 46.44315], [14.314, 46.43327], [14.42608, 46.44614], [14.45877, 46.41717], [14.52176, 46.42617], [14.56463, 46.37208], [14.5942, 46.43434], [14.66892, 46.44936], [14.72185, 46.49974], [14.81836, 46.51046], [14.83549, 46.56614], [14.86419, 46.59411], [14.87129, 46.61], [14.92283, 46.60848], [14.96002, 46.63459], [14.98024, 46.6009], [15.01451, 46.641], [15.14215, 46.66131], [15.23711, 46.63994], [15.41235, 46.65556], [15.45514, 46.63697], [15.46906, 46.61321], [15.54431, 46.6312], [15.55333, 46.64988], [15.54533, 46.66985], [15.59826, 46.68908], [15.62317, 46.67947], [15.63255, 46.68069], [15.6365, 46.6894], [15.6543, 46.69228], [15.6543, 46.70616], [15.67411, 46.70735], [15.69523, 46.69823], [15.72279, 46.69548], [15.73823, 46.70011], [15.76771, 46.69863], [15.78518, 46.70712], [15.8162, 46.71897], [15.87691, 46.7211], [15.94864, 46.68769], [15.98512, 46.68463], [15.99988, 46.67947], [16.04036, 46.6549], [16.04347, 46.68694], [16.02808, 46.71094], [15.99769, 46.7266], [15.98432, 46.74991], [15.99126, 46.78199], [15.99054, 46.82772], [16.05786, 46.83927], [16.10983, 46.867], [16.19904, 46.94134], [16.22403, 46.939], [16.27594, 46.9643], [16.28202, 47.00159], [16.51369, 47.00084], [16.43936, 47.03548], [16.52176, 47.05747], [16.46134, 47.09395], [16.52863, 47.13974], [16.44932, 47.14418], [16.46442, 47.16845], [16.4523, 47.18812], [16.42801, 47.18422], [16.41739, 47.20649], [16.43663, 47.21127], [16.44142, 47.25079], [16.47782, 47.25918], [16.45104, 47.41181], [16.49908, 47.39416], [16.52414, 47.41007], [16.57152, 47.40868], [16.6718, 47.46139], [16.64821, 47.50155], [16.71059, 47.52692], [16.64193, 47.63114], [16.58699, 47.61772], [16.4222, 47.66537], [16.55129, 47.72268], [16.53514, 47.73837], [16.54779, 47.75074], [16.61183, 47.76171], [16.65679, 47.74197], [16.72089, 47.73469], [16.7511, 47.67878], [16.82938, 47.68432], [16.86509, 47.72268], [16.87538, 47.68895], [17.08893, 47.70928], [17.05048, 47.79377], [17.07039, 47.81129], [17.00997, 47.86245], [17.08275, 47.87719], [17.11022, 47.92461], [17.09786, 47.97336], [17.16001, 48.00636], [17.07039, 48.0317], [17.09168, 48.09366], [17.05735, 48.14179], [17.02919, 48.13996], [16.97701, 48.17385], [16.89461, 48.31332], [16.90903, 48.32519], [16.84243, 48.35258], [16.83317, 48.38138], [16.83588, 48.3844], [16.8497, 48.38321], [16.85204, 48.44968], [16.94611, 48.53614], [16.93955, 48.60371], [16.90354, 48.71541], [16.79779, 48.70998], [16.71883, 48.73806], [16.68518, 48.7281], [16.67008, 48.77699], [16.46134, 48.80865], [16.40915, 48.74576], [16.37345, 48.729], [16.06034, 48.75436], [15.84404, 48.86921], [15.78087, 48.87644], [15.75341, 48.8516], [15.6921, 48.85973], [15.61622, 48.89541], [15.51357, 48.91549], [15.48027, 48.94481], [15.34823, 48.98444]]]] } },
      { type: "Feature", properties: { iso1A2: "AU", iso1A3: "AUS", iso1N3: "036", wikidata: "Q408", nameEn: "Australia" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "AW", iso1A3: "ABW", iso1N3: "533", wikidata: "Q21203", nameEn: "Aruba", aliases: ["NL-AW"], country: "NL", groups: ["Q1451600", "029", "003", "419", "019", "UN"], callingCodes: ["297"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-70.00823, 12.98375], [-70.35625, 12.58277], [-69.60231, 12.17], [-70.00823, 12.98375]]]] } },
      { type: "Feature", properties: { iso1A2: "AX", iso1A3: "ALA", iso1N3: "248", wikidata: "Q5689", nameEn: "\xC5land Islands", country: "FI", groups: ["EU", "154", "150", "UN"], callingCodes: ["358 18", "358 457"] }, geometry: { type: "MultiPolygon", coordinates: [[[[19.08191, 60.19152], [20.5104, 59.15546], [21.35468, 59.67511], [21.02509, 60.12142], [21.08159, 60.20167], [21.15143, 60.54555], [20.96741, 60.71528], [19.23413, 60.61414], [19.08191, 60.19152]]]] } },
      { type: "Feature", properties: { iso1A2: "AZ", iso1A3: "AZE", iso1N3: "031", wikidata: "Q227", nameEn: "Azerbaijan", groups: ["145", "142", "UN"], callingCodes: ["994"] }, geometry: { type: "MultiPolygon", coordinates: [[[[46.42738, 41.91323], [46.3984, 41.84399], [46.30863, 41.79133], [46.23962, 41.75811], [46.20538, 41.77205], [46.17891, 41.72094], [46.19759, 41.62327], [46.24429, 41.59883], [46.26531, 41.63339], [46.28182, 41.60089], [46.3253, 41.60912], [46.34039, 41.5947], [46.34126, 41.57454], [46.29794, 41.5724], [46.33925, 41.4963], [46.40307, 41.48464], [46.4669, 41.43331], [46.63658, 41.37727], [46.72375, 41.28609], [46.66148, 41.20533], [46.63969, 41.09515], [46.55096, 41.1104], [46.48558, 41.0576], [46.456, 41.09984], [46.37661, 41.10805], [46.27698, 41.19011], [46.13221, 41.19479], [45.95786, 41.17956], [45.80842, 41.2229], [45.69946, 41.29545], [45.75705, 41.35157], [45.71035, 41.36208], [45.68389, 41.3539], [45.45973, 41.45898], [45.4006, 41.42402], [45.31352, 41.47168], [45.26285, 41.46433], [45.1797, 41.42231], [45.09867, 41.34065], [45.0133, 41.29747], [45.05497, 41.2464], [45.02932, 41.2101], [45.05201, 41.19211], [45.11811, 41.19967], [45.1969, 41.168], [45.19942, 41.13299], [45.08028, 41.10917], [45.06784, 41.05379], [45.12923, 41.06059], [45.1313, 41.09369], [45.1634, 41.08082], [45.16493, 41.05068], [45.1994, 41.04518], [45.25897, 41.0027], [45.26162, 41.0228], [45.28859, 41.03757], [45.35677, 40.99784], [45.39725, 41.02603], [45.44083, 41.01663], [45.40814, 40.97904], [45.60584, 40.87436], [45.55914, 40.78366], [45.4206, 40.7424], [45.35366, 40.65979], [45.45484, 40.57707], [45.42994, 40.53804], [45.65098, 40.37696], [45.95609, 40.27846], [45.97944, 40.181], [45.83779, 39.98925], [45.78642, 40.03218], [45.59806, 40.0131], [45.60895, 39.97733], [45.7833, 39.9475], [45.82533, 39.82925], [45.96543, 39.78859], [46.18493, 39.60533], [46.40286, 39.63651], [46.42465, 39.57534], [46.52117, 39.58734], [46.57098, 39.56694], [46.57721, 39.54414], [46.51027, 39.52373], [46.53051, 39.47809], [46.4013, 39.45405], [46.37795, 39.42039], [46.43244, 39.35181], [46.50093, 39.33736], [46.56476, 39.24942], [46.63481, 39.23013], [46.58032, 39.21204], [46.54141, 39.15895], [46.52584, 39.18912], [46.44022, 39.19636], [46.54296, 39.07078], [46.51805, 38.94982], [46.53497, 38.86548], [46.75752, 39.03231], [46.83822, 39.13143], [46.92539, 39.16644], [46.95341, 39.13505], [47.05771, 39.20143], [47.05927, 39.24846], [47.31301, 39.37492], [47.38978, 39.45999], [47.50099, 39.49615], [47.84774, 39.66285], [47.98977, 39.70999], [48.34264, 39.42935], [48.37385, 39.37584], [48.15984, 39.30028], [48.12404, 39.25208], [48.15361, 39.19419], [48.31239, 39.09278], [48.33884, 39.03022], [48.28437, 38.97186], [48.08627, 38.94434], [48.07734, 38.91616], [48.01409, 38.90333], [48.02581, 38.82705], [48.24773, 38.71883], [48.3146, 38.59958], [48.45084, 38.61013], [48.58793, 38.45076], [48.62217, 38.40198], [48.70001, 38.40564], [48.78979, 38.45026], [48.81072, 38.44853], [48.84969, 38.45015], [48.88288, 38.43975], [52.39847, 39.43556], [48.80971, 41.95365], [48.5867, 41.84306], [48.55078, 41.77917], [48.42301, 41.65444], [48.40277, 41.60441], [48.2878, 41.56221], [48.22064, 41.51472], [48.07587, 41.49957], [47.87973, 41.21798], [47.75831, 41.19455], [47.62288, 41.22969], [47.54504, 41.20275], [47.49004, 41.26366], [47.34579, 41.27884], [47.10762, 41.59044], [47.03757, 41.55434], [46.99554, 41.59743], [47.00955, 41.63583], [46.8134, 41.76252], [46.75269, 41.8623], [46.58924, 41.80547], [46.5332, 41.87389], [46.42738, 41.91323]], [[45.50279, 40.58424], [45.47927, 40.65023], [45.51825, 40.67382], [45.56071, 40.64765], [45.50279, 40.58424]]], [[[45.00864, 41.03411], [45.03792, 41.03938], [45.04517, 41.06653], [45.03406, 41.07931], [45.00864, 41.09407], [44.97169, 41.09176], [44.95383, 41.07553], [44.96031, 41.06345], [44.9903, 41.05657], [45.00864, 41.03411]]], [[[45.21324, 40.9817], [45.23095, 40.97828], [45.23487, 41.00226], [45.20625, 41.01484], [45.18382, 41.0066], [45.19312, 40.98998], [45.20518, 40.99348], [45.21219, 40.99001], [45.21324, 40.9817]]], [[[45.46992, 39.49888], [45.29606, 39.57654], [45.30385, 39.61373], [45.23535, 39.61373], [45.21784, 39.58074], [45.17464, 39.58614], [45.18554, 39.67846], [45.06604, 39.79277], [44.92869, 39.72157], [44.88354, 39.74432], [44.75779, 39.7148], [44.80977, 39.65768], [44.81043, 39.62677], [44.88916, 39.59653], [44.96746, 39.42998], [45.05932, 39.36435], [45.08751, 39.35052], [45.16168, 39.21952], [45.30489, 39.18333], [45.40148, 39.09007], [45.40452, 39.07224], [45.44811, 39.04927], [45.44966, 38.99243], [45.6131, 38.964], [45.6155, 38.94304], [45.65172, 38.95199], [45.83883, 38.90768], [45.90266, 38.87739], [45.94624, 38.89072], [46.00228, 38.87376], [46.06766, 38.87861], [46.14785, 38.84206], [46.06973, 39.0744], [46.02303, 39.09978], [45.99774, 39.28931], [45.79225, 39.3695], [45.83, 39.46487], [45.80804, 39.56716], [45.70547, 39.60174], [45.46992, 39.49888]]]] } },
      { type: "Feature", properties: { iso1A2: "BA", iso1A3: "BIH", iso1N3: "070", wikidata: "Q225", nameEn: "Bosnia and Herzegovina", groups: ["039", "150", "UN"], callingCodes: ["387"] }, geometry: { type: "MultiPolygon", coordinates: [[[[17.84826, 45.04489], [17.66571, 45.13408], [17.59104, 45.10816], [17.51469, 45.10791], [17.47589, 45.12656], [17.45615, 45.12523], [17.4498, 45.16119], [17.41229, 45.13335], [17.33573, 45.14521], [17.32092, 45.16246], [17.26815, 45.18444], [17.25131, 45.14957], [17.24325, 45.146], [17.18438, 45.14764], [17.0415, 45.20759], [16.9385, 45.22742], [16.92405, 45.27607], [16.83804, 45.18951], [16.81137, 45.18434], [16.78219, 45.19002], [16.74845, 45.20393], [16.64962, 45.20714], [16.60194, 45.23042], [16.56559, 45.22307], [16.5501, 45.2212], [16.52982, 45.22713], [16.49155, 45.21153], [16.4634, 45.14522], [16.40023, 45.1147], [16.38309, 45.05955], [16.38219, 45.05139], [16.3749, 45.05206], [16.35863, 45.03529], [16.35404, 45.00241], [16.29036, 44.99732], [16.12153, 45.09616], [15.98412, 45.23088], [15.83512, 45.22459], [15.76371, 45.16508], [15.78842, 45.11519], [15.74585, 45.0638], [15.78568, 44.97401], [15.74723, 44.96818], [15.76096, 44.87045], [15.79472, 44.8455], [15.72584, 44.82334], [15.8255, 44.71501], [15.89348, 44.74964], [16.05828, 44.61538], [16.00884, 44.58605], [16.03012, 44.55572], [16.10566, 44.52586], [16.16814, 44.40679], [16.12969, 44.38275], [16.21346, 44.35231], [16.18688, 44.27012], [16.36864, 44.08263], [16.43662, 44.07523], [16.43629, 44.02826], [16.50528, 44.0244], [16.55472, 43.95326], [16.70922, 43.84887], [16.75316, 43.77157], [16.80736, 43.76011], [17.00585, 43.58037], [17.15828, 43.49376], [17.24411, 43.49376], [17.29699, 43.44542], [17.25579, 43.40353], [17.286, 43.33065], [17.46986, 43.16559], [17.64268, 43.08595], [17.70879, 42.97223], [17.5392, 42.92787], [17.6444, 42.88641], [17.68151, 42.92725], [17.7948, 42.89556], [17.80854, 42.9182], [17.88201, 42.83668], [18.24318, 42.6112], [18.36197, 42.61423], [18.43735, 42.55921], [18.49778, 42.58409], [18.53751, 42.57376], [18.55504, 42.58409], [18.52232, 42.62279], [18.57373, 42.64429], [18.54841, 42.68328], [18.54603, 42.69171], [18.55221, 42.69045], [18.56789, 42.72074], [18.47324, 42.74992], [18.45921, 42.81682], [18.47633, 42.85829], [18.4935, 42.86433], [18.49661, 42.89306], [18.49076, 42.95553], [18.52232, 43.01451], [18.66254, 43.03928], [18.64735, 43.14766], [18.66605, 43.2056], [18.71747, 43.2286], [18.6976, 43.25243], [18.76538, 43.29838], [18.85342, 43.32426], [18.84794, 43.33735], [18.83912, 43.34795], [18.90911, 43.36383], [18.95819, 43.32899], [18.95001, 43.29327], [19.00844, 43.24988], [19.04233, 43.30008], [19.08206, 43.29668], [19.08673, 43.31453], [19.04071, 43.397], [19.01078, 43.43854], [18.96053, 43.45042], [18.95469, 43.49367], [18.91379, 43.50299], [19.01078, 43.55806], [19.04934, 43.50384], [19.13933, 43.5282], [19.15685, 43.53943], [19.22807, 43.5264], [19.24774, 43.53061], [19.2553, 43.5938], [19.33426, 43.58833], [19.36653, 43.60921], [19.41941, 43.54056], [19.42696, 43.57987], [19.50455, 43.58385], [19.5176, 43.71403], [19.3986, 43.79668], [19.23465, 43.98764], [19.24363, 44.01502], [19.38439, 43.96611], [19.52515, 43.95573], [19.56498, 43.99922], [19.61836, 44.01464], [19.61991, 44.05254], [19.57467, 44.04716], [19.55999, 44.06894], [19.51167, 44.08158], [19.47321, 44.1193], [19.48386, 44.14332], [19.47338, 44.15034], [19.43905, 44.13088], [19.40927, 44.16722], [19.3588, 44.18353], [19.34773, 44.23244], [19.32464, 44.27185], [19.26945, 44.26957], [19.23306, 44.26097], [19.20508, 44.2917], [19.18328, 44.28383], [19.16741, 44.28648], [19.13332, 44.31492], [19.13556, 44.338], [19.11547, 44.34218], [19.1083, 44.3558], [19.11865, 44.36712], [19.10298, 44.36924], [19.10365, 44.37795], [19.10704, 44.38249], [19.10749, 44.39421], [19.11785, 44.40313], [19.14681, 44.41463], [19.14837, 44.45253], [19.12278, 44.50132], [19.13369, 44.52521], [19.16699, 44.52197], [19.26388, 44.65412], [19.32543, 44.74058], [19.36722, 44.88164], [19.18183, 44.92055], [19.01994, 44.85493], [18.8704, 44.85097], [18.76347, 44.90669], [18.76369, 44.93707], [18.80661, 44.93561], [18.78357, 44.97741], [18.65723, 45.07544], [18.47939, 45.05871], [18.41896, 45.11083], [18.32077, 45.1021], [18.24387, 45.13699], [18.1624, 45.07654], [18.03121, 45.12632], [18.01594, 45.15163], [17.99479, 45.14958], [17.97834, 45.13831], [17.97336, 45.12245], [17.93706, 45.08016], [17.87148, 45.04645], [17.84826, 45.04489]]]] } },
      { type: "Feature", properties: { iso1A2: "BB", iso1A3: "BRB", iso1N3: "052", wikidata: "Q244", nameEn: "Barbados", groups: ["029", "003", "419", "019", "UN"], driveSide: "left", callingCodes: ["1 246"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-58.56442, 13.24471], [-59.80731, 13.87556], [-59.82929, 12.70644], [-58.56442, 13.24471]]]] } },
      { type: "Feature", properties: { iso1A2: "BD", iso1A3: "BGD", iso1N3: "050", wikidata: "Q902", nameEn: "Bangladesh", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["880"] }, geometry: { type: "MultiPolygon", coordinates: [[[[89.15869, 26.13708], [89.08899, 26.38845], [88.95612, 26.4564], [88.92357, 26.40711], [88.91321, 26.37984], [89.05328, 26.2469], [88.85004, 26.23211], [88.78961, 26.31093], [88.67837, 26.26291], [88.69485, 26.38353], [88.62144, 26.46783], [88.4298, 26.54489], [88.41196, 26.63837], [88.33093, 26.48929], [88.35153, 26.45241], [88.36938, 26.48683], [88.48749, 26.45855], [88.51649, 26.35923], [88.35153, 26.29123], [88.34757, 26.22216], [88.1844, 26.14417], [88.16581, 26.0238], [88.08804, 25.91334], [88.13138, 25.78773], [88.242, 25.80811], [88.45103, 25.66245], [88.4559, 25.59227], [88.677, 25.46959], [88.81296, 25.51546], [88.85278, 25.34679], [89.01105, 25.30303], [89.00463, 25.26583], [88.94067, 25.18534], [88.44766, 25.20149], [88.46277, 25.07468], [88.33917, 24.86803], [88.27325, 24.88796], [88.21832, 24.96642], [88.14004, 24.93529], [88.15515, 24.85806], [88.00683, 24.66477], [88.08786, 24.63232], [88.12296, 24.51301], [88.50934, 24.32474], [88.68801, 24.31464], [88.74841, 24.1959], [88.6976, 24.14703], [88.73743, 23.91751], [88.66189, 23.87607], [88.58087, 23.87105], [88.56507, 23.64044], [88.74841, 23.47361], [88.79351, 23.50535], [88.79254, 23.46028], [88.71133, 23.2492], [88.99148, 23.21134], [88.86377, 23.08759], [88.88327, 23.03885], [88.87063, 22.95235], [88.96713, 22.83346], [88.9151, 22.75228], [88.94614, 22.66941], [88.9367, 22.58527], [89.07114, 22.15335], [89.08044, 21.41871], [92.47409, 20.38654], [92.26071, 21.05697], [92.17752, 21.17445], [92.20087, 21.337], [92.37939, 21.47764], [92.43158, 21.37025], [92.55105, 21.3856], [92.60187, 21.24615], [92.68152, 21.28454], [92.59775, 21.6092], [92.62187, 21.87037], [92.60949, 21.97638], [92.56616, 22.13554], [92.60029, 22.1522], [92.5181, 22.71441], [92.37665, 22.9435], [92.38214, 23.28705], [92.26541, 23.70392], [92.15417, 23.73409], [92.04706, 23.64229], [91.95093, 23.73284], [91.95642, 23.47361], [91.84789, 23.42235], [91.76417, 23.26619], [91.81634, 23.08001], [91.7324, 23.00043], [91.61571, 22.93929], [91.54993, 23.01051], [91.46615, 23.2328], [91.4035, 23.27522], [91.40848, 23.07117], [91.36453, 23.06612], [91.28293, 23.37538], [91.15579, 23.6599], [91.25192, 23.83463], [91.22308, 23.89616], [91.29587, 24.0041], [91.35741, 23.99072], [91.37414, 24.10693], [91.55542, 24.08687], [91.63782, 24.1132], [91.65292, 24.22095], [91.73257, 24.14703], [91.76004, 24.23848], [91.82596, 24.22345], [91.89258, 24.14674], [91.96603, 24.3799], [92.11662, 24.38997], [92.15796, 24.54435], [92.25854, 24.9191], [92.38626, 24.86055], [92.49887, 24.88796], [92.39147, 25.01471], [92.33957, 25.07593], [92.0316, 25.1834], [91.63648, 25.12846], [91.25517, 25.20677], [90.87427, 25.15799], [90.65042, 25.17788], [90.40034, 25.1534], [90.1155, 25.22686], [89.90478, 25.31038], [89.87629, 25.28337], [89.83371, 25.29548], [89.84086, 25.31854], [89.81208, 25.37244], [89.86129, 25.61714], [89.84388, 25.70042], [89.80585, 25.82489], [89.86592, 25.93115], [89.77728, 26.04254], [89.77865, 26.08387], [89.73581, 26.15818], [89.70201, 26.15138], [89.63968, 26.22595], [89.57101, 25.9682], [89.53515, 26.00382], [89.35953, 26.0077], [89.15869, 26.13708]]]] } },
      { type: "Feature", properties: { iso1A2: "BE", iso1A3: "BEL", iso1N3: "056", wikidata: "Q31", nameEn: "Belgium", groups: ["EU", "155", "150", "UN"], callingCodes: ["32"] }, geometry: { type: "MultiPolygon", coordinates: [[[[4.93295, 51.44945], [4.93909, 51.44632], [4.9524, 51.45014], [4.95244, 51.45207], [4.93295, 51.44945]]], [[[4.91493, 51.4353], [4.92652, 51.43329], [4.92952, 51.42984], [4.93986, 51.43064], [4.94265, 51.44003], [4.93471, 51.43861], [4.93416, 51.44185], [4.94025, 51.44193], [4.93544, 51.44634], [4.92879, 51.44161], [4.92815, 51.43856], [4.92566, 51.44273], [4.92811, 51.4437], [4.92287, 51.44741], [4.91811, 51.44621], [4.92227, 51.44252], [4.91935, 51.43634], [4.91493, 51.4353]]], [[[4.82946, 51.4213], [4.82409, 51.44736], [4.84139, 51.4799], [4.78803, 51.50284], [4.77321, 51.50529], [4.74578, 51.48937], [4.72935, 51.48424], [4.65442, 51.42352], [4.57489, 51.4324], [4.53521, 51.4243], [4.52846, 51.45002], [4.54675, 51.47265], [4.5388, 51.48184], [4.47736, 51.4778], [4.38122, 51.44905], [4.39747, 51.43316], [4.38064, 51.41965], [4.43777, 51.36989], [4.39292, 51.35547], [4.34086, 51.35738], [4.33265, 51.37687], [4.21923, 51.37443], [4.24024, 51.35371], [4.16721, 51.29348], [4.05165, 51.24171], [4.01957, 51.24504], [3.97889, 51.22537], [3.90125, 51.20371], [3.78783, 51.2151], [3.78999, 51.25766], [3.58939, 51.30064], [3.51502, 51.28697], [3.52698, 51.2458], [3.43488, 51.24135], [3.41704, 51.25933], [3.38289, 51.27331], [3.35847, 51.31572], [3.38696, 51.33436], [3.36263, 51.37112], [2.56575, 51.85301], [2.18458, 51.52087], [2.55904, 51.07014], [2.57551, 51.00326], [2.63074, 50.94746], [2.59093, 50.91751], [2.63331, 50.81457], [2.71165, 50.81295], [2.81056, 50.71773], [2.8483, 50.72276], [2.86985, 50.7033], [2.87937, 50.70298], [2.88504, 50.70656], [2.90069, 50.69263], [2.91036, 50.6939], [2.90873, 50.702], [2.95019, 50.75138], [2.96778, 50.75242], [3.00537, 50.76588], [3.04314, 50.77674], [3.09163, 50.77717], [3.10614, 50.78303], [3.11206, 50.79416], [3.11987, 50.79188], [3.1257, 50.78603], [3.15017, 50.79031], [3.16476, 50.76843], [3.18339, 50.74981], [3.18811, 50.74025], [3.20064, 50.73547], [3.19017, 50.72569], [3.20845, 50.71662], [3.22042, 50.71019], [3.24593, 50.71389], [3.26063, 50.70086], [3.26141, 50.69151], [3.2536, 50.68977], [3.264, 50.67668], [3.23951, 50.6585], [3.2729, 50.60718], [3.28575, 50.52724], [3.37693, 50.49538], [3.44629, 50.51009], [3.47385, 50.53397], [3.51564, 50.5256], [3.49509, 50.48885], [3.5683, 50.50192], [3.58361, 50.49049], [3.61014, 50.49568], [3.64426, 50.46275], [3.66153, 50.45165], [3.67494, 50.40239], [3.67262, 50.38663], [3.65709, 50.36873], [3.66976, 50.34563], [3.71009, 50.30305], [3.70987, 50.3191], [3.73911, 50.34809], [3.84314, 50.35219], [3.90781, 50.32814], [3.96771, 50.34989], [4.0268, 50.35793], [4.0689, 50.3254], [4.10237, 50.31247], [4.10957, 50.30234], [4.11954, 50.30425], [4.13665, 50.25609], [4.16808, 50.25786], [4.15524, 50.2833], [4.17347, 50.28838], [4.17861, 50.27443], [4.20651, 50.27333], [4.21945, 50.25539], [4.15524, 50.21103], [4.16014, 50.19239], [4.13561, 50.13078], [4.20147, 50.13535], [4.23101, 50.06945], [4.16294, 50.04719], [4.13508, 50.01976], [4.14239, 49.98034], [4.20532, 49.95803], [4.31963, 49.97043], [4.35051, 49.95315], [4.43488, 49.94122], [4.51098, 49.94659], [4.5414, 49.96911], [4.68695, 49.99685], [4.70064, 50.09384], [4.75237, 50.11314], [4.82438, 50.16878], [4.83279, 50.15331], [4.88602, 50.15182], [4.8382, 50.06738], [4.78827, 49.95609], [4.88529, 49.9236], [4.85134, 49.86457], [4.86965, 49.82271], [4.85464, 49.78995], [4.96714, 49.79872], [5.09249, 49.76193], [5.14545, 49.70287], [5.26232, 49.69456], [5.31465, 49.66846], [5.33039, 49.6555], [5.30214, 49.63055], [5.3137, 49.61225], [5.33851, 49.61599], [5.34837, 49.62889], [5.3974, 49.61596], [5.43713, 49.5707], [5.46734, 49.52648], [5.46541, 49.49825], [5.55001, 49.52729], [5.60909, 49.51228], [5.64505, 49.55146], [5.75649, 49.54321], [5.7577, 49.55915], [5.77435, 49.56298], [5.79195, 49.55228], [5.81838, 49.54777], [5.84143, 49.5533], [5.84692, 49.55663], [5.8424, 49.56082], [5.87256, 49.57539], [5.86986, 49.58756], [5.84971, 49.58674], [5.84826, 49.5969], [5.8762, 49.60898], [5.87609, 49.62047], [5.88393, 49.62802], [5.88552, 49.63507], [5.90599, 49.63853], [5.90164, 49.6511], [5.9069, 49.66377], [5.86175, 49.67862], [5.86527, 49.69291], [5.88677, 49.70951], [5.86503, 49.72739], [5.84193, 49.72161], [5.82562, 49.72395], [5.83149, 49.74729], [5.82245, 49.75048], [5.78871, 49.7962], [5.75409, 49.79239], [5.74953, 49.81428], [5.74364, 49.82058], [5.74844, 49.82435], [5.7404, 49.83452], [5.74076, 49.83823], [5.74975, 49.83933], [5.74953, 49.84709], [5.75884, 49.84811], [5.74567, 49.85368], [5.75861, 49.85631], [5.75269, 49.8711], [5.78415, 49.87922], [5.73621, 49.89796], [5.77314, 49.93646], [5.77291, 49.96056], [5.80833, 49.96451], [5.81163, 49.97142], [5.83467, 49.97823], [5.83968, 49.9892], [5.82331, 49.99662], [5.81866, 50.01286], [5.8551, 50.02683], [5.86904, 50.04614], [5.85474, 50.06342], [5.8857, 50.07824], [5.89488, 50.11476], [5.95929, 50.13295], [5.96453, 50.17259], [6.02488, 50.18283], [6.03093, 50.16362], [6.06406, 50.15344], [6.08577, 50.17246], [6.12028, 50.16374], [6.1137, 50.13668], [6.1379, 50.12964], [6.15298, 50.14126], [6.14132, 50.14971], [6.14588, 50.17106], [6.18739, 50.1822], [6.18364, 50.20815], [6.16853, 50.2234], [6.208, 50.25179], [6.28797, 50.27458], [6.29949, 50.30887], [6.32488, 50.32333], [6.35701, 50.31139], [6.40641, 50.32425], [6.40785, 50.33557], [6.3688, 50.35898], [6.34406, 50.37994], [6.36852, 50.40776], [6.37219, 50.45397], [6.34005, 50.46083], [6.3465, 50.48833], [6.30809, 50.50058], [6.26637, 50.50272], [6.22335, 50.49578], [6.20599, 50.52089], [6.19193, 50.5212], [6.18716, 50.52653], [6.19579, 50.5313], [6.19735, 50.53576], [6.17802, 50.54179], [6.17739, 50.55875], [6.20281, 50.56952], [6.22581, 50.5907], [6.24005, 50.58732], [6.24888, 50.59869], [6.2476, 50.60392], [6.26957, 50.62444], [6.17852, 50.6245], [6.11707, 50.72231], [6.04428, 50.72861], [6.0406, 50.71848], [6.0326, 50.72647], [6.03889, 50.74618], [6.01976, 50.75398], [5.97545, 50.75441], [5.95942, 50.7622], [5.89132, 50.75124], [5.89129, 50.75125], [5.88734, 50.77092], [5.84888, 50.75448], [5.84548, 50.76542], [5.80673, 50.7558], [5.77513, 50.78308], [5.76533, 50.78159], [5.74356, 50.7691], [5.73904, 50.75674], [5.72216, 50.76398], [5.69469, 50.75529], [5.68091, 50.75804], [5.70107, 50.7827], [5.68995, 50.79641], [5.70118, 50.80764], [5.65259, 50.82309], [5.64009, 50.84742], [5.64504, 50.87107], [5.67886, 50.88142], [5.69858, 50.91046], [5.71626, 50.90796], [5.72644, 50.91167], [5.72545, 50.92312], [5.74644, 50.94723], [5.75927, 50.95601], [5.74752, 50.96202], [5.72875, 50.95428], [5.71864, 50.96092], [5.76242, 50.99703], [5.77688, 51.02483], [5.75961, 51.03113], [5.77258, 51.06196], [5.79835, 51.05834], [5.79903, 51.09371], [5.82921, 51.09328], [5.83226, 51.10585], [5.8109, 51.10861], [5.80798, 51.11661], [5.85508, 51.14445], [5.82564, 51.16753], [5.77697, 51.1522], [5.77735, 51.17845], [5.74617, 51.18928], [5.70344, 51.1829], [5.65528, 51.18736], [5.65145, 51.19788], [5.5603, 51.22249], [5.5569, 51.26544], [5.515, 51.29462], [5.48476, 51.30053], [5.46519, 51.2849], [5.4407, 51.28169], [5.41672, 51.26248], [5.347, 51.27502], [5.33886, 51.26314], [5.29716, 51.26104], [5.26461, 51.26693], [5.23814, 51.26064], [5.22542, 51.26888], [5.24244, 51.30495], [5.2002, 51.32243], [5.16222, 51.31035], [5.13377, 51.31592], [5.13105, 51.34791], [5.07102, 51.39469], [5.10456, 51.43163], [5.07891, 51.4715], [5.04774, 51.47022], [5.03281, 51.48679], [5.0106, 51.47167], [5.00393, 51.44406], [4.92152, 51.39487], [4.90016, 51.41404], [4.84988, 51.41502], [4.78941, 51.41102], [4.77229, 51.41337], [4.76577, 51.43046], [4.78314, 51.43319], [4.82946, 51.4213]]]] } },
      { type: "Feature", properties: { iso1A2: "BF", iso1A3: "BFA", iso1N3: "854", wikidata: "Q965", nameEn: "Burkina Faso", groups: ["011", "202", "002", "UN"], callingCodes: ["226"] }, geometry: { type: "MultiPolygon", coordinates: [[[[0.23859, 15.00135], [0.06588, 14.96961], [-0.24673, 15.07805], [-0.72004, 15.08655], [-1.05875, 14.7921], [-1.32166, 14.72774], [-1.68083, 14.50023], [-1.97945, 14.47709], [-1.9992, 14.19011], [-2.10223, 14.14878], [-2.47587, 14.29671], [-2.66175, 14.14713], [-2.84667, 14.05532], [-2.90831, 13.81174], [-2.88189, 13.64921], [-3.26407, 13.70699], [-3.28396, 13.5422], [-3.23599, 13.29035], [-3.43507, 13.27272], [-3.4313, 13.1588], [-3.54454, 13.1781], [-3.7911, 13.36665], [-3.96282, 13.38164], [-3.90558, 13.44375], [-3.96501, 13.49778], [-4.34477, 13.12927], [-4.21819, 12.95722], [-4.238, 12.71467], [-4.47356, 12.71252], [-4.41412, 12.31922], [-4.57703, 12.19875], [-4.54841, 12.1385], [-4.62546, 12.13204], [-4.62987, 12.06531], [-4.70692, 12.06746], [-4.72893, 12.01579], [-5.07897, 11.97918], [-5.26389, 11.84778], [-5.40258, 11.8327], [-5.26389, 11.75728], [-5.29251, 11.61715], [-5.22867, 11.60421], [-5.20665, 11.43811], [-5.25509, 11.36905], [-5.25949, 11.24816], [-5.32553, 11.21578], [-5.32994, 11.13371], [-5.49284, 11.07538], [-5.41579, 10.84628], [-5.47083, 10.75329], [-5.46643, 10.56074], [-5.51058, 10.43177], [-5.39602, 10.2929], [-5.12465, 10.29788], [-4.96453, 9.99923], [-4.96621, 9.89132], [-4.6426, 9.70696], [-4.31392, 9.60062], [-4.25999, 9.76012], [-3.69703, 9.94279], [-3.31779, 9.91125], [-3.27228, 9.84981], [-3.19306, 9.93781], [-3.16609, 9.85147], [-3.00765, 9.74019], [-2.93012, 9.57403], [-2.76494, 9.40778], [-2.68802, 9.49343], [-2.76534, 9.56589], [-2.74174, 9.83172], [-2.83108, 10.40252], [-2.94232, 10.64281], [-2.83373, 11.0067], [-0.67143, 10.99811], [-0.61937, 10.91305], [-0.44298, 11.04292], [-0.42391, 11.11661], [-0.38219, 11.12596], [-0.35955, 11.07801], [-0.28566, 11.12713], [-0.27374, 11.17157], [-0.13493, 11.14075], [0.50388, 11.01011], [0.48852, 10.98561], [0.50521, 10.98035], [0.4958, 10.93269], [0.66104, 10.99964], [0.91245, 10.99597], [0.9813, 11.08876], [1.03409, 11.04719], [1.42823, 11.46822], [2.00988, 11.42227], [2.29983, 11.68254], [2.39723, 11.89473], [2.05785, 12.35539], [2.26349, 12.41915], [0.99167, 13.10727], [0.99253, 13.37515], [1.18873, 13.31771], [1.21217, 13.37853], [1.24516, 13.33968], [1.28509, 13.35488], [1.24429, 13.39373], [1.20088, 13.38951], [1.02813, 13.46635], [0.99514, 13.5668], [0.77637, 13.64442], [0.77377, 13.6866], [0.61924, 13.68491], [0.38051, 14.05575], [0.16936, 14.51654], [0.23859, 15.00135]]]] } },
      { type: "Feature", properties: { iso1A2: "BG", iso1A3: "BGR", iso1N3: "100", wikidata: "Q219", nameEn: "Bulgaria", groups: ["EU", "151", "150", "UN"], callingCodes: ["359"] }, geometry: { type: "MultiPolygon", coordinates: [[[[23.05288, 43.79494], [22.85314, 43.84452], [22.83753, 43.88055], [22.87873, 43.9844], [23.01674, 44.01946], [23.04988, 44.07694], [22.67173, 44.21564], [22.61711, 44.16938], [22.61688, 44.06534], [22.41449, 44.00514], [22.35558, 43.81281], [22.41043, 43.69566], [22.47582, 43.6558], [22.53397, 43.47225], [22.82036, 43.33665], [22.89727, 43.22417], [23.00806, 43.19279], [22.98104, 43.11199], [22.89521, 43.03625], [22.78397, 42.98253], [22.74826, 42.88701], [22.54302, 42.87774], [22.43309, 42.82057], [22.4997, 42.74144], [22.43983, 42.56851], [22.55669, 42.50144], [22.51961, 42.3991], [22.47498, 42.3915], [22.45919, 42.33822], [22.34773, 42.31725], [22.38136, 42.30339], [22.47251, 42.20393], [22.50289, 42.19527], [22.51224, 42.15457], [22.67701, 42.06614], [22.86749, 42.02275], [22.90254, 41.87587], [22.96682, 41.77137], [23.01239, 41.76527], [23.03342, 41.71034], [22.95513, 41.63265], [22.96331, 41.35782], [22.93334, 41.34104], [23.1833, 41.31755], [23.21953, 41.33773], [23.22771, 41.37106], [23.31301, 41.40525], [23.33639, 41.36317], [23.40416, 41.39999], [23.52453, 41.40262], [23.63203, 41.37632], [23.67644, 41.41139], [23.76525, 41.40175], [23.80148, 41.43943], [23.89613, 41.45257], [23.91483, 41.47971], [23.96975, 41.44118], [24.06908, 41.46132], [24.06323, 41.53222], [24.10063, 41.54796], [24.18126, 41.51735], [24.27124, 41.57682], [24.30513, 41.51297], [24.52599, 41.56808], [24.61129, 41.42278], [24.71529, 41.41928], [24.8041, 41.34913], [24.82514, 41.4035], [24.86136, 41.39298], [24.90928, 41.40876], [24.942, 41.38685], [25.11611, 41.34212], [25.28322, 41.23411], [25.48187, 41.28506], [25.52394, 41.2798], [25.55082, 41.31667], [25.61042, 41.30614], [25.66183, 41.31316], [25.70507, 41.29209], [25.8266, 41.34563], [25.87919, 41.30526], [26.12926, 41.35878], [26.16548, 41.42278], [26.20288, 41.43943], [26.14796, 41.47533], [26.176, 41.50072], [26.17951, 41.55409], [26.14328, 41.55496], [26.15146, 41.60828], [26.07083, 41.64584], [26.06148, 41.70345], [26.16841, 41.74858], [26.21325, 41.73223], [26.22888, 41.74139], [26.2654, 41.71544], [26.30255, 41.70925], [26.35957, 41.71149], [26.32952, 41.73637], [26.33589, 41.76802], [26.36952, 41.82265], [26.53968, 41.82653], [26.57961, 41.90024], [26.56051, 41.92995], [26.62996, 41.97644], [26.79143, 41.97386], [26.95638, 42.00741], [27.03277, 42.0809], [27.08486, 42.08735], [27.19251, 42.06028], [27.22376, 42.10152], [27.27411, 42.10409], [27.45478, 41.96591], [27.52379, 41.93756], [27.55191, 41.90928], [27.69949, 41.97515], [27.81235, 41.94803], [27.83492, 41.99709], [27.91479, 41.97902], [28.02971, 41.98066], [28.32297, 41.98371], [29.24336, 43.70874], [28.23293, 43.76], [27.99558, 43.84193], [27.92008, 44.00761], [27.73468, 43.95326], [27.64542, 44.04958], [27.60834, 44.01206], [27.39757, 44.0141], [27.26845, 44.12602], [26.95141, 44.13555], [26.62712, 44.05698], [26.38764, 44.04356], [26.10115, 43.96908], [26.05584, 43.90925], [25.94911, 43.85745], [25.72792, 43.69263], [25.39528, 43.61866], [25.17144, 43.70261], [25.10718, 43.6831], [24.96682, 43.72693], [24.73542, 43.68523], [24.62281, 43.74082], [24.50264, 43.76314], [24.35364, 43.70211], [24.18149, 43.68218], [23.73978, 43.80627], [23.61687, 43.79289], [23.4507, 43.84936], [23.26772, 43.84843], [23.05288, 43.79494]]]] } },
      { type: "Feature", properties: { iso1A2: "BH", iso1A3: "BHR", iso1N3: "048", wikidata: "Q398", nameEn: "Bahrain", groups: ["145", "142", "UN"], callingCodes: ["973"] }, geometry: { type: "MultiPolygon", coordinates: [[[[50.93865, 26.30758], [50.71771, 26.73086], [50.38162, 26.53976], [50.26923, 26.08243], [50.302, 25.87592], [50.57069, 25.57887], [50.80824, 25.54641], [50.7801, 25.595], [50.86149, 25.6965], [50.81266, 25.88946], [50.93865, 26.30758]]]] } },
      { type: "Feature", properties: { iso1A2: "BI", iso1A3: "BDI", iso1N3: "108", wikidata: "Q967", nameEn: "Burundi", groups: ["014", "202", "002", "UN"], callingCodes: ["257"] }, geometry: { type: "MultiPolygon", coordinates: [[[[30.54501, -2.41404], [30.42933, -2.31064], [30.14034, -2.43626], [29.95911, -2.33348], [29.88237, -2.75105], [29.36805, -2.82933], [29.32234, -2.6483], [29.0562, -2.58632], [29.04081, -2.7416], [29.00167, -2.78523], [29.00404, -2.81978], [29.0505, -2.81774], [29.09119, -2.87871], [29.09797, -2.91935], [29.16037, -2.95457], [29.17258, -2.99385], [29.25633, -3.05471], [29.21463, -3.3514], [29.23708, -3.75856], [29.43673, -4.44845], [29.63827, -4.44681], [29.75109, -4.45836], [29.77289, -4.41733], [29.82885, -4.36153], [29.88172, -4.35743], [30.03323, -4.26631], [30.22042, -4.01738], [30.45915, -3.56532], [30.84165, -3.25152], [30.83823, -2.97837], [30.6675, -2.98987], [30.57926, -2.89791], [30.4987, -2.9573], [30.40662, -2.86151], [30.52747, -2.65841], [30.41789, -2.66266], [30.54501, -2.41404]]]] } },
      { type: "Feature", properties: { iso1A2: "BJ", iso1A3: "BEN", iso1N3: "204", wikidata: "Q962", nameEn: "Benin", aliases: ["DY"], groups: ["011", "202", "002", "UN"], callingCodes: ["229"] }, geometry: { type: "MultiPolygon", coordinates: [[[[3.59375, 11.70269], [3.48187, 11.86092], [3.31613, 11.88495], [3.25352, 12.01467], [2.83978, 12.40585], [2.6593, 12.30631], [2.37783, 12.24804], [2.39657, 12.10952], [2.45824, 11.98672], [2.39723, 11.89473], [2.29983, 11.68254], [2.00988, 11.42227], [1.42823, 11.46822], [1.03409, 11.04719], [0.9813, 11.08876], [0.91245, 10.99597], [0.8804, 10.803], [0.80358, 10.71459], [0.77666, 10.37665], [1.35507, 9.99525], [1.36624, 9.5951], [1.33675, 9.54765], [1.41746, 9.3226], [1.5649, 9.16941], [1.61838, 9.0527], [1.64249, 6.99562], [1.55877, 6.99737], [1.61812, 6.74843], [1.58105, 6.68619], [1.76906, 6.43189], [1.79826, 6.28221], [1.62913, 6.24075], [1.67336, 6.02702], [2.74181, 6.13349], [2.70566, 6.38038], [2.70464, 6.50831], [2.74334, 6.57291], [2.7325, 6.64057], [2.78204, 6.70514], [2.78823, 6.76356], [2.73405, 6.78508], [2.74024, 6.92802], [2.71702, 6.95722], [2.76965, 7.13543], [2.74489, 7.42565], [2.79442, 7.43486], [2.78668, 7.5116], [2.73405, 7.5423], [2.73095, 7.7755], [2.67523, 7.87825], [2.77907, 9.06924], [3.08017, 9.10006], [3.14147, 9.28375], [3.13928, 9.47167], [3.25093, 9.61632], [3.34726, 9.70696], [3.32099, 9.78032], [3.35383, 9.83641], [3.54429, 9.87739], [3.66908, 10.18136], [3.57275, 10.27185], [3.6844, 10.46351], [3.78292, 10.40538], [3.84243, 10.59316], [3.71505, 11.13015], [3.49175, 11.29765], [3.59375, 11.70269]]]] } },
      { type: "Feature", properties: { iso1A2: "BL", iso1A3: "BLM", iso1N3: "652", wikidata: "Q25362", nameEn: "Saint-Barth\xE9lemy", country: "FR", groups: ["Q1451600", "029", "003", "419", "019", "UN"], callingCodes: ["590"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-62.62718, 18.26185], [-63.1055, 17.86651], [-62.34423, 17.49165], [-62.62718, 18.26185]]]] } },
      { type: "Feature", properties: { iso1A2: "BM", iso1A3: "BMU", iso1N3: "060", wikidata: "Q23635", nameEn: "Bermuda", country: "GB", groups: ["BOTS", "021", "003", "019", "UN"], driveSide: "left", callingCodes: ["1 441"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-63.20987, 32.6953], [-65.31453, 32.68437], [-65.63955, 31.43417], [-63.20987, 32.6953]]]] } },
      { type: "Feature", properties: { iso1A2: "BN", iso1A3: "BRN", iso1N3: "096", wikidata: "Q921", nameEn: "Brunei", groups: ["Q36117", "035", "142", "UN"], driveSide: "left", callingCodes: ["673"] }, geometry: { type: "MultiPolygon", coordinates: [[[[115.16236, 5.01011], [115.02521, 5.35005], [114.10166, 4.76112], [114.07448, 4.58441], [114.15813, 4.57], [114.26876, 4.49878], [114.32176, 4.34942], [114.32176, 4.2552], [114.4416, 4.27588], [114.49922, 4.13108], [114.64211, 4.00694], [114.78539, 4.12205], [114.88039, 4.4257], [114.83189, 4.42387], [114.77303, 4.72871], [114.8266, 4.75062], [114.88841, 4.81905], [114.96982, 4.81146], [114.99417, 4.88201], [115.05038, 4.90275], [115.02955, 4.82087], [115.02278, 4.74137], [115.04064, 4.63706], [115.07737, 4.53418], [115.09978, 4.39123], [115.31275, 4.30806], [115.36346, 4.33563], [115.2851, 4.42295], [115.27819, 4.63661], [115.20737, 4.8256], [115.15092, 4.87604], [115.16236, 5.01011]]]] } },
      { type: "Feature", properties: { iso1A2: "BO", iso1A3: "BOL", iso1N3: "068", wikidata: "Q750", nameEn: "Bolivia", groups: ["005", "419", "019", "UN"], callingCodes: ["591"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-63.90248, -12.52544], [-64.22539, -12.45267], [-64.30708, -12.46398], [-64.99778, -11.98604], [-65.30027, -11.48749], [-65.28141, -10.86289], [-65.35402, -10.78685], [-65.37923, -10.35141], [-65.29019, -9.86253], [-65.40615, -9.63894], [-65.56244, -9.84266], [-65.68343, -9.75323], [-67.17784, -10.34016], [-68.71533, -11.14749], [-68.7651, -11.0496], [-68.75179, -11.03688], [-68.75265, -11.02383], [-68.74802, -11.00891], [-69.42792, -10.93451], [-69.47839, -10.95254], [-69.57156, -10.94555], [-68.98115, -11.8979], [-68.65044, -12.50689], [-68.85615, -12.87769], [-68.8864, -13.40792], [-69.05265, -13.68546], [-68.88135, -14.18639], [-69.36254, -14.94634], [-69.14856, -15.23478], [-69.40336, -15.61358], [-69.20291, -16.16668], [-69.09986, -16.22693], [-68.96238, -16.194], [-68.79464, -16.33272], [-68.98358, -16.42165], [-69.04027, -16.57214], [-69.00853, -16.66769], [-69.16896, -16.72233], [-69.62883, -17.28142], [-69.46863, -17.37466], [-69.46897, -17.4988], [-69.46623, -17.60518], [-69.34126, -17.72753], [-69.28671, -17.94844], [-69.07496, -18.03715], [-69.14807, -18.16893], [-69.07432, -18.28259], [-68.94987, -18.93302], [-68.87082, -19.06003], [-68.80602, -19.08355], [-68.61989, -19.27584], [-68.41218, -19.40499], [-68.66761, -19.72118], [-68.54611, -19.84651], [-68.57132, -20.03134], [-68.74273, -20.08817], [-68.7276, -20.46178], [-68.44023, -20.62701], [-68.55383, -20.7355], [-68.53957, -20.91542], [-68.40403, -20.94562], [-68.18816, -21.28614], [-67.85114, -22.87076], [-67.54284, -22.89771], [-67.18382, -22.81525], [-66.7298, -22.23644], [-66.29714, -22.08741], [-66.24077, -21.77837], [-66.03836, -21.84829], [-66.04832, -21.9187], [-65.9261, -21.93335], [-65.7467, -22.10105], [-65.61166, -22.09504], [-65.58694, -22.09794], [-65.57743, -22.07675], [-65.47435, -22.08908], [-64.99524, -22.08255], [-64.90014, -22.12136], [-64.67174, -22.18957], [-64.58888, -22.25035], [-64.4176, -22.67692], [-64.35108, -22.73282], [-64.31489, -22.88824], [-64.22918, -22.55807], [-63.93287, -21.99934], [-63.70963, -21.99934], [-63.68113, -22.0544], [-63.66482, -21.99918], [-62.81124, -21.9987], [-62.8078, -22.12534], [-62.64455, -22.25091], [-62.2757, -21.06657], [-62.26883, -20.55311], [-61.93912, -20.10053], [-61.73723, -19.63958], [-60.00638, -19.2981], [-59.06965, -19.29148], [-58.23216, -19.80058], [-58.16225, -20.16193], [-57.8496, -19.98346], [-58.14215, -19.76276], [-57.78463, -19.03259], [-57.71113, -19.03161], [-57.69134, -19.00544], [-57.71995, -18.97546], [-57.71995, -18.89573], [-57.76764, -18.90087], [-57.56807, -18.25655], [-57.48237, -18.24219], [-57.69877, -17.8431], [-57.73949, -17.56095], [-57.90082, -17.44555], [-57.99661, -17.5273], [-58.32935, -17.28195], [-58.5058, -16.80958], [-58.30918, -16.3699], [-58.32431, -16.25861], [-58.41506, -16.32636], [-60.16069, -16.26479], [-60.23797, -15.50267], [-60.58224, -15.09887], [-60.23968, -15.09515], [-60.27887, -14.63021], [-60.46037, -14.22496], [-60.48053, -13.77981], [-61.05527, -13.50054], [-61.81151, -13.49564], [-63.76259, -12.42952], [-63.90248, -12.52544]]]] } },
      { type: "Feature", properties: { iso1A2: "BQ", iso1A3: "BES", iso1N3: "535", wikidata: "Q27561", nameEn: "Caribbean Netherlands", country: "NL" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "BR", iso1A3: "BRA", iso1N3: "076", wikidata: "Q155", nameEn: "Brazil", groups: ["005", "419", "019", "UN"], callingCodes: ["55"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-59.69361, 4.34069], [-59.78878, 4.45637], [-60.15953, 4.53456], [-60.04189, 4.69801], [-59.98129, 5.07097], [-60.20944, 5.28754], [-60.32352, 5.21299], [-60.73204, 5.20931], [-60.5802, 4.94312], [-60.86539, 4.70512], [-60.98303, 4.54167], [-61.15703, 4.49839], [-61.31457, 4.54167], [-61.29675, 4.44216], [-61.48569, 4.43149], [-61.54629, 4.2822], [-62.13094, 4.08309], [-62.44822, 4.18621], [-62.57656, 4.04754], [-62.74411, 4.03331], [-62.7655, 3.73099], [-62.98296, 3.59935], [-63.21111, 3.96219], [-63.4464, 3.9693], [-63.42233, 3.89995], [-63.50611, 3.83592], [-63.67099, 4.01731], [-63.70218, 3.91417], [-63.86082, 3.94796], [-63.99183, 3.90172], [-64.14512, 4.12932], [-64.57648, 4.12576], [-64.72977, 4.28931], [-64.84028, 4.24665], [-64.48379, 3.7879], [-64.02908, 2.79797], [-64.0257, 2.48156], [-63.39114, 2.4317], [-63.39827, 2.16098], [-64.06135, 1.94722], [-64.08274, 1.64792], [-64.34654, 1.35569], [-64.38932, 1.5125], [-65.11657, 1.12046], [-65.57288, 0.62856], [-65.50158, 0.92086], [-65.6727, 1.01353], [-66.28507, 0.74585], [-66.85795, 1.22998], [-67.08222, 1.17441], [-67.15784, 1.80439], [-67.299, 1.87494], [-67.40488, 2.22258], [-67.9292, 1.82455], [-68.18632, 2.00091], [-68.26699, 1.83463], [-68.18128, 1.72881], [-69.38621, 1.70865], [-69.53746, 1.76408], [-69.83491, 1.69353], [-69.82987, 1.07864], [-69.26017, 1.06856], [-69.14422, 0.84172], [-69.20976, 0.57958], [-69.47696, 0.71065], [-70.04162, 0.55437], [-70.03658, -0.19681], [-69.603, -0.51947], [-69.59796, -0.75136], [-69.4215, -1.01853], [-69.43395, -1.42219], [-69.94708, -4.2431], [-70.00888, -4.37833], [-70.11305, -4.27281], [-70.19582, -4.3607], [-70.33236, -4.15214], [-70.77601, -4.15717], [-70.96814, -4.36915], [-71.87003, -4.51661], [-72.64391, -5.0391], [-72.83973, -5.14765], [-73.24579, -6.05764], [-73.12983, -6.43852], [-73.73986, -6.87919], [-73.77011, -7.28944], [-73.96938, -7.58465], [-73.65485, -7.77897], [-73.76576, -7.89884], [-72.92886, -9.04074], [-73.21498, -9.40904], [-72.72216, -9.41397], [-72.31883, -9.5184], [-72.14742, -9.98049], [-71.23394, -9.9668], [-70.53373, -9.42628], [-70.58453, -9.58303], [-70.55429, -9.76692], [-70.62487, -9.80666], [-70.64134, -11.0108], [-70.51395, -10.92249], [-70.38791, -11.07096], [-69.90896, -10.92744], [-69.57835, -10.94051], [-69.57156, -10.94555], [-69.47839, -10.95254], [-69.42792, -10.93451], [-68.74802, -11.00891], [-68.75265, -11.02383], [-68.75179, -11.03688], [-68.7651, -11.0496], [-68.71533, -11.14749], [-67.17784, -10.34016], [-65.68343, -9.75323], [-65.56244, -9.84266], [-65.40615, -9.63894], [-65.29019, -9.86253], [-65.37923, -10.35141], [-65.35402, -10.78685], [-65.28141, -10.86289], [-65.30027, -11.48749], [-64.99778, -11.98604], [-64.30708, -12.46398], [-64.22539, -12.45267], [-63.90248, -12.52544], [-63.76259, -12.42952], [-61.81151, -13.49564], [-61.05527, -13.50054], [-60.48053, -13.77981], [-60.46037, -14.22496], [-60.27887, -14.63021], [-60.23968, -15.09515], [-60.58224, -15.09887], [-60.23797, -15.50267], [-60.16069, -16.26479], [-58.41506, -16.32636], [-58.32431, -16.25861], [-58.30918, -16.3699], [-58.5058, -16.80958], [-58.32935, -17.28195], [-57.99661, -17.5273], [-57.90082, -17.44555], [-57.73949, -17.56095], [-57.69877, -17.8431], [-57.48237, -18.24219], [-57.56807, -18.25655], [-57.76764, -18.90087], [-57.71995, -18.89573], [-57.71995, -18.97546], [-57.69134, -19.00544], [-57.71113, -19.03161], [-57.78463, -19.03259], [-58.14215, -19.76276], [-57.8496, -19.98346], [-58.16225, -20.16193], [-57.84536, -20.93155], [-57.93492, -21.65505], [-57.88239, -21.6868], [-57.94642, -21.73799], [-57.98625, -22.09157], [-56.6508, -22.28387], [-56.5212, -22.11556], [-56.45893, -22.08072], [-56.23206, -22.25347], [-55.8331, -22.29008], [-55.74941, -22.46436], [-55.741, -22.52018], [-55.72366, -22.5519], [-55.6986, -22.56268], [-55.68742, -22.58407], [-55.62493, -22.62765], [-55.63849, -22.95122], [-55.5446, -23.22811], [-55.52288, -23.2595], [-55.5555, -23.28237], [-55.43585, -23.87157], [-55.44117, -23.9185], [-55.41784, -23.9657], [-55.12292, -23.99669], [-55.0518, -23.98666], [-55.02691, -23.97317], [-54.6238, -23.83078], [-54.32807, -24.01865], [-54.28207, -24.07305], [-54.4423, -25.13381], [-54.62033, -25.46026], [-54.60196, -25.48397], [-54.59509, -25.53696], [-54.59398, -25.59224], [-54.5502, -25.58915], [-54.52926, -25.62846], [-53.90831, -25.55513], [-53.83691, -25.94849], [-53.73511, -26.04211], [-53.73086, -26.05842], [-53.7264, -26.0664], [-53.73391, -26.07006], [-53.73968, -26.10012], [-53.65018, -26.19501], [-53.65237, -26.23289], [-53.63739, -26.2496], [-53.63881, -26.25075], [-53.64632, -26.24798], [-53.64186, -26.25976], [-53.64505, -26.28089], [-53.68269, -26.33359], [-53.73372, -26.6131], [-53.80144, -27.09844], [-54.15978, -27.2889], [-54.19062, -27.27639], [-54.19268, -27.30751], [-54.41888, -27.40882], [-54.50416, -27.48232], [-54.67657, -27.57214], [-54.90159, -27.63132], [-54.90805, -27.73149], [-55.1349, -27.89759], [-55.16872, -27.86224], [-55.33303, -27.94661], [-55.6262, -28.17124], [-55.65418, -28.18304], [-56.01729, -28.51223], [-56.00458, -28.60421], [-56.05265, -28.62651], [-56.54171, -29.11447], [-56.57295, -29.11357], [-56.62789, -29.18073], [-56.81251, -29.48154], [-57.09386, -29.74211], [-57.65132, -30.19229], [-57.22502, -30.26121], [-56.90236, -30.02578], [-56.49267, -30.39471], [-56.4795, -30.3899], [-56.4619, -30.38457], [-55.87388, -31.05053], [-55.58866, -30.84117], [-55.5634, -30.8686], [-55.55373, -30.8732], [-55.55218, -30.88193], [-55.54572, -30.89051], [-55.53431, -30.89714], [-55.53276, -30.90218], [-55.52712, -30.89997], [-55.51862, -30.89828], [-55.50841, -30.9027], [-55.50821, -30.91349], [-54.17384, -31.86168], [-53.76024, -32.0751], [-53.39572, -32.58596], [-53.37671, -32.57005], [-53.1111, -32.71147], [-53.53459, -33.16843], [-53.52794, -33.68908], [-53.44031, -33.69344], [-53.39593, -33.75169], [-53.37138, -33.74313], [-52.83257, -34.01481], [-28.34015, -20.99094], [-28.99601, 1.86593], [-51.35485, 4.8383], [-51.63798, 4.51394], [-51.61983, 4.14596], [-51.79599, 3.89336], [-51.82312, 3.85825], [-51.85573, 3.83427], [-52.31787, 3.17896], [-52.6906, 2.37298], [-52.96539, 2.1881], [-53.78743, 2.34412], [-54.16286, 2.10779], [-54.6084, 2.32856], [-55.01919, 2.564], [-55.71493, 2.40342], [-55.96292, 2.53188], [-56.13054, 2.27723], [-55.92159, 2.05236], [-55.89863, 1.89861], [-55.99278, 1.83137], [-56.47045, 1.95135], [-56.7659, 1.89509], [-57.07092, 1.95304], [-57.09109, 2.01854], [-57.23981, 1.95808], [-57.35073, 1.98327], [-57.55743, 1.69605], [-57.77281, 1.73344], [-57.97336, 1.64566], [-58.01873, 1.51966], [-58.33887, 1.58014], [-58.4858, 1.48399], [-58.53571, 1.29154], [-58.84229, 1.17749], [-58.92072, 1.31293], [-59.25583, 1.40559], [-59.74066, 1.87596], [-59.7264, 2.27497], [-59.91177, 2.36759], [-59.99733, 2.92312], [-59.79769, 3.37162], [-59.86899, 3.57089], [-59.51963, 3.91951], [-59.73353, 4.20399], [-59.69361, 4.34069]]]] } },
      { type: "Feature", properties: { iso1A2: "BS", iso1A3: "BHS", iso1N3: "044", wikidata: "Q778", nameEn: "The Bahamas", groups: ["029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 242"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-72.98446, 20.4801], [-71.70065, 25.7637], [-78.91214, 27.76553], [-80.65727, 23.71953], [-72.98446, 20.4801]]]] } },
      { type: "Feature", properties: { iso1A2: "BT", iso1A3: "BTN", iso1N3: "064", wikidata: "Q917", nameEn: "Bhutan", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["975"] }, geometry: { type: "MultiPolygon", coordinates: [[[[91.6469, 27.76358], [91.5629, 27.84823], [91.48973, 27.93903], [91.46327, 28.0064], [91.25779, 28.07509], [91.20019, 27.98715], [90.69894, 28.07784], [90.58842, 28.02838], [90.13387, 28.19178], [89.79762, 28.23979], [89.59525, 28.16433], [89.12825, 27.62502], [89.0582, 27.60985], [88.97213, 27.51671], [88.95355, 27.4106], [89.00216, 27.32532], [88.96947, 27.30319], [88.93678, 27.33777], [88.91901, 27.32483], [88.74219, 27.144], [88.86984, 27.10937], [88.8714, 26.97488], [88.92301, 26.99286], [88.95807, 26.92668], [89.09554, 26.89089], [89.12825, 26.81661], [89.1926, 26.81329], [89.37913, 26.86224], [89.38319, 26.85963], [89.3901, 26.84225], [89.42349, 26.83727], [89.63369, 26.74402], [89.86124, 26.73307], [90.04535, 26.72422], [90.30402, 26.85098], [90.39271, 26.90704], [90.48504, 26.8594], [90.67715, 26.77215], [91.50067, 26.79223], [91.83181, 26.87318], [92.05523, 26.8692], [92.11863, 26.893], [92.03457, 27.07334], [92.04702, 27.26861], [92.12019, 27.27829], [92.01132, 27.47352], [91.65007, 27.48287], [91.55819, 27.6144], [91.6469, 27.76358]]]] } },
      { type: "Feature", properties: { iso1A2: "BV", iso1A3: "BVT", iso1N3: "074", wikidata: "Q23408", nameEn: "Bouvet Island", country: "NO", groups: ["005", "419", "019", "UN"] }, geometry: { type: "MultiPolygon", coordinates: [[[[4.54042, -54.0949], [2.28941, -54.13089], [3.35353, -55.17558], [4.54042, -54.0949]]]] } },
      { type: "Feature", properties: { iso1A2: "BW", iso1A3: "BWA", iso1N3: "072", wikidata: "Q963", nameEn: "Botswana", groups: ["018", "202", "002", "UN"], driveSide: "left", callingCodes: ["267"] }, geometry: { type: "MultiPolygon", coordinates: [[[[25.26433, -17.79571], [25.16882, -17.78253], [25.05895, -17.84452], [24.95586, -17.79674], [24.73364, -17.89338], [24.71887, -17.9218], [24.6303, -17.9863], [24.57485, -18.07151], [24.40577, -17.95726], [24.19416, -18.01919], [23.61088, -18.4881], [23.29618, -17.99855], [23.0996, -18.00075], [21.45556, -18.31795], [20.99904, -18.31743], [20.99751, -22.00026], [19.99912, -21.99991], [19.99817, -24.76768], [20.02809, -24.78725], [20.03678, -24.81004], [20.29826, -24.94869], [20.64795, -25.47827], [20.86081, -26.14892], [20.61754, -26.4692], [20.63275, -26.78181], [20.68596, -26.9039], [20.87031, -26.80047], [21.13353, -26.86661], [21.37869, -26.82083], [21.69322, -26.86152], [21.7854, -26.79199], [21.77114, -26.69015], [21.83291, -26.65959], [21.90703, -26.66808], [22.06192, -26.61882], [22.21206, -26.3773], [22.41921, -26.23078], [22.56365, -26.19668], [22.70808, -25.99186], [22.86012, -25.50572], [23.03497, -25.29971], [23.47588, -25.29971], [23.9244, -25.64286], [24.18287, -25.62916], [24.36531, -25.773], [24.44703, -25.73021], [24.67319, -25.81749], [24.8946, -25.80723], [25.01718, -25.72507], [25.12266, -25.75931], [25.33076, -25.76616], [25.58543, -25.6343], [25.6643, -25.4491], [25.69661, -25.29284], [25.72702, -25.25503], [25.88571, -24.87802], [25.84295, -24.78661], [25.8515, -24.75727], [26.39409, -24.63468], [26.46346, -24.60358], [26.51667, -24.47219], [26.84165, -24.24885], [26.99749, -23.65486], [27.33768, -23.40917], [27.52393, -23.37952], [27.6066, -23.21894], [27.74154, -23.2137], [27.93539, -23.04941], [27.93729, -22.96194], [28.04752, -22.90243], [28.04562, -22.8394], [28.34874, -22.5694], [28.63287, -22.55887], [28.91889, -22.44299], [29.0151, -22.22907], [29.10881, -22.21202], [29.15268, -22.21399], [29.18974, -22.18599], [29.21955, -22.17771], [29.37703, -22.19581], [29.3533, -22.18363], [29.24648, -22.05967], [29.1974, -22.07472], [29.14501, -22.07275], [29.08495, -22.04867], [29.04108, -22.00563], [29.02191, -21.95665], [29.02191, -21.90647], [29.04023, -21.85864], [29.07763, -21.81877], [28.58114, -21.63455], [28.49942, -21.66634], [28.29416, -21.59037], [28.01669, -21.57624], [27.91407, -21.31621], [27.69171, -21.08409], [27.72972, -20.51735], [27.69361, -20.48531], [27.28865, -20.49873], [27.29831, -20.28935], [27.21278, -20.08244], [26.72246, -19.92707], [26.17227, -19.53709], [25.96226, -19.08152], [25.99837, -19.02943], [25.94326, -18.90362], [25.82353, -18.82808], [25.79217, -18.6355], [25.68859, -18.56165], [25.53465, -18.39041], [25.39972, -18.12691], [25.31799, -18.07091], [25.23909, -17.90832], [25.26433, -17.79571]]]] } },
      { type: "Feature", properties: { iso1A2: "BY", iso1A3: "BLR", iso1N3: "112", wikidata: "Q184", nameEn: "Belarus", groups: ["151", "150", "UN"], callingCodes: ["375"] }, geometry: { type: "MultiPolygon", coordinates: [[[[28.15217, 56.16964], [27.97865, 56.11849], [27.63065, 55.89687], [27.61683, 55.78558], [27.3541, 55.8089], [27.27804, 55.78299], [27.1559, 55.85032], [26.97153, 55.8102], [26.87448, 55.7172], [26.76872, 55.67658], [26.71802, 55.70645], [26.64888, 55.70515], [26.63231, 55.67968], [26.63167, 55.57887], [26.55094, 55.5093], [26.5522, 55.40277], [26.44937, 55.34832], [26.5709, 55.32572], [26.6714, 55.33902], [26.80929, 55.31642], [26.83266, 55.30444], [26.835, 55.28182], [26.73017, 55.24226], [26.72983, 55.21788], [26.68075, 55.19787], [26.69243, 55.16718], [26.54753, 55.14181], [26.51481, 55.16051], [26.46249, 55.12814], [26.35121, 55.1525], [26.30628, 55.12536], [26.23202, 55.10439], [26.26941, 55.08032], [26.20397, 54.99729], [26.13386, 54.98924], [26.05907, 54.94631], [25.99129, 54.95705], [25.89462, 54.93438], [25.74122, 54.80108], [25.75977, 54.57252], [25.68045, 54.5321], [25.64813, 54.48704], [25.62203, 54.4656], [25.63371, 54.42075], [25.5376, 54.33158], [25.55425, 54.31591], [25.68513, 54.31727], [25.78553, 54.23327], [25.78563, 54.15747], [25.71084, 54.16704], [25.64875, 54.1259], [25.54724, 54.14925], [25.51452, 54.17799], [25.56823, 54.25212], [25.509, 54.30267], [25.35559, 54.26544], [25.22705, 54.26271], [25.19199, 54.219], [25.0728, 54.13419], [24.991, 54.14241], [24.96894, 54.17589], [24.77131, 54.11091], [24.85311, 54.02862], [24.74279, 53.96663], [24.69185, 53.96543], [24.69652, 54.01901], [24.62275, 54.00217], [24.44411, 53.90076], [24.34128, 53.90076], [24.19638, 53.96405], [23.98837, 53.92554], [23.95098, 53.9613], [23.81309, 53.94205], [23.80543, 53.89558], [23.71726, 53.93379], [23.61677, 53.92691], [23.51284, 53.95052], [23.62004, 53.60942], [23.81995, 53.24131], [23.85657, 53.22923], [23.91393, 53.16469], [23.87548, 53.0831], [23.92184, 53.02079], [23.94689, 52.95919], [23.91805, 52.94016], [23.93763, 52.71332], [23.73615, 52.6149], [23.58296, 52.59868], [23.45112, 52.53774], [23.34141, 52.44845], [23.18196, 52.28812], [23.20071, 52.22848], [23.47859, 52.18215], [23.54314, 52.12148], [23.61, 52.11264], [23.64066, 52.07626], [23.68733, 51.9906], [23.61523, 51.92066], [23.62691, 51.78208], [23.53198, 51.74298], [23.57053, 51.55938], [23.56236, 51.53673], [23.62751, 51.50512], [23.6736, 51.50255], [23.60906, 51.62122], [23.7766, 51.66809], [23.91118, 51.63316], [23.8741, 51.59734], [23.99907, 51.58369], [24.13075, 51.66979], [24.3163, 51.75063], [24.29021, 51.80841], [24.37123, 51.88222], [24.98784, 51.91273], [25.20228, 51.97143], [25.46163, 51.92205], [25.73673, 51.91973], [25.80574, 51.94556], [25.83217, 51.92587], [26.00408, 51.92967], [26.19084, 51.86781], [26.39367, 51.87315], [26.46962, 51.80501], [26.69759, 51.82284], [26.80043, 51.75777], [26.9489, 51.73788], [26.99422, 51.76933], [27.20602, 51.77291], [27.20948, 51.66713], [27.26613, 51.65957], [27.24828, 51.60161], [27.47212, 51.61184], [27.51058, 51.5854], [27.55727, 51.63486], [27.71932, 51.60672], [27.67125, 51.50854], [27.76052, 51.47604], [27.85253, 51.62293], [27.91844, 51.61952], [27.95827, 51.56065], [28.10658, 51.57857], [28.23452, 51.66988], [28.37592, 51.54505], [28.47051, 51.59734], [28.64429, 51.5664], [28.69161, 51.44695], [28.73143, 51.46236], [28.75615, 51.41442], [28.78224, 51.45294], [28.76027, 51.48802], [28.81795, 51.55552], [28.95528, 51.59222], [28.99098, 51.56833], [29.1187, 51.65872], [29.16402, 51.64679], [29.20659, 51.56918], [29.25603, 51.57089], [29.25191, 51.49828], [29.32881, 51.37843], [29.42357, 51.4187], [29.49773, 51.39814], [29.54372, 51.48372], [29.7408, 51.53417], [29.77376, 51.4461], [30.17888, 51.51025], [30.34642, 51.42555], [30.36153, 51.33984], [30.56203, 51.25655], [30.64992, 51.35014], [30.51946, 51.59649], [30.68804, 51.82806], [30.76443, 51.89739], [30.90897, 52.00699], [30.95589, 52.07775], [31.13332, 52.1004], [31.25142, 52.04131], [31.38326, 52.12991], [31.7822, 52.11406], [31.77877, 52.18636], [31.6895, 52.1973], [31.70735, 52.26711], [31.57971, 52.32146], [31.62084, 52.33849], [31.61397, 52.48843], [31.56316, 52.51518], [31.63869, 52.55361], [31.50406, 52.69707], [31.57277, 52.71613], [31.592, 52.79011], [31.35667, 52.97854], [31.24147, 53.031], [31.32283, 53.04101], [31.33519, 53.08805], [31.3915, 53.09712], [31.36403, 53.13504], [31.40523, 53.21406], [31.56316, 53.19432], [31.62496, 53.22886], [31.787, 53.18033], [31.82373, 53.10042], [32.15368, 53.07594], [32.40773, 53.18856], [32.51725, 53.28431], [32.73257, 53.33494], [32.74968, 53.45597], [32.47777, 53.5548], [32.40499, 53.6656], [32.50112, 53.68594], [32.45717, 53.74039], [32.36663, 53.7166], [32.12621, 53.81586], [31.89137, 53.78099], [31.77028, 53.80015], [31.85019, 53.91801], [31.88744, 54.03653], [31.89599, 54.0837], [31.57002, 54.14535], [31.30791, 54.25315], [31.3177, 54.34067], [31.22945, 54.46585], [31.08543, 54.50361], [31.21399, 54.63113], [31.19339, 54.66947], [30.99187, 54.67046], [30.98226, 54.68872], [31.0262, 54.70698], [30.97127, 54.71967], [30.95479, 54.74346], [30.75165, 54.80699], [30.8264, 54.90062], [30.81759, 54.94064], [30.93144, 54.9585], [30.95754, 54.98609], [30.9081, 55.02232], [30.94243, 55.03964], [31.00972, 55.02783], [31.02071, 55.06167], [30.97369, 55.17134], [30.87944, 55.28223], [30.81946, 55.27931], [30.8257, 55.3313], [30.93144, 55.3914], [30.90123, 55.46621], [30.95204, 55.50667], [30.93419, 55.6185], [30.86003, 55.63169], [30.7845, 55.58514], [30.72957, 55.66268], [30.67464, 55.64176], [30.63344, 55.73079], [30.51037, 55.76568], [30.51346, 55.78982], [30.48257, 55.81066], [30.30987, 55.83592], [30.27776, 55.86819], [30.12136, 55.8358], [29.97975, 55.87281], [29.80672, 55.79569], [29.61446, 55.77716], [29.51283, 55.70294], [29.3604, 55.75862], [29.44692, 55.95978], [29.21717, 55.98971], [29.08299, 56.03427], [28.73418, 55.97131], [28.63668, 56.07262], [28.68337, 56.10173], [28.5529, 56.11705], [28.43068, 56.09407], [28.37987, 56.11399], [28.36888, 56.05805], [28.30571, 56.06035], [28.15217, 56.16964]]]] } },
      { type: "Feature", properties: { iso1A2: "BZ", iso1A3: "BLZ", iso1N3: "084", wikidata: "Q242", nameEn: "Belize", groups: ["013", "003", "419", "019", "UN"], roadSpeedUnit: "mph", callingCodes: ["501"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-88.3268, 18.49048], [-88.48242, 18.49164], [-88.71505, 18.0707], [-88.8716, 17.89535], [-89.03839, 18.0067], [-89.15105, 17.95104], [-89.14985, 17.81563], [-89.15025, 17.04813], [-89.22683, 15.88619], [-89.17418, 15.90898], [-89.02415, 15.9063], [-88.95358, 15.88698], [-88.40779, 16.09624], [-86.92368, 17.61462], [-87.84815, 18.18511], [-87.85693, 18.18266], [-87.86657, 18.19971], [-87.87604, 18.18313], [-87.90671, 18.15213], [-88.03165, 18.16657], [-88.03238, 18.41778], [-88.26593, 18.47617], [-88.29909, 18.47591], [-88.3268, 18.49048]]]] } },
      { type: "Feature", properties: { iso1A2: "CA", iso1A3: "CAN", iso1N3: "124", wikidata: "Q16", nameEn: "Canada", groups: ["021", "003", "019", "UN"], callingCodes: ["1"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-67.20349, 45.1722], [-67.19603, 45.16771], [-67.15965, 45.16179], [-67.11316, 45.11176], [-67.0216, 44.95333], [-66.96824, 44.90965], [-66.98249, 44.87071], [-66.96824, 44.83078], [-66.93432, 44.82597], [-67.16117, 44.20069], [-61.98255, 37.34815], [-56.27503, 47.39728], [-53.12387, 41.40385], [-46.37635, 57.3249], [-77.52957, 77.23408], [-68.21821, 80.48551], [-49.33696, 84.57952], [-140.97446, 84.39275], [-141.00116, 60.30648], [-140.5227, 60.22077], [-140.45648, 60.30919], [-139.98024, 60.18027], [-139.68991, 60.33693], [-139.05831, 60.35205], [-139.20603, 60.08896], [-139.05365, 59.99655], [-138.71149, 59.90728], [-138.62145, 59.76431], [-137.60623, 59.24465], [-137.4925, 58.89415], [-136.82619, 59.16198], [-136.52365, 59.16752], [-136.47323, 59.46617], [-136.33727, 59.44466], [-136.22381, 59.55526], [-136.31566, 59.59083], [-135.48007, 59.79937], [-135.03069, 59.56208], [-135.00267, 59.28745], [-134.7047, 59.2458], [-134.55699, 59.1297], [-134.48059, 59.13231], [-134.27175, 58.8634], [-133.84645, 58.73543], [-133.38523, 58.42773], [-131.8271, 56.62247], [-130.77769, 56.36185], [-130.33965, 56.10849], [-130.10173, 56.12178], [-130.00093, 56.00325], [-130.00857, 55.91344], [-130.15373, 55.74895], [-129.97513, 55.28029], [-130.08035, 55.21556], [-130.18765, 55.07744], [-130.27203, 54.97174], [-130.44184, 54.85377], [-130.64499, 54.76912], [-130.61931, 54.70835], [-133.92876, 54.62289], [-133.36909, 48.51151], [-125.03842, 48.53282], [-123.50039, 48.21223], [-123.15614, 48.35395], [-123.26565, 48.6959], [-123.0093, 48.76586], [-123.0093, 48.83186], [-123.32163, 49.00419], [-95.15355, 48.9996], [-95.15357, 49.384], [-95.12903, 49.37056], [-95.05825, 49.35311], [-95.01419, 49.35647], [-94.99532, 49.36579], [-94.95681, 49.37035], [-94.85381, 49.32492], [-94.8159, 49.32299], [-94.82487, 49.29483], [-94.77355, 49.11998], [-94.75017, 49.09931], [-94.687, 48.84077], [-94.70087, 48.8339], [-94.70486, 48.82365], [-94.69669, 48.80918], [-94.69335, 48.77883], [-94.58903, 48.71803], [-94.54885, 48.71543], [-94.53826, 48.70216], [-94.44258, 48.69223], [-94.4174, 48.71049], [-94.27153, 48.70232], [-94.25172, 48.68404], [-94.25104, 48.65729], [-94.23215, 48.65202], [-93.85769, 48.63284], [-93.83288, 48.62745], [-93.80676, 48.58232], [-93.80939, 48.52439], [-93.79267, 48.51631], [-93.66382, 48.51845], [-93.47022, 48.54357], [-93.44472, 48.59147], [-93.40693, 48.60948], [-93.39758, 48.60364], [-93.3712, 48.60599], [-93.33946, 48.62787], [-93.25391, 48.64266], [-92.94973, 48.60866], [-92.7287, 48.54005], [-92.6342, 48.54133], [-92.62747, 48.50278], [-92.69927, 48.49573], [-92.71323, 48.46081], [-92.65606, 48.43471], [-92.50712, 48.44921], [-92.45588, 48.40624], [-92.48147, 48.36609], [-92.37185, 48.22259], [-92.27167, 48.25046], [-92.30939, 48.31251], [-92.26662, 48.35651], [-92.202, 48.35252], [-92.14732, 48.36578], [-92.05339, 48.35958], [-91.98929, 48.25409], [-91.86125, 48.21278], [-91.71231, 48.19875], [-91.70451, 48.11805], [-91.55649, 48.10611], [-91.58025, 48.04339], [-91.45829, 48.07454], [-91.43248, 48.04912], [-91.25025, 48.08522], [-91.08016, 48.18096], [-90.87588, 48.2484], [-90.75045, 48.09143], [-90.56444, 48.12184], [-90.56312, 48.09488], [-90.07418, 48.11043], [-89.89974, 47.98109], [-89.77248, 48.02607], [-89.57972, 48.00023], [-89.48837, 48.01412], [-88.37033, 48.30586], [-84.85871, 46.88881], [-84.55635, 46.45974], [-84.47607, 46.45225], [-84.4481, 46.48972], [-84.42101, 46.49853], [-84.34174, 46.50683], [-84.29893, 46.49127], [-84.26351, 46.49508], [-84.2264, 46.53337], [-84.1945, 46.54061], [-84.17723, 46.52753], [-84.12885, 46.53068], [-84.11196, 46.50248], [-84.13451, 46.39218], [-84.11254, 46.32329], [-84.11615, 46.2681], [-84.09756, 46.25512], [-84.1096, 46.23987], [-83.95399, 46.05634], [-83.90453, 46.05922], [-83.83329, 46.12169], [-83.57017, 46.105], [-83.43746, 45.99749], [-83.59589, 45.82131], [-82.48419, 45.30225], [-82.42469, 42.992], [-82.4146, 42.97626], [-82.4253, 42.95423], [-82.45331, 42.93139], [-82.4826, 42.8068], [-82.46613, 42.76615], [-82.51063, 42.66025], [-82.51858, 42.611], [-82.57583, 42.5718], [-82.58873, 42.54984], [-82.64242, 42.55594], [-82.82964, 42.37355], [-83.02253, 42.33045], [-83.07837, 42.30978], [-83.09837, 42.28877], [-83.12724, 42.2376], [-83.14962, 42.04089], [-83.11184, 41.95671], [-82.67862, 41.67615], [-78.93684, 42.82887], [-78.90712, 42.89733], [-78.90905, 42.93022], [-78.93224, 42.95229], [-78.96312, 42.95509], [-78.98126, 42.97], [-79.02074, 42.98444], [-79.02424, 43.01983], [-78.99941, 43.05612], [-79.01055, 43.06659], [-79.07486, 43.07845], [-79.05671, 43.10937], [-79.06881, 43.12029], [-79.0427, 43.13934], [-79.04652, 43.16396], [-79.05384, 43.17418], [-79.05002, 43.20133], [-79.05544, 43.21224], [-79.05512, 43.25375], [-79.06921, 43.26183], [-79.25796, 43.54052], [-76.79706, 43.63099], [-76.43859, 44.09393], [-76.35324, 44.13493], [-76.31222, 44.19894], [-76.244, 44.19643], [-76.1664, 44.23051], [-76.16285, 44.28262], [-76.00018, 44.34896], [-75.95947, 44.34463], [-75.8217, 44.43176], [-75.76813, 44.51537], [-75.41441, 44.76614], [-75.2193, 44.87821], [-75.01363, 44.95608], [-74.99101, 44.98051], [-74.8447, 45.00606], [-74.66689, 45.00646], [-74.32699, 44.99029], [-73.35025, 45.00942], [-71.50067, 45.01357], [-71.48735, 45.07784], [-71.42778, 45.12624], [-71.40364, 45.21382], [-71.44252, 45.2361], [-71.37133, 45.24624], [-71.29371, 45.29996], [-71.22338, 45.25184], [-71.19723, 45.25438], [-71.14568, 45.24128], [-71.08364, 45.30623], [-71.01866, 45.31573], [-71.0107, 45.34819], [-70.95193, 45.33895], [-70.91169, 45.29849], [-70.89864, 45.2398], [-70.84816, 45.22698], [-70.80236, 45.37444], [-70.82638, 45.39828], [-70.78372, 45.43269], [-70.65383, 45.37592], [-70.62518, 45.42286], [-70.72651, 45.49771], [-70.68516, 45.56964], [-70.54019, 45.67291], [-70.38934, 45.73215], [-70.41523, 45.79497], [-70.25976, 45.89675], [-70.24694, 45.95138], [-70.31025, 45.96424], [-70.23855, 46.1453], [-70.29078, 46.18832], [-70.18547, 46.35357], [-70.05812, 46.41768], [-69.99966, 46.69543], [-69.22119, 47.46461], [-69.05148, 47.42012], [-69.05073, 47.30076], [-69.05039, 47.2456], [-68.89222, 47.1807], [-68.70125, 47.24399], [-68.60575, 47.24659], [-68.57914, 47.28431], [-68.38332, 47.28723], [-68.37458, 47.35851], [-68.23244, 47.35712], [-67.94843, 47.1925], [-67.87993, 47.10377], [-67.78578, 47.06473], [-67.78111, 45.9392], [-67.75196, 45.91814], [-67.80961, 45.87531], [-67.75654, 45.82324], [-67.80653, 45.80022], [-67.80705, 45.69528], [-67.6049, 45.60725], [-67.43815, 45.59162], [-67.42144, 45.50584], [-67.50578, 45.48971], [-67.42394, 45.37969], [-67.48201, 45.27351], [-67.34927, 45.122], [-67.29754, 45.14865], [-67.29748, 45.18173], [-67.27039, 45.1934], [-67.22751, 45.16344], [-67.20349, 45.1722]]]] } },
      { type: "Feature", properties: { iso1A2: "CC", iso1A3: "CCK", iso1N3: "166", wikidata: "Q36004", nameEn: "Cocos (Keeling) Islands", country: "AU", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["61"] }, geometry: { type: "MultiPolygon", coordinates: [[[[96.61846, -10.82438], [96.02343, -12.68334], [97.93979, -12.33309], [96.61846, -10.82438]]]] } },
      { type: "Feature", properties: { iso1A2: "CD", iso1A3: "COD", iso1N3: "180", wikidata: "Q974", nameEn: "Democratic Republic of the Congo", aliases: ["ZR"], groups: ["017", "202", "002", "UN"], callingCodes: ["243"] }, geometry: { type: "MultiPolygon", coordinates: [[[[27.44012, 5.07349], [27.09575, 5.22305], [26.93064, 5.13535], [26.85579, 5.03887], [26.74572, 5.10685], [26.48595, 5.04984], [26.13371, 5.25594], [25.86073, 5.19455], [25.53271, 5.37431], [25.34558, 5.29101], [25.31256, 5.03668], [24.71816, 4.90509], [24.46719, 5.0915], [23.38847, 4.60013], [22.94817, 4.82392], [22.89094, 4.79321], [22.84691, 4.69887], [22.78526, 4.71423], [22.6928, 4.47285], [22.60915, 4.48821], [22.5431, 4.22041], [22.45504, 4.13039], [22.27682, 4.11347], [22.10721, 4.20723], [21.6405, 4.317], [21.55904, 4.25553], [21.25744, 4.33676], [21.21341, 4.29285], [21.11214, 4.33895], [21.08793, 4.39603], [20.90383, 4.44877], [20.60184, 4.42394], [18.62755, 3.47564], [18.63857, 3.19342], [18.10683, 2.26876], [18.08034, 1.58553], [17.85887, 1.04327], [17.86989, 0.58873], [17.95255, 0.48128], [17.93877, 0.32424], [17.81204, 0.23884], [17.66051, -0.26535], [17.72112, -0.52707], [17.32438, -0.99265], [16.97999, -1.12762], [16.70724, -1.45815], [16.50336, -1.8795], [16.16173, -2.16586], [16.22785, -2.59528], [16.1755, -3.25014], [16.21407, -3.2969], [15.89448, -3.9513], [15.53081, -4.042], [15.48121, -4.22062], [15.41785, -4.28381], [15.32693, -4.27282], [15.25411, -4.31121], [15.1978, -4.32388], [14.83101, -4.80838], [14.67948, -4.92093], [14.5059, -4.84956], [14.41499, -4.8825], [14.37366, -4.56125], [14.47284, -4.42941], [14.3957, -4.36623], [14.40672, -4.28381], [13.9108, -4.50906], [13.81162, -4.41842], [13.71794, -4.44864], [13.70417, -4.72601], [13.50305, -4.77818], [13.41764, -4.89897], [13.11182, -4.5942], [13.09648, -4.63739], [13.11195, -4.67745], [12.8733, -4.74346], [12.70868, -4.95505], [12.63465, -4.94632], [12.60251, -5.01715], [12.46297, -5.09408], [12.49815, -5.14058], [12.51589, -5.1332], [12.53586, -5.14658], [12.53599, -5.1618], [12.52301, -5.17481], [12.52318, -5.74353], [12.26557, -5.74031], [12.20376, -5.76338], [11.95767, -5.94705], [12.42245, -6.07585], [13.04371, -5.87078], [16.55507, -5.85631], [16.96282, -7.21787], [17.5828, -8.13784], [18.33635, -8.00126], [19.33698, -7.99743], [19.5469, -7.00195], [20.30218, -6.98955], [20.31846, -6.91953], [20.61689, -6.90876], [20.56263, -7.28566], [21.79824, -7.29628], [21.84856, -9.59871], [22.19039, -9.94628], [22.32604, -10.76291], [22.17954, -10.85884], [22.25951, -11.24911], [22.54205, -11.05784], [23.16602, -11.10577], [23.45631, -10.946], [23.86868, -11.02856], [24.00027, -10.89356], [24.34528, -11.06816], [24.42612, -11.44975], [25.34069, -11.19707], [25.33058, -11.65767], [26.01777, -11.91488], [26.88687, -12.01868], [27.04351, -11.61312], [27.22541, -11.60323], [27.21025, -11.76157], [27.59932, -12.22123], [28.33199, -12.41375], [29.01918, -13.41353], [29.60531, -13.21685], [29.65078, -13.41844], [29.81551, -13.44683], [29.8139, -12.14898], [29.48404, -12.23604], [29.4992, -12.43843], [29.18592, -12.37921], [28.48357, -11.87532], [28.37241, -11.57848], [28.65032, -10.65133], [28.62795, -9.92942], [28.68532, -9.78], [28.56208, -9.49122], [28.51627, -9.44726], [28.52636, -9.35379], [28.36562, -9.30091], [28.38526, -9.23393], [28.9711, -8.66935], [28.88917, -8.4831], [30.79243, -8.27382], [30.2567, -7.14121], [29.52552, -6.2731], [29.43673, -4.44845], [29.23708, -3.75856], [29.21463, -3.3514], [29.25633, -3.05471], [29.17258, -2.99385], [29.16037, -2.95457], [29.09797, -2.91935], [29.09119, -2.87871], [29.0505, -2.81774], [29.00404, -2.81978], [29.00167, -2.78523], [29.04081, -2.7416], [29.00357, -2.70596], [28.94346, -2.69124], [28.89793, -2.66111], [28.90226, -2.62385], [28.89288, -2.55848], [28.87943, -2.55165], [28.86193, -2.53185], [28.86209, -2.5231], [28.87497, -2.50887], [28.88846, -2.50493], [28.89342, -2.49017], [28.89132, -2.47557], [28.86846, -2.44866], [28.86826, -2.41888], [28.89601, -2.37321], [28.95642, -2.37321], [29.00051, -2.29001], [29.105, -2.27043], [29.17562, -2.12278], [29.11847, -1.90576], [29.24458, -1.69663], [29.24323, -1.66826], [29.36322, -1.50887], [29.45038, -1.5054], [29.53062, -1.40499], [29.59061, -1.39016], [29.58388, -0.89821], [29.63006, -0.8997], [29.62708, -0.71055], [29.67176, -0.55714], [29.67474, -0.47969], [29.65091, -0.46777], [29.72687, -0.08051], [29.7224, 0.07291], [29.77454, 0.16675], [29.81922, 0.16824], [29.87284, 0.39166], [29.97413, 0.52124], [29.95477, 0.64486], [29.98307, 0.84295], [30.1484, 0.89805], [30.22139, 0.99635], [30.24671, 1.14974], [30.48503, 1.21675], [31.30127, 2.11006], [31.28042, 2.17853], [31.20148, 2.2217], [31.1985, 2.29462], [31.12104, 2.27676], [31.07934, 2.30207], [31.06593, 2.35862], [30.96911, 2.41071], [30.91102, 2.33332], [30.83059, 2.42559], [30.74271, 2.43601], [30.75612, 2.5863], [30.8857, 2.83923], [30.8574, 2.9508], [30.77101, 3.04897], [30.84251, 3.26908], [30.93486, 3.40737], [30.94081, 3.50847], [30.85153, 3.48867], [30.85997, 3.5743], [30.80713, 3.60506], [30.78512, 3.67097], [30.56277, 3.62703], [30.57378, 3.74567], [30.55396, 3.84451], [30.47691, 3.83353], [30.27658, 3.95653], [30.22374, 3.93896], [30.1621, 4.10586], [30.06964, 4.13221], [29.79666, 4.37809], [29.82087, 4.56246], [29.49726, 4.7007], [29.43341, 4.50101], [29.22207, 4.34297], [29.03054, 4.48784], [28.8126, 4.48784], [28.6651, 4.42638], [28.20719, 4.35614], [27.79551, 4.59976], [27.76469, 4.79284], [27.65462, 4.89375], [27.56656, 4.89375], [27.44012, 5.07349]]]] } },
      { type: "Feature", properties: { iso1A2: "CF", iso1A3: "CAF", iso1N3: "140", wikidata: "Q929", nameEn: "Central African Republic", groups: ["017", "202", "002", "UN"], callingCodes: ["236"] }, geometry: { type: "MultiPolygon", coordinates: [[[[22.87758, 10.91915], [22.45889, 11.00246], [21.72139, 10.64136], [21.71479, 10.29932], [21.63553, 10.217], [21.52766, 10.2105], [21.34934, 9.95907], [21.26348, 9.97642], [20.82979, 9.44696], [20.36748, 9.11019], [19.06421, 9.00367], [18.86388, 8.87971], [19.11044, 8.68172], [18.79783, 8.25929], [18.67455, 8.22226], [18.62612, 8.14163], [18.64153, 8.08714], [18.6085, 8.05009], [18.02731, 8.01085], [17.93926, 7.95853], [17.67288, 7.98905], [16.8143, 7.53971], [16.6668, 7.67281], [16.658, 7.75353], [16.59415, 7.76444], [16.58315, 7.88657], [16.41583, 7.77971], [16.40703, 7.68809], [15.79942, 7.44149], [15.73118, 7.52006], [15.49743, 7.52179], [15.23397, 7.25135], [15.04717, 6.77085], [14.96311, 6.75693], [14.79966, 6.39043], [14.80122, 6.34866], [14.74206, 6.26356], [14.56149, 6.18928], [14.43073, 6.08867], [14.42917, 6.00508], [14.49455, 5.91683], [14.60974, 5.91838], [14.62375, 5.70466], [14.58951, 5.59777], [14.62531, 5.51411], [14.52724, 5.28319], [14.57083, 5.23979], [14.65489, 5.21343], [14.73383, 4.6135], [15.00825, 4.41458], [15.08609, 4.30282], [15.10644, 4.1362], [15.17482, 4.05131], [15.07686, 4.01805], [15.73522, 3.24348], [15.77725, 3.26835], [16.05449, 3.02306], [16.08252, 2.45708], [16.19357, 2.21537], [16.50126, 2.84739], [16.46701, 2.92512], [16.57598, 3.47999], [16.68283, 3.54257], [17.01746, 3.55136], [17.35649, 3.63045], [17.46876, 3.70515], [17.60966, 3.63705], [17.83421, 3.61068], [17.85842, 3.53378], [18.05656, 3.56893], [18.14902, 3.54476], [18.17323, 3.47665], [18.24148, 3.50302], [18.2723, 3.57992], [18.39558, 3.58212], [18.49245, 3.63924], [18.58711, 3.49423], [18.62755, 3.47564], [20.60184, 4.42394], [20.90383, 4.44877], [21.08793, 4.39603], [21.11214, 4.33895], [21.21341, 4.29285], [21.25744, 4.33676], [21.55904, 4.25553], [21.6405, 4.317], [22.10721, 4.20723], [22.27682, 4.11347], [22.45504, 4.13039], [22.5431, 4.22041], [22.60915, 4.48821], [22.6928, 4.47285], [22.78526, 4.71423], [22.84691, 4.69887], [22.89094, 4.79321], [22.94817, 4.82392], [23.38847, 4.60013], [24.46719, 5.0915], [24.71816, 4.90509], [25.31256, 5.03668], [25.34558, 5.29101], [25.53271, 5.37431], [25.86073, 5.19455], [26.13371, 5.25594], [26.48595, 5.04984], [26.74572, 5.10685], [26.85579, 5.03887], [26.93064, 5.13535], [27.09575, 5.22305], [27.44012, 5.07349], [27.26886, 5.25876], [27.23017, 5.37167], [27.28621, 5.56382], [27.22705, 5.62889], [27.22705, 5.71254], [26.51721, 6.09655], [26.58259, 6.1987], [26.32729, 6.36272], [26.38022, 6.63493], [25.90076, 7.09549], [25.37461, 7.33024], [25.35281, 7.42595], [25.20337, 7.50312], [25.20649, 7.61115], [25.29214, 7.66675], [25.25319, 7.8487], [24.98855, 7.96588], [24.85156, 8.16933], [24.35965, 8.26177], [24.13238, 8.36959], [24.25691, 8.69288], [23.51905, 8.71749], [23.59065, 8.99743], [23.44744, 8.99128], [23.4848, 9.16959], [23.56263, 9.19418], [23.64358, 9.28637], [23.64981, 9.44303], [23.62179, 9.53823], [23.69155, 9.67566], [23.67164, 9.86923], [23.3128, 10.45214], [23.02221, 10.69235], [22.87758, 10.91915]]]] } },
      { type: "Feature", properties: { iso1A2: "CG", iso1A3: "COG", iso1N3: "178", wikidata: "Q971", nameEn: "Republic of the Congo", groups: ["017", "202", "002", "UN"], callingCodes: ["242"] }, geometry: { type: "MultiPolygon", coordinates: [[[[18.62755, 3.47564], [18.58711, 3.49423], [18.49245, 3.63924], [18.39558, 3.58212], [18.2723, 3.57992], [18.24148, 3.50302], [18.17323, 3.47665], [18.14902, 3.54476], [18.05656, 3.56893], [17.85842, 3.53378], [17.83421, 3.61068], [17.60966, 3.63705], [17.46876, 3.70515], [17.35649, 3.63045], [17.01746, 3.55136], [16.68283, 3.54257], [16.57598, 3.47999], [16.46701, 2.92512], [16.50126, 2.84739], [16.19357, 2.21537], [16.15568, 2.18955], [16.08563, 2.19733], [16.05294, 1.9811], [16.14634, 1.70259], [16.02647, 1.65591], [16.02959, 1.76483], [15.48942, 1.98265], [15.34776, 1.91264], [15.22634, 2.03243], [15.00996, 1.98887], [14.61145, 2.17866], [13.29457, 2.16106], [13.13461, 1.57238], [13.25447, 1.32339], [13.15519, 1.23368], [13.89582, 1.4261], [14.25186, 1.39842], [14.48179, 0.9152], [14.26066, 0.57255], [14.10909, 0.58563], [13.88648, 0.26652], [13.90632, -0.2287], [14.06862, -0.20826], [14.2165, -0.38261], [14.41887, -0.44799], [14.52569, -0.57818], [14.41838, -1.89412], [14.25932, -1.97624], [14.23518, -2.15671], [14.16202, -2.23916], [14.23829, -2.33715], [14.10442, -2.49268], [13.85846, -2.46935], [13.92073, -2.35581], [13.75884, -2.09293], [13.47977, -2.43224], [13.02759, -2.33098], [12.82172, -1.91091], [12.61312, -1.8129], [12.44656, -1.92025], [12.47925, -2.32626], [12.04895, -2.41704], [11.96866, -2.33559], [11.74605, -2.39936], [11.57637, -2.33379], [11.64487, -2.61865], [11.5359, -2.85654], [11.64798, -2.81146], [11.80365, -3.00424], [11.70558, -3.0773], [11.70227, -3.17465], [11.96554, -3.30267], [11.8318, -3.5812], [11.92719, -3.62768], [11.87083, -3.71571], [11.68608, -3.68942], [11.57949, -3.52798], [11.48764, -3.51089], [11.22301, -3.69888], [11.12647, -3.94169], [10.75913, -4.39519], [11.50888, -5.33417], [12.00924, -5.02627], [12.16068, -4.90089], [12.20901, -4.75642], [12.25587, -4.79437], [12.32324, -4.78415], [12.40964, -4.60609], [12.64835, -4.55937], [12.76844, -4.38709], [12.87096, -4.40315], [12.91489, -4.47907], [13.09648, -4.63739], [13.11182, -4.5942], [13.41764, -4.89897], [13.50305, -4.77818], [13.70417, -4.72601], [13.71794, -4.44864], [13.81162, -4.41842], [13.9108, -4.50906], [14.40672, -4.28381], [14.3957, -4.36623], [14.47284, -4.42941], [14.37366, -4.56125], [14.41499, -4.8825], [14.5059, -4.84956], [14.67948, -4.92093], [14.83101, -4.80838], [15.1978, -4.32388], [15.25411, -4.31121], [15.32693, -4.27282], [15.41785, -4.28381], [15.48121, -4.22062], [15.53081, -4.042], [15.89448, -3.9513], [16.21407, -3.2969], [16.1755, -3.25014], [16.22785, -2.59528], [16.16173, -2.16586], [16.50336, -1.8795], [16.70724, -1.45815], [16.97999, -1.12762], [17.32438, -0.99265], [17.72112, -0.52707], [17.66051, -0.26535], [17.81204, 0.23884], [17.93877, 0.32424], [17.95255, 0.48128], [17.86989, 0.58873], [17.85887, 1.04327], [18.08034, 1.58553], [18.10683, 2.26876], [18.63857, 3.19342], [18.62755, 3.47564]]]] } },
      { type: "Feature", properties: { iso1A2: "CH", iso1A3: "CHE", iso1N3: "756", wikidata: "Q39", nameEn: "Switzerland", groups: ["155", "150", "UN"], callingCodes: ["41"] }, geometry: { type: "MultiPolygon", coordinates: [[[[8.72809, 47.69282], [8.72617, 47.69651], [8.73671, 47.7169], [8.70543, 47.73121], [8.74251, 47.75168], [8.71778, 47.76571], [8.68985, 47.75686], [8.68022, 47.78599], [8.65292, 47.80066], [8.64425, 47.76398], [8.62408, 47.7626], [8.61657, 47.79998], [8.56415, 47.80633], [8.56814, 47.78001], [8.48868, 47.77215], [8.45771, 47.7493], [8.44807, 47.72426], [8.40569, 47.69855], [8.4211, 47.68407], [8.40473, 47.67499], [8.41346, 47.66676], [8.42264, 47.66667], [8.44711, 47.65379], [8.4667, 47.65747], [8.46605, 47.64103], [8.49656, 47.64709], [8.5322, 47.64687], [8.52801, 47.66059], [8.56141, 47.67088], [8.57683, 47.66158], [8.6052, 47.67258], [8.61113, 47.66332], [8.62884, 47.65098], [8.62049, 47.63757], [8.60412, 47.63735], [8.61471, 47.64514], [8.60701, 47.65271], [8.59545, 47.64298], [8.60348, 47.61204], [8.57586, 47.59537], [8.55756, 47.62394], [8.51686, 47.63476], [8.50747, 47.61897], [8.45578, 47.60121], [8.46637, 47.58389], [8.48949, 47.588], [8.49431, 47.58107], [8.43235, 47.56617], [8.39477, 47.57826], [8.38273, 47.56608], [8.32735, 47.57133], [8.30277, 47.58607], [8.29524, 47.5919], [8.29722, 47.60603], [8.2824, 47.61225], [8.26313, 47.6103], [8.25863, 47.61571], [8.23809, 47.61204], [8.22577, 47.60385], [8.22011, 47.6181], [8.20617, 47.62141], [8.19378, 47.61636], [8.1652, 47.5945], [8.14947, 47.59558], [8.13823, 47.59147], [8.13662, 47.58432], [8.11543, 47.5841], [8.10395, 47.57918], [8.10002, 47.56504], [8.08557, 47.55768], [8.06663, 47.56374], [8.04383, 47.55443], [8.02136, 47.55096], [8.00113, 47.55616], [7.97581, 47.55493], [7.95682, 47.55789], [7.94494, 47.54511], [7.91251, 47.55031], [7.90673, 47.57674], [7.88664, 47.58854], [7.84412, 47.5841], [7.81901, 47.58798], [7.79486, 47.55691], [7.75261, 47.54599], [7.71961, 47.54219], [7.69642, 47.53297], [7.68101, 47.53232], [7.6656, 47.53752], [7.66174, 47.54554], [7.65083, 47.54662], [7.63338, 47.56256], [7.67655, 47.56435], [7.68904, 47.57133], [7.67115, 47.5871], [7.68486, 47.59601], [7.69385, 47.60099], [7.68229, 47.59905], [7.67395, 47.59212], [7.64599, 47.59695], [7.64213, 47.5944], [7.64309, 47.59151], [7.61929, 47.57683], [7.60459, 47.57869], [7.60523, 47.58519], [7.58945, 47.59017], [7.58386, 47.57536], [7.56684, 47.57785], [7.56548, 47.57617], [7.55689, 47.57232], [7.55652, 47.56779], [7.53634, 47.55553], [7.52831, 47.55347], [7.51723, 47.54578], [7.50873, 47.54546], [7.49691, 47.53821], [7.50588, 47.52856], [7.51904, 47.53515], [7.53199, 47.5284], [7.5229, 47.51644], [7.49804, 47.51798], [7.51076, 47.49651], [7.47534, 47.47932], [7.43356, 47.49712], [7.42923, 47.48628], [7.4583, 47.47216], [7.4462, 47.46264], [7.43088, 47.45846], [7.40308, 47.43638], [7.35603, 47.43432], [7.33526, 47.44186], [7.24669, 47.4205], [7.17026, 47.44312], [7.19583, 47.49455], [7.16249, 47.49025], [7.12781, 47.50371], [7.07425, 47.48863], [7.0231, 47.50522], [6.98425, 47.49432], [7.0024, 47.45264], [6.93953, 47.43388], [6.93744, 47.40714], [6.88542, 47.37262], [6.87959, 47.35335], [7.03125, 47.36996], [7.0564, 47.35134], [7.05305, 47.33304], [6.94316, 47.28747], [6.95108, 47.26428], [6.9508, 47.24338], [6.8489, 47.15933], [6.76788, 47.1208], [6.68823, 47.06616], [6.71531, 47.0494], [6.43341, 46.92703], [6.46456, 46.88865], [6.43216, 46.80336], [6.45209, 46.77502], [6.38351, 46.73171], [6.27135, 46.68251], [6.11084, 46.57649], [6.1567, 46.54402], [6.07269, 46.46244], [6.08427, 46.44305], [6.06407, 46.41676], [6.09926, 46.40768], [6.15016, 46.3778], [6.15985, 46.37721], [6.16987, 46.36759], [6.15738, 46.3491], [6.13876, 46.33844], [6.1198, 46.31157], [6.11697, 46.29547], [6.1013, 46.28512], [6.11926, 46.2634], [6.12446, 46.25059], [6.10071, 46.23772], [6.08563, 46.24651], [6.07072, 46.24085], [6.0633, 46.24583], [6.05029, 46.23518], [6.04602, 46.23127], [6.03342, 46.2383], [6.02461, 46.23313], [5.97542, 46.21525], [5.96515, 46.19638], [5.99573, 46.18587], [5.98846, 46.17046], [5.98188, 46.17392], [5.97508, 46.15863], [5.9641, 46.14412], [5.95781, 46.12925], [5.97893, 46.13303], [5.9871, 46.14499], [6.01791, 46.14228], [6.03614, 46.13712], [6.04564, 46.14031], [6.05203, 46.15191], [6.07491, 46.14879], [6.09199, 46.15191], [6.09926, 46.14373], [6.13397, 46.1406], [6.15305, 46.15194], [6.18116, 46.16187], [6.18871, 46.16644], [6.18707, 46.17999], [6.19552, 46.18401], [6.19807, 46.18369], [6.20539, 46.19163], [6.21114, 46.1927], [6.21273, 46.19409], [6.21603, 46.19507], [6.21844, 46.19837], [6.22222, 46.19888], [6.22175, 46.20045], [6.23544, 46.20714], [6.23913, 46.20511], [6.24821, 46.20531], [6.26007, 46.21165], [6.27694, 46.21566], [6.29663, 46.22688], [6.31041, 46.24417], [6.29474, 46.26221], [6.26749, 46.24745], [6.24952, 46.26255], [6.23775, 46.27822], [6.25137, 46.29014], [6.24826, 46.30175], [6.21981, 46.31304], [6.25432, 46.3632], [6.53358, 46.45431], [6.82312, 46.42661], [6.8024, 46.39171], [6.77152, 46.34784], [6.86052, 46.28512], [6.78968, 46.14058], [6.89321, 46.12548], [6.87868, 46.03855], [6.93862, 46.06502], [7.00946, 45.9944], [7.04151, 45.92435], [7.10685, 45.85653], [7.56343, 45.97421], [7.85949, 45.91485], [7.9049, 45.99945], [7.98881, 45.99867], [8.02906, 46.10331], [8.11383, 46.11577], [8.16866, 46.17817], [8.08814, 46.26692], [8.31162, 46.38044], [8.30648, 46.41587], [8.42464, 46.46367], [8.46317, 46.43712], [8.45032, 46.26869], [8.62242, 46.12112], [8.75697, 46.10395], [8.80778, 46.10085], [8.85617, 46.0748], [8.79414, 46.00913], [8.78585, 45.98973], [8.79362, 45.99207], [8.8319, 45.9879], [8.85121, 45.97239], [8.86688, 45.96135], [8.88904, 45.95465], [8.93649, 45.86775], [8.94372, 45.86587], [8.93504, 45.86245], [8.91129, 45.8388], [8.94737, 45.84285], [8.9621, 45.83707], [8.99663, 45.83466], [9.00324, 45.82055], [9.0298, 45.82127], [9.03279, 45.82865], [9.03793, 45.83548], [9.03505, 45.83976], [9.04059, 45.8464], [9.04546, 45.84968], [9.06642, 45.8761], [9.09065, 45.89906], [8.99257, 45.9698], [9.01618, 46.04928], [9.24503, 46.23616], [9.29226, 46.32717], [9.25502, 46.43743], [9.28136, 46.49685], [9.36128, 46.5081], [9.40487, 46.46621], [9.45936, 46.50873], [9.46117, 46.37481], [9.57015, 46.2958], [9.71273, 46.29266], [9.73086, 46.35071], [9.95249, 46.38045], [10.07055, 46.21668], [10.14439, 46.22992], [10.17862, 46.25626], [10.10506, 46.3372], [10.165, 46.41051], [10.03715, 46.44479], [10.10307, 46.61003], [10.23674, 46.63484], [10.25309, 46.57432], [10.46136, 46.53164], [10.49375, 46.62049], [10.44686, 46.64162], [10.40475, 46.63671], [10.38659, 46.67847], [10.47197, 46.85698], [10.48376, 46.93891], [10.36933, 47.00212], [10.30031, 46.92093], [10.24128, 46.93147], [10.22675, 46.86942], [10.10715, 46.84296], [9.98058, 46.91434], [9.88266, 46.93343], [9.87935, 47.01337], [9.60717, 47.06091], [9.55721, 47.04762], [9.54041, 47.06495], [9.47548, 47.05257], [9.47139, 47.06402], [9.51362, 47.08505], [9.52089, 47.10019], [9.51044, 47.13727], [9.48774, 47.17402], [9.4891, 47.19346], [9.50318, 47.22153], [9.52406, 47.24959], [9.53116, 47.27029], [9.54773, 47.2809], [9.55857, 47.29919], [9.58513, 47.31334], [9.59978, 47.34671], [9.62476, 47.36639], [9.65427, 47.36824], [9.66243, 47.37136], [9.6711, 47.37824], [9.67445, 47.38429], [9.67334, 47.39191], [9.6629, 47.39591], [9.65136, 47.40504], [9.65043, 47.41937], [9.6446, 47.43233], [9.64483, 47.43842], [9.65863, 47.44847], [9.65728, 47.45383], [9.6423, 47.45599], [9.62475, 47.45685], [9.62158, 47.45858], [9.60841, 47.47178], [9.60484, 47.46358], [9.60205, 47.46165], [9.59482, 47.46305], [9.58208, 47.48344], [9.56312, 47.49495], [9.55125, 47.53629], [9.25619, 47.65939], [9.18203, 47.65598], [9.17593, 47.65399], [9.1755, 47.65584], [9.1705, 47.65513], [9.15181, 47.66904], [9.13845, 47.66389], [9.09891, 47.67801], [9.02093, 47.6868], [8.94093, 47.65596], [8.89946, 47.64769], [8.87625, 47.65441], [8.87383, 47.67045], [8.85065, 47.68209], [8.86989, 47.70504], [8.82002, 47.71458], [8.80663, 47.73821], [8.77309, 47.72059], [8.76965, 47.7075], [8.79966, 47.70222], [8.79511, 47.67462], [8.75856, 47.68969], [8.72809, 47.69282]], [[8.95861, 45.96485], [8.96668, 45.98436], [8.97741, 45.98317], [8.97604, 45.96151], [8.95861, 45.96485]], [[8.70847, 47.68904], [8.68985, 47.69552], [8.66837, 47.68437], [8.65769, 47.68928], [8.67508, 47.6979], [8.66416, 47.71367], [8.70237, 47.71453], [8.71773, 47.69088], [8.70847, 47.68904]]]] } },
      { type: "Feature", properties: { iso1A2: "CI", iso1A3: "CIV", iso1N3: "384", wikidata: "Q1008", nameEn: "C\xF4te d'Ivoire", groups: ["011", "202", "002", "UN"], callingCodes: ["225"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-7.52774, 3.7105], [-3.34019, 4.17519], [-3.10675, 5.08515], [-3.11073, 5.12675], [-3.063, 5.13665], [-2.96554, 5.10397], [-2.95261, 5.12477], [-2.75502, 5.10657], [-2.73074, 5.1364], [-2.77625, 5.34621], [-2.72737, 5.34789], [-2.76614, 5.60963], [-2.85378, 5.65156], [-2.93132, 5.62137], [-2.96671, 5.6415], [-2.95323, 5.71865], [-3.01896, 5.71697], [-3.25999, 6.62521], [-3.21954, 6.74407], [-3.23327, 6.81744], [-2.95438, 7.23737], [-2.97822, 7.27165], [-2.92339, 7.60847], [-2.79467, 7.86002], [-2.78395, 7.94974], [-2.74819, 7.92613], [-2.67787, 8.02055], [-2.61232, 8.02645], [-2.62901, 8.11495], [-2.49037, 8.20872], [-2.58243, 8.7789], [-2.66357, 9.01771], [-2.77799, 9.04949], [-2.69814, 9.22717], [-2.68802, 9.49343], [-2.76494, 9.40778], [-2.93012, 9.57403], [-3.00765, 9.74019], [-3.16609, 9.85147], [-3.19306, 9.93781], [-3.27228, 9.84981], [-3.31779, 9.91125], [-3.69703, 9.94279], [-4.25999, 9.76012], [-4.31392, 9.60062], [-4.6426, 9.70696], [-4.96621, 9.89132], [-4.96453, 9.99923], [-5.12465, 10.29788], [-5.39602, 10.2929], [-5.51058, 10.43177], [-5.65135, 10.46767], [-5.78124, 10.43952], [-5.99478, 10.19694], [-6.18851, 10.24244], [-6.1731, 10.46983], [-6.24795, 10.74248], [-6.325, 10.68624], [-6.40646, 10.69922], [-6.42847, 10.5694], [-6.52974, 10.59104], [-6.63541, 10.66893], [-6.68164, 10.35074], [-6.93921, 10.35291], [-7.01186, 10.25111], [-6.97444, 10.21644], [-7.00966, 10.15794], [-7.0603, 10.14711], [-7.13331, 10.24877], [-7.3707, 10.24677], [-7.44555, 10.44602], [-7.52261, 10.4655], [-7.54462, 10.40921], [-7.63048, 10.46334], [-7.92107, 10.15577], [-7.97971, 10.17117], [-8.01225, 10.1021], [-8.11921, 10.04577], [-8.15652, 9.94288], [-8.09434, 9.86936], [-8.14657, 9.55062], [-8.03463, 9.39604], [-7.85056, 9.41812], [-7.90777, 9.20456], [-7.73862, 9.08422], [-7.92518, 8.99332], [-7.95503, 8.81146], [-7.69882, 8.66148], [-7.65653, 8.36873], [-7.92518, 8.50652], [-8.22991, 8.48438], [-8.2411, 8.24196], [-8.062, 8.16071], [-7.98675, 8.20134], [-7.99919, 8.11023], [-7.94695, 8.00925], [-8.06449, 8.04989], [-8.13414, 7.87991], [-8.09931, 7.78626], [-8.21374, 7.54466], [-8.4003, 7.6285], [-8.47114, 7.55676], [-8.41935, 7.51203], [-8.37458, 7.25794], [-8.29249, 7.1691], [-8.31736, 6.82837], [-8.59456, 6.50612], [-8.48652, 6.43797], [-8.45666, 6.49977], [-8.38453, 6.35887], [-8.3298, 6.36381], [-8.17557, 6.28222], [-8.00642, 6.31684], [-7.90692, 6.27728], [-7.83478, 6.20309], [-7.8497, 6.08932], [-7.79747, 6.07696], [-7.78254, 5.99037], [-7.70294, 5.90625], [-7.67309, 5.94337], [-7.48155, 5.80974], [-7.46165, 5.84934], [-7.43677, 5.84687], [-7.43926, 5.74787], [-7.37209, 5.61173], [-7.43428, 5.42355], [-7.36463, 5.32944], [-7.46165, 5.26256], [-7.48901, 5.14118], [-7.55369, 5.08667], [-7.53876, 4.94294], [-7.59349, 4.8909], [-7.53259, 4.35145], [-7.52774, 3.7105]]]] } },
      { type: "Feature", properties: { iso1A2: "CK", iso1A3: "COK", iso1N3: "184", wikidata: "Q26988", nameEn: "Cook Islands", country: "NZ", groups: ["061", "009", "UN"], driveSide: "left", callingCodes: ["682"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-168.15106, -10.26955], [-156.45576, -31.75456], [-156.48634, -15.52824], [-156.50903, -7.4975], [-168.15106, -10.26955]]]] } },
      { type: "Feature", properties: { iso1A2: "CL", iso1A3: "CHL", iso1N3: "152", wikidata: "Q298", nameEn: "Chile", groups: ["005", "419", "019", "UN"], callingCodes: ["56"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-68.60702, -52.65781], [-68.41683, -52.33516], [-69.97824, -52.00845], [-71.99889, -51.98018], [-72.33873, -51.59954], [-72.31343, -50.58411], [-73.15765, -50.78337], [-73.55259, -49.92488], [-73.45156, -49.79461], [-73.09655, -49.14342], [-72.56894, -48.81116], [-72.54042, -48.52392], [-72.27662, -48.28727], [-72.50478, -47.80586], [-71.94152, -47.13595], [-71.68577, -46.55385], [-71.75614, -45.61611], [-71.35687, -45.22075], [-72.06985, -44.81756], [-71.26418, -44.75684], [-71.16436, -44.46244], [-71.81318, -44.38097], [-71.64206, -43.64774], [-72.14828, -42.85321], [-72.15541, -42.15941], [-71.74901, -42.11711], [-71.92726, -40.72714], [-71.37826, -38.91474], [-70.89532, -38.6923], [-71.24279, -37.20264], [-70.95047, -36.4321], [-70.38008, -36.02375], [-70.49416, -35.24145], [-69.87386, -34.13344], [-69.88099, -33.34489], [-70.55832, -31.51559], [-70.14479, -30.36595], [-69.8596, -30.26131], [-69.99507, -29.28351], [-69.80969, -29.07185], [-69.66709, -28.44055], [-69.22504, -27.95042], [-68.77586, -27.16029], [-68.43363, -27.08414], [-68.27677, -26.90626], [-68.59048, -26.49861], [-68.56909, -26.28146], [-68.38372, -26.15353], [-68.57622, -25.32505], [-68.38372, -25.08636], [-68.56909, -24.69831], [-68.24825, -24.42596], [-67.33563, -24.04237], [-66.99632, -22.99839], [-67.18382, -22.81525], [-67.54284, -22.89771], [-67.85114, -22.87076], [-68.18816, -21.28614], [-68.40403, -20.94562], [-68.53957, -20.91542], [-68.55383, -20.7355], [-68.44023, -20.62701], [-68.7276, -20.46178], [-68.74273, -20.08817], [-68.57132, -20.03134], [-68.54611, -19.84651], [-68.66761, -19.72118], [-68.41218, -19.40499], [-68.61989, -19.27584], [-68.80602, -19.08355], [-68.87082, -19.06003], [-68.94987, -18.93302], [-69.07432, -18.28259], [-69.14807, -18.16893], [-69.07496, -18.03715], [-69.28671, -17.94844], [-69.34126, -17.72753], [-69.46623, -17.60518], [-69.46897, -17.4988], [-69.66483, -17.65083], [-69.79087, -17.65563], [-69.82868, -17.72048], [-69.75305, -17.94605], [-69.81607, -18.12582], [-69.96732, -18.25992], [-70.16394, -18.31737], [-70.31267, -18.31258], [-70.378, -18.3495], [-70.59118, -18.35072], [-113.52687, -26.52828], [-68.11646, -58.14883], [-66.07313, -55.19618], [-67.11046, -54.94199], [-67.46182, -54.92205], [-68.01394, -54.8753], [-68.60733, -54.9125], [-68.60702, -52.65781]]]] } },
      { type: "Feature", properties: { iso1A2: "CM", iso1A3: "CMR", iso1N3: "120", wikidata: "Q1009", nameEn: "Cameroon", groups: ["017", "202", "002", "UN"], callingCodes: ["237"] }, geometry: { type: "MultiPolygon", coordinates: [[[[14.83314, 12.62963], [14.55058, 12.78256], [14.56101, 12.91036], [14.46881, 13.08259], [14.08251, 13.0797], [14.20204, 12.53405], [14.17523, 12.41916], [14.22215, 12.36533], [14.4843, 12.35223], [14.6474, 12.17466], [14.61612, 11.7798], [14.55207, 11.72001], [14.64591, 11.66166], [14.6124, 11.51283], [14.17821, 11.23831], [13.97489, 11.30258], [13.78945, 11.00154], [13.7403, 11.00593], [13.70753, 10.94451], [13.73434, 10.9255], [13.54964, 10.61236], [13.5705, 10.53183], [13.43644, 10.13326], [13.34111, 10.12299], [13.25025, 10.03647], [13.25323, 10.00127], [13.286, 9.9822], [13.27409, 9.93232], [13.24132, 9.91031], [13.25025, 9.86042], [13.29941, 9.8296], [13.25472, 9.76795], [13.22642, 9.57266], [13.02385, 9.49334], [12.85628, 9.36698], [12.91958, 9.33905], [12.90022, 9.11411], [12.81085, 8.91992], [12.79, 8.75361], [12.71701, 8.7595], [12.68722, 8.65938], [12.44146, 8.6152], [12.4489, 8.52536], [12.26123, 8.43696], [12.24782, 8.17904], [12.19271, 8.10826], [12.20909, 7.97553], [11.99908, 7.67302], [12.01844, 7.52981], [11.93205, 7.47812], [11.84864, 7.26098], [11.87396, 7.09398], [11.63117, 6.9905], [11.55818, 6.86186], [11.57755, 6.74059], [11.51499, 6.60892], [11.42264, 6.5882], [11.42041, 6.53789], [11.09495, 6.51717], [11.09644, 6.68437], [10.94302, 6.69325], [10.8179, 6.83377], [10.83727, 6.9358], [10.60789, 7.06885], [10.59746, 7.14719], [10.57214, 7.16345], [10.53639, 6.93432], [10.21466, 6.88996], [10.15135, 7.03781], [9.86314, 6.77756], [9.77824, 6.79088], [9.70674, 6.51717], [9.51757, 6.43874], [8.84209, 5.82562], [8.88156, 5.78857], [8.83687, 5.68483], [8.92029, 5.58403], [8.78027, 5.1243], [8.60302, 4.87353], [8.34397, 4.30689], [9.22018, 3.72052], [9.81162, 2.33797], [9.82123, 2.35097], [9.83754, 2.32428], [9.83238, 2.29079], [9.84716, 2.24676], [9.89012, 2.20457], [9.90749, 2.20049], [9.991, 2.16561], [11.3561, 2.17217], [11.37116, 2.29975], [13.28534, 2.25716], [13.29457, 2.16106], [14.61145, 2.17866], [15.00996, 1.98887], [15.22634, 2.03243], [15.34776, 1.91264], [15.48942, 1.98265], [16.02959, 1.76483], [16.02647, 1.65591], [16.14634, 1.70259], [16.05294, 1.9811], [16.08563, 2.19733], [16.15568, 2.18955], [16.19357, 2.21537], [16.08252, 2.45708], [16.05449, 3.02306], [15.77725, 3.26835], [15.73522, 3.24348], [15.07686, 4.01805], [15.17482, 4.05131], [15.10644, 4.1362], [15.08609, 4.30282], [15.00825, 4.41458], [14.73383, 4.6135], [14.65489, 5.21343], [14.57083, 5.23979], [14.52724, 5.28319], [14.62531, 5.51411], [14.58951, 5.59777], [14.62375, 5.70466], [14.60974, 5.91838], [14.49455, 5.91683], [14.42917, 6.00508], [14.43073, 6.08867], [14.56149, 6.18928], [14.74206, 6.26356], [14.80122, 6.34866], [14.79966, 6.39043], [14.96311, 6.75693], [15.04717, 6.77085], [15.23397, 7.25135], [15.49743, 7.52179], [15.56964, 7.58936], [15.59272, 7.7696], [15.50743, 7.79302], [15.20426, 8.50892], [15.09484, 8.65982], [14.83566, 8.80557], [14.35707, 9.19611], [14.37094, 9.2954], [13.97544, 9.6365], [14.01793, 9.73169], [14.1317, 9.82413], [14.20411, 10.00055], [14.4673, 10.00264], [14.80082, 9.93818], [14.95722, 9.97926], [15.05999, 9.94845], [15.14043, 9.99246], [15.24618, 9.99246], [15.41408, 9.92876], [15.68761, 9.99344], [15.50535, 10.1098], [15.30874, 10.31063], [15.23724, 10.47764], [15.14936, 10.53915], [15.15532, 10.62846], [15.06737, 10.80921], [15.09127, 10.87431], [15.04957, 11.02347], [15.10021, 11.04101], [15.0585, 11.40481], [15.13149, 11.5537], [15.06595, 11.71126], [15.11579, 11.79313], [15.04808, 11.8731], [15.05786, 12.0608], [15.0349, 12.10698], [15.00146, 12.1223], [14.96952, 12.0925], [14.89019, 12.16593], [14.90827, 12.3269], [14.83314, 12.62963]]]] } },
      { type: "Feature", properties: { iso1A2: "CN", iso1A3: "CHN", iso1N3: "156", wikidata: "Q148", nameEn: "People's Republic of China" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "CO", iso1A3: "COL", iso1N3: "170", wikidata: "Q739", nameEn: "Colombia", groups: ["005", "419", "019", "UN"], callingCodes: ["57"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-71.19849, 12.65801], [-81.58685, 18.0025], [-82.06974, 14.49418], [-82.56142, 11.91792], [-78.79327, 9.93766], [-77.58292, 9.22278], [-77.32389, 8.81247], [-77.45064, 8.49991], [-77.17257, 7.97422], [-77.57185, 7.51147], [-77.72514, 7.72348], [-77.72157, 7.47612], [-77.81426, 7.48319], [-77.89178, 7.22681], [-78.06168, 7.07793], [-82.12561, 4.00341], [-78.87137, 1.47457], [-78.42749, 1.15389], [-77.85677, 0.80197], [-77.7148, 0.85003], [-77.68613, 0.83029], [-77.66416, 0.81604], [-77.67815, 0.73863], [-77.49984, 0.64476], [-77.52001, 0.40782], [-76.89177, 0.24736], [-76.4094, 0.24015], [-76.41215, 0.38228], [-76.23441, 0.42294], [-75.82927, 0.09578], [-75.25764, -0.11943], [-75.18513, -0.0308], [-74.42701, -0.50218], [-74.26675, -0.97229], [-73.65312, -1.26222], [-72.92587, -2.44514], [-71.75223, -2.15058], [-70.94377, -2.23142], [-70.04609, -2.73906], [-70.71396, -3.7921], [-70.52393, -3.87553], [-70.3374, -3.79505], [-69.94708, -4.2431], [-69.43395, -1.42219], [-69.4215, -1.01853], [-69.59796, -0.75136], [-69.603, -0.51947], [-70.03658, -0.19681], [-70.04162, 0.55437], [-69.47696, 0.71065], [-69.20976, 0.57958], [-69.14422, 0.84172], [-69.26017, 1.06856], [-69.82987, 1.07864], [-69.83491, 1.69353], [-69.53746, 1.76408], [-69.38621, 1.70865], [-68.18128, 1.72881], [-68.26699, 1.83463], [-68.18632, 2.00091], [-67.9292, 1.82455], [-67.40488, 2.22258], [-67.299, 1.87494], [-67.15784, 1.80439], [-67.08222, 1.17441], [-66.85795, 1.22998], [-67.21967, 2.35778], [-67.65696, 2.81691], [-67.85862, 2.79173], [-67.85862, 2.86727], [-67.30945, 3.38393], [-67.50067, 3.75812], [-67.62671, 3.74303], [-67.85358, 4.53249], [-67.83341, 5.31104], [-67.59141, 5.5369], [-67.63914, 5.64963], [-67.58558, 5.84537], [-67.43513, 5.98835], [-67.4625, 6.20625], [-67.60654, 6.2891], [-69.41843, 6.1072], [-70.10716, 6.96516], [-70.7596, 7.09799], [-71.03941, 6.98163], [-71.37234, 7.01588], [-71.42212, 7.03854], [-71.44118, 7.02116], [-71.82441, 7.04314], [-72.04895, 7.03837], [-72.19437, 7.37034], [-72.43132, 7.40034], [-72.47415, 7.48928], [-72.45321, 7.57232], [-72.47827, 7.65604], [-72.46763, 7.79518], [-72.44454, 7.86031], [-72.46183, 7.90682], [-72.45806, 7.91141], [-72.47042, 7.92306], [-72.48183, 7.92909], [-72.48801, 7.94329], [-72.47213, 7.96106], [-72.39137, 8.03534], [-72.35163, 8.01163], [-72.36987, 8.19976], [-72.4042, 8.36513], [-72.65474, 8.61428], [-72.77415, 9.10165], [-72.94052, 9.10663], [-73.02119, 9.27584], [-73.36905, 9.16636], [-72.98085, 9.85253], [-72.88002, 10.44309], [-72.4767, 11.1117], [-72.24983, 11.14138], [-71.9675, 11.65536], [-71.3275, 11.85], [-70.92579, 11.96275], [-71.19849, 12.65801]]]] } },
      { type: "Feature", properties: { iso1A2: "CP", iso1A3: "CPT", wikidata: "Q161258", nameEn: "Clipperton Island", country: "FR", groups: ["013", "003", "019", "UN"], isoStatus: "excRes" }, geometry: { type: "MultiPolygon", coordinates: [[[[-110.36279, 9.79626], [-108.755, 9.84085], [-109.04145, 11.13245], [-110.36279, 9.79626]]]] } },
      { type: "Feature", properties: { iso1A2: "CR", iso1A3: "CRI", iso1N3: "188", wikidata: "Q800", nameEn: "Costa Rica", groups: ["013", "003", "419", "019", "UN"], callingCodes: ["506"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-83.68276, 11.01562], [-83.66597, 10.79916], [-83.90838, 10.71161], [-84.68197, 11.07568], [-84.92439, 10.9497], [-85.60529, 11.22607], [-85.71223, 11.06868], [-86.14524, 11.09059], [-87.41779, 5.02401], [-82.94503, 7.93865], [-82.89978, 8.04083], [-82.89137, 8.05755], [-82.88641, 8.10219], [-82.9388, 8.26634], [-83.05209, 8.33394], [-82.93056, 8.43465], [-82.8679, 8.44042], [-82.8382, 8.48117], [-82.83322, 8.52464], [-82.83975, 8.54755], [-82.82739, 8.60153], [-82.8794, 8.6981], [-82.92068, 8.74832], [-82.91377, 8.774], [-82.88253, 8.83331], [-82.72126, 8.97125], [-82.93516, 9.07687], [-82.93516, 9.46741], [-82.84871, 9.4973], [-82.87919, 9.62645], [-82.77206, 9.59573], [-82.66667, 9.49746], [-82.61345, 9.49881], [-82.56507, 9.57279], [-82.51044, 9.65379], [-83.54024, 10.96805], [-83.68276, 11.01562]]]] } },
      { type: "Feature", properties: { iso1A2: "CU", iso1A3: "CUB", iso1N3: "192", wikidata: "Q241", nameEn: "Cuba", groups: ["029", "003", "419", "019", "UN"], callingCodes: ["53"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-73.62304, 20.6935], [-82.02215, 24.23074], [-85.77883, 21.92705], [-74.81171, 18.82201], [-73.62304, 20.6935]]]] } },
      { type: "Feature", properties: { iso1A2: "CV", iso1A3: "CPV", iso1N3: "132", wikidata: "Q1011", nameEn: "Cape Verde", groups: ["Q105472", "011", "202", "002", "UN"], callingCodes: ["238"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-28.81604, 14.57305], [-20.39702, 14.12816], [-23.37101, 19.134], [-28.81604, 14.57305]]]] } },
      { type: "Feature", properties: { iso1A2: "CW", iso1A3: "CUW", iso1N3: "531", wikidata: "Q25279", nameEn: "Cura\xE7ao", aliases: ["NL-CW"], country: "NL", groups: ["Q1451600", "029", "003", "419", "019", "UN"], callingCodes: ["599"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-68.90012, 12.62309], [-69.59009, 12.46019], [-68.99639, 11.79035], [-68.33524, 11.78151], [-68.90012, 12.62309]]]] } },
      { type: "Feature", properties: { iso1A2: "CX", iso1A3: "CXR", iso1N3: "162", wikidata: "Q31063", nameEn: "Christmas Island", country: "AU", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["61"] }, geometry: { type: "MultiPolygon", coordinates: [[[[105.66835, -9.31927], [104.67494, -11.2566], [106.66176, -11.14349], [105.66835, -9.31927]]]] } },
      { type: "Feature", properties: { iso1A2: "CY", iso1A3: "CYP", iso1N3: "196", wikidata: "Q229", nameEn: "Republic of Cyprus", groups: ["Q644636", "EU", "145", "142", "UN"], driveSide: "left", callingCodes: ["357"] }, geometry: { type: "MultiPolygon", coordinates: [[[[32.46489, 35.48584], [30.15137, 34.08517], [32.74412, 34.43926], [32.75515, 34.64985], [32.76136, 34.68318], [32.79433, 34.67883], [32.82717, 34.70622], [32.86014, 34.70585], [32.86167, 34.68734], [32.9068, 34.66102], [32.91398, 34.67343], [32.93043, 34.67091], [32.92807, 34.66736], [32.93449, 34.66241], [32.93693, 34.67027], [32.94379, 34.67111], [32.94683, 34.67907], [32.95539, 34.68471], [32.99135, 34.68061], [32.98668, 34.67268], [32.99014, 34.65518], [32.97736, 34.65277], [32.97079, 34.66112], [32.95325, 34.66462], [32.94796, 34.6587], [32.94976, 34.65204], [32.95471, 34.64528], [32.95323, 34.64075], [32.95891, 34.62919], [32.96718, 34.63446], [32.96968, 34.64046], [33.0138, 34.64424], [33.26744, 34.49942], [33.83531, 34.73974], [33.70575, 34.97947], [33.70639, 34.99303], [33.71514, 35.00294], [33.69731, 35.01754], [33.69938, 35.03123], [33.67678, 35.03866], [33.63765, 35.03869], [33.61215, 35.0527], [33.59658, 35.03635], [33.567, 35.04803], [33.57478, 35.06049], [33.53975, 35.08151], [33.48915, 35.06594], [33.47666, 35.00701], [33.45256, 35.00288], [33.45178, 35.02078], [33.47825, 35.04103], [33.48136, 35.0636], [33.46813, 35.10564], [33.41675, 35.16325], [33.4076, 35.20062], [33.38575, 35.2018], [33.37248, 35.18698], [33.3717, 35.1788], [33.36569, 35.17479], [33.35612, 35.17402], [33.35596, 35.17942], [33.34964, 35.17803], [33.35056, 35.18328], [33.31955, 35.18096], [33.3072, 35.16816], [33.27068, 35.16815], [33.15138, 35.19504], [33.11105, 35.15639], [33.08249, 35.17319], [33.01192, 35.15639], [32.94471, 35.09422], [32.86406, 35.1043], [32.85733, 35.07742], [32.70779, 35.14127], [32.70947, 35.18328], [32.64864, 35.19967], [32.60361, 35.16647], [32.46489, 35.48584]]], [[[33.74144, 35.01053], [33.7492, 35.01319], [33.74983, 35.02274], [33.74265, 35.02329], [33.73781, 35.02181], [33.7343, 35.01178], [33.74144, 35.01053]]], [[[33.77312, 34.9976], [33.75994, 35.00113], [33.75682, 34.99916], [33.76605, 34.99543], [33.76738, 34.99188], [33.7778, 34.98981], [33.77843, 34.988], [33.78149, 34.98854], [33.78318, 34.98699], [33.78571, 34.98951], [33.78917, 34.98854], [33.79191, 34.98914], [33.78516, 34.99582], [33.77553, 34.99518], [33.77312, 34.9976]]]] } },
      { type: "Feature", properties: { iso1A2: "CZ", iso1A3: "CZE", iso1N3: "203", wikidata: "Q213", nameEn: "Czechia", groups: ["EU", "151", "150", "UN"], callingCodes: ["420"] }, geometry: { type: "MultiPolygon", coordinates: [[[[14.82803, 50.86966], [14.79139, 50.81438], [14.70661, 50.84096], [14.61993, 50.86049], [14.63434, 50.8883], [14.65259, 50.90513], [14.64802, 50.93241], [14.58024, 50.91443], [14.56374, 50.922], [14.59702, 50.96148], [14.59908, 50.98685], [14.58215, 50.99306], [14.56432, 51.01008], [14.53438, 51.00374], [14.53321, 51.01679], [14.49873, 51.02242], [14.50809, 51.0427], [14.49991, 51.04692], [14.49154, 51.04382], [14.49202, 51.02286], [14.45827, 51.03712], [14.41335, 51.02086], [14.30098, 51.05515], [14.25665, 50.98935], [14.28776, 50.97718], [14.32353, 50.98556], [14.32793, 50.97379], [14.30251, 50.96606], [14.31422, 50.95243], [14.39848, 50.93866], [14.38691, 50.89907], [14.30098, 50.88448], [14.27123, 50.89386], [14.24314, 50.88761], [14.22331, 50.86049], [14.02982, 50.80662], [13.98864, 50.8177], [13.89113, 50.78533], [13.89444, 50.74142], [13.82942, 50.7251], [13.76316, 50.73487], [13.70204, 50.71771], [13.65977, 50.73096], [13.52474, 50.70394], [13.53748, 50.67654], [13.5226, 50.64721], [13.49742, 50.63133], [13.46413, 50.60102], [13.42189, 50.61243], [13.37485, 50.64931], [13.37805, 50.627], [13.32264, 50.60317], [13.32594, 50.58009], [13.29454, 50.57904], [13.25158, 50.59268], [13.19043, 50.50237], [13.13424, 50.51709], [13.08301, 50.50132], [13.0312, 50.50944], [13.02038, 50.4734], [13.02147, 50.44763], [12.98433, 50.42016], [12.94058, 50.40944], [12.82465, 50.45738], [12.73476, 50.43237], [12.73044, 50.42268], [12.70731, 50.39948], [12.67261, 50.41949], [12.51356, 50.39694], [12.48747, 50.37278], [12.49214, 50.35228], [12.48256, 50.34784], [12.46643, 50.35527], [12.43722, 50.33774], [12.43371, 50.32506], [12.39924, 50.32302], [12.40158, 50.29521], [12.36594, 50.28289], [12.35425, 50.23993], [12.33263, 50.24367], [12.32445, 50.20442], [12.33847, 50.19432], [12.32596, 50.17146], [12.29232, 50.17524], [12.28063, 50.19544], [12.28755, 50.22429], [12.23943, 50.24594], [12.24791, 50.25525], [12.26953, 50.25189], [12.25119, 50.27079], [12.20823, 50.2729], [12.18013, 50.32146], [12.10907, 50.32041], [12.13716, 50.27396], [12.09287, 50.25032], [12.19335, 50.19997], [12.21484, 50.16399], [12.1917, 50.13434], [12.2073, 50.10315], [12.23709, 50.10213], [12.27433, 50.0771], [12.26111, 50.06331], [12.30798, 50.05719], [12.49908, 49.97305], [12.47264, 49.94222], [12.55197, 49.92094], [12.48256, 49.83575], [12.46603, 49.78882], [12.40489, 49.76321], [12.4462, 49.70233], [12.52553, 49.68415], [12.53544, 49.61888], [12.56188, 49.6146], [12.60155, 49.52887], [12.64782, 49.52565], [12.64121, 49.47628], [12.669, 49.42935], [12.71227, 49.42363], [12.75854, 49.3989], [12.78168, 49.34618], [12.88414, 49.33541], [12.88249, 49.35479], [12.94859, 49.34079], [13.03618, 49.30417], [13.02957, 49.27399], [13.05883, 49.26259], [13.17665, 49.16713], [13.17019, 49.14339], [13.20405, 49.12303], [13.23689, 49.11412], [13.28242, 49.1228], [13.39479, 49.04812], [13.40802, 48.98851], [13.50221, 48.93752], [13.50552, 48.97441], [13.58319, 48.96899], [13.61624, 48.9462], [13.67739, 48.87886], [13.73854, 48.88538], [13.76994, 48.83537], [13.78977, 48.83319], [13.8096, 48.77877], [13.84023, 48.76988], [14.06151, 48.66873], [14.01482, 48.63788], [14.09104, 48.5943], [14.20691, 48.5898], [14.33909, 48.55852], [14.43076, 48.58855], [14.4587, 48.64695], [14.56139, 48.60429], [14.60808, 48.62881], [14.66762, 48.58215], [14.71794, 48.59794], [14.72756, 48.69502], [14.80584, 48.73489], [14.80821, 48.77711], [14.81545, 48.7874], [14.94773, 48.76268], [14.95641, 48.75915], [14.9758, 48.76857], [14.98112, 48.77524], [14.9782, 48.7766], [14.98032, 48.77959], [14.95072, 48.79101], [14.98917, 48.90082], [14.97612, 48.96983], [14.99878, 49.01444], [15.15534, 48.99056], [15.16358, 48.94278], [15.26177, 48.95766], [15.28305, 48.98831], [15.34823, 48.98444], [15.48027, 48.94481], [15.51357, 48.91549], [15.61622, 48.89541], [15.6921, 48.85973], [15.75341, 48.8516], [15.78087, 48.87644], [15.84404, 48.86921], [16.06034, 48.75436], [16.37345, 48.729], [16.40915, 48.74576], [16.46134, 48.80865], [16.67008, 48.77699], [16.68518, 48.7281], [16.71883, 48.73806], [16.79779, 48.70998], [16.90354, 48.71541], [16.93955, 48.60371], [17.00215, 48.70887], [17.11202, 48.82925], [17.19355, 48.87602], [17.29054, 48.85546], [17.3853, 48.80936], [17.45671, 48.85004], [17.5295, 48.81117], [17.7094, 48.86721], [17.73126, 48.87885], [17.77944, 48.92318], [17.87831, 48.92679], [17.91814, 49.01784], [18.06885, 49.03157], [18.1104, 49.08624], [18.15022, 49.24518], [18.18456, 49.28909], [18.36446, 49.3267], [18.4139, 49.36517], [18.4084, 49.40003], [18.44686, 49.39467], [18.54848, 49.47059], [18.53063, 49.49022], [18.57183, 49.51162], [18.6144, 49.49824], [18.67757, 49.50895], [18.74761, 49.492], [18.84521, 49.51672], [18.84786, 49.5446], [18.80479, 49.6815], [18.72838, 49.68163], [18.69817, 49.70473], [18.62676, 49.71983], [18.62943, 49.74603], [18.62645, 49.75002], [18.61368, 49.75426], [18.61278, 49.7618], [18.57183, 49.83334], [18.60341, 49.86256], [18.57045, 49.87849], [18.57697, 49.91565], [18.54299, 49.92537], [18.54495, 49.9079], [18.53423, 49.89906], [18.41604, 49.93498], [18.33562, 49.94747], [18.33278, 49.92415], [18.31914, 49.91565], [18.27794, 49.93863], [18.27107, 49.96779], [18.21752, 49.97309], [18.20241, 49.99958], [18.10628, 50.00223], [18.07898, 50.04535], [18.03212, 50.06574], [18.00396, 50.04954], [18.04585, 50.03311], [18.04585, 50.01194], [18.00191, 50.01723], [17.86886, 49.97452], [17.77669, 50.02253], [17.7506, 50.07896], [17.6888, 50.12037], [17.66683, 50.10275], [17.59404, 50.16437], [17.70528, 50.18812], [17.76296, 50.23382], [17.72176, 50.25665], [17.74648, 50.29966], [17.69292, 50.32859], [17.67764, 50.28977], [17.58889, 50.27837], [17.3702, 50.28123], [17.34548, 50.2628], [17.34273, 50.32947], [17.27681, 50.32246], [17.19991, 50.3654], [17.19579, 50.38817], [17.14498, 50.38117], [17.1224, 50.39494], [16.89229, 50.45117], [16.85933, 50.41093], [16.90877, 50.38642], [16.94448, 50.31281], [16.99803, 50.30316], [17.02138, 50.27772], [16.99803, 50.25753], [17.02825, 50.23118], [17.00353, 50.21449], [16.98018, 50.24172], [16.8456, 50.20834], [16.7014, 50.09659], [16.63137, 50.1142], [16.55446, 50.16613], [16.56407, 50.21009], [16.42674, 50.32509], [16.39379, 50.3207], [16.3622, 50.34875], [16.36495, 50.37679], [16.30289, 50.38292], [16.28118, 50.36891], [16.22821, 50.41054], [16.21585, 50.40627], [16.19526, 50.43291], [16.31413, 50.50274], [16.34572, 50.49575], [16.44597, 50.58041], [16.33611, 50.66579], [16.23174, 50.67101], [16.20839, 50.63096], [16.10265, 50.66405], [16.02437, 50.60046], [15.98317, 50.61528], [16.0175, 50.63009], [15.97219, 50.69799], [15.87331, 50.67188], [15.81683, 50.75666], [15.73186, 50.73885], [15.43798, 50.80833], [15.3803, 50.77187], [15.36656, 50.83956], [15.2773, 50.8907], [15.27043, 50.97724], [15.2361, 50.99886], [15.1743, 50.9833], [15.16744, 51.01959], [15.11937, 50.99021], [15.10152, 51.01095], [15.06218, 51.02269], [15.03895, 51.0123], [15.02433, 51.0242], [14.96419, 50.99108], [15.01088, 50.97984], [14.99852, 50.86817], [14.82803, 50.86966]]]] } },
      { type: "Feature", properties: { iso1A2: "DE", iso1A3: "DEU", iso1N3: "276", wikidata: "Q183", nameEn: "Germany", groups: ["EU", "155", "150", "UN"], callingCodes: ["49"] }, geometry: { type: "MultiPolygon", coordinates: [[[[8.70847, 47.68904], [8.71773, 47.69088], [8.70237, 47.71453], [8.66416, 47.71367], [8.67508, 47.6979], [8.65769, 47.68928], [8.66837, 47.68437], [8.68985, 47.69552], [8.70847, 47.68904]]], [[[8.72617, 47.69651], [8.72809, 47.69282], [8.75856, 47.68969], [8.79511, 47.67462], [8.79966, 47.70222], [8.76965, 47.7075], [8.77309, 47.72059], [8.80663, 47.73821], [8.82002, 47.71458], [8.86989, 47.70504], [8.85065, 47.68209], [8.87383, 47.67045], [8.87625, 47.65441], [8.89946, 47.64769], [8.94093, 47.65596], [9.02093, 47.6868], [9.09891, 47.67801], [9.13845, 47.66389], [9.15181, 47.66904], [9.1705, 47.65513], [9.1755, 47.65584], [9.17593, 47.65399], [9.18203, 47.65598], [9.25619, 47.65939], [9.55125, 47.53629], [9.72736, 47.53457], [9.76748, 47.5934], [9.80254, 47.59419], [9.82591, 47.58158], [9.8189, 47.54688], [9.87499, 47.52953], [9.87733, 47.54688], [9.92407, 47.53111], [9.96029, 47.53899], [10.00003, 47.48216], [10.03859, 47.48927], [10.07131, 47.45531], [10.09001, 47.46005], [10.1052, 47.4316], [10.06897, 47.40709], [10.09819, 47.35724], [10.11805, 47.37228], [10.16362, 47.36674], [10.17648, 47.38889], [10.2127, 47.38019], [10.22774, 47.38904], [10.23757, 47.37609], [10.19998, 47.32832], [10.2147, 47.31014], [10.17648, 47.29149], [10.17531, 47.27167], [10.23257, 47.27088], [10.33424, 47.30813], [10.39851, 47.37623], [10.4324, 47.38494], [10.4359, 47.41183], [10.47446, 47.43318], [10.46278, 47.47901], [10.44291, 47.48453], [10.4324, 47.50111], [10.44992, 47.5524], [10.43473, 47.58394], [10.47329, 47.58552], [10.48849, 47.54057], [10.56912, 47.53584], [10.60337, 47.56755], [10.63456, 47.5591], [10.68832, 47.55752], [10.6965, 47.54253], [10.7596, 47.53228], [10.77596, 47.51729], [10.88814, 47.53701], [10.91268, 47.51334], [10.86945, 47.5015], [10.87061, 47.4786], [10.90918, 47.48571], [10.93839, 47.48018], [10.92437, 47.46991], [10.98513, 47.42882], [10.97111, 47.41617], [10.97111, 47.39561], [11.11835, 47.39719], [11.12536, 47.41222], [11.20482, 47.43198], [11.25157, 47.43277], [11.22002, 47.3964], [11.27844, 47.39956], [11.29597, 47.42566], [11.33804, 47.44937], [11.4175, 47.44621], [11.38128, 47.47465], [11.4362, 47.51413], [11.52618, 47.50939], [11.58578, 47.52281], [11.58811, 47.55515], [11.60681, 47.57881], [11.63934, 47.59202], [11.84052, 47.58354], [11.85572, 47.60166], [12.0088, 47.62451], [12.02282, 47.61033], [12.05788, 47.61742], [12.13734, 47.60639], [12.17824, 47.61506], [12.18145, 47.61019], [12.17737, 47.60121], [12.18568, 47.6049], [12.20398, 47.60667], [12.20801, 47.61082], [12.19895, 47.64085], [12.18507, 47.65984], [12.18347, 47.66663], [12.16769, 47.68167], [12.16217, 47.70105], [12.18303, 47.70065], [12.22571, 47.71776], [12.2542, 47.7433], [12.26238, 47.73544], [12.24017, 47.69534], [12.26004, 47.67725], [12.27991, 47.68827], [12.336, 47.69534], [12.37222, 47.68433], [12.43883, 47.6977], [12.44117, 47.6741], [12.50076, 47.62293], [12.53816, 47.63553], [12.57438, 47.63238], [12.6071, 47.6741], [12.7357, 47.6787], [12.77777, 47.66689], [12.76492, 47.64485], [12.82101, 47.61493], [12.77427, 47.58025], [12.80699, 47.54477], [12.84672, 47.54556], [12.85256, 47.52741], [12.9624, 47.47452], [12.98344, 47.48716], [12.9998, 47.46267], [13.04537, 47.49426], [13.03252, 47.53373], [13.05355, 47.56291], [13.04537, 47.58183], [13.06641, 47.58577], [13.06407, 47.60075], [13.09562, 47.63304], [13.07692, 47.68814], [13.01382, 47.72116], [12.98578, 47.7078], [12.92969, 47.71094], [12.91333, 47.7178], [12.90274, 47.72513], [12.91711, 47.74026], [12.9353, 47.74788], [12.94371, 47.76281], [12.93202, 47.77302], [12.96311, 47.79957], [12.98543, 47.82896], [13.00588, 47.84374], [12.94163, 47.92927], [12.93886, 47.94046], [12.93642, 47.94436], [12.93419, 47.94063], [12.92668, 47.93879], [12.91985, 47.94069], [12.9211, 47.95135], [12.91683, 47.95647], [12.87476, 47.96195], [12.8549, 48.01122], [12.76141, 48.07373], [12.74973, 48.10885], [12.7617, 48.12796], [12.78595, 48.12445], [12.80676, 48.14979], [12.82673, 48.15245], [12.8362, 48.15876], [12.836, 48.1647], [12.84475, 48.16556], [12.87126, 48.20318], [12.95306, 48.20629], [13.02083, 48.25689], [13.0851, 48.27711], [13.126, 48.27867], [13.18093, 48.29577], [13.26039, 48.29422], [13.30897, 48.31575], [13.40709, 48.37292], [13.43929, 48.43386], [13.42527, 48.45711], [13.45727, 48.51092], [13.43695, 48.55776], [13.45214, 48.56472], [13.46967, 48.55157], [13.50663, 48.57506], [13.50131, 48.58091], [13.51291, 48.59023], [13.57535, 48.55912], [13.59705, 48.57013], [13.62508, 48.55501], [13.65186, 48.55092], [13.66113, 48.53558], [13.72802, 48.51208], [13.74816, 48.53058], [13.7513, 48.5624], [13.76921, 48.55324], [13.80519, 48.58026], [13.80038, 48.59487], [13.82609, 48.62345], [13.81901, 48.6761], [13.81283, 48.68426], [13.81791, 48.69832], [13.79337, 48.71375], [13.81863, 48.73257], [13.82266, 48.75544], [13.84023, 48.76988], [13.8096, 48.77877], [13.78977, 48.83319], [13.76994, 48.83537], [13.73854, 48.88538], [13.67739, 48.87886], [13.61624, 48.9462], [13.58319, 48.96899], [13.50552, 48.97441], [13.50221, 48.93752], [13.40802, 48.98851], [13.39479, 49.04812], [13.28242, 49.1228], [13.23689, 49.11412], [13.20405, 49.12303], [13.17019, 49.14339], [13.17665, 49.16713], [13.05883, 49.26259], [13.02957, 49.27399], [13.03618, 49.30417], [12.94859, 49.34079], [12.88249, 49.35479], [12.88414, 49.33541], [12.78168, 49.34618], [12.75854, 49.3989], [12.71227, 49.42363], [12.669, 49.42935], [12.64121, 49.47628], [12.64782, 49.52565], [12.60155, 49.52887], [12.56188, 49.6146], [12.53544, 49.61888], [12.52553, 49.68415], [12.4462, 49.70233], [12.40489, 49.76321], [12.46603, 49.78882], [12.48256, 49.83575], [12.55197, 49.92094], [12.47264, 49.94222], [12.49908, 49.97305], [12.30798, 50.05719], [12.26111, 50.06331], [12.27433, 50.0771], [12.23709, 50.10213], [12.2073, 50.10315], [12.1917, 50.13434], [12.21484, 50.16399], [12.19335, 50.19997], [12.09287, 50.25032], [12.13716, 50.27396], [12.10907, 50.32041], [12.18013, 50.32146], [12.20823, 50.2729], [12.25119, 50.27079], [12.26953, 50.25189], [12.24791, 50.25525], [12.23943, 50.24594], [12.28755, 50.22429], [12.28063, 50.19544], [12.29232, 50.17524], [12.32596, 50.17146], [12.33847, 50.19432], [12.32445, 50.20442], [12.33263, 50.24367], [12.35425, 50.23993], [12.36594, 50.28289], [12.40158, 50.29521], [12.39924, 50.32302], [12.43371, 50.32506], [12.43722, 50.33774], [12.46643, 50.35527], [12.48256, 50.34784], [12.49214, 50.35228], [12.48747, 50.37278], [12.51356, 50.39694], [12.67261, 50.41949], [12.70731, 50.39948], [12.73044, 50.42268], [12.73476, 50.43237], [12.82465, 50.45738], [12.94058, 50.40944], [12.98433, 50.42016], [13.02147, 50.44763], [13.02038, 50.4734], [13.0312, 50.50944], [13.08301, 50.50132], [13.13424, 50.51709], [13.19043, 50.50237], [13.25158, 50.59268], [13.29454, 50.57904], [13.32594, 50.58009], [13.32264, 50.60317], [13.37805, 50.627], [13.37485, 50.64931], [13.42189, 50.61243], [13.46413, 50.60102], [13.49742, 50.63133], [13.5226, 50.64721], [13.53748, 50.67654], [13.52474, 50.70394], [13.65977, 50.73096], [13.70204, 50.71771], [13.76316, 50.73487], [13.82942, 50.7251], [13.89444, 50.74142], [13.89113, 50.78533], [13.98864, 50.8177], [14.02982, 50.80662], [14.22331, 50.86049], [14.24314, 50.88761], [14.27123, 50.89386], [14.30098, 50.88448], [14.38691, 50.89907], [14.39848, 50.93866], [14.31422, 50.95243], [14.30251, 50.96606], [14.32793, 50.97379], [14.32353, 50.98556], [14.28776, 50.97718], [14.25665, 50.98935], [14.30098, 51.05515], [14.41335, 51.02086], [14.45827, 51.03712], [14.49202, 51.02286], [14.49154, 51.04382], [14.49991, 51.04692], [14.50809, 51.0427], [14.49873, 51.02242], [14.53321, 51.01679], [14.53438, 51.00374], [14.56432, 51.01008], [14.58215, 50.99306], [14.59908, 50.98685], [14.59702, 50.96148], [14.56374, 50.922], [14.58024, 50.91443], [14.64802, 50.93241], [14.65259, 50.90513], [14.63434, 50.8883], [14.61993, 50.86049], [14.70661, 50.84096], [14.79139, 50.81438], [14.82803, 50.86966], [14.81664, 50.88148], [14.89681, 50.9422], [14.89252, 50.94999], [14.92942, 50.99744], [14.95529, 51.04552], [14.97938, 51.07742], [14.98229, 51.11354], [14.99689, 51.12205], [14.99079, 51.14284], [14.99646, 51.14365], [15.00083, 51.14974], [14.99414, 51.15813], [14.99311, 51.16249], [15.0047, 51.16874], [15.01242, 51.21285], [15.04288, 51.28387], [14.98008, 51.33449], [14.96899, 51.38367], [14.9652, 51.44793], [14.94749, 51.47155], [14.73219, 51.52922], [14.72652, 51.53902], [14.73047, 51.54606], [14.71125, 51.56209], [14.7727, 51.61263], [14.75759, 51.62318], [14.75392, 51.67445], [14.69065, 51.70842], [14.66386, 51.73282], [14.64625, 51.79472], [14.60493, 51.80473], [14.59089, 51.83302], [14.6588, 51.88359], [14.6933, 51.9044], [14.70601, 51.92944], [14.7177, 51.94048], [14.72163, 51.95188], [14.71836, 51.95606], [14.7139, 51.95643], [14.70488, 51.97679], [14.71339, 52.00337], [14.76026, 52.06624], [14.72971, 52.09167], [14.6917, 52.10283], [14.67683, 52.13936], [14.70616, 52.16927], [14.68344, 52.19612], [14.71319, 52.22144], [14.70139, 52.25038], [14.58149, 52.28007], [14.56378, 52.33838], [14.55228, 52.35264], [14.54423, 52.42568], [14.63056, 52.48993], [14.60081, 52.53116], [14.6289, 52.57136], [14.61073, 52.59847], [14.22071, 52.81175], [14.13806, 52.82392], [14.12256, 52.84311], [14.15873, 52.87715], [14.14056, 52.95786], [14.25954, 53.00264], [14.35044, 53.05829], [14.38679, 53.13669], [14.36696, 53.16444], [14.37853, 53.20405], [14.40662, 53.21098], [14.45125, 53.26241], [14.44133, 53.27427], [14.4215, 53.27724], [14.35209, 53.49506], [14.3273, 53.50587], [14.30416, 53.55499], [14.31904, 53.61581], [14.2853, 53.63392], [14.28477, 53.65955], [14.27133, 53.66613], [14.2836, 53.67721], [14.26782, 53.69866], [14.27249, 53.74464], [14.21323, 53.8664], [14.20823, 53.90776], [14.18544, 53.91258], [14.20647, 53.91671], [14.22634, 53.9291], [14.20811, 54.12784], [13.93395, 54.84044], [12.85844, 54.82438], [11.90309, 54.38543], [11.00303, 54.63689], [10.31111, 54.65968], [10.16755, 54.73883], [9.89314, 54.84171], [9.73563, 54.8247], [9.61187, 54.85548], [9.62734, 54.88057], [9.58937, 54.88785], [9.4659, 54.83131], [9.43155, 54.82586], [9.41213, 54.84254], [9.38532, 54.83968], [9.36496, 54.81749], [9.33849, 54.80233], [9.32771, 54.80602], [9.2474, 54.8112], [9.23445, 54.83432], [9.24631, 54.84726], [9.20571, 54.85841], [9.14275, 54.87421], [9.04629, 54.87249], [8.92795, 54.90452], [8.81178, 54.90518], [8.76387, 54.8948], [8.63979, 54.91069], [8.55769, 54.91837], [8.45719, 55.06747], [8.02459, 55.09613], [5.45168, 54.20039], [6.91025, 53.44221], [7.00198, 53.32672], [7.19052, 53.31866], [7.21679, 53.20058], [7.22681, 53.18165], [7.17898, 53.13817], [7.21694, 53.00742], [7.07253, 52.81083], [7.04557, 52.63318], [6.77307, 52.65375], [6.71641, 52.62905], [6.69507, 52.488], [6.94293, 52.43597], [6.99041, 52.47235], [7.03417, 52.40237], [7.07044, 52.37805], [7.02703, 52.27941], [7.06365, 52.23789], [7.03729, 52.22695], [6.9897, 52.2271], [6.97189, 52.20329], [6.83984, 52.11728], [6.76117, 52.11895], [6.68128, 52.05052], [6.83035, 51.9905], [6.82357, 51.96711], [6.72319, 51.89518], [6.68386, 51.91861], [6.58556, 51.89386], [6.50231, 51.86313], [6.47179, 51.85395], [6.38815, 51.87257], [6.40704, 51.82771], [6.30593, 51.84998], [6.29872, 51.86801], [6.21443, 51.86801], [6.15349, 51.90439], [6.11551, 51.89769], [6.16902, 51.84094], [6.10337, 51.84829], [6.06705, 51.86136], [5.99848, 51.83195], [5.94568, 51.82786], [5.98665, 51.76944], [5.95003, 51.7493], [6.04091, 51.71821], [6.02767, 51.6742], [6.11759, 51.65609], [6.09055, 51.60564], [6.18017, 51.54096], [6.21724, 51.48568], [6.20654, 51.40049], [6.22641, 51.39948], [6.22674, 51.36135], [6.16977, 51.33169], [6.07889, 51.24432], [6.07889, 51.17038], [6.17384, 51.19589], [6.16706, 51.15677], [5.98292, 51.07469], [5.9541, 51.03496], [5.9134, 51.06736], [5.86735, 51.05182], [5.87849, 51.01969], [5.90493, 51.00198], [5.90296, 50.97356], [5.95282, 50.98728], [6.02697, 50.98303], [6.01615, 50.93367], [6.09297, 50.92066], [6.07486, 50.89307], [6.08805, 50.87223], [6.07693, 50.86025], [6.07431, 50.84674], [6.05702, 50.85179], [6.05623, 50.8572], [6.01921, 50.84435], [6.02328, 50.81694], [6.00462, 50.80065], [5.98404, 50.80988], [5.97497, 50.79992], [6.02624, 50.77453], [6.01976, 50.75398], [6.03889, 50.74618], [6.0326, 50.72647], [6.0406, 50.71848], [6.04428, 50.72861], [6.11707, 50.72231], [6.17852, 50.6245], [6.26957, 50.62444], [6.2476, 50.60392], [6.24888, 50.59869], [6.24005, 50.58732], [6.22581, 50.5907], [6.20281, 50.56952], [6.17739, 50.55875], [6.17802, 50.54179], [6.19735, 50.53576], [6.19579, 50.5313], [6.18716, 50.52653], [6.19193, 50.5212], [6.20599, 50.52089], [6.22335, 50.49578], [6.26637, 50.50272], [6.30809, 50.50058], [6.3465, 50.48833], [6.34005, 50.46083], [6.37219, 50.45397], [6.36852, 50.40776], [6.34406, 50.37994], [6.3688, 50.35898], [6.40785, 50.33557], [6.40641, 50.32425], [6.35701, 50.31139], [6.32488, 50.32333], [6.29949, 50.30887], [6.28797, 50.27458], [6.208, 50.25179], [6.16853, 50.2234], [6.18364, 50.20815], [6.18739, 50.1822], [6.14588, 50.17106], [6.14132, 50.14971], [6.15298, 50.14126], [6.1379, 50.12964], [6.12055, 50.09171], [6.11274, 50.05916], [6.13458, 50.04141], [6.13044, 50.02929], [6.14666, 50.02207], [6.13794, 50.01466], [6.13273, 50.02019], [6.1295, 50.01849], [6.13806, 50.01056], [6.14948, 50.00908], [6.14147, 49.99563], [6.1701, 49.98518], [6.16466, 49.97086], [6.17872, 49.9537], [6.18554, 49.95622], [6.18045, 49.96611], [6.19089, 49.96991], [6.19856, 49.95053], [6.22094, 49.94955], [6.22608, 49.929], [6.21882, 49.92403], [6.22926, 49.92096], [6.23496, 49.89972], [6.26146, 49.88203], [6.28874, 49.87592], [6.29692, 49.86685], [6.30963, 49.87021], [6.32303, 49.85133], [6.32098, 49.83728], [6.33585, 49.83785], [6.34267, 49.84974], [6.36576, 49.85032], [6.40022, 49.82029], [6.42521, 49.81591], [6.42905, 49.81091], [6.44131, 49.81443], [6.45425, 49.81164], [6.47111, 49.82263], [6.48718, 49.81267], [6.50647, 49.80916], [6.51215, 49.80124], [6.52121, 49.81338], [6.53122, 49.80666], [6.52169, 49.79787], [6.50534, 49.78952], [6.51669, 49.78336], [6.51056, 49.77515], [6.51828, 49.76855], [6.51646, 49.75961], [6.50174, 49.75292], [6.50193, 49.73291], [6.51805, 49.72425], [6.51397, 49.72058], [6.50261, 49.72718], [6.49535, 49.72645], [6.49694, 49.72205], [6.5042, 49.71808], [6.50647, 49.71353], [6.49785, 49.71118], [6.48014, 49.69767], [6.46048, 49.69092], [6.44654, 49.67799], [6.42937, 49.66857], [6.42726, 49.66078], [6.43768, 49.66021], [6.4413, 49.65722], [6.41861, 49.61723], [6.39822, 49.60081], [6.385, 49.59946], [6.37464, 49.58886], [6.38342, 49.5799], [6.38024, 49.57593], [6.36676, 49.57813], [6.35825, 49.57053], [6.38228, 49.55855], [6.38072, 49.55171], [6.35666, 49.52931], [6.36788, 49.50377], [6.36907, 49.48931], [6.36778, 49.46937], [6.38352, 49.46463], [6.39168, 49.4667], [6.40274, 49.46546], [6.42432, 49.47683], [6.55404, 49.42464], [6.533, 49.40748], [6.60091, 49.36864], [6.58807, 49.35358], [6.572, 49.35027], [6.60186, 49.31055], [6.66583, 49.28065], [6.69274, 49.21661], [6.71843, 49.2208], [6.73256, 49.20486], [6.71137, 49.18808], [6.73765, 49.16375], [6.78265, 49.16793], [6.83385, 49.15162], [6.84703, 49.15734], [6.86225, 49.18185], [6.85016, 49.19354], [6.85119, 49.20038], [6.83555, 49.21249], [6.85939, 49.22376], [6.89298, 49.20863], [6.91875, 49.22261], [6.93831, 49.2223], [6.94028, 49.21641], [6.95963, 49.203], [6.97273, 49.2099], [7.01318, 49.19018], [7.03459, 49.19096], [7.0274, 49.17042], [7.03178, 49.15734], [7.04662, 49.13724], [7.04409, 49.12123], [7.04843, 49.11422], [7.05548, 49.11185], [7.06642, 49.11415], [7.07162, 49.1255], [7.09007, 49.13094], [7.07859, 49.15031], [7.10715, 49.15631], [7.10384, 49.13787], [7.12504, 49.14253], [7.1358, 49.1282], [7.1593, 49.1204], [7.23473, 49.12971], [7.29514, 49.11426], [7.3195, 49.14231], [7.35995, 49.14399], [7.3662, 49.17308], [7.44052, 49.18354], [7.44455, 49.16765], [7.49473, 49.17], [7.49172, 49.13915], [7.53012, 49.09818], [7.56416, 49.08136], [7.62575, 49.07654], [7.63618, 49.05428], [7.75948, 49.04562], [7.79557, 49.06583], [7.86386, 49.03499], [7.93641, 49.05544], [7.97783, 49.03161], [8.14189, 48.97833], [8.22604, 48.97352], [8.20031, 48.95856], [8.19989, 48.95825], [8.12813, 48.87985], [8.10253, 48.81829], [8.06802, 48.78957], [8.0326, 48.79017], [8.01534, 48.76085], [7.96994, 48.75606], [7.96812, 48.72491], [7.89002, 48.66317], [7.84098, 48.64217], [7.80057, 48.5857], [7.80167, 48.54758], [7.80647, 48.51239], [7.76833, 48.48945], [7.73109, 48.39192], [7.74562, 48.32736], [7.69022, 48.30018], [7.6648, 48.22219], [7.57137, 48.12292], [7.56966, 48.03265], [7.62302, 47.97898], [7.55673, 47.87371], [7.52921, 47.77747], [7.54761, 47.72912], [7.53722, 47.71635], [7.51266, 47.70197], [7.51915, 47.68335], [7.52067, 47.66437], [7.53384, 47.65115], [7.5591, 47.63849], [7.57423, 47.61628], [7.58851, 47.60794], [7.59301, 47.60058], [7.58945, 47.59017], [7.60523, 47.58519], [7.60459, 47.57869], [7.61929, 47.57683], [7.64309, 47.59151], [7.64213, 47.5944], [7.64599, 47.59695], [7.67395, 47.59212], [7.68229, 47.59905], [7.69385, 47.60099], [7.68486, 47.59601], [7.67115, 47.5871], [7.68904, 47.57133], [7.67655, 47.56435], [7.63338, 47.56256], [7.65083, 47.54662], [7.66174, 47.54554], [7.6656, 47.53752], [7.68101, 47.53232], [7.69642, 47.53297], [7.71961, 47.54219], [7.75261, 47.54599], [7.79486, 47.55691], [7.81901, 47.58798], [7.84412, 47.5841], [7.88664, 47.58854], [7.90673, 47.57674], [7.91251, 47.55031], [7.94494, 47.54511], [7.95682, 47.55789], [7.97581, 47.55493], [8.00113, 47.55616], [8.02136, 47.55096], [8.04383, 47.55443], [8.06663, 47.56374], [8.08557, 47.55768], [8.10002, 47.56504], [8.10395, 47.57918], [8.11543, 47.5841], [8.13662, 47.58432], [8.13823, 47.59147], [8.14947, 47.59558], [8.1652, 47.5945], [8.19378, 47.61636], [8.20617, 47.62141], [8.22011, 47.6181], [8.22577, 47.60385], [8.23809, 47.61204], [8.25863, 47.61571], [8.26313, 47.6103], [8.2824, 47.61225], [8.29722, 47.60603], [8.29524, 47.5919], [8.30277, 47.58607], [8.32735, 47.57133], [8.35512, 47.57014], [8.38273, 47.56608], [8.39477, 47.57826], [8.43235, 47.56617], [8.49431, 47.58107], [8.48949, 47.588], [8.46637, 47.58389], [8.45578, 47.60121], [8.50747, 47.61897], [8.51686, 47.63476], [8.55756, 47.62394], [8.57586, 47.59537], [8.60348, 47.61204], [8.59545, 47.64298], [8.60701, 47.65271], [8.61471, 47.64514], [8.60412, 47.63735], [8.62049, 47.63757], [8.62884, 47.65098], [8.61113, 47.66332], [8.6052, 47.67258], [8.57683, 47.66158], [8.56141, 47.67088], [8.52801, 47.66059], [8.5322, 47.64687], [8.49656, 47.64709], [8.46605, 47.64103], [8.4667, 47.65747], [8.44711, 47.65379], [8.42264, 47.66667], [8.41346, 47.66676], [8.40473, 47.67499], [8.4211, 47.68407], [8.40569, 47.69855], [8.44807, 47.72426], [8.45771, 47.7493], [8.48868, 47.77215], [8.56814, 47.78001], [8.56415, 47.80633], [8.61657, 47.79998], [8.62408, 47.7626], [8.64425, 47.76398], [8.65292, 47.80066], [8.68022, 47.78599], [8.68985, 47.75686], [8.71778, 47.76571], [8.74251, 47.75168], [8.70543, 47.73121], [8.73671, 47.7169], [8.72617, 47.69651]]]] } },
      { type: "Feature", properties: { iso1A2: "DG", iso1A3: "DGA", wikidata: "Q184851", nameEn: "Diego Garcia", country: "GB", groups: ["IO", "BOTS", "014", "202", "002", "UN"], isoStatus: "excRes", callingCodes: ["246"] }, geometry: { type: "MultiPolygon", coordinates: [[[[73.14823, -7.76302], [73.09982, -6.07324], [71.43792, -7.73904], [73.14823, -7.76302]]]] } },
      { type: "Feature", properties: { iso1A2: "DJ", iso1A3: "DJI", iso1N3: "262", wikidata: "Q977", nameEn: "Djibouti", groups: ["014", "202", "002", "UN"], callingCodes: ["253"] }, geometry: { type: "MultiPolygon", coordinates: [[[[43.90659, 12.3823], [43.90659, 12.3823], [43.32909, 12.59711], [43.29075, 12.79154], [42.86195, 12.58747], [42.7996, 12.42629], [42.6957, 12.36201], [42.46941, 12.52661], [42.4037, 12.46478], [41.95461, 11.81157], [41.82878, 11.72361], [41.77727, 11.49902], [41.8096, 11.33606], [41.80056, 10.97127], [42.06302, 10.92599], [42.13691, 10.97586], [42.42669, 10.98493], [42.62989, 11.09711], [42.75111, 11.06992], [42.79037, 10.98493], [42.95776, 10.98533], [43.90659, 12.3823]]]] } },
      { type: "Feature", properties: { iso1A2: "DK", iso1A3: "DNK", iso1N3: "208", wikidata: "Q756617", nameEn: "Kingdom of Denmark" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "DM", iso1A3: "DMA", iso1N3: "212", wikidata: "Q784", nameEn: "Dominica", groups: ["029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 767"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-61.32485, 14.91445], [-60.86656, 15.82603], [-61.95646, 15.5094], [-61.32485, 14.91445]]]] } },
      { type: "Feature", properties: { iso1A2: "DO", iso1A3: "DOM", iso1N3: "214", wikidata: "Q786", nameEn: "Dominican Republic", groups: ["029", "003", "419", "019", "UN"], callingCodes: ["1 809", "1 829", "1 849"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-67.87844, 21.7938], [-72.38946, 20.27111], [-71.77419, 19.73128], [-71.75865, 19.70231], [-71.7429, 19.58445], [-71.71449, 19.55364], [-71.71268, 19.53374], [-71.6802, 19.45008], [-71.69448, 19.37866], [-71.77766, 19.33823], [-71.73229, 19.26686], [-71.62642, 19.21212], [-71.65337, 19.11759], [-71.69938, 19.10916], [-71.71088, 19.08353], [-71.74088, 19.0437], [-71.88102, 18.95007], [-71.77766, 18.95007], [-71.72624, 18.87802], [-71.71885, 18.78423], [-71.82556, 18.62551], [-71.95412, 18.64939], [-72.00201, 18.62312], [-71.88102, 18.50125], [-71.90875, 18.45821], [-71.69952, 18.34101], [-71.78271, 18.18302], [-71.75465, 18.14405], [-71.74994, 18.11115], [-71.73783, 18.07177], [-71.75671, 18.03456], [-72.29523, 17.48026], [-68.39466, 16.14167], [-67.87844, 21.7938]]]] } },
      { type: "Feature", properties: { iso1A2: "DZ", iso1A3: "DZA", iso1N3: "012", wikidata: "Q262", nameEn: "Algeria", groups: ["015", "002", "UN"], callingCodes: ["213"] }, geometry: { type: "MultiPolygon", coordinates: [[[[8.59123, 37.14286], [5.10072, 39.89531], [-2.27707, 35.35051], [-2.21248, 35.08532], [-2.21445, 35.04378], [-2.04734, 34.93218], [-1.97833, 34.93218], [-1.97469, 34.886], [-1.73707, 34.74226], [-1.84569, 34.61907], [-1.69788, 34.48056], [-1.78042, 34.39018], [-1.64666, 34.10405], [-1.73494, 33.71721], [-1.59508, 33.59929], [-1.67067, 33.27084], [-1.46249, 33.0499], [-1.54244, 32.95499], [-1.37794, 32.73628], [-0.9912, 32.52467], [-1.24998, 32.32993], [-1.24453, 32.1917], [-1.15735, 32.12096], [-1.22829, 32.07832], [-2.46166, 32.16603], [-2.93873, 32.06557], [-2.82784, 31.79459], [-3.66314, 31.6339], [-3.66386, 31.39202], [-3.77647, 31.31912], [-3.77103, 31.14984], [-3.54944, 31.0503], [-3.65418, 30.85566], [-3.64735, 30.67539], [-4.31774, 30.53229], [-4.6058, 30.28343], [-5.21671, 29.95253], [-5.58831, 29.48103], [-5.72121, 29.52322], [-5.75616, 29.61407], [-6.69965, 29.51623], [-6.78351, 29.44634], [-6.95824, 29.50924], [-7.61585, 29.36252], [-8.6715, 28.71194], [-8.66879, 27.6666], [-8.66674, 27.31569], [-4.83423, 24.99935], [1.15698, 21.12843], [1.20992, 20.73533], [3.24648, 19.81703], [3.12501, 19.1366], [3.36082, 18.9745], [4.26651, 19.14224], [5.8153, 19.45101], [7.38361, 20.79165], [7.48273, 20.87258], [11.96886, 23.51735], [11.62498, 24.26669], [11.41061, 24.21456], [10.85323, 24.5595], [10.33159, 24.5465], [10.02432, 24.98124], [10.03146, 25.35635], [9.38834, 26.19288], [9.51696, 26.39148], [9.89569, 26.57696], [9.78136, 29.40961], [9.3876, 30.16738], [9.55544, 30.23971], [9.07483, 32.07865], [8.35999, 32.50101], [8.31895, 32.83483], [8.1179, 33.05086], [8.11433, 33.10175], [7.83028, 33.18851], [7.73687, 33.42114], [7.54088, 33.7726], [7.52851, 34.06493], [7.66174, 34.20167], [7.74207, 34.16492], [7.81242, 34.21841], [7.86264, 34.3987], [8.20482, 34.57575], [8.29655, 34.72798], [8.25189, 34.92009], [8.30727, 34.95378], [8.3555, 35.10007], [8.47318, 35.23376], [8.30329, 35.29884], [8.36086, 35.47774], [8.35371, 35.66373], [8.26472, 35.73669], [8.2626, 35.91733], [8.40731, 36.42208], [8.18936, 36.44939], [8.16167, 36.48817], [8.47609, 36.66607], [8.46537, 36.7706], [8.57613, 36.78062], [8.67706, 36.8364], [8.62972, 36.86499], [8.64044, 36.9401], [8.59123, 37.14286]]]] } },
      { type: "Feature", properties: { iso1A2: "EA", wikidata: "Q28868874", nameEn: "Ceuta, Melilla", country: "ES", level: "territory", isoStatus: "excRes" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "EC", iso1A3: "ECU", iso1N3: "218", wikidata: "Q736", nameEn: "Ecuador" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "EE", iso1A3: "EST", iso1N3: "233", wikidata: "Q191", nameEn: "Estonia", aliases: ["EW"], groups: ["EU", "154", "150", "UN"], callingCodes: ["372"] }, geometry: { type: "MultiPolygon", coordinates: [[[[26.32936, 60.00121], [20.5104, 59.15546], [19.84909, 57.57876], [22.80496, 57.87798], [23.20055, 57.56697], [24.26221, 57.91787], [24.3579, 57.87471], [25.19484, 58.0831], [25.28237, 57.98539], [25.29581, 58.08288], [25.73499, 57.90193], [26.05949, 57.84744], [26.0324, 57.79037], [26.02456, 57.78342], [26.027, 57.78158], [26.0266, 57.77441], [26.02069, 57.77169], [26.02415, 57.76865], [26.03332, 57.7718], [26.0543, 57.76105], [26.08098, 57.76619], [26.2029, 57.7206], [26.1866, 57.6849], [26.29253, 57.59244], [26.46527, 57.56885], [26.54675, 57.51813], [26.90364, 57.62823], [27.34698, 57.52242], [27.31919, 57.57672], [27.40393, 57.62125], [27.3746, 57.66834], [27.52615, 57.72843], [27.50171, 57.78842], [27.56689, 57.83356], [27.78526, 57.83963], [27.81841, 57.89244], [27.67282, 57.92627], [27.62393, 58.09462], [27.48541, 58.22615], [27.55489, 58.39525], [27.36366, 58.78381], [27.74429, 58.98351], [27.80482, 59.1116], [27.87978, 59.18097], [27.90911, 59.24353], [28.00689, 59.28351], [28.14215, 59.28934], [28.19284, 59.35791], [28.20537, 59.36491], [28.21137, 59.38058], [28.19061, 59.39962], [28.04187, 59.47017], [27.85643, 59.58538], [26.90044, 59.63819], [26.32936, 60.00121]]]] } },
      { type: "Feature", properties: { iso1A2: "EG", iso1A3: "EGY", iso1N3: "818", wikidata: "Q79", nameEn: "Egypt", groups: ["015", "002", "UN"], callingCodes: ["20"] }, geometry: { type: "MultiPolygon", coordinates: [[[[33.62659, 31.82938], [26.92891, 33.39516], [24.8458, 31.39877], [25.01077, 30.73861], [24.71117, 30.17441], [24.99968, 29.24574], [24.99885, 21.99535], [33.17563, 22.00405], [34.0765, 22.00501], [37.8565, 22.00903], [34.4454, 27.91479], [34.8812, 29.36878], [34.92298, 29.45305], [34.26742, 31.21998], [34.24012, 31.29591], [34.23572, 31.2966], [34.21853, 31.32363], [34.052, 31.46619], [33.62659, 31.82938]]]] } },
      { type: "Feature", properties: { iso1A2: "EH", iso1A3: "ESH", iso1N3: "732", wikidata: "Q6250", nameEn: "Western Sahara", groups: ["015", "002"], callingCodes: ["212"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-8.66879, 27.6666], [-8.77527, 27.66663], [-8.71787, 26.9898], [-9.08698, 26.98639], [-9.56957, 26.90042], [-9.81998, 26.71379], [-10.68417, 26.90984], [-11.35695, 26.8505], [-11.23622, 26.72023], [-11.38635, 26.611], [-11.62052, 26.05229], [-12.06001, 26.04442], [-12.12281, 25.13682], [-12.92147, 24.39502], [-13.00628, 24.01923], [-13.75627, 23.77231], [-14.10361, 22.75501], [-14.1291, 22.41636], [-14.48112, 22.00886], [-14.47329, 21.63839], [-14.78487, 21.36587], [-16.44269, 21.39745], [-16.9978, 21.36239], [-17.02707, 21.34022], [-17.21511, 21.34226], [-17.35589, 20.80492], [-17.0471, 20.76408], [-17.0695, 20.85742], [-17.06781, 20.92697], [-17.0396, 20.9961], [-17.0357, 21.05368], [-16.99806, 21.12142], [-16.95474, 21.33997], [-13.01525, 21.33343], [-13.08438, 22.53866], [-13.15313, 22.75649], [-13.10753, 22.89493], [-13.00412, 23.02297], [-12.5741, 23.28975], [-12.36213, 23.3187], [-12.14969, 23.41935], [-12.00251, 23.4538], [-12.0002, 25.9986], [-8.66721, 25.99918], [-8.66674, 27.31569], [-8.66879, 27.6666]]]] } },
      { type: "Feature", properties: { iso1A2: "ER", iso1A3: "ERI", iso1N3: "232", wikidata: "Q986", nameEn: "Eritrea", groups: ["014", "202", "002", "UN"], callingCodes: ["291"] }, geometry: { type: "MultiPolygon", coordinates: [[[[40.99158, 15.81743], [39.63762, 18.37348], [38.57727, 17.98125], [38.45916, 17.87167], [38.37133, 17.66269], [38.13362, 17.53906], [37.50967, 17.32199], [37.42694, 17.04041], [36.99777, 17.07172], [36.92193, 16.23451], [36.76371, 15.80831], [36.69761, 15.75323], [36.54276, 15.23478], [36.44337, 15.14963], [36.54376, 14.25597], [36.56536, 14.26177], [36.55659, 14.28237], [36.63364, 14.31172], [36.85787, 14.32201], [37.01622, 14.2561], [37.09486, 14.27155], [37.13206, 14.40746], [37.3106, 14.44657], [37.47319, 14.2149], [37.528, 14.18413], [37.91287, 14.89447], [38.0364, 14.72745], [38.25562, 14.67287], [38.3533, 14.51323], [38.45748, 14.41445], [38.78306, 14.4754], [38.98058, 14.54895], [39.02834, 14.63717], [39.16074, 14.65187], [39.14772, 14.61827], [39.19547, 14.56996], [39.23888, 14.56365], [39.26927, 14.48801], [39.2302, 14.44598], [39.2519, 14.40393], [39.37685, 14.54402], [39.52756, 14.49011], [39.50585, 14.55735], [39.58182, 14.60987], [39.76632, 14.54264], [39.9443, 14.41024], [40.07236, 14.54264], [40.14649, 14.53969], [40.21128, 14.39342], [40.25686, 14.41445], [40.9167, 14.11152], [41.25097, 13.60787], [41.62864, 13.38626], [42.05841, 12.80912], [42.21469, 12.75832], [42.2798, 12.6355], [42.4037, 12.46478], [42.46941, 12.52661], [42.6957, 12.36201], [42.7996, 12.42629], [42.86195, 12.58747], [43.29075, 12.79154], [40.99158, 15.81743]]]] } },
      { type: "Feature", properties: { iso1A2: "ES", iso1A3: "ESP", iso1N3: "724", wikidata: "Q29", nameEn: "Spain" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "ET", iso1A3: "ETH", iso1N3: "231", wikidata: "Q115", nameEn: "Ethiopia", groups: ["014", "202", "002", "UN"], callingCodes: ["251"] }, geometry: { type: "MultiPolygon", coordinates: [[[[42.4037, 12.46478], [42.2798, 12.6355], [42.21469, 12.75832], [42.05841, 12.80912], [41.62864, 13.38626], [41.25097, 13.60787], [40.9167, 14.11152], [40.25686, 14.41445], [40.21128, 14.39342], [40.14649, 14.53969], [40.07236, 14.54264], [39.9443, 14.41024], [39.76632, 14.54264], [39.58182, 14.60987], [39.50585, 14.55735], [39.52756, 14.49011], [39.37685, 14.54402], [39.2519, 14.40393], [39.2302, 14.44598], [39.26927, 14.48801], [39.23888, 14.56365], [39.19547, 14.56996], [39.14772, 14.61827], [39.16074, 14.65187], [39.02834, 14.63717], [38.98058, 14.54895], [38.78306, 14.4754], [38.45748, 14.41445], [38.3533, 14.51323], [38.25562, 14.67287], [38.0364, 14.72745], [37.91287, 14.89447], [37.528, 14.18413], [37.47319, 14.2149], [37.3106, 14.44657], [37.13206, 14.40746], [37.09486, 14.27155], [37.01622, 14.2561], [36.85787, 14.32201], [36.63364, 14.31172], [36.55659, 14.28237], [36.56536, 14.26177], [36.54376, 14.25597], [36.44653, 13.95666], [36.48824, 13.83954], [36.38993, 13.56459], [36.24545, 13.36759], [36.13374, 12.92665], [36.16651, 12.88019], [36.14268, 12.70879], [36.01458, 12.72478], [35.70476, 12.67101], [35.24302, 11.91132], [35.11492, 11.85156], [35.05832, 11.71158], [35.09556, 11.56278], [34.95704, 11.24448], [35.01215, 11.19626], [34.93172, 10.95946], [34.97789, 10.91559], [34.97491, 10.86147], [34.86916, 10.78832], [34.86618, 10.74588], [34.77532, 10.69027], [34.77383, 10.74588], [34.59062, 10.89072], [34.4372, 10.781], [34.2823, 10.53508], [34.34783, 10.23914], [34.32102, 10.11599], [34.22718, 10.02506], [34.20484, 9.9033], [34.13186, 9.7492], [34.08717, 9.55243], [34.10229, 9.50238], [34.14304, 9.04654], [34.14453, 8.60204], [34.01346, 8.50041], [33.89579, 8.4842], [33.87195, 8.41938], [33.71407, 8.3678], [33.66938, 8.44442], [33.54575, 8.47094], [33.3119, 8.45474], [33.19721, 8.40317], [33.1853, 8.29264], [33.18083, 8.13047], [33.08401, 8.05822], [33.0006, 7.90333], [33.04944, 7.78989], [33.24637, 7.77939], [33.32531, 7.71297], [33.44745, 7.7543], [33.71407, 7.65983], [33.87642, 7.5491], [34.02984, 7.36449], [34.03878, 7.27437], [34.01495, 7.25664], [34.19369, 7.12807], [34.19369, 7.04382], [34.35753, 6.91963], [34.47669, 6.91076], [34.53925, 6.82794], [34.53776, 6.74808], [34.65096, 6.72589], [34.77459, 6.5957], [34.87736, 6.60161], [35.01738, 6.46991], [34.96227, 6.26415], [35.00546, 5.89387], [35.12611, 5.68937], [35.13058, 5.62118], [35.31188, 5.50106], [35.29938, 5.34042], [35.50792, 5.42431], [35.8576, 5.33413], [35.81968, 5.10757], [35.82118, 4.77382], [35.9419, 4.61933], [35.95449, 4.53244], [36.03924, 4.44406], [36.84474, 4.44518], [37.07724, 4.33503], [38.14168, 3.62487], [38.45812, 3.60445], [38.52336, 3.62551], [38.91938, 3.51198], [39.07736, 3.5267], [39.19954, 3.47834], [39.49444, 3.45521], [39.51551, 3.40895], [39.55132, 3.39634], [39.58339, 3.47434], [39.76808, 3.67058], [39.86043, 3.86974], [40.77498, 4.27683], [41.1754, 3.94079], [41.89488, 3.97375], [42.07619, 4.17667], [42.55853, 4.20518], [42.84526, 4.28357], [42.97746, 4.44032], [43.04177, 4.57923], [43.40263, 4.79289], [44.02436, 4.9451], [44.98104, 4.91821], [47.97917, 8.00124], [47.92477, 8.00111], [46.99339, 7.9989], [44.19222, 8.93028], [43.32613, 9.59205], [43.23518, 9.84605], [43.0937, 9.90579], [42.87643, 10.18441], [42.69452, 10.62672], [42.95776, 10.98533], [42.79037, 10.98493], [42.75111, 11.06992], [42.62989, 11.09711], [42.42669, 10.98493], [42.13691, 10.97586], [42.06302, 10.92599], [41.80056, 10.97127], [41.8096, 11.33606], [41.77727, 11.49902], [41.82878, 11.72361], [41.95461, 11.81157], [42.4037, 12.46478]]]] } },
      { type: "Feature", properties: { iso1A2: "EU", iso1A3: "EUE", wikidata: "Q458", nameEn: "European Union", level: "union", isoStatus: "excRes" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "FI", iso1A3: "FIN", iso1N3: "246", wikidata: "Q33", nameEn: "Finland", aliases: ["SF"] }, geometry: null },
      { type: "Feature", properties: { iso1A2: "FJ", iso1A3: "FJI", iso1N3: "242", wikidata: "Q712", nameEn: "Fiji", groups: ["054", "009", "UN"], driveSide: "left", callingCodes: ["679"] }, geometry: { type: "MultiPolygon", coordinates: [[[[174.245, -23.1974], [179.99999, -22.5], [179.99999, -11.5], [174, -11.5], [174.245, -23.1974]]], [[[-176.76826, -14.95183], [-180, -14.96041], [-180, -22.90585], [-176.74538, -22.89767], [-176.76826, -14.95183]]]] } },
      { type: "Feature", properties: { iso1A2: "FK", iso1A3: "FLK", iso1N3: "238", wikidata: "Q9648", nameEn: "Falkland Islands", country: "GB", groups: ["BOTS", "005", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["500"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-63.67376, -55.11859], [-54.56126, -51.26248], [-61.26735, -50.63919], [-63.67376, -55.11859]]]] } },
      { type: "Feature", properties: { iso1A2: "FM", iso1A3: "FSM", iso1N3: "583", wikidata: "Q702", nameEn: "Federated States of Micronesia", groups: ["057", "009", "UN"], roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["691"] }, geometry: { type: "MultiPolygon", coordinates: [[[[138.20583, 13.3783], [136.27107, 6.73747], [156.88247, -1.39237], [165.19726, 6.22546], [138.20583, 13.3783]]]] } },
      { type: "Feature", properties: { iso1A2: "FO", iso1A3: "FRO", iso1N3: "234", wikidata: "Q4628", nameEn: "Faroe Islands", country: "DK", groups: ["154", "150", "UN"], callingCodes: ["298"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-8.51774, 62.35338], [-6.51083, 60.95272], [-5.70102, 62.77194], [-8.51774, 62.35338]]]] } },
      { type: "Feature", properties: { iso1A2: "FR", iso1A3: "FRA", iso1N3: "250", wikidata: "Q142", nameEn: "France" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "FX", iso1A3: "FXX", iso1N3: "249", wikidata: "Q212429", nameEn: "Metropolitan France", country: "FR", groups: ["EU", "155", "150", "UN"], isoStatus: "excRes", callingCodes: ["33"] }, geometry: { type: "MultiPolygon", coordinates: [[[[2.55904, 51.07014], [2.18458, 51.52087], [1.17405, 50.74239], [-2.02963, 49.91866], [-2.09454, 49.46288], [-1.83944, 49.23037], [-2.00491, 48.86706], [-2.65349, 49.15373], [-6.28985, 48.93406], [-1.81005, 43.59738], [-1.77289, 43.38957], [-1.79319, 43.37497], [-1.78332, 43.36399], [-1.78714, 43.35476], [-1.77068, 43.34396], [-1.75334, 43.34107], [-1.75079, 43.3317], [-1.7397, 43.32979], [-1.73074, 43.29481], [-1.69407, 43.31378], [-1.62481, 43.30726], [-1.63052, 43.28591], [-1.61341, 43.25269], [-1.57674, 43.25269], [-1.55963, 43.28828], [-1.50992, 43.29481], [-1.45289, 43.27049], [-1.40942, 43.27272], [-1.3758, 43.24511], [-1.41562, 43.12815], [-1.47555, 43.08372], [-1.44067, 43.047], [-1.35272, 43.02658], [-1.34419, 43.09665], [-1.32209, 43.1127], [-1.27118, 43.11961], [-1.30052, 43.09581], [-1.30531, 43.06859], [-1.25244, 43.04164], [-1.22881, 43.05534], [-1.10333, 43.0059], [-1.00963, 42.99279], [-0.97133, 42.96239], [-0.81652, 42.95166], [-0.75478, 42.96916], [-0.72037, 42.92541], [-0.73422, 42.91228], [-0.72608, 42.89318], [-0.69837, 42.87945], [-0.67637, 42.88303], [-0.55497, 42.77846], [-0.50863, 42.82713], [-0.44334, 42.79939], [-0.41319, 42.80776], [-0.38833, 42.80132], [-0.3122, 42.84788], [-0.17939, 42.78974], [-0.16141, 42.79535], [-0.10519, 42.72761], [-0.02468, 42.68513], [0.17569, 42.73424], [0.25336, 42.7174], [0.29407, 42.67431], [0.36251, 42.72282], [0.40214, 42.69779], [0.67873, 42.69458], [0.65421, 42.75872], [0.66121, 42.84021], [0.711, 42.86372], [0.93089, 42.79154], [0.96166, 42.80629], [0.98292, 42.78754], [1.0804, 42.78569], [1.15928, 42.71407], [1.35562, 42.71944], [1.44197, 42.60217], [1.47986, 42.61346], [1.46718, 42.63296], [1.48043, 42.65203], [1.50867, 42.64483], [1.55418, 42.65669], [1.60085, 42.62703], [1.63485, 42.62957], [1.6625, 42.61982], [1.68267, 42.62533], [1.73452, 42.61515], [1.72588, 42.59098], [1.7858, 42.57698], [1.73683, 42.55492], [1.72515, 42.50338], [1.76335, 42.48863], [1.83037, 42.48395], [1.88853, 42.4501], [1.93663, 42.45439], [1.94292, 42.44316], [1.94061, 42.43333], [1.94084, 42.43039], [1.9574, 42.42401], [1.96482, 42.37787], [2.00488, 42.35399], [2.06241, 42.35906], [2.11621, 42.38393], [2.12789, 42.41291], [2.16599, 42.42314], [2.20578, 42.41633], [2.25551, 42.43757], [2.38504, 42.39977], [2.43299, 42.39423], [2.43508, 42.37568], [2.48457, 42.33933], [2.54382, 42.33406], [2.55516, 42.35351], [2.57934, 42.35808], [2.6747, 42.33974], [2.65311, 42.38771], [2.72056, 42.42298], [2.75497, 42.42578], [2.77464, 42.41046], [2.84335, 42.45724], [2.85675, 42.45444], [2.86983, 42.46843], [2.88413, 42.45938], [2.92107, 42.4573], [2.94283, 42.48174], [2.96518, 42.46692], [3.03734, 42.47363], [3.08167, 42.42748], [3.10027, 42.42621], [3.11379, 42.43646], [3.17156, 42.43545], [3.75438, 42.33445], [7.60802, 41.05927], [10.09675, 41.44089], [9.56115, 43.20816], [7.50102, 43.51859], [7.42422, 43.72209], [7.40903, 43.7296], [7.41113, 43.73156], [7.41291, 43.73168], [7.41298, 43.73311], [7.41233, 43.73439], [7.42062, 43.73977], [7.42299, 43.74176], [7.42443, 43.74087], [7.42809, 43.74396], [7.43013, 43.74895], [7.43624, 43.75014], [7.43708, 43.75197], [7.4389, 43.75151], [7.4379, 43.74963], [7.47823, 43.73341], [7.53006, 43.78405], [7.50423, 43.84345], [7.49355, 43.86551], [7.51162, 43.88301], [7.56075, 43.89932], [7.56858, 43.94506], [7.60771, 43.95772], [7.65266, 43.9763], [7.66848, 43.99943], [7.6597, 44.03009], [7.72508, 44.07578], [7.66878, 44.12795], [7.68694, 44.17487], [7.63245, 44.17877], [7.62155, 44.14881], [7.36364, 44.11882], [7.34547, 44.14359], [7.27827, 44.1462], [7.16929, 44.20352], [7.00764, 44.23736], [6.98221, 44.28289], [6.89171, 44.36637], [6.88784, 44.42043], [6.94504, 44.43112], [6.86233, 44.49834], [6.85507, 44.53072], [6.96042, 44.62129], [6.95133, 44.66264], [7.00582, 44.69364], [7.07484, 44.68073], [7.00401, 44.78782], [7.02217, 44.82519], [6.93499, 44.8664], [6.90774, 44.84322], [6.75518, 44.89915], [6.74519, 44.93661], [6.74791, 45.01939], [6.66981, 45.02324], [6.62803, 45.11175], [6.7697, 45.16044], [6.85144, 45.13226], [6.96706, 45.20841], [7.07074, 45.21228], [7.13115, 45.25386], [7.10572, 45.32924], [7.18019, 45.40071], [7.00037, 45.509], [6.98948, 45.63869], [6.80785, 45.71864], [6.80785, 45.83265], [6.95315, 45.85163], [7.04151, 45.92435], [7.00946, 45.9944], [6.93862, 46.06502], [6.87868, 46.03855], [6.89321, 46.12548], [6.78968, 46.14058], [6.86052, 46.28512], [6.77152, 46.34784], [6.8024, 46.39171], [6.82312, 46.42661], [6.53358, 46.45431], [6.25432, 46.3632], [6.21981, 46.31304], [6.24826, 46.30175], [6.25137, 46.29014], [6.23775, 46.27822], [6.24952, 46.26255], [6.26749, 46.24745], [6.29474, 46.26221], [6.31041, 46.24417], [6.29663, 46.22688], [6.27694, 46.21566], [6.26007, 46.21165], [6.24821, 46.20531], [6.23913, 46.20511], [6.23544, 46.20714], [6.22175, 46.20045], [6.22222, 46.19888], [6.21844, 46.19837], [6.21603, 46.19507], [6.21273, 46.19409], [6.21114, 46.1927], [6.20539, 46.19163], [6.19807, 46.18369], [6.19552, 46.18401], [6.18707, 46.17999], [6.18871, 46.16644], [6.18116, 46.16187], [6.15305, 46.15194], [6.13397, 46.1406], [6.09926, 46.14373], [6.09199, 46.15191], [6.07491, 46.14879], [6.05203, 46.15191], [6.04564, 46.14031], [6.03614, 46.13712], [6.01791, 46.14228], [5.9871, 46.14499], [5.97893, 46.13303], [5.95781, 46.12925], [5.9641, 46.14412], [5.97508, 46.15863], [5.98188, 46.17392], [5.98846, 46.17046], [5.99573, 46.18587], [5.96515, 46.19638], [5.97542, 46.21525], [6.02461, 46.23313], [6.03342, 46.2383], [6.04602, 46.23127], [6.05029, 46.23518], [6.0633, 46.24583], [6.07072, 46.24085], [6.08563, 46.24651], [6.10071, 46.23772], [6.12446, 46.25059], [6.11926, 46.2634], [6.1013, 46.28512], [6.11697, 46.29547], [6.1198, 46.31157], [6.13876, 46.33844], [6.15738, 46.3491], [6.16987, 46.36759], [6.15985, 46.37721], [6.15016, 46.3778], [6.09926, 46.40768], [6.06407, 46.41676], [6.08427, 46.44305], [6.07269, 46.46244], [6.1567, 46.54402], [6.11084, 46.57649], [6.27135, 46.68251], [6.38351, 46.73171], [6.45209, 46.77502], [6.43216, 46.80336], [6.46456, 46.88865], [6.43341, 46.92703], [6.71531, 47.0494], [6.68823, 47.06616], [6.76788, 47.1208], [6.8489, 47.15933], [6.9508, 47.24338], [6.95108, 47.26428], [6.94316, 47.28747], [7.05305, 47.33304], [7.0564, 47.35134], [7.03125, 47.36996], [6.87959, 47.35335], [6.88542, 47.37262], [6.93744, 47.40714], [6.93953, 47.43388], [7.0024, 47.45264], [6.98425, 47.49432], [7.0231, 47.50522], [7.07425, 47.48863], [7.12781, 47.50371], [7.16249, 47.49025], [7.19583, 47.49455], [7.17026, 47.44312], [7.24669, 47.4205], [7.33526, 47.44186], [7.35603, 47.43432], [7.40308, 47.43638], [7.43088, 47.45846], [7.4462, 47.46264], [7.4583, 47.47216], [7.42923, 47.48628], [7.43356, 47.49712], [7.47534, 47.47932], [7.51076, 47.49651], [7.49804, 47.51798], [7.5229, 47.51644], [7.53199, 47.5284], [7.51904, 47.53515], [7.50588, 47.52856], [7.49691, 47.53821], [7.50873, 47.54546], [7.51723, 47.54578], [7.52831, 47.55347], [7.53634, 47.55553], [7.55652, 47.56779], [7.55689, 47.57232], [7.56548, 47.57617], [7.56684, 47.57785], [7.58386, 47.57536], [7.58945, 47.59017], [7.59301, 47.60058], [7.58851, 47.60794], [7.57423, 47.61628], [7.5591, 47.63849], [7.53384, 47.65115], [7.52067, 47.66437], [7.51915, 47.68335], [7.51266, 47.70197], [7.53722, 47.71635], [7.54761, 47.72912], [7.52921, 47.77747], [7.55673, 47.87371], [7.62302, 47.97898], [7.56966, 48.03265], [7.57137, 48.12292], [7.6648, 48.22219], [7.69022, 48.30018], [7.74562, 48.32736], [7.73109, 48.39192], [7.76833, 48.48945], [7.80647, 48.51239], [7.80167, 48.54758], [7.80057, 48.5857], [7.84098, 48.64217], [7.89002, 48.66317], [7.96812, 48.72491], [7.96994, 48.75606], [8.01534, 48.76085], [8.0326, 48.79017], [8.06802, 48.78957], [8.10253, 48.81829], [8.12813, 48.87985], [8.19989, 48.95825], [8.20031, 48.95856], [8.22604, 48.97352], [8.14189, 48.97833], [7.97783, 49.03161], [7.93641, 49.05544], [7.86386, 49.03499], [7.79557, 49.06583], [7.75948, 49.04562], [7.63618, 49.05428], [7.62575, 49.07654], [7.56416, 49.08136], [7.53012, 49.09818], [7.49172, 49.13915], [7.49473, 49.17], [7.44455, 49.16765], [7.44052, 49.18354], [7.3662, 49.17308], [7.35995, 49.14399], [7.3195, 49.14231], [7.29514, 49.11426], [7.23473, 49.12971], [7.1593, 49.1204], [7.1358, 49.1282], [7.12504, 49.14253], [7.10384, 49.13787], [7.10715, 49.15631], [7.07859, 49.15031], [7.09007, 49.13094], [7.07162, 49.1255], [7.06642, 49.11415], [7.05548, 49.11185], [7.04843, 49.11422], [7.04409, 49.12123], [7.04662, 49.13724], [7.03178, 49.15734], [7.0274, 49.17042], [7.03459, 49.19096], [7.01318, 49.19018], [6.97273, 49.2099], [6.95963, 49.203], [6.94028, 49.21641], [6.93831, 49.2223], [6.91875, 49.22261], [6.89298, 49.20863], [6.85939, 49.22376], [6.83555, 49.21249], [6.85119, 49.20038], [6.85016, 49.19354], [6.86225, 49.18185], [6.84703, 49.15734], [6.83385, 49.15162], [6.78265, 49.16793], [6.73765, 49.16375], [6.71137, 49.18808], [6.73256, 49.20486], [6.71843, 49.2208], [6.69274, 49.21661], [6.66583, 49.28065], [6.60186, 49.31055], [6.572, 49.35027], [6.58807, 49.35358], [6.60091, 49.36864], [6.533, 49.40748], [6.55404, 49.42464], [6.42432, 49.47683], [6.40274, 49.46546], [6.39168, 49.4667], [6.38352, 49.46463], [6.36778, 49.46937], [6.3687, 49.4593], [6.28818, 49.48465], [6.27875, 49.503], [6.25029, 49.50609], [6.2409, 49.51408], [6.19543, 49.50536], [6.17386, 49.50934], [6.15366, 49.50226], [6.16115, 49.49297], [6.14321, 49.48796], [6.12814, 49.49365], [6.12346, 49.4735], [6.10325, 49.4707], [6.09845, 49.46351], [6.10072, 49.45268], [6.08373, 49.45594], [6.07887, 49.46399], [6.05553, 49.46663], [6.04176, 49.44801], [6.02743, 49.44845], [6.02648, 49.45451], [5.97693, 49.45513], [5.96876, 49.49053], [5.94224, 49.49608], [5.94128, 49.50034], [5.86571, 49.50015], [5.83389, 49.52152], [5.83467, 49.52717], [5.84466, 49.53027], [5.83648, 49.5425], [5.81664, 49.53775], [5.80871, 49.5425], [5.81838, 49.54777], [5.79195, 49.55228], [5.77435, 49.56298], [5.7577, 49.55915], [5.75649, 49.54321], [5.64505, 49.55146], [5.60909, 49.51228], [5.55001, 49.52729], [5.46541, 49.49825], [5.46734, 49.52648], [5.43713, 49.5707], [5.3974, 49.61596], [5.34837, 49.62889], [5.33851, 49.61599], [5.3137, 49.61225], [5.30214, 49.63055], [5.33039, 49.6555], [5.31465, 49.66846], [5.26232, 49.69456], [5.14545, 49.70287], [5.09249, 49.76193], [4.96714, 49.79872], [4.85464, 49.78995], [4.86965, 49.82271], [4.85134, 49.86457], [4.88529, 49.9236], [4.78827, 49.95609], [4.8382, 50.06738], [4.88602, 50.15182], [4.83279, 50.15331], [4.82438, 50.16878], [4.75237, 50.11314], [4.70064, 50.09384], [4.68695, 49.99685], [4.5414, 49.96911], [4.51098, 49.94659], [4.43488, 49.94122], [4.35051, 49.95315], [4.31963, 49.97043], [4.20532, 49.95803], [4.14239, 49.98034], [4.13508, 50.01976], [4.16294, 50.04719], [4.23101, 50.06945], [4.20147, 50.13535], [4.13561, 50.13078], [4.16014, 50.19239], [4.15524, 50.21103], [4.21945, 50.25539], [4.20651, 50.27333], [4.17861, 50.27443], [4.17347, 50.28838], [4.15524, 50.2833], [4.16808, 50.25786], [4.13665, 50.25609], [4.11954, 50.30425], [4.10957, 50.30234], [4.10237, 50.31247], [4.0689, 50.3254], [4.0268, 50.35793], [3.96771, 50.34989], [3.90781, 50.32814], [3.84314, 50.35219], [3.73911, 50.34809], [3.70987, 50.3191], [3.71009, 50.30305], [3.66976, 50.34563], [3.65709, 50.36873], [3.67262, 50.38663], [3.67494, 50.40239], [3.66153, 50.45165], [3.64426, 50.46275], [3.61014, 50.49568], [3.58361, 50.49049], [3.5683, 50.50192], [3.49509, 50.48885], [3.51564, 50.5256], [3.47385, 50.53397], [3.44629, 50.51009], [3.37693, 50.49538], [3.28575, 50.52724], [3.2729, 50.60718], [3.23951, 50.6585], [3.264, 50.67668], [3.2536, 50.68977], [3.26141, 50.69151], [3.26063, 50.70086], [3.24593, 50.71389], [3.22042, 50.71019], [3.20845, 50.71662], [3.19017, 50.72569], [3.20064, 50.73547], [3.18811, 50.74025], [3.18339, 50.74981], [3.16476, 50.76843], [3.15017, 50.79031], [3.1257, 50.78603], [3.11987, 50.79188], [3.11206, 50.79416], [3.10614, 50.78303], [3.09163, 50.77717], [3.04314, 50.77674], [3.00537, 50.76588], [2.96778, 50.75242], [2.95019, 50.75138], [2.90873, 50.702], [2.91036, 50.6939], [2.90069, 50.69263], [2.88504, 50.70656], [2.87937, 50.70298], [2.86985, 50.7033], [2.8483, 50.72276], [2.81056, 50.71773], [2.71165, 50.81295], [2.63331, 50.81457], [2.59093, 50.91751], [2.63074, 50.94746], [2.57551, 51.00326], [2.55904, 51.07014]], [[1.99838, 42.44682], [1.98378, 42.44697], [1.96125, 42.45364], [1.95606, 42.45785], [1.96215, 42.47854], [1.97003, 42.48081], [1.97227, 42.48487], [1.97697, 42.48568], [1.98022, 42.49569], [1.98916, 42.49351], [1.99766, 42.4858], [1.98579, 42.47486], [1.99216, 42.46208], [2.01564, 42.45171], [1.99838, 42.44682]]]] } },
      { type: "Feature", properties: { iso1A2: "GA", iso1A3: "GAB", iso1N3: "266", wikidata: "Q1000", nameEn: "Gabon", groups: ["017", "202", "002", "UN"], callingCodes: ["241"] }, geometry: { type: "MultiPolygon", coordinates: [[[[13.29457, 2.16106], [13.28534, 2.25716], [11.37116, 2.29975], [11.3561, 2.17217], [11.35307, 1.00251], [9.79648, 1.0019], [9.75065, 1.06753], [9.66433, 1.06723], [7.24416, -0.64092], [10.75913, -4.39519], [11.12647, -3.94169], [11.22301, -3.69888], [11.48764, -3.51089], [11.57949, -3.52798], [11.68608, -3.68942], [11.87083, -3.71571], [11.92719, -3.62768], [11.8318, -3.5812], [11.96554, -3.30267], [11.70227, -3.17465], [11.70558, -3.0773], [11.80365, -3.00424], [11.64798, -2.81146], [11.5359, -2.85654], [11.64487, -2.61865], [11.57637, -2.33379], [11.74605, -2.39936], [11.96866, -2.33559], [12.04895, -2.41704], [12.47925, -2.32626], [12.44656, -1.92025], [12.61312, -1.8129], [12.82172, -1.91091], [13.02759, -2.33098], [13.47977, -2.43224], [13.75884, -2.09293], [13.92073, -2.35581], [13.85846, -2.46935], [14.10442, -2.49268], [14.23829, -2.33715], [14.16202, -2.23916], [14.23518, -2.15671], [14.25932, -1.97624], [14.41838, -1.89412], [14.52569, -0.57818], [14.41887, -0.44799], [14.2165, -0.38261], [14.06862, -0.20826], [13.90632, -0.2287], [13.88648, 0.26652], [14.10909, 0.58563], [14.26066, 0.57255], [14.48179, 0.9152], [14.25186, 1.39842], [13.89582, 1.4261], [13.15519, 1.23368], [13.25447, 1.32339], [13.13461, 1.57238], [13.29457, 2.16106]]]] } },
      { type: "Feature", properties: { iso1A2: "GB", iso1A3: "GBR", iso1N3: "826", wikidata: "Q145", ccTLD: ".uk", nameEn: "United Kingdom", aliases: ["UK"] }, geometry: null },
      { type: "Feature", properties: { iso1A2: "GD", iso1A3: "GRD", iso1N3: "308", wikidata: "Q769", nameEn: "Grenada", aliases: ["WG"], groups: ["029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 473"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-62.64026, 12.69984], [-61.77886, 11.36496], [-59.94058, 12.34011], [-62.64026, 12.69984]]]] } },
      { type: "Feature", properties: { iso1A2: "GE", iso1A3: "GEO", iso1N3: "268", wikidata: "Q230", nameEn: "Georgia", groups: ["145", "142", "UN"], callingCodes: ["995"] }, geometry: { type: "MultiPolygon", coordinates: [[[[46.42738, 41.91323], [45.61676, 42.20768], [45.78692, 42.48358], [45.36501, 42.55268], [45.15318, 42.70598], [44.88754, 42.74934], [44.80941, 42.61277], [44.70002, 42.74679], [44.54202, 42.75699], [43.95517, 42.55396], [43.73119, 42.62043], [43.81453, 42.74297], [43.0419, 43.02413], [43.03322, 43.08883], [42.75889, 43.19651], [42.66667, 43.13917], [42.40563, 43.23226], [41.64935, 43.22331], [40.65957, 43.56212], [40.10657, 43.57344], [40.04445, 43.47776], [40.03312, 43.44262], [40.01007, 43.42411], [40.01552, 43.42025], [40.00853, 43.40578], [40.0078, 43.38551], [39.81147, 43.06294], [40.89217, 41.72528], [41.54366, 41.52185], [41.7148, 41.4932], [41.7124, 41.47417], [41.81939, 41.43621], [41.95134, 41.52466], [42.26387, 41.49346], [42.51772, 41.43606], [42.59202, 41.58183], [42.72794, 41.59714], [42.84471, 41.58912], [42.78995, 41.50126], [42.84899, 41.47265], [42.8785, 41.50516], [43.02956, 41.37891], [43.21707, 41.30331], [43.13373, 41.25503], [43.1945, 41.25242], [43.23096, 41.17536], [43.36118, 41.2028], [43.44973, 41.17666], [43.4717, 41.12611], [43.67712, 41.13398], [43.74717, 41.1117], [43.84835, 41.16329], [44.16591, 41.19141], [44.18148, 41.24644], [44.32139, 41.2079], [44.34337, 41.20312], [44.34417, 41.2382], [44.46791, 41.18204], [44.59322, 41.1933], [44.61462, 41.24018], [44.72814, 41.20338], [44.82084, 41.21513], [44.87887, 41.20195], [44.89911, 41.21366], [44.84358, 41.23088], [44.81749, 41.23488], [44.80053, 41.25949], [44.81437, 41.30371], [44.93493, 41.25685], [45.0133, 41.29747], [45.09867, 41.34065], [45.1797, 41.42231], [45.26285, 41.46433], [45.31352, 41.47168], [45.4006, 41.42402], [45.45973, 41.45898], [45.68389, 41.3539], [45.71035, 41.36208], [45.75705, 41.35157], [45.69946, 41.29545], [45.80842, 41.2229], [45.95786, 41.17956], [46.13221, 41.19479], [46.27698, 41.19011], [46.37661, 41.10805], [46.456, 41.09984], [46.48558, 41.0576], [46.55096, 41.1104], [46.63969, 41.09515], [46.66148, 41.20533], [46.72375, 41.28609], [46.63658, 41.37727], [46.4669, 41.43331], [46.40307, 41.48464], [46.33925, 41.4963], [46.29794, 41.5724], [46.34126, 41.57454], [46.34039, 41.5947], [46.3253, 41.60912], [46.28182, 41.60089], [46.26531, 41.63339], [46.24429, 41.59883], [46.19759, 41.62327], [46.17891, 41.72094], [46.20538, 41.77205], [46.23962, 41.75811], [46.30863, 41.79133], [46.3984, 41.84399], [46.42738, 41.91323]]]] } },
      { type: "Feature", properties: { iso1A2: "GF", iso1A3: "GUF", iso1N3: "254", wikidata: "Q3769", nameEn: "French Guiana", country: "FR", groups: ["Q3320166", "EU", "005", "419", "019", "UN"], callingCodes: ["594"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-51.35485, 4.8383], [-53.7094, 6.2264], [-54.01074, 5.68785], [-54.01877, 5.52789], [-54.26916, 5.26909], [-54.4717, 4.91964], [-54.38444, 4.13222], [-54.19367, 3.84387], [-54.05128, 3.63557], [-53.98914, 3.627], [-53.9849, 3.58697], [-54.28534, 2.67798], [-54.42864, 2.42442], [-54.6084, 2.32856], [-54.16286, 2.10779], [-53.78743, 2.34412], [-52.96539, 2.1881], [-52.6906, 2.37298], [-52.31787, 3.17896], [-51.85573, 3.83427], [-51.82312, 3.85825], [-51.79599, 3.89336], [-51.61983, 4.14596], [-51.63798, 4.51394], [-51.35485, 4.8383]]]] } },
      { type: "Feature", properties: { iso1A2: "GG", iso1A3: "GGY", iso1N3: "831", wikidata: "Q25230", nameEn: "Bailiwick of Guernsey", country: "GB" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "GH", iso1A3: "GHA", iso1N3: "288", wikidata: "Q117", nameEn: "Ghana", groups: ["011", "202", "002", "UN"], callingCodes: ["233"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-0.13493, 11.14075], [-0.27374, 11.17157], [-0.28566, 11.12713], [-0.35955, 11.07801], [-0.38219, 11.12596], [-0.42391, 11.11661], [-0.44298, 11.04292], [-0.61937, 10.91305], [-0.67143, 10.99811], [-2.83373, 11.0067], [-2.94232, 10.64281], [-2.83108, 10.40252], [-2.74174, 9.83172], [-2.76534, 9.56589], [-2.68802, 9.49343], [-2.69814, 9.22717], [-2.77799, 9.04949], [-2.66357, 9.01771], [-2.58243, 8.7789], [-2.49037, 8.20872], [-2.62901, 8.11495], [-2.61232, 8.02645], [-2.67787, 8.02055], [-2.74819, 7.92613], [-2.78395, 7.94974], [-2.79467, 7.86002], [-2.92339, 7.60847], [-2.97822, 7.27165], [-2.95438, 7.23737], [-3.23327, 6.81744], [-3.21954, 6.74407], [-3.25999, 6.62521], [-3.01896, 5.71697], [-2.95323, 5.71865], [-2.96671, 5.6415], [-2.93132, 5.62137], [-2.85378, 5.65156], [-2.76614, 5.60963], [-2.72737, 5.34789], [-2.77625, 5.34621], [-2.73074, 5.1364], [-2.75502, 5.10657], [-2.95261, 5.12477], [-2.96554, 5.10397], [-3.063, 5.13665], [-3.11073, 5.12675], [-3.10675, 5.08515], [-3.34019, 4.17519], [1.07031, 5.15655], [1.27574, 5.93551], [1.19771, 6.11522], [1.19966, 6.17069], [1.09187, 6.17074], [1.05969, 6.22998], [1.03108, 6.24064], [0.99652, 6.33779], [0.89283, 6.33779], [0.71048, 6.53083], [0.74862, 6.56517], [0.63659, 6.63857], [0.6497, 6.73682], [0.58176, 6.76049], [0.57406, 6.80348], [0.52853, 6.82921], [0.56508, 6.92971], [0.52098, 6.94391], [0.52217, 6.9723], [0.59606, 7.01252], [0.65327, 7.31643], [0.62943, 7.41099], [0.57223, 7.39326], [0.52455, 7.45354], [0.51979, 7.58706], [0.58295, 7.62368], [0.62943, 7.85751], [0.58891, 8.12779], [0.6056, 8.13959], [0.61156, 8.18324], [0.5913, 8.19622], [0.63897, 8.25873], [0.73432, 8.29529], [0.64731, 8.48866], [0.47211, 8.59945], [0.37319, 8.75262], [0.52455, 8.87746], [0.45424, 9.04581], [0.56388, 9.40697], [0.49118, 9.48339], [0.36485, 9.49749], [0.33148, 9.44812], [0.25758, 9.42696], [0.2254, 9.47869], [0.31241, 9.50337], [0.30406, 9.521], [0.2409, 9.52335], [0.23851, 9.57389], [0.38153, 9.58682], [0.36008, 9.6256], [0.29334, 9.59387], [0.26712, 9.66437], [0.28261, 9.69022], [0.32313, 9.6491], [0.34816, 9.66907], [0.34816, 9.71607], [0.32075, 9.72781], [0.36366, 10.03309], [0.41252, 10.02018], [0.41371, 10.06361], [0.35293, 10.09412], [0.39584, 10.31112], [0.33028, 10.30408], [0.29453, 10.41546], [0.18846, 10.4096], [0.12886, 10.53149], [-0.05945, 10.63458], [-0.09141, 10.7147], [-0.07327, 10.71845], [-0.07183, 10.76794], [-0.0228, 10.81916], [-0.02685, 10.8783], [-908e-5, 10.91644], [-63e-4, 10.96417], [0.03355, 10.9807], [0.02395, 11.06229], [342e-5, 11.08317], [-514e-5, 11.10763], [-0.0275, 11.11202], [-0.05733, 11.08628], [-0.14462, 11.10811], [-0.13493, 11.14075]]]] } },
      { type: "Feature", properties: { iso1A2: "GI", iso1A3: "GIB", iso1N3: "292", wikidata: "Q1410", nameEn: "Gibraltar", country: "GB", groups: ["Q12837", "BOTS", "039", "150", "UN"], callingCodes: ["350"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-5.34064, 36.03744], [-5.27801, 36.14942], [-5.33822, 36.15272], [-5.34536, 36.15501], [-5.40526, 36.15488], [-5.34064, 36.03744]]]] } },
      { type: "Feature", properties: { iso1A2: "GL", iso1A3: "GRL", iso1N3: "304", wikidata: "Q223", nameEn: "Greenland", country: "DK", groups: ["Q1451600", "021", "003", "019", "UN"], callingCodes: ["299"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-49.33696, 84.57952], [-68.21821, 80.48551], [-77.52957, 77.23408], [-46.37635, 57.3249], [-9.68082, 72.73731], [-5.7106, 84.28058], [-49.33696, 84.57952]]]] } },
      { type: "Feature", properties: { iso1A2: "GM", iso1A3: "GMB", iso1N3: "270", wikidata: "Q1005", nameEn: "The Gambia", groups: ["011", "202", "002", "UN"], callingCodes: ["220"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-15.14917, 13.57989], [-14.36795, 13.23033], [-13.79409, 13.34472], [-13.8955, 13.59126], [-14.34721, 13.46578], [-14.93719, 13.80173], [-15.36504, 13.79313], [-15.47902, 13.58758], [-17.43598, 13.59273], [-17.43966, 13.04579], [-16.74676, 13.06025], [-16.69343, 13.16791], [-15.80355, 13.16729], [-15.80478, 13.34832], [-15.26908, 13.37768], [-15.14917, 13.57989]]]] } },
      { type: "Feature", properties: { iso1A2: "GN", iso1A3: "GIN", iso1N3: "324", wikidata: "Q1006", nameEn: "Guinea", groups: ["011", "202", "002", "UN"], callingCodes: ["224"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-11.37536, 12.40788], [-11.46267, 12.44559], [-11.91331, 12.42008], [-12.35415, 12.32758], [-12.87336, 12.51892], [-13.06603, 12.49342], [-13.05296, 12.64003], [-13.70523, 12.68013], [-13.7039, 12.60313], [-13.65089, 12.49515], [-13.64168, 12.42764], [-13.70851, 12.24978], [-13.92745, 12.24077], [-13.94589, 12.16869], [-13.7039, 12.00869], [-13.7039, 11.70195], [-14.09799, 11.63649], [-14.26623, 11.67486], [-14.31513, 11.60713], [-14.51173, 11.49708], [-14.66677, 11.51188], [-14.77786, 11.36323], [-14.95993, 10.99244], [-15.07174, 10.89557], [-15.96748, 10.162], [-14.36218, 8.64107], [-13.29911, 9.04245], [-13.18586, 9.0925], [-13.08953, 9.0409], [-12.94095, 9.26335], [-12.76788, 9.3133], [-12.47254, 9.86834], [-12.24262, 9.92386], [-12.12634, 9.87203], [-11.91023, 9.93927], [-11.89624, 9.99763], [-11.2118, 10.00098], [-10.6534, 9.29919], [-10.74484, 9.07998], [-10.5783, 9.06386], [-10.56197, 8.81225], [-10.47707, 8.67669], [-10.61422, 8.5314], [-10.70565, 8.29235], [-10.63934, 8.35326], [-10.54891, 8.31174], [-10.37257, 8.48941], [-10.27575, 8.48711], [-10.203, 8.47991], [-10.14579, 8.52665], [-10.05375, 8.50697], [-10.05873, 8.42578], [-9.77763, 8.54633], [-9.47415, 8.35195], [-9.50898, 8.18455], [-9.41445, 8.02448], [-9.44928, 7.9284], [-9.35724, 7.74111], [-9.37465, 7.62032], [-9.48161, 7.37122], [-9.41943, 7.41809], [-9.305, 7.42056], [-9.20798, 7.38109], [-9.18311, 7.30461], [-9.09107, 7.1985], [-8.93435, 7.2824], [-8.85724, 7.26019], [-8.8448, 7.35149], [-8.72789, 7.51429], [-8.67814, 7.69428], [-8.55874, 7.70167], [-8.55874, 7.62525], [-8.47114, 7.55676], [-8.4003, 7.6285], [-8.21374, 7.54466], [-8.09931, 7.78626], [-8.13414, 7.87991], [-8.06449, 8.04989], [-7.94695, 8.00925], [-7.99919, 8.11023], [-7.98675, 8.20134], [-8.062, 8.16071], [-8.2411, 8.24196], [-8.22991, 8.48438], [-7.92518, 8.50652], [-7.65653, 8.36873], [-7.69882, 8.66148], [-7.95503, 8.81146], [-7.92518, 8.99332], [-7.73862, 9.08422], [-7.90777, 9.20456], [-7.85056, 9.41812], [-8.03463, 9.39604], [-8.14657, 9.55062], [-8.09434, 9.86936], [-8.15652, 9.94288], [-8.11921, 10.04577], [-8.01225, 10.1021], [-7.97971, 10.17117], [-7.9578, 10.2703], [-8.10207, 10.44649], [-8.22711, 10.41722], [-8.32614, 10.69273], [-8.2667, 10.91762], [-8.35083, 11.06234], [-8.66923, 10.99397], [-8.40058, 11.37466], [-8.80854, 11.66715], [-8.94784, 12.34842], [-9.13689, 12.50875], [-9.38067, 12.48446], [-9.32097, 12.29009], [-9.63938, 12.18312], [-9.714, 12.0226], [-10.30604, 12.24634], [-10.71897, 11.91552], [-10.80355, 12.1053], [-10.99758, 12.24634], [-11.24136, 12.01286], [-11.50006, 12.17826], [-11.37536, 12.40788]]]] } },
      { type: "Feature", properties: { iso1A2: "GP", iso1A3: "GLP", iso1N3: "312", wikidata: "Q17012", nameEn: "Guadeloupe", country: "FR", groups: ["Q3320166", "EU", "029", "003", "419", "019", "UN"], callingCodes: ["590"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-60.03183, 16.1129], [-61.60296, 16.73066], [-63.00549, 15.26166], [-60.03183, 16.1129]]]] } },
      { type: "Feature", properties: { iso1A2: "GQ", iso1A3: "GNQ", iso1N3: "226", wikidata: "Q983", nameEn: "Equatorial Guinea", groups: ["017", "202", "002", "UN"], callingCodes: ["240"] }, geometry: { type: "MultiPolygon", coordinates: [[[[9.22018, 3.72052], [8.34397, 4.30689], [7.71762, 0.6674], [3.35016, -3.29031], [9.66433, 1.06723], [9.75065, 1.06753], [9.79648, 1.0019], [11.35307, 1.00251], [11.3561, 2.17217], [9.991, 2.16561], [9.90749, 2.20049], [9.89012, 2.20457], [9.84716, 2.24676], [9.83238, 2.29079], [9.83754, 2.32428], [9.82123, 2.35097], [9.81162, 2.33797], [9.22018, 3.72052]]]] } },
      { type: "Feature", properties: { iso1A2: "GR", iso1A3: "GRC", iso1N3: "300", wikidata: "Q41", nameEn: "Greece", aliases: ["EL"], groups: ["EU", "039", "150", "UN"], callingCodes: ["30"] }, geometry: { type: "MultiPolygon", coordinates: [[[[26.03489, 40.73051], [26.0754, 40.72772], [26.08638, 40.73214], [26.12495, 40.74283], [26.12854, 40.77339], [26.15685, 40.80709], [26.21351, 40.83298], [26.20856, 40.86048], [26.26169, 40.9168], [26.29441, 40.89119], [26.28623, 40.93005], [26.32259, 40.94042], [26.35894, 40.94292], [26.33297, 40.98388], [26.3606, 41.02027], [26.31928, 41.07386], [26.32259, 41.24929], [26.39861, 41.25053], [26.5209, 41.33993], [26.5837, 41.32131], [26.62997, 41.34613], [26.61767, 41.42281], [26.59742, 41.48058], [26.59196, 41.60491], [26.5209, 41.62592], [26.47958, 41.67037], [26.35957, 41.71149], [26.30255, 41.70925], [26.2654, 41.71544], [26.22888, 41.74139], [26.21325, 41.73223], [26.16841, 41.74858], [26.06148, 41.70345], [26.07083, 41.64584], [26.15146, 41.60828], [26.14328, 41.55496], [26.17951, 41.55409], [26.176, 41.50072], [26.14796, 41.47533], [26.20288, 41.43943], [26.16548, 41.42278], [26.12926, 41.35878], [25.87919, 41.30526], [25.8266, 41.34563], [25.70507, 41.29209], [25.66183, 41.31316], [25.61042, 41.30614], [25.55082, 41.31667], [25.52394, 41.2798], [25.48187, 41.28506], [25.28322, 41.23411], [25.11611, 41.34212], [24.942, 41.38685], [24.90928, 41.40876], [24.86136, 41.39298], [24.82514, 41.4035], [24.8041, 41.34913], [24.71529, 41.41928], [24.61129, 41.42278], [24.52599, 41.56808], [24.30513, 41.51297], [24.27124, 41.57682], [24.18126, 41.51735], [24.10063, 41.54796], [24.06323, 41.53222], [24.06908, 41.46132], [23.96975, 41.44118], [23.91483, 41.47971], [23.89613, 41.45257], [23.80148, 41.43943], [23.76525, 41.40175], [23.67644, 41.41139], [23.63203, 41.37632], [23.52453, 41.40262], [23.40416, 41.39999], [23.33639, 41.36317], [23.31301, 41.40525], [23.22771, 41.37106], [23.21953, 41.33773], [23.1833, 41.31755], [22.93334, 41.34104], [22.81199, 41.3398], [22.76408, 41.32225], [22.74538, 41.16321], [22.71266, 41.13945], [22.65306, 41.18168], [22.62852, 41.14385], [22.58295, 41.11568], [22.5549, 41.13065], [22.42285, 41.11921], [22.26744, 41.16409], [22.17629, 41.15969], [22.1424, 41.12449], [22.06527, 41.15617], [21.90869, 41.09191], [21.91102, 41.04786], [21.7556, 40.92525], [21.69601, 40.9429], [21.57448, 40.86076], [21.53007, 40.90759], [21.41555, 40.9173], [21.35595, 40.87578], [21.25779, 40.86165], [21.21105, 40.8855], [21.15262, 40.85546], [20.97887, 40.85475], [20.98396, 40.79109], [20.95752, 40.76982], [20.98134, 40.76046], [21.05833, 40.66586], [21.03932, 40.56299], [20.96908, 40.51526], [20.94925, 40.46625], [20.83688, 40.47882], [20.7906, 40.42726], [20.78234, 40.35803], [20.71789, 40.27739], [20.67162, 40.09433], [20.62566, 40.0897], [20.61081, 40.07866], [20.55593, 40.06524], [20.51297, 40.08168], [20.48487, 40.06271], [20.42373, 40.06777], [20.37911, 39.99058], [20.31135, 39.99438], [20.41546, 39.82832], [20.41475, 39.81437], [20.38572, 39.78516], [20.30804, 39.81563], [20.29152, 39.80421], [20.31961, 39.72799], [20.27412, 39.69884], [20.22707, 39.67459], [20.22376, 39.64532], [20.15988, 39.652], [20.12956, 39.65805], [20.05189, 39.69112], [20.00957, 39.69227], [19.98042, 39.6504], [19.92466, 39.69533], [19.97622, 39.78684], [19.95905, 39.82857], [19.0384, 40.35325], [19.20409, 39.7532], [22.5213, 33.45682], [29.73302, 35.92555], [29.69611, 36.10365], [29.61805, 36.14179], [29.61002, 36.1731], [29.48192, 36.18377], [29.30783, 36.01033], [28.23708, 36.56812], [27.95037, 36.46155], [27.89482, 36.69898], [27.46117, 36.53789], [27.24613, 36.71622], [27.45627, 36.9008], [27.20312, 36.94571], [27.14757, 37.32], [26.95583, 37.64989], [26.99377, 37.69034], [27.16428, 37.72343], [27.05537, 37.9131], [26.21136, 38.17558], [26.24183, 38.44695], [26.32173, 38.48731], [26.21136, 38.65436], [26.61814, 38.81372], [26.70773, 39.0312], [26.43357, 39.43096], [25.94257, 39.39358], [25.61285, 40.17161], [26.04292, 40.3958], [25.94795, 40.72797], [26.03489, 40.73051]]]] } },
      { type: "Feature", properties: { iso1A2: "GS", iso1A3: "SGS", iso1N3: "239", wikidata: "Q35086", nameEn: "South Georgia and South Sandwich Islands", country: "GB", groups: ["BOTS", "005", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["500"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-35.26394, -43.68272], [-53.39656, -59.87088], [-22.31757, -59.85974], [-35.26394, -43.68272]]]] } },
      { type: "Feature", properties: { iso1A2: "GT", iso1A3: "GTM", iso1N3: "320", wikidata: "Q774", nameEn: "Guatemala", groups: ["013", "003", "419", "019", "UN"], callingCodes: ["502"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-89.14985, 17.81563], [-90.98678, 17.81655], [-90.99199, 17.25192], [-91.43809, 17.25373], [-91.04436, 16.92175], [-90.69064, 16.70697], [-90.61212, 16.49832], [-90.40499, 16.40524], [-90.44567, 16.07573], [-91.73182, 16.07371], [-92.20983, 15.26077], [-92.0621, 15.07406], [-92.1454, 14.98143], [-92.1423, 14.88647], [-92.18161, 14.84147], [-92.1454, 14.6804], [-92.2261, 14.53423], [-92.37213, 14.39277], [-90.55276, 12.8866], [-90.11344, 13.73679], [-90.10505, 13.85104], [-89.88937, 14.0396], [-89.81807, 14.07073], [-89.76103, 14.02923], [-89.73251, 14.04133], [-89.75569, 14.07073], [-89.70756, 14.1537], [-89.61844, 14.21937], [-89.52397, 14.22628], [-89.50614, 14.26084], [-89.58814, 14.33165], [-89.57441, 14.41637], [-89.39028, 14.44561], [-89.34776, 14.43013], [-89.35189, 14.47553], [-89.23719, 14.58046], [-89.15653, 14.57802], [-89.13132, 14.71582], [-89.23467, 14.85596], [-89.15149, 14.97775], [-89.18048, 14.99967], [-89.15149, 15.07392], [-88.97343, 15.14039], [-88.32467, 15.63665], [-88.31459, 15.66942], [-88.24022, 15.69247], [-88.22552, 15.72294], [-88.20359, 16.03858], [-88.40779, 16.09624], [-88.95358, 15.88698], [-89.02415, 15.9063], [-89.17418, 15.90898], [-89.22683, 15.88619], [-89.15025, 17.04813], [-89.14985, 17.81563]]]] } },
      { type: "Feature", properties: { iso1A2: "GU", iso1A3: "GUM", iso1N3: "316", wikidata: "Q16635", nameEn: "Guam", aliases: ["US-GU"], country: "US", groups: ["Q1352230", "Q153732", "057", "009", "UN"], roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1 671"] }, geometry: { type: "MultiPolygon", coordinates: [[[[146.25931, 13.85876], [143.82485, 13.92273], [144.61642, 12.82462], [146.25931, 13.85876]]]] } },
      { type: "Feature", properties: { iso1A2: "GW", iso1A3: "GNB", iso1N3: "624", wikidata: "Q1007", nameEn: "Guinea-Bissau", groups: ["011", "202", "002", "UN"], callingCodes: ["245"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-14.31513, 11.60713], [-14.26623, 11.67486], [-14.09799, 11.63649], [-13.7039, 11.70195], [-13.7039, 12.00869], [-13.94589, 12.16869], [-13.92745, 12.24077], [-13.70851, 12.24978], [-13.64168, 12.42764], [-13.65089, 12.49515], [-13.7039, 12.60313], [-13.70523, 12.68013], [-15.17582, 12.6847], [-15.67302, 12.42974], [-16.20591, 12.46157], [-16.38191, 12.36449], [-16.70562, 12.34803], [-17.4623, 11.92379], [-15.96748, 10.162], [-15.07174, 10.89557], [-14.95993, 10.99244], [-14.77786, 11.36323], [-14.66677, 11.51188], [-14.51173, 11.49708], [-14.31513, 11.60713]]]] } },
      { type: "Feature", properties: { iso1A2: "GY", iso1A3: "GUY", iso1N3: "328", wikidata: "Q734", nameEn: "Guyana", groups: ["005", "419", "019", "UN"], driveSide: "left", callingCodes: ["592"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-56.84822, 6.73257], [-59.54058, 8.6862], [-59.98508, 8.53046], [-59.85562, 8.35213], [-59.80661, 8.28906], [-59.83156, 8.23261], [-59.97059, 8.20791], [-60.02407, 8.04557], [-60.38056, 7.8302], [-60.51959, 7.83373], [-60.64793, 7.56877], [-60.71923, 7.55817], [-60.59802, 7.33194], [-60.63367, 7.25061], [-60.54098, 7.14804], [-60.44116, 7.20817], [-60.28074, 7.1162], [-60.39419, 6.94847], [-60.54873, 6.8631], [-61.13632, 6.70922], [-61.20762, 6.58174], [-61.15058, 6.19558], [-61.4041, 5.95304], [-60.73204, 5.20931], [-60.32352, 5.21299], [-60.20944, 5.28754], [-59.98129, 5.07097], [-60.04189, 4.69801], [-60.15953, 4.53456], [-59.78878, 4.45637], [-59.69361, 4.34069], [-59.73353, 4.20399], [-59.51963, 3.91951], [-59.86899, 3.57089], [-59.79769, 3.37162], [-59.99733, 2.92312], [-59.91177, 2.36759], [-59.7264, 2.27497], [-59.74066, 1.87596], [-59.25583, 1.40559], [-58.92072, 1.31293], [-58.84229, 1.17749], [-58.53571, 1.29154], [-58.4858, 1.48399], [-58.33887, 1.58014], [-58.01873, 1.51966], [-57.97336, 1.64566], [-57.77281, 1.73344], [-57.55743, 1.69605], [-57.35073, 1.98327], [-57.23981, 1.95808], [-57.09109, 2.01854], [-57.07092, 1.95304], [-56.7659, 1.89509], [-56.47045, 1.95135], [-56.55439, 2.02003], [-56.70519, 2.02964], [-57.35891, 3.32121], [-58.0307, 3.95513], [-57.8699, 4.89394], [-57.37442, 5.0208], [-57.22536, 5.15605], [-57.31629, 5.33714], [-56.84822, 6.73257]]]] } },
      { type: "Feature", properties: { iso1A2: "HK", iso1A3: "HKG", iso1N3: "344", wikidata: "Q8646", nameEn: "Hong Kong", country: "CN", groups: ["030", "142", "UN"], driveSide: "left", callingCodes: ["852"] }, geometry: { type: "MultiPolygon", coordinates: [[[[113.92195, 22.13873], [114.50148, 22.15017], [114.44998, 22.55977], [114.25154, 22.55977], [114.22888, 22.5436], [114.22185, 22.55343], [114.20655, 22.55706], [114.18338, 22.55444], [114.17247, 22.55944], [114.1597, 22.56041], [114.15123, 22.55163], [114.1482, 22.54091], [114.13823, 22.54319], [114.12665, 22.54003], [114.11656, 22.53415], [114.11181, 22.52878], [114.1034, 22.5352], [114.09692, 22.53435], [114.09048, 22.53716], [114.08606, 22.53276], [114.07817, 22.52997], [114.07267, 22.51855], [114.06272, 22.51617], [114.05729, 22.51104], [114.05438, 22.5026], [114.03113, 22.5065], [113.86771, 22.42972], [113.81621, 22.2163], [113.83338, 22.1826], [113.92195, 22.13873]]]] } },
      { type: "Feature", properties: { iso1A2: "HM", iso1A3: "HMD", iso1N3: "334", wikidata: "Q131198", nameEn: "Heard Island and McDonald Islands", country: "AU", groups: ["053", "009", "UN"], driveSide: "left" }, geometry: { type: "MultiPolygon", coordinates: [[[[71.08716, -53.87687], [75.44182, -53.99822], [72.87012, -51.48322], [71.08716, -53.87687]]]] } },
      { type: "Feature", properties: { iso1A2: "HN", iso1A3: "HND", iso1N3: "340", wikidata: "Q783", nameEn: "Honduras", groups: ["013", "003", "419", "019", "UN"], callingCodes: ["504"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-83.86109, 17.73736], [-88.20359, 16.03858], [-88.22552, 15.72294], [-88.24022, 15.69247], [-88.31459, 15.66942], [-88.32467, 15.63665], [-88.97343, 15.14039], [-89.15149, 15.07392], [-89.18048, 14.99967], [-89.15149, 14.97775], [-89.23467, 14.85596], [-89.13132, 14.71582], [-89.15653, 14.57802], [-89.23719, 14.58046], [-89.35189, 14.47553], [-89.34776, 14.43013], [-89.04187, 14.33644], [-88.94608, 14.20207], [-88.85785, 14.17763], [-88.815, 14.11652], [-88.73182, 14.10919], [-88.70661, 14.04317], [-88.49738, 13.97224], [-88.48982, 13.86458], [-88.25791, 13.91108], [-88.23018, 13.99915], [-88.07641, 13.98447], [-88.00331, 13.86948], [-87.7966, 13.91353], [-87.68821, 13.80829], [-87.73106, 13.75443], [-87.78148, 13.52906], [-87.71657, 13.50577], [-87.72115, 13.46083], [-87.73841, 13.44169], [-87.77354, 13.45767], [-87.83467, 13.44655], [-87.84675, 13.41078], [-87.80177, 13.35689], [-87.73714, 13.32715], [-87.69751, 13.25228], [-87.55124, 13.12523], [-87.37107, 12.98646], [-87.06306, 13.00892], [-87.03785, 12.98682], [-86.93197, 13.05313], [-86.93383, 13.18677], [-86.87066, 13.30641], [-86.71267, 13.30348], [-86.76812, 13.79605], [-86.35219, 13.77157], [-86.14801, 14.04317], [-86.00685, 14.08474], [-86.03458, 13.99181], [-85.75477, 13.8499], [-85.73964, 13.9698], [-85.45762, 14.11304], [-85.32149, 14.2562], [-85.18602, 14.24929], [-85.1575, 14.53934], [-84.90082, 14.80489], [-84.82596, 14.82212], [-84.70119, 14.68078], [-84.48373, 14.63249], [-84.10584, 14.76353], [-83.89551, 14.76697], [-83.62101, 14.89448], [-83.49268, 15.01158], [-83.13724, 15.00002], [-83.04763, 15.03256], [-82.06974, 14.49418], [-81.58685, 18.0025], [-83.86109, 17.73736]]]] } },
      { type: "Feature", properties: { iso1A2: "HR", iso1A3: "HRV", iso1N3: "191", wikidata: "Q224", nameEn: "Croatia", groups: ["EU", "039", "150", "UN"], callingCodes: ["385"] }, geometry: { type: "MultiPolygon", coordinates: [[[[17.6444, 42.88641], [17.5392, 42.92787], [17.70879, 42.97223], [17.64268, 43.08595], [17.46986, 43.16559], [17.286, 43.33065], [17.25579, 43.40353], [17.29699, 43.44542], [17.24411, 43.49376], [17.15828, 43.49376], [17.00585, 43.58037], [16.80736, 43.76011], [16.75316, 43.77157], [16.70922, 43.84887], [16.55472, 43.95326], [16.50528, 44.0244], [16.43629, 44.02826], [16.43662, 44.07523], [16.36864, 44.08263], [16.18688, 44.27012], [16.21346, 44.35231], [16.12969, 44.38275], [16.16814, 44.40679], [16.10566, 44.52586], [16.03012, 44.55572], [16.00884, 44.58605], [16.05828, 44.61538], [15.89348, 44.74964], [15.8255, 44.71501], [15.72584, 44.82334], [15.79472, 44.8455], [15.76096, 44.87045], [15.74723, 44.96818], [15.78568, 44.97401], [15.74585, 45.0638], [15.78842, 45.11519], [15.76371, 45.16508], [15.83512, 45.22459], [15.98412, 45.23088], [16.12153, 45.09616], [16.29036, 44.99732], [16.35404, 45.00241], [16.35863, 45.03529], [16.3749, 45.05206], [16.38219, 45.05139], [16.38309, 45.05955], [16.40023, 45.1147], [16.4634, 45.14522], [16.49155, 45.21153], [16.52982, 45.22713], [16.5501, 45.2212], [16.56559, 45.22307], [16.60194, 45.23042], [16.64962, 45.20714], [16.74845, 45.20393], [16.78219, 45.19002], [16.81137, 45.18434], [16.83804, 45.18951], [16.92405, 45.27607], [16.9385, 45.22742], [17.0415, 45.20759], [17.18438, 45.14764], [17.24325, 45.146], [17.25131, 45.14957], [17.26815, 45.18444], [17.32092, 45.16246], [17.33573, 45.14521], [17.41229, 45.13335], [17.4498, 45.16119], [17.45615, 45.12523], [17.47589, 45.12656], [17.51469, 45.10791], [17.59104, 45.10816], [17.66571, 45.13408], [17.84826, 45.04489], [17.87148, 45.04645], [17.93706, 45.08016], [17.97336, 45.12245], [17.97834, 45.13831], [17.99479, 45.14958], [18.01594, 45.15163], [18.03121, 45.12632], [18.1624, 45.07654], [18.24387, 45.13699], [18.32077, 45.1021], [18.41896, 45.11083], [18.47939, 45.05871], [18.65723, 45.07544], [18.78357, 44.97741], [18.80661, 44.93561], [18.76369, 44.93707], [18.76347, 44.90669], [18.8704, 44.85097], [19.01994, 44.85493], [18.98957, 44.90645], [19.02871, 44.92541], [19.06853, 44.89915], [19.15573, 44.95409], [19.05205, 44.97692], [19.1011, 45.01191], [19.07952, 45.14668], [19.14063, 45.12972], [19.19144, 45.17863], [19.43589, 45.17137], [19.41941, 45.23475], [19.28208, 45.23813], [19.10774, 45.29547], [18.97446, 45.37528], [18.99918, 45.49333], [19.08364, 45.48804], [19.07471, 45.53086], [18.94562, 45.53712], [18.88776, 45.57253], [18.96691, 45.66731], [18.90305, 45.71863], [18.85783, 45.85493], [18.81394, 45.91329], [18.80211, 45.87995], [18.6792, 45.92057], [18.57483, 45.80772], [18.44368, 45.73972], [18.12439, 45.78905], [18.08869, 45.76511], [17.99805, 45.79671], [17.87377, 45.78522], [17.66545, 45.84207], [17.56821, 45.93728], [17.35672, 45.95209], [17.14592, 46.16697], [16.8903, 46.28122], [16.8541, 46.36255], [16.7154, 46.39523], [16.6639, 46.45203], [16.59527, 46.47524], [16.52604, 46.47831], [16.5007, 46.49644], [16.44036, 46.5171], [16.38771, 46.53608], [16.37193, 46.55008], [16.29793, 46.5121], [16.26733, 46.51505], [16.26759, 46.50566], [16.23961, 46.49653], [16.25124, 46.48067], [16.27398, 46.42875], [16.27329, 46.41467], [16.30162, 46.40437], [16.30233, 46.37837], [16.18824, 46.38282], [16.14859, 46.40547], [16.05281, 46.39141], [16.05065, 46.3833], [16.07314, 46.36458], [16.07616, 46.3463], [15.97965, 46.30652], [15.79284, 46.25811], [15.78817, 46.21719], [15.75479, 46.20336], [15.75436, 46.21969], [15.67395, 46.22478], [15.6434, 46.21396], [15.64904, 46.19229], [15.59909, 46.14761], [15.6083, 46.11992], [15.62317, 46.09103], [15.72977, 46.04682], [15.71246, 46.01196], [15.70327, 46.00015], [15.70636, 45.92116], [15.67967, 45.90455], [15.68383, 45.88867], [15.68232, 45.86819], [15.70411, 45.8465], [15.66662, 45.84085], [15.64185, 45.82915], [15.57952, 45.84953], [15.52234, 45.82195], [15.47325, 45.8253], [15.47531, 45.79802], [15.40836, 45.79491], [15.25423, 45.72275], [15.30872, 45.69014], [15.34919, 45.71623], [15.4057, 45.64727], [15.38952, 45.63682], [15.34214, 45.64702], [15.34695, 45.63382], [15.31027, 45.6303], [15.27747, 45.60504], [15.29837, 45.5841], [15.30249, 45.53224], [15.38188, 45.48752], [15.33051, 45.45258], [15.27758, 45.46678], [15.16862, 45.42309], [15.05187, 45.49079], [15.02385, 45.48533], [14.92266, 45.52788], [14.90554, 45.47769], [14.81992, 45.45913], [14.80124, 45.49515], [14.71718, 45.53442], [14.68605, 45.53006], [14.69694, 45.57366], [14.59576, 45.62812], [14.60977, 45.66403], [14.57397, 45.67165], [14.53816, 45.6205], [14.5008, 45.60852], [14.49769, 45.54424], [14.36693, 45.48642], [14.32487, 45.47142], [14.27681, 45.4902], [14.26611, 45.48239], [14.24239, 45.50607], [14.22371, 45.50388], [14.20348, 45.46896], [14.07116, 45.48752], [14.00578, 45.52352], [13.96063, 45.50825], [13.99488, 45.47551], [13.97309, 45.45258], [13.90771, 45.45149], [13.88124, 45.42637], [13.81742, 45.43729], [13.7785, 45.46787], [13.67398, 45.4436], [13.62902, 45.45898], [13.56979, 45.4895], [13.45644, 45.59464], [13.05142, 45.33128], [13.12821, 44.48877], [16.15283, 42.18525], [18.45131, 42.21682], [18.54128, 42.39171], [18.52152, 42.42302], [18.43588, 42.48556], [18.44307, 42.51077], [18.43735, 42.55921], [18.36197, 42.61423], [18.24318, 42.6112], [17.88201, 42.83668], [17.80854, 42.9182], [17.7948, 42.89556], [17.68151, 42.92725], [17.6444, 42.88641]]]] } },
      { type: "Feature", properties: { iso1A2: "HT", iso1A3: "HTI", iso1N3: "332", wikidata: "Q790", nameEn: "Haiti", aliases: ["RH"], groups: ["029", "003", "419", "019", "UN"], callingCodes: ["509"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-71.71885, 18.78423], [-71.72624, 18.87802], [-71.77766, 18.95007], [-71.88102, 18.95007], [-71.74088, 19.0437], [-71.71088, 19.08353], [-71.69938, 19.10916], [-71.65337, 19.11759], [-71.62642, 19.21212], [-71.73229, 19.26686], [-71.77766, 19.33823], [-71.69448, 19.37866], [-71.6802, 19.45008], [-71.71268, 19.53374], [-71.71449, 19.55364], [-71.7429, 19.58445], [-71.75865, 19.70231], [-71.77419, 19.73128], [-72.38946, 20.27111], [-73.37289, 20.43199], [-74.7289, 18.71009], [-74.76465, 18.06252], [-72.29523, 17.48026], [-71.75671, 18.03456], [-71.73783, 18.07177], [-71.74994, 18.11115], [-71.75465, 18.14405], [-71.78271, 18.18302], [-71.69952, 18.34101], [-71.90875, 18.45821], [-71.88102, 18.50125], [-72.00201, 18.62312], [-71.95412, 18.64939], [-71.82556, 18.62551], [-71.71885, 18.78423]]]] } },
      { type: "Feature", properties: { iso1A2: "HU", iso1A3: "HUN", iso1N3: "348", wikidata: "Q28", nameEn: "Hungary", groups: ["EU", "151", "150", "UN"], callingCodes: ["36"] }, geometry: { type: "MultiPolygon", coordinates: [[[[21.72525, 48.34628], [21.67134, 48.3989], [21.6068, 48.50365], [21.44063, 48.58456], [21.11516, 48.49546], [20.83248, 48.5824], [20.5215, 48.53336], [20.29943, 48.26104], [20.24312, 48.2784], [19.92452, 48.1283], [19.63338, 48.25006], [19.52489, 48.19791], [19.47957, 48.09437], [19.28182, 48.08336], [19.23924, 48.0595], [19.01952, 48.07052], [18.82176, 48.04206], [18.76134, 47.97499], [18.76821, 47.87469], [18.8506, 47.82308], [18.74074, 47.8157], [18.66521, 47.76772], [18.56496, 47.76588], [18.29305, 47.73541], [18.02938, 47.75665], [17.71215, 47.7548], [17.23699, 48.02094], [17.16001, 48.00636], [17.09786, 47.97336], [17.11022, 47.92461], [17.08275, 47.87719], [17.00997, 47.86245], [17.07039, 47.81129], [17.05048, 47.79377], [17.08893, 47.70928], [16.87538, 47.68895], [16.86509, 47.72268], [16.82938, 47.68432], [16.7511, 47.67878], [16.72089, 47.73469], [16.65679, 47.74197], [16.61183, 47.76171], [16.54779, 47.75074], [16.53514, 47.73837], [16.55129, 47.72268], [16.4222, 47.66537], [16.58699, 47.61772], [16.64193, 47.63114], [16.71059, 47.52692], [16.64821, 47.50155], [16.6718, 47.46139], [16.57152, 47.40868], [16.52414, 47.41007], [16.49908, 47.39416], [16.45104, 47.41181], [16.47782, 47.25918], [16.44142, 47.25079], [16.43663, 47.21127], [16.41739, 47.20649], [16.42801, 47.18422], [16.4523, 47.18812], [16.46442, 47.16845], [16.44932, 47.14418], [16.52863, 47.13974], [16.46134, 47.09395], [16.52176, 47.05747], [16.43936, 47.03548], [16.51369, 47.00084], [16.28202, 47.00159], [16.27594, 46.9643], [16.22403, 46.939], [16.19904, 46.94134], [16.10983, 46.867], [16.14365, 46.8547], [16.15711, 46.85434], [16.21892, 46.86961], [16.2365, 46.87775], [16.2941, 46.87137], [16.34547, 46.83836], [16.3408, 46.80641], [16.31303, 46.79838], [16.30966, 46.7787], [16.37816, 46.69975], [16.42641, 46.69228], [16.41863, 46.66238], [16.38594, 46.6549], [16.39217, 46.63673], [16.50139, 46.56684], [16.52885, 46.53303], [16.52604, 46.5051], [16.59527, 46.47524], [16.6639, 46.45203], [16.7154, 46.39523], [16.8541, 46.36255], [16.8903, 46.28122], [17.14592, 46.16697], [17.35672, 45.95209], [17.56821, 45.93728], [17.66545, 45.84207], [17.87377, 45.78522], [17.99805, 45.79671], [18.08869, 45.76511], [18.12439, 45.78905], [18.44368, 45.73972], [18.57483, 45.80772], [18.6792, 45.92057], [18.80211, 45.87995], [18.81394, 45.91329], [18.99712, 45.93537], [19.01284, 45.96529], [19.0791, 45.96458], [19.10388, 46.04015], [19.14543, 45.9998], [19.28826, 45.99694], [19.52473, 46.1171], [19.56113, 46.16824], [19.66007, 46.19005], [19.81491, 46.1313], [19.93508, 46.17553], [20.01816, 46.17696], [20.03533, 46.14509], [20.09713, 46.17315], [20.26068, 46.12332], [20.28324, 46.1438], [20.35573, 46.16629], [20.45377, 46.14405], [20.49718, 46.18721], [20.63863, 46.12728], [20.76085, 46.21002], [20.74574, 46.25467], [20.86797, 46.28884], [21.06572, 46.24897], [21.16872, 46.30118], [21.28061, 46.44941], [21.26929, 46.4993], [21.33214, 46.63035], [21.43926, 46.65109], [21.5151, 46.72147], [21.48935, 46.7577], [21.52028, 46.84118], [21.59307, 46.86935], [21.59581, 46.91628], [21.68645, 46.99595], [21.648, 47.03902], [21.78395, 47.11104], [21.94463, 47.38046], [22.01055, 47.37767], [22.03389, 47.42508], [22.00917, 47.50492], [22.31816, 47.76126], [22.41979, 47.7391], [22.46559, 47.76583], [22.67247, 47.7871], [22.76617, 47.8417], [22.77991, 47.87211], [22.89849, 47.95851], [22.84276, 47.98602], [22.87847, 48.04665], [22.81804, 48.11363], [22.73427, 48.12005], [22.66835, 48.09162], [22.58733, 48.10813], [22.59007, 48.15121], [22.49806, 48.25189], [22.38133, 48.23726], [22.2083, 48.42534], [22.14689, 48.4005], [21.83339, 48.36242], [21.8279, 48.33321], [21.72525, 48.34628]]]] } },
      { type: "Feature", properties: { iso1A2: "IC", wikidata: "Q5813", nameEn: "Canary Islands", country: "ES", groups: ["Q3320166", "Q105472", "EU", "039", "150", "UN"], isoStatus: "excRes", callingCodes: ["34"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-12.00985, 30.24121], [-25.3475, 27.87574], [-14.43883, 27.02969], [-12.00985, 30.24121]]]] } },
      { type: "Feature", properties: { iso1A2: "ID", iso1A3: "IDN", iso1N3: "360", wikidata: "Q252", nameEn: "Indonesia", aliases: ["RI"] }, geometry: null },
      { type: "Feature", properties: { iso1A2: "IE", iso1A3: "IRL", iso1N3: "372", wikidata: "Q27", nameEn: "Republic of Ireland", groups: ["EU", "Q22890", "154", "150", "UN"], driveSide: "left", callingCodes: ["353"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-6.26218, 54.09785], [-6.29003, 54.11278], [-6.32694, 54.09337], [-6.36279, 54.11248], [-6.36605, 54.07234], [-6.47849, 54.06947], [-6.62842, 54.03503], [-6.66264, 54.0666], [-6.6382, 54.17071], [-6.70175, 54.20218], [-6.74575, 54.18788], [-6.81583, 54.22791], [-6.85179, 54.29176], [-6.87775, 54.34682], [-7.02034, 54.4212], [-7.19145, 54.31296], [-7.14908, 54.22732], [-7.25012, 54.20063], [-7.26316, 54.13863], [-7.29493, 54.12013], [-7.29687, 54.1354], [-7.28017, 54.16714], [-7.29157, 54.17191], [-7.34005, 54.14698], [-7.30553, 54.11869], [-7.32834, 54.11475], [-7.44567, 54.1539], [-7.4799, 54.12239], [-7.55812, 54.12239], [-7.69501, 54.20731], [-7.81397, 54.20159], [-7.8596, 54.21779], [-7.87101, 54.29299], [-8.04555, 54.36292], [-8.179, 54.46763], [-8.04538, 54.48941], [-7.99812, 54.54427], [-7.8596, 54.53671], [-7.70315, 54.62077], [-7.93293, 54.66603], [-7.83352, 54.73854], [-7.75041, 54.7103], [-7.64449, 54.75265], [-7.54671, 54.74606], [-7.54508, 54.79401], [-7.47626, 54.83084], [-7.4473, 54.87003], [-7.44404, 54.9403], [-7.40004, 54.94498], [-7.4033, 55.00391], [-7.34464, 55.04688], [-7.2471, 55.06933], [-6.34755, 55.49206], [-7.75229, 55.93854], [-22.01468, 48.19557], [-6.03913, 51.13217], [-5.37267, 53.63269], [-6.26218, 54.09785]]]] } },
      { type: "Feature", properties: { iso1A2: "IL", iso1A3: "ISR", iso1N3: "376", wikidata: "Q801", nameEn: "Israel", groups: ["145", "142", "UN"], callingCodes: ["972"] }, geometry: { type: "MultiPolygon", coordinates: [[[[34.052, 31.46619], [34.29262, 31.70393], [34.48681, 31.59711], [34.56797, 31.54197], [34.48892, 31.48365], [34.40077, 31.40926], [34.36505, 31.36404], [34.37381, 31.30598], [34.36523, 31.28963], [34.29417, 31.24194], [34.26742, 31.21998], [34.92298, 29.45305], [34.97718, 29.54294], [34.98207, 29.58147], [35.02147, 29.66343], [35.14108, 30.07374], [35.19183, 30.34636], [35.16218, 30.43535], [35.19595, 30.50297], [35.21379, 30.60401], [35.29311, 30.71365], [35.33456, 30.81224], [35.33984, 30.8802], [35.41371, 30.95565], [35.43658, 31.12444], [35.40316, 31.25535], [35.47672, 31.49578], [35.39675, 31.49572], [35.22921, 31.37445], [35.13033, 31.3551], [35.02459, 31.35979], [34.92571, 31.34337], [34.88932, 31.37093], [34.87833, 31.39321], [34.89756, 31.43891], [34.93258, 31.47816], [34.94356, 31.50743], [34.9415, 31.55601], [34.95249, 31.59813], [35.00879, 31.65426], [35.08226, 31.69107], [35.10782, 31.71594], [35.11895, 31.71454], [35.12933, 31.7325], [35.13931, 31.73012], [35.15119, 31.73634], [35.15474, 31.73352], [35.16478, 31.73242], [35.18023, 31.72067], [35.20538, 31.72388], [35.21937, 31.71578], [35.22392, 31.71899], [35.23972, 31.70896], [35.24315, 31.71244], [35.2438, 31.7201], [35.24981, 31.72543], [35.25182, 31.73945], [35.26319, 31.74846], [35.25225, 31.7678], [35.26058, 31.79064], [35.25573, 31.81362], [35.26404, 31.82567], [35.251, 31.83085], [35.25753, 31.8387], [35.24816, 31.8458], [35.2304, 31.84222], [35.2249, 31.85433], [35.22817, 31.8638], [35.22567, 31.86745], [35.22294, 31.87889], [35.22014, 31.88264], [35.2136, 31.88241], [35.21276, 31.88153], [35.21016, 31.88237], [35.20945, 31.8815], [35.20791, 31.8821], [35.20673, 31.88151], [35.20381, 31.86716], [35.21128, 31.863], [35.216, 31.83894], [35.21469, 31.81835], [35.19461, 31.82687], [35.18169, 31.82542], [35.18603, 31.80901], [35.14174, 31.81325], [35.07677, 31.85627], [35.05617, 31.85685], [35.01978, 31.82944], [34.9724, 31.83352], [34.99712, 31.85569], [35.03489, 31.85919], [35.03978, 31.89276], [35.03489, 31.92448], [35.00124, 31.93264], [34.98682, 31.96935], [35.00261, 32.027], [34.9863, 32.09551], [34.99437, 32.10962], [34.98507, 32.12606], [34.99039, 32.14626], [34.96009, 32.17503], [34.95703, 32.19522], [34.98885, 32.20758], [35.01841, 32.23981], [35.02939, 32.2671], [35.01119, 32.28684], [35.01772, 32.33863], [35.04243, 32.35008], [35.05142, 32.3667], [35.0421, 32.38242], [35.05311, 32.4024], [35.05423, 32.41754], [35.07059, 32.4585], [35.08564, 32.46948], [35.09236, 32.47614], [35.10024, 32.47856], [35.10882, 32.4757], [35.15937, 32.50466], [35.2244, 32.55289], [35.25049, 32.52453], [35.29306, 32.50947], [35.30685, 32.51024], [35.35212, 32.52047], [35.40224, 32.50136], [35.42034, 32.46009], [35.41598, 32.45593], [35.41048, 32.43706], [35.42078, 32.41562], [35.55807, 32.38674], [35.55494, 32.42687], [35.57485, 32.48669], [35.56614, 32.64393], [35.59813, 32.65159], [35.61669, 32.67999], [35.66527, 32.681], [35.68467, 32.70715], [35.75983, 32.74803], [35.78745, 32.77938], [35.83758, 32.82817], [35.84021, 32.8725], [35.87012, 32.91976], [35.89298, 32.9456], [35.87188, 32.98028], [35.84802, 33.1031], [35.81911, 33.11077], [35.81911, 33.1336], [35.84285, 33.16673], [35.83846, 33.19397], [35.81647, 33.2028], [35.81295, 33.24841], [35.77513, 33.27342], [35.813, 33.3172], [35.77477, 33.33609], [35.62019, 33.27278], [35.62283, 33.24226], [35.58502, 33.26653], [35.58326, 33.28381], [35.56523, 33.28969], [35.55555, 33.25844], [35.54544, 33.25513], [35.54808, 33.236], [35.5362, 33.23196], [35.54228, 33.19865], [35.52573, 33.11921], [35.50335, 33.114], [35.50272, 33.09056], [35.448, 33.09264], [35.43059, 33.06659], [35.35223, 33.05617], [35.31429, 33.10515], [35.1924, 33.08743], [35.10645, 33.09318], [34.78515, 33.20368], [33.62659, 31.82938], [34.052, 31.46619]]]] } },
      { type: "Feature", properties: { iso1A2: "IM", iso1A3: "IMN", iso1N3: "833", wikidata: "Q9676", nameEn: "Isle of Man", country: "GB", groups: ["Q185086", "154", "150", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44 01624", "44 07624", "44 07524", "44 07924"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-3.98763, 54.07351], [-4.1819, 54.57861], [-5.6384, 53.81157], [-3.98763, 54.07351]]]] } },
      { type: "Feature", properties: { iso1A2: "IN", iso1A3: "IND", iso1N3: "356", wikidata: "Q668", nameEn: "India" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "IO", iso1A3: "IOT", iso1N3: "086", wikidata: "Q43448", nameEn: "British Indian Ocean Territory", country: "GB" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "IQ", iso1A3: "IRQ", iso1N3: "368", wikidata: "Q796", nameEn: "Iraq", groups: ["145", "142", "UN"], callingCodes: ["964"] }, geometry: { type: "MultiPolygon", coordinates: [[[[42.78887, 37.38615], [42.56725, 37.14878], [42.35724, 37.10998], [42.36697, 37.0627], [41.81736, 36.58782], [41.40058, 36.52502], [41.28864, 36.35368], [41.2564, 36.06012], [41.37027, 35.84095], [41.38184, 35.62502], [41.26569, 35.42708], [41.21654, 35.1508], [41.2345, 34.80049], [41.12388, 34.65742], [40.97676, 34.39788], [40.64314, 34.31604], [38.79171, 33.37328], [39.08202, 32.50304], [38.98762, 32.47694], [39.04251, 32.30203], [39.26157, 32.35555], [39.29903, 32.23259], [40.01521, 32.05667], [42.97601, 30.72204], [42.97796, 30.48295], [44.72255, 29.19736], [46.42415, 29.05947], [46.5527, 29.10283], [46.89695, 29.50584], [47.15166, 30.01044], [47.37192, 30.10421], [47.7095, 30.10453], [48.01114, 29.98906], [48.06782, 30.02906], [48.17332, 30.02448], [48.40479, 29.85763], [48.59531, 29.66815], [48.83867, 29.78572], [48.61441, 29.93675], [48.51011, 29.96238], [48.44785, 30.00148], [48.4494, 30.04456], [48.43384, 30.08233], [48.38869, 30.11062], [48.38714, 30.13485], [48.41671, 30.17254], [48.41117, 30.19846], [48.26393, 30.3408], [48.24385, 30.33846], [48.21279, 30.31644], [48.19425, 30.32796], [48.18321, 30.39703], [48.14585, 30.44133], [48.02443, 30.4789], [48.03221, 30.9967], [47.68219, 31.00004], [47.6804, 31.39086], [47.86337, 31.78422], [47.64771, 32.07666], [47.52474, 32.15972], [47.57144, 32.20583], [47.37529, 32.47808], [47.17218, 32.45393], [46.46788, 32.91992], [46.32298, 32.9731], [46.17198, 32.95612], [46.09103, 32.98354], [46.15175, 33.07229], [46.03966, 33.09577], [46.05367, 33.13097], [46.11905, 33.11924], [46.20623, 33.20395], [45.99919, 33.5082], [45.86687, 33.49263], [45.96183, 33.55751], [45.89801, 33.63661], [45.77814, 33.60938], [45.50261, 33.94968], [45.42789, 33.9458], [45.41077, 33.97421], [45.47264, 34.03099], [45.56176, 34.15088], [45.58667, 34.30147], [45.53552, 34.35148], [45.49171, 34.3439], [45.46697, 34.38221], [45.43879, 34.45949], [45.51883, 34.47692], [45.53219, 34.60441], [45.59074, 34.55558], [45.60224, 34.55057], [45.73923, 34.54416], [45.70031, 34.69277], [45.65672, 34.7222], [45.68284, 34.76624], [45.70031, 34.82322], [45.73641, 34.83975], [45.79682, 34.85133], [45.78904, 34.91135], [45.86532, 34.89858], [45.89477, 34.95805], [45.87864, 35.03441], [45.92173, 35.0465], [45.92203, 35.09538], [45.93108, 35.08148], [45.94756, 35.09188], [46.06508, 35.03699], [46.07747, 35.0838], [46.11763, 35.07551], [46.19116, 35.11097], [46.15642, 35.1268], [46.16229, 35.16984], [46.19738, 35.18536], [46.18457, 35.22561], [46.11367, 35.23729], [46.15474, 35.2883], [46.13152, 35.32548], [46.05358, 35.38568], [45.98453, 35.49848], [46.01518, 35.52012], [45.97584, 35.58132], [46.03028, 35.57416], [46.01307, 35.59756], [46.0165, 35.61501], [45.99452, 35.63574], [46.0117, 35.65059], [46.01631, 35.69139], [46.23736, 35.71414], [46.34166, 35.78363], [46.32921, 35.82655], [46.17198, 35.8013], [46.08325, 35.8581], [45.94711, 35.82218], [45.89784, 35.83708], [45.81442, 35.82107], [45.76145, 35.79898], [45.6645, 35.92872], [45.60018, 35.96069], [45.55245, 35.99943], [45.46594, 36.00042], [45.38275, 35.97156], [45.33916, 35.99424], [45.37652, 36.06222], [45.37312, 36.09917], [45.32235, 36.17383], [45.30038, 36.27769], [45.26261, 36.3001], [45.27394, 36.35846], [45.23953, 36.43257], [45.11811, 36.40751], [45.00759, 36.5402], [45.06985, 36.62645], [45.06985, 36.6814], [45.01537, 36.75128], [44.84725, 36.77622], [44.83479, 36.81362], [44.90173, 36.86096], [44.91199, 36.91468], [44.89862, 37.01897], [44.81611, 37.04383], [44.75229, 37.11958], [44.78319, 37.1431], [44.76698, 37.16162], [44.63179, 37.19229], [44.42631, 37.05825], [44.38117, 37.05825], [44.35315, 37.04955], [44.35937, 37.02843], [44.30645, 36.97373], [44.25975, 36.98119], [44.18503, 37.09551], [44.22239, 37.15756], [44.27998, 37.16501], [44.2613, 37.25055], [44.13521, 37.32486], [44.02002, 37.33229], [43.90949, 37.22453], [43.84878, 37.22205], [43.82699, 37.19477], [43.8052, 37.22825], [43.7009, 37.23692], [43.63085, 37.21957], [43.56702, 37.25675], [43.50787, 37.24436], [43.33508, 37.33105], [43.30083, 37.30629], [43.11403, 37.37436], [42.93705, 37.32015], [42.78887, 37.38615]]]] } },
      { type: "Feature", properties: { iso1A2: "IR", iso1A3: "IRN", iso1N3: "364", wikidata: "Q794", nameEn: "Iran", groups: ["034", "142", "UN"], callingCodes: ["98"] }, geometry: { type: "MultiPolygon", coordinates: [[[[44.96746, 39.42998], [44.88916, 39.59653], [44.81043, 39.62677], [44.71806, 39.71124], [44.65422, 39.72163], [44.6137, 39.78393], [44.47298, 39.68788], [44.48111, 39.61579], [44.41849, 39.56659], [44.42832, 39.4131], [44.37921, 39.4131], [44.29818, 39.378], [44.22452, 39.4169], [44.03667, 39.39223], [44.1043, 39.19842], [44.20946, 39.13975], [44.18863, 38.93881], [44.30322, 38.81581], [44.26155, 38.71427], [44.28065, 38.6465], [44.32058, 38.62752], [44.3207, 38.49799], [44.3119, 38.37887], [44.38309, 38.36117], [44.44386, 38.38295], [44.50115, 38.33939], [44.42476, 38.25763], [44.22509, 37.88859], [44.3883, 37.85433], [44.45948, 37.77065], [44.55498, 37.783], [44.62096, 37.71985], [44.56887, 37.6429], [44.61401, 37.60165], [44.58449, 37.45018], [44.81021, 37.2915], [44.75986, 37.21549], [44.7868, 37.16644], [44.78319, 37.1431], [44.75229, 37.11958], [44.81611, 37.04383], [44.89862, 37.01897], [44.91199, 36.91468], [44.90173, 36.86096], [44.83479, 36.81362], [44.84725, 36.77622], [45.01537, 36.75128], [45.06985, 36.6814], [45.06985, 36.62645], [45.00759, 36.5402], [45.11811, 36.40751], [45.23953, 36.43257], [45.27394, 36.35846], [45.26261, 36.3001], [45.30038, 36.27769], [45.32235, 36.17383], [45.37312, 36.09917], [45.37652, 36.06222], [45.33916, 35.99424], [45.38275, 35.97156], [45.46594, 36.00042], [45.55245, 35.99943], [45.60018, 35.96069], [45.6645, 35.92872], [45.76145, 35.79898], [45.81442, 35.82107], [45.89784, 35.83708], [45.94711, 35.82218], [46.08325, 35.8581], [46.17198, 35.8013], [46.32921, 35.82655], [46.34166, 35.78363], [46.23736, 35.71414], [46.01631, 35.69139], [46.0117, 35.65059], [45.99452, 35.63574], [46.0165, 35.61501], [46.01307, 35.59756], [46.03028, 35.57416], [45.97584, 35.58132], [46.01518, 35.52012], [45.98453, 35.49848], [46.05358, 35.38568], [46.13152, 35.32548], [46.15474, 35.2883], [46.11367, 35.23729], [46.18457, 35.22561], [46.19738, 35.18536], [46.16229, 35.16984], [46.15642, 35.1268], [46.19116, 35.11097], [46.11763, 35.07551], [46.07747, 35.0838], [46.06508, 35.03699], [45.94756, 35.09188], [45.93108, 35.08148], [45.92203, 35.09538], [45.92173, 35.0465], [45.87864, 35.03441], [45.89477, 34.95805], [45.86532, 34.89858], [45.78904, 34.91135], [45.79682, 34.85133], [45.73641, 34.83975], [45.70031, 34.82322], [45.68284, 34.76624], [45.65672, 34.7222], [45.70031, 34.69277], [45.73923, 34.54416], [45.60224, 34.55057], [45.59074, 34.55558], [45.53219, 34.60441], [45.51883, 34.47692], [45.43879, 34.45949], [45.46697, 34.38221], [45.49171, 34.3439], [45.53552, 34.35148], [45.58667, 34.30147], [45.56176, 34.15088], [45.47264, 34.03099], [45.41077, 33.97421], [45.42789, 33.9458], [45.50261, 33.94968], [45.77814, 33.60938], [45.89801, 33.63661], [45.96183, 33.55751], [45.86687, 33.49263], [45.99919, 33.5082], [46.20623, 33.20395], [46.11905, 33.11924], [46.05367, 33.13097], [46.03966, 33.09577], [46.15175, 33.07229], [46.09103, 32.98354], [46.17198, 32.95612], [46.32298, 32.9731], [46.46788, 32.91992], [47.17218, 32.45393], [47.37529, 32.47808], [47.57144, 32.20583], [47.52474, 32.15972], [47.64771, 32.07666], [47.86337, 31.78422], [47.6804, 31.39086], [47.68219, 31.00004], [48.03221, 30.9967], [48.02443, 30.4789], [48.14585, 30.44133], [48.18321, 30.39703], [48.19425, 30.32796], [48.21279, 30.31644], [48.24385, 30.33846], [48.26393, 30.3408], [48.41117, 30.19846], [48.41671, 30.17254], [48.38714, 30.13485], [48.38869, 30.11062], [48.43384, 30.08233], [48.4494, 30.04456], [48.44785, 30.00148], [48.51011, 29.96238], [48.61441, 29.93675], [48.83867, 29.78572], [49.98877, 27.87827], [50.37726, 27.89227], [54.39838, 25.68383], [55.14145, 25.62624], [55.81777, 26.18798], [56.2644, 26.58649], [56.68954, 26.76645], [56.79239, 26.41236], [56.82555, 25.7713], [56.86325, 25.03856], [61.46682, 24.57869], [61.6433, 25.27541], [61.683, 25.66638], [61.83968, 25.7538], [61.83831, 26.07249], [61.89391, 26.26251], [62.05117, 26.31647], [62.21304, 26.26601], [62.31484, 26.528], [62.77352, 26.64099], [63.1889, 26.65072], [63.18688, 26.83844], [63.25005, 26.84212], [63.25005, 27.08692], [63.32283, 27.14437], [63.19649, 27.25674], [62.80604, 27.22412], [62.79684, 27.34381], [62.84905, 27.47627], [62.7638, 28.02992], [62.79412, 28.28108], [62.59499, 28.24842], [62.40259, 28.42703], [61.93581, 28.55284], [61.65978, 28.77937], [61.53765, 29.00507], [61.31508, 29.38903], [60.87231, 29.86514], [61.80829, 30.84224], [61.78268, 30.92724], [61.8335, 30.97669], [61.83257, 31.0452], [61.80957, 31.12576], [61.80569, 31.16167], [61.70929, 31.37391], [60.84541, 31.49561], [60.86191, 32.22565], [60.56485, 33.12944], [60.88908, 33.50219], [60.91133, 33.55596], [60.69573, 33.56054], [60.57762, 33.59772], [60.5485, 33.73422], [60.5838, 33.80793], [60.50209, 34.13992], [60.66502, 34.31539], [60.91321, 34.30411], [60.72316, 34.52857], [60.99922, 34.63064], [61.00197, 34.70631], [61.06926, 34.82139], [61.12831, 35.09938], [61.0991, 35.27845], [61.18187, 35.30249], [61.27371, 35.61482], [61.22719, 35.67038], [61.26152, 35.80749], [61.22444, 35.92879], [61.12007, 35.95992], [61.22719, 36.12759], [61.1393, 36.38782], [61.18187, 36.55348], [61.14516, 36.64644], [60.34767, 36.63214], [60.00768, 37.04102], [59.74678, 37.12499], [59.55178, 37.13594], [59.39385, 37.34257], [59.39797, 37.47892], [59.33507, 37.53146], [59.22905, 37.51161], [58.9338, 37.67374], [58.6921, 37.64548], [58.5479, 37.70526], [58.47786, 37.6433], [58.39959, 37.63134], [58.22999, 37.6856], [58.21399, 37.77281], [57.79534, 37.89299], [57.35042, 37.98546], [57.37236, 38.09321], [57.21169, 38.28965], [57.03453, 38.18717], [56.73928, 38.27887], [56.62255, 38.24005], [56.43303, 38.26054], [56.32454, 38.18502], [56.33278, 38.08132], [55.97847, 38.08024], [55.76561, 38.12238], [55.44152, 38.08564], [55.13412, 37.94705], [54.851, 37.75739], [54.77684, 37.62264], [54.81804, 37.61285], [54.77822, 37.51597], [54.67247, 37.43532], [54.58664, 37.45809], [54.36211, 37.34912], [54.24565, 37.32047], [53.89734, 37.3464], [48.88288, 38.43975], [48.84969, 38.45015], [48.81072, 38.44853], [48.78979, 38.45026], [48.70001, 38.40564], [48.62217, 38.40198], [48.58793, 38.45076], [48.45084, 38.61013], [48.3146, 38.59958], [48.24773, 38.71883], [48.02581, 38.82705], [48.01409, 38.90333], [48.07734, 38.91616], [48.08627, 38.94434], [48.28437, 38.97186], [48.33884, 39.03022], [48.31239, 39.09278], [48.15361, 39.19419], [48.12404, 39.25208], [48.15984, 39.30028], [48.37385, 39.37584], [48.34264, 39.42935], [47.98977, 39.70999], [47.84774, 39.66285], [47.50099, 39.49615], [47.38978, 39.45999], [47.31301, 39.37492], [47.05927, 39.24846], [47.05771, 39.20143], [46.95341, 39.13505], [46.92539, 39.16644], [46.83822, 39.13143], [46.75752, 39.03231], [46.53497, 38.86548], [46.34059, 38.92076], [46.20601, 38.85262], [46.14785, 38.84206], [46.06766, 38.87861], [46.00228, 38.87376], [45.94624, 38.89072], [45.90266, 38.87739], [45.83883, 38.90768], [45.65172, 38.95199], [45.6155, 38.94304], [45.6131, 38.964], [45.44966, 38.99243], [45.44811, 39.04927], [45.40452, 39.07224], [45.40148, 39.09007], [45.30489, 39.18333], [45.16168, 39.21952], [45.08751, 39.35052], [45.05932, 39.36435], [44.96746, 39.42998]]]] } },
      { type: "Feature", properties: { iso1A2: "IS", iso1A3: "ISL", iso1N3: "352", wikidata: "Q189", nameEn: "Iceland", groups: ["154", "150", "UN"], callingCodes: ["354"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-33.15676, 62.62995], [-8.25539, 63.0423], [-15.70914, 69.67442], [-33.15676, 62.62995]]]] } },
      { type: "Feature", properties: { iso1A2: "IT", iso1A3: "ITA", iso1N3: "380", wikidata: "Q38", nameEn: "Italy", groups: ["EU", "039", "150", "UN"], callingCodes: ["39"] }, geometry: { type: "MultiPolygon", coordinates: [[[[8.95861, 45.96485], [8.97604, 45.96151], [8.97741, 45.98317], [8.96668, 45.98436], [8.95861, 45.96485]]], [[[7.63035, 43.57419], [9.56115, 43.20816], [10.09675, 41.44089], [7.60802, 41.05927], [7.89009, 38.19924], [11.2718, 37.6713], [12.13667, 34.20326], [14.02721, 36.53141], [17.67657, 35.68918], [18.83516, 40.36999], [16.15283, 42.18525], [13.12821, 44.48877], [13.05142, 45.33128], [13.45644, 45.59464], [13.6076, 45.64761], [13.7198, 45.59352], [13.74587, 45.59811], [13.78445, 45.5825], [13.84106, 45.58185], [13.86771, 45.59898], [13.8695, 45.60835], [13.9191, 45.6322], [13.87933, 45.65207], [13.83422, 45.68703], [13.83332, 45.70855], [13.8235, 45.7176], [13.66986, 45.79955], [13.59784, 45.8072], [13.58858, 45.83503], [13.57563, 45.8425], [13.58644, 45.88173], [13.59565, 45.89446], [13.60857, 45.89907], [13.61931, 45.91782], [13.63815, 45.93607], [13.6329, 45.94894], [13.64307, 45.98326], [13.63458, 45.98947], [13.62074, 45.98388], [13.58903, 45.99009], [13.56759, 45.96991], [13.52963, 45.96588], [13.50104, 45.98078], [13.47474, 46.00546], [13.49702, 46.01832], [13.50998, 46.04498], [13.49568, 46.04839], [13.50104, 46.05986], [13.57072, 46.09022], [13.64053, 46.13587], [13.66472, 46.17392], [13.64451, 46.18966], [13.56682, 46.18703], [13.56114, 46.2054], [13.47587, 46.22725], [13.42218, 46.20758], [13.37671, 46.29668], [13.44808, 46.33507], [13.43418, 46.35992], [13.47019, 46.3621], [13.5763, 46.40915], [13.5763, 46.42613], [13.59777, 46.44137], [13.68684, 46.43881], [13.7148, 46.5222], [13.64088, 46.53438], [13.27627, 46.56059], [12.94445, 46.60401], [12.59992, 46.6595], [12.38708, 46.71529], [12.27591, 46.88651], [12.2006, 46.88854], [12.11675, 47.01241], [12.21781, 47.03996], [12.19254, 47.09331], [11.74789, 46.98484], [11.50739, 47.00644], [11.33355, 46.99862], [11.10618, 46.92966], [11.00764, 46.76896], [10.72974, 46.78972], [10.75753, 46.82258], [10.66405, 46.87614], [10.54783, 46.84505], [10.47197, 46.85698], [10.38659, 46.67847], [10.40475, 46.63671], [10.44686, 46.64162], [10.49375, 46.62049], [10.46136, 46.53164], [10.25309, 46.57432], [10.23674, 46.63484], [10.10307, 46.61003], [10.03715, 46.44479], [10.165, 46.41051], [10.10506, 46.3372], [10.17862, 46.25626], [10.14439, 46.22992], [10.07055, 46.21668], [9.95249, 46.38045], [9.73086, 46.35071], [9.71273, 46.29266], [9.57015, 46.2958], [9.46117, 46.37481], [9.45936, 46.50873], [9.40487, 46.46621], [9.36128, 46.5081], [9.28136, 46.49685], [9.25502, 46.43743], [9.29226, 46.32717], [9.24503, 46.23616], [9.01618, 46.04928], [8.99257, 45.9698], [9.09065, 45.89906], [9.06642, 45.8761], [9.04546, 45.84968], [9.04059, 45.8464], [9.03505, 45.83976], [9.03793, 45.83548], [9.03279, 45.82865], [9.0298, 45.82127], [9.00324, 45.82055], [8.99663, 45.83466], [8.9621, 45.83707], [8.94737, 45.84285], [8.91129, 45.8388], [8.93504, 45.86245], [8.94372, 45.86587], [8.93649, 45.86775], [8.88904, 45.95465], [8.86688, 45.96135], [8.85121, 45.97239], [8.8319, 45.9879], [8.79362, 45.99207], [8.78585, 45.98973], [8.79414, 46.00913], [8.85617, 46.0748], [8.80778, 46.10085], [8.75697, 46.10395], [8.62242, 46.12112], [8.45032, 46.26869], [8.46317, 46.43712], [8.42464, 46.46367], [8.30648, 46.41587], [8.31162, 46.38044], [8.08814, 46.26692], [8.16866, 46.17817], [8.11383, 46.11577], [8.02906, 46.10331], [7.98881, 45.99867], [7.9049, 45.99945], [7.85949, 45.91485], [7.56343, 45.97421], [7.10685, 45.85653], [7.04151, 45.92435], [6.95315, 45.85163], [6.80785, 45.83265], [6.80785, 45.71864], [6.98948, 45.63869], [7.00037, 45.509], [7.18019, 45.40071], [7.10572, 45.32924], [7.13115, 45.25386], [7.07074, 45.21228], [6.96706, 45.20841], [6.85144, 45.13226], [6.7697, 45.16044], [6.62803, 45.11175], [6.66981, 45.02324], [6.74791, 45.01939], [6.74519, 44.93661], [6.75518, 44.89915], [6.90774, 44.84322], [6.93499, 44.8664], [7.02217, 44.82519], [7.00401, 44.78782], [7.07484, 44.68073], [7.00582, 44.69364], [6.95133, 44.66264], [6.96042, 44.62129], [6.85507, 44.53072], [6.86233, 44.49834], [6.94504, 44.43112], [6.88784, 44.42043], [6.89171, 44.36637], [6.98221, 44.28289], [7.00764, 44.23736], [7.16929, 44.20352], [7.27827, 44.1462], [7.34547, 44.14359], [7.36364, 44.11882], [7.62155, 44.14881], [7.63245, 44.17877], [7.68694, 44.17487], [7.66878, 44.12795], [7.72508, 44.07578], [7.6597, 44.03009], [7.66848, 43.99943], [7.65266, 43.9763], [7.60771, 43.95772], [7.56858, 43.94506], [7.56075, 43.89932], [7.51162, 43.88301], [7.49355, 43.86551], [7.50423, 43.84345], [7.53006, 43.78405], [7.63035, 43.57419]], [[12.45181, 41.90056], [12.44834, 41.90095], [12.44582, 41.90194], [12.44815, 41.90326], [12.44984, 41.90545], [12.45091, 41.90625], [12.45543, 41.90738], [12.45561, 41.90629], [12.45762, 41.9058], [12.45755, 41.9033], [12.45826, 41.90281], [12.45834, 41.90174], [12.4577, 41.90115], [12.45691, 41.90125], [12.45626, 41.90172], [12.45435, 41.90143], [12.45446, 41.90028], [12.45181, 41.90056]], [[12.45648, 43.89369], [12.44184, 43.90498], [12.41641, 43.89991], [12.40935, 43.9024], [12.41233, 43.90956], [12.40733, 43.92379], [12.41551, 43.92984], [12.41165, 43.93769], [12.40506, 43.94325], [12.40415, 43.95485], [12.41414, 43.95273], [12.42005, 43.9578], [12.43662, 43.95698], [12.44684, 43.96597], [12.46205, 43.97463], [12.47853, 43.98052], [12.49406, 43.98492], [12.50678, 43.99113], [12.51463, 43.99122], [12.5154, 43.98508], [12.51064, 43.98165], [12.51109, 43.97201], [12.50622, 43.97131], [12.50875, 43.96198], [12.50655, 43.95796], [12.51427, 43.94897], [12.51553, 43.94096], [12.50496, 43.93017], [12.50269, 43.92363], [12.49724, 43.92248], [12.49247, 43.91774], [12.49429, 43.90973], [12.48771, 43.89706], [12.45648, 43.89369]]]] } },
      { type: "Feature", properties: { iso1A2: "JE", iso1A3: "JEY", iso1N3: "832", wikidata: "Q785", nameEn: "Bailiwick of Jersey", country: "GB", groups: ["830", "Q185086", "154", "150", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["44 01534"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.00491, 48.86706], [-1.83944, 49.23037], [-2.09454, 49.46288], [-2.65349, 49.15373], [-2.00491, 48.86706]]]] } },
      { type: "Feature", properties: { iso1A2: "JM", iso1A3: "JAM", iso1N3: "388", wikidata: "Q766", nameEn: "Jamaica", aliases: ["JA"], groups: ["029", "003", "419", "019", "UN"], driveSide: "left", callingCodes: ["1 876", "1 658"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-74.09729, 17.36817], [-78.9741, 19.59515], [-78.34606, 16.57862], [-74.09729, 17.36817]]]] } },
      { type: "Feature", properties: { iso1A2: "JO", iso1A3: "JOR", iso1N3: "400", wikidata: "Q810", nameEn: "Jordan", groups: ["145", "142", "UN"], callingCodes: ["962"] }, geometry: { type: "MultiPolygon", coordinates: [[[[39.04251, 32.30203], [38.98762, 32.47694], [39.08202, 32.50304], [38.79171, 33.37328], [36.83946, 32.31293], [36.40959, 32.37908], [36.23948, 32.50108], [36.20875, 32.49529], [36.20379, 32.52751], [36.08074, 32.51463], [36.02239, 32.65911], [35.96633, 32.66237], [35.93307, 32.71966], [35.88405, 32.71321], [35.75983, 32.74803], [35.68467, 32.70715], [35.66527, 32.681], [35.61669, 32.67999], [35.59813, 32.65159], [35.56614, 32.64393], [35.57485, 32.48669], [35.55494, 32.42687], [35.55807, 32.38674], [35.57111, 32.21877], [35.52012, 32.04076], [35.54375, 31.96587], [35.52758, 31.9131], [35.55941, 31.76535], [35.47672, 31.49578], [35.40316, 31.25535], [35.43658, 31.12444], [35.41371, 30.95565], [35.33984, 30.8802], [35.33456, 30.81224], [35.29311, 30.71365], [35.21379, 30.60401], [35.19595, 30.50297], [35.16218, 30.43535], [35.19183, 30.34636], [35.14108, 30.07374], [35.02147, 29.66343], [34.98207, 29.58147], [34.97718, 29.54294], [34.92298, 29.45305], [34.8812, 29.36878], [36.07081, 29.18469], [36.50005, 29.49696], [36.75083, 29.86903], [37.4971, 29.99949], [37.66395, 30.33245], [37.99354, 30.49998], [36.99791, 31.50081], [38.99233, 31.99721], [39.29903, 32.23259], [39.26157, 32.35555], [39.04251, 32.30203]]]] } },
      { type: "Feature", properties: { iso1A2: "JP", iso1A3: "JPN", iso1N3: "392", wikidata: "Q17", nameEn: "Japan", groups: ["030", "142", "UN"], driveSide: "left", callingCodes: ["81"] }, geometry: { type: "MultiPolygon", coordinates: [[[[145.82361, 43.38904], [145.23667, 43.76813], [145.82343, 44.571], [140.9182, 45.92937], [133.61399, 37.41], [129.2669, 34.87122], [122.26612, 25.98197], [123.92912, 17.8782], [155.16731, 23.60141], [145.82361, 43.38904]]]] } },
      { type: "Feature", properties: { iso1A2: "KE", iso1A3: "KEN", iso1N3: "404", wikidata: "Q114", nameEn: "Kenya", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["254"] }, geometry: { type: "MultiPolygon", coordinates: [[[[35.9419, 4.61933], [35.51424, 4.61643], [35.42366, 4.76969], [35.47843, 4.91872], [35.30992, 4.90402], [35.34151, 5.02364], [34.47601, 4.72162], [33.9873, 4.23316], [34.06046, 4.15235], [34.15429, 3.80464], [34.45815, 3.67385], [34.44922, 3.51627], [34.39112, 3.48802], [34.41794, 3.44342], [34.40006, 3.37949], [34.45815, 3.18319], [34.56242, 3.11478], [34.60114, 2.93034], [34.65774, 2.8753], [34.73967, 2.85447], [34.78137, 2.76223], [34.77244, 2.70272], [34.95267, 2.47209], [34.90947, 2.42447], [34.98692, 1.97348], [34.9899, 1.6668], [34.92734, 1.56109], [34.87819, 1.5596], [34.7918, 1.36752], [34.82606, 1.30944], [34.82606, 1.26626], [34.80223, 1.22754], [34.67562, 1.21265], [34.58029, 1.14712], [34.57427, 1.09868], [34.52369, 1.10692], [34.43349, 0.85254], [34.40041, 0.80266], [34.31516, 0.75693], [34.27345, 0.63182], [34.20196, 0.62289], [34.13493, 0.58118], [34.11408, 0.48884], [34.08727, 0.44713], [34.10067, 0.36372], [33.90936, 0.10581], [33.98449, -0.13079], [33.9264, -0.54188], [33.93107, -0.99298], [34.02286, -1.00779], [34.03084, -1.05101], [34.0824, -1.02264], [37.67199, -3.06222], [37.71745, -3.304], [37.5903, -3.42735], [37.63099, -3.50723], [37.75036, -3.54243], [37.81321, -3.69179], [39.21631, -4.67835], [39.44306, -4.93877], [39.62121, -4.68136], [41.75542, -1.85308], [41.56362, -1.66375], [41.56, -1.59812], [41.00099, -0.83068], [40.98767, 2.82959], [41.31368, 3.14314], [41.89488, 3.97375], [41.1754, 3.94079], [40.77498, 4.27683], [39.86043, 3.86974], [39.76808, 3.67058], [39.58339, 3.47434], [39.55132, 3.39634], [39.51551, 3.40895], [39.49444, 3.45521], [39.19954, 3.47834], [39.07736, 3.5267], [38.91938, 3.51198], [38.52336, 3.62551], [38.45812, 3.60445], [38.14168, 3.62487], [37.07724, 4.33503], [36.84474, 4.44518], [36.03924, 4.44406], [35.95449, 4.53244], [35.9419, 4.61933]]]] } },
      { type: "Feature", properties: { iso1A2: "KG", iso1A3: "KGZ", iso1N3: "417", wikidata: "Q813", nameEn: "Kyrgyzstan", groups: ["143", "142", "UN"], callingCodes: ["996"] }, geometry: { type: "MultiPolygon", coordinates: [[[[74.88756, 42.98612], [74.75, 42.99029], [74.70331, 43.02519], [74.64615, 43.05881], [74.57491, 43.13702], [74.22489, 43.24657], [73.55634, 43.03071], [73.50992, 42.82356], [73.44393, 42.43098], [71.88792, 42.83578], [71.62405, 42.76613], [71.53272, 42.8014], [71.2724, 42.77853], [71.22785, 42.69248], [71.17807, 42.67381], [71.15232, 42.60486], [70.97717, 42.50147], [70.85973, 42.30188], [70.94483, 42.26238], [71.13263, 42.28356], [71.28719, 42.18033], [70.69777, 41.92554], [70.17682, 41.5455], [70.48909, 41.40335], [70.67586, 41.47953], [70.78572, 41.36419], [70.77885, 41.24813], [70.86263, 41.23833], [70.9615, 41.16393], [71.02193, 41.19494], [71.11806, 41.15359], [71.25813, 41.18796], [71.27187, 41.11015], [71.34877, 41.16807], [71.40198, 41.09436], [71.46148, 41.13958], [71.43814, 41.19644], [71.46688, 41.31883], [71.57227, 41.29175], [71.6787, 41.42111], [71.65914, 41.49599], [71.73054, 41.54713], [71.71132, 41.43012], [71.76625, 41.4466], [71.83914, 41.3546], [71.91457, 41.2982], [71.85964, 41.19081], [72.07249, 41.11739], [72.10745, 41.15483], [72.16433, 41.16483], [72.17594, 41.15522], [72.14864, 41.13363], [72.1792, 41.10621], [72.21061, 41.05607], [72.17594, 41.02377], [72.18339, 40.99571], [72.324, 41.03381], [72.34026, 41.04539], [72.34757, 41.06104], [72.36138, 41.04384], [72.38511, 41.02785], [72.45206, 41.03018], [72.48742, 40.97136], [72.55109, 40.96046], [72.59136, 40.86947], [72.68157, 40.84942], [72.84291, 40.85512], [72.94454, 40.8094], [73.01869, 40.84681], [73.13267, 40.83512], [73.13412, 40.79122], [73.0612, 40.76678], [72.99133, 40.76457], [72.93296, 40.73089], [72.8722, 40.71111], [72.85372, 40.7116], [72.84754, 40.67229], [72.80137, 40.67856], [72.74866, 40.60873], [72.74894, 40.59592], [72.75982, 40.57273], [72.74862, 40.57131], [72.74768, 40.58051], [72.73995, 40.58409], [72.69579, 40.59778], [72.66713, 40.59076], [72.66713, 40.5219], [72.47795, 40.5532], [72.40517, 40.61917], [72.34406, 40.60144], [72.41714, 40.55736], [72.38384, 40.51535], [72.41513, 40.50856], [72.44191, 40.48222], [72.40346, 40.4007], [72.24368, 40.46091], [72.18648, 40.49893], [71.96401, 40.31907], [72.05464, 40.27586], [71.85002, 40.25647], [71.82646, 40.21872], [71.73054, 40.14818], [71.71719, 40.17886], [71.69621, 40.18492], [71.70569, 40.20391], [71.68386, 40.26984], [71.61931, 40.26775], [71.61725, 40.20615], [71.51549, 40.22986], [71.51215, 40.26943], [71.4246, 40.28619], [71.36663, 40.31593], [71.13042, 40.34106], [71.05901, 40.28765], [70.95789, 40.28761], [70.9818, 40.22392], [70.80495, 40.16813], [70.7928, 40.12797], [70.65827, 40.0981], [70.65946, 39.9878], [70.58912, 39.95211], [70.55033, 39.96619], [70.47557, 39.93216], [70.57384, 39.99394], [70.58297, 40.00891], [70.01283, 40.23288], [69.67001, 40.10639], [69.64704, 40.12165], [69.57615, 40.10524], [69.55555, 40.12296], [69.53794, 40.11833], [69.53855, 40.0887], [69.5057, 40.03277], [69.53615, 39.93991], [69.43557, 39.92877], [69.43134, 39.98431], [69.35649, 40.01994], [69.26938, 39.8127], [69.3594, 39.52516], [69.68677, 39.59281], [69.87491, 39.53882], [70.11111, 39.58223], [70.2869, 39.53141], [70.44757, 39.60128], [70.64087, 39.58792], [70.7854, 39.38933], [71.06418, 39.41586], [71.08752, 39.50704], [71.49814, 39.61397], [71.55856, 39.57588], [71.5517, 39.45722], [71.62688, 39.44056], [71.76816, 39.45456], [71.80164, 39.40631], [71.7522, 39.32031], [71.79202, 39.27355], [71.90601, 39.27674], [72.04059, 39.36704], [72.09689, 39.26823], [72.17242, 39.2661], [72.23834, 39.17248], [72.33173, 39.33093], [72.62027, 39.39696], [72.85934, 39.35116], [73.18454, 39.35536], [73.31912, 39.38615], [73.45096, 39.46677], [73.59831, 39.46425], [73.87018, 39.47879], [73.94683, 39.60733], [73.92354, 39.69565], [73.9051, 39.75073], [73.83006, 39.76136], [73.97049, 40.04378], [74.25533, 40.13191], [74.35063, 40.09742], [74.69875, 40.34668], [74.85996, 40.32857], [74.78168, 40.44886], [74.82013, 40.52197], [75.08243, 40.43945], [75.22834, 40.45382], [75.5854, 40.66874], [75.69663, 40.28642], [75.91361, 40.2948], [75.96168, 40.38064], [76.33659, 40.3482], [76.5261, 40.46114], [76.75681, 40.95354], [76.99302, 41.0696], [77.28004, 41.0033], [77.3693, 41.0375], [77.52723, 41.00227], [77.76206, 41.01574], [77.81287, 41.14307], [78.12873, 41.23091], [78.15757, 41.38565], [78.3732, 41.39603], [79.92977, 42.04113], [80.17842, 42.03211], [80.17807, 42.21166], [79.97364, 42.42816], [79.52921, 42.44778], [79.19763, 42.804], [78.91502, 42.76839], [78.48469, 42.89649], [75.82823, 42.94848], [75.72174, 42.79672], [75.29966, 42.86183], [75.22619, 42.85528], [74.88756, 42.98612]], [[70.74189, 39.86319], [70.63105, 39.77923], [70.59667, 39.83542], [70.54998, 39.85137], [70.52631, 39.86989], [70.53651, 39.89155], [70.74189, 39.86319]], [[71.86463, 39.98598], [71.84316, 39.95582], [71.7504, 39.93701], [71.71511, 39.96348], [71.78838, 40.01404], [71.86463, 39.98598]], [[71.21139, 40.03369], [71.1427, 39.95026], [71.23067, 39.93581], [71.16101, 39.88423], [71.10531, 39.91354], [71.04979, 39.89808], [71.10501, 39.95568], [71.09063, 39.99], [71.11668, 39.99291], [71.11037, 40.01984], [71.01035, 40.05481], [71.00236, 40.18154], [71.06305, 40.1771], [71.12218, 40.03052], [71.21139, 40.03369]]]] } },
      { type: "Feature", properties: { iso1A2: "KH", iso1A3: "KHM", iso1N3: "116", wikidata: "Q424", nameEn: "Cambodia", groups: ["035", "142", "UN"], callingCodes: ["855"] }, geometry: { type: "MultiPolygon", coordinates: [[[[105.87328, 11.55953], [105.81645, 11.56876], [105.80867, 11.60536], [105.8507, 11.66635], [105.88962, 11.67854], [105.95188, 11.63738], [106.00792, 11.7197], [106.02038, 11.77457], [106.06708, 11.77761], [106.13158, 11.73283], [106.18539, 11.75171], [106.26478, 11.72122], [106.30525, 11.67549], [106.37219, 11.69836], [106.44691, 11.66787], [106.45158, 11.68616], [106.41577, 11.76999], [106.44535, 11.8279], [106.44068, 11.86294], [106.4687, 11.86751], [106.4111, 11.97413], [106.70687, 11.96956], [106.79405, 12.0807], [106.92325, 12.06548], [106.99953, 12.08983], [107.15831, 12.27547], [107.34511, 12.33327], [107.42917, 12.24657], [107.4463, 12.29373], [107.55059, 12.36824], [107.5755, 12.52177], [107.55993, 12.7982], [107.49611, 12.88926], [107.49144, 13.01215], [107.62843, 13.3668], [107.61909, 13.52577], [107.53503, 13.73908], [107.45252, 13.78897], [107.46498, 13.91593], [107.44318, 13.99751], [107.38247, 13.99147], [107.35757, 14.02319], [107.37158, 14.07906], [107.33577, 14.11832], [107.40427, 14.24509], [107.39493, 14.32655], [107.44941, 14.41552], [107.48521, 14.40346], [107.52569, 14.54665], [107.52102, 14.59034], [107.55371, 14.628], [107.54361, 14.69092], [107.47238, 14.61523], [107.44435, 14.52785], [107.37897, 14.54443], [107.3276, 14.58812], [107.29803, 14.58963], [107.26534, 14.54292], [107.256, 14.48716], [107.21241, 14.48716], [107.17038, 14.41782], [107.09722, 14.3937], [107.03962, 14.45099], [107.04585, 14.41782], [106.98825, 14.36806], [106.9649, 14.3198], [106.90574, 14.33639], [106.8497, 14.29416], [106.80767, 14.31226], [106.73762, 14.42687], [106.63333, 14.44194], [106.59908, 14.50977], [106.57106, 14.50525], [106.54148, 14.59565], [106.50723, 14.58963], [106.45898, 14.55045], [106.47766, 14.50977], [106.43874, 14.52032], [106.40916, 14.45249], [106.32355, 14.44043], [106.25194, 14.48415], [106.21302, 14.36203], [106.00131, 14.36957], [105.99509, 14.32734], [106.02311, 14.30623], [106.04801, 14.20363], [106.10872, 14.18401], [106.11962, 14.11307], [106.18656, 14.06324], [106.16632, 14.01794], [106.10094, 13.98471], [106.10405, 13.9137], [105.90791, 13.92881], [105.78182, 14.02247], [105.78338, 14.08438], [105.5561, 14.15684], [105.44869, 14.10703], [105.36775, 14.09948], [105.2759, 14.17496], [105.20894, 14.34967], [105.17748, 14.34432], [105.14012, 14.23873], [105.08408, 14.20402], [105.02804, 14.23722], [104.97667, 14.38806], [104.69335, 14.42726], [104.55014, 14.36091], [104.27616, 14.39861], [103.93836, 14.3398], [103.70175, 14.38052], [103.71109, 14.4348], [103.53518, 14.42575], [103.39353, 14.35639], [103.16469, 14.33075], [102.93275, 14.19044], [102.91251, 14.01531], [102.77864, 13.93374], [102.72727, 13.77806], [102.56848, 13.69366], [102.5481, 13.6589], [102.58635, 13.6286], [102.62483, 13.60883], [102.57573, 13.60461], [102.5358, 13.56933], [102.44601, 13.5637], [102.36859, 13.57488], [102.33828, 13.55613], [102.361, 13.50551], [102.35563, 13.47307], [102.35692, 13.38274], [102.34611, 13.35618], [102.36001, 13.31142], [102.36146, 13.26006], [102.43422, 13.09061], [102.46011, 13.08057], [102.52275, 12.99813], [102.48694, 12.97537], [102.49335, 12.92711], [102.53053, 12.77506], [102.4994, 12.71736], [102.51963, 12.66117], [102.57567, 12.65358], [102.7796, 12.43781], [102.78116, 12.40284], [102.73134, 12.37091], [102.70176, 12.1686], [102.77026, 12.06815], [102.78427, 11.98746], [102.83957, 11.8519], [102.90973, 11.75613], [102.91449, 11.65512], [102.52395, 11.25257], [102.47649, 9.66162], [103.99198, 10.48391], [104.43778, 10.42386], [104.47963, 10.43046], [104.49869, 10.4057], [104.59018, 10.53073], [104.87933, 10.52833], [104.95094, 10.64003], [105.09571, 10.72722], [105.02722, 10.89236], [105.08326, 10.95656], [105.11449, 10.96332], [105.34011, 10.86179], [105.42884, 10.96878], [105.50045, 10.94586], [105.77751, 11.03671], [105.86376, 10.89839], [105.84603, 10.85873], [105.93403, 10.83853], [105.94535, 10.9168], [106.06708, 10.8098], [106.18539, 10.79451], [106.14301, 10.98176], [106.20095, 10.97795], [106.1757, 11.07301], [106.1527, 11.10476], [106.10444, 11.07879], [105.86782, 11.28343], [105.88962, 11.43605], [105.87328, 11.55953]]]] } },
      { type: "Feature", properties: { iso1A2: "KI", iso1A3: "KIR", iso1N3: "296", wikidata: "Q710", nameEn: "Kiribati", groups: ["057", "009", "UN"], driveSide: "left", callingCodes: ["686"] }, geometry: { type: "MultiPolygon", coordinates: [[[[169, 3.9], [169, -3.5], [178, -3.5], [178, 3.9], [169, 3.9]]], [[[-161.06795, 5.2462], [-158.12991, -1.86122], [-175.33482, -1.40631], [-175.31804, -7.54825], [-156.50903, -7.4975], [-156.48634, -15.52824], [-135.59706, -4.70473], [-161.06795, 5.2462]]]] } },
      { type: "Feature", properties: { iso1A2: "KM", iso1A3: "COM", iso1N3: "174", wikidata: "Q970", nameEn: "Comoros", groups: ["014", "202", "002", "UN"], callingCodes: ["269"] }, geometry: { type: "MultiPolygon", coordinates: [[[[42.63904, -10.02522], [43.28731, -13.97126], [45.4971, -11.75965], [42.63904, -10.02522]]]] } },
      { type: "Feature", properties: { iso1A2: "KN", iso1A3: "KNA", iso1N3: "659", wikidata: "Q763", nameEn: "St. Kitts and Nevis", groups: ["029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 869"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-62.29333, 17.43155], [-62.76692, 17.64353], [-63.09677, 17.21372], [-62.63813, 16.65446], [-62.29333, 17.43155]]]] } },
      { type: "Feature", properties: { iso1A2: "KP", iso1A3: "PRK", iso1N3: "408", wikidata: "Q423", nameEn: "North Korea", groups: ["030", "142", "UN"], callingCodes: ["850"] }, geometry: { type: "MultiPolygon", coordinates: [[[[130.26095, 42.9027], [130.09764, 42.91425], [130.12957, 42.98361], [129.96409, 42.97306], [129.95082, 43.01051], [129.8865, 43.00395], [129.85261, 42.96494], [129.83277, 42.86746], [129.80719, 42.79218], [129.7835, 42.76521], [129.77183, 42.69435], [129.75294, 42.59409], [129.72541, 42.43739], [129.60482, 42.44461], [129.54701, 42.37254], [129.42882, 42.44702], [129.28541, 42.41574], [129.22423, 42.3553], [129.22285, 42.26491], [129.15178, 42.17224], [128.96068, 42.06657], [128.94007, 42.03537], [128.04487, 42.01769], [128.15119, 41.74568], [128.30716, 41.60322], [128.20061, 41.40895], [128.18546, 41.41279], [128.12967, 41.37931], [128.03311, 41.39232], [128.02633, 41.42103], [127.92943, 41.44291], [127.29712, 41.49473], [127.17841, 41.59714], [126.90729, 41.79955], [126.60631, 41.65565], [126.53189, 41.35206], [126.242, 41.15454], [126.00335, 40.92835], [125.76869, 40.87908], [125.71172, 40.85223], [124.86913, 40.45387], [124.40719, 40.13655], [124.38556, 40.11047], [124.3322, 40.05573], [124.37089, 40.03004], [124.35029, 39.95639], [124.23201, 39.9248], [124.17532, 39.8232], [123.90497, 38.79949], [123.85601, 37.49093], [124.67666, 38.05679], [124.84224, 37.977], [124.87921, 37.80827], [125.06408, 37.66334], [125.37112, 37.62643], [125.81159, 37.72949], [126.13074, 37.70512], [126.18776, 37.74728], [126.19097, 37.81462], [126.24402, 37.83113], [126.43239, 37.84095], [126.46818, 37.80873], [126.56709, 37.76857], [126.59918, 37.76364], [126.66067, 37.7897], [126.68793, 37.83728], [126.68793, 37.9175], [126.67023, 37.95852], [126.84961, 38.0344], [126.88106, 38.10246], [126.95887, 38.1347], [126.95338, 38.17735], [127.04479, 38.25518], [127.15749, 38.30722], [127.38727, 38.33227], [127.49672, 38.30647], [127.55013, 38.32257], [128.02917, 38.31861], [128.27652, 38.41657], [128.31105, 38.58462], [128.37487, 38.62345], [128.65655, 38.61914], [131.95041, 41.5445], [130.65022, 42.32281], [130.66367, 42.38024], [130.64181, 42.41422], [130.60805, 42.4317], [130.56835, 42.43281], [130.55143, 42.52158], [130.50123, 42.61636], [130.44361, 42.54849], [130.41826, 42.6011], [130.2385, 42.71127], [130.23068, 42.80125], [130.26095, 42.9027]]]] } },
      { type: "Feature", properties: { iso1A2: "KR", iso1A3: "KOR", iso1N3: "410", wikidata: "Q884", nameEn: "South Korea", groups: ["030", "142", "UN"], callingCodes: ["82"] }, geometry: { type: "MultiPolygon", coordinates: [[[[133.11729, 37.53115], [128.65655, 38.61914], [128.37487, 38.62345], [128.31105, 38.58462], [128.27652, 38.41657], [128.02917, 38.31861], [127.55013, 38.32257], [127.49672, 38.30647], [127.38727, 38.33227], [127.15749, 38.30722], [127.04479, 38.25518], [126.95338, 38.17735], [126.95887, 38.1347], [126.88106, 38.10246], [126.84961, 38.0344], [126.67023, 37.95852], [126.68793, 37.9175], [126.68793, 37.83728], [126.66067, 37.7897], [126.59918, 37.76364], [126.56709, 37.76857], [126.46818, 37.80873], [126.43239, 37.84095], [126.24402, 37.83113], [126.19097, 37.81462], [126.18776, 37.74728], [126.13074, 37.70512], [125.81159, 37.72949], [125.37112, 37.62643], [125.06408, 37.66334], [124.87921, 37.80827], [124.84224, 37.977], [124.67666, 38.05679], [123.85601, 37.49093], [122.80525, 33.30571], [125.99728, 32.63328], [129.2669, 34.87122], [133.11729, 37.53115]]]] } },
      { type: "Feature", properties: { iso1A2: "KW", iso1A3: "KWT", iso1N3: "414", wikidata: "Q817", nameEn: "Kuwait", groups: ["145", "142", "UN"], callingCodes: ["965"] }, geometry: { type: "MultiPolygon", coordinates: [[[[49.00421, 28.81495], [48.59531, 29.66815], [48.40479, 29.85763], [48.17332, 30.02448], [48.06782, 30.02906], [48.01114, 29.98906], [47.7095, 30.10453], [47.37192, 30.10421], [47.15166, 30.01044], [46.89695, 29.50584], [46.5527, 29.10283], [47.46202, 29.0014], [47.58376, 28.83382], [47.59863, 28.66798], [47.70561, 28.5221], [48.42991, 28.53628], [49.00421, 28.81495]]]] } },
      { type: "Feature", properties: { iso1A2: "KY", iso1A3: "CYM", iso1N3: "136", wikidata: "Q5785", nameEn: "Cayman Islands", country: "GB", groups: ["BOTS", "029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1 345"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-82.11509, 19.60401], [-80.36068, 18.11751], [-79.32727, 20.06742], [-82.11509, 19.60401]]]] } },
      { type: "Feature", properties: { iso1A2: "KZ", iso1A3: "KAZ", iso1N3: "398", wikidata: "Q232", nameEn: "Kazakhstan", groups: ["143", "142", "UN"], callingCodes: ["7"] }, geometry: { type: "MultiPolygon", coordinates: [[[[68.90865, 55.38148], [68.19206, 55.18823], [68.26661, 55.09226], [68.21308, 54.98645], [65.20174, 54.55216], [65.24663, 54.35721], [65.11033, 54.33028], [64.97216, 54.4212], [63.97686, 54.29763], [64.02715, 54.22679], [63.91224, 54.20013], [63.80604, 54.27079], [62.58651, 54.05871], [62.56876, 53.94047], [62.45931, 53.90737], [62.38535, 54.03961], [62.00966, 54.04134], [62.03913, 53.94768], [61.65318, 54.02445], [61.56941, 53.95703], [61.47603, 54.08048], [61.3706, 54.08464], [61.26863, 53.92797], [60.99796, 53.93699], [61.14283, 53.90063], [61.22574, 53.80268], [60.90626, 53.62937], [61.55706, 53.57144], [61.57185, 53.50112], [61.37957, 53.45887], [61.29082, 53.50992], [61.14291, 53.41481], [61.19024, 53.30536], [62.14574, 53.09626], [62.12799, 52.99133], [62.0422, 52.96105], [61.23462, 53.03227], [61.05842, 52.92217], [60.71989, 52.75923], [60.71693, 52.66245], [60.84118, 52.63912], [60.84709, 52.52228], [60.98021, 52.50068], [61.05417, 52.35096], [60.78201, 52.22067], [60.72581, 52.15538], [60.48915, 52.15175], [60.19925, 51.99173], [59.99809, 51.98263], [60.09867, 51.87135], [60.50986, 51.7964], [60.36787, 51.66815], [60.5424, 51.61675], [60.92401, 51.61124], [60.95655, 51.48615], [61.50677, 51.40687], [61.55114, 51.32746], [61.6813, 51.25716], [61.56889, 51.23679], [61.4431, 50.80679], [60.81833, 50.6629], [60.31914, 50.67705], [60.17262, 50.83312], [60.01288, 50.8163], [59.81172, 50.54451], [59.51886, 50.49937], [59.48928, 50.64216], [58.87974, 50.70852], [58.3208, 51.15151], [57.75578, 51.13852], [57.74986, 50.93017], [57.44221, 50.88354], [57.17302, 51.11253], [56.17906, 50.93204], [56.11398, 50.7471], [55.67774, 50.54508], [54.72067, 51.03261], [54.56685, 51.01958], [54.71476, 50.61214], [54.55797, 50.52006], [54.41894, 50.61214], [54.46331, 50.85554], [54.12248, 51.11542], [53.69299, 51.23466], [53.46165, 51.49445], [52.54329, 51.48444], [52.36119, 51.74161], [51.8246, 51.67916], [51.77431, 51.49536], [51.301, 51.48799], [51.26254, 51.68466], [50.59695, 51.61859], [50.26859, 51.28677], [49.97277, 51.2405], [49.76866, 51.11067], [49.39001, 51.09396], [49.41959, 50.85927], [49.12673, 50.78639], [48.86936, 50.61589], [48.57946, 50.63278], [48.90782, 50.02281], [48.68352, 49.89546], [48.42564, 49.82283], [48.24519, 49.86099], [48.10044, 50.09242], [47.58551, 50.47867], [47.30448, 50.30894], [47.34589, 50.09308], [47.18319, 49.93721], [46.9078, 49.86707], [46.78398, 49.34026], [47.04658, 49.19834], [47.00857, 49.04921], [46.78392, 48.95352], [46.49011, 48.43019], [47.11516, 48.27188], [47.12107, 47.83687], [47.38731, 47.68176], [47.41689, 47.83687], [47.64973, 47.76559], [48.15348, 47.74545], [48.45173, 47.40818], [48.52326, 47.4102], [49.01136, 46.72716], [48.51142, 46.69268], [48.54988, 46.56267], [49.16518, 46.38542], [49.32259, 46.26944], [49.88945, 46.04554], [49.2134, 44.84989], [52.26048, 41.69249], [52.47884, 41.78034], [52.97575, 42.1308], [54.20635, 42.38477], [54.95182, 41.92424], [55.45471, 41.25609], [56.00314, 41.32584], [55.97584, 44.99322], [55.97584, 44.99328], [55.97584, 44.99338], [55.97584, 44.99343], [55.97584, 44.99348], [55.97584, 44.99353], [55.97584, 44.99359], [55.97584, 44.99369], [55.97584, 44.99374], [55.97584, 44.99384], [55.97584, 44.9939], [55.97584, 44.994], [55.97584, 44.99405], [55.97584, 44.99415], [55.97584, 44.99421], [55.97584, 44.99426], [55.97584, 44.99431], [55.97584, 44.99436], [55.97584, 44.99441], [55.97594, 44.99446], [55.97605, 44.99452], [55.97605, 44.99457], [55.97605, 44.99462], [55.97605, 44.99467], [55.97605, 44.99477], [55.97615, 44.99477], [55.97615, 44.99483], [55.97615, 44.99493], [55.97615, 44.99498], [55.97615, 44.99503], [55.97615, 44.99508], [55.97625, 44.99514], [55.97636, 44.99519], [55.97636, 44.99524], [55.97646, 44.99529], [55.97646, 44.99534], [55.97656, 44.99539], [55.97667, 44.99545], [55.97677, 44.9955], [55.97677, 44.99555], [55.97677, 44.9956], [55.97687, 44.9956], [55.97698, 44.99565], [55.97698, 44.9957], [55.97708, 44.99576], [55.97718, 44.99581], [55.97729, 44.99586], [55.97739, 44.99586], [55.97739, 44.99591], [55.97749, 44.99591], [55.9776, 44.99591], [55.9777, 44.99596], [55.9777, 44.99601], [55.9778, 44.99607], [55.97791, 44.99607], [55.97801, 44.99607], [55.97801, 44.99612], [55.97811, 44.99617], [55.97822, 44.99617], [55.97832, 44.99622], [55.97842, 44.99622], [58.59711, 45.58671], [61.01475, 44.41383], [62.01711, 43.51008], [63.34656, 43.64003], [64.53885, 43.56941], [64.96464, 43.74748], [65.18666, 43.48835], [65.53277, 43.31856], [65.85194, 42.85481], [66.09482, 42.93426], [66.00546, 41.94455], [66.53302, 41.87388], [66.69129, 41.1311], [67.9644, 41.14611], [67.98511, 41.02794], [68.08273, 41.08148], [68.1271, 41.0324], [67.96736, 40.83798], [68.49983, 40.56437], [68.63, 40.59358], [68.58444, 40.91447], [68.49983, 40.99669], [68.62221, 41.03019], [68.65662, 40.93861], [68.73945, 40.96989], [68.7217, 41.05025], [69.01308, 41.22804], [69.05006, 41.36183], [69.15137, 41.43078], [69.17701, 41.43769], [69.18528, 41.45175], [69.20439, 41.45391], [69.22671, 41.46298], [69.23332, 41.45847], [69.25059, 41.46693], [69.29778, 41.43673], [69.35554, 41.47211], [69.37468, 41.46555], [69.45081, 41.46246], [69.39485, 41.51518], [69.45751, 41.56863], [69.49545, 41.545], [70.94483, 42.26238], [70.85973, 42.30188], [70.97717, 42.50147], [71.15232, 42.60486], [71.17807, 42.67381], [71.22785, 42.69248], [71.2724, 42.77853], [71.53272, 42.8014], [71.62405, 42.76613], [71.88792, 42.83578], [73.44393, 42.43098], [73.50992, 42.82356], [73.55634, 43.03071], [74.22489, 43.24657], [74.57491, 43.13702], [74.64615, 43.05881], [74.70331, 43.02519], [74.75, 42.99029], [74.88756, 42.98612], [75.22619, 42.85528], [75.29966, 42.86183], [75.72174, 42.79672], [75.82823, 42.94848], [78.48469, 42.89649], [78.91502, 42.76839], [79.19763, 42.804], [79.52921, 42.44778], [79.97364, 42.42816], [80.17807, 42.21166], [80.26841, 42.23797], [80.16892, 42.61137], [80.26886, 42.8366], [80.38169, 42.83142], [80.58999, 42.9011], [80.3735, 43.01557], [80.62913, 43.141], [80.78817, 43.14235], [80.77771, 43.30065], [80.69718, 43.32589], [80.75156, 43.44948], [80.40031, 44.10986], [80.40229, 44.23319], [80.38384, 44.63073], [79.8987, 44.89957], [80.11169, 45.03352], [81.73278, 45.3504], [82.51374, 45.1755], [82.58474, 45.40027], [82.21792, 45.56619], [83.04622, 47.19053], [83.92184, 46.98912], [84.73077, 47.01394], [84.93995, 46.87399], [85.22443, 47.04816], [85.54294, 47.06171], [85.69696, 47.2898], [85.61067, 47.49753], [85.5169, 48.05493], [85.73581, 48.3939], [86.38069, 48.46064], [86.75343, 48.70331], [86.73568, 48.99918], [86.87238, 49.12432], [87.28386, 49.11626], [87.31465, 49.23603], [87.03071, 49.25142], [86.82606, 49.51796], [86.61307, 49.60239], [86.79056, 49.74787], [86.63674, 49.80136], [86.18709, 49.50259], [85.24047, 49.60239], [84.99198, 50.06793], [84.29385, 50.27257], [83.8442, 50.87375], [83.14607, 51.00796], [82.55443, 50.75412], [81.94999, 50.79307], [81.46581, 50.77658], [81.41248, 50.97524], [81.06091, 50.94833], [81.16999, 51.15662], [80.80318, 51.28262], [80.44819, 51.20855], [80.4127, 50.95581], [80.08138, 50.77658], [79.11255, 52.01171], [77.90383, 53.29807], [76.54243, 53.99329], [76.44076, 54.16017], [76.82266, 54.1798], [76.91052, 54.4677], [75.3668, 54.07439], [75.43398, 53.98652], [75.07405, 53.80831], [73.39218, 53.44623], [73.25412, 53.61532], [73.68921, 53.86522], [73.74778, 54.07194], [73.37963, 53.96132], [72.71026, 54.1161], [72.43415, 53.92685], [72.17477, 54.36303], [71.96141, 54.17736], [71.10379, 54.13326], [71.08706, 54.33376], [71.24185, 54.64965], [71.08288, 54.71253], [70.96009, 55.10558], [70.76493, 55.3027], [70.19179, 55.1476], [69.74917, 55.35545], [69.34224, 55.36344], [68.90865, 55.38148]]]] } },
      { type: "Feature", properties: { iso1A2: "LA", iso1A3: "LAO", iso1N3: "418", wikidata: "Q819", nameEn: "Laos", groups: ["035", "142", "UN"], callingCodes: ["856"] }, geometry: { type: "MultiPolygon", coordinates: [[[[102.1245, 22.43372], [102.03633, 22.46164], [101.98487, 22.42766], [101.91344, 22.44417], [101.90714, 22.38688], [101.86828, 22.38397], [101.7685, 22.50337], [101.68973, 22.46843], [101.61306, 22.27515], [101.56789, 22.28876], [101.53638, 22.24794], [101.60675, 22.13513], [101.57525, 22.13026], [101.62566, 21.96574], [101.7791, 21.83019], [101.74555, 21.72852], [101.83257, 21.61562], [101.80001, 21.57461], [101.7475, 21.5873], [101.7727, 21.51794], [101.74224, 21.48276], [101.74014, 21.30967], [101.84412, 21.25291], [101.83887, 21.20983], [101.76745, 21.21571], [101.79266, 21.19025], [101.7622, 21.14813], [101.70548, 21.14911], [101.66977, 21.20004], [101.60886, 21.17947], [101.59491, 21.18621], [101.6068, 21.23329], [101.54563, 21.25668], [101.29326, 21.17254], [101.2229, 21.23271], [101.26912, 21.36482], [101.19349, 21.41959], [101.2124, 21.56422], [101.15156, 21.56129], [101.16198, 21.52808], [101.00234, 21.39612], [100.80173, 21.2934], [100.72716, 21.31786], [100.63578, 21.05639], [100.55281, 21.02796], [100.50974, 20.88574], [100.64628, 20.88279], [100.60112, 20.8347], [100.51079, 20.82194], [100.36375, 20.82783], [100.1957, 20.68247], [100.08404, 20.36626], [100.09999, 20.31614], [100.09337, 20.26293], [100.11785, 20.24787], [100.1712, 20.24324], [100.16668, 20.2986], [100.22076, 20.31598], [100.25769, 20.3992], [100.33383, 20.4028], [100.37439, 20.35156], [100.41473, 20.25625], [100.44992, 20.23644], [100.4537, 20.19971], [100.47567, 20.19133], [100.51052, 20.14928], [100.55218, 20.17741], [100.58808, 20.15791], [100.5094, 19.87904], [100.398, 19.75047], [100.49604, 19.53504], [100.58219, 19.49164], [100.64606, 19.55884], [100.77231, 19.48324], [100.90302, 19.61901], [101.08928, 19.59748], [101.26545, 19.59242], [101.26991, 19.48324], [101.21347, 19.46223], [101.20604, 19.35296], [101.24911, 19.33334], [101.261, 19.12717], [101.35606, 19.04716], [101.25803, 18.89545], [101.22832, 18.73377], [101.27585, 18.68875], [101.06047, 18.43247], [101.18227, 18.34367], [101.15108, 18.25624], [101.19118, 18.2125], [101.1793, 18.0544], [101.02185, 17.87637], [100.96541, 17.57926], [101.15108, 17.47586], [101.44667, 17.7392], [101.72294, 17.92867], [101.78087, 18.07559], [101.88485, 18.02474], [102.11359, 18.21532], [102.45523, 17.97106], [102.59234, 17.96127], [102.60971, 17.95411], [102.61432, 17.92273], [102.5896, 17.84889], [102.59485, 17.83537], [102.68194, 17.80151], [102.69946, 17.81686], [102.67543, 17.84529], [102.68538, 17.86653], [102.75954, 17.89561], [102.79044, 17.93612], [102.81988, 17.94233], [102.86323, 17.97531], [102.95812, 18.0054], [102.9912, 17.9949], [103.01998, 17.97095], [103.0566, 18.00144], [103.07823, 18.03833], [103.07343, 18.12351], [103.1493, 18.17799], [103.14994, 18.23172], [103.17093, 18.2618], [103.29757, 18.30475], [103.23818, 18.34875], [103.24779, 18.37807], [103.30977, 18.4341], [103.41044, 18.4486], [103.47773, 18.42841], [103.60957, 18.40528], [103.699, 18.34125], [103.82449, 18.33979], [103.85642, 18.28666], [103.93916, 18.33914], [103.97725, 18.33631], [104.06533, 18.21656], [104.10927, 18.10826], [104.21776, 17.99335], [104.2757, 17.86139], [104.35432, 17.82871], [104.45404, 17.66788], [104.69867, 17.53038], [104.80061, 17.39367], [104.80716, 17.19025], [104.73712, 17.01404], [104.7373, 16.91125], [104.76442, 16.84752], [104.7397, 16.81005], [104.76099, 16.69302], [104.73349, 16.565], [104.88057, 16.37311], [105.00262, 16.25627], [105.06204, 16.09792], [105.42001, 16.00657], [105.38508, 15.987], [105.34115, 15.92737], [105.37959, 15.84074], [105.42285, 15.76971], [105.46573, 15.74742], [105.61756, 15.68792], [105.60446, 15.53301], [105.58191, 15.41031], [105.47635, 15.3796], [105.4692, 15.33709], [105.50662, 15.32054], [105.58043, 15.32724], [105.46661, 15.13132], [105.61162, 15.00037], [105.5121, 14.80802], [105.53864, 14.55731], [105.43783, 14.43865], [105.20894, 14.34967], [105.2759, 14.17496], [105.36775, 14.09948], [105.44869, 14.10703], [105.5561, 14.15684], [105.78338, 14.08438], [105.78182, 14.02247], [105.90791, 13.92881], [106.10405, 13.9137], [106.10094, 13.98471], [106.16632, 14.01794], [106.18656, 14.06324], [106.11962, 14.11307], [106.10872, 14.18401], [106.04801, 14.20363], [106.02311, 14.30623], [105.99509, 14.32734], [106.00131, 14.36957], [106.21302, 14.36203], [106.25194, 14.48415], [106.32355, 14.44043], [106.40916, 14.45249], [106.43874, 14.52032], [106.47766, 14.50977], [106.45898, 14.55045], [106.50723, 14.58963], [106.54148, 14.59565], [106.57106, 14.50525], [106.59908, 14.50977], [106.63333, 14.44194], [106.73762, 14.42687], [106.80767, 14.31226], [106.8497, 14.29416], [106.90574, 14.33639], [106.9649, 14.3198], [106.98825, 14.36806], [107.04585, 14.41782], [107.03962, 14.45099], [107.09722, 14.3937], [107.17038, 14.41782], [107.21241, 14.48716], [107.256, 14.48716], [107.26534, 14.54292], [107.29803, 14.58963], [107.3276, 14.58812], [107.37897, 14.54443], [107.44435, 14.52785], [107.47238, 14.61523], [107.54361, 14.69092], [107.51579, 14.79282], [107.59285, 14.87795], [107.48277, 14.93751], [107.46516, 15.00982], [107.61486, 15.0566], [107.61926, 15.13949], [107.58844, 15.20111], [107.62587, 15.2266], [107.60605, 15.37524], [107.62367, 15.42193], [107.53341, 15.40496], [107.50699, 15.48771], [107.3815, 15.49832], [107.34408, 15.62345], [107.27583, 15.62769], [107.27143, 15.71459], [107.21859, 15.74638], [107.21419, 15.83747], [107.34188, 15.89464], [107.39471, 15.88829], [107.46296, 16.01106], [107.44975, 16.08511], [107.33968, 16.05549], [107.25822, 16.13587], [107.14595, 16.17816], [107.15035, 16.26271], [107.09091, 16.3092], [107.02597, 16.31132], [106.97385, 16.30204], [106.96638, 16.34938], [106.88067, 16.43594], [106.88727, 16.52671], [106.84104, 16.55415], [106.74418, 16.41904], [106.65832, 16.47816], [106.66052, 16.56892], [106.61477, 16.60713], [106.58267, 16.6012], [106.59013, 16.62259], [106.55485, 16.68704], [106.55265, 16.86831], [106.52183, 16.87884], [106.51963, 16.92097], [106.54824, 16.92729], [106.55045, 17.0031], [106.50862, 16.9673], [106.43597, 17.01362], [106.31929, 17.20509], [106.29287, 17.3018], [106.24444, 17.24714], [106.18991, 17.28227], [106.09019, 17.36399], [105.85744, 17.63221], [105.76612, 17.67147], [105.60381, 17.89356], [105.64784, 17.96687], [105.46292, 18.22008], [105.38366, 18.15315], [105.15942, 18.38691], [105.10408, 18.43533], [105.1327, 18.58355], [105.19654, 18.64196], [105.12829, 18.70453], [104.64617, 18.85668], [104.5361, 18.97747], [103.87125, 19.31854], [104.06058, 19.43484], [104.10832, 19.51575], [104.05617, 19.61743], [104.06498, 19.66926], [104.23229, 19.70242], [104.41281, 19.70035], [104.53169, 19.61743], [104.64837, 19.62365], [104.68359, 19.72729], [104.8355, 19.80395], [104.8465, 19.91783], [104.9874, 20.09573], [104.91695, 20.15567], [104.86852, 20.14121], [104.61315, 20.24452], [104.62195, 20.36633], [104.72102, 20.40554], [104.66158, 20.47774], [104.47886, 20.37459], [104.40621, 20.3849], [104.38199, 20.47155], [104.63957, 20.6653], [104.27412, 20.91433], [104.11121, 20.96779], [103.98024, 20.91531], [103.82282, 20.8732], [103.73478, 20.6669], [103.68633, 20.66324], [103.45737, 20.82382], [103.38032, 20.79501], [103.21497, 20.89832], [103.12055, 20.89994], [103.03469, 21.05821], [102.97745, 21.05821], [102.89825, 21.24707], [102.80794, 21.25736], [102.88939, 21.3107], [102.94223, 21.46034], [102.86297, 21.4255], [102.98846, 21.58936], [102.97965, 21.74076], [102.86077, 21.71213], [102.85637, 21.84501], [102.81894, 21.83888], [102.82115, 21.73667], [102.74189, 21.66713], [102.67145, 21.65894], [102.62301, 21.91447], [102.49092, 21.99002], [102.51734, 22.02676], [102.18712, 22.30403], [102.14099, 22.40092], [102.1245, 22.43372]]]] } },
      { type: "Feature", properties: { iso1A2: "LB", iso1A3: "LBN", iso1N3: "422", wikidata: "Q822", nameEn: "Lebanon", aliases: ["RL"], groups: ["145", "142", "UN"], callingCodes: ["961"] }, geometry: { type: "MultiPolygon", coordinates: [[[[35.94816, 33.47886], [35.94465, 33.52774], [36.05723, 33.57904], [35.9341, 33.6596], [36.06778, 33.82927], [36.14517, 33.85118], [36.3967, 33.83365], [36.38263, 33.86579], [36.28589, 33.91981], [36.41078, 34.05253], [36.50576, 34.05982], [36.5128, 34.09916], [36.62537, 34.20251], [36.59195, 34.2316], [36.58667, 34.27667], [36.60778, 34.31009], [36.56556, 34.31881], [36.53039, 34.3798], [36.55853, 34.41609], [36.46179, 34.46541], [36.4442, 34.50165], [36.34745, 34.5002], [36.3369, 34.52629], [36.39846, 34.55672], [36.41429, 34.61175], [36.45299, 34.59438], [36.46003, 34.6378], [36.42941, 34.62505], [36.35384, 34.65447], [36.35135, 34.68516], [36.32399, 34.69334], [36.29165, 34.62991], [35.98718, 34.64977], [35.97386, 34.63322], [35.48515, 34.70851], [34.78515, 33.20368], [35.10645, 33.09318], [35.1924, 33.08743], [35.31429, 33.10515], [35.35223, 33.05617], [35.43059, 33.06659], [35.448, 33.09264], [35.50272, 33.09056], [35.50335, 33.114], [35.52573, 33.11921], [35.54228, 33.19865], [35.5362, 33.23196], [35.54808, 33.236], [35.54544, 33.25513], [35.55555, 33.25844], [35.56523, 33.28969], [35.58326, 33.28381], [35.58502, 33.26653], [35.62283, 33.24226], [35.62019, 33.27278], [35.77477, 33.33609], [35.81324, 33.36354], [35.82577, 33.40479], [35.88668, 33.43183], [35.94816, 33.47886]]]] } },
      { type: "Feature", properties: { iso1A2: "LC", iso1A3: "LCA", iso1N3: "662", wikidata: "Q760", nameEn: "St. Lucia", aliases: ["WL"], groups: ["029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 758"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-59.95997, 14.20285], [-61.69315, 14.26451], [-59.94058, 12.34011], [-59.95997, 14.20285]]]] } },
      { type: "Feature", properties: { iso1A2: "LI", iso1A3: "LIE", iso1N3: "438", wikidata: "Q347", nameEn: "Liechtenstein", aliases: ["FL"], groups: ["155", "150", "UN"], callingCodes: ["423"] }, geometry: { type: "MultiPolygon", coordinates: [[[[9.60717, 47.06091], [9.61216, 47.07732], [9.63395, 47.08443], [9.62623, 47.14685], [9.56539, 47.17124], [9.58264, 47.20673], [9.56981, 47.21926], [9.55176, 47.22585], [9.56766, 47.24281], [9.53116, 47.27029], [9.52406, 47.24959], [9.50318, 47.22153], [9.4891, 47.19346], [9.48774, 47.17402], [9.51044, 47.13727], [9.52089, 47.10019], [9.51362, 47.08505], [9.47139, 47.06402], [9.47548, 47.05257], [9.54041, 47.06495], [9.55721, 47.04762], [9.60717, 47.06091]]]] } },
      { type: "Feature", properties: { iso1A2: "LK", iso1A3: "LKA", iso1N3: "144", wikidata: "Q854", nameEn: "Sri Lanka", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["94"] }, geometry: { type: "MultiPolygon", coordinates: [[[[76.59015, 5.591], [85.15017, 5.21497], [80.48418, 10.20786], [79.42124, 9.80115], [79.50447, 8.91876], [76.59015, 5.591]]]] } },
      { type: "Feature", properties: { iso1A2: "LR", iso1A3: "LBR", iso1N3: "430", wikidata: "Q1014", nameEn: "Liberia", groups: ["011", "202", "002", "UN"], callingCodes: ["231"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-8.47114, 7.55676], [-8.55874, 7.62525], [-8.55874, 7.70167], [-8.67814, 7.69428], [-8.72789, 7.51429], [-8.8448, 7.35149], [-8.85724, 7.26019], [-8.93435, 7.2824], [-9.09107, 7.1985], [-9.18311, 7.30461], [-9.20798, 7.38109], [-9.305, 7.42056], [-9.41943, 7.41809], [-9.48161, 7.37122], [-9.37465, 7.62032], [-9.35724, 7.74111], [-9.44928, 7.9284], [-9.41445, 8.02448], [-9.50898, 8.18455], [-9.47415, 8.35195], [-9.77763, 8.54633], [-10.05873, 8.42578], [-10.05375, 8.50697], [-10.14579, 8.52665], [-10.203, 8.47991], [-10.27575, 8.48711], [-10.30084, 8.30008], [-10.31635, 8.28554], [-10.29839, 8.21283], [-10.35227, 8.15223], [-10.45023, 8.15627], [-10.51554, 8.1393], [-10.57523, 8.04829], [-10.60492, 8.04072], [-10.60422, 7.7739], [-11.29417, 7.21576], [-11.4027, 6.97746], [-11.50429, 6.92704], [-12.15048, 6.15992], [-7.52774, 3.7105], [-7.53259, 4.35145], [-7.59349, 4.8909], [-7.53876, 4.94294], [-7.55369, 5.08667], [-7.48901, 5.14118], [-7.46165, 5.26256], [-7.36463, 5.32944], [-7.43428, 5.42355], [-7.37209, 5.61173], [-7.43926, 5.74787], [-7.43677, 5.84687], [-7.46165, 5.84934], [-7.48155, 5.80974], [-7.67309, 5.94337], [-7.70294, 5.90625], [-7.78254, 5.99037], [-7.79747, 6.07696], [-7.8497, 6.08932], [-7.83478, 6.20309], [-7.90692, 6.27728], [-8.00642, 6.31684], [-8.17557, 6.28222], [-8.3298, 6.36381], [-8.38453, 6.35887], [-8.45666, 6.49977], [-8.48652, 6.43797], [-8.59456, 6.50612], [-8.31736, 6.82837], [-8.29249, 7.1691], [-8.37458, 7.25794], [-8.41935, 7.51203], [-8.47114, 7.55676]]]] } },
      { type: "Feature", properties: { iso1A2: "LS", iso1A3: "LSO", iso1N3: "426", wikidata: "Q1013", nameEn: "Lesotho", groups: ["018", "202", "002", "UN"], driveSide: "left", callingCodes: ["266"] }, geometry: { type: "MultiPolygon", coordinates: [[[[29.33204, -29.45598], [29.44883, -29.3772], [29.40524, -29.21246], [28.68043, -28.58744], [28.65091, -28.57025], [28.40612, -28.6215], [28.30518, -28.69531], [28.2348, -28.69471], [28.1317, -28.7293], [28.02503, -28.85991], [27.98675, -28.8787], [27.9392, -28.84864], [27.88933, -28.88156], [27.8907, -28.91612], [27.75458, -28.89839], [27.55974, -29.18954], [27.5158, -29.2261], [27.54258, -29.25575], [27.48679, -29.29349], [27.45125, -29.29708], [27.47254, -29.31968], [27.4358, -29.33465], [27.33464, -29.48161], [27.01016, -29.65439], [27.09489, -29.72796], [27.22719, -30.00718], [27.29603, -30.05473], [27.32555, -30.14785], [27.40778, -30.14577], [27.37293, -30.19401], [27.36649, -30.27246], [27.38108, -30.33456], [27.45452, -30.32239], [27.56901, -30.42504], [27.56781, -30.44562], [27.62137, -30.50509], [27.6521, -30.51707], [27.67819, -30.53437], [27.69467, -30.55862], [27.74814, -30.60635], [28.12073, -30.68072], [28.2319, -30.28476], [28.399, -30.1592], [28.68627, -30.12885], [28.80222, -30.10579], [28.9338, -30.05072], [29.16548, -29.91706], [29.12553, -29.76266], [29.28545, -29.58456], [29.33204, -29.45598]]]] } },
      { type: "Feature", properties: { iso1A2: "LT", iso1A3: "LTU", iso1N3: "440", wikidata: "Q37", nameEn: "Lithuania", groups: ["EU", "154", "150", "UN"], callingCodes: ["370"] }, geometry: { type: "MultiPolygon", coordinates: [[[[24.89005, 56.46666], [24.83686, 56.41565], [24.70022, 56.40483], [24.57353, 56.31525], [24.58143, 56.29125], [24.42746, 56.26522], [24.32334, 56.30226], [24.13139, 56.24881], [24.02657, 56.3231], [23.75726, 56.37282], [23.49803, 56.34307], [23.40486, 56.37689], [23.31606, 56.3827], [23.17312, 56.36795], [23.09531, 56.30511], [22.96988, 56.41213], [22.83048, 56.367], [22.69354, 56.36284], [22.56441, 56.39305], [22.3361, 56.4016], [22.09728, 56.42851], [22.00548, 56.41508], [21.74558, 56.33181], [21.57888, 56.31406], [21.49736, 56.29106], [21.24644, 56.16917], [21.15016, 56.07818], [20.68447, 56.04073], [20.60454, 55.40986], [20.95181, 55.27994], [21.26425, 55.24456], [21.35465, 55.28427], [21.38446, 55.29348], [21.46766, 55.21115], [21.51095, 55.18507], [21.55605, 55.20311], [21.64954, 55.1791], [21.85521, 55.09493], [21.96505, 55.07353], [21.99543, 55.08691], [22.03984, 55.07888], [22.02582, 55.05078], [22.06087, 55.02935], [22.11697, 55.02131], [22.14267, 55.05345], [22.31562, 55.0655], [22.47688, 55.04408], [22.58907, 55.07085], [22.60075, 55.01863], [22.65451, 54.97037], [22.68723, 54.9811], [22.76422, 54.92521], [22.85083, 54.88711], [22.87317, 54.79492], [22.73631, 54.72952], [22.73397, 54.66604], [22.75467, 54.6483], [22.74225, 54.64339], [22.7522, 54.63525], [22.68021, 54.58486], [22.71293, 54.56454], [22.67788, 54.532], [22.70208, 54.45312], [22.7253, 54.41732], [22.79705, 54.36264], [22.83756, 54.40827], [23.00584, 54.38514], [22.99649, 54.35927], [23.05726, 54.34565], [23.04323, 54.31567], [23.104, 54.29794], [23.13905, 54.31567], [23.15526, 54.31076], [23.15938, 54.29894], [23.24656, 54.25701], [23.3494, 54.25155], [23.39525, 54.21672], [23.42418, 54.17911], [23.45223, 54.17775], [23.49196, 54.14764], [23.52702, 54.04622], [23.48261, 53.98855], [23.51284, 53.95052], [23.61677, 53.92691], [23.71726, 53.93379], [23.80543, 53.89558], [23.81309, 53.94205], [23.95098, 53.9613], [23.98837, 53.92554], [24.19638, 53.96405], [24.34128, 53.90076], [24.44411, 53.90076], [24.62275, 54.00217], [24.69652, 54.01901], [24.69185, 53.96543], [24.74279, 53.96663], [24.85311, 54.02862], [24.77131, 54.11091], [24.96894, 54.17589], [24.991, 54.14241], [25.0728, 54.13419], [25.19199, 54.219], [25.22705, 54.26271], [25.35559, 54.26544], [25.509, 54.30267], [25.56823, 54.25212], [25.51452, 54.17799], [25.54724, 54.14925], [25.64875, 54.1259], [25.71084, 54.16704], [25.78563, 54.15747], [25.78553, 54.23327], [25.68513, 54.31727], [25.55425, 54.31591], [25.5376, 54.33158], [25.63371, 54.42075], [25.62203, 54.4656], [25.64813, 54.48704], [25.68045, 54.5321], [25.75977, 54.57252], [25.74122, 54.80108], [25.89462, 54.93438], [25.99129, 54.95705], [26.05907, 54.94631], [26.13386, 54.98924], [26.20397, 54.99729], [26.26941, 55.08032], [26.23202, 55.10439], [26.30628, 55.12536], [26.35121, 55.1525], [26.46249, 55.12814], [26.51481, 55.16051], [26.54753, 55.14181], [26.69243, 55.16718], [26.68075, 55.19787], [26.72983, 55.21788], [26.73017, 55.24226], [26.835, 55.28182], [26.83266, 55.30444], [26.80929, 55.31642], [26.6714, 55.33902], [26.5709, 55.32572], [26.44937, 55.34832], [26.5522, 55.40277], [26.55094, 55.5093], [26.63167, 55.57887], [26.63231, 55.67968], [26.58248, 55.6754], [26.46661, 55.70375], [26.39561, 55.71156], [26.18509, 55.86813], [26.03815, 55.95884], [25.90047, 56.0013], [25.85893, 56.00188], [25.81773, 56.05444], [25.69246, 56.08892], [25.68588, 56.14725], [25.53621, 56.16663], [25.39751, 56.15707], [25.23099, 56.19147], [25.09325, 56.1878], [25.05762, 56.26742], [24.89005, 56.46666]]]] } },
      { type: "Feature", properties: { iso1A2: "LU", iso1A3: "LUX", iso1N3: "442", wikidata: "Q32", nameEn: "Luxembourg", groups: ["EU", "155", "150", "UN"], callingCodes: ["352"] }, geometry: { type: "MultiPolygon", coordinates: [[[[6.1379, 50.12964], [6.1137, 50.13668], [6.12028, 50.16374], [6.08577, 50.17246], [6.06406, 50.15344], [6.03093, 50.16362], [6.02488, 50.18283], [5.96453, 50.17259], [5.95929, 50.13295], [5.89488, 50.11476], [5.8857, 50.07824], [5.85474, 50.06342], [5.86904, 50.04614], [5.8551, 50.02683], [5.81866, 50.01286], [5.82331, 49.99662], [5.83968, 49.9892], [5.83467, 49.97823], [5.81163, 49.97142], [5.80833, 49.96451], [5.77291, 49.96056], [5.77314, 49.93646], [5.73621, 49.89796], [5.78415, 49.87922], [5.75269, 49.8711], [5.75861, 49.85631], [5.74567, 49.85368], [5.75884, 49.84811], [5.74953, 49.84709], [5.74975, 49.83933], [5.74076, 49.83823], [5.7404, 49.83452], [5.74844, 49.82435], [5.74364, 49.82058], [5.74953, 49.81428], [5.75409, 49.79239], [5.78871, 49.7962], [5.82245, 49.75048], [5.83149, 49.74729], [5.82562, 49.72395], [5.84193, 49.72161], [5.86503, 49.72739], [5.88677, 49.70951], [5.86527, 49.69291], [5.86175, 49.67862], [5.9069, 49.66377], [5.90164, 49.6511], [5.90599, 49.63853], [5.88552, 49.63507], [5.88393, 49.62802], [5.87609, 49.62047], [5.8762, 49.60898], [5.84826, 49.5969], [5.84971, 49.58674], [5.86986, 49.58756], [5.87256, 49.57539], [5.8424, 49.56082], [5.84692, 49.55663], [5.84143, 49.5533], [5.81838, 49.54777], [5.80871, 49.5425], [5.81664, 49.53775], [5.83648, 49.5425], [5.84466, 49.53027], [5.83467, 49.52717], [5.83389, 49.52152], [5.86571, 49.50015], [5.94128, 49.50034], [5.94224, 49.49608], [5.96876, 49.49053], [5.97693, 49.45513], [6.02648, 49.45451], [6.02743, 49.44845], [6.04176, 49.44801], [6.05553, 49.46663], [6.07887, 49.46399], [6.08373, 49.45594], [6.10072, 49.45268], [6.09845, 49.46351], [6.10325, 49.4707], [6.12346, 49.4735], [6.12814, 49.49365], [6.14321, 49.48796], [6.16115, 49.49297], [6.15366, 49.50226], [6.17386, 49.50934], [6.19543, 49.50536], [6.2409, 49.51408], [6.25029, 49.50609], [6.27875, 49.503], [6.28818, 49.48465], [6.3687, 49.4593], [6.36778, 49.46937], [6.36907, 49.48931], [6.36788, 49.50377], [6.35666, 49.52931], [6.38072, 49.55171], [6.38228, 49.55855], [6.35825, 49.57053], [6.36676, 49.57813], [6.38024, 49.57593], [6.38342, 49.5799], [6.37464, 49.58886], [6.385, 49.59946], [6.39822, 49.60081], [6.41861, 49.61723], [6.4413, 49.65722], [6.43768, 49.66021], [6.42726, 49.66078], [6.42937, 49.66857], [6.44654, 49.67799], [6.46048, 49.69092], [6.48014, 49.69767], [6.49785, 49.71118], [6.50647, 49.71353], [6.5042, 49.71808], [6.49694, 49.72205], [6.49535, 49.72645], [6.50261, 49.72718], [6.51397, 49.72058], [6.51805, 49.72425], [6.50193, 49.73291], [6.50174, 49.75292], [6.51646, 49.75961], [6.51828, 49.76855], [6.51056, 49.77515], [6.51669, 49.78336], [6.50534, 49.78952], [6.52169, 49.79787], [6.53122, 49.80666], [6.52121, 49.81338], [6.51215, 49.80124], [6.50647, 49.80916], [6.48718, 49.81267], [6.47111, 49.82263], [6.45425, 49.81164], [6.44131, 49.81443], [6.42905, 49.81091], [6.42521, 49.81591], [6.40022, 49.82029], [6.36576, 49.85032], [6.34267, 49.84974], [6.33585, 49.83785], [6.32098, 49.83728], [6.32303, 49.85133], [6.30963, 49.87021], [6.29692, 49.86685], [6.28874, 49.87592], [6.26146, 49.88203], [6.23496, 49.89972], [6.22926, 49.92096], [6.21882, 49.92403], [6.22608, 49.929], [6.22094, 49.94955], [6.19856, 49.95053], [6.19089, 49.96991], [6.18045, 49.96611], [6.18554, 49.95622], [6.17872, 49.9537], [6.16466, 49.97086], [6.1701, 49.98518], [6.14147, 49.99563], [6.14948, 50.00908], [6.13806, 50.01056], [6.1295, 50.01849], [6.13273, 50.02019], [6.13794, 50.01466], [6.14666, 50.02207], [6.13044, 50.02929], [6.13458, 50.04141], [6.11274, 50.05916], [6.12055, 50.09171], [6.1379, 50.12964]]]] } },
      { type: "Feature", properties: { iso1A2: "LV", iso1A3: "LVA", iso1N3: "428", wikidata: "Q211", nameEn: "Latvia", groups: ["EU", "154", "150", "UN"], callingCodes: ["371"] }, geometry: { type: "MultiPolygon", coordinates: [[[[27.34698, 57.52242], [26.90364, 57.62823], [26.54675, 57.51813], [26.46527, 57.56885], [26.29253, 57.59244], [26.1866, 57.6849], [26.2029, 57.7206], [26.08098, 57.76619], [26.0543, 57.76105], [26.03332, 57.7718], [26.02415, 57.76865], [26.02069, 57.77169], [26.0266, 57.77441], [26.027, 57.78158], [26.02456, 57.78342], [26.0324, 57.79037], [26.05949, 57.84744], [25.73499, 57.90193], [25.29581, 58.08288], [25.28237, 57.98539], [25.19484, 58.0831], [24.3579, 57.87471], [24.26221, 57.91787], [23.20055, 57.56697], [22.80496, 57.87798], [19.84909, 57.57876], [19.64795, 57.06466], [20.68447, 56.04073], [21.15016, 56.07818], [21.24644, 56.16917], [21.49736, 56.29106], [21.57888, 56.31406], [21.74558, 56.33181], [22.00548, 56.41508], [22.09728, 56.42851], [22.3361, 56.4016], [22.56441, 56.39305], [22.69354, 56.36284], [22.83048, 56.367], [22.96988, 56.41213], [23.09531, 56.30511], [23.17312, 56.36795], [23.31606, 56.3827], [23.40486, 56.37689], [23.49803, 56.34307], [23.75726, 56.37282], [24.02657, 56.3231], [24.13139, 56.24881], [24.32334, 56.30226], [24.42746, 56.26522], [24.58143, 56.29125], [24.57353, 56.31525], [24.70022, 56.40483], [24.83686, 56.41565], [24.89005, 56.46666], [25.05762, 56.26742], [25.09325, 56.1878], [25.23099, 56.19147], [25.39751, 56.15707], [25.53621, 56.16663], [25.68588, 56.14725], [25.69246, 56.08892], [25.81773, 56.05444], [25.85893, 56.00188], [25.90047, 56.0013], [26.03815, 55.95884], [26.18509, 55.86813], [26.39561, 55.71156], [26.46661, 55.70375], [26.58248, 55.6754], [26.63231, 55.67968], [26.64888, 55.70515], [26.71802, 55.70645], [26.76872, 55.67658], [26.87448, 55.7172], [26.97153, 55.8102], [27.1559, 55.85032], [27.27804, 55.78299], [27.3541, 55.8089], [27.61683, 55.78558], [27.63065, 55.89687], [27.97865, 56.11849], [28.15217, 56.16964], [28.23716, 56.27588], [28.16599, 56.37806], [28.19057, 56.44637], [28.10069, 56.524], [28.13526, 56.57989], [28.04768, 56.59004], [27.86101, 56.88204], [27.66511, 56.83921], [27.86101, 57.29402], [27.52453, 57.42826], [27.56832, 57.53728], [27.34698, 57.52242]]]] } },
      { type: "Feature", properties: { iso1A2: "LY", iso1A3: "LBY", iso1N3: "434", wikidata: "Q1016", nameEn: "Libya", groups: ["015", "002", "UN"], callingCodes: ["218"] }, geometry: { type: "MultiPolygon", coordinates: [[[[26.92891, 33.39516], [11.58941, 33.36891], [11.55852, 33.1409], [11.51549, 33.09826], [11.46037, 32.6307], [11.57828, 32.48013], [11.53898, 32.4138], [11.04234, 32.2145], [10.7315, 31.97235], [10.62788, 31.96629], [10.48497, 31.72956], [10.31364, 31.72648], [10.12239, 31.42098], [10.29516, 30.90337], [9.88152, 30.34074], [9.76848, 30.34366], [9.55544, 30.23971], [9.3876, 30.16738], [9.78136, 29.40961], [9.89569, 26.57696], [9.51696, 26.39148], [9.38834, 26.19288], [10.03146, 25.35635], [10.02432, 24.98124], [10.33159, 24.5465], [10.85323, 24.5595], [11.41061, 24.21456], [11.62498, 24.26669], [11.96886, 23.51735], [13.5631, 23.16574], [14.22918, 22.61719], [14.99751, 23.00539], [15.99566, 23.49639], [23.99539, 19.49944], [23.99715, 20.00038], [24.99794, 19.99661], [24.99885, 21.99535], [24.99968, 29.24574], [24.71117, 30.17441], [25.01077, 30.73861], [24.8458, 31.39877], [26.92891, 33.39516]]]] } },
      { type: "Feature", properties: { iso1A2: "MA", iso1A3: "MAR", iso1N3: "504", wikidata: "Q1028", nameEn: "Morocco", groups: ["015", "002", "UN"], callingCodes: ["212"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-2.27707, 35.35051], [-5.10878, 36.05227], [-7.2725, 35.73269], [-14.43883, 27.02969], [-17.27295, 21.93519], [-17.21511, 21.34226], [-17.02707, 21.34022], [-16.9978, 21.36239], [-16.44269, 21.39745], [-14.78487, 21.36587], [-14.47329, 21.63839], [-14.48112, 22.00886], [-14.1291, 22.41636], [-14.10361, 22.75501], [-13.75627, 23.77231], [-13.00628, 24.01923], [-12.92147, 24.39502], [-12.12281, 25.13682], [-12.06001, 26.04442], [-11.62052, 26.05229], [-11.38635, 26.611], [-11.23622, 26.72023], [-11.35695, 26.8505], [-10.68417, 26.90984], [-9.81998, 26.71379], [-9.56957, 26.90042], [-9.08698, 26.98639], [-8.71787, 26.9898], [-8.77527, 27.66663], [-8.66879, 27.6666], [-8.6715, 28.71194], [-7.61585, 29.36252], [-6.95824, 29.50924], [-6.78351, 29.44634], [-6.69965, 29.51623], [-5.75616, 29.61407], [-5.72121, 29.52322], [-5.58831, 29.48103], [-5.21671, 29.95253], [-4.6058, 30.28343], [-4.31774, 30.53229], [-3.64735, 30.67539], [-3.65418, 30.85566], [-3.54944, 31.0503], [-3.77103, 31.14984], [-3.77647, 31.31912], [-3.66386, 31.39202], [-3.66314, 31.6339], [-2.82784, 31.79459], [-2.93873, 32.06557], [-2.46166, 32.16603], [-1.22829, 32.07832], [-1.15735, 32.12096], [-1.24453, 32.1917], [-1.24998, 32.32993], [-0.9912, 32.52467], [-1.37794, 32.73628], [-1.54244, 32.95499], [-1.46249, 33.0499], [-1.67067, 33.27084], [-1.59508, 33.59929], [-1.73494, 33.71721], [-1.64666, 34.10405], [-1.78042, 34.39018], [-1.69788, 34.48056], [-1.84569, 34.61907], [-1.73707, 34.74226], [-1.97469, 34.886], [-1.97833, 34.93218], [-2.04734, 34.93218], [-2.21445, 35.04378], [-2.21248, 35.08532], [-2.27707, 35.35051]], [[-2.91909, 35.33927], [-2.92272, 35.27509], [-2.93893, 35.26737], [-2.95065, 35.26576], [-2.95431, 35.2728], [-2.96516, 35.27967], [-2.96826, 35.28296], [-2.96507, 35.28801], [-2.97035, 35.28852], [-2.96978, 35.29459], [-2.96648, 35.30475], [-2.96038, 35.31609], [-2.91909, 35.33927]], [[-3.90602, 35.21494], [-3.89343, 35.22728], [-3.88372, 35.20767], [-3.90602, 35.21494]], [[-4.30191, 35.17419], [-4.29436, 35.17149], [-4.30112, 35.17058], [-4.30191, 35.17419]], [[-2.40316, 35.16893], [-2.45965, 35.16527], [-2.43262, 35.20652], [-2.40316, 35.16893]], [[-5.38491, 35.92591], [-5.21179, 35.90091], [-5.34379, 35.8711], [-5.35844, 35.87375], [-5.37338, 35.88417], [-5.38491, 35.92591]]]] } },
      { type: "Feature", properties: { iso1A2: "MC", iso1A3: "MCO", iso1N3: "492", wikidata: "Q235", nameEn: "Monaco", groups: ["155", "150", "UN"], callingCodes: ["377"] }, geometry: { type: "MultiPolygon", coordinates: [[[[7.47823, 43.73341], [7.4379, 43.74963], [7.4389, 43.75151], [7.43708, 43.75197], [7.43624, 43.75014], [7.43013, 43.74895], [7.42809, 43.74396], [7.42443, 43.74087], [7.42299, 43.74176], [7.42062, 43.73977], [7.41233, 43.73439], [7.41298, 43.73311], [7.41291, 43.73168], [7.41113, 43.73156], [7.40903, 43.7296], [7.42422, 43.72209], [7.47823, 43.73341]]]] } },
      { type: "Feature", properties: { iso1A2: "MD", iso1A3: "MDA", iso1N3: "498", wikidata: "Q217", nameEn: "Moldova", groups: ["151", "150", "UN"], callingCodes: ["373"] }, geometry: { type: "MultiPolygon", coordinates: [[[[27.74422, 48.45926], [27.6658, 48.44034], [27.59027, 48.46311], [27.5889, 48.49224], [27.46942, 48.454], [27.44333, 48.41209], [27.37741, 48.41026], [27.37604, 48.44398], [27.32159, 48.4434], [27.27855, 48.37534], [27.13434, 48.37288], [27.08078, 48.43214], [27.0231, 48.42485], [27.03821, 48.37653], [26.93384, 48.36558], [26.85556, 48.41095], [26.71274, 48.40388], [26.82809, 48.31629], [26.79239, 48.29071], [26.6839, 48.35828], [26.62823, 48.25804], [26.81161, 48.25049], [26.87708, 48.19919], [26.94265, 48.1969], [26.98042, 48.15752], [26.96119, 48.13003], [27.04118, 48.12522], [27.02985, 48.09083], [27.15622, 47.98538], [27.1618, 47.92391], [27.29069, 47.73722], [27.25519, 47.71366], [27.32202, 47.64009], [27.3979, 47.59473], [27.47942, 47.48113], [27.55731, 47.46637], [27.60263, 47.32507], [27.68706, 47.28962], [27.73172, 47.29248], [27.81892, 47.1381], [28.09095, 46.97621], [28.12173, 46.82283], [28.24808, 46.64305], [28.22281, 46.50481], [28.25769, 46.43334], [28.18902, 46.35283], [28.19864, 46.31869], [28.10937, 46.22852], [28.13684, 46.18099], [28.08612, 46.01105], [28.13111, 45.92819], [28.16568, 45.6421], [28.08927, 45.6051], [28.18741, 45.47358], [28.21139, 45.46895], [28.30201, 45.54744], [28.41836, 45.51715], [28.43072, 45.48538], [28.51449, 45.49982], [28.49252, 45.56716], [28.54196, 45.58062], [28.51587, 45.6613], [28.47879, 45.66994], [28.52823, 45.73803], [28.70401, 45.78019], [28.69852, 45.81753], [28.78503, 45.83475], [28.74383, 45.96664], [28.98004, 46.00385], [29.00613, 46.04962], [28.94643, 46.09176], [29.06656, 46.19716], [28.94953, 46.25852], [28.98478, 46.31803], [29.004, 46.31495], [28.9306, 46.45699], [29.01241, 46.46177], [29.02409, 46.49582], [29.23547, 46.55435], [29.24886, 46.37912], [29.35357, 46.49505], [29.49914, 46.45889], [29.5939, 46.35472], [29.6763, 46.36041], [29.66359, 46.4215], [29.74496, 46.45605], [29.88329, 46.35851], [29.94114, 46.40114], [30.09103, 46.38694], [30.16794, 46.40967], [30.02511, 46.45132], [29.88916, 46.54302], [29.94409, 46.56002], [29.9743, 46.75325], [29.94522, 46.80055], [29.98814, 46.82358], [29.87405, 46.88199], [29.75458, 46.8604], [29.72986, 46.92234], [29.57056, 46.94766], [29.62137, 47.05069], [29.61038, 47.09932], [29.53044, 47.07851], [29.49732, 47.12878], [29.57696, 47.13581], [29.54996, 47.24962], [29.59665, 47.25521], [29.5733, 47.36508], [29.48678, 47.36043], [29.47854, 47.30366], [29.39889, 47.30179], [29.3261, 47.44664], [29.18603, 47.43387], [29.11743, 47.55001], [29.22414, 47.60012], [29.22242, 47.73607], [29.27255, 47.79953], [29.20663, 47.80367], [29.27804, 47.88893], [29.19839, 47.89261], [29.1723, 47.99013], [28.9306, 47.96255], [28.8414, 48.03392], [28.85232, 48.12506], [28.69896, 48.13106], [28.53921, 48.17453], [28.48428, 48.0737], [28.42454, 48.12047], [28.43701, 48.15832], [28.38712, 48.17567], [28.34009, 48.13147], [28.30609, 48.14018], [28.30586, 48.1597], [28.34912, 48.1787], [28.36996, 48.20543], [28.35519, 48.24957], [28.32508, 48.23384], [28.2856, 48.23202], [28.19314, 48.20749], [28.17666, 48.25963], [28.07504, 48.23494], [28.09873, 48.3124], [28.04527, 48.32661], [27.95883, 48.32368], [27.88391, 48.36699], [27.87533, 48.4037], [27.81902, 48.41874], [27.79225, 48.44244], [27.74422, 48.45926]]]] } },
      { type: "Feature", properties: { iso1A2: "ME", iso1A3: "MNE", iso1N3: "499", wikidata: "Q236", nameEn: "Montenegro", groups: ["039", "150", "UN"], callingCodes: ["382"] }, geometry: { type: "MultiPolygon", coordinates: [[[[19.22807, 43.5264], [19.15685, 43.53943], [19.13933, 43.5282], [19.04934, 43.50384], [19.01078, 43.55806], [18.91379, 43.50299], [18.95469, 43.49367], [18.96053, 43.45042], [19.01078, 43.43854], [19.04071, 43.397], [19.08673, 43.31453], [19.08206, 43.29668], [19.04233, 43.30008], [19.00844, 43.24988], [18.95001, 43.29327], [18.95819, 43.32899], [18.90911, 43.36383], [18.83912, 43.34795], [18.84794, 43.33735], [18.85342, 43.32426], [18.76538, 43.29838], [18.6976, 43.25243], [18.71747, 43.2286], [18.66605, 43.2056], [18.64735, 43.14766], [18.66254, 43.03928], [18.52232, 43.01451], [18.49076, 42.95553], [18.49661, 42.89306], [18.4935, 42.86433], [18.47633, 42.85829], [18.45921, 42.81682], [18.47324, 42.74992], [18.56789, 42.72074], [18.55221, 42.69045], [18.54603, 42.69171], [18.54841, 42.68328], [18.57373, 42.64429], [18.52232, 42.62279], [18.55504, 42.58409], [18.53751, 42.57376], [18.49778, 42.58409], [18.43735, 42.55921], [18.44307, 42.51077], [18.43588, 42.48556], [18.52152, 42.42302], [18.54128, 42.39171], [18.45131, 42.21682], [19.26406, 41.74971], [19.37597, 41.84849], [19.37451, 41.8842], [19.33812, 41.90669], [19.34601, 41.95675], [19.37691, 41.96977], [19.36867, 42.02564], [19.37548, 42.06835], [19.40687, 42.10024], [19.28623, 42.17745], [19.42, 42.33019], [19.42352, 42.36546], [19.4836, 42.40831], [19.65972, 42.62774], [19.73244, 42.66299], [19.77375, 42.58517], [19.74731, 42.57422], [19.76549, 42.50237], [19.82333, 42.46581], [19.9324, 42.51699], [20.00842, 42.5109], [20.01834, 42.54622], [20.07761, 42.55582], [20.0969, 42.65559], [20.02915, 42.71147], [20.02088, 42.74789], [20.04898, 42.77701], [20.2539, 42.76245], [20.27869, 42.81945], [20.35692, 42.8335], [20.34528, 42.90676], [20.16415, 42.97177], [20.14896, 42.99058], [20.12325, 42.96237], [20.05431, 42.99571], [20.04729, 43.02732], [19.98887, 43.0538], [19.96549, 43.11098], [19.92576, 43.08539], [19.79255, 43.11951], [19.76918, 43.16044], [19.64063, 43.19027], [19.62661, 43.2286], [19.54598, 43.25158], [19.52962, 43.31623], [19.48171, 43.32644], [19.44315, 43.38846], [19.22229, 43.47926], [19.22807, 43.5264]]]] } },
      { type: "Feature", properties: { iso1A2: "MF", iso1A3: "MAF", iso1N3: "663", wikidata: "Q126125", nameEn: "Saint-Martin", country: "FR", groups: ["Q3320166", "EU", "029", "003", "419", "019", "UN"], callingCodes: ["590"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-62.93924, 18.02904], [-62.62718, 18.26185], [-63.35989, 18.06012], [-63.33064, 17.9615], [-63.13502, 18.05445], [-63.11042, 18.05339], [-63.09686, 18.04608], [-63.07759, 18.04943], [-63.0579, 18.06614], [-63.04039, 18.05619], [-63.02323, 18.05757], [-62.93924, 18.02904]]]] } },
      { type: "Feature", properties: { iso1A2: "MG", iso1A3: "MDG", iso1N3: "450", wikidata: "Q1019", nameEn: "Madagascar", aliases: ["RM"], groups: ["014", "202", "002", "UN"], callingCodes: ["261"] }, geometry: { type: "MultiPolygon", coordinates: [[[[51.93891, -10.85085], [45.84651, -12.77177], [42.14681, -19.63341], [45.80092, -33.00974], [51.93891, -10.85085]]]] } },
      { type: "Feature", properties: { iso1A2: "MH", iso1A3: "MHL", iso1N3: "584", wikidata: "Q709", nameEn: "Marshall Islands", groups: ["057", "009", "UN"], roadSpeedUnit: "mph", callingCodes: ["692"] }, geometry: { type: "MultiPolygon", coordinates: [[[[169, 3.9], [173.53711, 5.70687], [169.29099, 15.77133], [159.04653, 10.59067], [169, 3.9]]]] } },
      { type: "Feature", properties: { iso1A2: "MK", iso1A3: "MKD", iso1N3: "807", wikidata: "Q221", nameEn: "North Macedonia", groups: ["039", "150", "UN"], callingCodes: ["389"] }, geometry: { type: "MultiPolygon", coordinates: [[[[22.34773, 42.31725], [22.29275, 42.34913], [22.29605, 42.37477], [22.16384, 42.32103], [22.02908, 42.29848], [21.94405, 42.34669], [21.91595, 42.30392], [21.84654, 42.3247], [21.77176, 42.2648], [21.70111, 42.23789], [21.58992, 42.25915], [21.52145, 42.24465], [21.50823, 42.27156], [21.43882, 42.2789], [21.43882, 42.23609], [21.38428, 42.24465], [21.30496, 42.1418], [21.29913, 42.13954], [21.31983, 42.10993], [21.22728, 42.08909], [21.16614, 42.19815], [21.11491, 42.20794], [20.75464, 42.05229], [20.76786, 41.91839], [20.68523, 41.85318], [20.59524, 41.8818], [20.55976, 41.87068], [20.57144, 41.7897], [20.53405, 41.78099], [20.51301, 41.72433], [20.52937, 41.69292], [20.51769, 41.65975], [20.55508, 41.58113], [20.52103, 41.56473], [20.45809, 41.5549], [20.45331, 41.51436], [20.49039, 41.49277], [20.51301, 41.442], [20.55976, 41.4087], [20.52119, 41.34381], [20.49432, 41.33679], [20.51068, 41.2323], [20.59715, 41.13644], [20.58546, 41.11179], [20.59832, 41.09066], [20.63454, 41.0889], [20.65558, 41.08009], [20.71634, 40.91781], [20.73504, 40.9081], [20.81567, 40.89662], [20.83671, 40.92752], [20.94305, 40.92399], [20.97693, 40.90103], [20.97887, 40.85475], [21.15262, 40.85546], [21.21105, 40.8855], [21.25779, 40.86165], [21.35595, 40.87578], [21.41555, 40.9173], [21.53007, 40.90759], [21.57448, 40.86076], [21.69601, 40.9429], [21.7556, 40.92525], [21.91102, 41.04786], [21.90869, 41.09191], [22.06527, 41.15617], [22.1424, 41.12449], [22.17629, 41.15969], [22.26744, 41.16409], [22.42285, 41.11921], [22.5549, 41.13065], [22.58295, 41.11568], [22.62852, 41.14385], [22.65306, 41.18168], [22.71266, 41.13945], [22.74538, 41.16321], [22.76408, 41.32225], [22.81199, 41.3398], [22.93334, 41.34104], [22.96331, 41.35782], [22.95513, 41.63265], [23.03342, 41.71034], [23.01239, 41.76527], [22.96682, 41.77137], [22.90254, 41.87587], [22.86749, 42.02275], [22.67701, 42.06614], [22.51224, 42.15457], [22.50289, 42.19527], [22.47251, 42.20393], [22.38136, 42.30339], [22.34773, 42.31725]]]] } },
      { type: "Feature", properties: { iso1A2: "ML", iso1A3: "MLI", iso1N3: "466", wikidata: "Q912", nameEn: "Mali", groups: ["011", "202", "002", "UN"], callingCodes: ["223"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-4.83423, 24.99935], [-6.57191, 25.0002], [-5.60725, 16.49919], [-5.33435, 16.33354], [-5.50165, 15.50061], [-9.32979, 15.50032], [-9.31106, 15.69412], [-9.33314, 15.7044], [-9.44673, 15.60553], [-9.40447, 15.4396], [-10.71721, 15.4223], [-10.90932, 15.11001], [-11.43483, 15.62339], [-11.70705, 15.51558], [-11.94903, 14.76143], [-12.23936, 14.76324], [-11.93043, 13.84505], [-12.06897, 13.71049], [-11.83345, 13.33333], [-11.63025, 13.39174], [-11.39935, 12.97808], [-11.37536, 12.40788], [-11.50006, 12.17826], [-11.24136, 12.01286], [-10.99758, 12.24634], [-10.80355, 12.1053], [-10.71897, 11.91552], [-10.30604, 12.24634], [-9.714, 12.0226], [-9.63938, 12.18312], [-9.32097, 12.29009], [-9.38067, 12.48446], [-9.13689, 12.50875], [-8.94784, 12.34842], [-8.80854, 11.66715], [-8.40058, 11.37466], [-8.66923, 10.99397], [-8.35083, 11.06234], [-8.2667, 10.91762], [-8.32614, 10.69273], [-8.22711, 10.41722], [-8.10207, 10.44649], [-7.9578, 10.2703], [-7.97971, 10.17117], [-7.92107, 10.15577], [-7.63048, 10.46334], [-7.54462, 10.40921], [-7.52261, 10.4655], [-7.44555, 10.44602], [-7.3707, 10.24677], [-7.13331, 10.24877], [-7.0603, 10.14711], [-7.00966, 10.15794], [-6.97444, 10.21644], [-7.01186, 10.25111], [-6.93921, 10.35291], [-6.68164, 10.35074], [-6.63541, 10.66893], [-6.52974, 10.59104], [-6.42847, 10.5694], [-6.40646, 10.69922], [-6.325, 10.68624], [-6.24795, 10.74248], [-6.1731, 10.46983], [-6.18851, 10.24244], [-5.99478, 10.19694], [-5.78124, 10.43952], [-5.65135, 10.46767], [-5.51058, 10.43177], [-5.46643, 10.56074], [-5.47083, 10.75329], [-5.41579, 10.84628], [-5.49284, 11.07538], [-5.32994, 11.13371], [-5.32553, 11.21578], [-5.25949, 11.24816], [-5.25509, 11.36905], [-5.20665, 11.43811], [-5.22867, 11.60421], [-5.29251, 11.61715], [-5.26389, 11.75728], [-5.40258, 11.8327], [-5.26389, 11.84778], [-5.07897, 11.97918], [-4.72893, 12.01579], [-4.70692, 12.06746], [-4.62987, 12.06531], [-4.62546, 12.13204], [-4.54841, 12.1385], [-4.57703, 12.19875], [-4.41412, 12.31922], [-4.47356, 12.71252], [-4.238, 12.71467], [-4.21819, 12.95722], [-4.34477, 13.12927], [-3.96501, 13.49778], [-3.90558, 13.44375], [-3.96282, 13.38164], [-3.7911, 13.36665], [-3.54454, 13.1781], [-3.4313, 13.1588], [-3.43507, 13.27272], [-3.23599, 13.29035], [-3.28396, 13.5422], [-3.26407, 13.70699], [-2.88189, 13.64921], [-2.90831, 13.81174], [-2.84667, 14.05532], [-2.66175, 14.14713], [-2.47587, 14.29671], [-2.10223, 14.14878], [-1.9992, 14.19011], [-1.97945, 14.47709], [-1.68083, 14.50023], [-1.32166, 14.72774], [-1.05875, 14.7921], [-0.72004, 15.08655], [-0.24673, 15.07805], [0.06588, 14.96961], [0.23859, 15.00135], [0.72632, 14.95898], [0.96711, 14.98275], [1.31275, 15.27978], [3.01806, 15.34571], [3.03134, 15.42221], [3.50368, 15.35934], [4.19893, 16.39923], [4.21787, 17.00118], [4.26762, 17.00432], [4.26651, 19.14224], [3.36082, 18.9745], [3.12501, 19.1366], [3.24648, 19.81703], [1.20992, 20.73533], [1.15698, 21.12843], [-4.83423, 24.99935]]]] } },
      { type: "Feature", properties: { iso1A2: "MM", iso1A3: "MMR", iso1N3: "104", wikidata: "Q836", nameEn: "Myanmar", aliases: ["Burma", "BU"], groups: ["035", "142", "UN"], callingCodes: ["95"] }, geometry: { type: "MultiPolygon", coordinates: [[[[92.62187, 21.87037], [92.59775, 21.6092], [92.68152, 21.28454], [92.60187, 21.24615], [92.55105, 21.3856], [92.43158, 21.37025], [92.37939, 21.47764], [92.20087, 21.337], [92.17752, 21.17445], [92.26071, 21.05697], [92.47409, 20.38654], [92.61042, 13.76986], [94.6371, 13.81803], [97.63455, 9.60854], [98.12555, 9.44056], [98.33094, 9.91973], [98.47298, 9.95782], [98.52291, 9.92389], [98.55174, 9.92804], [98.7391, 10.31488], [98.81944, 10.52761], [98.77275, 10.62548], [98.78511, 10.68351], [98.86819, 10.78336], [99.0069, 10.85485], [98.99701, 10.92962], [99.02337, 10.97217], [99.06938, 10.94857], [99.32756, 11.28545], [99.31573, 11.32081], [99.39485, 11.3925], [99.47598, 11.62434], [99.5672, 11.62732], [99.64108, 11.78948], [99.64891, 11.82699], [99.53424, 12.02317], [99.56445, 12.14805], [99.47519, 12.1353], [99.409, 12.60603], [99.29254, 12.68921], [99.18905, 12.84799], [99.18748, 12.9898], [99.10646, 13.05804], [99.12225, 13.19847], [99.20617, 13.20575], [99.16695, 13.72621], [98.97356, 14.04868], [98.56762, 14.37701], [98.24874, 14.83013], [98.18821, 15.13125], [98.22, 15.21327], [98.30446, 15.30667], [98.40522, 15.25268], [98.41906, 15.27103], [98.39351, 15.34177], [98.4866, 15.39154], [98.56027, 15.33471], [98.58598, 15.46821], [98.541, 15.65406], [98.59853, 15.87197], [98.57019, 16.04578], [98.69585, 16.13353], [98.8376, 16.11706], [98.92656, 16.36425], [98.84485, 16.42354], [98.68074, 16.27068], [98.63817, 16.47424], [98.57912, 16.55983], [98.5695, 16.62826], [98.51113, 16.64503], [98.51833, 16.676], [98.51472, 16.68521], [98.51579, 16.69433], [98.51043, 16.70107], [98.49713, 16.69022], [98.50253, 16.7139], [98.46994, 16.73613], [98.53833, 16.81934], [98.49603, 16.8446], [98.52624, 16.89979], [98.39441, 17.06266], [98.34566, 17.04822], [98.10439, 17.33847], [98.11185, 17.36829], [97.91829, 17.54504], [97.76407, 17.71595], [97.66794, 17.88005], [97.73723, 17.97912], [97.60841, 18.23846], [97.64116, 18.29778], [97.56219, 18.33885], [97.50383, 18.26844], [97.34522, 18.54596], [97.36444, 18.57138], [97.5258, 18.4939], [97.76752, 18.58097], [97.73836, 18.88478], [97.66487, 18.9371], [97.73654, 18.9812], [97.73797, 19.04261], [97.83479, 19.09972], [97.84024, 19.22217], [97.78606, 19.26769], [97.84186, 19.29526], [97.78769, 19.39429], [97.88423, 19.5041], [97.84715, 19.55782], [98.04364, 19.65755], [98.03314, 19.80941], [98.13829, 19.78541], [98.24884, 19.67876], [98.51182, 19.71303], [98.56065, 19.67807], [98.83661, 19.80931], [98.98679, 19.7419], [99.0735, 20.10298], [99.20328, 20.12877], [99.416, 20.08614], [99.52943, 20.14811], [99.5569, 20.20676], [99.46077, 20.36198], [99.46008, 20.39673], [99.68255, 20.32077], [99.81096, 20.33687], [99.86383, 20.44371], [99.88211, 20.44488], [99.88451, 20.44596], [99.89168, 20.44548], [99.89301, 20.44311], [99.89692, 20.44789], [99.90499, 20.4487], [99.91616, 20.44986], [99.95721, 20.46301], [100.08404, 20.36626], [100.1957, 20.68247], [100.36375, 20.82783], [100.51079, 20.82194], [100.60112, 20.8347], [100.64628, 20.88279], [100.50974, 20.88574], [100.55281, 21.02796], [100.63578, 21.05639], [100.72716, 21.31786], [100.80173, 21.2934], [101.00234, 21.39612], [101.16198, 21.52808], [101.15156, 21.56129], [101.11744, 21.77659], [100.87265, 21.67396], [100.72143, 21.51898], [100.57861, 21.45637], [100.4811, 21.46148], [100.42892, 21.54325], [100.35201, 21.53176], [100.25863, 21.47043], [100.18447, 21.51898], [100.1625, 21.48704], [100.12542, 21.50365], [100.10757, 21.59945], [100.17486, 21.65306], [100.12679, 21.70539], [100.04956, 21.66843], [99.98654, 21.71064], [99.94003, 21.82782], [99.99084, 21.97053], [99.96612, 22.05965], [99.85351, 22.04183], [99.47585, 22.13345], [99.33166, 22.09656], [99.1552, 22.15874], [99.19176, 22.16983], [99.17318, 22.18025], [99.28771, 22.4105], [99.37972, 22.50188], [99.38247, 22.57544], [99.31243, 22.73893], [99.45654, 22.85726], [99.43537, 22.94086], [99.54218, 22.90014], [99.52214, 23.08218], [99.34127, 23.13099], [99.25741, 23.09025], [99.04601, 23.12215], [99.05975, 23.16382], [98.88597, 23.18656], [98.92515, 23.29535], [98.93958, 23.31414], [98.87573, 23.33038], [98.92104, 23.36946], [98.87683, 23.48995], [98.82877, 23.47908], [98.80294, 23.5345], [98.88396, 23.59555], [98.81775, 23.694], [98.82933, 23.72921], [98.79607, 23.77947], [98.68209, 23.80492], [98.67797, 23.9644], [98.89632, 24.10612], [98.87998, 24.15624], [98.85319, 24.13042], [98.59256, 24.08371], [98.54476, 24.13119], [98.20666, 24.11406], [98.07806, 24.07988], [98.06703, 24.08028], [98.0607, 24.07812], [98.05671, 24.07961], [98.05302, 24.07408], [98.04709, 24.07616], [97.99583, 24.04932], [97.98691, 24.03897], [97.93951, 24.01953], [97.90998, 24.02094], [97.88616, 24.00463], [97.88414, 23.99405], [97.88814, 23.98605], [97.89683, 23.98389], [97.89676, 23.97931], [97.8955, 23.97758], [97.88811, 23.97446], [97.86545, 23.97723], [97.84328, 23.97603], [97.79416, 23.95663], [97.79456, 23.94836], [97.72302, 23.89288], [97.64667, 23.84574], [97.5247, 23.94032], [97.62363, 24.00506], [97.72903, 24.12606], [97.75305, 24.16902], [97.72799, 24.18883], [97.72998, 24.2302], [97.76799, 24.26365], [97.71941, 24.29652], [97.66723, 24.30027], [97.65624, 24.33781], [97.7098, 24.35658], [97.66998, 24.45288], [97.60029, 24.4401], [97.52757, 24.43748], [97.56286, 24.54535], [97.56525, 24.72838], [97.54675, 24.74202], [97.5542, 24.74943], [97.56383, 24.75535], [97.56648, 24.76475], [97.64354, 24.79171], [97.70181, 24.84557], [97.73127, 24.83015], [97.76481, 24.8289], [97.79949, 24.85655], [97.72903, 24.91332], [97.72216, 25.08508], [97.77023, 25.11492], [97.83614, 25.2715], [97.92541, 25.20815], [98.14925, 25.41547], [98.12591, 25.50722], [98.18084, 25.56298], [98.16848, 25.62739], [98.25774, 25.6051], [98.31268, 25.55307], [98.40606, 25.61129], [98.54064, 25.85129], [98.63128, 25.79937], [98.70818, 25.86241], [98.60763, 26.01512], [98.57085, 26.11547], [98.63128, 26.15492], [98.66884, 26.09165], [98.7329, 26.17218], [98.67797, 26.24487], [98.72741, 26.36183], [98.77547, 26.61994], [98.7333, 26.85615], [98.69582, 27.56499], [98.43353, 27.67086], [98.42529, 27.55404], [98.32641, 27.51385], [98.13964, 27.9478], [98.15337, 28.12114], [97.90069, 28.3776], [97.79632, 28.33168], [97.70705, 28.5056], [97.56835, 28.55628], [97.50518, 28.49716], [97.47085, 28.2688], [97.41729, 28.29783], [97.34547, 28.21385], [97.31292, 28.06784], [97.35412, 28.06663], [97.38845, 28.01329], [97.35824, 27.87256], [97.29919, 27.92233], [96.90112, 27.62149], [96.91431, 27.45752], [97.17422, 27.14052], [97.14675, 27.09041], [96.89132, 27.17474], [96.85287, 27.2065], [96.88445, 27.25046], [96.73888, 27.36638], [96.55761, 27.29928], [96.40779, 27.29818], [96.15591, 27.24572], [96.04949, 27.19428], [95.93002, 27.04149], [95.81603, 27.01335], [95.437, 26.7083], [95.30339, 26.65372], [95.23513, 26.68499], [95.05798, 26.45408], [95.12801, 26.38397], [95.11428, 26.1019], [95.18556, 26.07338], [94.80117, 25.49359], [94.68032, 25.47003], [94.57458, 25.20318], [94.74212, 25.13606], [94.73937, 25.00545], [94.60204, 24.70889], [94.5526, 24.70764], [94.50729, 24.59281], [94.45279, 24.56656], [94.32362, 24.27692], [94.30215, 24.23752], [94.14081, 23.83333], [93.92089, 23.95812], [93.80279, 23.92549], [93.75952, 24.0003], [93.62871, 24.00922], [93.50616, 23.94432], [93.46633, 23.97067], [93.41415, 24.07854], [93.34735, 24.10151], [93.32351, 24.04468], [93.36059, 23.93176], [93.3908, 23.92925], [93.3908, 23.7622], [93.43475, 23.68299], [93.38805, 23.4728], [93.39981, 23.38828], [93.38781, 23.36139], [93.36862, 23.35426], [93.38478, 23.13698], [93.2878, 23.00464], [93.12988, 23.05772], [93.134, 22.92498], [93.09417, 22.69459], [93.134, 22.59573], [93.11477, 22.54374], [93.13537, 22.45873], [93.18206, 22.43716], [93.19991, 22.25425], [93.14224, 22.24535], [93.15734, 22.18687], [93.04885, 22.20595], [92.99255, 22.05965], [92.99804, 21.98964], [92.93899, 22.02656], [92.89504, 21.95143], [92.86208, 22.05456], [92.70416, 22.16017], [92.67532, 22.03547], [92.60949, 21.97638], [92.62187, 21.87037]]]] } },
      { type: "Feature", properties: { iso1A2: "MN", iso1A3: "MNG", iso1N3: "496", wikidata: "Q711", nameEn: "Mongolia", groups: ["030", "142", "UN"], callingCodes: ["976"] }, geometry: { type: "MultiPolygon", coordinates: [[[[102.14032, 51.35566], [101.5044, 51.50467], [101.39085, 51.45753], [100.61116, 51.73028], [99.89203, 51.74903], [99.75578, 51.90108], [99.27888, 51.96876], [98.87768, 52.14563], [98.74142, 51.8637], [98.33222, 51.71832], [98.22053, 51.46579], [98.05257, 51.46696], [97.83305, 51.00248], [98.01472, 50.86652], [97.9693, 50.78044], [98.06393, 50.61262], [98.31373, 50.4996], [98.29481, 50.33561], [97.85197, 49.91339], [97.76871, 49.99861], [97.56432, 49.92801], [97.56811, 49.84265], [97.24639, 49.74737], [96.97388, 49.88413], [95.80056, 50.04239], [95.74757, 49.97915], [95.02465, 49.96941], [94.97166, 50.04725], [94.6121, 50.04239], [94.49477, 50.17832], [94.39258, 50.22193], [94.30823, 50.57498], [92.99595, 50.63183], [93.01109, 50.79001], [92.44714, 50.78762], [92.07173, 50.69585], [91.86048, 50.73734], [89.59711, 49.90851], [89.70687, 49.72535], [88.82499, 49.44808], [88.42449, 49.48821], [88.17223, 49.46934], [88.15543, 49.30314], [87.98977, 49.18147], [87.81333, 49.17354], [87.88171, 48.95853], [87.73822, 48.89582], [88.0788, 48.71436], [87.96361, 48.58478], [88.58939, 48.34531], [88.58316, 48.21893], [88.8011, 48.11302], [88.93186, 48.10263], [89.0711, 47.98528], [89.55453, 48.0423], [89.76624, 47.82745], [90.06512, 47.88177], [90.10871, 47.7375], [90.33598, 47.68303], [90.48854, 47.41826], [90.48542, 47.30438], [90.76108, 46.99399], [90.84035, 46.99525], [91.03649, 46.72916], [91.0147, 46.58171], [91.07696, 46.57315], [90.89639, 46.30711], [90.99672, 46.14207], [91.03026, 46.04194], [90.70907, 45.73437], [90.65114, 45.49314], [90.89169, 45.19667], [91.64048, 45.07408], [93.51161, 44.95964], [94.10003, 44.71016], [94.71959, 44.35284], [95.01191, 44.25274], [95.39772, 44.2805], [95.32891, 44.02407], [95.52594, 43.99353], [95.89543, 43.2528], [96.35658, 42.90363], [96.37926, 42.72055], [97.1777, 42.7964], [99.50671, 42.56535], [100.33297, 42.68231], [100.84979, 42.67087], [101.80515, 42.50074], [102.07645, 42.22519], [102.72403, 42.14675], [103.92804, 41.78246], [104.52258, 41.8706], [104.51667, 41.66113], [105.0123, 41.63188], [106.76517, 42.28741], [107.24774, 42.36107], [107.29755, 42.41395], [107.49681, 42.46221], [107.57258, 42.40898], [108.84489, 42.40246], [109.00679, 42.45302], [109.452, 42.44842], [109.89402, 42.63111], [110.08401, 42.6411], [110.4327, 42.78293], [111.0149, 43.3289], [111.59087, 43.51207], [111.79758, 43.6637], [111.93776, 43.68709], [111.96289, 43.81596], [111.40498, 44.3461], [111.76275, 44.98032], [111.98695, 45.09074], [112.4164, 45.06858], [112.74662, 44.86297], [113.70918, 44.72891], [114.5166, 45.27189], [114.54801, 45.38337], [114.74612, 45.43585], [114.94546, 45.37377], [115.60329, 45.44717], [116.16989, 45.68603], [116.27366, 45.78637], [116.24012, 45.8778], [116.26678, 45.96479], [116.58612, 46.30211], [116.75551, 46.33083], [116.83166, 46.38637], [117.36609, 46.36335], [117.41782, 46.57862], [117.60748, 46.59771], [117.69554, 46.50991], [118.30534, 46.73519], [118.78747, 46.68689], [118.8337, 46.77742], [118.89974, 46.77139], [118.92616, 46.72765], [119.00541, 46.74273], [119.10448, 46.65516], [119.24978, 46.64761], [119.32827, 46.61433], [119.42827, 46.63783], [119.65265, 46.62342], [119.68127, 46.59015], [119.77373, 46.62947], [119.80455, 46.67631], [119.89261, 46.66423], [119.91242, 46.90091], [119.85518, 46.92196], [119.71209, 47.19192], [119.62403, 47.24575], [119.56019, 47.24874], [119.54918, 47.29505], [119.31964, 47.42617], [119.35892, 47.48104], [119.13995, 47.53997], [119.12343, 47.66458], [118.7564, 47.76947], [118.55766, 47.99277], [118.29654, 48.00246], [118.22677, 48.03853], [118.11009, 48.04], [118.03676, 48.00982], [117.80196, 48.01661], [117.50181, 47.77216], [117.37875, 47.63627], [116.9723, 47.87285], [116.67405, 47.89039], [116.4465, 47.83662], [116.21879, 47.88505], [115.94296, 47.67741], [115.57128, 47.91988], [115.52082, 48.15367], [115.811, 48.25699], [115.78876, 48.51781], [116.06565, 48.81716], [116.03781, 48.87014], [116.71193, 49.83813], [116.62502, 49.92919], [116.22402, 50.04477], [115.73602, 49.87688], [115.26068, 49.97367], [114.9703, 50.19254], [114.325, 50.28098], [113.20216, 49.83356], [113.02647, 49.60772], [110.64493, 49.1816], [110.39891, 49.25083], [110.24373, 49.16676], [109.51325, 49.22859], [109.18017, 49.34709], [108.53969, 49.32325], [108.27937, 49.53167], [107.95387, 49.66659], [107.96116, 49.93191], [107.36407, 49.97612], [107.1174, 50.04239], [107.00007, 50.1977], [106.80326, 50.30177], [106.58373, 50.34044], [106.51122, 50.34408], [106.49628, 50.32436], [106.47156, 50.31909], [106.07865, 50.33474], [106.05562, 50.40582], [105.32528, 50.4648], [103.70343, 50.13952], [102.71178, 50.38873], [102.32194, 50.67982], [102.14032, 51.35566]]]] } },
      { type: "Feature", properties: { iso1A2: "MO", iso1A3: "MAC", iso1N3: "446", wikidata: "Q14773", nameEn: "Macau", aliases: ["Macao"], country: "CN", groups: ["030", "142", "UN"], driveSide: "left", callingCodes: ["853"] }, geometry: { type: "MultiPolygon", coordinates: [[[[113.54942, 22.14519], [113.54839, 22.10909], [113.57191, 22.07696], [113.63011, 22.10782], [113.60504, 22.20464], [113.57123, 22.20416], [113.56865, 22.20973], [113.5508, 22.21672], [113.54333, 22.21688], [113.54093, 22.21314], [113.53593, 22.2137], [113.53301, 22.21235], [113.53552, 22.20607], [113.52659, 22.18271], [113.54093, 22.15497], [113.54942, 22.14519]]]] } },
      { type: "Feature", properties: { iso1A2: "MP", iso1A3: "MNP", iso1N3: "580", wikidata: "Q16644", nameEn: "Northern Mariana Islands", aliases: ["US-MP"], country: "US", groups: ["Q1352230", "Q153732", "057", "009", "UN"], roadSpeedUnit: "mph", callingCodes: ["1 670"] }, geometry: { type: "MultiPolygon", coordinates: [[[[135.52896, 14.32623], [152.19114, 13.63487], [145.05972, 21.28731], [135.52896, 14.32623]]]] } },
      { type: "Feature", properties: { iso1A2: "MQ", iso1A3: "MTQ", iso1N3: "474", wikidata: "Q17054", nameEn: "Martinique", country: "FR", groups: ["Q3320166", "EU", "029", "003", "419", "019", "UN"], callingCodes: ["596"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-59.95997, 14.20285], [-61.07821, 15.25109], [-61.69315, 14.26451], [-59.95997, 14.20285]]]] } },
      { type: "Feature", properties: { iso1A2: "MR", iso1A3: "MRT", iso1N3: "478", wikidata: "Q1025", nameEn: "Mauritania", groups: ["011", "202", "002", "UN"], callingCodes: ["222"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-5.60725, 16.49919], [-6.57191, 25.0002], [-4.83423, 24.99935], [-8.66674, 27.31569], [-8.66721, 25.99918], [-12.0002, 25.9986], [-12.00251, 23.4538], [-12.14969, 23.41935], [-12.36213, 23.3187], [-12.5741, 23.28975], [-13.00412, 23.02297], [-13.10753, 22.89493], [-13.15313, 22.75649], [-13.08438, 22.53866], [-13.01525, 21.33343], [-16.95474, 21.33997], [-16.99806, 21.12142], [-17.0357, 21.05368], [-17.0396, 20.9961], [-17.06781, 20.92697], [-17.0695, 20.85742], [-17.0471, 20.76408], [-17.15288, 16.07139], [-16.50854, 16.09032], [-16.48967, 16.0496], [-16.44814, 16.09753], [-16.4429, 16.20605], [-16.27016, 16.51565], [-15.6509, 16.50315], [-15.00557, 16.64997], [-14.32144, 16.61495], [-13.80075, 16.13961], [-13.43135, 16.09022], [-13.11029, 15.52116], [-12.23936, 14.76324], [-11.94903, 14.76143], [-11.70705, 15.51558], [-11.43483, 15.62339], [-10.90932, 15.11001], [-10.71721, 15.4223], [-9.40447, 15.4396], [-9.44673, 15.60553], [-9.33314, 15.7044], [-9.31106, 15.69412], [-9.32979, 15.50032], [-5.50165, 15.50061], [-5.33435, 16.33354], [-5.60725, 16.49919]]]] } },
      { type: "Feature", properties: { iso1A2: "MS", iso1A3: "MSR", iso1N3: "500", wikidata: "Q13353", nameEn: "Montserrat", country: "GB", groups: ["BOTS", "029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1 664"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-61.91508, 16.51165], [-62.1023, 16.97277], [-62.58307, 16.68909], [-61.91508, 16.51165]]]] } },
      { type: "Feature", properties: { iso1A2: "MT", iso1A3: "MLT", iso1N3: "470", wikidata: "Q233", nameEn: "Malta", groups: ["EU", "039", "150", "UN"], driveSide: "left", callingCodes: ["356"] }, geometry: { type: "MultiPolygon", coordinates: [[[[15.70991, 35.79901], [14.07544, 36.41525], [13.27636, 35.20764], [15.70991, 35.79901]]]] } },
      { type: "Feature", properties: { iso1A2: "MU", iso1A3: "MUS", iso1N3: "480", wikidata: "Q1027", nameEn: "Mauritius", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["230"] }, geometry: { type: "MultiPolygon", coordinates: [[[[56.09755, -9.55401], [57.50644, -31.92637], [68.4673, -19.15185], [56.09755, -9.55401]]]] } },
      { type: "Feature", properties: { iso1A2: "MV", iso1A3: "MDV", iso1N3: "462", wikidata: "Q826", nameEn: "Maldives", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["960"] }, geometry: { type: "MultiPolygon", coordinates: [[[[71.9161, 8.55531], [72.57428, -3.7623], [76.59015, 5.591], [71.9161, 8.55531]]]] } },
      { type: "Feature", properties: { iso1A2: "MW", iso1A3: "MWI", iso1N3: "454", wikidata: "Q1020", nameEn: "Malawi", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["265"] }, geometry: { type: "MultiPolygon", coordinates: [[[[33.48052, -9.62442], [33.31581, -9.48554], [33.14925, -9.49322], [32.99397, -9.36712], [32.95389, -9.40138], [33.00476, -9.5133], [33.00256, -9.63053], [33.05485, -9.61316], [33.10163, -9.66525], [33.12144, -9.58929], [33.2095, -9.61099], [33.31517, -9.82364], [33.36581, -9.81063], [33.37902, -9.9104], [33.31297, -10.05133], [33.53863, -10.20148], [33.54797, -10.36077], [33.70675, -10.56896], [33.47636, -10.78465], [33.28022, -10.84428], [33.25998, -10.88862], [33.39697, -11.15296], [33.29267, -11.3789], [33.29267, -11.43536], [33.23663, -11.40637], [33.24252, -11.59302], [33.32692, -11.59248], [33.33937, -11.91252], [33.25998, -12.14242], [33.3705, -12.34931], [33.47636, -12.32498], [33.54485, -12.35996], [33.37517, -12.54085], [33.28177, -12.54692], [33.18837, -12.61377], [33.05917, -12.59554], [32.94397, -12.76868], [32.96733, -12.88251], [33.02181, -12.88707], [32.98289, -13.12671], [33.0078, -13.19492], [32.86113, -13.47292], [32.84176, -13.52794], [32.73683, -13.57682], [32.68436, -13.55769], [32.66468, -13.60019], [32.68654, -13.64268], [32.7828, -13.64805], [32.84528, -13.71576], [32.76962, -13.77224], [32.79015, -13.80755], [32.88985, -13.82956], [32.99042, -13.95689], [33.02977, -14.05022], [33.07568, -13.98447], [33.16749, -13.93992], [33.24249, -14.00019], [33.66677, -14.61306], [33.7247, -14.4989], [33.88503, -14.51652], [33.92898, -14.47929], [34.08588, -14.48893], [34.18733, -14.43823], [34.22355, -14.43607], [34.34453, -14.3985], [34.35843, -14.38652], [34.39277, -14.39467], [34.4192, -14.43191], [34.44641, -14.47746], [34.45053, -14.49873], [34.47628, -14.53363], [34.48932, -14.53646], [34.49636, -14.55091], [34.52366, -14.5667], [34.53962, -14.59776], [34.55112, -14.64494], [34.53516, -14.67782], [34.52057, -14.68263], [34.54503, -14.74672], [34.567, -14.77345], [34.61522, -14.99583], [34.57503, -15.30619], [34.43126, -15.44778], [34.44981, -15.60864], [34.25195, -15.90321], [34.43126, -16.04737], [34.40344, -16.20923], [35.04805, -16.83167], [35.13771, -16.81687], [35.17017, -16.93521], [35.04805, -17.00027], [35.0923, -17.13235], [35.3062, -17.1244], [35.27065, -16.93817], [35.30929, -16.82871], [35.27219, -16.69402], [35.14235, -16.56812], [35.25828, -16.4792], [35.30157, -16.2211], [35.43355, -16.11371], [35.52365, -16.15414], [35.70107, -16.10147], [35.80487, -16.03907], [35.85303, -15.41913], [35.78799, -15.17428], [35.91812, -14.89514], [35.87212, -14.89478], [35.86945, -14.67481], [35.5299, -14.27714], [35.47989, -14.15594], [34.86229, -13.48958], [34.60253, -13.48487], [34.37831, -12.17408], [34.46088, -12.0174], [34.70739, -12.15652], [34.82903, -12.04837], [34.57917, -11.87849], [34.64241, -11.57499], [34.96296, -11.57354], [34.91153, -11.39799], [34.79375, -11.32245], [34.63305, -11.11731], [34.61161, -11.01611], [34.67047, -10.93796], [34.65946, -10.6828], [34.57581, -10.56271], [34.51911, -10.12279], [34.54499, -10.0678], [34.03865, -9.49398], [33.95829, -9.54066], [33.9638, -9.62206], [33.93298, -9.71647], [33.76677, -9.58516], [33.48052, -9.62442]]]] } },
      { type: "Feature", properties: { iso1A2: "MX", iso1A3: "MEX", iso1N3: "484", wikidata: "Q96", nameEn: "Mexico", groups: ["013", "003", "419", "019", "UN"], callingCodes: ["52"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-117.1243, 32.53427], [-118.48109, 32.5991], [-120.12904, 18.41089], [-92.37213, 14.39277], [-92.2261, 14.53423], [-92.1454, 14.6804], [-92.18161, 14.84147], [-92.1423, 14.88647], [-92.1454, 14.98143], [-92.0621, 15.07406], [-92.20983, 15.26077], [-91.73182, 16.07371], [-90.44567, 16.07573], [-90.40499, 16.40524], [-90.61212, 16.49832], [-90.69064, 16.70697], [-91.04436, 16.92175], [-91.43809, 17.25373], [-90.99199, 17.25192], [-90.98678, 17.81655], [-89.14985, 17.81563], [-89.15105, 17.95104], [-89.03839, 18.0067], [-88.8716, 17.89535], [-88.71505, 18.0707], [-88.48242, 18.49164], [-88.3268, 18.49048], [-88.29909, 18.47591], [-88.26593, 18.47617], [-88.03238, 18.41778], [-88.03165, 18.16657], [-87.90671, 18.15213], [-87.87604, 18.18313], [-87.86657, 18.19971], [-87.85693, 18.18266], [-87.84815, 18.18511], [-86.92368, 17.61462], [-85.9092, 21.8218], [-96.92418, 25.97377], [-97.13927, 25.96583], [-97.35946, 25.92189], [-97.37332, 25.83854], [-97.42511, 25.83969], [-97.45669, 25.86874], [-97.49828, 25.89877], [-97.52025, 25.88518], [-97.66511, 26.01708], [-97.95155, 26.0625], [-97.97017, 26.05232], [-98.24603, 26.07191], [-98.27075, 26.09457], [-98.30491, 26.10475], [-98.35126, 26.15129], [-99.00546, 26.3925], [-99.03053, 26.41249], [-99.08477, 26.39849], [-99.53573, 27.30926], [-99.49744, 27.43746], [-99.482, 27.47128], [-99.48045, 27.49016], [-99.50208, 27.50021], [-99.52955, 27.49747], [-99.51478, 27.55836], [-99.55409, 27.61314], [-100.50029, 28.66117], [-100.51222, 28.70679], [-100.5075, 28.74066], [-100.52313, 28.75598], [-100.59809, 28.88197], [-100.63689, 28.90812], [-100.67294, 29.09744], [-100.79696, 29.24688], [-100.87982, 29.296], [-100.94056, 29.33371], [-100.94579, 29.34523], [-100.96725, 29.3477], [-101.01128, 29.36947], [-101.05686, 29.44738], [-101.47277, 29.7744], [-102.60596, 29.8192], [-103.15787, 28.93865], [-104.37752, 29.54255], [-104.39363, 29.55396], [-104.3969, 29.57105], [-104.5171, 29.64671], [-104.77674, 30.4236], [-106.00363, 31.39181], [-106.09025, 31.40569], [-106.20346, 31.46305], [-106.23711, 31.51262], [-106.24612, 31.54193], [-106.28084, 31.56173], [-106.30305, 31.62154], [-106.33419, 31.66303], [-106.34864, 31.69663], [-106.3718, 31.71165], [-106.38003, 31.73151], [-106.41773, 31.75196], [-106.43419, 31.75478], [-106.45244, 31.76523], [-106.46726, 31.75998], [-106.47298, 31.75054], [-106.48815, 31.74769], [-106.50111, 31.75714], [-106.50962, 31.76155], [-106.51251, 31.76922], [-106.52266, 31.77509], [-106.529, 31.784], [-108.20899, 31.78534], [-108.20979, 31.33316], [-111.07523, 31.33232], [-114.82011, 32.49609], [-114.79524, 32.55731], [-114.81141, 32.55543], [-114.80584, 32.62028], [-114.76736, 32.64094], [-114.71871, 32.71894], [-115.88053, 32.63624], [-117.1243, 32.53427]]]] } },
      { type: "Feature", properties: { iso1A2: "MY", iso1A3: "MYS", iso1N3: "458", wikidata: "Q833", nameEn: "Malaysia" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "MZ", iso1A3: "MOZ", iso1N3: "508", wikidata: "Q1029", nameEn: "Mozambique", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["258"] }, geometry: { type: "MultiPolygon", coordinates: [[[[40.74206, -10.25691], [40.44265, -10.4618], [40.00295, -10.80255], [39.58249, -10.96043], [39.24395, -11.17433], [38.88996, -11.16978], [38.47258, -11.4199], [38.21598, -11.27289], [37.93618, -11.26228], [37.8388, -11.3123], [37.76614, -11.53352], [37.3936, -11.68949], [36.80309, -11.56836], [36.62068, -11.72884], [36.19094, -11.70008], [36.19094, -11.57593], [35.82767, -11.41081], [35.63599, -11.55927], [34.96296, -11.57354], [34.64241, -11.57499], [34.57917, -11.87849], [34.82903, -12.04837], [34.70739, -12.15652], [34.46088, -12.0174], [34.37831, -12.17408], [34.60253, -13.48487], [34.86229, -13.48958], [35.47989, -14.15594], [35.5299, -14.27714], [35.86945, -14.67481], [35.87212, -14.89478], [35.91812, -14.89514], [35.78799, -15.17428], [35.85303, -15.41913], [35.80487, -16.03907], [35.70107, -16.10147], [35.52365, -16.15414], [35.43355, -16.11371], [35.30157, -16.2211], [35.25828, -16.4792], [35.14235, -16.56812], [35.27219, -16.69402], [35.30929, -16.82871], [35.27065, -16.93817], [35.3062, -17.1244], [35.0923, -17.13235], [35.04805, -17.00027], [35.17017, -16.93521], [35.13771, -16.81687], [35.04805, -16.83167], [34.40344, -16.20923], [34.43126, -16.04737], [34.25195, -15.90321], [34.44981, -15.60864], [34.43126, -15.44778], [34.57503, -15.30619], [34.61522, -14.99583], [34.567, -14.77345], [34.54503, -14.74672], [34.52057, -14.68263], [34.53516, -14.67782], [34.55112, -14.64494], [34.53962, -14.59776], [34.52366, -14.5667], [34.49636, -14.55091], [34.48932, -14.53646], [34.47628, -14.53363], [34.45053, -14.49873], [34.44641, -14.47746], [34.4192, -14.43191], [34.39277, -14.39467], [34.35843, -14.38652], [34.34453, -14.3985], [34.22355, -14.43607], [34.18733, -14.43823], [34.08588, -14.48893], [33.92898, -14.47929], [33.88503, -14.51652], [33.7247, -14.4989], [33.66677, -14.61306], [33.24249, -14.00019], [30.22098, -14.99447], [30.41902, -15.62269], [30.42568, -15.9962], [30.91597, -15.99924], [30.97761, -16.05848], [31.13171, -15.98019], [31.30563, -16.01193], [31.42451, -16.15154], [31.67988, -16.19595], [31.90223, -16.34388], [31.91324, -16.41569], [32.02772, -16.43892], [32.28529, -16.43892], [32.42838, -16.4727], [32.71017, -16.59932], [32.69917, -16.66893], [32.78943, -16.70267], [32.97655, -16.70689], [32.91051, -16.89446], [32.84113, -16.92259], [32.96554, -17.11971], [33.00517, -17.30477], [33.0426, -17.3468], [32.96554, -17.48964], [32.98536, -17.55891], [33.0492, -17.60298], [32.94133, -17.99705], [33.03159, -18.35054], [33.02278, -18.4696], [32.88629, -18.51344], [32.88629, -18.58023], [32.95013, -18.69079], [32.9017, -18.7992], [32.82465, -18.77419], [32.70137, -18.84712], [32.73439, -18.92628], [32.69917, -18.94293], [32.72118, -19.02204], [32.84006, -19.0262], [32.87088, -19.09279], [32.85107, -19.29238], [32.77966, -19.36098], [32.78282, -19.47513], [32.84446, -19.48343], [32.84666, -19.68462], [32.95013, -19.67219], [33.06461, -19.77787], [33.01178, -20.02007], [32.93032, -20.03868], [32.85987, -20.16686], [32.85987, -20.27841], [32.66174, -20.56106], [32.55167, -20.56312], [32.48122, -20.63319], [32.51644, -20.91929], [32.37115, -21.133], [32.48236, -21.32873], [32.41234, -21.31246], [31.38336, -22.36919], [31.30611, -22.422], [31.55779, -23.176], [31.56539, -23.47268], [31.67942, -23.60858], [31.70223, -23.72695], [31.77445, -23.90082], [31.87707, -23.95293], [31.90368, -24.18892], [31.9835, -24.29983], [32.03196, -25.10785], [32.01676, -25.38117], [31.97875, -25.46356], [32.00631, -25.65044], [31.92649, -25.84216], [31.974, -25.95387], [32.00916, -25.999], [32.08599, -26.00978], [32.10435, -26.15656], [32.07352, -26.40185], [32.13409, -26.5317], [32.13315, -26.84345], [32.19409, -26.84032], [32.22302, -26.84136], [32.29584, -26.852], [32.35222, -26.86027], [34.51034, -26.91792], [42.99868, -12.65261], [40.74206, -10.25691]]]] } },
      { type: "Feature", properties: { iso1A2: "NA", iso1A3: "NAM", iso1N3: "516", wikidata: "Q1030", nameEn: "Namibia", groups: ["018", "202", "002", "UN"], driveSide: "left", callingCodes: ["264"] }, geometry: { type: "MultiPolygon", coordinates: [[[[14.28743, -17.38814], [13.95896, -17.43141], [13.36212, -16.98048], [12.97145, -16.98567], [12.52111, -17.24495], [12.07076, -17.15165], [11.75063, -17.25013], [10.5065, -17.25284], [12.51595, -32.27486], [16.45332, -28.63117], [16.46592, -28.57126], [16.59922, -28.53246], [16.90446, -28.057], [17.15405, -28.08573], [17.4579, -28.68718], [18.99885, -28.89165], [19.99882, -28.42622], [19.99817, -24.76768], [19.99912, -21.99991], [20.99751, -22.00026], [20.99904, -18.31743], [21.45556, -18.31795], [23.0996, -18.00075], [23.29618, -17.99855], [23.61088, -18.4881], [24.19416, -18.01919], [24.40577, -17.95726], [24.57485, -18.07151], [24.6303, -17.9863], [24.71887, -17.9218], [24.73364, -17.89338], [24.95586, -17.79674], [25.05895, -17.84452], [25.16882, -17.78253], [25.26433, -17.79571], [25.00198, -17.58221], [24.70864, -17.49501], [24.5621, -17.52963], [24.38712, -17.46818], [24.32811, -17.49082], [24.23619, -17.47489], [23.47474, -17.62877], [21.42741, -18.02787], [21.14283, -17.94318], [18.84226, -17.80375], [18.39229, -17.38927], [14.28743, -17.38814]]]] } },
      { type: "Feature", properties: { iso1A2: "NC", iso1A3: "NCL", iso1N3: "540", wikidata: "Q33788", nameEn: "New Caledonia", country: "FR", groups: ["Q1451600", "054", "009", "UN"], callingCodes: ["687"] }, geometry: { type: "MultiPolygon", coordinates: [[[[159.77159, -28.41151], [174.245, -23.1974], [156.73836, -14.50464], [159.77159, -28.41151]]]] } },
      { type: "Feature", properties: { iso1A2: "NE", iso1A3: "NER", iso1N3: "562", wikidata: "Q1032", nameEn: "Niger", aliases: ["RN"], groups: ["011", "202", "002", "UN"], callingCodes: ["227"] }, geometry: { type: "MultiPolygon", coordinates: [[[[14.22918, 22.61719], [13.5631, 23.16574], [11.96886, 23.51735], [7.48273, 20.87258], [7.38361, 20.79165], [5.8153, 19.45101], [4.26651, 19.14224], [4.26762, 17.00432], [4.21787, 17.00118], [4.19893, 16.39923], [3.50368, 15.35934], [3.03134, 15.42221], [3.01806, 15.34571], [1.31275, 15.27978], [0.96711, 14.98275], [0.72632, 14.95898], [0.23859, 15.00135], [0.16936, 14.51654], [0.38051, 14.05575], [0.61924, 13.68491], [0.77377, 13.6866], [0.77637, 13.64442], [0.99514, 13.5668], [1.02813, 13.46635], [1.20088, 13.38951], [1.24429, 13.39373], [1.28509, 13.35488], [1.24516, 13.33968], [1.21217, 13.37853], [1.18873, 13.31771], [0.99253, 13.37515], [0.99167, 13.10727], [2.26349, 12.41915], [2.05785, 12.35539], [2.39723, 11.89473], [2.45824, 11.98672], [2.39657, 12.10952], [2.37783, 12.24804], [2.6593, 12.30631], [2.83978, 12.40585], [3.25352, 12.01467], [3.31613, 11.88495], [3.48187, 11.86092], [3.59375, 11.70269], [3.61075, 11.69181], [3.67988, 11.75429], [3.67122, 11.80865], [3.63063, 11.83042], [3.61955, 11.91847], [3.67775, 11.97599], [3.63136, 12.11826], [3.66364, 12.25884], [3.65111, 12.52223], [3.94339, 12.74979], [4.10006, 12.98862], [4.14367, 13.17189], [4.14186, 13.47586], [4.23456, 13.47725], [4.4668, 13.68286], [4.87425, 13.78], [4.9368, 13.7345], [5.07396, 13.75052], [5.21026, 13.73627], [5.27797, 13.75474], [5.35437, 13.83567], [5.52957, 13.8845], [6.15771, 13.64564], [6.27411, 13.67835], [6.43053, 13.6006], [6.69617, 13.34057], [6.94445, 12.99825], [7.0521, 13.00076], [7.12676, 13.02445], [7.22399, 13.1293], [7.39241, 13.09717], [7.81085, 13.34902], [8.07997, 13.30847], [8.25185, 13.20369], [8.41853, 13.06166], [8.49493, 13.07519], [8.60431, 13.01768], [8.64251, 12.93985], [8.97413, 12.83661], [9.65995, 12.80614], [10.00373, 13.18171], [10.19993, 13.27129], [10.46731, 13.28819], [10.66004, 13.36422], [11.4535, 13.37773], [11.88236, 13.2527], [12.04209, 13.14452], [12.16189, 13.10056], [12.19315, 13.12423], [12.47095, 13.06673], [12.58033, 13.27805], [12.6793, 13.29157], [12.87376, 13.48919], [13.05085, 13.53984], [13.19844, 13.52802], [13.33213, 13.71195], [13.6302, 13.71094], [13.47559, 14.40881], [13.48259, 14.46704], [13.68573, 14.55276], [13.67878, 14.64013], [13.809, 14.72915], [13.78991, 14.87519], [13.86301, 15.04043], [14.37425, 15.72591], [15.50373, 16.89649], [15.6032, 18.77402], [15.75098, 19.93002], [15.99632, 20.35364], [15.6721, 20.70069], [15.59841, 20.74039], [15.56004, 20.79488], [15.55382, 20.86507], [15.57248, 20.92138], [15.62515, 20.95395], [15.28332, 21.44557], [15.20213, 21.49365], [15.19692, 21.99339], [14.99751, 23.00539], [14.22918, 22.61719]]]] } },
      { type: "Feature", properties: { iso1A2: "NF", iso1A3: "NFK", iso1N3: "574", wikidata: "Q31057", nameEn: "Norfolk Island", country: "AU", groups: ["053", "009", "UN"], driveSide: "left", callingCodes: ["672 3"] }, geometry: { type: "MultiPolygon", coordinates: [[[[169.82316, -28.16667], [166.29505, -28.29175], [167.94076, -30.60745], [169.82316, -28.16667]]]] } },
      { type: "Feature", properties: { iso1A2: "NG", iso1A3: "NGA", iso1N3: "566", wikidata: "Q1033", nameEn: "Nigeria", groups: ["011", "202", "002", "UN"], callingCodes: ["234"] }, geometry: { type: "MultiPolygon", coordinates: [[[[6.15771, 13.64564], [5.52957, 13.8845], [5.35437, 13.83567], [5.27797, 13.75474], [5.21026, 13.73627], [5.07396, 13.75052], [4.9368, 13.7345], [4.87425, 13.78], [4.4668, 13.68286], [4.23456, 13.47725], [4.14186, 13.47586], [4.14367, 13.17189], [4.10006, 12.98862], [3.94339, 12.74979], [3.65111, 12.52223], [3.66364, 12.25884], [3.63136, 12.11826], [3.67775, 11.97599], [3.61955, 11.91847], [3.63063, 11.83042], [3.67122, 11.80865], [3.67988, 11.75429], [3.61075, 11.69181], [3.59375, 11.70269], [3.49175, 11.29765], [3.71505, 11.13015], [3.84243, 10.59316], [3.78292, 10.40538], [3.6844, 10.46351], [3.57275, 10.27185], [3.66908, 10.18136], [3.54429, 9.87739], [3.35383, 9.83641], [3.32099, 9.78032], [3.34726, 9.70696], [3.25093, 9.61632], [3.13928, 9.47167], [3.14147, 9.28375], [3.08017, 9.10006], [2.77907, 9.06924], [2.67523, 7.87825], [2.73095, 7.7755], [2.73405, 7.5423], [2.78668, 7.5116], [2.79442, 7.43486], [2.74489, 7.42565], [2.76965, 7.13543], [2.71702, 6.95722], [2.74024, 6.92802], [2.73405, 6.78508], [2.78823, 6.76356], [2.78204, 6.70514], [2.7325, 6.64057], [2.74334, 6.57291], [2.70464, 6.50831], [2.70566, 6.38038], [2.74181, 6.13349], [5.87055, 3.78489], [8.34397, 4.30689], [8.60302, 4.87353], [8.78027, 5.1243], [8.92029, 5.58403], [8.83687, 5.68483], [8.88156, 5.78857], [8.84209, 5.82562], [9.51757, 6.43874], [9.70674, 6.51717], [9.77824, 6.79088], [9.86314, 6.77756], [10.15135, 7.03781], [10.21466, 6.88996], [10.53639, 6.93432], [10.57214, 7.16345], [10.59746, 7.14719], [10.60789, 7.06885], [10.83727, 6.9358], [10.8179, 6.83377], [10.94302, 6.69325], [11.09644, 6.68437], [11.09495, 6.51717], [11.42041, 6.53789], [11.42264, 6.5882], [11.51499, 6.60892], [11.57755, 6.74059], [11.55818, 6.86186], [11.63117, 6.9905], [11.87396, 7.09398], [11.84864, 7.26098], [11.93205, 7.47812], [12.01844, 7.52981], [11.99908, 7.67302], [12.20909, 7.97553], [12.19271, 8.10826], [12.24782, 8.17904], [12.26123, 8.43696], [12.4489, 8.52536], [12.44146, 8.6152], [12.68722, 8.65938], [12.71701, 8.7595], [12.79, 8.75361], [12.81085, 8.91992], [12.90022, 9.11411], [12.91958, 9.33905], [12.85628, 9.36698], [13.02385, 9.49334], [13.22642, 9.57266], [13.25472, 9.76795], [13.29941, 9.8296], [13.25025, 9.86042], [13.24132, 9.91031], [13.27409, 9.93232], [13.286, 9.9822], [13.25323, 10.00127], [13.25025, 10.03647], [13.34111, 10.12299], [13.43644, 10.13326], [13.5705, 10.53183], [13.54964, 10.61236], [13.73434, 10.9255], [13.70753, 10.94451], [13.7403, 11.00593], [13.78945, 11.00154], [13.97489, 11.30258], [14.17821, 11.23831], [14.6124, 11.51283], [14.64591, 11.66166], [14.55207, 11.72001], [14.61612, 11.7798], [14.6474, 12.17466], [14.4843, 12.35223], [14.22215, 12.36533], [14.17523, 12.41916], [14.20204, 12.53405], [14.08251, 13.0797], [13.6302, 13.71094], [13.33213, 13.71195], [13.19844, 13.52802], [13.05085, 13.53984], [12.87376, 13.48919], [12.6793, 13.29157], [12.58033, 13.27805], [12.47095, 13.06673], [12.19315, 13.12423], [12.16189, 13.10056], [12.04209, 13.14452], [11.88236, 13.2527], [11.4535, 13.37773], [10.66004, 13.36422], [10.46731, 13.28819], [10.19993, 13.27129], [10.00373, 13.18171], [9.65995, 12.80614], [8.97413, 12.83661], [8.64251, 12.93985], [8.60431, 13.01768], [8.49493, 13.07519], [8.41853, 13.06166], [8.25185, 13.20369], [8.07997, 13.30847], [7.81085, 13.34902], [7.39241, 13.09717], [7.22399, 13.1293], [7.12676, 13.02445], [7.0521, 13.00076], [6.94445, 12.99825], [6.69617, 13.34057], [6.43053, 13.6006], [6.27411, 13.67835], [6.15771, 13.64564]]]] } },
      { type: "Feature", properties: { iso1A2: "NI", iso1A3: "NIC", iso1N3: "558", wikidata: "Q811", nameEn: "Nicaragua", groups: ["013", "003", "419", "019", "UN"], callingCodes: ["505"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-83.13724, 15.00002], [-83.49268, 15.01158], [-83.62101, 14.89448], [-83.89551, 14.76697], [-84.10584, 14.76353], [-84.48373, 14.63249], [-84.70119, 14.68078], [-84.82596, 14.82212], [-84.90082, 14.80489], [-85.1575, 14.53934], [-85.18602, 14.24929], [-85.32149, 14.2562], [-85.45762, 14.11304], [-85.73964, 13.9698], [-85.75477, 13.8499], [-86.03458, 13.99181], [-86.00685, 14.08474], [-86.14801, 14.04317], [-86.35219, 13.77157], [-86.76812, 13.79605], [-86.71267, 13.30348], [-86.87066, 13.30641], [-86.93383, 13.18677], [-86.93197, 13.05313], [-87.03785, 12.98682], [-87.06306, 13.00892], [-87.37107, 12.98646], [-87.55124, 13.12523], [-87.7346, 13.13228], [-88.11443, 12.63306], [-86.14524, 11.09059], [-85.71223, 11.06868], [-85.60529, 11.22607], [-84.92439, 10.9497], [-84.68197, 11.07568], [-83.90838, 10.71161], [-83.66597, 10.79916], [-83.68276, 11.01562], [-82.56142, 11.91792], [-82.06974, 14.49418], [-83.04763, 15.03256], [-83.13724, 15.00002]]]] } },
      { type: "Feature", properties: { iso1A2: "NL", iso1A3: "NLD", iso1N3: "528", wikidata: "Q29999", nameEn: "Kingdom of the Netherlands" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "NO", iso1A3: "NOR", iso1N3: "578", wikidata: "Q20", nameEn: "Norway" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "NP", iso1A3: "NPL", iso1N3: "524", wikidata: "Q837", nameEn: "Nepal", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["977"] }, geometry: { type: "MultiPolygon", coordinates: [[[[88.13378, 27.88015], [87.82681, 27.95248], [87.72718, 27.80938], [87.56996, 27.84517], [87.11696, 27.84104], [87.03757, 27.94835], [86.75582, 28.04182], [86.74181, 28.10638], [86.56265, 28.09569], [86.51609, 27.96623], [86.42736, 27.91122], [86.22966, 27.9786], [86.18607, 28.17364], [86.088, 28.09264], [86.08333, 28.02121], [86.12069, 27.93047], [86.06309, 27.90021], [85.94946, 27.9401], [85.97813, 27.99023], [85.90743, 28.05144], [85.84672, 28.18187], [85.74864, 28.23126], [85.71907, 28.38064], [85.69105, 28.38475], [85.60854, 28.25045], [85.59765, 28.30529], [85.4233, 28.32996], [85.38127, 28.28336], [85.10729, 28.34092], [85.18668, 28.54076], [85.19135, 28.62825], [85.06059, 28.68562], [84.85511, 28.58041], [84.62317, 28.73887], [84.47528, 28.74023], [84.2231, 28.89571], [84.24801, 29.02783], [84.18107, 29.23451], [83.97559, 29.33091], [83.82303, 29.30513], [83.63156, 29.16249], [83.44787, 29.30513], [83.28131, 29.56813], [83.07116, 29.61957], [82.73024, 29.81695], [82.5341, 29.9735], [82.38622, 30.02608], [82.16984, 30.0692], [82.19475, 30.16884], [82.10757, 30.23745], [82.10135, 30.35439], [81.99082, 30.33423], [81.62033, 30.44703], [81.5459, 30.37688], [81.41018, 30.42153], [81.39928, 30.21862], [81.33355, 30.15303], [81.2623, 30.14596], [81.29032, 30.08806], [81.24362, 30.0126], [81.12842, 30.01395], [81.03953, 30.20059], [80.92547, 30.17193], [80.91143, 30.22173], [80.86673, 30.17321], [80.8778, 30.13384], [80.67076, 29.95732], [80.60226, 29.95732], [80.57179, 29.91422], [80.56247, 29.86661], [80.48997, 29.79566], [80.43458, 29.80466], [80.41554, 29.79451], [80.36803, 29.73865], [80.38428, 29.68513], [80.41858, 29.63581], [80.37939, 29.57098], [80.24322, 29.44299], [80.31428, 29.30784], [80.28626, 29.20327], [80.24112, 29.21414], [80.26602, 29.13938], [80.23178, 29.11626], [80.18085, 29.13649], [80.05743, 28.91479], [80.06957, 28.82763], [80.12125, 28.82346], [80.37188, 28.63371], [80.44504, 28.63098], [80.52443, 28.54897], [80.50575, 28.6706], [80.55142, 28.69182], [81.03471, 28.40054], [81.19847, 28.36284], [81.32923, 28.13521], [81.38683, 28.17638], [81.48179, 28.12148], [81.47867, 28.08303], [81.91223, 27.84995], [81.97214, 27.93322], [82.06554, 27.92222], [82.46405, 27.6716], [82.70378, 27.72122], [82.74119, 27.49838], [82.93261, 27.50328], [82.94938, 27.46036], [83.19413, 27.45632], [83.27197, 27.38309], [83.2673, 27.36235], [83.29999, 27.32778], [83.35136, 27.33885], [83.38872, 27.39276], [83.39495, 27.4798], [83.61288, 27.47013], [83.85595, 27.35797], [83.86182, 27.4241], [83.93306, 27.44939], [84.02229, 27.43836], [84.10791, 27.52399], [84.21376, 27.45218], [84.25735, 27.44941], [84.29315, 27.39], [84.62161, 27.33885], [84.69166, 27.21294], [84.64496, 27.04669], [84.793, 26.9968], [84.82913, 27.01989], [84.85754, 26.98984], [84.96687, 26.95599], [84.97186, 26.9149], [85.00536, 26.89523], [85.05592, 26.88991], [85.02635, 26.85381], [85.15883, 26.86966], [85.19291, 26.86909], [85.18046, 26.80519], [85.21159, 26.75933], [85.34302, 26.74954], [85.47752, 26.79292], [85.56471, 26.84133], [85.5757, 26.85955], [85.59461, 26.85161], [85.61621, 26.86721], [85.66239, 26.84822], [85.73483, 26.79613], [85.72315, 26.67471], [85.76907, 26.63076], [85.83126, 26.61134], [85.85126, 26.60866], [85.8492, 26.56667], [86.02729, 26.66756], [86.13596, 26.60651], [86.22513, 26.58863], [86.26235, 26.61886], [86.31564, 26.61925], [86.49726, 26.54218], [86.54258, 26.53819], [86.57073, 26.49825], [86.61313, 26.48658], [86.62686, 26.46891], [86.69124, 26.45169], [86.74025, 26.42386], [86.76797, 26.45892], [86.82898, 26.43919], [86.94543, 26.52076], [86.95912, 26.52076], [87.01559, 26.53228], [87.04691, 26.58685], [87.0707, 26.58571], [87.09147, 26.45039], [87.14751, 26.40542], [87.18863, 26.40558], [87.24682, 26.4143], [87.26587, 26.40592], [87.26568, 26.37294], [87.34568, 26.34787], [87.37314, 26.40815], [87.46566, 26.44058], [87.51571, 26.43106], [87.55274, 26.40596], [87.59175, 26.38342], [87.66803, 26.40294], [87.67893, 26.43501], [87.76004, 26.40711], [87.7918, 26.46737], [87.84193, 26.43663], [87.89085, 26.48565], [87.90115, 26.44923], [88.00895, 26.36029], [88.09414, 26.43732], [88.09963, 26.54195], [88.16452, 26.64111], [88.1659, 26.68177], [88.19107, 26.75516], [88.12302, 26.95324], [88.13422, 26.98705], [88.11719, 26.98758], [87.9887, 27.11045], [88.01587, 27.21388], [88.01646, 27.21612], [88.07277, 27.43007], [88.04008, 27.49223], [88.19107, 27.79285], [88.1973, 27.85067], [88.13378, 27.88015]]]] } },
      { type: "Feature", properties: { iso1A2: "NR", iso1A3: "NRU", iso1N3: "520", wikidata: "Q697", nameEn: "Nauru", groups: ["057", "009", "UN"], driveSide: "left", callingCodes: ["674"] }, geometry: { type: "MultiPolygon", coordinates: [[[[166.95155, 0.14829], [166.21778, -0.7977], [167.60042, -0.88259], [166.95155, 0.14829]]]] } },
      { type: "Feature", properties: { iso1A2: "NU", iso1A3: "NIU", iso1N3: "570", wikidata: "Q34020", nameEn: "Niue", country: "NZ", groups: ["061", "009", "UN"], driveSide: "left", callingCodes: ["683"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-170.83899, -18.53439], [-170.82274, -20.44429], [-168.63096, -18.60489], [-170.83899, -18.53439]]]] } },
      { type: "Feature", properties: { iso1A2: "NZ", iso1A3: "NZL", iso1N3: "554", wikidata: "Q664", nameEn: "New Zealand" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "OM", iso1A3: "OMN", iso1N3: "512", wikidata: "Q842", nameEn: "Oman", groups: ["145", "142", "UN"], callingCodes: ["968"] }, geometry: { type: "MultiPolygon", coordinates: [[[[56.82555, 25.7713], [56.79239, 26.41236], [56.68954, 26.76645], [56.2644, 26.58649], [55.81777, 26.18798], [56.08666, 26.05038], [56.15498, 26.06828], [56.19334, 25.9795], [56.13963, 25.82765], [56.17416, 25.77239], [56.13579, 25.73524], [56.14826, 25.66351], [56.18363, 25.65508], [56.20473, 25.61119], [56.25365, 25.60211], [56.26636, 25.60643], [56.25341, 25.61443], [56.26534, 25.62825], [56.82555, 25.7713]]], [[[56.26062, 25.33108], [56.23362, 25.31253], [56.25008, 25.28843], [56.24465, 25.27505], [56.20838, 25.25668], [56.20872, 25.24104], [56.24341, 25.22867], [56.27628, 25.23404], [56.34438, 25.26653], [56.35172, 25.30681], [56.3111, 25.30107], [56.3005, 25.31815], [56.26062, 25.33108]], [[56.28423, 25.26344], [56.27086, 25.26128], [56.2716, 25.27916], [56.28102, 25.28486], [56.29379, 25.2754], [56.28423, 25.26344]]], [[[61.45114, 22.55394], [56.86325, 25.03856], [56.3227, 24.97284], [56.34873, 24.93205], [56.30269, 24.88334], [56.20568, 24.85063], [56.20062, 24.78565], [56.13684, 24.73699], [56.06128, 24.74457], [56.03535, 24.81161], [55.97836, 24.87673], [55.97467, 24.89639], [56.05106, 24.87461], [56.05715, 24.95727], [55.96316, 25.00857], [55.90849, 24.96771], [55.85094, 24.96858], [55.81116, 24.9116], [55.81348, 24.80102], [55.83408, 24.77858], [55.83271, 24.68567], [55.76461, 24.5287], [55.83271, 24.41521], [55.83395, 24.32776], [55.80747, 24.31069], [55.79145, 24.27914], [55.76781, 24.26209], [55.75939, 24.26114], [55.75382, 24.2466], [55.75257, 24.23466], [55.76558, 24.23227], [55.77658, 24.23476], [55.83367, 24.20193], [55.95472, 24.2172], [56.01799, 24.07426], [55.8308, 24.01633], [55.73301, 24.05994], [55.48677, 23.94946], [55.57358, 23.669], [55.22634, 23.10378], [55.2137, 22.71065], [55.66469, 21.99658], [54.99756, 20.00083], [52.00311, 19.00083], [52.78009, 17.35124], [52.74267, 17.29519], [52.81185, 17.28568], [57.49095, 8.14549], [61.45114, 22.55394]]]] } },
      { type: "Feature", properties: { iso1A2: "PA", iso1A3: "PAN", iso1N3: "591", wikidata: "Q804", nameEn: "Panama", groups: ["013", "003", "419", "019", "UN"], callingCodes: ["507"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-77.32389, 8.81247], [-77.58292, 9.22278], [-78.79327, 9.93766], [-82.51044, 9.65379], [-82.56507, 9.57279], [-82.61345, 9.49881], [-82.66667, 9.49746], [-82.77206, 9.59573], [-82.87919, 9.62645], [-82.84871, 9.4973], [-82.93516, 9.46741], [-82.93516, 9.07687], [-82.72126, 8.97125], [-82.88253, 8.83331], [-82.91377, 8.774], [-82.92068, 8.74832], [-82.8794, 8.6981], [-82.82739, 8.60153], [-82.83975, 8.54755], [-82.83322, 8.52464], [-82.8382, 8.48117], [-82.8679, 8.44042], [-82.93056, 8.43465], [-83.05209, 8.33394], [-82.9388, 8.26634], [-82.88641, 8.10219], [-82.89137, 8.05755], [-82.89978, 8.04083], [-82.94503, 7.93865], [-82.13751, 6.97312], [-78.06168, 7.07793], [-77.89178, 7.22681], [-77.81426, 7.48319], [-77.72157, 7.47612], [-77.72514, 7.72348], [-77.57185, 7.51147], [-77.17257, 7.97422], [-77.45064, 8.49991], [-77.32389, 8.81247]]]] } },
      { type: "Feature", properties: { iso1A2: "PE", iso1A3: "PER", iso1N3: "604", wikidata: "Q419", nameEn: "Peru", groups: ["005", "419", "019", "UN"], callingCodes: ["51"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-74.26675, -0.97229], [-74.42701, -0.50218], [-75.18513, -0.0308], [-75.25764, -0.11943], [-75.40192, -0.17196], [-75.61997, -0.10012], [-75.60169, -0.18708], [-75.53615, -0.19213], [-75.22862, -0.60048], [-75.22862, -0.95588], [-75.3872, -0.9374], [-75.57429, -1.55961], [-76.05203, -2.12179], [-76.6324, -2.58397], [-77.94147, -3.05454], [-78.19369, -3.36431], [-78.14324, -3.47653], [-78.22642, -3.51113], [-78.24589, -3.39907], [-78.34362, -3.38633], [-78.68394, -4.60754], [-78.85149, -4.66795], [-79.01659, -5.01481], [-79.1162, -4.97774], [-79.26248, -4.95167], [-79.59402, -4.46848], [-79.79722, -4.47558], [-80.13945, -4.29786], [-80.39256, -4.48269], [-80.46386, -4.41516], [-80.32114, -4.21323], [-80.45023, -4.20938], [-80.4822, -4.05477], [-80.46386, -4.01342], [-80.13232, -3.90317], [-80.19926, -3.68894], [-80.18741, -3.63994], [-80.19848, -3.59249], [-80.21642, -3.5888], [-80.20535, -3.51667], [-80.22629, -3.501], [-80.23651, -3.48652], [-80.24586, -3.48677], [-80.24123, -3.46124], [-80.20647, -3.431], [-80.30602, -3.39149], [-84.52388, -3.36941], [-85.71054, -21.15413], [-70.59118, -18.35072], [-70.378, -18.3495], [-70.31267, -18.31258], [-70.16394, -18.31737], [-69.96732, -18.25992], [-69.81607, -18.12582], [-69.75305, -17.94605], [-69.82868, -17.72048], [-69.79087, -17.65563], [-69.66483, -17.65083], [-69.46897, -17.4988], [-69.46863, -17.37466], [-69.62883, -17.28142], [-69.16896, -16.72233], [-69.00853, -16.66769], [-69.04027, -16.57214], [-68.98358, -16.42165], [-68.79464, -16.33272], [-68.96238, -16.194], [-69.09986, -16.22693], [-69.20291, -16.16668], [-69.40336, -15.61358], [-69.14856, -15.23478], [-69.36254, -14.94634], [-68.88135, -14.18639], [-69.05265, -13.68546], [-68.8864, -13.40792], [-68.85615, -12.87769], [-68.65044, -12.50689], [-68.98115, -11.8979], [-69.57156, -10.94555], [-69.57835, -10.94051], [-69.90896, -10.92744], [-70.38791, -11.07096], [-70.51395, -10.92249], [-70.64134, -11.0108], [-70.62487, -9.80666], [-70.55429, -9.76692], [-70.58453, -9.58303], [-70.53373, -9.42628], [-71.23394, -9.9668], [-72.14742, -9.98049], [-72.31883, -9.5184], [-72.72216, -9.41397], [-73.21498, -9.40904], [-72.92886, -9.04074], [-73.76576, -7.89884], [-73.65485, -7.77897], [-73.96938, -7.58465], [-73.77011, -7.28944], [-73.73986, -6.87919], [-73.12983, -6.43852], [-73.24579, -6.05764], [-72.83973, -5.14765], [-72.64391, -5.0391], [-71.87003, -4.51661], [-70.96814, -4.36915], [-70.77601, -4.15717], [-70.33236, -4.15214], [-70.19582, -4.3607], [-70.11305, -4.27281], [-70.00888, -4.37833], [-69.94708, -4.2431], [-70.3374, -3.79505], [-70.52393, -3.87553], [-70.71396, -3.7921], [-70.04609, -2.73906], [-70.94377, -2.23142], [-71.75223, -2.15058], [-72.92587, -2.44514], [-73.65312, -1.26222], [-74.26675, -0.97229]]]] } },
      { type: "Feature", properties: { iso1A2: "PF", iso1A3: "PYF", iso1N3: "258", wikidata: "Q30971", nameEn: "French Polynesia", country: "FR", groups: ["Q1451600", "061", "009", "UN"], callingCodes: ["689"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-135.59706, -4.70473], [-156.48634, -15.52824], [-156.45576, -31.75456], [-133.59543, -28.4709], [-135.59706, -4.70473]]]] } },
      { type: "Feature", properties: { iso1A2: "PG", iso1A3: "PNG", iso1N3: "598", wikidata: "Q691", nameEn: "Papua New Guinea", groups: ["054", "009", "UN"], driveSide: "left", callingCodes: ["675"] }, geometry: { type: "MultiPolygon", coordinates: [[[[141.03157, 2.12829], [140.99813, -6.3233], [140.85295, -6.72996], [140.90448, -6.85033], [141.01763, -6.90181], [141.01842, -9.35091], [141.88934, -9.36111], [142.19246, -9.15378], [142.48658, -9.36754], [143.29772, -9.33993], [143.87386, -9.02382], [145.2855, -9.62524], [156.73836, -14.50464], [154.74815, -7.33315], [155.60735, -6.92266], [155.69784, -6.92661], [155.92557, -6.84664], [156.03993, -6.65703], [156.03296, -6.55528], [160.43769, -4.17974], [141.03157, 2.12829]]]] } },
      { type: "Feature", properties: { iso1A2: "PH", iso1A3: "PHL", iso1N3: "608", wikidata: "Q928", nameEn: "Philippines", aliases: ["PI", "RP"], groups: ["035", "142", "UN"], callingCodes: ["63"] }, geometry: { type: "MultiPolygon", coordinates: [[[[129.19694, 7.84182], [121.8109, 21.77688], [120.69238, 21.52331], [118.82252, 14.67191], [115.39742, 10.92666], [116.79524, 7.43869], [117.17735, 7.52841], [117.93857, 6.89845], [117.98544, 6.27477], [119.52945, 5.35672], [118.93936, 4.09009], [118.06469, 4.16638], [121.14448, 2.12444], [129.19694, 7.84182]]]] } },
      { type: "Feature", properties: { iso1A2: "PK", iso1A3: "PAK", iso1N3: "586", wikidata: "Q843", nameEn: "Pakistan", groups: ["034", "142", "UN"], driveSide: "left", callingCodes: ["92"] }, geometry: { type: "MultiPolygon", coordinates: [[[[75.72737, 36.7529], [75.45562, 36.71971], [75.40481, 36.95382], [75.13839, 37.02622], [74.56453, 37.03023], [74.53739, 36.96224], [74.43389, 37.00977], [74.04856, 36.82648], [73.82685, 36.91421], [72.6323, 36.84601], [72.18135, 36.71838], [71.80267, 36.49924], [71.60491, 36.39429], [71.19505, 36.04134], [71.37969, 35.95865], [71.55273, 35.71483], [71.49917, 35.6267], [71.65435, 35.4479], [71.54294, 35.31037], [71.5541, 35.28776], [71.67495, 35.21262], [71.52938, 35.09023], [71.55273, 35.02615], [71.49917, 35.00478], [71.50329, 34.97328], [71.29472, 34.87728], [71.28356, 34.80882], [71.08718, 34.69034], [71.11602, 34.63047], [71.0089, 34.54568], [71.02401, 34.44835], [71.17662, 34.36769], [71.12815, 34.26619], [71.13078, 34.16503], [71.09453, 34.13524], [71.09307, 34.11961], [71.06933, 34.10564], [71.07345, 34.06242], [70.88119, 33.97933], [70.54336, 33.9463], [69.90203, 34.04194], [69.87307, 33.9689], [69.85671, 33.93719], [70.00503, 33.73528], [70.14236, 33.71701], [70.14785, 33.6553], [70.20141, 33.64387], [70.17062, 33.53535], [70.32775, 33.34496], [70.13686, 33.21064], [70.07369, 33.22557], [70.02563, 33.14282], [69.85259, 33.09451], [69.79766, 33.13247], [69.71526, 33.09911], [69.57656, 33.09911], [69.49004, 33.01509], [69.49854, 32.88843], [69.5436, 32.8768], [69.47082, 32.85834], [69.38018, 32.76601], [69.43649, 32.7302], [69.44747, 32.6678], [69.38155, 32.56601], [69.2868, 32.53938], [69.23599, 32.45946], [69.27932, 32.29119], [69.27032, 32.14141], [69.3225, 31.93186], [69.20577, 31.85957], [69.11514, 31.70782], [69.00939, 31.62249], [68.95995, 31.64822], [68.91078, 31.59687], [68.79997, 31.61665], [68.6956, 31.75687], [68.57475, 31.83158], [68.44222, 31.76446], [68.27605, 31.75863], [68.25614, 31.80357], [68.1655, 31.82691], [68.00071, 31.6564], [67.86887, 31.63536], [67.72056, 31.52304], [67.58323, 31.52772], [67.62374, 31.40473], [67.7748, 31.4188], [67.78854, 31.33203], [67.29964, 31.19586], [67.03323, 31.24519], [67.04147, 31.31561], [66.83273, 31.26867], [66.72561, 31.20526], [66.68166, 31.07597], [66.58175, 30.97532], [66.42645, 30.95309], [66.39194, 30.9408], [66.28413, 30.57001], [66.34869, 30.404], [66.23609, 30.06321], [66.36042, 29.9583], [66.24175, 29.85181], [65.04005, 29.53957], [64.62116, 29.58903], [64.19796, 29.50407], [64.12966, 29.39157], [63.5876, 29.50456], [62.47751, 29.40782], [60.87231, 29.86514], [61.31508, 29.38903], [61.53765, 29.00507], [61.65978, 28.77937], [61.93581, 28.55284], [62.40259, 28.42703], [62.59499, 28.24842], [62.79412, 28.28108], [62.7638, 28.02992], [62.84905, 27.47627], [62.79684, 27.34381], [62.80604, 27.22412], [63.19649, 27.25674], [63.32283, 27.14437], [63.25005, 27.08692], [63.25005, 26.84212], [63.18688, 26.83844], [63.1889, 26.65072], [62.77352, 26.64099], [62.31484, 26.528], [62.21304, 26.26601], [62.05117, 26.31647], [61.89391, 26.26251], [61.83831, 26.07249], [61.83968, 25.7538], [61.683, 25.66638], [61.6433, 25.27541], [61.46682, 24.57869], [68.11329, 23.53945], [68.20763, 23.85849], [68.39339, 23.96838], [68.74643, 23.97027], [68.7416, 24.31904], [68.90914, 24.33156], [68.97781, 24.26021], [69.07806, 24.29777], [69.19341, 24.25646], [69.29778, 24.28712], [69.59579, 24.29777], [69.73335, 24.17007], [70.03428, 24.172], [70.11712, 24.30915], [70.5667, 24.43787], [70.57906, 24.27774], [70.71502, 24.23517], [70.88393, 24.27398], [70.85784, 24.30903], [70.94985, 24.3791], [71.04461, 24.34657], [71.12838, 24.42662], [71.00341, 24.46038], [70.97594, 24.60904], [71.09405, 24.69017], [70.94002, 24.92843], [70.89148, 25.15064], [70.66695, 25.39314], [70.67382, 25.68186], [70.60378, 25.71898], [70.53649, 25.68928], [70.37444, 25.67443], [70.2687, 25.71156], [70.0985, 25.93238], [70.08193, 26.08094], [70.17532, 26.24118], [70.17532, 26.55362], [70.05584, 26.60398], [69.88555, 26.56836], [69.50904, 26.74892], [69.58519, 27.18109], [70.03136, 27.56627], [70.12502, 27.8057], [70.37307, 28.01208], [70.60927, 28.02178], [70.79054, 27.68423], [71.89921, 27.96035], [71.9244, 28.11555], [72.20329, 28.3869], [72.29495, 28.66367], [72.40402, 28.78283], [72.94272, 29.02487], [73.01337, 29.16422], [73.05886, 29.1878], [73.28094, 29.56646], [73.3962, 29.94707], [73.58665, 30.01848], [73.80299, 30.06969], [73.97225, 30.19829], [73.95736, 30.28466], [73.88993, 30.36305], [74.5616, 31.04153], [74.67971, 31.05479], [74.6852, 31.12771], [74.60006, 31.13711], [74.60281, 31.10419], [74.56023, 31.08303], [74.51629, 31.13829], [74.53223, 31.30321], [74.59773, 31.4136], [74.64713, 31.45605], [74.59319, 31.50197], [74.61517, 31.55698], [74.57498, 31.60382], [74.47771, 31.72227], [74.58907, 31.87824], [74.79919, 31.95983], [74.86236, 32.04485], [74.9269, 32.0658], [75.00793, 32.03786], [75.25649, 32.10187], [75.38046, 32.26836], [75.28259, 32.36556], [75.03265, 32.49538], [74.97634, 32.45367], [74.84725, 32.49075], [74.68362, 32.49298], [74.67431, 32.56676], [74.65251, 32.56416], [74.64424, 32.60985], [74.69542, 32.66792], [74.65345, 32.71225], [74.7113, 32.84219], [74.64675, 32.82604], [74.6289, 32.75561], [74.45312, 32.77755], [74.41467, 32.90563], [74.31227, 32.92795], [74.34875, 32.97823], [74.31854, 33.02891], [74.17571, 33.07495], [74.15374, 33.13477], [74.02144, 33.18908], [74.01366, 33.25199], [74.08782, 33.26232], [74.17983, 33.3679], [74.18121, 33.4745], [74.10115, 33.56392], [74.03576, 33.56718], [73.97367, 33.64061], [73.98968, 33.66155], [73.96423, 33.73071], [74.00891, 33.75437], [74.05898, 33.82089], [74.14001, 33.83002], [74.26086, 33.92237], [74.25262, 34.01577], [74.21554, 34.03853], [73.91341, 34.01235], [73.88732, 34.05105], [73.90677, 34.10504], [73.98208, 34.2522], [73.90517, 34.35317], [73.8475, 34.32935], [73.74862, 34.34183], [73.74999, 34.3781], [73.88732, 34.48911], [73.89419, 34.54568], [73.93951, 34.57169], [73.93401, 34.63386], [73.96423, 34.68244], [74.12897, 34.70073], [74.31239, 34.79626], [74.58083, 34.77386], [74.6663, 34.703], [75.01479, 34.64629], [75.38009, 34.55021], [75.75438, 34.51827], [76.04614, 34.67566], [76.15463, 34.6429], [76.47186, 34.78965], [76.67648, 34.76371], [76.74377, 34.84039], [76.74514, 34.92488], [76.87193, 34.96906], [76.99251, 34.93349], [77.11796, 35.05419], [76.93465, 35.39866], [76.85088, 35.39754], [76.75475, 35.52617], [76.77323, 35.66062], [76.50961, 35.8908], [76.33453, 35.84296], [76.14913, 35.82848], [76.15325, 35.9264], [75.93028, 36.13136], [76.00906, 36.17511], [76.0324, 36.41198], [75.92391, 36.56986], [75.72737, 36.7529]]]] } },
      { type: "Feature", properties: { iso1A2: "PL", iso1A3: "POL", iso1N3: "616", wikidata: "Q36", nameEn: "Poland", groups: ["EU", "151", "150", "UN"], callingCodes: ["48"] }, geometry: { type: "MultiPolygon", coordinates: [[[[18.57853, 55.25302], [14.20811, 54.12784], [14.22634, 53.9291], [14.20647, 53.91671], [14.18544, 53.91258], [14.20823, 53.90776], [14.21323, 53.8664], [14.27249, 53.74464], [14.26782, 53.69866], [14.2836, 53.67721], [14.27133, 53.66613], [14.28477, 53.65955], [14.2853, 53.63392], [14.31904, 53.61581], [14.30416, 53.55499], [14.3273, 53.50587], [14.35209, 53.49506], [14.4215, 53.27724], [14.44133, 53.27427], [14.45125, 53.26241], [14.40662, 53.21098], [14.37853, 53.20405], [14.36696, 53.16444], [14.38679, 53.13669], [14.35044, 53.05829], [14.25954, 53.00264], [14.14056, 52.95786], [14.15873, 52.87715], [14.12256, 52.84311], [14.13806, 52.82392], [14.22071, 52.81175], [14.61073, 52.59847], [14.6289, 52.57136], [14.60081, 52.53116], [14.63056, 52.48993], [14.54423, 52.42568], [14.55228, 52.35264], [14.56378, 52.33838], [14.58149, 52.28007], [14.70139, 52.25038], [14.71319, 52.22144], [14.68344, 52.19612], [14.70616, 52.16927], [14.67683, 52.13936], [14.6917, 52.10283], [14.72971, 52.09167], [14.76026, 52.06624], [14.71339, 52.00337], [14.70488, 51.97679], [14.7139, 51.95643], [14.71836, 51.95606], [14.72163, 51.95188], [14.7177, 51.94048], [14.70601, 51.92944], [14.6933, 51.9044], [14.6588, 51.88359], [14.59089, 51.83302], [14.60493, 51.80473], [14.64625, 51.79472], [14.66386, 51.73282], [14.69065, 51.70842], [14.75392, 51.67445], [14.75759, 51.62318], [14.7727, 51.61263], [14.71125, 51.56209], [14.73047, 51.54606], [14.72652, 51.53902], [14.73219, 51.52922], [14.94749, 51.47155], [14.9652, 51.44793], [14.96899, 51.38367], [14.98008, 51.33449], [15.04288, 51.28387], [15.01242, 51.21285], [15.0047, 51.16874], [14.99311, 51.16249], [14.99414, 51.15813], [15.00083, 51.14974], [14.99646, 51.14365], [14.99079, 51.14284], [14.99689, 51.12205], [14.98229, 51.11354], [14.97938, 51.07742], [14.95529, 51.04552], [14.92942, 50.99744], [14.89252, 50.94999], [14.89681, 50.9422], [14.81664, 50.88148], [14.82803, 50.86966], [14.99852, 50.86817], [15.01088, 50.97984], [14.96419, 50.99108], [15.02433, 51.0242], [15.03895, 51.0123], [15.06218, 51.02269], [15.10152, 51.01095], [15.11937, 50.99021], [15.16744, 51.01959], [15.1743, 50.9833], [15.2361, 50.99886], [15.27043, 50.97724], [15.2773, 50.8907], [15.36656, 50.83956], [15.3803, 50.77187], [15.43798, 50.80833], [15.73186, 50.73885], [15.81683, 50.75666], [15.87331, 50.67188], [15.97219, 50.69799], [16.0175, 50.63009], [15.98317, 50.61528], [16.02437, 50.60046], [16.10265, 50.66405], [16.20839, 50.63096], [16.23174, 50.67101], [16.33611, 50.66579], [16.44597, 50.58041], [16.34572, 50.49575], [16.31413, 50.50274], [16.19526, 50.43291], [16.21585, 50.40627], [16.22821, 50.41054], [16.28118, 50.36891], [16.30289, 50.38292], [16.36495, 50.37679], [16.3622, 50.34875], [16.39379, 50.3207], [16.42674, 50.32509], [16.56407, 50.21009], [16.55446, 50.16613], [16.63137, 50.1142], [16.7014, 50.09659], [16.8456, 50.20834], [16.98018, 50.24172], [17.00353, 50.21449], [17.02825, 50.23118], [16.99803, 50.25753], [17.02138, 50.27772], [16.99803, 50.30316], [16.94448, 50.31281], [16.90877, 50.38642], [16.85933, 50.41093], [16.89229, 50.45117], [17.1224, 50.39494], [17.14498, 50.38117], [17.19579, 50.38817], [17.19991, 50.3654], [17.27681, 50.32246], [17.34273, 50.32947], [17.34548, 50.2628], [17.3702, 50.28123], [17.58889, 50.27837], [17.67764, 50.28977], [17.69292, 50.32859], [17.74648, 50.29966], [17.72176, 50.25665], [17.76296, 50.23382], [17.70528, 50.18812], [17.59404, 50.16437], [17.66683, 50.10275], [17.6888, 50.12037], [17.7506, 50.07896], [17.77669, 50.02253], [17.86886, 49.97452], [18.00191, 50.01723], [18.04585, 50.01194], [18.04585, 50.03311], [18.00396, 50.04954], [18.03212, 50.06574], [18.07898, 50.04535], [18.10628, 50.00223], [18.20241, 49.99958], [18.21752, 49.97309], [18.27107, 49.96779], [18.27794, 49.93863], [18.31914, 49.91565], [18.33278, 49.92415], [18.33562, 49.94747], [18.41604, 49.93498], [18.53423, 49.89906], [18.54495, 49.9079], [18.54299, 49.92537], [18.57697, 49.91565], [18.57045, 49.87849], [18.60341, 49.86256], [18.57183, 49.83334], [18.61278, 49.7618], [18.61368, 49.75426], [18.62645, 49.75002], [18.62943, 49.74603], [18.62676, 49.71983], [18.69817, 49.70473], [18.72838, 49.68163], [18.80479, 49.6815], [18.84786, 49.5446], [18.84521, 49.51672], [18.94536, 49.52143], [18.97283, 49.49914], [18.9742, 49.39557], [19.18019, 49.41165], [19.25435, 49.53391], [19.36009, 49.53747], [19.37795, 49.574], [19.45348, 49.61583], [19.52626, 49.57311], [19.53313, 49.52856], [19.57845, 49.46077], [19.64162, 49.45184], [19.6375, 49.40897], [19.72127, 49.39288], [19.78581, 49.41701], [19.82237, 49.27806], [19.75286, 49.20751], [19.86409, 49.19316], [19.90529, 49.23532], [19.98494, 49.22904], [20.08238, 49.1813], [20.13738, 49.31685], [20.21977, 49.35265], [20.31453, 49.34817], [20.31728, 49.39914], [20.39939, 49.3896], [20.46422, 49.41612], [20.5631, 49.375], [20.61666, 49.41791], [20.72274, 49.41813], [20.77971, 49.35383], [20.9229, 49.29626], [20.98733, 49.30774], [21.09799, 49.37176], [21.041, 49.41791], [21.12477, 49.43666], [21.19756, 49.4054], [21.27858, 49.45988], [21.43376, 49.41433], [21.62328, 49.4447], [21.77983, 49.35443], [21.82927, 49.39467], [21.96385, 49.3437], [22.04427, 49.22136], [22.56155, 49.08865], [22.89122, 49.00725], [22.86336, 49.10513], [22.72009, 49.20288], [22.748, 49.32759], [22.69444, 49.49378], [22.64534, 49.53094], [22.78304, 49.65543], [22.80261, 49.69098], [22.83179, 49.69875], [22.99329, 49.84249], [23.28221, 50.0957], [23.67635, 50.33385], [23.71382, 50.38248], [23.79445, 50.40481], [23.99563, 50.41289], [24.03668, 50.44507], [24.07048, 50.5071], [24.0996, 50.60752], [24.0595, 50.71625], [23.95925, 50.79271], [23.99254, 50.83847], [24.0952, 50.83262], [24.14524, 50.86128], [24.04576, 50.90196], [23.92217, 51.00836], [23.90376, 51.07697], [23.80678, 51.18405], [23.63858, 51.32182], [23.69905, 51.40871], [23.62751, 51.50512], [23.56236, 51.53673], [23.57053, 51.55938], [23.53198, 51.74298], [23.62691, 51.78208], [23.61523, 51.92066], [23.68733, 51.9906], [23.64066, 52.07626], [23.61, 52.11264], [23.54314, 52.12148], [23.47859, 52.18215], [23.20071, 52.22848], [23.18196, 52.28812], [23.34141, 52.44845], [23.45112, 52.53774], [23.58296, 52.59868], [23.73615, 52.6149], [23.93763, 52.71332], [23.91805, 52.94016], [23.94689, 52.95919], [23.92184, 53.02079], [23.87548, 53.0831], [23.91393, 53.16469], [23.85657, 53.22923], [23.81995, 53.24131], [23.62004, 53.60942], [23.51284, 53.95052], [23.48261, 53.98855], [23.52702, 54.04622], [23.49196, 54.14764], [23.45223, 54.17775], [23.42418, 54.17911], [23.39525, 54.21672], [23.3494, 54.25155], [23.24656, 54.25701], [23.15938, 54.29894], [23.15526, 54.31076], [23.13905, 54.31567], [23.104, 54.29794], [23.04323, 54.31567], [23.05726, 54.34565], [22.99649, 54.35927], [23.00584, 54.38514], [22.83756, 54.40827], [22.79705, 54.36264], [21.41123, 54.32395], [20.63871, 54.3706], [19.8038, 54.44203], [19.64312, 54.45423], [18.57853, 55.25302]]]] } },
      { type: "Feature", properties: { iso1A2: "PM", iso1A3: "SPM", iso1N3: "666", wikidata: "Q34617", nameEn: "Saint Pierre and Miquelon", country: "FR", groups: ["Q1451600", "021", "003", "019", "UN"], callingCodes: ["508"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-56.72993, 46.65575], [-55.90758, 46.6223], [-56.27503, 47.39728], [-56.72993, 46.65575]]]] } },
      { type: "Feature", properties: { iso1A2: "PN", iso1A3: "PCN", iso1N3: "612", wikidata: "Q35672", nameEn: "Pitcairn Islands", country: "GB", groups: ["BOTS", "061", "009", "UN"], driveSide: "left", callingCodes: ["64"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-133.59543, -28.4709], [-122.0366, -24.55017], [-133.61511, -21.93325], [-133.59543, -28.4709]]]] } },
      { type: "Feature", properties: { iso1A2: "PR", iso1A3: "PRI", iso1N3: "630", wikidata: "Q1183", nameEn: "Puerto Rico", aliases: ["US-PR"], country: "US", groups: ["Q1352230", "029", "003", "419", "019", "UN"], roadSpeedUnit: "mph", callingCodes: ["1 787", "1 939"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-65.27974, 17.56928], [-65.02435, 18.73231], [-67.99519, 18.97186], [-68.23894, 17.84663], [-65.27974, 17.56928]]]] } },
      { type: "Feature", properties: { iso1A2: "PS", iso1A3: "PSE", iso1N3: "275", wikidata: "Q219060", nameEn: "Palestine" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "PT", iso1A3: "PRT", iso1N3: "620", wikidata: "Q45", nameEn: "Portugal" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "PW", iso1A3: "PLW", iso1N3: "585", wikidata: "Q695", nameEn: "Palau", groups: ["057", "009", "UN"], roadSpeedUnit: "mph", callingCodes: ["680"] }, geometry: { type: "MultiPolygon", coordinates: [[[[128.97621, 3.08804], [136.39296, 1.54187], [136.04605, 12.45908], [128.97621, 3.08804]]]] } },
      { type: "Feature", properties: { iso1A2: "PY", iso1A3: "PRY", iso1N3: "600", wikidata: "Q733", nameEn: "Paraguay", groups: ["005", "419", "019", "UN"], callingCodes: ["595"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-58.16225, -20.16193], [-58.23216, -19.80058], [-59.06965, -19.29148], [-60.00638, -19.2981], [-61.73723, -19.63958], [-61.93912, -20.10053], [-62.26883, -20.55311], [-62.2757, -21.06657], [-62.64455, -22.25091], [-62.51761, -22.37684], [-62.22768, -22.55807], [-61.9756, -23.0507], [-61.0782, -23.62932], [-60.99754, -23.80934], [-60.28163, -24.04436], [-60.03367, -24.00701], [-59.45482, -24.34787], [-59.33886, -24.49935], [-58.33055, -24.97099], [-58.25492, -24.92528], [-57.80821, -25.13863], [-57.57431, -25.47269], [-57.87176, -25.93604], [-58.1188, -26.16704], [-58.3198, -26.83443], [-58.65321, -27.14028], [-58.59549, -27.29973], [-58.04205, -27.2387], [-56.85337, -27.5165], [-56.18313, -27.29851], [-55.89195, -27.3467], [-55.74475, -27.44485], [-55.59094, -27.32444], [-55.62322, -27.1941], [-55.39611, -26.97679], [-55.25243, -26.93808], [-55.16948, -26.96068], [-55.06351, -26.80195], [-55.00584, -26.78754], [-54.80868, -26.55669], [-54.70732, -26.45099], [-54.69333, -26.37705], [-54.67359, -25.98607], [-54.60664, -25.9691], [-54.62063, -25.91213], [-54.59398, -25.59224], [-54.59509, -25.53696], [-54.60196, -25.48397], [-54.62033, -25.46026], [-54.4423, -25.13381], [-54.28207, -24.07305], [-54.32807, -24.01865], [-54.6238, -23.83078], [-55.02691, -23.97317], [-55.0518, -23.98666], [-55.12292, -23.99669], [-55.41784, -23.9657], [-55.44117, -23.9185], [-55.43585, -23.87157], [-55.5555, -23.28237], [-55.52288, -23.2595], [-55.5446, -23.22811], [-55.63849, -22.95122], [-55.62493, -22.62765], [-55.68742, -22.58407], [-55.6986, -22.56268], [-55.72366, -22.5519], [-55.741, -22.52018], [-55.74941, -22.46436], [-55.8331, -22.29008], [-56.23206, -22.25347], [-56.45893, -22.08072], [-56.5212, -22.11556], [-56.6508, -22.28387], [-57.98625, -22.09157], [-57.94642, -21.73799], [-57.88239, -21.6868], [-57.93492, -21.65505], [-57.84536, -20.93155], [-58.16225, -20.16193]]]] } },
      { type: "Feature", properties: { iso1A2: "QA", iso1A3: "QAT", iso1N3: "634", wikidata: "Q846", nameEn: "Qatar", groups: ["145", "142", "UN"], callingCodes: ["974"] }, geometry: { type: "MultiPolygon", coordinates: [[[[50.92992, 24.54396], [51.09638, 24.46907], [51.29972, 24.50747], [51.39468, 24.62785], [51.58834, 24.66608], [51.83108, 24.71675], [51.83682, 26.70231], [50.93865, 26.30758], [50.81266, 25.88946], [50.86149, 25.6965], [50.7801, 25.595], [50.80824, 25.54641], [50.57069, 25.57887], [50.8133, 24.74049], [50.92992, 24.54396]]]] } },
      { type: "Feature", properties: { iso1A2: "RE", iso1A3: "REU", iso1N3: "638", wikidata: "Q17070", nameEn: "R\xE9union", country: "FR", groups: ["Q3320166", "EU", "014", "202", "002", "UN"], callingCodes: ["262"] }, geometry: { type: "MultiPolygon", coordinates: [[[[53.37984, -21.23941], [56.73473, -21.9174], [56.62373, -20.2711], [53.37984, -21.23941]]]] } },
      { type: "Feature", properties: { iso1A2: "RO", iso1A3: "ROU", iso1N3: "642", wikidata: "Q218", nameEn: "Romania", groups: ["EU", "151", "150", "UN"], callingCodes: ["40"] }, geometry: { type: "MultiPolygon", coordinates: [[[[27.15622, 47.98538], [27.02985, 48.09083], [27.04118, 48.12522], [26.96119, 48.13003], [26.98042, 48.15752], [26.94265, 48.1969], [26.87708, 48.19919], [26.81161, 48.25049], [26.62823, 48.25804], [26.55202, 48.22445], [26.33504, 48.18418], [26.17711, 47.99246], [26.05901, 47.9897], [25.77723, 47.93919], [25.63878, 47.94924], [25.23778, 47.89403], [25.11144, 47.75203], [24.88896, 47.7234], [24.81893, 47.82031], [24.70632, 47.84428], [24.61994, 47.95062], [24.43578, 47.97131], [24.34926, 47.9244], [24.22566, 47.90231], [24.11281, 47.91487], [24.06466, 47.95317], [24.02999, 47.95087], [24.00801, 47.968], [23.98553, 47.96076], [23.96337, 47.96672], [23.94192, 47.94868], [23.89352, 47.94512], [23.8602, 47.9329], [23.80904, 47.98142], [23.75188, 47.99705], [23.66262, 47.98786], [23.63894, 48.00293], [23.5653, 48.00499], [23.52803, 48.01818], [23.4979, 47.96858], [23.33577, 48.0237], [23.27397, 48.08245], [23.15999, 48.12188], [23.1133, 48.08061], [23.08858, 48.00716], [23.0158, 47.99338], [22.92241, 48.02002], [22.94301, 47.96672], [22.89849, 47.95851], [22.77991, 47.87211], [22.76617, 47.8417], [22.67247, 47.7871], [22.46559, 47.76583], [22.41979, 47.7391], [22.31816, 47.76126], [22.00917, 47.50492], [22.03389, 47.42508], [22.01055, 47.37767], [21.94463, 47.38046], [21.78395, 47.11104], [21.648, 47.03902], [21.68645, 46.99595], [21.59581, 46.91628], [21.59307, 46.86935], [21.52028, 46.84118], [21.48935, 46.7577], [21.5151, 46.72147], [21.43926, 46.65109], [21.33214, 46.63035], [21.26929, 46.4993], [21.28061, 46.44941], [21.16872, 46.30118], [21.06572, 46.24897], [20.86797, 46.28884], [20.74574, 46.25467], [20.76085, 46.21002], [20.63863, 46.12728], [20.49718, 46.18721], [20.45377, 46.14405], [20.35573, 46.16629], [20.28324, 46.1438], [20.26068, 46.12332], [20.35862, 45.99356], [20.54818, 45.89939], [20.65645, 45.82801], [20.70069, 45.7493], [20.77416, 45.75601], [20.78446, 45.78522], [20.82364, 45.77738], [20.80361, 45.65875], [20.76798, 45.60969], [20.83321, 45.53567], [20.77217, 45.49788], [20.86026, 45.47295], [20.87948, 45.42743], [21.09894, 45.30144], [21.17612, 45.32566], [21.20392, 45.2677], [21.29398, 45.24148], [21.48278, 45.19557], [21.51299, 45.15345], [21.4505, 45.04294], [21.35855, 45.01941], [21.54938, 44.9327], [21.56328, 44.89502], [21.48202, 44.87199], [21.44013, 44.87613], [21.35643, 44.86364], [21.38802, 44.78133], [21.55007, 44.77304], [21.60019, 44.75208], [21.61942, 44.67059], [21.67504, 44.67107], [21.71692, 44.65349], [21.7795, 44.66165], [21.99364, 44.63395], [22.08016, 44.49844], [22.13234, 44.47444], [22.18315, 44.48179], [22.30844, 44.6619], [22.45301, 44.7194], [22.61917, 44.61489], [22.69196, 44.61587], [22.76749, 44.54446], [22.70981, 44.51852], [22.61368, 44.55719], [22.56493, 44.53419], [22.54021, 44.47836], [22.45436, 44.47258], [22.56012, 44.30712], [22.68166, 44.28206], [22.67173, 44.21564], [23.04988, 44.07694], [23.01674, 44.01946], [22.87873, 43.9844], [22.83753, 43.88055], [22.85314, 43.84452], [23.05288, 43.79494], [23.26772, 43.84843], [23.4507, 43.84936], [23.61687, 43.79289], [23.73978, 43.80627], [24.18149, 43.68218], [24.35364, 43.70211], [24.50264, 43.76314], [24.62281, 43.74082], [24.73542, 43.68523], [24.96682, 43.72693], [25.10718, 43.6831], [25.17144, 43.70261], [25.39528, 43.61866], [25.72792, 43.69263], [25.94911, 43.85745], [26.05584, 43.90925], [26.10115, 43.96908], [26.38764, 44.04356], [26.62712, 44.05698], [26.95141, 44.13555], [27.26845, 44.12602], [27.39757, 44.0141], [27.60834, 44.01206], [27.64542, 44.04958], [27.73468, 43.95326], [27.92008, 44.00761], [27.99558, 43.84193], [28.23293, 43.76], [29.24336, 43.70874], [30.04414, 45.08461], [29.69272, 45.19227], [29.65428, 45.25629], [29.68175, 45.26885], [29.59798, 45.38857], [29.42632, 45.44545], [29.24779, 45.43388], [28.96077, 45.33164], [28.94292, 45.28045], [28.81383, 45.3384], [28.78911, 45.24179], [28.71358, 45.22631], [28.5735, 45.24759], [28.34554, 45.32102], [28.28504, 45.43907], [28.21139, 45.46895], [28.18741, 45.47358], [28.08927, 45.6051], [28.16568, 45.6421], [28.13111, 45.92819], [28.08612, 46.01105], [28.13684, 46.18099], [28.10937, 46.22852], [28.19864, 46.31869], [28.18902, 46.35283], [28.25769, 46.43334], [28.22281, 46.50481], [28.24808, 46.64305], [28.12173, 46.82283], [28.09095, 46.97621], [27.81892, 47.1381], [27.73172, 47.29248], [27.68706, 47.28962], [27.60263, 47.32507], [27.55731, 47.46637], [27.47942, 47.48113], [27.3979, 47.59473], [27.32202, 47.64009], [27.25519, 47.71366], [27.29069, 47.73722], [27.1618, 47.92391], [27.15622, 47.98538]]]] } },
      { type: "Feature", properties: { iso1A2: "RS", iso1A3: "SRB", iso1N3: "688", wikidata: "Q403", nameEn: "Serbia", groups: ["039", "150", "UN"], callingCodes: ["381"] }, geometry: { type: "MultiPolygon", coordinates: [[[[19.66007, 46.19005], [19.56113, 46.16824], [19.52473, 46.1171], [19.28826, 45.99694], [19.14543, 45.9998], [19.10388, 46.04015], [19.0791, 45.96458], [19.01284, 45.96529], [18.99712, 45.93537], [18.81394, 45.91329], [18.85783, 45.85493], [18.90305, 45.71863], [18.96691, 45.66731], [18.88776, 45.57253], [18.94562, 45.53712], [19.07471, 45.53086], [19.08364, 45.48804], [18.99918, 45.49333], [18.97446, 45.37528], [19.10774, 45.29547], [19.28208, 45.23813], [19.41941, 45.23475], [19.43589, 45.17137], [19.19144, 45.17863], [19.14063, 45.12972], [19.07952, 45.14668], [19.1011, 45.01191], [19.05205, 44.97692], [19.15573, 44.95409], [19.06853, 44.89915], [19.02871, 44.92541], [18.98957, 44.90645], [19.01994, 44.85493], [19.18183, 44.92055], [19.36722, 44.88164], [19.32543, 44.74058], [19.26388, 44.65412], [19.16699, 44.52197], [19.13369, 44.52521], [19.12278, 44.50132], [19.14837, 44.45253], [19.14681, 44.41463], [19.11785, 44.40313], [19.10749, 44.39421], [19.10704, 44.38249], [19.10365, 44.37795], [19.10298, 44.36924], [19.11865, 44.36712], [19.1083, 44.3558], [19.11547, 44.34218], [19.13556, 44.338], [19.13332, 44.31492], [19.16741, 44.28648], [19.18328, 44.28383], [19.20508, 44.2917], [19.23306, 44.26097], [19.26945, 44.26957], [19.32464, 44.27185], [19.34773, 44.23244], [19.3588, 44.18353], [19.40927, 44.16722], [19.43905, 44.13088], [19.47338, 44.15034], [19.48386, 44.14332], [19.47321, 44.1193], [19.51167, 44.08158], [19.55999, 44.06894], [19.57467, 44.04716], [19.61991, 44.05254], [19.61836, 44.01464], [19.56498, 43.99922], [19.52515, 43.95573], [19.38439, 43.96611], [19.24363, 44.01502], [19.23465, 43.98764], [19.3986, 43.79668], [19.5176, 43.71403], [19.50455, 43.58385], [19.42696, 43.57987], [19.41941, 43.54056], [19.36653, 43.60921], [19.33426, 43.58833], [19.2553, 43.5938], [19.24774, 43.53061], [19.22807, 43.5264], [19.22229, 43.47926], [19.44315, 43.38846], [19.48171, 43.32644], [19.52962, 43.31623], [19.54598, 43.25158], [19.62661, 43.2286], [19.64063, 43.19027], [19.76918, 43.16044], [19.79255, 43.11951], [19.92576, 43.08539], [19.96549, 43.11098], [19.98887, 43.0538], [20.04729, 43.02732], [20.05431, 42.99571], [20.12325, 42.96237], [20.14896, 42.99058], [20.16415, 42.97177], [20.34528, 42.90676], [20.35692, 42.8335], [20.40594, 42.84853], [20.43734, 42.83157], [20.53484, 42.8885], [20.48692, 42.93208], [20.59929, 43.01067], [20.64557, 43.00826], [20.69515, 43.09641], [20.59929, 43.20492], [20.68688, 43.21335], [20.73811, 43.25068], [20.82145, 43.26769], [20.88685, 43.21697], [20.83727, 43.17842], [20.96287, 43.12416], [21.00749, 43.13984], [21.05378, 43.10707], [21.08952, 43.13471], [21.14465, 43.11089], [21.16734, 42.99694], [21.2041, 43.02277], [21.23877, 43.00848], [21.23534, 42.95523], [21.2719, 42.8994], [21.32974, 42.90424], [21.36941, 42.87397], [21.44047, 42.87276], [21.39045, 42.74888], [21.47498, 42.74695], [21.59154, 42.72643], [21.58755, 42.70418], [21.6626, 42.67813], [21.75025, 42.70125], [21.79413, 42.65923], [21.75672, 42.62695], [21.7327, 42.55041], [21.70522, 42.54176], [21.7035, 42.51899], [21.62556, 42.45106], [21.64209, 42.41081], [21.62887, 42.37664], [21.59029, 42.38042], [21.57021, 42.3647], [21.53467, 42.36809], [21.5264, 42.33634], [21.56772, 42.30946], [21.58992, 42.25915], [21.70111, 42.23789], [21.77176, 42.2648], [21.84654, 42.3247], [21.91595, 42.30392], [21.94405, 42.34669], [22.02908, 42.29848], [22.16384, 42.32103], [22.29605, 42.37477], [22.29275, 42.34913], [22.34773, 42.31725], [22.45919, 42.33822], [22.47498, 42.3915], [22.51961, 42.3991], [22.55669, 42.50144], [22.43983, 42.56851], [22.4997, 42.74144], [22.43309, 42.82057], [22.54302, 42.87774], [22.74826, 42.88701], [22.78397, 42.98253], [22.89521, 43.03625], [22.98104, 43.11199], [23.00806, 43.19279], [22.89727, 43.22417], [22.82036, 43.33665], [22.53397, 43.47225], [22.47582, 43.6558], [22.41043, 43.69566], [22.35558, 43.81281], [22.41449, 44.00514], [22.61688, 44.06534], [22.61711, 44.16938], [22.67173, 44.21564], [22.68166, 44.28206], [22.56012, 44.30712], [22.45436, 44.47258], [22.54021, 44.47836], [22.56493, 44.53419], [22.61368, 44.55719], [22.70981, 44.51852], [22.76749, 44.54446], [22.69196, 44.61587], [22.61917, 44.61489], [22.45301, 44.7194], [22.30844, 44.6619], [22.18315, 44.48179], [22.13234, 44.47444], [22.08016, 44.49844], [21.99364, 44.63395], [21.7795, 44.66165], [21.71692, 44.65349], [21.67504, 44.67107], [21.61942, 44.67059], [21.60019, 44.75208], [21.55007, 44.77304], [21.38802, 44.78133], [21.35643, 44.86364], [21.44013, 44.87613], [21.48202, 44.87199], [21.56328, 44.89502], [21.54938, 44.9327], [21.35855, 45.01941], [21.4505, 45.04294], [21.51299, 45.15345], [21.48278, 45.19557], [21.29398, 45.24148], [21.20392, 45.2677], [21.17612, 45.32566], [21.09894, 45.30144], [20.87948, 45.42743], [20.86026, 45.47295], [20.77217, 45.49788], [20.83321, 45.53567], [20.76798, 45.60969], [20.80361, 45.65875], [20.82364, 45.77738], [20.78446, 45.78522], [20.77416, 45.75601], [20.70069, 45.7493], [20.65645, 45.82801], [20.54818, 45.89939], [20.35862, 45.99356], [20.26068, 46.12332], [20.09713, 46.17315], [20.03533, 46.14509], [20.01816, 46.17696], [19.93508, 46.17553], [19.81491, 46.1313], [19.66007, 46.19005]]]] } },
      { type: "Feature", properties: { iso1A2: "RU", iso1A3: "RUS", iso1N3: "643", wikidata: "Q159", nameEn: "Russia" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "RW", iso1A3: "RWA", iso1N3: "646", wikidata: "Q1037", nameEn: "Rwanda", groups: ["014", "202", "002", "UN"], callingCodes: ["250"] }, geometry: { type: "MultiPolygon", coordinates: [[[[30.47194, -1.0555], [30.35212, -1.06896], [30.16369, -1.34303], [29.912, -1.48269], [29.82657, -1.31187], [29.59061, -1.39016], [29.53062, -1.40499], [29.45038, -1.5054], [29.36322, -1.50887], [29.24323, -1.66826], [29.24458, -1.69663], [29.11847, -1.90576], [29.17562, -2.12278], [29.105, -2.27043], [29.00051, -2.29001], [28.95642, -2.37321], [28.89601, -2.37321], [28.86826, -2.41888], [28.86846, -2.44866], [28.89132, -2.47557], [28.89342, -2.49017], [28.88846, -2.50493], [28.87497, -2.50887], [28.86209, -2.5231], [28.86193, -2.53185], [28.87943, -2.55165], [28.89288, -2.55848], [28.90226, -2.62385], [28.89793, -2.66111], [28.94346, -2.69124], [29.00357, -2.70596], [29.04081, -2.7416], [29.0562, -2.58632], [29.32234, -2.6483], [29.36805, -2.82933], [29.88237, -2.75105], [29.95911, -2.33348], [30.14034, -2.43626], [30.42933, -2.31064], [30.54501, -2.41404], [30.83915, -2.35795], [30.89303, -2.08223], [30.80802, -1.91477], [30.84079, -1.64652], [30.71974, -1.43244], [30.57123, -1.33264], [30.50889, -1.16412], [30.45116, -1.10641], [30.47194, -1.0555]]]] } },
      { type: "Feature", properties: { iso1A2: "SA", iso1A3: "SAU", iso1N3: "682", wikidata: "Q851", nameEn: "Saudi Arabia", groups: ["145", "142", "UN"], callingCodes: ["966"] }, geometry: { type: "MultiPolygon", coordinates: [[[[40.01521, 32.05667], [39.29903, 32.23259], [38.99233, 31.99721], [36.99791, 31.50081], [37.99354, 30.49998], [37.66395, 30.33245], [37.4971, 29.99949], [36.75083, 29.86903], [36.50005, 29.49696], [36.07081, 29.18469], [34.8812, 29.36878], [34.4454, 27.91479], [37.8565, 22.00903], [39.63762, 18.37348], [40.99158, 15.81743], [42.15205, 16.40211], [42.76801, 16.40371], [42.94625, 16.39721], [42.94351, 16.49467], [42.97215, 16.51093], [43.11601, 16.53166], [43.15274, 16.67248], [43.22066, 16.65179], [43.21325, 16.74416], [43.25857, 16.75304], [43.26303, 16.79479], [43.24801, 16.80613], [43.22956, 16.80613], [43.22012, 16.83932], [43.18338, 16.84852], [43.1398, 16.90696], [43.19328, 16.94703], [43.1813, 16.98438], [43.18233, 17.02673], [43.23967, 17.03428], [43.17787, 17.14717], [43.20156, 17.25901], [43.32653, 17.31179], [43.22533, 17.38343], [43.29185, 17.53224], [43.43005, 17.56148], [43.70631, 17.35762], [44.50126, 17.47475], [46.31018, 17.20464], [46.76494, 17.29151], [47.00571, 16.94765], [47.48245, 17.10808], [47.58351, 17.50366], [48.19996, 18.20584], [49.04884, 18.59899], [52.00311, 19.00083], [54.99756, 20.00083], [55.66469, 21.99658], [55.2137, 22.71065], [55.13599, 22.63334], [52.56622, 22.94341], [51.59617, 24.12041], [51.58871, 24.27256], [51.41644, 24.39615], [51.58834, 24.66608], [51.39468, 24.62785], [51.29972, 24.50747], [51.09638, 24.46907], [50.92992, 24.54396], [50.8133, 24.74049], [50.57069, 25.57887], [50.302, 25.87592], [50.26923, 26.08243], [50.38162, 26.53976], [50.71771, 26.73086], [50.37726, 27.89227], [49.98877, 27.87827], [49.00421, 28.81495], [48.42991, 28.53628], [47.70561, 28.5221], [47.59863, 28.66798], [47.58376, 28.83382], [47.46202, 29.0014], [46.5527, 29.10283], [46.42415, 29.05947], [44.72255, 29.19736], [42.97796, 30.48295], [42.97601, 30.72204], [40.01521, 32.05667]]]] } },
      { type: "Feature", properties: { iso1A2: "SB", iso1A3: "SLB", iso1N3: "090", wikidata: "Q685", nameEn: "Solomon Islands", groups: ["054", "009", "UN"], driveSide: "left", callingCodes: ["677"] }, geometry: { type: "MultiPolygon", coordinates: [[[[172.71443, -12.01327], [160.43769, -4.17974], [156.03296, -6.55528], [156.03993, -6.65703], [155.92557, -6.84664], [155.69784, -6.92661], [155.60735, -6.92266], [154.74815, -7.33315], [156.73836, -14.50464], [172.71443, -12.01327]]]] } },
      { type: "Feature", properties: { iso1A2: "SC", iso1A3: "SYC", iso1N3: "690", wikidata: "Q1042", nameEn: "Seychelles", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["248"] }, geometry: { type: "MultiPolygon", coordinates: [[[[43.75112, -10.38913], [54.83239, -10.93575], [66.3222, 5.65313], [43.75112, -10.38913]]]] } },
      { type: "Feature", properties: { iso1A2: "SD", iso1A3: "SDN", iso1N3: "729", wikidata: "Q1049", nameEn: "Sudan", groups: ["015", "002", "UN"], callingCodes: ["249"] }, geometry: { type: "MultiPolygon", coordinates: [[[[37.8565, 22.00903], [34.0765, 22.00501], [33.99686, 21.76784], [33.57251, 21.72406], [33.17563, 22.00405], [24.99885, 21.99535], [24.99794, 19.99661], [23.99715, 20.00038], [23.99539, 19.49944], [23.99997, 15.69575], [23.62785, 15.7804], [23.38812, 15.69649], [23.10792, 15.71297], [22.93201, 15.55107], [22.92579, 15.47007], [22.99584, 15.40105], [22.99584, 15.22989], [22.66115, 14.86308], [22.70474, 14.69149], [22.38562, 14.58907], [22.44944, 14.24986], [22.55997, 14.23024], [22.5553, 14.11704], [22.22995, 13.96754], [22.08674, 13.77863], [22.29689, 13.3731], [22.1599, 13.19281], [22.02914, 13.13976], [21.94819, 13.05637], [21.81432, 12.81362], [21.89371, 12.68001], [21.98711, 12.63292], [22.15679, 12.66634], [22.22684, 12.74682], [22.46345, 12.61925], [22.38873, 12.45514], [22.50548, 12.16769], [22.48369, 12.02766], [22.64092, 12.07485], [22.54907, 11.64372], [22.7997, 11.40424], [22.93124, 11.41645], [22.97249, 11.21955], [22.87758, 10.91915], [23.02221, 10.69235], [23.3128, 10.45214], [23.67164, 9.86923], [23.69155, 9.67566], [24.09319, 9.66572], [24.12744, 9.73784], [24.49389, 9.79962], [24.84653, 9.80643], [24.97739, 9.9081], [25.05688, 10.06776], [25.0918, 10.33718], [25.78141, 10.42599], [25.93163, 10.38159], [25.93241, 10.17941], [26.21338, 9.91545], [26.35815, 9.57946], [26.70685, 9.48735], [27.14427, 9.62858], [27.90704, 9.61323], [28.99983, 9.67155], [29.06988, 9.74826], [29.53844, 9.75133], [29.54, 10.07949], [29.94629, 10.29245], [30.00389, 10.28633], [30.53005, 9.95992], [30.82893, 9.71451], [30.84605, 9.7498], [31.28504, 9.75287], [31.77539, 10.28939], [31.99177, 10.65065], [32.46967, 11.04662], [32.39358, 11.18207], [32.39578, 11.70208], [32.10079, 11.95203], [32.73921, 11.95203], [32.73921, 12.22757], [33.25876, 12.22111], [33.13988, 11.43248], [33.26977, 10.83632], [33.24645, 10.77913], [33.52294, 10.64382], [33.66604, 10.44254], [33.80913, 10.32994], [33.90159, 10.17179], [33.96984, 10.15446], [33.99185, 9.99623], [33.96323, 9.80972], [33.9082, 9.762], [33.87958, 9.49937], [34.10229, 9.50238], [34.08717, 9.55243], [34.13186, 9.7492], [34.20484, 9.9033], [34.22718, 10.02506], [34.32102, 10.11599], [34.34783, 10.23914], [34.2823, 10.53508], [34.4372, 10.781], [34.59062, 10.89072], [34.77383, 10.74588], [34.77532, 10.69027], [34.86618, 10.74588], [34.86916, 10.78832], [34.97491, 10.86147], [34.97789, 10.91559], [34.93172, 10.95946], [35.01215, 11.19626], [34.95704, 11.24448], [35.09556, 11.56278], [35.05832, 11.71158], [35.11492, 11.85156], [35.24302, 11.91132], [35.70476, 12.67101], [36.01458, 12.72478], [36.14268, 12.70879], [36.16651, 12.88019], [36.13374, 12.92665], [36.24545, 13.36759], [36.38993, 13.56459], [36.48824, 13.83954], [36.44653, 13.95666], [36.54376, 14.25597], [36.44337, 15.14963], [36.54276, 15.23478], [36.69761, 15.75323], [36.76371, 15.80831], [36.92193, 16.23451], [36.99777, 17.07172], [37.42694, 17.04041], [37.50967, 17.32199], [38.13362, 17.53906], [38.37133, 17.66269], [38.45916, 17.87167], [38.57727, 17.98125], [39.63762, 18.37348], [37.8565, 22.00903]]]] } },
      { type: "Feature", properties: { iso1A2: "SE", iso1A3: "SWE", iso1N3: "752", wikidata: "Q34", nameEn: "Sweden", groups: ["EU", "154", "150", "UN"], callingCodes: ["46"] }, geometry: { type: "MultiPolygon", coordinates: [[[[24.15791, 65.85385], [23.90497, 66.15802], [23.71339, 66.21299], [23.64982, 66.30603], [23.67591, 66.3862], [23.63776, 66.43568], [23.85959, 66.56434], [23.89488, 66.772], [23.98059, 66.79585], [23.98563, 66.84149], [23.56214, 67.17038], [23.58735, 67.20752], [23.54701, 67.25435], [23.75372, 67.29914], [23.75372, 67.43688], [23.39577, 67.46974], [23.54701, 67.59306], [23.45627, 67.85297], [23.65793, 67.9497], [23.40081, 68.05545], [23.26469, 68.15134], [23.15377, 68.14759], [23.10336, 68.26551], [22.73028, 68.40881], [22.00429, 68.50692], [21.03001, 68.88969], [20.90649, 68.89696], [20.85104, 68.93142], [20.91658, 68.96764], [20.78802, 69.03087], [20.55258, 69.06069], [20.0695, 69.04469], [20.28444, 68.93283], [20.33435, 68.80174], [20.22027, 68.67246], [19.95647, 68.55546], [20.22027, 68.48759], [19.93508, 68.35911], [18.97255, 68.52416], [18.63032, 68.50849], [18.39503, 68.58672], [18.1241, 68.53721], [18.13836, 68.20874], [17.90787, 67.96537], [17.30416, 68.11591], [16.7409, 67.91037], [16.38441, 67.52923], [16.12774, 67.52106], [16.09922, 67.4364], [16.39154, 67.21653], [16.35589, 67.06419], [15.37197, 66.48217], [15.49318, 66.28509], [15.05113, 66.15572], [14.53778, 66.12399], [14.50926, 65.31786], [13.64276, 64.58402], [14.11117, 64.46674], [14.16051, 64.18725], [13.98222, 64.00953], [13.23411, 64.09087], [12.74105, 64.02171], [12.14928, 63.59373], [12.19919, 63.47935], [11.98529, 63.27487], [12.19919, 63.00104], [12.07085, 62.6297], [12.29187, 62.25699], [12.14746, 61.7147], [12.40595, 61.57226], [12.57707, 61.56547], [12.86939, 61.35427], [12.69115, 61.06584], [12.2277, 61.02442], [12.59133, 60.50559], [12.52003, 60.13846], [12.36317, 59.99259], [12.15641, 59.8926], [11.87121, 59.86039], [11.92112, 59.69531], [11.69297, 59.59442], [11.8213, 59.24985], [11.65732, 58.90177], [11.45199, 58.89604], [11.4601, 58.99022], [11.34459, 59.11672], [11.15367, 59.07862], [11.08911, 58.98745], [10.64958, 58.89391], [10.40861, 58.38489], [12.16597, 56.60205], [12.07466, 56.29488], [12.65312, 56.04345], [12.6372, 55.91371], [12.88472, 55.63369], [12.60345, 55.42675], [12.84405, 55.13257], [14.28399, 55.1553], [14.89259, 55.5623], [15.79951, 55.54655], [19.64795, 57.06466], [19.84909, 57.57876], [20.5104, 59.15546], [19.08191, 60.19152], [19.23413, 60.61414], [20.15877, 63.06556], [24.14112, 65.39731], [24.15107, 65.81427], [24.14798, 65.83466], [24.15791, 65.85385]]]] } },
      { type: "Feature", properties: { iso1A2: "SG", iso1A3: "SGP", iso1N3: "702", wikidata: "Q334", nameEn: "Singapore", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["65"] }, geometry: { type: "MultiPolygon", coordinates: [[[[104.00131, 1.42405], [103.93384, 1.42926], [103.89565, 1.42841], [103.86383, 1.46288], [103.81181, 1.47953], [103.76395, 1.45183], [103.74161, 1.4502], [103.7219, 1.46108], [103.67468, 1.43166], [103.62738, 1.35255], [103.56591, 1.19719], [103.66049, 1.18825], [103.74084, 1.12902], [104.03085, 1.26954], [104.12282, 1.27714], [104.08072, 1.35998], [104.09162, 1.39694], [104.08871, 1.42015], [104.07348, 1.43322], [104.04622, 1.44691], [104.02277, 1.4438], [104.00131, 1.42405]]]] } },
      { type: "Feature", properties: { iso1A2: "SH", iso1A3: "SHN", iso1N3: "654", wikidata: "Q192184", nameEn: "Saint Helena, Ascension and Tristan da Cunha", country: "GB" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "SI", iso1A3: "SVN", iso1N3: "705", wikidata: "Q215", nameEn: "Slovenia", groups: ["EU", "039", "150", "UN"], callingCodes: ["386"] }, geometry: { type: "MultiPolygon", coordinates: [[[[16.50139, 46.56684], [16.39217, 46.63673], [16.38594, 46.6549], [16.41863, 46.66238], [16.42641, 46.69228], [16.37816, 46.69975], [16.30966, 46.7787], [16.31303, 46.79838], [16.3408, 46.80641], [16.34547, 46.83836], [16.2941, 46.87137], [16.2365, 46.87775], [16.21892, 46.86961], [16.15711, 46.85434], [16.14365, 46.8547], [16.10983, 46.867], [16.05786, 46.83927], [15.99054, 46.82772], [15.99126, 46.78199], [15.98432, 46.74991], [15.99769, 46.7266], [16.02808, 46.71094], [16.04347, 46.68694], [16.04036, 46.6549], [15.99988, 46.67947], [15.98512, 46.68463], [15.94864, 46.68769], [15.87691, 46.7211], [15.8162, 46.71897], [15.78518, 46.70712], [15.76771, 46.69863], [15.73823, 46.70011], [15.72279, 46.69548], [15.69523, 46.69823], [15.67411, 46.70735], [15.6543, 46.70616], [15.6543, 46.69228], [15.6365, 46.6894], [15.63255, 46.68069], [15.62317, 46.67947], [15.59826, 46.68908], [15.54533, 46.66985], [15.55333, 46.64988], [15.54431, 46.6312], [15.46906, 46.61321], [15.45514, 46.63697], [15.41235, 46.65556], [15.23711, 46.63994], [15.14215, 46.66131], [15.01451, 46.641], [14.98024, 46.6009], [14.96002, 46.63459], [14.92283, 46.60848], [14.87129, 46.61], [14.86419, 46.59411], [14.83549, 46.56614], [14.81836, 46.51046], [14.72185, 46.49974], [14.66892, 46.44936], [14.5942, 46.43434], [14.56463, 46.37208], [14.52176, 46.42617], [14.45877, 46.41717], [14.42608, 46.44614], [14.314, 46.43327], [14.28326, 46.44315], [14.15989, 46.43327], [14.12097, 46.47724], [14.04002, 46.49117], [14.00422, 46.48474], [13.89837, 46.52331], [13.7148, 46.5222], [13.68684, 46.43881], [13.59777, 46.44137], [13.5763, 46.42613], [13.5763, 46.40915], [13.47019, 46.3621], [13.43418, 46.35992], [13.44808, 46.33507], [13.37671, 46.29668], [13.42218, 46.20758], [13.47587, 46.22725], [13.56114, 46.2054], [13.56682, 46.18703], [13.64451, 46.18966], [13.66472, 46.17392], [13.64053, 46.13587], [13.57072, 46.09022], [13.50104, 46.05986], [13.49568, 46.04839], [13.50998, 46.04498], [13.49702, 46.01832], [13.47474, 46.00546], [13.50104, 45.98078], [13.52963, 45.96588], [13.56759, 45.96991], [13.58903, 45.99009], [13.62074, 45.98388], [13.63458, 45.98947], [13.64307, 45.98326], [13.6329, 45.94894], [13.63815, 45.93607], [13.61931, 45.91782], [13.60857, 45.89907], [13.59565, 45.89446], [13.58644, 45.88173], [13.57563, 45.8425], [13.58858, 45.83503], [13.59784, 45.8072], [13.66986, 45.79955], [13.8235, 45.7176], [13.83332, 45.70855], [13.83422, 45.68703], [13.87933, 45.65207], [13.9191, 45.6322], [13.8695, 45.60835], [13.86771, 45.59898], [13.84106, 45.58185], [13.78445, 45.5825], [13.74587, 45.59811], [13.7198, 45.59352], [13.6076, 45.64761], [13.45644, 45.59464], [13.56979, 45.4895], [13.62902, 45.45898], [13.67398, 45.4436], [13.7785, 45.46787], [13.81742, 45.43729], [13.88124, 45.42637], [13.90771, 45.45149], [13.97309, 45.45258], [13.99488, 45.47551], [13.96063, 45.50825], [14.00578, 45.52352], [14.07116, 45.48752], [14.20348, 45.46896], [14.22371, 45.50388], [14.24239, 45.50607], [14.26611, 45.48239], [14.27681, 45.4902], [14.32487, 45.47142], [14.36693, 45.48642], [14.49769, 45.54424], [14.5008, 45.60852], [14.53816, 45.6205], [14.57397, 45.67165], [14.60977, 45.66403], [14.59576, 45.62812], [14.69694, 45.57366], [14.68605, 45.53006], [14.71718, 45.53442], [14.80124, 45.49515], [14.81992, 45.45913], [14.90554, 45.47769], [14.92266, 45.52788], [15.02385, 45.48533], [15.05187, 45.49079], [15.16862, 45.42309], [15.27758, 45.46678], [15.33051, 45.45258], [15.38188, 45.48752], [15.30249, 45.53224], [15.29837, 45.5841], [15.27747, 45.60504], [15.31027, 45.6303], [15.34695, 45.63382], [15.34214, 45.64702], [15.38952, 45.63682], [15.4057, 45.64727], [15.34919, 45.71623], [15.30872, 45.69014], [15.25423, 45.72275], [15.40836, 45.79491], [15.47531, 45.79802], [15.47325, 45.8253], [15.52234, 45.82195], [15.57952, 45.84953], [15.64185, 45.82915], [15.66662, 45.84085], [15.70411, 45.8465], [15.68232, 45.86819], [15.68383, 45.88867], [15.67967, 45.90455], [15.70636, 45.92116], [15.70327, 46.00015], [15.71246, 46.01196], [15.72977, 46.04682], [15.62317, 46.09103], [15.6083, 46.11992], [15.59909, 46.14761], [15.64904, 46.19229], [15.6434, 46.21396], [15.67395, 46.22478], [15.75436, 46.21969], [15.75479, 46.20336], [15.78817, 46.21719], [15.79284, 46.25811], [15.97965, 46.30652], [16.07616, 46.3463], [16.07314, 46.36458], [16.05065, 46.3833], [16.05281, 46.39141], [16.14859, 46.40547], [16.18824, 46.38282], [16.30233, 46.37837], [16.30162, 46.40437], [16.27329, 46.41467], [16.27398, 46.42875], [16.25124, 46.48067], [16.23961, 46.49653], [16.26759, 46.50566], [16.26733, 46.51505], [16.29793, 46.5121], [16.37193, 46.55008], [16.38771, 46.53608], [16.44036, 46.5171], [16.5007, 46.49644], [16.52604, 46.47831], [16.59527, 46.47524], [16.52604, 46.5051], [16.52885, 46.53303], [16.50139, 46.56684]]]] } },
      { type: "Feature", properties: { iso1A2: "SJ", iso1A3: "SJM", iso1N3: "744", wikidata: "Q842829", nameEn: "Svalbard and Jan Mayen", country: "NO" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "SK", iso1A3: "SVK", iso1N3: "703", wikidata: "Q214", nameEn: "Slovakia", groups: ["EU", "151", "150", "UN"], callingCodes: ["421"] }, geometry: { type: "MultiPolygon", coordinates: [[[[19.82237, 49.27806], [19.78581, 49.41701], [19.72127, 49.39288], [19.6375, 49.40897], [19.64162, 49.45184], [19.57845, 49.46077], [19.53313, 49.52856], [19.52626, 49.57311], [19.45348, 49.61583], [19.37795, 49.574], [19.36009, 49.53747], [19.25435, 49.53391], [19.18019, 49.41165], [18.9742, 49.39557], [18.97283, 49.49914], [18.94536, 49.52143], [18.84521, 49.51672], [18.74761, 49.492], [18.67757, 49.50895], [18.6144, 49.49824], [18.57183, 49.51162], [18.53063, 49.49022], [18.54848, 49.47059], [18.44686, 49.39467], [18.4084, 49.40003], [18.4139, 49.36517], [18.36446, 49.3267], [18.18456, 49.28909], [18.15022, 49.24518], [18.1104, 49.08624], [18.06885, 49.03157], [17.91814, 49.01784], [17.87831, 48.92679], [17.77944, 48.92318], [17.73126, 48.87885], [17.7094, 48.86721], [17.5295, 48.81117], [17.45671, 48.85004], [17.3853, 48.80936], [17.29054, 48.85546], [17.19355, 48.87602], [17.11202, 48.82925], [17.00215, 48.70887], [16.93955, 48.60371], [16.94611, 48.53614], [16.85204, 48.44968], [16.8497, 48.38321], [16.83588, 48.3844], [16.83317, 48.38138], [16.84243, 48.35258], [16.90903, 48.32519], [16.89461, 48.31332], [16.97701, 48.17385], [17.02919, 48.13996], [17.05735, 48.14179], [17.09168, 48.09366], [17.07039, 48.0317], [17.16001, 48.00636], [17.23699, 48.02094], [17.71215, 47.7548], [18.02938, 47.75665], [18.29305, 47.73541], [18.56496, 47.76588], [18.66521, 47.76772], [18.74074, 47.8157], [18.8506, 47.82308], [18.76821, 47.87469], [18.76134, 47.97499], [18.82176, 48.04206], [19.01952, 48.07052], [19.23924, 48.0595], [19.28182, 48.08336], [19.47957, 48.09437], [19.52489, 48.19791], [19.63338, 48.25006], [19.92452, 48.1283], [20.24312, 48.2784], [20.29943, 48.26104], [20.5215, 48.53336], [20.83248, 48.5824], [21.11516, 48.49546], [21.44063, 48.58456], [21.6068, 48.50365], [21.67134, 48.3989], [21.72525, 48.34628], [21.8279, 48.33321], [21.83339, 48.36242], [22.14689, 48.4005], [22.16023, 48.56548], [22.21379, 48.6218], [22.34151, 48.68893], [22.42934, 48.92857], [22.48296, 48.99172], [22.54338, 49.01424], [22.56155, 49.08865], [22.04427, 49.22136], [21.96385, 49.3437], [21.82927, 49.39467], [21.77983, 49.35443], [21.62328, 49.4447], [21.43376, 49.41433], [21.27858, 49.45988], [21.19756, 49.4054], [21.12477, 49.43666], [21.041, 49.41791], [21.09799, 49.37176], [20.98733, 49.30774], [20.9229, 49.29626], [20.77971, 49.35383], [20.72274, 49.41813], [20.61666, 49.41791], [20.5631, 49.375], [20.46422, 49.41612], [20.39939, 49.3896], [20.31728, 49.39914], [20.31453, 49.34817], [20.21977, 49.35265], [20.13738, 49.31685], [20.08238, 49.1813], [19.98494, 49.22904], [19.90529, 49.23532], [19.86409, 49.19316], [19.75286, 49.20751], [19.82237, 49.27806]]]] } },
      { type: "Feature", properties: { iso1A2: "SL", iso1A3: "SLE", iso1N3: "694", wikidata: "Q1044", nameEn: "Sierra Leone", groups: ["011", "202", "002", "UN"], callingCodes: ["232"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-10.27575, 8.48711], [-10.37257, 8.48941], [-10.54891, 8.31174], [-10.63934, 8.35326], [-10.70565, 8.29235], [-10.61422, 8.5314], [-10.47707, 8.67669], [-10.56197, 8.81225], [-10.5783, 9.06386], [-10.74484, 9.07998], [-10.6534, 9.29919], [-11.2118, 10.00098], [-11.89624, 9.99763], [-11.91023, 9.93927], [-12.12634, 9.87203], [-12.24262, 9.92386], [-12.47254, 9.86834], [-12.76788, 9.3133], [-12.94095, 9.26335], [-13.08953, 9.0409], [-13.18586, 9.0925], [-13.29911, 9.04245], [-14.36218, 8.64107], [-12.15048, 6.15992], [-11.50429, 6.92704], [-11.4027, 6.97746], [-11.29417, 7.21576], [-10.60422, 7.7739], [-10.60492, 8.04072], [-10.57523, 8.04829], [-10.51554, 8.1393], [-10.45023, 8.15627], [-10.35227, 8.15223], [-10.29839, 8.21283], [-10.31635, 8.28554], [-10.30084, 8.30008], [-10.27575, 8.48711]]]] } },
      { type: "Feature", properties: { iso1A2: "SM", iso1A3: "SMR", iso1N3: "674", wikidata: "Q238", nameEn: "San Marino", groups: ["039", "150", "UN"], callingCodes: ["378"] }, geometry: { type: "MultiPolygon", coordinates: [[[[12.45648, 43.89369], [12.48771, 43.89706], [12.49429, 43.90973], [12.49247, 43.91774], [12.49724, 43.92248], [12.50269, 43.92363], [12.50496, 43.93017], [12.51553, 43.94096], [12.51427, 43.94897], [12.50655, 43.95796], [12.50875, 43.96198], [12.50622, 43.97131], [12.51109, 43.97201], [12.51064, 43.98165], [12.5154, 43.98508], [12.51463, 43.99122], [12.50678, 43.99113], [12.49406, 43.98492], [12.47853, 43.98052], [12.46205, 43.97463], [12.44684, 43.96597], [12.43662, 43.95698], [12.42005, 43.9578], [12.41414, 43.95273], [12.40415, 43.95485], [12.40506, 43.94325], [12.41165, 43.93769], [12.41551, 43.92984], [12.40733, 43.92379], [12.41233, 43.90956], [12.40935, 43.9024], [12.41641, 43.89991], [12.44184, 43.90498], [12.45648, 43.89369]]]] } },
      { type: "Feature", properties: { iso1A2: "SN", iso1A3: "SEN", iso1N3: "686", wikidata: "Q1041", nameEn: "Senegal", groups: ["011", "202", "002", "UN"], callingCodes: ["221"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-14.32144, 16.61495], [-15.00557, 16.64997], [-15.6509, 16.50315], [-16.27016, 16.51565], [-16.4429, 16.20605], [-16.44814, 16.09753], [-16.48967, 16.0496], [-16.50854, 16.09032], [-17.15288, 16.07139], [-18.35085, 14.63444], [-17.43598, 13.59273], [-15.47902, 13.58758], [-15.36504, 13.79313], [-14.93719, 13.80173], [-14.34721, 13.46578], [-13.8955, 13.59126], [-13.79409, 13.34472], [-14.36795, 13.23033], [-15.14917, 13.57989], [-15.26908, 13.37768], [-15.80478, 13.34832], [-15.80355, 13.16729], [-16.69343, 13.16791], [-16.74676, 13.06025], [-17.43966, 13.04579], [-17.4623, 11.92379], [-16.70562, 12.34803], [-16.38191, 12.36449], [-16.20591, 12.46157], [-15.67302, 12.42974], [-15.17582, 12.6847], [-13.70523, 12.68013], [-13.05296, 12.64003], [-13.06603, 12.49342], [-12.87336, 12.51892], [-12.35415, 12.32758], [-11.91331, 12.42008], [-11.46267, 12.44559], [-11.37536, 12.40788], [-11.39935, 12.97808], [-11.63025, 13.39174], [-11.83345, 13.33333], [-12.06897, 13.71049], [-11.93043, 13.84505], [-12.23936, 14.76324], [-13.11029, 15.52116], [-13.43135, 16.09022], [-13.80075, 16.13961], [-14.32144, 16.61495]]]] } },
      { type: "Feature", properties: { iso1A2: "SO", iso1A3: "SOM", iso1N3: "706", wikidata: "Q1045", nameEn: "Somalia", groups: ["014", "202", "002", "UN"], callingCodes: ["252"] }, geometry: { type: "MultiPolygon", coordinates: [[[[51.12877, 12.56479], [43.90659, 12.3823], [42.95776, 10.98533], [42.69452, 10.62672], [42.87643, 10.18441], [43.0937, 9.90579], [43.23518, 9.84605], [43.32613, 9.59205], [44.19222, 8.93028], [46.99339, 7.9989], [47.92477, 8.00111], [47.97917, 8.00124], [44.98104, 4.91821], [44.02436, 4.9451], [43.40263, 4.79289], [43.04177, 4.57923], [42.97746, 4.44032], [42.84526, 4.28357], [42.55853, 4.20518], [42.07619, 4.17667], [41.89488, 3.97375], [41.31368, 3.14314], [40.98767, 2.82959], [41.00099, -0.83068], [41.56, -1.59812], [41.56362, -1.66375], [41.75542, -1.85308], [57.49095, 8.14549], [51.12877, 12.56479]]]] } },
      { type: "Feature", properties: { iso1A2: "SR", iso1A3: "SUR", iso1N3: "740", wikidata: "Q730", nameEn: "Suriname", groups: ["005", "419", "019", "UN"], driveSide: "left", callingCodes: ["597"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-54.26916, 5.26909], [-54.01877, 5.52789], [-54.01074, 5.68785], [-53.7094, 6.2264], [-56.84822, 6.73257], [-57.31629, 5.33714], [-57.22536, 5.15605], [-57.37442, 5.0208], [-57.8699, 4.89394], [-58.0307, 3.95513], [-57.35891, 3.32121], [-56.70519, 2.02964], [-56.55439, 2.02003], [-56.47045, 1.95135], [-55.99278, 1.83137], [-55.89863, 1.89861], [-55.92159, 2.05236], [-56.13054, 2.27723], [-55.96292, 2.53188], [-55.71493, 2.40342], [-55.01919, 2.564], [-54.6084, 2.32856], [-54.42864, 2.42442], [-54.28534, 2.67798], [-53.9849, 3.58697], [-53.98914, 3.627], [-54.05128, 3.63557], [-54.19367, 3.84387], [-54.38444, 4.13222], [-54.4717, 4.91964], [-54.26916, 5.26909]]]] } },
      { type: "Feature", properties: { iso1A2: "SS", iso1A3: "SSD", iso1N3: "728", wikidata: "Q958", nameEn: "South Sudan", groups: ["014", "202", "002", "UN"], callingCodes: ["211"] }, geometry: { type: "MultiPolygon", coordinates: [[[[34.10229, 9.50238], [33.87958, 9.49937], [33.9082, 9.762], [33.96323, 9.80972], [33.99185, 9.99623], [33.96984, 10.15446], [33.90159, 10.17179], [33.80913, 10.32994], [33.66604, 10.44254], [33.52294, 10.64382], [33.24645, 10.77913], [33.26977, 10.83632], [33.13988, 11.43248], [33.25876, 12.22111], [32.73921, 12.22757], [32.73921, 11.95203], [32.10079, 11.95203], [32.39578, 11.70208], [32.39358, 11.18207], [32.46967, 11.04662], [31.99177, 10.65065], [31.77539, 10.28939], [31.28504, 9.75287], [30.84605, 9.7498], [30.82893, 9.71451], [30.53005, 9.95992], [30.00389, 10.28633], [29.94629, 10.29245], [29.54, 10.07949], [29.53844, 9.75133], [29.06988, 9.74826], [28.99983, 9.67155], [27.90704, 9.61323], [27.14427, 9.62858], [26.70685, 9.48735], [26.35815, 9.57946], [26.21338, 9.91545], [25.93241, 10.17941], [25.93163, 10.38159], [25.78141, 10.42599], [25.0918, 10.33718], [25.05688, 10.06776], [24.97739, 9.9081], [24.84653, 9.80643], [24.49389, 9.79962], [24.12744, 9.73784], [24.09319, 9.66572], [23.69155, 9.67566], [23.62179, 9.53823], [23.64981, 9.44303], [23.64358, 9.28637], [23.56263, 9.19418], [23.4848, 9.16959], [23.44744, 8.99128], [23.59065, 8.99743], [23.51905, 8.71749], [24.25691, 8.69288], [24.13238, 8.36959], [24.35965, 8.26177], [24.85156, 8.16933], [24.98855, 7.96588], [25.25319, 7.8487], [25.29214, 7.66675], [25.20649, 7.61115], [25.20337, 7.50312], [25.35281, 7.42595], [25.37461, 7.33024], [25.90076, 7.09549], [26.38022, 6.63493], [26.32729, 6.36272], [26.58259, 6.1987], [26.51721, 6.09655], [27.22705, 5.71254], [27.22705, 5.62889], [27.28621, 5.56382], [27.23017, 5.37167], [27.26886, 5.25876], [27.44012, 5.07349], [27.56656, 4.89375], [27.65462, 4.89375], [27.76469, 4.79284], [27.79551, 4.59976], [28.20719, 4.35614], [28.6651, 4.42638], [28.8126, 4.48784], [29.03054, 4.48784], [29.22207, 4.34297], [29.43341, 4.50101], [29.49726, 4.7007], [29.82087, 4.56246], [29.79666, 4.37809], [30.06964, 4.13221], [30.1621, 4.10586], [30.22374, 3.93896], [30.27658, 3.95653], [30.47691, 3.83353], [30.55396, 3.84451], [30.57378, 3.74567], [30.56277, 3.62703], [30.78512, 3.67097], [30.80713, 3.60506], [30.85997, 3.5743], [30.85153, 3.48867], [30.97601, 3.693], [31.16666, 3.79853], [31.29476, 3.8015], [31.50478, 3.67814], [31.50776, 3.63652], [31.72075, 3.74354], [31.81459, 3.82083], [31.86821, 3.78664], [31.96205, 3.6499], [31.95907, 3.57408], [32.05187, 3.589], [32.08491, 3.56287], [32.08866, 3.53543], [32.19888, 3.50867], [32.20782, 3.6053], [32.41337, 3.748], [32.72021, 3.77327], [32.89746, 3.81339], [33.02852, 3.89296], [33.18356, 3.77812], [33.51264, 3.75068], [33.9873, 4.23316], [34.47601, 4.72162], [35.34151, 5.02364], [35.30992, 4.90402], [35.47843, 4.91872], [35.42366, 4.76969], [35.51424, 4.61643], [35.9419, 4.61933], [35.82118, 4.77382], [35.81968, 5.10757], [35.8576, 5.33413], [35.50792, 5.42431], [35.29938, 5.34042], [35.31188, 5.50106], [35.13058, 5.62118], [35.12611, 5.68937], [35.00546, 5.89387], [34.96227, 6.26415], [35.01738, 6.46991], [34.87736, 6.60161], [34.77459, 6.5957], [34.65096, 6.72589], [34.53776, 6.74808], [34.53925, 6.82794], [34.47669, 6.91076], [34.35753, 6.91963], [34.19369, 7.04382], [34.19369, 7.12807], [34.01495, 7.25664], [34.03878, 7.27437], [34.02984, 7.36449], [33.87642, 7.5491], [33.71407, 7.65983], [33.44745, 7.7543], [33.32531, 7.71297], [33.24637, 7.77939], [33.04944, 7.78989], [33.0006, 7.90333], [33.08401, 8.05822], [33.18083, 8.13047], [33.1853, 8.29264], [33.19721, 8.40317], [33.3119, 8.45474], [33.54575, 8.47094], [33.66938, 8.44442], [33.71407, 8.3678], [33.87195, 8.41938], [33.89579, 8.4842], [34.01346, 8.50041], [34.14453, 8.60204], [34.14304, 9.04654], [34.10229, 9.50238]]]] } },
      { type: "Feature", properties: { iso1A2: "ST", iso1A3: "STP", iso1N3: "678", wikidata: "Q1039", nameEn: "S\xE3o Tom\xE9 and Principe", groups: ["017", "202", "002", "UN"], callingCodes: ["239"] }, geometry: { type: "MultiPolygon", coordinates: [[[[4.34149, 1.91417], [6.6507, -0.28606], [7.9035, 1.92304], [4.34149, 1.91417]]]] } },
      { type: "Feature", properties: { iso1A2: "SV", iso1A3: "SLV", iso1N3: "222", wikidata: "Q792", nameEn: "El Salvador", groups: ["013", "003", "419", "019", "UN"], callingCodes: ["503"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-89.34776, 14.43013], [-89.39028, 14.44561], [-89.57441, 14.41637], [-89.58814, 14.33165], [-89.50614, 14.26084], [-89.52397, 14.22628], [-89.61844, 14.21937], [-89.70756, 14.1537], [-89.75569, 14.07073], [-89.73251, 14.04133], [-89.76103, 14.02923], [-89.81807, 14.07073], [-89.88937, 14.0396], [-90.10505, 13.85104], [-90.11344, 13.73679], [-90.55276, 12.8866], [-88.11443, 12.63306], [-87.7346, 13.13228], [-87.55124, 13.12523], [-87.69751, 13.25228], [-87.73714, 13.32715], [-87.80177, 13.35689], [-87.84675, 13.41078], [-87.83467, 13.44655], [-87.77354, 13.45767], [-87.73841, 13.44169], [-87.72115, 13.46083], [-87.71657, 13.50577], [-87.78148, 13.52906], [-87.73106, 13.75443], [-87.68821, 13.80829], [-87.7966, 13.91353], [-88.00331, 13.86948], [-88.07641, 13.98447], [-88.23018, 13.99915], [-88.25791, 13.91108], [-88.48982, 13.86458], [-88.49738, 13.97224], [-88.70661, 14.04317], [-88.73182, 14.10919], [-88.815, 14.11652], [-88.85785, 14.17763], [-88.94608, 14.20207], [-89.04187, 14.33644], [-89.34776, 14.43013]]]] } },
      { type: "Feature", properties: { iso1A2: "SX", iso1A3: "SXM", iso1N3: "534", wikidata: "Q26273", nameEn: "Sint Maarten", aliases: ["NL-SX"], country: "NL", groups: ["Q1451600", "029", "003", "419", "019", "UN"], callingCodes: ["1 721"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-63.33064, 17.9615], [-63.1055, 17.86651], [-62.93924, 18.02904], [-63.02323, 18.05757], [-63.04039, 18.05619], [-63.0579, 18.06614], [-63.07759, 18.04943], [-63.09686, 18.04608], [-63.11042, 18.05339], [-63.13502, 18.05445], [-63.33064, 17.9615]]]] } },
      { type: "Feature", properties: { iso1A2: "SY", iso1A3: "SYR", iso1N3: "760", wikidata: "Q858", nameEn: "Syria", groups: ["145", "142", "UN"], callingCodes: ["963"] }, geometry: { type: "MultiPolygon", coordinates: [[[[42.23683, 37.2863], [42.21548, 37.28026], [42.20454, 37.28715], [42.22381, 37.30238], [42.22257, 37.31395], [42.2112, 37.32491], [42.19301, 37.31323], [42.18225, 37.28569], [42.00894, 37.17209], [41.515, 37.08084], [41.21937, 37.07665], [40.90856, 37.13147], [40.69136, 37.0996], [39.81589, 36.75538], [39.21538, 36.66834], [39.03217, 36.70911], [38.74042, 36.70629], [38.55908, 36.84429], [38.38859, 36.90064], [38.21064, 36.91842], [37.81974, 36.76055], [37.68048, 36.75065], [37.49103, 36.66904], [37.47253, 36.63243], [37.21988, 36.6736], [37.16177, 36.66069], [37.10894, 36.6704], [37.08279, 36.63495], [37.02088, 36.66422], [37.01647, 36.69512], [37.04619, 36.71101], [37.04399, 36.73483], [36.99886, 36.74012], [36.99557, 36.75997], [36.66727, 36.82901], [36.61581, 36.74629], [36.62681, 36.71189], [36.57398, 36.65186], [36.58829, 36.58295], [36.54206, 36.49539], [36.6081, 36.33772], [36.65653, 36.33861], [36.68672, 36.23677], [36.6125, 36.22592], [36.50463, 36.2419], [36.4617, 36.20461], [36.39206, 36.22088], [36.37474, 36.01163], [36.33956, 35.98687], [36.30099, 36.00985], [36.28338, 36.00273], [36.29769, 35.96086], [36.27678, 35.94839], [36.25366, 35.96264], [36.19973, 35.95195], [36.17441, 35.92076], [36.1623, 35.80925], [36.14029, 35.81015], [36.13919, 35.83692], [36.11827, 35.85923], [35.99829, 35.88242], [36.01844, 35.92403], [36.00514, 35.94113], [35.98499, 35.94107], [35.931, 35.92109], [35.51152, 36.10954], [35.48515, 34.70851], [35.97386, 34.63322], [35.98718, 34.64977], [36.29165, 34.62991], [36.32399, 34.69334], [36.35135, 34.68516], [36.35384, 34.65447], [36.42941, 34.62505], [36.46003, 34.6378], [36.45299, 34.59438], [36.41429, 34.61175], [36.39846, 34.55672], [36.3369, 34.52629], [36.34745, 34.5002], [36.4442, 34.50165], [36.46179, 34.46541], [36.55853, 34.41609], [36.53039, 34.3798], [36.56556, 34.31881], [36.60778, 34.31009], [36.58667, 34.27667], [36.59195, 34.2316], [36.62537, 34.20251], [36.5128, 34.09916], [36.50576, 34.05982], [36.41078, 34.05253], [36.28589, 33.91981], [36.38263, 33.86579], [36.3967, 33.83365], [36.14517, 33.85118], [36.06778, 33.82927], [35.9341, 33.6596], [36.05723, 33.57904], [35.94465, 33.52774], [35.94816, 33.47886], [35.88668, 33.43183], [35.82577, 33.40479], [35.81324, 33.36354], [35.77477, 33.33609], [35.813, 33.3172], [35.77513, 33.27342], [35.81295, 33.24841], [35.81647, 33.2028], [35.83846, 33.19397], [35.84285, 33.16673], [35.81911, 33.1336], [35.81911, 33.11077], [35.84802, 33.1031], [35.87188, 32.98028], [35.89298, 32.9456], [35.87012, 32.91976], [35.84021, 32.8725], [35.83758, 32.82817], [35.78745, 32.77938], [35.75983, 32.74803], [35.88405, 32.71321], [35.93307, 32.71966], [35.96633, 32.66237], [36.02239, 32.65911], [36.08074, 32.51463], [36.20379, 32.52751], [36.20875, 32.49529], [36.23948, 32.50108], [36.40959, 32.37908], [36.83946, 32.31293], [38.79171, 33.37328], [40.64314, 34.31604], [40.97676, 34.39788], [41.12388, 34.65742], [41.2345, 34.80049], [41.21654, 35.1508], [41.26569, 35.42708], [41.38184, 35.62502], [41.37027, 35.84095], [41.2564, 36.06012], [41.28864, 36.35368], [41.40058, 36.52502], [41.81736, 36.58782], [42.36697, 37.0627], [42.35724, 37.10998], [42.32313, 37.17814], [42.34735, 37.22548], [42.2824, 37.2798], [42.26039, 37.27017], [42.23683, 37.2863]]]] } },
      { type: "Feature", properties: { iso1A2: "SZ", iso1A3: "SWZ", iso1N3: "748", wikidata: "Q1050", nameEn: "Eswatini", aliases: ["Swaziland"], groups: ["018", "202", "002", "UN"], driveSide: "left", callingCodes: ["268"] }, geometry: { type: "MultiPolygon", coordinates: [[[[31.86881, -25.99973], [31.4175, -25.71886], [31.31237, -25.7431], [31.13073, -25.91558], [30.95819, -26.26303], [30.78927, -26.48271], [30.81101, -26.84722], [30.88826, -26.79622], [30.97757, -26.92706], [30.96088, -27.0245], [31.15027, -27.20151], [31.49834, -27.31549], [31.97592, -27.31675], [31.97463, -27.11057], [32.00893, -26.8096], [32.09664, -26.80721], [32.13315, -26.84345], [32.13409, -26.5317], [32.07352, -26.40185], [32.10435, -26.15656], [32.08599, -26.00978], [32.00916, -25.999], [31.974, -25.95387], [31.86881, -25.99973]]]] } },
      { type: "Feature", properties: { iso1A2: "TA", iso1A3: "TAA", wikidata: "Q220982", nameEn: "Tristan da Cunha", aliases: ["SH-TA"], country: "GB", groups: ["SH", "BOTS", "011", "202", "002", "UN"], isoStatus: "excRes", driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["290 8", "44 20"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-13.38232, -34.07258], [-16.67337, -41.9188], [-5.88482, -41.4829], [-13.38232, -34.07258]]]] } },
      { type: "Feature", properties: { iso1A2: "TC", iso1A3: "TCA", iso1N3: "796", wikidata: "Q18221", nameEn: "Turks and Caicos Islands", country: "GB", groups: ["BOTS", "029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1 649"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-71.70065, 25.7637], [-72.98446, 20.4801], [-69.80718, 21.35956], [-71.70065, 25.7637]]]] } },
      { type: "Feature", properties: { iso1A2: "TD", iso1A3: "TCD", iso1N3: "148", wikidata: "Q657", nameEn: "Chad", groups: ["017", "202", "002", "UN"], callingCodes: ["235"] }, geometry: { type: "MultiPolygon", coordinates: [[[[23.99539, 19.49944], [15.99566, 23.49639], [14.99751, 23.00539], [15.19692, 21.99339], [15.20213, 21.49365], [15.28332, 21.44557], [15.62515, 20.95395], [15.57248, 20.92138], [15.55382, 20.86507], [15.56004, 20.79488], [15.59841, 20.74039], [15.6721, 20.70069], [15.99632, 20.35364], [15.75098, 19.93002], [15.6032, 18.77402], [15.50373, 16.89649], [14.37425, 15.72591], [13.86301, 15.04043], [13.78991, 14.87519], [13.809, 14.72915], [13.67878, 14.64013], [13.68573, 14.55276], [13.48259, 14.46704], [13.47559, 14.40881], [13.6302, 13.71094], [14.08251, 13.0797], [14.46881, 13.08259], [14.56101, 12.91036], [14.55058, 12.78256], [14.83314, 12.62963], [14.90827, 12.3269], [14.89019, 12.16593], [14.96952, 12.0925], [15.00146, 12.1223], [15.0349, 12.10698], [15.05786, 12.0608], [15.04808, 11.8731], [15.11579, 11.79313], [15.06595, 11.71126], [15.13149, 11.5537], [15.0585, 11.40481], [15.10021, 11.04101], [15.04957, 11.02347], [15.09127, 10.87431], [15.06737, 10.80921], [15.15532, 10.62846], [15.14936, 10.53915], [15.23724, 10.47764], [15.30874, 10.31063], [15.50535, 10.1098], [15.68761, 9.99344], [15.41408, 9.92876], [15.24618, 9.99246], [15.14043, 9.99246], [15.05999, 9.94845], [14.95722, 9.97926], [14.80082, 9.93818], [14.4673, 10.00264], [14.20411, 10.00055], [14.1317, 9.82413], [14.01793, 9.73169], [13.97544, 9.6365], [14.37094, 9.2954], [14.35707, 9.19611], [14.83566, 8.80557], [15.09484, 8.65982], [15.20426, 8.50892], [15.50743, 7.79302], [15.59272, 7.7696], [15.56964, 7.58936], [15.49743, 7.52179], [15.73118, 7.52006], [15.79942, 7.44149], [16.40703, 7.68809], [16.41583, 7.77971], [16.58315, 7.88657], [16.59415, 7.76444], [16.658, 7.75353], [16.6668, 7.67281], [16.8143, 7.53971], [17.67288, 7.98905], [17.93926, 7.95853], [18.02731, 8.01085], [18.6085, 8.05009], [18.64153, 8.08714], [18.62612, 8.14163], [18.67455, 8.22226], [18.79783, 8.25929], [19.11044, 8.68172], [18.86388, 8.87971], [19.06421, 9.00367], [20.36748, 9.11019], [20.82979, 9.44696], [21.26348, 9.97642], [21.34934, 9.95907], [21.52766, 10.2105], [21.63553, 10.217], [21.71479, 10.29932], [21.72139, 10.64136], [22.45889, 11.00246], [22.87758, 10.91915], [22.97249, 11.21955], [22.93124, 11.41645], [22.7997, 11.40424], [22.54907, 11.64372], [22.64092, 12.07485], [22.48369, 12.02766], [22.50548, 12.16769], [22.38873, 12.45514], [22.46345, 12.61925], [22.22684, 12.74682], [22.15679, 12.66634], [21.98711, 12.63292], [21.89371, 12.68001], [21.81432, 12.81362], [21.94819, 13.05637], [22.02914, 13.13976], [22.1599, 13.19281], [22.29689, 13.3731], [22.08674, 13.77863], [22.22995, 13.96754], [22.5553, 14.11704], [22.55997, 14.23024], [22.44944, 14.24986], [22.38562, 14.58907], [22.70474, 14.69149], [22.66115, 14.86308], [22.99584, 15.22989], [22.99584, 15.40105], [22.92579, 15.47007], [22.93201, 15.55107], [23.10792, 15.71297], [23.38812, 15.69649], [23.62785, 15.7804], [23.99997, 15.69575], [23.99539, 19.49944]]]] } },
      { type: "Feature", properties: { iso1A2: "TF", iso1A3: "ATF", iso1N3: "260", wikidata: "Q129003", nameEn: "French Southern Territories", country: "FR" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "TG", iso1A3: "TGO", iso1N3: "768", wikidata: "Q945", nameEn: "Togo", groups: ["011", "202", "002", "UN"], callingCodes: ["228"] }, geometry: { type: "MultiPolygon", coordinates: [[[[0.50388, 11.01011], [-0.13493, 11.14075], [-0.14462, 11.10811], [-0.05733, 11.08628], [-0.0275, 11.11202], [-514e-5, 11.10763], [342e-5, 11.08317], [0.02395, 11.06229], [0.03355, 10.9807], [-63e-4, 10.96417], [-908e-5, 10.91644], [-0.02685, 10.8783], [-0.0228, 10.81916], [-0.07183, 10.76794], [-0.07327, 10.71845], [-0.09141, 10.7147], [-0.05945, 10.63458], [0.12886, 10.53149], [0.18846, 10.4096], [0.29453, 10.41546], [0.33028, 10.30408], [0.39584, 10.31112], [0.35293, 10.09412], [0.41371, 10.06361], [0.41252, 10.02018], [0.36366, 10.03309], [0.32075, 9.72781], [0.34816, 9.71607], [0.34816, 9.66907], [0.32313, 9.6491], [0.28261, 9.69022], [0.26712, 9.66437], [0.29334, 9.59387], [0.36008, 9.6256], [0.38153, 9.58682], [0.23851, 9.57389], [0.2409, 9.52335], [0.30406, 9.521], [0.31241, 9.50337], [0.2254, 9.47869], [0.25758, 9.42696], [0.33148, 9.44812], [0.36485, 9.49749], [0.49118, 9.48339], [0.56388, 9.40697], [0.45424, 9.04581], [0.52455, 8.87746], [0.37319, 8.75262], [0.47211, 8.59945], [0.64731, 8.48866], [0.73432, 8.29529], [0.63897, 8.25873], [0.5913, 8.19622], [0.61156, 8.18324], [0.6056, 8.13959], [0.58891, 8.12779], [0.62943, 7.85751], [0.58295, 7.62368], [0.51979, 7.58706], [0.52455, 7.45354], [0.57223, 7.39326], [0.62943, 7.41099], [0.65327, 7.31643], [0.59606, 7.01252], [0.52217, 6.9723], [0.52098, 6.94391], [0.56508, 6.92971], [0.52853, 6.82921], [0.57406, 6.80348], [0.58176, 6.76049], [0.6497, 6.73682], [0.63659, 6.63857], [0.74862, 6.56517], [0.71048, 6.53083], [0.89283, 6.33779], [0.99652, 6.33779], [1.03108, 6.24064], [1.05969, 6.22998], [1.09187, 6.17074], [1.19966, 6.17069], [1.19771, 6.11522], [1.27574, 5.93551], [1.67336, 6.02702], [1.62913, 6.24075], [1.79826, 6.28221], [1.76906, 6.43189], [1.58105, 6.68619], [1.61812, 6.74843], [1.55877, 6.99737], [1.64249, 6.99562], [1.61838, 9.0527], [1.5649, 9.16941], [1.41746, 9.3226], [1.33675, 9.54765], [1.36624, 9.5951], [1.35507, 9.99525], [0.77666, 10.37665], [0.80358, 10.71459], [0.8804, 10.803], [0.91245, 10.99597], [0.66104, 10.99964], [0.4958, 10.93269], [0.50521, 10.98035], [0.48852, 10.98561], [0.50388, 11.01011]]]] } },
      { type: "Feature", properties: { iso1A2: "TH", iso1A3: "THA", iso1N3: "764", wikidata: "Q869", nameEn: "Thailand", groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["66"] }, geometry: { type: "MultiPolygon", coordinates: [[[[100.08404, 20.36626], [99.95721, 20.46301], [99.91616, 20.44986], [99.90499, 20.4487], [99.89692, 20.44789], [99.89301, 20.44311], [99.89168, 20.44548], [99.88451, 20.44596], [99.88211, 20.44488], [99.86383, 20.44371], [99.81096, 20.33687], [99.68255, 20.32077], [99.46008, 20.39673], [99.46077, 20.36198], [99.5569, 20.20676], [99.52943, 20.14811], [99.416, 20.08614], [99.20328, 20.12877], [99.0735, 20.10298], [98.98679, 19.7419], [98.83661, 19.80931], [98.56065, 19.67807], [98.51182, 19.71303], [98.24884, 19.67876], [98.13829, 19.78541], [98.03314, 19.80941], [98.04364, 19.65755], [97.84715, 19.55782], [97.88423, 19.5041], [97.78769, 19.39429], [97.84186, 19.29526], [97.78606, 19.26769], [97.84024, 19.22217], [97.83479, 19.09972], [97.73797, 19.04261], [97.73654, 18.9812], [97.66487, 18.9371], [97.73836, 18.88478], [97.76752, 18.58097], [97.5258, 18.4939], [97.36444, 18.57138], [97.34522, 18.54596], [97.50383, 18.26844], [97.56219, 18.33885], [97.64116, 18.29778], [97.60841, 18.23846], [97.73723, 17.97912], [97.66794, 17.88005], [97.76407, 17.71595], [97.91829, 17.54504], [98.11185, 17.36829], [98.10439, 17.33847], [98.34566, 17.04822], [98.39441, 17.06266], [98.52624, 16.89979], [98.49603, 16.8446], [98.53833, 16.81934], [98.46994, 16.73613], [98.50253, 16.7139], [98.49713, 16.69022], [98.51043, 16.70107], [98.51579, 16.69433], [98.51472, 16.68521], [98.51833, 16.676], [98.51113, 16.64503], [98.5695, 16.62826], [98.57912, 16.55983], [98.63817, 16.47424], [98.68074, 16.27068], [98.84485, 16.42354], [98.92656, 16.36425], [98.8376, 16.11706], [98.69585, 16.13353], [98.57019, 16.04578], [98.59853, 15.87197], [98.541, 15.65406], [98.58598, 15.46821], [98.56027, 15.33471], [98.4866, 15.39154], [98.39351, 15.34177], [98.41906, 15.27103], [98.40522, 15.25268], [98.30446, 15.30667], [98.22, 15.21327], [98.18821, 15.13125], [98.24874, 14.83013], [98.56762, 14.37701], [98.97356, 14.04868], [99.16695, 13.72621], [99.20617, 13.20575], [99.12225, 13.19847], [99.10646, 13.05804], [99.18748, 12.9898], [99.18905, 12.84799], [99.29254, 12.68921], [99.409, 12.60603], [99.47519, 12.1353], [99.56445, 12.14805], [99.53424, 12.02317], [99.64891, 11.82699], [99.64108, 11.78948], [99.5672, 11.62732], [99.47598, 11.62434], [99.39485, 11.3925], [99.31573, 11.32081], [99.32756, 11.28545], [99.06938, 10.94857], [99.02337, 10.97217], [98.99701, 10.92962], [99.0069, 10.85485], [98.86819, 10.78336], [98.78511, 10.68351], [98.77275, 10.62548], [98.81944, 10.52761], [98.7391, 10.31488], [98.55174, 9.92804], [98.52291, 9.92389], [98.47298, 9.95782], [98.33094, 9.91973], [98.12555, 9.44056], [97.63455, 9.60854], [97.19814, 8.18901], [99.31854, 5.99868], [99.50117, 6.44501], [99.91873, 6.50233], [100.0756, 6.4045], [100.12, 6.42105], [100.19511, 6.72559], [100.29651, 6.68439], [100.30828, 6.66462], [100.31618, 6.66781], [100.31884, 6.66423], [100.32671, 6.66526], [100.32607, 6.65933], [100.31929, 6.65413], [100.35413, 6.54932], [100.41152, 6.52299], [100.41791, 6.5189], [100.42351, 6.51762], [100.43027, 6.52389], [100.66986, 6.45086], [100.74361, 6.50811], [100.74822, 6.46231], [100.81045, 6.45086], [100.85884, 6.24929], [101.10313, 6.25617], [101.12618, 6.19431], [101.06165, 6.14161], [101.12388, 6.11411], [101.087, 5.9193], [101.02708, 5.91013], [100.98815, 5.79464], [101.14062, 5.61613], [101.25755, 5.71065], [101.25524, 5.78633], [101.58019, 5.93534], [101.69773, 5.75881], [101.75074, 5.79091], [101.80144, 5.74505], [101.89188, 5.8386], [101.91776, 5.84269], [101.92819, 5.85511], [101.94712, 5.98421], [101.9714, 6.00575], [101.97114, 6.01992], [101.99209, 6.04075], [102.01835, 6.05407], [102.09182, 6.14161], [102.07732, 6.193], [102.08127, 6.22679], [102.09086, 6.23546], [102.46318, 7.22462], [102.47649, 9.66162], [102.52395, 11.25257], [102.91449, 11.65512], [102.90973, 11.75613], [102.83957, 11.8519], [102.78427, 11.98746], [102.77026, 12.06815], [102.70176, 12.1686], [102.73134, 12.37091], [102.78116, 12.40284], [102.7796, 12.43781], [102.57567, 12.65358], [102.51963, 12.66117], [102.4994, 12.71736], [102.53053, 12.77506], [102.49335, 12.92711], [102.48694, 12.97537], [102.52275, 12.99813], [102.46011, 13.08057], [102.43422, 13.09061], [102.36146, 13.26006], [102.36001, 13.31142], [102.34611, 13.35618], [102.35692, 13.38274], [102.35563, 13.47307], [102.361, 13.50551], [102.33828, 13.55613], [102.36859, 13.57488], [102.44601, 13.5637], [102.5358, 13.56933], [102.57573, 13.60461], [102.62483, 13.60883], [102.58635, 13.6286], [102.5481, 13.6589], [102.56848, 13.69366], [102.72727, 13.77806], [102.77864, 13.93374], [102.91251, 14.01531], [102.93275, 14.19044], [103.16469, 14.33075], [103.39353, 14.35639], [103.53518, 14.42575], [103.71109, 14.4348], [103.70175, 14.38052], [103.93836, 14.3398], [104.27616, 14.39861], [104.55014, 14.36091], [104.69335, 14.42726], [104.97667, 14.38806], [105.02804, 14.23722], [105.08408, 14.20402], [105.14012, 14.23873], [105.17748, 14.34432], [105.20894, 14.34967], [105.43783, 14.43865], [105.53864, 14.55731], [105.5121, 14.80802], [105.61162, 15.00037], [105.46661, 15.13132], [105.58043, 15.32724], [105.50662, 15.32054], [105.4692, 15.33709], [105.47635, 15.3796], [105.58191, 15.41031], [105.60446, 15.53301], [105.61756, 15.68792], [105.46573, 15.74742], [105.42285, 15.76971], [105.37959, 15.84074], [105.34115, 15.92737], [105.38508, 15.987], [105.42001, 16.00657], [105.06204, 16.09792], [105.00262, 16.25627], [104.88057, 16.37311], [104.73349, 16.565], [104.76099, 16.69302], [104.7397, 16.81005], [104.76442, 16.84752], [104.7373, 16.91125], [104.73712, 17.01404], [104.80716, 17.19025], [104.80061, 17.39367], [104.69867, 17.53038], [104.45404, 17.66788], [104.35432, 17.82871], [104.2757, 17.86139], [104.21776, 17.99335], [104.10927, 18.10826], [104.06533, 18.21656], [103.97725, 18.33631], [103.93916, 18.33914], [103.85642, 18.28666], [103.82449, 18.33979], [103.699, 18.34125], [103.60957, 18.40528], [103.47773, 18.42841], [103.41044, 18.4486], [103.30977, 18.4341], [103.24779, 18.37807], [103.23818, 18.34875], [103.29757, 18.30475], [103.17093, 18.2618], [103.14994, 18.23172], [103.1493, 18.17799], [103.07343, 18.12351], [103.07823, 18.03833], [103.0566, 18.00144], [103.01998, 17.97095], [102.9912, 17.9949], [102.95812, 18.0054], [102.86323, 17.97531], [102.81988, 17.94233], [102.79044, 17.93612], [102.75954, 17.89561], [102.68538, 17.86653], [102.67543, 17.84529], [102.69946, 17.81686], [102.68194, 17.80151], [102.59485, 17.83537], [102.5896, 17.84889], [102.61432, 17.92273], [102.60971, 17.95411], [102.59234, 17.96127], [102.45523, 17.97106], [102.11359, 18.21532], [101.88485, 18.02474], [101.78087, 18.07559], [101.72294, 17.92867], [101.44667, 17.7392], [101.15108, 17.47586], [100.96541, 17.57926], [101.02185, 17.87637], [101.1793, 18.0544], [101.19118, 18.2125], [101.15108, 18.25624], [101.18227, 18.34367], [101.06047, 18.43247], [101.27585, 18.68875], [101.22832, 18.73377], [101.25803, 18.89545], [101.35606, 19.04716], [101.261, 19.12717], [101.24911, 19.33334], [101.20604, 19.35296], [101.21347, 19.46223], [101.26991, 19.48324], [101.26545, 19.59242], [101.08928, 19.59748], [100.90302, 19.61901], [100.77231, 19.48324], [100.64606, 19.55884], [100.58219, 19.49164], [100.49604, 19.53504], [100.398, 19.75047], [100.5094, 19.87904], [100.58808, 20.15791], [100.55218, 20.17741], [100.51052, 20.14928], [100.47567, 20.19133], [100.4537, 20.19971], [100.44992, 20.23644], [100.41473, 20.25625], [100.37439, 20.35156], [100.33383, 20.4028], [100.25769, 20.3992], [100.22076, 20.31598], [100.16668, 20.2986], [100.1712, 20.24324], [100.11785, 20.24787], [100.09337, 20.26293], [100.09999, 20.31614], [100.08404, 20.36626]]]] } },
      { type: "Feature", properties: { iso1A2: "TJ", iso1A3: "TJK", iso1N3: "762", wikidata: "Q863", nameEn: "Tajikistan", groups: ["143", "142", "UN"], callingCodes: ["992"] }, geometry: { type: "MultiPolygon", coordinates: [[[[70.45251, 41.04438], [70.38028, 41.02014], [70.36655, 40.90296], [69.69434, 40.62615], [69.59441, 40.70181], [69.53021, 40.77621], [69.38327, 40.7918], [69.32834, 40.70233], [69.3455, 40.57988], [69.2643, 40.57506], [69.21063, 40.54469], [69.27066, 40.49274], [69.28525, 40.41894], [69.30774, 40.36102], [69.33794, 40.34819], [69.32833, 40.29794], [69.30808, 40.2821], [69.24817, 40.30357], [69.25229, 40.26362], [69.30104, 40.24502], [69.30448, 40.18774], [69.2074, 40.21488], [69.15659, 40.2162], [69.04544, 40.22904], [68.85832, 40.20885], [68.84357, 40.18604], [68.79276, 40.17555], [68.77902, 40.20492], [68.5332, 40.14826], [68.52771, 40.11676], [68.62796, 40.07789], [69.01523, 40.15771], [69.01935, 40.11466], [68.96579, 40.06949], [68.84906, 40.04952], [68.93695, 39.91167], [68.88889, 39.87163], [68.63071, 39.85265], [68.61972, 39.68905], [68.54166, 39.53929], [68.12053, 39.56317], [67.70992, 39.66156], [67.62889, 39.60234], [67.44899, 39.57799], [67.46547, 39.53564], [67.39681, 39.52505], [67.46822, 39.46146], [67.45998, 39.315], [67.36522, 39.31287], [67.33226, 39.23739], [67.67833, 39.14479], [67.68915, 39.00775], [68.09704, 39.02589], [68.19743, 38.85985], [68.06948, 38.82115], [68.12877, 38.73677], [68.05598, 38.71641], [68.0807, 38.64136], [68.05873, 38.56087], [68.11366, 38.47169], [68.06274, 38.39435], [68.13289, 38.40822], [68.40343, 38.19484], [68.27159, 37.91477], [68.12635, 37.93], [67.81566, 37.43107], [67.8474, 37.31594], [67.78329, 37.1834], [67.7803, 37.08978], [67.87917, 37.0591], [68.02194, 36.91923], [68.18542, 37.02074], [68.27605, 37.00977], [68.29253, 37.10621], [68.41201, 37.10402], [68.41888, 37.13906], [68.61851, 37.19815], [68.6798, 37.27906], [68.81438, 37.23862], [68.80889, 37.32494], [68.91189, 37.26704], [68.88168, 37.33368], [68.96407, 37.32603], [69.03274, 37.25174], [69.25152, 37.09426], [69.39529, 37.16752], [69.45022, 37.23315], [69.36645, 37.40462], [69.44954, 37.4869], [69.51888, 37.5844], [69.80041, 37.5746], [69.84435, 37.60616], [69.93362, 37.61378], [69.95971, 37.5659], [70.15015, 37.52519], [70.28243, 37.66706], [70.27694, 37.81258], [70.1863, 37.84296], [70.17206, 37.93276], [70.4898, 38.12546], [70.54673, 38.24541], [70.60407, 38.28046], [70.61526, 38.34774], [70.64966, 38.34999], [70.69189, 38.37031], [70.6761, 38.39144], [70.67438, 38.40597], [70.69807, 38.41861], [70.72485, 38.4131], [70.75455, 38.4252], [70.77132, 38.45548], [70.78581, 38.45502], [70.78702, 38.45031], [70.79766, 38.44944], [70.80521, 38.44447], [70.81697, 38.44507], [70.82538, 38.45394], [70.84376, 38.44688], [70.88719, 38.46826], [70.92728, 38.43021], [70.98693, 38.48862], [71.03545, 38.44779], [71.0556, 38.40176], [71.09542, 38.42517], [71.10592, 38.42077], [71.10957, 38.40671], [71.1451, 38.40106], [71.21291, 38.32797], [71.33114, 38.30339], [71.33869, 38.27335], [71.37803, 38.25641], [71.36444, 38.15358], [71.29878, 38.04429], [71.28922, 38.01272], [71.27622, 37.99946], [71.27278, 37.96496], [71.24969, 37.93031], [71.2809, 37.91995], [71.296, 37.93403], [71.32871, 37.88564], [71.51565, 37.95349], [71.58843, 37.92425], [71.59255, 37.79956], [71.55752, 37.78677], [71.54324, 37.77104], [71.53053, 37.76534], [71.55234, 37.73209], [71.54186, 37.69691], [71.51972, 37.61945], [71.5065, 37.60912], [71.49693, 37.53527], [71.50616, 37.50733], [71.5256, 37.47971], [71.49612, 37.4279], [71.47685, 37.40281], [71.4862, 37.33405], [71.49821, 37.31975], [71.50674, 37.31502], [71.48536, 37.26017], [71.4824, 37.24921], [71.48339, 37.23937], [71.47386, 37.2269], [71.4555, 37.21418], [71.4494, 37.18137], [71.44127, 37.11856], [71.43097, 37.05855], [71.45578, 37.03094], [71.46923, 36.99925], [71.48481, 36.93218], [71.51502, 36.89128], [71.57195, 36.74943], [71.67083, 36.67346], [71.83229, 36.68084], [72.31676, 36.98115], [72.54095, 37.00007], [72.66381, 37.02014], [72.79693, 37.22222], [73.06884, 37.31729], [73.29633, 37.46495], [73.77197, 37.4417], [73.76647, 37.33913], [73.61129, 37.27469], [73.64974, 37.23643], [73.82552, 37.22659], [73.8564, 37.26158], [74.20308, 37.34208], [74.23339, 37.41116], [74.41055, 37.3948], [74.56161, 37.37734], [74.68383, 37.3948], [74.8294, 37.3435], [74.88887, 37.23275], [75.12328, 37.31839], [75.09719, 37.37297], [75.15899, 37.41443], [75.06011, 37.52779], [74.94338, 37.55501], [74.8912, 37.67576], [75.00935, 37.77486], [74.92416, 37.83428], [74.9063, 38.03033], [74.82665, 38.07359], [74.80331, 38.19889], [74.69894, 38.22155], [74.69619, 38.42947], [74.51217, 38.47034], [74.17022, 38.65504], [73.97933, 38.52945], [73.79806, 38.61106], [73.80656, 38.66449], [73.7033, 38.84782], [73.7445, 38.93867], [73.82964, 38.91517], [73.81728, 39.04007], [73.75823, 39.023], [73.60638, 39.24534], [73.54572, 39.27567], [73.55396, 39.3543], [73.5004, 39.38402], [73.59241, 39.40843], [73.59831, 39.46425], [73.45096, 39.46677], [73.31912, 39.38615], [73.18454, 39.35536], [72.85934, 39.35116], [72.62027, 39.39696], [72.33173, 39.33093], [72.23834, 39.17248], [72.17242, 39.2661], [72.09689, 39.26823], [72.04059, 39.36704], [71.90601, 39.27674], [71.79202, 39.27355], [71.7522, 39.32031], [71.80164, 39.40631], [71.76816, 39.45456], [71.62688, 39.44056], [71.5517, 39.45722], [71.55856, 39.57588], [71.49814, 39.61397], [71.08752, 39.50704], [71.06418, 39.41586], [70.7854, 39.38933], [70.64087, 39.58792], [70.44757, 39.60128], [70.2869, 39.53141], [70.11111, 39.58223], [69.87491, 39.53882], [69.68677, 39.59281], [69.3594, 39.52516], [69.26938, 39.8127], [69.35649, 40.01994], [69.43134, 39.98431], [69.43557, 39.92877], [69.53615, 39.93991], [69.5057, 40.03277], [69.53855, 40.0887], [69.53794, 40.11833], [69.55555, 40.12296], [69.57615, 40.10524], [69.64704, 40.12165], [69.67001, 40.10639], [70.01283, 40.23288], [70.58297, 40.00891], [70.57384, 39.99394], [70.47557, 39.93216], [70.55033, 39.96619], [70.58912, 39.95211], [70.65946, 39.9878], [70.65827, 40.0981], [70.7928, 40.12797], [70.80495, 40.16813], [70.9818, 40.22392], [70.8607, 40.217], [70.62342, 40.17396], [70.56394, 40.26421], [70.57149, 40.3442], [70.37511, 40.38605], [70.32626, 40.45174], [70.49871, 40.52503], [70.80009, 40.72825], [70.45251, 41.04438]]], [[[70.68112, 40.90612], [70.6158, 40.97661], [70.56077, 41.00642], [70.54223, 40.98787], [70.57501, 40.98941], [70.6721, 40.90555], [70.68112, 40.90612]]], [[[70.74189, 39.86319], [70.53651, 39.89155], [70.52631, 39.86989], [70.54998, 39.85137], [70.59667, 39.83542], [70.63105, 39.77923], [70.74189, 39.86319]]]] } },
      { type: "Feature", properties: { iso1A2: "TK", iso1A3: "TKL", iso1N3: "772", wikidata: "Q36823", nameEn: "Tokelau", country: "NZ", groups: ["061", "009", "UN"], driveSide: "left", callingCodes: ["690"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-168.251, -9.44289], [-174.18635, -7.80441], [-174.17993, -10.13616], [-168.251, -9.44289]]]] } },
      { type: "Feature", properties: { iso1A2: "TL", iso1A3: "TLS", iso1N3: "626", wikidata: "Q574", nameEn: "East Timor", aliases: ["Timor-Leste", "TP"], groups: ["035", "142", "UN"], driveSide: "left", callingCodes: ["670"] }, geometry: { type: "MultiPolygon", coordinates: [[[[124.46701, -9.13002], [124.94011, -8.85617], [124.97742, -9.08128], [125.11764, -8.96359], [125.18632, -9.03142], [125.18907, -9.16434], [125.09434, -9.19669], [125.04044, -9.17093], [124.97892, -9.19281], [125.09025, -9.46406], [125.68138, -9.85176], [127.55165, -9.05052], [127.42116, -8.22471], [125.87691, -8.31789], [125.58506, -7.95311], [124.92337, -8.75859], [124.33472, -9.11416], [124.04628, -9.22671], [124.04286, -9.34243], [124.10539, -9.41206], [124.14517, -9.42324], [124.21247, -9.36904], [124.28115, -9.42189], [124.28115, -9.50453], [124.3535, -9.48493], [124.35258, -9.43002], [124.38554, -9.3582], [124.45971, -9.30263], [124.46701, -9.13002]]]] } },
      { type: "Feature", properties: { iso1A2: "TM", iso1A3: "TKM", iso1N3: "795", wikidata: "Q874", nameEn: "Turkmenistan", groups: ["143", "142", "UN"], callingCodes: ["993"] }, geometry: { type: "MultiPolygon", coordinates: [[[[60.5078, 41.21694], [60.06581, 41.4363], [60.18117, 41.60082], [60.06032, 41.76287], [60.08504, 41.80997], [60.33223, 41.75058], [59.95046, 41.97966], [60.0356, 42.01028], [60.04659, 42.08982], [59.96419, 42.1428], [60.00539, 42.212], [59.94633, 42.27655], [59.4341, 42.29738], [59.2955, 42.37064], [59.17317, 42.52248], [58.93422, 42.5407], [58.6266, 42.79314], [58.57991, 42.64988], [58.27504, 42.69632], [58.14321, 42.62159], [58.29427, 42.56497], [58.51674, 42.30348], [58.40688, 42.29535], [58.3492, 42.43335], [57.99214, 42.50021], [57.90975, 42.4374], [57.92897, 42.24047], [57.84932, 42.18555], [57.6296, 42.16519], [57.30275, 42.14076], [57.03633, 41.92043], [56.96218, 41.80383], [57.03359, 41.41777], [57.13796, 41.36625], [57.03423, 41.25435], [56.00314, 41.32584], [55.45471, 41.25609], [54.95182, 41.92424], [54.20635, 42.38477], [52.97575, 42.1308], [52.47884, 41.78034], [52.26048, 41.69249], [51.7708, 40.29239], [53.89734, 37.3464], [54.24565, 37.32047], [54.36211, 37.34912], [54.58664, 37.45809], [54.67247, 37.43532], [54.77822, 37.51597], [54.81804, 37.61285], [54.77684, 37.62264], [54.851, 37.75739], [55.13412, 37.94705], [55.44152, 38.08564], [55.76561, 38.12238], [55.97847, 38.08024], [56.33278, 38.08132], [56.32454, 38.18502], [56.43303, 38.26054], [56.62255, 38.24005], [56.73928, 38.27887], [57.03453, 38.18717], [57.21169, 38.28965], [57.37236, 38.09321], [57.35042, 37.98546], [57.79534, 37.89299], [58.21399, 37.77281], [58.22999, 37.6856], [58.39959, 37.63134], [58.47786, 37.6433], [58.5479, 37.70526], [58.6921, 37.64548], [58.9338, 37.67374], [59.22905, 37.51161], [59.33507, 37.53146], [59.39797, 37.47892], [59.39385, 37.34257], [59.55178, 37.13594], [59.74678, 37.12499], [60.00768, 37.04102], [60.34767, 36.63214], [61.14516, 36.64644], [61.18187, 36.55348], [61.1393, 36.38782], [61.22719, 36.12759], [61.12007, 35.95992], [61.22444, 35.92879], [61.26152, 35.80749], [61.22719, 35.67038], [61.27371, 35.61482], [61.58742, 35.43803], [61.77693, 35.41341], [61.97743, 35.4604], [62.05709, 35.43803], [62.15871, 35.33278], [62.29191, 35.25964], [62.29878, 35.13312], [62.48006, 35.28796], [62.62288, 35.22067], [62.74098, 35.25432], [62.90853, 35.37086], [63.0898, 35.43131], [63.12276, 35.53196], [63.10079, 35.63024], [63.23262, 35.67487], [63.10318, 35.81782], [63.12276, 35.86208], [63.29579, 35.85985], [63.53475, 35.90881], [63.56496, 35.95106], [63.98519, 36.03773], [64.05385, 36.10433], [64.43288, 36.24401], [64.57295, 36.34362], [64.62514, 36.44311], [64.61141, 36.6351], [64.97945, 37.21913], [65.51778, 37.23881], [65.64263, 37.34388], [65.64137, 37.45061], [65.72274, 37.55438], [66.30993, 37.32409], [66.55743, 37.35409], [66.52303, 37.39827], [66.65761, 37.45497], [66.52852, 37.58568], [66.53676, 37.80084], [66.67684, 37.96776], [66.56697, 38.0435], [66.41042, 38.02403], [66.24013, 38.16238], [65.83913, 38.25733], [65.55873, 38.29052], [64.32576, 38.98691], [64.19086, 38.95561], [63.70778, 39.22349], [63.6913, 39.27666], [62.43337, 39.98528], [62.34273, 40.43206], [62.11751, 40.58242], [61.87856, 41.12257], [61.4446, 41.29407], [61.39732, 41.19873], [61.33199, 41.14946], [61.22212, 41.14946], [61.03261, 41.25691], [60.5078, 41.21694]]]] } },
      { type: "Feature", properties: { iso1A2: "TN", iso1A3: "TUN", iso1N3: "788", wikidata: "Q948", nameEn: "Tunisia", groups: ["015", "002", "UN"], callingCodes: ["216"] }, geometry: { type: "MultiPolygon", coordinates: [[[[11.2718, 37.6713], [7.89009, 38.19924], [8.59123, 37.14286], [8.64044, 36.9401], [8.62972, 36.86499], [8.67706, 36.8364], [8.57613, 36.78062], [8.46537, 36.7706], [8.47609, 36.66607], [8.16167, 36.48817], [8.18936, 36.44939], [8.40731, 36.42208], [8.2626, 35.91733], [8.26472, 35.73669], [8.35371, 35.66373], [8.36086, 35.47774], [8.30329, 35.29884], [8.47318, 35.23376], [8.3555, 35.10007], [8.30727, 34.95378], [8.25189, 34.92009], [8.29655, 34.72798], [8.20482, 34.57575], [7.86264, 34.3987], [7.81242, 34.21841], [7.74207, 34.16492], [7.66174, 34.20167], [7.52851, 34.06493], [7.54088, 33.7726], [7.73687, 33.42114], [7.83028, 33.18851], [8.11433, 33.10175], [8.1179, 33.05086], [8.31895, 32.83483], [8.35999, 32.50101], [9.07483, 32.07865], [9.55544, 30.23971], [9.76848, 30.34366], [9.88152, 30.34074], [10.29516, 30.90337], [10.12239, 31.42098], [10.31364, 31.72648], [10.48497, 31.72956], [10.62788, 31.96629], [10.7315, 31.97235], [11.04234, 32.2145], [11.53898, 32.4138], [11.57828, 32.48013], [11.46037, 32.6307], [11.51549, 33.09826], [11.55852, 33.1409], [11.58941, 33.36891], [11.2718, 37.6713]]]] } },
      { type: "Feature", properties: { iso1A2: "TO", iso1A3: "TON", iso1N3: "776", wikidata: "Q678", nameEn: "Tonga", groups: ["061", "009", "UN"], driveSide: "left", callingCodes: ["676"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-176.74538, -22.89767], [-180, -22.90585], [-180, -24.21376], [-173.10761, -24.19665], [-173.13438, -14.94228], [-176.76826, -14.95183], [-176.74538, -22.89767]]]] } },
      { type: "Feature", properties: { iso1A2: "TR", iso1A3: "TUR", iso1N3: "792", wikidata: "Q43", nameEn: "Turkey", groups: ["145", "142", "UN"], callingCodes: ["90"] }, geometry: { type: "MultiPolygon", coordinates: [[[[41.54366, 41.52185], [40.89217, 41.72528], [34.8305, 42.4581], [28.32297, 41.98371], [28.02971, 41.98066], [27.91479, 41.97902], [27.83492, 41.99709], [27.81235, 41.94803], [27.69949, 41.97515], [27.55191, 41.90928], [27.52379, 41.93756], [27.45478, 41.96591], [27.27411, 42.10409], [27.22376, 42.10152], [27.19251, 42.06028], [27.08486, 42.08735], [27.03277, 42.0809], [26.95638, 42.00741], [26.79143, 41.97386], [26.62996, 41.97644], [26.56051, 41.92995], [26.57961, 41.90024], [26.53968, 41.82653], [26.36952, 41.82265], [26.33589, 41.76802], [26.32952, 41.73637], [26.35957, 41.71149], [26.47958, 41.67037], [26.5209, 41.62592], [26.59196, 41.60491], [26.59742, 41.48058], [26.61767, 41.42281], [26.62997, 41.34613], [26.5837, 41.32131], [26.5209, 41.33993], [26.39861, 41.25053], [26.32259, 41.24929], [26.31928, 41.07386], [26.3606, 41.02027], [26.33297, 40.98388], [26.35894, 40.94292], [26.32259, 40.94042], [26.28623, 40.93005], [26.29441, 40.89119], [26.26169, 40.9168], [26.20856, 40.86048], [26.21351, 40.83298], [26.15685, 40.80709], [26.12854, 40.77339], [26.12495, 40.74283], [26.08638, 40.73214], [26.0754, 40.72772], [26.03489, 40.73051], [25.94795, 40.72797], [26.04292, 40.3958], [25.61285, 40.17161], [25.94257, 39.39358], [26.43357, 39.43096], [26.70773, 39.0312], [26.61814, 38.81372], [26.21136, 38.65436], [26.32173, 38.48731], [26.24183, 38.44695], [26.21136, 38.17558], [27.05537, 37.9131], [27.16428, 37.72343], [26.99377, 37.69034], [26.95583, 37.64989], [27.14757, 37.32], [27.20312, 36.94571], [27.45627, 36.9008], [27.24613, 36.71622], [27.46117, 36.53789], [27.89482, 36.69898], [27.95037, 36.46155], [28.23708, 36.56812], [29.30783, 36.01033], [29.48192, 36.18377], [29.61002, 36.1731], [29.61805, 36.14179], [29.69611, 36.10365], [29.73302, 35.92555], [32.82353, 35.70297], [35.51152, 36.10954], [35.931, 35.92109], [35.98499, 35.94107], [36.00514, 35.94113], [36.01844, 35.92403], [35.99829, 35.88242], [36.11827, 35.85923], [36.13919, 35.83692], [36.14029, 35.81015], [36.1623, 35.80925], [36.17441, 35.92076], [36.19973, 35.95195], [36.25366, 35.96264], [36.27678, 35.94839], [36.29769, 35.96086], [36.28338, 36.00273], [36.30099, 36.00985], [36.33956, 35.98687], [36.37474, 36.01163], [36.39206, 36.22088], [36.4617, 36.20461], [36.50463, 36.2419], [36.6125, 36.22592], [36.68672, 36.23677], [36.65653, 36.33861], [36.6081, 36.33772], [36.54206, 36.49539], [36.58829, 36.58295], [36.57398, 36.65186], [36.62681, 36.71189], [36.61581, 36.74629], [36.66727, 36.82901], [36.99557, 36.75997], [36.99886, 36.74012], [37.04399, 36.73483], [37.04619, 36.71101], [37.01647, 36.69512], [37.02088, 36.66422], [37.08279, 36.63495], [37.10894, 36.6704], [37.16177, 36.66069], [37.21988, 36.6736], [37.47253, 36.63243], [37.49103, 36.66904], [37.68048, 36.75065], [37.81974, 36.76055], [38.21064, 36.91842], [38.38859, 36.90064], [38.55908, 36.84429], [38.74042, 36.70629], [39.03217, 36.70911], [39.21538, 36.66834], [39.81589, 36.75538], [40.69136, 37.0996], [40.90856, 37.13147], [41.21937, 37.07665], [41.515, 37.08084], [42.00894, 37.17209], [42.18225, 37.28569], [42.19301, 37.31323], [42.2112, 37.32491], [42.22257, 37.31395], [42.22381, 37.30238], [42.20454, 37.28715], [42.21548, 37.28026], [42.23683, 37.2863], [42.26039, 37.27017], [42.2824, 37.2798], [42.34735, 37.22548], [42.32313, 37.17814], [42.35724, 37.10998], [42.56725, 37.14878], [42.78887, 37.38615], [42.93705, 37.32015], [43.11403, 37.37436], [43.30083, 37.30629], [43.33508, 37.33105], [43.50787, 37.24436], [43.56702, 37.25675], [43.63085, 37.21957], [43.7009, 37.23692], [43.8052, 37.22825], [43.82699, 37.19477], [43.84878, 37.22205], [43.90949, 37.22453], [44.02002, 37.33229], [44.13521, 37.32486], [44.2613, 37.25055], [44.27998, 37.16501], [44.22239, 37.15756], [44.18503, 37.09551], [44.25975, 36.98119], [44.30645, 36.97373], [44.35937, 37.02843], [44.35315, 37.04955], [44.38117, 37.05825], [44.42631, 37.05825], [44.63179, 37.19229], [44.76698, 37.16162], [44.78319, 37.1431], [44.7868, 37.16644], [44.75986, 37.21549], [44.81021, 37.2915], [44.58449, 37.45018], [44.61401, 37.60165], [44.56887, 37.6429], [44.62096, 37.71985], [44.55498, 37.783], [44.45948, 37.77065], [44.3883, 37.85433], [44.22509, 37.88859], [44.42476, 38.25763], [44.50115, 38.33939], [44.44386, 38.38295], [44.38309, 38.36117], [44.3119, 38.37887], [44.3207, 38.49799], [44.32058, 38.62752], [44.28065, 38.6465], [44.26155, 38.71427], [44.30322, 38.81581], [44.18863, 38.93881], [44.20946, 39.13975], [44.1043, 39.19842], [44.03667, 39.39223], [44.22452, 39.4169], [44.29818, 39.378], [44.37921, 39.4131], [44.42832, 39.4131], [44.41849, 39.56659], [44.48111, 39.61579], [44.47298, 39.68788], [44.6137, 39.78393], [44.65422, 39.72163], [44.71806, 39.71124], [44.81043, 39.62677], [44.80977, 39.65768], [44.75779, 39.7148], [44.61845, 39.8281], [44.46635, 39.97733], [44.26973, 40.04866], [44.1778, 40.02845], [44.1057, 40.03555], [43.92307, 40.01787], [43.65688, 40.11199], [43.65221, 40.14889], [43.71136, 40.16673], [43.59928, 40.34019], [43.60862, 40.43267], [43.54791, 40.47413], [43.63664, 40.54159], [43.7425, 40.66805], [43.74872, 40.7365], [43.67712, 40.84846], [43.67712, 40.93084], [43.58683, 40.98961], [43.47319, 41.02251], [43.44984, 41.0988], [43.4717, 41.12611], [43.44973, 41.17666], [43.36118, 41.2028], [43.23096, 41.17536], [43.1945, 41.25242], [43.13373, 41.25503], [43.21707, 41.30331], [43.02956, 41.37891], [42.8785, 41.50516], [42.84899, 41.47265], [42.78995, 41.50126], [42.84471, 41.58912], [42.72794, 41.59714], [42.59202, 41.58183], [42.51772, 41.43606], [42.26387, 41.49346], [41.95134, 41.52466], [41.81939, 41.43621], [41.7124, 41.47417], [41.7148, 41.4932], [41.54366, 41.52185]]]] } },
      { type: "Feature", properties: { iso1A2: "TT", iso1A3: "TTO", iso1N3: "780", wikidata: "Q754", nameEn: "Trinidad and Tobago", groups: ["029", "003", "419", "019", "UN"], driveSide: "left", callingCodes: ["1 868"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-61.62505, 11.18974], [-62.08693, 10.04435], [-60.89962, 9.81445], [-60.07172, 11.77667], [-61.62505, 11.18974]]]] } },
      { type: "Feature", properties: { iso1A2: "TV", iso1A3: "TUV", iso1N3: "798", wikidata: "Q672", nameEn: "Tuvalu", groups: ["061", "009", "UN"], driveSide: "left", callingCodes: ["688"] }, geometry: { type: "MultiPolygon", coordinates: [[[[174, -5], [174, -11.5], [179.99999, -11.5], [179.99999, -5], [174, -5]]]] } },
      { type: "Feature", properties: { iso1A2: "TW", iso1A3: "TWN", iso1N3: "158", wikidata: "Q865", nameEn: "Taiwan", aliases: ["RC"], groups: ["030", "142"], callingCodes: ["886"] }, geometry: { type: "MultiPolygon", coordinates: [[[[121.8109, 21.77688], [122.26612, 25.98197], [120.49232, 25.22863], [118.56434, 24.49266], [118.42453, 24.54644], [118.35291, 24.51645], [118.28244, 24.51231], [118.11703, 24.39734], [120.69238, 21.52331], [121.8109, 21.77688]]]] } },
      { type: "Feature", properties: { iso1A2: "TZ", iso1A3: "TZA", iso1N3: "834", wikidata: "Q924", nameEn: "Tanzania", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["255"] }, geometry: { type: "MultiPolygon", coordinates: [[[[30.80408, -0.99911], [30.76635, -0.9852], [30.70631, -1.01175], [30.64166, -1.06601], [30.47194, -1.0555], [30.45116, -1.10641], [30.50889, -1.16412], [30.57123, -1.33264], [30.71974, -1.43244], [30.84079, -1.64652], [30.80802, -1.91477], [30.89303, -2.08223], [30.83915, -2.35795], [30.54501, -2.41404], [30.41789, -2.66266], [30.52747, -2.65841], [30.40662, -2.86151], [30.4987, -2.9573], [30.57926, -2.89791], [30.6675, -2.98987], [30.83823, -2.97837], [30.84165, -3.25152], [30.45915, -3.56532], [30.22042, -4.01738], [30.03323, -4.26631], [29.88172, -4.35743], [29.82885, -4.36153], [29.77289, -4.41733], [29.75109, -4.45836], [29.63827, -4.44681], [29.43673, -4.44845], [29.52552, -6.2731], [30.2567, -7.14121], [30.79243, -8.27382], [31.00796, -8.58615], [31.37533, -8.60769], [31.57147, -8.70619], [31.57147, -8.81388], [31.71158, -8.91386], [31.81587, -8.88618], [31.94663, -8.93846], [31.94196, -9.02303], [31.98866, -9.07069], [32.08206, -9.04609], [32.16146, -9.05993], [32.25486, -9.13371], [32.43543, -9.11988], [32.49147, -9.14754], [32.53661, -9.24281], [32.75611, -9.28583], [32.76233, -9.31963], [32.95389, -9.40138], [32.99397, -9.36712], [33.14925, -9.49322], [33.31581, -9.48554], [33.48052, -9.62442], [33.76677, -9.58516], [33.93298, -9.71647], [33.9638, -9.62206], [33.95829, -9.54066], [34.03865, -9.49398], [34.54499, -10.0678], [34.51911, -10.12279], [34.57581, -10.56271], [34.65946, -10.6828], [34.67047, -10.93796], [34.61161, -11.01611], [34.63305, -11.11731], [34.79375, -11.32245], [34.91153, -11.39799], [34.96296, -11.57354], [35.63599, -11.55927], [35.82767, -11.41081], [36.19094, -11.57593], [36.19094, -11.70008], [36.62068, -11.72884], [36.80309, -11.56836], [37.3936, -11.68949], [37.76614, -11.53352], [37.8388, -11.3123], [37.93618, -11.26228], [38.21598, -11.27289], [38.47258, -11.4199], [38.88996, -11.16978], [39.24395, -11.17433], [39.58249, -10.96043], [40.00295, -10.80255], [40.44265, -10.4618], [40.74206, -10.25691], [40.14328, -4.64201], [39.62121, -4.68136], [39.44306, -4.93877], [39.21631, -4.67835], [37.81321, -3.69179], [37.75036, -3.54243], [37.63099, -3.50723], [37.5903, -3.42735], [37.71745, -3.304], [37.67199, -3.06222], [34.0824, -1.02264], [34.03084, -1.05101], [34.02286, -1.00779], [33.93107, -0.99298], [30.80408, -0.99911]]]] } },
      { type: "Feature", properties: { iso1A2: "UA", iso1A3: "UKR", iso1N3: "804", wikidata: "Q212", nameEn: "Ukraine", groups: ["151", "150", "UN"], callingCodes: ["380"] }, geometry: { type: "MultiPolygon", coordinates: [[[[33.57318, 46.10317], [33.61467, 46.13561], [33.63854, 46.14147], [33.61517, 46.22615], [33.646, 46.23028], [33.74047, 46.18555], [33.79715, 46.20482], [33.85234, 46.19863], [33.91549, 46.15938], [34.05272, 46.10838], [34.07311, 46.11769], [34.12929, 46.10494], [34.181, 46.06804], [34.25111, 46.0532], [34.33912, 46.06114], [34.41221, 46.00245], [34.44155, 45.95995], [34.48729, 45.94267], [34.52011, 45.95097], [34.55889, 45.99347], [34.60861, 45.99347], [34.66679, 45.97136], [34.75479, 45.90705], [34.80153, 45.90047], [34.79905, 45.81009], [34.96015, 45.75634], [35.23066, 45.79231], [37.62608, 46.82615], [38.12112, 46.86078], [38.3384, 46.98085], [38.22955, 47.12069], [38.23049, 47.2324], [38.32112, 47.2585], [38.33074, 47.30508], [38.22225, 47.30788], [38.28954, 47.39255], [38.28679, 47.53552], [38.35062, 47.61631], [38.76379, 47.69346], [38.79628, 47.81109], [38.87979, 47.87719], [39.73935, 47.82876], [39.82213, 47.96396], [39.77544, 48.04206], [39.88256, 48.04482], [39.83724, 48.06501], [39.94847, 48.22811], [40.00752, 48.22445], [39.99241, 48.31768], [39.97325, 48.31399], [39.9693, 48.29904], [39.95248, 48.29972], [39.91465, 48.26743], [39.90041, 48.3049], [39.84273, 48.30947], [39.84136, 48.33321], [39.94847, 48.35055], [39.88794, 48.44226], [39.86196, 48.46633], [39.84548, 48.57821], [39.79764, 48.58668], [39.67226, 48.59368], [39.71765, 48.68673], [39.73104, 48.7325], [39.79466, 48.83739], [39.97182, 48.79398], [40.08168, 48.87443], [40.03636, 48.91957], [39.98967, 48.86901], [39.78368, 48.91596], [39.74874, 48.98675], [39.72649, 48.9754], [39.71353, 48.98959], [39.6683, 48.99454], [39.6836, 49.05121], [39.93437, 49.05709], [40.01988, 49.1761], [40.22176, 49.25683], [40.18331, 49.34996], [40.14912, 49.37681], [40.1141, 49.38798], [40.03087, 49.45452], [40.03636, 49.52321], [40.16683, 49.56865], [40.13249, 49.61672], [39.84548, 49.56064], [39.65047, 49.61761], [39.59142, 49.73758], [39.44496, 49.76067], [39.27968, 49.75976], [39.1808, 49.88911], [38.9391, 49.79524], [38.90477, 49.86787], [38.73311, 49.90238], [38.68677, 50.00904], [38.65688, 49.97176], [38.35408, 50.00664], [38.32524, 50.08866], [38.18517, 50.08161], [38.21675, 49.98104], [38.02999, 49.90592], [38.02999, 49.94482], [37.90776, 50.04194], [37.79515, 50.08425], [37.75807, 50.07896], [37.61113, 50.21976], [37.62879, 50.24481], [37.62486, 50.29966], [37.47243, 50.36277], [37.48204, 50.46079], [37.08468, 50.34935], [36.91762, 50.34963], [36.69377, 50.26982], [36.64571, 50.218], [36.56655, 50.2413], [36.58371, 50.28563], [36.47817, 50.31457], [36.30101, 50.29088], [36.20763, 50.3943], [36.06893, 50.45205], [35.8926, 50.43829], [35.80388, 50.41356], [35.73659, 50.35489], [35.61711, 50.35707], [35.58003, 50.45117], [35.47463, 50.49247], [35.39464, 50.64751], [35.48116, 50.66405], [35.47704, 50.77274], [35.41367, 50.80227], [35.39307, 50.92145], [35.32598, 50.94524], [35.40837, 51.04119], [35.31774, 51.08434], [35.20375, 51.04723], [35.12685, 51.16191], [35.14058, 51.23162], [34.97304, 51.2342], [34.82472, 51.17483], [34.6874, 51.18], [34.6613, 51.25053], [34.38802, 51.2746], [34.31661, 51.23936], [34.23009, 51.26429], [34.33446, 51.363], [34.22048, 51.4187], [34.30562, 51.5205], [34.17599, 51.63253], [34.07765, 51.67065], [34.42922, 51.72852], [34.41136, 51.82793], [34.09413, 52.00835], [34.11199, 52.14087], [34.05239, 52.20132], [33.78789, 52.37204], [33.55718, 52.30324], [33.48027, 52.31499], [33.51323, 52.35779], [33.18913, 52.3754], [32.89937, 52.2461], [32.85405, 52.27888], [32.69475, 52.25535], [32.54781, 52.32423], [32.3528, 52.32842], [32.38988, 52.24946], [32.33083, 52.23685], [32.34044, 52.1434], [32.2777, 52.10266], [32.23331, 52.08085], [32.08813, 52.03319], [31.92159, 52.05144], [31.96141, 52.08015], [31.85018, 52.11305], [31.81722, 52.09955], [31.7822, 52.11406], [31.38326, 52.12991], [31.25142, 52.04131], [31.13332, 52.1004], [30.95589, 52.07775], [30.90897, 52.00699], [30.76443, 51.89739], [30.68804, 51.82806], [30.51946, 51.59649], [30.64992, 51.35014], [30.56203, 51.25655], [30.36153, 51.33984], [30.34642, 51.42555], [30.17888, 51.51025], [29.77376, 51.4461], [29.7408, 51.53417], [29.54372, 51.48372], [29.49773, 51.39814], [29.42357, 51.4187], [29.32881, 51.37843], [29.25191, 51.49828], [29.25603, 51.57089], [29.20659, 51.56918], [29.16402, 51.64679], [29.1187, 51.65872], [28.99098, 51.56833], [28.95528, 51.59222], [28.81795, 51.55552], [28.76027, 51.48802], [28.78224, 51.45294], [28.75615, 51.41442], [28.73143, 51.46236], [28.69161, 51.44695], [28.64429, 51.5664], [28.47051, 51.59734], [28.37592, 51.54505], [28.23452, 51.66988], [28.10658, 51.57857], [27.95827, 51.56065], [27.91844, 51.61952], [27.85253, 51.62293], [27.76052, 51.47604], [27.67125, 51.50854], [27.71932, 51.60672], [27.55727, 51.63486], [27.51058, 51.5854], [27.47212, 51.61184], [27.24828, 51.60161], [27.26613, 51.65957], [27.20948, 51.66713], [27.20602, 51.77291], [26.99422, 51.76933], [26.9489, 51.73788], [26.80043, 51.75777], [26.69759, 51.82284], [26.46962, 51.80501], [26.39367, 51.87315], [26.19084, 51.86781], [26.00408, 51.92967], [25.83217, 51.92587], [25.80574, 51.94556], [25.73673, 51.91973], [25.46163, 51.92205], [25.20228, 51.97143], [24.98784, 51.91273], [24.37123, 51.88222], [24.29021, 51.80841], [24.3163, 51.75063], [24.13075, 51.66979], [23.99907, 51.58369], [23.8741, 51.59734], [23.91118, 51.63316], [23.7766, 51.66809], [23.60906, 51.62122], [23.6736, 51.50255], [23.62751, 51.50512], [23.69905, 51.40871], [23.63858, 51.32182], [23.80678, 51.18405], [23.90376, 51.07697], [23.92217, 51.00836], [24.04576, 50.90196], [24.14524, 50.86128], [24.0952, 50.83262], [23.99254, 50.83847], [23.95925, 50.79271], [24.0595, 50.71625], [24.0996, 50.60752], [24.07048, 50.5071], [24.03668, 50.44507], [23.99563, 50.41289], [23.79445, 50.40481], [23.71382, 50.38248], [23.67635, 50.33385], [23.28221, 50.0957], [22.99329, 49.84249], [22.83179, 49.69875], [22.80261, 49.69098], [22.78304, 49.65543], [22.64534, 49.53094], [22.69444, 49.49378], [22.748, 49.32759], [22.72009, 49.20288], [22.86336, 49.10513], [22.89122, 49.00725], [22.56155, 49.08865], [22.54338, 49.01424], [22.48296, 48.99172], [22.42934, 48.92857], [22.34151, 48.68893], [22.21379, 48.6218], [22.16023, 48.56548], [22.14689, 48.4005], [22.2083, 48.42534], [22.38133, 48.23726], [22.49806, 48.25189], [22.59007, 48.15121], [22.58733, 48.10813], [22.66835, 48.09162], [22.73427, 48.12005], [22.81804, 48.11363], [22.87847, 48.04665], [22.84276, 47.98602], [22.89849, 47.95851], [22.94301, 47.96672], [22.92241, 48.02002], [23.0158, 47.99338], [23.08858, 48.00716], [23.1133, 48.08061], [23.15999, 48.12188], [23.27397, 48.08245], [23.33577, 48.0237], [23.4979, 47.96858], [23.52803, 48.01818], [23.5653, 48.00499], [23.63894, 48.00293], [23.66262, 47.98786], [23.75188, 47.99705], [23.80904, 47.98142], [23.8602, 47.9329], [23.89352, 47.94512], [23.94192, 47.94868], [23.96337, 47.96672], [23.98553, 47.96076], [24.00801, 47.968], [24.02999, 47.95087], [24.06466, 47.95317], [24.11281, 47.91487], [24.22566, 47.90231], [24.34926, 47.9244], [24.43578, 47.97131], [24.61994, 47.95062], [24.70632, 47.84428], [24.81893, 47.82031], [24.88896, 47.7234], [25.11144, 47.75203], [25.23778, 47.89403], [25.63878, 47.94924], [25.77723, 47.93919], [26.05901, 47.9897], [26.17711, 47.99246], [26.33504, 48.18418], [26.55202, 48.22445], [26.62823, 48.25804], [26.6839, 48.35828], [26.79239, 48.29071], [26.82809, 48.31629], [26.71274, 48.40388], [26.85556, 48.41095], [26.93384, 48.36558], [27.03821, 48.37653], [27.0231, 48.42485], [27.08078, 48.43214], [27.13434, 48.37288], [27.27855, 48.37534], [27.32159, 48.4434], [27.37604, 48.44398], [27.37741, 48.41026], [27.44333, 48.41209], [27.46942, 48.454], [27.5889, 48.49224], [27.59027, 48.46311], [27.6658, 48.44034], [27.74422, 48.45926], [27.79225, 48.44244], [27.81902, 48.41874], [27.87533, 48.4037], [27.88391, 48.36699], [27.95883, 48.32368], [28.04527, 48.32661], [28.09873, 48.3124], [28.07504, 48.23494], [28.17666, 48.25963], [28.19314, 48.20749], [28.2856, 48.23202], [28.32508, 48.23384], [28.35519, 48.24957], [28.36996, 48.20543], [28.34912, 48.1787], [28.30586, 48.1597], [28.30609, 48.14018], [28.34009, 48.13147], [28.38712, 48.17567], [28.43701, 48.15832], [28.42454, 48.12047], [28.48428, 48.0737], [28.53921, 48.17453], [28.69896, 48.13106], [28.85232, 48.12506], [28.8414, 48.03392], [28.9306, 47.96255], [29.1723, 47.99013], [29.19839, 47.89261], [29.27804, 47.88893], [29.20663, 47.80367], [29.27255, 47.79953], [29.22242, 47.73607], [29.22414, 47.60012], [29.11743, 47.55001], [29.18603, 47.43387], [29.3261, 47.44664], [29.39889, 47.30179], [29.47854, 47.30366], [29.48678, 47.36043], [29.5733, 47.36508], [29.59665, 47.25521], [29.54996, 47.24962], [29.57696, 47.13581], [29.49732, 47.12878], [29.53044, 47.07851], [29.61038, 47.09932], [29.62137, 47.05069], [29.57056, 46.94766], [29.72986, 46.92234], [29.75458, 46.8604], [29.87405, 46.88199], [29.98814, 46.82358], [29.94522, 46.80055], [29.9743, 46.75325], [29.94409, 46.56002], [29.88916, 46.54302], [30.02511, 46.45132], [30.16794, 46.40967], [30.09103, 46.38694], [29.94114, 46.40114], [29.88329, 46.35851], [29.74496, 46.45605], [29.66359, 46.4215], [29.6763, 46.36041], [29.5939, 46.35472], [29.49914, 46.45889], [29.35357, 46.49505], [29.24886, 46.37912], [29.23547, 46.55435], [29.02409, 46.49582], [29.01241, 46.46177], [28.9306, 46.45699], [29.004, 46.31495], [28.98478, 46.31803], [28.94953, 46.25852], [29.06656, 46.19716], [28.94643, 46.09176], [29.00613, 46.04962], [28.98004, 46.00385], [28.74383, 45.96664], [28.78503, 45.83475], [28.69852, 45.81753], [28.70401, 45.78019], [28.52823, 45.73803], [28.47879, 45.66994], [28.51587, 45.6613], [28.54196, 45.58062], [28.49252, 45.56716], [28.51449, 45.49982], [28.43072, 45.48538], [28.41836, 45.51715], [28.30201, 45.54744], [28.21139, 45.46895], [28.28504, 45.43907], [28.34554, 45.32102], [28.5735, 45.24759], [28.71358, 45.22631], [28.78911, 45.24179], [28.81383, 45.3384], [28.94292, 45.28045], [28.96077, 45.33164], [29.24779, 45.43388], [29.42632, 45.44545], [29.59798, 45.38857], [29.68175, 45.26885], [29.65428, 45.25629], [29.69272, 45.19227], [30.04414, 45.08461], [31.62627, 45.50633], [33.54017, 46.0123], [33.59087, 46.06013], [33.57318, 46.10317]]]] } },
      { type: "Feature", properties: { iso1A2: "UG", iso1A3: "UGA", iso1N3: "800", wikidata: "Q1036", nameEn: "Uganda", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["256"] }, geometry: { type: "MultiPolygon", coordinates: [[[[33.93107, -0.99298], [33.9264, -0.54188], [33.98449, -0.13079], [33.90936, 0.10581], [34.10067, 0.36372], [34.08727, 0.44713], [34.11408, 0.48884], [34.13493, 0.58118], [34.20196, 0.62289], [34.27345, 0.63182], [34.31516, 0.75693], [34.40041, 0.80266], [34.43349, 0.85254], [34.52369, 1.10692], [34.57427, 1.09868], [34.58029, 1.14712], [34.67562, 1.21265], [34.80223, 1.22754], [34.82606, 1.26626], [34.82606, 1.30944], [34.7918, 1.36752], [34.87819, 1.5596], [34.92734, 1.56109], [34.9899, 1.6668], [34.98692, 1.97348], [34.90947, 2.42447], [34.95267, 2.47209], [34.77244, 2.70272], [34.78137, 2.76223], [34.73967, 2.85447], [34.65774, 2.8753], [34.60114, 2.93034], [34.56242, 3.11478], [34.45815, 3.18319], [34.40006, 3.37949], [34.41794, 3.44342], [34.39112, 3.48802], [34.44922, 3.51627], [34.45815, 3.67385], [34.15429, 3.80464], [34.06046, 4.15235], [33.9873, 4.23316], [33.51264, 3.75068], [33.18356, 3.77812], [33.02852, 3.89296], [32.89746, 3.81339], [32.72021, 3.77327], [32.41337, 3.748], [32.20782, 3.6053], [32.19888, 3.50867], [32.08866, 3.53543], [32.08491, 3.56287], [32.05187, 3.589], [31.95907, 3.57408], [31.96205, 3.6499], [31.86821, 3.78664], [31.81459, 3.82083], [31.72075, 3.74354], [31.50776, 3.63652], [31.50478, 3.67814], [31.29476, 3.8015], [31.16666, 3.79853], [30.97601, 3.693], [30.85153, 3.48867], [30.94081, 3.50847], [30.93486, 3.40737], [30.84251, 3.26908], [30.77101, 3.04897], [30.8574, 2.9508], [30.8857, 2.83923], [30.75612, 2.5863], [30.74271, 2.43601], [30.83059, 2.42559], [30.91102, 2.33332], [30.96911, 2.41071], [31.06593, 2.35862], [31.07934, 2.30207], [31.12104, 2.27676], [31.1985, 2.29462], [31.20148, 2.2217], [31.28042, 2.17853], [31.30127, 2.11006], [30.48503, 1.21675], [30.24671, 1.14974], [30.22139, 0.99635], [30.1484, 0.89805], [29.98307, 0.84295], [29.95477, 0.64486], [29.97413, 0.52124], [29.87284, 0.39166], [29.81922, 0.16824], [29.77454, 0.16675], [29.7224, 0.07291], [29.72687, -0.08051], [29.65091, -0.46777], [29.67474, -0.47969], [29.67176, -0.55714], [29.62708, -0.71055], [29.63006, -0.8997], [29.58388, -0.89821], [29.59061, -1.39016], [29.82657, -1.31187], [29.912, -1.48269], [30.16369, -1.34303], [30.35212, -1.06896], [30.47194, -1.0555], [30.64166, -1.06601], [30.70631, -1.01175], [30.76635, -0.9852], [30.80408, -0.99911], [33.93107, -0.99298]]]] } },
      { type: "Feature", properties: { iso1A2: "UM", iso1A3: "UMI", iso1N3: "581", wikidata: "Q16645", nameEn: "United States Minor Outlying Islands", country: "US" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "UN", wikidata: "Q1065", nameEn: "United Nations", level: "unitedNations", isoStatus: "excRes" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "US", iso1A3: "USA", iso1N3: "840", wikidata: "Q30", nameEn: "United States of America" }, geometry: null },
      { type: "Feature", properties: { iso1A2: "UY", iso1A3: "URY", iso1N3: "858", wikidata: "Q77", nameEn: "Uruguay", groups: ["005", "419", "019", "UN"], callingCodes: ["598"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-57.65132, -30.19229], [-57.61478, -30.25165], [-57.64859, -30.35095], [-57.89115, -30.49572], [-57.8024, -30.77193], [-57.89476, -30.95994], [-57.86729, -31.06352], [-57.9908, -31.34924], [-57.98127, -31.3872], [-58.07569, -31.44916], [-58.0023, -31.53084], [-58.00076, -31.65016], [-58.20252, -31.86966], [-58.10036, -32.25338], [-58.22362, -32.52416], [-58.1224, -32.98842], [-58.40475, -33.11777], [-58.44442, -33.84033], [-58.34425, -34.15035], [-57.83001, -34.69099], [-54.78916, -36.21945], [-52.83257, -34.01481], [-53.37138, -33.74313], [-53.39593, -33.75169], [-53.44031, -33.69344], [-53.52794, -33.68908], [-53.53459, -33.16843], [-53.1111, -32.71147], [-53.37671, -32.57005], [-53.39572, -32.58596], [-53.76024, -32.0751], [-54.17384, -31.86168], [-55.50821, -30.91349], [-55.50841, -30.9027], [-55.51862, -30.89828], [-55.52712, -30.89997], [-55.53276, -30.90218], [-55.53431, -30.89714], [-55.54572, -30.89051], [-55.55218, -30.88193], [-55.55373, -30.8732], [-55.5634, -30.8686], [-55.58866, -30.84117], [-55.87388, -31.05053], [-56.4619, -30.38457], [-56.4795, -30.3899], [-56.49267, -30.39471], [-56.90236, -30.02578], [-57.22502, -30.26121], [-57.65132, -30.19229]]]] } },
      { type: "Feature", properties: { iso1A2: "UZ", iso1A3: "UZB", iso1N3: "860", wikidata: "Q265", nameEn: "Uzbekistan", groups: ["143", "142", "UN"], callingCodes: ["998"] }, geometry: { type: "MultiPolygon", coordinates: [[[[65.85194, 42.85481], [65.53277, 43.31856], [65.18666, 43.48835], [64.96464, 43.74748], [64.53885, 43.56941], [63.34656, 43.64003], [62.01711, 43.51008], [61.01475, 44.41383], [58.59711, 45.58671], [55.97842, 44.99622], [55.97832, 44.99622], [55.97822, 44.99617], [55.97811, 44.99617], [55.97801, 44.99612], [55.97801, 44.99607], [55.97791, 44.99607], [55.9778, 44.99607], [55.9777, 44.99601], [55.9777, 44.99596], [55.9776, 44.99591], [55.97749, 44.99591], [55.97739, 44.99591], [55.97739, 44.99586], [55.97729, 44.99586], [55.97718, 44.99581], [55.97708, 44.99576], [55.97698, 44.9957], [55.97698, 44.99565], [55.97687, 44.9956], [55.97677, 44.9956], [55.97677, 44.99555], [55.97677, 44.9955], [55.97667, 44.99545], [55.97656, 44.99539], [55.97646, 44.99534], [55.97646, 44.99529], [55.97636, 44.99524], [55.97636, 44.99519], [55.97625, 44.99514], [55.97615, 44.99508], [55.97615, 44.99503], [55.97615, 44.99498], [55.97615, 44.99493], [55.97615, 44.99483], [55.97615, 44.99477], [55.97605, 44.99477], [55.97605, 44.99467], [55.97605, 44.99462], [55.97605, 44.99457], [55.97605, 44.99452], [55.97594, 44.99446], [55.97584, 44.99441], [55.97584, 44.99436], [55.97584, 44.99431], [55.97584, 44.99426], [55.97584, 44.99421], [55.97584, 44.99415], [55.97584, 44.99405], [55.97584, 44.994], [55.97584, 44.9939], [55.97584, 44.99384], [55.97584, 44.99374], [55.97584, 44.99369], [55.97584, 44.99359], [55.97584, 44.99353], [55.97584, 44.99348], [55.97584, 44.99343], [55.97584, 44.99338], [55.97584, 44.99328], [55.97584, 44.99322], [56.00314, 41.32584], [57.03423, 41.25435], [57.13796, 41.36625], [57.03359, 41.41777], [56.96218, 41.80383], [57.03633, 41.92043], [57.30275, 42.14076], [57.6296, 42.16519], [57.84932, 42.18555], [57.92897, 42.24047], [57.90975, 42.4374], [57.99214, 42.50021], [58.3492, 42.43335], [58.40688, 42.29535], [58.51674, 42.30348], [58.29427, 42.56497], [58.14321, 42.62159], [58.27504, 42.69632], [58.57991, 42.64988], [58.6266, 42.79314], [58.93422, 42.5407], [59.17317, 42.52248], [59.2955, 42.37064], [59.4341, 42.29738], [59.94633, 42.27655], [60.00539, 42.212], [59.96419, 42.1428], [60.04659, 42.08982], [60.0356, 42.01028], [59.95046, 41.97966], [60.33223, 41.75058], [60.08504, 41.80997], [60.06032, 41.76287], [60.18117, 41.60082], [60.06581, 41.4363], [60.5078, 41.21694], [61.03261, 41.25691], [61.22212, 41.14946], [61.33199, 41.14946], [61.39732, 41.19873], [61.4446, 41.29407], [61.87856, 41.12257], [62.11751, 40.58242], [62.34273, 40.43206], [62.43337, 39.98528], [63.6913, 39.27666], [63.70778, 39.22349], [64.19086, 38.95561], [64.32576, 38.98691], [65.55873, 38.29052], [65.83913, 38.25733], [66.24013, 38.16238], [66.41042, 38.02403], [66.56697, 38.0435], [66.67684, 37.96776], [66.53676, 37.80084], [66.52852, 37.58568], [66.65761, 37.45497], [66.52303, 37.39827], [66.55743, 37.35409], [66.64699, 37.32958], [66.95598, 37.40162], [67.08232, 37.35469], [67.13039, 37.27168], [67.2224, 37.24545], [67.2581, 37.17216], [67.51868, 37.26102], [67.78329, 37.1834], [67.8474, 37.31594], [67.81566, 37.43107], [68.12635, 37.93], [68.27159, 37.91477], [68.40343, 38.19484], [68.13289, 38.40822], [68.06274, 38.39435], [68.11366, 38.47169], [68.05873, 38.56087], [68.0807, 38.64136], [68.05598, 38.71641], [68.12877, 38.73677], [68.06948, 38.82115], [68.19743, 38.85985], [68.09704, 39.02589], [67.68915, 39.00775], [67.67833, 39.14479], [67.33226, 39.23739], [67.36522, 39.31287], [67.45998, 39.315], [67.46822, 39.46146], [67.39681, 39.52505], [67.46547, 39.53564], [67.44899, 39.57799], [67.62889, 39.60234], [67.70992, 39.66156], [68.12053, 39.56317], [68.54166, 39.53929], [68.61972, 39.68905], [68.63071, 39.85265], [68.88889, 39.87163], [68.93695, 39.91167], [68.84906, 40.04952], [68.96579, 40.06949], [69.01935, 40.11466], [69.01523, 40.15771], [68.62796, 40.07789], [68.52771, 40.11676], [68.5332, 40.14826], [68.77902, 40.20492], [68.79276, 40.17555], [68.84357, 40.18604], [68.85832, 40.20885], [69.04544, 40.22904], [69.15659, 40.2162], [69.2074, 40.21488], [69.30448, 40.18774], [69.30104, 40.24502], [69.25229, 40.26362], [69.24817, 40.30357], [69.30808, 40.2821], [69.32833, 40.29794], [69.33794, 40.34819], [69.30774, 40.36102], [69.28525, 40.41894], [69.27066, 40.49274], [69.21063, 40.54469], [69.2643, 40.57506], [69.3455, 40.57988], [69.32834, 40.70233], [69.38327, 40.7918], [69.53021, 40.77621], [69.59441, 40.70181], [69.69434, 40.62615], [70.36655, 40.90296], [70.38028, 41.02014], [70.45251, 41.04438], [70.80009, 40.72825], [70.49871, 40.52503], [70.32626, 40.45174], [70.37511, 40.38605], [70.57149, 40.3442], [70.56394, 40.26421], [70.62342, 40.17396], [70.8607, 40.217], [70.9818, 40.22392], [70.95789, 40.28761], [71.05901, 40.28765], [71.13042, 40.34106], [71.36663, 40.31593], [71.4246, 40.28619], [71.51215, 40.26943], [71.51549, 40.22986], [71.61725, 40.20615], [71.61931, 40.26775], [71.68386, 40.26984], [71.70569, 40.20391], [71.69621, 40.18492], [71.71719, 40.17886], [71.73054, 40.14818], [71.82646, 40.21872], [71.85002, 40.25647], [72.05464, 40.27586], [71.96401, 40.31907], [72.18648, 40.49893], [72.24368, 40.46091], [72.40346, 40.4007], [72.44191, 40.48222], [72.41513, 40.50856], [72.38384, 40.51535], [72.41714, 40.55736], [72.34406, 40.60144], [72.40517, 40.61917], [72.47795, 40.5532], [72.66713, 40.5219], [72.66713, 40.59076], [72.69579, 40.59778], [72.73995, 40.58409], [72.74768, 40.58051], [72.74862, 40.57131], [72.75982, 40.57273], [72.74894, 40.59592], [72.74866, 40.60873], [72.80137, 40.67856], [72.84754, 40.67229], [72.85372, 40.7116], [72.8722, 40.71111], [72.93296, 40.73089], [72.99133, 40.76457], [73.0612, 40.76678], [73.13412, 40.79122], [73.13267, 40.83512], [73.01869, 40.84681], [72.94454, 40.8094], [72.84291, 40.85512], [72.68157, 40.84942], [72.59136, 40.86947], [72.55109, 40.96046], [72.48742, 40.97136], [72.45206, 41.03018], [72.38511, 41.02785], [72.36138, 41.04384], [72.34757, 41.06104], [72.34026, 41.04539], [72.324, 41.03381], [72.18339, 40.99571], [72.17594, 41.02377], [72.21061, 41.05607], [72.1792, 41.10621], [72.14864, 41.13363], [72.17594, 41.15522], [72.16433, 41.16483], [72.10745, 41.15483], [72.07249, 41.11739], [71.85964, 41.19081], [71.91457, 41.2982], [71.83914, 41.3546], [71.76625, 41.4466], [71.71132, 41.43012], [71.73054, 41.54713], [71.65914, 41.49599], [71.6787, 41.42111], [71.57227, 41.29175], [71.46688, 41.31883], [71.43814, 41.19644], [71.46148, 41.13958], [71.40198, 41.09436], [71.34877, 41.16807], [71.27187, 41.11015], [71.25813, 41.18796], [71.11806, 41.15359], [71.02193, 41.19494], [70.9615, 41.16393], [70.86263, 41.23833], [70.77885, 41.24813], [70.78572, 41.36419], [70.67586, 41.47953], [70.48909, 41.40335], [70.17682, 41.5455], [70.69777, 41.92554], [71.28719, 42.18033], [71.13263, 42.28356], [70.94483, 42.26238], [69.49545, 41.545], [69.45751, 41.56863], [69.39485, 41.51518], [69.45081, 41.46246], [69.37468, 41.46555], [69.35554, 41.47211], [69.29778, 41.43673], [69.25059, 41.46693], [69.23332, 41.45847], [69.22671, 41.46298], [69.20439, 41.45391], [69.18528, 41.45175], [69.17701, 41.43769], [69.15137, 41.43078], [69.05006, 41.36183], [69.01308, 41.22804], [68.7217, 41.05025], [68.73945, 40.96989], [68.65662, 40.93861], [68.62221, 41.03019], [68.49983, 40.99669], [68.58444, 40.91447], [68.63, 40.59358], [68.49983, 40.56437], [67.96736, 40.83798], [68.1271, 41.0324], [68.08273, 41.08148], [67.98511, 41.02794], [67.9644, 41.14611], [66.69129, 41.1311], [66.53302, 41.87388], [66.00546, 41.94455], [66.09482, 42.93426], [65.85194, 42.85481]], [[70.68112, 40.90612], [70.6721, 40.90555], [70.57501, 40.98941], [70.54223, 40.98787], [70.56077, 41.00642], [70.6158, 40.97661], [70.68112, 40.90612]]], [[[71.21139, 40.03369], [71.12218, 40.03052], [71.06305, 40.1771], [71.00236, 40.18154], [71.01035, 40.05481], [71.11037, 40.01984], [71.11668, 39.99291], [71.09063, 39.99], [71.10501, 39.95568], [71.04979, 39.89808], [71.10531, 39.91354], [71.16101, 39.88423], [71.23067, 39.93581], [71.1427, 39.95026], [71.21139, 40.03369]]], [[[71.86463, 39.98598], [71.78838, 40.01404], [71.71511, 39.96348], [71.7504, 39.93701], [71.84316, 39.95582], [71.86463, 39.98598]]]] } },
      { type: "Feature", properties: { iso1A2: "VA", iso1A3: "VAT", iso1N3: "336", wikidata: "Q237", nameEn: "Vatican City", aliases: ["Holy See"], groups: ["039", "150"], callingCodes: ["379", "39 06"] }, geometry: { type: "MultiPolygon", coordinates: [[[[12.45181, 41.90056], [12.45446, 41.90028], [12.45435, 41.90143], [12.45626, 41.90172], [12.45691, 41.90125], [12.4577, 41.90115], [12.45834, 41.90174], [12.45826, 41.90281], [12.45755, 41.9033], [12.45762, 41.9058], [12.45561, 41.90629], [12.45543, 41.90738], [12.45091, 41.90625], [12.44984, 41.90545], [12.44815, 41.90326], [12.44582, 41.90194], [12.44834, 41.90095], [12.45181, 41.90056]]]] } },
      { type: "Feature", properties: { iso1A2: "VC", iso1A3: "VCT", iso1N3: "670", wikidata: "Q757", nameEn: "St. Vincent and the Grenadines", aliases: ["WV"], groups: ["029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", callingCodes: ["1 784"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-62.64026, 12.69984], [-59.94058, 12.34011], [-61.69315, 14.26451], [-62.64026, 12.69984]]]] } },
      { type: "Feature", properties: { iso1A2: "VE", iso1A3: "VEN", iso1N3: "862", wikidata: "Q717", nameEn: "Venezuela", aliases: ["YV"], groups: ["005", "419", "019", "UN"], callingCodes: ["58"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-71.22331, 13.01387], [-70.92579, 11.96275], [-71.3275, 11.85], [-71.9675, 11.65536], [-72.24983, 11.14138], [-72.4767, 11.1117], [-72.88002, 10.44309], [-72.98085, 9.85253], [-73.36905, 9.16636], [-73.02119, 9.27584], [-72.94052, 9.10663], [-72.77415, 9.10165], [-72.65474, 8.61428], [-72.4042, 8.36513], [-72.36987, 8.19976], [-72.35163, 8.01163], [-72.39137, 8.03534], [-72.47213, 7.96106], [-72.48801, 7.94329], [-72.48183, 7.92909], [-72.47042, 7.92306], [-72.45806, 7.91141], [-72.46183, 7.90682], [-72.44454, 7.86031], [-72.46763, 7.79518], [-72.47827, 7.65604], [-72.45321, 7.57232], [-72.47415, 7.48928], [-72.43132, 7.40034], [-72.19437, 7.37034], [-72.04895, 7.03837], [-71.82441, 7.04314], [-71.44118, 7.02116], [-71.42212, 7.03854], [-71.37234, 7.01588], [-71.03941, 6.98163], [-70.7596, 7.09799], [-70.10716, 6.96516], [-69.41843, 6.1072], [-67.60654, 6.2891], [-67.4625, 6.20625], [-67.43513, 5.98835], [-67.58558, 5.84537], [-67.63914, 5.64963], [-67.59141, 5.5369], [-67.83341, 5.31104], [-67.85358, 4.53249], [-67.62671, 3.74303], [-67.50067, 3.75812], [-67.30945, 3.38393], [-67.85862, 2.86727], [-67.85862, 2.79173], [-67.65696, 2.81691], [-67.21967, 2.35778], [-66.85795, 1.22998], [-66.28507, 0.74585], [-65.6727, 1.01353], [-65.50158, 0.92086], [-65.57288, 0.62856], [-65.11657, 1.12046], [-64.38932, 1.5125], [-64.34654, 1.35569], [-64.08274, 1.64792], [-64.06135, 1.94722], [-63.39827, 2.16098], [-63.39114, 2.4317], [-64.0257, 2.48156], [-64.02908, 2.79797], [-64.48379, 3.7879], [-64.84028, 4.24665], [-64.72977, 4.28931], [-64.57648, 4.12576], [-64.14512, 4.12932], [-63.99183, 3.90172], [-63.86082, 3.94796], [-63.70218, 3.91417], [-63.67099, 4.01731], [-63.50611, 3.83592], [-63.42233, 3.89995], [-63.4464, 3.9693], [-63.21111, 3.96219], [-62.98296, 3.59935], [-62.7655, 3.73099], [-62.74411, 4.03331], [-62.57656, 4.04754], [-62.44822, 4.18621], [-62.13094, 4.08309], [-61.54629, 4.2822], [-61.48569, 4.43149], [-61.29675, 4.44216], [-61.31457, 4.54167], [-61.15703, 4.49839], [-60.98303, 4.54167], [-60.86539, 4.70512], [-60.5802, 4.94312], [-60.73204, 5.20931], [-61.4041, 5.95304], [-61.15058, 6.19558], [-61.20762, 6.58174], [-61.13632, 6.70922], [-60.54873, 6.8631], [-60.39419, 6.94847], [-60.28074, 7.1162], [-60.44116, 7.20817], [-60.54098, 7.14804], [-60.63367, 7.25061], [-60.59802, 7.33194], [-60.71923, 7.55817], [-60.64793, 7.56877], [-60.51959, 7.83373], [-60.38056, 7.8302], [-60.02407, 8.04557], [-59.97059, 8.20791], [-59.83156, 8.23261], [-59.80661, 8.28906], [-59.85562, 8.35213], [-59.98508, 8.53046], [-59.54058, 8.6862], [-60.89962, 9.81445], [-62.08693, 10.04435], [-61.62505, 11.18974], [-63.73917, 11.92623], [-63.19938, 16.44103], [-67.89186, 12.4116], [-68.01417, 11.77722], [-68.33524, 11.78151], [-68.99639, 11.79035], [-71.22331, 13.01387]]]] } },
      { type: "Feature", properties: { iso1A2: "VG", iso1A3: "VGB", iso1N3: "092", wikidata: "Q25305", nameEn: "British Virgin Islands", country: "GB", groups: ["BOTS", "029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1 284"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-64.47127, 17.55688], [-63.88746, 19.15706], [-65.02435, 18.73231], [-64.86027, 18.39056], [-64.64673, 18.36549], [-64.47127, 17.55688]]]] } },
      { type: "Feature", properties: { iso1A2: "VI", iso1A3: "VIR", iso1N3: "850", wikidata: "Q11703", nameEn: "United States Virgin Islands", aliases: ["US-VI"], country: "US", groups: ["Q1352230", "029", "003", "419", "019", "UN"], driveSide: "left", roadSpeedUnit: "mph", roadHeightUnit: "ft", callingCodes: ["1 340"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-65.02435, 18.73231], [-65.27974, 17.56928], [-64.47127, 17.55688], [-64.64673, 18.36549], [-64.86027, 18.39056], [-65.02435, 18.73231]]]] } },
      { type: "Feature", properties: { iso1A2: "VN", iso1A3: "VNM", iso1N3: "704", wikidata: "Q881", nameEn: "Vietnam", groups: ["035", "142", "UN"], callingCodes: ["84"] }, geometry: { type: "MultiPolygon", coordinates: [[[[108.10003, 21.47338], [108.0569, 21.53604], [108.02926, 21.54997], [107.97932, 21.54503], [107.97383, 21.53961], [107.97074, 21.54072], [107.96774, 21.53601], [107.95232, 21.5388], [107.92652, 21.58906], [107.90006, 21.5905], [107.86114, 21.65128], [107.80355, 21.66141], [107.66967, 21.60787], [107.56537, 21.61945], [107.54047, 21.5934], [107.49065, 21.59774], [107.49532, 21.62958], [107.47197, 21.6672], [107.41593, 21.64839], [107.38636, 21.59774], [107.35989, 21.60063], [107.35834, 21.6672], [107.29296, 21.74674], [107.24625, 21.7077], [107.20734, 21.71493], [107.10771, 21.79879], [107.02615, 21.81981], [107.00964, 21.85948], [107.06101, 21.88982], [107.05634, 21.92303], [106.99252, 21.95191], [106.97228, 21.92592], [106.92714, 21.93459], [106.9178, 21.97357], [106.81038, 21.97934], [106.74345, 22.00965], [106.72551, 21.97923], [106.69276, 21.96013], [106.68274, 21.99811], [106.70142, 22.02409], [106.6983, 22.15102], [106.67495, 22.1885], [106.69986, 22.22309], [106.6516, 22.33977], [106.55976, 22.34841], [106.57221, 22.37], [106.55665, 22.46498], [106.58395, 22.474], [106.61269, 22.60301], [106.65316, 22.5757], [106.71698, 22.58432], [106.72321, 22.63606], [106.76293, 22.73491], [106.82404, 22.7881], [106.83685, 22.8098], [106.81271, 22.8226], [106.78422, 22.81532], [106.71128, 22.85982], [106.71387, 22.88296], [106.6734, 22.89587], [106.6516, 22.86862], [106.60179, 22.92884], [106.55976, 22.92311], [106.51306, 22.94891], [106.49749, 22.91164], [106.34961, 22.86718], [106.27022, 22.87722], [106.19705, 22.98475], [106.00179, 22.99049], [105.99568, 22.94178], [105.90119, 22.94168], [105.8726, 22.92756], [105.72382, 23.06641], [105.57594, 23.075], [105.56037, 23.16806], [105.49966, 23.20669], [105.42805, 23.30824], [105.40782, 23.28107], [105.32376, 23.39684], [105.22569, 23.27249], [105.17276, 23.28679], [105.11672, 23.25247], [105.07002, 23.26248], [104.98712, 23.19176], [104.96532, 23.20463], [104.9486, 23.17235], [104.91435, 23.18666], [104.87992, 23.17141], [104.87382, 23.12854], [104.79478, 23.12934], [104.8334, 23.01484], [104.86765, 22.95178], [104.84942, 22.93631], [104.77114, 22.90017], [104.72755, 22.81984], [104.65283, 22.83419], [104.60457, 22.81841], [104.58122, 22.85571], [104.47225, 22.75813], [104.35593, 22.69353], [104.25683, 22.76534], [104.27084, 22.8457], [104.11384, 22.80363], [104.03734, 22.72945], [104.01088, 22.51823], [103.99247, 22.51958], [103.97384, 22.50634], [103.96783, 22.51173], [103.96352, 22.50584], [103.95191, 22.5134], [103.94513, 22.52553], [103.93286, 22.52703], [103.87904, 22.56683], [103.64506, 22.79979], [103.56255, 22.69499], [103.57812, 22.65764], [103.52675, 22.59155], [103.43646, 22.70648], [103.43179, 22.75816], [103.32282, 22.8127], [103.28079, 22.68063], [103.18895, 22.64471], [103.15782, 22.59873], [103.17961, 22.55705], [103.07843, 22.50097], [103.0722, 22.44775], [102.9321, 22.48659], [102.8636, 22.60735], [102.60675, 22.73376], [102.57095, 22.7036], [102.51802, 22.77969], [102.46665, 22.77108], [102.42618, 22.69212], [102.38415, 22.67919], [102.41061, 22.64184], [102.25339, 22.4607], [102.26428, 22.41321], [102.16621, 22.43336], [102.14099, 22.40092], [102.18712, 22.30403], [102.51734, 22.02676], [102.49092, 21.99002], [102.62301, 21.91447], [102.67145, 21.65894], [102.74189, 21.66713], [102.82115, 21.73667], [102.81894, 21.83888], [102.85637, 21.84501], [102.86077, 21.71213], [102.97965, 21.74076], [102.98846, 21.58936], [102.86297, 21.4255], [102.94223, 21.46034], [102.88939, 21.3107], [102.80794, 21.25736], [102.89825, 21.24707], [102.97745, 21.05821], [103.03469, 21.05821], [103.12055, 20.89994], [103.21497, 20.89832], [103.38032, 20.79501], [103.45737, 20.82382], [103.68633, 20.66324], [103.73478, 20.6669], [103.82282, 20.8732], [103.98024, 20.91531], [104.11121, 20.96779], [104.27412, 20.91433], [104.63957, 20.6653], [104.38199, 20.47155], [104.40621, 20.3849], [104.47886, 20.37459], [104.66158, 20.47774], [104.72102, 20.40554], [104.62195, 20.36633], [104.61315, 20.24452], [104.86852, 20.14121], [104.91695, 20.15567], [104.9874, 20.09573], [104.8465, 19.91783], [104.8355, 19.80395], [104.68359, 19.72729], [104.64837, 19.62365], [104.53169, 19.61743], [104.41281, 19.70035], [104.23229, 19.70242], [104.06498, 19.66926], [104.05617, 19.61743], [104.10832, 19.51575], [104.06058, 19.43484], [103.87125, 19.31854], [104.5361, 18.97747], [104.64617, 18.85668], [105.12829, 18.70453], [105.19654, 18.64196], [105.1327, 18.58355], [105.10408, 18.43533], [105.15942, 18.38691], [105.38366, 18.15315], [105.46292, 18.22008], [105.64784, 17.96687], [105.60381, 17.89356], [105.76612, 17.67147], [105.85744, 17.63221], [106.09019, 17.36399], [106.18991, 17.28227], [106.24444, 17.24714], [106.29287, 17.3018], [106.31929, 17.20509], [106.43597, 17.01362], [106.50862, 16.9673], [106.55045, 17.0031], [106.54824, 16.92729], [106.51963, 16.92097], [106.52183, 16.87884], [106.55265, 16.86831], [106.55485, 16.68704], [106.59013, 16.62259], [106.58267, 16.6012], [106.61477, 16.60713], [106.66052, 16.56892], [106.65832, 16.47816], [106.74418, 16.41904], [106.84104, 16.55415], [106.88727, 16.52671], [106.88067, 16.43594], [106.96638, 16.34938], [106.97385, 16.30204], [107.02597, 16.31132], [107.09091, 16.3092], [107.15035, 16.26271], [107.14595, 16.17816], [107.25822, 16.13587], [107.33968, 16.05549], [107.44975, 16.08511], [107.46296, 16.01106], [107.39471, 15.88829], [107.34188, 15.89464], [107.21419, 15.83747], [107.21859, 15.74638], [107.27143, 15.71459], [107.27583, 15.62769], [107.34408, 15.62345], [107.3815, 15.49832], [107.50699, 15.48771], [107.53341, 15.40496], [107.62367, 15.42193], [107.60605, 15.37524], [107.62587, 15.2266], [107.58844, 15.20111], [107.61926, 15.13949], [107.61486, 15.0566], [107.46516, 15.00982], [107.48277, 14.93751], [107.59285, 14.87795], [107.51579, 14.79282], [107.54361, 14.69092], [107.55371, 14.628], [107.52102, 14.59034], [107.52569, 14.54665], [107.48521, 14.40346], [107.44941, 14.41552], [107.39493, 14.32655], [107.40427, 14.24509], [107.33577, 14.11832], [107.37158, 14.07906], [107.35757, 14.02319], [107.38247, 13.99147], [107.44318, 13.99751], [107.46498, 13.91593], [107.45252, 13.78897], [107.53503, 13.73908], [107.61909, 13.52577], [107.62843, 13.3668], [107.49144, 13.01215], [107.49611, 12.88926], [107.55993, 12.7982], [107.5755, 12.52177], [107.55059, 12.36824], [107.4463, 12.29373], [107.42917, 12.24657], [107.34511, 12.33327], [107.15831, 12.27547], [106.99953, 12.08983], [106.92325, 12.06548], [106.79405, 12.0807], [106.70687, 11.96956], [106.4111, 11.97413], [106.4687, 11.86751], [106.44068, 11.86294], [106.44535, 11.8279], [106.41577, 11.76999], [106.45158, 11.68616], [106.44691, 11.66787], [106.37219, 11.69836], [106.30525, 11.67549], [106.26478, 11.72122], [106.18539, 11.75171], [106.13158, 11.73283], [106.06708, 11.77761], [106.02038, 11.77457], [106.00792, 11.7197], [105.95188, 11.63738], [105.88962, 11.67854], [105.8507, 11.66635], [105.80867, 11.60536], [105.81645, 11.56876], [105.87328, 11.55953], [105.88962, 11.43605], [105.86782, 11.28343], [106.10444, 11.07879], [106.1527, 11.10476], [106.1757, 11.07301], [106.20095, 10.97795], [106.14301, 10.98176], [106.18539, 10.79451], [106.06708, 10.8098], [105.94535, 10.9168], [105.93403, 10.83853], [105.84603, 10.85873], [105.86376, 10.89839], [105.77751, 11.03671], [105.50045, 10.94586], [105.42884, 10.96878], [105.34011, 10.86179], [105.11449, 10.96332], [105.08326, 10.95656], [105.02722, 10.89236], [105.09571, 10.72722], [104.95094, 10.64003], [104.87933, 10.52833], [104.59018, 10.53073], [104.49869, 10.4057], [104.47963, 10.43046], [104.43778, 10.42386], [103.99198, 10.48391], [102.47649, 9.66162], [104.81582, 8.03101], [109.55486, 8.10026], [111.60491, 13.57105], [108.00365, 17.98159], [108.10003, 21.47338]]]] } },
      { type: "Feature", properties: { iso1A2: "VU", iso1A3: "VUT", iso1N3: "548", wikidata: "Q686", nameEn: "Vanuatu", groups: ["054", "009", "UN"], callingCodes: ["678"] }, geometry: { type: "MultiPolygon", coordinates: [[[[156.73836, -14.50464], [174.245, -23.1974], [172.71443, -12.01327], [156.73836, -14.50464]]]] } },
      { type: "Feature", properties: { iso1A2: "WF", iso1A3: "WLF", iso1N3: "876", wikidata: "Q35555", nameEn: "Wallis and Futuna", country: "FR", groups: ["Q1451600", "061", "009", "UN"], callingCodes: ["681"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-178.66551, -14.32452], [-176.76826, -14.95183], [-175.59809, -12.61507], [-178.66551, -14.32452]]]] } },
      { type: "Feature", properties: { iso1A2: "WS", iso1A3: "WSM", iso1N3: "882", wikidata: "Q683", nameEn: "Samoa", groups: ["061", "009", "UN"], driveSide: "left", callingCodes: ["685"] }, geometry: { type: "MultiPolygon", coordinates: [[[[-173.74402, -14.26669], [-170.99605, -15.1275], [-171.39864, -10.21587], [-173.74402, -14.26669]]]] } },
      { type: "Feature", properties: { iso1A2: "XK", iso1A3: "XKX", wikidata: "Q1246", nameEn: "Kosovo", aliases: ["KV"], groups: ["039", "150"], isoStatus: "usrAssn", callingCodes: ["383"] }, geometry: { type: "MultiPolygon", coordinates: [[[[21.39045, 42.74888], [21.44047, 42.87276], [21.36941, 42.87397], [21.32974, 42.90424], [21.2719, 42.8994], [21.23534, 42.95523], [21.23877, 43.00848], [21.2041, 43.02277], [21.16734, 42.99694], [21.14465, 43.11089], [21.08952, 43.13471], [21.05378, 43.10707], [21.00749, 43.13984], [20.96287, 43.12416], [20.83727, 43.17842], [20.88685, 43.21697], [20.82145, 43.26769], [20.73811, 43.25068], [20.68688, 43.21335], [20.59929, 43.20492], [20.69515, 43.09641], [20.64557, 43.00826], [20.59929, 43.01067], [20.48692, 42.93208], [20.53484, 42.8885], [20.43734, 42.83157], [20.40594, 42.84853], [20.35692, 42.8335], [20.27869, 42.81945], [20.2539, 42.76245], [20.04898, 42.77701], [20.02088, 42.74789], [20.02915, 42.71147], [20.0969, 42.65559], [20.07761, 42.55582], [20.17127, 42.50469], [20.21797, 42.41237], [20.24399, 42.32168], [20.34479, 42.32656], [20.3819, 42.3029], [20.48857, 42.25444], [20.56955, 42.12097], [20.55633, 42.08173], [20.59434, 42.03879], [20.63069, 41.94913], [20.57946, 41.91593], [20.59524, 41.8818], [20.68523, 41.85318], [20.76786, 41.91839], [20.75464, 42.05229], [21.11491, 42.20794], [21.16614, 42.19815], [21.22728, 42.08909], [21.31983, 42.10993], [21.29913, 42.13954], [21.30496, 42.1418], [21.38428, 42.24465], [21.43882, 42.23609], [21.43882, 42.2789], [21.50823, 42.27156], [21.52145, 42.24465], [21.58992, 42.25915], [21.56772, 42.30946], [21.5264, 42.33634], [21.53467, 42.36809], [21.57021, 42.3647], [21.59029, 42.38042], [21.62887, 42.37664], [21.64209, 42.41081], [21.62556, 42.45106], [21.7035, 42.51899], [21.70522, 42.54176], [21.7327, 42.55041], [21.75672, 42.62695], [21.79413, 42.65923], [21.75025, 42.70125], [21.6626, 42.67813], [21.58755, 42.70418], [21.59154, 42.72643], [21.47498, 42.74695], [21.39045, 42.74888]]]] } },
      { type: "Feature", properties: { iso1A2: "YE", iso1A3: "YEM", iso1N3: "887", wikidata: "Q805", nameEn: "Yemen", groups: ["145", "142", "UN"], callingCodes: ["967"] }, geometry: { type: "MultiPolygon", coordinates: [[[[57.49095, 8.14549], [52.81185, 17.28568], [52.74267, 17.29519], [52.78009, 17.35124], [52.00311, 19.00083], [49.04884, 18.59899], [48.19996, 18.20584], [47.58351, 17.50366], [47.48245, 17.10808], [47.00571, 16.94765], [46.76494, 17.29151], [46.31018, 17.20464], [44.50126, 17.47475], [43.70631, 17.35762], [43.43005, 17.56148], [43.29185, 17.53224], [43.22533, 17.38343], [43.32653, 17.31179], [43.20156, 17.25901], [43.17787, 17.14717], [43.23967, 17.03428], [43.18233, 17.02673], [43.1813, 16.98438], [43.19328, 16.94703], [43.1398, 16.90696], [43.18338, 16.84852], [43.22012, 16.83932], [43.22956, 16.80613], [43.24801, 16.80613], [43.26303, 16.79479], [43.25857, 16.75304], [43.21325, 16.74416], [43.22066, 16.65179], [43.15274, 16.67248], [43.11601, 16.53166], [42.97215, 16.51093], [42.94351, 16.49467], [42.94625, 16.39721], [42.76801, 16.40371], [42.15205, 16.40211], [40.99158, 15.81743], [43.29075, 12.79154], [43.32909, 12.59711], [43.90659, 12.3823], [51.12877, 12.56479], [57.49095, 8.14549]]]] } },
      { type: "Feature", properties: { iso1A2: "YT", iso1A3: "MYT", iso1N3: "175", wikidata: "Q17063", nameEn: "Mayotte", country: "FR", groups: ["Q3320166", "EU", "014", "202", "002", "UN"], callingCodes: ["262"] }, geometry: { type: "MultiPolygon", coordinates: [[[[43.28731, -13.97126], [45.54824, -13.22353], [45.4971, -11.75965], [43.28731, -13.97126]]]] } },
      { type: "Feature", properties: { iso1A2: "ZA", iso1A3: "ZAF", iso1N3: "710", wikidata: "Q258", nameEn: "South Africa", groups: ["018", "202", "002", "UN"], driveSide: "left", callingCodes: ["27"] }, geometry: { type: "MultiPolygon", coordinates: [[[[31.30611, -22.422], [31.16344, -22.32599], [31.08932, -22.34884], [30.86696, -22.28907], [30.6294, -22.32599], [30.48686, -22.31368], [30.38614, -22.34533], [30.28351, -22.35587], [30.2265, -22.2961], [30.13147, -22.30841], [29.92242, -22.19408], [29.76848, -22.14128], [29.64609, -22.12917], [29.37703, -22.19581], [29.21955, -22.17771], [29.18974, -22.18599], [29.15268, -22.21399], [29.10881, -22.21202], [29.0151, -22.22907], [28.91889, -22.44299], [28.63287, -22.55887], [28.34874, -22.5694], [28.04562, -22.8394], [28.04752, -22.90243], [27.93729, -22.96194], [27.93539, -23.04941], [27.74154, -23.2137], [27.6066, -23.21894], [27.52393, -23.37952], [27.33768, -23.40917], [26.99749, -23.65486], [26.84165, -24.24885], [26.51667, -24.47219], [26.46346, -24.60358], [26.39409, -24.63468], [25.8515, -24.75727], [25.84295, -24.78661], [25.88571, -24.87802], [25.72702, -25.25503], [25.69661, -25.29284], [25.6643, -25.4491], [25.58543, -25.6343], [25.33076, -25.76616], [25.12266, -25.75931], [25.01718, -25.72507], [24.8946, -25.80723], [24.67319, -25.81749], [24.44703, -25.73021], [24.36531, -25.773], [24.18287, -25.62916], [23.9244, -25.64286], [23.47588, -25.29971], [23.03497, -25.29971], [22.86012, -25.50572], [22.70808, -25.99186], [22.56365, -26.19668], [22.41921, -26.23078], [22.21206, -26.3773], [22.06192, -26.61882], [21.90703, -26.66808], [21.83291, -26.65959], [21.77114, -26.69015], [21.7854, -26.79199], [21.69322, -26.86152], [21.37869, -26.82083], [21.13353, -26.86661], [20.87031, -26.80047], [20.68596, -26.9039], [20.63275, -26.78181], [20.61754, -26.4692], [20.86081, -26.14892], [20.64795, -25.47827], [20.29826, -24.94869], [20.03678, -24.81004], [20.02809, -24.78725], [19.99817, -24.76768], [19.99882, -28.42622], [18.99885, -28.89165], [17.4579, -28.68718], [17.15405, -28.08573], [16.90446, -28.057], [16.59922, -28.53246], [16.46592, -28.57126], [16.45332, -28.63117], [12.51595, -32.27486], [38.88176, -48.03306], [34.51034, -26.91792], [32.35222, -26.86027], [32.29584, -26.852], [32.22302, -26.84136], [32.19409, -26.84032], [32.13315, -26.84345], [32.09664, -26.80721], [32.00893, -26.8096], [31.97463, -27.11057], [31.97592, -27.31675], [31.49834, -27.31549], [31.15027, -27.20151], [30.96088, -27.0245], [30.97757, -26.92706], [30.88826, -26.79622], [30.81101, -26.84722], [30.78927, -26.48271], [30.95819, -26.26303], [31.13073, -25.91558], [31.31237, -25.7431], [31.4175, -25.71886], [31.86881, -25.99973], [31.974, -25.95387], [31.92649, -25.84216], [32.00631, -25.65044], [31.97875, -25.46356], [32.01676, -25.38117], [32.03196, -25.10785], [31.9835, -24.29983], [31.90368, -24.18892], [31.87707, -23.95293], [31.77445, -23.90082], [31.70223, -23.72695], [31.67942, -23.60858], [31.56539, -23.47268], [31.55779, -23.176], [31.30611, -22.422]], [[29.33204, -29.45598], [29.28545, -29.58456], [29.12553, -29.76266], [29.16548, -29.91706], [28.9338, -30.05072], [28.80222, -30.10579], [28.68627, -30.12885], [28.399, -30.1592], [28.2319, -30.28476], [28.12073, -30.68072], [27.74814, -30.60635], [27.69467, -30.55862], [27.67819, -30.53437], [27.6521, -30.51707], [27.62137, -30.50509], [27.56781, -30.44562], [27.56901, -30.42504], [27.45452, -30.32239], [27.38108, -30.33456], [27.36649, -30.27246], [27.37293, -30.19401], [27.40778, -30.14577], [27.32555, -30.14785], [27.29603, -30.05473], [27.22719, -30.00718], [27.09489, -29.72796], [27.01016, -29.65439], [27.33464, -29.48161], [27.4358, -29.33465], [27.47254, -29.31968], [27.45125, -29.29708], [27.48679, -29.29349], [27.54258, -29.25575], [27.5158, -29.2261], [27.55974, -29.18954], [27.75458, -28.89839], [27.8907, -28.91612], [27.88933, -28.88156], [27.9392, -28.84864], [27.98675, -28.8787], [28.02503, -28.85991], [28.1317, -28.7293], [28.2348, -28.69471], [28.30518, -28.69531], [28.40612, -28.6215], [28.65091, -28.57025], [28.68043, -28.58744], [29.40524, -29.21246], [29.44883, -29.3772], [29.33204, -29.45598]]]] } },
      { type: "Feature", properties: { iso1A2: "ZM", iso1A3: "ZMB", iso1N3: "894", wikidata: "Q953", nameEn: "Zambia", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["260"] }, geometry: { type: "MultiPolygon", coordinates: [[[[32.95389, -9.40138], [32.76233, -9.31963], [32.75611, -9.28583], [32.53661, -9.24281], [32.49147, -9.14754], [32.43543, -9.11988], [32.25486, -9.13371], [32.16146, -9.05993], [32.08206, -9.04609], [31.98866, -9.07069], [31.94196, -9.02303], [31.94663, -8.93846], [31.81587, -8.88618], [31.71158, -8.91386], [31.57147, -8.81388], [31.57147, -8.70619], [31.37533, -8.60769], [31.00796, -8.58615], [30.79243, -8.27382], [28.88917, -8.4831], [28.9711, -8.66935], [28.38526, -9.23393], [28.36562, -9.30091], [28.52636, -9.35379], [28.51627, -9.44726], [28.56208, -9.49122], [28.68532, -9.78], [28.62795, -9.92942], [28.65032, -10.65133], [28.37241, -11.57848], [28.48357, -11.87532], [29.18592, -12.37921], [29.4992, -12.43843], [29.48404, -12.23604], [29.8139, -12.14898], [29.81551, -13.44683], [29.65078, -13.41844], [29.60531, -13.21685], [29.01918, -13.41353], [28.33199, -12.41375], [27.59932, -12.22123], [27.21025, -11.76157], [27.22541, -11.60323], [27.04351, -11.61312], [26.88687, -12.01868], [26.01777, -11.91488], [25.33058, -11.65767], [25.34069, -11.19707], [24.42612, -11.44975], [24.34528, -11.06816], [24.00027, -10.89356], [24.02603, -11.15368], [23.98804, -12.13149], [24.06672, -12.29058], [23.90937, -12.844], [24.03339, -12.99091], [21.97988, -13.00148], [22.00323, -16.18028], [22.17217, -16.50269], [23.20038, -17.47563], [23.47474, -17.62877], [24.23619, -17.47489], [24.32811, -17.49082], [24.38712, -17.46818], [24.5621, -17.52963], [24.70864, -17.49501], [25.00198, -17.58221], [25.26433, -17.79571], [25.51646, -17.86232], [25.6827, -17.81987], [25.85738, -17.91403], [25.85892, -17.97726], [26.08925, -17.98168], [26.0908, -17.93021], [26.21601, -17.88608], [26.55918, -17.99638], [26.68403, -18.07411], [26.74314, -18.0199], [26.89926, -17.98756], [27.14196, -17.81398], [27.30736, -17.60487], [27.61377, -17.34378], [27.62795, -17.24365], [27.83141, -16.96274], [28.73725, -16.5528], [28.76199, -16.51575], [28.81454, -16.48611], [28.8501, -16.04537], [28.9243, -15.93987], [29.01298, -15.93805], [29.21955, -15.76589], [29.4437, -15.68702], [29.8317, -15.6126], [30.35574, -15.6513], [30.41902, -15.62269], [30.22098, -14.99447], [33.24249, -14.00019], [33.16749, -13.93992], [33.07568, -13.98447], [33.02977, -14.05022], [32.99042, -13.95689], [32.88985, -13.82956], [32.79015, -13.80755], [32.76962, -13.77224], [32.84528, -13.71576], [32.7828, -13.64805], [32.68654, -13.64268], [32.66468, -13.60019], [32.68436, -13.55769], [32.73683, -13.57682], [32.84176, -13.52794], [32.86113, -13.47292], [33.0078, -13.19492], [32.98289, -13.12671], [33.02181, -12.88707], [32.96733, -12.88251], [32.94397, -12.76868], [33.05917, -12.59554], [33.18837, -12.61377], [33.28177, -12.54692], [33.37517, -12.54085], [33.54485, -12.35996], [33.47636, -12.32498], [33.3705, -12.34931], [33.25998, -12.14242], [33.33937, -11.91252], [33.32692, -11.59248], [33.24252, -11.59302], [33.23663, -11.40637], [33.29267, -11.43536], [33.29267, -11.3789], [33.39697, -11.15296], [33.25998, -10.88862], [33.28022, -10.84428], [33.47636, -10.78465], [33.70675, -10.56896], [33.54797, -10.36077], [33.53863, -10.20148], [33.31297, -10.05133], [33.37902, -9.9104], [33.36581, -9.81063], [33.31517, -9.82364], [33.2095, -9.61099], [33.12144, -9.58929], [33.10163, -9.66525], [33.05485, -9.61316], [33.00256, -9.63053], [33.00476, -9.5133], [32.95389, -9.40138]]]] } },
      { type: "Feature", properties: { iso1A2: "ZW", iso1A3: "ZWE", iso1N3: "716", wikidata: "Q954", nameEn: "Zimbabwe", groups: ["014", "202", "002", "UN"], driveSide: "left", callingCodes: ["263"] }, geometry: { type: "MultiPolygon", coordinates: [[[[30.41902, -15.62269], [30.35574, -15.6513], [29.8317, -15.6126], [29.4437, -15.68702], [29.21955, -15.76589], [29.01298, -15.93805], [28.9243, -15.93987], [28.8501, -16.04537], [28.81454, -16.48611], [28.76199, -16.51575], [28.73725, -16.5528], [27.83141, -16.96274], [27.62795, -17.24365], [27.61377, -17.34378], [27.30736, -17.60487], [27.14196, -17.81398], [26.89926, -17.98756], [26.74314, -18.0199], [26.68403, -18.07411], [26.55918, -17.99638], [26.21601, -17.88608], [26.0908, -17.93021], [26.08925, -17.98168], [25.85892, -17.97726], [25.85738, -17.91403], [25.6827, -17.81987], [25.51646, -17.86232], [25.26433, -17.79571], [25.23909, -17.90832], [25.31799, -18.07091], [25.39972, -18.12691], [25.53465, -18.39041], [25.68859, -18.56165], [25.79217, -18.6355], [25.82353, -18.82808], [25.94326, -18.90362], [25.99837, -19.02943], [25.96226, -19.08152], [26.17227, -19.53709], [26.72246, -19.92707], [27.21278, -20.08244], [27.29831, -20.28935], [27.28865, -20.49873], [27.69361, -20.48531], [27.72972, -20.51735], [27.69171, -21.08409], [27.91407, -21.31621], [28.01669, -21.57624], [28.29416, -21.59037], [28.49942, -21.66634], [28.58114, -21.63455], [29.07763, -21.81877], [29.04023, -21.85864], [29.02191, -21.90647], [29.02191, -21.95665], [29.04108, -22.00563], [29.08495, -22.04867], [29.14501, -22.07275], [29.1974, -22.07472], [29.24648, -22.05967], [29.3533, -22.18363], [29.37703, -22.19581], [29.64609, -22.12917], [29.76848, -22.14128], [29.92242, -22.19408], [30.13147, -22.30841], [30.2265, -22.2961], [30.28351, -22.35587], [30.38614, -22.34533], [30.48686, -22.31368], [30.6294, -22.32599], [30.86696, -22.28907], [31.08932, -22.34884], [31.16344, -22.32599], [31.30611, -22.422], [31.38336, -22.36919], [32.41234, -21.31246], [32.48236, -21.32873], [32.37115, -21.133], [32.51644, -20.91929], [32.48122, -20.63319], [32.55167, -20.56312], [32.66174, -20.56106], [32.85987, -20.27841], [32.85987, -20.16686], [32.93032, -20.03868], [33.01178, -20.02007], [33.06461, -19.77787], [32.95013, -19.67219], [32.84666, -19.68462], [32.84446, -19.48343], [32.78282, -19.47513], [32.77966, -19.36098], [32.85107, -19.29238], [32.87088, -19.09279], [32.84006, -19.0262], [32.72118, -19.02204], [32.69917, -18.94293], [32.73439, -18.92628], [32.70137, -18.84712], [32.82465, -18.77419], [32.9017, -18.7992], [32.95013, -18.69079], [32.88629, -18.58023], [32.88629, -18.51344], [33.02278, -18.4696], [33.03159, -18.35054], [32.94133, -17.99705], [33.0492, -17.60298], [32.98536, -17.55891], [32.96554, -17.48964], [33.0426, -17.3468], [33.00517, -17.30477], [32.96554, -17.11971], [32.84113, -16.92259], [32.91051, -16.89446], [32.97655, -16.70689], [32.78943, -16.70267], [32.69917, -16.66893], [32.71017, -16.59932], [32.42838, -16.4727], [32.28529, -16.43892], [32.02772, -16.43892], [31.91324, -16.41569], [31.90223, -16.34388], [31.67988, -16.19595], [31.42451, -16.15154], [31.30563, -16.01193], [31.13171, -15.98019], [30.97761, -16.05848], [30.91597, -15.99924], [30.42568, -15.9962], [30.41902, -15.62269]]]] } }
    ];
    var borders_default = { type, features };
    var borders = borders_default;
    var whichPolygonGetter = {};
    var featuresByCode = {};
    var idFilterRegex = /(?=(?!^(and|the|of|el|la|de)$))(\b(and|the|of|el|la|de)\b)|[-_ .,'()&[\]/]/gi;
    function canonicalID(id) {
      let s = id || "";
      if (s.charAt(0) === ".") {
        return s.toUpperCase();
      } else {
        return s.replace(idFilterRegex, "").toUpperCase();
      }
    }
    var levels = [
      "subterritory",
      "territory",
      "subcountryGroup",
      "country",
      "sharedLandform",
      "intermediateRegion",
      "subregion",
      "region",
      "subunion",
      "union",
      "unitedNations",
      "world"
    ];
    loadDerivedDataAndCaches(borders);
    function loadDerivedDataAndCaches(borders2) {
      let identifierProps = ["iso1A2", "iso1A3", "m49", "wikidata", "emojiFlag", "ccTLD", "nameEn"];
      let geometryFeatures = [];
      for (let i in borders2.features) {
        let feature22 = borders2.features[i];
        feature22.properties.id = feature22.properties.iso1A2 || feature22.properties.m49 || feature22.properties.wikidata;
        loadM49(feature22);
        loadTLD(feature22);
        loadIsoStatus(feature22);
        loadLevel(feature22);
        loadGroups(feature22);
        loadFlag(feature22);
        cacheFeatureByIDs(feature22);
        if (feature22.geometry)
          geometryFeatures.push(feature22);
      }
      for (let i in borders2.features) {
        let feature22 = borders2.features[i];
        feature22.properties.groups = feature22.properties.groups.map(function(groupID) {
          return featuresByCode[groupID].properties.id;
        });
        loadMembersForGroupsOf(feature22);
      }
      for (let i in borders2.features) {
        let feature22 = borders2.features[i];
        loadRoadSpeedUnit(feature22);
        loadRoadHeightUnit(feature22);
        loadDriveSide(feature22);
        loadCallingCodes(feature22);
        loadGroupGroups(feature22);
      }
      for (let i in borders2.features) {
        let feature22 = borders2.features[i];
        feature22.properties.groups.sort(function(groupID1, groupID2) {
          return levels.indexOf(featuresByCode[groupID1].properties.level) - levels.indexOf(featuresByCode[groupID2].properties.level);
        });
        if (feature22.properties.members)
          feature22.properties.members.sort(function(id1, id2) {
            let diff = levels.indexOf(featuresByCode[id1].properties.level) - levels.indexOf(featuresByCode[id2].properties.level);
            if (diff === 0) {
              return borders2.features.indexOf(featuresByCode[id1]) - borders2.features.indexOf(featuresByCode[id2]);
            }
            return diff;
          });
      }
      let geometryOnlyCollection = {
        type: "FeatureCollection",
        features: geometryFeatures
      };
      whichPolygonGetter = (0, import_which_polygon.default)(geometryOnlyCollection);
      function loadGroups(feature22) {
        let props = feature22.properties;
        if (!props.groups) {
          props.groups = [];
        }
        if (feature22.geometry && props.country) {
          props.groups.push(props.country);
        }
        if (props.m49 !== "001") {
          props.groups.push("001");
        }
      }
      function loadM49(feature22) {
        let props = feature22.properties;
        if (!props.m49 && props.iso1N3) {
          props.m49 = props.iso1N3;
        }
      }
      function loadTLD(feature22) {
        let props = feature22.properties;
        if (props.level === "unitedNations")
          return;
        if (!props.ccTLD && props.iso1A2) {
          props.ccTLD = "." + props.iso1A2.toLowerCase();
        }
      }
      function loadIsoStatus(feature22) {
        let props = feature22.properties;
        if (!props.isoStatus && props.iso1A2) {
          props.isoStatus = "official";
        }
      }
      function loadLevel(feature22) {
        let props = feature22.properties;
        if (props.level)
          return;
        if (!props.country) {
          props.level = "country";
        } else if (!props.iso1A2 || props.isoStatus === "official") {
          props.level = "territory";
        } else {
          props.level = "subterritory";
        }
      }
      function loadGroupGroups(feature22) {
        let props = feature22.properties;
        if (feature22.geometry || !props.members)
          return;
        let featureLevelIndex = levels.indexOf(props.level);
        let sharedGroups = [];
        for (let i in props.members) {
          let memberID = props.members[i];
          let member = featuresByCode[memberID];
          let memberGroups = member.properties.groups.filter(function(groupID) {
            return groupID !== feature22.properties.id && featureLevelIndex < levels.indexOf(featuresByCode[groupID].properties.level);
          });
          if (i === "0") {
            sharedGroups = memberGroups;
          } else {
            sharedGroups = sharedGroups.filter(function(groupID) {
              return memberGroups.indexOf(groupID) !== -1;
            });
          }
        }
        props.groups = props.groups.concat(sharedGroups.filter(function(groupID) {
          return props.groups.indexOf(groupID) === -1;
        }));
        for (let j in sharedGroups) {
          let groupFeature = featuresByCode[sharedGroups[j]];
          if (groupFeature.properties.members.indexOf(props.id) === -1) {
            groupFeature.properties.members.push(props.id);
          }
        }
      }
      function loadRoadSpeedUnit(feature22) {
        let props = feature22.properties;
        if (feature22.geometry) {
          if (!props.roadSpeedUnit)
            props.roadSpeedUnit = "km/h";
        } else if (props.members) {
          let vals = Array.from(new Set(props.members.map(function(id) {
            let member = featuresByCode[id];
            if (member.geometry)
              return member.properties.roadSpeedUnit || "km/h";
          }).filter(Boolean)));
          if (vals.length === 1)
            props.roadSpeedUnit = vals[0];
        }
      }
      function loadRoadHeightUnit(feature22) {
        let props = feature22.properties;
        if (feature22.geometry) {
          if (!props.roadHeightUnit)
            props.roadHeightUnit = "m";
        } else if (props.members) {
          let vals = Array.from(new Set(props.members.map(function(id) {
            let member = featuresByCode[id];
            if (member.geometry)
              return member.properties.roadHeightUnit || "m";
          }).filter(Boolean)));
          if (vals.length === 1)
            props.roadHeightUnit = vals[0];
        }
      }
      function loadDriveSide(feature22) {
        let props = feature22.properties;
        if (feature22.geometry) {
          if (!props.driveSide)
            props.driveSide = "right";
        } else if (props.members) {
          let vals = Array.from(new Set(props.members.map(function(id) {
            let member = featuresByCode[id];
            if (member.geometry)
              return member.properties.driveSide || "right";
          }).filter(Boolean)));
          if (vals.length === 1)
            props.driveSide = vals[0];
        }
      }
      function loadCallingCodes(feature22) {
        let props = feature22.properties;
        if (!feature22.geometry && props.members) {
          props.callingCodes = Array.from(new Set(props.members.reduce(function(array, id) {
            let member = featuresByCode[id];
            if (member.geometry && member.properties.callingCodes)
              return array.concat(member.properties.callingCodes);
            return array;
          }, [])));
        }
      }
      function loadFlag(feature22) {
        if (!feature22.properties.iso1A2)
          return;
        let flag = feature22.properties.iso1A2.replace(/./g, function(char) {
          return String.fromCodePoint(char.charCodeAt(0) + 127397);
        });
        feature22.properties.emojiFlag = flag;
      }
      function loadMembersForGroupsOf(feature22) {
        for (let j in feature22.properties.groups) {
          let groupID = feature22.properties.groups[j];
          let groupFeature = featuresByCode[groupID];
          if (!groupFeature.properties.members)
            groupFeature.properties.members = [];
          groupFeature.properties.members.push(feature22.properties.id);
        }
      }
      function cacheFeatureByIDs(feature22) {
        let ids = [];
        for (let k in identifierProps) {
          let prop = identifierProps[k];
          let id = feature22.properties[prop];
          if (id)
            ids.push(id);
        }
        if (feature22.properties.aliases) {
          for (let j in feature22.properties.aliases) {
            ids.push(feature22.properties.aliases[j]);
          }
        }
        for (let i in ids) {
          let id = canonicalID(ids[i]);
          featuresByCode[id] = feature22;
        }
      }
    }
    function locArray(loc) {
      if (Array.isArray(loc)) {
        return loc;
      } else if (loc.coordinates) {
        return loc.coordinates;
      }
      return loc.geometry.coordinates;
    }
    function smallestFeature(loc) {
      let query = locArray(loc);
      let featureProperties = whichPolygonGetter(query);
      if (!featureProperties)
        return null;
      return featuresByCode[featureProperties.id];
    }
    function countryFeature(loc) {
      let feature22 = smallestFeature(loc);
      if (!feature22)
        return null;
      let countryCode = feature22.properties.country || feature22.properties.iso1A2;
      return featuresByCode[countryCode] || null;
    }
    var defaultOpts = {
      level: void 0,
      maxLevel: void 0,
      withProp: void 0
    };
    function featureForLoc(loc, opts) {
      let targetLevel = opts.level || "country";
      let maxLevel = opts.maxLevel || "world";
      let withProp = opts.withProp;
      let targetLevelIndex = levels.indexOf(targetLevel);
      if (targetLevelIndex === -1)
        return null;
      let maxLevelIndex = levels.indexOf(maxLevel);
      if (maxLevelIndex === -1)
        return null;
      if (maxLevelIndex < targetLevelIndex)
        return null;
      if (targetLevel === "country") {
        let fastFeature = countryFeature(loc);
        if (fastFeature) {
          if (!withProp || fastFeature.properties[withProp]) {
            return fastFeature;
          }
        }
      }
      let features2 = featuresContaining(loc);
      for (let i in features2) {
        let feature22 = features2[i];
        let levelIndex = levels.indexOf(feature22.properties.level);
        if (feature22.properties.level === targetLevel || levelIndex > targetLevelIndex && levelIndex <= maxLevelIndex) {
          if (!withProp || feature22.properties[withProp]) {
            return feature22;
          }
        }
      }
      return null;
    }
    function featureForID(id) {
      let stringID;
      if (typeof id === "number") {
        stringID = id.toString();
        if (stringID.length === 1) {
          stringID = "00" + stringID;
        } else if (stringID.length === 2) {
          stringID = "0" + stringID;
        }
      } else {
        stringID = canonicalID(id);
      }
      return featuresByCode[stringID] || null;
    }
    function smallestFeaturesForBbox(bbox) {
      return whichPolygonGetter.bbox(bbox).map(function(props) {
        return featuresByCode[props.id];
      });
    }
    function smallestOrMatchingFeature(query) {
      if (typeof query === "object") {
        return smallestFeature(query);
      }
      return featureForID(query);
    }
    function feature2(query, opts = defaultOpts) {
      if (typeof query === "object") {
        return featureForLoc(query, opts);
      }
      return featureForID(query);
    }
    function iso1A2Code(query, opts = defaultOpts) {
      opts.withProp = "iso1A2";
      let match = feature2(query, opts);
      if (!match)
        return null;
      return match.properties.iso1A2 || null;
    }
    function iso1A3Code(query, opts = defaultOpts) {
      opts.withProp = "iso1A3";
      let match = feature2(query, opts);
      if (!match)
        return null;
      return match.properties.iso1A3 || null;
    }
    function iso1N3Code(query, opts = defaultOpts) {
      opts.withProp = "iso1N3";
      let match = feature2(query, opts);
      if (!match)
        return null;
      return match.properties.iso1N3 || null;
    }
    function m49Code(query, opts = defaultOpts) {
      opts.withProp = "m49";
      let match = feature2(query, opts);
      if (!match)
        return null;
      return match.properties.m49 || null;
    }
    function wikidataQID(query, opts = defaultOpts) {
      opts.withProp = "wikidata";
      let match = feature2(query, opts);
      if (!match)
        return null;
      return match.properties.wikidata;
    }
    function emojiFlag(query, opts = defaultOpts) {
      opts.withProp = "emojiFlag";
      let match = feature2(query, opts);
      if (!match)
        return null;
      return match.properties.emojiFlag || null;
    }
    function ccTLD(query, opts = defaultOpts) {
      opts.withProp = "ccTLD";
      let match = feature2(query, opts);
      if (!match)
        return null;
      return match.properties.ccTLD || null;
    }
    function propertiesForQuery(query, property) {
      let features2 = featuresContaining(query, false);
      return features2.map(function(feature22) {
        return feature22.properties[property];
      }).filter(Boolean);
    }
    function iso1A2Codes(query) {
      return propertiesForQuery(query, "iso1A2");
    }
    function iso1A3Codes(query) {
      return propertiesForQuery(query, "iso1A3");
    }
    function iso1N3Codes(query) {
      return propertiesForQuery(query, "iso1N3");
    }
    function m49Codes(query) {
      return propertiesForQuery(query, "m49");
    }
    function wikidataQIDs(query) {
      return propertiesForQuery(query, "wikidata");
    }
    function emojiFlags(query) {
      return propertiesForQuery(query, "emojiFlag");
    }
    function ccTLDs(query) {
      return propertiesForQuery(query, "ccTLD");
    }
    function featuresContaining(query, strict) {
      let matchingFeatures;
      if (Array.isArray(query) && query.length === 4) {
        matchingFeatures = smallestFeaturesForBbox(query);
      } else {
        let smallestOrMatching = smallestOrMatchingFeature(query);
        matchingFeatures = smallestOrMatching ? [smallestOrMatching] : [];
      }
      if (!matchingFeatures.length)
        return [];
      let returnFeatures;
      if (!strict || typeof query === "object") {
        returnFeatures = matchingFeatures.slice();
      } else {
        returnFeatures = [];
      }
      for (let j in matchingFeatures) {
        let properties = matchingFeatures[j].properties;
        for (let i in properties.groups) {
          let groupID = properties.groups[i];
          let groupFeature = featuresByCode[groupID];
          if (returnFeatures.indexOf(groupFeature) === -1) {
            returnFeatures.push(groupFeature);
          }
        }
      }
      return returnFeatures;
    }
    function featuresIn(id, strict) {
      let feature22 = featureForID(id);
      if (!feature22)
        return [];
      let features2 = [];
      if (!strict) {
        features2.push(feature22);
      }
      let properties = feature22.properties;
      if (properties.members) {
        for (let i in properties.members) {
          let memberID = properties.members[i];
          features2.push(featuresByCode[memberID]);
        }
      }
      return features2;
    }
    function aggregateFeature2(id) {
      let features2 = featuresIn(id, false);
      if (features2.length === 0)
        return null;
      let aggregateCoordinates = [];
      for (let i in features2) {
        let feature22 = features2[i];
        if (feature22.geometry && feature22.geometry.type === "MultiPolygon" && feature22.geometry.coordinates) {
          aggregateCoordinates = aggregateCoordinates.concat(feature22.geometry.coordinates);
        }
      }
      return {
        type: "Feature",
        properties: features2[0].properties,
        geometry: {
          type: "MultiPolygon",
          coordinates: aggregateCoordinates
        }
      };
    }
    function isIn(query, bounds) {
      let queryFeature = smallestOrMatchingFeature(query);
      let boundsFeature = featureForID(bounds);
      if (!queryFeature || !boundsFeature)
        return null;
      if (queryFeature.properties.id === boundsFeature.properties.id)
        return true;
      return queryFeature.properties.groups.indexOf(boundsFeature.properties.id) !== -1;
    }
    function isInEuropeanUnion(query) {
      return isIn(query, "EU");
    }
    function isInUnitedNations(query) {
      return isIn(query, "UN");
    }
    function driveSide(query) {
      let feature22 = smallestOrMatchingFeature(query);
      return feature22 && feature22.properties.driveSide || null;
    }
    function roadSpeedUnit(query) {
      let feature22 = smallestOrMatchingFeature(query);
      return feature22 && feature22.properties.roadSpeedUnit || null;
    }
    function roadHeightUnit(query) {
      let feature22 = smallestOrMatchingFeature(query);
      return feature22 && feature22.properties.roadHeightUnit || null;
    }
    function callingCodes(query) {
      let feature22 = smallestOrMatchingFeature(query);
      return feature22 && feature22.properties.callingCodes || [];
    }
  }
});

// node_modules/wgs84/index.js
var require_wgs84 = __commonJS({
  "node_modules/wgs84/index.js"(exports, module2) {
    module2.exports.RADIUS = 6378137;
    module2.exports.FLATTENING = 1 / 298.257223563;
    module2.exports.POLAR_RADIUS = 63567523142e-4;
  }
});

// node_modules/@mapbox/geojson-area/index.js
var require_geojson_area = __commonJS({
  "node_modules/@mapbox/geojson-area/index.js"(exports, module2) {
    var wgs84 = require_wgs84();
    module2.exports.geometry = geometry;
    module2.exports.ring = ringArea;
    function geometry(_) {
      var area = 0, i;
      switch (_.type) {
        case "Polygon":
          return polygonArea(_.coordinates);
        case "MultiPolygon":
          for (i = 0; i < _.coordinates.length; i++) {
            area += polygonArea(_.coordinates[i]);
          }
          return area;
        case "Point":
        case "MultiPoint":
        case "LineString":
        case "MultiLineString":
          return 0;
        case "GeometryCollection":
          for (i = 0; i < _.geometries.length; i++) {
            area += geometry(_.geometries[i]);
          }
          return area;
      }
    }
    function polygonArea(coords) {
      var area = 0;
      if (coords && coords.length > 0) {
        area += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
          area -= Math.abs(ringArea(coords[i]));
        }
      }
      return area;
    }
    function ringArea(coords) {
      var p1, p2, p3, lowerIndex, middleIndex, upperIndex, i, area = 0, coordsLength = coords.length;
      if (coordsLength > 2) {
        for (i = 0; i < coordsLength; i++) {
          if (i === coordsLength - 2) {
            lowerIndex = coordsLength - 2;
            middleIndex = coordsLength - 1;
            upperIndex = 0;
          } else if (i === coordsLength - 1) {
            lowerIndex = coordsLength - 1;
            middleIndex = 0;
            upperIndex = 1;
          } else {
            lowerIndex = i;
            middleIndex = i + 1;
            upperIndex = i + 2;
          }
          p1 = coords[lowerIndex];
          p2 = coords[middleIndex];
          p3 = coords[upperIndex];
          area += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
        }
        area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
      }
      return area;
    }
    function rad(_) {
      return _ * Math.PI / 180;
    }
  }
});

// node_modules/circle-to-polygon/index.js
var require_circle_to_polygon = __commonJS({
  "node_modules/circle-to-polygon/index.js"(exports, module2) {
    "use strict";
    function toRadians(angleInDegrees) {
      return angleInDegrees * Math.PI / 180;
    }
    function toDegrees(angleInRadians) {
      return angleInRadians * 180 / Math.PI;
    }
    function offset(c1, distance, bearing) {
      var lat1 = toRadians(c1[1]);
      var lon1 = toRadians(c1[0]);
      var dByR = distance / 6378137;
      var lat = Math.asin(Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
      var lon = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1), Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
      return [toDegrees(lon), toDegrees(lat)];
    }
    function validateCenter(center) {
      const validCenterLengths = [2, 3];
      if (!Array.isArray(center) || !validCenterLengths.includes(center.length)) {
        throw new Error("ERROR! Center has to be an array of length two or three");
      }
      const [lng, lat] = center;
      if (typeof lng !== "number" || typeof lat !== "number") {
        throw new Error(`ERROR! Longitude and Latitude has to be numbers but where ${typeof lng} and ${typeof lat}`);
      }
      if (lng > 180 || lng < -180) {
        throw new Error(`ERROR! Longitude has to be between -180 and 180 but was ${lng}`);
      }
      if (lat > 90 || lat < -90) {
        throw new Error(`ERROR! Latitude has to be between -90 and 90 but was ${lat}`);
      }
    }
    function validateRadius(radius) {
      if (typeof radius !== "number") {
        throw new Error(`ERROR! Radius has to be a positive number but was: ${typeof radius}`);
      }
      if (radius <= 0) {
        throw new Error(`ERROR! Radius has to be a positive number but was: ${radius}`);
      }
    }
    function validateNumberOfSegments(numberOfSegments) {
      if (typeof numberOfSegments !== "number" && numberOfSegments !== void 0) {
        throw new Error(`ERROR! Number of segments has to be a number but was: ${typeof numberOfSegments}`);
      }
      if (numberOfSegments < 3) {
        throw new Error(`ERROR! Number of segments has to be at least 3 but was: ${numberOfSegments}`);
      }
    }
    function validateInput({ center, radius, numberOfSegments }) {
      validateCenter(center);
      validateRadius(radius);
      validateNumberOfSegments(numberOfSegments);
    }
    module2.exports = function circleToPolygon2(center, radius, numberOfSegments) {
      var n = numberOfSegments ? numberOfSegments : 32;
      validateInput({ center, radius, numberOfSegments });
      var coordinates = [];
      for (var i = 0; i < n; ++i) {
        coordinates.push(offset(center, radius, 2 * Math.PI * -i / n));
      }
      coordinates.push(coordinates[0]);
      return {
        type: "Polygon",
        coordinates: [coordinates]
      };
    };
  }
});

// node_modules/polygon-clipping/node_modules/splaytree/dist/splay.js
var require_splay = __commonJS({
  "node_modules/polygon-clipping/node_modules/splaytree/dist/splay.js"(exports, module2) {
    (function(global, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.SplayTree = factory();
    })(exports, function() {
      "use strict";
      var Node = function() {
        function Node2(key, data) {
          this.next = null;
          this.key = key;
          this.data = data;
          this.left = null;
          this.right = null;
        }
        return Node2;
      }();
      function DEFAULT_COMPARE(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      }
      function splay(i, t, comparator) {
        var N = new Node(null, null);
        var l = N;
        var r = N;
        while (true) {
          var cmp = comparator(i, t.key);
          if (cmp < 0) {
            if (t.left === null)
              break;
            if (comparator(i, t.left.key) < 0) {
              var y = t.left;
              t.left = y.right;
              y.right = t;
              t = y;
              if (t.left === null)
                break;
            }
            r.left = t;
            r = t;
            t = t.left;
          } else if (cmp > 0) {
            if (t.right === null)
              break;
            if (comparator(i, t.right.key) > 0) {
              var y = t.right;
              t.right = y.left;
              y.left = t;
              t = y;
              if (t.right === null)
                break;
            }
            l.right = t;
            l = t;
            t = t.right;
          } else
            break;
        }
        l.right = t.left;
        r.left = t.right;
        t.left = N.right;
        t.right = N.left;
        return t;
      }
      function insert(i, data, t, comparator) {
        var node = new Node(i, data);
        if (t === null) {
          node.left = node.right = null;
          return node;
        }
        t = splay(i, t, comparator);
        var cmp = comparator(i, t.key);
        if (cmp < 0) {
          node.left = t.left;
          node.right = t;
          t.left = null;
        } else if (cmp >= 0) {
          node.right = t.right;
          node.left = t;
          t.right = null;
        }
        return node;
      }
      function split(key, v, comparator) {
        var left = null;
        var right = null;
        if (v) {
          v = splay(key, v, comparator);
          var cmp = comparator(v.key, key);
          if (cmp === 0) {
            left = v.left;
            right = v.right;
          } else if (cmp < 0) {
            right = v.right;
            v.right = null;
            left = v;
          } else {
            left = v.left;
            v.left = null;
            right = v;
          }
        }
        return { left, right };
      }
      function merge(left, right, comparator) {
        if (right === null)
          return left;
        if (left === null)
          return right;
        right = splay(left.key, right, comparator);
        right.left = left;
        return right;
      }
      function printRow(root, prefix, isTail, out, printNode) {
        if (root) {
          out("" + prefix + (isTail ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ") + printNode(root) + "\n");
          var indent = prefix + (isTail ? "    " : "\u2502   ");
          if (root.left)
            printRow(root.left, indent, false, out, printNode);
          if (root.right)
            printRow(root.right, indent, true, out, printNode);
        }
      }
      var Tree = function() {
        function Tree2(comparator) {
          if (comparator === void 0) {
            comparator = DEFAULT_COMPARE;
          }
          this._root = null;
          this._size = 0;
          this._comparator = comparator;
        }
        Tree2.prototype.insert = function(key, data) {
          this._size++;
          return this._root = insert(key, data, this._root, this._comparator);
        };
        Tree2.prototype.add = function(key, data) {
          var node = new Node(key, data);
          if (this._root === null) {
            node.left = node.right = null;
            this._size++;
            this._root = node;
          }
          var comparator = this._comparator;
          var t = splay(key, this._root, comparator);
          var cmp = comparator(key, t.key);
          if (cmp === 0)
            this._root = t;
          else {
            if (cmp < 0) {
              node.left = t.left;
              node.right = t;
              t.left = null;
            } else if (cmp > 0) {
              node.right = t.right;
              node.left = t;
              t.right = null;
            }
            this._size++;
            this._root = node;
          }
          return this._root;
        };
        Tree2.prototype.remove = function(key) {
          this._root = this._remove(key, this._root, this._comparator);
        };
        Tree2.prototype._remove = function(i, t, comparator) {
          var x;
          if (t === null)
            return null;
          t = splay(i, t, comparator);
          var cmp = comparator(i, t.key);
          if (cmp === 0) {
            if (t.left === null) {
              x = t.right;
            } else {
              x = splay(i, t.left, comparator);
              x.right = t.right;
            }
            this._size--;
            return x;
          }
          return t;
        };
        Tree2.prototype.pop = function() {
          var node = this._root;
          if (node) {
            while (node.left)
              node = node.left;
            this._root = splay(node.key, this._root, this._comparator);
            this._root = this._remove(node.key, this._root, this._comparator);
            return { key: node.key, data: node.data };
          }
          return null;
        };
        Tree2.prototype.findStatic = function(key) {
          var current = this._root;
          var compare = this._comparator;
          while (current) {
            var cmp = compare(key, current.key);
            if (cmp === 0)
              return current;
            else if (cmp < 0)
              current = current.left;
            else
              current = current.right;
          }
          return null;
        };
        Tree2.prototype.find = function(key) {
          if (this._root) {
            this._root = splay(key, this._root, this._comparator);
            if (this._comparator(key, this._root.key) !== 0)
              return null;
          }
          return this._root;
        };
        Tree2.prototype.contains = function(key) {
          var current = this._root;
          var compare = this._comparator;
          while (current) {
            var cmp = compare(key, current.key);
            if (cmp === 0)
              return true;
            else if (cmp < 0)
              current = current.left;
            else
              current = current.right;
          }
          return false;
        };
        Tree2.prototype.forEach = function(visitor, ctx) {
          var current = this._root;
          var Q = [];
          var done = false;
          while (!done) {
            if (current !== null) {
              Q.push(current);
              current = current.left;
            } else {
              if (Q.length !== 0) {
                current = Q.pop();
                visitor.call(ctx, current);
                current = current.right;
              } else
                done = true;
            }
          }
          return this;
        };
        Tree2.prototype.range = function(low, high, fn, ctx) {
          var Q = [];
          var compare = this._comparator;
          var node = this._root;
          var cmp;
          while (Q.length !== 0 || node) {
            if (node) {
              Q.push(node);
              node = node.left;
            } else {
              node = Q.pop();
              cmp = compare(node.key, high);
              if (cmp > 0) {
                break;
              } else if (compare(node.key, low) >= 0) {
                if (fn.call(ctx, node))
                  return this;
              }
              node = node.right;
            }
          }
          return this;
        };
        Tree2.prototype.keys = function() {
          var keys = [];
          this.forEach(function(_a) {
            var key = _a.key;
            return keys.push(key);
          });
          return keys;
        };
        Tree2.prototype.values = function() {
          var values = [];
          this.forEach(function(_a) {
            var data = _a.data;
            return values.push(data);
          });
          return values;
        };
        Tree2.prototype.min = function() {
          if (this._root)
            return this.minNode(this._root).key;
          return null;
        };
        Tree2.prototype.max = function() {
          if (this._root)
            return this.maxNode(this._root).key;
          return null;
        };
        Tree2.prototype.minNode = function(t) {
          if (t === void 0) {
            t = this._root;
          }
          if (t)
            while (t.left)
              t = t.left;
          return t;
        };
        Tree2.prototype.maxNode = function(t) {
          if (t === void 0) {
            t = this._root;
          }
          if (t)
            while (t.right)
              t = t.right;
          return t;
        };
        Tree2.prototype.at = function(index) {
          var current = this._root;
          var done = false;
          var i = 0;
          var Q = [];
          while (!done) {
            if (current) {
              Q.push(current);
              current = current.left;
            } else {
              if (Q.length > 0) {
                current = Q.pop();
                if (i === index)
                  return current;
                i++;
                current = current.right;
              } else
                done = true;
            }
          }
          return null;
        };
        Tree2.prototype.next = function(d) {
          var root = this._root;
          var successor = null;
          if (d.right) {
            successor = d.right;
            while (successor.left)
              successor = successor.left;
            return successor;
          }
          var comparator = this._comparator;
          while (root) {
            var cmp = comparator(d.key, root.key);
            if (cmp === 0)
              break;
            else if (cmp < 0) {
              successor = root;
              root = root.left;
            } else
              root = root.right;
          }
          return successor;
        };
        Tree2.prototype.prev = function(d) {
          var root = this._root;
          var predecessor = null;
          if (d.left !== null) {
            predecessor = d.left;
            while (predecessor.right)
              predecessor = predecessor.right;
            return predecessor;
          }
          var comparator = this._comparator;
          while (root) {
            var cmp = comparator(d.key, root.key);
            if (cmp === 0)
              break;
            else if (cmp < 0)
              root = root.left;
            else {
              predecessor = root;
              root = root.right;
            }
          }
          return predecessor;
        };
        Tree2.prototype.clear = function() {
          this._root = null;
          this._size = 0;
          return this;
        };
        Tree2.prototype.toList = function() {
          return toList(this._root);
        };
        Tree2.prototype.load = function(keys, values, presort) {
          if (values === void 0) {
            values = [];
          }
          if (presort === void 0) {
            presort = false;
          }
          var size = keys.length;
          var comparator = this._comparator;
          if (presort)
            sort(keys, values, 0, size - 1, comparator);
          if (this._root === null) {
            this._root = loadRecursive(keys, values, 0, size);
            this._size = size;
          } else {
            var mergedList = mergeLists(this.toList(), createList(keys, values), comparator);
            size = this._size + size;
            this._root = sortedListToBST({ head: mergedList }, 0, size);
          }
          return this;
        };
        Tree2.prototype.isEmpty = function() {
          return this._root === null;
        };
        Object.defineProperty(Tree2.prototype, "size", {
          get: function() {
            return this._size;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Tree2.prototype, "root", {
          get: function() {
            return this._root;
          },
          enumerable: true,
          configurable: true
        });
        Tree2.prototype.toString = function(printNode) {
          if (printNode === void 0) {
            printNode = function(n) {
              return String(n.key);
            };
          }
          var out = [];
          printRow(this._root, "", true, function(v) {
            return out.push(v);
          }, printNode);
          return out.join("");
        };
        Tree2.prototype.update = function(key, newKey, newData) {
          var comparator = this._comparator;
          var _a = split(key, this._root, comparator), left = _a.left, right = _a.right;
          if (comparator(key, newKey) < 0) {
            right = insert(newKey, newData, right, comparator);
          } else {
            left = insert(newKey, newData, left, comparator);
          }
          this._root = merge(left, right, comparator);
        };
        Tree2.prototype.split = function(key) {
          return split(key, this._root, this._comparator);
        };
        return Tree2;
      }();
      function loadRecursive(keys, values, start, end) {
        var size = end - start;
        if (size > 0) {
          var middle = start + Math.floor(size / 2);
          var key = keys[middle];
          var data = values[middle];
          var node = new Node(key, data);
          node.left = loadRecursive(keys, values, start, middle);
          node.right = loadRecursive(keys, values, middle + 1, end);
          return node;
        }
        return null;
      }
      function createList(keys, values) {
        var head = new Node(null, null);
        var p = head;
        for (var i = 0; i < keys.length; i++) {
          p = p.next = new Node(keys[i], values[i]);
        }
        p.next = null;
        return head.next;
      }
      function toList(root) {
        var current = root;
        var Q = [];
        var done = false;
        var head = new Node(null, null);
        var p = head;
        while (!done) {
          if (current) {
            Q.push(current);
            current = current.left;
          } else {
            if (Q.length > 0) {
              current = p = p.next = Q.pop();
              current = current.right;
            } else
              done = true;
          }
        }
        p.next = null;
        return head.next;
      }
      function sortedListToBST(list, start, end) {
        var size = end - start;
        if (size > 0) {
          var middle = start + Math.floor(size / 2);
          var left = sortedListToBST(list, start, middle);
          var root = list.head;
          root.left = left;
          list.head = list.head.next;
          root.right = sortedListToBST(list, middle + 1, end);
          return root;
        }
        return null;
      }
      function mergeLists(l1, l2, compare) {
        var head = new Node(null, null);
        var p = head;
        var p1 = l1;
        var p2 = l2;
        while (p1 !== null && p2 !== null) {
          if (compare(p1.key, p2.key) < 0) {
            p.next = p1;
            p1 = p1.next;
          } else {
            p.next = p2;
            p2 = p2.next;
          }
          p = p.next;
        }
        if (p1 !== null) {
          p.next = p1;
        } else if (p2 !== null) {
          p.next = p2;
        }
        return head.next;
      }
      function sort(keys, values, left, right, compare) {
        if (left >= right)
          return;
        var pivot = keys[left + right >> 1];
        var i = left - 1;
        var j = right + 1;
        while (true) {
          do
            i++;
          while (compare(keys[i], pivot) < 0);
          do
            j--;
          while (compare(keys[j], pivot) > 0);
          if (i >= j)
            break;
          var tmp = keys[i];
          keys[i] = keys[j];
          keys[j] = tmp;
          tmp = values[i];
          values[i] = values[j];
          values[j] = tmp;
        }
        sort(keys, values, left, j, compare);
        sort(keys, values, j + 1, right, compare);
      }
      return Tree;
    });
  }
});

// node_modules/polygon-clipping/dist/polygon-clipping.cjs.js
var require_polygon_clipping_cjs = __commonJS({
  "node_modules/polygon-clipping/dist/polygon-clipping.cjs.js"(exports, module2) {
    "use strict";
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var SplayTree = _interopDefault(require_splay());
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    var isInBbox = function isInBbox2(bbox, point) {
      return bbox.ll.x <= point.x && point.x <= bbox.ur.x && bbox.ll.y <= point.y && point.y <= bbox.ur.y;
    };
    var getBboxOverlap = function getBboxOverlap2(b1, b2) {
      if (b2.ur.x < b1.ll.x || b1.ur.x < b2.ll.x || b2.ur.y < b1.ll.y || b1.ur.y < b2.ll.y)
        return null;
      var lowerX = b1.ll.x < b2.ll.x ? b2.ll.x : b1.ll.x;
      var upperX = b1.ur.x < b2.ur.x ? b1.ur.x : b2.ur.x;
      var lowerY = b1.ll.y < b2.ll.y ? b2.ll.y : b1.ll.y;
      var upperY = b1.ur.y < b2.ur.y ? b1.ur.y : b2.ur.y;
      return {
        ll: {
          x: lowerX,
          y: lowerY
        },
        ur: {
          x: upperX,
          y: upperY
        }
      };
    };
    var epsilon = Number.EPSILON;
    if (epsilon === void 0)
      epsilon = Math.pow(2, -52);
    var EPSILON_SQ = epsilon * epsilon;
    var cmp = function cmp2(a, b) {
      if (-epsilon < a && a < epsilon) {
        if (-epsilon < b && b < epsilon) {
          return 0;
        }
      }
      var ab = a - b;
      if (ab * ab < EPSILON_SQ * a * b) {
        return 0;
      }
      return a < b ? -1 : 1;
    };
    var PtRounder = /* @__PURE__ */ function() {
      function PtRounder2() {
        _classCallCheck(this, PtRounder2);
        this.reset();
      }
      _createClass(PtRounder2, [{
        key: "reset",
        value: function reset() {
          this.xRounder = new CoordRounder();
          this.yRounder = new CoordRounder();
        }
      }, {
        key: "round",
        value: function round(x, y) {
          return {
            x: this.xRounder.round(x),
            y: this.yRounder.round(y)
          };
        }
      }]);
      return PtRounder2;
    }();
    var CoordRounder = /* @__PURE__ */ function() {
      function CoordRounder2() {
        _classCallCheck(this, CoordRounder2);
        this.tree = new SplayTree();
        this.round(0);
      }
      _createClass(CoordRounder2, [{
        key: "round",
        value: function round(coord) {
          var node = this.tree.add(coord);
          var prevNode = this.tree.prev(node);
          if (prevNode !== null && cmp(node.key, prevNode.key) === 0) {
            this.tree.remove(coord);
            return prevNode.key;
          }
          var nextNode = this.tree.next(node);
          if (nextNode !== null && cmp(node.key, nextNode.key) === 0) {
            this.tree.remove(coord);
            return nextNode.key;
          }
          return coord;
        }
      }]);
      return CoordRounder2;
    }();
    var rounder = new PtRounder();
    var crossProduct = function crossProduct2(a, b) {
      return a.x * b.y - a.y * b.x;
    };
    var dotProduct = function dotProduct2(a, b) {
      return a.x * b.x + a.y * b.y;
    };
    var compareVectorAngles = function compareVectorAngles2(basePt, endPt1, endPt2) {
      var v1 = {
        x: endPt1.x - basePt.x,
        y: endPt1.y - basePt.y
      };
      var v2 = {
        x: endPt2.x - basePt.x,
        y: endPt2.y - basePt.y
      };
      var kross = crossProduct(v1, v2);
      return cmp(kross, 0);
    };
    var length = function length2(v) {
      return Math.sqrt(dotProduct(v, v));
    };
    var sineOfAngle = function sineOfAngle2(pShared, pBase, pAngle) {
      var vBase = {
        x: pBase.x - pShared.x,
        y: pBase.y - pShared.y
      };
      var vAngle = {
        x: pAngle.x - pShared.x,
        y: pAngle.y - pShared.y
      };
      return crossProduct(vAngle, vBase) / length(vAngle) / length(vBase);
    };
    var cosineOfAngle = function cosineOfAngle2(pShared, pBase, pAngle) {
      var vBase = {
        x: pBase.x - pShared.x,
        y: pBase.y - pShared.y
      };
      var vAngle = {
        x: pAngle.x - pShared.x,
        y: pAngle.y - pShared.y
      };
      return dotProduct(vAngle, vBase) / length(vAngle) / length(vBase);
    };
    var horizontalIntersection = function horizontalIntersection2(pt, v, y) {
      if (v.y === 0)
        return null;
      return {
        x: pt.x + v.x / v.y * (y - pt.y),
        y
      };
    };
    var verticalIntersection = function verticalIntersection2(pt, v, x) {
      if (v.x === 0)
        return null;
      return {
        x,
        y: pt.y + v.y / v.x * (x - pt.x)
      };
    };
    var intersection = function intersection2(pt1, v1, pt2, v2) {
      if (v1.x === 0)
        return verticalIntersection(pt2, v2, pt1.x);
      if (v2.x === 0)
        return verticalIntersection(pt1, v1, pt2.x);
      if (v1.y === 0)
        return horizontalIntersection(pt2, v2, pt1.y);
      if (v2.y === 0)
        return horizontalIntersection(pt1, v1, pt2.y);
      var kross = crossProduct(v1, v2);
      if (kross == 0)
        return null;
      var ve = {
        x: pt2.x - pt1.x,
        y: pt2.y - pt1.y
      };
      var d1 = crossProduct(ve, v1) / kross;
      var d2 = crossProduct(ve, v2) / kross;
      var x1 = pt1.x + d2 * v1.x, x2 = pt2.x + d1 * v2.x;
      var y1 = pt1.y + d2 * v1.y, y2 = pt2.y + d1 * v2.y;
      var x = (x1 + x2) / 2;
      var y = (y1 + y2) / 2;
      return {
        x,
        y
      };
    };
    var SweepEvent = /* @__PURE__ */ function() {
      _createClass(SweepEvent2, null, [{
        key: "compare",
        value: function compare(a, b) {
          var ptCmp = SweepEvent2.comparePoints(a.point, b.point);
          if (ptCmp !== 0)
            return ptCmp;
          if (a.point !== b.point)
            a.link(b);
          if (a.isLeft !== b.isLeft)
            return a.isLeft ? 1 : -1;
          return Segment.compare(a.segment, b.segment);
        }
      }, {
        key: "comparePoints",
        value: function comparePoints(aPt, bPt) {
          if (aPt.x < bPt.x)
            return -1;
          if (aPt.x > bPt.x)
            return 1;
          if (aPt.y < bPt.y)
            return -1;
          if (aPt.y > bPt.y)
            return 1;
          return 0;
        }
      }]);
      function SweepEvent2(point, isLeft) {
        _classCallCheck(this, SweepEvent2);
        if (point.events === void 0)
          point.events = [this];
        else
          point.events.push(this);
        this.point = point;
        this.isLeft = isLeft;
      }
      _createClass(SweepEvent2, [{
        key: "link",
        value: function link(other) {
          if (other.point === this.point) {
            throw new Error("Tried to link already linked events");
          }
          var otherEvents = other.point.events;
          for (var i = 0, iMax = otherEvents.length; i < iMax; i++) {
            var evt = otherEvents[i];
            this.point.events.push(evt);
            evt.point = this.point;
          }
          this.checkForConsuming();
        }
      }, {
        key: "checkForConsuming",
        value: function checkForConsuming() {
          var numEvents = this.point.events.length;
          for (var i = 0; i < numEvents; i++) {
            var evt1 = this.point.events[i];
            if (evt1.segment.consumedBy !== void 0)
              continue;
            for (var j = i + 1; j < numEvents; j++) {
              var evt2 = this.point.events[j];
              if (evt2.consumedBy !== void 0)
                continue;
              if (evt1.otherSE.point.events !== evt2.otherSE.point.events)
                continue;
              evt1.segment.consume(evt2.segment);
            }
          }
        }
      }, {
        key: "getAvailableLinkedEvents",
        value: function getAvailableLinkedEvents() {
          var events = [];
          for (var i = 0, iMax = this.point.events.length; i < iMax; i++) {
            var evt = this.point.events[i];
            if (evt !== this && !evt.segment.ringOut && evt.segment.isInResult()) {
              events.push(evt);
            }
          }
          return events;
        }
      }, {
        key: "getLeftmostComparator",
        value: function getLeftmostComparator(baseEvent) {
          var _this = this;
          var cache = new Map();
          var fillCache = function fillCache2(linkedEvent) {
            var nextEvent = linkedEvent.otherSE;
            cache.set(linkedEvent, {
              sine: sineOfAngle(_this.point, baseEvent.point, nextEvent.point),
              cosine: cosineOfAngle(_this.point, baseEvent.point, nextEvent.point)
            });
          };
          return function(a, b) {
            if (!cache.has(a))
              fillCache(a);
            if (!cache.has(b))
              fillCache(b);
            var _cache$get = cache.get(a), asine = _cache$get.sine, acosine = _cache$get.cosine;
            var _cache$get2 = cache.get(b), bsine = _cache$get2.sine, bcosine = _cache$get2.cosine;
            if (asine >= 0 && bsine >= 0) {
              if (acosine < bcosine)
                return 1;
              if (acosine > bcosine)
                return -1;
              return 0;
            }
            if (asine < 0 && bsine < 0) {
              if (acosine < bcosine)
                return -1;
              if (acosine > bcosine)
                return 1;
              return 0;
            }
            if (bsine < asine)
              return -1;
            if (bsine > asine)
              return 1;
            return 0;
          };
        }
      }]);
      return SweepEvent2;
    }();
    var segmentId = 0;
    var Segment = /* @__PURE__ */ function() {
      _createClass(Segment2, null, [{
        key: "compare",
        value: function compare(a, b) {
          var alx = a.leftSE.point.x;
          var blx = b.leftSE.point.x;
          var arx = a.rightSE.point.x;
          var brx = b.rightSE.point.x;
          if (brx < alx)
            return 1;
          if (arx < blx)
            return -1;
          var aly = a.leftSE.point.y;
          var bly = b.leftSE.point.y;
          var ary = a.rightSE.point.y;
          var bry = b.rightSE.point.y;
          if (alx < blx) {
            if (bly < aly && bly < ary)
              return 1;
            if (bly > aly && bly > ary)
              return -1;
            var aCmpBLeft = a.comparePoint(b.leftSE.point);
            if (aCmpBLeft < 0)
              return 1;
            if (aCmpBLeft > 0)
              return -1;
            var bCmpARight = b.comparePoint(a.rightSE.point);
            if (bCmpARight !== 0)
              return bCmpARight;
            return -1;
          }
          if (alx > blx) {
            if (aly < bly && aly < bry)
              return -1;
            if (aly > bly && aly > bry)
              return 1;
            var bCmpALeft = b.comparePoint(a.leftSE.point);
            if (bCmpALeft !== 0)
              return bCmpALeft;
            var aCmpBRight = a.comparePoint(b.rightSE.point);
            if (aCmpBRight < 0)
              return 1;
            if (aCmpBRight > 0)
              return -1;
            return 1;
          }
          if (aly < bly)
            return -1;
          if (aly > bly)
            return 1;
          if (arx < brx) {
            var _bCmpARight = b.comparePoint(a.rightSE.point);
            if (_bCmpARight !== 0)
              return _bCmpARight;
          }
          if (arx > brx) {
            var _aCmpBRight = a.comparePoint(b.rightSE.point);
            if (_aCmpBRight < 0)
              return 1;
            if (_aCmpBRight > 0)
              return -1;
          }
          if (arx !== brx) {
            var ay = ary - aly;
            var ax = arx - alx;
            var by = bry - bly;
            var bx = brx - blx;
            if (ay > ax && by < bx)
              return 1;
            if (ay < ax && by > bx)
              return -1;
          }
          if (arx > brx)
            return 1;
          if (arx < brx)
            return -1;
          if (ary < bry)
            return -1;
          if (ary > bry)
            return 1;
          if (a.id < b.id)
            return -1;
          if (a.id > b.id)
            return 1;
          return 0;
        }
      }]);
      function Segment2(leftSE, rightSE, rings, windings) {
        _classCallCheck(this, Segment2);
        this.id = ++segmentId;
        this.leftSE = leftSE;
        leftSE.segment = this;
        leftSE.otherSE = rightSE;
        this.rightSE = rightSE;
        rightSE.segment = this;
        rightSE.otherSE = leftSE;
        this.rings = rings;
        this.windings = windings;
      }
      _createClass(Segment2, [{
        key: "replaceRightSE",
        value: function replaceRightSE(newRightSE) {
          this.rightSE = newRightSE;
          this.rightSE.segment = this;
          this.rightSE.otherSE = this.leftSE;
          this.leftSE.otherSE = this.rightSE;
        }
      }, {
        key: "bbox",
        value: function bbox() {
          var y1 = this.leftSE.point.y;
          var y2 = this.rightSE.point.y;
          return {
            ll: {
              x: this.leftSE.point.x,
              y: y1 < y2 ? y1 : y2
            },
            ur: {
              x: this.rightSE.point.x,
              y: y1 > y2 ? y1 : y2
            }
          };
        }
      }, {
        key: "vector",
        value: function vector() {
          return {
            x: this.rightSE.point.x - this.leftSE.point.x,
            y: this.rightSE.point.y - this.leftSE.point.y
          };
        }
      }, {
        key: "isAnEndpoint",
        value: function isAnEndpoint(pt) {
          return pt.x === this.leftSE.point.x && pt.y === this.leftSE.point.y || pt.x === this.rightSE.point.x && pt.y === this.rightSE.point.y;
        }
      }, {
        key: "comparePoint",
        value: function comparePoint(point) {
          if (this.isAnEndpoint(point))
            return 0;
          var lPt = this.leftSE.point;
          var rPt = this.rightSE.point;
          var v = this.vector();
          if (lPt.x === rPt.x) {
            if (point.x === lPt.x)
              return 0;
            return point.x < lPt.x ? 1 : -1;
          }
          var yDist = (point.y - lPt.y) / v.y;
          var xFromYDist = lPt.x + yDist * v.x;
          if (point.x === xFromYDist)
            return 0;
          var xDist = (point.x - lPt.x) / v.x;
          var yFromXDist = lPt.y + xDist * v.y;
          if (point.y === yFromXDist)
            return 0;
          return point.y < yFromXDist ? -1 : 1;
        }
      }, {
        key: "getIntersection",
        value: function getIntersection(other) {
          var tBbox = this.bbox();
          var oBbox = other.bbox();
          var bboxOverlap = getBboxOverlap(tBbox, oBbox);
          if (bboxOverlap === null)
            return null;
          var tlp = this.leftSE.point;
          var trp = this.rightSE.point;
          var olp = other.leftSE.point;
          var orp = other.rightSE.point;
          var touchesOtherLSE = isInBbox(tBbox, olp) && this.comparePoint(olp) === 0;
          var touchesThisLSE = isInBbox(oBbox, tlp) && other.comparePoint(tlp) === 0;
          var touchesOtherRSE = isInBbox(tBbox, orp) && this.comparePoint(orp) === 0;
          var touchesThisRSE = isInBbox(oBbox, trp) && other.comparePoint(trp) === 0;
          if (touchesThisLSE && touchesOtherLSE) {
            if (touchesThisRSE && !touchesOtherRSE)
              return trp;
            if (!touchesThisRSE && touchesOtherRSE)
              return orp;
            return null;
          }
          if (touchesThisLSE) {
            if (touchesOtherRSE) {
              if (tlp.x === orp.x && tlp.y === orp.y)
                return null;
            }
            return tlp;
          }
          if (touchesOtherLSE) {
            if (touchesThisRSE) {
              if (trp.x === olp.x && trp.y === olp.y)
                return null;
            }
            return olp;
          }
          if (touchesThisRSE && touchesOtherRSE)
            return null;
          if (touchesThisRSE)
            return trp;
          if (touchesOtherRSE)
            return orp;
          var pt = intersection(tlp, this.vector(), olp, other.vector());
          if (pt === null)
            return null;
          if (!isInBbox(bboxOverlap, pt))
            return null;
          return rounder.round(pt.x, pt.y);
        }
      }, {
        key: "split",
        value: function split(point) {
          var newEvents = [];
          var alreadyLinked = point.events !== void 0;
          var newLeftSE = new SweepEvent(point, true);
          var newRightSE = new SweepEvent(point, false);
          var oldRightSE = this.rightSE;
          this.replaceRightSE(newRightSE);
          newEvents.push(newRightSE);
          newEvents.push(newLeftSE);
          var newSeg = new Segment2(newLeftSE, oldRightSE, this.rings.slice(), this.windings.slice());
          if (SweepEvent.comparePoints(newSeg.leftSE.point, newSeg.rightSE.point) > 0) {
            newSeg.swapEvents();
          }
          if (SweepEvent.comparePoints(this.leftSE.point, this.rightSE.point) > 0) {
            this.swapEvents();
          }
          if (alreadyLinked) {
            newLeftSE.checkForConsuming();
            newRightSE.checkForConsuming();
          }
          return newEvents;
        }
      }, {
        key: "swapEvents",
        value: function swapEvents() {
          var tmpEvt = this.rightSE;
          this.rightSE = this.leftSE;
          this.leftSE = tmpEvt;
          this.leftSE.isLeft = true;
          this.rightSE.isLeft = false;
          for (var i = 0, iMax = this.windings.length; i < iMax; i++) {
            this.windings[i] *= -1;
          }
        }
      }, {
        key: "consume",
        value: function consume(other) {
          var consumer = this;
          var consumee = other;
          while (consumer.consumedBy) {
            consumer = consumer.consumedBy;
          }
          while (consumee.consumedBy) {
            consumee = consumee.consumedBy;
          }
          var cmp2 = Segment2.compare(consumer, consumee);
          if (cmp2 === 0)
            return;
          if (cmp2 > 0) {
            var tmp = consumer;
            consumer = consumee;
            consumee = tmp;
          }
          if (consumer.prev === consumee) {
            var _tmp = consumer;
            consumer = consumee;
            consumee = _tmp;
          }
          for (var i = 0, iMax = consumee.rings.length; i < iMax; i++) {
            var ring = consumee.rings[i];
            var winding = consumee.windings[i];
            var index2 = consumer.rings.indexOf(ring);
            if (index2 === -1) {
              consumer.rings.push(ring);
              consumer.windings.push(winding);
            } else
              consumer.windings[index2] += winding;
          }
          consumee.rings = null;
          consumee.windings = null;
          consumee.consumedBy = consumer;
          consumee.leftSE.consumedBy = consumer.leftSE;
          consumee.rightSE.consumedBy = consumer.rightSE;
        }
      }, {
        key: "prevInResult",
        value: function prevInResult() {
          if (this._prevInResult !== void 0)
            return this._prevInResult;
          if (!this.prev)
            this._prevInResult = null;
          else if (this.prev.isInResult())
            this._prevInResult = this.prev;
          else
            this._prevInResult = this.prev.prevInResult();
          return this._prevInResult;
        }
      }, {
        key: "beforeState",
        value: function beforeState() {
          if (this._beforeState !== void 0)
            return this._beforeState;
          if (!this.prev)
            this._beforeState = {
              rings: [],
              windings: [],
              multiPolys: []
            };
          else {
            var seg = this.prev.consumedBy || this.prev;
            this._beforeState = seg.afterState();
          }
          return this._beforeState;
        }
      }, {
        key: "afterState",
        value: function afterState() {
          if (this._afterState !== void 0)
            return this._afterState;
          var beforeState = this.beforeState();
          this._afterState = {
            rings: beforeState.rings.slice(0),
            windings: beforeState.windings.slice(0),
            multiPolys: []
          };
          var ringsAfter = this._afterState.rings;
          var windingsAfter = this._afterState.windings;
          var mpsAfter = this._afterState.multiPolys;
          for (var i = 0, iMax = this.rings.length; i < iMax; i++) {
            var ring = this.rings[i];
            var winding = this.windings[i];
            var index2 = ringsAfter.indexOf(ring);
            if (index2 === -1) {
              ringsAfter.push(ring);
              windingsAfter.push(winding);
            } else
              windingsAfter[index2] += winding;
          }
          var polysAfter = [];
          var polysExclude = [];
          for (var _i = 0, _iMax = ringsAfter.length; _i < _iMax; _i++) {
            if (windingsAfter[_i] === 0)
              continue;
            var _ring = ringsAfter[_i];
            var poly = _ring.poly;
            if (polysExclude.indexOf(poly) !== -1)
              continue;
            if (_ring.isExterior)
              polysAfter.push(poly);
            else {
              if (polysExclude.indexOf(poly) === -1)
                polysExclude.push(poly);
              var _index = polysAfter.indexOf(_ring.poly);
              if (_index !== -1)
                polysAfter.splice(_index, 1);
            }
          }
          for (var _i2 = 0, _iMax2 = polysAfter.length; _i2 < _iMax2; _i2++) {
            var mp = polysAfter[_i2].multiPoly;
            if (mpsAfter.indexOf(mp) === -1)
              mpsAfter.push(mp);
          }
          return this._afterState;
        }
      }, {
        key: "isInResult",
        value: function isInResult() {
          if (this.consumedBy)
            return false;
          if (this._isInResult !== void 0)
            return this._isInResult;
          var mpsBefore = this.beforeState().multiPolys;
          var mpsAfter = this.afterState().multiPolys;
          switch (operation.type) {
            case "union": {
              var noBefores = mpsBefore.length === 0;
              var noAfters = mpsAfter.length === 0;
              this._isInResult = noBefores !== noAfters;
              break;
            }
            case "intersection": {
              var least;
              var most;
              if (mpsBefore.length < mpsAfter.length) {
                least = mpsBefore.length;
                most = mpsAfter.length;
              } else {
                least = mpsAfter.length;
                most = mpsBefore.length;
              }
              this._isInResult = most === operation.numMultiPolys && least < most;
              break;
            }
            case "xor": {
              var diff = Math.abs(mpsBefore.length - mpsAfter.length);
              this._isInResult = diff % 2 === 1;
              break;
            }
            case "difference": {
              var isJustSubject = function isJustSubject2(mps) {
                return mps.length === 1 && mps[0].isSubject;
              };
              this._isInResult = isJustSubject(mpsBefore) !== isJustSubject(mpsAfter);
              break;
            }
            default:
              throw new Error("Unrecognized operation type found ".concat(operation.type));
          }
          return this._isInResult;
        }
      }], [{
        key: "fromRing",
        value: function fromRing(pt1, pt2, ring) {
          var leftPt, rightPt, winding;
          var cmpPts = SweepEvent.comparePoints(pt1, pt2);
          if (cmpPts < 0) {
            leftPt = pt1;
            rightPt = pt2;
            winding = 1;
          } else if (cmpPts > 0) {
            leftPt = pt2;
            rightPt = pt1;
            winding = -1;
          } else
            throw new Error("Tried to create degenerate segment at [".concat(pt1.x, ", ").concat(pt1.y, "]"));
          var leftSE = new SweepEvent(leftPt, true);
          var rightSE = new SweepEvent(rightPt, false);
          return new Segment2(leftSE, rightSE, [ring], [winding]);
        }
      }]);
      return Segment2;
    }();
    var RingIn = /* @__PURE__ */ function() {
      function RingIn2(geomRing, poly, isExterior) {
        _classCallCheck(this, RingIn2);
        if (!Array.isArray(geomRing) || geomRing.length === 0) {
          throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        this.poly = poly;
        this.isExterior = isExterior;
        this.segments = [];
        if (typeof geomRing[0][0] !== "number" || typeof geomRing[0][1] !== "number") {
          throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        var firstPoint = rounder.round(geomRing[0][0], geomRing[0][1]);
        this.bbox = {
          ll: {
            x: firstPoint.x,
            y: firstPoint.y
          },
          ur: {
            x: firstPoint.x,
            y: firstPoint.y
          }
        };
        var prevPoint = firstPoint;
        for (var i = 1, iMax = geomRing.length; i < iMax; i++) {
          if (typeof geomRing[i][0] !== "number" || typeof geomRing[i][1] !== "number") {
            throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
          }
          var point = rounder.round(geomRing[i][0], geomRing[i][1]);
          if (point.x === prevPoint.x && point.y === prevPoint.y)
            continue;
          this.segments.push(Segment.fromRing(prevPoint, point, this));
          if (point.x < this.bbox.ll.x)
            this.bbox.ll.x = point.x;
          if (point.y < this.bbox.ll.y)
            this.bbox.ll.y = point.y;
          if (point.x > this.bbox.ur.x)
            this.bbox.ur.x = point.x;
          if (point.y > this.bbox.ur.y)
            this.bbox.ur.y = point.y;
          prevPoint = point;
        }
        if (firstPoint.x !== prevPoint.x || firstPoint.y !== prevPoint.y) {
          this.segments.push(Segment.fromRing(prevPoint, firstPoint, this));
        }
      }
      _createClass(RingIn2, [{
        key: "getSweepEvents",
        value: function getSweepEvents() {
          var sweepEvents = [];
          for (var i = 0, iMax = this.segments.length; i < iMax; i++) {
            var segment = this.segments[i];
            sweepEvents.push(segment.leftSE);
            sweepEvents.push(segment.rightSE);
          }
          return sweepEvents;
        }
      }]);
      return RingIn2;
    }();
    var PolyIn = /* @__PURE__ */ function() {
      function PolyIn2(geomPoly, multiPoly) {
        _classCallCheck(this, PolyIn2);
        if (!Array.isArray(geomPoly)) {
          throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        this.exteriorRing = new RingIn(geomPoly[0], this, true);
        this.bbox = {
          ll: {
            x: this.exteriorRing.bbox.ll.x,
            y: this.exteriorRing.bbox.ll.y
          },
          ur: {
            x: this.exteriorRing.bbox.ur.x,
            y: this.exteriorRing.bbox.ur.y
          }
        };
        this.interiorRings = [];
        for (var i = 1, iMax = geomPoly.length; i < iMax; i++) {
          var ring = new RingIn(geomPoly[i], this, false);
          if (ring.bbox.ll.x < this.bbox.ll.x)
            this.bbox.ll.x = ring.bbox.ll.x;
          if (ring.bbox.ll.y < this.bbox.ll.y)
            this.bbox.ll.y = ring.bbox.ll.y;
          if (ring.bbox.ur.x > this.bbox.ur.x)
            this.bbox.ur.x = ring.bbox.ur.x;
          if (ring.bbox.ur.y > this.bbox.ur.y)
            this.bbox.ur.y = ring.bbox.ur.y;
          this.interiorRings.push(ring);
        }
        this.multiPoly = multiPoly;
      }
      _createClass(PolyIn2, [{
        key: "getSweepEvents",
        value: function getSweepEvents() {
          var sweepEvents = this.exteriorRing.getSweepEvents();
          for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {
            var ringSweepEvents = this.interiorRings[i].getSweepEvents();
            for (var j = 0, jMax = ringSweepEvents.length; j < jMax; j++) {
              sweepEvents.push(ringSweepEvents[j]);
            }
          }
          return sweepEvents;
        }
      }]);
      return PolyIn2;
    }();
    var MultiPolyIn = /* @__PURE__ */ function() {
      function MultiPolyIn2(geom, isSubject) {
        _classCallCheck(this, MultiPolyIn2);
        if (!Array.isArray(geom)) {
          throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        try {
          if (typeof geom[0][0][0] === "number")
            geom = [geom];
        } catch (ex) {
        }
        this.polys = [];
        this.bbox = {
          ll: {
            x: Number.POSITIVE_INFINITY,
            y: Number.POSITIVE_INFINITY
          },
          ur: {
            x: Number.NEGATIVE_INFINITY,
            y: Number.NEGATIVE_INFINITY
          }
        };
        for (var i = 0, iMax = geom.length; i < iMax; i++) {
          var poly = new PolyIn(geom[i], this);
          if (poly.bbox.ll.x < this.bbox.ll.x)
            this.bbox.ll.x = poly.bbox.ll.x;
          if (poly.bbox.ll.y < this.bbox.ll.y)
            this.bbox.ll.y = poly.bbox.ll.y;
          if (poly.bbox.ur.x > this.bbox.ur.x)
            this.bbox.ur.x = poly.bbox.ur.x;
          if (poly.bbox.ur.y > this.bbox.ur.y)
            this.bbox.ur.y = poly.bbox.ur.y;
          this.polys.push(poly);
        }
        this.isSubject = isSubject;
      }
      _createClass(MultiPolyIn2, [{
        key: "getSweepEvents",
        value: function getSweepEvents() {
          var sweepEvents = [];
          for (var i = 0, iMax = this.polys.length; i < iMax; i++) {
            var polySweepEvents = this.polys[i].getSweepEvents();
            for (var j = 0, jMax = polySweepEvents.length; j < jMax; j++) {
              sweepEvents.push(polySweepEvents[j]);
            }
          }
          return sweepEvents;
        }
      }]);
      return MultiPolyIn2;
    }();
    var RingOut = /* @__PURE__ */ function() {
      _createClass(RingOut2, null, [{
        key: "factory",
        value: function factory(allSegments) {
          var ringsOut = [];
          for (var i = 0, iMax = allSegments.length; i < iMax; i++) {
            var segment = allSegments[i];
            if (!segment.isInResult() || segment.ringOut)
              continue;
            var prevEvent = null;
            var event = segment.leftSE;
            var nextEvent = segment.rightSE;
            var events = [event];
            var startingPoint = event.point;
            var intersectionLEs = [];
            while (true) {
              prevEvent = event;
              event = nextEvent;
              events.push(event);
              if (event.point === startingPoint)
                break;
              while (true) {
                var availableLEs = event.getAvailableLinkedEvents();
                if (availableLEs.length === 0) {
                  var firstPt = events[0].point;
                  var lastPt = events[events.length - 1].point;
                  throw new Error("Unable to complete output ring starting at [".concat(firstPt.x, ",") + " ".concat(firstPt.y, "]. Last matching segment found ends at") + " [".concat(lastPt.x, ", ").concat(lastPt.y, "]."));
                }
                if (availableLEs.length === 1) {
                  nextEvent = availableLEs[0].otherSE;
                  break;
                }
                var indexLE = null;
                for (var j = 0, jMax = intersectionLEs.length; j < jMax; j++) {
                  if (intersectionLEs[j].point === event.point) {
                    indexLE = j;
                    break;
                  }
                }
                if (indexLE !== null) {
                  var intersectionLE = intersectionLEs.splice(indexLE)[0];
                  var ringEvents = events.splice(intersectionLE.index);
                  ringEvents.unshift(ringEvents[0].otherSE);
                  ringsOut.push(new RingOut2(ringEvents.reverse()));
                  continue;
                }
                intersectionLEs.push({
                  index: events.length,
                  point: event.point
                });
                var comparator = event.getLeftmostComparator(prevEvent);
                nextEvent = availableLEs.sort(comparator)[0].otherSE;
                break;
              }
            }
            ringsOut.push(new RingOut2(events));
          }
          return ringsOut;
        }
      }]);
      function RingOut2(events) {
        _classCallCheck(this, RingOut2);
        this.events = events;
        for (var i = 0, iMax = events.length; i < iMax; i++) {
          events[i].segment.ringOut = this;
        }
        this.poly = null;
      }
      _createClass(RingOut2, [{
        key: "getGeom",
        value: function getGeom() {
          var prevPt = this.events[0].point;
          var points = [prevPt];
          for (var i = 1, iMax = this.events.length - 1; i < iMax; i++) {
            var _pt = this.events[i].point;
            var _nextPt = this.events[i + 1].point;
            if (compareVectorAngles(_pt, prevPt, _nextPt) === 0)
              continue;
            points.push(_pt);
            prevPt = _pt;
          }
          if (points.length === 1)
            return null;
          var pt = points[0];
          var nextPt = points[1];
          if (compareVectorAngles(pt, prevPt, nextPt) === 0)
            points.shift();
          points.push(points[0]);
          var step = this.isExteriorRing() ? 1 : -1;
          var iStart = this.isExteriorRing() ? 0 : points.length - 1;
          var iEnd = this.isExteriorRing() ? points.length : -1;
          var orderedPoints = [];
          for (var _i = iStart; _i != iEnd; _i += step) {
            orderedPoints.push([points[_i].x, points[_i].y]);
          }
          return orderedPoints;
        }
      }, {
        key: "isExteriorRing",
        value: function isExteriorRing() {
          if (this._isExteriorRing === void 0) {
            var enclosing = this.enclosingRing();
            this._isExteriorRing = enclosing ? !enclosing.isExteriorRing() : true;
          }
          return this._isExteriorRing;
        }
      }, {
        key: "enclosingRing",
        value: function enclosingRing() {
          if (this._enclosingRing === void 0) {
            this._enclosingRing = this._calcEnclosingRing();
          }
          return this._enclosingRing;
        }
      }, {
        key: "_calcEnclosingRing",
        value: function _calcEnclosingRing() {
          var leftMostEvt = this.events[0];
          for (var i = 1, iMax = this.events.length; i < iMax; i++) {
            var evt = this.events[i];
            if (SweepEvent.compare(leftMostEvt, evt) > 0)
              leftMostEvt = evt;
          }
          var prevSeg = leftMostEvt.segment.prevInResult();
          var prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;
          while (true) {
            if (!prevSeg)
              return null;
            if (!prevPrevSeg)
              return prevSeg.ringOut;
            if (prevPrevSeg.ringOut !== prevSeg.ringOut) {
              if (prevPrevSeg.ringOut.enclosingRing() !== prevSeg.ringOut) {
                return prevSeg.ringOut;
              } else
                return prevSeg.ringOut.enclosingRing();
            }
            prevSeg = prevPrevSeg.prevInResult();
            prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;
          }
        }
      }]);
      return RingOut2;
    }();
    var PolyOut = /* @__PURE__ */ function() {
      function PolyOut2(exteriorRing) {
        _classCallCheck(this, PolyOut2);
        this.exteriorRing = exteriorRing;
        exteriorRing.poly = this;
        this.interiorRings = [];
      }
      _createClass(PolyOut2, [{
        key: "addInterior",
        value: function addInterior(ring) {
          this.interiorRings.push(ring);
          ring.poly = this;
        }
      }, {
        key: "getGeom",
        value: function getGeom() {
          var geom = [this.exteriorRing.getGeom()];
          if (geom[0] === null)
            return null;
          for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {
            var ringGeom = this.interiorRings[i].getGeom();
            if (ringGeom === null)
              continue;
            geom.push(ringGeom);
          }
          return geom;
        }
      }]);
      return PolyOut2;
    }();
    var MultiPolyOut = /* @__PURE__ */ function() {
      function MultiPolyOut2(rings) {
        _classCallCheck(this, MultiPolyOut2);
        this.rings = rings;
        this.polys = this._composePolys(rings);
      }
      _createClass(MultiPolyOut2, [{
        key: "getGeom",
        value: function getGeom() {
          var geom = [];
          for (var i = 0, iMax = this.polys.length; i < iMax; i++) {
            var polyGeom = this.polys[i].getGeom();
            if (polyGeom === null)
              continue;
            geom.push(polyGeom);
          }
          return geom;
        }
      }, {
        key: "_composePolys",
        value: function _composePolys(rings) {
          var polys = [];
          for (var i = 0, iMax = rings.length; i < iMax; i++) {
            var ring = rings[i];
            if (ring.poly)
              continue;
            if (ring.isExteriorRing())
              polys.push(new PolyOut(ring));
            else {
              var enclosingRing = ring.enclosingRing();
              if (!enclosingRing.poly)
                polys.push(new PolyOut(enclosingRing));
              enclosingRing.poly.addInterior(ring);
            }
          }
          return polys;
        }
      }]);
      return MultiPolyOut2;
    }();
    var SweepLine = /* @__PURE__ */ function() {
      function SweepLine2(queue) {
        var comparator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Segment.compare;
        _classCallCheck(this, SweepLine2);
        this.queue = queue;
        this.tree = new SplayTree(comparator);
        this.segments = [];
      }
      _createClass(SweepLine2, [{
        key: "process",
        value: function process2(event) {
          var segment = event.segment;
          var newEvents = [];
          if (event.consumedBy) {
            if (event.isLeft)
              this.queue.remove(event.otherSE);
            else
              this.tree.remove(segment);
            return newEvents;
          }
          var node = event.isLeft ? this.tree.insert(segment) : this.tree.find(segment);
          if (!node)
            throw new Error("Unable to find segment #".concat(segment.id, " ") + "[".concat(segment.leftSE.point.x, ", ").concat(segment.leftSE.point.y, "] -> ") + "[".concat(segment.rightSE.point.x, ", ").concat(segment.rightSE.point.y, "] ") + "in SweepLine tree. Please submit a bug report.");
          var prevNode = node;
          var nextNode = node;
          var prevSeg = void 0;
          var nextSeg = void 0;
          while (prevSeg === void 0) {
            prevNode = this.tree.prev(prevNode);
            if (prevNode === null)
              prevSeg = null;
            else if (prevNode.key.consumedBy === void 0)
              prevSeg = prevNode.key;
          }
          while (nextSeg === void 0) {
            nextNode = this.tree.next(nextNode);
            if (nextNode === null)
              nextSeg = null;
            else if (nextNode.key.consumedBy === void 0)
              nextSeg = nextNode.key;
          }
          if (event.isLeft) {
            var prevMySplitter = null;
            if (prevSeg) {
              var prevInter = prevSeg.getIntersection(segment);
              if (prevInter !== null) {
                if (!segment.isAnEndpoint(prevInter))
                  prevMySplitter = prevInter;
                if (!prevSeg.isAnEndpoint(prevInter)) {
                  var newEventsFromSplit = this._splitSafely(prevSeg, prevInter);
                  for (var i = 0, iMax = newEventsFromSplit.length; i < iMax; i++) {
                    newEvents.push(newEventsFromSplit[i]);
                  }
                }
              }
            }
            var nextMySplitter = null;
            if (nextSeg) {
              var nextInter = nextSeg.getIntersection(segment);
              if (nextInter !== null) {
                if (!segment.isAnEndpoint(nextInter))
                  nextMySplitter = nextInter;
                if (!nextSeg.isAnEndpoint(nextInter)) {
                  var _newEventsFromSplit = this._splitSafely(nextSeg, nextInter);
                  for (var _i = 0, _iMax = _newEventsFromSplit.length; _i < _iMax; _i++) {
                    newEvents.push(_newEventsFromSplit[_i]);
                  }
                }
              }
            }
            if (prevMySplitter !== null || nextMySplitter !== null) {
              var mySplitter = null;
              if (prevMySplitter === null)
                mySplitter = nextMySplitter;
              else if (nextMySplitter === null)
                mySplitter = prevMySplitter;
              else {
                var cmpSplitters = SweepEvent.comparePoints(prevMySplitter, nextMySplitter);
                mySplitter = cmpSplitters <= 0 ? prevMySplitter : nextMySplitter;
              }
              this.queue.remove(segment.rightSE);
              newEvents.push(segment.rightSE);
              var _newEventsFromSplit2 = segment.split(mySplitter);
              for (var _i2 = 0, _iMax2 = _newEventsFromSplit2.length; _i2 < _iMax2; _i2++) {
                newEvents.push(_newEventsFromSplit2[_i2]);
              }
            }
            if (newEvents.length > 0) {
              this.tree.remove(segment);
              newEvents.push(event);
            } else {
              this.segments.push(segment);
              segment.prev = prevSeg;
            }
          } else {
            if (prevSeg && nextSeg) {
              var inter = prevSeg.getIntersection(nextSeg);
              if (inter !== null) {
                if (!prevSeg.isAnEndpoint(inter)) {
                  var _newEventsFromSplit3 = this._splitSafely(prevSeg, inter);
                  for (var _i3 = 0, _iMax3 = _newEventsFromSplit3.length; _i3 < _iMax3; _i3++) {
                    newEvents.push(_newEventsFromSplit3[_i3]);
                  }
                }
                if (!nextSeg.isAnEndpoint(inter)) {
                  var _newEventsFromSplit4 = this._splitSafely(nextSeg, inter);
                  for (var _i4 = 0, _iMax4 = _newEventsFromSplit4.length; _i4 < _iMax4; _i4++) {
                    newEvents.push(_newEventsFromSplit4[_i4]);
                  }
                }
              }
            }
            this.tree.remove(segment);
          }
          return newEvents;
        }
      }, {
        key: "_splitSafely",
        value: function _splitSafely(seg, pt) {
          this.tree.remove(seg);
          var rightSE = seg.rightSE;
          this.queue.remove(rightSE);
          var newEvents = seg.split(pt);
          newEvents.push(rightSE);
          if (seg.consumedBy === void 0)
            this.tree.insert(seg);
          return newEvents;
        }
      }]);
      return SweepLine2;
    }();
    var POLYGON_CLIPPING_MAX_QUEUE_SIZE = typeof process !== "undefined" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6;
    var POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS = typeof process !== "undefined" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
    var Operation = /* @__PURE__ */ function() {
      function Operation2() {
        _classCallCheck(this, Operation2);
      }
      _createClass(Operation2, [{
        key: "run",
        value: function run(type, geom, moreGeoms) {
          operation.type = type;
          rounder.reset();
          var multipolys = [new MultiPolyIn(geom, true)];
          for (var i = 0, iMax = moreGeoms.length; i < iMax; i++) {
            multipolys.push(new MultiPolyIn(moreGeoms[i], false));
          }
          operation.numMultiPolys = multipolys.length;
          if (operation.type === "difference") {
            var subject = multipolys[0];
            var _i = 1;
            while (_i < multipolys.length) {
              if (getBboxOverlap(multipolys[_i].bbox, subject.bbox) !== null)
                _i++;
              else
                multipolys.splice(_i, 1);
            }
          }
          if (operation.type === "intersection") {
            for (var _i2 = 0, _iMax = multipolys.length; _i2 < _iMax; _i2++) {
              var mpA = multipolys[_i2];
              for (var j = _i2 + 1, jMax = multipolys.length; j < jMax; j++) {
                if (getBboxOverlap(mpA.bbox, multipolys[j].bbox) === null)
                  return [];
              }
            }
          }
          var queue = new SplayTree(SweepEvent.compare);
          for (var _i3 = 0, _iMax2 = multipolys.length; _i3 < _iMax2; _i3++) {
            var sweepEvents = multipolys[_i3].getSweepEvents();
            for (var _j = 0, _jMax = sweepEvents.length; _j < _jMax; _j++) {
              queue.insert(sweepEvents[_j]);
              if (queue.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
                throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big). Please file a bug report.");
              }
            }
          }
          var sweepLine = new SweepLine(queue);
          var prevQueueSize = queue.size;
          var node = queue.pop();
          while (node) {
            var evt = node.key;
            if (queue.size === prevQueueSize) {
              var seg = evt.segment;
              throw new Error("Unable to pop() ".concat(evt.isLeft ? "left" : "right", " SweepEvent ") + "[".concat(evt.point.x, ", ").concat(evt.point.y, "] from segment #").concat(seg.id, " ") + "[".concat(seg.leftSE.point.x, ", ").concat(seg.leftSE.point.y, "] -> ") + "[".concat(seg.rightSE.point.x, ", ").concat(seg.rightSE.point.y, "] from queue. ") + "Please file a bug report.");
            }
            if (queue.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
              throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big). Please file a bug report.");
            }
            if (sweepLine.segments.length > POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS) {
              throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments). Please file a bug report.");
            }
            var newEvents = sweepLine.process(evt);
            for (var _i4 = 0, _iMax3 = newEvents.length; _i4 < _iMax3; _i4++) {
              var _evt = newEvents[_i4];
              if (_evt.consumedBy === void 0)
                queue.insert(_evt);
            }
            prevQueueSize = queue.size;
            node = queue.pop();
          }
          rounder.reset();
          var ringsOut = RingOut.factory(sweepLine.segments);
          var result = new MultiPolyOut(ringsOut);
          return result.getGeom();
        }
      }]);
      return Operation2;
    }();
    var operation = new Operation();
    var union = function union2(geom) {
      for (var _len = arguments.length, moreGeoms = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        moreGeoms[_key - 1] = arguments[_key];
      }
      return operation.run("union", geom, moreGeoms);
    };
    var intersection$1 = function intersection2(geom) {
      for (var _len2 = arguments.length, moreGeoms = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        moreGeoms[_key2 - 1] = arguments[_key2];
      }
      return operation.run("intersection", geom, moreGeoms);
    };
    var xor = function xor2(geom) {
      for (var _len3 = arguments.length, moreGeoms = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        moreGeoms[_key3 - 1] = arguments[_key3];
      }
      return operation.run("xor", geom, moreGeoms);
    };
    var difference = function difference2(subjectGeom) {
      for (var _len4 = arguments.length, clippingGeoms = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        clippingGeoms[_key4 - 1] = arguments[_key4];
      }
      return operation.run("difference", subjectGeom, clippingGeoms);
    };
    var index = {
      union,
      intersection: intersection$1,
      xor,
      difference
    };
    module2.exports = index;
  }
});

// node_modules/geojson-precision/index.js
var require_geojson_precision = __commonJS({
  "node_modules/geojson-precision/index.js"(exports, module2) {
    (function() {
      function parse(t, coordinatePrecision, extrasPrecision) {
        function point(p) {
          return p.map(function(e, index) {
            if (index < 2) {
              return 1 * e.toFixed(coordinatePrecision);
            } else {
              return 1 * e.toFixed(extrasPrecision);
            }
          });
        }
        function multi(l) {
          return l.map(point);
        }
        function poly(p) {
          return p.map(multi);
        }
        function multiPoly(m) {
          return m.map(poly);
        }
        function geometry(obj) {
          if (!obj) {
            return {};
          }
          switch (obj.type) {
            case "Point":
              obj.coordinates = point(obj.coordinates);
              return obj;
            case "LineString":
            case "MultiPoint":
              obj.coordinates = multi(obj.coordinates);
              return obj;
            case "Polygon":
            case "MultiLineString":
              obj.coordinates = poly(obj.coordinates);
              return obj;
            case "MultiPolygon":
              obj.coordinates = multiPoly(obj.coordinates);
              return obj;
            case "GeometryCollection":
              obj.geometries = obj.geometries.map(geometry);
              return obj;
            default:
              return {};
          }
        }
        function feature2(obj) {
          obj.geometry = geometry(obj.geometry);
          return obj;
        }
        function featureCollection(f) {
          f.features = f.features.map(feature2);
          return f;
        }
        function geometryCollection(g) {
          g.geometries = g.geometries.map(geometry);
          return g;
        }
        if (!t) {
          return t;
        }
        switch (t.type) {
          case "Feature":
            return feature2(t);
          case "GeometryCollection":
            return geometryCollection(t);
          case "FeatureCollection":
            return featureCollection(t);
          case "Point":
          case "LineString":
          case "Polygon":
          case "MultiPoint":
          case "MultiPolygon":
          case "MultiLineString":
            return geometry(t);
          default:
            return t;
        }
      }
      module2.exports = parse;
      module2.exports.parse = parse;
    })();
  }
});

// node_modules/@aitodotai/json-stringify-pretty-compact/index.js
var require_json_stringify_pretty_compact = __commonJS({
  "node_modules/@aitodotai/json-stringify-pretty-compact/index.js"(exports, module2) {
    function isObject(obj) {
      return typeof obj === "object" && obj !== null;
    }
    function forEach(obj, cb) {
      if (Array.isArray(obj)) {
        obj.forEach(cb);
      } else if (isObject(obj)) {
        Object.keys(obj).forEach(function(key) {
          var val = obj[key];
          cb(val, key);
        });
      }
    }
    function getTreeDepth(obj) {
      var depth = 0;
      if (Array.isArray(obj) || isObject(obj)) {
        forEach(obj, function(val) {
          if (Array.isArray(val) || isObject(val)) {
            var tmpDepth = getTreeDepth(val);
            if (tmpDepth > depth) {
              depth = tmpDepth;
            }
          }
        });
        return depth + 1;
      }
      return depth;
    }
    function stringify(obj, options) {
      options = options || {};
      var indent = JSON.stringify([1], null, get(options, "indent", 2)).slice(2, -3);
      var addMargin = get(options, "margins", false);
      var addArrayMargin = get(options, "arrayMargins", false);
      var addObjectMargin = get(options, "objectMargins", false);
      var maxLength = indent === "" ? Infinity : get(options, "maxLength", 80);
      var maxNesting = get(options, "maxNesting", Infinity);
      return function _stringify(obj2, currentIndent, reserved) {
        if (obj2 && typeof obj2.toJSON === "function") {
          obj2 = obj2.toJSON();
        }
        var string = JSON.stringify(obj2);
        if (string === void 0) {
          return string;
        }
        var length = maxLength - currentIndent.length - reserved;
        var treeDepth = getTreeDepth(obj2);
        if (treeDepth <= maxNesting && string.length <= length) {
          var prettified = prettify(string, {
            addMargin,
            addArrayMargin,
            addObjectMargin
          });
          if (prettified.length <= length) {
            return prettified;
          }
        }
        if (isObject(obj2)) {
          var nextIndent = currentIndent + indent;
          var items = [];
          var delimiters;
          var comma = function(array, index2) {
            return index2 === array.length - 1 ? 0 : 1;
          };
          if (Array.isArray(obj2)) {
            for (var index = 0; index < obj2.length; index++) {
              items.push(_stringify(obj2[index], nextIndent, comma(obj2, index)) || "null");
            }
            delimiters = "[]";
          } else {
            Object.keys(obj2).forEach(function(key, index2, array) {
              var keyPart = JSON.stringify(key) + ": ";
              var value = _stringify(obj2[key], nextIndent, keyPart.length + comma(array, index2));
              if (value !== void 0) {
                items.push(keyPart + value);
              }
            });
            delimiters = "{}";
          }
          if (items.length > 0) {
            return [
              delimiters[0],
              indent + items.join(",\n" + nextIndent),
              delimiters[1]
            ].join("\n" + currentIndent);
          }
        }
        return string;
      }(obj, "", 0);
    }
    var stringOrChar = /("(?:[^\\"]|\\.)*")|[:,\][}{]/g;
    function prettify(string, options) {
      options = options || {};
      var tokens = {
        "{": "{",
        "}": "}",
        "[": "[",
        "]": "]",
        ",": ", ",
        ":": ": "
      };
      if (options.addMargin || options.addObjectMargin) {
        tokens["{"] = "{ ";
        tokens["}"] = " }";
      }
      if (options.addMargin || options.addArrayMargin) {
        tokens["["] = "[ ";
        tokens["]"] = " ]";
      }
      return string.replace(stringOrChar, function(match, string2) {
        return string2 ? match : tokens[match];
      });
    }
    function get(options, name, defaultValue) {
      return name in options ? options[name] : defaultValue;
    }
    module2.exports = stringify;
  }
});

// index.mjs
__export(exports, {
  default: () => location_conflation_default
});
var CountryCoder = __toModule(require_country_coder());
var import_geojson_area = __toModule(require_geojson_area());
var import_circle_to_polygon = __toModule(require_circle_to_polygon());
var import_polygon_clipping = __toModule(require_polygon_clipping_cjs());
var import_geojson_precision = __toModule(require_geojson_precision());
var import_json_stringify_pretty_compact = __toModule(require_json_stringify_pretty_compact());
var location_conflation_default = class {
  constructor(fc) {
    this._cache = {};
    this._strict = true;
    if (fc && fc.type === "FeatureCollection" && Array.isArray(fc.features)) {
      fc.features.forEach((feature2) => {
        feature2.properties = feature2.properties || {};
        let props = feature2.properties;
        let id = feature2.id || props.id;
        if (!id || !/^\S+\.geojson$/i.test(id))
          return;
        id = id.toLowerCase();
        feature2.id = id;
        props.id = id;
        if (!props.area) {
          const area = import_geojson_area.default.geometry(feature2.geometry) / 1e6;
          props.area = Number(area.toFixed(2));
        }
        this._cache[id] = feature2;
      });
    }
    let world = _cloneDeep(CountryCoder.feature("Q2"));
    world.geometry = {
      type: "Polygon",
      coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]
    };
    world.id = "Q2";
    world.properties.id = "Q2";
    world.properties.area = import_geojson_area.default.geometry(world.geometry) / 1e6;
    this._cache.Q2 = world;
  }
  validateLocation(location) {
    if (Array.isArray(location) && (location.length === 2 || location.length === 3)) {
      const lon = location[0];
      const lat = location[1];
      const radius = location[2];
      if (Number.isFinite(lon) && lon >= -180 && lon <= 180 && Number.isFinite(lat) && lat >= -90 && lat <= 90 && (location.length === 2 || Number.isFinite(radius) && radius > 0)) {
        const id = "[" + location.toString() + "]";
        return { type: "point", location, id };
      }
    } else if (typeof location === "string" && /^\S+\.geojson$/i.test(location)) {
      const id = location.toLowerCase();
      if (this._cache[id]) {
        return { type: "geojson", location, id };
      }
    } else if (typeof location === "string" || typeof location === "number") {
      const feature2 = CountryCoder.feature(location);
      if (feature2) {
        const id = feature2.properties.wikidata;
        return { type: "countrycoder", location, id };
      }
    }
    if (this._strict) {
      throw new Error(`validateLocation:  Invalid location: "${location}".`);
    } else {
      return null;
    }
  }
  resolveLocation(location) {
    const valid = this.validateLocation(location);
    if (!valid)
      return null;
    const id = valid.id;
    if (this._cache[id]) {
      return Object.assign(valid, { feature: this._cache[id] });
    }
    if (valid.type === "point") {
      const lon = location[0];
      const lat = location[1];
      const radius = location[2] || 25;
      const EDGES = 10;
      const PRECISION = 3;
      const area = Math.PI * radius * radius;
      const feature2 = this._cache[id] = (0, import_geojson_precision.default)({
        type: "Feature",
        id,
        properties: { id, area: Number(area.toFixed(2)) },
        geometry: (0, import_circle_to_polygon.default)([lon, lat], radius * 1e3, EDGES)
      }, PRECISION);
      return Object.assign(valid, { feature: feature2 });
    } else if (valid.type === "geojson") {
    } else if (valid.type === "countrycoder") {
      let feature2 = _cloneDeep(CountryCoder.feature(id));
      let props = feature2.properties;
      if (Array.isArray(props.members)) {
        let aggregate = CountryCoder.aggregateFeature(id);
        aggregate.geometry.coordinates = _clip([aggregate], "UNION").geometry.coordinates;
        feature2.geometry = aggregate.geometry;
      }
      if (!props.area) {
        const area = import_geojson_area.default.geometry(feature2.geometry) / 1e6;
        props.area = Number(area.toFixed(2));
      }
      feature2.id = id;
      props.id = id;
      this._cache[id] = feature2;
      return Object.assign(valid, { feature: feature2 });
    }
    if (this._strict) {
      throw new Error(`resolveLocation:  Couldn't resolve location "${location}".`);
    } else {
      return null;
    }
  }
  validateLocationSet(locationSet) {
    locationSet = locationSet || {};
    const validator = this.validateLocation.bind(this);
    let include = (locationSet.include || []).map(validator).filter(Boolean);
    let exclude = (locationSet.exclude || []).map(validator).filter(Boolean);
    if (!include.length) {
      if (this._strict) {
        throw new Error(`validateLocationSet:  LocationSet includes nothing.`);
      } else {
        locationSet.include = ["Q2"];
        include = [{ type: "countrycoder", location: "Q2", id: "Q2" }];
      }
    }
    include.sort(_sortLocations);
    let id = "+[" + include.map((d) => d.id).join(",") + "]";
    if (exclude.length) {
      exclude.sort(_sortLocations);
      id += "-[" + exclude.map((d) => d.id).join(",") + "]";
    }
    return { type: "locationset", locationSet, id };
  }
  resolveLocationSet(locationSet) {
    locationSet = locationSet || {};
    const valid = this.validateLocationSet(locationSet);
    if (!valid)
      return null;
    const id = valid.id;
    if (this._cache[id]) {
      return Object.assign(valid, { feature: this._cache[id] });
    }
    const resolver = this.resolveLocation.bind(this);
    const includes = (locationSet.include || []).map(resolver).filter(Boolean);
    const excludes = (locationSet.exclude || []).map(resolver).filter(Boolean);
    if (includes.length === 1 && excludes.length === 0) {
      return Object.assign(valid, { feature: includes[0].feature });
    }
    const includeGeoJSON = _clip(includes.map((d) => d.feature), "UNION");
    const excludeGeoJSON = _clip(excludes.map((d) => d.feature), "UNION");
    let resultGeoJSON = excludeGeoJSON ? _clip([includeGeoJSON, excludeGeoJSON], "DIFFERENCE") : includeGeoJSON;
    const area = import_geojson_area.default.geometry(resultGeoJSON.geometry) / 1e6;
    resultGeoJSON.id = id;
    resultGeoJSON.properties = { id, area: Number(area.toFixed(2)) };
    this._cache[id] = resultGeoJSON;
    return Object.assign(valid, { feature: resultGeoJSON });
  }
  strict(val) {
    if (val === void 0) {
      return this._strict;
    } else {
      this._strict = val;
      return this;
    }
  }
  cache() {
    return this._cache;
  }
  stringify(obj, options) {
    return (0, import_json_stringify_pretty_compact.default)(obj, options);
  }
};
function _clip(features, which) {
  if (!Array.isArray(features) || !features.length)
    return null;
  const fn = { UNION: import_polygon_clipping.default.union, DIFFERENCE: import_polygon_clipping.default.difference }[which];
  const args = features.map((feature2) => feature2.geometry.coordinates);
  const coords = fn.apply(null, args);
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: whichType(coords),
      coordinates: coords
    }
  };
  function whichType(coords2) {
    const a = Array.isArray(coords2);
    const b = a && Array.isArray(coords2[0]);
    const c = b && Array.isArray(coords2[0][0]);
    const d = c && Array.isArray(coords2[0][0][0]);
    return d ? "MultiPolygon" : "Polygon";
  }
}
function _cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function _sortLocations(a, b) {
  const rank = { countrycoder: 1, geojson: 2, point: 3 };
  const aRank = rank[a.type];
  const bRank = rank[b.type];
  return aRank > bRank ? 1 : aRank < bRank ? -1 : a.id.localeCompare(b.id);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/**
 * splaytree v3.0.1
 * Fast Splay tree for Node and browser
 *
 * @author Alexander Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */
//# sourceMappingURL=location-conflation.cjs.map