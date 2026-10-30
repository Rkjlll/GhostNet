import test from "node:test";
import assert from "node:assert/strict";
import {normalizeBarcodeInput,transformBarcodeData,validateBarcodeData,makeCode39Svg} from "../src/barcode.js";
test("normalizes control characters and whitespace",()=>assert.equal(normalizeBarcodeInput("  ABC\\n123  "),"ABC123"));
test("transforms authorized payload text without mutating source",()=>{const source=" part-42 ";assert.equal(transformBarcodeData(source,{case:"upper",prefix:"BIN-",suffix:"-A"}),"BIN-PART-42-A");assert.equal(source," part-42 ");});
test("validates EAN-13 check digit",()=>{assert.equal(validateBarcodeData("4006381333931","EAN13").valid,true);assert.equal(validateBarcodeData("4006381333932","EAN13").valid,false);});
test("validates UPC-A check digit",()=>{assert.equal(validateBarcodeData("036000291452","UPCA").valid,true);});
test("Code 39 generation rejects unsupported characters and emits SVG",()=>{assert.match(makeCode39Svg("BIN-42"),/<svg/);assert.throws(()=>makeCode39Svg("not valid!"),/Code 39 supports/);});
