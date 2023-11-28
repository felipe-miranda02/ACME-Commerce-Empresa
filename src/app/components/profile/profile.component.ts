import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa, EmpresaDto } from 'src/app/models/empresa.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import * as pako from 'pako';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private user: string | null;
  public empresa: Empresa = {} as Empresa;
  public empresaForm: any;
  public colorActual: string = '';
  public image: string = '';
  public bannerImage: string = '';
  
  @ViewChild('successModal') successModal!: ElementRef;

  colorOptions = [
    { label: 'Blue', name: 'blue', hex: '#' },
    { label: 'Red', name: 'red', hex: '#e53935' },
    { label: 'Purple', name: 'purple', hex: '#6a1b9a' },
    { label: 'Teal', name: 'teal', hex: '#00695c' },
    { label: 'Grey', name: 'grey', hex:  '#37474f' },
  ];


  constructor(
    private empresaService: EmpresaService,
    private authService: AuthenticationService,
    private imageService: ImageService,
    private fb: FormBuilder,
    private renderer: Renderer2,

  ) {
    this.user = this.authService.getUserId();
    this.initializeForm();
  }

  ngOnInit() {
    this.empresaService.getEmpresa().subscribe(
      (empresaData) => {
        this.initForm(empresaData);
        this.empresa = empresaData;
        this.colorActual = empresaData.lookAndFeel?.paletaDeColores!;
        this.image = empresaData.image as string;
        this.bannerImage = empresaData.lookAndFeel?.imagenBanner as string;
      },
      (error) => {
        console.error('Error fetching empresa data:', error);
      }
    );
  }

  private initForm(empresaData: any): void {
    this.empresaForm = this.fb.group({
      id: [empresaData.id, Validators.required],
      nombre: [empresaData.nombre, Validators.required],
      uri: [empresaData.uri, Validators.required],
      image: [this.image ?? ''], // Assuming image is not part of the fetched data
      lookAndFeel: this.fb.group({
        id: [empresaData.lookAndFeel.id, Validators.required],
        imagenBanner: [this.bannerImage ?? ''], // Assuming imagenBanner is not part of the fetched data
        paletaDeColores: [empresaData.lookAndFeel.paletaDeColores, Validators.required]
      })
    });
  }

  private initializeForm() {
    this.empresaForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      uri: ['', Validators.required],
      image: [null],
      lookAndFeel: this.fb.group({
        id: ['', Validators.required],
        imagenBanner: [null],
        paletaDeColores: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.empresaForm.valid) {
      const formData = this.createFormData();
      
      this.empresaService.updateEmpresa(formData).subscribe(
        (result) => {
          this.successModal.nativeElement.style.display = 'block';
        }
      );
    }
  }

  public onImageUploaded(event: any, type: 'Image' | 'ImagenBanner') {
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (type == 'Image') {
        this.image = reader.result as string;
      } else {
        this.bannerImage = reader.result as string;
      }
    }
    reader.readAsDataURL(file);
  }

  // Helper method to create form data
  private createFormData(): FormData {
    const formData = new FormData();

    formData.append('id', this.empresaForm.get('id').value);
    formData.append('nombre', this.empresaForm.get('nombre').value);
    formData.append('uri', this.empresaForm.get('uri').value);
    formData.append('image', this.image);
    formData.append('lookAndFeel.id', this.empresaForm.get('lookAndFeel.id').value);
    formData.append('lookAndFeel.imagenBanner', this.bannerImage);
    formData.append('lookAndFeel.paletaDeColores', this.empresaForm.get('lookAndFeel.paletaDeColores').value);

    return formData;
  }

  onCloseClicked() {
    this.successModal.nativeElement.style.display = 'none';
  }

  onBannerImageError() {
    this.bannerImage = 'https://ncs.cd.gov.mn/wp-content/themes/icetheme/assets/images/no-image.png';
  }

  onProfileImageError() {
    this.image = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  }

}
