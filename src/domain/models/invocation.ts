import { ASTNodeModel } from './ast';

export interface InvocationModel {
  chained?: InvocationModel,
  identifier: string,
  node: ASTNodeModel,
  parameterListNode?: ASTNodeModel,
  parameterNodes?: ASTNodeModel[],
}
