<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:ital,wght@0,300;0,600;1,300&family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">  

    <link rel="stylesheet" href="css/reset.css" />
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/medium.css" />
    <link rel="stylesheet" href="css/small.css" />
    <title>Indigo Waves And Other Stories</title>
</head>

<body>

    <section class="hiddenBookIndex" id="bookIndex">
        <?php include 'book/toc.php';?>
    </section>
    <!--end bookIndex-->

    <section id=footNotesAndAudiobook>
        <?php include 'book/footnotes.php';?>
    </section><!--end citationsAndAudiobook-->

    <section id="bookContent">
        <section id="mainBookText">
            <?php include 'book/book.php';?>
        </section> <!--end mainBookText-->
    </section> <!--end bookContent-->

    <footer>
        <nav id="bookTools">
            <button id="buttonIndex" data-tooltip="Table of contents">☰</button>
            <button id="buttonFootNotes" data-tooltip="Footnotes">[ ]</button>
            <button id="bookColorButton" data-tooltip="Change color scheme">●<sub id="bookColorIndicator">1</sub></button>
            <button id="bookFontButton" data-tooltip="Change font scheme">T<sub id="bookFontIndicator">1</sub></button>
        </nav>
    </footer>

</body>
</html>
<script type="text/javascript" src="script.js"></script>