const utils = function () {
    /**
     * Returns element with given id.
     *
     * @method getDom
     * @param {string|Object} element
     */
    var getDom = function (element) {
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        return (element instanceof HTMLElement || element instanceof SVGElement || element === window) ? element : null;
    };

    /**
     * Retrieves the parent of an element.
     *
     * If lastElement is supplied as a backstop, it will not be returned as
     * the parent if it is reached. The result will be null in this instance.
     *
     * @method getParent
     * @param {string|Object} startElement
     * @param {Function=} condition
     * @param {string|Object=} lastElement
     */
    var updateElement = function (template, model) {
        if (typeof template === "string") {
            var df = document.createDocumentFragment(),
                    child,
                    el;

            el = document.createElement("DIV");
            el.innerHTML = template;
            while (child = el.firstChild) {
                df.appendChild(child);
            }
            template = df;
        }
        if (model.attr) {
            Object.keys(model.attr).forEach(function (key) {
                [].forEach.call(template.querySelectorAll("[" + key + "]"), function (el) {
                    el.setAttribute(key, model.attr[key]);
                });
            });
        }
        if (model.content) {
            Object.keys(model.content).forEach(function (key) {
                [].forEach.call(template.querySelectorAll("[" + key + "]"), function (el) {
                    el.innerHTML = model.content[key];
                });
            });
        }
        return template;
    };

    var getParent = function (startElement, condition, lastElement) {
        startElement = getDom(startElement);

        if (!startElement) {
            return null;
        }

        if (!condition) {
            return startElement.parentNode;
        }

        if (!lastElement || !(lastElement = getDom(lastElement))) {
            lastElement = document.body;
        }

        var result;
        for (result = null; startElement && startElement !== lastElement; startElement = startElement.parentNode) {
            if (condition(startElement)) {
                result = startElement;
                break;
            }
        }
        return result;
    };

    return {
        updateElement: updateElement
    };
}();

