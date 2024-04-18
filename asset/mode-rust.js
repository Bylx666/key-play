define(
  "ace/mode/doc_comment_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, r) {
    "use strict";
    function o() {
      this.$rules = {
        start: [
          { token: "comment.doc.tag", regex: "@\\w+(?=\\s|$)" },
          o.getTagRule(),
          { defaultToken: "comment.doc", caseInsensitive: !0 },
        ],
      };
    }
    var n = e("../lib/oop"),
      e = e("./text_highlight_rules").TextHighlightRules;
    n.inherits(o, e),
      (o.getTagRule = function (e) {
        return {
          token: "comment.doc.tag.storage.type",
          regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b",
        };
      }),
      (o.getStartRule = function (e) {
        return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
      }),
      (o.getEndRule = function (e) {
        return { token: "comment.doc", regex: "\\*\\/", next: e };
      }),
      (t.DocCommentHighlightRules = o);
  }
),
  define(
    "ace/mode/rust_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
      "ace/mode/doc_comment_highlight_rules",
    ],
    function (e, t, r) {
      "use strict";
      function o() {
        var e = this.createKeywordMapper(
          {
            "keyword.source.rust":
              "as|async|await|break|catch|continue|const|default|do|else|enum|extern|for|if|let|match|mod|return|self|static|class|type|use|yield|try|take|swap|is|throw|",
            "storage.type.source.rust":
              "Planet|Sym|Buf|List|Obj|Int|Uint|Float|Str|Func",
            "constant.language.source.rust":
              "true|false|uninit"
          },
          "identifier"
        );
        (this.$rules = {
          start: [
            {
              token: "variable.other.source.rust",
              regex: "'" + a + "(?![\\'])",
            },
            {
              token: "string.quoted.single.source.rust",
              regex: "'(?:[^'\\\\]|" + u + ")'",
            },
            { token: "identifier", regex: "r#" + a + "\\b" },
            {
              stateName: "bracketedComment",
              onMatch: function (e, t, r) {
                return (
                  r.unshift(this.next, e.length - 1, t),
                  "string.quoted.raw.source.rust"
                );
              },
              regex: /r#*"/,
              next: [
                {
                  onMatch: function (e, t, r) {
                    var o = "string.quoted.raw.source.rust";
                    return (
                      e.length >= r[1]
                        ? (e.length > r[1] && (o = "invalid"),
                          r.shift(),
                          r.shift(),
                          (this.next = r.shift()))
                        : (this.next = ""),
                      o
                    );
                  },
                  regex: /"#*/,
                  next: "start",
                },
                { defaultToken: "string.quoted.raw.source.rust" },
              ],
            },
            {
              token: "string.quoted.double.source.rust",
              regex: '"',
              push: [
                {
                  token: "string.quoted.double.source.rust",
                  regex: '"',
                  next: "pop",
                },
                { token: "constant.character.escape.source.rust", regex: u },
                { defaultToken: "string.quoted.double.source.rust" },
              ],
            },
            {
              token: [
                "keyword.source.rust",
                "text",
                "entity.name.function.source.rust",
              ],
              regex: "\\b(let)(\\s+)((?:r#)?" + a + ")",
            },
            {
              token: ["support.constant", "punctuation"],
              regex: "(" + a + "::)(<)",
              push: "generics",
            },
            { token: "support.constant", regex: a + "::" },
            { token: "variable.language.source.rust", regex: "\\bself\\b" },
            s.getStartRule("doc-start"),
            { token: "comment.line.doc.source.rust", regex: "///.*$" },
            { token: "comment.line.doc.source.rust", regex: "//!.*$" },
            { token: "comment.line.double-dash.source.rust", regex: "//.*$" },
            {
              token: "comment.start.block.source.rust",
              regex: "/\\*",
              stateName: "comment",
              push: [
                {
                  token: "comment.start.block.source.rust",
                  regex: "/\\*",
                  push: "comment",
                },
                {
                  token: "comment.end.block.source.rust",
                  regex: "\\*/",
                  next: "pop",
                },
                { defaultToken: "comment.block.source.rust" },
              ],
            },
            { token: e, regex: a },
            {
              token: "keyword.operator",
              regex: /\$|[-=]>|[-+%^=!&|<>]=?|[*/](?![*/])=?/,
            },
            { token: "punctuation.operator", regex: /[?:,;.]/ },
            { token: "paren.lparen", regex: /[\[({]/ },
            { token: "paren.rparen", regex: /[\])}]/ },
            {
              token: "meta.preprocessor.source.rust",
              regex: "\\b\\w\\(\\w\\)*!|#\\[[\\w=\\(\\)_]+\\]\\b",
            },
            {
              token: "constant.numeric.source.rust",
              regex:
                /\b(?:0x[a-fA-F0-9_]+|0o[0-7_]+|0b[01_]+|[0-9][0-9_]*(?!\.))(?:[iu](?:size|8|16|32|64|128))?\b/,
            },
            {
              token: "constant.numeric.source.rust",
              regex:
                /\b(?:[0-9][0-9_]*)(?:\.[0-9][0-9_]*)?(?:[Ee][+-][0-9][0-9_]*)?(?:f32|f64)?\b/,
            },
          ],
        }),
          this.embedRules(s, "doc-", [s.getEndRule("start")]),
          this.normalizeRules();
      }
      var n = e("../lib/oop"),
        i = e("./text_highlight_rules").TextHighlightRules,
        s = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        u = /\\(?:[nrt0'"\\]|x[\da-fA-F]{2}|u\{[\da-fA-F]{6}\})/.source,
        a = /[a-zA-Z_\xa1-\uffff][a-zA-Z0-9_\xa1-\uffff]*/.source;
      (o.metaData = {
        fileTypes: ["rs", "rc"],
        foldingStartMarker:
          "^.*\\bfn\\s*(\\w+\\s*)?\\([^\\)]*\\)(\\s*\\{[^\\}]*)?\\s*$",
        foldingStopMarker: "^\\s*\\}",
        name: "Rust",
        scopeName: "source.rust",
      }),
        n.inherits(o, i),
        (t.RustHighlightRules = o);
    }
  ),
  define(
    "ace/mode/folding/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, r) {
      "use strict";
      var o = e("../../lib/oop"),
        g = e("../../range").Range,
        e = e("./fold_mode").FoldMode,
        t = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      o.inherits(t, e),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, r) {
              var o = e.getLine(r);
              if (
                this.singleLineBlockCommentRe.test(o) &&
                !this.startRegionRe.test(o) &&
                !this.tripleStarBlockCommentRe.test(o)
              )
                return "";
              e = this._getFoldWidgetBase(e, t, r);
              return !e && this.startRegionRe.test(o) ? "start" : e;
            }),
            (this.getFoldWidgetRange = function (e, t, r, o) {
              var n = e.getLine(r);
              if (this.startRegionRe.test(n))
                return this.getCommentRegionBlock(e, n, r);
              var i = n.match(this.foldingStartMarker);
              if (i) {
                var s = i.index;
                if (i[1]) return this.openingBracketBlock(e, i[1], r, s);
                var u = e.getCommentFoldRange(r, s + i[0].length, 1);
                return (
                  u &&
                    !u.isMultiLine() &&
                    (o
                      ? (u = this.getSectionRange(e, r))
                      : "all" != t && (u = null)),
                  u
                );
              }
              if ("markbegin" !== t)
                return (i = n.match(this.foldingStopMarker))
                  ? ((s = i.index + i[0].length),
                    i[1]
                      ? this.closingBracketBlock(e, i[1], r, s)
                      : e.getCommentFoldRange(r, s, -1))
                  : void 0;
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var r = (u = e.getLine(t)).search(/\S/),
                  o = t,
                  n = u.length,
                  i = (t += 1),
                  s = e.getLength();
                ++t < s;

              ) {
                var u,
                  a = (u = e.getLine(t)).search(/\S/);
                if (-1 !== a) {
                  if (a < r) break;
                  var c = this.getFoldWidgetRange(e, "all", t);
                  if (c) {
                    if (c.start.row <= o) break;
                    if (c.isMultiLine()) t = c.end.row;
                    else if (r == a) break;
                  }
                  i = t;
                }
              }
              return new g(o, n, i, e.getLine(i).length);
            }),
            (this.getCommentRegionBlock = function (e, t, r) {
              for (
                var o = t.search(/\s*$/),
                  n = e.getLength(),
                  i = r,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  u = 1;
                ++r < n;

              ) {
                t = e.getLine(r);
                var a = s.exec(t);
                if (a && (a[1] ? u-- : u++, !u)) break;
              }
              if (i < r) return new g(i, o, r, t.length);
            });
        }.call(t.prototype);
    }
  ),
  define(
    "ace/mode/rust",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/rust_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, r) {
      "use strict";
      function o() {
        (this.HighlightRules = s),
          (this.foldingRules = new u()),
          (this.$behaviour = this.$defaultBehaviour);
      }
      var n = e("../lib/oop"),
        i = e("./text").Mode,
        s = e("./rust_highlight_rules").RustHighlightRules,
        u = e("./folding/cstyle").FoldMode;
      n.inherits(o, i),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/", nestable: !0 }),
            (this.$quotes = { '"': '"' }),
            (this.$id = "ace/mode/rust");
        }.call(o.prototype),
        (t.Mode = o);
    }
  ),
  window.require(["ace/mode/rust"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
