/*
 * OBSERVATORIO ILIK · LISTA DE INVESTIGACIONES
 * ------------------------------------------------------------------
 * La franja de la página de inicio, el archivo del Observatorio y las
 * "lecturas relacionadas" de cada artículo se arman solos a partir de esta lista.
 *
 * Normalmente NO se edita a mano: la herramienta publicar_observatorio.py
 * agrega o actualiza el bloque de cada artículo a partir de su Word.
 * Si la edita a mano, conserve el formato (comillas dobles en nombres y textos).
 *
 * Campos:
 *   slug      Nombre de la carpeta del artículo (minúsculas, números y guiones).
 *   titulo    Titular tal como aparece en la tarjeta.
 *   resumen   Una o dos líneas para la tarjeta.
 *   tema      Etiqueta corta (por ejemplo: "Aseguradoras", "Inflación médica").
 *   fecha     AAAA-MM-DD. Con fecha futura la pieza no se muestra hasta ese día.
 *   minutos   Minutos de lectura.
 *   imagen    true si existe portada.jpg en la carpeta del artículo.
 *   imagenAlt Descripción breve de la imagen para lectores de pantalla.
 *   estado    "publicado" o "borrador". Un borrador nunca se muestra al público.
 *             Para revisarlo, abra el sitio con ?vista=borradores al final de la dirección.
 *
 * Campos opcionales (ILIK v5):
 *   tipo      "investigacion" (pieza larga propia) o "dato" (dato público comentado, lectura corta).
 *             Si se omite, se toma como "investigacion".
 *   grafica   Portada hecha con los datos de la pieza, sin necesidad de imagen. Se usa cuando imagen es false.
 *             { "titulo": "...", "unidad": "%", "barras": [ { "etiqueta": "...", "valor": 14, "desde": 12,
 *               "texto": "12 a 14%", "destacar": true }, ... ], "fuente": "..." }
 *             "desde" es opcional: dibuja un rango (por ejemplo, una proyección de 12 a 14%).
 */
window.ILIK_ARTICULOS = [
    {
        "tipo": "investigacion",
        "slug": "dos-oligopolios-y-una-factura",
        "titulo": "Dos oligopolios y una factura: por qué el Seguro de Gastos Médicos Mayores se volvió el más caro del mundo",
        "resumen": "Concentración de aseguradoras, concentración de hospitales y una factura que termina pagando el asegurado. Lo que dicen los datos.",
        "tema": "Aseguradoras y SGMM",
        "fecha": "2026-11-05",
        "minutos": null,
        "imagen": false,
        "imagenAlt": "Ilustración editorial: médicos y ejecutivos alrededor de una gráfica de inflación médica.",
        "estado": "borrador"
    },
    {
        "slug": "inflacion-medica-privada-2026",
        "tipo": "dato",
        "titulo": "La atención médica privada se encarece cerca de tres veces más rápido que el resto de los precios",
        "resumen": "La AMIS proyecta una inflación médica privada de 12 a 14% para 2026; los especialistas que encuesta Banxico esperan 4.35% de inflación general.",
        "tema": "Inflación médica",
        "fecha": "2026-10-14",
        "minutos": 2,
        "imagen": false,
        "imagenAlt": "",
        "grafica": {
            "barras": [
                {
                    "etiqueta": "Médica privada",
                    "valor": 14.0,
                    "texto": "12 a 14%",
                    "desde": 12.0,
                    "destacar": true
                },
                {
                    "etiqueta": "General",
                    "valor": 4.35,
                    "texto": "4.35%"
                }
            ],
            "titulo": "Inflación esperada para 2026",
            "fuente": "AMIS, mayo 2026 · Banxico, mayo 2026"
        },
        "estado": "publicado"
    }
];
