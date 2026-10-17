const KEY="ghostnet.state.v2";
export function loadState(){try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch{return {};}}
export function saveState(s){try{localStorage.setItem(KEY,JSON.stringify(s));return true;}catch{return false;}}
