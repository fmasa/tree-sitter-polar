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
    definition: $ => choice(
      $.rule_definition,
      $.fact_definition,
      $.fixture_definition,
      $.test_definition,
      $.resource_definition,
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    rule_definition: $ => seq(
      field('name', $.identifier),
      '(',
      optional(field('parameter', seq($.parameter, repeat(seq(',', $.parameter))))),
      ')',
      'if',
      field('expression', $.logical_expression),
      ';',
    ),
    fact_definition: $ => seq(
      field('name', $.identifier),
      '(',
      optional(field('parameter', seq($.parameter, repeat(seq(',', $.parameter))))),
      ')',
      ';',
    ),
    parameter: $ => choice(
      // variable parameter with type ~ user: User
      seq(field('name', $.identifier), optional(seq(':', field('type', $.identifier)))),
      // literal parameter
      field('literal', $.literal),
    ),
    _logical_expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.rule_expression,
    ),
    paren_logical_expression: $ => seq('(', field('expression', $._logical_expression), ')'),
    logical_expression: $ => choice($._logical_expression, $.paren_logical_expression,),
    rule_expression: $ => seq(
      field('name', $.identifier),
      '(',
      optional(field('argument', seq($.value, repeat(seq(',', $.value))))),
      ')',
    ),
    comparison_operator: $ => choice('>', '<', '>=', '<=', '='),
    and: $ => 'and',
    or: $ => 'or',
    matches: $ => 'matches',
    not: $ => 'not',
    in: $ => 'in',
    binary_expression: $ => choice(
      seq(
        field('variable', $.identifier),
        field('operator', $.matches),
        field('type', $.identifier)
      ),
      seq(
        field('variable', $.identifier),
        field('operator', $.in),
        field('values', $.literal_array),
      ),
      seq(
        field('left', $.value),
        field('operator', $.comparison_operator),
        field('right', $.value)
      ),
      prec.left(2, seq(field('left', $.logical_expression), field('operator', $.and), field('right', $.logical_expression))),
      prec.left(1, seq(field('left', $.logical_expression), field('operator', $.or), field('right', $.logical_expression))),
    ),
    negation_expression: $ => prec(3, seq($.not, $.logical_expression)),
    unary_expression: $ => choice($.negation_expression),
    value: $ => choice(
      $.literal,
      $.identifier,
    ),
    literal: $ => choice(
      $.int,
      $.bool,
      $.string,
      $.object_literal,
    ),
    int: $ => /-?\d+/,
    bool: $ => choice('true', 'false'),
    object_literal: $ => seq(field('type', $.identifier), '{', field('value', $.string), '}'),
    string: $ => seq('"',
      repeat(choice('\\\\', '\\"', /[^"]/)),
      '"',
    ),
    fixture_definition: $ => seq(
      'test',
      'fixture',
      field('name', $.identifier),
      '{',
      repeat($.fact_definition),
      '}',
    ),
    fixture_reference: $ => seq('fixture', field("name", $.identifier), ';'),

    test_setup: $ => seq(
      "setup",
      '{',
      repeat(
        choice(
          $.fact_definition,
          $.fixture_reference,
        ),
      ),
      '}',
    ),
    assert: $ => seq('assert', $.rule_expression, ';'),
    assert_not: $ => seq('assert_not', $.rule_expression, ';'),
    test_definition: $ => seq(
      "test",
      field("name", $.string),
      '{',
      optional($.test_setup),
      repeat1(choice($.assert, $.assert_not)),
      '}',
    ),
    string_array: $ => seq(
      '[',
      optional(
        seq(
          $.string,
          repeat(
            seq(
              ',',
              $.string,
            ),
          ),
          optional(','),
        ),
      ),
      ']',
    ),
    literal_array: $ => seq(
      '[',
      optional(
        seq(
          $.literal,
          repeat(
            seq(
              ',',
              $.literal,
            ),
          ),
          optional(','),
        ),
      ),
      ']',
    ),
    relation_object: $ => seq(
      '{',
      optional(
        seq(
          seq(
            field('name', $.identifier),
            ':',
            field('type', $.identifier),
          ),
          repeat(
            seq(
              ',',
              seq(
                field('name', $.identifier),
                ':',
                field('type', $.identifier),
              ),
            ),
          ),
          optional(','),
        ),
      ),
      '}',
    ),
    resource_field: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', choice($.string_array, $.relation_object)),
      ';',
    ),
    resource_rule: $ => seq(
      field('name', $.string),
      'if',
      choice(
        seq(
          field('role_or_permission', $.string),
          optional(
            seq(
              'on',
              field('relation', $.identifier),
            ),
          ),
        ),
        // TODO: Consider using restricted types as e.g. NOT or matches is not supported
        $.logical_expression,
      ),
      ';',
    ),
    resource_definition: $ => seq(
      choice(
        'global',
        seq(
          choice('resource', 'actor'),
          field('name', $.identifier),
          optional(seq('extends', field('supertype', $.identifier))),
        ),
      ),
      '{',
      repeat(choice($.resource_field, $.resource_rule)),
      '}',
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
