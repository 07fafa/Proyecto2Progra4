/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.seguros.logic;

import jakarta.json.bind.annotation.JsonbTransient;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 *
 * @author Faxe
 */
public class Poliza implements Serializable{
    String numero;
    Vehiculo vehiculo;
    String año;
    String plazo;
    Double valor;
    List<Cobertura> coberturas;
    Cliente cliente;

    public Poliza(String numero, Vehiculo vehiculo, String año, String plazo, Double valor, Cliente cliente) {
        this.numero = numero;
        this.vehiculo = vehiculo;
        this.año = año;
        this.plazo = plazo;
        this.valor = valor;
        this.coberturas = new ArrayList<Cobertura>();
        this.cliente=cliente;
    }

    public Poliza() {
    }
    

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Vehiculo getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
    }

    public String getAño() {
        return año;
    }

    public void setAño(String año) {
        this.año = año;
    }

    public String getPlazo() {
        return plazo;
    }

    public void setPlazo(String plazo) {
        this.plazo = plazo;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public List<Cobertura> getCoberturas() {
        return coberturas;
    }

    public void setCoberturas(List<Cobertura> coberturas) {
        this.coberturas = coberturas;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public double getTotal(){
        Double total=0.0;
        for(Cobertura c:this.coberturas){
            total += (c.getCostoPorcentual() * this.valor > c.getCostoMinimo()) ? c.getCostoPorcentual() * this.valor : c.getCostoMinimo();
        }
        return total;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 23 * hash + Objects.hashCode(this.numero);
        hash = 23 * hash + Objects.hashCode(this.vehiculo);
        hash = 23 * hash + Objects.hashCode(this.año);
        hash = 23 * hash + Objects.hashCode(this.plazo);
        hash = 23 * hash + Objects.hashCode(this.valor);
        hash = 23 * hash + Objects.hashCode(this.coberturas);
        hash = 23 * hash + Objects.hashCode(this.cliente);
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
        final Poliza other = (Poliza) obj;
        if (!Objects.equals(this.numero, other.numero)) {
            return false;
        }
        if (!Objects.equals(this.año, other.año)) {
            return false;
        }
        if (!Objects.equals(this.plazo, other.plazo)) {
            return false;
        }
        if (!Objects.equals(this.vehiculo, other.vehiculo)) {
            return false;
        }
        if (!Objects.equals(this.valor, other.valor)) {
            return false;
        }
        if (!Objects.equals(this.coberturas, other.coberturas)) {
            return false;
        }
        return Objects.equals(this.cliente, other.cliente);
    }
    
    public void addCobertura(Cobertura cobertura){
        this.coberturas.add(cobertura);
    }
}
