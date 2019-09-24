import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Range, Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './style';

const onChange = value => value;

const handle = props => {
  const { value, dragging, index, ...restProps } = props;

  console.log(props);

  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={true}
      placement={index === 0 ? 'bottomLeft' : 'bottomRight'}
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const App = () => (
  <Range
    min={900000}
    max={19000000}
    defaultValue={[1500000, 10000000]}
    handle={handle}
    onChange={onChange}
  />
);

export default hot(App);
