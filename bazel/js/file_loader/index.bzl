load("//bazel/js:web_module.bzl", "web_module")
load("@build_bazel_rules_nodejs//:index.bzl", "npm_package_bin")

def web_module_file_loader(name, assets, module_name, **kwargs):
    target_prepare = name + "__prepare"
    manifest_name = "importmap.json"

    npm_package_bin(
        name = target_prepare,
        tool = "//bazel/js/file_loader:tool",
        output_dir = True,
        data = assets,
        args = [
            "$(@D)",
            manifest_name,
            module_name,
            (native.package_name() + "/" + target_prepare),
        ] + [
            "$(location %s)" % asset
            for asset in assets
        ],
    )

    web_module(
        name = name,
        assets = [target_prepare],
        copy_manifest_file = target_prepare + "/" + manifest_name,
        **kwargs
    )
