import React, { Component, cloneElement } from 'react';
import { Handle } from 'rc-slider';

export default class RangeCustomTip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipMinEl: null,
      tooltipMaxEl: null,
      rangeEl: null,
      pushable: null,
    };

    this.rcSliderTipClass = 'rc-slider-tip';
    this.customHandle = this.customHandle.bind(this);
    this.updateTooltipPosition = this.updateTooltipPosition.bind(this);
    this.updatePushable = this.updatePushable.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setRangeRef = this.setRangeRef.bind(this);
  }

  componentDidUpdate() {
    this.updatePushable();
    this.updateTooltipPosition();
  }

  onChange(value) {
    const { onChange } = this.props;
    onChange && onChange(value);
    this.forceUpdate();
  }

  setRangeRef(node) {
    const { rangeEl } = this.state;

    if (!rangeEl) {
      const {
        0: { handle: handlerMin },
        1: { handle: handlerMax },
      } = node.handlesRefs;

      const tooltipMinEl = handlerMin.querySelector(
        `.${this.rcSliderTipClass}`
      );

      const tooltipMaxEl = handlerMax.querySelector(
        `.${this.rcSliderTipClass}`
      );

      this.setState({
        tooltipMinEl,
        tooltipMaxEl,
        rangeEl: node,
      });
    }
  }

  customHandle(props) {
    const { tooltipOverlay } = this.props;
    const { value, index } = props;

    const { dragging, ...restProps } = props;

    const overlay =
      typeof tooltipOverlay === 'function' ? tooltipOverlay(props) : value;

    return (
      <Handle {...restProps} key={index}>
        <div
          className={`${this.rcSliderTipClass}-container`}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div className={this.rcSliderTipClass}>{overlay}</div>
        </div>
      </Handle>
    );
  }

  updatePushable() {
    const { min, max, pushable } = this.props;
    const { pushable: statePushable, rangeEl } = this.state;

    if (!pushable && !statePushable) return;

    let resolvePushable;

    // Стандартное поведение
    if (typeof pushable === 'number') {
      resolvePushable = pushable;
    }

    // В процентах или в пикселях
    else if (typeof pushable === 'string') {
      const lastLetter = pushable[pushable.length - 1];

      // процентах
      if (lastLetter === '%') {
        resolvePushable =
          ((max - min) / 100) * Number(pushable.slice(0, pushable.length - 1));
      }

      const lastTwoLetters = pushable.slice(pushable.length - 2);

      // в пикселях
      if (lastTwoLetters === 'px' && rangeEl) {
        const rangeBounds = rangeEl.sliderRef.getBoundingClientRect();
        const onePixelConsist = (max - min) / rangeBounds.width;
        const pixels = Number(pushable.slice(0, pushable.length - 2));
        resolvePushable = pixels * onePixelConsist;
      }
    }

    const isNeedUpdate =
      Math.trunc(statePushable) !== Math.trunc(resolvePushable) &&
      resolvePushable < max - min;

    if (isNeedUpdate) {
      this.setState({ pushable: resolvePushable });
    }
  }

  updateTooltipPosition() {
    const { space, spade } = this.props;
    const { tooltipMinEl, tooltipMaxEl, rangeEl } = this.state;

    if (rangeEl) {
      const {
        0: { handle: handlerMin },
        1: { handle: handlerMax },
      } = rangeEl.handlesRefs;

      // Левый handler
      const handlerMinBounds = handlerMin.getBoundingClientRect();

      const handlerMinHalf = handlerMinBounds.width / 2;

      const handleMinCenter = handlerMinBounds.left + handlerMinHalf;

      // Правый handler
      const handlerMaxBounds = handlerMax.getBoundingClientRect();

      const handlerMaxHalf = handlerMaxBounds.width / 2;

      const handleMaxCenter = handlerMaxBounds.left + handlerMaxHalf;

      if (tooltipMinEl && tooltipMaxEl) {
        // Левый бегунок - видимое значение
        const tooltipMinElBounds = tooltipMinEl.getBoundingClientRect();

        // Левый бегунок - потенциальное значение
        const tooltipMinHalfWidth = tooltipMinElBounds.width / 2;

        const tooltipMinHideBounds = {
          left: handleMinCenter - tooltipMinHalfWidth,
          right: handleMinCenter + tooltipMinHalfWidth,
        };

        // Правый бегунок - видимое значение
        const tooltipMaxElBounds = tooltipMaxEl.getBoundingClientRect();

        // Правый бегунок - потенциальное значение
        const tooltipMaxHalfWidth = tooltipMaxElBounds.width / 2;

        const tooltipMaxHideBounds = {
          left: handleMaxCenter - tooltipMaxHalfWidth,
          right: handleMaxCenter + tooltipMaxHalfWidth,
        };

        // Расчитываем rangeBounds
        const sourceRangeBounds = rangeEl.sliderRef.getBoundingClientRect();

        let rangeBounds;

        if (typeof spade === 'number') {
          rangeBounds = {
            left: sourceRangeBounds.left - spade,
            right: sourceRangeBounds.right + spade,
          };
        } else if (spade === 'auto') {
          rangeBounds = {
            left: sourceRangeBounds.left - tooltipMinHalfWidth,
            right: sourceRangeBounds.right + tooltipMaxHalfWidth,
          };
        }

        // Пересечение? Тут наверно нужно оптимизировать условие :)
        const isIntersection =
          space &&
          (tooltipMinHideBounds.right + space >= tooltipMaxHideBounds.left ||
            tooltipMinElBounds.right + space >= tooltipMaxElBounds.left ||
            tooltipMinElBounds.right + space >= tooltipMaxHideBounds.left ||
            tooltipMinHideBounds.right + space >= tooltipMaxElBounds.left);

        let tooltipMinLeft = 0;
        let tooltipMaxLeft = 0;

        // Логика позиционирования без пересечении
        if (!isIntersection) {
          if (rangeBounds.left >= tooltipMinHideBounds.left) {
            tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left;
          }

          if (rangeBounds.right <= tooltipMaxHideBounds.right) {
            tooltipMaxLeft = -(tooltipMaxHideBounds.right - rangeBounds.right);
          }
        }

        // Логика позиционирования при пересечении
        if (isIntersection) {
          if (rangeBounds.left >= tooltipMinHideBounds.left) {
            // У левого края - min
            tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left;

            // У левого края - max
            tooltipMaxLeft =
              tooltipMinElBounds.right + space - tooltipMaxHideBounds.left;
          }

          // У правого края
          else if (rangeBounds.right <= tooltipMaxHideBounds.right) {
            // У правого края - min
            tooltipMinLeft = -(
              tooltipMinHideBounds.right -
              (tooltipMaxElBounds.left - space)
            );

            // У правого края - max
            tooltipMaxLeft = -(tooltipMaxHideBounds.right - rangeBounds.right);
          }

          // В центре
          else {
            const diff =
              tooltipMinHideBounds.right + space - tooltipMaxHideBounds.left;

            const half = diff / 2;

            const minFixed =
              tooltipMinHideBounds.left - half < rangeBounds.left;

            const maxFixed =
              tooltipMaxHideBounds.right + half > rangeBounds.right;

            tooltipMinLeft = -half;
            tooltipMaxLeft = half;

            // Ближе к левому краю
            if (minFixed) {
              // позиция левого бегунка
              tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left;

              // позиция правого бегунка
              tooltipMaxLeft =
                tooltipMinElBounds.right - tooltipMaxHideBounds.left + space;
            }

            // Ближе к правому краю
            if (maxFixed) {
              // позиция правого бегунка
              tooltipMaxLeft =
                half - (tooltipMaxHideBounds.right + half - rangeBounds.right);

              // позиция левого бегунка
              tooltipMinLeft =
                tooltipMaxElBounds.left - space - tooltipMinHideBounds.right;
            }
          }
        }

        // Работа без space
        if (!space) {
          // Левый бегунок у правого края
          if (rangeBounds.right <= tooltipMinHideBounds.right) {
            tooltipMinLeft = -(tooltipMinHideBounds.right - rangeBounds.right);
          }

          // Правый бегунок у левого края
          if (rangeBounds.left >= tooltipMaxHideBounds.left) {
            tooltipMaxLeft = rangeBounds.left - tooltipMaxHideBounds.left;
          }
        }

        // Сдвигаем левый тултип
        tooltipMinEl.style = [
          'position: relative',
          `left: ${tooltipMinLeft}px`,
        ].join(';');

        // Сдвигаем правый тутлип
        tooltipMaxEl.style = [
          'position: relative',
          `left: ${tooltipMaxLeft}px`,
        ].join(';');
      }
    }
  }

  render() {
    const { pushable } = this.state;
    const { children: Range } = this.props;

    return cloneElement(Range, {
      ref: this.setRangeRef,
      handle: this.customHandle,
      onChange: this.onChange,
      ...(pushable && { pushable }),
    });
  }
}

RangeCustomTip.defaultProps = {
  spade: 'auto',
};
