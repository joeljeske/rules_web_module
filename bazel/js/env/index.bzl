def _impl(settings, attrs):
    env = [
        k + "=" + v
        for k, v in attrs.js_env.items()
    ]
    return {
        "//bazel/js/env:env": env,
    }

js_env_transition = transition(
    implementation = _impl,
    inputs = [],
    outputs = ["//bazel/js/env:env"],
)
