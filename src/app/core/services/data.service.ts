import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'})
export class DataService {
    private transactionAdded = new Subject<void>();

    transactionAdded$ = this.transactionAdded.asObservable();

    notifyTransactionAdded() {
        this.transactionAdded.next();
    }
}