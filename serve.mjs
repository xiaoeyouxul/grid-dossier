import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,join,normalize} from 'node:path';
const root=process.cwd(),port=4173;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const relative=normalize(pathname==='/'?'index.html':pathname.slice(1));
  if(relative.startsWith('..'))throw new Error('Invalid path');
  const file=await readFile(join(root,relative));
  res.writeHead(200,{'Content-Type':types[extname(relative)]||'application/octet-stream'});res.end(file);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log(`Grid Dossier ready at http://127.0.0.1:${port}/`)).on('error',error=>{
 if(error.code==='EADDRINUSE'){
  console.error(`Port ${port} is already in use. Close the other server using it, then try again.`);
  process.exitCode=1;
  return;
 }
 throw error;
});
