
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle || {};

/**
 * Behavior generated from Light obstacle
 */
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle = class Light_Obstacle extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    

    return true;
  }

  // Network sync:
  getNetworkSyncData() {
    return {
      ...super.getNetworkSyncData(),
      props: {
        
      }
    };
  }
  updateFromNetworkSyncData(networkSyncData) {
    super.updateFromNetworkSyncData(networkSyncData);
    
  }

  // Properties:
  
}

/**
 * Shared data generated from Light obstacle
 */
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.SharedData = class Light_ObstacleSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._SpriteBasedLighting_Light_ObstacleSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._SpriteBasedLighting_Light_ObstacleSharedData = new gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.SharedData(
      initialData
    );
  }
  return instanceContainer._SpriteBasedLighting_Light_ObstacleSharedData;
}

// Methods:
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext = {};
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachIndex2 = 0;

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachObjects2 = [];

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachTemporary2 = null;

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachTotalCount2 = 0;

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects1= [];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2= [];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3= [];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects4= [];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects1= [];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects2= [];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects3= [];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects4= [];


gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2, gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3[i].getVariableNumber(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3[i].getVariables().get("__SpriteBasedLighting").getChild("light")) >= -(250) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3[k] = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3 */
{for(var i = 0, len = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3[i].returnVariable(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3[i].getVariables().get("__SpriteBasedLighting").getChild("light")).setNumber(-(250));
}
}}

}


};gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects1);

for (gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachIndex2 = 0;gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachIndex2 < gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects1.length;++gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachIndex2) {
gdjs.copyArray(eventsFunctionContext.getObjects("Light"), gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects2);
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2.length = 0;


gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachTemporary2 = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects1[gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachIndex2];
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2.push(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.forEachTemporary2);
let isConditionTrue_0 = false;
if (true) {
{for(var i = 0, len = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2[i].setColor((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2[i].getVariables().get("__SpriteBasedLighting").getChild("light"))) + ";" + (gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2[i].getVariables().get("__SpriteBasedLighting").getChild("light"))) + ";" + (gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2[i].getVariables().get("__SpriteBasedLighting").getChild("light"))));
}
}{for(var i = 0, len = gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2[i].getVariables().get("__SpriteBasedLighting").getChild("light")).setNumber((gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2[i].getDistanceToObject((gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects2.length !== 0 ? gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects2[0] : null))) - 500);
}
}
{ //Subevents: 
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.eventsList0(runtimeScene, eventsFunctionContext);} //Subevents end.
}
}

}


};

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLight = function(Light, Beh, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "Light": Light
},
  _objectArraysMap: {
"Object": thisObjectList
, "Light": gdjs.objectsListsToArray(Light)
},
  _behaviorNamesMap: {
"Behavior": Behavior
, "Beh": Beh
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("SpriteBasedLighting"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("SpriteBasedLighting"),
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects4.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects1.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects2.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects3.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects4.length = 0;

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.eventsList1(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDObjectObjects4.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects1.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects2.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects3.length = 0;
gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.MakeLightContext.GDLightObjects4.length = 0;


return;
}

gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("SpriteBasedLighting::Light_Obstacle", gdjs.evtsExt__SpriteBasedLighting__Light_Obstacle.Light_Obstacle);
