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

public class PolizaDao {
    RelDatabase db;

    public PolizaDao(RelDatabase db){
        this.db= db;
    }

    public void create(Poliza p) throws Exception {
        ClienteDao cd=new ClienteDao(this.db);
        CoberturaDao cod=new CoberturaDao(this.db);
        VehiculoDao vd=new VehiculoDao(this.db);
        String sql = "insert into " +
                "Poliza " +
                "(numeroPoliza, añoPoliza, plazoPoliza, valorPoliza, clientePoliza) " +
                "values(?,?,?,?,?)";
        PreparedStatement stm = db.prepareStatement(sql, true);
        stm.setString(1, p.getNumero());
        stm.setString(2, p.getAño());
        stm.setString(3, p.getPlazo());
        stm.setDouble(4, p.getValor());
        stm.setString(5, p.getCliente().getUsuario());
        int cont = db.executeUpdate(stm);
        if (cont == 0) {
            throw new Exception("Ya existe");
        }

        ResultSet rs = stm.getGeneratedKeys();
        rs.next();
        int idPoliza = rs.getInt(1);

        for (Cobertura c : p.getCoberturas()) {
            sql = "insert into " +
                    "Cobertura_Poliza " +
                    "(Poliza_idPoliza, Cobertura_idCobertura) " +
                    "values(?,?)";
            stm = db.prepareStatement(sql);
            stm.setInt(1, idPoliza);
            stm.setInt(2, Integer.parseInt(c.getIdentificacion()));
            db.executeUpdate(stm);
        }
        
        sql = "insert into " +
                    "Vehiculo_Poliza " +
                    "(Poliza_idPoliza, Vehiculo_idVehiculo) " +
                    "values(?,?)";
            stm = db.prepareStatement(sql);
            stm.setInt(1, idPoliza);
            stm.setInt(2, vd.getId(p.getVehiculo().getMarca(), p.getVehiculo().getModelo()));
            db.executeUpdate(stm);
    }

public List<Poliza> listByCliente(String usuarioCliente) throws Exception {
    ClienteDao cd = new ClienteDao(this.db);
    Cliente cliente = cd.findByCedula(usuarioCliente);

    if (cliente == null) {
        throw new Exception("Cliente no encontrado");
    }

    CoberturaDao cod = new CoberturaDao(this.db);
    VehiculoDao vd = new VehiculoDao(this.db);

    String sql = "SELECT * FROM Poliza p WHERE p.clientePoliza = ?";
    PreparedStatement stm = db.prepareStatement(sql);
    stm.setString(1, cliente.getUsuario());

    ResultSet rs = db.executeQuery(stm);
    List<Poliza> polizas = new ArrayList<>();

    while (rs.next()) {
        Poliza p = from(rs);

        String sqlCoberturas = "SELECT * FROM Cobertura_Poliza WHERE Poliza_idPoliza=?";
        PreparedStatement stmCoberturas = db.prepareStatement(sqlCoberturas);
        int idx = this.getId(p);
        stmCoberturas.setInt(1, idx);

        ResultSet rsCoberturas = db.executeQuery(stmCoberturas);
        while (rsCoberturas.next()) {
            Cobertura c = cod.read(rsCoberturas.getInt("Cobertura_idCobertura"));
            p.getCoberturas().add(c);
        }

        String sqlVehiculos = "SELECT * FROM Vehiculo_Poliza WHERE Poliza_idPoliza=?";
        PreparedStatement stmVehiculos = db.prepareStatement(sqlVehiculos);
        stmVehiculos.setInt(1, this.getId(p));

        ResultSet rsVehiculos = db.executeQuery(stmVehiculos);
        while (rsVehiculos.next()) {
            Vehiculo v = vd.findById(rsVehiculos.getInt("Vehiculo_idVehiculo"));
            p.setVehiculo(v);
        }

        polizas.add(p);
    }

    return polizas;
}


private Poliza from(ResultSet rs) throws Exception {
    ClienteDao c = new ClienteDao(this.db);
    VehiculoDao v = new VehiculoDao(this.db);
    Poliza p = new Poliza(rs.getString("numeroPoliza"), null, rs.getString("añoPoliza"), rs.getString("plazoPoliza"), rs.getDouble("valorPoliza"), c.read(rs.getString("clientePoliza")));
    return p;
}

public int getId(Poliza p) throws Exception {
    ClienteDao c = new ClienteDao(this.db);
    String sql = "SELECT idPoliza FROM Poliza WHERE numeroPoliza=? and añoPoliza=? and plazoPoliza=? and valorPoliza=? and clientePoliza=?";
    PreparedStatement stm = db.prepareStatement(sql);
    stm.setString(1, p.getNumero());
    stm.setString(2, p.getAño());
    stm.setString(3, p.getPlazo());
    stm.setDouble(4, p.getValor());
    stm.setString(5, p.getCliente().getUsuario());
    ResultSet rs = stm.executeQuery();
    if (rs.next()) {
        return rs.getInt("idPoliza");
    } else {
        return -1;
    }
}

public Poliza polizaFind(String poliza) throws SQLException, Exception {
    String sql = "select * from poliza where idPoliza=?";
    PreparedStatement stm = db.prepareStatement(sql);
    stm.setString(1, poliza);
    ResultSet rs = db.executeQuery(stm);
    if (rs.next()) {
        return from(rs);
    } else {
        return null;
    }
}
}

