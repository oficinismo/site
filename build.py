import os
import yaml
import markdown
from datetime import datetime

CATALOGO_DIR = "catalogo"
BLOG_DIR = "blog"

CATALOGO_OUT = "catalogo.html"
BLOG_OUT = "blog.html"

def parse_markdown(file_path):
    """
    Extrae el front-matter YAML y el contenido Markdown de un archivo .md
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if content.startswith("---"):
        _, fm, body = content.split("---", 2)
        meta = yaml.safe_load(fm)
        return meta, body.strip()
    else:
        return {}, content

def build_catalogo():
    items = []
    for filename in os.listdir(CATALOGO_DIR):
        if filename.endswith(".md"):
            filepath = os.path.join(CATALOGO_DIR, filename)
            meta, body = parse_markdown(filepath)

            # Parsear fecha dd/mm/aaaa
            fecha_str = meta.get("fecha", "")
            try:
                meta["fecha_dt"] = datetime.strptime(fecha_str, "%d/%m/%Y")
            except:
                meta["fecha_dt"] = datetime.min

            # Convertir Markdown a HTML
            body_html = markdown.markdown(body, extensions=["extra"], output_format="html5")
            meta["body"] = body_html
            items.append(meta)

    # Ordenar por fecha descendente
    items.sort(key=lambda x: x.get("fecha_dt"))

    html_items = []
    for meta in items:
        titulo = meta.get("titulo", "")
        autor = meta.get("autor", "")
        fecha = meta.get("fecha", "")
        imagen = meta.get("imagen", "")
        paginas = meta.get("paginas", "")

        card_html = f"""
        <div class="comic-card"
             data-titulo="{titulo}"
             data-autor="{autor}"
             data-fecha="{fecha}"
             data-paginas="{paginas}">
          <img src="catalogo/images/{imagen}" alt="{titulo}">
          <h3>{titulo}</h3>
          <p><em>{fecha}</em></p>
        </div>
        """
        html_items.append(card_html)

    html_output = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="description" content="Catálogo de cómics de Oficinismo.">
      <meta property="og:title" content="Catálogo de Cómics">
      <meta property="og:description" content="Catálogo de cómics de Oficinismo.">
      <meta property="og:url" content="https://oficinismo.cl/catalogo">
      <meta property="og:image" content="https://oficinismo.cl/preview.jpg">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Catálogo de Cómics">
      <meta name="twitter:description" content="Catálogo de cómics de Oficinismo.">
      <meta name="twitter:image" content="https://oficinismo.cl/img/preview.jpg">
      <title>Catálogo de Cómics</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
    <!-- Header -->
    <header class="site-header">
        <img src="catalogo/images/header.jpg" alt="Header del catálogo">
        <h1>Catálogo de Cómics</h1>
    </header>
    <!-- Navegación -->
    <nav class="nav-links">
      <a href="index.html">⬅ Volver a la portada</a>
      <a href="blog.html">Ir al blog ➡</a>
    </nav>
      <div class="catalogo">
        {''.join(html_items)}
      </div>
    <!-- Footer -->
      <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; 2026 Oficinismo - Todos los derechos reservados</p>
      </div>
    </footer>
    </body>
    </html>
    """

    with open(CATALOGO_OUT, "w", encoding="utf-8") as f:
        f.write(html_output)

def build_blog():
    posts = []
    for filename in os.listdir(BLOG_DIR):
        if filename.endswith(".md"):
            filepath = os.path.join(BLOG_DIR, filename)
            meta, body = parse_markdown(filepath)

            fecha_str = meta.get("fecha", "")
            try:
                meta["fecha_dt"] = datetime.strptime(fecha_str, "%d/%m/%Y")
            except:
                meta["fecha_dt"] = datetime.min

            # Ajustar rutas si es necesario
            body = body.replace('src="images/', 'src="blog/images/')

            # Convertir Markdown a HTML
            body_html = markdown.markdown(body, extensions=["extra"], output_format="html5")
            meta["body"] = body_html

            posts.append(meta)

    posts.sort(key=lambda x: x.get("fecha_dt"), reverse=True)

    html_posts = []
    for meta in posts:
        titulo = meta.get("titulo", "")
        autor = meta.get("autor", "")
        fecha = meta.get("fecha", "")
        imagen = meta.get("imagen", "")

        post_html = f"""
        <article class="blog-post">
          <h2>{titulo}</h2>
          <p><em>{fecha}</em> — {autor}</p>
          {'<img src="blog/images/' + imagen + '" alt="' + titulo + '">' if imagen else ''}
          <div class="post-body">{meta.get("body","")}</div>
        </article>
        """
        html_posts.append(post_html)

    html_output = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Blog</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
    <header class="site-header">
        <img src="catalogo/images/header.jpg" alt="Header del blog">
        <h1>Blog</h1>
    </header>
    <nav class="nav-links">
      <a href="index.html">⬅ Volver a la portada</a>
      <a href="catalogo.html">Ir al catálogo ➡</a>
    </nav>
      <div class="blog">
        {''.join(html_posts)}
      </div>
     <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; 2026 Oficinismo - Todos los derechos reservados</p>
      </div>
     </footer>
    </body>
    </html>
    """

    with open(BLOG_OUT, "w", encoding="utf-8") as f:
        f.write(html_output)

if __name__ == "__main__":
    build_catalogo()
    build_blog()
