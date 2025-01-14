import { AnnotationModel } from './annotation';
import { ASTNodeModel } from './ast';

export interface ClassDeclarationModel {
  annotations?: AnnotationModel[],
  classBody?: ASTNodeModel,
  identifier: string,
  node: ASTNodeModel,
}
