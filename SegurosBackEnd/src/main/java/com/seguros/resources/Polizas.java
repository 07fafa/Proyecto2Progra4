package com.seguros.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.seguros.logic.*;
import java.util.List;

@Path("/polizas")
public class Polizas {

    @Context
    HttpServletRequest request;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addPoliza(Poliza poliza) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Usuario user = (Usuario) session.getAttribute("user");
                if (user != null) {
                    String usuario = user.getUsuario();
                    String contraseña = user.getContraseña();
                    Service service = Service.instance();
                    service.refresh();
                    service.comprarPoliza(usuario, contraseña, poliza);
                    return Response.ok("Póliza comprada correctamente").build();
                }
            }
            return Response.status(Response.Status.UNAUTHORIZED).entity("Debe iniciar sesión para agregar una póliza.").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al agregar la póliza.").build();
        }
    }

    @GET
    @Path("/clientep/{usuario}")
    @RolesAllowed("Administrador")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPolizasByAdmin(@PathParam("usuario") String usuario) {
        try {
            Service service = Service.instance();
            service.refresh();
            List<Poliza> polizas = service.getPolizas(usuario);
            return Response.ok(polizas).build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al obtener las pólizas.").build();
        }
    }

    @GET
    @Path("/cliente")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPolizasByCliente() {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Usuario user = (Usuario) session.getAttribute("user");
                if (user != null) {
                    String usuario = user.getUsuario();
                    Service service = Service.instance();
                    service.refresh();
                    List<Poliza> polizas = service.getPolizas(usuario);
                    return Response.ok(polizas).build();
                }
            }
            return Response.status(Response.Status.UNAUTHORIZED).entity("Debe iniciar sesión para obtener las pólizas.").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al obtener las pólizas.").build();
        }
    }
}
