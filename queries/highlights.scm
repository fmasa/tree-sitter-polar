;; inherits: polar 
;; extends
(int) @number
(string) @string
(bool) @boolean
(comment) @comment

; Punctuation

"," @punctuation.delimiter
";" @punctuation.delimiter

"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket

; Operators
(comparison_operator) @operator
(matches) @keyword.operator
(not) @keyword.operator
(and) @keyword.operator
(or) @keyword.operator
(in) @keyword.operator
"iff" @keyword.operator

; Resources
"resource" @keyword
"global" @keyword

(pair
  type: (identifier) @number)

(resource_definition
  name: (identifier) @type.definition)

(resource_definition
  supertype: (identifier) @type)

; Tests
"test" @keyword.function
"setup" @keyword.function
"fixture" @keyword.function

(fixture_definition
  name: (identifier) @function.definition)

(fixture_reference
  name: (identifier) @function.call)

(assert) @keyword
(assert_not) @keyword

(iff_expression
  variable: (identifier) @variable)

; Rules and Facts
"if" @keyword.conditional

(fact_definition
  name: (identifier) @function.definition)

(rule_definition
  name: (identifier) @function.definition)

(parameter
  type: (identifier) @type)

(parameter
  name: (identifier) @variable.parameter)

(rule_expression
  name: (identifier) @function.call)

(rule_expression
  name: (identifier) @function.call)

(rule_expression
  argument: (identifier) @variable)

(binary_expression
  type: (identifier) @type)
