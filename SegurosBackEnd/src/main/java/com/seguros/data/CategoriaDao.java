package com.seguros.data;

import com.seguros.logic.Categoria;
import com.seguros.logic.Cobertura;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Faxe
 */

public class CategoriaDao {
    RelDatabase db;

    public CategoriaDao(RelDatabase db) {
        this.db = db;
    }

    public void create(Categoria c) throws Exception {
        String sql = "insert into categoria (descripciónCategoria) values (?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, c.getDescripcion());
        int result = db.executeUpdate(stm);

        if (result == 0) {
            throw new Exception("Ya existe una categoría con la misma descripción");
        }
    }

    public Categoria findByDescripcion(String descripcionCategoria) throws SQLException {
        String sql = "select * from categoria where descripciónCategoria=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, descripcionCategoria);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return from(rs);
        } else {
            return null;
        }
    }

    public int getId(String descripcionCategoria) throws SQLException {
        String sql = "select idCategoria from categoria where descripciónCategoria=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, descripcionCategoria);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return rs.getInt("idCategoria");
        } else {
            return -1;
        }
    }
    
    public Categoria read(int id) throws SQLException {
        String sql = "select * from categoria where idCategoria=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setInt(1, id);
        ResultSet rs = db.executeQuery(stm);

        if (rs.next()) {
            return from(rs);
        } else {
            return null;
        }
    }
    
     public Categoria from(ResultSet rs) {
        try {
            Categoria c = new Categoria();
            c.setIdentificacion(String.valueOf(rs.getInt("idCategoria")));
            c.setDescripcion(rs.getString("descripciónCategoria"));
            return c;
        } catch (SQLException ex) {
            return null;
        }
    }
     
     public List<Categoria> getCategorias() throws SQLException, Exception {
    List<Categoria> categorias = new ArrayList<>();

    String sql = "SELECT * FROM categoria";
    PreparedStatement stm = db.prepareStatement(sql);
    ResultSet rs = db.executeQuery(stm);

    while (rs.next()) {
        Categoria categoria = from(rs);
        categorias.add(categoria);
    }

    return categorias;
}
     
}

