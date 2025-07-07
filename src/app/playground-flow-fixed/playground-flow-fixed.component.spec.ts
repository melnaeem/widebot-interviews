import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';

import { PlaygroundFlowFixedComponent } from './playground-flow-fixed.component';
import { FlowEditorService } from '../services/flow-editor.service';
import { FlowsManagementService } from '../services/flows-management.service';
import { PlaygroundFlow } from '../models/playground-flow.model';

// Run the tests with:
// npm test -- --include="**/playground-flow-fixed.component.spec.ts"

describe('PlaygroundFlowFixedComponent - Race Condition Fixed', () => {
  let component: PlaygroundFlowFixedComponent;
  let fixture: ComponentFixture<PlaygroundFlowFixedComponent>;
  let flowEditorService: FlowEditorService;
  let flowsManagementService: FlowsManagementService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaygroundFlowFixedComponent],
      imports: [FormsModule],
      providers: [FlowEditorService, FlowsManagementService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaygroundFlowFixedComponent);
    component = fixture.componentInstance;
    flowEditorService = TestBed.inject(FlowEditorService);
    flowsManagementService = TestBed.inject(FlowsManagementService);
    fixture.detectChanges();
  });

  it('should properly handle the race condition scenario with no conflicting UI state', fakeAsync(() => {
    // --- Test Setup ---
    // Create subjects to control the network requests
    const staleRequestSubject = new Subject<boolean>();
    const takenRequestSubject = new Subject<boolean>();

    // Spy on the service to control request responses
    spyOn(flowsManagementService, 'isFlowNameTaken').and.callFake(
      (name: string) => {
        if (name === 'stale') {
          return staleRequestSubject.asObservable();
        }
        if (name === 'taken') {
          return takenRequestSubject.asObservable();
        }
        return of(false);
      }
    );

    const saveFlowSpy = spyOn(flowEditorService, 'saveFlow').and.returnValue(
      of({ Id: '1', Name: 'stale' })
    );

    // --- Simulation (Same scenario as the buggy version) ---
    // 1. Type "stale" in the input
    component.onNameChange('stale');
    tick(1000); // Debounce timer fires
    expect(flowsManagementService.isFlowNameTaken).toHaveBeenCalledWith(
      'stale'
    );

    // 2. Immediately change to "taken"
    component.onNameChange('taken');
    tick(1000); // Debounce timer fires, previous request is cancelled by switchMap
    expect(flowsManagementService.isFlowNameTaken).toHaveBeenCalledWith(
      'taken'
    );

    // --- Resolution (Out of Order) ---
    // 3. The fast request for "taken" resolves first with `true` (name is taken)
    takenRequestSubject.next(true);
    takenRequestSubject.complete();

    // The UI correctly shows the error for "taken"
    expect(component.isNameTaken).toBe(true);
    expect(component.isSaving).toBe(false);

    // 4. The slow request for "stale" tries to resolve, but it was cancelled by switchMap
    // So this should have no effect on the UI state
    staleRequestSubject.next(false);
    staleRequestSubject.complete();

    // --- Final Assertion (No Bug) ---
    // The UI state remains consistent - no conflicting state
    expect(component.isNameTaken).toBe(true); // Still shows error for "taken"
    expect(component.isSaving).toBe(false);
    expect(saveFlowSpy).not.toHaveBeenCalled(); // No save operation triggered

    // The flow name hasn't been changed because the validation failed
    expect(component.flow.Name).toBe('My Flow'); // Original name unchanged
  }));

  it('should successfully save when a valid name is entered', fakeAsync(() => {
    // Test the happy path - valid name should save successfully
    spyOn(flowsManagementService, 'isFlowNameTaken').and.returnValue(of(false));
    const saveFlowSpy = spyOn(flowEditorService, 'saveFlow').and.returnValue(
      of({ Id: '1', Name: 'valid-name' })
    );

    component.onNameChange('valid-name');
    tick(1000); // Debounce timer fires

    expect(component.isNameTaken).toBe(false);
    expect(saveFlowSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ Name: 'valid-name' })
    );
    expect(component.flow.Name).toBe('valid-name');
    expect(component.isSaving).toBe(false);
  }));
});
