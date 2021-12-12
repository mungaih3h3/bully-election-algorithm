import Process from "./Process";

export default class Registry {
    private constructor(processes: Process[] = []) {
        this.processes = processes;
    }
    processes: Process[]

    sendElectionMessages(priority: number): Boolean[] {
        const responses = []
        for(const process of this.processes) {
            if(process.alive) responses.push(process.receiveElectionMessage(priority))
        }
        return responses;
    }

    setCoordinator(process: Process) {
        return this.processes.map(p => p.setCoordinator(process));
    }

    //singleton
    private static _instance: Registry | undefined;
    static get instance() {
        if(!Registry._instance) {
            Registry._instance = new Registry();
        }
        return Registry._instance;
    }
}

