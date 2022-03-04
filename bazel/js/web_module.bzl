load(":provider.bzl", "RhWebModuleInfo")

def _impl(ctx):
    transitive_assets = []
    transitive_manifests = []

    for dep in ctx.attr.deps:
        web_module_info = dep[RhWebModuleInfo]
        transitive_manifests.append(web_module_info.transitive_manifests)
        transitive_assets.append(web_module_info.transitive_assets)

    return [
        RhWebModuleInfo(
            manifest = ctx.file.manifest,
            assets = ctx.files.assets,
            transitive_manifests = depset([ctx.file.manifest], transitive = transitive_manifests),
            transitive_assets = depset([ctx.file.assets], transitive = transitive_assets),
        ),
    ]

web_module = rule(
    implementation = _impl,
    attrs = {
        "manifest": attr.label(
            doc = "the single file manifest that references the assets found in assets",
            allow_single_file = [".json"],
        ),
        "assets": attr.label_list(
            doc = "a list of assets referenced to via the manifest",
            allow_files = True,
        ),
        "deps": attr.label_list(
            doc = "The list of deps that are used by this module",
            providers = [RhWebModuleInfo],
        ),
    },
)
