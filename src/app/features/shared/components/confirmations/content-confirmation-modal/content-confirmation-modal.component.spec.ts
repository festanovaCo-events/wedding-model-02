/// <reference types="jasmine" />

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { InvitationInfoResponse } from '../../../interfaces/invitation.interface';
import { InvitationStateService } from '../../../services/invitation-state.service';
import { ContentConfirmationModalComponent } from './content-confirmation-modal.component';

const invitation: InvitationInfoResponse = {
  success: true,
  data: {
    available_seats: 7,
    used_seats: 1,
    total_seats: 7,
    invitation: {
      id: 'invitation-1',
      name: 'Jorge Mestre',
      status: 'PENDING',
      seats_reserved: 2,
      token: 'TOKEN',
      guests: [{ id: 'guest-1', name: 'Jorge Mestre' }],
    },
  },
};

describe('ContentConfirmationModalComponent', () => {
  let fixture: ComponentFixture<ContentConfirmationModalComponent>;
  let accept: jasmine.Spy;
  let decline: jasmine.Spy;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    accept = jasmine.createSpy('accept').and.returnValue(of({ success: true, data: null }));
    decline = jasmine.createSpy('decline').and.returnValue(of({ success: true, data: null }));
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error', 'success', 'info']);

    await TestBed.configureTestingModule({
      imports: [ContentConfirmationModalComponent],
      providers: [
        {
          provide: InvitationStateService,
          useValue: {
            invitationData$: new BehaviorSubject(invitation),
            getToken: () => 'TOKEN',
            accept,
            decline,
          },
        },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentConfirmationModalComponent);
    fixture.detectChanges();
  });

  it('opens the guest step after confirming attendance', fakeAsync(() => {
    const component = fixture.componentInstance;
    component.willAttend = true;
    component.onConfirmChange();

    expect(component.currentStep).toBe('loading');
    tick(1500);
    expect(component.currentStep).toBe('guests');
    expect(component.maximumAdditionalGuests).toBe(1);
    expect(component.partialQuotasMessage).toBe('Solo estás registrando 1 de 2 cupos.');
  }));

  it('declines the invitation after the guest confirms they will not attend', () => {
    const component = fixture.componentInstance;
    component.willAttend = false;
    component.onConfirmChange();

    expect(component.currentStep).toBe('decline-confirmation');
    component.confirmDecline();

    expect(decline).toHaveBeenCalled();
    expect(toastr.info).toHaveBeenCalled();
  });

  it('asks before sending a registration that does not use every seat', () => {
    const component = fixture.componentInstance;
    component.currentStep = 'guests';
    component.confirmSend();

    expect(component.currentStep).toBe('partial-quotas-confirmation');
    expect(accept).not.toHaveBeenCalled();
  });

  it('keeps the guest step and reports an error when accept fails', () => {
    accept.and.returnValue(throwError(() => new Error('network')));
    const component = fixture.componentInstance;
    component.currentStep = 'guests';
    component.send();

    expect(component.currentStep).toBe('guests');
    expect(toastr.error).toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
  });
});
