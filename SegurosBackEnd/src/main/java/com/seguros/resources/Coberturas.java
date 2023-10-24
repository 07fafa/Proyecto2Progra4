/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.seguros.resources;

/**
 *
 * @author Faxe
 */
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import com.seguros.logic.*;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/coberturas")
@PermitAll
public class Coberturas {

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Cobertura> find(@DefaultValue("") @QueryParam("name") String name) { 
        Service.instance().refresh();
        return Service.instance().getCoberturas();
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"Administrador"})
    public Response addCobertura(Cobertura cobertura) {
        try {
            Service service = Service.instance();
            service.refresh();

            if (service.isCoberturaDuplicated(cobertura.getDescripcion())) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Esta descripción ya se encuentra asociada a una cobertura.").build();
            }
            
            service.addCobertura(cobertura);
            return Response.ok("Cobertura agregada correctamente").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error.").build();
        }
    }
    
}
