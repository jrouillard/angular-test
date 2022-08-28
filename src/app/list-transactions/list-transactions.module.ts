import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTransactionsRoutingModule } from './list-transactions-routing.module';
import { ListTransactionsComponent } from './list-transactions.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [
    ListTransactionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ListTransactionsRoutingModule,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzDropDownModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzTagModule,
    NzToolTipModule
  ]
})
export class ListTransactionsModule { }
