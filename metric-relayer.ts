import * as statistik from 'statistik';

import { DataPoint } from './data-point';

export class MetricRelayer {
    private methods = {
        i: 'increment',
        d: 'decrement',
        t: 'timing',
        g: 'gauge',
        s: 'send'
    };

    private log: any;

    constructor(private statsDServerUrl) {
        this.log = new statistik(statsDServerUrl);
    }

    public receive(dp: DataPoint) {
        const callArgs = [];
        const method2call = this.log[this.methods[dp.action]];
        if (!method2call) {
            console.error(`Method '${dp.action}' is not supported. Ignoring.`);
            return;
        }

        callArgs.push(dp.name);
        switch (dp.action) {
            case 't':
            case 'g':
                callArgs.push(dp.value);
                break;
        }

        if (dp.sr) {
            callArgs.push(dp.sr);
        }
        
        // log away, everything's fine
        method2call.apply(this.log, callArgs);
        this.log.increment('client.stats.collected');
    }
}
