module.exports = {
  presets: ['module:@react-native/babel-preset',
    /* estos dos los agrego para hacer pruebas con jest. 17/06/25 */
    '@babel/preset-typescript',
    '@babel/preset-react'

  ],
  plugins: [
    ['module:react-native-dotenv'],
    'react-native-reanimated/plugin'
  ]
}
