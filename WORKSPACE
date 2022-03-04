workspace(
    # Name the workspace the same as our monorepo.
    # Note that Bazel recommends this be globally unique, using reverse-dns naming.
    # We don't need to do this because this is a "leaf" - we don't expect any
    # systems outside of Robinhood will have a dependency on this repo, so
    # this is unique enough for our global Bazel context.
    name = "rules_web",
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "965ee2492a2b087cf9e0f2ca472aeaf1be2eb650e0cfbddf514b9a7d3ea4b02a",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.2.0/rules_nodejs-5.2.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories()

yarn_install(
    name = "npm",
    exports_directories_only = False,
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)
