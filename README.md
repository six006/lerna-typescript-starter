# Lerna Typescript Starter
An easy way to start into the world of Typescript and Monorepos!

## Contents
* Contains predefined lerna package areas `packages` and `config`.
* Supports individual TSLint and Typescript Compiler settings for each package.
* Built-in support for tests with [Ava](https://github.com/avajs/ava).
* Includes [Editor-](http://editorconfig.org) and [prettier](https://github.com/prettier/prettier/issues/13) configurations.
* Automated node versioning supports [nvm](https://github.com/creationix/nvm) and [node-env](https://github.com/ekalinin/nodeenv).
* Linting with [ESLint](https://eslint.org/) is already on board.
* Integrated extensible CLI built on top of [vorpal](http://vorpal.js.org/).

### Create a project from this boilerplate
```sh
git clone --depth=1 https://github.com/janbiasi/lerna-typescript-starter.git my-project
```

## Working with this setup

### Available NPM scripts
* `c`, run the commitizen CLI tool, **use this command** instead of direct git commits!
* `cli`, starts the interactive custom CLI
* `bootstrap`, bootstraps and links lerna packages, run this command if you've added new lerna dependencies to a package to generate the correct symlinks.
* `lint`, lint all files regarding the `*.ts` extension
* `test`, run all tests from all packages, also does a compilation process before running tests to make sure that all test-suites are precompiled.
* `build`, generates raw JavaScript and `d.ts` files from your packages which can be published/used afterwards.
* `changelog`, regenerate, commit and push the changelog file (automated via commitizen). It uses the default angular format.
* `clean`, deletes the compiled output from all packages

## Adding custom configuration
tbd.

## Creating new packages
tbd.

## Writing tests
tbd.

### Browser tests with ava
tbd.

## Integrated CLI
tbd.

### Adding new commands
tbd.

### Adjusting templates
tbd.
