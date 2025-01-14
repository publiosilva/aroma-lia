import { ASTNodeModel, FunctionOrMethodDeclarationModel } from '../models';

export interface FindAllMethodDeclarations {
  execute(node: ASTNodeModel): FunctionOrMethodDeclarationModel[];
}
