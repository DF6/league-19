
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
	$params = json_decode(file_get_contents("php://input"));
	
  if(isset($params->type) && !empty($params->type))
  {
    $type=$params->type;
    if(strcmp($type, "recDat") == 0)
    {
      $datatype=$params->dataType;
      switch ($datatype) {
        case "U":
          obtainUsers($link);
            break;
        case "T":
          obtainTeams($link);
          break;
        case "M":
          obtainMatches($link);
          break;
        case "A":
          obtainActions($link);
          break;
        case "P":
          obtainPlayers($link);
          break;
        case "S":
          obtainSignins($link);
          break;
        case "PCS":
          obtainPlayerChangeSignins($link);
          break;
        case "TO":
          obtainTournaments($link);
          break;
        case "ST":
          obtainStandings($link);
          break;
        case "RT":
          obtainTeamRequests($link);
          break;
        case "CAL":
          obtainCalendar($link);
          break;
        case "CONSTANTS":
          obtainConstants($link);
          break;
        case "ORDER":
          obtainTeamOrder($link);
          break;
        default:
          invalidRequest();
     }
   }else{
    switch($type)
    {
       case "login":
          validateLogin($link, $params);
            break;
       case "solEqu":
          requestTeam($link, $params);
            break;
       case "givTea":
          giveTeamToRequester($link, $params);
            break;
       case "disPla":
          discardPlayer($link, $params);
            break;
       case "guaSal":
          saveSalary($link, $params);
            break;
       case "regUsu":
          saveUser($link, $params);
            break;
       case "updUsu":
          updateUser($link, $params);
            break;
       case "claJug":
          forceSign($link, $params);
            break;
       case "hacOfe":
          doOffer($link, $params);
            break;
       case "conLib":
          signWildCard($link, $params);
            break;
       case "aceOfe":
          acceptOffer($link, $params);
            break;
       case "recOfe":
          rejectOffer($link, $params);
            break;
       case "pujSub":
          raiseAuction($link, $params);
            break;
       case "ofeJug":
          offerPlayer($link, $params);
            break;
       case "traJug":
          transferPlayerOffered($link, $params);
            break;
       case "nueSub":
          newAuction($link, $params);
            break;
       case "chaSal":
          changeSalaries($link, $params);
            break;
       case "insMat":
          insertMatch($link, $params);
            break;
       case "insTou":
          insertTournament($link, $params);
            break;
       case "setRes":
          setMatchResult($link, $params);
            break;
       case "insAct":
          insertAction($link, $params);
            break;
       case "updSta":
          updateStandings($link, $params);
            break;
       case "genOrd":
          createOrder($link, $params);
          break;
       case "actPos":
          setActualPosition($link, $params);
          break;
        case "setOrd":
          setNewOrder($link, $params);
          break;
       case "log":
          insertLog($link, $params);
            break;
       case "newPla":
          insertNewPlayer($link, $params);
            break;
        default:
          invalidRequest();
    }
   }
  }else{
    invalidRequest();
  }

  function requestTeam($con, $params)
  {
    $data = array();
    $query="INSERT INTO team_requests (user) values (".$params->user.")";
    $resultado=mysqli_query($con, $query) or die("Error solicitando equipo");
    $data['success'] = true;
    $data['message'] = "Equipo solicitado";
    echo json_encode($data);
    exit;
  }

  function setNewOrder($con, $params)
  {
    $data = array();
      $query="UPDATE team_order SET team='" . $params->team . "'' where user=" . $params->user;
      $resultado=mysqli_query($con, $query) or die("Error asignando equipo");
      $data['success'] = true;
      $data['message'] = "Equipo otorgado";
      echo json_encode($data);
      exit;
  }

  function giveTeamToRequester($con, $params)
  {
    $data = array();
    $query="UPDATE users SET team_id=" . $params->team . " where id=" . $params->user;
    $resultado=mysqli_query($con, $query) or die("Error asignando equipo");
    $query2="DELETE FROM team_requests where user=" . $params->user;
    $resultado2=mysqli_query($con, $query2) or die ("Error borrando solicitudes");
    $data['success'] = true;
    $data['message'] = "Equipo otorgado";
    echo json_encode($data);
    exit;
  }

  function discardPlayer($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=0, salary=0.1 where id=" . $params->player;
    $resultado=mysqli_query($con, $query) or die("Error liberando jugador");
    $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".$params->player.", 0, 0, 'D', ".$params->market.", true)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    $data['success'] = true;
    $data['message'] = "Jugador liberado";
    echo json_encode($data);
    exit;
  }

  function saveSalary($con, $params)
  {
    $data = array();
    $query="UPDATE players SET salary=".$params->salary." where id=".$params->player."";
    $resultado=mysqli_query($con, $query) or die("Error actualizando salario");
    $data['success'] = true;
    $data['message'] = "Salario actualizado";
    echo json_encode($data);
    exit;
  }

  function forceSign($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=".$params->buyerTeam." where id=".$params->player."";
    $resultado=mysqli_query($con, $query) or die("Error realizando cláusula");
    $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".$params->player.",".$params->buyerTeam.",".$params->amount.", 'C', ".$params->market.", true)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    $query3="UPDATE teams SET budget=budget-" . $params->amount . " where id=". $params->buyerTeam."";
    $resultado3=mysqli_query($con, $query3) or die("Error actualizando presupuesto1");
    $query4="UPDATE teams SET budget=budget+" . $params->amount . " where id=". $params->oldTeam."";
    $resultado4=mysqli_query($con, $query4) or die("Error actualizando presupuesto2");
    $data['success'] = true;
    $data['message'] = "Cláusula realizada";
    echo json_encode($data);
    exit;
  }

  function doOffer($con, $params)
  {
    $data = array();
    if(strcmp($params->signinType, 'T')==0)
    {
      $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".$params->player.",".$params->offerTeam.", 0, 'T', ".$params->market.", false)";
    }else{
      $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".$params->player.",".$params->offerTeam.",".$params->amount.", 'F', ".$params->market.", false)";
    }
    $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    $data['signinID'] = mysqli_insert_id($con);
    $data['success'] = true;
    $data['message'] = "Oferta realizada";
    echo json_encode($data);
    exit;
  }

  function offerPlayer($con, $params)
  {
    $data = array();
    $query="INSERT INTO player_change_signins (signin_id,player,origin_team,new_team) values (".$params->signin.",".$params->player.", ".$params->originTeam.", ".$params->offerTeam.")";
    $resultado=mysqli_query($con, $query) or die("Error insertando jugador de cambio");
    $data['success'] = true;
    $data['message'] = "Jugador ofertado";
    echo json_encode($data);
    exit;
  }

  function acceptOffer($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=".$params->newTeam." where id=".$params->player."";
    $resultado=mysqli_query($con, $query) or die("Error realizando fichaje");
    $query2="UPDATE signins SET accepted=1 where id=". $params->id."";
    $resultado2=mysqli_query($con, $query2) or die("Error actualizando fichaje");
    $query3="UPDATE teams SET budget=budget-" . $params->amount . " where id=". $params->newTeam."";
    $resultado3=mysqli_query($con, $query3) or die("Error actualizando presupuesto1");
    $query4="UPDATE teams SET budget=budget+" . $params->amount . " where id=". $params->oldTeam."";
    $resultado4=mysqli_query($con, $query4) or die("Error actualizando presupuesto2");
    $data['success'] = true;
    $data['message'] = "Oferta aceptada";
    echo json_encode($data);
    exit;
  }

  function rejectOffer($con, $params)
  {
    $data = array();
    $query="DELETE FROM signins where id=".$params->id."";
    $resultado=mysqli_query($con, $query) or die("Error rechazando oferta");
    $data['success'] = true;
    $data['message'] = "Oferta rechazada";
    echo json_encode($data);
    exit;
  }

  function transferPlayerOffered($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=".$params->newTeam." where id=".$params->player."";
    $resultado=mysqli_query($con, $query) or die("Error transfiriendo cambio");
    $data['success'] = true;
    $data['message'] = "Jugador transferido";
    echo json_encode($data);
    exit;
  }

  function insertNewPlayer($con, $params)
  {
    $data = array();
    $query="INSERT INTO players (name,salary,team_id,position) values ('".$params->name."', 0.1, '".$params->teamID."', '".$params->position."')";
    $resultado=mysqli_query($con, $query) or die("Error insertando jugador");
    $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".mysqli_insert_id($con).",".$params->teamID.", 0, 'C', 0, true)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando signin");
    $data['success'] = true;
    $data['message'] = "Jugador creado";
    echo json_encode($data);
    exit;
  }

  function signWildCard($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=". $params->team ." where id=" . $params->player;
    $resultado=mysqli_query($con, $query) or die("Error contratando jugador");
    $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".$params->player.",".$params->team.", 0, 'W', ".$params->market.", true)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    $data['success'] = true;
    $data['message'] = "Jugador contratado";
    echo json_encode($data);
    exit;
  }

  function newAuction($con, $params)
  {
    $data = array();
    $query="INSERT INTO players (name,salary,team_id,position) values ('".$params->playerName."', 0.1, -1, '".$params->position."')";
    $resultado=mysqli_query($con, $query) or die("Error insertando jugador");
    $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".mysqli_insert_id($con).",".$params->buyerTeam.", ".$params->amount.", 'S', ".$params->market.", false)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando subasta");
    $idResult=mysqli_insert_id($con);
    $fecha_hora_actual = date('Y-m-d H:i:s');
    $nuevafecha = strtotime ('+14 hour', strtotime($fecha_hora_actual)) ;
    $fecha = date_create();
    date_timestamp_set($fecha, $nuevafecha);
    $query3="INSERT INTO calendar (type, affected_id, limit_date) values ('S',".$idResult.",'".date_format($fecha, 'Y-m-d H:i:s')."')";
    $resultado3=mysqli_query($con, $query3) or die("Error insertando calendario");
    $data['success'] = true;
    $data['message'] = "Subasta creada";
    echo json_encode($data);
    exit;
  }

  function raiseAuction($con, $params)
  {
    $data = array();
    $query="UPDATE signins SET buyer_team=". $params->newTeam .", amount=amount+".$params->amount." where id=" . $params->id;
    $resultado=mysqli_query($con, $query) or die("Error incrementando puja");
    $data['success'] = true;
    $data['message'] = "Puja incrementada";
    echo json_encode($data);
    exit;
  }

  function changeSalaries($con, $params)
  {
    $data = array();
    $query="UPDATE teams SET budget=budget+". $params->amount ." where id=" . $params->id;
    $resultado=mysqli_query($con, $query) or die("Error cambiando salarios");
    $data['success'] = true;
    $data['message'] = "Salarios decrementados";
    echo json_encode($data);
    exit;
  }

  function insertMatch($con, $params)
  {
    $data = array();
    $query="INSERT INTO matches (local,away,tournament,round) values (".$params->local.", ".$params->away.", ".$params->tournament.", ".$params->round.")";
    $resultado=mysqli_query($con, $query) or die("Error insertando partido");
    $data['success'] = true;
    $data['message'] = "Partido creado";
    echo json_encode($data);
    exit;
  }

  function insertTournament($con, $params)
  {
    $data = array();
    $query="INSERT INTO tournaments (name, edition) values ('".$params->name."', ".$params->edition.")";
    $resultado=mysqli_query($con, $query) or die("Error insertando torneo");
    $data['id'] = mysqli_insert_id($con);
    $data['success'] = true;
    $data['message'] = "Torneo creado";
    echo json_encode($data);
    exit;
  }

  function insertAction($con, $params)
  {
    $data = array();
    mysqli_multi_query($con, $params->query) or die("Error insertando accion");
    $data['success'] = true;
    $data['message'] = "Accion insertada";
    echo json_encode($data);
    exit;
  }

  function setMatchResult($con, $params)
  {
    $data = array();
    $query="UPDATE matches SET local_goals=". $params->localGoals .", away_goals=".$params->awayGoals." where id=" . $params->matchID;
    $resultado=mysqli_query($con, $query) or die("Error introduciendo resultado");
    $data['success'] = true;
    $data['message'] = "Resultado introducido";
    echo json_encode($data);
    exit;
  }

  function updateStandings($con, $params)
  {
    $data = array();
    $query="UPDATE standings SET points=points+". $params->points .", round=round+1, won=won+".$params->won.", draw=draw+".$params->draw.", lost=lost+".$params->lost.", goals_for=goals_for+".$params->goalsFor.", goals_against=goals_against+".$params->goalsAgainst." where tournament_id=" . $params->tournamentID ." and team=".$params->team;
    $resultado=mysqli_query($con, $query) or die("Error actualizando tabla");
    $data['success'] = true;
    $data['message'] = "Tabla actualizando";
    echo json_encode($data);
    exit;
  }

  function insertLog($con, $params)
  {
    $data = array();
    $query="INSERT INTO log ('user', 'message') values (".$params->user.", '".$params->message."')";
    $resultado=mysqli_query($con, $query) or die("Error insertando log");
    $data['success'] = true;
    $data['message'] = "Log insertado";
    echo json_encode($data);
    exit;
  }

  function createOrder($con, $params)
  {
    $data = array();
    $query="INSERT INTO team_order (user, position) values (".$params->user.", ".$params->position.")";
    $resultado=mysqli_query($con, $query) or die("Error insertando orden");
    $data['success'] = true;
    $data['message'] = "Orden insertado";
    echo json_encode($data);
    exit;
  }

  function setActualPosition($con, $params)
  {
    $data = array();
    $query="UPDATE constants SET actual_position=". $params->actualPosition;
    $resultado=mysqli_query($con, $query) or die("Error actualizando posicion de orden");
    $data['success'] = true;
    $data['message'] = "Constante actualizada";
    echo json_encode($data);
    exit;
  }

  function saveUser($con, $params)
  {
    $data = array();
    $query="INSERT INTO users (email,user,pass) values ('".$params->email."','".$params->user."','".$params->pass."')";
    $resultado=mysqli_query($con, $query) or die("Error insertando usuario");
    $data['success'] = true;
  	$data['message'] = "Usuario insertado";
    echo json_encode($data);
  	exit;
  }

  function updateUser($con, $params)
  {
    $data = array();
    $query="UPDATE users SET team_id=".$params->teamID.",user='".$params->user."',pass='".$params->pass."' where id=".$params->id."";
    $resultado=mysqli_query($con, $query) or die("Error actualizando usuario");
    $data['success'] = true;
  	$data['message'] = "Usuario actualizado";
    echo json_encode($data);
  	exit;
  }
  /*
  function subirDocumento($con)
  {
	if( $_FILES['archivo']['type']=='application/pdf')
    {
		$cadu='';
		if($_POST['caducidad']!='')
		{
			$cadu=date('d/m/Y', strtotime("+".$_POST['caducidad']." days"));
		}
        $origen = $_FILES['archivo']['tmp_name'];
        $destino = 'docspdf/ID'.$_POST['id'].'-'.$_POST['usuario'].'-'.$_POST['documento'].".pdf";
        move_uploaded_file($origen, $destino);
		$query="UPDATE documentosfra SET modificado=1,enlace='".$destino."', fecha_caducidad='".$cadu."' where id=".$_POST['id']."";
		$resultado=mysqli_query($con, $query) or die("Error en la base de datos" . mysql_error());
    }
	echo "<script language='javascript'>window.location='index.html'</script>;";
  }*/
  
  function addZero($number)
  {
    if($number<10){$number="0"+$number;}
    return $number;
  }

  function validateLogin($con, $params) {
    $data = array();
    $data['success'] = false;
  	$data['message'] = "No existe usuario";
    $query="SELECT * from users";
    $resultado=mysqli_query($con, $query) or die("Error recuperando usuarios");
	
    $users=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        if (strtolower($params->user) == strtolower(utf8_decode($row['user']))) {
  	      $data['message'] = "Contraseña incorrecta";
          if(strtolower($params->pass) == strtolower(utf8_decode($row['pass']))) {
            $data['success'] = true;
  	        $data['message'] = "Bienvenido " . $params->user;
          }
        }
    }
	  echo json_encode($data);
  	exit;
  }
  
  function obtainUsers($con)
  {
    $data = array();
    $query="SELECT * from users";
    $resultado=mysqli_query($con, $query) or die("Error recuperando usuarios");
	
    $users=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $user=utf8_decode($row['user']);
        $email=utf8_decode($row['email']);
        $teamID=$row['team_id'];
        $twitch=utf8_decode($row['twitch']);
        $name=utf8_decode($row['complete_name']);
        $psnID=utf8_decode($row['psn_id']);
        $users[] = array('id'=> $id, 'teamID'=> $teamID, 'user'=> $user, 'email'=> $email, 'name'=> $name, 'twitch'=> $twitch, 'psnID'=> $psnID);
    }
    $data['users']=$users;
    $data['success'] = true;
  	$data['message'] = "Datos recogidos";
	  echo json_encode($data);
  	exit;
  }

  function obtainTeams($con)
  {
    $data = array();
    $query="SELECT * from teams";
    $resultado=mysqli_query($con, $query) or die("Error recuperando equipos");
  
    $teams=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $name=utf8_decode($row['name']);
		    $shortName=utf8_decode($row['short_name']);
        $budget=$row['budget'];
        $teamImage=$row['image_route'];
        $nation=utf8_decode($row['nation']);
        $teams[] = array('id'=> $id, 'name'=> $name, 'shortName'=> $shortName, 'budget'=> $budget, 'teamImage'=> $teamImage, 'nation'=> $nation);
    }
    $data['teams']=$teams;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainPlayers($con)
  {
    $data = array();
    $query="SELECT * from players";
    $resultado=mysqli_query($con, $query) or die("Error recuperando jugadores");
  
    $players=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $name=utf8_decode($row['name']);
        $salary=$row['salary'];
        $teamID=$row['team_id'];
        $position=utf8_decode($row['position']);
        $overage=$row['overage'];
        $buyedThisMarket=$row['buyed_this_market'];
        $emblem=$row['emblem'];
        $cedido=$row['cedido'];
        $players[] = array('id'=> $id, 'teamID'=> $teamID, 'name'=> $name, 'salary'=> $salary, 'position'=> $position, 'overage' => $overage, 'buyedThisMarket'=> $buyedThisMarket, 'emblem'=>$emblem, 'cedido'=>$cedido);
    }
    $data['players']=$players;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainMatches($con)
  {
    $data = array();
    $query="SELECT * from matches";
    $resultado=mysqli_query($con, $query) or die("Error recuperando partidos");
  
    $matches=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $local=$row['local'];
        $away=$row['away'];
        $tournament=$row['tournament'];
        $round=$row['round'];
        $localGoals=$row['local_goals'];
        $awayGoals=$row['away_goals'];
        $limitDate=$row['limit_date'];
        $matches[] = array('id'=> $id, 'tournament'=> $tournament, 'round'=> $round, 'local'=> $local, 'away'=> $away, 'localGoals'=> $localGoals, 'awayGoals'=> $awayGoals, 'limitDate'=> $limitDate);
    }
    $data['matches']=$matches;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainActions($con)
  {
    $data = array();
    $query="SELECT * from actions";
    $resultado=mysqli_query($con, $query) or die("Error recuperando acciones");
  
    $actions=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $matchID=$row['match_id'];
        $type=utf8_decode($row['type']);
        $player=$row['player'];
        $actions[] = array('matchID'=> $matchID, 'type'=> $type, 'player'=> $player);
    }
    $data['actions']=$actions;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainSignins($con)
  {
    $data = array();
    $query="SELECT * from signins";
    $resultado=mysqli_query($con, $query) or die("Error recuperando fichajes");
  
    $signins=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $player=$row['player'];
        $buyerTeam=$row['buyer_team'];
        $amount=$row['amount'];
        $type=utf8_decode($row['type']);
        $market=$row['market'];
        $accepted=$row['accepted'];
        $limitDate='';
        $signins[] = array('id'=> $id, 'amount'=> $amount, 'player'=> $player, 'buyerTeam'=> $buyerTeam, 'type'=> $type, 'market'=> $market, 'accepted'=> $accepted, 'limitDate'=> $limitDate);
    }
    $data['signins']=$signins;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainPlayerChangeSignins($con)
  {
    $data = array();
    $query="SELECT * from player_change_signins";
    $resultado=mysqli_query($con, $query) or die("Error recuperando intercambios de jugadores en fichajes");
  
    $playerChangeSignins=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $signinID=$row['signin_id'];
        $player=$row['player'];
        $originTeam=$row['origin_team'];
        $newTeam=$row['new_team'];
        $playerChangeSignins[] = array('signinID'=> $signinID, 'newTeam'=> $newTeam, 'player'=> $player, 'originTeam'=> $originTeam);
    }
    $data['playerChangeSignins']=$playerChangeSignins;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainTournaments($con)
  {
    $data = array();
    $query="SELECT * from tournaments";
    $resultado=mysqli_query($con, $query) or die("Error recuperando torneos");
  
    $tournaments=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $name=utf8_decode($row['name']);
        $edition=$row['edition'];
        $tournaments[] = array('id'=>$id, 'name'=> $name, 'edition'=> $edition);
    }
    $data['tournaments']=$tournaments;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainStandings($con)
  {
    $data = array();
    $query="SELECT * from standings";
    $resultado=mysqli_query($con, $query) or die("Error recuperando clasificaciones");
  
    $standings=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $tournamentID=$row['tournament_id'];
        $team=$row['team'];
        $round=$row['round'];
        $points=$row['points'];
        $won=$row['won'];
        $draw=$row['draw'];
        $lost=$row['lost'];
        $goalsFor=$row['goals_for'];
        $goalsAgainst=$row['goals_against'];
        $standings[] = array('tournamentID'=> $tournamentID, 'round'=> $round, 'team'=> $team, 'points'=> $points, 'won'=> $won, 'draw'=> $draw, 'lost'=> $lost, 'goalsFor'=> $goalsFor, 'goalsAgainst'=> $goalsAgainst);
    }
    $data['standings']=$standings;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainTeamRequests($con)
  {
    $data = array();
    $query="SELECT * from team_requests";
    $resultado=mysqli_query($con, $query) or die("Error recuperando solicitudes de equipo");
  
    $teamRequests=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $user=$row['user'];
        $requestDate=$row['request_date'];
        $teamRequests[] = array('user'=> $user, 'requestDate'=> $requestDate);
    }
    $data['teamRequests']=$teamRequests;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainCalendar($con)
  {
    $data = array();
    $query="SELECT * from calendar";
    $resultado=mysqli_query($con, $query) or die("Error recuperando calendario");
  
    $cal=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $type=$row['type'];
        $limitDate=$row['limit_date'];
        $affectedID=$row['affected_id'];
        $cal[] = array('type'=> $type, 'limitDate'=> $limitDate, 'affectedID'=> $affectedID);
    }
    $data['calendar']=$cal;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainTeamOrder($con)
  {
    $data = array();
    $query="SELECT * from team_order";
    $resultado=mysqli_query($con, $query) or die("Error recuperando orden");
  
    $teamOrder=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $user=$row['user'];
        $position=$row['position'];
        $team=utf8_decode($row['team']);
        $teamOrder[] = array('user'=> $user, 'position'=> $position, 'team'=> $team);
    }
    $data['teamOrder']=$teamOrder;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainConstants($con)
  {
    $data = array();
    $query="SELECT * from constants";
    $resultado=mysqli_query($con, $query) or die("Error recuperando constantes");
  
    $constants=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $untouchables=$row['untouchables'];
        $forcedSignins=$row['forced_signins'];
        $marketEdition=$row['market_edition'];
        $marketOpened=$row['market_opened'];
        $forcedSigninsOpened=$row['forced_signins_opened'];
        $intervalActual=$row['interval_actual'];
        $actualPosition=$row['actual_position'];
        $constants[] = array('untouchables'=> $untouchables, 'forcedSignins'=> $forcedSignins, 'marketEdition'=> $marketEdition, 'marketOpened'=> $marketOpened, 'forcedSigninsOpened'=> $forcedSigninsOpened, 'intervalActual'=> $intervalActual, 'actualPosition'=> $actualPosition);
    }
    $data['constants']=$constants;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function invalidRequest()
  {
  	$data = array();
  	$data['success'] = false;
  	$data['message'] = "Petición inválida";
  	echo json_encode($data);
  	exit;
  }

  mysql_close($link);
?>
