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
"type" @keyword.type
"trait" @keyword.type
"impl" @keyword.type
"import" @keyword.import
"effect" @keyword.type
"match" @keyword.conditional
"with" @keyword
"handler" @keyword
"test" @keyword
"const" @keyword.modifier
"as" @keyword.operator
(break_statement) @keyword
(continue_statement) @keyword
(self) @variable.builtin

; Type declarations (specific captures before catch-all)
(type_declaration (type_identifier) @type.definition)
(trait_declaration (type_identifier) @type.definition)
(effect_declaration (type_identifier) @type.definition)
(impl_declaration (type_identifier) @type)

; Type parameters
(type_params (type_param (type_identifier) @type.parameter))

; Associated types
(assoc_type_decl (type_identifier) @type)
(assoc_type_def (type_identifier) @type)

; Annotations
(annotation "@" @attribute)
(annotation (identifier) @attribute)

; Imports (must come before catch-all identifier capture)
(import_statement (identifier) @module)
(import_item (identifier) @module)

; Const declarations (must come before catch-all identifier capture)
(const_declaration (identifier) @constant)
(const_declaration (type_identifier) @constant)

; Struct literals
(struct_field_init (identifier) @variable.member)

; Identifiers (catch-all, must come after more specific captures)
(identifier) @variable
(type_identifier) @type
(effect_identifier) @type.builtin

; Match
(match_arm "=>" @operator)
(wildcard_pattern) @variable.special
(rest_pattern) @operator

; Test declarations
(test_declaration (string_literal) @string.special)

; Operators
(binary_expression ["+" "-" "*" "/" "%" "==" "!=" "<" ">" "<=" ">=" "&&" "||" "|>" "??"] @operator)
(unary_expression ["-" "!"] @operator)
(propagate_expression "?" @operator)
(assignment ["=" "+=" "-=" "*=" "/="] @operator)

; Punctuation
(tuple_pattern "(" @punctuation.bracket)
(tuple_pattern ")" @punctuation.bracket)
(tuple_literal "(" @punctuation.bracket)
(tuple_literal ")" @punctuation.bracket)
(list_literal "[" @punctuation.bracket)
(list_literal "]" @punctuation.bracket)
(list_pattern "[" @punctuation.bracket)
(list_pattern "]" @punctuation.bracket)
(parenthesized_expression "(" @punctuation.bracket)
(parenthesized_expression ")" @punctuation.bracket)
(generic_type "[" @punctuation.bracket)
(generic_type "]" @punctuation.bracket)
(index_access "[" @punctuation.bracket)
(index_access "]" @punctuation.bracket)
