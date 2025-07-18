module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-syntax-import-meta',
      // Replace import.meta with a safe alternative
      [
        'babel-plugin-transform-define',
        {
          'import.meta': 'undefined'
        }
      ]
    ],
  };
};