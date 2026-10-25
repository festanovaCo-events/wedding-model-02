import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { MODEL_02_INFO } from '../../constants/m02-info';
import { MODEL_02_TIMELINE_ICONS } from '../../constants/m02-timeline-icons';

@Component({
  selector: 'app-m02-timeline',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  templateUrl: './m02-timeline.component.html',
})
export class M02TimelineComponent {
  readonly info = MODEL_02_INFO;
  readonly timelineIcons = MODEL_02_TIMELINE_ICONS;
}
