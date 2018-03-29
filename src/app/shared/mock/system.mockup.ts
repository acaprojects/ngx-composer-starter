/**
* @Author: Alex Sorafumo <alex.sorafumo>
* @Date:   11/01/2017 4:16 PM
* @Email:  alex@yuion.net
* @Filename: mock-system.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 03/02/2017 2:26 PM
*/

import { MOCK_REQ_HANDLER } from '@acaprojects/ngx-composer';

const win = self as any;

win.systemData = win.systemData || {};
win.control = win.control || {};
win.control.systems =  win.control.systems || {};
win.control.systems['sys-B0'] = {
    System: [{
        name: 'Demo System',
    }],
    Demo: [{
        volume: 0,
        mute: false,
        views: 0,
        state: 'Idle',

        $play: () => {
            win.control.systems['sys-B0'].Demo[0].state = 'Playing';
        },

        $stop: () => {
            win.control.systems['sys-B0'].Demo[0].state = 'Stopped';
        },

        $volume: (value: number) => {
            this.volume = value;
            if (this.volume > 100) {
                this.volume = 100;
            } else if (this.volume < 0) {
                this.volume = 0;
            }
        },

        $mute: (state: boolean) => {
            this.mute = state;
        },

        $state: (status: string) => {
            this.state = status;
        },
    }],
};

setInterval(() => {
    const module = win.control.systems['sys-B0'].Demo[0];
    if (module.state === 'Stopped') {
        module.state = 'Idle';
    }
    module.views += Math.floor(Math.random() * 7);
}, 3 * 1000);

win.systemData['sys-B0'] = win.control.systems['sys-B0'];
