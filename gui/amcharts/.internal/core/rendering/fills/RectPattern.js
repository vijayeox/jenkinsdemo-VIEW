/**
 * Rectangular pattern module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern } from "./Pattern";
import { registry } from "../../Registry";
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Rectangular pattern
 */
var RectPattern = /** @class */ (function (_super) {
    tslib_1.__extends(RectPattern, _super);
    /**
     * Constructor
     */
    function RectPattern() {
        var _this = _super.call(this) || this;
        _this.rectHeight = 1;
        _this.rectWidth = 1;
        return _this;
    }
    /**
     * Draws the rectangular element.
     */
    RectPattern.prototype.draw = function () {
        if (this._rect) {
            this.removeElement(this._rect);
        }
        this._rect = this.paper.add("rect");
        this._rect.attr({ "width": this.rectWidth, "height": this.rectHeight });
        this.addElement(this._rect);
        _super.prototype.draw.call(this);
    };
    Object.defineProperty(RectPattern.prototype, "rectWidth", {
        /**
         * @return Width (px)
         */
        get: function () {
            return this.properties["rectWidth"];
        },
        /**
         * Rectangle width in pixels.
         *
         * @param value Width (px)
         */
        set: function (value) {
            this.properties["rectWidth"] = value;
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RectPattern.prototype, "rectHeight", {
        /**
         * @return Height (px)
         */
        get: function () {
            return this.properties["rectHeight"];
        },
        /**
         * Rectangle height in pixels.
         *
         * @param value Height (px)
         */
        set: function (value) {
            this.properties["rectHeight"] = value;
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    return RectPattern;
}(Pattern));
export { RectPattern };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RectPattern"] = RectPattern;
//# sourceMappingURL=RectPattern.js.map