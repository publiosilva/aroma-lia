import express from 'express';
import { Express, Request, Response } from 'express';
import { ExtractTestsFromAST } from './domain/usecases';
import {
  makeDetectAssertionRouletteTestSmellService,
  makeDetectCSharpXUnitTestFilesService,
  makeDetectDuplicateAssertTestSmellService,
  makeDetectIgnoredTestTestSmellService,
  makeDetectSleepyTestTestSmellService,
  makeDetectJavaJUnitTestFilesService,
  makeDetectPythonUnittestTestFilesService,
  makeDownloadGithubRepositoryService,
  makeExtractTestsFromCSharpXUnitASTService,
  makeExtractTestsFromJavaJUnitASTService,
  makeExtractTestsFromPythonUnittestASTService,
  makeGenerateASTService,
} from './main/factories';

const app: Express = express();
const port = 3000;

const detectTestFilesServices = new Map([
  ['csharp', new Map([['xunit', makeDetectCSharpXUnitTestFilesService()]])],
  ['java', new Map([['junit', makeDetectJavaJUnitTestFilesService()]])],
  ['python', new Map([['unittest', makeDetectPythonUnittestTestFilesService()]])],
]);

const extractTestsFromASTServices = new Map([
  ['csharp', new Map<string, ExtractTestsFromAST>([['xunit', makeExtractTestsFromCSharpXUnitASTService()]])],
  ['java', new Map<string, ExtractTestsFromAST>([['junit', makeExtractTestsFromJavaJUnitASTService()]])],
  ['python', new Map<string, ExtractTestsFromAST>([['unittest', makeExtractTestsFromPythonUnittestASTService()]])],
]);

const downloadRepositoryService = makeDownloadGithubRepositoryService();

const generateASTService = makeGenerateASTService();

const detectTestSmellServices = [
  makeDetectAssertionRouletteTestSmellService(),
  makeDetectDuplicateAssertTestSmellService(),
  makeDetectIgnoredTestTestSmellService(),
  makeDetectSleepyTestTestSmellService(),
];

app.use(express.json());

app.post('/test-smells/detect', async (req: Request, res: Response) => {
  const { language, framework, repositoryURL }: { language: string, framework: string, repositoryURL: string } = req.body;

  if (!language || !framework || !repositoryURL) {
    return res.status(400).json({
      error: 'Os campos language, framework e repositoryURL são obrigatórios.',
    });
  }

  const detectTestFilesService = detectTestFilesServices.get(language)?.get(framework);
  const extractTestsFromASTService = extractTestsFromASTServices.get(language)?.get(framework);

  if (!detectTestFilesService || !extractTestsFromASTService) {
    return res.status(400).json({
      error: 'A linguagem ou o framework não são suportados.',
    });
  }

  try {
    const projectFolder = await downloadRepositoryService.execute(repositoryURL);
    const testFilePaths = await detectTestFilesService.execute(projectFolder);
    const testSmells = await Promise.all(testFilePaths.map(async (testFilePath) => {
      const ast = await generateASTService.execute(testFilePath);
      const testsSwitches = extractTestsFromASTService.execute(ast);
    
      const smells = await Promise.all(testsSwitches.map(async (testSwitch) => {
        const smellsForTestSwitch = await Promise.all(
          detectTestSmellServices.map(service => service.execute(testSwitch))
        );
        return smellsForTestSwitch.filter(smell => smell.length > 0);
      }));
    
      const flattenedSmells = smells.flat().filter(smell => smell.length > 0);
    
      return {
        testFilePath,
        testSmells: flattenedSmells,
      };
    }));

    return res.status(200).json(testSmells);
  } catch (error) {
    return res.status(500).json({
      error: 'Ocorreu um erro ao tentar detectar os test smells. Tente novamente mais tarde.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
