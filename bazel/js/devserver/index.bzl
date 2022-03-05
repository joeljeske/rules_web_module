load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

def web_module_app_server(name, importmap, index, data, loaders, **kwargs):
    nodejs_binary(
        name = name,
        entry_point = "//bazel/js/devserver:bundle.js",
        env = {
            "PORT": "3000",
            "WEB_MODULE_IMPORTMAP": "$(rootpath %s)" % importmap,
            "WEB_MODULE_INDEX": "$(rootpath %s)" % index,
            "WEB_MODULE_LOADERS": ",".join(loaders),
        },
        data = data + [
            importmap,
            index,
        ],
        tags = kwargs.pop("tags", []) + [
            "ibazel_live_reload",
            "ibazel_notify_changes",
        ],
        **kwargs
    )
