import Registry from "./Registry";

export default class Process {
    constructor(id: number, priority: number) {
        this.id = id;
        this.priority = priority;
        Registry.instance.processes.push(this);
    }
    alive: boolean = true;
    registry: Registry = Registry.instance;
    coordinator: Process = this;
    id: number;
    priority: number;
    checkOnCoordinator() {
         if(this.coordinator.alive) {
            console.log(`ID: ${this.id}, PRIO: ${this.priority} says: Coordinator is alive!`)
            return true;
         } else {
            console.log(`ID: ${this.id}, PRIO: ${this.priority} says: Coordinator is dead!`)

            //coordinator not responding
            const responses = this.registry.sendElectionMessages(this.priority);
        
            //if a process with a higher priority responds. We let them take over
            if(responses.find(r => r)) {
                console.log(`ID: ${this.id}, PRIO: ${this.priority} says: Found process with higher priority. They will take over from here`)
                return false;
            }

            //if there is no response
            if(responses.length === 0) {
                console.log(`ID: ${this.id}, PRIO: ${this.priority} says: No response on election message, I appoint myself as coordinator`)
                this.registry.setCoordinator(this);
            }
            return false;
         }
    }
    receiveElectionMessage(priority: number) {
        if(this.priority <= priority) {
            console.log(`ID: ${this.id}, PRIO: ${this.priority} says: Received election message from higher/equal priority process`)

            return false;
        }
        else {
            console.log(`ID: ${this.id}, PRIO: ${this.priority} says: Received election message from lower priority process. I will take over from here`)

            const responses = this.registry.sendElectionMessages(this.priority);

            const higherPriority = responses.find(r => r);
            if(higherPriority) {
                console.log(`ID: ${this.id}, PRIO: ${this.priority} says: Found process with higher priority. They will take over from here`)
                return true;
            }


            console.log(`ID: ${this.id}, PRIO: ${this.priority} says: No process with higher priority. I appoint myself as coordinator`)

            //appoint itself as coordinator
            this.coordinator = this;

            this.registry.setCoordinator(this);

            return true;
        }
    }

    setCoordinator(process: Process) {
        if(this.priority > process.priority) {
            const responses = this.registry.setCoordinator(this);
            return false;
        } else {
            this.coordinator = process;
            return true;
        }
    }
}