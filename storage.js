const StorageDB = {
    hashPassword: (password) => {
        let hash = 5381;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) + hash) + password.charCodeAt(i);
            hash = hash & hash;
        }
        return "h_" + Math.abs(hash).toString(16) + "_" + password.length;
    },

    isInvitado: () => {
        const u = StorageDB.getUsuarioActual();
        return u && u.rol === "invitado";
    },

    getUsuarioActual: () => {
        try {
            return JSON.parse(localStorage.getItem("pinkfolio_usuario")) || null;
        } catch {
            return null;
        }
    },
    setUsuarioActual: (usuario) => localStorage.setItem("pinkfolio_usuario", JSON.stringify(usuario)),
    removeUsuarioActual: () => localStorage.removeItem("pinkfolio_usuario"),

    getUsuariosRegistrados: () => {
        try {
            return JSON.parse(localStorage.getItem("pinkfolio_usuarios")) || [];
        } catch {
            return [];
        }
    },
    addUsuarioRegistrado: (nuevoUsuario) => {
        let usuarios = StorageDB.getUsuariosRegistrados();
        usuarios.push(nuevoUsuario);
        localStorage.setItem("pinkfolio_usuarios", JSON.stringify(usuarios));
    },

    guardarSeguro: (clave, valor) => {
        if (StorageDB.isInvitado()) return false;
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
            return true;
        } catch {
            alert("Se llenó el espacio de almacenamiento local (límite ~5 MB). Borra algún archivo o usa una foto más ligera.");
            return false;
        }
    },

    getPerfil: () => JSON.parse(localStorage.getItem("pinkfolio_perfil")) || {},
    savePerfil: (data) => StorageDB.guardarSeguro("pinkfolio_perfil", data),

    getAcademica: () => JSON.parse(localStorage.getItem("pinkfolio_academica")) || {},
    saveAcademica: (data) => StorageDB.guardarSeguro("pinkfolio_academica", data),

    getPracticas: () => JSON.parse(localStorage.getItem("pinkfolio_practicas")) || {},
    savePracticas: (data) => StorageDB.guardarSeguro("pinkfolio_practicas", data),

    getLista: (clave) => JSON.parse(localStorage.getItem(`pinkfolio_${clave}`)) || [],
    saveItemLista: (clave, item) => {
        if (StorageDB.isInvitado()) return null;
        let lista = StorageDB.getLista(clave);
        lista.unshift(item);
        const ok = StorageDB.guardarSeguro(`pinkfolio_${clave}`, lista);
        return ok ? lista : null;
    },
    deleteItemLista: (clave, index) => {
        if (StorageDB.isInvitado()) return null;
        let lista = StorageDB.getLista(clave);
        lista.splice(index, 1);
        localStorage.setItem(`pinkfolio_${clave}`, JSON.stringify(lista));
        return lista;
    }
};