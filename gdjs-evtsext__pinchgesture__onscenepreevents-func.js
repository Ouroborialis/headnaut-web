
if (typeof gdjs.evtsExt__PinchGesture__onScenePreEvents !== "undefined") {
  gdjs.evtsExt__PinchGesture__onScenePreEvents.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__PinchGesture__onScenePreEvents = {};


gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount")) == 1;
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId").setNumber(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")));
}}

}


};gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.hasTouchEnded(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")));
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount").sub(1);
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.hasTouchEnded(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")));
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount").sub(1);
}
{ //Subevents
gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount")) == 1;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.hasTouchEnded(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")));
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount").setNumber(0);
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount")) == 2;
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount")) == 1;
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount").setNumber(2);
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId").setNumber(gdjs.evtTools.input.getStartedTouchIdentifier(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("Index"))));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchX").setNumber(gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.input.getStartedTouchIdentifier(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("Index"))), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchY").setNumber(gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.input.getStartedTouchIdentifier(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("Index"))), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchX").setNumber(gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchY").setNumber(gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningAngle").setNumber(gdjs.evtTools.common.angleBetweenPositions(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchX")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchY")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchX")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchY"))));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningDistance").setNumber(gdjs.evtTools.common.distanceBetweenPositions(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchX")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchY")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchX")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchY"))));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCenterX").setNumber((gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchX")) + gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchX"))) / 2);
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCenterY").setNumber((gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchY")) + gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchY"))) / 2);
}{gdjs.evtTools.debuggerTools.log("distance: " + gdjs.evtTools.variable.getVariableString(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningDistance")), "", "");
}}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount")) == 0;
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId").setNumber(gdjs.evtTools.input.getStartedTouchIdentifier(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("Index"))));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount").setNumber(1);
}}

}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("Index").add(1);
}}

}


};gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{


const repeatCount2 = gdjs.evtTools.input.getStartedTouchCount(runtimeScene);
for (let repeatIndex2 = 0;repeatIndex2 < repeatCount2;++repeatIndex2) {

let isConditionTrue_0 = false;
if (true)
{

{ //Subevents: 
gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList3(runtimeScene, eventsFunctionContext);} //Subevents end.
}
}

}


};gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.hasAnyTouchStarted(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount")) < 2;
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("Index").setNumber(0);
}
{ //Subevents
gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList4(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList6 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("TouchCount")) == 2;
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("CurrentAngle").setNumber(gdjs.evtTools.common.angleBetweenPositions(gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("CurrentDistance").setNumber(gdjs.evtTools.common.distanceBetweenPositions(gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("CurrentCenterX").setNumber((gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) + gdjs.evtsExt__PinchGesture__TouchCanvasX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) / 2);
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("CurrentCenterY").setNumber((gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("FirstTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) + gdjs.evtsExt__PinchGesture__TouchCanvasY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("SecondTouchId")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) / 2);
}}

}


};gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList7 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList2(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList5(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList6(runtimeScene, eventsFunctionContext);
}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__PinchGesture__IsCameraPinchEnabled.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {
{gdjs.evtsExt__PinchGesture__PinchCamera.func(runtimeScene, gdjs.evtTools.variable.getVariableString(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("CameraPinchLayer")), gdjs.evtTools.variable.getVariableString(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("CameraPinchConstraint")), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}}

}


};

gdjs.evtsExt__PinchGesture__onScenePreEvents.func = function(runtimeScene, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("PinchGesture"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("PinchGesture"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__PinchGesture__onScenePreEvents.eventsList7(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__PinchGesture__onScenePreEvents.registeredGdjsCallbacks = [];
gdjs.evtsExt__PinchGesture__onScenePreEvents.registeredGdjsCallbacks.push((runtimeScene) => {
    gdjs.evtsExt__PinchGesture__onScenePreEvents.func(runtimeScene, runtimeScene);
})
gdjs.registerRuntimeScenePreEventsCallback(gdjs.evtsExt__PinchGesture__onScenePreEvents.registeredGdjsCallbacks[gdjs.evtsExt__PinchGesture__onScenePreEvents.registeredGdjsCallbacks.length - 1]);
