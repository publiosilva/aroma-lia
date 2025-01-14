import { ASTNodeModel, FunctionOrMethodInvocationModel } from '../../domain/models';
import { FindAllFunctionInvocations } from '../../domain/usecases';

export class FindAllFunctionInvocationsService implements FindAllFunctionInvocations {
  execute(node: ASTNodeModel): FunctionOrMethodInvocationModel[] {
    const functionInvocations: FunctionOrMethodInvocationModel[] = []

    if (node.type === 'expression_statement') {
      const callExpressionNode = node.children.find(({ type }) => ['call_expression'].includes(type));

      if (callExpressionNode) {
        functionInvocations.push(this.extractCallExpressionData(callExpressionNode));
      }
    }

    const childrenFunctionInvocations: FunctionOrMethodInvocationModel[] = node.children.reduce((prev: FunctionOrMethodInvocationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)]
    }, []);

    return [...functionInvocations, ...childrenFunctionInvocations];
  }

  private extractCallExpressionData(
    node: ASTNodeModel,
    identifierQueue: string[] = [],
    parameterListNodesQueue: (ASTNodeModel | undefined)[] = []
  ): FunctionOrMethodInvocationModel {
    const memberExpressionNode = node?.children.find((c) => c.type === 'member_expression');

    if (memberExpressionNode) {
      identifierQueue.push(memberExpressionNode.children.find(({ type }) => type === 'property_identifier')?.value || '');
      parameterListNodesQueue.push(node.children.find(({ type }) => type === 'arguments'));

      const chainedCallExpressionNode = memberExpressionNode.children.find(({ type }) => type === 'call_expression');
      const chained = chainedCallExpressionNode ? this.extractCallExpressionData(chainedCallExpressionNode, identifierQueue, parameterListNodesQueue) : undefined;

      const identifier = identifierQueue.shift() || '';
      const parameterListNode = parameterListNodesQueue.shift();
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { chained, identifier, node, parameterListNode, parameterNodes }
    } else {
      identifierQueue.push(node.children.find(({ type }) => type === 'identifier')?.value || '');
      parameterListNodesQueue.push(node.children.find(({ type }) => type === 'arguments'));

      const identifier = identifierQueue.shift() || '';
      const parameterListNode = parameterListNodesQueue.shift();
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { identifier, node, parameterListNode, parameterNodes };
    }
  }
}
