import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Range from './Range';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      space: true,
      tooltipOverlay: false,
      spade: '8',
      pushable: undefined,
      allowCross: true,
    };

    this.switch = this.switch.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  switch(event) {
    this.setState({
      [event.currentTarget.name]: !this.state[event.currentTarget.name],
    });
  }

  toggle(event) {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  render() {
    const { space, spade, tooltipOverlay, pushable, allowCross } = this.state;

    return (
      <div className="container">
        <h2>Доработанный rc-slider</h2>
        <p>
          HOC для rc-slider. Все праметры пробрасываются в rc-slider как есть за
          исключением pushable (см.ниже), и handle (нельзя переопределить, но
          можно определить tooltipOverlay (см.ниже))
        </p>

        <Range
          min={800000}
          max={2000000}
          defaultValue={[800000, 2000000]}
          step={1000}
          {...(pushable === ''
            ? false
            : {
                pushable: pushable === '150000' ? 150000 : pushable,
              })}
          {...(spade && {
            spade: spade === 'auto' ? spade : Number(spade),
          })}
          {...(space && { space: 10 })}
          {...(tooltipOverlay && {
            tooltipOverlay: ({ value }) => (
              <div
                style={{
                  padding: '5px 10px',
                  background: 'lime',
                  borderRadius: 5,
                }}
              >
                {value}
              </div>
            ),
          })}
          allowCross={allowCross}
        />

        <pre style={{ marginTop: 50 }}>
          {`<Range
  step={1000}
  min={800000}
  max={2000000}
  defaultValue={[800000, 2000000]}\n\n\n  `}
          <b>
            {`spade - расстояние на которое tooltip может выходить за границы
          трека у левой и правой границ в px.`}
          </b>
          {'\n'}
          <label>
            <input
              type="radio"
              name="spade"
              value="auto"
              onChange={this.toggle}
              defaultChecked={this.state.spade === 'auto'}
            />
            'auto' - по умолчанию
          </label>
          {`\n  spade="auto"\n`}
          <label>
            <input
              type="radio"
              name="spade"
              value="8"
              onChange={this.toggle}
              defaultChecked={this.state.spade === '8'}
            />
            8px
          </label>
          {`\n  spade={8}\n\n\n`}
          <label>
            <input
              type="checkbox"
              name="space"
              onChange={this.switch}
              defaultChecked={this.state.space}
            />
            space - минимальное расстояние м/д tooltip`ами в px
          </label>
          {`\n  space={10}\n\n\n`}
          <label>
            <input
              type="checkbox"
              name="tooltipOverlay"
              onChange={this.switch}
              defaultChecked={this.state.tooltipOverlay}
            />
            {`tooltipOverlay - функция принимающая те же props, что и `}
            <a
              href="https://github.com/react-component/slider/#common-api"
              target="_blank"
            >
              handle
            </a>
            {`.
                    Должна вернуть экземпляр ReactNode`}
          </label>
          {`\n  tooltipOverlay={({ value }) => (
    <div
      style={{
        padding: '5px 10px',
        background: 'lime',
        borderRadius: 5,
      }}
    >
      {value}
    </div>
  )}\n\n\n`}
          <b>
            {`pushable - минимальное расстояние м/у бегунками.
           Аналог нативного `}
            <a
              href="https://github.com/react-component/slider/#common-api"
              target="_blank"
            >
              pushable
            </a>
            {` с той разницей, 
           что его доп-но можно задавать в px и %`}
          </b>
          {`\n`}
          <label>
            <input
              type="radio"
              name="pushable"
              value=""
              onChange={this.toggle}
              defaultChecked={pushable === ''}
            />
            Не определено (просто нажми F5 😀)
          </label>
          {`\n`}
          <label>
            <input
              type="radio"
              name="pushable"
              value="150000"
              onChange={this.toggle}
              defaultChecked={pushable === '150000'}
            />
            150000 - в единицах измерения слайдера (type: number)
          </label>
          {`\n  pushable="150000"\n`}
          <label>
            <input
              type="radio"
              name="pushable"
              value="8%"
              onChange={this.toggle}
              defaultChecked={pushable === '8%'}
            />
            '8%' - в процентах от максимальной длины слайдера
          </label>
          {`\n  pushable="8%"\n`}
          <label>
            <input
              type="radio"
              name="pushable"
              value="25px"
              onChange={this.toggle}
              defaultChecked={this.state.spade === '25px'}
            />
            '25px' - в px
          </label>
          {`\n  pushable="25px"\n\n\n`}
          <label>
            <input
              type="checkbox"
              name="allowCross"
              onChange={this.switch}
              defaultChecked={!this.state.allowCross}
            />
            {`allowCross={false}\n`}
          </label>
          {`\n/>`}
        </pre>
      </div>
    );
  }
}

export default hot(App);
