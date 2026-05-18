import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GastoIngresoService } from '../../services/gasto-ingreso.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NativeDateAdapter, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-ingreso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  templateUrl: './add-ingreso.html',
  styleUrl: './add-ingreso.scss',
})
export class AddIngresoComponent {
  private dialogRef = inject(MatDialogRef<AddIngresoComponent>);
  private ingresoService = inject(GastoIngresoService);

  monto: string = '';
  descripcion: string = '';
  fecha: string = '';
  fechaDate: Date | null = null;

  errorMonto: string = '';
  errorDescripcion: string = '';
  errorFecha: string = '';

  validarMonto(): void {
    const valor = this.monto.trim();
    if (valor === '') {
      this.errorMonto = 'El monto es obligatorio';
      return;
    }
    const valorNormalizado = valor.replace(',', '.');
    const regex = /^\d+(\.\d+)?$/;
    if (!regex.test(valorNormalizado)) {
      this.errorMonto = 'El monto debe ser un número positivo (puede usar decimales)';
      return;
    }
    const num = parseFloat(valorNormalizado);
    if (isNaN(num) || num <= 0) {
      this.errorMonto = 'El monto debe ser mayor que 0';
      return;
    }
    this.errorMonto = '';
  }

  validarDescripcion(): void {
    const desc = this.descripcion.trim();
    if (desc === '') {
      this.errorDescripcion = 'La descripción es obligatoria';
    } else if (desc.length < 5) {
      this.errorDescripcion = 'La descripción debe tener al menos 5 caracteres';
    } else {
      this.errorDescripcion = '';
    }
  }

  validarFecha(): void {
    if (!this.fechaDate) {
      this.errorFecha = 'La fecha es obligatoria';
    } else {
      this.errorFecha = '';
    }
  }

  onFechaChange(event: any): void {
    if (event.value) {
      this.fechaDate = event.value;
      this.fecha = formatDate(event.value, 'dd-MM-yyyy', 'en-US');
      this.errorFecha = '';
    } else {
      this.fechaDate = null;
      this.fecha = '';
      this.errorFecha = 'La fecha es obligatoria';
    }
    this.validarFecha();
  }

  isFormValid(): boolean {
    return (
      this.monto.trim() !== '' &&
      this.errorMonto === '' &&
      this.descripcion.trim() !== '' &&
      this.errorDescripcion === '' &&
      this.fechaDate !== null &&
      this.errorFecha === ''
    );
  }

  confirm(): void {
    if (!this.isFormValid()) return;

    const montoNumerico = parseFloat(this.monto.replace(',', '.'));
    this.ingresoService.addIngreso({
      monto: montoNumerico,
      descripcion: this.descripcion.trim(),
      fechaIngreso: this.fecha,
    });

    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
