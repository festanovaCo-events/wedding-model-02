import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmationGuideStore {
  private readonly storageKey = 'confirmation_guide_shown';

  hasBeenDismissed(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  markDismissed(): void {
    localStorage.setItem(this.storageKey, 'true');
  }
}
