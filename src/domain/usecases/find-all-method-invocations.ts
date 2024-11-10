import { ASTNodeModel, InvocationModel } from '../models';

export interface FindAllMethodInvocations {
  execute(node: ASTNodeModel): InvocationModel[];
}
