const path = require("path");

module.exports = {
  haste: {
    enableSymlinks: true,
  },
  testEnvironment: process.env.JEST_TEST_ENVIRONMENT || "node",
  rootDir: path.resolve(process.env.JEST_ROOT_DIR),
};
