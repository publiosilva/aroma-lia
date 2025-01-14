import { ASTNodeModel, FunctionOrMethodInvocationModel } from '../../models';

export interface FindAllFunctionInvocations {
  execute(node: ASTNodeModel): FunctionOrMethodInvocationModel[];
}
