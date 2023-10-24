package com.seguros;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;
import com.seguros.resources.*;
import jakarta.annotation.security.DeclareRoles;

/**
 * Configures Jakarta RESTful Web Services for the application.
 * @author Faxe
 */
@ApplicationPath("api")
@DeclareRoles({"Administrador","Cliente"})
public class JakartaRestConfiguration extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        HashSet<Class<?>> classes = new HashSet<>(); 
        classes.add(Clientes.class); 
        classes.add(Coberturas.class); 
        classes.add(Vehiculos.class); 
        classes.add(Polizas.class); 
        classes.add(Categorias.class);
        classes.add(Login.class); 
        return classes;
    }    
}
