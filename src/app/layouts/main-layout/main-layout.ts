import { Component, inject } from '@angular/core';
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
export class MainLayout {
  private dialog = inject(MatDialog);
  private router = inject(Router);

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

  socios: Socio[] = [
    {
      id: '01',
      nombres: 'Felipe Carlos',
      apellidos: 'Guzmán Segundo',
      correo: 'FelipeCarlosGuzman@gmail.com',
      tel: '+34 652 25 35 97',
      dni: '52316377W',
      estado: 'Activo',
      fechaVenc: '05/01/2027',
      profesor: 'Si',
      cursos: ['Yoga', 'Pilates'],
      cursosAbiertos: false,
      selected: false,
    },
    {
      id: '01',
      nombres: 'Felipe Carlos',
      apellidos: 'Guzmán Segundo',
      correo: 'FelipeCarlosGuzman@gmail.com',
      tel: '+34 652 25 35 97',
      dni: '52316377W',
      estado: 'Activo',
      fechaVenc: '05/01/2027',
      profesor: 'Si',
      cursos: ['Yoga', 'Pilates'],
      cursosAbiertos: false,
      selected: false,
    },
    {
      id: '02',
      nombres: 'María José',
      apellidos: 'Rodríguez Blanco',
      correo: 'mariajose.rodriguez@gmail.com',
      tel: '+34 611 44 55 66',
      dni: '30456789B',
      estado: 'Activo',
      fechaVenc: '12/03/2026',
      profesor: 'No',
      cursos: ['Pilates'],
      cursosAbiertos: false,
      selected: false,
    },
    {
      id: '03',
      nombres: 'Alejandro',
      apellidos: 'Torres Vega',
      correo: 'alejandro.torres@gmail.com',
      tel: '+34 633 77 88 99',
      dni: '45678901C',
      estado: 'Inactivo',
      fechaVenc: '01/06/2025',
      profesor: 'No',
      cursos: [],
      cursosAbiertos: false,
      selected: false,
    },
    {
      id: '04',
      nombres: 'Laura',
      apellidos: 'Sánchez Mora',
      correo: 'laura.sanchez@gmail.com',
      tel: '+34 699 12 34 56',
      dni: '67890123D',
      estado: 'Activo',
      fechaVenc: '20/09/2026',
      profesor: 'Si',
      cursos: ['Yoga', 'Zumba', 'Spinning'],
      cursosAbiertos: false,
      selected: false,
    },
    {
      id: '05',
      nombres: 'Carlos Antonio',
      apellidos: 'Jiménez Ruiz',
      correo: 'carlos.jimenez@gmail.com',
      tel: '+34 655 98 76 54',
      dni: '89012345E',
      estado: 'Activo',
      fechaVenc: '30/11/2026',
      profesor: 'No',
      cursos: ['Spinning'],
      cursosAbiertos: false,
      selected: false,
    },
  ];

  get sociosFiltrados(): Socio[] {
    let lista = this.socios;

    if (this.estadoFiltro !== 'todos') {
      lista = lista.filter(s => s.estado === this.estadoFiltro);
    }

    if (this.profesorFiltro !== 'todos') {
      lista = lista.filter(s => s.profesor === this.profesorFiltro);
    }

    if (this.textoBusqueda.trim()) {
      const texto = this.textoBusqueda.toLowerCase().trim();
      lista = lista.filter(s =>
        s.nombres.toLowerCase().includes(texto)   ||
        s.apellidos.toLowerCase().includes(texto) ||
        s.correo.toLowerCase().includes(texto)    ||
        s.dni.toLowerCase().includes(texto)
      );
    }

    return lista;
  }

  get allSelected(): boolean {
    return this.sociosFiltrados.length > 0 && this.sociosFiltrados.every(s => s.selected);
  }

  get someSelected(): boolean {
    return this.sociosFiltrados.some(s => s.selected) && !this.allSelected;
  }

  get selectedSocios(): Socio[] {
    return this.socios.filter(s => s.selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.sociosFiltrados.forEach(s => (s.selected = checked));
  }
  fabAbierto = false;

  onCheckChange(): void {}

  filtrarEstado() {
    if (this.estadoFiltro === 'todos') {
      this.estadoFiltro = 'Activo';
    } else if (this.estadoFiltro === 'Activo') {
      this.estadoFiltro = 'Inactivo';
    } else {
      this.estadoFiltro = 'todos';
    }
  }

  filtrarProfesor() {
    if (this.profesorFiltro === 'todos') {
      this.profesorFiltro = 'Si';
    } else if (this.profesorFiltro === 'Si') {
      this.profesorFiltro = 'No';
    } else {
      this.profesorFiltro = 'todos';
    }
  }

  sortBy(col: 'nombres' | 'apellidos') {
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

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  toggleChip(filtro: any) {
    filtro.activo = !filtro.activo;
  }
  //AQui el Padre recibe el socio y lo pasa al dialog
  openAddMember(socio?: Socio) {
    const dialogRef = this.dialog.open(AddMember, {
      width: '480px',
      data: socio ?? null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (socio) {
        const index = this.socios.indexOf(socio);
        this.socios[index] = { ...socio, ...result };
      } else {
        this.socios.push(result);
      }
    });
  }

  openMember(socio?: Socio) {
    const esNuevo = !socio;
    const dialogRef = this.dialog.open(Member, {
      width: '480px',
      data: socio ?? null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (esNuevo) {
        this.socios.push({
          id: String(this.socios.length + 1).padStart(2, '0'),
          nombres: result.nombres,
          apellidos: result.apellidos,
          correo: result.correo,
          tel: result.tel,
          dni: result.dni,
          estado: result.estado ?? 'Activo',
          fechaVenc: '',
          profesor: result.profesor ?? 'No',
          cursos: result.cursos,
          cursosAbiertos: result.cursosAbiertos,
          selected: false,
        });
      } else {
        const index = this.socios.indexOf(socio!);
        this.socios[index] = { ...socio!, ...result };
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  cursos() {
    this.router.navigate(['/cursos']);
  }
  onEliminar(socio?: Socio) {
    const dialogRef = this.dialog.open(DeleteMember, { width: '400px' });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      if (socio) {
        this.socios = this.socios.filter((s) => s !== socio);
      } else {
        this.socios = this.socios.filter((s) => !s.selected);
      }
    });
  }
///menu  de teres puntos
  onCurso(socio: Socio) {
    const dialogRef = this.dialog.open(CursosMember, {
      width: '440px',
      data: { cursosActuales: socio.cursos },
    });
    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (!result) return;
      const index = this.socios.indexOf(socio);
      this.socios[index] = { ...socio, cursos: result };
    });
  }
  onModificar() {
    console.log('Modificar');
  }

  openAddCurso() {
    this.dialog.open(AddCurso, { width: '400px' });
  }

  onPagos() {
    console.log('Pagos');
  }

  onCorreo() {
    console.log('Correo', this.selectedSocios);
  }
}


