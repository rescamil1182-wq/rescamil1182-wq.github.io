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
        "imagen": true,
        "imagenAlt": "Vial con sellos de origen: Europa 53%, India 25%, Estados Unidos y Canadá 11%. 86% de los inyectables nuevos de 2026 se fabrica solo fuera de México.",
        "estado": "publicado",
        "tipo": "investigacion"
    },
    {
        "slug": "cuanto-mas-paga-un-hospital-privado-que-el-gobierno",
        "titulo": "¿Cuánto más paga un hospital privado que el gobierno por el mismo medicamento? Tres indicadores para medirlo",
        "resumen": "Tres indicadores para medir cuánto más paga un hospital privado que el gobierno por el mismo medicamento, qué datos los alimentan y qué ajustes evitan conclusiones falsas.",
        "tema": "Compras públicas de medicamentos",
        "fecha": "2026-11-12",
        "minutos": 4,
        "imagen": true,
        "imagenAlt": "Regla de 1.0× a 3.5× que mide cuántas veces más que el gobierno paga un hospital privado; el gobierno está en 1.0× y el hospital privado aparece con un signo de interrogación.",
        "estado": "publicado",
        "tipo": "investigacion"
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
        "imagen": true,
        "imagenAlt": "Tubería que sale del principio activo indio, pierde caudal en la farmacia y la aseguradora, y llega a la cuenta del hospital con un signo de interrogación.",
        "estado": "publicado",
        "tipo": "investigacion"
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
        "slug": "quien-gano-quien-perdio-y-que-falta-compra-medicamentos-2027-2028",
        "titulo": "Quién ganó, quién perdió y qué falta en la compra de medicamentos 2027-2028 del gobierno: el posible impacto en el mercado privado",
        "resumen": "El gobierno cambió las reglas para comprar medicamentos 2027-2028. Quién ganó, quién perdió, qué quedó sin proveedor y qué puede significar para los hospitales privados.",
        "tema": "Compras públicas de medicamentos",
        "fecha": "2026-10-28",
        "minutos": 13,
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
        "imagen": true,
        "imagenAlt": "Podio casi plano: dos empresas empatan en primer lugar con 3.9% de las solicitudes y la tercera tiene 2.7%; 275 empresas, HHI de 114.",
        "estado": "publicado",
        "tipo": "investigacion"
    },
    {
        "slug": "que-medicamento-tendra-competencia-despues-de-sitagliptina",
        "titulo": "¿Qué medicamento tendrá competencia en México después de sitagliptina?",
        "resumen": "Las solicitudes de registro sanitario que recibe COFEPRIS anticipan qué medicamentos tendrán varios proveedores y cuáles seguirán con uno solo. Para quien compra en un hospital, funcionan como un calendario de negociación.",
        "tema": "Medicamentos y COFEPRIS",
        "fecha": "2026-10-15",
        "minutos": 6,
        "imagen": true,
        "imagenAlt": "Línea de salida con fichas numeradas: 37 empresas esperan registrar sitagliptina, 28 dapagliflozina y 3 palbociclib.",
        "estado": "publicado",
        "tipo": "investigacion"
    },
    {
        "slug": "hecho-en-mexico-con-molecula-de-india",
        "titulo": "Hecho en México, con molécula de India",
        "resumen": "La mitad de los registros de medicamentos que se emiten hoy lista un fabricante indio de principio activo; hace diez años, un tercio. Lo medimos en la base completa de COFEPRIS.",
        "tema": "Medicamentos y COFEPRIS",
        "fecha": "2026-10-15",
        "minutos": 7,
        "imagen": true,
        "imagenAlt": "Caja de medicamento con la etiqueta \"Hecho en México\" levantada; debajo dice \"Principio activo India\". 51% de los registros de 2026 lista un fabricante indio, contra 35% en 2016.",
        "estado": "publicado",
        "tipo": "investigacion"
    },
    {
        "tipo": "investigacion",
        "slug": "dos-oligopolios-y-una-factura",
        "titulo": "Dos oligopolios y una factura: por qué el seguro de gastos médicos mayores se encareció tanto en México",
        "resumen": "Cuatro aseguradoras concentran tres cuartas partes del mercado y los hospitales privados grandes se agrupan en cuatro entidades del país. Entre ambos, el costo de la atención privada sube casi cinco veces más rápido que los precios en general, y la cuenta termina en la prima del asegurado.",
        "tema": "Aseguradoras y SGMM",
        "fecha": "2026-10-14",
        "minutos": 6,
        "imagen": true,
        "imagenAlt": "Dos bloques aprietan una columna ámbar: 4 aseguradoras concentran 75% de las primas y 4 entidades reúnen 79% de los hospitales grandes; el costo de la atención privada sube 14.8% en 2026.",
        "estado": "publicado"
    }
];
