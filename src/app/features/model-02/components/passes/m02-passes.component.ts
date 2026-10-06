import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { TicketsIcon } from '@hugeicons/core-free-icons';
import { MODEL_02_INFO } from '../../constants/model-02-info';
import { InvitationStateService } from '../../../shared/services/invitation-state.service';

@Component({
  selector: 'app-m02-passes',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  templateUrl: './m02-passes.component.html',
})
export class M02PassesComponent {
  readonly info = MODEL_02_INFO;
  readonly icon = TicketsIcon;
  readonly reservedPasses$ = inject(InvitationStateService).seatsReserved$.pipe(
    map((seats) => seats ?? 2),
  );
}
