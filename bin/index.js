#!/usr/bin/env node
/**
 * Copyright (c) 2023-Present, Rohit Nair
 * Usage:
 * npx ts-api-boilerplate <DIRECTORY_NAME> [--sync]
 * @param DIRECTORY_NAME: _args[0] | #Relative Path of Directory for the Service.
 * @param TEST_VERIABLE?: Optional Parameter only for Dev Execution.
*/

'use strict';

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import cp from 'child_process';
import { init } from './init.js';
import { _VARS, _TEST, _SYNC, _DATABASE } from './utils/constants.js';
import { fileURLToPath } from 'url';

const nodeVersion = process.versions.node;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _args = process.argv.slice(2);

console.log(_args, _VARS);

const isTestRun = _args.includes(_TEST);

const handleExit = () => {

}

const handleException = () => {

}

const processArguments = (params) => {  
  const data = {};
  data['dirName'] = !isTestRun ? params[0] : `.test/${params[0]}`;
  data['rootDir'] = path.join(__dirname, '..');
  data['sync'] = params.includes(_SYNC);
  data['name'] = params[0].trim();
  if(params.includes(_DATABASE)){
    const index = params.indexOf(_DATABASE);
    if(params[index + 1] === 'mongo') data['orm'] = 'mongoose';
    else if(params[index + 1 === 'postgres']) data['orm'] = 'sequelize';
    else data['orm'] = 'mongoose';
  }  
  return data;
}

const gitStatus = cp.execSync('git status --porcelain').toString();

if(gitStatus.trim() !== ''){  
  console.log(chalk.yellow(`Please commit or stash changes before setting up the repository! This script will overwrite files in \`${_args[0]}\``));
  console.log(`Existing because \`${chalk.red('git status')}\` is not clean!`);
  console.log();
  console.log(chalk.yellow(`Resolve uncommited files:`));
  console.log(chalk.cyan(gitStatus));
  console.log();
  if(!isTestRun){
    // Exit Process if Git Status is not clean.
    console.log('Exiting script!');
    console.log();
    process.exit(-1);
  }
}

const _nodeVersionDetails = nodeVersion.split('.');
console.log(`You are running Node: ${nodeVersion}`);
if(_nodeVersionDetails[0] < 16)
console.log(
  '---------------' + 
  '\n\rTS Boilerplate requires node 16 or higher' + 
  '\n\rPlease update the version of node and execute this.'
)

// process.on('SIGINT', handleExit);
// process.on('uncaughtException', handleException);


const root = path.join(__dirname, '..');
const dependencies = path.join(__dirname, 'dependencies');
const args = processArguments(_args);
console.log(args);

init(args);

