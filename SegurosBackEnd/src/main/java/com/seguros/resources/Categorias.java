/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.seguros.resources;

import com.seguros.logic.Categoria;
import com.seguros.logic.Cobertura;
import com.seguros.logic.Service;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 *
 * @author josaa
 */

@Path("/categorias")
@PermitAll
public class Categorias {
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Categoria> load() throws Exception { 
        Service.instance().refresh();
        return Service.instance().getCategorias();
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)    
    @RolesAllowed({"Administrador"})
    public Response addCategoria(Categoria categoria) {
      try {
            Service service = Service.instance();
            service.refresh();
            
            if (service.isCategoriaDuplicated(categoria.getDescripcion())) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Esta descripcion ya se encuentra asociada a una cobertura.").build();
            }
            
            service.addCategoria(categoria);            
            return Response.ok("Categoria Agregada").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error.").build();
        }  
    }
}
