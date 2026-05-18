import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { PrestamoService, objeto } from '../../services/prestamo.service';

@Component({
  selector: 'app-prestar-devolver',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatTabsModule],
  templateUrl: './prestar-devolver.html',
  styleUrl: './prestar-devolver.scss',
})
export class PrestarDevolverComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<PrestarDevolverComponent>);
  private prestamoService = inject(PrestamoService);

  disponibles: objeto[] = [];
  prestados: objeto[] = [];

  herramientaSeleccionadaId: number | null = null;
  entidadAjena = '';
  anotacionesPrestamo = '';

  errorEntidadAjena = '';
  errorAnotacionesPrestamo = '';

  herramientaDevueltaId: number | null = null;
  anotacionesDevolucion = '';
  errorAnotacionesDevolucion = '';

  validarEntidadAjena(): void {
    if (!this.entidadAjena.trim()) {
      this.errorEntidadAjena = 'El nombre de la persona/entidad es obligatorio';
    } else {
      this.errorEntidadAjena = '';
    }
  }

  validarAnotacionesPrestamo(): void {
    const anot = this.anotacionesPrestamo.trim();
    if (!anot) {
      this.errorAnotacionesPrestamo = 'Las anotaciones son obligatorias';
    } else if (anot.length < 5) {
      this.errorAnotacionesPrestamo = 'Las anotaciones deben tener al menos 5 caracteres';
    } else {
      this.errorAnotacionesPrestamo = '';
    }
  }

  validarAnotacionesDevolucion(): void {
    const anot = this.anotacionesDevolucion.trim();
    if (!anot) {
      this.errorAnotacionesDevolucion = 'Las anotaciones de devolución son obligatorias';
    } else if (anot.length < 5) {
      this.errorAnotacionesDevolucion = 'Las anotaciones deben tener al menos 5 caracteres';
    } else {
      this.errorAnotacionesDevolucion = '';
    }
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.disponibles = [...this.prestamoService.getDisponibles()];
    this.prestados = [...this.prestamoService.getPrestados()];
  }

  prestar(): void {
    this.validarEntidadAjena();
    this.validarAnotacionesPrestamo();

    if (this.errorEntidadAjena || this.errorAnotacionesPrestamo) return;
    if (!this.herramientaSeleccionadaId) return;
    this.prestamoService.prestarObjeto(
      this.herramientaSeleccionadaId,
      this.entidadAjena.trim(),
      this.anotacionesPrestamo.trim(),
    );
    this.limpiarPrestamo();
    this.cargarDatos();
    this.dialogRef.close(true); // cierra el diálogo tras prestar
  }

  devolver(): void {
    this.validarAnotacionesDevolucion();
    if (!this.herramientaDevueltaId || this.errorAnotacionesDevolucion) return;
    if (!this.herramientaDevueltaId) return;
    this.prestamoService.devolverObjeto(
      this.herramientaDevueltaId,
      this.anotacionesDevolucion.trim(),
    );
    this.limpiarDevolucion();
    this.cargarDatos();
    this.dialogRef.close(true); // cierra el diálogo tras devolver
  }

  limpiarPrestamo(): void {
    this.herramientaSeleccionadaId = null;
    this.entidadAjena = '';
    this.anotacionesPrestamo = '';
  }

  limpiarDevolucion(): void {
    this.herramientaDevueltaId = null;
    this.anotacionesDevolucion = '';
  }

  close(): void {
    this.dialogRef.close();
  }
}
