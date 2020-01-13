import { ErrorMapper } from "utils/ErrorMapper";
import { roleBuilder } from "./roles/roleBuilder";
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
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  // 开始逻辑
  for (const name in Game.rooms) {
    console.log("Room \"" + name + "\" has " + Game.rooms[name].energyAvailable + " energy");
  }

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
  console.log("Harvesters: " + harvesters.length);

  if (harvesters.length < 2) {
    const newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "harvester"
      }
    } as SpawnOptions);
  }

  if (Game.spawns.Spawn1.spawning) {
    const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
    Game.spawns.Spawn1.room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns.Spawn1.pos.x + 1,
      Game.spawns.Spawn1.pos.y,
      { align: "left", opacity: 0.8 });
  }

  for (const creepsKey in Game.creeps) {
    const creep = Game.creeps[creepsKey];

    if (creep.memory.role === "harvester") {
      roleHarvester(creep);
    }
    if (creep.memory.role === "upgrader") {
      roleUpgrader(creep);
    }
    if (creep.memory.role === "builder") {
      roleBuilder(creep);
    }

  }


});
