import { Component, OnInit, Input } from '@angular/core';
import { PlaygroundFlow } from '../models/playground-flow.model';
import { FlowEditorService } from '../services/flow-editor.service';
import { FlowsManagementService } from '../services/flows-management.service';

const flowMock: PlaygroundFlow = {
  Id: '1',
  Name: 'My Flow',
};

@Component({
  selector: 'app-playground-flow-validation',
  templateUrl: './playground-flow-validation.component.html',
  styleUrls: ['./playground-flow.component.css'],
})
export class PlaygroundFlowValidationComponent implements OnInit {
  @Input() flow: PlaygroundFlow = flowMock;

  // Template-driven form fields
  flowName: string = '';
  flowDescription: string = '';
  flowTags: string = '';

  // Manual validation flags - PROBLEMATIC APPROACH
  isFormValid: boolean = false;
  nameError: string = '';
  descriptionError: string = '';
  tagsError: string = '';

  isSaving: boolean = false;

  constructor(
    private flowEditorService: FlowEditorService,
    private flowsManagementService: FlowsManagementService
  ) {}

  ngOnInit(): void {
    this.flowName = this.flow.Name;
    this.flowDescription = 'Sample description for ' + this.flow.Name;
    this.flowTags = 'sample, demo, flow';
  }

  /**
   * PROBLEMATIC: Manual validation logic scattered throughout the component
   * Hard to maintain, test, and extend
   */
  validateName(): boolean {
    this.nameError = '';

    if (!this.flowName || this.flowName.trim().length === 0) {
      this.nameError = 'Flow name is required';
      return false;
    }

    if (this.flowName.trim().length < 3) {
      this.nameError = 'Flow name must be at least 3 characters';
      return false;
    }

    if (this.flowName.trim().length > 50) {
      this.nameError = 'Flow name cannot exceed 50 characters';
      return false;
    }

    return true;
  }

  validateDescription(): boolean {
    this.descriptionError = '';

    if (!this.flowDescription || this.flowDescription.trim().length === 0) {
      this.descriptionError = 'Description is required';
      return false;
    }

    if (this.flowDescription.trim().length < 10) {
      this.descriptionError = 'Description must be at least 10 characters';
      return false;
    }

    return true;
  }

  validateTags(): boolean {
    this.tagsError = '';

    if (!this.flowTags || this.flowTags.trim().length === 0) {
      this.tagsError = 'At least one tag is required';
      return false;
    }

    const tags = this.flowTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tags.length === 0) {
      this.tagsError = 'At least one valid tag is required';
      return false;
    }

    if (tags.length > 5) {
      this.tagsError = 'Maximum 5 tags allowed';
      return false;
    }

    return true;
  }

  /**
   * PROBLEMATIC: Manual validation orchestration
   * Have to remember to call all validation methods
   */
  validateForm(): boolean {
    const nameValid = this.validateName();
    const descriptionValid = this.validateDescription();
    const tagsValid = this.validateTags();

    this.isFormValid = nameValid && descriptionValid && tagsValid;
    return this.isFormValid;
  }

  /**
   * Called when user changes name input
   */
  onNameChange(): void {
    this.validateName();
  }

  /**
   * Called when user changes description
   */
  onDescriptionChange(): void {
    this.validateDescription();
  }

  /**
   * Called when user changes tags
   */
  onTagsChange(): void {
    this.validateTags();
  }

  /**
   * PROBLEMATIC: Have to manually validate everything before saving
   */
  saveFlow(): void {
    if (!this.validateForm()) {
      console.log('Form is not valid');
      return;
    }

    this.isSaving = true;

    const updatedFlow: PlaygroundFlow = {
      ...this.flow,
      Name: this.flowName.trim(),
    };

    this.flowEditorService.saveFlow(updatedFlow).subscribe({
      next: (savedFlow) => {
        this.isSaving = false;
        this.flow = savedFlow;
        console.log('Flow saved successfully:', savedFlow);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error saving flow:', error);
      },
    });
  }

  /**
   * Check if form can be submitted
   */
  canSubmit(): boolean {
    return this.isFormValid && !this.isSaving;
  }
}
