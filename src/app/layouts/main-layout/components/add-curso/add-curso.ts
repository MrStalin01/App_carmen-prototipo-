import { Component, inject, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const NUEVO_KEY = '__nuevo__';

@Component({
  selector: 'app-add-curso',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './add-curso.html',
  styleUrl: './add-curso.scss',
})
export class AddCurso {
  private dialogRef = inject(MatDialogRef<AddCurso>);

  // Actividades existentes para el select
  actividadesExistentes: string[] = [];

  // Select de actividad
  nombreSeleccionado: string = '';
  mostrarInputNuevoActividad: boolean = false;
  nombreNuevoActividad: string = '';

  // Datos del curso
  curso = {
    nombre_curso:  '',
    lugar:         '',
    duracion:      '',
    horarios:      '' as string,   // se parte por comas al enviar
    plazas:        null as number | null,
    fecha_inicio:  '',
    fecha_fin:     '',
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.actividadesExistentes = data?.cursosExistentes ?? [];
  }

  onNombreChange(): void {
    if (this.nombreSeleccionado === NUEVO_KEY) {
      this.mostrarInputNuevoActividad = true;
    } else {
      this.mostrarInputNuevoActividad = false;
    }
  }

  get nombreActividadFinal(): string {
    return this.mostrarInputNuevoActividad
      ? this.nombreNuevoActividad.trim()
      : this.nombreSeleccionado.trim();
  }

  get puedeGuardar(): boolean {
    return this.nombreActividadFinal.length > 0 && this.curso.nombre_curso.trim().length > 0;
  }

  confirm(): void {
    if (!this.puedeGuardar) return;

    const payload = {
      nombre_actividad: this.nombreActividadFinal,
      cursos: [
        {
          nombre_curso:  this.curso.nombre_curso.trim(),
          lugar:         this.curso.lugar.trim(),
          duracion:      this.curso.duracion.trim(),
          horarios:      this.curso.horarios
            .split(',')
            .map(h => h.trim())
            .filter(h => h.length > 0),
          plazas:        this.curso.plazas ?? 0,
          fecha_inicio:  this.curso.fecha_inicio || null,
          fecha_fin:     this.curso.fecha_fin    || null,
          profesor:      null,
          alumnos:       [],
        },
      ],
    };

    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
