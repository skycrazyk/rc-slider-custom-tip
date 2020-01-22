"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

require("core-js/modules/es.array.join");

require("core-js/modules/es.number.constructor");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _trunc = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/math/trunc"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _rcSlider = require("rc-slider");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context6; (0, _forEach.default)(_context6 = ownKeys(Object(source), true)).call(_context6, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context7; (0, _forEach.default)(_context7 = ownKeys(Object(source))).call(_context7, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var RangeCustomTip =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(RangeCustomTip, _Component);

  function RangeCustomTip(props) {
    var _context, _context2, _context3, _context4, _context5;

    var _this;

    (0, _classCallCheck2.default)(this, RangeCustomTip);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RangeCustomTip).call(this, props));
    _this.state = {
      tooltipMinEl: null,
      tooltipMaxEl: null,
      rangeEl: null,
      pushable: null
    };
    _this.rangeRef = null;
    _this.rcSliderTipClass = 'rc-slider-tip';
    _this.customHandle = (0, _bind.default)(_context = _this.customHandle).call(_context, (0, _assertThisInitialized2.default)(_this));
    _this.updateTooltipPosition = (0, _bind.default)(_context2 = _this.updateTooltipPosition).call(_context2, (0, _assertThisInitialized2.default)(_this));
    _this.updatePushable = (0, _bind.default)(_context3 = _this.updatePushable).call(_context3, (0, _assertThisInitialized2.default)(_this));
    _this.onChange = (0, _bind.default)(_context4 = _this.onChange).call(_context4, (0, _assertThisInitialized2.default)(_this));
    _this.setRangeRef = (0, _bind.default)(_context5 = _this.setRangeRef).call(_context5, (0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(RangeCustomTip, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.updatePushable();
      this.updateTooltipPosition();
    }
  }, {
    key: "onChange",
    value: function onChange(value) {
      var onChange = this.props.onChange;
      onChange && onChange(value);
      this.forceUpdate();
    }
  }, {
    key: "setRangeRef",
    value: function setRangeRef(node) {
      var rangeEl = this.state.rangeEl;

      if (!rangeEl) {
        var _node$handlesRefs = node.handlesRefs,
            handlerMin = _node$handlesRefs[0].handle,
            handlerMax = _node$handlesRefs[1].handle;
        var tooltipMinEl = handlerMin.querySelector(".".concat(this.rcSliderTipClass));
        var tooltipMaxEl = handlerMax.querySelector(".".concat(this.rcSliderTipClass));
        this.rangeRef = node; // for possibility getting source Range

        this.setState({
          tooltipMinEl: tooltipMinEl,
          tooltipMaxEl: tooltipMaxEl,
          rangeEl: node
        });
      }
    }
  }, {
    key: "customHandle",
    value: function customHandle(props) {
      var tooltipOverlay = this.props.tooltipOverlay;
      var value = props.value,
          index = props.index;
      var dragging = props.dragging,
          restProps = (0, _objectWithoutProperties2.default)(props, ["dragging"]);
      var overlay = typeof tooltipOverlay === 'function' ? tooltipOverlay(props) : value;
      return _react.default.createElement(_rcSlider.Handle, (0, _extends2.default)({}, restProps, {
        key: index
      }), _react.default.createElement("div", {
        className: "".concat(this.rcSliderTipClass, "-container"),
        style: {
          display: 'flex',
          justifyContent: 'center'
        }
      }, _react.default.createElement("div", {
        className: this.rcSliderTipClass
      }, overlay)));
    }
  }, {
    key: "updatePushable",
    value: function updatePushable() {
      var _this$props = this.props,
          min = _this$props.min,
          max = _this$props.max,
          pushable = _this$props.pushable;
      var _this$state = this.state,
          statePushable = _this$state.pushable,
          rangeEl = _this$state.rangeEl;
      if (!pushable && !statePushable) return;
      var resolvePushable; // Стандартное поведение

      if (typeof pushable === 'number') {
        resolvePushable = pushable;
      } // В процентах или в пикселях
      else if (typeof pushable === 'string') {
          var lastLetter = pushable[pushable.length - 1]; // процентах

          if (lastLetter === '%') {
            resolvePushable = (max - min) / 100 * Number((0, _slice.default)(pushable).call(pushable, 0, pushable.length - 1));
          }

          var lastTwoLetters = (0, _slice.default)(pushable).call(pushable, pushable.length - 2); // в пикселях

          if (lastTwoLetters === 'px' && rangeEl) {
            var rangeBounds = rangeEl.sliderRef.getBoundingClientRect();
            var onePixelConsist = (max - min) / rangeBounds.width;
            var pixels = Number((0, _slice.default)(pushable).call(pushable, 0, pushable.length - 2));
            resolvePushable = pixels * onePixelConsist;
          }
        }

      var isNeedUpdate = (0, _trunc.default)(statePushable) !== (0, _trunc.default)(resolvePushable) && resolvePushable < max - min;

      if (isNeedUpdate) {
        this.setState({
          pushable: resolvePushable
        });
      }
    }
  }, {
    key: "updateTooltipPosition",
    value: function updateTooltipPosition() {
      var _this$props2 = this.props,
          space = _this$props2.space,
          spade = _this$props2.spade;
      var _this$state2 = this.state,
          tooltipMinEl = _this$state2.tooltipMinEl,
          tooltipMaxEl = _this$state2.tooltipMaxEl,
          rangeEl = _this$state2.rangeEl;

      if (rangeEl) {
        var _rangeEl$handlesRefs = rangeEl.handlesRefs,
            handlerMin = _rangeEl$handlesRefs[0].handle,
            handlerMax = _rangeEl$handlesRefs[1].handle; // Левый handler

        var handlerMinBounds = handlerMin.getBoundingClientRect();
        var handlerMinHalf = handlerMinBounds.width / 2;
        var handleMinCenter = handlerMinBounds.left + handlerMinHalf; // Правый handler

        var handlerMaxBounds = handlerMax.getBoundingClientRect();
        var handlerMaxHalf = handlerMaxBounds.width / 2;
        var handleMaxCenter = handlerMaxBounds.left + handlerMaxHalf;

        if (tooltipMinEl && tooltipMaxEl) {
          // Левый бегунок - видимое значение
          var tooltipMinElBounds = tooltipMinEl.getBoundingClientRect(); // Левый бегунок - потенциальное значение

          var tooltipMinHalfWidth = tooltipMinElBounds.width / 2;
          var tooltipMinHideBounds = {
            left: handleMinCenter - tooltipMinHalfWidth,
            right: handleMinCenter + tooltipMinHalfWidth
          }; // Правый бегунок - видимое значение

          var tooltipMaxElBounds = tooltipMaxEl.getBoundingClientRect(); // Правый бегунок - потенциальное значение

          var tooltipMaxHalfWidth = tooltipMaxElBounds.width / 2;
          var tooltipMaxHideBounds = {
            left: handleMaxCenter - tooltipMaxHalfWidth,
            right: handleMaxCenter + tooltipMaxHalfWidth
          }; // Расчитываем rangeBounds

          var sourceRangeBounds = rangeEl.sliderRef.getBoundingClientRect();
          var rangeBounds;

          if (typeof spade === 'number') {
            rangeBounds = {
              left: sourceRangeBounds.left - spade,
              right: sourceRangeBounds.right + spade
            };
          } else if (spade === 'auto') {
            rangeBounds = {
              left: sourceRangeBounds.left - tooltipMinHalfWidth,
              right: sourceRangeBounds.right + tooltipMaxHalfWidth
            };
          } // Пересечение? Тут наверно нужно оптимизировать условие :)


          var isIntersection = space && (tooltipMinHideBounds.right + space >= tooltipMaxHideBounds.left || tooltipMinElBounds.right + space >= tooltipMaxElBounds.left || tooltipMinElBounds.right + space >= tooltipMaxHideBounds.left || tooltipMinHideBounds.right + space >= tooltipMaxElBounds.left);
          var tooltipMinLeft = 0;
          var tooltipMaxLeft = 0; // Логика позиционирования без пересечении

          if (!isIntersection) {
            if (rangeBounds.left >= tooltipMinHideBounds.left) {
              tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left;
            }

            if (rangeBounds.right <= tooltipMaxHideBounds.right) {
              tooltipMaxLeft = -(tooltipMaxHideBounds.right - rangeBounds.right);
            }
          } // Логика позиционирования при пересечении


          if (isIntersection) {
            if (rangeBounds.left >= tooltipMinHideBounds.left) {
              // У левого края - min
              tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left; // У левого края - max

              tooltipMaxLeft = tooltipMinElBounds.right + space - tooltipMaxHideBounds.left;
            } // У правого края
            else if (rangeBounds.right <= tooltipMaxHideBounds.right) {
                // У правого края - min
                tooltipMinLeft = -(tooltipMinHideBounds.right - (tooltipMaxElBounds.left - space)); // У правого края - max

                tooltipMaxLeft = -(tooltipMaxHideBounds.right - rangeBounds.right);
              } // В центре
              else {
                  var diff = tooltipMinHideBounds.right + space - tooltipMaxHideBounds.left;
                  var half = diff / 2;
                  var minFixed = tooltipMinHideBounds.left - half < rangeBounds.left;
                  var maxFixed = tooltipMaxHideBounds.right + half > rangeBounds.right;
                  tooltipMinLeft = -half;
                  tooltipMaxLeft = half; // Ближе к левому краю

                  if (minFixed) {
                    // позиция левого бегунка
                    tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left; // позиция правого бегунка

                    tooltipMaxLeft = tooltipMinElBounds.right - tooltipMaxHideBounds.left + space;
                  } // Ближе к правому краю


                  if (maxFixed) {
                    // позиция правого бегунка
                    tooltipMaxLeft = half - (tooltipMaxHideBounds.right + half - rangeBounds.right); // позиция левого бегунка

                    tooltipMinLeft = tooltipMaxElBounds.left - space - tooltipMinHideBounds.right;
                  }
                }
          } // Работа без space


          if (!space) {
            // Левый бегунок у правого края
            if (rangeBounds.right <= tooltipMinHideBounds.right) {
              tooltipMinLeft = -(tooltipMinHideBounds.right - rangeBounds.right);
            } // Правый бегунок у левого края


            if (rangeBounds.left >= tooltipMaxHideBounds.left) {
              tooltipMaxLeft = rangeBounds.left - tooltipMaxHideBounds.left;
            }
          } // Сдвигаем левый тултип


          tooltipMinEl.style = ['position: relative', "left: ".concat(tooltipMinLeft, "px")].join(';'); // Сдвигаем правый тутлип

          tooltipMaxEl.style = ['position: relative', "left: ".concat(tooltipMaxLeft, "px")].join(';');
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var pushable = this.state.pushable;
      var children = this.props.children;
      return (0, _react.cloneElement)(children, _objectSpread({
        ref: this.setRangeRef,
        handle: this.customHandle,
        onChange: this.onChange
      }, pushable && {
        pushable: pushable
      }));
    }
  }]);
  return RangeCustomTip;
}(_react.Component);

exports.default = RangeCustomTip;
RangeCustomTip.defaultProps = {
  spade: 'auto'
};

//# sourceMappingURL=index.js.map