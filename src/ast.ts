/**
 * Abstract syntax tree representing a source file once parsed.
 * @module ast
 *//***/

import {
  CommonFlags,
  PATH_DELIMITER,
  STATIC_DELIMITER,
  INSTANCE_DELIMITER,
  LIBRARY_PREFIX
} from "./program";

import {
  Token,
  Tokenizer,
  Range
} from "./tokenizer";

import {
  normalizePath,
  resolvePath
} from "./util";

export { Token, Range };

/** Indicates the kind of a node. */
export enum NodeKind {

  SOURCE,

  // types
  TYPE,
  TYPEPARAMETER,
  PARAMETER,
  SIGNATURE,

  // expressions
  IDENTIFIER,
  ASSERTION,
  BINARY,
  CALL,
  COMMA,
  ELEMENTACCESS,
  FALSE,
  FUNCTION,
  LITERAL,
  NEW,
  NULL,
  PARENTHESIZED,
  PROPERTYACCESS,
  TERNARY,
  SUPER,
  THIS,
  TRUE,
  CONSTRUCTOR,
  UNARYPOSTFIX,
  UNARYPREFIX,

  // statements
  BLOCK,
  BREAK,
  CONTINUE,
  DO,
  EMPTY,
  EXPORT,
  EXPORTIMPORT,
  EXPRESSION,
  FOR,
  IF,
  IMPORT,
  RETURN,
  SWITCH,
  THROW,
  TRY,
  VARIABLE,
  VOID,
  WHILE,

  // declaration statements
  CLASSDECLARATION,
  ENUMDECLARATION,
  ENUMVALUEDECLARATION,
  FIELDDECLARATION,
  FUNCTIONDECLARATION,
  IMPORTDECLARATION,
  INTERFACEDECLARATION,
  METHODDECLARATION,
  NAMESPACEDECLARATION,
  TYPEDECLARATION,
  VARIABLEDECLARATION,

  // special
  DECORATOR,
  EXPORTMEMBER,
  SWITCHCASE,
  COMMENT
}

/** Base class of all nodes. */
export abstract class Node {

  /** Node kind indicator. */
  kind: NodeKind;
  /** Source range. */
  range: Range;
  /** Parent node. */
  parent: Node | null = null;
  /** Common flags indicating specific traits. */
  flags: CommonFlags = CommonFlags.NONE;

  /** Tests if this node has the specified flag or flags. */
  is(flag: CommonFlags): bool { return (this.flags & flag) == flag; }
  /** Tests if this node has one of the specified flags. */
  isAny(flag: CommonFlags): bool { return (this.flags & flag) != 0; }
  /** Sets a specific flag or flags. */
  set(flag: CommonFlags): void { this.flags |= flag; }

  // types

  static createType(
    name: IdentifierExpression,
    typeArguments: CommonTypeNode[] | null,
    isNullable: bool,
    range: Range
  ): TypeNode {
    var type = new TypeNode();
    type.range = range;
    type.name = name; name.parent = type;
    type.typeArguments = typeArguments; if (typeArguments) setParent(typeArguments, type);
    type.isNullable = isNullable;
    return type;
  }

  static createOmittedType(
    range: Range
  ): TypeNode {
    return Node.createType(
      Node.createIdentifierExpression("", range),
      null,
      false,
      range
    );
  }

  static createTypeParameter(
    name: IdentifierExpression,
    extendsType: TypeNode | null,
    range: Range
  ): TypeParameterNode {
    var elem = new TypeParameterNode();
    elem.range = range;
    elem.name = name; name.parent = elem;
    elem.extendsType = extendsType; if (extendsType) extendsType.parent = elem;
    return elem;
  }

  static createParameter(
    name: IdentifierExpression,
    type: CommonTypeNode,
    initializer: Expression | null,
    kind: ParameterKind,
    range: Range
  ): ParameterNode {
    var elem = new ParameterNode();
    elem.range = range;
    elem.name = name; name.parent = elem;
    elem.type = type; if (type) type.parent = elem;
    elem.initializer = initializer; if (initializer) initializer.parent = elem;
    elem.parameterKind = kind;
    return elem;
  }

  static createSignature(
    parameters: ParameterNode[],
    returnType: CommonTypeNode,
    explicitThisType: TypeNode | null,
    isNullable: bool,
    range: Range
  ): SignatureNode {
    var sig = new SignatureNode();
    sig.range = range;
    sig.parameterTypes = parameters; setParent(parameters, sig);
    sig.returnType = returnType; returnType.parent = sig;
    sig.explicitThisType = explicitThisType; if (explicitThisType) explicitThisType.parent = sig;
    sig.isNullable = isNullable;
    return sig;
  }

  // special

  static createDecorator(
    expression: Expression,
    args: Expression[] | null,
    range: Range
  ): DecoratorNode {
    var stmt = new DecoratorNode();
    stmt.range = range;
    stmt.name = expression; expression.parent = stmt;
    stmt.arguments = args; if (args) setParent(args, stmt);
    stmt.decoratorKind = expression.kind == NodeKind.IDENTIFIER
      ? stringToDecoratorKind((<IdentifierExpression>expression).text)
      : DecoratorKind.CUSTOM;
    return stmt;
  }

  static createComment(
    text: string,
    kind: CommentKind,
    range: Range
  ): CommentNode {
    var node = new CommentNode();
    node.range = range;
    node.commentKind = kind;
    node.text = text;
    return node;
  }

  // expressions

  static createIdentifierExpression(
    name: string,
    range: Range
  ): IdentifierExpression {
    var expr = new IdentifierExpression();
    expr.range = range;
    expr.text = name;
    return expr;
  }

  static createEmptyIdentifierExpression(
    range: Range
  ): IdentifierExpression {
    var expr = new IdentifierExpression();
    expr.range = range;
    expr.text = "";
    return expr;
  }

  static createArrayLiteralExpression(
    elements: (Expression | null)[],
    range: Range
  ): ArrayLiteralExpression {
    var expr = new ArrayLiteralExpression();
    expr.range = range;
    expr.elementExpressions = elements; setParentIfNotNull(elements, expr);
    return expr;
  }

  static createAssertionExpression(
    assertionKind: AssertionKind,
    expression: Expression,
    toType: CommonTypeNode,
    range: Range
  ): AssertionExpression {
    var expr = new AssertionExpression();
    expr.range = range;
    expr.assertionKind = assertionKind;
    expr.expression = expression; expression.parent = expr;
    expr.toType = toType; toType.parent = expr;
    return expr;
  }

  static createBinaryExpression(
    operator: Token,
    left: Expression,
    right: Expression,
    range: Range
  ): BinaryExpression {
    var expr = new BinaryExpression();
    expr.range = range;
    expr.operator = operator;
    expr.left = left; left.parent = expr;
    expr.right = right; right.parent = expr;
    return expr;
  }

  static createCallExpression(
    expression: Expression,
    typeArgs: CommonTypeNode[] | null,
    args: Expression[],
    range: Range
  ): CallExpression {
    var expr = new CallExpression();
    expr.range = range;
    expr.expression = expression; expression.parent = expr;
    expr.typeArguments = typeArgs; if (typeArgs) setParent(typeArgs, expr);
    expr.arguments = args; setParent(args, expr);
    return expr;
  }

  static createCommaExpression(
    expressions: Expression[],
    range: Range
  ): CommaExpression {
    var expr = new CommaExpression();
    expr.range = range;
    expr.expressions = expressions; setParent(expressions, expr);
    return expr;
  }

  static createConstructorExpression(
    range: Range
  ): ConstructorExpression {
    var expr = new ConstructorExpression();
    expr.range = range;
    return expr;
  }

  static createElementAccessExpression(
    expression: Expression,
    element: Expression,
    range: Range
  ): ElementAccessExpression {
    var expr = new ElementAccessExpression();
    expr.range = range;
    expr.expression = expression; expression.parent = expr;
    expr.elementExpression = element; element.parent = expr;
    return expr;
  }

  static createFalseExpression(
    range: Range
  ): FalseExpression {
    var expr = new FalseExpression();
    expr.range = range;
    return expr;
  }

  static createFloatLiteralExpression(
    value: f64,
    range: Range
  ): FloatLiteralExpression {
    var expr = new FloatLiteralExpression();
    expr.range = range;
    expr.value = value;
    return expr;
  }

  static createFunctionExpression(
    declaration: FunctionDeclaration
  ): FunctionExpression {
    var expr = new FunctionExpression();
    expr.flags = declaration.flags & CommonFlags.ARROW;
    expr.range = declaration.range;
    expr.declaration = declaration;
    return expr;
  }

  static createIntegerLiteralExpression(
    value: I64,
    range: Range
  ): IntegerLiteralExpression {
    var expr = new IntegerLiteralExpression();
    expr.range = range;
    expr.value = value;
    return expr;
  }

  static createNewExpression(
    expression: Expression,
    typeArgs: CommonTypeNode[] | null,
    args: Expression[],
    range: Range
  ): NewExpression {
    var expr = new NewExpression();
    expr.range = range;
    expr.expression = expression; expression.parent = expr;
    expr.typeArguments = typeArgs; if (typeArgs) setParent(typeArgs, expr);
    expr.arguments = args; setParent(args, expr);
    return expr;
  }

  static createNullExpression(
    range: Range
  ): NullExpression {
    var expr = new NullExpression();
    expr.range = range;
    return expr;
  }

  static createParenthesizedExpression(
    expression: Expression,
    range: Range
  ): ParenthesizedExpression {
    var expr = new ParenthesizedExpression();
    expr.range = range;
    expr.expression = expression; expression.parent = expr;
    return expr;
  }

  static createPropertyAccessExpression(
    expression: Expression,
    property: IdentifierExpression,
    range: Range
  ): PropertyAccessExpression {
    var expr = new PropertyAccessExpression();
    expr.range = range;
    expr.expression = expression; expression.parent = expr;
    expr.property = property; property.parent = expr;
    return expr;
  }

  static createRegexpLiteralExpression(
    pattern: string,
    flags: string,
    range: Range
  ): RegexpLiteralExpression {
    var expr = new RegexpLiteralExpression();
    expr.range = range;
    expr.pattern = pattern;
    expr.patternFlags = flags;
    return expr;
  }

  static createTernaryExpression(
    condition: Expression,
    ifThen: Expression,
    ifElse: Expression,
    range: Range
  ): TernaryExpression {
    var expr = new TernaryExpression();
    expr.range = range;
    expr.condition = condition; condition.parent = expr;
    expr.ifThen = ifThen; ifThen.parent = expr;
    expr.ifElse = ifElse; ifElse.parent = expr;
    return expr;
  }

  static createStringLiteralExpression(
    value: string,
    range: Range
  ): StringLiteralExpression {
    var expr = new StringLiteralExpression();
    expr.range = range;
    expr.value = value;
    return expr;
  }

  static createSuperExpression(
    range: Range
  ): SuperExpression {
    var expr = new SuperExpression();
    expr.range = range;
    return expr;
  }

  static createThisExpression(
    range: Range
  ): ThisExpression {
    var expr = new ThisExpression();
    expr.range = range;
    return expr;
  }

  static createTrueExpression(
    range: Range
  ): TrueExpression {
    var expr = new TrueExpression();
    expr.range = range;
    return expr;
  }

  static createUnaryPostfixExpression(
    operator: Token,
    operand: Expression,
    range: Range
  ): UnaryPostfixExpression {
    var expr = new UnaryPostfixExpression();
    expr.range = range;
    expr.operator = operator;
    expr.operand = operand; operand.parent = expr;
    return expr;
  }

  static createUnaryPrefixExpression(
    operator: Token,
    operand: Expression,
    range: Range
  ): UnaryPrefixExpression {
    var expr = new UnaryPrefixExpression();
    expr.range = range;
    expr.operator = operator;
    expr.operand = operand; operand.parent = expr;
    return expr;
  }

  // statements

  static createBlockStatement(
    statements: Statement[],
    range: Range
  ): BlockStatement {
    var stmt = new BlockStatement();
    stmt.range = range;
    stmt.statements = statements; setParent(statements, stmt);
    return stmt;
  }

  static createBreakStatement(
    label: IdentifierExpression | null,
    range: Range
  ): BreakStatement {
    var stmt = new BreakStatement();
    stmt.range = range;
    stmt.label = label; if (label) label.parent = stmt;
    return stmt;
  }

  static createClassDeclaration(
    identifier: IdentifierExpression,
    typeParameters: TypeParameterNode[],
    extendsType: TypeNode | null, // can't be a function
    implementsTypes: TypeNode[] | null, // can't be functions
    members: DeclarationStatement[],
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): ClassDeclaration {
    var stmt = new ClassDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = identifier; identifier.parent = stmt;
    stmt.typeParameters = typeParameters; setParent(typeParameters, stmt);
    stmt.extendsType = extendsType; if (extendsType) extendsType.parent = stmt;
    stmt.implementsTypes = implementsTypes; if (implementsTypes) setParent(implementsTypes, stmt);
    stmt.members = members; setParent(members, stmt);
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createContinueStatement(
    label: IdentifierExpression | null,
    range: Range
  ): ContinueStatement {
    var stmt = new ContinueStatement();
    stmt.range = range;
    stmt.label = label; if (label) label.parent = stmt;
    return stmt;
  }

  static createDoStatement(
    statement: Statement,
    condition: Expression,
    range: Range
  ): DoStatement {
    var stmt = new DoStatement();
    stmt.range = range;
    stmt.statement = statement; statement.parent = stmt;
    stmt.condition = condition; condition.parent = stmt;
    return stmt;
  }

  static createEmptyStatement(
    range: Range
  ): EmptyStatement {
    var stmt = new EmptyStatement();
    stmt.range = range;
    return stmt;
  }

  static createEnumDeclaration(
    name: IdentifierExpression,
    members: EnumValueDeclaration[],
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): EnumDeclaration {
    var stmt = new EnumDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.values = members; setParent(members, stmt);
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createEnumValueDeclaration(
    name: IdentifierExpression,
    value: Expression | null,
    flags: CommonFlags,
    range: Range
  ): EnumValueDeclaration {
    var stmt = new EnumValueDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.value = value; if (value) value.parent = stmt;
    return stmt;
  }

  static createExportStatement(
    members: ExportMember[],
    path: StringLiteralExpression | null,
    flags: CommonFlags,
    range: Range
  ): ExportStatement {
    var stmt = new ExportStatement();
    stmt.range = range;
    stmt.flags = flags;
    stmt.members = members; setParent(members, stmt);
    stmt.path = path;
    if (path) {
      let normalizedPath = normalizePath(path.value);
      if (path.value.startsWith(".")) { // relative
        stmt.normalizedPath = resolvePath(
          normalizedPath,
          range.source.normalizedPath
        );
      } else { // absolute
        stmt.normalizedPath = normalizedPath;
      }
      stmt.internalPath = mangleInternalPath(stmt.normalizedPath);
    } else {
      stmt.normalizedPath = null;
      stmt.internalPath = null;
    }
    return stmt;
  }

  static createExportImportStatement(
    name: IdentifierExpression,
    externalName: IdentifierExpression,
    range: Range
  ): ExportImportStatement {
    var stmt = new ExportImportStatement();
    stmt.range = range;
    stmt.name = name; name.parent = stmt;
    stmt.externalName = externalName; externalName.parent = stmt;
    return stmt;
  }

  static createExportMember(
    name: IdentifierExpression,
    externalName: IdentifierExpression | null,
    range: Range
  ): ExportMember {
    var elem = new ExportMember();
    elem.range = range;
    elem.name = name; name.parent = elem;
    if (!externalName) {
      externalName = name;
    } else {
      externalName.parent = elem;
    }
    elem.externalName = externalName;
    return elem;
  }

  static createExpressionStatement(
    expression: Expression
  ): ExpressionStatement {
    var stmt = new ExpressionStatement();
    stmt.range = expression.range;
    stmt.expression = expression; expression.parent = stmt;
    return stmt;
  }

  static createIfStatement(
    condition: Expression,
    ifTrue: Statement,
    ifFalse: Statement | null,
    range: Range
  ): IfStatement {
    var stmt = new IfStatement();
    stmt.range = range;
    stmt.condition = condition; condition.parent = stmt;
    stmt.ifTrue = ifTrue; ifTrue.parent = stmt;
    stmt.ifFalse = ifFalse; if (ifFalse) ifFalse.parent = stmt;
    return stmt;
  }

  static createImportStatement(
    decls: ImportDeclaration[] | null,
    path: StringLiteralExpression,
    range: Range
  ): ImportStatement {
    var stmt = new ImportStatement();
    stmt.range = range;
    stmt.declarations = decls; if (decls) setParent(decls, stmt);
    stmt.namespaceName = null;
    stmt.path = path;
    var normalizedPath = normalizePath(path.value);
    if (path.value.startsWith(".")) { // relative in project
      stmt.normalizedPath = resolvePath(
        normalizedPath,
        range.source.normalizedPath
      );
    } else { // absolute in library
      if (!normalizedPath.startsWith(LIBRARY_PREFIX)) {
        normalizedPath = LIBRARY_PREFIX + normalizedPath;
      }
      stmt.normalizedPath = normalizedPath;
    }
    stmt.internalPath = mangleInternalPath(stmt.normalizedPath);
    return stmt;
  }

  static createImportStatementWithWildcard(
    identifier: IdentifierExpression,
    path: StringLiteralExpression,
    range: Range
  ): ImportStatement {
    var stmt = new ImportStatement();
    stmt.range = range;
    stmt.declarations = null;
    stmt.namespaceName = identifier;
    stmt.path = path;
    stmt.normalizedPath = resolvePath(
      normalizePath(path.value),
      range.source.normalizedPath
    );
    stmt.internalPath = mangleInternalPath(stmt.normalizedPath);
    return stmt;
  }

  static createImportDeclaration(
    externalName: IdentifierExpression,
    name: IdentifierExpression | null,
    range: Range
  ): ImportDeclaration {
    var elem = new ImportDeclaration();
    elem.range = range;
    elem.externalName = externalName; externalName.parent = elem;
    if (!name) {
      name = externalName;
    } else {
      name.parent = elem;
    }
    elem.name = name;
    return elem;
  }

  static createInterfaceDeclaration(
    name: IdentifierExpression,
    typeParameters: TypeParameterNode[],
    extendsType: TypeNode | null, // can't be a function
    members: DeclarationStatement[],
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): InterfaceDeclaration {
    var stmt = new InterfaceDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.typeParameters = typeParameters; if (typeParameters) setParent(typeParameters, stmt);
    stmt.extendsType = extendsType; if (extendsType) extendsType.parent = stmt;
    stmt.members = members; setParent(members, stmt);
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createFieldDeclaration(
    name: IdentifierExpression,
    type: CommonTypeNode | null,
    initializer: Expression | null,
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): FieldDeclaration {
    var stmt = new FieldDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.type = type; if (type) type.parent = stmt;
    stmt.initializer = initializer; if (initializer) initializer.parent = stmt;
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createForStatement(
    initializer: Statement | null,
    condition: Expression | null,
    incrementor: Expression | null,
    statement: Statement,
    range: Range
  ): ForStatement {
    var stmt = new ForStatement();
    stmt.range = range;
    stmt.initializer = initializer; if (initializer) initializer.parent = stmt;
    stmt.condition = condition; if (condition) condition.parent = stmt;
    stmt.incrementor = incrementor; if (incrementor) incrementor.parent = stmt;
    stmt.statement = statement; statement.parent = stmt;
    return stmt;
  }

  static createFunctionDeclaration(
    name: IdentifierExpression,
    typeParameters: TypeParameterNode[] | null,
    signature: SignatureNode,
    body: Statement | null,
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): FunctionDeclaration {
    var stmt = new FunctionDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.typeParameters = typeParameters; if (typeParameters) setParent(typeParameters, stmt);
    stmt.signature = signature; signature.parent = stmt;
    stmt.body = body; if (body) body.parent = stmt;
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createMethodDeclaration(
    name: IdentifierExpression,
    typeParameters: TypeParameterNode[] | null,
    signature: SignatureNode,
    body: Statement | null,
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): MethodDeclaration {
    var stmt = new MethodDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.typeParameters = typeParameters; if (typeParameters) setParent(typeParameters, stmt);
    stmt.signature = signature; signature.parent = stmt;
    stmt.body = body; if (body) body.parent = stmt;
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createNamespaceDeclaration(
    name: IdentifierExpression,
    members: Statement[],
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): NamespaceDeclaration {
    var stmt = new NamespaceDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.members = members; setParent(members, stmt);
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createReturnStatement(
    value: Expression | null,
    range: Range
  ): ReturnStatement {
    var stmt = new ReturnStatement();
    stmt.range = range;
    stmt.value = value; if (value) value.parent = stmt;
    return stmt;
  }

  static createSwitchStatement(
    condition: Expression,
    cases: SwitchCase[],
    range: Range
  ): SwitchStatement {
    var stmt = new SwitchStatement();
    stmt.range = range;
    stmt.condition = condition; condition.parent = stmt;
    stmt.cases = cases; setParent(cases, stmt);
    return stmt;
  }

  static createSwitchCase(
    label: Expression | null,
    statements: Statement[],
    range: Range
  ): SwitchCase {
    var elem = new SwitchCase();
    elem.range = range;
    elem.label = label; if (label) label.parent = elem;
    elem.statements = statements; setParent(statements, elem);
    return elem;
  }

  static createThrowStatement(
    value: Expression,
    range: Range
  ): ThrowStatement {
    var stmt = new ThrowStatement();
    stmt.range = range;
    stmt.value = value; value.parent = stmt;
    return stmt;
  }

  static createTryStatement(
    statements: Statement[],
    catchVariable: IdentifierExpression | null,
    catchStatements: Statement[] | null,
    finallyStatements: Statement[] | null,
    range: Range
  ): TryStatement {
    var stmt = new TryStatement();
    stmt.range = range;
    stmt.statements = statements; setParent(statements, stmt);
    stmt.catchVariable = catchVariable;
    if (catchVariable) catchVariable.parent = stmt;
    stmt.catchStatements = catchStatements;
    if (catchStatements) setParent(catchStatements, stmt);
    stmt.finallyStatements = finallyStatements;
    if (finallyStatements) setParent(finallyStatements, stmt);
    return stmt;
  }

  static createTypeDeclaration(
    name: IdentifierExpression,
    typeParameters: TypeParameterNode[] | null,
    alias: CommonTypeNode,
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): TypeDeclaration {
    var stmt = new TypeDeclaration();
    stmt.range = range;
    stmt.flags = flags;
    stmt.name = name; name.parent = stmt;
    stmt.typeParameters = typeParameters; if (typeParameters) setParent(typeParameters, stmt);
    stmt.type = alias; alias.parent = stmt;
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createVariableStatement(
    declarations: VariableDeclaration[],
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): VariableStatement {
    var stmt = new VariableStatement();
    stmt.range = range;
    stmt.flags = flags;
    stmt.declarations = declarations; setParent(declarations, stmt);
    stmt.decorators = decorators; if (decorators) setParent(decorators, stmt);
    return stmt;
  }

  static createVariableDeclaration(
    name: IdentifierExpression,
    type: CommonTypeNode | null,
    initializer: Expression | null,
    decorators: DecoratorNode[] | null,
    flags: CommonFlags,
    range: Range
  ): VariableDeclaration {
    var elem = new VariableDeclaration();
    elem.range = range;
    elem.flags = flags;
    elem.name = name; name.parent = elem;
    elem.type = type; if (type) type.parent = elem;
    elem.initializer = initializer; if (initializer) initializer.parent = elem;
    elem.decorators = decorators; // inherited
    return elem;
  }

  static createVoidStatement(
    expression: Expression,
    range: Range
  ): VoidStatement {
    var stmt = new VoidStatement();
    stmt.range = range;
    stmt.expression = expression;
    return stmt;
  }

  static createWhileStatement(
    condition: Expression,
    statement: Statement,
    range: Range
  ): WhileStatement {
    var stmt = new WhileStatement();
    stmt.range = range;
    stmt.condition = condition; condition.parent = stmt;
    stmt.statement = statement; statement.parent = stmt;
    return stmt;
  }
}

// types

export abstract class CommonTypeNode extends Node {
  // kind varies

  /** Whether nullable or not. */
  isNullable: bool;
}

/** Represents a type annotation. */
export class TypeNode extends CommonTypeNode {
  kind = NodeKind.TYPE;

  /** Identifier reference. */
  name: IdentifierExpression;
  /** Type argument references. */
  typeArguments: CommonTypeNode[] | null;
}

/** Represents a type parameter. */
export class TypeParameterNode extends Node {
  kind = NodeKind.TYPEPARAMETER;

  /** Identifier reference. */
  name: IdentifierExpression;
  /** Extended type reference, if any. */
  extendsType: TypeNode | null; // can't be a function
}

/** Represents the kind of a parameter. */
export enum ParameterKind {
  /** No specific flags. */
  DEFAULT,
  /** Is an optional parameter. */
  OPTIONAL,
  /** Is a rest parameter. */
  REST
}

/** Represents a function parameter. */
export class ParameterNode extends Node {
  kind = NodeKind.PARAMETER;

  /** Parameter kind. */
  parameterKind: ParameterKind;
  /** Parameter name. */
  name: IdentifierExpression;
  /** Parameter type. */
  type: CommonTypeNode;
  /** Initializer expression, if present. */
  initializer: Expression | null;
  /** Implicit field declaration, if applicable. */
  implicitFieldDeclaration: FieldDeclaration | null = null;
}

/** Represents a function signature. */
export class SignatureNode extends CommonTypeNode {
  kind = NodeKind.SIGNATURE;

  /** Accepted parameters. */
  parameterTypes: ParameterNode[];
  /** Return type. */
  returnType: CommonTypeNode;
  /** Explicitly provided this type, if any. */
  explicitThisType: TypeNode | null; // can't be a function
}

// special

/** Built-in decorator kinds. */
export enum DecoratorKind {
  CUSTOM,
  GLOBAL,
  OPERATOR,
  UNMANAGED,
  SEALED,
  INLINE,
  PRECOMPUTE
}

/** Returns the decorator kind represented by the specified string. */
export function stringToDecoratorKind(str: string): DecoratorKind {
  switch (str) {
    case "global": return DecoratorKind.GLOBAL;
    case "operator": return DecoratorKind.OPERATOR;
    case "unmanaged": return DecoratorKind.UNMANAGED;
    case "sealed": return DecoratorKind.SEALED;
    case "inline": return DecoratorKind.INLINE;
    case "precompute": return DecoratorKind.PRECOMPUTE;
    default: return DecoratorKind.CUSTOM;
  }
}

/** Represents a decorator. */
export class DecoratorNode extends Node {
  kind = NodeKind.DECORATOR;

  /** Built-in kind, if applicable. */
  decoratorKind: DecoratorKind;
  /** Name expression. */
  name: Expression;
  /** Argument expressions. */
  arguments: Expression[] | null;
}

/** Comment kinds. */
export enum CommentKind {
  /** Line comment. */
  LINE,
  /** Triple-slash comment. */
  TRIPLE,
  /** Block comment. */
  BLOCK
}

/** Represents a comment. */
export class CommentNode extends Node {
  kind = NodeKind.COMMENT;

  /** Comment kind. */
  commentKind: CommentKind;
  /** Comment text. */
  text: string;
}

// expressions

/** Base class of all expression nodes. */
export abstract class Expression extends Node { }

/** Represents an identifier expression. */
export class IdentifierExpression extends Expression {
  kind = NodeKind.IDENTIFIER;

  /** Textual name. */
  text: string;
}

/** Indicates the kind of a literal. */
export enum LiteralKind {
  FLOAT,
  INTEGER,
  STRING,
  REGEXP,
  ARRAY,
  OBJECT
}

/** Base class of all literal expressions. */
export abstract class LiteralExpression extends Expression {
  kind = NodeKind.LITERAL;

  /** Specific literal kind. */
  literalKind: LiteralKind;
}

/** Represents an `[]` literal expression. */
export class ArrayLiteralExpression extends LiteralExpression {
  literalKind = LiteralKind.ARRAY;

  /** Nested element expressions. */
  elementExpressions: (Expression | null)[];
}

/** Indicates the kind of an assertion. */
export enum AssertionKind {
  PREFIX,
  AS
}

/** Represents an assertion expression. */
export class AssertionExpression extends Expression {
  kind = NodeKind.ASSERTION;

  /** Specific kind of this assertion. */
  assertionKind: AssertionKind;
  /** Expression being asserted. */
  expression: Expression;
  /** Target type. */
  toType: CommonTypeNode;
}

/** Represents a binary expression. */
export class BinaryExpression extends Expression {
  kind = NodeKind.BINARY;

  /** Operator token. */
  operator: Token;
  /** Left-hand side expression */
  left: Expression;
  /** Right-hand side expression. */
  right: Expression;
}

/** Represents a call expression. */
export class CallExpression extends Expression {
  kind = NodeKind.CALL;

  /** Called expression. Usually an identifier or property access expression. */
  expression: Expression;
  /** Provided type arguments. */
  typeArguments: CommonTypeNode[] | null;
  /** Provided arguments. */
  arguments: Expression[];
}

/** Represents a comma expression composed of multiple expressions. */
export class CommaExpression extends Expression {
  kind = NodeKind.COMMA;

  /** Sequential expressions. */
  expressions: Expression[];
}

/** Represents a `constructor` expression. */
export class ConstructorExpression extends IdentifierExpression {
  kind = NodeKind.CONSTRUCTOR;
  text = "constructor";
}

/** Represents an element access expression, e.g., array access. */
export class ElementAccessExpression extends Expression {
  kind = NodeKind.ELEMENTACCESS;

  /** Expression being accessed. */
  expression: Expression;
  /** Element of the expression being accessed. */
  elementExpression: Expression;
}

/** Represents a float literal expression. */
export class FloatLiteralExpression extends LiteralExpression {
  literalKind = LiteralKind.FLOAT;

  /** Float value. */
  value: f64;
}

/** Represents a function expression using the 'function' keyword. */
export class FunctionExpression extends Expression {
  kind = NodeKind.FUNCTION;

  /** Inline function declaration. */
  declaration: FunctionDeclaration;
}

/** Represents an integer literal expression. */
export class IntegerLiteralExpression extends LiteralExpression {
  literalKind = LiteralKind.INTEGER;

  /** Integer value. */
  value: I64;
}

/** Represents a `new` expression. Like a call but with its own kind. */
export class NewExpression extends CallExpression {
  kind = NodeKind.NEW;
}

/** Represents a `null` expression. */
export class NullExpression extends IdentifierExpression {
  kind = NodeKind.NULL;
  text = "null";
}

/** Represents a parenthesized expression. */
export class ParenthesizedExpression extends Expression {
  kind = NodeKind.PARENTHESIZED;

  /** Expression in parenthesis. */
  expression: Expression;
}

/** Represents a property access expression. */
export class PropertyAccessExpression extends Expression {
  kind = NodeKind.PROPERTYACCESS;

  /** Expression being accessed. */
  expression: Expression;
  /** Property of the expression being accessed. */
  property: IdentifierExpression;
}

/** Represents a regular expression literal expression. */
export class RegexpLiteralExpression extends LiteralExpression {
  literalKind = LiteralKind.REGEXP;

  /** Regular expression pattern. */
  pattern: string;
  /** Regular expression flags. */
  patternFlags: string;
}

/** Represents a ternary expression, i.e., short if notation. */
export class TernaryExpression extends Expression {
  kind = NodeKind.TERNARY;

  /** Condition expression. */
  condition: Expression;
  /** Expression executed when condition is `true`. */
  ifThen: Expression;
  /** Expression executed when condition is `false`. */
  ifElse: Expression;
}

/** Represents a string literal expression. */
export class StringLiteralExpression extends LiteralExpression {
  literalKind = LiteralKind.STRING;

  /** String value without quotes. */
  value: string;
}

/** Represents a `super` expression. */
export class SuperExpression extends IdentifierExpression {
  kind = NodeKind.SUPER;
  text = "super";
}

/** Represents a `this` expression. */
export class ThisExpression extends IdentifierExpression {
  kind = NodeKind.THIS;
  text = "this";
}

/** Represents a `true` expression. */
export class TrueExpression extends IdentifierExpression {
  kind = NodeKind.TRUE;
  text = "true";
}

/** Represents a `false` expression. */
export class FalseExpression extends IdentifierExpression {
  kind = NodeKind.FALSE;
  text = "false";
}

/** Base class of all unary expressions. */
export abstract class UnaryExpression extends Expression {

  /** Operator token. */
  operator: Token;
  /** Operand expression. */
  operand: Expression;
}

/** Represents a unary postfix expression, e.g. a postfix increment. */
export class UnaryPostfixExpression extends UnaryExpression {
  kind = NodeKind.UNARYPOSTFIX;
}

/** Represents a unary prefix expression, e.g. a negation. */
export class UnaryPrefixExpression extends UnaryExpression {
  kind = NodeKind.UNARYPREFIX;
}

// statements

/** Base class of all statement nodes. */
export abstract class Statement extends Node { }

/** Indicates the specific kind of a source. */
export enum SourceKind {
  /** Default source. Usually imported from an entry file. */
  DEFAULT,
  /** Entry file. */
  ENTRY,
  /** Library file. */
  LIBRARY
}

/** A top-level source node. */
export class Source extends Node {
  kind = NodeKind.SOURCE;
  parent = null;

  /** Source kind. */
  sourceKind: SourceKind;
  /** Normalized path. */
  normalizedPath: string;
  /** Path used internally. */
  internalPath: string;
  /** Contained statements. */
  statements: Statement[];
  /** Full source text. */
  text: string;
  /** Tokenizer reference. */
  tokenizer: Tokenizer | null = null;
  /** Source map index. */
  debugInfoIndex: i32 = -1;

  /** Constructs a new source node. */
  constructor(normalizedPath: string, text: string, kind: SourceKind) {
    super();
    this.sourceKind = kind;
    this.normalizedPath = normalizedPath;
    this.internalPath = mangleInternalPath(this.normalizedPath);
    this.statements = new Array();
    this.range = new Range(this, 0, text.length);
    this.text = text;
  }

  /** Tests if this source is an entry file. */
  get isEntry(): bool { return this.sourceKind == SourceKind.ENTRY; }
  /** Tests if this source is a stdlib file. */
  get isLibrary(): bool { return this.sourceKind == SourceKind.LIBRARY; }
}

/** Base class of all declaration statements. */
export abstract class DeclarationStatement extends Statement {

  /** Simple name being declared. */
  name: IdentifierExpression;
  /** Array of decorators. */
  decorators: DecoratorNode[] | null = null;

  protected cachedProgramLevelInternalName: string | null = null;
  protected cachedFileLevelInternalName: string | null = null;

  /** Gets the mangled program-level internal name of this declaration. */
  get programLevelInternalName(): string {
    if (!this.cachedProgramLevelInternalName) {
      this.cachedProgramLevelInternalName = mangleInternalName(this, true);
    }
    return this.cachedProgramLevelInternalName;
  }

  /** Gets the mangled file-level internal name of this declaration. */
  get fileLevelInternalName(): string {
    if (!this.cachedFileLevelInternalName) {
      this.cachedFileLevelInternalName = mangleInternalName(this, false);
    }
    return this.cachedFileLevelInternalName;
  }

  /** Tests if this is a top-level declaration within its source file. */
  get isTopLevel(): bool {
    var parent = this.parent;
    if (!parent) {
      return false;
    }
    if (parent.kind == NodeKind.VARIABLE && !(parent = parent.parent)) {
      return false;
    }
    return parent.kind == NodeKind.SOURCE;
  }

  /** Tests if this declaration is a top-level export within its source file. */
  get isTopLevelExport(): bool {
    var parent = this.parent;
    if (!parent || (parent.kind == NodeKind.VARIABLE && !(parent = parent.parent))) {
      return false;
    }
    if (parent.kind == NodeKind.NAMESPACEDECLARATION) {
      return this.is(CommonFlags.EXPORT) && (<NamespaceDeclaration>parent).isTopLevelExport;
    }
    if (parent.kind == NodeKind.CLASSDECLARATION) {
      return this.is(CommonFlags.STATIC) && (<ClassDeclaration>parent).isTopLevelExport;
    }
    return parent.kind == NodeKind.SOURCE && this.is(CommonFlags.EXPORT);
  }

  /** Tests if this declaration needs an explicit export. */
  needsExplicitExport(member: ExportMember): bool {
    // This is necessary because module-level exports are automatically created
    // for top level declarations of all sorts. This function essentially tests
    // that there isn't a otherwise duplicate top-level export already.
    return (
      member.name.text != member.externalName.text || // if aliased
      this.range.source != member.range.source ||     // if a re-export
      !this.isTopLevelExport                          // if not top-level
    );
  }
}

/** Base class of all variable-like declaration statements. */
export abstract class VariableLikeDeclarationStatement extends DeclarationStatement {

  /** Variable type. */
  type: CommonTypeNode | null;
  /** Variable initializer. */
  initializer: Expression | null;
}

/** Represents a block statement. */
export class BlockStatement extends Statement {
  kind = NodeKind.BLOCK;

  /** Contained statements. */
  statements: Statement[];
}

/** Represents a `break` statement. */
export class BreakStatement extends Statement {
  kind = NodeKind.BREAK;

  /** Target label, if applicable. */
  label: IdentifierExpression | null;
}

/** Represents a `class` declaration. */
export class ClassDeclaration extends DeclarationStatement {
  kind = NodeKind.CLASSDECLARATION;

  /** Accepted type parameters. */
  typeParameters: TypeParameterNode[];
  /** Base class type being extended, if any. */
  extendsType: TypeNode | null; // can't be a function
  /** Interface types being implemented, if any. */
  implementsTypes: TypeNode[] | null; // can't be functions
  /** Class member declarations. */
  members: DeclarationStatement[];

  get isGeneric(): bool {
    var typeParameters = this.typeParameters;
    return typeParameters != null && typeParameters.length > 0;
  }
}

/** Represents a `continue` statement. */
export class ContinueStatement extends Statement {
  kind = NodeKind.CONTINUE;

  /** Target label, if applicable. */
  label: IdentifierExpression | null;
}

/** Represents a `do` statement. */
export class DoStatement extends Statement {
  kind = NodeKind.DO;

  /** Statement being looped over. */
  statement: Statement;
  /** Condition when to repeat. */
  condition: Expression;
}

/** Represents an empty statement, i.e., a semicolon terminating nothing. */
export class EmptyStatement extends Statement {
  kind = NodeKind.EMPTY;
}

/** Represents an `enum` declaration. */
export class EnumDeclaration extends DeclarationStatement {
  kind = NodeKind.ENUMDECLARATION;

  /** Enum value declarations. */
  values: EnumValueDeclaration[];
}

/** Represents a value of an `enum` declaration. */
export class EnumValueDeclaration extends DeclarationStatement {
  kind = NodeKind.ENUMVALUEDECLARATION;
  // name is inherited

  /** Value expression. */
  value: Expression | null;
}

/** Represents an `export import` statement of an interface. */
export class ExportImportStatement extends Node {
  kind = NodeKind.EXPORTIMPORT;

  /** Identifier being imported. */
  name: IdentifierExpression;
  /** Identifier being exported. */
  externalName: IdentifierExpression;
}

/** Represents a member of an `export` statement. */
export class ExportMember extends Node {
  kind = NodeKind.EXPORTMEMBER;

  /** Identifier being exported. */
  name: IdentifierExpression;
  /** Identifier seen when imported again. */
  externalName: IdentifierExpression;
}

/** Represents an `export` statement. */
export class ExportStatement extends Statement {
  kind = NodeKind.EXPORT;

  /** Array of members. */
  members: ExportMember[];
  /** Path being exported from, if applicable. */
  path: StringLiteralExpression | null;
  /** Normalized path, if `path` is set. */
  normalizedPath: string | null;
  /** Mangled internal path being referenced, if `path` is set. */
  internalPath: string | null;
}

/** Represents an expression that is used as a statement. */
export class ExpressionStatement extends Statement {
  kind = NodeKind.EXPRESSION;

  /** Expression being used as a statement.*/
  expression: Expression;
}

/** Represents a field declaration within a `class`. */
export class FieldDeclaration extends VariableLikeDeclarationStatement {
  kind = NodeKind.FIELDDECLARATION;

  /** Parameter index within the constructor, if applicable. */
  parameterIndex: i32 = -1;
}

/** Represents a `for` statement. */
export class ForStatement extends Statement {
  kind = NodeKind.FOR;

  /**
   * Initializer statement, if present.
   * Either a {@link VariableStatement} or {@link ExpressionStatement}.
   */
  initializer: Statement | null;
  /** Condition expression, if present. */
  condition: Expression | null;
  /** Incrementor expression, if present. */
  incrementor: Expression | null;
  /** Statement being looped over. */
  statement: Statement;
}

/** Represents a `function` declaration. */
export class FunctionDeclaration extends DeclarationStatement {
  kind = NodeKind.FUNCTIONDECLARATION;

  /** Type parameters, if any. */
  typeParameters: TypeParameterNode[] | null;
  /** Function signature. */
  signature: SignatureNode;
  /** Body statement. Usually a block. */
  body: Statement | null;

  get isGeneric(): bool {
    var typeParameters = this.typeParameters;
    return typeParameters != null && typeParameters.length > 0;
  }
}

/** Represents an `if` statement. */
export class IfStatement extends Statement {
  kind = NodeKind.IF;

  /** Condition. */
  condition: Expression;
  /** Statement executed when condition is `true`. */
  ifTrue: Statement;
  /** Statement executed when condition is `false`. */
  ifFalse: Statement | null;
}

/** Represents an `import` declaration part of an {@link ImportStatement}. */
export class ImportDeclaration extends DeclarationStatement {
  kind = NodeKind.IMPORTDECLARATION;

  /** Identifier being imported. */
  externalName: IdentifierExpression;
}

/** Represents an `import` statement. */
export class ImportStatement extends Statement {
  kind = NodeKind.IMPORT;

  /** Array of member declarations or `null` if an asterisk import. */
  declarations: ImportDeclaration[] | null;
  /** Name of the local namespace, if an asterisk import. */
  namespaceName: IdentifierExpression | null;
  /** Path being imported from. */
  path: StringLiteralExpression;
  /** Normalized path. */
  normalizedPath: string;
  /** Mangled internal path being referenced. */
  internalPath: string;
}

/** Represents an `interfarce` declaration. */
export class InterfaceDeclaration extends ClassDeclaration {
  kind = NodeKind.INTERFACEDECLARATION;
}

/** Represents a method declaration within a `class`. */
export class MethodDeclaration extends FunctionDeclaration {
  kind = NodeKind.METHODDECLARATION;
}

/** Represents a `namespace` declaration. */
export class NamespaceDeclaration extends DeclarationStatement {
  kind = NodeKind.NAMESPACEDECLARATION;

  /** Array of namespace members. */
  members: Statement[];
}

/** Represents a `return` statement. */
export class ReturnStatement extends Statement {
  kind = NodeKind.RETURN;

  /** Value expression being returned, if present. */
  value: Expression | null;
}

/** Represents a single `case` within a `switch` statement. */
export class SwitchCase extends Node {
  kind = NodeKind.SWITCHCASE;

  /** Label expression. `null` indicates the default case. */
  label: Expression | null;
  /** Contained statements. */
  statements: Statement[];
}

/** Represents a `switch` statement. */
export class SwitchStatement extends Statement {
  kind = NodeKind.SWITCH;

  /** Condition expression. */
  condition: Expression;
  /** Contained cases. */
  cases: SwitchCase[];
}

/** Represents a `throw` statement. */
export class ThrowStatement extends Statement {
  kind = NodeKind.THROW;

  /** Value expression being thrown. */
  value: Expression;
}

/** Represents a `try` statement. */
export class TryStatement extends Statement {
  kind = NodeKind.TRY;

  /** Contained statements. */
  statements: Statement[];
  /** Exception variable name, if a `catch` clause is present. */
  catchVariable: IdentifierExpression | null;
  /** Statements being executed on catch, if a `catch` clause is present. */
  catchStatements: Statement[] | null;
  /** Statements being executed afterwards, if a `finally` clause is present. */
  finallyStatements: Statement[] | null;
}

/** Represents a `type` declaration. */
export class TypeDeclaration extends DeclarationStatement {
  kind = NodeKind.TYPEDECLARATION;

  /** Type parameters, if any. */
  typeParameters: TypeParameterNode[] | null;
  /** Type being aliased. */
  type: CommonTypeNode;
}

/** Represents a variable declaration part of a {@link VariableStatement}. */
export class VariableDeclaration extends VariableLikeDeclarationStatement {
  kind = NodeKind.VARIABLEDECLARATION;
}

/** Represents a variable statement wrapping {@link VariableDeclaration}s. */
export class VariableStatement extends Statement {
  kind = NodeKind.VARIABLE;

  /** Array of decorators. */
  decorators: DecoratorNode[] | null;
  /** Array of member declarations. */
  declarations: VariableDeclaration[];
}

/** Represents a void statement dropping an expression's value. */
export class VoidStatement extends Statement {
  kind = NodeKind.VOID;

  /** Expression being dropped. */
  expression: Expression;
}

/** Represents a `while` statement. */
export class WhileStatement extends Statement {
  kind = NodeKind.WHILE;

  /** Condition expression. */
  condition: Expression;
  /** Statement being looped over. */
  statement: Statement;
}

/** Tests if a specific decorator is present within the specified decorators. */
export function hasDecorator(name: string, decorators: DecoratorNode[] | null): bool {
  if (decorators) {
    for (let i = 0, k = decorators.length; i < k; ++i) {
      let expression = decorators[i].name;
      if (expression.kind == NodeKind.IDENTIFIER && (<IdentifierExpression>expression).text == name) {
        return true;
      }
    }
  }
  return false;
}

/** Mangles a declaration's name to an internal name. */
export function mangleInternalName(declaration: DeclarationStatement, asGlobal: bool = false): string {
  var name = declaration.name.text;
  var parent = declaration.parent;
  if (!parent) return name;
  if (
    declaration.kind == NodeKind.VARIABLEDECLARATION &&
    parent.kind == NodeKind.VARIABLE
  ) { // skip over
    if (!(parent = parent.parent)) return name;
  }
  if (parent.kind == NodeKind.CLASSDECLARATION) {
    return mangleInternalName(<ClassDeclaration>parent, asGlobal) + (
      declaration.is(CommonFlags.STATIC)
        ? STATIC_DELIMITER
        : INSTANCE_DELIMITER
    ) + name;
  }
  if (
    parent.kind == NodeKind.NAMESPACEDECLARATION ||
    parent.kind == NodeKind.ENUMDECLARATION
  ) {
    return mangleInternalName(<DeclarationStatement>parent, asGlobal) +
           STATIC_DELIMITER + name;
  }
  return asGlobal
    ? name
    : declaration.range.source.internalPath + PATH_DELIMITER + name;
}

/** Mangles an external to an internal path. */
export function mangleInternalPath(path: string): string {
  if (path.endsWith(".ts")) path = path.substring(0, path.length - 3);
  return path;
}

// Helpers

/** Sets the parent node on an array of nodes. */
function setParent(nodes: Node[], parent: Node): void {
  for (let i = 0, k = nodes.length; i < k; ++i) {
    nodes[i].parent = parent;
  }
}

/** Sets the parent node on an array of nullable nodes. */
function setParentIfNotNull(nodes: (Node | null)[], parent: Node): void {
  for (let i = 0, k = nodes.length; i < k; ++i) {
    let node = nodes[i];
    if (node) node.parent = parent;
  }
}
