'use strict';
(function(jtxt, $, undefined ) {

var textHeight = 10,
actualFontSize = 0.12;

jtxt.makeTextSprite = function( message, parameters )
{

	if ( parameters === undefined ) parameters = {};
	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 1;

	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
//	var spriteAlignment = THREE.SpriteAlignment.topLeft;

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var metrics = context.measureText(message);
    var textWidth = metrics.width;
    var fontsize = textHeight;
    	canvas.width = textWidth + borderThickness*2;
        canvas.height = fontsize * 1.4 + borderThickness*2;
        context.font = "normal " + textHeight + "px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
	// background color
	context.fillStyle   = "rgba(0,0,0,1)";
	context.strokeStyle = "rgba(0,0,0,1)";
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
//
	// text color
	context.fillStyle = "rgba(255,255,0,1)";
//	context.fillText( message, borderThickness, fontsize + borderThickness);
    context.fillText(message, textWidth / 2 +1 , 6);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;
	texture.minFilter = texture.magFilter = THREE.LinearFilter;
	var spriteMaterial = new THREE.SpriteMaterial({ map: texture});
//		{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
	var sprite = new THREE.Sprite( spriteMaterial );
//	sprite.scale.set(100,50,1.0);-
    sprite.scale.set(canvas.width, canvas.height, 0.5);
	return sprite;
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();
}

}(window.jtxt = window.jtxt || {}, jQuery ));