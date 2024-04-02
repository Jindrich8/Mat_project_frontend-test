
import { writeFileSync, mkdirSync } from "fs"
import { readdirSync } from 'fs'
import * as path from 'path'
import { compileFromFile } from "json-schema-to-typescript";

function* readAllFilesGen(sourceDir) {
  let dirs = [sourceDir];

  let dir;
  while ((dir = dirs.pop())) {
    let files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        dirs.push(path.join(dir, file.name));
      } else {
        yield path.join(dir, file.name);
      }
    }
  }
}

function writeFileSyncRecursive(filename, content = '') {
  mkdirSync(path.dirname(filename), { recursive: true })
  writeFileSync(filename, content)
}
export async function run(args) {
  console.log("Args: ");
  console.log(args);
  const schemasDir = (args.schemas + '').replace(/[/\\]/, '/');
  const targetDir = (args.target + '').replace(/[/\\]/, '/');
  const schemaExtension = args.extension + '' ?? '.json';
  const excludeSchemasDir = (args.exludeRelSchemas ?? 'task/defs').replace(/[/\\]/, path.sep);


  //if (true) {
  console.log(`Getting files from ${schemasDir}...\n`);
  for (let file of readAllFilesGen(schemasDir)) {
    const filePath = file + '';
    let filePathDotI = filePath.indexOf('.', schemasDir.length);
    if (filePathDotI < 0) {
      filePathDotI = filePath.length;
    }
    const filename = path.basename(filePath.slice(0, filePathDotI));
    const extensions = filePath.slice(filePathDotI);
    const targetRelPath = filePath.slice(schemasDir.length);



    if (extensions !== schemaExtension) {
      console.log(`Skipping file: ${targetRelPath}\n`);
      continue;
    }


    const targetRelPathNoExt = filePath.slice(schemasDir.length, filePathDotI);

    if (targetRelPathNoExt.startsWith(path.sep + excludeSchemasDir + path.sep)) {
      console.log(`Skipping file: ${targetRelPath}\n`);
      continue;
    }


    console.log(`FILE: ${targetRelPath}`);
    const targetPath = path.join(targetDir, targetRelPathNoExt) + '.d.ts';
    console.log(`Target path: ${targetRelPathNoExt}.d.ts`);
    console.log("Compiling...\n");
    const compiled = await compileFromFile(filePath, filename);
    writeFileSyncRecursive(targetPath, compiled);
  }
}