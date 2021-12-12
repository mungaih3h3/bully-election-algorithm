import Process from "./Process";

const coord1 = new Process(1, 5)
const process1 = new Process(2, 4);
process1.coordinator = coord1;
const process2 = new Process(3, 2);
process2.coordinator = coord1;

//coordinator still alive
process1.checkOnCoordinator();
//coordinator fails
coord1.alive = false;

//process 2 checks on coordinator, but the coordinator is not alive
process2.checkOnCoordinator();

