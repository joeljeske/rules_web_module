load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("@npm//jest:index.bzl", "jest_test")

def web_module_test(name, srcs, deps, data, test_env = "node", **kwargs):
    module_name = native.package_name()
    target_compile = name + "__compile"

    ts_project(
        tsconfig = "//:tsconfig.json",
        name = target_compile,
        srcs = srcs,
        composite = True,
        declaration = True,
        link_workspace_root = True,
        deps = deps,
        testonly = True,
    )

    jest_test(
        name = name,
        args = [
            "--config $(execpath //:jest.config.js)",
            "--no-cache",
            "--no-watchman",
            "--ci",
            "--runInBand",
        ],
        data = deps + [
            target_compile,
            "//:jest.config.js",
            "@npm//react",
        ],
        env = {
            "JEST_ROOT_DIR": native.package_name(),
            "JEST_TEST_ENVIRONMENT": test_env,
        },
        testonly = True,
        link_workspace_root = True,
        **kwargs
    )
