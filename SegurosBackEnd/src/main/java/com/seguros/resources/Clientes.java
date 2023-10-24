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
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import com.seguros.logic.*;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/clientes")
@PermitAll
public class Clientes {
    
    @GET
    @Path("/all")
    @Produces({MediaType.APPLICATION_JSON})
    @RolesAllowed({"Administrador"})
    public List<Cliente> load() throws Exception { 
        Service.instance().refresh();
        return Service.instance().getClientes();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addCliente(Cliente cliente) {
        try {
            Service service = Service.instance();
            service.refresh();

            if (service.isCedulaDuplicated(cliente.getCedula())) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Esta cédula ya se encuentra asociada a otra cuenta.").build();
            }

            if (service.duplicado(cliente.getUsuario())) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Este nombre de usuario ya existe.").build();
            }

            service.addCliente(cliente);
            return Response.ok("Cliente agregado correctamente").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al agregar el cliente.").build();
        }
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getClienteByUsuario(@Context HttpServletRequest request) {
        try {
            Usuario user = (Usuario) request.getSession().getAttribute("user");
            if (user == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Acceso no autorizado").build();
            }

            Service service = Service.instance();
            service.refresh();

            Cliente cliente = service.findClienteByUsuario(user.getUsuario());
            if (cliente == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Cliente no encontrado").build();
            }

            return Response.ok(cliente).build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al obtener el cliente").build();
        }
    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateCliente(@Context HttpServletRequest request, Cliente cliente) {
        try {
            Usuario user = (Usuario) request.getSession().getAttribute("user");
            if (user == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Acceso no autorizado").build();
            }

            Service service = Service.instance();
            service.refresh();

            Cliente existingCliente = service.findClienteByUsuario(user.getUsuario());
            if (existingCliente == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Cliente no encontrado").build();
            }

            // Actualizar los datos permitidos del cliente existente con los datos proporcionados
            existingCliente.setNombre(cliente.getNombre());
            existingCliente.setContraseña(cliente.getContraseña());
            existingCliente.setTelefono(cliente.getTelefono());
            existingCliente.setCorreo(cliente.getCorreo());

            // Actualizar la primera tarjeta del cliente existente
            if (!cliente.getTarjetas().isEmpty()) {
                Tarjeta tarjeta = cliente.getTarjetas().get(0);
                if (existingCliente.getTarjetas().isEmpty()) {
                    existingCliente.getTarjetas().add(tarjeta);
                } else {
                    Tarjeta existingTarjeta = existingCliente.getTarjetas().get(0);
                    existingTarjeta.setNumero(tarjeta.getNumero());
                    existingTarjeta.setVencimiento(tarjeta.getVencimiento());
                    existingTarjeta.setCvc(tarjeta.getCvc());
                }
            }

            // Actualizar el cliente en la base de datos
            service.actualizarCliente(existingCliente);

            return Response.ok("Cliente actualizado correctamente").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al actualizar el cliente.").build();
        }
    }

}
