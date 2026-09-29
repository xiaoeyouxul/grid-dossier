import test from 'node:test';
import assert from 'node:assert/strict';
import {cases,areaAt,murdererIndex,solve} from '../src/puzzles.js';

test('all cases scale with difficulty and retain one valid logic solution',()=>{
  assert.equal(cases.length,36);
  assert.deepEqual(cases.slice(0,6).map(puzzle=>puzzle.id),['c01','c02','c03','c04','c05','c06'],'existing save IDs must remain stable');
  assert.equal(new Set(cases.map(puzzle=>puzzle.id)).size,cases.length);
  assert.equal(new Set(cases.map(puzzle=>puzzle.title)).size,cases.length);
  assert.equal(new Set(cases.map(puzzle=>puzzle.color)).size,cases.length);
  assert.ok(cases.every(puzzle=>puzzle.difficulty!=='Very Easy'));
  const sizes={Easy:6,Medium:8,Hard:10,Expert:12};
  const seenSolutions=new Set();
  for(const puzzle of cases){
    const {size,people,solution,areaMap}=puzzle,roomCount=size/2;
    assert.equal(size,sizes[puzzle.difficulty],`${puzzle.title}: size matches difficulty`);
    assert.equal(people.length,size,`${puzzle.title}: one person per row and column`);
    assert.equal(puzzle.areas.length,roomCount,`${puzzle.title}: room count scales with size`);
    assert.equal(areaMap.length,size);
    assert.ok(areaMap.every(row=>row.length===size));
    const rows=solution.map(([r])=>r),cols=solution.map(([,c])=>c);
    assert.deepEqual([...rows].sort((a,b)=>a-b),Array.from({length:size},(_,i)=>i));
    assert.deepEqual([...cols].sort((a,b)=>a-b),Array.from({length:size},(_,i)=>i));
    const solutions=solve(puzzle);
    assert.equal(solutions.length,1,`${puzzle.title}: exactly one solution`);
    assert.deepEqual(solutions[0],solution,`${puzzle.title}: clue solution matches board`);
    const roomSizes=Array(roomCount).fill(0);
    for(let row=0;row<size;row++)for(let column=0;column<size;column++)roomSizes[areaAt(puzzle,row,column)]++;
    assert.equal(roomSizes.reduce((sum,count)=>sum+count,0),size*size,`${puzzle.title}: room areas cover the board`);
    assert.ok(roomSizes.every(count=>count>0),`${puzzle.title}: every room has cells`);
    assert.ok(Math.max(...roomSizes)>Math.min(...roomSizes),`${puzzle.title}: room sizes vary`);
    assert.ok(areaMap.some((line,row)=>line.some((room,column)=>room!==Math.floor(row/2))),`${puzzle.title}: rooms include bends and alcoves`);
    for(let room=0;room<roomCount;room++){
      const start=areaMap.flatMap((line,row)=>line.map((area,column)=>area===room?[row,column]:null)).find(Boolean);
      const seen=new Set([start.join(',')]),queue=[start];
      for(const [row,column] of queue)for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nextRow=row+dr,nextColumn=column+dc,key=`${nextRow},${nextColumn}`;
        if(nextRow<0||nextRow>=size||nextColumn<0||nextColumn>=size||seen.has(key)||areaAt(puzzle,nextRow,nextColumn)!==room)continue;
        seen.add(key);queue.push([nextRow,nextColumn]);
      }
      assert.equal(seen.size,roomSizes[room],`${puzzle.title}: room ${room+1} is connected`);
    }
    seenSolutions.add(JSON.stringify(solution));
    const victim=people.findIndex(([letter])=>letter==='V'),victimRoom=areaAt(puzzle,...solution[victim]);
    const occupants=solution.map((pos,index)=>({index,room:areaAt(puzzle,...pos)})).filter(p=>p.room===victimRoom);
    assert.equal(occupants.length,2,`${puzzle.title}: victim shares a room with one suspect`);
    assert.equal(murdererIndex(puzzle),occupants.find(person=>person.index!==victim).index);
  }
  assert.equal(seenSolutions.size,cases.length,'cases should not reuse the same answer layout');
});
