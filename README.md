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
You can edit all baseconfigurations regarding ESLint and Typescript under the `config` folder under the root. If you want to adjust single packages you can do this allso by editing the `tsconfig.json`, `tsconfig.compiler.json` or the ` .eslintrc.js` file.

If you add another framework or want to add a global configuration for your library just use the **create-config** command from the integrated [CLI](#integrated-cli):

```bash
$ npm run cli
your-project$ create-config core-config
```

## Creating new packages

You can easily create new packages and/or configs with the [CLI](#integrated-cli) by using the `create-package` command. Take a look at the example below:

```bash
$ npm run cli
your-project$ create-package my-new-package
```

### Migrating packages from a JavaScript base
tbd.

```json
{
	"target": "some-new-package",
	"source": "/project-xy/library/a/**/*.{js}",
	"ignore": [
		"*.invalid.js"
	]
}
```

## Writing tests

There's built in support for ava, which means you can write tests out of the box by creating `.test.ts` files. Attention: you need to precompile the tests to work with ava, this will be automatically done by the provided `test` command.

### Browser tests with ava
tbd.

## Integrated CLI
tbd.

### Adding new commands
tbd.

### Adjusting templates
tbd.
