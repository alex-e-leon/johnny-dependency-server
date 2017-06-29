const atImport = require('postcss-import');
const url = require('postcss-url');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const reporter = require('postcss-reporter');

const cssVariables = {
  white: '#fff',
  green: 'rgb(24,186,181)',
  greenLight: 'rgb(90,209,153)',
  yellow: 'rgb(254,174,46)',
  yellowLight: 'rgb(247,186,81)',
  red: 'rgb(245,79,49)',
  redLight: 'rgb(225,51,181)'
};

module.exports = {
  plugins: [
    atImport(),
    url(),
    cssnext({
      features: {
        customProperties: {
          variables: cssVariables
        }
      }
    }),
    process.env.NODE_ENV === 'production' && cssnano({autoprefixer: false}),
    reporter()
  ]
};
