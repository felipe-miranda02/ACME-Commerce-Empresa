import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Orden } from 'src/app/models/orden.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  public ordenes: Orden[] = [];
  private user: string;
  public estado: string = 'Carrito';
  public currentPage: number = 1;
  public pageSize: number = 10;
  public pageCount: number = 1;
  public pageNumberArray: number[] = [];
  public fechaInicio = 1;

  constructor(
    public ordenService: OrderService,
    public authService: AuthenticationService
  ) {
    this.user = authService.getUserId();
  }

  ngOnInit() {
    if (this.authService.isUserAuthenticated() && this.user) {
      this.user = this.authService.getUserId();

      this.pageNumberArray = Array(this.pageCount)
        .fill(null)
        .map((x, i) => i + 1);

      this.ordenService
        .getOrders(this.user, this.estado, this.currentPage, this.pageSize)
        .subscribe((res) => {
          this.ordenes = res.ordenes;
          this.currentPage = res.currentPage;
          this.pageSize = res.pageSize;
          this.pageCount = res.pageCount;
          this.pageNumberArray = Array(this.pageCount)
            .fill(null)
            .map((x, i) => i + 1);
        });
    }
  }

  callGetOrdenes(pageNumber: number) {
    this.currentPage = pageNumber;
    this.ordenService
      .getOrders(this.user, this.estado, pageNumber, this.pageSize)
      .subscribe((res) => {
        this.ordenes = res.ordenes;
        this.currentPage = res.currentPage;
        this.pageSize = res.pageSize;
        this.pageCount = res.pageCount;
        this.pageNumberArray = Array(this.pageCount)
          .fill(null)
          .map((x, i) => i + 1);
      });
  }
}
