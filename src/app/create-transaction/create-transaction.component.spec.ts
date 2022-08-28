import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { CreateTransactionComponent } from './create-transaction.component';

describe('CreateTransactionComponent', () => {
  let component: CreateTransactionComponent;
  let fixture: ComponentFixture<CreateTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NzSelectModule,
        RouterTestingModule,
        NzFormModule,
        NzSelectModule,
        NzSwitchModule,
        NzInputModule,
        BrowserAnimationsModule
      ],
      declarations: [ CreateTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create all inputs', () => {
    component.initForm();
    const formElem = fixture.debugElement.nativeElement.querySelector('#form-create');
    const inputs = formElem.querySelectorAll('input');
    expect(inputs.length).toEqual(6);
  });

  describe('transaction', () => {
    it('should create a transaction',
      () => {
        const formdata = {
          fromAccount: 'from',
          amout: 100,
          fee: false,
          toAccount: 'to',
          metadata: [{key: 'key', value: 'value'}],
        }
        const transaction = component.createTransaction(formdata);

        let transactionCompare = {...formdata} as any;
        transactionCompare.id = 1;
        transactionCompare.date = component.date;
        expect(transaction).toEqual(transactionCompare);
    });
  });

  describe('form control', () => {
    beforeEach(() => {
      component.validateForm.controls["metadata"] = component.fb.array([
        component.fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required]
        }),
        component.fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required]
        }),
        component.fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required]
        })
      ]);
    });

    it('only the last formgroup should have no validator',
      () => {
        component.updateValidators();

        expect(component.metadata.controls[0].get('key')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.metadata.controls[1].get('key')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.metadata.controls[2].get('key')?.hasValidator(Validators.required)).toBeFalse();
    });
    
    it('should delete the designated meta data form',
      () => {
        component.deleteMetadata(1);
        expect(component.metadata.controls).toHaveSize(2);
    });
  });
});
