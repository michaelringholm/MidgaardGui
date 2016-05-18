var gameSession = {};
var canvasLayer1 = document.getElementById("canvasLayer1");
var canvasLayer2 = document.getElementById("canvasLayer2");
var canvasHeight = 0;
var canvasWidth = 0;
var hostIp = "";
var hostPort = 0;

$(function() {	
	//hostIp = "www.opusmagus.com";
	//hostPort = 83;
	hostIp = "localhost";
	hostPort = 1337;
	
	canvasLayer1 = document.getElementById("canvasLayer1");
	canvasLayer2 = document.getElementById("canvasLayer2");
	canvasWidth = 1200;
	canvasHeight = 800;
	canvasLayer1.width = canvasWidth;
	canvasLayer1.height = canvasHeight;
	canvasLayer2.width = canvasWidth;
	canvasLayer2.height = canvasHeight;
		
	$("#btnShowCreateLogin").click(function() {drawCreateLoginScreen();});
	
	$("#btnCreateLogin").click(function() {createLogin();});
	$("#btnCreateHero").click(function() { createHero(); });
	$("#btnLogin").click(function() {login();});
	$("#btnChooseHero").click(function() {chooseHero();});
	
	$("#btnMove").click(function() {move();});
	$("#btnNextRound").click(function() {nextRound();});
	$("#btnEnterTown").click(function() {enterTown();});
	$("#btnLeaveTown").click(function() {leaveTown();});
	$("#btnExitDeathScreen").click(function() {enterTown();});	
	
	$("#btnVisitMeadhall").click(function() {visitMeadhall();});
	$("#btnTrain").click(function() {train();});
	$("#btnVisitSmithy").click(function() {visitSmithy();});
	$("#btnViewCharacter").click(function() {viewCharacter();});
	
	$("#btnExitDeathScreen").click(function() {nextRound();});
	$("#btnExitTreasureScreen").click(function() {nextRound();});
  
	$("#gSessionId").html("gSessionId: N/A");
});

function viewCharacter() {
	callMethod("http://" + hostIp + ":" + hostPort, "viewCharacter", gameSession, viewCharacterSuccess, viewCharacterFailed);
}

function viewCharacterSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var hero = data.hero;
		logInfo("Viewing character sheet for [" + hero + "]!");
		drawCharacterSheet(hero);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function viewCharacterFailed(errorMsg) {
	logInfo(errorMsg);
}

function visitSmithy() {
	callMethod("http://" + hostIp + ":" + hostPort, "visitSmithy", gameSession, visitSmithySuccess, visitSmithyFailed);
}

function visitSmithySuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town && data.smithy) {
		var town = data.town;
		logInfo("Entering the smithy in [" + town.name + "]!");
		drawSmithy(data.smithy);
	}
	else
		logInfo("You have to be in a town to enter the smithy!");
}

function visitSmithyFailed(errorMsg) {
	logInfo(errorMsg);
}

function train() {
	callMethod("http://" + hostIp + ":" + hostPort, "train", gameSession, trainSuccess, trainFailed);
}

function trainSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Training in the town of [" + town.name + "]!");
		drawTraining(data.hero, data.trainingOutcome, data.town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function trainFailed(errorMsg) {
	logInfo(errorMsg);
}

function visitMeadhall() {
	callMethod("http://" + hostIp + ":" + hostPort, "visitMeadhall", gameSession, visitMeadhallSuccess, visitMeadhallFailed);
}

function visitMeadhallSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Entering the town of [" + town.name + "]!");
		drawMeadhall(town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function visitMeadhallFailed(errorMsg) {
	logInfo(errorMsg);
}

function enterTown() {
	callMethod("http://" + hostIp + ":" + hostPort, "enterTown", gameSession, enterTownSuccess, enterTownFailed);
}

function enterTownSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Entering the town of [" + town.name + "]!");
		drawTown(town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function enterTownFailed(errorMsg) {
	logInfo(errorMsg);
}

function leaveTown() {
	callMethod("http://" + hostIp + ":" + hostPort, "leaveTown", gameSession, leaveTownSuccess, leaveTownFailed);
}

function leaveTownSuccess(data) {
	logInfo("leave town OK!");
	logInfo(JSON.stringify(data));
	
	drawMap(data);
}

function leaveTownFailed(errorMsg) {
	logInfo(errorMsg);
}

function nextRound() {
	$("#battleButtonBar").hide();
	gameSession.attackType = $("#attackType").val();	
	callMethod("http://" + hostIp + ":" + hostPort, "nextRound", gameSession, nextRoundSuccess, nextRoundFailed);
}

function nextRoundSuccess(data) {
	logInfo("next round OK!");
	
	if(data) {
		if(data.battle) {
			var battle = data.battle;
			var hero = data.hero;
			if(battle.status.over) {
				logInfo("Battle is over!");
				if(battle.status.winner == hero.name) {
					drawBattleScreen(battle);
					setTimeout(function() { drawTreasureScreen(battle); },5500);					
				}
				else {
					drawBattleScreen(battle);
					setTimeout(function() { drawDeathScreen(hero); },5500);										
				}
			}
			else
				drawBattleScreen(battle);			
		}
		else {
			logInfo("Battle was already over!");
			drawMap(data);
		}
	}
}

function nextRoundFailed(errorMsg) {
	logInfo(errorMsg);
}

function move(direction) {
	if(!direction)
		gameSession.direction = $("#direction").val();
	else
		gameSession.direction = direction;
	
	callMethod("http://" + hostIp + ":" + hostPort, "move", gameSession, moveSuccess, moveFailed);
}

function moveSuccess(data) {
	logInfo("move hero OK!");
	logInfo(JSON.stringify(data));
	
	if(data) {
		if(data.terrainType) { // The move resulted in an actual move
			var location = data;
			var targetCoordinates = location.targetCoordinates;			
			drawHeroMapIcon(canvasLayer2, targetCoordinates.x, targetCoordinates.y);
			logInfo("you moved to a new location");
		}
		else if(data.hero && data.mob) { // The move resulted in a fight
			var battle = data;
			drawBattleScreen(battle);
			logInfo("you were surprised by monsters!");
		}
	}
}

function moveFailed(errorMsg) {
	logInfo(errorMsg);
}

function chooseHero() {
	var heroName = $("#heroList").val();
	
	if (heroName) {
		gameSession.heroName = heroName;
		callMethod("http://" + hostIp + ":" + hostPort, "chooseHero", gameSession, chooseHeroSuccess, chooseHeroFailed);
	}	
}

function chooseHeroSuccess(data) {
	logInfo("choose hero OK!");
	if(data) {		
		if(data.battle && data.battle.mob && data.battle.hero) { // The hero is already in a fight
			drawBattleScreen(data.battle);
			logInfo("you resume the battle!");
		}		
		else if(data.town)
			drawTown(data.town);
		else
			drawMap(data);
	}
	logInfo(JSON.stringify(data));
}

function chooseHeroFailed(errorMsg) {
	logInfo(errorMsg);
}

function createHero() {
	var hero = { name: $("#newHeroName").val()};
	gameSession.data = hero;
	callMethod("http://" + hostIp + ":" + hostPort, "createHero", gameSession, createHeroSuccess, createHeroFailed);
}

function createHeroSuccess(data) {
	logInfo("create hero OK!");
	logInfo(JSON.stringify(data));
	var hero = data;
	$("#heroList").append('<option value="' + hero.name + '">' + hero.name + '</option>');
}

function createHeroFailed(errorMsg) {
	logInfo(errorMsg);
}

function createLogin() {
	var newClientLogin = {name:$("#newLogin").val(), password:$("#newPassword").val(), repeatedPassword:$("#newRepeatedPassword").val()};
	callMethod("http://" + hostIp + ":" + hostPort, "createLogin", newClientLogin, createLoginSuccess, createLoginFailed);
}

function createLoginSuccess(data) {
	logInfo("create login OK!");
	logInfo(JSON.stringify(data));
	$("#statusMessage").html("");
	drawLoginScreen();
}

function createLoginFailed(errorMsg) {
	logInfo(errorMsg);
	$("#statusMessage").html(errorMsg.reason);
}

function login() {
	var clientLogin = {name:$("#login").val(), password:$("#password").val()};
	callMethod("http://" + hostIp + ":" + hostPort, "login", clientLogin, loginSuccess, loginFailed);
}

function loginSuccess(serverGameSession) {
	logInfo("login OK!");
	logInfo(JSON.stringify(serverGameSession));
	
	$(".function").hide();
	$("#chooseHeroContainer").show();
	
	gameSession.publicKey = serverGameSession.publicKey;
	var heroes = serverGameSession.data.heroes;

	for(var key in heroes) {	
		$("#heroList").append('<option value="' + key + '">' + key + '</option>');		
	}
}

function loginFailed(errorMsg) {
	logInfo(errorMsg);
}

function logInfo(msg) {
	$("#status").prepend("[INFO]: " + msg + "<br/>");
}

function drawMap(data) {
	$(".function").hide();
	$(canvasLayer1).show();
	$(canvasLayer2).show();
	$("#mapBottomToolbar").show();
	
	$("#container").keypress(function(e) { 
		if(e.which == 100 || e.which == 97 || e.which == 115 || e.which == 119) {
			e.preventDefault();
			moveHero(e.which);
		}
	});
	
	var ctx1 = canvasLayer1.getContext("2d");
	var ctx2 = canvasLayer2.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	ctx2.clearRect(0,0,canvasWidth,canvasHeight);
	
	if(data) {
		var name = data.map.name;
		var mapMatrix = data.map.mapMatrix;
		var hero = data.hero;
		$("#container").css("background-image", "url('./resources/images/map-background.jpg')");
		
		for(var yIndex in mapMatrix) {
			for(var xIndex in mapMatrix[yIndex]) {
				drawMapTile(canvasLayer1, xIndex*32,yIndex*32,mapMatrix[yIndex][xIndex]);
			}
		}		

		drawHeroMapIcon(canvasLayer2,hero.currentCoordinates.x,hero.currentCoordinates.y);
	}
}

function drawMapTile(canvas, xPos, yPos, terrainType) {
	var ctx = canvas.getContext("2d");
	var img = null;
	
	if(terrainType == "w")
		img = document.getElementById("woods");
	else if(terrainType == "m")
		img = document.getElementById("mountains");
	else if(terrainType == "h")
		img = document.getElementById("mountains");		
	else if(terrainType == "t")
		img = document.getElementById("town");
	else if(terrainType == "r")
		img = document.getElementById("road");
	else if(terrainType == "c")
		img = document.getElementById("cave");

	if(!img)
		logInfo("The image for terrainType [" + terrainType + "] was not found!");
	else
		ctx.drawImage(img,xPos,yPos,32,32);
}

var pixelMultiplier = 32;
function drawHeroMapIcon(canvas, xPos, yPos) {
	logInfo("drawHeroMapIcon called!");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	var img = document.getElementById("heroMapIcon");
	ctx.drawImage(img,xPos*pixelMultiplier,yPos*pixelMultiplier,32,32);
}

function moveHero(keyCode) {	
	var stepSize = 32;
	var direction = null;
	
	if(keyCode == 100) { // D which is east
		//currentHeroXPos = currentHeroXPos+stepSize;    		
		direction = "east";
	}
	if(keyCode == 119) { // W which is north
		//currentHeroYPos = currentHeroYPos-stepSize;    		
		direction = "north";
	}		
	if(keyCode == 97) { // A which is west
		//currentHeroXPos = currentHeroXPos-stepSize;    		
		direction = "west";
	}		
	if(keyCode == 115) { // S which is south
		//currentHeroYPos = currentHeroYPos+stepSize;    		        
		direction = "south";
	}		
		
	if(direction) {
		move(direction);		
	}
	else
		logInfo("Invalid move direction!");
};  

function getMobImgSrc(mob) {
	var imgSrc = null;
	imgSrc = "./resources/images/mobs/" + mob.key + ".png";
	
	if (!imgSrc) {
		logInfo("No image found for mob [" + mob.key + "]!");
		return "./resources/images/mobs/wild-boar.png";
	}
		
	return imgSrc;		
}

function battleAnimation1(targetHPDiv, targetCardDiv, damageImpact, finalHP, fnCallback) { 
	var audio = new Audio('./resources/sounds/sword-attack.wav');
	//var orgLeftPos = $(targetHPDiv).css("left");
	//$(targetHPDiv).css("left", orgLeftPos-40);
	
	$(targetHPDiv)
		.switchClass("plainText", "strikedText", 1500)
		.effect("pulsate", 2500)
		.switchClass("strikedText", "plainText", 1000)
		.effect("pulsate", function() { $(targetHPDiv).html(damageImpact + ' damage!').fadeIn(100);  audio.play(); }, 2500)
		.effect("pulsate", function() { $(targetHPDiv).html(finalHP + ' HP').fadeIn(100);}, 1500)
		.fadeIn(100, function() { $(targetCardDiv).effect("shake", 800); fnCallback(); });
};

function drawBattleScreen(battle) {
	$(".function").hide();
	$(canvasLayer1).hide();
	$(canvasLayer2).hide();
	$("#battleButtonBar").hide();
	
	$("#battleContainer").show()
	$("#battleBottomToolbar").show();

	$("#container").css("background-image", "url('./resources/images/battle-background.jpg')"); 	
	$("#battleHeroContainer").attr("src", $("#warriorHero").attr("src"));
		
	var imgSrc = getMobImgSrc(battle.mob);
	$("#battleMobContainer").attr("src", imgSrc);
	
	$("#heroName").html(battle.hero.name);
	$("#mobName").html(battle.mob.name);
	if (battle.mob.name.length > 8)
		$("#mobName").css("font-size", "10px");
	else
		$("#mobName").css("font-size", "16px");
		
					
	if (battle.status.over) {
		if(battle.status.winner == battle.hero.name) {
			$("#battleMobContainer").attr("src", $("#dead").attr("src"));
			$("#heroHP").html(battle.hero.hp + " HP");
			$("#mobHP").html(0 + " HP");
		}
		else {
			$("#battleHeroContainer").attr("src", $("#dead").attr("src"));
			$("#heroHP").html(battle.hero.hp + " HP");
			$("#mobHP").html(0 + " HP");
		}
	}
	else {
		if(battle.round*1 > 0) {
			$("#heroHP").html((battle.hero.hp*1+battle.mob.damageImpact*1) + " HP");
			$("#mobHP").html((battle.mob.hp*1+battle.hero.damageImpact*1) + " HP");
			
			if(battle.hero.damageImpact > 0) {
				battleAnimation1("#mobHP", "#battleMobContainer", battle.hero.damageImpact*1, battle.mob.hp*1, function() {
					if(battle.mob.damageImpact > 0) {
						battleAnimation1("#heroHP", "#battleHeroContainer", battle.mob.damageImpact*1, battle.hero.hp*1, function() {
							$("#battleButtonBar").show();
						});
					}
				});
			}
			else if(battle.mob.damageImpact > 0) {
				battleAnimation1("#heroHP", "#battleHeroContainer", battle.mob.damageImpact*1, battle.hero.hp*1, function() {
					$("#battleButtonBar").show();
				});
			}
			else
				$("#battleButtonBar").show();
		}
		else {
			$("#heroHP").html(battle.hero.hp + " HP");
			$("#mobHP").html(battle.mob.hp + " HP");
		}
	}	
}

function drawCharacterSheet(hero) {
	$(".function").hide();
	$(canvasLayer2).hide();
	$(canvasLayer1).show();
	$("#townBottomToolbar").show();
	
	var ctx1 = canvasLayer1.getContext("2d");
	
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	
	$("#container").css("background-image", "url('./resources/images/character-sheet-background.jpg')"); 
	
	ctx1.font = "18px midgaardFont";
	ctx1.fillStyle = '#e1b91a';
	
	ctx1.fillText("LEVEL:" + hero.level,540,100);
	
	ctx1.fillText("HP:" + hero.hp + " (" + hero.baseHp + ")",340,200);
	ctx1.fillText("MANA:" + hero.mana + " (" + hero.baseMana + ")",340,230);
	ctx1.fillText("AC:" + hero.ac + " (" + hero.baseAc + ")",340,260);
	ctx1.fillText("XP:" + hero.xp,340,290);
	ctx1.fillText("COPPER:" + hero.copper,340,320);
	
	ctx1.fillText("STRENGTH:" + hero.str,740,200);
	ctx1.fillText("STAMINA:" + hero.sta,740,230);
	ctx1.fillText("INTELLIGENCE:" + hero.int,740,260);
	ctx1.fillText("REGEN:" + hero.regen,740,290);
	ctx1.fillText("LUCK:" + hero.luck,740,320);	
}

function drawTown(town) {
	$(".function").hide();
	$(canvasLayer1).show();
	$(canvasLayer2).show();
	$("#townBottomToolbar").show();
	
	var ctx1 = canvasLayer1.getContext("2d");
	var ctx2 = canvasLayer2.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	ctx2.clearRect(0,0,canvasWidth,canvasHeight);
	
	//var townImg = document.getElementById("town");		
	//ctx1.drawImage(townImg,50,50,120,190);
	
	$("#container").css("background-image", "url('./resources/images/town.jpg')"); 
	
	ctx1.font = "28px Calibri";
	ctx1.fillStyle = '#3D3A36';
  ctx1.fillText(town.name,50,30);
}

function drawLoginScreen() {
	$(".function").hide();
	$(canvasLayer2).hide();
	$(canvasLayer1).hide();
	$("#loginContainer").show();
	
	$("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
}

function drawCreateLoginScreen() {
	$(".function").hide();
	$(canvasLayer2).hide();
	$(canvasLayer1).hide();
	$("#createLoginContainer").show();
	
	$("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
}

function drawCreateHeroScreen() {
	$(".function").hide();
	$(canvasLayer2).hide();
	$(canvasLayer1).hide();
	$("#createHeroContainer").show();
	
	$("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
}

function drawMeadhall(town) {
	$(".function").hide();
	$(canvasLayer2).hide();
	$(canvasLayer1).hide();
	$("#meadhallTextOverlay").show();
	$("#townBottomToolbar").show();
	
	$("#container").css("background-image", "url('./resources/images/meadhall-background.jpg')"); 	
	
	$("#meadhallTextOverlay").html("You feel rested, and both body and mind feels renewed!<br/>");
	$("#meadhallTextOverlay").append("Your happily pay the head brewer what you owe him!");
}

function drawTreasureScreen(battle) {
	logInfo("showing treasure screen!");
	$(".function").hide();	
	$(canvasLayer2).hide();
	$(canvasLayer1).show();
	$("#treasureScreenButtonBar").show();	
	
	var ctx1 = canvasLayer1.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	
	$("#container").css("background-image", "url('./resources/images/loot.jpg')");
	
	ctx1.font = "28px Calibri";
	ctx1.fillStyle = '#E4CA64';
  ctx1.fillText("You gained [" + battle.mob.xp + "] XP!",50,30);
	
	if(battle.mob.copper > 0)
		ctx1.fillText("You looted [" + battle.mob.copper + "] copper!",50,60);
	
	if(battle.mob.items && battle.mob.items.length > 0)
		ctx1.fillText("You found items while searching the corpse!",50,90);
}

function drawDeathScreen(hero) {
	logInfo("showing death screen!");	
	$(".function").hide();	
	$(canvasLayer2).hide();
	$(canvasLayer1).hide();

	$("#deathScreenTextOverlay").show();
	$("#deathScreenBottomToolbar").show();		
	
	$("#container").css("background-image", "url('./resources/images/valkyrie.jpg')");
	
	$("#deathScreenTextOverlay").html("You died and lost XP and stamina!<br/>");
	$("#deathScreenTextOverlay").append("You soul will be summoned by a Valkyrie to your home town if you accept your fate!");
}

function drawTraining(hero, trainingOutcome, town) {
	logInfo("showing training screen!");
	$(".function").hide();
	$(canvasLayer2).hide();
	$(canvasLayer1).show();
	$("#townBottomToolbar").show();
	
	var ctx1 = canvasLayer1.getContext("2d");
	//var ctx2 = canvasLayer2.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	//ctx2.clearRect(0,0,canvasWidth,canvasHeight);
	
	$("#container").css("background-image", "url('./resources/images/training-background.jpg')"); 
	
	ctx1.font = "28px Calibri";
	ctx1.fillStyle = '#3D3A36';
  ctx1.fillText(town.name,50,30);
	
	ctx1.font = "20px Calibri";
	ctx1.fillStyle = '#E4CA64';
	
	if(trainingOutcome.trained) {
		ctx1.fillText("You trained hard and gained a level!. You are now level [" + hero.level + "]",70,90);
	}
	else {
		ctx1.fillText(trainingOutcome.reason,70,90);
	}
}

function drawSmithy(smithy) {
	$(".function").hide();
	$(canvasLayer2).hide();
	$(canvasLayer1).hide();
	$("#smithyOverlay").show();
	$("#smithyInventory").show();
	$("#townBottomToolbar").show();
	
	$("#container").css("background-image", "url('./resources/images/smithy-background.jpg')"); 
	
	
	//ctx1.fillStyle = '#F9D526';
	$("#smithyOverlay").html("Welcome to my smithy!<br/>");
	
	//ctx1.font = "16px Calibri";
	$("#smithyOverlay").append("The smith has around " + smithy.copper + " copper pieces!<br/>");
	/*$("#smithyOverlay").append("He has the following items for sale:<br/>");
	
	//ctx1.font = "14px Calibri";
	$("#smithyOverlay").append('<div class="tableCell">Item:</div>');
	$("#smithyOverlay").append('<div class="tableCell">Cost:</div>');
	$("#smithyOverlay").append('<div class="tableCell">Attributes:</div><br/>');*/
		
	for(var itemIndex in smithy.items) {
		var name = smithy.items[itemIndex].name;
		var itemImgUrl = "./resources/images/org/items/StoneHatchet_Icon.png";
		
		if(name == "long sword")
			itemImgUrl = "./resources/images/org/items/StoneHatchet_Icon.png";
		else if(name == "wooden sword")
			itemImgUrl = "./resources/images/org/items/the_axe_in_the_basement.png";
		else if(name == "silver long sword")
			itemImgUrl = "./resources/images/org/items/128px-Wooden_Shield.png";					
		
		$(".smithyItemContainer:eq(" + itemIndex + ")").html('<img src="' + itemImgUrl + '" alt="' + name + '" title="' + name + '" style="height: 64px; width: 64px; position: absolute; top:6px; left: 6px;" />');
		/*var row = $("#smithyOverlay").append('<div class="tableRow"></div>');
		row.append('<div class="tableCell">' + smithy.items[itemIndex].name + '</div>');
		row.append('<div class="tableCell">' + smithy.items[itemIndex].cost + ' cp</div>');
		row.append('<div class="tableCell">' + smithy.items[itemIndex].atkMin + '-' + smithy.items[itemIndex].atkMax + '</div>');*/
		
		if (itemIndex > 5) {
            break;
        }
	}
};


function callMethod(host, methodName, data, fnSuccess, fnError) {
	$.ajax({
			type: "POST",
			dataType: "json",
			origin: "http://127.0.0.1",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			url: host + "/" + methodName,
			cache: false,
			beforeSend : function() {},
			success: function(data)	{
				logInfo("call succeeded!");				
				if(fnSuccess)	fnSuccess(data);
			},
			error: function(error, status) {
				logInfo("call failed!");		
				if(fnError) fnError(error.responseText);
			},			
			complete : function() {}
	});
}

function callMethodJsonp(host, methodName, data) {
	$.ajax({
			type: "POST",
			dataType: "jsonp",
			jsonpCallback: 'callback',
			contentType: "application/jsonp; charset=utf-8",
			data: JSON.stringify(data),
			url: host + "/" + methodName,
			cache: false,
			beforeSend : function() {},
			success: function(returnValue)
			{
				$("#status").html("call succeeded!");
			},
			complete : function() {}
	});
}