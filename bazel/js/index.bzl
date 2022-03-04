load("@npm//@bazel/concatjs/internal:build_defs.bzl", _ts_library = "ts_library_macro")
load(":web_module.bzl", _web_module = "web_module")

ts_library = _ts_library
web_module = _web_module
