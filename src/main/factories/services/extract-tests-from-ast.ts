import { ExtractTestsFromAST } from '../../../domain/usecases';
import { ExtractTestsFromCSharpXUnitASTService, ExtractTestsFromJavaJUnitASTService, ExtractTestsFromPythonUnittestASTService, FindAllClassDeclarationsService, FindAllFunctionOrMethodDeclarationsService, FindAllFunctionOrMethodInvocationsService, GetLiteralValueService } from '../../../services';

export function makeExtractTestsFromCSharpXUnitASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromCSharpXUnitASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService()
  );
}

export function makeExtractTestsFromJavaJUnitASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromJavaJUnitASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService()
  );
}

export function makeExtractTestsFromPythonUnittestASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromPythonUnittestASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService()
  );
}
