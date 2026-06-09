import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso.service';

interface CursoItem {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-cursos-add-member',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cursos-member.html',
  styleUrl: './cursos-member.scss',
})
export class CursosMember implements OnInit {
  private dialogRef = inject(MatDialogRef<CursosMember>);
  private cursoService = inject(CursoService);

  cursos: CursoItem[] = [];
  apuntados = new Set<string>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { cursosActuales: string[] }) {
    if (data?.cursosActuales) {
      data.cursosActuales.forEach(id => this.apuntados.add(id));
    }
  }

  ngOnInit(): void {
    this.cursoService.getActividades().subscribe((actividades: any[]) => {
      this.cursos = actividades.flatMap((a: any) =>
        (a.cursos ?? []).map((c: any) => ({
          id:     c.id,
          nombre: c.nombre_curso ?? '',
        }))
      );
    });
  }

  toggleCurso(curso: CursoItem): void {
    if (this.apuntados.has(curso.id)) {
      this.apuntados.delete(curso.id);
    } else {
      this.apuntados.add(curso.id);
    }
  }

  estaApuntado(curso: CursoItem): boolean {
    return this.apuntados.has(curso.id);
  }

  close(): void {
    this.dialogRef.close(null);
  }

  guardar(): void {
    this.dialogRef.close(Array.from(this.apuntados));
  }
}
