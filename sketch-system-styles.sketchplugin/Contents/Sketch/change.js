var Sketch = require('sketch/dom')
var UI = require('sketch/ui')
var Style = Sketch.Style
var Text = Sketch.Text

var document = Sketch.getSelectedDocument()
var selected = document.selectedLayers

var sharedStyles;

// Get the current text styles of the open document
const getDocStyles = (context) => {
	sharedStyles = context.document.documentData().layerTextStyles()
	return sharedStyles
}

// Return only text layers that are selected
const getSelectedTextLayers = () => {

	return selected.map((layer) => {
		if (layer.type == "Text") {
			return layer
		}
	})

}

// Return the colour of a specific text layer
const getTextLayerColor = (layer) => {

	if (layer.type !== "Text") { return null }

	var color = layer._object.style().textStyle().attributes().MSAttributedStringColorAttribute

	return color
}

// Get the styles that need to be changed based on current selection
const getStylesToChange = (name) => {

	let styles = sharedStyles.objects()
	let changeStyles = []

	styles.forEach((style, index) => {
		var includesName = true
		name.map((string) => {
			if (!style.name().includes(string)) {
				includesName = false
			}
		})
		if (includesName) {
			changeStyles.push({
				object: style,
				index: index
			})
		}
	})

	return changeStyles

}

// Change the colour of styles to a specified immutable colour
const mapStylesToColor = (styles, color) => {

	styles.forEach((style, index) => {

		var existing = sharedStyles.objects().objectAtIndex(style.index)
		var newStyle = style.object.style()
		newStyle.textColor = color

		if (sharedStyles.updateValueOfSharedObject_byCopyingInstance) {
			sharedStyles.updateValueOfSharedObject_byCopyingInstance(existing, newStyle)
			sharedStyles.synchroniseInstancesOfSharedObject_withInstance(existing, newStyle)
		} else {
			existing.updateToMatch(newStyle)
			existing.resetReferencingInstances()
		}

		log(existing)

	})

}

const getNameArray = (name) => {

	var alignSplit = [], colorSplit;

	colorSplit = name.split("{color}")
	colorSplit.map((string) => {
		string = string.replace("/", "")
		string = string.replace(" ", "")
		var thisAlignSplit = string.split("{align}")
		thisAlignSplit.map((alignString) => {
			alignString = alignString.replace("/", "")
			alignString = alignString.replace(" ", "")
			alignSplit.push(alignString)
		})
	})

	return alignSplit

}

// Calling the plugin to run
onRun = (context) => {

	getDocStyles(context)

	var textLayersToChange = getSelectedTextLayers()

	textLayersToChange.map((layer) => {
		var color = getTextLayerColor(layer)
		var name = getNameArray(layer.name)
		var changeStyles = getStylesToChange(name)
		mapStylesToColor(changeStyles, color)
	})

}


const newMessage = (context) => {

	
	
}