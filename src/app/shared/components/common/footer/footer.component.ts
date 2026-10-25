import { Component } from '@angular/core';
import { SITE_CREDIT } from '../../../constants/site-credit';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly credit = SITE_CREDIT;
}
