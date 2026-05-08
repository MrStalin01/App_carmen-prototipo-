import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DeleteMember } from '../delete-member/delete-member';
import { AddCurso } from '../add-curso/add-curso';

// import { AddCursoDialogComponent } from '../dialogs/add-curso-dialog/add-curso-dialog.component';

export interface Curso {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  profesor: string;
  horario: string;
  dias: string;
  plazas: number;
  inscritos: number;
  activo: boolean;
  fechaFin: string;
  selected: boolean;
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.scss'],
  imports: [
    CommonModule,
    MatMenuModule,
    FormsModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CursosComponent implements OnInit {
  // ── Estado UI ────────────────────────────────────────────────
  fabAbierto = false;
  filtrosAbiertos = false;
  textoBusqueda = '';

  filtros = [
    { label: 'Activos', activo: false },
    { label: 'Inactivos', activo: false },
    { label: 'Con plazas disponibles', activo: false },
    { label: 'Sin plazas', activo: false },
  ];

  // ── Datos (mock — reemplazar con servicio) ───────────────────
  cursos: Curso[] = [
    {
      id: '01',
      nombre: 'Yoga para mayores',
      descripcion: 'Sesiones adaptadas para personas mayores de 60 años',
      ubicacion: 'Sala A - Planta baja',
      profesor: 'Carmen López',
      horario: '10:00 – 11:30',
      dias: 'Lunes y Miércoles',
      plazas: 20,
      inscritos: 18,
      activo: true,
      fechaFin: '30/06/2026',
      selected: false,
    },
    {
      id: '02',
      nombre: 'Informática básica',
      descripcion: 'Manejo de ordenadores, correo electrónico e internet',
      ubicacion: 'Aula de informática',
      profesor: 'Raúl Fernández',
      horario: '16:00 – 18:00',
      dias: 'Martes y Jueves',
      plazas: 15,
      inscritos: 15,
      activo: true,
      fechaFin: '31/05/2026',
      selected: false,
    },
    {
      id: '03',
      nombre: 'Pintura y acuarela',
      descripcion: 'Técnicas de pintura para principiantes y nivel medio',
      ubicacion: 'Taller de arte',
      profesor: 'Marta Sanz',
      horario: '11:00 – 13:00',
      dias: 'Viernes',
      plazas: 12,
      inscritos: 7,
      activo: true,
      fechaFin: '30/06/2026',
      selected: false,
    },
    {
      id: '04',
      nombre: 'Baile de salón',
      descripcion: 'Rumba, vals y pasodoble para todas las edades',
      ubicacion: 'Salón principal',
      profesor: 'Antonio Ruiz',
      horario: '18:00 – 20:00',
      dias: 'Miércoles y Viernes',
      plazas: 30,
      inscritos: 24,
      activo: true,
      fechaFin: '30/09/2026',
      selected: false,
    },
    {
      id: '05',
      nombre: 'Lectura y tertulias',
      descripcion: 'Club de lectura con debate mensual de libros',
      ubicacion: 'Biblioteca',
      profesor: 'Isabel Torres',
      horario: '17:00 – 19:00',
      dias: 'Primer sábado del mes',
      plazas: 25,
      inscritos: 10,
      activo: false,
      fechaFin: '01/01/2026',
      selected: false,
    },
  ];

  cursosFiltrados: Curso[] = [];

  // ── Selección ────────────────────────────────────────────────
  get selectedCursos() {
    return this.cursos.filter((c) => c.selected);
  }
  get allSelected() {
    return this.cursos.length > 0 && this.cursos.every((c) => c.selected);
  }
  get someSelected() {
    return this.cursos.some((c) => c.selected) && !this.allSelected;
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.cursosFiltrados.forEach((c) => (c.selected = checked));
  }

  onCheckChange() {
    /* triggered by ngModel, no action needed */
  }

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.cursosFiltrados = [...this.cursos];
  }

  // ── Búsqueda y filtros ───────────────────────────────────────
  filtrarCursos() {
    const texto = this.textoBusqueda.toLowerCase().trim();
    const filtrosActivos = this.filtros.filter((f) => f.activo).map((f) => f.label);

    this.cursosFiltrados = this.cursos.filter((c) => {
      const matchTexto =
        !texto ||
        c.nombre.toLowerCase().includes(texto) ||
        c.profesor.toLowerCase().includes(texto) ||
        c.ubicacion.toLowerCase().includes(texto) ||
        c.descripcion.toLowerCase().includes(texto);

      let matchFiltro = true;
      if (filtrosActivos.includes('Activos')) matchFiltro = matchFiltro && c.activo;
      if (filtrosActivos.includes('Inactivos')) matchFiltro = matchFiltro && !c.activo;
      if (filtrosActivos.includes('Con plazas disponibles'))
        matchFiltro = matchFiltro && c.inscritos < c.plazas;
      if (filtrosActivos.includes('Sin plazas'))
        matchFiltro = matchFiltro && c.inscritos >= c.plazas;

      return matchTexto && matchFiltro;
    });
  }

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  toggleChip(filtro: { label: string; activo: boolean }) {
    filtro.activo = !filtro.activo;
    this.filtrarCursos();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  onEliminar() {
    const dialogRef = this.dialog.open(DeleteMember, { width: '400px' });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      console.log('Miembro eliminado'); // aquí llamarás al servicio
    });
  }
  onModificar() {
    console.log('Modificar');
  }
  openAddCurso() {
    this.dialog.open(AddCurso, { width: '400px' });
  }
  submit() {
    this.router.navigate(['/layouts'])
  }
}
