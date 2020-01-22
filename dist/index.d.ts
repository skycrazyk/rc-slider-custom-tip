import * as React from 'react';
import { HandleProps, CommonApiProps } from 'rc-slider';

export interface RangeCustomTipProps {
  /**
   * Расстояние на которое tooltip может выходить за границы
   * трека у левой и правой границ в px.
   */
  spade?: number;
  /**
   * Минимальное расстояние м/д tooltip`ами в px
   */
  space?: number;
  /**
   * Функция принимающая те же props, что и handle.
   * Должна вернуть экземпляр ReactNode
   */
  tooltipOverlay?: (props: HandleProps) => React.ReactNode;
  /**
   * Минимальное расстояние м/у бегунками.
   * Аналог нативного "pushable" с той разницей,
   * что его доп-но можно задавать в px и %
   */
  pushable?: string;
  /**
   * onChange will be triggered while the value of Slider changing.
   * For prop (count = -1) type returned is [number, undefined]. Bug raised in rc-slider https://github.com/react-component/slider/issues/457
   */
  onChange?(value: number[]): void;
}

/**
 * Позволяет гибко настраивать поведение tooltip'ов в Range слайдере
 * Ограничения:
 * - Только Range слайдера с двумя бегунками
 * - Переопределяет параметры pushable и handle
 */
export default class RangeCustomTip extends React.Component<
  RangeCustomTipProps
> {}
