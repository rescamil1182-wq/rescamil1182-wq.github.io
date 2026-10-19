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
        "slug": "el-ahorro-que-nadie-ve",
        "titulo": "El ahorro que nadie ve",
        "resumen": "La mitad de los registros de medicamentos ya lista un fabricante indio de principio activo, en teoría más barato. Ni las primas, ni la inflación médica, ni la cuenta del hospital parecen haberlo notado. Seguimos el rastro de esa diferencia.",
        "tema": "Medicamentos y aseguradoras",
        "fecha": "2026-10-15",
        "minutos": 6,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "titulo": "Inflación médica privada frente a la general",
            "barras": [
                {
                    "etiqueta": "Costos médicos, AMIS feb 2026",
                    "valor": 16,
                    "desde": 14,
                    "texto": "14 a 16%",
                    "destacar": true
                },
                {
                    "etiqueta": "Médica 2026, AMIS may 2026",
                    "valor": 14,
                    "desde": 12,
                    "texto": "12 a 14%"
                },
                {
                    "etiqueta": "General",
                    "valor": 4.5,
                    "texto": "cerca de 4.5%"
                }
            ],
            "fuente": "AMIS, citada por Expansión y Publimetro"
        }
    },
    {
        "slug": "treinta-y-siete-aspirantes-para-una-sola-molecula",
        "titulo": "Treinta y siete aspirantes para una sola molécula",
        "resumen": "Las solicitudes de registro sanitario que recibe COFEPRIS anticipan qué medicamentos tendrán varios proveedores y cuáles seguirán con uno solo. Para quien compra en un hospital, funcionan como un calendario de negociación.",
        "tema": "Medicamentos y COFEPRIS",
        "fecha": "2026-10-15",
        "minutos": 6,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "titulo": "Empresas que pidieron registrar la molécula, 2024 a 2026",
            "barras": [
                {"etiqueta": "Sitagliptina", "valor": 37, "texto": "37", "destacar": true},
                {"etiqueta": "Dapagliflozina", "valor": 28, "texto": "28"},
                {"etiqueta": "Palbociclib", "valor": 3, "texto": "3"}
            ],
            "fuente": "Ilik con datos de los listados de solicitudes de COFEPRIS"
        }
    },
    {
        "slug": "hecho-en-mexico-con-molecula-de-india",
        "titulo": "Hecho en México, con molécula de India",
        "resumen": "La mitad de los registros de medicamentos que se emiten hoy lista un fabricante indio de principio activo; hace diez años, un tercio. Lo medimos en la base completa de COFEPRIS.",
        "tema": "Medicamentos y COFEPRIS",
        "fecha": "2026-10-15",
        "minutos": 7,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "barras": [
                {
                    "etiqueta": "2026, al 9 de octubre",
                    "valor": 51.0,
                    "texto": "51%",
                    "destacar": true
                },
                {
                    "etiqueta": "2025",
                    "valor": 50.0,
                    "texto": "50%"
                },
                {
                    "etiqueta": "2016",
                    "valor": 35.0,
                    "texto": "35%"
                }
            ],
            "titulo": "Registros emitidos que listan un fabricante indio de principio activo",
            "fuente": "Ilik con datos del Visor de Registros de Medicamentos de COFEPRIS"
        }
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
    },
    {
        "tipo": "investigacion",
        "slug": "dos-oligopolios-y-una-factura",
        "titulo": "Dos oligopolios y una factura: por qué el seguro de gastos médicos mayores se encareció tanto en México",
        "resumen": "Cuatro aseguradoras concentran tres cuartas partes del mercado y los hospitales privados grandes se agrupan en cuatro entidades del país. Entre ambos, el costo de la atención privada sube casi cinco veces más rápido que los precios en general, y la cuenta termina en la prima del asegurado.",
        "tema": "Aseguradoras y SGMM",
        "fecha": "2026-10-14",
        "minutos": 6,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "grafica": {
            "barras": [
                {
                    "etiqueta": "México",
                    "valor": 14.8,
                    "texto": "14.8%",
                    "destacar": true
                },
                {
                    "etiqueta": "Promedio mundial",
                    "valor": 9.8,
                    "texto": "9.8%"
                },
                {
                    "etiqueta": "Inflación general en México",
                    "valor": 3.2,
                    "texto": "3.2%"
                }
            ],
            "titulo": "Inflación médica proyectada para 2026",
            "fuente": "Aon, Global Medical Trend Rates 2026"
        }
    }
];
