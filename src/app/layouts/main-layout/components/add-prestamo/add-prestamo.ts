import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../../services/prestamo.service';

@Component({
  selector: 'app-add-prestamo',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './add-prestamo.html',
  styleUrl: './add-prestamo.scss',
})
export class AddPrestamo implements OnInit {
  private dialogRef = inject(MatDialogRef<AddPrestamo>);
  private prestamoService = inject(PrestamoService);
  private cdr = inject(ChangeDetectorRef);

  nombre = '';
  descripcion = '';
  sitioGuardado = '';

  errores = {
    nombre: '',
    descripcion: '',
    sitioGuardado: '',
  };

  ngOnInit(): void {
    this.validarNombre();
    this.validarDescripcion();
    this.validarUbicacion();
  }

  validarNombre(): void {
    if (!this.nombre.trim()) {
      this.errores.nombre = 'El nombre es obligatorio';
    } else if (this.nombre.length < 3) {
      this.errores.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else {
      this.errores.nombre = '';
    }
  }

  validarDescripcion(): void {
    if (!this.descripcion.trim()) {
      this.errores.descripcion = 'La descripción es obligatoria';
    } else if (this.descripcion.length < 5) {
      this.errores.descripcion = 'La descripción debe tener al menos 5 caracteres';
    } else {
      this.errores.descripcion = '';
    }
  }

  validarUbicacion(): void {
    if (!this.sitioGuardado.trim()) {
      this.errores.sitioGuardado = 'El sitio de guardado es obligatorio';
    } else {
      this.errores.sitioGuardado = '';
    }
  }

  isFormValid(): boolean {
    return (
      this.nombre.trim() !== '' &&
      this.descripcion.trim() !== '' &&
      this.sitioGuardado.trim() !== '' &&
      this.errores.nombre === '' &&
      this.errores.descripcion === '' &&
      this.errores.sitioGuardado === ''
    );
  }

  confirm() {
    this.validarNombre();
    this.validarDescripcion();
    this.validarUbicacion();
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    if (this.errores.nombre || this.errores.descripcion || this.errores.sitioGuardado) {
      return;
    }
    this.prestamoService.addObjeto(this.nombre, this.descripcion, this.sitioGuardado);
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
