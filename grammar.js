/**
 * @file OsoHq Polar grammar for tree-sitter
 * @author František Maša <frantisekmasa1@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "polar",

  word: $ => $.identifier,

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.definition),
    definition: $ => choice($.rule_definition),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    rule_definition: $ => seq(
      field('name', $.identifier),
      '(',
      optional(field('parameter', seq($.parameter, repeat(seq(',', $.parameter))))),
      ')',
      optional(seq('if', field('expression', $.logical_expression))),
      ';',
    ),
    parameter: $ => choice(
      // variable parameter with type ~ user: User
      seq(field('name', $.identifier), optional(seq(':', field('type', $.identifier)))),
      // literal parameter
      field('literal', $.literal),
    ),
    logical_expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.rule_expression,
    ),
    rule_expression: $ => seq(
      field('name', $.identifier),
      '(',
      optional(field('argument', seq($.value, repeat(seq(',', $.value))))),
      ')',
      optional(seq('if', field('expression', $.logical_expression))),
    ),
    comparison_operator: $ => choice('>', '<', '>=', '<=', '='),
    binary_expression: $ => choice(
      seq(
        field('variable', $.identifier),
        field('operator', 'matches'),
        field('type', $.identifier)
      ),
      seq(
        field('left', $.value),
        field('operator', $.comparison_operator),
        field('right', $.value)
      ),
      prec.left(2, seq(field('left', $.logical_expression), field('operator', 'and'), field('right', $.logical_expression))),
      prec.left(1, seq(field('left', $.logical_expression), field('operator', 'or'), field('right', $.logical_expression))),
    ),
    negation_expression: $ => prec(3, seq('not', $.logical_expression)),
    unary_expression: $ => choice($.negation_expression),
    value: $ => choice(
      $.literal,
      $.identifier,
    ),
    literal: $ => choice(
      $.int_literal,
      $.bool_literal,
      $.string_literal,
      $.object_literal,
    ),
    int_literal: $ => /-?\d+/,
    bool_literal: $ => choice('true', 'false'),
    object_literal: $ => seq(field('type', $.identifier), '{', field('value', $.string_literal), '}'),
    string_literal: $ => seq('"',
      repeat(choice('\\\\', '\\"', /[^"]/)),
      '"',
    ),
  },
  supertypes: $ => [
    $.definition,
    $.logical_expression,
    $.unary_expression,
    $.literal,
    $.value,
  ],
});
