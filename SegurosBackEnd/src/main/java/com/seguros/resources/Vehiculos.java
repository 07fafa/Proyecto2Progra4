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
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotAcceptableException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

@Path("/vehiculos")
@PermitAll
public class Vehiculos {
     String location = "C:/AAA/seguros/";

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Vehiculo> find(@DefaultValue("") @QueryParam("name") String name) { 
        Service.instance().refresh();
        return Service.instance().getVehiculos();
    }
    
    @POST
    @Consumes (MediaType.APPLICATION_JSON)    
    @RolesAllowed({"Administrador"})
    public void create(Vehiculo v) {
        try {
            Service.instance().agregarVehiculo(v);
        } catch (Exception ex) {
            throw new NotAcceptableException();
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Path("{modelo}/imagen")    
    @RolesAllowed({"Administrador"})
    public void createImage(@PathParam("modelo") String modelo, @FormParam("imagen") InputStream in){
        try{
            OutputStream out = new FileOutputStream(new File(location + modelo));
            in.transferTo(out);
            out.close();
        }catch(Exception ex){
            throw new NotAcceptableException();        
        }
    }

    @GET
    @Path("{modelo}/imagen")
    @Produces("image/png")
    public Response readImage(@PathParam("modelo") String modelo) throws IOException{
        File file = new File(location+modelo);
        Response.ResponseBuilder response = Response.ok((Object) file);
        return response.build();
    }
}

