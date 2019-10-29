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
            className="rc-slider-tooltip-value rc-slider-tooltip-show-value"
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
        // Левый бегунок
        const tooltipMinElBounds = tooltipMinEl.getBoundingClientRect();

        // Левый бегунок - видимое значение
        const tooltipMinShowValueEl = tooltipMinEl.querySelector(
          '.rc-slider-tooltip-show-value'
        );

        const tooltipMinShowValueElBounds = tooltipMinShowValueEl.getBoundingClientRect();

        // Левый бегунок - потенциальное значение
        const tooltipMinHalfWidth = tooltipMinShowValueElBounds.width / 2;

        const tooltipMinHideBounds = {
          left: handleMinCenter - tooltipMinHalfWidth,
          right: handleMinCenter + tooltipMinHalfWidth,
        };

        // Правый бегунок
        const tooltipMaxElBounds = tooltipMaxEl.getBoundingClientRect();

        // Правый бегунок - видимое значение
        const tooltipMaxShowValueEl = tooltipMaxEl.querySelector(
          '.rc-slider-tooltip-show-value'
        );

        const tooltipMaxShowValueElBounds = tooltipMaxShowValueEl.getBoundingClientRect();

        // Правый бегунок - потенциальное значение
        const tooltipMaxHalfWidth = tooltipMaxShowValueElBounds.width / 2;

        const tooltipMaxHideBounds = {
          left: handleMaxCenter - tooltipMaxHalfWidth,
          right: handleMaxCenter + tooltipMaxHalfWidth,
        };

        // Пересечение? Тут наверно нужно оптимизировать условие :)
        const isIntersection =
          space &&
          (tooltipMinHideBounds.right + space >= tooltipMaxHideBounds.left ||
            tooltipMinShowValueElBounds.right + space >=
              tooltipMaxShowValueElBounds.left ||
            tooltipMinShowValueElBounds.right + space >=
              tooltipMaxHideBounds.left ||
            tooltipMinHideBounds.right + space >=
              tooltipMaxShowValueElBounds.left);

        let tooltipMinLeft = 0;
        let tooltipMaxLeft = 0;

        if (!isIntersection) {
          if (rangeBounds.left >= tooltipMinElBounds.left) {
            tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left;
          }

          if (rangeBounds.right <= tooltipMaxElBounds.right) {
            tooltipMaxLeft = -(tooltipMaxHideBounds.right - rangeBounds.right);
          }
        }

        // Логика позиционирования при пересечении
        if (isIntersection) {
          if (rangeBounds.left >= tooltipMinElBounds.left) {
            // У левого края - min
            tooltipMinLeft = rangeBounds.left - tooltipMinHideBounds.left;

            // У левого края - max
            tooltipMaxLeft =
              tooltipMinShowValueElBounds.right +
              space -
              tooltipMaxHideBounds.left;
          }

          // У правого края
          else if (rangeBounds.right <= tooltipMaxElBounds.right) {
            // У правого края - min
            tooltipMinLeft = -(
              tooltipMinHideBounds.right -
              (tooltipMaxShowValueElBounds.left - space)
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
                tooltipMinShowValueElBounds.right -
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
                tooltipMaxShowValueElBounds.left -
                space -
                tooltipMinHideBounds.right;
            }
          }
        }

        // Работа без space
        if (!space) {
          // Левый бегунок у правого края
          if (rangeBounds.right <= tooltipMinElBounds.right) {
            tooltipMinLeft = -(tooltipMinHideBounds.right - rangeBounds.right);
          }

          // Правый бегунок у левого края
          if (rangeBounds.left >= tooltipMaxElBounds.left) {
            tooltipMaxLeft = rangeBounds.left - tooltipMaxHideBounds.left;
          }
        }

        // Сдвигаем левый тултип
        tooltipMinShowValueEl.style = [
          'position: relative',
          `left: ${tooltipMinLeft}px`,
        ].join(';');

        // Сдвигаем правый тутлип
        tooltipMaxShowValueEl.style = [
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
