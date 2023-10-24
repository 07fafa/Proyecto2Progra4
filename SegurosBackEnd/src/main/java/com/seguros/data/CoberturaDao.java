package com.seguros.data;

import com.seguros.logic.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Faxe
 */

public class CoberturaDao {
    RelDatabase db;

    public CoberturaDao(RelDatabase db) {
        this.db = db;
    }

    public void create(Cobertura c) throws Exception {

        String sql = "insert into cobertura (descripcionCobertura, costoMinimoCobertura, costoPorcentualCobertura, categoria_idCategoria) values (?, ?, ?, ?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, c.getDescripcion());
        stm.setDouble(2, c.getCostoMinimo());
        stm.setDouble(3, c.getCostoPorcentual());
        stm.setInt(4, Integer.parseInt(c.getCategoria().getIdentificacion()));
        int result = db.executeUpdate(stm);

        if (result == 0) {
            throw new Exception("Ya existe una cobertura con la misma descripción");
        }
    }

    public Cobertura read(int idCobertura) throws SQLException, Exception {
        String sql = "select * from cobertura where idCobertura=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setInt(1, idCobertura);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return from(rs);
        } else {
            return null;
        }
    }

    public Cobertura findByCobertura(String descripcionCobertura) throws SQLException, Exception {
        String sql = "select * from cobertura where descripcionCobertura=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, descripcionCobertura);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return from(rs);
        } else {
            return null;
        }
    }

    private Cobertura from(ResultSet rs) throws SQLException {
        CategoriaDao categoriaDao = new CategoriaDao(db);
        Categoria categoria = categoriaDao.read(rs.getInt("categoria_idCategoria"));

        Cobertura c = new Cobertura(
            String.valueOf(rs.getInt("idCobertura")),
            rs.getString("descripcionCobertura"),
            categoria,
            rs.getDouble("costoMinimoCobertura"),
            rs.getDouble("costoPorcentualCobertura")
        );

        return c;
    }
    
    public List<Cobertura> getCoberturas() throws SQLException, Exception {
    List<Cobertura> coberturas = new ArrayList<>();

    String sql = "SELECT * FROM cobertura";
    PreparedStatement stm = db.prepareStatement(sql);
    ResultSet rs = db.executeQuery(stm);

    while (rs.next()) {
        Cobertura cobertura = from(rs);
        coberturas.add(cobertura);
    }

    return coberturas;
}

}
