import { ASTNodeModel, InvocationModel } from '../domain/models';
import { FindAllMethodInvocations } from '../domain/usecases';

export class FindAllMethodInvocationsService implements FindAllMethodInvocations {
  execute(node: ASTNodeModel): InvocationModel[] {
    const methodInvocations: {
      identifier: string,
      node: ASTNodeModel,
      parameterListNode?: ASTNodeModel,
      parameterNodes?: ASTNodeModel[],
    }[] = []

    if (node.type === 'expression_statement') {
      const methodInvocationChild = node.children.find(({ type }) => ['method_invocation'].includes(type));

      if (methodInvocationChild) {
        const identifier = methodInvocationChild.children.find(({ type }) => type === 'identifier')?.value || '';
        const parameterListNode = methodInvocationChild.children.find(({ type }) => ['argument_list'].includes(type));
        const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

        methodInvocations.push({ identifier, node, parameterListNode, parameterNodes });
      }
    }

    const childrenMethodInvocations: InvocationModel[] = node.children.reduce((prev: InvocationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)]
    }, []);

    return [...methodInvocations, ...childrenMethodInvocations];
  }
}
