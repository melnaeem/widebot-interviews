import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PlaygroundFlowComponent } from './playground-flow/playground-flow.component';
import { PlaygroundFlowValidationComponent } from './playground-flow-validation/playground-flow-validation.component';

const routes: Routes = [
  { path: '', redirectTo: '/race-conditions-simple', pathMatch: 'full' },
  { path: 'race-conditions-simple', component: PlaygroundFlowComponent },

  {
    path: 'validation-race-conditions',
    component: PlaygroundFlowValidationComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundFlowComponent,
    PlaygroundFlowValidationComponent,
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
