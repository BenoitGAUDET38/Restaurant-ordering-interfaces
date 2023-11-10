import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BasketService} from "../../services/basket.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-global-basket-summary',
  templateUrl: './global-basket-summary.component.html',
  styleUrls: ['./global-basket-summary.component.css']
})
export class GlobalBasketSummaryComponent implements OnInit {

  private diningBaseUrlHostAndPort: string = "http://localhost:3001";

  constructor(private router: Router, private basketService: BasketService,
              private route: ActivatedRoute,private http: HttpClient) {}

  basket_total_price = 0
  tabletId: string = "0";

  selectedSortOption: string ="global";
  allTabletteActivated: number[]=[1,2] ;


  ngOnInit(): void {
    this.basket_total_price = this.basketService.getAllBasketsTotal();
    //this.allTabletteActivated= this.basketService.getAllTabletteActivated();
    console.log(this.basketService.baskets);
  }

  redirectToCatalog() {
    this.router.navigate(['/home', this.tabletId]);
  }

  redirectToOrderNumber() {
    this.router.navigate(['/order-number', this.tabletId]);
  }

  setSortOption(option: string) {
    this.selectedSortOption = option;
  }

  async myMethod(): Promise<void> {

    if (this.basketService.getAllBaskets().length !== 0) {
        this.sendOrderToBFF().subscribe((orderInformation: any) => {
          console.log(orderInformation);
          this.basketService.confirmBasket();
        });
    }

    this.router.navigate([''])
  }

  sendOrderToBFF(): Observable<any> {
    const url = "http://localhost:8080/api/connect-table/order";

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




}