
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './sample/sample.component';

export const ROUTES: Routes = [
    { path: '', component: SampleComponent },
    { path: '**',      redirectTo: '' },
];
