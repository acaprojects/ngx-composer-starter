/**
* @Author: Alex Sorafumo <alex.sorafumo>
* @Date:   16/01/2017 9:43 AM
* @Email:  alex@yuion.net
* @Filename: bootstrap.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 31/01/2017 11:16 AM
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from '../../services/app.service';

@Component({
    selector: 'bootstrapper',
    styleUrls: ['./bootstrap.styles.scss'],
    templateUrl: './bootstrap.template.html'
})
export class BootstrapComponent implements OnInit {
    public query: any = null;
    public setup: any = false;
    public sys_id = '';
    public sys_text: string[] = [];
    public system_list: any[] = [];
    public select_sys = false;
    public sys: any = null;
    public system = 0;
    public module = '';

    private sys_timer: any = null;

    constructor(private route: ActivatedRoute, private app_service: AppService) {
        if (sessionStorage) {
            sessionStorage.setItem('trust', 'true');
        }
        this.query = this.route.queryParams.subscribe(params => {
            if (params['clear'] && (params['clear'] === true || params['clear'] === 'true')) {
                if (localStorage) {
                    localStorage.removeItem('ACA.CONTROL.system');
                    this.setup = true;
                }
            }
        });
    }

    public ngOnInit() {
        this.init();
    }

    public init() {
        if (!this.app_service.Settings.setup) {
            return setTimeout(() => this.init(), 500);
        }
        this.app_service.log('Bootstrap', 'Initialising...');
        if (localStorage) {
            const sys = localStorage.getItem('ACA.CONTROL.system');
            this.setup = sys ? false : true;
        }
        if (!this.setup) {
            this.app_service.log('Bootstrap', 'Settings found. Redirecting to set system...');
            return this.redirect();
        }
        this.app_service.log('Bootstrap', 'Settings not found. Loading systems...');
        this.loadSettings();
        setTimeout(() => {
            if (this.query) {
                this.query.unsubscribe();
                this.query = null;
            }
        }, 1000);
    }

    public loadSettings() {
        if (!this.app_service.Settings.setup) {
            return setTimeout(() => this.loadSettings(), 500);
        }
        const mod = this.app_service.Settings.get('module');
        if (mod && mod !== '') {
            this.module = mod;
        }
        this.app_service.listen('systems', (list) => {
            this.system_list = list;
            if (this.system_list && this.system_list.length > 0) {
                this.select_sys = true;
            }
        });
    }

    /**
     * Called when the user selects a system from the dropdown
     * @param  {number} index Index of the system in the systems list.
     * @return {void}
     */
    public selectSystem(system: any) {
        if (system) {
            this.sys = system;
            this.sys_id = this.sys.id;
        }
    }
    /**
     * Redirects the user to the set application
     * @return {void}
     */
    public redirect() {
        if (localStorage) {
            const sys_id = localStorage.getItem('ACA.CONTROL.system');
            if (sys_id) {
                this.app_service.navigate(`${sys_id}`, { 'trust': true, 'fixed_device': true });
            } else {
                this.setup = true;
                this.init();
            }
        } else {
            this.setup = true;
        }
    }
    /**
     * Configures the settings for the kiosk on the device
     * @return {void}
     */
    public configure() {
        if (this.sys_id && this.sys_id !== '') {
            if (localStorage) {
                localStorage.setItem('ACA.CONTROL.system', this.sys_id);
            }
            if (this.sys_timer) {
                clearTimeout(this.sys_timer);
                this.sys_timer = null;
            }
            this.app_service.navigate(`${this.sys_id}`, { 'trust': true, 'fixed_device': true });
        }
    }
}
