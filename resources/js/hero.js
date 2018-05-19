$(function() {
    var hero = new Hero();	
    $("#btnCreateHero").click(function() {hero.createHero(); });
	$("#btnChooseHero").click(function() {hero.chooseHero();});
});

function Hero() {

    this.chooseHero = function() {
        var heroName = $("#heroList").val();
        
        if (heroName) {
            gameSession.heroName = heroName;
            post("Hero", "ChooseHero", gameSession, chooseHeroSuccess, chooseHeroFailed);
        }	
    };
    
    var chooseHeroSuccess = function(data) {
        logInfo("choose hero OK!");
        if(data) {
            printDebug(data.hero);
            if(data.battle && data.battle.mob && data.battle.hero) { // The hero is already in a fight
                battle.drawBattleScreen(data.battle);
                logInfo("you resume the battle!");			
            }		
            else if(data.town)
                town.drawTown(data.town);
            else
                map.drawMap(data);
        }
        logInfo(JSON.stringify(data));
    };
    
    var chooseHeroFailed = function(errorMsg) {
        logInfo(errorMsg);
    };
    
    this.createHero = function() {
        var hero = { name: $("#newHeroName").val()};
        gameSession.data = hero;
        post("Hero", "Create", gameSession, createHeroSuccess, createHeroFailed);
    };
    
    var createHeroSuccess = function(data) {
        logInfo("create hero OK!");
        logInfo(JSON.stringify(data));
        var hero = data;
        $("#heroList").append('<option value="' + hero.name + '">' + hero.name + '</option>');
    };
    
    var createHeroFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.drawCreateHeroScreen = function() {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#createHeroContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };    
}