# ClientFlow — CRM ligero para pequeños negocios

ClientFlow es una aplicación web de gestión comercial creada como proyecto de portafolio. Permite organizar contactos, hacer seguimiento a oportunidades y visualizar el estado del pipeline de ventas desde una interfaz responsive en español.

![ClientFlow dashboard](https://img.shields.io/badge/ClientFlow-CRM-5b5ce2?style=for-the-badge)

## ✨ Funcionalidades

- **Panel de resumen:** métricas de clientes, oportunidades abiertas, valor potencial y ventas ganadas.
- **Gestión de contactos:** crear, editar, buscar, filtrar y eliminar clientes o prospectos.
- **Pipeline comercial:** oportunidades organizadas por etapa; puedes moverlas entre columnas.
- **Exportación CSV:** descarga los contactos para trabajar con ellos en una hoja de cálculo.
- **Persistencia local:** los cambios se guardan en `localStorage`, sin servidor ni cuenta.
- **Diseño responsive:** interfaz adaptable a escritorio, tablet y móvil.
- **Datos de demostración:** incluye contactos y oportunidades ficticias para explorar el panel desde el primer uso.

## 🧰 Tecnologías

- HTML5 semántico
- CSS3 (Grid, Flexbox, variables y media queries)
- JavaScript moderno (ES6+)
- Web Storage API (`localStorage`)
- Sin frameworks, dependencias ni proceso de compilación

## 🚀 Ejecutar localmente

No requiere instalación de dependencias. Puedes abrir `index.html` directamente o iniciar un servidor estático:

```bash
git clone https://github.com/Metzeldor/Portafolio.git
cd Portafolio/clientflow
python3 -m http.server 8000
```

Abre [http://localhost:8000](http://localhost:8000).

## 🗂️ Estructura

```text
clientflow/
├── index.html    # Estructura y formularios
├── styles.css    # Diseño responsive y componentes visuales
├── app.js        # Estado, CRUD, pipeline y almacenamiento
└── README.md     # Documentación
```

## 🧪 Probar la aplicación

1. Abre el panel y revisa las métricas de ejemplo.
2. Entra a **Clientes** y crea un contacto.
3. Abre **Oportunidades** y registra una oportunidad para ese contacto.
4. Cambia su etapa para actualizar el pipeline.
5. Exporta los contactos desde el resumen.
6. Recarga la página: los cambios deben permanecer en el mismo navegador.

## 🔐 Privacidad y alcance

Los datos se almacenan únicamente en el navegador mediante `localStorage`. No existe backend, autenticación, sincronización entre dispositivos ni cifrado de datos. La aplicación usa información ficticia de demostración; no introduzcas datos personales sensibles o información real de clientes en una publicación pública.

## 🛣️ Posibles mejoras

- Backend con API REST y base de datos.
- Autenticación y roles de usuario.
- Recordatorios y registro de actividades.
- Importación CSV y filtros avanzados.
- Pruebas automatizadas y validación adicional.

## 👨‍💻 Autor

**Andrés Tejada** · [GitHub @Metzeldor](https://github.com/Metzeldor) · [Portafolio](https://metzeldor.github.io/Portafolio/)

---

Proyecto demostrativo desarrollado para practicar interfaces web, manipulación del DOM, gestión de estado y persistencia en el navegador.
