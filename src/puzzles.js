const casts=[
 [['A','Alexander Bell','Beside the delivery box'],['B','Bella Cole','Sitting in the chair'],['C','Carol Finch','Only person on the carpet'],['D','Dalia Wells','A houseguest'],['E','Evangeline Moss','Beside the potted plant'],['V','Viraj Patel','The victim']],
 [['A','Nina Park','Interior designer'],['B','Felix Grant','Contractor'],['C','Iris Morrow','Daughter'],['D','Theo Banks','Art dealer'],['E','Milo Chen','Groundskeeper'],['V','Julian Morrow','The victim']],
 [['A','Margot Vale','Housekeeper'],['B','Edwin Ashcombe','Nephew'],['C','Sylvia Grey','Medium'],['D','Victor Hale','Physician'],['E','Agnes Pike','Neighbor'],['V','Lord Ashcombe','The victim']],
 [['A','Camille Ross','Curator'],['B','Owen Tate','Guard'],['C','Priya Shah','Artist'],['D','Luca Moreau','Collector'],['E','Rene Bell','Conservator'],['V','Marcel DuPont','The victim']],
 [['A','Ruthie Lane','Night clerk'],['B','Cal Foster','Truck driver'],['C','June Price','Sister'],['D','Sam Ortiz','Mechanic'],['E','Bev King','Traveler'],['V','Marlene Price','The victim']],
 [['A','Maya Cross','Lead actor'],['B','Dale Rusk','Director'],['C','Tess Morgan','Editor'],['D','Eli Park','Stunt double'],['E','Jo Vega','Producer'],['V','Rex Holliday','The victim']],
];
const titles=[
 ['24-Hour Delivery','THE WILLOW & WINE','OCT 14, 2024','Easy','#d9a48e','✦','A delivery arrived. One guest never left.',['Front hall','Living room','Garden']],
 ['Death by Design','MORROW HOUSE','OCT 18, 2024','Medium','#899b89','◈','The architect knew every way out.',['Studio','Atrium','Courtyard']],
 ['A Quiet Night','BLACKTHORN MANOR','OCT 22, 2024','Expert','#a597b0','☾','One storm. Six guests. No witnesses.',['Conservatory','Chapel','Cellar']],
 ['The Missing Muse','THE GILDED GALLERY','OCT 26, 2024','Hard','#c69b58','◇','A masterpiece vanished before the murder.',['Vault','Main gallery','Office']],
 ['Midnight at the Motel','STARLIGHT MOTOR LODGE','OCT 30, 2024','Easy','#7e9ea2','✳','Room 12 was locked from the inside.',['Room 12','Front desk','Parking lot']],
 ['The Final Cut','SILVER SCREEN STUDIOS','NOV 02, 2024','Hard','#9c7975','▣','The director called it the perfect ending.',['Soundstage','Wardrobe','Prop room']],
];
// Three two-row rooms. Each contains exactly two people; the victim shares a room with only the culprit.
const rowOrders=[[0,1,2,3,4,5],[1,0,3,2,5,4],[0,1,3,2,4,5],[1,0,2,3,5,4],[0,1,3,2,5,4],[1,0,2,3,4,5]];
const colOrders=[[0,1,2,3,4,5],[1,0,3,2,5,4],[0,1,3,2,4,5],[1,0,2,3,5,4],[0,1,3,2,5,4],[1,0,2,3,4,5]];
const anchorByPair=[0,2,4];
const originalCases=titles.map((t,n)=>{
 const people=casts[n];
 const solution=people.map((_,i)=>[rowOrders[n][i],colOrders[n][i]]);
 const clues=people.map((p,i)=>{
  const [r,c]=solution[i],area=Math.floor(r/2),pair=Math.floor(c/2);
  const cluesForPerson=[{type:'row',value:r},{type:'area',value:area},{type:'columnPair',value:pair}];
  if(anchorByPair.includes(i))cluesForPerson.push({type:'column',value:c});
  let text=`${p[0]} · ${p[1]} was in row ${r+1}, in the ${t[7][area]}.`;
  if(anchorByPair.includes(i))text+=` They were in column ${c+1}.`;
  else text+=` They were in the same two-column section as ${people[anchorByPair[pair]][1]}; the two never shared a column.`;
  if(n===0&&i<5)text+=` ${p[2]}.`;
  if(i===5)text+=` The victim was alone with the murderer in that room.`;
  return {person:i,constraints:cluesForPerson,text};
 });
 return {id:`c0${n+1}`,title:t[0],place:t[1],date:t[2],difficulty:t[3],color:t[4],symbol:t[5],desc:t[6],areas:t[7],size:6,people,solution,clues};
});

// New stories are authored independently from the original six cases. Their
// cast, setting, room labels, and palette are all specific to each mystery.
const additions=[
 {title:'Glasshouse at Dusk',place:'THE FERNGLASS CONSERVATORY',date:'NOV 06, 2024',difficulty:'Medium',color:'#3d8065',symbol:'✿',desc:'An orchid opened after closing. By dawn, its keeper was gone.',areas:['Sunroom','Fern walk','Potting shed'],people:[['A','Liora Bellamy','orchid specialist'],['B','Pavel Soren','night botanist'],['C','Mei Calder','estate photographer'],['D','Rufus Dane','glasswright'],['E','Nessa Quill','garden donor'],['V','Dr. Orin Vale','the victim']]},
 {title:'The Last Encore',place:'THE MARLOWE CONCERT HALL',date:'NOV 08, 2024',difficulty:'Hard',color:'#dc4d69',symbol:'♪',desc:'The final chord rang out to an empty balcony and a very full backstage.',areas:['Green room','Orchestra pit','Fly loft'],people:[['A','Tamsin Reed','violin soloist'],['B','Jules Navarro','stage manager'],['C','Amara Bell','conductor'],['D','Kit Rowan','tuner'],['E','Soren Pike','patron'],['V','Maestro Hollis Wren','the victim']]},
 {title:'Salt on the Map',place:'NORTHSTAR LIGHTHOUSE',date:'NOV 10, 2024',difficulty:'Easy',color:'#168ea4',symbol:'⚓',desc:'A chart was altered during the squall. The keeper never saw morning.',areas:['Lantern room','Keeper’s kitchen','Sea cave'],people:[['A','Mara Tern','coast surveyor'],['B','Ewan Shore','boat pilot'],['C','Cleo Voss','weather watcher'],['D','Bram Alder','lamp mechanic'],['E','Inez Rook','wreck diver'],['V','Silas North','the victim']]},
 {title:'Paper Moons',place:'CELESTIAL HOUSE OBSERVATORY',date:'NOV 12, 2024',difficulty:'Expert',color:'#b18b24',symbol:'☄',desc:'Someone forged a star chart before the telescope turned toward Earth.',areas:['Dome','Meridian room','Archive'],people:[['A','Anouk Vela','astronomer'],['B','Dorian Keel','instrument maker'],['C','Suki Ardent','research fellow'],['D','Marek Lune','night custodian'],['E','Pia Solberg','science journalist'],['V','Professor Elian Frost','the victim']]},
 {title:'Murder on the Meridian',place:'MERIDIAN NIGHT TRAIN',date:'NOV 14, 2024',difficulty:'Medium',color:'#6046a8',symbol:'♜',desc:'At the border crossing, one cabin door was locked from within.',areas:['Sleeper car','Dining car','Luggage van'],people:[['A','Rhea Cormac','rail inspector'],['B','Tomas Valez','chef'],['C','Greta Lin','cabin attendant'],['D','Nikhil Batra','card sharp'],['E','Odette March','traveling cellist'],['V','Baron Ivo Kestrel','the victim']]},
 {title:'The Borrowed Crown',place:'MUSEUM OF SMALL KINGDOMS',date:'NOV 16, 2024',difficulty:'Hard',color:'#cc623b',symbol:'♛',desc:'A coronation jewel left its case; the curator did not leave the gallery.',areas:['Crown gallery','Loading court','Restoration bay'],people:[['A','Etta Muir','textile conservator'],['B','Bastian Crowe','security chief'],['C','Nuri Haddad','gem appraiser'],['D','Faye Lennox','museum trustee'],['E','Gideon Frost','crate handler'],['V','Lady Sabine Orlow','the victim']]},
 {title:'Static at Blue Hour',place:'KITE & CO. RADIO',date:'NOV 18, 2024',difficulty:'Easy',color:'#3d6fbd',symbol:'◉',desc:'A confession aired between the weather and the late-night jazz set.',areas:['On-air booth','Tape library','Roof mast'],people:[['A','Milo Finch','sound engineer'],['B','Jada Wells','news reader'],['C','Perry Locke','record archivist'],['D','Rina Sol','caller-screen host'],['E','Calder Wynn','station owner'],['V','June Aster','the victim']]},
 {title:'Honey in the Walls',place:'BEECHHOLLOW APIARY',date:'NOV 20, 2024',difficulty:'Easy',color:'#aa4f88',symbol:'☘',desc:'The winter hive was sealed. Someone had already taken the queen.',areas:['Glass apiary','Wax room','Orchard gate'],people:[['A','Bex Marlow','beekeeper'],['B','Omar Finch','wax sculptor'],['C','Sylvie Hart','hive researcher'],['D','Tariq Bloom','orchard tenant'],['E','Della Rue','market buyer'],['V','August Weller','the victim']]},
 {title:'The Tidemaker’s Ledger',place:'OLD QUAY CUSTOMS HOUSE',date:'NOV 22, 2024',difficulty:'Medium',color:'#718d2a',symbol:'◉',desc:'A harbor ledger listed a ship that had sunk twenty years ago.',areas:['Tally room','Salt stairs','Customs loft'],people:[['A','Rafi Calder','dock clerk'],['B','Minna Gray','ship chandler'],['C','Esme Dallow','ledger keeper'],['D','Joost Venn','salvage diver'],['E','Tilda Moss','ferry captain'],['V','Captain Bramwell Saye','the victim']]},
 {title:'Eight Bells at Marrow Wharf',place:'MARROW WHARF SALVAGE',date:'NOV 24, 2024',difficulty:'Expert',color:'#3f858c',symbol:'❖',desc:'A bell rang eight times from a vessel that had no bell aboard.',areas:['Drydock','Rope loft','Pier office'],people:[['A','Keiko Armitage','rigging master'],['B','Lars Boudreaux','wreck diver'],['C','Una Bell','shipwright'],['D','Dmitri Hale','harbor pilot'],['E','Fenna Cole','insurance examiner'],['V','Merrick Vane','the victim']]},
 {title:'The Winter Orchard',place:'CIDER HOUSE AT GREYMEAD',date:'NOV 26, 2024',difficulty:'Hard',color:'#c14744',symbol:'❄',desc:'The frost cellar held fresh footprints and one unclaimed glass.',areas:['Press room','Frost cellar','Apple loft'],people:[['A','Mabel Quince','cider maker'],['B','Ronan Pearce','orchard foreman'],['C','Lotte Ash','local historian'],['D','Davi Rowan','delivery driver'],['E','Petra Noll','wine buyer'],['V','Silas Bramley','the victim']]},
 {title:'A Recipe for Silence',place:'THE COPPER LADLE',date:'NOV 28, 2024',difficulty:'Medium',color:'#6875c4',symbol:'♨',desc:'The supper club served six courses, then one final secret.',areas:['Chef’s table','Cold kitchen','Wine cage'],people:[['A','Mina Baptiste','sous-chef'],['B','Arlo Caines','sommelier'],['C','Yvette Song','food critic'],['D','Paco Bell','dish steward'],['E','Lena Sato','club investor'],['V','Chef Ambrose Pike','the victim']]},
 {title:'The Painted Stair',place:'HOTEL VIOLETTE',date:'NOV 30, 2024',difficulty:'Easy',color:'#bb6f26',symbol:'⌘',desc:'A portrait was turned to face the wall just before the lights failed.',areas:['Grand landing','Housekeeping wing','Roof conservatory'],people:[['A','Ada Bexley','interior painter'],['B','Moss Calder','bell captain'],['C','Yara Penn','guest liaison'],['D','Hugo Trask','elevator mechanic'],['E','Nell Vardon','travel writer'],['V','Mr. Emmett Vale','the victim']]},
 {title:'The Greenhouse Waltz',place:'LANTERNLEAF FLORAL SCHOOL',date:'DEC 02, 2024',difficulty:'Easy',color:'#43805c',symbol:'❀',desc:'A dance card named a partner who had been dead for a week.',areas:['Tropical house','Lecture hall','Seed vault'],people:[['A','Cora Lark','floral designer'],['B','Benoit March','dance instructor'],['C','Hana Ives','seed keeper'],['D','Felix Bloom','grounds steward'],['E','Marta Vale','alumna'],['V','Dean Rosamund Thorne','the victim']]},
 {title:'Last Stop, Foxglove',place:'FOXGLOVE SLEEPING CARS',date:'DEC 04, 2024',difficulty:'Hard',color:'#924fb2',symbol:'◇',desc:'The porter found a ticket punched for a station removed from the map.',areas:['Observation car','Breakfast nook','Mail compartment'],people:[['A','Saira Pell','night porter'],['B','Olek Varga','mail sorter'],['C','Toby Cress','rail cook'],['D','Frida Moss','ticket examiner'],['E','Nico Vale','sleeping-car guest'],['V','Dr. Imogen Shaw','the victim']]},
 {title:'Understudy Alibi',place:'THE LITTLE COMET THEATRE',date:'DEC 06, 2024',difficulty:'Medium',color:'#2b80bb',symbol:'✦',desc:'The understudy knew every line, including the one that was never written.',areas:['Prompt corner','Painted flats','Costume cage'],people:[['A','Lark Dempsey','understudy'],['B','Rafi Calderon','prop builder'],['C','Mina Tolland','costume cutter'],['D','Otto June','lighting hand'],['E','Sable Wynn','theatre patron'],['V','Daphne Rook','the victim']]},
 {title:'The Copper Archive',place:'ARCHIVE OF LOST INVENTIONS',date:'DEC 08, 2024',difficulty:'Expert',color:'#b23d76',symbol:'⌁',desc:'A patent for a perpetual engine appeared in a file burned in 1891.',areas:['Patent vault','Reading room','Bindery'],people:[['A','Ivo Kline','patent clerk'],['B','Mira Sen','bookbinder'],['C','Tobias Quell','mechanical historian'],['D','Asha North','archive guard'],['E','Wesley Rill','collector'],['V','Dr. Octavia Bell','the victim']]},
 {title:'Snowfall at Eastmere',place:'EASTMERE ALPINE LODGE',date:'DEC 10, 2024',difficulty:'Easy',color:'#808c2e',symbol:'❄',desc:'The avalanche sealed the pass. The lodge kept one door mysteriously warm.',areas:['Ski room','Boiler annex','Map lounge'],people:[['A','Greer Snow','mountain guide'],['B','Pavel Rook','boiler tender'],['C','Iris Kade','ski medic'],['D','Tamsin Vail','weather observer'],['E','Cato Merritt','lodge investor'],['V','Elias Eastmere','the victim']]},
 {title:'The Velvet Switchboard',place:'NIGHTJAR TELEPHONE EXCHANGE',date:'DEC 12, 2024',difficulty:'Hard',color:'#c15785',symbol:'☎',desc:'A disconnected line carried a voice from the exchange’s sealed basement.',areas:['Operator floor','Cable cellar','Roof relay'],people:[['A','Luz Mercado','chief operator'],['B','Harvey Kells','line repairer'],['C','Nina March','switchboard trainee'],['D','Solomon Finch','night courier'],['E','Beatrix Cole','subscriber'],['V','Mister Alistair Pym','the victim']]},
 {title:'The Mooncake Ledger',place:'JADE LANTERN TEA HOUSE',date:'DEC 14, 2024',difficulty:'Medium',color:'#327d9c',symbol:'☯',desc:'One recipe was written in a hand that belonged to no living cook.',areas:['Tea pavilion','Kitchen garden','Drying loft'],people:[['A','Lin Qiao','tea blender'],['B','Bao Wen','pastry chef'],['C','Mei Tan','account keeper'],['D','Jun Park','courtyard gardener'],['E','Shao Ren','antique dealer'],['V','Madame Yu Lan','the victim']]},
 {title:'Saltglass Casino',place:'THE SALTGLASS ROOMS',date:'DEC 16, 2024',difficulty:'Easy',color:'#9a6430',symbol:'♦',desc:'The house always wins—unless someone changes the count at midnight.',areas:['Baccarat salon','Cashier cage','Service tunnel'],people:[['A','Romy Vale','card dealer'],['B','Cyrus Nix','pit boss'],['C','Edda Shore','safe auditor'],['D','Felipe Crane','casino singer'],['E','Wynn Mercer','high roller'],['V','Mr. Lucien Roque','the victim']]},
 {title:'The Red Kite House',place:'WINDWARD KITE FESTIVAL',date:'DEC 18, 2024',difficulty:'Easy',color:'#6355a6',symbol:'⌁',desc:'A red kite returned from the clouds with a key tied to its tail.',areas:['Wind pavilion','Reed field','Repair tent'],people:[['A','Anya Bell','kite maker'],['B','Kofi Dune','festival marshal'],['C','Ruth Mallow','weather watcher'],['D','Ezra Finch','string runner'],['E','Nadiya Vale','sponsor'],['V','Master Corin Reed','the victim']]},
 {title:'When Bellflower Closed',place:'BELLFLOWER & THORN',date:'DEC 20, 2024',difficulty:'Hard',color:'#c54970',symbol:'♧',desc:'The florist’s final delivery was addressed to a room with no door.',areas:['Cooler room','Back counter','Rooftop beds'],people:[['A','Pippa North','florist'],['B','Rafi Dallow','delivery rider'],['C','Tess Fenn','flower auctioneer'],['D','Dorian Vale','building porter'],['E','Nora Quill','regular customer'],['V','Mister Alden Bellflower','the victim']]},
 {title:'The Unfinished Blueprint',place:'MILESTONE BUILDERS’ CLUB',date:'DEC 22, 2024',difficulty:'Expert',color:'#37936e',symbol:'⊙',desc:'A building plan showed a seventh room in a house with only six.',areas:['Drafting loft','Model workshop','Foundation pit'],people:[['A','Oona Gridley','architect'],['B','Jae Mercer','site engineer'],['C','Vik Sallow','model maker'],['D','Miriam Locke','planning officer'],['E','Tad Quoin','property heir'],['V','Sir Basil Framework','the victim']]},
 {title:'Wavelength Eighty-Eight',place:'WAVEHOUSE COMMUNITY RADIO',date:'DEC 24, 2024',difficulty:'Medium',color:'#bb4830',symbol:'⌘',desc:'The station signed off, but a second voice stayed on the air.',areas:['Recording booth','Music stacks','Transmitter shed'],people:[['A','Cass Beryl','folk host'],['B','Uma Calder','tape librarian'],['C','Reed Wallace','transmitter tech'],['D','Jinny Crow','call-in producer'],['E','Malik True','station volunteer'],['V','Patience Gray','the victim']]},
 {title:'Ashes of Bellweather',place:'BELLWEATHER FIRE WATCH',date:'DEC 26, 2024',difficulty:'Hard',color:'#4777a1',symbol:'♢',desc:'The fire bell sounded under clear skies; the tower log was already ash.',areas:['Lookout tower','Pump house','Cinder trail'],people:[['A','Silas Ember','fire lookout'],['B','Mara Flint','pump keeper'],['C','Cleo Vane','forest ecologist'],['D','Gus Rill','trail warden'],['E','Tova Crane','insurance assessor'],['V','Chief Arden Bellweather','the victim']]},
 {title:'A Lantern for the Deep',place:'PELAGIC HOUSE AQUARIUM',date:'DEC 28, 2024',difficulty:'Easy',color:'#96712b',symbol:'⛵',desc:'A lanternfish appeared in the freshwater tank, glowing beside a missing key.',areas:['Kelp gallery','Quarantine pool','Pump corridor'],people:[['A','Mako Sato','aquarist'],['B','Inez Pel','marine medic'],['C','Theo Current','tank engineer'],['D','Laleh Reef','education guide'],['E','Bruno Tide','donor'],['V','Dr. Vera Shoal','the victim']]},
 {title:'The Borrowed Hour',place:'WICK & WHEEL CLOCKWORKS',date:'DEC 30, 2024',difficulty:'Expert',color:'#6f4da1',symbol:'⚙',desc:'Every clock stopped at 2:17. One was found running backward.',areas:['Escapement shop','Clock gallery','Bell loft'],people:[['A','Pru Gearhart','clockmaker'],['B','Nils Sprocket','apprentice'],['C','Ada Pendulum','horologist'],['D','Yuri Chime','bell ringer'],['E','Mabel Minute','collector'],['V','Edmund Wick','the victim']]},
 {title:'The Blue Finch Hotel',place:'BLUE FINCH MOTOR COURT',date:'JAN 02, 2025',difficulty:'Easy',color:'#30877e',symbol:'✧',desc:'Room keys were swapped during the storm, but the guest book was not.',areas:['Motel office','Ice court','Laundry wing'],people:[['A','Bryn Sutter','desk manager'],['B','Lola Finch','house painter'],['C','Marty Dune','vending repairer'],['D','Aiko Wells','traveling nurse'],['E','Rex Pollen','insurance salesman'],['V','Daisy Blue','the victim']]},
 {title:'The Last Wildflower',place:'NORTH FEN BOTANICAL RESERVE',date:'JAN 04, 2025',difficulty:'Medium',color:'#ba6252',symbol:'❁',desc:'A rare bloom vanished from the marsh, leaving six muddy paths behind.',areas:['Boardwalk','Seed cabin','Observation blind'],people:[['A','Nell Marsh','field botanist'],['B','Omar Lark','reserve ranger'],['C','Pia Fenwick','seed archivist'],['D','Cal Rook','boat keeper'],['E','Sana Wren','wildlife painter'],['V','Dr. Elowen Reed','the victim']]},
];

function allPermutations(values){
 if(values.length===0)return [[]];
 return values.flatMap((value,index)=>allPermutations(values.filter((_,i)=>i!==index)).map(rest=>[value,...rest]));
}
const oldRowOrders=rowOrders;
const newRowOrders=allPermutations([0,1,2,3,4,5]).filter(order=>!oldRowOrders.some(old=>old.every((value,i)=>value===order[i])));
const additionCases=additions.map((spec,n)=>{
 const people=spec.people;
 const rows=newRowOrders[Math.floor(n*newRowOrders.length/additions.length)];
 const flip=n%8;
 const solution=people.map((_,i)=>{
  const pair=Math.floor(i/2),flipped=(flip>>pair)&1;
  return [rows[i],2*pair+(i%2===0?flipped:1-flipped)];
 });
 const rowOpeners=[
  (name,row,area)=>`${name} is placed on row ${row+1}, within ${area}.`,
  (name,row,area)=>`The ${area} log records ${name} on row ${row+1}.`,
  (name,row,area)=>`${name} belongs to row ${row+1}, the row running through ${area}.`,
  (name,row,area)=>`Row ${row+1} of ${area} is assigned to ${name}.`,
  (name,row,area)=>`The case file places ${name} in row ${row+1} of ${area}.`,
  (name,row,area)=>`For ${name}, the floor chart marks row ${row+1} in ${area}.`,
 ];
 const columnLines=[
  (name,col)=>`Their column is fixed at ${col+1}.`,
  (name,col)=>`The register assigns ${name} to column ${col+1}.`,
  (name,col)=>`Column ${col+1} is the confirmed position for ${name}.`,
  (name,col)=>`A marked seat puts ${name} in column ${col+1}.`,
 ];
 const sectionLines=[
  (name,anchor)=>`The two-column strip holding ${name} also held ${anchor}; their columns were different.`,
  (name,anchor)=>`${name} shared a two-column band with ${anchor}, but occupied a separate column.`,
  (name,anchor)=>`A same-section note links ${name} to ${anchor}; the column itself differs.`,
  (name,anchor)=>`${name} and ${anchor} occupied different columns within the same two-column segment.`,
 ];
 const clues=people.map((person,i)=>{
  const [r,c]=solution[i],area=Math.floor(r/2),pair=Math.floor(c/2);
  const constraints=[{type:'row',value:r},{type:'area',value:area},{type:'columnPair',value:pair}];
  if(i%2===0)constraints.push({type:'column',value:c});
  const lines=[rowOpeners[(n+i)%rowOpeners.length](person[1],r,spec.areas[area])];
  if(i%2===0)lines.push(columnLines[(n+i)%columnLines.length](person[1],c));
  else lines.push(sectionLines[(n+i)%sectionLines.length](person[1],people[i-1][1]));
  if(i===5)lines.push('The victim shared a room with only one other guest.');
  return {person:i,constraints,text:lines.join(' ')};
 });
 return {id:`c${String(n+7).padStart(2,'0')}`,title:spec.title,place:spec.place,date:spec.date,difficulty:spec.difficulty,color:spec.color,symbol:spec.symbol,desc:spec.desc,areas:spec.areas,size:6,people,solution,clues};
});
const extraPeople=[['G','Rowan Vale','night porter'],['H','Mina Grey','archivist'],['I','Theo March','groundskeeper'],['J','Ada Finch','restorer'],['K','Luca North','investigator'],['L','Sera Bell','forensic analyst']];
const sizeForDifficulty={Easy:6,Medium:8,Hard:10,Expert:12};
const roomSuffixSets=[
 ['Annex','Passage','Loft'],['Gallery','Vault','Service Wing'],['Archive','Courtyard','Hidden Room'],
 ['East Wing','Cellar','Atrium'],['Garden Walk','Map Room','Bell Tower'],['Old Wing','Workshop','Secret Passage'],
];
function connected(map,room){
 const cells=[];map.forEach((line,r)=>line.forEach((value,c)=>{if(value===room)cells.push([r,c])}));
 const seen=new Set([cells[0]?.join(',')]),queue=cells.slice(0,1);
 for(const [r,c] of queue)for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const y=r+dr,x=c+dc,key=`${y},${x}`;if(y<0||y>=map.length||x<0||x>=map.length||seen.has(key)||map[y][x]!==room)continue;seen.add(key);queue.push([y,x]);}
 return seen.size===cells.length;
}
function makeAreaMap(size,solution,seed){
 const rooms=size/2,map=Array.from({length:size},(_,r)=>Array(size).fill(Math.floor(r/2)));
 const occupied=new Set(solution.map(([r,c])=>`${r},${c}`));
 // Move matched cells across each room boundary at different columns. This
 // keeps every room connected while producing notches and offset alcoves.
 for(let room=0;room<rooms-1;room++){
  const upperRow=2*room+1,lowerRow=upperRow+1,offset=(seed+room*3)%size;
  const upper=Array.from({length:size},(_,i)=>(offset+i)%size).filter(c=>!occupied.has(`${upperRow},${c}`));
  const lower=Array.from({length:size},(_,i)=>(offset+size-1-i)%size).filter(c=>!occupied.has(`${lowerRow},${c}`));
  let done=false;
  for(const a of upper)for(const b of lower){
   if(done||a===b)continue;
   map[upperRow][a]=room+1;map[lowerRow][b]=room;
   if(Array.from({length:rooms},(_,id)=>connected(map,id)).every(Boolean)){done=true;break;}
   map[upperRow][a]=room;map[lowerRow][b]=room+1;
  }
 }
 // Let the boundaries wander beyond their initial two-row bands. A transfer
 // is accepted only if both rooms stay connected and every solved position
 // remains in its intended room.
 let random=(seed*1664525+1013904223)>>>0;
 const next=()=>((random=(Math.imul(random,1664525)+1013904223)>>>0)/4294967296);
 for(let pass=0,changes=0;pass<size*size*5&&changes<size+rooms;pass++){
  const row=Math.floor(next()*size),column=Math.floor(next()*size),from=map[row][column];
  if(occupied.has(`${row},${column}`))continue;
  const neighbors=[[row-1,column],[row+1,column],[row,column-1],[row,column+1]].filter(([r,c])=>r>=0&&r<size&&c>=0&&c<size&&map[r][c]!==from);
  if(!neighbors.length)continue;
  const [targetRow,targetColumn]=neighbors[Math.floor(next()*neighbors.length)],to=map[targetRow][targetColumn];
  map[row][column]=to;
  if(Array.from({length:rooms},(_,id)=>connected(map,id)).every(Boolean))changes++;
  else map[row][column]=from;
 }
 return map;
}
function expandPuzzle(puzzle,index){
 const difficulty=puzzle.difficulty==='Easy'?'Easy':puzzle.difficulty,size=sizeForDifficulty[difficulty]||6,roomCount=size/2,people=puzzle.people.map(person=>[...person]);
 for(let i=6;i<size;i++)people.push([...extraPeople[i-6]]);
 const areaSuffixes=Array.from({length:roomCount-3},(_,i)=>roomSuffixSets[index%roomSuffixSets.length][i]);
 const areas=[...puzzle.areas.slice(0,3),...areaSuffixes.map((suffix,i)=>`${puzzle.areas[i%3]} ${suffix}`)];
 const solution=people.map((_,i)=>{const group=Math.floor(i/2),within=i%2,rowFlip=(index>>group)&1,columnFlip=(index>>(group+3))&1;return [2*group+(within^rowFlip),2*group+(within^columnFlip)];});
 const clues=people.map((person,i)=>{const [row,column]=solution[i],group=Math.floor(i/2),constraints=[{type:'row',value:row},{type:'area',value:group},{type:'columnPair',value:group}];if(i%2===0)constraints.push({type:'column',value:column});return {person:i,constraints,text:''};});
 const expanded={...puzzle,difficulty,size,areas,areaSuffixes,people,solution,clues,anchorByPair:Array.from({length:roomCount},(_,g)=>g*2)};
 expanded.areaMap=makeAreaMap(size,solution,index+13);return expanded;
}
export const cases=[...originalCases,...additionCases].map(expandPuzzle);
export function areaAt(puzzle,row,col){return puzzle.areaMap?.[row]?.[col]??Math.floor(row/2)}
export function murdererIndex(puzzle){const victim=puzzle.people.findIndex(([letter])=>letter==='V'),victimArea=areaAt(puzzle,...puzzle.solution[victim]);return puzzle.solution.findIndex((pos,i)=>i!==victim&&areaAt(puzzle,...pos)===victimArea)}
export function solve(puzzle){
 const size=puzzle.size,candidates=puzzle.people.map((_,person)=>Array.from({length:size*size},(_,i)=>[Math.floor(i/size),i%size]).filter(([r,c])=>puzzle.clues.find(clue=>clue.person===person).constraints.every(x=>x.type==='row'?r===x.value:x.type==='area'?areaAt(puzzle,r,c)===x.value:x.type==='columnPair'?Math.floor(c/2)===x.value:x.type==='column'?c===x.value:false)));
 const solutions=[];
 function visit(person,placed,rows,cols){if(solutions.length>1)return;if(person===puzzle.people.length){solutions.push(placed);return}for(const [r,c] of candidates[person]){if(rows.has(r)||cols.has(c))continue;visit(person+1,[...placed,[r,c]],new Set([...rows,r]),new Set([...cols,c]))}}
 visit(0,[],new Set(),new Set());return solutions;
}
