import { ErrorMapper } from "utils/ErrorMapper";
import { roleHarvester } from "./roles/roleHarvester";
import { roleUpgrader } from "./roles/roleUpgrader";


// log the latest commit ID from git
if (__REVISION__) {
  console.log(`Revision ID: ${__REVISION__}`);
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // if (!PRODUCTION) {
  //   // will only be included in development mode
  //   devLogger.log('loop started')
  // }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // 开始逻辑

  for (const creepsKey in Game.creeps) {
    const creep = Game.creeps[creepsKey];

    if(creep.memory.role === 'harvester') {
      roleHarvester(creep);
    }
    if(creep.memory.role === 'upgrader') {
      roleUpgrader(creep);
    }

  }


});
