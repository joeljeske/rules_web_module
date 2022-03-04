const path = require("path");

module.exports = {
  haste: {
    enableSymlinks: true,
  },
  rootDir: path.resolve(process.env.JEST_ROOT_DIR),
};
