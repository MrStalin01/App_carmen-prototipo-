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

  monto: number | null = null;
  descripcion = '';
  fecha = '';
  fechaDate: Date | null = null;

  errorMonto = '';
  errorDescripcion = '';
  errorFecha = '';

  validarMonto(): boolean {
    if (this.monto === null || this.monto === undefined) {
      this.errorMonto = 'El monto es obligatorio y debe ser numérico';
      return false;
    }
    if (isNaN(this.monto)) {
      this.errorMonto = 'El monto debe ser un número válido';
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
    const desc = this.descripcion.trim();

    if (!desc) {
      this.errorDescripcion = 'La descripción es obligatoria';
      return false;
    } else if (desc.length < 5) {
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

  onFechaChange(event: any): void {
    if (event.value) {
      this.fechaDate = event.value;
      this.fecha = formatDate(event.value, 'dd-MM-yyyy', 'es-ES');
      this.errorFecha = '';
    } else {
      this.errorFecha = 'La fecha es obligatoria';
    }
  }

  isFormValid(): boolean {
    return this.validarMonto() && this.validarDescripcion() && this.validarFecha();
  }

  confirm(): void {
    if (!this.isFormValid()) return;

    this.ingresoService.addIngreso({
      monto: this.monto!,
      descripcion: this.descripcion.trim(),
      fechaIngreso: this.fecha,
    });

    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
