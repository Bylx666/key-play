const $run = $codes.querySelector("run");

const wasm = (async function() {
  let utf8 = {
    parse: TextDecoder.prototype.decode.bind(new TextDecoder()),
    from: TextEncoder.prototype.encode.bind(new TextEncoder())
  }
  let _wasm = null;
  let wasm = {
    get mem() {
      return _wasm.memory.buffer;
    },
    /// 读取指针处字符串
    read(ptr, len) {
      return utf8.parse(new Uint8Array(wasm.mem,ptr,len));
    },
    /// 写入arrayBuffer
    write(v) {
      let len = v.byteLength;
      let p = _wasm.alloc(len);
      new Uint8Array(wasm.mem).set(new Uint8Array(v), p);
      return p;
    }
  }

  const abi = {
    key: {
      log(ptr,len) {
        console.log(wasm.read(ptr,len))
      },
      err(ptr,len) {
        console.error(wasm.read(ptr, len))
      },
      key_try(run, catc) {
        try {
          _wasm.call0(run)
        }catch (e) {
          let s = utf8.from(e+"");
          _wasm.call2(catc, wasm.write(s), s.byteLength);
        }
      },
      // 暂时无用
      fetch_str(ptr,len) {
        let req = new XMLHttpRequest();
        req.open("GET", wasm.read(ptr, len), false);
        req.send();
        let buf = utf8.from(req.response);
        let writed = wasm.write(buf);
        _wasm.set_str(writed, buf.byteLength);
      },
      fetch_mod(ptr, len) {
        let find = wasm.read(ptr, len);
        for($f of $files.children) if($f.textContent===find) {
          let s = utf8.from($f.editor.sess.getValue());
          _wasm.set_str(wasm.write(s), s.byteLength);
          return;
        }
        throw new TypeError(`文件列表中没有'${find}'`)
      }
    }
  };
  
  let src = await fetch("/asset/key.wasm");
  src = await src.arrayBuffer();

  let parsed = await WebAssembly.instantiate(src,abi);
  _wasm = parsed.instance.exports;
  _wasm.init();
  load("");
  $run.onclick = ()=> {
    for($f of $files.children) if($f.className==="act") {
      let s = utf8.from($f.editor.sess.getValue());
      console.log("%cKey Lang运行中 >", "color: #233;background-color:#deea;padding:10px");
      let this_file = utf8.from($f.textContent);
      _wasm.set_str(wasm.write(this_file), this_file.byteLength);
      _wasm.run(wasm.write(s), s.byteLength);
      return;
    }
  };

  return _wasm;
})();

window.addEventListener("error", (e)=> {
  if(e.error instanceof WebAssembly.RuntimeError) e.preventDefault();
});
