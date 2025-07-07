import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { PlaygroundFlow } from '../models/playground-flow.model';

@Injectable({
  providedIn: 'root',
})
export class FlowEditorService {
  /**
   * Simulates an API call to save the flow.
   * @param flow The flow to save.
   * @returns An observable that emits the saved flow.
   */
  saveFlow(flow: PlaygroundFlow): Observable<PlaygroundFlow> {
    console.log(`%cSAVING: Flow "${flow.Name}"`, 'color: #e67e22');

    // Give the "stale" save a long delay and the "final" save a short one.
    const delayMs = flow.Name.toLowerCase().includes('stale') ? 5000 : 500;
    console.log(
      `%cDelay for SAVE "${flow.Name}" will be ${delayMs}ms`,
      'color: #c0392b'
    );

    return of(flow).pipe(
      delay(delayMs),
      tap((savedFlow) => {
        console.log('%cSaving to localStorage:', 'color: blue', savedFlow);
        localStorage.setItem('lastSavedFlow', JSON.stringify(savedFlow));
      })
    );
  }
}
