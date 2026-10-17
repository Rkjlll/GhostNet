export function createEnergyState(){return {reserveMj:120,harvestedMj:0,consumedMj:0,capacityMj:240};}
export function accountEnergy(s,{harvestedMj=0,consumedMj=0}={}){const h=Math.max(0,Number(harvestedMj)||0),c=Math.max(0,Number(consumedMj)||0);return {...s,reserveMj:Math.max(0,Math.min(s.capacityMj,s.reserveMj+h-c)),harvestedMj:s.harvestedMj+h,consumedMj:s.consumedMj+c};}
