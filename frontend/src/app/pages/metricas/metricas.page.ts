// =============================================================
// metricas.page.ts — Dashboard de Métricas
// HelpDesk Web | Feature 012 · Métricas Básicas
// =============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { warningOutline, pieChartOutline } from 'ionicons/icons';
import { MetricasService } from '../../services/metricas';

@Component({
  selector   : 'app-metricas',
  templateUrl: './metricas.page.html',
  styleUrls  : ['./metricas.page.scss'],
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonSpinner, IonIcon
  ]
})
export class MetricasPage implements OnInit {

  // Resumen global — activos + inactivos + históricos
  resumenGlobal: any = {
    total_global          : 0,
    pendiente             : 0,
    en_proceso            : 0,
    finalizado            : 0,
    desactivados          : 0,
    finalizados_historicos: 0,
    total_activos         : 0
  };

  // Alias para compatibilidad con el donut
  resumen: any = { pendiente: 0, en_proceso: 0, finalizado: 0, total: 0 };

  porCategoria    : any[] = [];
  porTecnico      : any[] = [];
  tiempoResolucion: any   = { promedio_horas: 0 };
  cargando        : boolean = false;

  // Circunferencia del donut — 2π × r28
  readonly CIRCUNFERENCIA = 2 * Math.PI * 28;

  constructor(private metricasService: MetricasService) {
    addIcons({ warningOutline, pieChartOutline });
  }

  async ngOnInit()     { await this.cargarMetricas(); }
  ionViewWillEnter()   { this.cargarMetricas(); }

  async cargarMetricas() {
    this.cargando = true;
    try {
      const [resumenGlobal, porCategoria, porTecnico, tiempoResolucion] = await Promise.all([
        this.metricasService.obtenerResumenGlobal(),
        this.metricasService.obtenerPorCategoria(),
        this.metricasService.obtenerPorTecnico(),
        this.metricasService.obtenerTiempoResolucion()
      ]);

      this.resumenGlobal    = resumenGlobal;
      this.porCategoria     = porCategoria;
      this.porTecnico       = porTecnico;
      this.tiempoResolucion = tiempoResolucion;

      // Alias para el donut — usa total_activos como base
      this.resumen = {
        pendiente : resumenGlobal.pendiente,
        en_proceso: resumenGlobal.en_proceso,
        finalizado: resumenGlobal.finalizado,
        total     : resumenGlobal.total_activos
      };

    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      this.cargando = false;
    }
  }

  // Calcula el porcentaje de un valor sobre el total
  getPorcentaje(valor: number, total: number): number {
    if (!total) return 0;
    return Math.round((valor / total) * 100);
  }

  // Calcula el porcentaje relativo al técnico con más tickets
  getPorcentajeMax(valor: number): number {
    const max = Math.max(...this.porTecnico.map((t: any) => t.total), 1);
    return Math.round((valor / max) * 100);
  }

  // Calcula el stroke-dasharray para el segmento del donut
  getDonutDash(valor: number): string {
    const arco = (valor / (this.resumen.total || 1)) * this.CIRCUNFERENCIA;
    return `${arco.toFixed(1)} ${(this.CIRCUNFERENCIA - arco).toFixed(1)}`;
  }

  // Calcula el stroke-dashoffset para posicionar el segmento
  getDonutOffset(valorPrevio: number): string {
    const arco = (valorPrevio / (this.resumen.total || 1)) * this.CIRCUNFERENCIA;
    return (-arco + this.CIRCUNFERENCIA / 4).toFixed(1);
  }

  // Obtiene la inicial del nombre del técnico para el avatar
  getInicial(nombre: string): string {
    return nombre ? nombre.charAt(0).toUpperCase() : '?';
  }

  // Asigna un color al avatar según el índice del técnico
  getAvatarColor(index: number): string {
    const colores = ['#0288D1','#7C3AED','#0F6E56','#BA7517','#D4537E'];
    return colores[index % colores.length];
  }


  // Calcula el total de tickets con técnico asignado
  getTotalAsignados(): number {
    return this.porTecnico.reduce((sum: number, t: any) => sum + t.total, 0);
  }
}