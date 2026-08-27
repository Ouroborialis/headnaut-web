
if (typeof gdjs.evtsExt__Absorbus__Absorb !== "undefined") {
  gdjs.evtsExt__Absorbus__Absorb.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Absorbus__Absorb = {};
gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1= [];
gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects2= [];
gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1= [];
gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects2= [];


gdjs.evtsExt__Absorbus__Absorb.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Eaten"), gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1);
{runtimeScene.getScene().getVariables().get("shrinkedObjectSize").setNumber(2 * Math.max(0, (( gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[0].getDistanceToObject((gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length !== 0 ? gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1[0] : null))) - (( gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[0].getWidth()) / 2));
}{runtimeScene.getScene().getVariables().get("givenMatter").setNumber((( gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1[0].getWidth()) * (( gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1[0].getWidth()) - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("shrinkedObjectSize")) * gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("shrinkedObjectSize")));
}{runtimeScene.getScene().getVariables().get("grownObjectSize").setNumber(Math.sqrt((( gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[0].getWidth()) * (( gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[0].getWidth()) + gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("givenMatter"))));
}{for(var i = 0, len = gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Physics2")).setLinearVelocityX(((gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getWidth()) * (gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getWidth()) * (gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Physics2")).getLinearVelocityX()) + gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("givenMatter")) * (( gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Physics2")).getLinearVelocityX())) / (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("grownObjectSize")) * gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("grownObjectSize"))));
}
}{for(var i = 0, len = gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Physics2")).setLinearVelocityY(((gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getWidth()) * (gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getWidth()) * (gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Physics2")).getLinearVelocityY()) + gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("givenMatter")) * (( gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Physics2")).getLinearVelocityY())) / (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("grownObjectSize")) * gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("grownObjectSize"))));
}
}{for(var i = 0, len = gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1[i].setSize(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("grownObjectSize")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("grownObjectSize")));
}
}{for(var i = 0, len = gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1[i].setSize(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("shrinkedObjectSize")), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("shrinkedObjectSize")));
}
}}

}


};

gdjs.evtsExt__Absorbus__Absorb.func = function(runtimeScene, Object, Physics2, Eaten, OtherPhysics2, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "Eaten": Eaten
},
  _objectArraysMap: {
"Object": gdjs.objectsListsToArray(Object)
, "Eaten": gdjs.objectsListsToArray(Eaten)
},
  _behaviorNamesMap: {
"Physics2": Physics2
, "OtherPhysics2": OtherPhysics2
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

gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length = 0;
gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects2.length = 0;

gdjs.evtsExt__Absorbus__Absorb.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects1.length = 0;
gdjs.evtsExt__Absorbus__Absorb.GDObjectObjects2.length = 0;
gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects1.length = 0;
gdjs.evtsExt__Absorbus__Absorb.GDEatenObjects2.length = 0;


return;
}

gdjs.evtsExt__Absorbus__Absorb.registeredGdjsCallbacks = [];