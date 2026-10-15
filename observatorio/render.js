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
        }).sort(function (x, y) { return y._fecha - x._fecha; });

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
            if (g.titulo) { svg.appendChild(s("text", { x: X0, y: 100, "class": "pg-titulo" }, g.titulo)); }
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
