
if (typeof gdjs.evtsExt__Absorbus__AreGoingNearer !== "undefined") {
  gdjs.evtsExt__Absorbus__AreGoingNearer.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Absorbus__AreGoingNearer = {};
gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1= [];
gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects2= [];
gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1= [];
gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects2= [];


gdjs.evtsExt__Absorbus__AreGoingNearer.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("Other"), gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (((( gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1[0].getCenterXInScene()) - (( gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1[0].getCenterXInScene())) * ((( gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Physics")).getLinearVelocityX()) - (( gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Physics")).getLinearVelocityX())) + ((( gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1[0].getCenterYInScene()) - (( gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1[0].getCenterYInScene())) * ((( gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Physics")).getLinearVelocityY()) - (( gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("OtherPhysics")).getLinearVelocityY())) > 0);
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Absorbus__AreGoingNearer.func = function(runtimeScene, Object, Physics, Other, OtherPhysics, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "Other": Other
},
  _objectArraysMap: {
"Object": gdjs.objectsListsToArray(Object)
, "Other": gdjs.objectsListsToArray(Other)
},
  _behaviorNamesMap: {
"Physics": Physics
, "OtherPhysics": OtherPhysics
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Absorbus"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Absorbus"),
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

gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1.length = 0;
gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects2.length = 0;

gdjs.evtsExt__Absorbus__AreGoingNearer.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__AreGoingNearer.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects1.length = 0;
gdjs.evtsExt__Absorbus__AreGoingNearer.GDOtherObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}

gdjs.evtsExt__Absorbus__AreGoingNearer.registeredGdjsCallbacks = [];