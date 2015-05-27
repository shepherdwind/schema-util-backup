%%

"Array"             { return 'ARRAY' }
"Object"            { return 'OBJECT' }
"export"            { return 'EXPORT' }
"{"                 { return 'START' }
","                 { return 'COMMA' }
":"                 { return 'COLON' }
"}"                 { return 'END' }
[\$\w]+             { return 'VAR' }
"."/[\$\w]          { return 'DOT' }
"("(\\\)|[^\)])*")" { yytext = yytext.substr(1, yyleng-2); return 'STRING'; }
\s+                 { /*ignore whitespace*/ }
<INITIAL><<EOF>>    { return 'EOF'; }
