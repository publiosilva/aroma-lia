import { ASTNodeModel } from '../domain/models';

export type MethodOrFunctionInvocation = {
  chained?: MethodOrFunctionInvocation,
  identifier: string,
  node: ASTNodeModel,
  parameterListNode?: ASTNodeModel,
  parameterNodes?: ASTNodeModel[],
}

export type VariableDeclararion = {
  identifier: string,
  node: ASTNodeModel,
  valueNode?: ASTNodeModel,
  typeChild?: ASTNodeModel,
}

/**
 * 
 * call_expression => [identifier, arguments]
 * call_expression => [member_expression, arguments]
 * member_expression => [call_expression, ., property_identifier]
 * member_expression => [member_expression, ., property_identifier]
 */

export function findAllMethodInvocations(node: ASTNodeModel): MethodOrFunctionInvocation[] {
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

  const childrenMethodInvocations: MethodOrFunctionInvocation[] = node.children.reduce((prev: MethodOrFunctionInvocation[], curr: ASTNodeModel) => {
    return [...prev, ...findAllMethodInvocations(curr)]
  }, []);

  return [...methodInvocations, ...childrenMethodInvocations];
}

export function findAllFunctionInvocations(node: ASTNodeModel): MethodOrFunctionInvocation[] {
  const functionInvocations: MethodOrFunctionInvocation[] = []

  if (node.type === 'expression_statement') {
    const callExpressionNode = node.children.find(({ type }) => ['call_expression'].includes(type));

    if (callExpressionNode) {
      functionInvocations.push(extractCallExpressionData(callExpressionNode));
    }
  }

  const childrenFunctionInvocations: MethodOrFunctionInvocation[] = node.children.reduce((prev: MethodOrFunctionInvocation[], curr: ASTNodeModel) => {
    return [...prev, ...findAllFunctionInvocations(curr)]
  }, []);

  return [...functionInvocations, ...childrenFunctionInvocations];
}

function extractCallExpressionData(
  node: ASTNodeModel,
  identifierQueue: string[] = [],
  parameterListNodesQueue: (ASTNodeModel | undefined)[] = []
): MethodOrFunctionInvocation {
  const memberExpressionNode = node?.children.find((c) => c.type === 'member_expression');

  if (memberExpressionNode) {
    identifierQueue.push(memberExpressionNode.children.find(({ type }) => type === 'property_identifier')?.value || '');
    parameterListNodesQueue.push(node.children.find(({ type }) => type === 'arguments'));

    const chainedCallExpressionNode = memberExpressionNode.children.find(({ type }) => type === 'call_expression');
    const chained = chainedCallExpressionNode ? extractCallExpressionData(chainedCallExpressionNode, identifierQueue, parameterListNodesQueue) : undefined;

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

export function findAllLocalVariableDeclarations(node: ASTNodeModel): VariableDeclararion[] {
  const localVariableDeclarations: VariableDeclararion[] = []

  if (['variable_declarator', 'local_variable_declaration'].includes(node.type)) {
    const [typeChild, declarationChild] = node.children;
    const identifier = declarationChild?.children.find(({ type }) => type === 'identifier')?.value || '';
    const valueNode = declarationChild?.children[1]?.type === '=' ? declarationChild?.children[2] : undefined;

    localVariableDeclarations.push({ identifier, node, valueNode, typeChild });
  }

  const childrenLocalVariableDeclarations: VariableDeclararion[] = node.children.reduce((prev: VariableDeclararion[], curr: ASTNodeModel) => {
    return [...prev, ...findAllLocalVariableDeclarations(curr)]
  }, []);

  return [...localVariableDeclarations, ...childrenLocalVariableDeclarations];
}

export function isInsideOf(nodeA: ASTNodeModel, nodeB: ASTNodeModel): boolean {
  return nodeA.span[0] >= nodeB.span[0] &&
    nodeA.span[2] <= nodeB.span[2];
}

export function getLiteralValue(node: ASTNodeModel): string {
  return node.value + node.children.reduce((prev, curr) => {
    return prev + getLiteralValue(curr);
  }, '');
}
