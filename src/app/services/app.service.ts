/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   12/01/2017 2:25 PM
 * @Email:  alex@yuion.net
 * @Filename: app.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 03/02/2017 10:25 AM
 */

import { Location } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SystemsService, CommsService, OAuthService } from '@acaprojects/ngx-composer';
import { OverlayService } from '@acaprojects/ngx-widgets';

import { SettingsService } from './settings.service';
import { Utils } from '../shared/utility.class';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppService {
    private api_base = 'app_api';

    private _system = '';
    private subjects: any = {};
    private observers: any = {};

    private prev_route: string[] = [];
    private model: any = {};

    constructor(private _title: Title,
        private version: SwUpdate,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private overlay: OverlayService,
        private settings: SettingsService,
        // private comms: CommsService
        private systems: SystemsService
    ) {
        this.init();
        this.subjects.system = new BehaviorSubject('');
        this.observers.system = this.subjects.system.asObservable();
    }

    get endpoint() {
        const host = this.Settings.get('composer.domain');
        const protocol = this.Settings.get('composer.protocol');
        const port = ((protocol === 'https:') ? '443' : '80');
        const url = `${protocol || location.protocol}//${host || location.host}`;
        const endpoint = `${url}`;
        return endpoint;
    }

    get api_endpoint() {
        return `${this.endpoint}/${this.api_base}`;
    }

    public initSystem(sys: string) {
        this._system = sys;
        if (!this._system || this._system === '') {
            if (localStorage) {
                this._system = localStorage.getItem('ACA.CONTROL.system');
                if (this.subjects.system) {
                    this.subjects.system.next(this._system);
                }
            }
            if (!this._system || this._system === '') {
                this.navigate('bootstrap', null, false);
            } else {
                this.navigate('');
            }
        } else {
            if (this.subjects.system) {
                this.subjects.system.next(this._system);
            }
        }
    }

    public init() {
        if (!this.settings.setup) {
            return setTimeout(() => this.init(), 500);
        }
        this.version.available.subscribe(event => {
            this.settings.log('CACHE', `Update available: current version is ${event.current.hash} available version is ${event.available.hash}`);
            this.info('Newer version of the app is available', 'Refresh');
        });
        this.model.title = this.settings.get('app.title') || 'Angular Application';
        this.initialiseComposer();
        setInterval(() => this.checkCache(), 5 * 60 * 1000);
    }

    public initialiseComposer(tries: number = 0) {
        this.settings.log('SYSTEM', 'Initialising Composer...');
            // Get domain information for configuring composer
        const host = this.settings.get('composer.domain') || location.hostname;
        const protocol = this.settings.get('composer.protocol') || location.protocol;
        const port = (protocol.includes('https') ? '443' : '80');
        const url = `${protocol}//${host}`;
        const route = this.settings.get('composer.route') || '';
            // Generate configuration for composer
        const config: any = {
            id: 'AcaEngine',
            scope: 'public',
            host,
            protocol,
            port,
            oauth_server: `${url}/auth/oauth/authorize`,
            oauth_tokens: `${url}/auth/token`,
            redirect_uri: `${location.origin}${route}/oauth-resp.html`,
            api_endpoint: `${url}/control/`,
            proactive: true,
            login_local: this.settings.get('composer.local_login') || false,
            http: true,
        };
            // Enable mock/development environment if the settings is defined
        const env = this.settings.get('env');
        console.log('ENV:', env, env.includes('dev'));
        if (env && env.includes('dev')) {
            config.port = '3000';
            config.mock = true;
            config.http = false;
        }
        console.log('Config:', config);
            // Setup/Initialise composer
        this.systems.setup(config);
    }

    get Settings() { return this.settings; }
    // get Systems() { return this.systems; }
    get Overlay() { return this.overlay; }

    get system() { return this.observers.system; }

    set title(str: string) {
        if (!this.model.title) {
            this.model.title = this.settings.get('app.title') || '';
        }
        const title = `${str ? str : ''}${this.model.title ? ' | ' + this.model.title : ''}`;
        this._title.setTitle(title || this.settings.get('app.title'));
    }

    public navigate(path: string, query?: any, add_base: boolean = true) {
        const path_list = [];
        if (add_base) {
            path_list.push('_');
            path_list.push(this._system);
        }
        path_list.push(path);
        this.prev_route.push(this.router.url);
        // if (!this.systems.resources.authLoaded) {
        this.router.navigate(path_list, { queryParams: query });
        // } else {
        // this.router.navigate([path]);
        // }
    }

    public back() {
        if (this.prev_route.length > 0) {
            this.navigate(this.prev_route.pop(), null, false);
            this.prev_route.pop();
        } else {
            this.navigate('');
        }
    }

    public log(type: string, msg: string, args?: any, stream: string = 'debug') {
        this.settings.log(type, msg, args, stream);
    }

    public error(msg: string, action: string) {
        const message = msg ? msg : `Error`;
        this.overlay.notify('success', {
            innerHtml: `
            <div class="display-icon error" style="font-size:2.0em"></div><
            div>${message}</div>`,
            name: 'error-notify',
        });
    }

    public success(msg: string, action: string) {
        const message = msg ? msg : `Success`;
        this.overlay.notify('success', {
            innerHtml: `
            <div class="display-icon success" style="font-size:2.0em"></div>
            <div>${message}</div>`,
            name: 'success-notify',
        });
    }

    public info(msg: string, action: string) {
        const message = msg ? msg : `Information`;
        this.overlay.notify('info', {
            innerHtml: `
            <div class="display-icon info" style="font-size:2.0em"></div>
            </div><div>${message}</div>`,
            name: 'info-notify',
        });
    }

    get iOS() {
        return Utils.isMobileSafari();
    }

    private checkCache() {
        if (this.version.isEnabled) {
            this.settings.log('SYSTEM', 'Checking cache for updates');
            this.version.checkForUpdate()
                .then(() => this.settings.log('SYSTEM', 'Finished checking cache for updates'))
                .catch(err => this.settings.log('SYSTEM', err, null, 'error'));
        }
    }

}
