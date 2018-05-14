var Sketch = require('sketch/dom')
var UI = require('sketch/ui')
var Style = Sketch.Style
var Text = Sketch.Text

var document = Sketch.getSelectedDocument()
var selected = document.selectedLayers

var textLayers = []
var colours = []

var noOfStyles = 0;

function getDocStyles(context) {
	sharedStyles = context.document.documentData().layerTextStyles()
}

var onRun = function(context) {

	getDocStyles(context)

	selected.map((layer, index) => {
		if (layer.type == "Text") {
			textLayers.push(layer)
		} else if (layer.type == "Shape") {
			var colour = layer.style.fills && layer.style.fills[0] ? layer.style.fills[0].color : null
			if (colour) {
				colours.push(colour)
			}
		}
	})

	// var textStyles = context.document.documentData().layerTextStyles()

	textLayers.map((layer) => {
		var name = layer.name
		var style = layer._object.style()
		var alignment;

		var newText = [[MSTextLayer alloc] initWithFrame: NSMakeRect(0, 0, 250, 50)];
		newText.style = style

		if (layer.alignment == "left") {
			alignment = 0
		} else if (layer.alignment == "right") {
			alignment = 1
		} else if (layer.alignment == "center") {
			alignment = 2
		}

		setStyle(context, newText, name, alignment)

	})
}

function checkStyle(context, name, newStyle) {

	getDocStyles(context)

	var existingTextStyles = sharedStyles.objects()

	if (existingTextStyles.count() != 0) {

		for (var i = 0; i < existingTextStyles.count(); i++) {
			var existingName = existingTextStyles[i].name()
			var existingStyle = existingTextStyles.objectAtIndex(i);

			if (existingName == name) {
				log(name)
				sharedStlyes.updateValueOfSharedObject_byCopyingInstance(existingTextStyles[i], newStyle);
				return;
			}
		}
		sharedStyles.addSharedStyleWithName_firstInstance(name, newStyle);
	} else {
		sharedStyles.addSharedStyleWithName_firstInstance(name, newStyle);
	}
}

function setStyle(context, textObj, name, alignment, colour) {

	getDocStyles(context)

	createStyle(context, name, textObj.style())

	if (alignment !== 0) {
		name = name.replace("Right", "Left")
		name = name.replace("Center", "Left")
		textObj.textAlignment = 0
		createStyle(context, name, textObj.style())
	}
	if (alignment !== 1) {
		name = name.replace("Left", "Right")
		name = name.replace("Center", "Right")
		textObj.textAlignment = 0
		createStyle(context, name, textObj.style())
	}
	if (alignment !== 2) {
		name = name.replace("Right", "Center")
		name = name.replace("Left", "Center")
		textObj.textAlignment = 0
		createStyle(context, name, textObj.style())
	}

}

function createStyle(context, name, newStyle) {

	getDocStyles(context)

	checkStyle(context, name, newStyle)
}





