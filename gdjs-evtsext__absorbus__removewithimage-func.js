
if (typeof gdjs.evtsExt__Absorbus__RemoveWithImage !== "undefined") {
  gdjs.evtsExt__Absorbus__RemoveWithImage.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Absorbus__RemoveWithImage = {};
gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1= [];
gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects2= [];
gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1= [];
gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects2= [];


gdjs.evtsExt__Absorbus__RemoveWithImage.mapOfGDgdjs_9546evtsExt_9595_9595Absorbus_9595_9595RemoveWithImage_9546GDImageObjectObjects1Objects = Hashtable.newFrom({"ImageObject": gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1});
gdjs.evtsExt__Absorbus__RemoveWithImage.mapOfGDgdjs_9546evtsExt_9595_9595Absorbus_9595_9595RemoveWithImage_9546GDObjectObjects1Objects = Hashtable.newFrom({"Object": gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1});
gdjs.evtsExt__Absorbus__RemoveWithImage.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("ImageObject"), gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__Sticker__IsStuck.func(runtimeScene, gdjs.evtsExt__Absorbus__RemoveWithImage.mapOfGDgdjs_9546evtsExt_9595_9595Absorbus_9595_9595RemoveWithImage_9546GDImageObjectObjects1Objects, eventsFunctionContext.getBehaviorName("StickerBehavior"), gdjs.evtsExt__Absorbus__RemoveWithImage.mapOfGDgdjs_9546evtsExt_9595_9595Absorbus_9595_9595RemoveWithImage_9546GDObjectObjects1Objects, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1 */
/* Reuse gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1[i].deleteFromScene(runtimeScene);
}
}{for(var i = 0, len = gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1[i].deleteFromScene(runtimeScene);
}
}}

}


};

gdjs.evtsExt__Absorbus__RemoveWithImage.func = function(runtimeScene, Object, ImageObject, StickerBehavior, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "ImageObject": ImageObject
},
  _objectArraysMap: {
"Object": gdjs.objectsListsToArray(Object)
, "ImageObject": gdjs.objectsListsToArray(ImageObject)
},
  _behaviorNamesMap: {
"StickerBehavior": StickerBehavior
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

gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects2.length = 0;

gdjs.evtsExt__Absorbus__RemoveWithImage.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__RemoveWithImage.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__RemoveWithImage.GDImageObjectObjects2.length = 0;


return;
}

gdjs.evtsExt__Absorbus__RemoveWithImage.registeredGdjsCallbacks = [];