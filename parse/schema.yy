%start expressions

%%

expressions
  : schema EOF
      { return $1; }
  ;

schema
  : array
    { $$ = $1; }
  | object
    { $$ = $1; }
  ;

array
  : ARRAY STRING START props END
    { $$ = { type: 'array', description: $2, props: $4 } }
  ;

object
  : OBJECT STRING START props END
    { $$ = { type: 'array', description: $2, props: $4 } }
  ;

props
  : prop
    { $$ = [$1] }
  | props COMMA prop
    { $$ = [].concat($1, $3) }
  ;

prop
  : var STRING
    { $$ = { path: $1, description: $2}}
  | var DOT OBJECT STRING START props END
    { $$ = { path: $1, description: $4, props: $6, type: 'object' }}
  | var DOT ARRAY STRING START props END
    { $$ = { path: $1, description: $4, props: $6, type: 'array' }}
  ;

var
  : VAR
    { $$ = [$1] }
  | var DOT VAR
    { $$ = [].concat($1, $3) }
  ;
