import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Range from './Range';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h2>Значения могут накладываясь друг на друга</h2>
        <pre>
          {`<Range
  min={2010}
  max={2019}
  defaultValue={[2010, 2019]}
  step={1}
/>`}
        </pre>
        <Range min={2010} max={2019} defaultValue={[2014, 2015]} step={1} />
        <h2 style={{ marginTop: 100 }}>
          Значение могут не накладываясь друг на друга
        </h2>
        <p>
          Параметр <code>space</code> определяет расстояние в <code>px</code>{' '}
          между значениями
        </p>
        <pre>
          {`<Range
  min={900000}
  max={19000000}
  defaultValue={[8600000, 12000000]}
  space={10}
/>`}
        </pre>
        <Range
          min={900000}
          max={19000000}
          defaultValue={[8600000, 12000000]}
          space={10}
        />
        <h2 style={{ marginTop: 100 }}>
          Может быть задано минимальное значение дипазона
        </h2>
        <p>
          Минимальное расстояние между бегунками может быть задано одним из трёх
          способов:
        </p>
        <ol>
          <li>
            <code>pushable</code> - конкретное значение
          </li>
          <li>
            <code>pushablePercent</code> - процент от максимально возможного
            диапазона
          </li>
          <li>
            <code>pushablePixels</code> - расстояние между бегунками в пикселях
          </li>
        </ol>
        <pre>
          {`<Range
  min={10000}
  max={100000}
  defaultValue={[10000, 100000]}
  space={10}
  allowCross={false}
  pushablePixels={20}
/>`}
        </pre>
        <Range
          min={10000}
          max={100000}
          defaultValue={[30000, 90000]}
          space={10}
          allowCross={false}
          pushablePixels={30}
        />
      </div>
    );
  }
}

export default hot(App);
