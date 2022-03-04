load(":provider.bzl", "RhWebModuleInfo")

def _impl(ctx):
    manifest_file = None
    if ctx.attr.copy_manifest_file:
        manifest_file = ctx.actions.declare_file("%s.manifest.json" % ctx.label.name)
        ctx.actions.run_shell(
            inputs = ctx.files.assets,
            outputs = [manifest_file],
            command = "cp -f \"$1\" \"$2\"",
            arguments = [
                "/".join([ctx.bin_dir.path, ctx.label.package, ctx.attr.copy_manifest_file]),
                manifest_file.path,
            ],
            mnemonic = "CopyFile",
            progress_message = "Copying manifest",
            use_default_shell_env = True,
        )
    else:
        manifest_file = ctx.file.manifest

    transitive_assets = []
    transitive_manifests = []

    for dep in ctx.attr.deps:
        web_module_info = dep[RhWebModuleInfo]
        transitive_manifests.append(web_module_info.transitive_manifests)
        transitive_assets.append(web_module_info.transitive_assets)

    return [
        RhWebModuleInfo(
            manifest = manifest_file,
            assets = ctx.files.assets,
            transitive_manifests = depset([ctx.file.manifest], transitive = transitive_manifests),
            transitive_assets = depset(ctx.files.assets, transitive = transitive_assets),
        ),
        DefaultInfo(
            files = depset([manifest_file]),
        ),
    ]

web_module = rule(
    implementation = _impl,
    attrs = {
        "copy_manifest_file": attr.string(
            doc = "instead of using the manifest file in the ",
        ),
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
