/* eslint-disable */
/**
 * Created by pengYX on 2018/7/19.
 */

export const createTooltip=function(frameDiv) {

    let tooltip = function(frameDiv) {

        let div = document.createElement('DIV');
        div.className = "twipsy right";

        let arrow = document.createElement('DIV');
        arrow.className = "twipsy-arrow";
        div.appendChild(arrow);

        let title = document.createElement('DIV');
        title.className = "twipsy-inner";
        div.appendChild(title);

        this._div = div;
        this._title = title;
        this._arrow=arrow;

        // add to frame div and display coordinates
        frameDiv.appendChild(div);
    };

    tooltip.prototype.setVisible = function(visible) {
        this._div.style.display = visible ? 'block' : 'none';
    };

    tooltip.prototype.showAt = function(position, message) {
        if(position && message) {
            this.setVisible(true);
            this._title.innerHTML = message;
            this._div.style.left = position.x + 10 + "px";
            this._div.style.top = (position.y - this._div.clientHeight / 2) + "px";
        }
    };

    tooltip.prototype.changeWarmStyle=function (isWarm) {
        this._title.className=isWarm?"twipsy-inner-warm":"twipsy-inner";
        this._arrow.className=isWarm?"twipsy-arrow-warm":"twipsy-arrow";
    };

    return new tooltip(frameDiv);
};

export var clone=function(from,to) {
    if (from == null || typeof from != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);

    to = to || new from.constructor();

    for (let name in from) {
        to[name] = typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
    }
    return to;
};

export var fillOptions=function(options, defaultOptions) {
    options = options || {};
    let option;
    for(option in defaultOptions) {
        if(options[option] === undefined) {
            options[option] = clone(defaultOptions[option]);
        }
    }
};
// shallow copy
export var copyOptions=function(options, defaultOptions) {
    let newOptions = clone(options), option;
    for(option in defaultOptions) {
        if(newOptions[option] === undefined) {
            newOptions[option] = clone(defaultOptions[option]);
        }
    }
    return newOptions;
};

export var enhanceWithListeners = function (element) {
    element._listeners = {};
    element.addListener = function (name, callback) {
        this._listeners[name] = (this._listeners[name] || []);
        this._listeners[name].push(callback);
        return this._listeners[name].length;
    };
    element.executeListeners = function (event, defaultCallback) {
        if (this._listeners[event.name] && this._listeners[event.name].length > 0) {
            var index = 0;
            for (; index < this._listeners[event.name].length; index++) {
                this._listeners[event.name][index](event);
            }
        } else {
            if (defaultCallback) {
                defaultCallback(event);
            }
        }
    };
    element.removeListener=function (name) {
      if(this._listeners[name] && this._listeners[name].length > 0){
          this._listeners[name].splice(0,this._listeners[name].length);
       }
    };
};

export var  setListener=function(primitive, type, callback) {
    primitive[type] = callback;
};
