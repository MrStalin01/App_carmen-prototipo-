import { Component, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateAdapter, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-add-ingreso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
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

  monto:       number | null = null;
  descripcion  = '';
  fechaDate:   Date | null = null;

  errorMonto       = '';
  errorDescripcion = '';
  errorFecha       = '';

  validarMonto(): boolean {
    if (!this.monto || isNaN(this.monto) || this.monto <= 0) {
      this.errorMonto = 'El monto debe ser mayor que 0';
      return false;
    }
    this.errorMonto = '';
    return true;
  }

  validarDescripcion(): boolean {
    if (!this.descripcion.trim() || this.descripcion.trim().length < 5) {
      this.errorDescripcion = 'Debe tener al menos 5 caracteres';
      return false;
    }
    this.errorDescripcion = '';
    return true;
  }

  validarFecha(): boolean {
    if (!this.fechaDate) {
      this.errorFecha = 'La fecha es obligatoria';
      return false;
    }
    this.errorFecha = '';
    return true;
  }

  isFormValid(): boolean {
    return this.validarMonto() && this.validarDescripcion() && this.validarFecha();
  }

  confirm(): void {
    if (!this.isFormValid()) return;


    const fechaIngreso = formatDate(this.fechaDate!, 'yyyy-MM-dd', 'en-US');


    this.dialogRef.close({
      monto:        this.monto!,
      descripcion:  this.descripcion.trim(),
      fechaIngreso,
    });
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
