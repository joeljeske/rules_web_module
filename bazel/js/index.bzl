load(":web_module.bzl", _web_module = "web_module")
load(":web_module_library.bzl", _web_module_library = "web_module_library")
load(":web_module_test.bzl", _web_module_test = "web_module_test")
load(":npm_web_module_build.bzl", _npm_web_module_build = "npm_web_module_build")
load("//bazel/js/devserver:index.bzl", _web_module_app_server = "web_module_app_server")
load("//bazel/js/link_importmaps:index.bzl", _link_importmaps = "link_importmaps")
load("//bazel/js/file_loader:index.bzl", _web_module_file_loader = "web_module_file_loader")

web_module_file_loader = _web_module_file_loader
web_module = _web_module
web_module_library = _web_module_library
web_module_test = _web_module_test
npm_web_module_build = _npm_web_module_build
web_module_app_server = _web_module_app_server
link_importmaps = _link_importmaps
