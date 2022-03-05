load(":web_module.bzl", "web_module")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

def _generate_entry_point_content(main, named_exports, export_star):
    if named_exports:
        return [
            "export {{ {exp} }} from '{main}'".format(exp = exp, main = main)
            for exp in named_exports
        ]

    if export_star:
        return [
            "export * from '{main}'".format(main = main),
        ]
    fail("Expected named_exports or export_star to be set")

def npm_web_module_build(name, module_name, entry_point, deps = None, includes = None, named_exports = None, export_star = False):
    target = name + "__bundle"
    entry_point_file = name + "__entry_point"

    includes = includes or []

    write_file(
        name = entry_point_file,
        out = entry_point_file + ".js",
        content = _generate_entry_point_content(
            main = entry_point,
            named_exports = named_exports,
            export_star = export_star,
        ),
    )

    rollup_bundle(
        name = target,
        config_file = "//:rollup.config.js",
        entry_points = {
            entry_point_file: "index",
        },
        silent = True,
        env = {
            "IMPORTMAP_MODULE_NAME": module_name,
            "IMPORTMAP_OUTPUT_DIR": native.package_name() + "/" + target,
            "IMPORTMAP_INCLUDES": ",".join(includes),
        },
        args = [
            "--plugin=@rollup/plugin-commonjs",
        ],
        link_workspace_root = True,
        format = "system",
        output_dir = True,
        sourcemap = "true",
        deps = deps + [
            "@npm//@rollup/plugin-node-resolve",
            "@npm//@rollup/plugin-commonjs",
            "@npm//@rollup/plugin-replace",
            "@npm//rollup-plugin-sourcemaps",
            "//bazel/js/rollup_importmap_plugin",
        ],
    )

    web_module(
        name = name,
        assets = [target],
        deps = deps,
        copy_manifest_file = target + "/importmap.json",
    )
