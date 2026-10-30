const CODE39 = {
"0":"nnnwwnwnn","1":"wnnwnnnnw","2":"nnwwnnnnw","3":"wnwwnnnnn","4":"nnnwwnnnw","5":"wnnwwnnnn","6":"nnwwwnnnn","7":"nnnwnnwnw","8":"wnnwnnwnn","9":"nnwwnnwnn",
"A":"wnnnnwnnw","B":"nnwnnwnnw","C":"wnwnnwnnn","D":"nnnnwwnnw","E":"wnnnwwnnn","F":"nnwnwwnnn","G":"nnnnnwwnw","H":"wnnnnwwnn","I":"nnwnnwwnn","J":"nnnnwwwnn",
"K":"wnnnnnnww","L":"nnwnnnnww","M":"wnwnnnnwn","N":"nnnnwnnww","O":"wnnnwnnwn","P":"nnwnwnnwn","Q":"nnnnnnwww","R":"wnnnnnwwn","S":"nnwnnnwwn","T":"nnnnwnwwn",
"U":"wwnnnnnnw","V":"nwwnnnnnw","W":"wwwnnnnnn","X":"nwnnwnnnw","Y":"wwnnwnnnn","Z":"nwwnwnnnn","-":"nwnnnnwnw",".":"wwnnnnwnn"," ":"nwwnnnwnn","$":"nwnwnwnnn","/":"nwnwnnnwn","+":"nwnnnwnwn","%":"nnnwnwnwn","*":"nwnnwnwnn"
};
export function normalizeBarcodeInput(value){return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim();}
export function transformBarcodeData(value,ops={}) {
 let out=normalizeBarcodeInput(value);
 if(ops.trim!==false) out=out.trim();
 if(ops.case==="upper") out=out.toUpperCase();
 if(ops.case==="lower") out=out.toLowerCase();
 if(ops.prefix) out=String(ops.prefix)+out;
 if(ops.suffix) out+=String(ops.suffix);
 if(ops.find) out=out.split(String(ops.find)).join(String(ops.replace??""));
 return out;
}
export function validateBarcodeData(value,format="CODE39"){
 const v=normalizeBarcodeInput(value);
 if(!v) return {valid:false,message:"Enter barcode data first."};
 if(format==="EAN13"){
  if(!/^\d{13}$/.test(v)) return {valid:false,message:"EAN-13 requires exactly 13 digits."};
  const digits=v.split("").map(Number),sum=digits.slice(0,12).reduce((s,n,i)=>s+n*(i%2?3:1),0),check=(10-sum%10)%10;
  return {valid:check===digits[12],message:check===digits[12]?"Valid EAN-13 check digit.":"EAN-13 check digit does not match."};
 }
 if(format==="UPCA"){
  if(!/^\d{12}$/.test(v)) return {valid:false,message:"UPC-A requires exactly 12 digits."};
  const d=v.split("").map(Number),sum=d.slice(0,11).reduce((s,n,i)=>s+n*(i%2?3:1),0),check=(10-sum%10)%10;
  return {valid:check===d[11],message:check===d[11]?"Valid UPC-A check digit.":"UPC-A check digit does not match."};
 }
 if(format==="CODE39"){
  const ok=[...v].every(ch=>Object.hasOwn(CODE39,ch));
  return {valid:ok,message:ok?"Valid Code 39 character set.":"Code 39 supports A-Z, 0-9, space, and - . $ / + %."};
 }
 return {valid:false,message:"Unsupported format."};
}
export function makeCode39Svg(value,{moduleWidth=2,height=100,quiet=12}={}){
 const v=normalizeBarcodeInput(value).toUpperCase(),check=validateBarcodeData(v,"CODE39");
 if(!check.valid) throw new Error(check.message);
 const encoded="*"+v+"*",widths=[];
 for(const ch of encoded){for(const w of CODE39[ch])widths.push(w==="w"?3:1);widths.push(1);}
 const total=widths.reduce((a,b)=>a+b,0)*moduleWidth+quiet*2*moduleWidth;
 let x=quiet*moduleWidth,rects=[],bar=true;
 for(const w of widths){const width=w*moduleWidth;if(bar)rects.push('<rect x="'+x+'" y="0" width="'+width+'" height="'+height+'" fill="#000"/>');x+=width;bar=!bar;}
 const safe=v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
 return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Custom Code 39 barcode '+safe+'" viewBox="0 0 '+total+' '+(height+24)+'" width="'+total+'" height="'+(height+24)+'"><rect width="100%" height="100%" fill="#fff"/>'+rects.join("")+'<text x="50%" y="'+(height+18)+'" text-anchor="middle" font-family="monospace" font-size="12" fill="#000">'+safe+'</text></svg>';
}
export function downloadTextFile(name,content,type="image/svg+xml"){
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
export function initBarcodeUI(){
 const $=id=>document.getElementById(id),input=$("barcodeInput");
 if(!input)return;
 const status=(message,kind="info")=>{const el=$("barcodeStatus");el.textContent=message;el.dataset.kind=kind;};
 const scan=async()=>{
  if(!("BarcodeDetector" in window)){status("Live scanning is unavailable in this browser. Enter data manually or use a compatible camera scanner.","warn");return;}
  try{const detector=new BarcodeDetector({formats:["code_128","code_39","ean_13","upc_a","qr_code","ean_8","upc_e"]}),stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});const video=$("barcodeVideo");video.srcObject=stream;await video.play();$("barcodeScanPanel").hidden=false;status("Camera active. Hold a barcode in view.");let active=true;const stop=()=>{active=false;stream.getTracks().forEach(t=>t.stop());video.srcObject=null;$("barcodeScanPanel").hidden=true;};$("barcodeStopScan").onclick=stop;
  const tick=async()=>{if(!active)return;try{const found=await detector.detect(video);if(found.length){input.value=found[0].rawValue;$("barcodeFormat").value=found[0].format==="ean_13"?"EAN13":found[0].format==="upc_a"?"UPCA":"CODE39";stop();render();status("Scanned "+found[0].format+" data. Original value preserved in the input.","ok");return;}}catch{}requestAnimationFrame(tick);};tick();
  }catch(e){status("Camera could not start: "+e.message,"error");}
 };
 const render=()=>{
  const raw=normalizeBarcodeInput(input.value),format=$("barcodeFormat").value,ops={case:$("barcodeCase").value,prefix:$("barcodePrefix").value,suffix:$("barcodeSuffix").value,find:$("barcodeFind").value,replace:$("barcodeReplace").value},out=transformBarcodeData(raw,ops),validation=validateBarcodeData(out,format);
  $("barcodeOriginal").textContent=raw||"—";$("barcodeTransformed").textContent=out||"—";$("barcodeValidation").textContent=validation.message;$("barcodeValidation").dataset.kind=validation.valid?"ok":"error";
  const productFormat=format==="EAN13"||format==="UPCA";
  $("barcodeGenerate").disabled=!validation.valid||productFormat;
  $("barcodeFormatNote").textContent=productFormat?"Product identifiers are validation-only here. Use your authorized GS1/manufacturer workflow for official retail identifiers.":"Generated output is a custom/internal Code 39 label, not a manufacturer-issued product code.";
  $("barcodePreview").innerHTML="";
  if(validation.valid&&!productFormat){try{$("barcodePreview").innerHTML=makeCode39Svg(out);}catch(e){$("barcodeValidation").textContent=e.message;}}
  return {raw,out,format,validation};
 };
 ["barcodeInput","barcodeFormat","barcodeCase","barcodePrefix","barcodeSuffix","barcodeFind","barcodeReplace"].forEach(id=>$(id).addEventListener(id==="barcodeInput"?"input":"change",render));
 $("barcodeTransform").addEventListener("click",()=>{render();status("Transformation preview updated. Original input remains unchanged.","ok");});
 $("barcodeGenerate").addEventListener("click",()=>{const r=render();if(!r.validation.valid||r.format!=="CODE39")return;downloadTextFile("ghostnet-custom-code39.svg",makeCode39Svg(r.out));status("Custom Code 39 SVG generated.","ok");});
 $("barcodeReset").addEventListener("click",()=>{input.value="";["barcodePrefix","barcodeSuffix","barcodeFind","barcodeReplace"].forEach(id=>$(id).value="");$("barcodeCase").value="none";render();status("Workspace reset.");});
 $("barcodeScan").addEventListener("click",scan);render();
}
