import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { PrestamoService, Objeto } from '../../services/prestamo.service';
import { ChangeDetectorRef } from '@angular/core';

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
  private cdr = inject(ChangeDetectorRef);

  disponibles: Objeto[] = [];
  prestados: Objeto[] = [];

  herramientaSeleccionadaId: string | null = null;
  entidadAjena = '';
  anotacionesPrestamo = '';

  errorEntidadAjena = '';
  errorAnotacionesPrestamo = '';

  herramientaDevueltaId: string | null = null;
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
    this.prestamoService.getDisponibles().subscribe({
      next: (data) => {
        this.disponibles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargando disponibles:', err),
    });
    this.prestamoService.getPrestados().subscribe({
      next: (data) => {
        this.prestados = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargando prestados:', err),
    });
  }

  prestar(): void {
    this.validarEntidadAjena();
    this.validarAnotacionesPrestamo();

    if (this.errorEntidadAjena || this.errorAnotacionesPrestamo) return;
    if (!this.herramientaSeleccionadaId) return;

    const herramienta = this.disponibles.find((h) => h.id === this.herramientaSeleccionadaId);
    if (!herramienta) {
      console.error('Herramienta seleccionada no encontrada');
      return;
    }

    const prestamoData = {
      esDeAva: true,
      entidadAjena: this.entidadAjena.trim(),
      inicioPrestamo: { anotaciones: this.anotacionesPrestamo.trim() },
    };

    this.prestamoService.prestarObjeto(herramienta.nombre, prestamoData).subscribe({
      next: () => {
        this.limpiarPrestamo();
        this.cargarDatos();
        this.dialogRef.close(true); // cierra el diálogo tras prestar
      },
      error: (err) => console.error('Error al prestar:', err),
    });
  }

  devolver(): void {
    this.validarAnotacionesDevolucion();
    if (!this.herramientaDevueltaId || this.errorAnotacionesDevolucion) return;
    if (!this.herramientaDevueltaId) return;

    const herramienta = this.prestados.find((h) => h.id === this.herramientaDevueltaId);
    if (!herramienta) {
      console.error('Herramienta devuelta no encontrada');
      return;
    }

    this.prestamoService
      .devolverObjeto(herramienta.nombre, this.anotacionesDevolucion.trim())
      .subscribe({
        next: () => {
          this.limpiarDevolucion();
          this.cargarDatos();
          this.dialogRef.close(true); // cierra el diálogo tras devolver
        },
        error: (err) => console.error('Error al devolver:', err),
      });
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
