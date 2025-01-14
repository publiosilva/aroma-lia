import { AnnotationModel } from './annotation';
import { ASTNodeModel } from './ast';

export interface FunctionOrMethodDeclarationModel {
  annotations?: AnnotationModel[],
  identifier: string,
  node: ASTNodeModel,
}
