import { ASTModel, TestModel } from '../models';

export interface ExtractTestsFromAST {
  execute(ast: ASTModel): TestModel[];
}
