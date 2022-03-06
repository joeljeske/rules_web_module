def _impl(settings, attrs):
    return {
        "//bazel/js/env:env": attrs.js_env,
    }

js_env_transition = transition(
    implementation = _impl,
    inputs = [],
    outputs = ["//bazel/js/env"],
)
