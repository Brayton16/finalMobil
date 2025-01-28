module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env.local',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
  module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['react-native-reanimated/plugin'],
  };
  