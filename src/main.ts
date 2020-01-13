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

  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === "upgrader");
  console.log("Upgraders: " + upgraders.length);

  if (upgraders.length < 2) {
    const newName = "Upgrader" + Game.time;
    console.log("Spawning new Upgrader: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "upgrader"
      }
    } as SpawnOptions);
  }

  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === "builder");
  console.log("Builders: " + harvesters.length);

  if (builders.length < 2) {
    const newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "builder"
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


  const tower = Game.getObjectById("8a20440937be485db2f9973d" as Id<StructureTower>);
  if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
    });
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
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
