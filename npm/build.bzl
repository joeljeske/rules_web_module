load("//bazel/js:index.bzl", "web_module")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

def npm_web_module(name, module_name, entry_point, deps = None, includes = None, named_exports = None, export_star = False):
    target = name + "__bundle"
    entry_point_file = name + "__entry_point"

    ## Test 1

    entry_point_content = None
    if named_exports:
        entry_point_content = [
            "export {{ {exp} }} from '{main}'".format(
                exp = exp,
                main = entry_point,
            )
            for exp in named_exports
        ]
    elif export_star:
        entry_point_content = [
            "export * from '{main}'".format(
                main = entry_point,
            ),
        ]

    includes = includes or []

    write_file(
        name = entry_point_file,
        out = entry_point_file + ".js",
        content = entry_point_content,
    )

    rollup_bundle(
        name = target,
        config_file = "//:rollup.config.js",
        entry_points = {
            entry_point_file: "index",
        },
        env = {
            "IMPORTMAP_MODULE_NAME": module_name,
            "IMPORTMAP_OUTPUT_DIR": target,
            "IMPORTMAP_INCLUDES": ",".join(includes),
        },
        args = [
            "--plugin=@rollup/plugin-commonjs",
        ],
        format = "system",
        output_dir = True,
        sourcemap = "true",
        deps = deps + [
            "@npm//@rollup/plugin-node-resolve",
            "@npm//@rollup/plugin-commonjs",
            "@npm//@rollup/plugin-replace",
            "@npm//rollup-plugin-sourcemaps",
        ],
    )

    web_module(
        name = name,
        assets = [target],
        deps = deps,
        # In the npm case, all our deps are bundled and
        # considered our own target, not really a "dep" but our "src"
        targets = deps,
        copy_manifest_file = target + "/importmap.json",
    )
