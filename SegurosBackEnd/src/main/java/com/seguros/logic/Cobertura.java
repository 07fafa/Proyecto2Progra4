/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.seguros.logic;

import java.io.Serializable;
import java.util.Objects;

/**
 *
 * @author Faxe
 */
public class Cobertura implements Serializable{
    String identificacion;
    String descripcion;
    Categoria categoria;
    double costoMinimo;
    double costoPorcentual;

    public Cobertura(String identificacion, String descripcion, Categoria categoria, double costoMinimo, double costoPorcentual) {
        this.identificacion = identificacion;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.costoMinimo = costoMinimo;
        this.costoPorcentual = costoPorcentual;
    }

    public Cobertura() {
    }
    

    public double getCostoMinimo() {
        return costoMinimo;
    }

    public void setCostoMinimo(double costoMinimo) {
        this.costoMinimo = costoMinimo;
    }

    public double getCostoPorcentual() {
        return costoPorcentual;
    }

    public void setCostoPorcentual(double costoPorcentual) {
        this.costoPorcentual = costoPorcentual;
    }

    public String getIdentificacion() {
        return identificacion;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 29 * hash + Objects.hashCode(this.identificacion);
        hash = 29 * hash + Objects.hashCode(this.descripcion);
        hash = 29 * hash + Objects.hashCode(this.categoria);
        hash = 29 * hash + (int) (Double.doubleToLongBits(this.costoMinimo) ^ (Double.doubleToLongBits(this.costoMinimo) >>> 32));
        hash = 29 * hash + (int) (Double.doubleToLongBits(this.costoPorcentual) ^ (Double.doubleToLongBits(this.costoPorcentual) >>> 32));
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Cobertura other = (Cobertura) obj;
        if (Double.doubleToLongBits(this.costoMinimo) != Double.doubleToLongBits(other.costoMinimo)) {
            return false;
        }
        if (Double.doubleToLongBits(this.costoPorcentual) != Double.doubleToLongBits(other.costoPorcentual)) {
            return false;
        }
        if (!Objects.equals(this.identificacion, other.identificacion)) {
            return false;
        }
        if (!Objects.equals(this.descripcion, other.descripcion)) {
            return false;
        }
        return Objects.equals(this.categoria, other.categoria);
    }

    
    
}
