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

### Adjusting templates
If you want to adjust the templates of the package blueprint you can head over to `packages/cli/templates` and adjust the right handlebars files.

### Migrating packages from a JavaScript base

The integrated CLI includes the capability to migrate whole JavaScript into a new lerna package. Note that the JavaScript files will only be renamed to `.ts` and won't be transpiled to TypeScript - this has to be done manually atm. Migrations need a configuration file which looks like the example below.

```json
{
	"target": "some-new-package",
	"source": "/some-project/library/xy/",
	"pattern": "**/*.{js,json,hbs}",
	"ignore": [
        "*.invalid.js",
        "*.update.*"
	]
}
```

Per default, migrations are stored under `/migration`, but the path can be changed to any other path. Make sure you update the path to the migration configurations in your `package.json` under `lerna-typescript-starter.migrations.config` that the CLI is able to read the configurations.

To process the migration, you only have to run `npm run cli` and use the command `migrate`. The interface will ask you which migration you want to process and if the package needs support for the browser environement.

```bash
$ npm run cli # start cli
your-project$ migrate # run command
? Select a migration configuration file (Use arrow keys) # select the file
> /example.json
? Does the package use the browser environment? (y/N) # add browser support
```

## Writing tests

There's built in support for ava, which means you can write tests out of the box by creating `.test.ts` files. Attention: you need to precompile the tests to work with ava, this will be automatically done by the provided `test` command.

### Browser tests with ava

Check the [Setting up AVA for browser testing](https://github.com/avajs/ava/blob/master/docs/recipes/browser-testing.md) guide from the AVA team.


## Update the project structure
There's also a built in command for updating the repository structure and core files. Package configurations will be pulled out as `package.json.update`, so you'll see if there are new dependencies which are compatible with the setup.

> **Important note:** The updates of dependencies should also be automated inside the update process in the near future.
