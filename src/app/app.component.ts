import { Component, ViewContainerRef } from '@angular/core';
import { OverlayService } from '@acaprojects/ngx-widgets';
import { SystemsService } from '@acaprojects/ngx-composer';
import { OnInit } from '@angular/core';
import { AppService } from './services/app.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <div class="app">
        <router-outlet></router-outlet>
    </div>
    `,
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    constructor(private view: ViewContainerRef,
        private service: AppService,
        private overlay: OverlayService,
        private systems: SystemsService) {
        this.overlay.view = view;
    }

    public ngOnInit() {
        this.init();
    }

    public init(tries: number = 0) {
        if (tries > 100) {
            this.service.Settings.log('SYSTEM', 'Failed to load settings, reloading page...');
            location.reload();
            return;
        }
            // Wait until the settings have been loaded
        if (!this.service.Settings.setup) {
            setTimeout(() => { this.init(++tries); }, 500);
            return;
        }
        this.service.Settings.log('SYSTEM', 'Initialising Composer...');
            // Get domain information for configuring composer
        const host = this.service.Settings.get('composer.domain') || location.hostname;
        const protocol = this.service.Settings.get('composer.protocol') || location.protocol;
        const port = (protocol.includes('https') ? '443' : '80');
        const url = `${protocol}//${host}`;
        const route = this.service.Settings.get('composer.route') || '';
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
            login_local: this.service.Settings.get('composer.local_login') || false,
            http: true,
        };
            // Enable mock/development environment if the settings is defined
        const env = this.service.Settings.get('env');
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
}
