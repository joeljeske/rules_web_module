# Web Module processing in Bazel

This repo is a POC showing how web modules could be built and consumed within bazel. The concept here is to limit the amount of work performed in each bazel package, and to structure the work so that there is not a top-level package that must process all of the application files to generate a single bundle. It could be compared with webpack module federation.

## Example

Look at the example app and packages within the `./example` subdirectory.

There is a single "app" that can be run in the browser, with a few packages that can be consumed and used.

```sh
bazel run //example/app:serve

# or in watch mode
ibazel run //example/app:serve
```

The best starting point for understanding the example is in the example/app/BUILD.bazel. There are a few first-order deps in example/packages and example/routes.

You can also run the dependent tests for every package.

```sh
bazel test //...
```

## DAG

Each package is compiled with TS. Those files are available for testing in nodejs / jest, they target commonjs.

Each package transpiles their TS input via SWC to .mjs files. They are then bundled (flattened) by rollup. During this bundling, a importmap is generated.

Each package provides its importmap, and its set of prod-ready deps. They are then flattened into a single importmap. This allows no further processing to be done on the packages JS after the initial package build. Additionally, packages need not be rebuilt when its deps change. This allows for a fast dev mode serving.

NPM deps have hand-crafted targets that describe how the bundling should be done for those packages, every dep must be explicitly created and dep'd on.

## TODO

Lots to do, including:

[ ] Static assets via file_loader should have their urls available in JS both in test/dev/prod
[ ] Importmap linker should validate the importmap at merge time, to ensure that all deps are available and valid
[ ] Importmap optimizer should flatten and optimize the importmap to serve assets from a single directory
