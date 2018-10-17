var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/my-command.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/my-command.js":
/*!***************************!*\
  !*** ./src/my-command.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Sketch = __webpack_require__(/*! sketch */ "sketch");

var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui");

var SharedStyle = __webpack_require__(/*! sketch/dom */ "sketch/dom").SharedStyle;

var Text = __webpack_require__(/*! sketch/dom */ "sketch/dom").Text;

var Color = __webpack_require__(/*! sketch/dom */ "sketch/dom").Color;

var textLayers = [];
var shapeLayers = [];
var colors = [];
var noOfStyles = 0;
var sharedStyles;
var sharedStyleNames = [];
var options = {
  leftName: "01 Left",
  rightName: "02 Right",
  centerName: "03 Center"
};
var currentTextLayer = 0;
var currentColorLayer = 0;
var document = Sketch.getSelectedDocument();
var selected = document.selectedLayers.layers;

function hexToRgb(hex) {
  if (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
      a: parseInt(result[4], 16) / 255
    } : null;
  }
} // Create label


function newLabel(text) {
  var frame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var rect = NSMakeRect(0, 0, 240, 20);
  var label = NSTextField.alloc().initWithFrame(rect);
  label.setStringValue(text);
  label.setFont(NSFont.systemFontOfSize(14));
  label.setBezeled(false);
  label.setDrawsBackground(false);
  label.setEditable(false);
  label.setSelectable(false);
  return label;
} // Create text description field


function newDescription(text) {
  var frame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var rect = NSMakeRect(0, 0, 240, 38);
  var label = NSTextField.alloc().initWithFrame(rect);
  label.setStringValue(text);
  label.setFont(NSFont.systemFontOfSize(11));
  label.setTextColor(NSColor.colorWithCalibratedRed_green_blue_alpha(0, 0, 0, 0.5));
  label.setBezeled(false);
  label.setDrawsBackground(false);
  label.setEditable(false);
  label.setSelectable(false);
  return label;
} // Create a text input area


function newInput(text) {
  var frame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var rect = NSMakeRect(0, 0, 240, 24);
  var input = NSTextField.alloc().initWithFrame(rect);
  input.setPlaceholderString(text);
  return input;
} // Function that runs when the user runs the plugin


var onRun = function onRun(context) {
  textLayers = [];
  shapeLayers = [];
  colors = [];
  getLayers();
}; // Get the currently selected layers and push them to the arrays


var getLayers = function getLayers() {
  selected.map(function (obj) {
    if (obj.type == "Text") {
      textLayers.push(obj);
    } else if (obj.type == "ShapePath") {
      shapeLayers.push(obj);
      var color = hexToRgb(obj.style.fills[0].color);
      colors.push({
        name: obj.name,
        rgba: color,
        hex: obj.style.fills[0].color
      });
    }
  });
  alerts();
}; // Show any alerts


var alerts = function alerts() {
  if (textLayers.length == 0) {
    UI.alert("No text layers selected.", "Make sure to select at least one text layer in order to create your text styles.");
    return;
  } else if (colors.length == 0) {
    UI.alert("No colors selected.", "To create multiple colours for your text styles, select any shapes with a fill colour.");
  }

  buildModal();
}; // Build the modal for alignment input


var buildModal = function buildModal() {
  var alert = COSAlertWindow['new']();
  alert.setMessageText("Create Styles");
  var alignmentLabel = newLabel("Set alignment names");
  alert.addAccessoryView(alignmentLabel);
  var leftInput = newInput(options.leftName);
  alert.addAccessoryView(leftInput);
  var rightInput = newInput(options.rightName);
  alert.addAccessoryView(rightInput);
  var centerInput = newInput(options.centerName);
  alert.addAccessoryView(centerInput);
  alert.addButtonWithTitle("OK");
  alert.addButtonWithTitle("Cancel");
  var response = alert.runModal();

  if (response === 1000) {
    handleModal({
      left: leftInput.stringValue(),
      right: rightInput.stringValue(),
      center: centerInput.stringValue()
    });
  }
}; // Handle the input from the modal


var handleModal = function handleModal(response) {
  if (response.left.length() > 0) {
    options.leftName = response.left;
  }

  if (response.right.length() > 0) {
    options.rightName = response.right;
  }

  if (response.center.length() > 0) {
    options.centerName = response.center;
  }

  runScript();
}; // Start to build the styles


var runScript = function runScript() {
  loopText();
}; // Loop through the text layers selected


var loopText = function loopText() {
  if (textLayers[currentTextLayer]) {
    var text = textLayers[currentTextLayer];
    log(text);
    loopColors(text, function () {
      currentTextLayer++;
      loopText();
    });
  } else {
    return;
  }
};

var loopColors = function loopColors(textLayer, callback) {
  if (colors[currentColorLayer]) {
    var color = colors[currentColorLayer];
    addColorToName(textLayer, color, function () {
      currentColorLayer++;
      loopColors(textLayer, callback);
    });
  } else {
    currentColorLayer = 0;

    if (callback) {
      callback();
    }
  }
}; // Add color to the name of the style


var addColorToName = function addColorToName(textLayer, color, callback) {
  var name = textLayer.name;
  var colorName = color.name;

  if (name.includes("{color}")) {
    name = name.replace("{color}", colorName);
  } else {
    name += "/" + colorName;
  }

  name = name.replace(" ", "");
  createTextLayer(textLayer, name, color, callback);
}; // Create a text layer


var createTextLayer = function createTextLayer(textLayer, name, color, callback) {
  var newText = new Text();
  newText.style = textLayer.style;

  if (color) {
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.red = color.rgba.r;
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.green = color.rgba.g;
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.blue = color.rgba.b;
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.alpha = color.rgba.a;
  }

  addAlignments(newText, name, color, callback);
}; // Add left, right, center alignments


var addAlignments = function addAlignments(textObj, name, color, callback) {
  addAlignment(textObj, name, "left", color, function () {
    addAlignment(textObj, name, "right", color, function () {
      addAlignment(textObj, name, "center", color, function () {
        if (callback) {
          callback();
        }
      });
    });
  });
}; // Add specific alignment


var addAlignment = function addAlignment(textObj, name, alignment, color, callback) {
  var alignName;

  if (alignment == "left") {
    textObj.textAlignment = "left";
    alignName = options.leftName;
  } else if (alignment == "right") {
    textObj.textAlignment = "right";
    alignName = options.rightName;
  } else if (alignment == "center") {
    textObj.textAlignment = "center";
    alignName = options.centerName;
  }

  if (name.includes("{align}")) {
    name = name.replace("{align}", alignName);
  } else {
    name += "/" + alignName;
  }

  addStyle(textObj, name, color, callback);
}; // Add the style to the document shared styles


var addStyle = function addStyle(textObj, name, color, callback) {
  var document = Sketch.getSelectedDocument();
  var sharedStyles = document.getSharedTextStyles();
  var existing = sharedStyles.filter(function (style) {
    return style.name == name;
  })[0];

  if (existing) {
    existing.style = textObj.style;
  } else {
    var sharedStyle = new SharedStyle.fromStyle({
      name: name,
      style: textObj.style,
      document: document
    });
  }

  reAddColor(name, color, callback);
};

var reAddColor = function reAddColor(name, color, callback) {
  var document = Sketch.getSelectedDocument();
  var sharedStyles = document.getSharedTextStyles();
  var textStyle = sharedStyles.filter(function (style) {
    return style.name == name;
  })[0];

  if (textStyle) {
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.red = color.rgba.r;
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.green = color.rgba.g;
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.blue = color.rgba.b;
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.alpha = color.rgba.a;
  }

  if (callback) {
    callback();
  }
};

/* harmony default export */ __webpack_exports__["default"] = (onRun);

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=my-command.js.map