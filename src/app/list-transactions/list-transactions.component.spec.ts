import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Transaction } from '../shared/models/transaction.model';

import { ListTransactionsComponent } from './list-transactions.component';

describe('ListTransactionsComponent', () => {
  let component: ListTransactionsComponent;
  let fixture: ComponentFixture<ListTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let store: any = {};
  describe('table data', () => {
    beforeEach(() => {
      // mock localstorage
      store = {};
      const mockSessionStorage = {
        getItem: (key: string): string => key in store ? store[key] : null,
        setItem: (key: string, value: string) => store[key] = `${value}`,
        removeItem: (key: string) => delete store[key],
        clear: () => store = {}
      };
  
      spyOn(Storage.prototype, 'getItem').and.callFake(mockSessionStorage.getItem);
      spyOn(Storage.prototype, 'setItem').and.callFake(mockSessionStorage.setItem);
      spyOn(Storage.prototype, 'removeItem').and.callFake(mockSessionStorage.removeItem);
      spyOn(Storage.prototype, 'clear').and.callFake(mockSessionStorage.clear);
    });
    

    it('should fetch data', () => {
      localStorage.setItem('0', 'test');
      localStorage.setItem('1', 'test');
      component.fetchTransactions();
      expect(Object.keys({...store})).toHaveSize(2);
    });

    it('should delete line', () => {
      localStorage.setItem('0', 'test');
      localStorage.setItem('1', 'test');
      component.deleteTransaction(1);
      expect(localStorage.getItem('1')).toBeNull();
    })
  });
    
  describe('filter data', () => {
    beforeEach(() => {
      const transaction1 = {id: 1000, date: new Date()} as Transaction;
      const transaction2 = {id: 10, date: new Date(new Date().setDate(new Date().getDate()-12))} as Transaction;
      component.listOfData = [transaction1, transaction2];
    });
    it('should filter data with compatible query', () => {
      component.query = '1';
      component.filter();
      expect(component.listOfDisplayData).toHaveSize(2);
    });
    it('should filter data with different query', () => {
      component.query = '100';
      component.filter();
      expect(component.listOfDisplayData).toHaveSize(1);
      expect(component.listOfDisplayData[0].id).toEqual(1000);
    });
    it('should filter data with  current date', () => {
      component.dates = [new Date(), new Date()];
      component.filter();
      expect(component.listOfDisplayData).toHaveSize(1);
      expect(component.listOfDisplayData[0].id).toEqual(1000);
    });
    it('should filter data with date from 10 days ago', () => {
      component.dates = [new Date(new Date().setDate(new Date().getDate()-13)), new Date(new Date().setDate(new Date().getDate()-10))];
      component.filter();
      expect(component.listOfDisplayData).toHaveSize(1);
      expect(component.listOfDisplayData[0].id).toEqual(10);
    });
    it('should filter data with incompatible query and dates and return 0', () => {
      component.dates = [new Date(new Date().setDate(new Date().getDate()-13)), new Date(new Date().setDate(new Date().getDate()-10))];
      component.query = '1000';
      component.filter();
      expect(component.listOfDisplayData).toHaveSize(0);
    });
  });

  
  it('should set dates to be at both end of the days (00:00 and 24:00)', () => {
    component.dateChange([new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 0, 1)]);
    expect(component.dates[0].getHours()).toEqual(0);
    // first day after 01 january is 2
    expect(component.dates[1].getDate()).toEqual(2);
    expect(component.dates[1].getHours()).toEqual(0);
  });  
  
});
