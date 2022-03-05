DEPS = ["@npm//tslib"]

TEST_DEPS = [
    "@npm//@testing-library/react",
    "@npm//@types/jest",
    "@npm//@types/node",
]

SRCS_PATTERNS = [
    "*.ts",
    "*.tsx",
]

TEST_SRCS_PATTERNS = ["*.test.*"]

SRCS_EXCLUDE_PATTERNS = ["*.test.*"]
