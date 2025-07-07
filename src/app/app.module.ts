import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PlaygroundFlowComponent } from './playground-flow/playground-flow.component';
import { PlaygroundFlowFixedComponent } from './playground-flow-fixed/playground-flow-fixed.component';
import { PlaygroundFlowValidationComponent } from './playground-flow/playground-flow-validation.component';
import { PlaygroundFlowValidationFixedComponent } from './playground-flow/playground-flow-validation-fixed.component';

const routes: Routes = [
  { path: '', redirectTo: '/race-conditions-simple', pathMatch: 'full' },
  { path: 'race-conditions-simple', component: PlaygroundFlowComponent },
  {
    path: 'race-conditions-simple-fixed',
    component: PlaygroundFlowFixedComponent,
  },
  {
    path: 'validation-race-conditions',
    component: PlaygroundFlowValidationComponent,
  },
  {
    path: 'validation-race-conditions-fixed',
    component: PlaygroundFlowValidationFixedComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundFlowComponent,
    PlaygroundFlowFixedComponent,
    PlaygroundFlowValidationComponent,
    PlaygroundFlowValidationFixedComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
