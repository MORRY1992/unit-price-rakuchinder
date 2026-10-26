const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(process.argv[2]||'public/index.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const pure=script.slice(script.indexOf('// PURE FUNCTIONS'),script.indexOf('// END PURE FUNCTIONS'));
const c=vm.createContext({});vm.runInContext(pure,c);let checks=0;
const ok=s=>{assert.ok(vm.runInContext(s,c),s);checks++},bad=s=>{assert.throws(()=>vm.runInContext(s,c),s);checks++};
if(html.includes('id="unit-form"')){
 c.v={unit:'g',Aprice:'1000',Ashipping:'200',Adiscount:'100',Aquantity:'1',Ameasure:'kg',Apacks:'1',Bprice:'900',Bshipping:'0',Bdiscount:'0',Bquantity:'800',Bmeasure:'g',Bpacks:'1'};
 ok("calc(v).cross<0n");ok("decimal2(calc(v).plans[0].cash*100000n,calc(v).plans[0].amount)==='110.00'");
 ok("calc({...v,Aquantity:'1000',Ameasure:'g'}).cross===calc(v).cross");
 ok("calc({...v,unit:'ml',Ameasure:'L',Bmeasure:'ml'}).cross===calc(v).cross");
 ok("calc({...v,Aprice:'900',Ashipping:'0',Adiscount:'0',Aquantity:'0.8'}).cross===0n");
 ok("savedUnit(v)===v");bad("savedUnit({...v,Aprice:1000})");bad("calc({...v,Ameasure:'ml'})");bad("calc({...v,Aquantity:'0'})");bad("calc({...v,Apacks:'0'})");bad("calc({...v,Adiscount:'1201'})");
 ok("calc({...v,Aprice:'0',Ashipping:'0',Adiscount:'0'}).plans[0].cash===0n");
 // Same underlying quantity across equivalent units must always produce a tie.
 for(let n=1;n<=100;n++){c.n=n;ok("calc({...v,Aprice:'1000',Ashipping:'0',Adiscount:'0',Aquantity:String(n),Bprice:'1000',Bquantity:String(n*1000)}).cross===0n");}
}else{
 ok("validateCustom([{id:'custom-a',title:' ペンライト '}])[0].title==='ペンライト'");bad("validateCustom([{id:'custom-a',title:' ' }])");bad("validateCustom(Array.from({length:31},(_,i)=>({id:'custom-'+i,title:'品'})))");bad("validateCustom([{id:'custom-a',title:'A'},{id:'custom-a',title:'B'}])");
 ok("packing({nights:'30',mode:'train',wash:'3'}).find(x=>x[0]==='clothes')[2].startsWith('3組')");
 ok("packing({nights:'1',mode:'train',wash:'3'}).find(x=>x[0]==='clothes')[2].startsWith('1組')");
 ok("!packing({nights:'0',mode:'train',wash:'3'}).some(x=>x[0]==='clothes')");
 ok("packing({nights:'1',mode:'bus',purpose:'oshi'}).some(x=>x[0]==='oshi-ticket')");
 ok("packing({nights:'1',mode:'train',purpose:'work',work:true}).filter(x=>x[0]==='work').length===1");
 bad("packing({nights:'31',mode:'train'})");bad("packing({nights:'1',mode:'train',purpose:'invalid'})");
 c.old={values:{nights:'1',mode:'train',rain:false,work:false},checked:['ticket'],customItems:[]};ok("packingState(old).checked[0]==='ticket'");bad("packingState({...old,checked:['unknown']})");bad("packingState({...old,excluded:['unknown']})");
}
console.log(checks+' renewal checks passed');
