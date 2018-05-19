$(function() {	
    var town = new Town();
    $("#btnVisitMeadhall").click(function() {town.visitMeadhall();});
	$("#btnTrain").click(function() {town.train();});
    $("#btnViewCharacter").click(function() {town.viewCharacter();});
    $("#btnLeaveTown").click(function() {town.leaveTown();});
});

function Town() {
    var _this = this;
    
    this.viewCharacter = function() {
        post("Town", "Character", gameSession, _this.viewCharacterSuccess, _this.viewCharacterFailed);
    };

    this.viewCharacterSuccess = function(data) {
        logInfo("enter town OK!");
        logInfo(JSON.stringify(data));
        
        if(data.town) {
            var hero = data.hero;
            logInfo("Viewing character sheet for [" + hero + "]!");
            drawCharacterSheet(hero);
        }
        else
            logInfo("There is no town at this location, continuing on map!");
    };

    this.viewCharacterFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.train = function() {
        post("Town", "Train", gameSession, _this.trainSuccess, _this.trainFailed);
    };

    this.trainSuccess = function() {
        logInfo("enter town OK!");
        logInfo(JSON.stringify(data));
        
        if(data.town) {
            var town = data.town;
            logInfo("Training in the town of [" + town.name + "]!");
            drawTraining(data.hero, data.trainingOutcome, data.town);
        }
        else
            logInfo("There is no town at this location, continuing on map!");
    };

    this.trainFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.visitMeadhall = function() {
        post("Town", "Meadhall", gameSession, _this.visitMeadhallSuccess, _this.visitMeadhallFailed);
    };

    this.visitMeadhallSuccess = function(data) {
        logInfo("enter town OK!");
        logInfo(JSON.stringify(data));
        
        if(data.town) {
            var town = data.town;
            logInfo("Entering the town of [" + town.name + "]!");
            drawMeadhall(town, data.actionResponse);
        }
        else
            logInfo("There is no town at this location, continuing on map!");
    };

    this.visitMeadhallFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.leaveTown = function() {
        post("Town", "Leave", gameSession, _this.leaveTownSuccess, _this.leaveTownFailed);
    };

    this.leaveTownSuccess = function(data) {
        logInfo("leave town OK!");
        logInfo(JSON.stringify(data));
        
        drawMap(data);
    };

    this.leaveTownFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.drawTown = function(town) {
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
    };

    this.drawMeadhall = function(town, actionResponse) {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#meadhallTextOverlay").show();
        $("#townBottomToolbar").show();
        
        $("#container").css("background-image", "url('./resources/images/meadhall-background.jpg')"); 	
        
        if(actionResponse.success) {
            $("#meadhallTextOverlay").html("You feel rested, and both body and mind feels renewed!<br/>");
            $("#meadhallTextOverlay").append("Your happily pay the head brewer what you owe him!");
        }
        else {
            $("#meadhallTextOverlay").html(actionResponse.reason + "<br/>");
        }
    };

    this.drawTraining = function(hero, trainingOutcome, town) {
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
    };

    this.drawCharacterSheet = function(hero) {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        //$("#characterScreenOverlay").show();
        $("#characterScreen").show();
        $("#townBottomToolbar").show();
        
        $("#container").css("background-image", "url('./resources/images/character-sheet-background.jpg')"); 	
        $("#characterScreenOverlay").html("This is the character screen!<br/>");
        //$("#characterScreenOverlay").append("The smith has around " + smithy.copper + " copper pieces!<br/>");
        
        $(".heroName").html("Name:" + hero.name);
        $(".heroLevel").html("Level:" + hero.level);
        $(".heroHP").html("HP:" + hero.hp);
        $(".heroMoney").html("Copper:" + hero.copper);
            
        for(var itemIndex in hero.items) {
            var name = hero.items[itemIndex].name;
            var itemImgUrl = "./resources/images/items/StoneHatchet_Icon.png";
            
            if(name == "long sword")
                itemImgUrl = "./resources/images/items/StoneHatchet_Icon.png";
            else if(name == "wooden sword")
                itemImgUrl = "./resources/images/items/the_axe_in_the_basement.png";
            else if(name == "silver long sword")
                itemImgUrl = "./resources/images/items/128px-Wooden_Shield.png";
            else if(name == "rabbits foot")
                itemImgUrl = "./resources/images/items/rabbits-foot.png";
            else if(name == "deer skin")
                itemImgUrl = "./resources/images/items/deer-skin.png";
            else if(name == "beetle shell")
                itemImgUrl = "./resources/images/items/beetle-shell.png";				
            
            $(".characterItemContainer:eq(" + itemIndex + ")").html('<img src="' + itemImgUrl + '" alt="' + name + '" title="' + name + '" style="height: 64px; width: 64px; position: absolute; top:6px; left: 6px;" />');
            
            var value = hero.items[itemIndex].value;
            if(!hero.items[itemIndex].value) value = 0;
            $(".characterItemContainerMetaData:eq(" + itemIndex + ")").html(name + '<br>Value: ' + value + ' cp');
            
            // Maximum of 6 items
            if (itemIndex > 5) {
                break;
            }
        }
    };
    
    this.drawCharacterSheetOld = function(hero) {
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
    }; 
}