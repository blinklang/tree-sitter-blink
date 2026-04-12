/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "blink",

  extras: ($) => [$.comment, $.doc_comment, /\s/],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.fn_declaration,
        $.let_declaration,
        $.assignment,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $._expression,
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
      seq(
        $.parameter,
        repeat(seq(",", $.parameter)),
        optional(","),
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
        $.parenthesized_expression,
        $.tuple_literal,
        $.integer_literal,
        $.float_literal,
        $.string_literal,
        $.boolean_literal,
        $.closure_expression,
        $.if_expression,
        $.while_loop,
        $.loop_expression,
        $.for_in,
        $.block,
        $.call_expression,
        $.field_access,
        $.index_access,
        $.identifier,
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
        seq($.identifier, ":", $._expression),
        $._expression,
      ),

    tuple_literal: ($) =>
      seq("(", $._expression, repeat1(seq(",", $._expression)), ")"),

    binary_expression: ($) =>
      choice(
        prec.left(7, seq($._expression, choice("*", "/", "%"), $._expression)),
        prec.left(6, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(5, seq($._expression, choice("<", ">", "<=", ">="), $._expression)),
        prec.left(4, seq($._expression, choice("==", "!="), $._expression)),
        prec.left(3, seq($._expression, "&&", $._expression)),
        prec.left(2, seq($._expression, "||", $._expression)),
        prec.right(1, seq($._expression, "|>", $._expression)),
      ),

    unary_expression: ($) =>
      prec(8, seq(choice("-", "!"), $._expression)),

    parenthesized_expression: ($) =>
      seq("(", $._expression, ")"),

    field_access: ($) =>
      prec.left(10, seq($._expression, ".", $.identifier)),

    index_access: ($) =>
      prec.left(10, seq($._expression, "[", $._expression, "]")),

    // -- Types --

    _type: ($) =>
      choice(
        $.type_identifier,
        $.generic_type,
      ),

    type_identifier: (_) => /[A-Z][a-zA-Z0-9_]*/,

    generic_type: ($) =>
      seq($.type_identifier, "[", $._type, repeat(seq(",", $._type)), "]"),

    // -- Identifiers --

    identifier: (_) => /[a-z_][a-zA-Z0-9_]*/,

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
