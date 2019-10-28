import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Range from './Range';

class App extends Component {
  render() {
    return (
      <>
        <Range
          min={2014}
          max={2019}
          defaultValue={[2014, 2019]}
          step={1}
          space={10}
          style={{ marginBottom: 100 }}
        />
        <Range
          min={900000}
          max={19000000}
          defaultValue={[900000, 19000000]}
          step={10000}
          space={10}
        />
      </>
    );
  }
}

export default hot(App);
