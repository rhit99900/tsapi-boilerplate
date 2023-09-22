/**
 * 
*/

const path = require('path');
const packageJson = require('./templates/package.json');
const fs = require('fs');
const _EOL = `\r\n`;
const _HPREFIX = '-----| ';

function createOrUpdateDirectory(_rootDir, _dirName) {
  try{
    const _path = path.join(_rootDir, _dirName);
    if(fs.existsSync(_path)){
      console.log(`${_dirName}/ exists! Continue!`);
      const _files = fs.readdirSync(_path);
      if(_files.length === 0){
        console.log(
          `Checking Files in ${_dirName}...` + _EOL + 
          _HPREFIX + `${_path} is empty.`
        );
      }
      return true;
    }
    else{
      fs.mkdirSync(_path, true);
      console.log(`${_dirName}/ created! Conitnue!`);
    }
  }
  catch(e){
    console.log(e);
  }
}

function init(args){  
  createOrUpdateDirectory(args.rootDir, args.dirName);
}

module.exports = {
  init  
}