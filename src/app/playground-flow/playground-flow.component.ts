import { Component, OnInit } from '@angular/core';
import { PlaygroundFlow } from '../models/playground-flow.model';
import { FlowEditorService } from '../services/flow-editor.service';
import { FlowsManagementService } from '../services/flows-management.service';

const flowMock: PlaygroundFlow = {
  Id: '1',
  Name: 'My Flow',
};

@Component({
  selector: 'app-playground-flow',
  templateUrl: './playground-flow.component.html',
  styleUrls: ['./playground-flow.component.css'],
})
export class PlaygroundFlowComponent implements OnInit {
  flow: PlaygroundFlow = flowMock;
  lastSavedFlow: PlaygroundFlow | null = null;

  isSaving = false;
  isNameTaken = false;

  private timeoutId: any;
  private tempFlowName = '';

  constructor(
    private flowEditorService: FlowEditorService,
    private flowsManagementService: FlowsManagementService
  ) {}

  ngOnInit(): void {
    this.loadLastSavedFlow();
    this.flow = this.lastSavedFlow || flowMock;
    this.tempFlowName = this.flow.Name;
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
   * This method is called on every key press in the input.
   * It uses a setTimeout to "debounce" the input and check for name uniqueness,
   * then saves the flow. This is not a good approach.
   */
  onNameChange(newName: string): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.tempFlowName = newName.trim();

    if (this.tempFlowName === '' || this.tempFlowName === this.flow.Name) {
      return;
    }

    this.timeoutId = setTimeout(() => {
      this.isSaving = true;
      this.flowsManagementService
        .isFlowNameTaken(this.tempFlowName)
        .subscribe((isTaken) => {
          if (isTaken) {
            this.isNameTaken = true;
            this.isSaving = false;
          } else {
            this.isNameTaken = false;
            const updatedFlow = { ...this.flow, Name: this.tempFlowName };
            this.flowEditorService
              .saveFlow(updatedFlow)
              .subscribe((savedFlow) => {
                this.flow = savedFlow;
                this.isSaving = false;
                this.loadLastSavedFlow();
              });
          }
        });
    }, 1000);
  }
}
