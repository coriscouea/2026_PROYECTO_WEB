// =============================================================
// metricas.page.ts — Dashboard de Métricas
// HelpDesk Web | Feature 012 · Métricas Básicas
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSpinner
} from '@ionic/angular/standalone';
import { MetricasService } from '../../services/metricas';

@Component({
  selector   : 'app-metricas',
  templateUrl: './metricas.page.html',
  styleUrls  : ['./metricas.page.scss'],
  standalone : true,
  imports    : [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonSpinner
  ]
})
export class MetricasPage implements OnInit {

  resumen        : any    = { pendiente: 0, en_proceso: 0, finalizado: 0, total: 0 };
  porCategoria   : any[]  = [];
  porTecnico     : any[]  = [];
  tiempoResolucion: any   = { promedio_horas: 0 };
  cargando       : boolean = false;

  constructor(private metricasService: MetricasService) {}

  async ngOnInit() {
    await this.cargarMetricas();
  }

  ionViewWillEnter() {
    this.cargarMetricas();
  }

  async cargarMetricas() {
    this.cargando = true;
    try {
      const [resumen, porCategoria, porTecnico, tiempoResolucion] = await Promise.all([
        this.metricasService.obtenerResumen(),
        this.metricasService.obtenerPorCategoria(),
        this.metricasService.obtenerPorTecnico(),
        this.metricasService.obtenerTiempoResolucion()
      ]);
      this.resumen         = resumen;
      this.porCategoria    = porCategoria;
      this.porTecnico      = porTecnico;
      this.tiempoResolucion= tiempoResolucion;
    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      this.cargando = false;
    }
  }

  getPorcentaje(valor: number, total: number): number {
    if (!total) return 0;
    return Math.round((valor / total) * 100);
  }
}