function equipCharacterItem(itemKey) {
    gameSession.itemKey = itemKey;
	callMethod("http://" + hostIp + ":" + hostPort, "equipCharacterItem", gameSession, equipCharacterItemSuccess, equipCharacterItemFailed);
};

function equipCharacterItemSuccess(data) {
	logInfo("call to buy smithy item succeeded!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
        if (data.equip.status == 1) {
            // play equip success sound
            // show equip item overlay
        }
        else {
            // play equip failed sound or none
            // show item equipped overlay (data.equip.failure)
        }
		drawCharacterSheet(data.hero);
	}
	else
		logInfo("You have to be in a town with a smithy to enter a smithy!");
};

function equipCharacterItemFailed(errorMsg) {
	logInfo(errorMsg);
};

function removeCharacterItem(itemKey) {
    gameSession.itemKey = itemKey;
	callMethod("http://" + hostIp + ":" + hostPort, "removeCharacterItem", gameSession, removeCharacterItemSuccess, removeCharacterItemFailed);
};

function removeCharacterItemSuccess(data) {
	logInfo("call to sell smithy item succeeded!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
        if (data.remove.status == 1) {
            // play sell success sound
            // show sell overlay
        }
        else {
            // play sell failed sound or none
            // show sell failed overlay (data.sell.failure)
        }
		drawCharacterSheet(data.hero);
	}
	else
		logInfo("You have to be in a town with a smithy to enter a smithy!");
};

function removeCharacterItemFailed(errorMsg) {
	logInfo(errorMsg);
};