import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlaygroundFlow } from '../models/playground-flow.model';
import { FlowEditorService } from '../services/flow-editor.service';

const flowMock: PlaygroundFlow = {
  Id: '1',
  Name: 'My Flow',
};

@Component({
  selector: 'app-playground-flow-validation-fixed',
  templateUrl: './playground-flow-validation-fixed.component.html',
  styleUrls: ['./playground-flow.component.css'],
})
export class PlaygroundFlowValidationFixedComponent
  implements OnInit, OnDestroy
{
  @Input() flow: PlaygroundFlow = flowMock;

  flowForm!: FormGroup;
  isSaving = false;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private flowEditorService: FlowEditorService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * GOOD: Declarative form creation with built-in validators
   * All validation rules are defined in one place
   */
  private createForm(): void {
    this.flowForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      tags: ['', [Validators.required, this.tagsValidator]],
    });
  }

  /**
   * Initialize form with data
   */
  private initializeForm(): void {
    this.flowForm.patchValue({
      name: this.flow.Name,
      description: 'Sample description for ' + this.flow.Name,
      tags: 'sample, demo, flow',
    });
  }

  /**
   * GOOD: Custom validator as a pure function
   * Reusable and easily testable
   */
  private tagsValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const tags = control.value
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    if (tags.length === 0) {
      return { noValidTags: true };
    }

    if (tags.length > 5) {
      return { tooManyTags: true };
    }

    return null;
  }

  /**
   * GOOD: Form submission with built-in validation
   * Framework handles all the validation coordination
   */
  saveFlow(): void {
    if (this.flowForm.invalid) {
      // Form submission automatically marks all fields as touched
      console.log('Form is invalid');
      return;
    }

    this.isSaving = true;

    const formValue = this.flowForm.value;
    const updatedFlow: PlaygroundFlow = {
      ...this.flow,
      Name: formValue.name.trim(),
    };

    this.flowEditorService
      .saveFlow(updatedFlow)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
   * GOOD: Centralized error message handling using object mapping
   * More maintainable and easier to extend
   *
   * Alternative approaches:
   * 1. Switch statement
   * 2. Map data structure
   * 3. Separate error message service
   */
  getErrorMessage(controlName: string): string {
    const control = this.flowForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    // Error message mapping - cleaner and more maintainable
    const errorMessages: { [key: string]: (error?: any) => string } = {
      required: () => `${controlName} is required`,
      minlength: (error) =>
        `${controlName} must be at least ${error.requiredLength} characters`,
      maxlength: (error) =>
        `${controlName} cannot exceed ${error.requiredLength} characters`,
      noValidTags: () => 'At least one valid tag is required',
      tooManyTags: () => 'Maximum 5 tags allowed',
    };

    // Find the first error and return its message
    const errorKey = Object.keys(errors)[0];
    const messageGenerator = errorMessages[errorKey];

    return messageGenerator
      ? messageGenerator(errors[errorKey])
      : 'Invalid input';
  }

  /**
   * GOOD: Simple, readable validation state checks
   */
  hasError(controlName: string): boolean {
    const control = this.flowForm.get(controlName);
    return !!(control && control.errors && control.touched);
  }

  /**
   * GOOD: Clean form state management
   */
  canSubmit(): boolean {
    return this.flowForm.valid && !this.isSaving;
  }
}
