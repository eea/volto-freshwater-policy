require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  testMatch: ['**/src/addons/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/addons/**/src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '@plone-collective/volto-authomatic/(.*)$':
      '<rootDir>/node_modules/@plone-collective/volto-authomatic/src/$1',
    '@plone/volto/cypress': '<rootDir>/node_modules/@plone/volto/cypress',
    '@plone/volto/babel': '<rootDir>/node_modules/@plone/volto/babel',
    '@plone/volto/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@package/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@root/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@plone/volto-quanta/(.*)$': '<rootDir>/src/addons/volto-quanta/src/$1',
    '@eeacms/search/(.*)$': '<rootDir>/src/addons/volto-searchlib/searchlib/$1',
    '@eeacms/search': '<rootDir>/src/addons/volto-searchlib/searchlib',
    '@eeacms/(.*?)/(.*)$': '<rootDir>/node_modules/@eeacms/$1/src/$2',
    '@plone/volto-slate$':
      '<rootDir>/node_modules/@plone/volto/packages/volto-slate/src',
    '@plone/volto-slate/(.*)$':
      '<rootDir>/node_modules/@plone/volto/packages/volto-slate/src/$1',
    '~/(.*)$': '<rootDir>/src/$1',
    'load-volto-addons':
      '<rootDir>/node_modules/@plone/volto/jest-addons-loader.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@plone|@root|@package|@eeacms|@plone-collective|ol|ol-mapbox-style)/).*/',
  ],
  transform: {
    '^.+\\.js(x)?$': 'babel-jest',
    '^.+\\.ts(x)?$': 'babel-jest',
    '^.+\\.(png)$': 'jest-file',
    '^.+\\.(jpg)$': 'jest-file',
    '^.+\\.(svg)$': './node_modules/@plone/volto/jest-svgsystem-transform.js',
  },
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  ...(process.env.JEST_USE_SETUP === 'ON' && {
    setupFilesAfterEnv: [
      '<rootDir>/node_modules/@eeacms/volto-freshwater-policy/jest.setup.js',
    ],
  }),
};
