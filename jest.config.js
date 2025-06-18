/* module.exports = {
  preset: 'react-native',
};
 */
/* agrego nueva configuración para poder usar jest 17/06 */
module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: [
    './jest.setup.js',
    'react-native-gesture-handler/jestSetup',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!react-native|@react-native|@ui-kitten|react-native-vector-icons)',
  ],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
    '^@react-native-async-storage/async-storage$':
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
    verbose: true,
};
