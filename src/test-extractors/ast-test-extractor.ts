interface ASTNode {
  children: ASTNode[];
  span: number[];
  type: string;
  value: string;
}

interface ASTProgram {
  children: ASTNode[];
  span: number[];
  type: string;
  value: string;
}

interface ASTImportDeclaration extends ASTNode {
  type: "import_declaration";
  value: string;
}

interface ASTScopedIdentifier extends ASTNode {
  type: "scoped_identifier";
  value: string;
}

interface ASTIdentifier extends ASTNode {
  type: "identifier";
  value: string;
}

interface ASTImport extends ASTNode {
  type: "import";
  value: string;
}

interface ASTStatic extends ASTNode {
  type: "static";
  value: string;
}

interface ASTClass extends ASTNode {
  type: "class";
  value: string;
}

interface ASTModifiers extends ASTNode {
  type: "modifiers";
  value: string;
}

interface ASTAnnotation extends ASTNode {
  type: "annotation";
  value: string;
}

interface ASTAnnotationArgumentList extends ASTNode {
  type: "annotation_argument_list";
  value: string;
}

interface ASTPublic extends ASTNode {
  type: "public";
  value: string;
}

interface ASTVoidType extends ASTNode {
  type: "void_type";
  value: string;
}

interface ASTMarkerAnnotation extends ASTNode {
  type: "marker_annotation";
  value: string;
}

interface ASTExpressionStatement extends ASTNode {
  type: "expression_statement";
  value: string;
}

interface ASTLocalVariableDeclaration extends ASTNode {
  type: "local_variable_declaration";
  value: string;
}

interface ASTThrows extends ASTNode {
  type: "throws";
  value: string;
}

interface ASTFormalParameters extends ASTNode {
  type: "formal_parameters";
  value: string;
}

interface ASTBlock extends ASTNode {
  type: "block";
  value: string;
}

interface ASTAsterisk extends ASTNode {
  type: "asterisk";
  value: string;
}

interface ASTFieldAccess extends ASTNode {
  type: "field_access";
  value: string;
}

interface ASTObjectCreationExpression extends ASTNode {
  type: "object_creation_expression";
  value: string;
}

interface ASTMethodInvocation extends ASTNode {
  type: "method_invocation";
  value: string;
}

interface ASTArgumentList extends ASTNode {
  type: "argument_list";
  value: string;
}

interface ASTFile extends ASTNode {
  type: "File";
  value: string;
}

interface ASTDecimalIntegerLiteral extends ASTNode {
  type: "decimal_integer_literal";
  value: string;
}

interface ASTStringLiteral extends ASTNode {
  type: "string_literal";
  value: string;
}

interface Test {
  name: string;
  asserts: TestAssert[];
  annotations?: TestAnnotation[];
}

interface TestAssert {
  literalActual?: string;
  matcher?: string;
  literalExpected?: string;
  message?: string;
}

interface TestAnnotation {
  name: string;
  value?: string;
}

interface ASTTestExtractor {
  extract(ast: ASTProgram): Test[];
}

export {
  ASTAnnotation,
  ASTAnnotationArgumentList,
  ASTArgumentList,
  ASTAsterisk,
  ASTBlock,
  ASTClass,
  ASTDecimalIntegerLiteral,
  ASTExpressionStatement,
  ASTFieldAccess,
  ASTFile,
  ASTFormalParameters,
  ASTIdentifier,
  ASTImport,
  ASTImportDeclaration,
  ASTLocalVariableDeclaration,
  ASTMarkerAnnotation,
  ASTMethodInvocation,
  ASTModifiers,
  ASTNode,
  ASTObjectCreationExpression,
  ASTProgram,
  ASTPublic,
  ASTScopedIdentifier,
  ASTStatic,
  ASTStringLiteral,
  ASTTestExtractor,
  ASTThrows,
  ASTVoidType,
  Test,
  TestAnnotation,
  TestAssert
};
