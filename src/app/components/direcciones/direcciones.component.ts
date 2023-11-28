import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { DireccionDeEntrega } from 'src/app/models/orden.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PickUpService } from 'src/app/services/pick-up.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css'],
})
export class DireccionesComponent {
  public pickups: DireccionDeEntrega[] = [];
  private user: string;
  public pickupForm: FormGroup;
  pickupId = -1;
  showAgregarDirecciones = false;

  mapOptions: google.maps.MapOptions = {
    center: { lat: -34.897524, lng: -56.164536 },
    zoom: 13,
    disableDefaultUI: true,
  };

  @ViewChild('map_add_dir') map_add_dir!: GoogleMap;
  @ViewChild('search') searchElementRef!: ElementRef<HTMLInputElement>;

  marker!: google.maps.LatLngLiteral;
  location!: google.maps.LatLng;
  statusMap = false;

  constructor(
    public pickUpService: PickUpService,
    public authService: AuthenticationService,
    private ngZone: NgZone
  ) {
    this.user = authService.getUserId();

    this.pickupForm = new FormGroup({
      searchInput: new FormControl('', [Validators.required]),
      nombre: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.initSearch();
  }

  ngOnInit() {
    this.pickupId = -1;
    this.showAgregarDirecciones = false;
    if (this.authService.isUserAuthenticated() && this.user) {
      this.pickUpService.getPickUps().subscribe({
        next: (value) => {
          console.log(' all values: ', value);
          this.pickups = [...value];
        },
      });
    }
  }

  initSearch() {
    if (this.searchElementRef.nativeElement && !this.statusMap) {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      this.statusMap = true;

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          const location = place.geometry?.location;
          if (!location) return;

          const latitud = location.lat();
          const longitud = location.lng();

          this.marker = { lat: latitud, lng: longitud };
          this.map_add_dir.center = this.marker;
          this.mapOptions = {
            center: this.marker,
          };
          this.pickupForm
            .get('searchInput')
            ?.patchValue(autocomplete.getPlace().formatted_address);
        });
      });
    }
  }

  eliminarPickUp(id?: number) {
    if (!id) return;
    this.pickUpService.delete(id).subscribe({
      next: (value) => {
        console.log(value);
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  crearPickUpCenter(form: any) {
    const data = { ...form };
    const body: DireccionDeEntrega = {
      direccionFormateada: data.searchInput,
      nombre: data.nombre,
      latitud: this.marker.lat,
      longitud: this.marker.lng,
    };

    this.pickUpService.create(body).subscribe({
      next: (value) => {
        console.log(value);
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPickUpCenter(id?: number) {
    console.log(id);
    if (!id) return;
    const element = this.pickups.find((x) => x.id === id);
    if (!element) return;
    this.pickupId = element?.id!;
    this.showAgregarDirecciones = true;
    this.pickupForm.patchValue({
      searchInput: element.direccionFormateada,
      nombre: element.nombre,
    });
    this.marker = { lat: element.latitud, lng: element.longitud };
    this.map_add_dir.center = this.marker;
    this.mapOptions = {
      center: this.marker,
    };
  }

  editarPickUp(form: any) {
    const data = { ...form };
    const body: DireccionDeEntrega = {
      id: this.pickupId,
      direccionFormateada: data.searchInput,
      nombre: data.nombre,
      latitud: this.marker.lat,
      longitud: this.marker.lng,
    };
    this.pickUpService.update(this.pickupId, body).subscribe({
      next: (value) => {
        console.log('Succesful! ', value);
        this.ngOnInit();
      },
    });
  }
}
