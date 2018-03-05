
import { RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './shell/shell.component';
import { SampleComponent } from './shell/sample/sample.component';

export const ROUTES: Routes = [
    { path: '', component: AppShellComponent, children: [
        { path: '', component: SampleComponent },
        { path: ':sys_id', component: SampleComponent }
    ] },
    { path: '**',      redirectTo: '' },
];
