import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { ArrowDown01Icon, FavouriteIcon, LinkSquare01Icon } from '@hugeicons/core-free-icons';
import { PREVIEW_QUERY_PARAM, PREVIEW_QUERY_VALUE } from '../../constants/app-routes';
import { EXPIRED_INVITATION_COPY } from '../../constants/expired-invitation-copy';

@Component({
  selector: 'app-invitation-card',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  templateUrl: './invitation-card.component.html',
  styleUrl: './invitation-card.component.css',
})
export class InvitationCardComponent implements OnChanges {
  @Input() invitationUrl = '';

  readonly copy = EXPIRED_INVITATION_COPY;
  readonly heartIcon = FavouriteIcon;
  readonly chevronIcon = ArrowDown01Icon;
  readonly openIcon = LinkSquare01Icon;

  isOpen = false;
  /** Hasta un clic, una capa tapa el iframe para que el scroll sea de la página. */
  iframeInteractive = false;
  safeIframeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    this.safeIframeUrl = this.invitationUrl
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.buildPreviewUrl(this.invitationUrl))
      : null;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.iframeInteractive = false;
    }
  }

  enableIframeInteraction(): void {
    this.iframeInteractive = true;
  }

  get openInNewTabUrl(): string {
    return this.buildPreviewUrl(this.invitationUrl);
  }

  private buildPreviewUrl(url: string): string {
    if (!url) {
      return '';
    }

    try {
      const parsed = new URL(url, window.location.origin);
      parsed.searchParams.set(PREVIEW_QUERY_PARAM, PREVIEW_QUERY_VALUE);
      return parsed.toString();
    } catch {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}${PREVIEW_QUERY_PARAM}=${PREVIEW_QUERY_VALUE}`;
    }
  }
}
