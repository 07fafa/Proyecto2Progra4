package com.seguros.logic;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Faxe
 */
public class Categoria implements Serializable {
    private String identificacion;
    private String descripcion;
    

    public Categoria(String id, String descripcion) {
        this.identificacion = id;
        this.descripcion = descripcion;
        
    }
    
    public Categoria(){
        
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

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 89 * hash + Objects.hashCode(this.identificacion);
        hash = 89 * hash + Objects.hashCode(this.descripcion);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Categoria other = (Categoria) obj;
        return Objects.equals(this.identificacion, other.identificacion)
                && Objects.equals(this.descripcion, other.descripcion);
    }
}
