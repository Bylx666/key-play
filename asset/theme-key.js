define(
  "ace/theme/key-css",
  ["require", "exports", "module"],
  function (e, c, n) {
    n.exports =`
.ace-key {
	text-shadow: -1px -1px 3px #122;
	white-space: pre;
  border-radius: 5px;
  background-color: #344a;
  color: #e0efef;
}

.ace_gutter {
  background-color: #1C2525;
  color: #bcc;
  overflow: hidden;
}
.ace_gutter-active-line {
  background-color: #566;
}

.ace_print-margin {
  width: 1px;
  background: #6778;
}
.ace_cursor {
  color: #e0efef;
}
.ace_function {
  color: #ddb;
}
.ace_variable.ace_parameter {
  color: #ddb;
}
.ace_keyword.ace_operator {
  color: #dbb;
}
.ace_comment {
  color: #abb;
}
.ace_constant,.ace_numeric,.ace_string {
  color: #bee;
}
.ace_storage,
.ace_keyword,
.ace_meta.ace_tag {
  color: #dbb;  
}
.ace_selection {
  background-image: linear-gradient(-20deg, #bcc3, #eff5);
}
.ace_active-line {
  background-color: #7888;
}
.ace_scrollbar {
  display:none;
  scrollbar-width: none;
}
`;
  }
),
  define(
    "ace/theme/key",
    ["require", "exports", "module", "ace/theme/key-css", "ace/lib/dom"],
    function (e, c, n) {
      (c.isDark = !1),
        (c.cssClass = "ace-key"),
        (c.cssText = e("./key-css")),
        e("../lib/dom").importCssString(c.cssText, c.cssClass, !1);
    }
  ),
  window.require(["ace/theme/key"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
