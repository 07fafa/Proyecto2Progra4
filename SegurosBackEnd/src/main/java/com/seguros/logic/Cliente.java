/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.seguros.logic;

import jakarta.json.bind.annotation.JsonbTransient;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Faxe
 */
public class Cliente extends Usuario implements Serializable{
    String cedula;
    String nombre;
    String telefono;
    String correo;
    List<Tarjeta> tarjetas;
    @JsonbTransient
    List<Poliza> polizas;

    public Cliente(String cedula, String nombre, String usuario, String contraseña, String telefono, String correo) {
        super(usuario,contraseña,"Cliente");
        this.cedula = cedula;
        this.nombre = nombre;
        this.telefono = telefono;
        this.correo = correo;
        tarjetas=new ArrayList<Tarjeta>();
        polizas=new ArrayList<Poliza>();
    }

    public Cliente() {
        super();
        this.tarjetas = new ArrayList<Tarjeta>();
        this.polizas=new ArrayList<Poliza>();
        this.tarjetas.add(new Tarjeta());
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public List<Tarjeta> getTarjetas() {
        return tarjetas;
    }

    public void setTarjetas(List<Tarjeta> tarjetas) {
        this.tarjetas = tarjetas;
    }
    
    public void addTarjeta(Tarjeta tarjeta){
        this.tarjetas.add(tarjeta);
    }

    @Override
    public String getTipo() {
        return tipo;
    }

    @Override
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public List<Poliza> getPolizas() {
        return polizas;
    }

    public void setPolizas(List<Poliza> polizas) {
        this.polizas = polizas;
    }
    
    public void agregarPoliza(Poliza poliza){
        this.polizas.add(poliza);
    }
    
    
}
