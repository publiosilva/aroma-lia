import { FindAllClassDeclarationsService, FindAllFunctionOrMethodDeclarationsService, FindAllFunctionOrMethodInvocationsService, FindAllFunctionOrMethodInvocationsService, GetLiteralValueService, IsAInsideOfBService, JavaJUnitExtractTestsFromASTService, JavascriptJestExtractTestsFromASTService } from '../../../services';

export function makeJavaJUnitExtractTestsFromASTService() {
  return new JavaJUnitExtractTestsFromASTService(
    new FindAllClassDeclarationsService(),
    new FindAllFunctionOrMethodDeclarationsService(),
    new FindAllFunctionOrMethodInvocationsService(),
    new GetLiteralValueService(),
  );
}

export function makeJavascriptJestExtractTestsFromAST() {
  return new JavascriptJestExtractTestsFromASTService(
    new FindAllFunctionOrMethodInvocationsService(),
    new GetLiteralValueService(),
    new IsAInsideOfBService()
  );
}
