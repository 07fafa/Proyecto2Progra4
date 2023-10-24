/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.seguros.logic;

import com.seguros.logic.*;
import com.seguros.data.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 *
 * @author Faxe
 */
public class Service {
    private static Service uniqueInstance;
    
    public static Service instance(){
        if (uniqueInstance == null){
            uniqueInstance = new Service();
        }
        return uniqueInstance; 
    }
    RelDatabase database;
    ClienteDao clienteDao;
    AdministradorDao administradorDao;
    PolizaDao polizaDao;
    VehiculoDao vehiculoDao;
    CategoriaDao categoriaDao;
    CoberturaDao coberturaDao;

    List<Usuario> usuarios;
    List<Vehiculo> vehiculos;
    List<Categoria> categorias;
    List<Cobertura> coberturas;
    List<Cliente> clientes;
    
    private Service(){
        database=new RelDatabase();
        clienteDao=new ClienteDao(database);
        vehiculoDao=new VehiculoDao(database);
        coberturaDao=new CoberturaDao(database);
        categoriaDao=new CategoriaDao(database);
        polizaDao=new PolizaDao(database);
        administradorDao=new AdministradorDao(database);
        usuarios = new ArrayList<Usuario>();
        vehiculos = new ArrayList<Vehiculo>();
        coberturas = new ArrayList<Cobertura>();
        categorias = new ArrayList<Categoria>();
        clientes = new ArrayList<>();
        
        this.refresh();
    }
    
        public void refresh(){
        try {
            usuarios = new ArrayList<Usuario>();
            vehiculos = new ArrayList<Vehiculo>();
            coberturas = new ArrayList<Cobertura>();
            vehiculos=vehiculoDao.getVehiculos();
            coberturas=coberturaDao.getCoberturas();
            categorias = categoriaDao.getCategorias();
            for(Cliente c:clienteDao.getClientes()){
                for(Poliza p:polizaDao.listByCliente(c.getCedula())){
                    c.agregarPoliza(p);
                }
                usuarios.add(c);
                this.clientes.add(c);
            }
            for(Administrador a:administradorDao.getAdmins()){
                usuarios.add(a);
            }
        } catch (Exception ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public Usuario login(Usuario usuario){
        for(int i=0;i<usuarios.size();i++){
            if((usuario.getUsuario().equals(usuarios.get(i).getUsuario()))&&(usuario.getContraseña().equals(usuarios.get(i).getContraseña()))){
                System.out.println("Usuario ha iniciado sesión");
                return usuarios.get(i);
            }
        }
        return null;
    }

    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }

    public List<Vehiculo> getVehiculos() {
        return vehiculos;
    }

    public void setVehiculos(List<Vehiculo> vehiculos) {
        this.vehiculos = vehiculos;
    }

    public List<Poliza> getPolizas(String usuario) {
        for (int i = 0; i < this.usuarios.size(); i++) {
            Usuario u = this.usuarios.get(i);
            if (u instanceof Cliente && u.getUsuario().equals(usuario)) {
                Cliente cliente = (Cliente) u;
                return cliente.getPolizas();
            }
        }
        return null;
    }

    public List<Cobertura> getCoberturas() {
        return coberturas;
    }

    public void setCoberturas(List<Cobertura> coberturas) {
        this.coberturas = coberturas;
    }
  
    public Cobertura obtenerCobertura(String identificacion) {
        return coberturas.stream().filter(c -> c.getIdentificacion().equals(identificacion)).findFirst().orElse(null);
    }
    
    public void comprarPoliza(String usuario, String contraseña, Poliza poliza) {
        Cliente cliente=null;
        int index = -1;
        for (int i = 0; i < this.usuarios.size(); i++) {
            Usuario u = this.usuarios.get(i);
            if (u instanceof Cliente && u.getUsuario().equals(usuario) && u.getContraseña().equals(contraseña)) {
                cliente = (Cliente) u;
                cliente.agregarPoliza(poliza);
                poliza.setCliente(cliente);
                try {
                    polizaDao.create(poliza);
                } catch (Exception ex) {
                    Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
                }
                index = i;
                break;
            }
        }

        if (index != -1) {
            //this.usuarios.set(index, cliente); 
            this.refresh();
        }
    }
    
     public List<Cliente> getClientes() throws Exception{
         List<Cliente> cs=new ArrayList<Cliente>();
         List<Usuario> x=new ArrayList<Usuario>();
         x=this.getUsuarios();
         for(Usuario u:this.getUsuarios()){
             if("Cliente".equals(u.getTipo())){
                 cs.add((Cliente) u);
             }
         }
         return cs;
     }
     public List<Cliente> getCli() throws Exception{
         return clientes;
     }
     
     public void addCliente(Cliente cliente) throws Exception{
         clienteDao.create(cliente);
         this.refresh();
     }
    
     public Poliza getPoliza(String poliza) throws Exception{
        return polizaDao.polizaFind(poliza);
     }
     
     public int getIdVehiculo(Vehiculo v){
        try {
            return vehiculoDao.getId(v.getMarca(), v.getModelo());
        } catch (SQLException ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
            return -1;
        }
    }
    
    public int getIdVehiculo(String marca, String modelo){
        try {
            return vehiculoDao.getId(marca, modelo);
        } catch (SQLException ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
            return -1;
        }
    }
    
    public void agregarVehiculo(Vehiculo v){
        try {
            vehiculoDao.create(v);
            this.refresh();
        } catch (Exception ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public List<Poliza> getPolizasByCliente(String usuario, String contraseña) {
        for (int i = 0; i < this.usuarios.size(); i++) {
            Usuario u = this.usuarios.get(i);
            if (u instanceof Cliente && u.getUsuario().equals(usuario) && u.getContraseña().equals(contraseña)) {
                Cliente cliente = (Cliente) u;
                return cliente.getPolizas();
            }
        }
        return null;
    }
    
    public List<Poliza> filtrar(String patron,Usuario u) throws Exception{
        return this.getPolizasByCliente(u.getUsuario(), u.getContraseña()).stream().
                filter( h-> h.getNumero().contains(patron)).
                collect(Collectors.toList());
    }
    
    public Boolean duplicado(String u){
        try {
            if(clienteDao.exists(u)!=false){
                return true;
            }
            if(administradorDao.exists(u)!=false){
                return true;
            }
            return false;
        } catch (Exception ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }
    
    public void print(Usuario u){
        System.out.println(u.getUsuario());
    }
    
    public boolean isCedulaDuplicated(String cedula) throws Exception {
        Cliente cliente = clienteDao.findByCedula(cedula);
        return cliente != null;
    }
    
    public Cliente findClienteByUsuario(String usuario) {
        for (Usuario u : usuarios) {
            if (u instanceof Cliente && u.getUsuario().equals(usuario)) {
                return (Cliente) u;
            }
        }
        return null;
    }
    
    public void actualizarCliente(Cliente cliente) {
        try {
            clienteDao.update(cliente);
            refresh();
        } catch (Exception ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public void addCategoria(Categoria c){
        try {
            categoriaDao.create(c);
            this.refresh();
        } catch (Exception ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public void addCobertura(Cobertura c){
        try{
            coberturaDao.create(c);
            this.refresh();
        } catch (Exception ex) {
            Logger.getLogger(Service.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public boolean isCategoriaDuplicated(String c) throws Exception {
        Categoria categoria = categoriaDao.findByDescripcion(c);
        return categoria != null;
    }
    
    public boolean isCoberturaDuplicated(String c) throws Exception {
        Cobertura cobertura = coberturaDao.findByCobertura(c);
        return cobertura != null;
    }

    public List<Categoria> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<Categoria> categorias) {
        this.categorias = categorias;
    }
    
    public Cliente getClienteById(String id) {
    for (Cliente cliente : clientes) {
        if (cliente.getCedula() == null ? id == null : cliente.getCedula().equals(id)) {
            return cliente;
        }
    }
    return null;
}

}
