import { Component, OnInit } from '@angular/core';

import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css'],
  providers: [InformesRutasService]
})
export class InformesComponent implements OnInit {

  public rutasInformes: any = []

  constructor(

    private _informesRutasService: InformesRutasService

  ) { }

  ngOnInit(): void {
    this.getInformesRutas()
  }

  getInformesRutas() {
    this._informesRutasService.getRutasInformes().subscribe((res: any) => {
      this.rutasInformes  = res.body
    })
  }


}
