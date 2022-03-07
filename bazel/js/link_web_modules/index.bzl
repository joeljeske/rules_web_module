load("//bazel/js:provider.bzl", "rh_web_module_info")
load("@build_bazel_rules_nodejs//:providers.bzl", "run_node")
load("//bazel/js/env:index.bzl", "js_env_transition")

def _impl(ctx):
    web_modules = rh_web_module_info(
        manifest = depset(),
        assets = depset(),
        deps = ctx.attr.deps,
    )

    args = ctx.actions.args()
    args.use_param_file("%s", use_always = True)
    args.set_param_file_format("multiline")
    args.add_all(web_modules.transitive_manifests)

    run_node(
        ctx,
        inputs = web_modules.transitive_manifests,
        arguments = [
            ctx.outputs.out.path,
            args,
        ],
        outputs = [ctx.outputs.out],
        mnemonic = "LinkImportmaps",
        executable = "_tool",
        # execution_requirements = execution_requirements,
        progress_message = "%s %s" % (
            "Linking importmaps",
            ctx.label,
        ),
        link_workspace_root = ctx.attr.link_workspace_root,
    )

    return [
        rh_web_module_info(
            manifest = depset([ctx.outputs.out]),
            assets = web_modules.transitive_assets,
        ),
        DefaultInfo(files = depset(
            [ctx.outputs.out],
            transitive = [web_modules.transitive_assets],
        )),
    ]

link_web_modules = rule(
    implementation = _impl,
    attrs = {
        "deps": attr.label_list(
            doc = "List of web modules that should be linked together into a single importmap",
            cfg = js_env_transition,
            # providers: [RhWebModuleInfo]
        ),
        "out": attr.output(
            mandatory = True,
        ),
        "_tool": attr.label(
            default = "//bazel/js/link_web_modules:tool",
            executable = True,
            cfg = "exec",
        ),
        "link_workspace_root": attr.bool(
            # doc TODO
        ),
        "_allowlist_function_transition": attr.label(
            default = "@bazel_tools//tools/allowlists/function_transition_allowlist",
        ),
        "js_env": attr.string_dict(),
    },
)
