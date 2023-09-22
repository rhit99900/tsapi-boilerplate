/**
 * 
*/

import path, { resolve } from 'path';
import fs from 'fs';
import os, { type } from 'os';
import _packageJson from './templates/package.json' assert { type: "json" };
import { fileURLToPath } from 'url';
import spawn from 'cross-spawn';
import { program } from 'commander';
import chalk from 'chalk';

const _EOL = `\r\n`;
const _HPREFIX = '-----| ';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      return _path;
    }
    else{
      console.log(`${_dirName}/ not found; Creating Directory`);
      fs.mkdirSync(_path, true);
      console.log(`${_dirName}/ created! Conitnue!`);
      return _path;
    }
  }
  catch(e){
    console.debug(e);
    console.log('Failed to create or update directory! Please check the permissions and try again!');
    console.log('Exiting!');
    process.exit(-1);
  }
}


const deps = [    
  'typedi',
  'class-transformer',
  'class-validator',
  'cookie-parser',
  'express',
  'express-form-data',
  'reflect-metadata',
  'winston',
  'winston-daily-rotate-file'    
]

const devDeps = [
  '@swc/cli',
  '@swc/core',
  '@types/express',
  '@types/node',
  'cross-env',
  'nodemon',
  'ts-node',
  'tsconfig-paths',
  'typescript'
]

function installDependencies(){
  return new Promise((resolve, reject) => {
    const command = 'npm';
    const args = [
      'install',
      '--save',
      '--no-audit',
      '--save-exact',    
      '--logLevel',
      'error'
    ].concat(deps);

    const child = spawn(command, args, { stdio: 'inherit'});
    child.on('close', code => {
      if(code !== 0){
        console.log(
          _HPREFIX +
          `${chalk.red(`Error occured while installing dependencies!`)}`
        )
        reject(false);
      }
      else{
        console.log(
          _HPREFIX +
          `${chalk.green(`Successfully Installed dependencies!`)}`
        )
        resolve(true);
      }
    });
  });
}

function installDevDependencies(){
  return new Promise((resolve, reject) => {
    const command = 'npm';
    const args = [
      'install',
      '--save-dev',
      '--no-audit',
      '--save-exact',    
      '--logLevel',
      'error'
    ].concat(devDeps);

    const child = spawn(command, args, { stdio: 'inherit'});
    child.on('close', code => {
      if(code !== 0){
        console.log(
          _HPREFIX +
          `${chalk.red(`Error occured while installing dev dependencies!`)}`
        )
        reject(false);
      }
      else{
        console.log(
          _HPREFIX +
          `${chalk.green(`Successfully Installed dev dependencies!`)}`
        )
        resolve(true);
      }
    });
  });
}

function executor(root, name) {
  return new Promise(async (resolve, reject) => {
    try{
      await installDependencies();
      await installDevDependencies();
    }
    catch(e){

    }
  })
  
}

function updateDependencies(args){
  if(args.orm){
    switch(args.orm){
      case 'mongoose':
        deps.push('mongoose');
        devDeps.push('@types/mongoose');
        break;
      case 'sequelize':
        deps.push('sequelize');
        devDeps.push('@types/sequelize');
        break;
      default:
        // TODO: Do Nothing?
        break;
    }
  }
}

function createApp(name, root) {
  const packageJson = {
    name: name,
    version: '0.1.0',
    private: true,
    description: "TypeScript + Express API Service",
    main: "src/index.ts",
    author: "RO:TS:EX:BTC",
    license: "ISC"
  }
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  )
  console.log(
    _HPREFIX + `Created package.json file in ${root}` + _EOL
  );
  
  // Get Current Working Directory
  const _cwd = process.cwd();
  process.chdir(root);
  // TODO: Check for NPM/YARN Builder 
  executor(root, name);
}

function init(args){  
  const root = createOrUpdateDirectory(args.rootDir, args.dirName);
  updateDependencies(args);
  createApp(args.name, root);
}

export {
  init
};