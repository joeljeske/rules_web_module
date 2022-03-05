load(":web_module_build.bzl", _web_module_build = "web_module_build")
load(":npm_web_module_build.bzl", _npm_web_module_build = "npm_web_module_build")
load("//bazel/js/devserver:index.bzl", _web_module_app_server = "web_module_app_server")
load("//bazel/js/link_importmaps:index.bzl", _link_importmaps = "link_importmaps")

web_module_build = _web_module_build
npm_web_module_build = _npm_web_module_build
web_module_app_server = _web_module_app_server
link_importmaps = _link_importmaps
