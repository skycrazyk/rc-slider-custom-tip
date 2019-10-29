import React, { Component, createRef } from 'react';
import { Range as RcRange, Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import nanoid from 'nanoid';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './style';

export default class Range extends Component {
  constructor(props) {
    super(props);

    const { pushablePercent, min, max } = props;

    this.state = {
      tooltipMinEl: null,
      tooltipMaxEl: null,
      pushablePercent: pushablePercent && ((max - min) / 100) * pushablePercent,
    };

    this.rangeEl = createRef();
    this.tooltipIdMin = nanoid();
    this.tooltipIdMax = nanoid();
    this.customHandle = this.customHandle.bind(this);
    this.onPopupAlign = this.onPopupAlign.bind(this);
    this.updateTooltipPosition = this.updateTooltipPosition.bind(this);
    this.updatePushablePixels = this.updatePushablePixels.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate() {
    this.updatePushablePixels();
    this.updateTooltipPosition();
  }

  customHandle(props) {
    const { value, dragging, index, ...restProps } = props;
    const isMin = index === 0;

    return (
      <Tooltip
        id={isMin ? this.tooltipIdMin : this.tooltipIdMax}
        prefixCls="rc-slider-tooltip"
        overlay={
          <div
            className="rc-slider-tooltip-value"
            style={{
              position: 'relative',
              left: 0,
            }}
          >
            {value}
          </div>
        }
        visible={true}
        placement="bottom"
        key={index}
        onPopupAlign={this.onPopupAlign}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  }

  // Получаем доступ к DOM элементам
  onPopupAlign() {
    const { tooltipMinEl, tooltipMaxEl } = this.state;

    if (!tooltipMinEl && !tooltipMaxEl) {
      this.setState({
        tooltipMinEl: document.getElementById(this.tooltipIdMin),
        tooltipMaxEl: document.getElementById(this.tooltipIdMax),
      });
    }
  }

  updatePushablePixels() {
    const { min, max, pushablePixels } = this.props;
    const { pushablePixels: pushablePixelsState } = this.state;

    if (
      this.rangeEl &&
      this.rangeEl.current &&
      pushablePixels &&
      !pushablePixelsState
    ) {
      const rangeBounds = this.rangeEl.current.sliderRef.getBoundingClientRect();
      const onePixelConsist = (max - min) / rangeBounds.width;
      this.setState({ pushablePixels: pushablePixels * onePixelConsist });
    }
  }

  updateTooltipPosition() {
    const { space } = this.props;
    const { tooltipMinEl, tooltipMaxEl } = this.state;

    if (this.rangeEl && this.rangeEl.current) {
      const rangeBounds = this.rangeEl.current.sliderRef.getBoundingClientRect();

      const {
        0: { handle: handlerMin },
        1: { handle: handlerMax },
      } = this.rangeEl.current.handlesRefs;

      const handlerMinBounds = handlerMin.getBoundingClientRect();

      const handleMinCenter =
        handlerMinBounds.left + handlerMinBounds.width / 2;

      const handlerMaxBounds = handlerMax.getBoundingClientRect();

      const handleMaxCenter =
        handlerMaxBounds.left + handlerMaxBounds.width / 2;

      if (tooltipMinEl && tooltipMaxEl) {
        // Левый бегунок - видимое значение
        const tooltipMinValueEl = tooltipMinEl.querySelector(
          '.rc-slider-tooltip-value'
        );

        const tooltipMinValueElBounds = tooltipMinValueEl.getBoundingClientRect();

        // Левый бегунок - потенциальное значение
        const tooltipMinHalfWidth = tooltipMinValueElBounds.width / 2;

        const tooltipMinHideBounds = {
          left: handleMinCenter - tooltipMinHalfWidth,
          right: handleMinCenter + tooltipMinHalfWidth,
        };

        // Правый бегунок - видимое значение
        const tooltipMaxValueEl = tooltipMaxEl.querySelector(
          '.rc-slider-tooltip-value'
        );

        const tooltipMaxValueElBounds = tooltipMaxValueEl.getBoundingClientRect();

        // Правый бегунок - потенциальное значение
        const tooltipMaxHalfWidth = tooltipMaxValueElBounds.width / 2;

        const tooltipMaxHideBounds = {
          left: handleMaxCenter - tooltipMaxHalfWidth,
          right: handleMaxCenter + tooltipMaxHalfWidth,
        };

        // Пересечение? Тут наверно нужно оптимизировать условие :)
        const isIntersection =
          space &&
          (tooltipMinHideBounds.right + space >= tooltipMaxHideBounds.left ||
            tooltipMinValueElBounds.right + space >=
              tooltipMaxValueElBounds.left ||
            tooltipMinValueElBounds.right + space >=
              tooltipMaxHideBounds.left ||
            tooltipMinHideBounds.right + space >=
              tooltipMaxValueElBounds.left);

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
              tooltipMinValueElBounds.right + space - tooltipMaxHideBounds.left;
          }

          // У правого края
          else if (rangeBounds.right <= tooltipMaxHideBounds.right) {
            // У правого края - min
            tooltipMinLeft = -(
              tooltipMinHideBounds.right -
              (tooltipMaxValueElBounds.left - space)
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
                tooltipMinValueElBounds.right -
                tooltipMaxHideBounds.left +
                space;
            }

            // Ближе к правому краю
            if (maxFixed) {
              // позиция правого бегунка
              tooltipMaxLeft =
                half - (tooltipMaxHideBounds.right + half - rangeBounds.right);

              // позиция левого бегунка
              tooltipMinLeft =
                tooltipMaxValueElBounds.left -
                space -
                tooltipMinHideBounds.right;
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
        tooltipMinValueEl.style = [
          'position: relative',
          `left: ${tooltipMinLeft}px`,
        ].join(';');

        // Сдвигаем правый тутлип
        tooltipMaxValueEl.style = [
          'position: relative',
          `left: ${tooltipMaxLeft}px`,
        ].join(';');
      }
    }
  }

  onChange(value) {
    const { onChange } = this.props;
    onChange && onChange(value);
    this.forceUpdate();
  }

  render() {
    const { pushablePercent, pushablePixels } = this.state;

    const pushable = pushablePercent || pushablePixels;

    return (
      <RcRange
        {...this.props}
        ref={this.rangeEl}
        handle={this.customHandle}
        onChange={this.onChange}
        {...(pushable && { pushable })}
      />
    );
  }
}
