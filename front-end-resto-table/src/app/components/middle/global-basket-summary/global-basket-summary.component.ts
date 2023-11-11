import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BasketService} from "../../../services/basket.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {MiddleTabletState, StateService, UserTabletState} from "../../../services/state.service";
import {PaymentService} from "../../../services/payment.service";

@Component({
  selector: 'app-global-basket-summary',
  templateUrl: './global-basket-summary.component.html',
  styleUrls: ['./global-basket-summary.component.css']
})
export class GlobalBasketSummaryComponent implements OnInit {

  constructor(private router: Router, private basketService: BasketService,
              private paymentService: PaymentService,
              private route: ActivatedRoute,private http: HttpClient,
              private state: StateService) {}

  basket_total_price = 0
  tabletId: string = "0";

  selectedSortOption: string ="byPerson";
  allTabletteActivated: number[]=[] ;

  isPaymentPage: boolean=false;

  paymentOnEachTab: boolean=!this.paymentService.getGroupPayment();

  isEveryoneReady: boolean=this.basketService.checkIfEveryoneIsReadyToOrder();

  ngOnInit(): void {
    this.allTabletteActivated= this.basketService.getAllTabletteActivated();
    if (this.state.getMiddleTabletState() == MiddleTabletState.Final) {
        this.isPaymentPage = true;
      this.basket_total_price = this.basketService.getAllBasketsTotal(true)
    } else {
      this.state.setMiddleTabletState(MiddleTabletState.Preorder);
      this.basket_total_price = this.basketService.getAllBasketsTotal();
    }
  }

  redirectToCatalog() {
    this.router.navigate(['/home', this.tabletId]);
  }

  redirectToOrderNumber() {
    this.router.navigate(['/order-number', this.tabletId]);
    //this.allTabletteActivated= this.basketService.getAllTabletteActivated();
    console.log(this.basketService.baskets);
    this.state.setMiddleTabletState(MiddleTabletState.Preorder);
  }

  setSortOption(option: string) {
    this.selectedSortOption = option;
  }

  async confirmOrder(): Promise<void> {
    if (this.basketService.getAllBaskets().length !== 0) {
        this.sendOrderToBFF().subscribe((orderInformation: any) => {
          console.log(orderInformation);
          this.basketService.confirmBasket();
          this.router.navigate(['/waiting-screen']);
        });
    }
  }


  payOrder() {
    const url = "http://localhost:8080/api/connected-table/bill";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.state.setAllUserTabletState(UserTabletState.Idle);
    this.basketService.emptyAllBasketsAlreadyOrdered();
    this.http.post<any>(url, 1, httpOptions).subscribe(
      (response) => {
        console.log('POST request successful: ', response);
        this.router.navigate(['/end',0]);
      },
      (error) => {
        console.error('Error in POST request: ', error);
        this.router.navigate(['/end',0]);
      }
    );

  }

  sendOrderToBFF(): Observable<any> {
    const url = "http://localhost:8080/api/connected-table/order";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const data = {
      items: this.basketService.getAllBaskets().map(item => ({
        itemID: item.menuItem.id,
        shortName: item.menuItem.shortName,
        quantity: item.quantity
      })),
      tableNumber: 1
    }

    console.log(data);

    return this.http.post<any>(url, data, httpOptions);
  }


  isCustomerReady(tabletId: string) {
    return this.basketService.isCustomerReady(tabletId);
  }
}