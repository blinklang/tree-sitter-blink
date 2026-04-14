/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "blink",

  extras: ($) => [$.comment, $.doc_comment, /\s/],

  conflicts: ($) => [
    [$._type, $.generic_type],
    [$._expression, $.match_arm],
    [$._expression, $.async_scope_expression],
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.fn_declaration,
        $.type_declaration,
        $.trait_declaration,
        $.impl_declaration,
        $.effect_declaration,
        $.let_declaration,
        $.const_declaration,
        $.assignment,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.import_statement,
        $.test_declaration,
        $._expression,
      ),

    // -- Annotations --

    annotation: ($) =>
      seq(
        "@",
        $.identifier,
        optional(seq(
          "(",
          optional(seq(
            $._annotation_arg,
            repeat(seq(",", $._annotation_arg)),
          )),
          ")",
        )),
      ),

    // dotted names like DB.Read, IO.Log, or plain TypeIdentifiers like Serialize
    _annotation_arg: ($) =>
      seq(
        $.type_identifier,
        optional(seq(".", $.type_identifier)),
      ),

    // -- Import statements --

    import_statement: ($) =>
      seq(
        optional("pub"),
        "import",
        $.identifier,
        repeat(seq(".", $.identifier)),
        optional($.selective_imports),
      ),

    selective_imports: ($) =>
      seq(
        ".",
        "{",
        $.import_item,
        repeat(seq(",", $.import_item)),
        optional(","),
        "}",
      ),

    import_item: ($) =>
      seq(
        $.identifier,
        optional(seq("as", $.identifier)),
      ),

    // -- Type declarations --

    type_declaration: ($) =>
      seq(
        optional("pub"),
        optional($.annotation),
        "type",
        $.type_identifier,
        optional($.type_params),
        choice(
          seq("=", $._type),
          seq("{", repeat($._type_member), "}"),
        ),
      ),

    _type_member: ($) =>
      choice(
        $.struct_field,
        $.enum_variant,
      ),

    struct_field: ($) =>
      seq(
        $.identifier,
        ":",
        $._type,
        optional(seq("=", $._expression)),
        optional(","),
      ),

    enum_variant: ($) =>
      seq(
        $.type_identifier,
        optional(seq(
          "(",
          optional(seq(
            $.variant_field,
            repeat(seq(",", $.variant_field)),
            optional(","),
          )),
          ")",
        )),
        optional(","),
      ),

    variant_field: ($) =>
      seq($.identifier, ":", $._type),

    type_params: ($) =>
      seq(
        "[",
        $.type_param,
        repeat(seq(",", $.type_param)),
        "]",
      ),

    type_param: ($) =>
      seq(
        $.type_identifier,
        optional(seq(
          ":",
          $._type,
          repeat(seq("+", $._type)),
        )),
      ),

    // -- Trait declarations --

    trait_declaration: ($) =>
      seq(
        optional("pub"),
        "trait",
        $.type_identifier,
        optional($.type_params),
        "{",
        repeat(choice(
          $.assoc_type_decl,
          $.fn_signature,
        )),
        "}",
      ),

    fn_signature: ($) =>
      seq(
        optional("pub"),
        "fn",
        $.identifier,
        "(",
        optional($._parameter_list),
        ")",
        optional(seq("->", $._type)),
        optional(seq("!", $._effect_list)),
      ),

    assoc_type_decl: ($) =>
      seq("type", $.type_identifier),

    // -- Impl blocks --

    impl_declaration: ($) =>
      seq(
        "impl",
        $.type_identifier,
        optional($.type_params),
        optional(seq("for", $.type_identifier)),
        "{",
        repeat(choice(
          $.assoc_type_def,
          $.fn_declaration,
        )),
        "}",
      ),

    assoc_type_def: ($) =>
      seq("type", $.type_identifier, "=", $._type),

    // -- Effect declarations --

    effect_declaration: ($) =>
      seq(
        optional("pub"),
        "effect",
        $.type_identifier,
        "{",
        repeat($._effect_member),
        "}",
      ),

    _effect_member: ($) =>
      choice(
        $.effect_declaration,
        $.fn_signature,
      ),

    // -- Function declarations --

    fn_declaration: ($) =>
      seq(
        optional("pub"),
        "fn",
        $.identifier,
        "(",
        optional($._parameter_list),
        ")",
        optional(seq("->", $._type)),
        optional(seq("!", $._effect_list)),
        $.block,
      ),

    _parameter_list: ($) =>
      choice(
        seq(
          $.parameter,
          repeat(seq(",", $.parameter)),
          optional(seq(
            ",",
            "--",
            seq(
              $.parameter,
              repeat(seq(",", $.parameter)),
            ),
          )),
          optional(","),
        ),
        seq(
          "--",
          $.parameter,
          repeat(seq(",", $.parameter)),
          optional(","),
        ),
      ),

    parameter: ($) =>
      seq(
        optional("mut"),
        choice($.identifier, $.self),
        optional(seq(":", $._type)),
        optional(seq("=", $._expression)),
      ),

    self: (_) => "self",

    _effect_list: ($) =>
      seq(
        $.effect_name,
        repeat(seq(",", $.effect_name)),
      ),

    effect_name: ($) =>
      seq(
        $.effect_identifier,
        optional(seq(".", $.effect_identifier)),
      ),

    effect_identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // -- Test declarations --

    test_declaration: ($) =>
      seq("test", $.string_literal, $.block),

    // -- Const declarations --

    const_declaration: ($) =>
      seq(
        optional("pub"),
        "const",
        choice($.identifier, $.type_identifier),
        optional(seq(":", $._type)),
        "=",
        $._expression,
      ),

    // -- Block expression --

    block: ($) =>
      seq(
        "{",
        repeat($._statement),
        "}",
      ),

    // -- Control flow --

    return_statement: ($) =>
      prec.right(seq("return", optional($._expression))),

    break_statement: (_) => "break",

    continue_statement: (_) => "continue",

    // -- Variable declarations --

    let_declaration: ($) =>
      seq(
        "let",
        optional("mut"),
        choice(
          $.identifier,
          $.tuple_pattern,
        ),
        optional(seq(":", $._type)),
        "=",
        $._expression,
      ),

    tuple_pattern: ($) =>
      seq("(", $.identifier, repeat1(seq(",", $.identifier)), ")"),

    // -- Assignments --

    assignment: ($) =>
      seq(
        choice(
          $.identifier,
          $.field_access,
          $.index_access,
        ),
        choice("=", "+=", "-=", "*=", "/="),
        $._expression,
      ),

    // -- Expressions --

    _expression: ($) =>
      choice(
        $.binary_expression,
        $.unary_expression,
        $.propagate_expression,
        $.parenthesized_expression,
        $.tuple_literal,
        $.list_literal,
        $.struct_literal,
        $.integer_literal,
        $.float_literal,
        $.string_literal,
        $.boolean_literal,
        $.closure_expression,
        $.if_expression,
        $.match_expression,
        $.while_loop,
        $.loop_expression,
        $.for_in,
        $.with_expression,
        $.with_handler_expression,
        $.block,
        $.call_expression,
        $.field_access,
        $.index_access,
        $.async_scope_expression,
        $.await_expression,
        $.embed_expression,
        $.identifier,
        $.type_identifier,
      ),

    closure_expression: ($) =>
      seq(
        "fn",
        "(",
        optional($._parameter_list),
        ")",
        optional(seq("->", $._type)),
        $.block,
      ),

    if_expression: ($) =>
      seq(
        "if",
        $._expression,
        $.block,
        optional(seq(
          "else",
          choice($.block, $.if_expression),
        )),
      ),

    while_loop: ($) =>
      seq("while", $._expression, $.block),

    loop_expression: ($) =>
      seq("loop", $.block),

    for_in: ($) =>
      seq(
        "for",
        choice($.identifier, $.tuple_pattern),
        "in",
        $._expression,
        $.block,
      ),

    // -- Match expressions --

    match_expression: ($) =>
      seq(
        "match",
        $._expression,
        "{",
        repeat($.match_arm),
        "}",
      ),

    match_arm: ($) =>
      seq(
        $._pattern,
        "=>",
        choice($._expression, $.block),
      ),

    _pattern: ($) =>
      choice(
        $.wildcard_pattern,
        $.match_tuple_pattern,
        $.enum_pattern,
        $.list_pattern,
        $.string_literal,
        $.integer_literal,
        $.float_literal,
        $.boolean_literal,
        $.identifier,
      ),

    match_tuple_pattern: ($) =>
      seq(
        "(",
        $._pattern,
        repeat1(seq(",", $._pattern)),
        optional(","),
        ")",
      ),

    wildcard_pattern: (_) => "_",

    enum_pattern: ($) =>
      seq(
        $.type_identifier,
        "(",
        optional(seq(
          $._pattern_binding,
          repeat(seq(",", $._pattern_binding)),
          optional(","),
        )),
        ")",
      ),

    _pattern_binding: ($) =>
      choice($.identifier, $.wildcard_pattern),

    list_pattern: ($) =>
      seq(
        "[",
        optional(seq(
          $._list_pattern_element,
          repeat(seq(",", $._list_pattern_element)),
          optional(","),
        )),
        "]",
      ),

    _list_pattern_element: ($) =>
      choice(
        $.rest_pattern,
        $._pattern,
      ),

    rest_pattern: (_) => "...",

    // -- With expressions --

    with_expression: ($) =>
      seq(
        "with",
        $.with_clause,
        repeat(seq(",", $.with_clause)),
        $.block,
      ),

    with_clause: ($) =>
      seq(
        $._expression,
        optional(seq("as", $.identifier)),
      ),

    // -- With-handler expressions --

    with_handler_expression: ($) =>
      seq(
        "with",
        "handler",
        $.type_identifier,
        "{",
        repeat($.fn_declaration),
        "}",
        $.block,
      ),

    // -- Call, field, index --

    call_expression: ($) =>
      prec.left(10, seq(
        $._expression,
        "(",
        optional($._argument_list),
        ")",
      )),

    _argument_list: ($) =>
      seq(
        $.argument,
        repeat(seq(",", $.argument)),
        optional(","),
      ),

    argument: ($) =>
      choice(
        seq(field("name", $.identifier), ":", field("value", $._expression)),
        field("value", $._expression),
      ),

    tuple_literal: ($) =>
      seq("(", $._expression, repeat1(seq(",", $._expression)), ")"),

    list_literal: ($) =>
      seq(
        "[",
        optional(seq(
          $._expression,
          repeat(seq(",", $._expression)),
          optional(","),
        )),
        "]",
      ),

    struct_literal: ($) =>
      prec(1, seq(
        $.type_identifier,
        "{",
        repeat($.struct_field_init),
        "}",
      )),

    struct_field_init: ($) =>
      seq(
        $.identifier,
        ":",
        $._expression,
        optional(","),
      ),

    binary_expression: ($) =>
      choice(
        prec.left(7, seq($._expression, choice("*", "/", "%"), $._expression)),
        prec.left(6, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(5, seq($._expression, choice("<", ">", "<=", ">="), $._expression)),
        prec.left(4, seq($._expression, choice("==", "!="), $._expression)),
        prec.left(3, seq($._expression, "&&", $._expression)),
        prec.left(2, seq($._expression, "||", $._expression)),
        prec.left(2, seq($._expression, "??", $._expression)),
        prec.right(1, seq($._expression, "|>", $._expression)),
      ),

    propagate_expression: ($) =>
      prec(9, seq($._expression, "?")),

    unary_expression: ($) =>
      prec(8, seq(choice("-", "!"), $._expression)),

    parenthesized_expression: ($) =>
      seq("(", $._expression, ")"),

    field_access: ($) =>
      prec.left(10, seq($._expression, ".", $.identifier)),

    index_access: ($) =>
      prec.left(10, seq($._expression, "[", $._expression, "]")),

    async_scope_expression: ($) =>
      seq(
        $.identifier,
        ".",
        $.identifier,
        $.block,
      ),

    await_expression: ($) =>
      prec.left(11, seq($._expression, ".", "await")),

    embed_expression: ($) =>
      seq(
        "#",
        "embed",
        "(",
        $.string_literal,
        ")",
      ),

    // -- Types --

    _type: ($) =>
      choice(
        $.optional_type,
        $.tuple_type,
        $.generic_type,
        $.type_identifier,
      ),

    type_identifier: (_) => /[A-Z][a-zA-Z0-9_]*/,

    generic_type: ($) =>
      seq($.type_identifier, "[", $._type, repeat(seq(",", $._type)), "]"),

    optional_type: ($) =>
      prec.right(seq($._type, "?")),

    tuple_type: ($) =>
      seq("(", $._type, repeat1(seq(",", $._type)), ")"),

    // -- Identifiers --

    identifier: (_) => /[$a-z_][a-zA-Z0-9_$]*/,

    // -- Literals --

    integer_literal: (_) => /[0-9]+/,

    float_literal: (_) => /[0-9]+\.[0-9]+/,

    boolean_literal: (_) => choice("true", "false"),

    // Strings: "...", extended delimiters #"..."#, ##"..."##, ###"..."###
    // String interpolation: {expr} inside strings
    string_literal: ($) =>
      choice(
        $._basic_string,
        $._extended_string_1,
        $._extended_string_2,
        $._extended_string_3,
      ),

    _basic_string: ($) =>
      seq(
        '"',
        repeat(choice(
          $._string_content,
          $.escape_sequence,
          $.string_interpolation,
        )),
        '"',
      ),

    _extended_string_1: ($) =>
      seq(
        '#"',
        repeat(choice(
          $._extended_string_content,
          $.string_interpolation,
        )),
        '"#',
      ),

    _extended_string_2: ($) =>
      seq(
        '##"',
        repeat(choice(
          $._extended_string_content,
          $.string_interpolation,
        )),
        '"##',
      ),

    _extended_string_3: ($) =>
      seq(
        '###"',
        repeat(choice(
          $._extended_string_content,
          $.string_interpolation,
        )),
        '"###',
      ),

    _string_content: (_) => token.immediate(prec(1, /[^"\\{]+/)),

    _extended_string_content: (_) => token.immediate(/[^{"]+/),

    escape_sequence: (_) =>
      token.immediate(
        seq(
          "\\",
          choice(
            "n", "r", "t", "\\", '"', "{",
          ),
        ),
      ),

    string_interpolation: ($) =>
      seq("{", $._expression, "}"),

    // -- Comments --

    doc_comment: (_) => token(seq("///", /.*/)),

    comment: (_) => token(seq("//", /.*/)),
  },
});
