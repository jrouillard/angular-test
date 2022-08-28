import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CURRENCY, FROM_ACCOUNTS, TO_ACCOUNTS, Transaction } from '../shared/models/transaction.model';
import { getHighestId } from '../shared/utils';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTransactionComponent implements OnInit, OnDestroy {

  validateForm!: FormGroup;
  lastMetaForm!: FormGroup;
  private lastMetaFormSubscription?: Subscription;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  /**
   * initForm method to keep ngInit clean
   */
  initForm() {
    // the last (here first) metadata line is managed separately due to validators not being the same
    this.lastMetaForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.validateForm = this.fb.group({
      fromAccount: [null, [Validators.required]],
      toAccount: [null, [Validators.required]],
      // required, positive numbers only, not 0
      amount: [null, [Validators.required, Validators.pattern('^\\d*(\\.?\\d*)?$'), Validators.min(0.00001)]],
      currency: [this.currencies[0], [Validators.required]],
      fee: [false, [Validators.required]],
      metadata: this.fb.array([this.lastMetaForm])
    });
    // subscribe to the last metadata line
    this.lastMetaFormSubscribe();
  }

  /**
   * the last meta data line is treated differently (not required except if it is the first)
   * if the key and value is set, unsubscribe, create a new last meta data line
   * only the last line can create a new line
   */
  lastMetaFormSubscribe() {
    this.lastMetaFormSubscription = this.lastMetaForm.valueChanges.subscribe(_ => {
      if (this.lastMetaForm.valid === true && this.lastMetaForm.get('key')?.value !== '' && this.lastMetaForm.get('value')?.value !== '') {
        this.lastMetaFormSubscription?.unsubscribe();
        // create a new line - without validators -
        this.lastMetaForm = this.fb.group({
          key: ['',  null],
          value: ['',  null]
        });
        this.metadata.push(this.lastMetaForm);
        this.lastMetaFormSubscribe();
        this.updateValidators();
      }
    });
  }

  submitForm() {
    const transaction = this.createTransaction(this.validateForm.value);
    localStorage.setItem(transaction.id.toString(), JSON.stringify(transaction));
    this.router.navigate(['/']);
  }

  /**
   * create the transaction from the form values
   * @param formValue 
   * @returns 
   */
  private createTransaction(formValue: any): Transaction {
    const transaction = formValue;
    // we dont save the last metada line as it is either empty or not valid
    transaction.metadata.pop();
    transaction.date = new Date();
    // increment on the highest id
    transaction.id = getHighestId() + 1;
    return transaction as Transaction;
  }

  get metadata(): FormArray{
    return this.validateForm.controls["metadata"] as FormArray;
  }

  /**
   * delete the metadataline and update the validators if there is more than one line
   * @param metadataIndex index of the metadata line to remove
   */
  deleteMetadata(metadataIndex: number) {
    if (this.metadata.controls.length > 1) {
      this.metadata.removeAt(metadataIndex);
      this.updateValidators();
    }
  }

  /**
   * update the validators: they are all required except the last line, if the last line is not the first line
   */
  updateValidators() {
    this.metadata.controls.forEach(control => control.get('key')?.setValidators(Validators.required));
    this.metadata.controls.forEach(control => control.get('value')?.setValidators(Validators.required));
    if (this.metadata.controls.length > 1) {
      // the last meta data line has no validators
      this.lastMetaForm.get('key')?.clearValidators();
      this.lastMetaForm.get('value')?.clearValidators();
    }
    this.metadata.controls.forEach(control => control.get('key')?.updateValueAndValidity());
    this.metadata.controls.forEach(control => control.get('value')?.updateValueAndValidity());
  }

  // need public methods as they are imported from another module
  get fromAccounts(): string[] {
    return FROM_ACCOUNTS;
  }
  get toAccounts(): string[] {
    return TO_ACCOUNTS;
  }
  get currencies(): string[] {
    return CURRENCY;
  }

  ngOnDestroy() {
    this.lastMetaFormSubscription?.unsubscribe();
  }
}
