import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { AddMember } from './components/add-member/add-member';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Member } from './components/member/member';
import { DeleteMember } from './components/delete-member/delete-member';
import { AddCurso } from './components/add-curso/add-curso';
import { CursosMember } from './components/cursos-member/cursos-member';
import { RouterModule } from '@angular/router';
import { SocioService } from '../../core/services/socios/socios.service';
import { ActividadService } from '../../core/services/actividad/actividad.service';

interface Socio {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tel: string;
  dni: string;
  estado: string;
  fechaVenc: string;
  profesor: string;
  selected: boolean;
  cursos: string[];
  cursosAbiertos: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private socioService = inject(SocioService);
  private actividadService = inject(ActividadService);

  filtrosAbiertos = false;
  sortColumn: 'nombres' | 'apellidos' | null = null;
  sortAsc = true;
  estadoFiltro: 'todos' | 'Activo' | 'Inactivo' = 'todos';
  profesorFiltro: 'todos' | 'Si' | 'No' = 'todos';
  textoBusqueda = '';

  filtros = [
    { label: 'Activo', activo: false },
    { label: 'Inactivo', activo: false },
    { label: 'Profesor', activo: false },
    { label: 'A → Z', activo: false },
    { label: 'Z → A', activo: false },
    { label: '0 → 9', activo: false },
    { label: '9 → 0', activo: false },
  ];

  socios: Socio[] = [];
  cursosDisponibles: string[] = [];

  ngOnInit(): void {
    this.cargarSocios();
    this.cargarActividades();
  }

  cargarSocios(): void {
    this.socioService.getAll().subscribe((data: any[]) => {
      this.socios = data.map((s: any) => ({
        id: s.id,
        nombres: s.informacionPersonalModel?.nombres ?? '',
        apellidos: s.informacionPersonalModel?.apellidos ?? '',
        correo: s.informacionPersonalModel?.correo ?? '',
        tel: s.informacionPersonalModel?.telefono ?? '',
        dni: s.informacionPersonalModel?.identificacion ?? '',
        estado: s.estado_Socio ?? '',
        fechaVenc: s.fecha_vencimiento ?? '',
        profesor: s.tipo_socio === 'profesor' ? 'Si' : 'No',
        cursos: Object.values(s.actividades ?? {}).flatMap((a: any) =>
          (a.cursos ?? []).map((c: any) => c.nombreCurso)
        ),
        cursosAbiertos: false,
        selected: false,
      }));
    });
  }

  cargarActividades(): void {
    this.actividadService.getAll().subscribe((data: any[]) => {
      this.cursosDisponibles = data.flatMap((a: any) =>
        (a.cursos ?? []).map((c: any) => c.nombreCurso)
      );
    });
  }

  private mapToApiSocio(s: any): any {
    return {
      informacionPersonalModel: {
        nombres: s.nombres,
        apellidos: s.apellidos,
        correo: s.correo,
        telefono: s.tel,
        identificacion: s.dni,
      },
      estado_Socio: s.estado,
      tipo_socio: s.profesor === 'Si' ? 'profesor' : 'socio',
    };
  }

  get sociosFiltrados(): Socio[] {
    let lista = this.socios;

    if (this.estadoFiltro !== 'todos') {
      lista = lista.filter((s) => s.estado === this.estadoFiltro);
    }
    if (this.profesorFiltro !== 'todos') {
      lista = lista.filter((s) => s.profesor === this.profesorFiltro);
    }
    if (this.textoBusqueda.trim()) {
      const texto = this.textoBusqueda.toLowerCase().trim();
      lista = lista.filter(
        (s) =>
          s.nombres.toLowerCase().includes(texto) ||
          s.apellidos.toLowerCase().includes(texto) ||
          s.correo.toLowerCase().includes(texto) ||
          s.dni.toLowerCase().includes(texto),
      );
    }

    return lista;
  }

  get allSelected(): boolean {
    return this.sociosFiltrados.length > 0 && this.sociosFiltrados.every((s) => s.selected);
  }

  get someSelected(): boolean {
    return this.sociosFiltrados.some((s) => s.selected) && !this.allSelected;
  }

  get selectedSocios(): Socio[] {
    return this.socios.filter((s) => s.selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.sociosFiltrados.forEach((s) => (s.selected = checked));
  }

  fabAbierto = false;

  onCheckChange(): void {}

  filtrarEstado(): void {
    if (this.estadoFiltro === 'todos') this.estadoFiltro = 'Activo';
    else if (this.estadoFiltro === 'Activo') this.estadoFiltro = 'Inactivo';
    else this.estadoFiltro = 'todos';
  }

  filtrarProfesor(): void {
    if (this.profesorFiltro === 'todos') this.profesorFiltro = 'Si';
    else if (this.profesorFiltro === 'Si') this.profesorFiltro = 'No';
    else this.profesorFiltro = 'todos';
  }

  sortBy(col: 'nombres' | 'apellidos'): void {
    if (this.sortColumn === col) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = col;
      this.sortAsc = true;
    }
    this.socios.sort((a, b) => {
      const valA = a[col].toLowerCase();
      const valB = b[col].toLowerCase();
      return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  toggleFiltros(): void {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  toggleChip(filtro: any): void {
    filtro.activo = !filtro.activo;
  }

  openAddMember(socio?: Socio): void {
    const dialogRef = this.dialog.open(AddMember, {
      width: '480px',
      data: socio ?? null,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      if (socio) {
        this.socioService.update(socio.id, this.mapToApiSocio(result)).subscribe(() => {
          const index = this.socios.indexOf(socio);
          this.socios[index] = { ...socio, ...result };
        });
      } else {
        this.socioService.add(this.mapToApiSocio(result)).subscribe((nuevo: any) => {
          this.socios.push({
            ...result,
            id: nuevo.id,
            cursosAbiertos: false,
            selected: false,
            cursos: [],
          });
        });
      }
    });
  }

  openMember(): void {
    const nextNumero = this.socios.length + 1;
  const dialogRef = this.dialog.open(Member, {
    data: { nextNumero },
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    if (!result) return;
    this.socioService.add(this.mapToApiSocio(result)).subscribe((nuevo: any) => {
      this.socios.push({
        ...result,
        id: nuevo.id,
        cursosAbiertos: false,
        selected: false,
        cursos: [],
      });
    });
  });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  cursos(): void {
    this.router.navigate(['/cursos']);
  }

  onEliminar(socio?: Socio): void {
    const dialogRef = this.dialog.open(DeleteMember, { width: '400px' });
    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (!confirmed) return;
      if (socio) {
        this.socioService.delete(socio.id).subscribe(() => {
          this.socios = this.socios.filter((s) => s !== socio);
        });
      } else {
        const seleccionados = this.socios.filter((s) => s.selected);
        seleccionados.forEach((s) => {
          this.socioService.delete(s.id).subscribe(() => {
            this.socios = this.socios.filter((x) => x !== s);
          });
        });
      }
    });
  }

  onModificar(): void {
    console.log('Modificar');
  }

  openAddCurso(): void {
    const dialogRef = this.dialog.open(AddCurso, {
      data: { cursosExistentes: this.cursosDisponibles },
    });
    dialogRef.afterClosed().subscribe((nuevoCurso: any) => {
      if (!nuevoCurso) return;
      this.actividadService.add(nuevoCurso).subscribe(() => {
        this.cargarActividades();
      });
    });
  }

  onPagos(): void {
    console.log('Pagos');
  }

  onCorreo(): void {
    console.log('Correo', this.selectedSocios);
  }

  submit(): void {
    this.router.navigate(['/main']);
  }
}
