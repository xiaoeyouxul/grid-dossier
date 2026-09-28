import test from 'node:test';
import assert from 'node:assert/strict';
import {cases,areaAt,murdererIndex,solve} from '../src/puzzles.js';

test('all authored cases have a unique, valid logic solution',()=>{
  assert.equal(cases.length,36);
  assert.deepEqual(cases.slice(0,6).map(puzzle=>puzzle.id),['c01','c02','c03','c04','c05','c06'],'existing save IDs must remain stable');
  assert.equal(new Set(cases.map(puzzle=>puzzle.id)).size,cases.length,'case IDs must be unique');
  assert.equal(new Set(cases.map(puzzle=>puzzle.title)).size,cases.length,'case titles must be unique');
  assert.equal(new Set(cases.map(puzzle=>puzzle.color)).size,cases.length,'case palettes must be unique');
  const uniqueSolutions=new Set();
  for(const puzzle of cases){
    assert.equal(puzzle.size,6);
    assert.equal(puzzle.people.length,6,`${puzzle.title}: every case must have six people`);
    const rows=puzzle.solution.map(([r])=>r),cols=puzzle.solution.map(([,c])=>c);
    assert.deepEqual([...rows].sort(),[0,1,2,3,4,5],`${puzzle.title}: row uniqueness`);
    assert.deepEqual([...cols].sort(),[0,1,2,3,4,5],`${puzzle.title}: column uniqueness`);
    const solutions=solve(puzzle);
    assert.equal(solutions.length,1,`${puzzle.title}: clues must have exactly one solution`);
    assert.deepEqual(solutions[0],puzzle.solution,`${puzzle.title}: clues must solve to the answer`);
    const roomSizes=[0,0,0];
    for(let row=0;row<6;row++)for(let column=0;column<6;column++)roomSizes[areaAt(puzzle,row,column)]++;
    assert.deepEqual(roomSizes,[12,12,12],`${puzzle.title}: each irregular room occupies twelve squares`);
    assert.ok(puzzle.areaMap.some((line,row)=>line.some((room,column)=>room!==Math.floor(row/2))),`${puzzle.title}: floor plan is not three straight strips`);
    for(let room=0;room<3;room++){
      const start=puzzle.areaMap.flatMap((line,row)=>line.map((area,column)=>area===room?[row,column]:null)).find(Boolean);
      const seen=new Set([start.join(',')]),queue=[start];
      for(const [row,column] of queue)for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nextRow=row+dr,nextColumn=column+dc,key=`${nextRow},${nextColumn}`;
        if(nextRow<0||nextRow>5||nextColumn<0||nextColumn>5||seen.has(key)||areaAt(puzzle,nextRow,nextColumn)!==room)continue;
        seen.add(key);queue.push([nextRow,nextColumn]);
      }
      assert.equal(seen.size,12,`${puzzle.title}: room ${room+1} must be connected`);
    }
    uniqueSolutions.add(JSON.stringify(puzzle.solution));
    const victim=puzzle.people.findIndex(([letter])=>letter==='V');
    const room=areaAt(puzzle,...puzzle.solution[victim]);
    const occupants=puzzle.solution.map((pos,index)=>({index,room:areaAt(puzzle,...pos)})).filter(p=>p.room===room);
    assert.equal(occupants.length,2,`${puzzle.title}: victim must share a room with exactly one suspect`);
    const murderer=murdererIndex(puzzle);
    assert.notEqual(murderer,-1,`${puzzle.title}: victim room must identify a murderer`);
    assert.notEqual(murderer,victim,`${puzzle.title}: murderer cannot be the victim`);
    assert.equal(murderer,occupants.find(person=>person.index!==victim).index,`${puzzle.title}: murderer must be the victim's only room-mate`);
  }
  assert.equal(uniqueSolutions.size,cases.length,'cases should not reuse the same answer layout');
});
