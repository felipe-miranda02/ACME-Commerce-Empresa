import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Orden } from 'src/app/models/orden.interface';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {
  public orden: Orden = {} as Orden;
  ordenId: number = 0;

  constructor(
    private route: ActivatedRoute,
    public ordenService: OrderService,
    private router: Router

  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ordenId = +params['id'];
    });

    this.ordenService.getOrden(this.ordenId).subscribe(
      (orden) => {
        this.orden = orden;
      }
    );
  }

}
