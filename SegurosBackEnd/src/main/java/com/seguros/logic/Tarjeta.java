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
public class Tarjeta implements Serializable{
    String numero;
    String vencimiento;
    String cvc;

    public Tarjeta(String numero, String vencimiento, String cvc) {
        this.numero = numero;
        this.vencimiento = vencimiento;
        this.cvc = cvc;
    }

    public Tarjeta() {
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getVencimiento() {
        return vencimiento;
    }

    public void setVencimiento(String vencimiento) {
        this.vencimiento = vencimiento;
    }

    public String getCvc() {
        return cvc;
    }

    public void setCvc(String cvc) {
        this.cvc = cvc;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 71 * hash + Objects.hashCode(this.numero);
        hash = 71 * hash + Objects.hashCode(this.vencimiento);
        hash = 71 * hash + Objects.hashCode(this.cvc);
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
        final Tarjeta other = (Tarjeta) obj;
        if (!Objects.equals(this.numero, other.numero)) {
            return false;
        }
        if (!Objects.equals(this.vencimiento, other.vencimiento)) {
            return false;
        }
        return Objects.equals(this.cvc, other.cvc);
    }
    
    
}
