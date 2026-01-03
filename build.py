import os
import yaml
import markdown

IMAGES_DIR = "images"      # Carpeta de portadas en jpg
PDF_DIR = "pdfs"           # Carpeta de PDFs
CATALOGO_DIR = "catalogo"  # Carpeta de MDs
OUTPUT_FILE = "index.html"

def leer_archivo(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Separar front-matter YAML y cuerpo
    if content.startswith("---"):
        _, fm, body = content.split("---", 2)
        meta = yaml.safe_load(fm)
        return meta, body.strip()
    return {}, content

def generar_html(items):
    html_items = []
    for meta, body in items:
        desc_html = markdown.markdown(body)
        imagen = meta.get("imagen", "")
        img_path = f"{IMAGES_DIR}/{imagen}" if imagen else ""
        pdf = meta.get("pdf", "")
        pdf_path = f"{PDF_DIR}/{pdf}" if pdf else ""
        html_items.append(f"""
        <div class="comic-card"
             data-titulo="{meta.get('titulo','')}"
             data-autor="{meta.get('autor','')}"
             data-editorial="{meta.get('editorial','')}"
             data-anio="{meta.get('anio','')}"
             data-precio="{meta.get('precio','')}"
             data-pdf="{pdf_path}">
            <img src="{img_path}" alt="{meta.get('titulo','')}">
            <h3>{meta.get('titulo','')}</h3>
            <p><strong>Autor:</strong> {meta.get('autor','')}</p>
            <p><strong>Editorial:</strong> {meta.get('editorial','')}</p>
            <p><strong>Año:</strong> {meta.get('anio','')}</p>
            <p><strong>Precio:</strong> CLP {meta.get('precio','')}</p>
            <div class="descripcion" style="display:none;">{desc_html}</div>
        </div>
        """)
    return "\n".join(html_items)

def main():
    items = []
    for fname in os.listdir(CATALOGO_DIR):
        if fname.endswith(".md"):
            meta, body = leer_archivo(os.path.join(CATALOGO_DIR, fname))
            items.append((meta, body))

    contenido = generar_html(items)

    html = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Catálogo de Cómics</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="site-header">
        <img src="images/header.jpg" alt="Header del catálogo">
        <h1>Catálogo de Cómics</h1>
    </header>

    <div class="catalogo">
        {contenido}
    </div>

    <!-- Modal -->
    <div id="comic-modal" class="comic-modal">
        <div class="comic-modal-content">
            <span id="close-comic" class="close">&times;</span>
            <div id="comic-modal-body" class="modal-info"></div>
            <div class="modal-pdf">
                <iframe id="comic-pdf"></iframe>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            const cards = document.querySelectorAll('.comic-card');
            const modal = document.getElementById('comic-modal');
            const modalBody = document.getElementById('comic-modal-body');
            const pdfFrame = document.getElementById('comic-pdf');
            const closeBtn = document.getElementById('close-comic');

            cards.forEach(card => {{
                card.addEventListener('click', () => {{
                    const titulo = card.getAttribute('data-titulo');
                    const autor = card.getAttribute('data-autor');
                    const editorial = card.getAttribute('data-editorial');
                    const anio = card.getAttribute('data-anio');
                    const precio = card.getAttribute('data-precio');
                    const descripcion = card.querySelector('.descripcion')?.innerHTML || '';
                    const pdf = card.getAttribute('data-pdf');

                    modalBody.innerHTML = `
                        <h2>${{titulo}}</h2>
                        <p><strong>Autor:</strong> ${{autor}}</p>
                        <p><strong>Editorial:</strong> ${{editorial}}</p>
                        <p><strong>Año:</strong> ${{anio}}</p>
                        <p><strong>Precio:</strong> CLP ${{precio}}</p>
                        <div class="descripcion">${{descripcion}}</div>
                    `;
                    pdfFrame.src = pdf;
                    modal.style.display = 'flex';
                }});
            }});

            closeBtn.addEventListener('click', () => {{
                modal.style.display = 'none';
                pdfFrame.src = "";
            }});

            window.addEventListener('click', (event) => {{
                if (event.target === modal) {{
                    modal.style.display = 'none';
                    pdfFrame.src = "";
                }}
            }});
        }});
    </script>
</body>
</html>
"""

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html)

if __name__ == "__main__":
    main()
