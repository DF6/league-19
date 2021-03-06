
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
        case "PARTNERS":
          obtainPartners($link);
          break;
        case "LOG":
          obtainLog($link);
          break;
        case "SUG":
          obtainSuggestions($link);
          break;
        case "TCT":
          obtainTeamCupTeams($link);
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
       case "insSta":
          insertStanding($link, $params);
            break;
       case "insMat":
          insertMatch($link, $params);
            break;
       case "ediMat":
          editMatch($link, $params);
            break;
       case "insTou":
          insertTournament($link, $params);
            break;
       case "insClu":
          insertClub($link, $params);
              break;
       case "borEmb":
          deleteEmblem($link, $params);
            break;
       case "hacEmb":
          makeEmblem($link, $params);
            break;
       case "setHol":
          setHolidaysMode($link, $params);
            break;
       case "firPat":
          setPartner($link, $params);
            break;
       case "setRes":
          setMatchResult($link, $params);
            break;
       case "forRes":
          forceMatchResult($link, $params);
            break;
       case "insAct":
          insertAction($link, $params);
            break;
       case "updSta":
          updateStandings($link, $params);
            break;
       case "resSta":
          resetStandings($link, $params);
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
       case "senSug":
          insertSuggestion($link, $params);
            break;
       case "buyThi":
          buyThirtyMinutesNextMarket($link, $params);
            break;
       case "extFor":
          buyExtraForcedSignin($link, $params);
            break;
       case "extAuc":
          buyExtraAuction($link, $params);
            break;
       case "setUnt":
          buyNewUntouchable($link, $params);
            break;
       case "chaBad":
          changeBadgeAndClothing($link, $params);
            break;
       case "venEqu":
          sellTeam($link, $params);
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
    $query2="INSERT INTO signins (player,buyer_team,amount,signin_type,market,accepted) values (".$params->player.", 0, 0, 'D', ".$params->market.", true)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    $data['success'] = true;
    $data['message'] = "Jugador liberado";
    echo json_encode($data);
    exit;
  }

  function saveSalary($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Salario actualizado";
    $query="UPDATE players SET salary=".$params->salary." where id=".$params->player;
    $resultado=mysqli_query($con, $query) or die("Error actualizando salario");
    echo json_encode($data);
    exit;
  }

  function forceSign($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Cláusula realizada";
    $consult="SELECT * from teams where id=" . $params->buyerTeam;
    $consultResult=mysqli_query($con, $consult) or die("Error consultando cláusulas");
    while($row = mysqli_fetch_array($consultResult)) {
      if($row['forced_signins_available'] == 0) {
        $data['success'] = false;
        $data['message'] = "No te quedan cláusulas";
      }
    }
    $consult2="SELECT * from players where id=" . $params->player;
    $consult2Result=mysqli_query($con, $consult2) or die("Error consultando jugador");
    while($row2 = mysqli_fetch_array($consult2Result)) {
      if($row2['buyed_this_market'] == 1) {
        $data['success'] = false;
        $data['message'] = "Jugador ya comprado este mercado";
      }
      if($row2['untouchable'] == 1) {
        $data['success'] = false;
        $data['message'] = "Jugador intocable este mercado";
      }
    }
    $consult3="SELECT * from constants";
    $consult3Result=mysqli_query($con, $consult3) or die("Error consultando mercado");
    while($row3 = mysqli_fetch_array($consult3Result)) {
      if($row3['market_opened'] == 0 || $row3['forced_signins_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Cláusulas cerradas";
      }
    }
    $consult4="SELECT * from signins where market=" . $params->market . " and old_team=" . $params->oldTeam . " and signin_type='F'";
    $consult4Result=mysqli_query($con, $consult4) or die("Error consultando mercado2");
    $cont = 0;
    while($row4 = mysqli_fetch_array($consult4Result)) {
      $cont++;
    }
    if($cont == 3) {
      $data['success'] = false;
      $data['message'] = "El equipo recibió todas sus cláusulas";
    }
    if($data['success'] == true) {
      $query="UPDATE players SET team_id=".$params->buyerTeam.", salary=overage/100, emblem=0, untouchable=0, buyed_this_market=1 where id=".$params->player;
      $resultado=mysqli_query($con, $query) or die("Error realizando cláusula");
      $query2="INSERT INTO signins (player,old_team,buyer_team,amount,signin_type,market,accepted) values (".$params->player.", " . $params->oldTeam . ", ".$params->buyerTeam.",".$params->amount.", 'F', ".$params->market.", true)";
      $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
      $query3="UPDATE teams SET budget=budget-" . $params->amount . ", forced_signins_available=forced_signins_available-1 where id=". $params->buyerTeam;
      $resultado3=mysqli_query($con, $query3) or die("Error actualizando presupuesto1");
      $query4="UPDATE teams SET budget=budget+" . $params->amount . " where id=". $params->oldTeam;
      $resultado4=mysqli_query($con, $query4) or die("Error actualizando presupuesto2");
    }
    echo json_encode($data);
    exit;
  }

  function doOffer($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Oferta realizada";
    $consult = "SELECT * from players where id=" . $params->player;
    $consultResult = mysqli_query($con, $consult) or die("Error consultando jugador");
    while($row = mysqli_fetch_array($consultResult)) {
      if($row['buyed_this_market'] == 1) {
        $data['success'] = false;
        $data['message'] = "El jugador ya fue comprado por otro equipo antes";
      }
    }
    $consult2 = "SELECT * from constants";
    $consult2Result = mysqli_query($con, $consult2) or die("Error consult2ando constantes");
    while($row = mysqli_fetch_array($consult2Result)) {
      if($row['market_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Mercado cerrado";
      }
    }
    if($data['success'] == true) {
      $query2="INSERT INTO signins (player,old_team, buyer_team,amount,signin_type,market,accepted) values (".$params->player."," . $params->oldTeam . ", ".$params->newTeam.", ". $params->amount .", '" . $params->signinType . "', ".$params->market.", false)";
      $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
      $data['id']=mysqli_insert_id($con);
    }
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
    $data['success'] = true;
    $data['message'] = "Oferta aceptada";
    $consult = "SELECT * from players where id=" . $params->player;
    $consultResult = mysqli_query($con, $consult) or die("Error consultando jugador");
    while($row = mysqli_fetch_array($consultResult)) {
      if($row['buyed_this_market'] == 1) {
        $data['success'] = false;
        $data['message'] = "El jugador ya fue comprado por otro equipo antes";
      }
    }
    $consult2 = "SELECT * from constants";
    $consult2Result = mysqli_query($con, $consult2) or die("Error consult2ando constantes");
    while($row = mysqli_fetch_array($consult2Result)) {
      if($row['market_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Mercado cerrado";
      }
    }
    if($data['success'] == true) {
      if($params->signinType == "C") {
        $query="UPDATE players SET buyed_this_market=1, emblem=0, untouchable=0, team_id=".$params->newTeam." where id=".$params->player;
        $resultado=mysqli_query($con, $query) or die("Error realizando fichaje");
      } else {
        $query="UPDATE players SET buyed_this_market=1, emblem=0, untouchable=0, salary=overage/100, team_id=".$params->newTeam." where id=".$params->player;
        $resultado=mysqli_query($con, $query) or die("Error realizando fichaje");
      }
      $query2="UPDATE signins SET accepted=1 where id=". $params->id;
      $resultado2=mysqli_query($con, $query2) or die("Error actualizando fichaje");
      $query3="UPDATE teams SET budget=budget-" . $params->amount . " where id=". $params->newTeam;
      $resultado3=mysqli_query($con, $query3) or die("Error actualizando presupuesto1");
      $query4="UPDATE teams SET budget=budget+" . $params->amount . " where id=". $params->oldTeam;
      $resultado4=mysqli_query($con, $query4) or die("Error actualizando presupuesto2");
      if($params->signinType == "C") {
        $query5="UPDATE players SET cedido=".$params->oldTeam." where id=".$params->player;
        $resultado5=mysqli_query($con, $query5) or die("Error realizando fichaje");
      }
    }
    echo json_encode($data);
    exit;
  }

  function rejectOffer($con, $params)
  {
    $data = array();
    $query="DELETE FROM signins where id=".$params->id;
    $resultado=mysqli_query($con, $query) or die("Error rechazando oferta");
    $query2="DELETE FROM player_change_signins where signin_id=".$params->id;
    $resultado2=mysqli_query($con, $query2) or die("Error rechazando oferta");
    $data['success'] = true;
    $data['message'] = "Oferta rechazada";
    echo json_encode($data);
    exit;
  }

  function transferPlayerOffered($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Jugador transferido";
    $consult = "SELECT * from players where id=" . $params->player;
    $consultResult = mysqli_query($con, $consult) or die("Error consultando jugador");
    while($row = mysqli_fetch_array($consultResult)) {
      if($row['buyed_this_market'] == 1) {
        $data['success'] = false;
        $data['message'] = "El jugador ya fue comprado por otro equipo antes";
      }
    }
    $consult2 = "SELECT * from constants";
    $consult2Result = mysqli_query($con, $consult2) or die("Error consult2ando constantes");
    while($row = mysqli_fetch_array($consult2Result)) {
      if($row['market_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Mercado cerrado";
      }
    }
    if($data['success'] == true) {
      $query="UPDATE players SET emblem=0, buyed_this_market=1, salary=overage/100, team_id=".$params->newTeam." where id=".$params->player."";
      $resultado=mysqli_query($con, $query) or die("Error transfiriendo cambio");
      $query2="INSERT INTO signins (player,old_team, buyer_team,amount,signin_type,market,accepted) values (".$params->player."," . $params->oldTeam . ", ".$params->newTeam.", 0, '" . $params->signinType . "', ".$params->market.", true)";
      $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
      if($params->signinType == "C") {
        $query5="UPDATE players SET emblem=0, cedido=".$params->oldTeam." where id=".$params->player;
        $resultado5=mysqli_query($con, $query5) or die("Error realizando fichaje");
      }
    }
    echo json_encode($data);
    exit;
  }

  function makeEmblem($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Nuevo emblema";
    $consult2 = "SELECT * from constants";
    $consult2Result = mysqli_query($con, $consult2) or die("Error consult2ando constantes");
    while($row = mysqli_fetch_array($consult2Result)) {
      if($row['market_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Mercado cerrado";
      }
    }
    if($data['success'] == true) {
      $query2="UPDATE players SET emblem=1 where id=".$params->player;
      $resultado2=mysqli_query($con, $query2) or die("Error poniendo emblema");
    }
    echo json_encode($data);
    exit;
  }

  function deleteEmblem($con, $params)
  {
    $data = array();
    $query="UPDATE players SET emblem=0 where id=".$params->player;
    $resultado=mysqli_query($con, $query) or die("Error quitando emblema");
    $data['success'] = true;
    $data['message'] = "Borrado emblema";
    echo json_encode($data);
    exit;
  }

  function setPartner($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Nuevo patrocinador";
    $consult2 = "SELECT * from constants";
    $consult2Result = mysqli_query($con, $consult2) or die("Error consult2ando constantes");
    while($row = mysqli_fetch_array($consult2Result)) {
      if($row['market_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Mercado cerrado";
      }
    }
    if($data['success'] == true) {
      $query="UPDATE partners SET partner=".$params->partner." where team=".$params->team;
      $resultado=mysqli_query($con, $query) or die("Error de patrocinador");
      $query2="UPDATE teams SET budget=budget+10 where id=".$params->team;
      $resultado2=mysqli_query($con, $query2) or die("Error de patrocinador2");
    }
    echo json_encode($data);
    exit;
  }

  function insertNewPlayer($con, $params)
  {
    $data = array();
    $query="INSERT INTO players (name,salary,team_id,position,overage) values ('".$params->name."', ".$params->salary.", ".$params->team.", '".$params->position."', ".$params->overage.")";
    $resultado=mysqli_query($con, $query) or die("Error insertando jugador");
    /*$query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".mysqli_insert_id($con).",".$params->teamID.", 0, 'C', 0, true)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando signin");*/
    $data['success'] = true;
    $data['message'] = "Jugador creado";
    $data['newID']=mysqli_insert_id($con);
    echo json_encode($data);
    exit;
  }

  function insertSuggestion($con, $params)
  {
    $data = array();
    $query="INSERT INTO suggestions (user,suggestion) values (".$params->user.", '".$params->suggestion."')";
    $resultado=mysqli_query($con, $query) or die("Error insertando sugerencia");
    $data['success'] = true;
    $data['message'] = "Sugerencia enviada";
    echo json_encode($data);
    exit;
  }

  function signWildCard($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = 'Jugador contratado';
    $consult = "SELECT * from constants";
    $consultResult = mysqli_query($con, $consult) or die("Error comprobando constantes");
    while($row2 = mysqli_fetch_array($consultResult)) {
      if($row2['market_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = 'El mercado no está abierto';
      }
    }
    $consult2 = "SELECT * from players where id=" . $params->player;
    $consult2Result = mysqli_query($con, $consult2) or die("Error comprobando jugador");
    while($row = mysqli_fetch_array($consult2Result))
    {
        $id=$row['id'];
        if ($row['team_id'] != 0) {
          $data['success'] = false;
          $data['message'] = 'Jugador no disponible: ya ha sido contratado';
        }
    }
    if($data['success'] == true) {
      $query="UPDATE players SET team_id=". $params->team .", buyed_this_market=1 where id=" . $params->player;
      $resultado=mysqli_query($con, $query) or die("Error contratando jugador");
      $query2="INSERT INTO signins (player,buyer_team,amount,signin_type,market,accepted) values (".$params->player.",".$params->team.", 0, 'W', ".$params->market.", true)";
      $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    }
    echo json_encode($data);
    exit;
  }

  function newAuction($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Subasta creada";
    $consult3 = "SELECT * from constants";
    $consult3Result = mysqli_query($con, $consult3) or die("Error consultando mercado");
    while($row3 = mysqli_fetch_array($consult3Result)) {
      if($row3['auctions_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Subastas cerradas";
      }
    }
    if($params->auctionType == 'A') {
      $consult = "SELECT * from players";
      $consultResult = mysqli_query($con, $consult) or die("Error consultando nuevo jugador");
      while($row = mysqli_fetch_array($consultResult)) {
        if(strtolower($row['name']) == strtolower($params->playerName)) {
          $data['success'] = false;
          $data['message'] = "El jugador ya existe";
        }
      }
      $consult2 = "SELECT * from teams where id=" . $params->buyerTeam;
      $consult2Result = mysqli_query($con, $consult2) or die("Error consultando subastas");
      while($row2 = mysqli_fetch_array($consult2Result)) {
        if($row2['auctions_available'] == 0) {
          $data['success'] = false;
          $data['message'] = "Máximo de subastas alcanzado";
        }
      }
      if ($data['success'] == true) {
        $query="INSERT INTO players (name,team_id,position,overage) values ('".$params->playerName."', -1, '".$params->position."', " . $params->overage . ")";
        $resultado=mysqli_query($con, $query) or die("Error insertando jugador");
        $query2="INSERT INTO signins (player, first_team, buyer_team,amount,signin_type,market,accepted,limit_date) values (".mysqli_insert_id($con).",".$params->firstTeam.",".$params->buyerTeam.", ".$params->amount.", 'A', ".$params->market.", false, DATE_ADD(NOW(), INTERVAL 13 HOUR))";
        $resultado2=mysqli_query($con, $query2) or die("Error insertando subasta");
        $data['newID']=mysqli_insert_id($con);
      }  
    }else if($params->auctionType == 'L'){
      $consult28 = "SELECT * from signins where signin_type='L' and market=" . $params->market . " and player=" . $params->player;
      $consult28Result = mysqli_query($con, $consult28) or die("Error consultando subastas");
      while($row28 = mysqli_fetch_array($consult28Result)) {
        $data['success'] = false;
        $data['message'] = "Ya se liberó, ve a Subastas para ver su puja actual";
      }
      if($data['success'] == true) {
        $query2="INSERT INTO signins (player, first_team, buyer_team,amount,signin_type,market,accepted,limit_date) values (".$params->player.",".$params->firstTeam.", 0, ".$params->amount.", 'L', ".$params->market.", false, DATE_ADD(NOW(), INTERVAL 37 HOUR))";
        $resultado2=mysqli_query($con, $query2) or die("Error insertando subasta");
        $data['newID']=mysqli_insert_id($con);
      }
    }
    
    echo json_encode($data);
    exit;
  }

  function raiseAuction($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Puja incrementada";
    $consult = "SELECT * from signins where id=" . $params->id;
    $result = mysqli_query($con, $consult) or die("Error comparando fechas");
    while($row = mysqli_fetch_array($result)) {
      $fecha_limite = strtotime($row['limit_date']);
      $fecha_limite_time = $row['limit_date'];
      $amount = $row['amount'];
    }
    $consult2 = "SELECT * from teams where id=" . $params->newTeam;
    $consult2Result = mysqli_query($con, $consult2) or die("Error consultando nuevo jugador");
    while($row2 = mysqli_fetch_array($consult2Result)) {
      if($row2['auctions_available'] == 0 && $params->auctionType == 'A') {
        $data['success'] = false;
        $data['message'] = "Máximo de subastas alcanzado";
      }
    }
    $consult3 = "SELECT * from constants";
    $consult3Result = mysqli_query($con, $consult3) or die("Error consultando mercado");
    while($row3 = mysqli_fetch_array($consult3Result)) {
      if($row3['market_opened'] == 0) {
        $data['success'] = false;
        $data['message'] = "Subastas cerradas";
      }
    }
    $fecha_actual = strtotime(date("d-m-Y H:i:s", time()));
    $fecha_dos_min_menos = strtotime(date("d-m-Y H:i:s", time()+3720));
    $fecha_cinco_min_tanteo = $fecha_limite+300;
    if($fecha_actual > $fecha_limite) {
      if($fecha_actual > $fecha_cinco_min_tanteo && $params->auctionType == 'A' && $params->newTeam == $params->firstTeam) {
        $query="UPDATE signins SET buyer_team=". $params->newTeam .", amount=".$params->amount." where id=" . $params->id;
        $resultado=mysqli_query($con, $query) or die("Error incrementando puja");
      }else {
        $data['success'] = false;
        $data['message'] = "Puja acabada";
      }
    } else if($amount >= $params->amount) {
      $data['success'] = false;
      $data['message'] = "La puja ha sido aumentada POR OTRO JUGADOR ANTES";
    } else {
      if($data['success'] == true) {
        if($fecha_dos_min_menos > $fecha_limite) {
          $query="UPDATE signins SET buyer_team=". $params->newTeam .", amount=".$params->amount.", limit_date=DATE_ADD(limit_date, INTERVAL 2 MINUTE) where id=" . $params->id;
        } else {
          $query="UPDATE signins SET buyer_team=". $params->newTeam .", amount=".$params->amount." where id=" . $params->id;
        }
        $resultado=mysqli_query($con, $query) or die("Error incrementando puja");
      }
    }
    echo json_encode($data);
    exit;
  }

  function changeSalaries($con, $params)
  {
    $data = array();
    $query="UPDATE teams SET budget=budget-". $params->amount ." where id=" . $params->id;
    $resultado=mysqli_query($con, $query) or die("Error cambiando salarios");
    $data['success'] = true;
    $data['message'] = "Salarios decrementados";
    echo json_encode($data);
    exit;
  }

  function insertStanding($con, $params)
  {
    $data = array();
    $query="INSERT INTO standings (tournament_id,team) values (".$params->tournament.", ".$params->team.")";
    $resultado=mysqli_query($con, $query) or die("Error insertando clasificacion");
    $data['success'] = true;
    $data['message'] = "Clasificacion creada";
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
  
  function editMatch($con, $params) {
    $data = array();
    $query="UPDATE matches SET local=".$params->local.", away=".$params->away.", tournament=".$params->tournament.", round=".$params->round." WHERE id=".$params->id;
    $resultado=mysqli_query($con, $query) or die("Error editando partido");
    $data['success'] = true;
    $data['message'] = "Partido editado";
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

  function insertClub($con, $params) {
    $data = array();
    $query="INSERT INTO team_cup_teams (club, team, tournament) values (".$params->club.", ".$params->team.", ".$params->tournament.")";
    $resultado=mysqli_query($con, $query) or die("Error insertando club");
    $data['id'] = mysqli_insert_id($con);
    $data['success'] = true;
    $data['message'] = "Team Club creado";
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

  function forceMatchResult($con, $params)
  {
    $data = array();
    $query="UPDATE matches SET local_goals=". $params->localGoals .", away_goals=".$params->awayGoals." where id=" . $params->matchID;
    $resultado=mysqli_query($con, $query) or die("Error introduciendo resultado");
    $data['success'] = true;
    $data['message'] = "Resultado introducido";
    echo json_encode($data);
    exit;
  }
  
  function setMatchResult($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Resultado introducido";
    $consult="SELECT * from matches where id=" . $params->matchID;
    $consultResult=mysqli_query($con, $consult) or die("Error comprobando resultado");
    while($row = mysqli_fetch_array($consultResult)) {
      if($row['local_goals'] != -1) {
        $data['success'] = false;
        $data['message'] = "Resultado ya introducido";
      }
    }
    if($data['success'] == true) {
      $query="UPDATE matches SET local_goals=". $params->localGoals .", away_goals=".$params->awayGoals." where id=" . $params->matchID;
      $resultado=mysqli_query($con, $query) or die("Error introduciendo resultado");
    }
    echo json_encode($data);
    exit;
  }

  function updateStandings($con, $params)
  {
    $data = array();
    $query="UPDATE standings SET points=points+". $params->points .", round=round+1, won=won+".$params->won.", draw=draw+".$params->draw.", lost=lost+".$params->lost.", non_played=non_played+".$params->nonPlayed.", goals_for=goals_for+".$params->goalsFor.", goals_against=goals_against+".$params->goalsAgainst." where tournament_id=" . $params->tournamentID ." and team=".$params->team;
    $resultado=mysqli_query($con, $query) or die("Error actualizando tabla");
    $data['success'] = true;
    $data['message'] = "Tabla actualizando";
    echo json_encode($data);
    exit;
  }

  function resetStandings($con, $params)
  {
    $query="UPDATE standings SET round=0, points=0, won=0, draw=0, lost=0, non_played=0, goals_for=0, goals_against=0 WHERE tournament_id=" . $params->tournament;
    $resultado6=mysqli_query($con, $query) or die("Error reiniciando clasificaciones");
    $data['success'] = true;
    $data['message'] = "Tabla reseteada";
    echo json_encode($data);
    exit;
  }

  function insertLog($con, $params)
  {
    $data = array();
    $query="INSERT INTO log (user, type, log_information) VALUES (".$params->user.", '" . $params->logType . "', '".$params->logInfo."')";
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

  function setHolidaysMode($con, $params)
  {
    $data = array();
    $query="UPDATE users SET holidays_mode=" . $params->holidaysMode . ", holidays_message='". $params->holidaysMessage ."' where id=" . $params->user;
    $resultado=mysqli_query($con, $query) or die("Error vacaciones");
    $data['success'] = true;
    $data['message'] = "Vacaciones actualizadas";
    echo json_encode($data);
    exit;
  }

  function buyThirtyMinutesNextMarket($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Privilegio 30 minutos comprado. El próximo mercado tendrás un adelanto de 30 minutos para realizar cláusulas";
    $consult2 = "SELECT * from teams where id=" . $params->team;
    $consult2Result = mysqli_query($con, $consult2) or die("Error consultando subastas");
    while($row2 = mysqli_fetch_array($consult2Result)) {
      if($row2['next_market_privilege'] == 1) {
        $data['success'] = false;
        $data['message'] = "Ya posees este privilegio para el próximo mercado";
      }
    }
    if($data['success'] == true) {
      $query="UPDATE teams SET budget=budget-". $params->price .", next_market_privilege=1 where id=" . $params->team;
      $resultado=mysqli_query($con, $query) or die("Error comprando privilegio");
    }
    echo json_encode($data);
    exit;
  }

  function buyExtraForcedSignin($con, $params)
  {
    $data = array();
    $query="UPDATE teams SET budget=budget-". $params->price .", forced_signins_available=forced_signins_available+1 where id=" . $params->team;
    $resultado=mysqli_query($con, $query) or die("Error comprando privilegio");
    $data['success'] = true;
    $data['message'] = "Ahora tienes un clausulazo disponible más";
    echo json_encode($data);
    exit;
  }

  function buyExtraAuction($con, $params)
  {
    $data = array();
    $query="UPDATE teams SET budget=budget-". $params->price .", auctions_available=auctions_available+1 where id=" . $params->team;
    $resultado=mysqli_query($con, $query) or die("Error comprando privilegio");
    $data['success'] = true;
    $data['message'] = "Ahora tienes una subasta de jugador nuevo más";
    echo json_encode($data);
    exit;
  }

  function buyNewUntouchable($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Ahora el jugador es intocable el próximo mercado";
    $consult2 = "SELECT * from players where id=" . $params->player;
    $consult2Result = mysqli_query($con, $consult2) or die("Error consultando jugador");
    while($row2 = mysqli_fetch_array($consult2Result)) {
      if($row2['untouchable'] == 1) {
        $data['success'] = false;
        $data['message'] = "Este jugador ya tiene el privilegio para el próximo mercado";
      }
    }
    if($data['success'] == true) {
      $query="UPDATE teams SET budget=budget-". $params->price ." where id=" . $params->team;
      $resultado=mysqli_query($con, $query) or die("Error comprando privilegio");
      $query2="UPDATE players SET untouchable=1 where id=" . $params->player;
      $resultado2=mysqli_query($con, $query2) or die("Error intocabilizando jugador");
    }
    echo json_encode($data);
    exit;
  }

  function changeBadgeAndClothing($con, $params)
  {
    $data = array();
    $query="UPDATE teams SET budget=budget-". $params->price .", name='".$params->newBadge."' where id=" . $params->team;
    $resultado=mysqli_query($con, $query) or die("Error comprando privilegio");
    $data['success'] = true;
    $data['message'] = "Escudo y equipación cambiados";
    echo json_encode($data);
    exit;
  }
  //PROBAR
  function sellTeam($con, $params)
  {
    $data = array();
    $query2="UPDATE players SET team_id=0 where overage >= 80 and team_id=" . $params->team;
    $resultado2=mysqli_query($con, $query2) or die("Error vendiendo jugadores");
    $query="UPDATE teams SET budget=budget+".$params->totalSelling."-". $params->price ." where id=" . $params->team;
    $resultado=mysqli_query($con, $query) or die("Error comprando privilegio");
    $data['success'] = true;
    $data['message'] = "Llegó el jeque y te dejó ".$params->totalSelling. "M€";
    echo json_encode($data);
    exit;
  }

  /*function closeAuctionPrivilege($con, $params) {
    $data['success'] = true;
    $data['message'] = "Subasta ganada";
    $consult = "SELECT * from signins where id=". $params->signin;
    $result = mysqli_query($con, $consult) or die("Error comparando fechas");
    $fecha_actual = date("d-m-Y H:i:s", time());
    $fecha_actual = strtotime('+1 hour', strtotime($fecha_actual));
    $fecha_cerrado = date("d-m-Y H:i:s" time()-86400);
    while($row = mysqli_fetch_array($result)) {
      $fecha_limite = strtotime($row['limit_date']);
      $tipo = utf8_decode($row['signin_type']);
      $equipo = $row['buyer_team'];
      $origen = $row['first_team'];
      $jugador = $row['player'];
      $id = $row['id'];
      $amount = $row['amount'];
      $media = 1;
      if($fecha_actual < $fecha_limite) {
        $consult5 = "SELECT * from teams";
        $result5 = mysqli_query($con, $consult5) or die("Error consultando equipo");
        while($row2 = mysqli_fetch_array($result5)) {
            if($row2['id'] == $equipo && $equipo == $params->myTeam && strcmp($tipo, "A") == 0 && $row2['auctions_available'] == 0) {
                $data['success'] = false;
                $data['message'] = "No tienes más subastas para ganar, compra un privilegio de subasta para poder cerrar";
            } else if($row2['id'] == $equipo && $equipo != $params->myTeam && strcmp($tipo, "A") == 0 && $row2['auctions_available'] == 0) {
                $data['success'] = false;
                $data['message'] = "Alguien te ha sobrepujado: debes ser el ganador actual de la subasta para poder cerrarla";
            }
        }
        if($data['success'] == true) {
            $consult2 = "UPDATE signins SET limit_date=DATE_SUB(NOW(), INTERVAL 24 HOUR) where id=". $signin;
            $result2 = mysqli_query($con, $consult2) or die("Error cerrando subasta");
        }
      } else {
        $data['success'] = false;
        $data['message'] = "La subasta ya había acabado";
      }
    }
    echo json_encode($data);
    exit;
  }*/
  //PROBAR HASTA AQUI
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
        $adminRights=$row['admin_rights'];
        $holidaysMode=$row['holidays_mode'];
        $holidaysMessage=$row['holidays_message'];
        $users[] = array('id'=> $id, 'teamID'=> $teamID, 'user'=> $user, 'email'=> $email, 'name'=> $name, 'twitch'=> $twitch, 'psnID'=> $psnID, 'adminRights'=> $adminRights, 'holidaysMode'=> $holidaysMode, 'holidaysMessage'=> $holidaysMessage);
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
        $auctions=$row['auctions_available'];
        $forcedSigninsAvailable=$row['forced_signins_available'];
        $nextMarketPrivilege=$row['next_market_privilege'];
        $teams[] = array('id'=> $id, 'name'=> $name, 'shortName'=> $shortName, 'budget'=> $budget, 'teamImage'=> $teamImage, 'nation'=> $nation, 'auctionsLeft'=> $auctions, 'forcedSigninsAvailable'=> $forcedSigninsAvailable, 'nextMarketPrivilege'=> $nextMarketPrivilege);
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
        $untouchable=$row['untouchable'];
        $players[] = array('id'=> $id, 'teamID'=> $teamID, 'name'=> $name, 'salary'=> $salary, 'position'=> $position, 'overage' => $overage, 'buyedThisMarket'=> $buyedThisMarket, 'emblem'=>$emblem, 'cedido'=>$cedido, 'untouchable'=>$untouchable);
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
  
  function obtainPartners($con)
  {
    $data = array();
    $query="SELECT * from partners";
    $resultado=mysqli_query($con, $query) or die("Error recuperando patrocinadores");
  
    $partners=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $team=$row['team'];
        $partner=$row['partner'];
        $partners[] = array('team'=> $team, 'partner'=> $partner);
    }
    $data['partners']=$partners;
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
        $firstTeam=$row['first_team'];
        $oldTeam=$row['old_team'];
        $buyerTeam=$row['buyer_team'];
        $amount=$row['amount'];
        $type=utf8_decode($row['signin_type']);
        $market=$row['market'];
        $accepted=$row['accepted'];
        $limitDate=$row['limit_date'];
        $fecha_limite = strtotime($row['limit_date']);
        $fecha_actual = strtotime(date("d-m-Y H:i:s", time()+3600));
        $fecha_cinco_min_tanteo = $fecha_limite+300;
        if($fecha_cinco_min_tanteo > $fecha_actual && $fecha_actual > $fecha_limite && $type == 'A') {
          $amplifiedState=2;
        }else {
          $amplifiedState=-1;
        }
        $signins[] = array('id'=> $id, 'amount'=> $amount, 'player'=> $player, 'firstTeam'=> $firstTeam, 'oldTeam'=> $oldTeam, 'buyerTeam'=> $buyerTeam, 'signinType'=> $type, 'market'=> $market, 'accepted'=> $accepted, 'amplifiedState'=> $amplifiedState, 'limitDate'=> $limitDate);
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
        $tournamentGroup=$row['tournament_group'];
        $team=$row['team'];
        $round=$row['round'];
        $points=$row['points'];
        $won=$row['won'];
        $draw=$row['draw'];
        $lost=$row['lost'];
        $nonPlayed=$row['non_played'];
        $goalsFor=$row['goals_for'];
        $goalsAgainst=$row['goals_against'];
        $standings[] = array('tournamentID'=> $tournamentID, 'tournamentGroup'=> $tournamentGroup, 'round'=> $round, 'team'=> $team, 'points'=> $points, 'won'=> $won, 'draw'=> $draw, 'lost'=> $lost, 'nonPlayed'=>$nonPlayed, 'goalsFor'=> $goalsFor, 'goalsAgainst'=> $goalsAgainst);
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
        $marketEdition=$row['market_edition'];
        $marketOpened=$row['market_opened'];
        $forcedSigninsOpened=$row['forced_signins_opened'];
        $auctionsOpened=$row['auctions_opened'];
        $intervalActual=$row['interval_actual'];
        $constants[] = array('marketEdition'=> $marketEdition, 'marketOpened'=> $marketOpened, 'forcedSigninsOpened'=> $forcedSigninsOpened, 'auctionsOpened'=> $auctionsOpened, 'intervalActual'=> $intervalActual);
    }
    $data['constants']=$constants;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainLog($con)
  {
    $data = array();
    $query="SELECT * from log";
    $resultado=mysqli_query($con, $query) or die("Error recuperando log");
  
    $log=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $user=$row['user'];
        $type=utf8_decode($row['type']);
        $logInformation=utf8_decode($row['log_information']);
        $logTime=$row['log_time'];
        $log[] = array('user'=>$user, 'type'=> $type, 'logInformation'=> $logInformation, 'logTime'=> $logTime);
    }
    $data['log']=$log;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainSuggestions($con)
  {
    $data = array();
    $query="SELECT * from suggestions";
    $resultado=mysqli_query($con, $query) or die("Error recuperando sugerencias");
  
    $suggestions=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $user=$row['user'];
        $suggestion=utf8_decode($row['suggestion']);
        $suggestions[] = array('user'=>$user, 'suggestion'=> $suggestion);
    }
    $data['suggestions']=$suggestions;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainTeamCupTeams($con) {
    $data = array();
    $query="SELECT * from team_cup_teams";
    $resultado=mysqli_query($con, $query) or die("Error recuperando clubes");

    $teamCupTeams=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $club=$row['club'];
        $team=$row['team'];
        $tournament=$row['tournament'];
        $teamCupTeams[] = array('club'=>$club, 'team'=> $team, 'tournament' => $tournament);
    }
    $data['teamCupTeams']=$teamCupTeams;
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

  /*function saveSalary($con, $params)
  {
    $data = array();
    $data['success'] = true;
    $data['message'] = "Salario actualizado";
    /*$consult = "SELECT * from players where team_id=" . $params->team;
    $consultResult = mysqli_query($con, $consult) or die ("Error consultando salarios");
    //$salaries = 0;
    $untouchables = 0;
    while($row = mysqli_fetch_array($consultResult)) {
      //$salaries = $salaries + $row['salary'];
      if($row['salary'] == 10) {
        $untouchables++;
      }
    }
    $consult2 = "SELECT * from teams where id=" . $params->team;
    $consult2Result = mysqli_query($con, $consult2) or die ("Error consultando salarios 2");
    $untouchablesOfTeam = 0;
    while($row2 = mysqli_fetch_array($consult2Result)) {
      $untouchablesOfTeam = $row2['untouchables'];
    }
    if(($salaries + $params->salary) > 100) {
      $data['success'] = false;
      $data['message'] = "Límite de sueldos alcanzado";
    } else if($params->salary > 10 || $params->salary <= 0) {
      $data['success'] = false;
      $data['message'] = "Límite de sueldo individual alcanzado";
    } else if ($untouchables == $untouchablesOfTeam && $params->salary == 10) {
      $data['success'] = false;
      $data['message'] = "Ya tienes el máximo de intocables";
    } else {
      $query="UPDATE players SET salary=".$params->salary." where id=".$params->player;
      $resultado=mysqli_query($con, $query) or die("Error actualizando salario");
    //}
    echo json_encode($data);
    exit;
  }*/
?>
