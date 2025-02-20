describe('MyTestClass', () => {
  test('testCloneNonBareRepoFromLocalTestServer', async () => {
      const cloneOp = new Clone(false, integrationGitServerURIFor('small-repo.early.git'), helper().newFolder());
      const repo = await executeAndWaitFor(cloneOp);

      expect(repo).toHaveGitObject('ba1f63e4430bff267d112b1e8afc1d6294db0ccc');

      const readmeFile = new File(repo.getWorkTree(), 'README');
      expect(readmeFile.exists()).toBe(true);
      expect(readmeFile.length).toBe(12);
  });

  test('testXmlSanitizer', () => {
      let valid = XmlSanitizer.isValid('Fritzbox');
      expect(valid).toBe(true);
      console.log('Pure ASCII test - passed');

      valid = XmlSanitizer.isValid('Fritz Box');
      expect(valid).toBe(true);
      console.log('Spaces test - passed');

      valid = XmlSanitizer.isValid('Frützbüx');
      expect(valid).toBe(false);
      console.log('No ASCII test - passed');

      valid = XmlSanitizer.isValid('Fritz!box');
      expect(valid).toBe(true);
      console.log('Exclamation mark test - passed');

      valid = XmlSanitizer.isValid('Fritz.box');
      expect(valid).toBe(true);
      console.log('Dot test - passed');

      valid = XmlSanitizer.isValid('Fritz-box');
      expect(valid).toBe(true);
      console.log('Minus test - passed');

      valid = XmlSanitizer.isValid('Fritz-box');
      expect(valid).toBe(true);
      console.log('Minus test - passed');
  });
});
