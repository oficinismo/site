import os
import yaml
import markdown

CATALOGO_DIR = "catalogo"
OUTPUT_FILE = "index.html"

def parse_markdown(file_path):
    """
    Extrae el front-matter YAML y el contenido Markdown de un archivo .md
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if content.startswith("---"):
        _, fm, body = content.split("---", 2)
        meta = yaml.safe_load(fm)
        html_body = markdown.markdown(body.strip())
        return meta, html_body
    else:
        return {}, markdown.markdown(content)

def build_index():
    html_items = []

    for filename in os.listdir(CATALOGO_DIR):
        if filename.endswith(".md"):
            filepath = os.path.join(CATALOGO_DIR, filename)
            meta, body = parse_markdown(filepath)

            titulo = meta.get("titulo", "")
            autor = meta.get("autor", "")
            editorial = meta.get("editorial", "")
            anio = meta.get("anio", "")
            precio = meta.get("precio", "")
            imagen = meta.get("imagen", "")       # portada en images/
            paginas = meta.get("paginas", "")     # subcarpeta en images/

            card_html = f"""
            <div class="comic-card"
                 data-titulo="{titulo}"
                 data-autor="{autor}"
                 data-editorial="{editorial}"
                 data-anio="{anio}"
                 data-precio="{precio}"
                 data-paginas="{paginas}">
              <img src="images/{imagen}" alt="{titulo}">
              <h3>{titulo}</h3>
            </div>
            """
            html_items.append(card_html)

    # Plantilla completa con modal incluido
    html_output = f"""
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
        {''.join(html_items)}
      </div>

      <!-- Modal generado por build.py -->
      <div id="modal" class="modal">
        <div class="modal-content">
          <span id="close">&times;</span>
          <div id="modal-body"></div>
        </div>
      </div>

      <script src="script.js"></script>
    </body>
    </html>
    """

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html_output)

if __name__ == "__main__":
    build_index()
