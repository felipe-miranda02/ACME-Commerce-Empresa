import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  HuellaDeCarbono,
  ServicioDeEntrega,
} from 'src/app/models/orden.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ServicioEntregaService } from 'src/app/services/servicio-entrega.service';

@Component({
  selector: 'app-servicio-entrega',
  templateUrl: './servicio-entrega.component.html',
  styleUrls: ['./servicio-entrega.component.css'],
})
export class ServicioEntregaComponent implements OnInit {
  @ViewChild('servicioDeEntregaModalId') modal!: ElementRef;
  public serviciosDeEntrega: ServicioDeEntrega[] = [];
  private user: string;
  public servicioEntregaForm: FormGroup;
  servicioEntregaId = -1;
  huellasCarbono: number[] = [];

  constructor(
    public servicioEntregaService: ServicioEntregaService,
    public authService: AuthenticationService
  ) {
    this.user = authService.getUserId();

    this.huellasCarbono.push(
      ...[
        HuellaDeCarbono.Fosil,
        HuellaDeCarbono.Hidrico,
        HuellaDeCarbono.Electrico,
        HuellaDeCarbono.MedioLiviano,
      ]
    );

    this.servicioEntregaForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      costo: new FormControl(0, [Validators.required, Validators.min(0)]),
      velocidad: new FormControl('1 dia', Validators.required),
      seguimiento: new FormControl(''),
      huellaDeCarbono: new FormControl<HuellaDeCarbono>(
        HuellaDeCarbono.Fosil,
        Validators.required
      ),
    });
  }

  ngOnInit() {
    if (this.authService.isUserAuthenticated() && this.user) {
      this.servicioEntregaService.getServiciosDeEntrega().subscribe({
        next: (value) => {
          this.serviciosDeEntrega = [...value];
        },
      });
    }
  }

  eliminarServicioDeEntrega(id?: number) {
    if (!id) return;
    this.servicioEntregaService.delete(id).subscribe({
      next: (value) => {
        console.log(value);
        this.closeModal();
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  crearServicioDeEntrega(form: any) {
    const data = { ...form };
    const body: ServicioDeEntrega = {
      costo: data.costo,
      huellaDeCarbono: data.huellaDeCarbono,
      nombre: data.nombre,
      seguimiento: data.seguimiento,
      velocidad: data.velocidad,
    };

    this.servicioEntregaService.create(body).subscribe({
      next: (value) => {
        console.log(value);
        this.closeModal();
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getServicioDeEntrega(id?: number) {
    console.log(id);
    if (!id) return;
    const element = this.serviciosDeEntrega.find((x) => x.id === id);
    if (!element) return;
    this.servicioEntregaId = element?.id!;
    this.servicioEntregaForm.patchValue({
      costo: element.costo,
      huellaDeCarbono: element.huellaDeCarbono,
      nombre: element.nombre,
      seguimiento: element.seguimiento,
      velocidad: element.velocidad,
    });
  }

  editarServicioDeEntrega(form: any) {
    const data = { ...form };
    const body: ServicioDeEntrega = {
      id: this.servicioEntregaId,
      costo: data.costo,
      huellaDeCarbono: data.huellaDeCarbono,
      nombre: data.nombre,
      seguimiento: data.seguimiento,
      velocidad: data.velocidad,
    };
    this.servicioEntregaService.update(this.servicioEntregaId, body).subscribe({
      next: (value) => {
        console.log('Succesful! ', value);
        this.closeModal();
        this.ngOnInit();
      },
    });
  }

  getHuellaCarbonoValue(value: number): string {
    return HuellaDeCarbono[value];
  }

  closeModal() {
    this.modal.nativeElement.style.display = 'none';
    document.getElementById('closeBtn')!.click();
  }
}
