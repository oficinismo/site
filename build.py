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
        html_body = markdown.markdown(body.strip())
        return meta, html_body
    else:
        return {}, markdown.markdown(content)

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

            meta["body"] = body
            items.append(meta)

    # Ordenar por fecha descendente
    items.sort(key=lambda x: x.get("fecha_dt"), reverse=True)

    html_items = []
    for meta in items:
        titulo = meta.get("titulo", "")
        autor = meta.get("autor", "")
        editorial = meta.get("editorial", "")
        anio = meta.get("anio", "")
        fecha = meta.get("fecha", "")
        imagen = meta.get("imagen", "")
        paginas = meta.get("paginas", "")

        card_html = f"""
        <div class="comic-card"
             data-titulo="{titulo}"
             data-autor="{autor}"
             data-editorial="{editorial}"
             data-anio="{anio}"
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
      <title>Catálogo de Cómics</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
    <header class="site-header">
        <img src="catalogo/images/header.jpg" alt="Header del catálogo">
        <h1>Catálogo de Cómics</h1>
    </header>
    <nav>
      <a href="index.html">⬅ Volver a la portada</a>
    </nav>
      <div class="catalogo">
        {''.join(html_items)}
      </div>
      <script src="script.js"></script>
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

            meta["body"] = body
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
      <img src="catalogo/images/header.jpg" alt="Header del catálogo">
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
    <header class="site-header">
        <img src="blog/images/header.jpg" alt="Header del blog">
        <h1>Blog</h1>
    </header>
    <nav>
      <a href="index.html">⬅ Volver a la portada</a>
    </nav>
      <div class="blog">
        {''.join(html_posts)}
      </div>
    </body>
    </html>
    """

    with open(BLOG_OUT, "w", encoding="utf-8") as f:
        f.write(html_output)

if __name__ == "__main__":
    build_catalogo()
    build_blog()
