// Node.js built-in APIs.
const fs = require('fs');
const path = require('path');

// Third-party modules.
const { describe, it } = require('mocha');
const { expect } = require('chai');

// Target modules.
const babel = require('@babel/core');
const { CLIEngine } = require('eslint');

// Constants.
const examplesPath = path.resolve(__dirname, 'examples');
const targetFile = path.resolve(examplesPath, 'sources/frontend/components/button/index.js');
const astFile = path.resolve(__dirname, 'artifacts/ast.json');

// Artifacts.
const savedAst = new Promise((resolve, reject) => {
	fs.readFile(astFile, (error, data) => {
		if (error) {
			reject(error);
		}

		resolve(data.toString('utf8'));
	});
});

describe(`ESLint v${CLIEngine.version}`, () => {
	it('should lint without an error', () => {
		const cli = new CLIEngine({ useEslintrc: true });
		const { results } = cli.executeOnFiles([ targetFile ]);

		const totalErrorCount = results
			.map(result => result.errorCount + result.warningCount)
			.reduce((accumulation, errorCount) => accumulation + errorCount, 0);

		expect(totalErrorCount).to.equal(0);
	});
});

describe(`Babel v${babel.version}`, () => {
	it('should compile without an error', async () => {
		const { ast } = await babel.transformFileAsync(targetFile, { root: examplesPath, code: false, ast: true });
		const builtAst = JSON.stringify(ast, undefined, 4);

		expect(builtAst).to.equal(await savedAst);
	});
});
