import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { Transaction } from '../shared/models/transaction.model';


@Component({
  selector: 'app-list-transactions',
  templateUrl: './list-transactions.component.html',
  styleUrls: ['./list-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTransactionsComponent implements OnInit, OnDestroy {
  listOfData: Transaction[] = [];
  listOfDisplayData: Transaction[] = [];
  dates: Date[] = [];
  query?: string;

  private searchSubscription?: Subscription;
  private searchSubject = new Subject<string>();
  
  constructor(private readonly cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getDataAndUpdateTable();
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((query: string) =>  {
        this.query = query;
        this.filter();
        this.cdRef.markForCheck(); 
      });
  }

  /**
   * fetch the transactions from the local storage
   * For this app, every key in the local storage is treated as a transaction
   */
  fetchTransactions() {
    // clear old transactions
    this.listOfData = [];
    const items = {...localStorage};
    Object.keys(items).forEach((transactionID: string) => {
      const transaction = JSON.parse(items[transactionID]) as Transaction;
      // the storage is storing the string representation of the date, we have to convert back
      transaction.date = new Date(transaction.date);
      this.listOfData.push(transaction);
    })
  }

  /**
   * get the data and update the table with the existing filters
   */
  private getDataAndUpdateTable() {
    this.fetchTransactions();
    this.filter();
  } 

  /**
   * delete the transaction from the localstorage
   * @param transactionID 
   */
  deleteTransaction(transactionID: number) {
   localStorage.removeItem(transactionID.toString());
   this.getDataAndUpdateTable();
  }

  /**
   * set searchSubject with the input value
   * triggers the search subscription
   * @param event 
   */
  inputSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query?.trim());
  }

  /**
   * filter listOfData on the query and selected dates
   */
  filter() {
    this.listOfDisplayData = this.listOfData.filter((item: Transaction) => {
      let found = true;
      if (this.query) {
        // filter on input textd
        found = found && item.id.toString().indexOf(this.query) !== -1;
      }
      if (this.dates.length > 0) {
        // filter on dates
        found = found && item.date >= this.dates[0] && item.date <= this.dates[1];
      }
      return found;
    });
  }

  /**
   * method called when the calendar values changes
   * calls the filter method
   * @param dates 
   */
  dateChange(dates: Date[]) {
    // when calendar is set
    if (dates.length > 0) {
      // set the first day at 00:00 am to be inclusive
      dates[0].setHours(0,0,0,0)
      // set the last day at 12:00 pm to be inclusive
      dates[1].setHours(24,0,0,0)
    }
    this.dates = dates;
    this.filter();
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }
}
 