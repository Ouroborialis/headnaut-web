
if (typeof gdjs.evtsExt__PinchGesture__PinchCamera !== "undefined") {
  gdjs.evtsExt__PinchGesture__PinchCamera.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__PinchGesture__PinchCamera = {};


gdjs.evtsExt__PinchGesture__PinchCamera.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterX").setNumber(gdjs.evtTools.camera.getCameraX(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterY").setNumber(gdjs.evtTools.camera.getCameraY(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraAngle").setNumber(gdjs.evtTools.camera.getCameraRotation(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraZoom").setNumber(gdjs.evtTools.camera.getCameraZoom(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}}

}


};gdjs.evtsExt__PinchGesture__PinchCamera.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{gdjs.evtTools.camera.setCameraX(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterX")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}{gdjs.evtTools.camera.setCameraY(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterY")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}{gdjs.evtTools.camera.setCameraRotation(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraAngle")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}{gdjs.evtTools.camera.setCameraZoom(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraZoom")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}}

}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("DeltaX").setNumber(gdjs.evtsExt__PinchGesture__InversedX.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterX")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterY")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterX")));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("DeltaY").setNumber(gdjs.evtsExt__PinchGesture__InversedY.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterX")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterY")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterY")));
}}

}


{


let isConditionTrue_0 = false;
{
{gdjs.evtTools.camera.setCameraX(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterX")) + gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("DeltaX")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}{gdjs.evtTools.camera.setCameraY(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraCenterY")) + gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("DeltaY")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}{gdjs.evtTools.camera.setCameraRotation(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraAngle")) - gdjs.evtsExt__PinchGesture__Rotation.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}{gdjs.evtTools.camera.setCameraZoom(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BeginningCameraZoom")) * gdjs.evtsExt__PinchGesture__Scaling.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}}

}


};gdjs.evtsExt__PinchGesture__PinchCamera.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Constraint") : "") == "Zoom only");
}
if (isConditionTrue_0) {
{gdjs.evtTools.camera.setCameraRotation(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraAngle")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Constraint") : "") == "Rotation only");
}
if (isConditionTrue_0) {
{gdjs.evtTools.camera.setCameraZoom(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraZoom")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}}

}


};gdjs.evtsExt__PinchGesture__PinchCamera.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Constraint") : "") != "No constraint");
}
if (isConditionTrue_0) {
{gdjs.evtTools.camera.setCameraX(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraCenterX")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}{gdjs.evtTools.camera.setCameraY(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraCenterY")), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0);
}
{ //Subevents
gdjs.evtsExt__PinchGesture__PinchCamera.eventsList2(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__PinchGesture__PinchCamera.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(44697276);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__PinchGesture__PinchCamera.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{



}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraCenterX").setNumber(gdjs.evtTools.camera.getCameraX(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraCenterY").setNumber(gdjs.evtTools.camera.getCameraY(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraAngle").setNumber(gdjs.evtTools.camera.getCameraRotation(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}{runtimeScene.getScene().getVariables().get("__PinchGesture").getChild("BackupCameraZoom").setNumber(gdjs.evtTools.camera.getCameraZoom(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), 0));
}}

}


{


gdjs.evtsExt__PinchGesture__PinchCamera.eventsList1(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__PinchGesture__PinchCamera.eventsList3(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__PinchGesture__PinchCamera.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__PinchGesture__IsPinching.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__PinchGesture__PinchCamera.eventsList4(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__PinchGesture__PinchCamera.func = function(runtimeScene, Layer, Constraint, parentEventsFunctionContext) {
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
if (argName === "Layer") return Layer;
if (argName === "Constraint") return Constraint;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__PinchGesture__PinchCamera.eventsList5(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__PinchGesture__PinchCamera.registeredGdjsCallbacks = [];