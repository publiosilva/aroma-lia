import { ASTNodeModel, InvocationModel } from '../models';

export interface FindAllFunctionInvocations {
  execute(node: ASTNodeModel): InvocationModel[];
}
