import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Range from './Range';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      space: false,
      tooltipOverlay: false,
      spade: false,
    };
  }

  render() {
    return (
      <div className="container">
        <h2>
          Tooltip`ы могут не накладываться друг на друга если задать{' '}
          <code>space</code>
        </h2>
        <p>
          Параметр <code>space</code> определяет расстояние в <code>px</code>{' '}
          между tooltip`ами
        </p>
        <pre>
          {`<Range
  min={900000}
  max={19000000}
  defaultValue={[8600000, 12000000]}
  space={10}\n`}
          {/* <input
            type="checkbox"
            onChange={() =>
              this.setState({ tooltipOverlay: !this.state.tooltipOverlay })
            }
            checked={this.state.tooltipOverlay}
          /> */}
          {`// tooltipOverlay - функция принимающая те же props, что и handle
  tooltipOverlay={({ value }) => (
    <div
      style={{
        padding: '5px 10px',
        background: 'lime',
        borderRadius: 5,
      }}
    >
      {value}
    </div>
  )}
/>`}
        </pre>
        <Range
          min={800000}
          max={5000000}
          defaultValue={[800000, 5000000]}
          step={1000}
          space={12}
          spade={8}
          allowCross={false}
          pushable={'20px'}
          // allowCross={true}
          // tooltipOverlay={({ value }) => (
          //   <div
          //     style={{
          //       padding: '5px 10px',
          //       background: 'lime',
          //       borderRadius: 5,
          //     }}
          //   >
          //     {value}
          //   </div>
          // )}
        />
      </div>
    );
  }
}

export default hot(App);
