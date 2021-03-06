export const roleUpgrader = (creep: Creep) => {
  // @ts-ignore
  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
    // @ts-ignore
    creep.memory.upgrading = false;
    creep.say("🔄 harvest");
  }
  // @ts-ignore
  if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
    // @ts-ignore
    creep.memory.upgrading = true;
    creep.say("⚡ upgrade");
  }
  // @ts-ignore
  if (creep.memory.upgrading) {
    if (creep.upgradeController(creep.room.controller!) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller!, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
};
