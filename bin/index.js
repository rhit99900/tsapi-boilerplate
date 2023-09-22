#!/usr/bin/env node
/**
 * Copyright (c) 2023-Present, Rohit Nair
 * Usage:
 * npx ts-api-boilerplate <DIRECTORY_NAME> [--sync]
 * @param DIRECTORY_NAME: _args[0] | #Relative Path of Directory for the Service.
 * @param TEST_VERIABLE?: Optional Parameter only for Dev Execution.
*/

'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const nodeVersion = process.versions.node;

const _args = process.argv.slice(2);

const { _variables, _TEST, _SYNC } = require('./utils/constants');
const { init } = require('./init');

console.log(_args, _variables);

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
  return data;
}

const gitStatus = cp.execSync('git status --porcelain').toString();

if(gitStatus.trim() !== ''){  
  console.log(`Please commit or stash changes before setting up the repository! This script will overwrite files in \`${_args[0]}\``);
  console.log(`Existing because \`git status\` is not clean!`);
  console.log();
  console.log('Resolve uncommited files:');
  console.log(gitStatus);
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
console.log(args, root);

init(args);

