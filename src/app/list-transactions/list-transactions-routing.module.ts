import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTransactionsComponent } from './list-transactions.component';

const routes: Routes = [{ path: '', component: ListTransactionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListTransactionsRoutingModule { }
