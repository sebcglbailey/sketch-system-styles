import Sketch from 'sketch';

import SketchDOM from 'sketch/dom';
const docs = Sketch.getDocuments()
let doc = docs[0]
let page = doc.pages[0]

// const doc = Sketch.getSelectedDocument()
const layers = doc ? doc.selectedLayers.layers : null

let textLayers = []
let shapeLayers = []
let styleRefs = []

// Function to run on running the plugin
export default (context) => {

  doc = Sketch.fromNative(context.document)

  if (!layers) {
    Sketch.UI.message("Nothing selected 🤦‍♀️")
    return
  }

  page = doc.pages.filter((page) => {
    return page.name == "Styles"
  })
  if (page.length == 0) {
    page = new SketchDOM.Page({
      parent: doc,
      name: "Styles"
    })
  } else {
    page = page[0]
  }

  layers.forEach((layer) => {
    if (layer.type == "Text") {
      textLayers.push(layer)
    } else if (layer.type == "ShapePath") {
      shapeLayers.push(layer)
    }
  })

  iterateTextLayers()
  
}

// Iterate over the selected text layers
const iterateTextLayers = () => {

  if (textLayers.length == 0) {
    Sketch.UI.message("Please select at least one text layer 🕵️‍♂️")
    return
  }

  if (shapeLayers.length == 0) {
    textLayers.forEach((layer) => {
      addTextLayerWithoutColor(layer)
    })
  } else {
    textLayers.forEach((layer) => {
      addTextLayerWithColor(layer)
    })
  }

  iterateStyleNames()

}

// Add a style name if there are shape layers selected
const addTextLayerWithColor = (textLayer) => {
  shapeLayers.forEach((shape) => {
    iterateAlignments(textLayer, shape)
  })
}

// Add a style name if there are shape layers selected
const addTextLayerWithoutColor = (textLayer) => {
  iterateAlignments(textLayer)
}

// Add alignments to style names
const iterateAlignments = (textLayer, shapeLayer) => {
  addStyleRefs(textLayer, shapeLayer, "01 Left")
  addStyleRefs(textLayer, shapeLayer, "02 Right")
  addStyleRefs(textLayer, shapeLayer, "03 Center")
}

// Replace strings with alignment and colours, and push to styleNames array
const addStyleRefs = (textLayer, shapeLayer, alignment) => {
  let name = textLayer.name
  name = name.includes("{align}") ? name.replace("{align}", alignment) : name + "/" + alignment
  name = name.includes("{color}") && shapeLayer ? name.replace("{color}", shapeLayer.name)
          : name.includes("{color}") ? name.replace("{color}", "Default")
          : shapeLayer ? name + "/" + shapeLayer.name
          : name
  styleRefs.push({
    textLayer: textLayer,
    shapeLayer: shapeLayer,
    name: name
  })
}

// Iterate over the style names to start the style creation
const iterateStyleNames = () => {
  styleRefs.forEach((obj) => {
    createStyle(obj.name, obj.textLayer, obj.shapeLayer)
  })
}

// Create the style from the references
const createStyle = (name, textRef, shapeRef) => {
  
  let newText = page.layers.filter((layer) => {
    return layer.name == name
  })[0]

  if (newText) {
    newText.style = textRef.style
  } else {
    newText = new SketchDOM.Text({
      parent: page,
      text: name,
      name: name,
      style: textRef.style,
      frame: {
        x: 0,
        y: page.layers.length > 0 ? page.layers[page.layers.length-1].frame.y + page.layers[page.layers.length-1].frame.height + 20 : 0
      }
    })
  }

  if (name.includes("01 Left")) {
    newText.alignment = "left"
  } else if (name.includes("02 Right")) {
    newText.alignment = "right"
  } else if (name.includes("03 Center")) {
    newText.alignment = "center"
  }

  let color = shapeRef && shapeRef.style.fills[0] ? shapeRef.style.fills[0].color
              : textRef.style._object.primitiveTextStyle().attributes().MSAttributedStringColorAttribute
  
  color = shapeRef ? hexToRgba(color) : MSColorStringToRgba(color)

  let immutableColor = MSImmutableColor.colorWithSVGString_(shapeRef.style.fills[0].color);
  let newColor = MSColor.alloc().initWithImmutableObject_(immutableColor);

  // let textColor = MSImmutableColor.colorWithRed_green_blue_alpha(color.r, color.g, color.b, color.a)
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.red = textColor.red()
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.green = textColor.green()
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.blue = textColor.blue()
  // newText.style._object.textStyle().encodedAttributes().MSAttributedStringColorAttribute.alpha = textColor.alpha()

  newText.sketchObject.setTextColor(newColor)
  console.log(newColor)

  let existingStyles = doc.getSharedTextStyles()
  let existing = existingStyles.filter((style) => {
    return style.name == name
  })[0]

  if (existing) {
    existing.style = newText.style
  } else {
    existing = SketchDOM.SharedStyle.fromStyle({
      name: name,
      style: newText.style,
      document: doc
    })
  }

}

// Convert a hex value to RGBA
const hexToRgba = (hex) => {
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

// Convert a hex value to RGBA
const MSColorStringToRgba = (msColor) => {
	if (msColor) {
	    return {
	        r: msColor.red(),
	        g: msColor.green(),
	        b: msColor.blue(),
	        a: msColor.alpha()
	    }
	}
}