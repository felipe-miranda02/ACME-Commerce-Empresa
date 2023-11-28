import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/models/empresa.interface';
import { Reporte, ProductoMasVendido, ServicioEntrega, ReporteGlobal, CategoriaDetalle } from 'src/app/models/reporte.interface';
import { ReporteService } from 'src/app/services/reporte.service';
import { OrderService } from 'src/app/services/order.service';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { tick } from '@angular/core/testing';
import { EmpresaService } from 'src/app/services/empresa.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-empresa-reportes',
  templateUrl: './empresa-reportes.component.html',
  styleUrls: ['./empresa-reportes.component.css']
})
export class EmpresaReportesComponent {

  empresa: Empresa = {} as Empresa;
  empresas: Empresa[] = [];
  isPremiumUser: boolean = false;
  data: Reporte = {} as Reporte;
  searchForm: FormGroup;
  public fechaInicio = "2022-01-01";
  public fechaFin = "2024-01-01";
  


  constructor(
    private reporteService: ReporteService,
    private orderService: OrderService,
    private empresaService: EmpresaService,
    private router: Router, 
  ) { 
    this.searchForm = new FormGroup({
      fechaInicio: new FormControl('2022-01-01', Validators.required),
      fechaFin: new FormControl('2024-01-01', Validators.required)
    });
  }

  ngOnInit() {
    this.empresaService.getEmpresa().subscribe((empresa: Empresa) => {
      this.empresa = empresa;
      this.isPremiumUser = empresa.suscripcion === 1;

      if (this.isPremiumUser) {
        this.empresaService.getEmpresas().subscribe((empresas: Empresa[]) => {
          //this.empresas = empresas.filter((empresa: Empresa) => empresa.id !== this.empresa.id);
          this.empresas = empresas
        });
      }
    });
  }

  formatearPremium(premium: number): string { 
    if(premium == 1){
      return 'Premium';
    } else{
      return 'Basica';
    }
  }

  generarReporte(id: string, nombre: string, tipo: string) {
    this.fechaInicio = this.searchForm.get('fechaInicio')?.value;
    this.fechaFin = this.searchForm.get('fechaFin')?.value;

    this.reporteService.getReporte(id, this.fechaInicio, this.fechaFin).subscribe((reporte: Reporte) => {
      this.data = reporte;

      const datosGenerales = {
      FechaDeInicio: this.data.desde,
      FechaDeFin: this.data.hasta,
      PagosConTarjeta: this.data.pagosTarjeta,
      PagosConEfectivo: this.data.pagosEfectivo,
      TotalDeOrdenes: this.data.totalOrdenes,
      TotalProductosVendidos: this.data.totalVentas,
    }

    const productosMasVendidos = this.data.productosMasVendidos.map((producto: ProductoMasVendido) => {
      return {
        Producto: producto.producto.titulo,
        CantidadVendida: producto.cantidadVendida,
        CantidadDevuelta: producto.cantidadDevuelto,
      }
    })

    const serviciosEntregas = this.data.serviciosEntregas.map((servicio: ServicioEntrega) => {
      return {
        Servicio: servicio.servicioDeEntrega.nombre,
        CantidadDeEnvios: servicio.cantidad,
      }
    })

    switch (tipo) { 
      case 'pdf': 
        this.generarPDF(reporte, nombre);
        break
      case 'excel': 
        this.exportToExcel(nombre, datosGenerales, productosMasVendidos, serviciosEntregas);
        break
      case 'csv': 
        this.exportToCSV(nombre, datosGenerales, productosMasVendidos, serviciosEntregas);
        break
    }
    });

  }

  generarPDF(reporte: Reporte, nombre: string) {

    var dd = {
      content: [
        { text: 'Reporte de Ventas\n\n', style: 'header' },
        `Empresa: ${nombre}\n\n`,
        `Desde: ${this.orderService.formatearFecha(reporte.desde)} - Hasta: ${this.orderService.formatearFecha(reporte.hasta)}\n\n`,
        `Pagos con Tarjeta: ${reporte.pagosTarjeta}\n\n`,
        `Pagos en Efectivo: ${reporte.pagosEfectivo}\n\n`,
        `Total de Órdenes: ${reporte.totalOrdenes}\n\n`,
        `Total de Ventas: ${reporte.totalVentas}\n\n`,
        { text: `Productos mas vendidos:\n`, style: 'subheader' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 15,
          bold: false,
        },
      }
    }
    reporte.productosMasVendidos.forEach(producto => {
       dd.content.push(`- ${producto.producto.titulo}; vendidos: ${producto.cantidadVendida} ; devueltos: ${producto.cantidadDevuelto}\n`)
    }),
    dd.content.push({ text: `\nServicios de Entrega:\n`, style: 'subheader' }),
    reporte.serviciosEntregas.forEach(servicio => {
      dd.content.push(`- ${servicio.servicioDeEntrega.nombre}; cantidad: ${servicio.cantidad}\n`)
    })
    console.log(dd);
    const pdfDocGenerator = (pdfMake as any).createPdf(dd).open();
  }  


  exportToExcel(nombre: string, datosGenerales: any, productosMasVendidos: any, serviciosEntregas: any): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([datosGenerales]);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(productosMasVendidos);
    const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(serviciosEntregas);

    const combinedWorksheet: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet, 'Informacion general');
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet1, 'Productos mas vendidos');
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet2, 'servicios de entrega');
    
    //const workbook: XLSX.WorkBook = { Sheets: { 'data': combinedWorksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(combinedWorksheet, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Reporte'+nombre);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    window.URL.revokeObjectURL(url);
  }

  exportToCSV(nombre: string, datosGenerales: any, productosMasVendidos: any, serviciosEntregas: any): void {
    const csvData1 = '\ufeff' + Papa.unparse([datosGenerales]);
    const csvData2 = '\ufeff' + Papa.unparse(productosMasVendidos);
    const csvData3 = '\ufeff' + Papa.unparse(serviciosEntregas);

    this.downloadCSV(csvData1, `DatosGeneralesReporte${nombre}`);
    this.downloadCSV(csvData2, `ProductosReporte${nombre}`);
    this.downloadCSV(csvData3, `EntregasReporte${nombre}`);
  }

  GenerarReporteGlobal(tipo: string) {
    this.fechaInicio = this.searchForm.get('fechaInicio')?.value;
    this.fechaFin = this.searchForm.get('fechaFin')?.value;

    this.reporteService.getReporteGlobal(this.fechaInicio, this.fechaFin).subscribe((reporte: ReporteGlobal) => {
      const datosGenerales = {
      FechaDeInicio: reporte.desde,
      FechaDeFin: reporte.hasta,
      PagosConTarjeta: reporte.pagosTarjeta,
      PagosConEfectivo: reporte.pagosEfectivo,
      TotalDeOrdenes: reporte.totalOrdenes,
      TotalProductosVendidos: reporte.totalVentas,
    }

    const productosMasVendidos = reporte.productosMasVendidos.map((producto: ProductoMasVendido) => {
      return {
        Producto: producto.producto.titulo,
        CantidadVendida: producto.cantidadVendida,
        CantidadDevuelta: producto.cantidadDevuelto,
      }
    })

    const serviciosEntregas = reporte.serviciosEntregas.map((servicio: ServicioEntrega) => {
      return {
        Servicio: servicio.servicioDeEntrega.nombre,
        CantidadDeEnvios: servicio.cantidad,
      }
    })

    const categorias = reporte.categorias.map((categoria: CategoriaDetalle) => {
      return {
        Categoria: categoria.nombre,
        CantidadDeProductos: categoria.cantidadProductos,
        CantidadDVendidos: categoria.cantidadVentas,
      }
    })

    const direccionesDeEntrega = reporte.direccionEntrega.map((direccion: any) => {
      return {
        Direccion: direccion.direccion.direccionFormateada,
        CantidadDeEnvios: direccion.cantidad,
      }
    })

    switch (tipo) { 
      case 'pdf': 
        this.generarPDFGlobal(reporte);
        break
      case 'excel': 
        this.exportToExcelGlobal(datosGenerales, productosMasVendidos, serviciosEntregas, categorias, direccionesDeEntrega);
        break
      case 'csv': 
        this.exportToCSVGlobal(datosGenerales, productosMasVendidos, serviciosEntregas, categorias, direccionesDeEntrega);
        break
    }
    });
  }

  generarPDFGlobal(reporte: ReporteGlobal) {

    var dd = {
      content: [
        { text: 'Reporte de Ventas\n\n', style: 'header' },
        `Desde: ${this.orderService.formatearFecha(reporte.desde)} - Hasta: ${this.orderService.formatearFecha(reporte.hasta)}\n\n`,
        `Pagos con Tarjeta: ${reporte.pagosTarjeta}\n\n`,
        `Pagos en Efectivo: ${reporte.pagosEfectivo}\n\n`,
        `Total de Órdenes: ${reporte.totalOrdenes}\n\n`,
        `Total de Ventas: ${reporte.totalVentas}\n\n`,
        { text: `Productos mas vendidos:\n`, style: 'subheader' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 15,
          bold: false,
        },
      }
    }
    reporte.productosMasVendidos.forEach(producto => {
       dd.content.push(`- ${producto.producto.titulo}; vendidos: ${producto.cantidadVendida} ; devueltos: ${producto.cantidadDevuelto}\n`)
    }),
    dd.content.push({ text: `\nServicios de Entrega:\n`, style: 'subheader' }),
    reporte.serviciosEntregas.forEach(servicio => {
      dd.content.push(`- ${servicio.servicioDeEntrega.nombre}; cantidad: ${servicio.cantidad}\n`)
    })
    dd.content.push({ text: `\nCategorias:\n`, style: 'subheader' }),
    reporte.categorias.forEach(categoria => {
      dd.content.push(`- ${categoria.nombre}; cantidad de productos: ${categoria.cantidadProductos}; cantidad de ventas: ${categoria.cantidadVentas}\n`)
    })
    dd.content.push({ text: `\nDirecciones de entrega:\n`, style: 'subheader' }),
    reporte.direccionEntrega.forEach(direccion => {
      dd.content.push(`- ${direccion.direccion.direccionFormateada}; cantidad de envios: ${direccion.cantidad}\n`)
    })

    const pdfDocGenerator = (pdfMake as any).createPdf(dd).open();
  }  


  exportToExcelGlobal(datosGenerales: any, productosMasVendidos: any, serviciosEntregas: any, categorias: any, direccionesDeEntrega: any): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([datosGenerales]);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(productosMasVendidos);
    const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(serviciosEntregas);
    const worksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(categorias);
    const worksheet4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(direccionesDeEntrega);

    const combinedWorksheet: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet, 'Informacion general');
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet1, 'Productos mas vendidos');
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet2, 'servicios de entrega');
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet3, 'categorias');    
    XLSX.utils.book_append_sheet(combinedWorksheet, worksheet4, 'direcciones de entrega');

    //const workbook: XLSX.WorkBook = { Sheets: { 'data': combinedWorksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(combinedWorksheet, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'ReporteGlobal');
  }

  exportToCSVGlobal(datosGenerales: any, productosMasVendidos: any, serviciosEntregas: any, categorias: any, direccionesDeEntrega: any): void {
    const csvData1 = '\ufeff' + Papa.unparse([datosGenerales]);
    const csvData2 = '\ufeff' + Papa.unparse(productosMasVendidos);
    const csvData3 = '\ufeff' + Papa.unparse(serviciosEntregas);
    const csvData4 = '\ufeff' + Papa.unparse(categorias);
    const csvData5 = '\ufeff' + Papa.unparse(direccionesDeEntrega);

    this.downloadCSV(csvData1, 'DatosGeneralesReporteGlobal');
    this.downloadCSV(csvData2, 'ProductosReporteGlobal');
    this.downloadCSV(csvData3, 'EntregasReporteGlobal');
    this.downloadCSV(csvData4, 'CategoriasReporteGlobal');
    this.downloadCSV(csvData5, 'DireccionesReporteGlobal');
  }

  downloadCSV(csvData: any, fileName: string) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
