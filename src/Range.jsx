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

    const { pushablePercent, pushablePixels, min, max } = props;

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
    this.updatePushablePixels = this.updatePushablePixels(this);
    this.onChange = this.onChange.bind(this);
  }

  customHandle(props) {
    const { value, dragging, index, ...restProps } = props;
    const isMin = index === 0;

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

  componentDidUpdate() {
    this.updatePushablePixels();

    this.updateTooltipPosition();
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

      // Относительно левого края
      if (tooltipMinEl) {
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
            'position: absolute',
            'top: 0px',
            `left: ${rangeBounds.left - tooltipHideValueElBounds.left}px`,
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
      if (tooltipMaxEl) {
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
            'position: absolute',
            'top: 0px',
            `left: -${tooltipHideValueElBounds.right - rangeBounds.right}px`,
          ].join(';');
        } else {
          tooltipShowValueEl.style = [
            'position: absolute',
            'top: 0',
            'left: 0',
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
              'position: absolute',
              'top: 0px',
              `left: ${tooltipMinShowValueElBounds.right +
                space -
                tooltipMaxShowValueElBounds.left}px`,
            ].join(';');
          }

          // У правого края
          else if (rangeBounds.right <= tooltipMaxElBounds.right) {
            tooltipMinShowValueEl.style = [
              'position: absolute',
              'top: 0px',
              `left: -${tooltipMinHideValueElBounds.right -
                (tooltipMaxShowValueElBounds.left - space)}px`,
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

            let tooltipMinLeft = -half;
            let tooltipMaxLeft = half;

            // Ближе к левому краю
            if (minFixed) {
              // позиция левого бегунка
              tooltipMinLeft =
                rangeBounds.left - tooltipMinHideValueElBounds.left;

              // позиция правого бегунка
              tooltipMaxLeft =
                tooltipMinLeft +
                tooltipMinShowValueElBounds.right -
                tooltipMaxHideValueElBounds.left +
                space;
            }

            // Ближе к правому краю
            if (maxFixed) {
              // позиция левого бегунка
              // tooltipMinLeft = Math.min(
              //   tooltipMinHideValueElBounds.left - half,
              //   rangeBounds.right -
              //     tooltipMinHideValueElBounds.width -
              //     tooltipMaxHideValueElBounds.width -
              //     space
              // );
              console.log('here');
              // позиция правого бегунка
              tooltipMaxLeft =
                tooltipMaxHideValueElBounds.right + half - rangeBounds.right;
            }

            // Сдвигаем левый тултип
            tooltipMinShowValueEl.style = [
              'position: absolute',
              'top: 0px',
              `left: ${tooltipMinLeft}px`,
            ].join(';');

            // Сдвигаем правый тутлип
            tooltipMaxShowValueEl.style = [
              'position: absolute',
              'top: 0px',
              `left: ${tooltipMaxLeft}px`,
            ].join(';');
          }
        }
      }
    }
  }

  onChange(value) {
    const { onChange } = this.props;
    this.setState({ value });
    onChange && onChange(value);
  }

  render() {
    const { pushablePercent, pushablePixels } = this.state;

    const pushable = pushablePercent || pushablePixels;

    return (
      <div className="container">
        <RcRange
          {...this.props}
          ref={this.rangeEl}
          handle={this.customHandle}
          onChange={this.onChange}
          {...(pushable && { pushable })}
        />
      </div>
    );
  }
}

Range.defaultProps = {
  space: 10,
};
