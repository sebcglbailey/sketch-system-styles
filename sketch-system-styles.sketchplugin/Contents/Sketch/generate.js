var Sketch = require('sketch/dom')
var UI = require('sketch/ui')
var Style = Sketch.Style
var Text = Sketch.Text

var document = Sketch.getSelectedDocument()
var selected = document.selectedLayers

var textLayers = []
var colors = []

var noOfStyles = 0;

function getDocStyles(context) {
	sharedStyles = context.document.documentData().layerTextStyles()
}

function removeCurrentStyles(context) {
	var styles = context.document.documentData().layerTextStyles()
	let noOfStyles = styles.objects().count()
	for (var i = 0; i < noOfStyles; i++) {
		styles.removeSharedStyle(styles.objects()[0])
	}
}

function askStrictSync(context) {
	var options = ['No', 'Yes']
	var selection = UI.getSelectionFromUser(
	  "Strictly sync all selected styles? This will remove any current styles in your document.",
	  options
	)

	var ok = selection[2]
	var strict = selection[1]
	if (ok && strict) {
		removeCurrentStyles(context)
		run(context)
	} else if (ok) {
		run(context)
	}
}

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

	askStrictSync(context)
}

function run(context) {

	for (var i = 0; i < textLayers.length; i++) {

		var name = textLayers[i].name
		var style = textLayers[i]._object.style()
		var alignment;

		var newText = [[MSTextLayer alloc] initWithFrame: NSMakeRect(0, 0, 250, 50)];
		newText.style = style

		setStyle(context, newText, name)

	}
}

function rename(context, textObj, name, color) {

	name = name.replace(" ", "")

	if (color) {
		name = name.replace("{color}", color.name)
		name = name.replace("{colour}", color.name)
	} else {
		name = name.replace("/{color}", "")
		name = name.replace("/{colour}", "")
	}

	if (color) {
		color = color.color
		color = MSColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a)
		textObj.textColor = color
	}

	var leftName = name.replace("{align}", "01 Left")
	textObj.textAlignment = 0
	createStyle(context, leftName, textObj.style())
	var rightName = name.replace("{align}", "02 Right")
	textObj.textAlignment = 1
	createStyle(context, rightName, textObj.style())
	var centerName = name.replace("{align}", "03 Center")
	textObj.textAlignment = 2
	createStyle(context, centerName, textObj.style())

}

function setStyle(context, textObj, name) {

	getDocStyles(context)

	if (colors.length == 0) {
		rename(context, textObj, name)
	} else if (colors.length > 0) {

		for (var i = 0; i < colors.length; i++) {
			rename(context, textObj, name, colors[i])
		}

	}

}

function createStyle(context, name, newStyle) {

	getDocStyles(context)

	checkStyle(context, name, newStyle)
}

function checkStyle(context, name, newStyle) {

	getDocStyles(context)

	var existingTextStyles = sharedStyles ? sharedStyles.objects() : null

	if (existingTextStyles && existingTextStyles.count() != 0) {

		for (var i = 0; i < existingTextStyles.count(); i++) {
			var existingName = existingTextStyles[i].name()
			var existingStyle = existingTextStyles.objectAtIndex(i);

			if (existingName == name) {
				sharedStyles.updateValueOfSharedObject_byCopyingInstance(existingTextStyles[i], newStyle);
				return;
			}
		}
		sharedStyles.addSharedStyleWithName_firstInstance(name, newStyle);
	} else {
		sharedStyles.addSharedStyleWithName_firstInstance(name, newStyle);
	}
}





