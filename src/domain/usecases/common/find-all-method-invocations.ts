import { ASTNodeModel, FunctionOrMethodInvocationModel } from '../../models';

export interface FindAllMethodInvocations {
  execute(node: ASTNodeModel): FunctionOrMethodInvocationModel[];
}
