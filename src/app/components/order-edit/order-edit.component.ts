// src/app/order-edit/order-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css'],
})
export class OrderEditComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  order: { id: number; estado: string } = {
    id: 0,
    estado: '',
  };

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.order.id = +params['id'];
    });
    console.log(this.order.id);
  }

  saveOrder() {
    console.log(this.order.estado);
    this.orderService
      .updateOrder(this.order.id, this.order.estado)
      .subscribe(() => {
        this.router.navigate(['/ordenes']);
      });
  }
}
