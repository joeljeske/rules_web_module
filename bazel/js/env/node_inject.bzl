load("@bazel_skylib//rules:common_settings.bzl", "BuildSettingInfo")

def _format_node_env_set(var):
    kvp = var.split("=", 1)
    return "process.env.%s = '%s';" % (kvp[0], kvp[1])

def _node_inject_impl(ctx):
    content = [
        _format_node_env_set(var)
        for var in ctx.attr._env[BuildSettingInfo].value
    ]

    node_inject_file = ctx.actions.declare_file(ctx.label.name)
    ctx.actions.write(
        output = node_inject_file,
        content = "\n".join(content),
    )
    return [
        DefaultInfo(files = depset([node_inject_file])),
    ]

node_inject = rule(
    implementation = _node_inject_impl,
    attrs = {
        "_env": attr.label(
            default = "//bazel/js/env",
        ),
    },
)
