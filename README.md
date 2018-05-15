# Sketch System Styles

A Sketch plugin to automatically generate your Sketch styles for your design system, without the need to define multiple styles with alignment, and colour.

## Installation

Download and install the `sketch-style-libraries.sketchplugin` folder.

Double click, and enjoy.

## Usage

### Description

The plugin works by a selection of template text layers, and shapes with a colour fill.

The styles are copied from the template text layers, copying all of their styles, and generating new styles for different alignment and colours.

If no colours are selected, the styles generated will use the same colour as the selected text layers.

### Running the plugin

* Create a list of text layers that you wish to base your styles off.
* Create a list of shape layers with a solid fill colour to base your differing colours off for you styles.
* Run the plugin (Shortcut: `ctrl cmd t`)

![Font List][images/fonts.png]

### Text Layer Structure

![Text Layers][images/text-layers.png]

You can name your text layers however you want, the plugin will use this name to name the generated styles.

Any `/` will create a new level to the structure of the styles.

Using the keywords `{align}` and `{color}` is a way of overriding the default structure of where the alignment and colour levels are palced within the style name.

If no `{align}` or `{color}` keyword is used, the structure of alignment and colour will be appended to the name of the layer. So a text layer with the name `Jumbo / 01` will become `Jumbo / 01 / 01 Left / Default`.

### Colour Layer Structure

![Colour Layers][images/colour-layers.png]

The colour layers work in much the same way. The name of the layer will be inserted into the text style name as the "colour" of that style. Any `/` will be respected and set levels to the structure of the styles.

Make sure the shapes that you use have one solid fill colour, and this will generate the necessary styles.