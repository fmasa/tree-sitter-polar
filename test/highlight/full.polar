# this is a regular comment
# <- comment

fact("string", 1, variable: String, true);
# <- function.definition
#       ^ string
#              ^ number
#                    ^ variable.parameter
#                              ^ type
#                                     ^ boolean

rule(x) if another_rule(x)
#    ^ variable.parameter
#       ^ keyword.conditional
#               ^ function.call
#                       ^ variable

rule(x) if y matches SomeType and other_rule(x, y);
#                         ^ type
#               ^ keyword.operator

test "example" {
# <- keyword.function
#     ^ string
  assert some_rule(x) iff x in [1, 2, 3];
  # ^ keyword
  #                    ^ keyword.operator
  #                       ^ variable
}

test "example" {
# <- keyword.function
#     ^ string
  assert some_rule(x);
  # ^ keyword
}
