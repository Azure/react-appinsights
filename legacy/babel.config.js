module.exports = function (api) {
  api.cache(true);
  const presets = [  "@babel/preset-env", "@babel/preset-react" ];
  const env = {
    "test": {
      "plugins": [
        "transform-amd-to-commonjs"
      ]
    }
  }

  return {
    presets,
    env
  };
}