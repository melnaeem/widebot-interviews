import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, EMPTY } from 'rxjs';
import {
  switchMap,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs/operators';
import { PlaygroundFlow } from '../models/playground-flow.model';
import { FlowEditorService } from '../services/flow-editor.service';
import { FlowsManagementService } from '../services/flows-management.service';

const flowMock: PlaygroundFlow = {
  Id: '1',
  Name: 'My Flow',
};

@Component({
  selector: 'app-playground-flow-fixed',
  templateUrl: './playground-flow-fixed.component.html',
  styleUrls: ['../playground-flow/playground-flow.component.css'],
})
export class PlaygroundFlowFixedComponent implements OnInit, OnDestroy {
  flow: PlaygroundFlow = flowMock;
  lastSavedFlow: PlaygroundFlow | null = null;

  isSaving = false;
  isNameTaken = false;

  private nameChangeSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private flowEditorService: FlowEditorService,
    private flowsManagementService: FlowsManagementService
  ) {}

  ngOnInit(): void {
    this.loadLastSavedFlow();
    this.flow = this.lastSavedFlow || flowMock;

    // Set up the reactive stream to handle name changes with proper race condition prevention
    this.nameChangeSubject
      .pipe(
        debounceTime(1000), // Debounce input changes
        distinctUntilChanged(), // Only emit when the value actually changes [extra safety to prevent duplicate same value requests]
        switchMap((newName) => {
          // switchMap cancels the previous request if a new one starts
          const trimmedName = newName.trim();

          if (trimmedName === '' || trimmedName === this.flow.Name) {
            return EMPTY; // Don't make a request for empty or unchanged names
          }

          this.isSaving = true;
          this.isNameTaken = false; // Reset error state when starting new validation

          return this.flowsManagementService.isFlowNameTaken(trimmedName).pipe(
            switchMap((isTaken) => {
              if (isTaken) {
                this.isNameTaken = true;
                this.isSaving = false;
                return EMPTY; // Don't proceed to save if name is taken
              } else {
                this.isNameTaken = false;
                const updatedFlow = { ...this.flow, Name: trimmedName };
                return this.flowEditorService.saveFlow(updatedFlow);
              }
            })
          );
        }),
        takeUntil(this.destroy$) // Clean up when component is destroyed
      )
      .subscribe({
        next: (savedFlow) => {
          if (savedFlow) {
            this.flow = savedFlow;
            this.isSaving = false;
            this.loadLastSavedFlow();
          }
        },
        error: (error) => {
          console.error('Error processing name change:', error);
          this.isSaving = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLastSavedFlow() {
    const saved = localStorage.getItem('lastSavedFlow');
    if (saved) {
      this.lastSavedFlow = JSON.parse(saved);
      console.log({
        saved: this.lastSavedFlow,
      });
    }
  }

  /**
   * This method now simply emits the new name to the reactive stream.
   * The reactive stream handles debouncing, validation, and saving with proper race condition prevention.
   */
  onNameChange(newName: string): void {
    this.nameChangeSubject.next(newName);
  }
}
