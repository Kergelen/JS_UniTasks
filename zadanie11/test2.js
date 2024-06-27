const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

function TemperatureConverter() {
  const [celsius, setCelsius] = React.useState(0);

  const handleCelsiusChange = (event) => {
    setCelsius(event.target.value);
  };

  const fahrenheit = (celsius * 9/5) + 32;

  return React.createElement(
    'form',
    null,
    React.createElement(
      'label',
      null,
      'Celsius:',
      React.createElement('input', {
        type: 'number',
        value: celsius,
        onChange: handleCelsiusChange,
      })
    ),
    React.createElement('p', null, `Fahrenheit: ${fahrenheit}`)
  );
}

app.get('/', (req, res) => {
  const html = ReactDOMServer.renderToString(
    React.createElement(TemperatureConverter)
  );
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Temperature Converter</title>
    <script src="https://unpkg.com/react/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
  </head>
  <body>
    <div id="root">${html}</div>
    <script>
      function TemperatureConverter() {
        const [celsius, setCelsius] = React.useState(0);

        const handleCelsiusChange = (event) => {
          setCelsius(event.target.value);
        };

        const fahrenheit = (celsius * 9/5) + 32;

        return React.createElement(
          'form',
          null,
          React.createElement(
            'label',
            null,
            'Celsius:',
            React.createElement('input', {
              type: 'number',
              value: celsius,
              onChange: handleCelsiusChange,
            })
          ),
          React.createElement('p', null, \`Fahrenheit: \${fahrenheit}\`)
        );
      }

      ReactDOM.render(
        React.createElement(TemperatureConverter),
        document.getElementById('root')
      );
    </script>
  </body>
</html>`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
