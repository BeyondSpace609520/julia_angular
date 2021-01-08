const containers: any[] = []; // will store container HTMLElement references
const styleElements: any[] = []; // will store {prepend: HTMLElement, append: HTMLElement}

const usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';


export const insertCss = (css: string, options?: any) => {
  options = options || {};

  if (css === undefined) {
    throw new Error(usage);
  }

  const position = options.prepend === true ? 'prepend' : 'append';
  const container = options.container !== undefined ? options.container : document.querySelector('head');
  let containerId = containers.indexOf(container);

  // first time we see this container, create the necessary entries
  if (containerId === -1) {
    containerId = containers.push(container) - 1;
    styleElements[containerId] = {};
  }

  // try to get the correponding container + position styleElement, create it otherwise
  let styleElement;

  if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
    styleElement = styleElements[containerId][position];
  } else {
    styleElement = styleElements[containerId][position] = createStyleElement();

    if (position === 'prepend') {
      container.insertBefore(styleElement, container.childNodes[0]);
    } else {
      container.appendChild(styleElement);
    }
  }

  // strip potential UTF-8 BOM if css was read from a file
  if (css.charCodeAt(0) === 0xFEFF) { css = css.substr(1, css.length); }

  // actually add the stylesheet
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText += css;
  } else {
    styleElement.textContent += css;
  }

  return styleElement;
};

const createStyleElement = () => {
  const styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');
  return styleElement;
};
