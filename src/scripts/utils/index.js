export function isFunction(functionToCheck) {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export function validateInRange(value, min, max) {
  let validValue;
  if (value > max) {
    validValue = max;
  } else if (value < min) {
    validValue = min;
  } else {
    validValue = value;
  }
  return validValue;
}
