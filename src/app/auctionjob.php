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
    
    $consult = "SELECT * from signins where accepted=0";
    $result = mysqli_query($link, $consult) or die("Error comparando fechas");
    $fecha_actual = date("d-m-Y H:i:s", time());
    $fecha_actual = strtotime('+1 hour', strtotime($fecha_actual));
    while($row = mysqli_fetch_array($result)) {
      $fecha_limite = strtotime($row['limit_date']);
      $tipo = utf8_decode($row['signin_type']);
      $equipo = $row['buyer_team'];
      $jugador = $row['player'];
      $id = $row['id'];
      $amount = $row['amount'];
      if($fecha_actual > $fecha_limite && strcmp($tipo, "A") == 0) {
        $consult5 = "SELECT * from teams";
        $result5 = mysqli_query($link, $consult5) or die("Error consultando equipo");
        $resolver = true;
        while($row2 = mysqli_fetch_array($result5)) {
            if($row2['id'] == $equipo && $row2['auctions_available'] == 0) {
                $resolver = false;
            }
        }
        if($resolver == true) {
            $consult2 = "UPDATE signins SET accepted=1 where id=". $id;
            $result2 = mysqli_query($link, $consult2) or die("Error cerrando subasta");
            $consult3 = "UPDATE players SET team_id=" . $equipo . " where id=" . $jugador;
            $result3 = mysqli_query($link, $consult3) or die("Error asignando jugador");
            $consult4 = "UPDATE teams SET auctions_available=auctions_available-1, budget=budget-" . $amount . " where id=" . $equipo;
            $result4 = mysqli_query($link, $consult4) or die("Error asignando presupuesto");
            insertLog($link, $equipo, $jugador, $amount, $id);
        }else {
            $consult6 = "DELETE from signins where id=". $id;
            $result6 = mysqli_query($link, $consult6) or die("Error borrando subasta");
            $consult7 = "DELETE from players where id=". $jugador;
            $result7 = mysqli_query($link, $consult7) or die("Error borrando jugador");
        }
      }
    }

    function insertLog($con, $equipo, $jugador, $amount, $id)
    {
      $data = array();
      $query="INSERT INTO log (user, type, log_information) VALUES (0, 'CA', 'Subasta cerrada por " . $jugador . ": vendido al " . $equipo . " por " . $amount . "M€ (ID " . $id . ")";
      $resultado=mysqli_query($con, $query) or die("Error insertando log");
    }

?>