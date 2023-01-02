import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css'],
})
export class PaginadorComponent implements OnInit, OnChanges {
  @Input() paginador: any;
  @Input() route: any;
  pages: number[] = new Array();

  desde: number = 0;
  hasta: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let paginadorActualizado = changes['paginador'];

    if (paginadorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    this.desde = Math.min(
      Math.max(1, this.paginador.number - 4),
      this.paginador.totalPages - 5
    );
    this.hasta = Math.max(
      Math.min(this.paginador.totalPages, this.paginador.number + 4),
      6
    );

    if (this.paginador.totalPages > 5) {
      this.pages = new Array(this.hasta - this.desde + 1)
        .fill(0)
        .map((_val, index) => index + this.desde);
    } else {
      this.pages = new Array(this.paginador.totalPages)
        .fill(0)
        .map((_val, index) => index + 1);
    }
  }
}
