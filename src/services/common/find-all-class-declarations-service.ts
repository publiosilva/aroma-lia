import { AnnotationModel, ASTNodeModel, ClassDeclarationModel } from '../../domain/models';
import { FindAllClassDeclarations } from '../../domain/usecases';

export class FindAllClassDeclarationService implements FindAllClassDeclarations {
  execute(node: ASTNodeModel): ClassDeclarationModel[] {
    const classDeclarations: ClassDeclarationModel[] = []

    if (node.type === 'class_declaration') {
      const annotations = this.extractAnnotations(node);
      const classBody = node?.children.find(({ type }) => type === 'class_body');
      const identifier = node?.children.find(({ type }) => type === 'identifier')?.value || '';

      classDeclarations.push({
        annotations,
        classBody,
        identifier,
        node,
      });
    }

    const childrenClassDeclarations: ClassDeclarationModel[] = node.children.reduce((prev: ClassDeclarationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)]
    }, []);

    return [...classDeclarations, ...childrenClassDeclarations];
  }

  private extractAnnotations(node: ASTNodeModel): AnnotationModel[] {
    const modifiers = node?.children.find(({ type }) => type === 'modifiers');
    const annotations = modifiers?.children.filter(({ type }) => type === 'annotation');

    return annotations?.map((annotation) => {
      return {
        node: annotation,
        identifier: annotation?.children.find(({ type }) => type === 'identifier')?.value || ''
      }
    }) || [];
  }
}
