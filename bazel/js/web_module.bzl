load(":provider.bzl", "rh_web_module_info")
load("@build_bazel_rules_nodejs//:providers.bzl", "DeclarationInfo", "declaration_info")
load("@rules_nodejs//nodejs:providers.bzl", "js_module_info")

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

    # Build our own declaration info, to enable
    # ts_library to verify checking against deps on transtives
    self_declarations = [
        t[DeclarationInfo].declarations
        for t in ctx.attr.targets
        if DeclarationInfo in t
    ]

    return [
        js_module_info(
            sources = depset(),
            deps = ctx.attr.deps,
        ),
        declaration_info(
            declarations = depset(transitive = self_declarations),
            deps = ctx.attr.deps,
        ),
        rh_web_module_info(
            assets = ctx.files.assets,
            manifest = ctx.file.manifest,
            deps = ctx.attr.deps,
        ),
        DefaultInfo(
            files = depset([manifest_file].extend(ctx.files.assets)),
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
        # TODO: consolidate with deps. rollup_bundle loses our DeclarationInfo
        "targets": attr.label_list(
            doc = "The list of immediate deps, distinguished from transitive deps",
            # providers = [RhWebModuleInfo],
        ),
        "deps": attr.label_list(
            doc = "The list of deps that are used by this module",
            # providers = [RhWebModuleInfo],
        ),
    },
)
