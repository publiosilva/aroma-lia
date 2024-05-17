const { Clone } = require('git').plugins;
const fs = require('fs');
const { Calculator } = require('./Calculator');

describe('Test', () => {
  test('testCloneNonBareRepoFromLocalTestServer', async () => {
    const cloneOp = new Clone(false, integrationGitServerURIFor('small-repo.early.git'), helper().newFolder());

    const repo = await executeAndWaitFor(cloneOp);

    expect(repo).toHaveGitObject('ba1f63e4430bff267d112b1e8afc1d6294db0ccc');

    const readmeFilePath = path.join(repo.getWorkTree(), 'README');
    expect(fs.existsSync(readmeFilePath)).toBe(true);
    expect(fs.statSync(readmeFilePath).size).toBe(12);
  });

  test('testAddition', () => {
    const calculator = new Calculator();

    // Perform addition
    const result = calculator.add(2, 3);

    // Assert the result twice
    expect(result).toBe(5);
    expect(result).toBe(5); // Duplicate assertion
  });
});
