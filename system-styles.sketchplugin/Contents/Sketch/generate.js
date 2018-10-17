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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/generate.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/generate.js":
/*!*************************!*\
  !*** ./src/generate.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sketch/dom */ "sketch/dom");
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sketch_dom__WEBPACK_IMPORTED_MODULE_1__);


var docs = sketch__WEBPACK_IMPORTED_MODULE_0___default.a.getDocuments();
var doc = docs[0];
var page = doc.pages[0]; // const doc = Sketch.getSelectedDocument()

var layers = doc ? doc.selectedLayers.layers : null;
var textLayers = [];
var shapeLayers = [];
var styleRefs = []; // Function to run on running the plugin

/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  doc = sketch__WEBPACK_IMPORTED_MODULE_0___default.a.fromNative(context.document);

  if (!layers) {
    sketch__WEBPACK_IMPORTED_MODULE_0___default.a.UI.message("Nothing selected 🤦‍♀️");
    return;
  }

  page = doc.pages.filter(function (page) {
    return page.name == "Styles";
  });

  if (page.length == 0) {
    page = new sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.Page({
      parent: doc,
      name: "Styles"
    });
  } else {
    page = page[0];
  }

  layers.forEach(function (layer) {
    if (layer.type == "Text") {
      textLayers.push(layer);
    } else if (layer.type == "ShapePath") {
      shapeLayers.push(layer);
    }
  });
  iterateTextLayers();
}); // Iterate over the selected text layers

var iterateTextLayers = function iterateTextLayers() {
  if (textLayers.length == 0) {
    sketch__WEBPACK_IMPORTED_MODULE_0___default.a.UI.message("Please select at least one text layer 🕵️‍♂️");
    return;
  }

  if (shapeLayers.length == 0) {
    textLayers.forEach(function (layer) {
      addTextLayerWithoutColor(layer);
    });
  } else {
    textLayers.forEach(function (layer) {
      addTextLayerWithColor(layer);
    });
  }

  iterateStyleNames();
}; // Add a style name if there are shape layers selected


var addTextLayerWithColor = function addTextLayerWithColor(textLayer) {
  shapeLayers.forEach(function (shape) {
    iterateAlignments(textLayer, shape);
  });
}; // Add a style name if there are shape layers selected


var addTextLayerWithoutColor = function addTextLayerWithoutColor(textLayer) {
  iterateAlignments(textLayer);
}; // Add alignments to style names


var iterateAlignments = function iterateAlignments(textLayer, shapeLayer) {
  addStyleRefs(textLayer, shapeLayer, "01 Left");
  addStyleRefs(textLayer, shapeLayer, "02 Right");
  addStyleRefs(textLayer, shapeLayer, "03 Center");
}; // Replace strings with alignment and colours, and push to styleNames array


var addStyleRefs = function addStyleRefs(textLayer, shapeLayer, alignment) {
  var name = textLayer.name;
  name = name.includes("{align}") ? name.replace("{align}", alignment) : name + "/" + alignment;
  name = name.includes("{color}") && shapeLayer ? name.replace("{color}", shapeLayer.name) : name.includes("{color}") ? name.replace("{color}", "Default") : shapeLayer ? name + "/" + shapeLayer.name : name;
  styleRefs.push({
    textLayer: textLayer,
    shapeLayer: shapeLayer,
    name: name
  });
}; // Iterate over the style names to start the style creation


var iterateStyleNames = function iterateStyleNames() {
  styleRefs.forEach(function (obj) {
    createStyle(obj.name, obj.textLayer, obj.shapeLayer);
  });
}; // Create the style from the references


var createStyle = function createStyle(name, textRef, shapeRef) {
  var newText = page.layers.filter(function (layer) {
    return layer.name == name;
  })[0];

  if (newText) {
    newText.style = textRef.style;
  } else {
    newText = new sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.Text({
      parent: page,
      text: name,
      name: name,
      style: textRef.style,
      frame: {
        x: 0,
        y: page.layers.length > 0 ? page.layers[page.layers.length - 1].frame.y + page.layers[page.layers.length - 1].frame.height + 20 : 0
      }
    });
  }

  if (name.includes("01 Left")) {
    newText.alignment = "left";
  } else if (name.includes("02 Right")) {
    newText.alignment = "right";
  } else if (name.includes("03 Center")) {
    newText.alignment = "center";
  }

  var color = shapeRef && shapeRef.style.fills[0] ? shapeRef.style.fills[0].color : textRef.style._object.primitiveTextStyle().attributes().MSAttributedStringColorAttribute;
  color = shapeRef ? hexToRgba(color) : MSColorStringToRgba(color);
  var immutableColor = MSImmutableColor.colorWithSVGString_(shapeRef.style.fills[0].color);
  var newColor = MSColor.alloc().initWithImmutableObject_(immutableColor); // let textColor = MSImmutableColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a)
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.red = textColor.red()
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.green = textColor.green()
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.blue = textColor.blue()
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.alpha = textColor.alpha()

  newText.sketchObject.setTextColor(newColor);
  console.log(newColor);
  var existingStyles = doc.getSharedTextStyles();
  var existing = existingStyles.filter(function (style) {
    return style.name == name;
  })[0];

  if (existing) {
    existing.style = newText.style;
  } else {
    existing = sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.SharedStyle.fromStyle({
      name: name,
      style: newText.style,
      document: doc
    });
  }
}; // Convert a hex value to RGBA


var hexToRgba = function hexToRgba(hex) {
  if (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
      a: parseInt(result[4], 16) / 255
    } : null;
  }
}; // Convert a hex value to RGBA


var MSColorStringToRgba = function MSColorStringToRgba(msColor) {
  if (msColor) {
    return {
      r: msColor.red(),
      g: msColor.green(),
      b: msColor.blue(),
      a: msColor.alpha()
    };
  }
};

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

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=generate.js.map