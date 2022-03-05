RhWebModuleInfo = provider(
    "Web module partial package",
    fields = {
        "assets": "first-order assets / asset trees",
        "manifest": "first-order manifest, single file",
        "transitive_assets": "inclusive transitive assets",
        "transitive_manifests": "inclusive transitive assets",
    },
)

def rh_web_module_info(manifest, assets, deps = []):
    transitive_assets = [assets]
    transitive_manifests = [manifest]

    for dep in deps:
        if RhWebModuleInfo in dep:
            web_module_info = dep[RhWebModuleInfo]
            transitive_manifests.append(web_module_info.transitive_manifests)
            transitive_assets.append(web_module_info.transitive_assets)

    return RhWebModuleInfo(
        manifest = manifest,
        assets = assets,
        transitive_manifests = depset(transitive = transitive_manifests),
        transitive_assets = depset(transitive = transitive_assets),
    )
