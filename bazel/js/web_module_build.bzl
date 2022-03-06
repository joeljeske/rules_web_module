load("@bazel_skylib//lib:paths.bzl", "paths")
load(":web_module.bzl", "web_module")
load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("@npm//jest:index.bzl", "jest_test")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")
load("@aspect_rules_swc//swc:swc.bzl", "swc_transpiler")

def _impl(ctx):
    # print(ctx.label)
    # print(ctx.attr.impl[JSModuleInfo])
    # print("\n".join(
    #     [f.path for f in ctx.attr.impl[JSModuleInfo].sources.to_list()],
    # ))
    return [
    ]

insp = rule(
    implementation = _impl,
    attrs = {
        "impl": attr.label(),
    },
)

def web_module_build(name, srcs, deps, test_srcs, test_deps, test_data, test_env = "node", visibility = []):
    module_name = native.package_name()

    ts_project(
        tsconfig = "//:tsconfig.json",
        name = "compile",
        srcs = srcs,
        composite = True,
        declaration = True,
        link_workspace_root = True,
        deps = deps,
    )

    insp(name = "___", impl = "compile")

    ts_project(
        tsconfig = "//:tsconfig.json",
        name = "test_compile",
        srcs = test_srcs,
        composite = True,
        declaration = True,
        link_workspace_root = True,
        deps = deps + test_deps + [
            ":compile",
        ],
    )

    jest_test(
        name = "test",
        args = [
            "--config $(execpath //:jest.config.js)",
            "--no-cache",
            "--no-watchman",
            "--ci",
            "--runInBand",
        ],
        data = test_deps + [
            ":test_compile",
            "//:jest.config.js",
        ],
        env = {
            "JEST_ROOT_DIR": native.package_name(),
            "JEST_TEST_ENVIRONMENT": test_env,
        },
        link_workspace_root = True,
    )

    swc_transpiler(
        name = "esm",
        srcs = srcs,
        js_outs = [
            paths.replace_extension(f, ".mjs")
            for f in srcs
        ],
        source_maps = "inline",
        swcrc = "//:.swcrc",
    )

    rollup_bundle(
        name = "bundle",
        config_file = "//:rollup.config.js",
        entry_points = {
            # TODO: Configurable entrypoint(s)
            "index.mjs": "index",
        },
        env = {
            # TODO make repo name dynamic
            "IMPORTMAP_MODULE_NAME": "rh/" + module_name,
            "IMPORTMAP_OUTPUT_DIR": module_name + "/bundle",
        },
        link_workspace_root = True,
        output_dir = True,
        sourcemap = "true",
        deps = [
            ":esm",
            "@npm//rollup-plugin-esbuild",
            "//bazel/js/env:inject.js",
            "@npm//@rollup/plugin-commonjs",
            "@npm//@rollup/plugin-node-resolve",
            "@npm//@rollup/plugin-replace",
            "@npm//rollup-plugin-sourcemaps",
            "//bazel/js/rollup_importmap_plugin",
        ],
        silent = True,
    )

    web_module(
        name = name,
        assets = [":bundle"],
        deps = [":compile"] + deps,
        copy_manifest_file = "bundle/importmap.json",
        visibility = visibility,
    )
