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
 *             "forma" elige el objeto que dibuja la cifra (ILIK v8, portadas de botica):
 *               "blister"  conteos (empresas, solicitudes): una cavidad por unidad, hasta ~60 por fila de datos
 *               "capsulas" porcentaje de cada categoría (0 a 100)
 *               "jeringas" tasas comparadas, como inflación; acepta "desde" para rangos
 *               "viales"   porcentajes de inyectables (0 a 100)
 *               "cien"     una proporción en el tiempo: requiere "anio" en cada barra
 *             Regla: dos piezas seguidas no usan la misma forma.
 */
window.ILIK_ARTICULOS = [
    {
        "slug": "de-donde-viene-el-inyectable",
        "titulo": "¿De dónde viene realmente el inyectable que su hospital compra?",
        "resumen": "La mitad de los inyectables con registro vigente en México se fabrica por completo fuera del país, y entre los nuevos ya son cuatro de cada cinco. Lo vigente viene sobre todo de Europa; lo nuevo, cada vez más de India.",
        "tema": "Medicamentos y COFEPRIS",
        "fecha": "2026-11-19",
        "minutos": 6,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "titulo": "Producto terminado fabricado solo fuera de México",
            "unidad": "%",
            "barras": [
                {
                    "etiqueta": "Inyectables nuevos, 2026",
                    "valor": 86,
                    "texto": "86%",
                    "destacar": true
                },
                {
                    "etiqueta": "Inyectables vigentes",
                    "valor": 52,
                    "texto": "52%"
                },
                {
                    "etiqueta": "Orales vigentes",
                    "valor": 33,
                    "texto": "33%"
                }
            ],
            "fuente": "Ilik con datos del Visor de Registros de Medicamentos de COFEPRIS",
            "forma": "viales"
        }
    },
    {
        "slug": "ninguna-de-las-139-claves-desiertas-esta-en-la-i-285",
        "titulo": "Ninguna de las 139 claves desiertas está en la licitación que viene",
        "resumen": "Las 139 claves desiertas de la licitación de genéricos 2027/2028 no están en la licitación abierta I-285. Dependen de procedimientos que aún no tienen fallo.",
        "tema": "Compras públicas de medicamentos",
        "fecha": "2026-11-10",
        "minutos": 2,
        "imagen": true,
        "imagenAlt": "Dos conjuntos que no se tocan: 139 claves desiertas y 1,169 renglones de la licitación I-285, con cero en común.",
        "estado": "publicado",
        "tipo": "dato"
    },
    {
        "slug": "el-ahorro-que-nadie-ve",
        "titulo": "El ahorro que nadie ve",
        "resumen": "La mitad de los registros de medicamentos ya lista un fabricante indio de principio activo, en teoría más barato. Ni las primas, ni la inflación médica, ni la cuenta del hospital parecen haberlo notado. Seguimos el rastro de esa diferencia.",
        "tema": "Medicamentos y aseguradoras",
        "fecha": "2026-11-05",
        "minutos": 6,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "forma": "jeringas",
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
        "slug": "lo-que-paga-el-gobierno-por-cada-medicamento",
        "titulo": "Lo que paga el gobierno por cada medicamento, y cómo usarlo para negociar",
        "resumen": "Birmex publica el precio adjudicado de cada clave. Ajustado bien, es un punto de partida documentado para negociar, y la compra 2027/2028 bajó muchos de esos precios.",
        "tema": "Compras públicas de medicamentos",
        "fecha": "2026-11-02",
        "minutos": 10,
        "imagen": true,
        "imagenAlt": "Ticket de precio del sugammadex: 2,049.69 pesos en 2025 tachado y techo de 754.15 pesos en 2027, una baja mínima de 63%.",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "barras": [
                {
                    "etiqueta": "Ganador 2027 abajo del precio 2025",
                    "valor": 54.0,
                    "texto": "54%",
                    "destacar": true
                }
            ],
            "forma": "capsulas",
            "titulo": "Claves de la muestra donde el precio ganador de 2027 quedó abajo del de 2025 (41 de 76)",
            "fuente": "Cálculo de Ilik con el acta de fallo de T-218-2026 y el resumen de adjudicación de I-1-2025"
        }
    },
    {
        "slug": "las-75-claves-que-perdio-la-compra-publica",
        "titulo": "Las 75 claves que la compra pública perdió para 2027",
        "resumen": "La compra de genéricos 2027/2028 adjudicó más que la anterior, pero dejó sin proveedor 75 claves que en 2025 sí tenían, varias de uso diario en hospitales.",
        "tema": "Compras públicas de medicamentos",
        "fecha": "2026-10-28",
        "minutos": 12,
        "imagen": true,
        "imagenAlt": "Anaquel de farmacia con cajas de medicamento; 75 claves aparecen como huecos punteados en ámbar.",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "barras": [
                {
                    "etiqueta": "Mismas claves, 2027",
                    "valor": 81.0,
                    "texto": "81%",
                    "destacar": true
                },
                {
                    "etiqueta": "Mismas claves, 2025",
                    "valor": 75.0,
                    "texto": "75%"
                }
            ],
            "forma": "viales",
            "titulo": "Claves de medicamento adjudicadas, comparando las mismas 645 claves",
            "fuente": "Ilik con actas y resúmenes de adjudicación de Birmex en ComprasMX"
        }
    },
    {
        "slug": "quien-gana-la-carrera-por-registrar-medicamentos",
        "titulo": "¿Quién gana la carrera por registrar medicamentos en México?",
        "resumen": "Desde 2024, 275 empresas pidieron a COFEPRIS registrar medicamentos y ninguna concentra más de 4% de las solicitudes. Al cruzar quién somete con quién se queda con el registro, el podio cambia.",
        "tema": "Medicamentos y COFEPRIS",
        "fecha": "2026-10-20",
        "minutos": 10,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "titulo": "Registros nuevos con titular extranjero, 2024 a 2026",
            "unidad": "%",
            "barras": [
                {
                    "etiqueta": "Oncología",
                    "valor": 69,
                    "texto": "69%",
                    "destacar": true
                },
                {
                    "etiqueta": "Cardiovascular",
                    "valor": 51,
                    "texto": "51%"
                },
                {
                    "etiqueta": "Respiratorio",
                    "valor": 16,
                    "texto": "16%"
                }
            ],
            "fuente": "Ilik con datos del Visor de Registros de Medicamentos de COFEPRIS",
            "forma": "capsulas"
        }
    },
    {
        "slug": "que-medicamento-tendra-competencia-despues-de-sitagliptina",
        "titulo": "¿Qué medicamento tendrá competencia en México después de sitagliptina?",
        "resumen": "Las solicitudes de registro sanitario que recibe COFEPRIS anticipan qué medicamentos tendrán varios proveedores y cuáles seguirán con uno solo. Para quien compra en un hospital, funcionan como un calendario de negociación.",
        "tema": "Medicamentos y COFEPRIS",
        "fecha": "2026-10-15",
        "minutos": 6,
        "imagen": false,
        "imagenAlt": "",
        "estado": "publicado",
        "tipo": "investigacion",
        "grafica": {
            "forma": "blister",
            "titulo": "Empresas que pidieron registrar la molécula, 2024 a 2026",
            "barras": [
                {
                    "etiqueta": "Sitagliptina",
                    "valor": 37,
                    "texto": "37",
                    "destacar": true
                },
                {
                    "etiqueta": "Dapagliflozina",
                    "valor": 28,
                    "texto": "28"
                },
                {
                    "etiqueta": "Palbociclib",
                    "valor": 3,
                    "texto": "3"
                }
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
                    "anio": 2026.78,
                    "valor": 51.0,
                    "texto": "51%",
                    "destacar": true
                },
                {
                    "etiqueta": "2025",
                    "anio": 2025,
                    "valor": 50.0,
                    "texto": "50%"
                },
                {
                    "etiqueta": "2016",
                    "anio": 2016,
                    "valor": 35.0,
                    "texto": "35%"
                }
            ],
            "forma": "cien",
            "titulo": "Registros emitidos que listan un fabricante indio de principio activo",
            "fuente": "Ilik con datos del Visor de Registros de Medicamentos de COFEPRIS"
        }
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
            "fuente": "Aon, Global Medical Trend Rates 2026",
            "forma": "jeringas"
        }
    }
];
