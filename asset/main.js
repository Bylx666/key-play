
// 在线尝试

var new_dom = (e)=> document.createElement(e);
const $header = document.querySelector("header");
var load = (e)=> $header.className = e;
const $codes = document.getElementById("codes");

function create_editor() {
  let $e = new_dom("div");
  let codes = ace.edit($e);
  codes.setTheme("ace/theme/key");
  codes.setOptions({
    tabSize: 2,
    fontSize: 18,
    fontFamily: "code, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono'",
    printMarginColumn: 50
  });
  codes.session.setMode("ace/mode/rust");
  $e.sess = codes;
  return $e;
}


const $files = document.querySelector("files");
const $file_add = new_dom("ico");
const file_add = (name)=> {
  let $f = new_dom("div");
  const modify_name = ()=> {
    let $inp = new_dom("input");
    $inp.value = $f.textContent;
    $inp.onchange = ()=> {
      tip_close();
      $f.textContent = $inp.value.replace(/\>/g, "");
      $codes.classList[$files.scrollWidth > $files.clientWidth?"add":"remove"]("overflow");
    };
    tip($inp, "修改你的文件名");
  };

  $f.onclick = ()=> {
    $codes.children[2].remove();
    $codes.append($f.editor);

    for($file of $files.children) $file.className = "";
    $f.className = "act";
  }
  $f.ondblclick = modify_name;
  $f.oncontextmenu = (e)=> {
    const $file_menu = new_dom("file-menu");
    let {clientX, clientY} = e;
    let $modify = new_dom("div");
    let $delete = new_dom("div");

    e.preventDefault();
    $file_menu.style.cssText = `left:${clientX}px;top:${clientY}px`;
    $codes.append($file_menu);
    document.addEventListener("click",function _cl(){
      document.removeEventListener("click", _cl);
      $file_menu.remove();
    });

    $modify.innerHTML = "<ico>&#xe839;</ico>改名";
    $modify.onclick = modify_name;
    $file_menu.append($modify);

    $delete.innerHTML = "<ico>&#xe83b;</ico>删除";
    $delete.onclick = ()=> {
      if($f.nextSibling&&$f.nextSibling.tagName!=="ICO") $f.nextSibling.onclick();
      else if($f.previousSibling) $f.previousSibling.onclick();
      else {$file_add.onclick()}
      $f.remove();
    };
    $file_menu.append($delete);
  }

  $f.editor = create_editor();
  $f.textContent = name;
  $f.onclick();
  $file_add.insertAdjacentElement("beforebegin", $f);

  if($files.scrollWidth > $files.clientWidth) $codes.classList.add("overflow");
  return $f;
};

$file_add.innerHTML = "&#xe840;";
$files.append($file_add);
$file_add.onclick = ()=> {
  let $inp = new_dom("input");
  $inp.onchange = ()=> {
    tip_close();
    file_add($inp.value.replace(/\>/g, ""));
  };
  tip($inp, "输入新文件名");
};

const $tip = document.querySelector("tip");
const $tip_inn = $tip.children[0];
function tip_close() {
  document.body.classList.remove("tip");
  $tip.onanimationend = ()=> {
    $tip.style.display = "none";
    $tip.onanimationend = null;
  };
}
function tip(elem, title) {
  $tip_inn.textContent = "";
  let $h2 = new_dom("h2");
  $h2.textContent = title?title:"提示";
  $tip_inn.append($h2);
  $tip_inn.append(elem);
  $tip.style.display = "block";
  document.body.classList.add("tip");
}

$tip.onclick = tip_close;
$tip_inn.onclick = (e)=> e.stopPropagation();

let $clickeff = document.querySelector("click-effect");
document.addEventListener("click", (e)=> {
  let d = new_dom("div");
  d.style.cssText = `top:${e.clientY-5}px;left:${e.clientX-5}px;`;
  d.onanimationend = ()=> d.remove();
  $clickeff.append(d);
});

if(window.opener) {
  window.opener.postMessage("load", "*");
  window.onmessage = ({data})=> {
    if(typeof data==="string") {
      let file = file_add("sample");
      if(data.startsWith("// module")) 
        file.textContent = "module.ks";
      else if(data.startsWith("// main")) 
        file.textContent = "main";
      file.editor.sess.session.doc.setValue(data);
    }
  }
  window.addEventListener("beforeunload", ()=> window.opener.postMessage("close", "*"));
}

load("load");

let $buts = document.querySelector("buts").children;
let $inf = document.querySelector("inf");
$inf.remove();
$buts[0].onclick = ()=> window.open("https://docs.subkey.top/wasm", "_blank");
$buts[1].onclick = ()=> tip($inf, "关于");

window.addEventListener("keydown", (e)=> {
  if(!e.ctrlKey) return;
  switch (e.key) {
    case "Enter": 
      $run.click();
      return e.preventDefault();
    case "s": 
      for($f of $files.children) if($f.className==="act") {
        let a = new_dom("a");
        a.download = $f.textContent + ".ks";
        a.href = URL.createObjectURL(new Blob([$f.editor.sess.getValue()]));
        a.click();
        return e.preventDefault();
      }
  }
});

if(localStorage.getItem("cache")) try{
  let cache = JSON.parse(localStorage.getItem("cache"));
  for(n of Object.keys(cache)) {
    file_add(n).editor.sess.session.doc.setValue(cache[n]);
  };
}finally{}
else {
  file_add("main");
  $files.children[0].onclick();
}

window.addEventListener("beforeunload", ()=> {
  let cache = {};
  $files.querySelectorAll("div").forEach($f=> {
    cache[$f.textContent] = $f.editor.sess.getValue();
  });
  localStorage.setItem("cache", JSON.stringify(cache));
});

// console.log("%cKey Lang", "background-image:linear-gradient(30deg, #effa, #bcc8);padding:20px 40px;line-height:36px;font-size:24px;color:#344;");

// 缓存文件 ctrl+s ctrl+enter
