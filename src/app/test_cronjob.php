<?php
  define('DEBUG_AUTH', false);
  define("BASE_DIR", "../docs/php/");
  //header('Content-Type: application/json;charset=utf-8');
  ini_set('upload_max_filesize', '10M');
  ini_set('post_max_size', '10M');
  ini_set('max_execution_time', 300);
  //session_start();
	$db_host="localhost";
	$db_name="u832717839_mugre";
	$db_user="u832717839_mugre";//"root";//
	$db_pass="(CopaMugreFIFA2019)";//"";//

	$link=mysqli_connect($db_host, $db_user, $db_pass) or die ("Error conectando a la base de datos - " . mysql_error());
    mysqli_select_db($link, $db_name) or die("Error seleccionando la base de datos.");

    $query="UPDATE test_constants SET market_opened=1, auctions_opened=1";
    $resultado=mysqli_query($link, $query) or die("Error abriendo mercado");
    
    /*$query="UPDATE test_constants SET market_opened=1, forced_signins_opened=1, auctions_opened=1";
    $resultado=mysqli_query($link, $query) or die("Error abriendo mercado");

    $query2="UPDATE test_constants SET market_opened=0";
    $resultado2=mysqli_query($link, $query2) or die("Error cerrando mercado");

    $query3="UPDATE test_constants SET forced_signins_opened=0";
    $resultado3=mysqli_query($link, $query3) or die("Error cerrando clausulas");

    $query4="UPDATE test_constants SET auctions_opened=0";
    $resultado4=mysqli_query($link, $query4) or die("Error cerrando subastas");

    $query5="UPDATE test_partners SET partner=0";
    $resultado5=mysqli_query($link, $query5) or die("Error reiniciando patrocinadores");

    $query6="UPDATE test_standings SET round=0, points=0, won=0, draw=0, lost=0, goals_for=0, goals_against=0";
    $resultado6=mysqli_query($link, $query6) or die("Error reiniciando clasificaciones");*/
    
    mysql_close($link);

?>