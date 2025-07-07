import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlowsManagementService {
  /**
   * Simulates an API call to check if a flow name is already taken.
   * @param name The flow name to check.
   * @returns An observable that emits true if the name is taken, otherwise false.
   */
  isFlowNameTaken(name: string): Observable<boolean> {
    console.log(`%cVALIDATING: Is "${name}" taken?`, 'color: #3498db');

    // Make any name with "taken" in it invalid.
    const isTaken = name.toLowerCase().includes('taken');
    // The delay is not important for the final demo, can be simple.
    return of(isTaken).pipe(delay(100));
  }
}
