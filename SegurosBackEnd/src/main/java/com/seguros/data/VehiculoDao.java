package com.seguros.data;

import com.seguros.logic.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Faxe
 */

public class VehiculoDao {
    RelDatabase db;

    public VehiculoDao(RelDatabase db){
        this.db= db;
    }   

    public void create(Vehiculo c) throws Exception {
        String sql = "insert into " +
                "Vehiculo " +
                "(marcaVehiculo, modeloVehiculo) " +
                "values(?,?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, c.getMarca());
        stm.setString(2, c.getModelo());

        int cont = db.executeUpdate(stm);
        if (cont == 0) {
            throw new Exception("Ya existe");
        }
    }

    public List<Vehiculo> getVehiculos() throws Exception {
        List<Vehiculo> resultado = new ArrayList<Vehiculo>();
        String sql = "SELECT * FROM Vehiculo";
        PreparedStatement stm = db.prepareStatement(sql);
        ResultSet rs = db.executeQuery(stm);
        while (rs.next()) {
            Vehiculo c = from(rs, "c");
            resultado.add(c);
        }
        return resultado;
    }
    
    public int getId(String marca, String modelo) throws SQLException{
        String sql = "select idVehiculo from Vehiculo where marcaVehiculo=? and modeloVehiculo=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, marca);
        stm.setString(2, modelo);
        ResultSet rs = db.executeQuery(stm);
        while (rs.next()) {
            return rs.getInt("idVehiculo");
        }
        return -1;
    }
    
    public Vehiculo findById(int id) throws Exception {
        Vehiculo resultado;
        String sql = "select * " +
                "from " +
                "Vehiculo c " +
                "where c.idVehiculo=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setInt(1, id );
        ResultSet rs = db.executeQuery(stm);
        while (rs.next()) {
            return resultado = from(rs, "c");
        }
        return null;
    }
    
    public Vehiculo from(ResultSet rs, String alias) throws Exception {
        Vehiculo e = new Vehiculo(rs.getString("marcaVehiculo"),rs.getString("modeloVehiculo"));
        return e;
    }
}

