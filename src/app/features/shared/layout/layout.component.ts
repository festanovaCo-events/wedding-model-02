import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderHeartComponent } from '../components/common/loader-heart/loader-heart.component';
import { SplashMusicComponent } from '../components/ui/lottie/splash-music/splash-music.component';
import { FooterComponent } from '../components/common/footer/footer.component';
import { WEDDING_INFO } from '../constants/wedding-info';
import { BackgroundMusicService } from '../services/background-music.service';
import { ModalFlowService } from '../services/modal-flow.service';
import { ScrollLockService } from '../services/scroll-lock.service';

const MIN_LOADER_MS = 2000;
const MAX_LOADER_MS = 5000;
const SPLASH_PAUSE_DELAY_MS = 300;

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [
    CommonModule,
    RouterModule,
    LoaderHeartComponent,
    SplashMusicComponent,
    FooterComponent,
  ],
})
export class LayoutComponent implements OnInit {
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;
  @ViewChild(SplashMusicComponent) splashComp!: SplashMusicComponent;

  isLoading = true;
  modalDismissed = false;
  showContent = false;
  weddingInfo = WEDDING_INFO;

  private readonly destroyRef = inject(DestroyRef);
  private startTime = 0;
  private readonly timers: number[] = [];

  constructor(
    private router: Router,
    private modalFlowService: ModalFlowService,
    private backgroundMusic: BackgroundMusicService,
    private scrollLock: ScrollLockService,
  ) {}

  ngOnInit(): void {
    this.startTime = Date.now();

    this.later(MAX_LOADER_MS, () => {
      if (!this.isLoading) {
        return;
      }
      this.isLoading = false;
      this.showContent = true;
      this.scrollLock.unlock();
    });

    this.later(MIN_LOADER_MS, () => {
      this.isLoading = false;
      this.showContent = true;
      this.scrollLock.lock();
    });

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.startTime = Date.now();
        this.isLoading = true;
        return;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.finishNavigationLoader();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.timers.forEach((timerId) => window.clearTimeout(timerId));
    });
  }

  onAccept(withMusic: boolean): void {
    this.modalDismissed = true;
    this.scrollLock.unlock();
    this.modalFlowService.emitWelcomeModalAccepted();

    if (withMusic) {
      this.backgroundMusic.play();
      return;
    }

    this.later(SPLASH_PAUSE_DELAY_MS, () => {
      this.splashComp?.pauseAnimation();
    });
  }

  toggleMusic(): void {
    const playing = this.backgroundMusic.toggle();
    if (!this.splashComp) {
      return;
    }

    if (playing) {
      this.splashComp.playAnimation();
      return;
    }

    this.splashComp.pauseAnimation();
  }

  triggerBounce(): void {
    const el = this.modalContent?.nativeElement as HTMLElement | undefined;
    if (!el) {
      return;
    }

    el.classList.remove('app-pulse', 'app-slide-in-down');
    void el.offsetWidth;
    el.classList.add('app-pulse');
  }

  private finishNavigationLoader(): void {
    const elapsed = Date.now() - this.startTime;
    const remaining = MIN_LOADER_MS - elapsed;

    if (remaining > 0) {
      this.later(remaining, () => {
        this.isLoading = false;
      });
      return;
    }

    this.isLoading = false;
  }

  private later(delayMs: number, action: () => void): void {
    this.timers.push(window.setTimeout(action, delayMs));
  }
}
