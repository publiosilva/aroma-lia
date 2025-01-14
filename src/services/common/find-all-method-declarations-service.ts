import { AnnotationModel, ASTNodeModel, FunctionOrMethodDeclarationModel } from '../../domain/models';
import { FindAllMethodDeclarations } from '../../domain/usecases';

export class FindAllMethodDeclarationsService implements FindAllMethodDeclarations {
  execute(node: ASTNodeModel): FunctionOrMethodDeclarationModel[] {
    const methodDeclarations: FunctionOrMethodDeclarationModel[] = []

    if (node.type === 'method_declaration') {
      const annotations = this.extractAnnotations(node);
      const identifier = node?.children.find(({ type }) => type === 'identifier')?.value || '';

      methodDeclarations.push({ annotations, identifier, node });
    }

    const childrenMethodDeclarations: FunctionOrMethodDeclarationModel[] = node.children.reduce((prev: FunctionOrMethodDeclarationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)]
    }, []);

    return [...methodDeclarations, ...childrenMethodDeclarations];
  }

  private extractAnnotations(node: ASTNodeModel): AnnotationModel[] {
    const modifiers = node?.children.find(({ type }) => type === 'modifiers');
    const annotations = modifiers?.children.filter(({ type }) => type === 'marker_annotation');

    return annotations?.map((annotation) => {
      return {
        node: annotation,
        identifier: annotation?.children.find(({ type }) => type === 'identifier')?.value || ''
      }
    }) || [];
  }
}
