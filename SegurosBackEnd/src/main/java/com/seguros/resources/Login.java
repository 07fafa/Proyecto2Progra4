/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.seguros.resources;

import com.seguros.logic.Service;
import com.seguros.logic.Usuario;
import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 *
 * @author josaa
 */
@Path("/login")
@PermitAll
public class Login {
    @Context
    HttpServletRequest request;
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Usuario user) {
        Usuario logged = null;
        try {
            Service.instance().refresh();
            logged = Service.instance().login(user);
            if (logged == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                               .entity("{\"message\":\"Nombre de usuario o Contraseña incorrectos\"}")
                               .build();
            }
            request.getSession(true).setAttribute("user", logged);
            return Response.ok(logged).build();
        } catch (Exception ex) {
            return Response.status(Response.Status.UNAUTHORIZED)
                           .entity("{\"message\":\"Error en el servidor\"}")
                           .build();
        }
    }
    
    @DELETE
    @Path("/logout")
    public void logout() {
        HttpSession session = request.getSession(true);
        session.removeAttribute("user");
        session.invalidate();
    }
}
