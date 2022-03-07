load("@bazel_skylib//lib:paths.bzl", "paths")
load(":web_module.bzl", "web_module")
load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")
load("@aspect_rules_swc//swc:swc.bzl", "swc_transpiler")

def web_module_library(name, srcs, deps, **kwargs):
    module_name = native.package_name()

    target_compile = name + "__compile"
    target_transpile = name + "__transpile"
    target_bundle = name + "__bundle"

    ts_project(
        tsconfig = "//:tsconfig.json",
        name = target_compile,
        srcs = srcs,
        composite = True,
        declaration = True,
        link_workspace_root = True,
        deps = deps,
    )

    swc_transpiler(
        name = target_transpile,
        srcs = srcs,
        js_outs = [
            paths.replace_extension(f, ".mjs")
            for f in srcs
        ],
        source_maps = "inline",
        swcrc = "//:.swcrc",
    )

    rollup_bundle(
        name = target_bundle,
        config_file = "//:rollup.config.js",
        entry_points = {
            # TODO: Configurable entrypoint(s)
            "index.mjs": "index",
        },
        env = {
            # TODO make repo name dynamic
            "IMPORTMAP_MODULE_NAME": "rh/" + module_name,
            "IMPORTMAP_OUTPUT_DIR": module_name + "/" + target_bundle,
        },
        link_workspace_root = True,
        output_dir = True,
        sourcemap = "true",
        deps = [
            target_transpile,
            "//bazel/js/env:inject.js",
            "@npm//@rollup/plugin-commonjs",
            "@npm//@rollup/plugin-node-resolve",
            "@npm//@rollup/plugin-replace",
            "@npm//rollup-plugin-esbuild",
            "@npm//rollup-plugin-sourcemaps",
            "//bazel/js/rollup_importmap_plugin",
        ],
        silent = True,
    )

    web_module(
        name = name,
        assets = [target_bundle],
        deps = [target_compile] + deps,
        copy_manifest_file = target_bundle + "/importmap.json",
        **kwargs
    )
