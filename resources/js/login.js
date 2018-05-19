$(function() {	
    var login = new Login();

    $("#btnShowCreateLogin").click(function() {login.drawCreateLoginScreen();});	
	$("#btnCreateLogin").click(function() {login.createLogin();});	
    $("#btnLogin").click(function() {login.login();});
});

function Login() {
    var _this = this;

    this.createLogin = function() {
        var newClientLogin = {name:$("#newLogin").val(), password:$("#newPassword").val(), repeatedPassword:$("#newRepeatedPassword").val()};
        post("Login", "Create", newClientLogin, createLoginSuccess, createLoginFailed);
    };
    
    this.createLoginSuccess = function(data) {
        logInfo("create login OK!");
        logInfo(JSON.stringify(data));
        $("#statusMessage").html("");
        drawLoginScreen();
    };
    
    this.createLoginFailed = function(errorMsg) {
        logInfo(errorMsg);
        $("#statusMessage").html(errorMsg.reason);
    };
    
    this.login = function() {
        var clientLogin = {name:$("#login").val(), password:$("#password").val()};
        //callMethod("http://" + hostIp + ":" + hostPort, "login", clientLogin, loginSuccess, loginFailed);
        post("Login", "Login", clientLogin, loginSuccess, loginFailed);
    };
    
    var loginSuccess = function(serverGameSession) {
        logInfo("login OK!");
        logInfo(JSON.stringify(serverGameSession));
        
        $(".function").hide();
        $("#chooseHeroContainer").show();
        
        gameSession.publicKey = serverGameSession.publicKey;
        var heroes = serverGameSession.data.heroes;
    
        for(var key in heroes) {	
            $("#heroList").append('<option value="' + key + '">' + key + '</option>');		
        }
    };
    
    var loginFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.drawLoginScreen = function() {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#loginContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };
    
    this.drawCreateLoginScreen = function() {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#createLoginContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };
}