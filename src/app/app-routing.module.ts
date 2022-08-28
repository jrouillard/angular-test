import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'create-transaction',
    loadChildren: () => import('./create-transaction/create-transaction.module').then(m => m.CreateTransactionModule)
  }, 
  { 
    path: 'list-transactions', 
    loadChildren: () => import('./list-transactions/list-transactions.module').then(m => m.ListTransactionsModule)
  },
  {
    path: '',
    redirectTo: 'list-transactions',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
