from django.http import HttpResponse

def formulario(request):
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Livro</title>
</head>
<body>
    <form action="">
        <label for="bookname">Nome do Livro:</label><br>
        <input type="text" id="bookname" name="bookname"><br>

        <label for="authorname">Nome do Autor:</label><br>
        <input type="text" id="authorname" name="authorname"><br>

        <label for="editora">Editora:</label><br>
        <input type="text" id="editora" name="editora"><br>

        <label for="generica1">Generica1:</label><br>
        <input type="text" id="generica1" name="generica1"><br>

        <label for="generica2">Generica2:</label><br>
        <input type="text" id="generica2" name="generica2"><br>

        <label for="generica3">Generica3:</label><br>
        <input type="text" id="generica3" name="generica3"><br>

        <label for="generica4">Generica4:</label><br>
        <input type="text" id="generica4" name="generica4"><br>

        <button onclick="alert('clicou no botao')">CLIQUE AQUI</button>
    </form>
    
</body>
</html>"""
    return HttpResponse(html)