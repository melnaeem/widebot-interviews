# Angular Refactoring Exercise: Playground Flow Name

This project contains a simplified version of a real-world Angular component for editing a "Flow's" name. The current implementation has several architectural and functional issues.

## The Goal

Your task is to refactor the `PlaygroundFlowComponent` to be more robust, maintainable, and aligned with modern Angular best practices.

### Core Requirements:

1.  **Use Reactive Forms**: Replace the current `ngModel`-based approach with `ReactiveFormsModule` and a `FormControl` to manage the name input.
2.  **Implement Debouncing**: The component should not trigger a "save" on every keystroke. Use RxJS's `debounceTime` operator to wait for the user to stop typing (e.g., 500ms).
3.  **Prevent Unnecessary Updates**: The "save" operation should only be triggered if the name has actually changed. Use the `distinctUntilChanged` operator.
4.  **Add Async Validation**: Implement a custom `AsyncValidator` to check if the new flow name is already taken.
    - The `FlowsManagementService` has a method `isFlowNameTaken(name: string)` which simulates a network request to check for uniqueness.
    - Your validator should use this service.
5.  **Handle State**:
    - The `FlowEditorService`'s `saveFlow()` method should only be called when the form is valid and the name has changed.
    - Display a "Saving..." message while the save operation is in progress.
    - Display a validation message if the name is taken.
    - The input should be disabled during the save operation.

### Files of Interest:

- `src/app/playground-flow/playground-flow.component.ts`: The component to refactor.
- `src/app/services/flows-management.service.ts`: Contains the logic for uniqueness validation.
- `src/app/services/flow-editor.service.ts`: Contains the logic for saving the flow.

Good luck!
