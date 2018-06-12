var Sketch = require('sketch/dom')
var UI = require('sketch/ui')
var Style = Sketch.Style
var Text = Sketch.Text

var document = Sketch.getSelectedDocument()
var selected = document.selectedLayers

var textLayers = []
var colors = []

var noOfStyles = 0;
var sharedStyles;
var sharedStyleNames = [];

var options = {
	leftName: "01 Left",
	rightName: "02 Right",
	centerName: "03 Center"
}

// Create a checkbox
function newCheckbox(title, state) {
  var frame = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  state = state == false ? NSOffState : NSOnState;

  var rect = NSMakeRect(0, 0, 240, 24);
  var checkbox = NSButton.alloc().initWithFrame(rect);

  checkbox.setButtonType(NSSwitchButton);
  checkbox.setBezelStyle(0);
  checkbox.setTitle(title);
  checkbox.setState(state);

  return checkbox;
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

// Get the current text styles of the open document
function getDocStyles(context) {
	sharedStyles = context.document.documentData().layerTextStyles()

	if (sharedStyleNames.length == 0) {

		for (var i = 0; i < sharedStyles.objects().length; i++) {

			let style = sharedStyles.objects()[i]
			sharedStyleNames.push(style.name())

		}

	}

	return sharedStyles
}

// Removes all existing styles from the current document
function removeCurrentStyles(context) {
	var styles = context.document.documentData().layerTextStyles()
	let noOfStyles = styles.objects().count()
	for (var i = 0; i < noOfStyles; i++) {
		styles.removeSharedStyle(styles.objects()[0])
	}
}

// Handle alert response
function handleAlert(context, response) {

	if (response.left.length() > 0) {
		options.leftName = response.left
	}
	if (response.right.length() > 0) {
		options.rightName = response.right
	}
	if (response.center.length() > 0) {
		options.centerName = response.center
	}

	if (response.strict) {
		removeCurrentStyles(context)
		run(context)
	} else {
		run(context)
	}

}

// Build the alert to show user
function buildModal(context) {

	var alert = COSAlertWindow['new']();
	alert.setMessageText("Create Styles")

	var deleteStylesCheck = newCheckbox("Delete all existing styles?", false)
	alert.addAccessoryView(deleteStylesCheck)
	var deleteStylesDesc = newDescription("Checking this box will delete all existing styles in your current document")
	alert.addAccessoryView(deleteStylesDesc)

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
		handleAlert(context,
			{
				strict: deleteStylesCheck.state(),
				left: leftInput.stringValue(),
				right: rightInput.stringValue(),
				center: centerInput.stringValue()
			}
		)
	}

}

// Converts a #8 digit hex colour value to RGBA values for sketch
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

// Function that runs upon running the 'generate' plugin
var onRun = function(context) {

	getDocStyles(context)

	selected.map((obj) => {
		if (obj.type == "Text") {
			textLayers.push(obj)
		} else if (obj.type == "Shape") {
			var color = obj.style.fills && obj.style.fills[0] ? obj.style.fills[0].color : null
			color = hexToRgb(color)
			if (color) {
				colors.push({color: color, name: obj.name})
			}
		}
	})

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

	buildModal(context)
}

// Running the function after the user has answered questions
function run(context) {

	// getDocStyles(context)

	for (var i = 0; i < textLayers.length; i++) {

		var name = textLayers[i].name
		var style = textLayers[i]._object.style()

		var newText = [[MSTextLayer alloc] initWithFrame: NSMakeRect(0, 0, 250, 50)];
		newText.style = style

		setStyle(context, newText, name)

	}

}

// Change the name of the style based off existing text layer name
function changeName(name, includes, added) {

	var changed = false

	for (var i = 0; i < includes.length; i++) {
		if (name.includes(includes[i])) {
			name = name.replace(includes[i], added)
			changed = true
		}
	}

	if (!changed) {
		name += ` / ${added}`
	}

	return name
}

// Adds the colour of the style to the text object
function addColor(context, name, newText, color) {

	if (color) {
		name = changeName(name, ["{color}", "{colour}"], color.name)
	} else if (name.includes("{color}") || name.includes("{colour}")) {
		name = changeName(name, ["{color}", "{colour}"], "Default")
	}

	if (color) {
		color = color.color
		color = MSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a)
		newText.textColor = color
	}

	checkStyle(context, name, newText.style())

}

// Renames the textObj layer with the correct alignment value
function rename(context, newText, name, color) {

	name = name.replace(" ", "")

	var leftName = changeName(name, ["{align}", "{alignment}"], options.leftName)
	newText.textAlignment = 0
	addColor(context, leftName, newText, color)
	var rightName = changeName(name, ["{align}", "{alignment}"], options.rightName)
	newText.textAlignment = 1
	addColor(context, rightName, newText, color)
	var centerName = changeName(name, ["{align}", "{alignment}"], options.centerName)
	newText.textAlignment = 2
	addColor(context, centerName, newText, color)

}

// Setting the style of a text object based on its name
function setStyle(context, newText, name) {

	if (colors.length == 0) {
		rename(context, newText, name)
	} else if (colors.length > 0) {

		for (var i = 0; i < colors.length; i++) {
			rename(context, newText, name, colors[i])
		}

	}

}


function addStyle(name, style) {
	if (sharedStyles.addSharedStyleWithName_firstInstance) {
		sharedStyles.addSharedStyleWithName_firstInstance(name, style);
	} else {
		style = MSSharedStyle.alloc().initWithName_firstInstance(name, style)
		sharedStyles.addSharedObject(style)
	}
}

function updateStyle(existing, style) {
	if (sharedStyles.updateValueOfSharedObject_byCopyingInstance) {
		sharedStyles.updateValueOfSharedObject_byCopyingInstance(existing, style)
		sharedStyles.synchroniseInstancesOfSharedObject_withInstance(existing, style)
	} else {
		existing.updateToMatch(style)
		existing.resetReferencingInstances()
	}
}

// Check if the style exists, and update/add new style accordingly
function checkStyle(context, name, newStyle) {

	// getDocStyles(context)

	if (sharedStyles && sharedStyles.objects().length != 0) {

		var existing = false

		sharedStyleNames.forEach((styleName, index) => {
			if (styleName == name) {
				var existingStyle = sharedStyles.objects().objectAtIndex(index)
				updateStyle(existingStyle, newStyle)
				existing = true
				return
			}
		})

		if (!existing) {
			addStyle(name, newStyle)
		}
	} else {
		addStyle(name, newStyle)
	}
}





