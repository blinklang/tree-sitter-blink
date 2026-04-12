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
