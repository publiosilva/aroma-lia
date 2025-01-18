import { ASTNodeModel, DecoratorModel, FunctionOrMethodDeclarationModel } from '../../domain/models';
import { FindAllFunctionOrMethodDeclarations } from '../../domain/usecases';

export class FindAllFunctionOrMethodDeclarationsService implements FindAllFunctionOrMethodDeclarations {
  execute(node: ASTNodeModel): FunctionOrMethodDeclarationModel[] {
    const methodDeclarations: FunctionOrMethodDeclarationModel[] = []

    if (['function_definition', 'method_declaration'].includes(node.type)) {
      const decorators = this.extractDecorators(node);
      const identifier = node?.children.find(({ type }) => type === 'identifier')?.value || '';

      methodDeclarations.push({ decorators, identifier, node });
    }

    const childrenMethodDeclarations: FunctionOrMethodDeclarationModel[] = node.children.reduce((prev: FunctionOrMethodDeclarationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)]
    }, []);

    return [...methodDeclarations, ...childrenMethodDeclarations];
  }

  private extractDecorators(node: ASTNodeModel): DecoratorModel[] {
    const decorators: DecoratorModel[] = [];
    const modifiers = node?.children.find(({ type }) => type === 'modifiers');

    if (modifiers) {
      const markerAnnotations = modifiers?.children.filter(({ type }) => type === 'marker_annotation');

      markerAnnotations.forEach((markerAnnotation) => {
        decorators.push({
          identifier: markerAnnotation?.children.find(({ type }) => type === 'identifier')?.value || '',
          node: markerAnnotation,
        });
      });
    }

    const attributeList = node?.children.find(({ type }) => type === 'attribute_list');

    if (attributeList) {
      const attributes = attributeList?.children.filter(({ type }) => type === 'attribute');

      attributes.forEach((attribute) => {
        decorators.push({
          identifier: attribute?.children.find(({ type }) => type === 'identifier')?.value || '',
          node: attribute,
        });
      });
    }

    return decorators;
  }
}
