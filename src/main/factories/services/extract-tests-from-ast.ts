import { FindAllFunctionInvocationsService, FindAllMethodInvocationsService, GetLiteralValueService, IsAInsideOfBService, JavaJUnitExtractTestsFromASTService, JavascriptJestExtractTestsFromASTService } from '../../../services';

export function makeJavaJUnitExtractTestsFromASTService() {
  return new JavaJUnitExtractTestsFromASTService(
    new FindAllMethodInvocationsService(),
    new GetLiteralValueService()
  );
}

export function makeJavascriptJestExtractTestsFromAST() {
  return new JavascriptJestExtractTestsFromASTService(
    new FindAllFunctionInvocationsService(),
    new GetLiteralValueService(),
    new IsAInsideOfBService()
  );
}
