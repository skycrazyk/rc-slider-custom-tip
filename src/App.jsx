import React, { useRef, useEffect, Fragment } from 'react';
import { hot } from 'react-hot-loader/root';
import { Range, Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './style';

/**
 * Идея:
 * 1. Получаем доступ к dom элементам: слайдеру и tooltip`ам +
 * 2. При событии движение ползунка или изменении размера экрана:
 * 2.1 Сравниваем позиции ползунков относительно граница слайдера и в зависимости от этого
 * меняем значение параметра placement.
 * 2.2 Сравниваем позиции ползунков м/у собой и в зависимости от этого меняем значение
 * параметра placement
 */
const tooltipIdMin = 'tooltipIdMin'; // генерировать guid
const tooltipIdMax = 'tooltipIdMax'; // генерировать guid
let tooltipMinEl;
let tooltipMaxEl;
let rangeEl;

const onChange = () => {
  // console.dir(rangeEl.current.handlesRefs);
  // console.dir(rangeEl.current.sliderRef);
  // console.log(tooltipMinEl, tooltipMaxEl);
  // console.dir(tooltipMinEl.getBoundingClientRect().x);
  // console.dir(rangeEl.current.sliderRef.getBoundingClientRect().x);
};

// Получаем доступ к DOM элементам
const onPopupAlign = () => {
  if (!tooltipMinEl && !tooltipMaxEl) {
    tooltipMinEl = document.getElementById(tooltipIdMin);
    tooltipMaxEl = document.getElementById(tooltipIdMax);
  }
};

const CustomHandle = props => {
  const { value, dragging, index, ...restProps } = props;
  const isMin = index === 0;

  if (rangeEl && rangeEl.current) {
    const rangeBounds = rangeEl.current.sliderRef.getBoundingClientRect();

    if (tooltipMinEl) {
      const tooltipMinElBounds = tooltipMinEl.getBoundingClientRect();

      const tooltipShowValueEl = tooltipMinEl.querySelector(
        '.rc-slider-tooltip-show-value'
      );

      const tooltipHideValueEl = tooltipMinEl.querySelector(
        '.rc-slider-tooltip-hide-value'
      );

      const tooltipHideValueElBounds = tooltipHideValueEl.getBoundingClientRect();

      if (rangeBounds.x >= tooltipMinElBounds.x) {
        // console.log(rangeBounds.x, tooltipWrapMinElBounds.x);
        tooltipShowValueEl.style = [
          'position: fixed',
          `top: ${tooltipHideValueElBounds.y}px`,
          `left: ${rangeBounds.x}px`,
        ].join(';');
      } else {
        tooltipShowValueEl.style = [
          `position: absolute`,
          'top: 0',
          'left: 0',
        ].join(';');
      }
    }
  }

  return (
    <Tooltip
      id={isMin ? tooltipIdMin : tooltipIdMax}
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
      onPopupAlign={onPopupAlign}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const App = () => {
  rangeEl = useRef(null);

  return (
    <Range
      ref={rangeEl}
      min={900000}
      max={19000000}
      defaultValue={[1500000, 10000000]}
      handle={CustomHandle}
      onChange={onChange}
      step={10000}
    />
  );
};

export default hot(App);
