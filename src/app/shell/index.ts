
import { AppShellComponent } from './shell.component';
import { SampleComponent } from './sample/sample.component';
import { BootstrapComponent } from './bootstrap/bootstrap.component';

export * from './shell.component';
export * from './sample/sample.component';

export const APP_COMPONENTS: any[] = [
    AppShellComponent,
    BootstrapComponent,
    SampleComponent
];
