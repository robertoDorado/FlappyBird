<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/flappy.css">
    <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet">
</head>

<body class="conteudo">

    <div>
        <button style="display:none;" id="stopButton4">Dente de Serra</button>
    </div>

    <h1>Flappy Bird</h1>
    <div wm-flappy>
        <div class="sol"></div>
        <div class="terrinha">
            <div class="graminha"></div>
        </div>
    </div>

    <div class="main">

        <h2>Instruções</h2>
        <ul>
            <li>Pressione para cima para flutuar</li>
            <li>Pressione F5 para começar e para reiniciar</li>
            <li>Tente bater o seu próprio record</li>
        </ul>

    </div>
    <script src="js/sounds.js"></script>
    <script src="js/scripts.js?<?= date('YmdHis') ?>"></script>
</body>

</html>