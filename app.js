const properties=[
{id:1,title:'Apartamento contemporâneo',location:'Jardins • São Paulo',type:'apartamento',purpose:'venda',price:'Sob consulta',beds:'3 dorm.',baths:'3 banh.',area:'142 m²',badge:'Destaque',image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85'},
{id:2,title:'Residência com área gourmet',location:'Moema • São Paulo',type:'casa',purpose:'venda',price:'Sob consulta',beds:'4 dorm.',baths:'4 banh.',area:'220 m²',badge:'Seleção',image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'},
{id:3,title:'Studio urbano e funcional',location:'Pinheiros • São Paulo',type:'studio',purpose:'locacao',price:'Sob consulta',beds:'1 dorm.',baths:'1 banh.',area:'48 m²',badge:'Oportunidade',image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85'}
];

const grid=document.getElementById('propertyGrid');
const resultCount=document.getElementById('resultCount');
const emptyState=document.getElementById('emptyState');
const searchLocal=document.getElementById('searchLocal');
const typeFilter=document.getElementById('typeFilter');
const purposeFilter=document.getElementById('purposeFilter');

function render(items){
 grid.innerHTML=items.map(p=>`<article class="property-card">
  <div class="property-media" style="background-image:url('${p.image}')"><span class="property-badge">${p.badge}</span><button class="favorite" aria-label="Favoritar imóvel" data-favorite="${p.id}">♡</button></div>
  <div class="property-body"><span class="property-location">${p.location}</span><h3>${p.title}</h3><div class="property-meta"><span>${p.beds}</span><span>${p.baths}</span><span>${p.area}</span></div><div class="property-footer"><strong class="property-price">${p.price}</strong><button class="property-link" data-interest="${p.id}">Tenho interesse →</button></div></div>
 </article>`).join('');
 resultCount.textContent=`${items.length} ${items.length===1?'imóvel':'imóveis'}`;
 emptyState.hidden=items.length!==0;
 document.querySelectorAll('[data-favorite]').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('active');btn.textContent=btn.classList.contains('active')?'♥':'♡'}));
 document.querySelectorAll('[data-interest]').forEach(btn=>btn.addEventListener('click',()=>openModal(properties.find(p=>p.id===Number(btn.dataset.interest)))));
}

function filterProperties(){
 const q=searchLocal.value.trim().toLocaleLowerCase('pt-BR');
 const type=typeFilter.value,purpose=purposeFilter.value;
 render(properties.filter(p=>(!q||`${p.title} ${p.location}`.toLocaleLowerCase('pt-BR').includes(q))&&(type==='all'||p.type===type)&&(purpose==='all'||p.purpose===purpose)));
}

document.getElementById('searchBtn').addEventListener('click',filterProperties);
[searchLocal,typeFilter,purposeFilter].forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',filterProperties));

const menuBtn=document.getElementById('menuBtn'),mobileMenu=document.getElementById('mobileMenu');
menuBtn.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰'});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuBtn.textContent='☰';menuBtn.setAttribute('aria-expanded','false')}));

const modal=document.getElementById('leadModal'),leadForm=document.getElementById('leadForm');
function openModal(property){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';if(property){leadForm.elements.interest.value=property.purpose==='locacao'?'Imóvel para alugar':property.type==='casa'?'Casa para comprar':'Apartamento para comprar';leadForm.elements.region.value=property.location.split('•')[0].trim();}}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.getElementById('leadBtn').addEventListener('click',()=>openModal());
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
leadForm.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(leadForm);const message=`Olá Ivan! Meu nome é ${data.get('name')}. Tenho interesse em: ${data.get('interest')}. Região: ${data.get('region')||'a definir'}. Faixa de valor: ${data.get('budget')||'a definir'}. Gostaria de receber opções da Invicta Imóveis.`;navigator.clipboard?.writeText(message);alert('Mensagem preparada e copiada. Assim que o WhatsApp do Ivan for cadastrado no site, este botão abrirá a conversa diretamente.');closeModal()});

let deferredPrompt;const installBtn=document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});
installBtn.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
render(properties);