import './ObjectAssign';

export function isFunction(functionToCheck) {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export function validateInRange(value, min, max) {
  let validValue;
  if (max && value > max) {
    validValue = max;
  } else if (min && value < min) {
    validValue = min;
  } else {
    validValue = value;
  }
  return validValue;
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
export function roundedRect({ ctx, x, y, width, height, radius, fill = false, stroke = true }) {
  const radiusObj = {
    tl: 0,
    tr: 0,
    br: 0,
    bl: 0,
  };

  if (typeof radius === 'number') {
    Object.keys(radiusObj).forEach((k) => { radiusObj[k] = radius; });
  } else {
    Object.assign(radiusObj, radius);
  }

  ctx.beginPath();
  ctx.moveTo(x + radiusObj.tl, y);
  ctx.lineTo(x + (width - radiusObj.tr), y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radiusObj.tr);
  ctx.lineTo(x + width, y + (height - radiusObj.br));
  ctx.quadraticCurveTo(x + width, y + height, x + (width - radiusObj.br), y + height);
  ctx.lineTo(x + radiusObj.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + (height - radiusObj.bl));
  ctx.lineTo(x, y + radiusObj.tl);
  ctx.quadraticCurveTo(x, y, x + radiusObj.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
  // console.log(radiusObj);
}
