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
    
    $consult = "SELECT * from test_signins where accepted=0";
    $result = mysqli_query($link, $consult) or die("Error comparando fechas");
    $fecha_actual = date("d-m-Y H:i:s", time());
    $fecha_actual = strtotime('+1 hour', strtotime($fecha_actual));
    while($row = mysqli_fetch_array($result)) {
      $fecha_limite = strtotime($row['limit_date']);
      $tipo = utf8_decode($row['signin_type']);
      $equipo = $row['buyer_team'];
      $origen = $row['first_team'];
      $jugador = $row['player'];
      $id = $row['id'];
      $amount = $row['amount'];
      $media = 1;
      if($fecha_actual > $fecha_limite && (strcmp($tipo, "A") == 0 || strcmp($tipo, "L") == 0)) {
        $consult5 = "SELECT * from test_teams";
        $result5 = mysqli_query($link, $consult5) or die("Error consultando equipo");
        $resolver = true;
        while($row2 = mysqli_fetch_array($result5)) {
            if($row2['id'] == $equipo && strcmp($tipo, "A") == 0 && $row2['auctions_available'] == 0) {
                $resolver = false;
            }
        }
        $consult15 = "SELECT * from test_players";
        $result15 = mysqli_query($link, $consult15) or die("Error consultando jugadores");
        while($row3 = mysqli_fetch_array($result15)) {
            if($row3['id'] == $jugador) {
                $media = $row3['overage'];
            }
        }
        if($resolver == true) {
            $consult2 = "UPDATE test_signins SET accepted=1 where id=". $id;
            $result2 = mysqli_query($link, $consult2) or die("Error cerrando subasta");
            $consult3 = "UPDATE test_players SET team_id=" . $equipo . ", salary=overage/100, emblem=0, buyed_this_market=1, untouchable=0 where id=" . $jugador;
            $result3 = mysqli_query($link, $consult3) or die("Error asignando jugador");

            if(strcmp($tipo, "L") == 0 && $equipo == 0) {
              if($media < 85 && $origen != 0) {
                $consult19 = "UPDATE test_teams SET budget=budget+" . ($media/100) . " where id=" . $origen;
                $result19 = mysqli_query($link, $consult19) or die("Error asignando presupuesto2");
              } else if ($media >= 85 && $origen != 0) { 
                $consult20 = "UPDATE test_teams SET budget=budget+" . $media . " where id=" . $origen;
                $result20 = mysqli_query($link, $consult20) or die("Error asignando presupuesto2");
              }
            } else if(strcmp($tipo, "L") == 0 && $equipo != 0){
              if($origen != 0) {
                $consult8 = "UPDATE test_teams SET budget=budget+" . ($amount/2) . " where id=" . $origen;
                $result8 = mysqli_query($link, $consult8) or die("Error asignando presupuesto2");
              }
              $consult18 = "UPDATE test_teams SET budget=budget-" . $amount . " where id=" . $equipo;
              $result18 = mysqli_query($link, $consult18) or die("Error asignando presupuesto3");
            } else {
              $consult4 = "UPDATE test_teams SET auctions_available=auctions_available-1, budget=budget-" . $amount . " where id=" . $equipo;
              $result4 = mysqli_query($link, $consult4) or die("Error asignando presupuesto");
            }
            insertLog($link, $tipo, $equipo, $jugador, $amount, $id);
        }else {
            $consult6 = "DELETE from test_signins where id=". $id;
            $result6 = mysqli_query($link, $consult6) or die("Error borrando subasta");
            $consult7 = "DELETE from test_players where id=". $jugador;
            $result7 = mysqli_query($link, $consult7) or die("Error borrando jugador");
            insertDeleteLog($link, $tipo, $equipo, $jugador, $id);
        }
      }
    }

    function insertLog($con, $tipo, $equipo, $jugador, $amount, $id) {
      $query="INSERT INTO test_log (user, type, log_information) VALUES (0, 'CA', 'Subasta ".$tipo." cerrada por " . $jugador . ": vendido al " . $equipo . " por " . $amount . "M€ ID " . $id . "')";
      $resultado=mysqli_query($con, $query) or die("Error insertando log");
    }
    
    function insertDeleteLog($con, $tipo, $equipo, $jugador, $id) {
      $query="INSERT INTO test_log (user, type, log_information) VALUES (0, 'SB', 'Subasta ".$tipo." borrada por " . $jugador . ": ganada por " . $equipo . " ID " . $id . "')";
      $resultado=mysqli_query($con, $query) or die("Error insertando log2");
    }

?>