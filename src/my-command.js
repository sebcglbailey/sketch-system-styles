var Sketch = require('sketch')
var UI = require('sketch/ui')
var SharedStyle = require('sketch/dom').SharedStyle
var Text = require('sketch/dom').Text
var Color = require('sketch/dom').Color

var textLayers = []
var shapeLayers = []
var colors = []
var noOfStyles = 0;
var sharedStyles;
var sharedStyleNames = [];
var options = {
	leftName: "01 Left",
	rightName: "02 Right",
	centerName: "03 Center"
}

var currentTextLayer = 0
var currentColorLayer = 0

const document = Sketch.getSelectedDocument()
const selected = document.selectedLayers.layers

function hexToRgb(hex) {
	if (hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16)/255,
	        g: parseInt(result[2], 16)/255,
	        b: parseInt(result[3], 16)/255,
	        a: parseInt(result[4], 16)/255
	    } : null;
	}
}

// Create label
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
}

// Create text description field
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
}

// Create a text input area
function newInput(text) {
	var frame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var rect = NSMakeRect(0, 0, 240, 24)

	var input = NSTextField.alloc().initWithFrame(rect)

	input.setPlaceholderString(text)

	return input
}

// Function that runs when the user runs the plugin
var onRun = function(context) {

  textLayers = []
  shapeLayers = []
  colors = []

  getLayers()

}

// Get the currently selected layers and push them to the arrays
const getLayers = function() {
  selected.map((obj) => {
    if (obj.type == "Text") {
      textLayers.push(obj)
    } else if (obj.type == "ShapePath") {
      shapeLayers.push(obj)
      var color = hexToRgb(obj.style.fills[0].color)
      colors.push({
        name: obj.name,
        rgba: color,
        hex: obj.style.fills[0].color
      })
    }
  })
  alerts()
}

// Show any alerts
const alerts = function() {
  if (textLayers.length == 0) {
		UI.alert(
			"No text layers selected.",
			"Make sure to select at least one text layer in order to create your text styles."
		)
		return
	} else if (colors.length == 0) {
		UI.alert(
			"No colors selected.",
			"To create multiple colours for your text styles, select any shapes with a fill colour."
		)
  }
  buildModal()
}

// Build the modal for alignment input
const buildModal = function() {
  var alert = COSAlertWindow['new']();
	alert.setMessageText("Create Styles")

	var alignmentLabel = newLabel("Set alignment names")
	alert.addAccessoryView(alignmentLabel)
	var leftInput = newInput(options.leftName)
	alert.addAccessoryView(leftInput)
	var rightInput = newInput(options.rightName)
	alert.addAccessoryView(rightInput)
	var centerInput = newInput(options.centerName)
	alert.addAccessoryView(centerInput)

	alert.addButtonWithTitle("OK")
	alert.addButtonWithTitle("Cancel")

	var response = alert.runModal()

	if (response === 1000) {
		handleModal({
      left: leftInput.stringValue(),
      right: rightInput.stringValue(),
      center: centerInput.stringValue()
    })
	}
}

// Handle the input from the modal
const handleModal = function(response) {
  if (response.left.length() > 0) {
		options.leftName = response.left
	}
	if (response.right.length() > 0) {
		options.rightName = response.right
	}
	if (response.center.length() > 0) {
		options.centerName = response.center
	}

	runScript()
}

// Start to build the styles
const runScript = function() {
  loopText()
}

// Loop through the text layers selected
const loopText = function() {

  if (textLayers[currentTextLayer]) {
    var text = textLayers[currentTextLayer]
    log(text)
    loopColors(text, () => {
      currentTextLayer++
      loopText()
    })
  } else {
    return
  }

}

const loopColors = function(textLayer, callback) {

  if (colors[currentColorLayer]) {
    var color = colors[currentColorLayer]
    addColorToName(textLayer, color, () => {
      currentColorLayer++
      loopColors(textLayer, callback)
    })
  } else {
    currentColorLayer = 0
    if (callback) {
      callback()
    }
  }

}

// Add color to the name of the style
const addColorToName = function(textLayer, color, callback) {
  var name = textLayer.name
  var colorName = color.name
  if (name.includes("{color}")) {
    name = name.replace("{color}", colorName)
  } else {
    name += "/" + colorName
  }
  name = name.replace(" ", "")
  createTextLayer(textLayer, name, color, callback)
}

// Create a text layer
const createTextLayer = function(textLayer, name, color, callback) {
  var newText = new Text()
  newText.style = textLayer.style
  if (color) {
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.red = color.rgba.r
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.green = color.rgba.g
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.blue = color.rgba.b
    newText._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.alpha = color.rgba.a
  }

  addAlignments(newText, name, color, callback)
}

// Add left, right, center alignments
const addAlignments = function(textObj, name, color, callback) {

  addAlignment(textObj, name, "left", color, () => {
    addAlignment(textObj, name, "right", color, () => {
      addAlignment(textObj, name, "center", color, () => {
        if (callback) {
          callback()
        }
      })
    })
  })

}

// Add specific alignment
const addAlignment = function(textObj, name, alignment, color, callback) {

  var alignName;

  if (alignment == "left") {
    textObj.textAlignment = "left"
    alignName = options.leftName
  } else if (alignment == "right") {
    textObj.textAlignment = "right"
    alignName = options.rightName
  } else if (alignment == "center") {
    textObj.textAlignment = "center"
    alignName = options.centerName
  }

  if (name.includes("{align}")) {
    name = name.replace("{align}", alignName)
  } else {
    name += "/" + alignName
  }

  addStyle(textObj, name, color, callback)

}

// Add the style to the document shared styles
const addStyle = function(textObj, name, color, callback) {

  var document = Sketch.getSelectedDocument()
  var sharedStyles = document.getSharedTextStyles()

  var existing = sharedStyles.filter((style) => {
    return style.name == name
  })[0]

  if (existing) {
    existing.style = textObj.style
  } else {
    var sharedStyle = new SharedStyle.fromStyle({
      name: name,
      style: textObj.style,
      document: document
    })
  }

  reAddColor(name, color, callback)

}

const reAddColor = function(name, color, callback) {  
  
  var document = Sketch.getSelectedDocument()
  var sharedStyles = document.getSharedTextStyles()

  var textStyle = sharedStyles.filter((style) => {
    return style.name == name
  })[0]

  if (textStyle) {
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.red = color.rgba.r
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.green = color.rgba.g
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.blue = color.rgba.b
    textStyle._object.style().primitiveTextStyle().attributes().MSAttributedStringColorAttribute.alpha = color.rgba.a
  }

  if (callback) {
    callback()
  }

}

export default onRun