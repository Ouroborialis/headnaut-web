
if (typeof gdjs.evtsExt__Absorbus__PlaceImage !== "undefined") {
  gdjs.evtsExt__Absorbus__PlaceImage.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Absorbus__PlaceImage = {};
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1= [];
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects2= [];
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1= [];
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects2= [];


gdjs.evtsExt__Absorbus__PlaceImage.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("ObjectImage"), gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1);
{for(var i = 0, len = gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1[i].setScale((( gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1[0].getWidth()) / 124);
}
}{for(var i = 0, len = gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1[i].setCenterPositionInScene((( gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1[0].getCenterXInScene()),(( gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1[0].getCenterYInScene()));
}
}}

}


};

gdjs.evtsExt__Absorbus__PlaceImage.func = function(runtimeScene, Object, ObjectImage, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "ObjectImage": ObjectImage
},
  _objectArraysMap: {
"Object": gdjs.objectsListsToArray(Object)
, "ObjectImage": gdjs.objectsListsToArray(ObjectImage)
},
  _behaviorNamesMap: {
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

gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1.length = 0;
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects2.length = 0;

gdjs.evtsExt__Absorbus__PlaceImage.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects1.length = 0;
gdjs.evtsExt__Absorbus__PlaceImage.GDObjectImageObjects2.length = 0;


return;
}

gdjs.evtsExt__Absorbus__PlaceImage.registeredGdjsCallbacks = [];