; Comments
(comment) @comment
(doc_comment) @comment.documentation

; Literals
(integer_literal) @number
(float_literal) @number.float
(string_literal) @string
(escape_sequence) @string.escape
(boolean_literal) @boolean

; String interpolation braces
(string_interpolation "{" @punctuation.special)
(string_interpolation "}" @punctuation.special)

; Keywords
"fn" @keyword.function
"pub" @keyword.modifier
"let" @keyword
"mut" @keyword.modifier
"return" @keyword.return
"if" @keyword.conditional
"else" @keyword.conditional
"for" @keyword.repeat
"while" @keyword.repeat
"loop" @keyword.repeat
"in" @keyword.operator
(break_statement) @keyword
(continue_statement) @keyword
(self) @variable.builtin

; Identifiers
(identifier) @variable
(type_identifier) @type
(effect_identifier) @type.builtin

; Operators
(binary_expression ["+" "-" "*" "/" "%" "==" "!=" "<" ">" "<=" ">=" "&&" "||" "|>"] @operator)
(unary_expression ["-" "!"] @operator)
(assignment ["=" "+=" "-=" "*=" "/="] @operator)

; Punctuation
(tuple_pattern "(" @punctuation.bracket)
(tuple_pattern ")" @punctuation.bracket)
(tuple_literal "(" @punctuation.bracket)
(tuple_literal ")" @punctuation.bracket)
(parenthesized_expression "(" @punctuation.bracket)
(parenthesized_expression ")" @punctuation.bracket)
(generic_type "[" @punctuation.bracket)
(generic_type "]" @punctuation.bracket)
(index_access "[" @punctuation.bracket)
(index_access "]" @punctuation.bracket)
