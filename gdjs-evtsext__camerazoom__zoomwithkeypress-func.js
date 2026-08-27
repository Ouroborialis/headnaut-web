
if (typeof gdjs.evtsExt__CameraZoom__ZoomWithKeypress !== "undefined") {
  gdjs.evtsExt__CameraZoom__ZoomWithKeypress.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__CameraZoom__ZoomWithKeypress = {};


gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("ZoomInKey") : ""));
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.camera.getCameraZoom(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Camera")) || 0 : 0)) < gdjs.evtTools.common.toNumber((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("MaxZoom") : "")));
}
}
if (isConditionTrue_0) {
{gdjs.evtsExt__CameraZoom__ZoomWithSpeed.func(runtimeScene, Math.max(1, (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ZoomSpeed")) || 0 : 0)), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Camera")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}}

}


};gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("ZoomOutKey") : ""));
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.camera.getCameraZoom(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Camera")) || 0 : 0)) > gdjs.evtTools.common.toNumber((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("MinZoom") : "")));
}
}
if (isConditionTrue_0) {
{gdjs.evtsExt__CameraZoom__ZoomWithSpeed.func(runtimeScene, 1 / Math.max(1, (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ZoomSpeed")) || 0 : 0)), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Camera")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}}

}


};gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("MaxZoom")) || 0 : 0) != 0);
}
if (isConditionTrue_0) {
{gdjs.evtTools.camera.setCameraZoom(runtimeScene, gdjs.evtTools.common.clamp(gdjs.evtTools.camera.getCameraZoom(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Camera")) || 0 : 0)), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("MinZoom")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("MaxZoom")) || 0 : 0)), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Camera")) || 0 : 0));
}}

}


};gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList1(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList2(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__CameraZoom__ZoomWithKeypress.func = function(runtimeScene, Layer, Camera, ZoomSpeed, MinZoom, MaxZoom, ZoomInKey, ZoomOutKey, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("CameraZoom"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("CameraZoom"),
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
if (argName === "Camera") return Camera;
if (argName === "ZoomSpeed") return ZoomSpeed;
if (argName === "MinZoom") return MinZoom;
if (argName === "MaxZoom") return MaxZoom;
if (argName === "ZoomInKey") return ZoomInKey;
if (argName === "ZoomOutKey") return ZoomOutKey;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__CameraZoom__ZoomWithKeypress.eventsList3(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__CameraZoom__ZoomWithKeypress.registeredGdjsCallbacks = [];