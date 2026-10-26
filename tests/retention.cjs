const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const file=process.argv[2]||'public/index.html',html=fs.readFileSync(file,'utf8');
const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n');
const node=()=>({style:{},append(){},addEventListener(){},querySelectorAll(){return []}}),nodes=new Map();
const context=vm.createContext({document:{getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},createElement:node},console});
new vm.Script(script).runInContext(context);
let checks=0;
function ok(code){assert.ok(vm.runInContext(code,context));checks++}
function rejects(code){assert.throws(()=>vm.runInContext(code,context));checks++}
if(html.includes('id="unit-form"')){
 context.fixture={unit:'g',Aprice:'1000',Ashipping:'200',Adiscount:'100',Aquantity:'1000',Apacks:'1',Bprice:'900',Bshipping:'0',Bdiscount:'0',Bquantity:'800',Bpacks:'1'};
 ok('savedUnit(fixture)===fixture');
 ok('calc(fixture).cross<0n');
 ok('decimal2(calc(fixture).plans[0].cash*1000n*100n,calc(fixture).plans[0].amount)==="110.00"');
 rejects('savedUnit({...fixture,Aquantity:"0"})');
 rejects('savedUnit({...fixture,Aprice:1000})');
 rejects('savedUnit({...fixture,unit:"invalid"})');
}else{
 ok('validateCustom([{id:"custom-one",title:"ペンライト"}])[0].title==="ペンライト"');
 ok('validateCustom(Array.from({length:30},(_,i)=>({id:"custom-"+i,title:"持ち物"}))).length===30');
 rejects('validateCustom(Array.from({length:31},(_,i)=>({id:"custom-"+i,title:"持ち物"})))');
 rejects('validateCustom([{id:"custom-one",title:" "}])');
 rejects('validateCustom([{id:"custom-one",title:"a".repeat(61)}])');
 rejects('validateCustom([{id:"custom-one",title:"A"},{id:"custom-one",title:"B"}])');
}
console.log(`${file}: ${checks} checks passed`);
