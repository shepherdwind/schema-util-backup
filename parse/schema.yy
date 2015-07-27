%start expressions

%%

expressions
  : schema EOF
    { return $1; }
  | exports EOF
    { return $1; }
  ;

schema
  : array
    { $$ = $1; }
  | object
    { $$ = $1; }
  ;

exports
  : export
    { $$ = [$1] }
  | exports export
    { $$ = [].concat($1, $2) }
  ;

export
  : EXPORT VAR schema
    { $$ = { key: $2, schema: $3 }}
  ;

array
  : ARRAY STRING START props END
    { $$ = { type: 'array', description: $2, props: $4 } }
  | PUBLIC ARRAY STRING START props END
    { $$ = { public: true, type: 'array', description: $3, props: $5 } }
  ;

object
  : OBJECT STRING START props END
    { $$ = { type: 'object', description: $2, props: $4 } }
  | PUBLIC OBJECT STRING START props END
    { $$ = { public: true, type: 'object', description: $3, props: $5 } }
  ;

props
  : prop
    { $$ = [$1] }
  | props COMMA prop
    { $$ = [].concat($1, $3) }
  ;

prop
  : VAR STRING
    { $$ = { key: $1, description: $2}}
  | VAR STRING COLON var
    { $$ = { key: $1, description: $2, path: $4 }}
  | VAR STRING COLON OBJECT START props END
    { $$ = { key: $1, description: $2, props: $6, type: 'object' }}
  | VAR STRING COLON ARRAY START props END
    { $$ = { key: $1, description: $2, props: $6, type: 'array' }}
  ;

var
  : VAR
    { $$ = [$1] }
  | var DOT VAR
    { $$ = [].concat($1, $3) }
  ;
