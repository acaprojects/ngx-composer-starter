
import { Routes } from '@angular/router';
import { AppShellComponent } from './shell/shell.component';
import { SampleComponent } from './shell/sample/sample.component';
import { BootstrapComponent } from './shell/bootstrap/bootstrap.component';

export const ROUTES: Routes = [
    { path: '', component: AppShellComponent, children: [
        { path: '', component: BootstrapComponent },
        { path: ':sys_id', component: SampleComponent }
    ] },
    { path: '**',      redirectTo: '' },
];
