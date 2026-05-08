import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GastoIngresoService } from '../../services/gasto-ingreso.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateAdapter, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-gasto',
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
  templateUrl: './add-gasto.html',
  styleUrl: './add-gasto.scss',
})
export class AddGastoComponent {
  private dialogRef = inject(MatDialogRef<AddGastoComponent>);
  private gastoService = inject(GastoIngresoService);

  monto: number | null = null;
  descripcion = '';
  fecha = '';
  fechaDate: Date | null = null;

  errorMonto = '';
  errorDescripcion = '';
  errorFecha = '';

  validarMonto(): boolean {
    if (this.monto === null || this.monto === undefined) {
      this.errorMonto = '';
      return false;
    }
    if (this.monto <= 0) {
      this.errorMonto = 'El monto debe ser mayor que 0';
      return false;
    }
    this.errorMonto = '';
    return true;
  }

  validarDescripcion(): boolean {
    if (!this.descripcion.trim()) {
      this.errorDescripcion = 'La descripción es obligatoria';
      return false;
    } else if (this.descripcion.trim().length < 5) {
      this.errorDescripcion = 'La descripción debe tener al menos 5 caracteres';
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

  onFechaChange(event: any): void {
    if (event.value) {
      this.fecha = formatDate(event.value, 'dd-MM-yyyy', 'en-US');
    }
  }

  isFormValid(): boolean {
    return this.validarMonto() && this.validarDescripcion() && this.validarFecha();
  }

  confirm(): void {
    if (!this.isFormValid()) return;

    this.gastoService.addGasto({
      monto: this.monto!,
      descripcion: this.descripcion.trim(),
      fechaGasto: this.fecha,
    });

    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
