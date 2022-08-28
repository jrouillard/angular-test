import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTransactionRoutingModule } from './create-transaction-routing.module';
import { CreateTransactionComponent } from './create-transaction.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [
    CreateTransactionComponent
  ],
  imports: [
    CommonModule,
    CreateTransactionRoutingModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzSwitchModule,
    NzIconModule
  ]
})
export class CreateTransactionModule { }
