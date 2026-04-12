/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "blink",

  extras: ($) => [$.comment, $.doc_comment, /\s/],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $._expression,
      ),

    _expression: ($) =>
      choice(
        $.integer_literal,
        $.float_literal,
        $.string_literal,
        $.boolean_literal,
      ),

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
          $._extended_string_content_1,
          $.string_interpolation,
        )),
        '"#',
      ),

    _extended_string_2: ($) =>
      seq(
        '##"',
        repeat(choice(
          $._extended_string_content_2,
          $.string_interpolation,
        )),
        '"##',
      ),

    _extended_string_3: ($) =>
      seq(
        '###"',
        repeat(choice(
          $._extended_string_content_3,
          $.string_interpolation,
        )),
        '"###',
      ),

    _string_content: (_) => token.immediate(prec(1, /[^"\\{]+/)),

    _extended_string_content_1: (_) => token.immediate(/[^{"]+/),

    _extended_string_content_2: (_) => token.immediate(/[^{"]+/),

    _extended_string_content_3: (_) => token.immediate(/[^{"]+/),

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
