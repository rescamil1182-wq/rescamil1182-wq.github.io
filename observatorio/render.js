/*
 * OBSERVATORIO ILIK · ARMADO DE TARJETAS
 * No necesita edición. Lee la lista de observatorio/articulos.js y llena:
 *   [data-obs="inicio"]        franja de la página de inicio (las 3 más recientes)
 *   [data-obs="archivo"]       archivo completo (la más reciente destacada)
 *   [data-obs="relacionados"]  otras lecturas al final de cada artículo
 * Si no hay piezas publicadas, el bloque que las contiene se queda oculto:
 * nunca se muestra una sección vacía.
 */
(function () {
    "use strict";
    try {
        var script = document.currentScript || document.querySelector("script[data-obs-base]");
        var BASE = (script && script.getAttribute("data-obs-base")) || "";
        var lista = Array.isArray(window.ILIK_ARTICULOS) ? window.ILIK_ARTICULOS.slice() : [];
        var verBorradores = /[?&]vista=borradores\b/.test(window.location.search);

        var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        function leerFecha(txt) {
            var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(txt || "");
            return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
        }
        function fechaLarga(d) { return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear(); }
        function slugValido(s) { return typeof s === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s); }

        var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
        var visibles = lista.filter(function (a) {
            if (!a || !slugValido(a.slug) || !a.titulo) { return false; }
            a._fecha = leerFecha(a.fecha);
            if (!a._fecha) { return false; }
            a._borrador = a.estado !== "publicado";
            a._programada = a._fecha > hoy;
            if (verBorradores) { return true; }
            return !a._borrador && !a._programada;
        }).sort(function (x, y) {
            // ILIK v5: misma fecha, primero la investigación y luego el dato público
            var d = y._fecha - x._fecha;
            if (d !== 0) { return d; }
            return (x.tipo === "dato" ? 1 : 0) - (y.tipo === "dato" ? 1 : 0);
        });

        function el(tag, cls, texto) {
            var n = document.createElement(tag);
            if (cls) { n.className = cls; }
            if (texto) { n.textContent = texto; }
            return n;
        }

        function tarjeta(a, variante, ubicacion) {
            var url = BASE + "observatorio/" + a.slug + "/";
            var art = el("article", "obs-card" + (variante ? " obs-card--" + variante : ""));
            var link = el("a", "obs-card__link");
            link.href = url;
            link.setAttribute("data-cta", "observatorio-" + ubicacion);
            link.addEventListener("click", function () {
                try { window.plausible && window.plausible("Abrir investigacion", { props: { articulo: a.slug, ubicacion: ubicacion } }); } catch (e) {}
            });

            var media = el("div", "obs-card__media");
            if (!a.imagen && a.grafica && Array.isArray(a.grafica.barras) && a.grafica.barras.length) {
                // ILIK v5 · Portada hecha con los datos de la pieza
                media.classList.add("obs-card__media--grafica");
                media.appendChild(portadaGrafica(a.grafica));
            } else {
                var img = el("img");
                img.loading = "lazy";
                img.decoding = "async";
                img.alt = a.imagen ? (a.imagenAlt || "") : "";
                img.src = a.imagen ? url + "portada.jpg" : BASE + "observatorio/portada-generica.svg";
                img.addEventListener("error", function () {
                    if (img.getAttribute("data-fallback")) { return; }
                    img.setAttribute("data-fallback", "1");
                    img.alt = "";
                    img.src = BASE + "observatorio/portada-generica.svg";
                });
                media.appendChild(img);
            }
            if (verBorradores && (a._borrador || a._programada)) {
                media.appendChild(el("span", "obs-flag", a._borrador ? "Borrador" : "Programada"));
            }

            var body = el("div", "obs-card__body");
            var esDato = a.tipo === "dato";
            var meta = el("p", "obs-card__meta");
            meta.appendChild(el("span", "obs-card__tipo", esDato ? "Dato público" : "Investigación"));
            if (a.tema) { meta.appendChild(el("span", "obs-card__tema", a.tema)); }
            var detalle = fechaLarga(a._fecha) + (a.minutos ? ", " + a.minutos + " min de lectura" : "");
            var h = el("h3", "obs-card__title font-serif", a.titulo);
            body.appendChild(meta);
            body.appendChild(h);
            if (a.resumen) { body.appendChild(el("p", "obs-card__dek", a.resumen)); }
            var pie = el("p", "obs-card__foot");
            pie.appendChild(el("span", "obs-card__fecha", detalle));
            pie.appendChild(el("span", "obs-card__more", esDato ? "Ver el dato" : "Leer investigación"));
            body.appendChild(pie);
            if (esDato) { art.classList.add("obs-card--dato"); }

            link.appendChild(media);
            link.appendChild(body);
            art.appendChild(link);
            return art;
        }

        // ILIK v5 · Portada de datos: barras horizontales dibujadas con las cifras de la pieza.
        // El rango ("desde") se dibuja como tramo rayado para no presentar una proyección como cifra exacta.
        var SVG = "http://www.w3.org/2000/svg";
        function s(tag, attrs, texto) {
            var n = document.createElementNS(SVG, tag);
            Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
            if (texto) { n.textContent = texto; }
            return n;
        }

        // ILIK v7 · Unidades: un punto por empresa. Sirve cuando la cifra es un conteo.
        function formaUnidades(svg, g, X0) {
            var R = 7.5, PASO = 21, POR_FILA = 26;
            var y = 152;
            g.barras.slice(0, 3).forEach(function (b) {
                var n = Math.round(+b.valor) || 0;
                var filas = Math.max(1, Math.ceil(n / POR_FILA));
                svg.appendChild(s("text", { x: X0, y: y, "class": "pg-etiqueta" }, b.etiqueta));
                svg.appendChild(s("text", { x: X0 + POR_FILA * PASO + 16, y: y + 22 + (filas - 1) * PASO / 2, "class": "pg-valor" + (b.destacar ? " pg-valor--destacado" : "") }, b.texto || String(n)));
                for (var k = 0; k < n; k++) {
                    var cx = X0 + R + (k % POR_FILA) * PASO, cy = y + 22 + Math.floor(k / POR_FILA) * PASO;
                    svg.appendChild(s("circle", { cx: cx, cy: cy, r: R, fill: b.destacar ? "#C98A3B" : "#C9DAD5", "fill-opacity": b.destacar ? "1" : "0.75" }));
                }
                y += 22 + filas * PASO + 34;
            });
        }

        // ILIK v7 · Tendencia: línea en el tiempo real (los años se separan según su distancia).
        function formaTendencia(svg, g, X0, id) {
            var pts = g.barras.filter(function (b) { return b.anio != null; }).slice().sort(function (a, b) { return a.anio - b.anio; });
            if (pts.length < 2) { return; }
            var XA = X0 + 10, XB = 640, YT = 170, YB = 400;
            var a0 = pts[0].anio, a1 = pts[pts.length - 1].anio;
            var vmax = Math.max.apply(null, pts.map(function (b) { return +b.valor; }));
            var techo = Math.ceil(vmax / 10) * 10 + 10;
            var px = function (a) { return XA + (XB - XA) * (a - a0) / ((a1 - a0) || 1); };
            var py = function (v) { return YB - (YB - YT) * (v / techo); };
            [0, techo / 2, techo].forEach(function (v) {
                svg.appendChild(s("line", { x1: XA, x2: XB, y1: py(v), y2: py(v), stroke: "#C9DAD5", "stroke-opacity": "0.14", "stroke-width": "1.5" }));
            });
            var d = pts.map(function (b, i) { return (i ? "L" : "M") + px(b.anio).toFixed(1) + " " + py(+b.valor).toFixed(1); }).join(" ");
            svg.appendChild(s("path", { d: d + " L" + px(a1) + " " + YB + " L" + px(a0) + " " + YB + " Z", fill: "#C98A3B", "fill-opacity": "0.12" }));
            svg.appendChild(s("path", { d: d, fill: "none", stroke: "#C98A3B", "stroke-width": "5", "stroke-linejoin": "round", "stroke-linecap": "round" }));
            pts.forEach(function (b, i) {
                var x = px(b.anio), y = py(+b.valor), ultimo = i === pts.length - 1;
                svg.appendChild(s("circle", { cx: x, cy: y, r: ultimo ? 11 : 8, fill: ultimo ? "#C98A3B" : "#0B1420", stroke: "#C98A3B", "stroke-width": "4" }));
                var medio = i > 0 && !ultimo;
                svg.appendChild(s("text", { x: medio ? x - 14 : x, y: medio ? y + 52 : y - 26, "text-anchor": i === 0 ? "start" : (medio ? "end" : "middle"), "class": "pg-valor" + (ultimo ? " pg-valor--destacado" : "") }, b.texto || String(b.valor)));
                svg.appendChild(s("text", { x: x, y: YB + 34, "text-anchor": i === 0 ? "start" : (ultimo ? "start" : "end"), "class": "pg-etiqueta" }, String(Math.floor(b.anio))));
            });
        }

        // ILIK v7 · Rango: una escala común; las proyecciones son tramos, la cifra general es un punto.
        function formaRango(svg, g, X0, id) {
            // ILIK v7b · Versión limpia: sin rejilla ni ejes; cada fila tiene un riel tenue de 0 a 20%
            // para que la etiqueta, el tramo y la cifra se lean como una sola línea.
            var XA = X0, XB = 450, MAX = 20;
            var px = function (v) { return XA + (XB - XA) * (v / MAX); };
            var filas = g.barras.slice(0, 3), paso = 96, y0 = 172;
            filas.forEach(function (b, i) {
                var y = y0 + i * paso, cy = y + 30;
                svg.appendChild(s("text", { x: XA, y: y, "class": "pg-etiqueta" }, b.etiqueta));
                svg.appendChild(s("line", { x1: XA, x2: XB, y1: cy, y2: cy, stroke: "#C9DAD5", "stroke-opacity": "0.16", "stroke-width": "4", "stroke-linecap": "round" }));
                var fin;
                if (b.desde != null) {
                    svg.appendChild(s("rect", { x: px(+b.desde), y: cy - 11, width: px(+b.valor) - px(+b.desde), height: 22, rx: 11, fill: b.destacar ? "#C98A3B" : "#C9DAD5" }));
                    fin = px(+b.valor);
                } else {
                    svg.appendChild(s("circle", { cx: px(+b.valor), cy: cy, r: 11, fill: "#C9DAD5" }));
                    fin = px(+b.valor);
                }
                svg.appendChild(s("text", { x: Math.max(fin, XB) + 24, y: cy + 13, "class": "pg-valor" + (b.destacar ? " pg-valor--destacado" : "") }, b.texto || ""));
            });
        }

        // ILIK v8 · Portadas de botica: la cifra se dibuja con el objeto del que habla la pieza.
        // Cada objeto es proporcional al dato (no es ilustración decorativa):
        //   "blister"  conteos: una cavidad por unidad (empresas, solicitudes)
        //   "capsulas" proporciones por categoría: la cápsula se llena hasta el porcentaje
        //   "jeringas" tasas comparadas (inflación): el émbolo empuja hasta la cifra; un rango va rayado
        //   "viales"   porcentajes de inyectables: el líquido sube hasta la cifra
        //   "cien"     una proporción vista como cien tabletas, con el punto de partida marcado
        var C = { ink: "#0B1420", inkSoft: "#16222F", bone: "#F7F8FA", boneDim: "#E7E9ED", teal: "#3F7D6E", tealSoft: "#C9DAD5", amber: "#C98A3B" };
        function txt(svg, x, y, cadena, estilo, extra) {
            var a = { x: x, y: y, style: estilo };
            Object.keys(extra || {}).forEach(function (k) { a[k] = extra[k]; });
            svg.appendChild(s("text", a, cadena));
        }
        function partir(cadena, max) {
            var lineas = [], actual = "";
            String(cadena || "").split(/\s+/).forEach(function (p) {
                if (!p) { return; }
                if ((actual + " " + p).trim().length > max && actual) { lineas.push(actual); actual = p; }
                else { actual = (actual + " " + p).trim(); }
            });
            if (actual) { lineas.push(actual); }
            return lineas;
        }
        var F_SANS = "font-family: Inter, system-ui, sans-serif;";
        var F_SERIF = "font-family: Fraunces, Georgia, serif;";
        function titulo8(svg, g, y, max) {
            partir(g.titulo, max || 46).slice(0, 2).forEach(function (l, i) {
                txt(svg, 56, y + i * 33, l, F_SANS + "font-size:27px;font-weight:500;fill:" + C.tealSoft + ";");
            });
        }
        function fuente8(svg, g) {
            if (g.fuente) { txt(svg, 56, 474, "Fuente: " + g.fuente, F_SANS + "font-size:18px;fill:" + C.tealSoft + ";fill-opacity:.7;", { "class": "pg-fuente8" }); }
        }
        function cifra(svg, x, y, cadena, destacado, tam, ancla) {
            txt(svg, x, y, cadena, F_SERIF + "font-weight:700;font-size:" + tam + "px;fill:" + (destacado ? C.amber : C.bone) + ";font-variant-numeric:tabular-nums;", ancla ? { "text-anchor": ancla } : null);
        }
        function etiqueta(svg, x, y, cadena, ancla) {
            txt(svg, x, y, cadena, F_SANS + "font-size:24px;font-weight:600;fill:" + C.bone + ";fill-opacity:.88;", ancla ? { "text-anchor": ancla } : null);
        }

        // Blíster: cada cavidad es una unidad contada. La lámina crece con el número.
        function formaBlister(svg, g) {
            titulo8(svg, g, 66);
            var filas = g.barras.slice(0, 3);
            var COLS = 13, PX = 30, PY = 25, X = 238, cuenta = 0;
            var y = 132;
            filas.forEach(function (b) {
                var n = Math.max(0, Math.round(+b.valor) || 0);
                var nf = Math.max(1, Math.ceil(n / COLS));
                var alto = nf * PY + 16;
                partir(b.etiqueta, 13).slice(0, 2).forEach(function (l, i) { etiqueta(svg, 56, y + 30 + i * 28, l); });
                svg.appendChild(s("rect", { x: X, y: y, width: COLS * PX + 12, height: alto, rx: 12, fill: C.bone, "fill-opacity": "0.05", stroke: C.bone, "stroke-opacity": "0.16", "stroke-width": "2" }));
                for (var k = 0; k < n; k++) {
                    var cx = X + 8 + (k % COLS) * PX, cy = y + 8 + Math.floor(k / COLS) * PY;
                    svg.appendChild(s("rect", { x: cx, y: cy, width: 26, height: 17, rx: 8.5, fill: "none", stroke: C.bone, "stroke-opacity": "0.22", "stroke-width": "1.5" }));
                    var pil = s("g", { "data-a": "pop", "data-i": String(cuenta++) });
                    pil.appendChild(s("rect", { x: cx + 2.5, y: cy + 2.5, width: 21, height: 12, rx: 6, fill: b.destacar ? C.amber : C.tealSoft, "fill-opacity": b.destacar ? "1" : "0.7" }));
                    pil.appendChild(s("rect", { x: cx + 6, y: cy + 4.5, width: 7, height: 2.5, rx: 1.2, fill: C.bone, "fill-opacity": "0.45" }));
                    svg.appendChild(pil);
                }
                cifra(svg, 744, y + Math.min(alto, 60) / 2 + (b.destacar ? 26 : 18), b.texto || String(n), b.destacar, b.destacar ? 74 : 52, "end");
                y += alto + 26;
            });
            fuente8(svg, g);
        }

        // Cápsulas: la parte ámbar es la proporción; la costura marca la mitad.
        function formaCapsulas(svg, g, id) {
            titulo8(svg, g, 66);
            var X = 56, L = 520, AL = 50;
            g.barras.slice(0, 3).forEach(function (b, i) {
                var y = 150 + i * 104;
                var v = Math.max(0, Math.min(100, +b.valor || 0));
                etiqueta(svg, X, y, b.etiqueta);
                var cid = id + "-cap-" + i;
                var cp = s("clipPath", { id: cid });
                cp.appendChild(s("rect", { x: X, y: y + 14, width: L, height: AL, rx: AL / 2 }));
                svg.appendChild(cp);
                var grupo = s("g", { "clip-path": "url(#" + cid + ")" });
                grupo.appendChild(s("rect", { x: X, y: y + 14, width: L, height: AL, fill: C.tealSoft, "fill-opacity": "0.12" }));
                grupo.appendChild(s("rect", { x: X, y: y + 14, width: L * v / 100, height: AL, fill: b.destacar ? C.amber : C.tealSoft, "fill-opacity": b.destacar ? "1" : "0.78", "data-a": "x", "data-i": String(i) }));
                grupo.appendChild(s("rect", { x: X + 18, y: y + 22, width: L - 36, height: 7, rx: 3.5, fill: C.bone, "fill-opacity": "0.22" }));
                svg.appendChild(grupo);
                svg.appendChild(s("rect", { x: X, y: y + 14, width: L, height: AL, rx: AL / 2, fill: "none", stroke: C.bone, "stroke-opacity": "0.3", "stroke-width": "2" }));
                svg.appendChild(s("line", { x1: X + L / 2, x2: X + L / 2, y1: y + 14, y2: y + 14 + AL, stroke: C.ink, "stroke-opacity": "0.55", "stroke-width": "3" }));
                cifra(svg, 744, y + 56, b.texto || (v + "%"), b.destacar, b.destacar ? 60 : 46, "end");
            });
            fuente8(svg, g);
        }

        // Jeringas: el líquido llega hasta la tasa; la escala graduada es común a todas.
        function formaJeringas(svg, g, id) {
            titulo8(svg, g, 66);
            var vmax = Math.max.apply(null, g.barras.map(function (b) { return +b.valor || 0; })) || 1;
            var MAX = Math.ceil(vmax * 1.12 / 5) * 5;
            var XA = 104, XB = 616, AL = 34;
            var px = function (v) { return XA + (XB - XA) * (v / MAX); };
            var filas = g.barras.slice(0, 3);
            filas.forEach(function (b, i) {
                var y = 150 + i * 104, by = y + 16, cy = by + AL / 2;
                etiqueta(svg, 56, y, b.etiqueta);
                cifra(svg, 744, y + 4, b.texto || String(b.valor), b.destacar, b.destacar ? 48 : 38, "end");
                // émbolo
                svg.appendChild(s("rect", { x: 56, y: by - 8, width: 9, height: AL + 16, rx: 3, fill: C.tealSoft, "fill-opacity": "0.55" }));
                svg.appendChild(s("rect", { x: 65, y: cy - 4, width: XA - 65, height: 8, fill: C.tealSoft, "fill-opacity": "0.4" }));
                // líquido
                var color = b.destacar ? C.amber : C.tealSoft, op = b.destacar ? "1" : "0.75";
                if (b.desde != null && +b.desde < +b.valor) {
                    var liq = s("g", { "data-a": "x", "data-i": String(i) });
                    liq.appendChild(s("rect", { x: XA, y: by, width: px(+b.desde) - XA, height: AL, fill: color, "fill-opacity": op }));
                    liq.appendChild(s("rect", { x: px(+b.desde), y: by, width: px(+b.valor) - px(+b.desde), height: AL, fill: b.destacar ? "url(#" + id + ")" : color, "fill-opacity": b.destacar ? "1" : "0.35" }));
                    svg.appendChild(liq);
                } else {
                    svg.appendChild(s("rect", { x: XA, y: by, width: px(+b.valor) - XA, height: AL, fill: color, "fill-opacity": op, "data-a": "x", "data-i": String(i) }));
                }
                // tapón de hule
                svg.appendChild(s("rect", { x: XA - 4, y: by - 2, width: 10, height: AL + 4, rx: 2, fill: C.ink, stroke: C.tealSoft, "stroke-opacity": "0.6", "stroke-width": "2" }));
                // cilindro, graduación, cono y aguja
                svg.appendChild(s("rect", { x: XA, y: by, width: XB - XA, height: AL, rx: 4, fill: "none", stroke: C.bone, "stroke-opacity": "0.4", "stroke-width": "2" }));
                for (var t = 1; t < MAX; t++) {
                    var mayor = t % 5 === 0;
                    svg.appendChild(s("line", { x1: px(t), x2: px(t), y1: by, y2: by + (mayor ? 15 : 8), stroke: C.bone, "stroke-opacity": mayor ? "0.55" : "0.3", "stroke-width": mayor ? "2" : "1.2" }));
                }
                svg.appendChild(s("path", { d: "M" + XB + " " + by + " L" + (XB + 26) + " " + (cy - 6) + " L" + (XB + 26) + " " + (cy + 6) + " L" + XB + " " + (by + AL) + " Z", fill: C.bone, "fill-opacity": "0.12", stroke: C.bone, "stroke-opacity": "0.4", "stroke-width": "2" }));
                svg.appendChild(s("line", { x1: XB + 26, x2: 744, y1: cy, y2: cy, stroke: C.bone, "stroke-opacity": "0.5", "stroke-width": "2" }));
                if (i === filas.length - 1) {
                    for (var m = 0; m <= MAX; m += 5) { txt(svg, px(m), by + AL + 28, m + "%", F_SANS + "font-size:18px;fill:" + C.tealSoft + ";fill-opacity:.75;", { "text-anchor": "middle" }); }
                }
            });
            fuente8(svg, g);
        }

        // Viales: el nivel del líquido es el porcentaje.
        function formaViales(svg, g) {
            titulo8(svg, g, 60, 50);
            var filas = g.barras.slice(0, 3), n = filas.length;
            var ANCHO = 104, TOP = 156, BASE = 326;
            filas.forEach(function (b, i) {
                var cx = n === 1 ? 400 : 150 + i * (500 / (n - 1));
                var x = cx - ANCHO / 2, v = Math.max(0, Math.min(100, +b.valor || 0));
                var cid = "vial-" + nPortada + "-" + i;
                var cp = s("clipPath", { id: cid });
                cp.appendChild(s("rect", { x: x, y: TOP, width: ANCHO, height: BASE - TOP, rx: 16 }));
                svg.appendChild(cp);
                var nivel = BASE - (BASE - TOP) * v / 100;
                var gr = s("g", { "clip-path": "url(#" + cid + ")" });
                gr.appendChild(s("rect", { x: x, y: TOP, width: ANCHO, height: BASE - TOP, fill: C.bone, "fill-opacity": "0.05" }));
                var liquido = s("g", { "data-a": "y", "data-i": String(i) });
                liquido.appendChild(s("rect", { x: x, y: nivel, width: ANCHO, height: BASE - nivel, fill: b.destacar ? C.amber : C.tealSoft, "fill-opacity": b.destacar ? "1" : "0.72" }));
                liquido.appendChild(s("rect", { x: x, y: nivel, width: ANCHO, height: 5, fill: C.bone, "fill-opacity": "0.35" }));
                gr.appendChild(liquido);
                gr.appendChild(s("rect", { x: x + 12, y: TOP + 10, width: 8, height: BASE - TOP - 26, rx: 4, fill: C.bone, "fill-opacity": "0.16" }));
                svg.appendChild(gr);
                for (var t = 1; t < 10; t++) {
                    var ty = BASE - (BASE - TOP) * t / 10;
                    svg.appendChild(s("line", { x1: x + ANCHO - (t % 5 ? 14 : 24), x2: x + ANCHO, y1: ty, y2: ty, stroke: C.ink, "stroke-opacity": "0.45", "stroke-width": "2" }));
                }
                svg.appendChild(s("rect", { x: x, y: TOP, width: ANCHO, height: BASE - TOP, rx: 16, fill: "none", stroke: C.bone, "stroke-opacity": "0.42", "stroke-width": "2.5" }));
                svg.appendChild(s("rect", { x: cx - 26, y: TOP - 22, width: 52, height: 24, fill: C.bone, "fill-opacity": "0.08", stroke: C.bone, "stroke-opacity": "0.42", "stroke-width": "2.5" }));
                svg.appendChild(s("rect", { x: cx - 38, y: TOP - 52, width: 76, height: 32, rx: 5, fill: b.destacar ? C.amber : C.teal }));
                svg.appendChild(s("rect", { x: cx - 38, y: TOP - 30, width: 76, height: 6, fill: C.ink, "fill-opacity": "0.3" }));
                cifra(svg, cx, 384, b.texto || (v + "%"), b.destacar, b.destacar ? 54 : 44, "middle");
                partir(b.etiqueta, 20).slice(0, 2).forEach(function (l, j) {
                    txt(svg, cx, 412 + j * 24, l, F_SANS + "font-size:20px;font-weight:600;fill:" + C.bone + ";fill-opacity:.85;", { "text-anchor": "middle" });
                });
            });
            if (g.fuente) { txt(svg, 56, 488, "Fuente: " + g.fuente, F_SANS + "font-size:16px;fill:" + C.tealSoft + ";fill-opacity:.7;", { "class": "pg-fuente8" }); }
        }

        // Cien tabletas: la proporción actual en ámbar; las que ya estaban en el punto de partida, sólidas.
        function formaCien(svg, g) {
            var orden = g.barras.slice().sort(function (a, b) { return (a.anio || 0) - (b.anio || 0); });
            var ini = orden[0], fin = orden[orden.length - 1];
            var vFin = Math.round(+fin.valor || 0), vIni = Math.round(+ini.valor || 0);
            cifra(svg, 52, 196, fin.texto || (vFin + "%"), true, 150);
            partir(g.titulo, 22).slice(0, 4).forEach(function (l, i) {
                txt(svg, 56, 244 + i * 31, l, F_SANS + "font-size:26px;font-weight:500;fill:" + C.bone + ";fill-opacity:.9;");
            });
            var P = 36, X = 418, Y = 52;
            for (var k = 0; k < 100; k++) {
                var cx = X + (k % 10) * P + 15, cy = Y + Math.floor(k / 10) * P + 15;
                var antes = k < vIni, nueva = !antes && k < vFin;
                var tab = s("g", antes || nueva ? { "data-a": "pop", "data-i": String(k) } : {});
                tab.appendChild(s("circle", { cx: cx, cy: cy, r: 13, fill: antes ? C.amber : (nueva ? C.amber : C.bone), "fill-opacity": antes ? "1" : (nueva ? "0.42" : "0.07"), stroke: nueva ? C.amber : C.bone, "stroke-opacity": nueva ? "1" : "0.14", "stroke-width": "2" }));
                tab.appendChild(s("line", { x1: cx - 8, x2: cx + 8, y1: cy, y2: cy, stroke: C.ink, "stroke-opacity": antes || nueva ? "0.45" : "0.25", "stroke-width": "2" }));
                svg.appendChild(tab);
            }
            var ly = 404;
            svg.appendChild(s("circle", { cx: 66, cy: ly - 7, r: 9, fill: C.amber }));
            txt(svg, 84, ly, "ya estaban en " + Math.floor(ini.anio) + " (" + (ini.texto || vIni + "%") + ")", F_SANS + "font-size:20px;fill:" + C.bone + ";fill-opacity:.85;");
            svg.appendChild(s("circle", { cx: 66, cy: ly + 25, r: 9, fill: C.amber, "fill-opacity": "0.42", stroke: C.amber, "stroke-width": "2" }));
            txt(svg, 84, ly + 32, "se sumaron después", F_SANS + "font-size:20px;fill:" + C.bone + ";fill-opacity:.85;");
            fuente8(svg, g);
        }
        var FORMAS8 = { blister: formaBlister, capsulas: formaCapsulas, jeringas: formaJeringas, viales: formaViales, cien: formaCien };

        var nPortada = 0;
        function portadaGrafica(g) {
            nPortada += 1;
            var id = "obs-rayas-" + nPortada;
            var W = 800, H = 500, X0 = 56, X1 = 530;
            var svg = s("svg", { viewBox: "0 0 " + W + " " + H, role: "img", preserveAspectRatio: "xMidYMid meet" });
            var barrasTxt = g.barras.map(function (b) { return b.etiqueta + " " + (b.texto || b.valor); }).join(", ");
            svg.appendChild(s("title", {}, (g.titulo ? g.titulo + ": " : "") + barrasTxt));
            var defs = s("defs");
            var pat = s("pattern", { id: id, width: "10", height: "10", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
            pat.appendChild(s("rect", { width: "10", height: "10", fill: "#C98A3B", "fill-opacity": "0.35" }));
            pat.appendChild(s("rect", { width: "4", height: "10", fill: "#C98A3B" }));
            defs.appendChild(pat);
            svg.appendChild(defs);
            svg.appendChild(s("rect", { width: W, height: H, fill: "#0B1420" }));
            if (FORMAS8[g.forma]) { FORMAS8[g.forma](svg, g, id); return svg; }
            if (g.titulo) { svg.appendChild(s("text", { x: X0, y: 100, "class": "pg-titulo" }, g.titulo)); }
            // ILIK v7 · Cada pieza puede pedir una forma distinta ("forma" en articulos.js); sin "forma", barras.
            if (g.forma === "unidades") { formaUnidades(svg, g, X0); if (g.fuente) { svg.appendChild(s("text", { x: X0, y: H - 40, "class": "pg-fuente" }, "Fuente: " + g.fuente)); } return svg; }
            if (g.forma === "tendencia") { formaTendencia(svg, g, X0, id); if (g.fuente) { svg.appendChild(s("text", { x: X0, y: H - 40, "class": "pg-fuente" }, "Fuente: " + g.fuente)); } return svg; }
            if (g.forma === "rango") { formaRango(svg, g, X0, id); if (g.fuente) { svg.appendChild(s("text", { x: X0, y: H - 40, "class": "pg-fuente" }, "Fuente: " + g.fuente)); } return svg; }
            var max = Math.max.apply(null, g.barras.map(function (b) { return +b.valor || 0; })) || 1;
            var n = Math.min(g.barras.length, 4);
            var alto = n > 2 ? 44 : 68, paso = n > 2 ? 86 : 130, y0 = n > 2 ? 160 : 186;
            g.barras.slice(0, 4).forEach(function (b, i) {
                var y = y0 + i * paso;
                var ancho = function (v) { return Math.max(4, (X1 - X0) * (v / max)); };
                svg.appendChild(s("text", { x: X0, y: y - 12, "class": "pg-etiqueta" }, b.etiqueta));
                var color = b.destacar ? "#C98A3B" : "#C9DAD5";
                if (b.desde != null && +b.desde < +b.valor) {
                    svg.appendChild(s("rect", { x: X0, y: y, width: ancho(+b.desde), height: alto, fill: color, rx: 3 }));
                    svg.appendChild(s("rect", { x: X0 + ancho(+b.desde), y: y, width: ancho(+b.valor) - ancho(+b.desde), height: alto, fill: "url(#" + id + ")" }));
                } else {
                    svg.appendChild(s("rect", { x: X0, y: y, width: ancho(+b.valor), height: alto, fill: color, "fill-opacity": b.destacar ? "1" : "0.75", rx: 3 }));
                }
                svg.appendChild(s("text", { x: X0 + ancho(+b.valor) + 18, y: y + alto / 2 + 14, "class": "pg-valor" + (b.destacar ? " pg-valor--destacado" : "") }, b.texto || (b.valor + (g.unidad || ""))));
            });
            if (g.fuente) { svg.appendChild(s("text", { x: X0, y: H - 40, "class": "pg-fuente" }, "Fuente: " + g.fuente)); }
            return svg;
        }

        // ILIK v5 · Vista previa local: al abrir los archivos desde la computadora (file://),
        // las ligas a carpetas no abren su index.html. Se completan solo en ese caso; en el sitio publicado no cambia nada.
        function completarLigasLocales(raiz) {
            if (window.location.protocol !== "file:") { return; }
            (raiz || document).querySelectorAll("a[href]").forEach(function (a) {
                var h = a.getAttribute("href");
                if (!h || /^(https?:|mailto:|tel:|#)/i.test(h)) { return; }
                var partes = h.split("#");
                var ruta = partes[0].split("?");
                if (ruta[0] === "" || /\/$/.test(ruta[0]) || ruta[0] === "." || ruta[0] === "..") {
                    ruta[0] = (ruta[0] === "" ? "" : ruta[0].replace(/\/?$/, "/")) + (ruta[0] === "" ? "" : "index.html");
                    a.setAttribute("href", ruta.join("?") + (partes.length > 1 ? "#" + partes[1] : ""));
                }
            });
        }

        function mostrar(contenedor, piezas, ubicacion, destacarPrimera) {
            var grid = contenedor.querySelector("[data-obs-grid]") || contenedor;
            grid.textContent = "";
            piezas.forEach(function (a, i) {
                var variante = "";
                if (destacarPrimera && i === 0) { variante = "destacada"; }
                else if (piezas.length === 1) { variante = "unica"; }
                grid.appendChild(tarjeta(a, variante, ubicacion));
            });
            grid.setAttribute("data-count", String(piezas.length));
            var envoltura = contenedor.closest("[data-obs-wrap]") || contenedor;
            envoltura.hidden = piezas.length === 0;
            var vacio = document.querySelector("[data-obs-vacio]");
            if (vacio) { vacio.hidden = piezas.length !== 0; }
        }

        document.querySelectorAll("[data-obs]").forEach(function (c) {
            var modo = c.getAttribute("data-obs");
            if (modo === "inicio") {
                mostrar(c, visibles.slice(0, 3), "inicio", false);
            } else if (modo === "archivo") {
                mostrar(c, visibles, "archivo", visibles.length > 1);
            } else if (modo === "relacionados") {
                var actual = c.getAttribute("data-actual");
                mostrar(c, visibles.filter(function (a) { return a.slug !== actual; }).slice(0, 3), "relacionados", false);
            }
        });

        // ILIK v5 · Gráfica de portada dentro de la página de una pieza: <div data-obs-grafica="slug"></div>
        document.querySelectorAll("[data-obs-grafica]").forEach(function (c) {
            var slug = c.getAttribute("data-obs-grafica");
            var pieza = lista.filter(function (a) { return a && a.slug === slug; })[0];
            if (pieza && pieza.grafica && Array.isArray(pieza.grafica.barras)) {
                c.classList.add("obs-card__media--grafica");
                c.appendChild(portadaGrafica(pieza.grafica));
                // ILIK v8 · En la apertura del artículo, el objeto se llena una sola vez al cargar
                if (c.closest && c.closest(".art-hero")) {
                    c.querySelectorAll("[data-a]").forEach(function (n) { n.style.setProperty("--i", n.getAttribute("data-i") || "0"); });
                    c.classList.add("obs-animar");
                }
            }
        });

        completarLigasLocales();

        if (verBorradores) {
            var aviso = el("div", "obs-preview-banner", "Vista de revisión: se muestran borradores y piezas programadas. El público no las ve.");
            aviso.setAttribute("role", "status");
            document.body.appendChild(aviso);
            // Mantener la vista de revisión al navegar entre páginas del Observatorio
            document.querySelectorAll("a[href*='observatorio/']").forEach(function (a) {
                if (a.href.indexOf("vista=borradores") === -1) {
                    a.href += (a.href.indexOf("?") === -1 ? "?" : "&") + "vista=borradores";
                }
            });
        }
    } catch (e) { /* sin efecto visible: los bloques quedan ocultos */ }
})();
