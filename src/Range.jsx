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

    this.state = {
      tooltipMinEl: null,
      tooltipMaxEl: null,
    };

    this.rangeEl = createRef();
    this.tooltipIdMin = nanoid();
    this.tooltipIdMax = nanoid();
    this.customHandle = this.customHandle.bind(this);
    this.onPopupAlign = this.onPopupAlign.bind(this);
  }

  customHandle(props) {
    const { space } = this.props;
    const { tooltipMinEl, tooltipMaxEl } = this.state;
    const { value, dragging, index, ...restProps } = props;
    const isMin = index === 0;

    if (this.rangeEl && this.rangeEl.current) {
      const rangeBounds = this.rangeEl.current.sliderRef.getBoundingClientRect();

      // Относительно левого края
      if (isMin && tooltipMinEl) {
        const tooltipMinElBounds = tooltipMinEl.getBoundingClientRect();

        const tooltipShowValueEl = tooltipMinEl.querySelector(
          '.rc-slider-tooltip-show-value'
        );

        const tooltipHideValueEl = tooltipMinEl.querySelector(
          '.rc-slider-tooltip-hide-value'
        );

        const tooltipHideValueElBounds = tooltipHideValueEl.getBoundingClientRect();

        if (rangeBounds.left >= tooltipMinElBounds.left) {
          tooltipShowValueEl.style = [
            'position: fixed',
            `top: ${tooltipHideValueElBounds.top}px`,
            `left: ${rangeBounds.left}px`,
          ].join(';');
        } else {
          tooltipShowValueEl.style = [
            `position: absolute`,
            'top: 0',
            'left: 0',
          ].join(';');
        }
      }

      // Относительно правого края
      if (!isMin && tooltipMaxEl) {
        const tooltipMaxElBounds = tooltipMaxEl.getBoundingClientRect();

        const tooltipShowValueEl = tooltipMaxEl.querySelector(
          '.rc-slider-tooltip-show-value'
        );

        const tooltipHideValueEl = tooltipMaxEl.querySelector(
          '.rc-slider-tooltip-hide-value'
        );

        const tooltipHideValueElBounds = tooltipHideValueEl.getBoundingClientRect();

        if (rangeBounds.right <= tooltipMaxElBounds.right) {
          tooltipShowValueEl.style = [
            'position: fixed',
            `top: ${tooltipHideValueElBounds.top}px`,
            `left: ${rangeBounds.right - tooltipHideValueElBounds.width}px`,
          ].join(';');
        } else {
          tooltipShowValueEl.style = [
            `position: absolute`,
            'top: 0',
            'right: 0',
          ].join(';');
        }
      }

      // Между собой
      if (tooltipMinEl && tooltipMaxEl) {
        // Левый бегунок
        const tooltipMinElBounds = tooltipMinEl.getBoundingClientRect();

        // Левый бегунок - скрытое значение
        const tooltipMinHideValueEl = tooltipMinEl.querySelector(
          '.rc-slider-tooltip-hide-value'
        );

        const tooltipMinHideValueElBounds = tooltipMinHideValueEl.getBoundingClientRect();

        // Левый бегунок - видимое значение
        const tooltipMinShowValueEl = tooltipMinEl.querySelector(
          '.rc-slider-tooltip-show-value'
        );

        const tooltipMinShowValueElBounds = tooltipMinShowValueEl.getBoundingClientRect();

        // Правый бегунок
        const tooltipMaxElBounds = tooltipMaxEl.getBoundingClientRect();

        // Правый бегунок - скрытое значение
        const tooltipMaxHideValueEl = tooltipMaxEl.querySelector(
          '.rc-slider-tooltip-hide-value'
        );

        const tooltipMaxHideValueElBounds = tooltipMaxHideValueEl.getBoundingClientRect();

        // Правый бегунок - видимое значение
        const tooltipMaxShowValueEl = tooltipMaxEl.querySelector(
          '.rc-slider-tooltip-show-value'
        );

        const tooltipMaxShowValueElBounds = tooltipMaxShowValueEl.getBoundingClientRect();

        // Логика позиционирования
        if (
          tooltipMinShowValueElBounds.right + space >=
          tooltipMaxShowValueElBounds.left
        ) {
          // У левого края
          if (rangeBounds.left >= tooltipMinElBounds.left) {
            tooltipMaxShowValueEl.style = [
              'position: fixed',
              `top: ${tooltipMaxHideValueElBounds.top}px`,
              `left: ${tooltipMinShowValueElBounds.right + space}px`,
            ].join(';');
          }

          // У правого края
          else if (rangeBounds.right <= tooltipMaxElBounds.right) {
            tooltipMinShowValueEl.style = [
              'position: fixed',
              `top: ${tooltipMinHideValueElBounds.top}px`,
              `left: ${tooltipMaxShowValueElBounds.left -
                tooltipMinShowValueElBounds.width -
                space}px`,
            ].join(';');
          }

          // В центре
          else {
            const diff =
              tooltipMinHideValueElBounds.right +
              space -
              tooltipMaxHideValueElBounds.left;

            const half = diff / 2;

            const minFixed =
              tooltipMinHideValueElBounds.left - half < rangeBounds.left;

            const maxFixed =
              tooltipMaxHideValueElBounds.right + half > rangeBounds.right;

            let tooltipMinLeft = tooltipMinHideValueElBounds.left - half;
            let tooltipMaxLeft = tooltipMaxHideValueElBounds.left + half;

            // Ближе к левому краю
            if (minFixed) {
              // позиция левого бегунка
              tooltipMinLeft = Math.max(
                tooltipMinHideValueElBounds.left - half,
                rangeBounds.left
              );

              // позиция правого бегунка
              tooltipMaxLeft = Math.max(
                tooltipMaxHideValueElBounds.left + half,
                tooltipMinShowValueElBounds.right + space
              );
            }

            // Ближе к правому краю
            if (maxFixed) {
              // позиция левого бегунка
              tooltipMinLeft = Math.min(
                tooltipMinHideValueElBounds.left - half,
                rangeBounds.right -
                  tooltipMinHideValueElBounds.width -
                  tooltipMaxHideValueElBounds.width -
                  space
              );

              // позиция правого бегунка
              tooltipMaxLeft = Math.min(
                tooltipMaxHideValueElBounds.left + half,
                rangeBounds.right - tooltipMinHideValueElBounds.width
              );
            }

            // Сдвигаем левый тултип
            tooltipMinShowValueEl.style = [
              'position: fixed',
              `top: ${tooltipMinHideValueElBounds.top}px`,
              `left: ${tooltipMinLeft}px`,
            ].join(';');

            // Сдвигаем правый тутлип
            tooltipMaxShowValueEl.style = [
              'position: fixed',
              `top: ${tooltipMaxHideValueElBounds.top}px`,
              `left: ${tooltipMaxLeft}px`,
            ].join(';');
          }
        }
      }
    }

    return (
      <Tooltip
        id={isMin ? this.tooltipIdMin : this.tooltipIdMax}
        prefixCls="rc-slider-tooltip"
        overlay={
          <>
            <div
              className="rc-slider-tooltip-value rc-slider-tooltip-hide-value"
              style={{ visibility: 'hidden' }}
            >
              {value}
            </div>
            <div
              className="rc-slider-tooltip-value rc-slider-tooltip-show-value"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {value}
            </div>
          </>
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

  render() {
    return (
      <div className="container">
        <RcRange
          {...this.props}
          ref={this.rangeEl}
          handle={this.customHandle}
        />
      </div>
    );
  }
}

Range.defaultProps = {
  space: 10,
};
