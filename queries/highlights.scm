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
"let" @keyword
"mut" @keyword.modifier

; Identifiers
(identifier) @variable
(type_identifier) @type

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
