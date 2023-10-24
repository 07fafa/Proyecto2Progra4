/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.seguros.data;
import com.seguros.logic.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Faxe
 */
public class ClienteDao {
    RelDatabase db;

    public ClienteDao(RelDatabase db){
        this.db= db;
    }

    public void create(Cliente c) throws Exception {
        String sql = "INSERT INTO cliente (cedulaCliente, nombreCliente, usuarioCliente, claveCliente, telefonoCliente, correoCliente, numeroTarjeta, vencimientoTarjeta, cvcTarjeta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, c.getCedula());
        stm.setString(2, c.getNombre());
        stm.setString(3, c.getUsuario());
        stm.setString(4, c.getContraseña());
        stm.setString(5, c.getTelefono());
        stm.setString(6, c.getCorreo());
        stm.setString(7, c.getTarjetas().get(0).getNumero());
        stm.setString(8, c.getTarjetas().get(0).getVencimiento());
        stm.setString(9, c.getTarjetas().get(0).getCvc());

        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("Error al crear el cliente");
        }
    }

    public Cliente read(String usuarioCliente) throws Exception {
        String sql = "select " +
                "* " +
                "from  cliente " +
                "where usuarioCliente=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, usuarioCliente);
        ResultSet rs = db.executeQuery(stm);
        if (rs.next()) {
            return from(rs);
        } else {
            throw new Exception("CLIENTE NO EXISTE");
        }
    }

    public void update(Cliente c) throws Exception {
        String sql = "update cliente " +
                "set cedulaCliente=?, nombreCliente=?, claveCliente=?, telefonoCliente=?, correoCliente=?, numeroTarjeta=?, vencimientoTarjeta=?, cvcTarjeta=? " +
                "where usuarioCliente=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, c.getCedula());
        stm.setString(2, c.getNombre());
        stm.setString(3, c.getContraseña());
        stm.setString(4, c.getTelefono());
        stm.setString(5, c.getCorreo());
        stm.setString(6, c.getTarjetas().get(0).getNumero());
        stm.setString(7, c.getTarjetas().get(0).getVencimiento());
        stm.setString(8, c.getTarjetas().get(0).getCvc());
        stm.setString(9, c.getUsuario());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("CLIENTE NO EXISTE");
        }
    }

    public Cliente findByUsuario(String usuarioCliente) throws Exception {
        String sql = "SELECT * FROM cliente WHERE usuarioCliente = ?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, usuarioCliente);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return from(rs);
        } else {
            return null;
        }
    }

    public Cliente from(ResultSet rs) throws Exception {
        Cliente e = new Cliente(rs.getString("cedulaCliente"), rs.getString("nombreCliente"), rs.getString("usuarioCliente"), rs.getString("claveCliente"), rs.getString("telefonoCliente"), rs.getString("correoCliente"));
        e.addTarjeta(new Tarjeta(rs.getString("numeroTarjeta"), rs.getString("vencimientoTarjeta"), rs.getString("cvcTarjeta")));
        return e;
    }
    
    public List<Cliente> getClientes() throws SQLException, Exception {
        List<Cliente> clientes = new ArrayList<>();

        String sql = "SELECT * FROM cliente";
        PreparedStatement stm = db.prepareStatement(sql);
        ResultSet rs = db.executeQuery(stm);

        while (rs.next()) {
            Cliente cliente = from(rs);
            clientes.add(cliente);
        }

        return clientes;
    }
    
    public Cliente findByCedula(String cedulaCliente) throws SQLException, Exception {
        String sql = "SELECT * FROM cliente WHERE cedulaCliente=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, cedulaCliente);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return from(rs);
        } else {
            return null;
        }
    }
    
    public int getId(String usuarioCliente) throws Exception {
        String sql = "SELECT idCliente FROM cliente WHERE usuarioCliente=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, usuarioCliente);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return rs.getInt("idCliente");
        } else {
            throw new Exception("Cliente no encontrado");
        }
    }

    public boolean exists(String usuarioCliente) throws SQLException {
        String sql = "SELECT COUNT(*) AS count FROM cliente WHERE usuarioCliente = ?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, usuarioCliente);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            int count = rs.getInt("count");
            return count > 0;
        }

        return false;
    }

}
