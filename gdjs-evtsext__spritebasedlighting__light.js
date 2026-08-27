
gdjs.evtsExt__SpriteBasedLighting__Light = gdjs.evtsExt__SpriteBasedLighting__Light || {};

/**
 * Behavior generated from Light Moon
 */
gdjs.evtsExt__SpriteBasedLighting__Light.Light = class Light extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__SpriteBasedLighting__Light.Light.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.Property = behaviorData.Property !== undefined ? behaviorData.Property : "255;255;255";
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.Property !== newBehaviorData.Property)
      this._behaviorData.Property = newBehaviorData.Property;

    return true;
  }

  // Network sync:
  getNetworkSyncData() {
    return {
      ...super.getNetworkSyncData(),
      props: {
        
    Property: this._behaviorData.Property,
      }
    };
  }
  updateFromNetworkSyncData(networkSyncData) {
    super.updateFromNetworkSyncData(networkSyncData);
    
    if (networkSyncData.props.Property !== undefined)
      this._behaviorData.Property = networkSyncData.props.Property;
  }

  // Properties:
  
  _getProperty() {
    return this._behaviorData.Property !== undefined ? this._behaviorData.Property : "255;255;255";
  }
  _setProperty(newValue) {
    this._behaviorData.Property = newValue;
  }
}

/**
 * Shared data generated from Light Moon
 */
gdjs.evtsExt__SpriteBasedLighting__Light.Light.SharedData = class LightSharedData {
  constructor(sharedData) {
    
    this.Property = sharedData.Property !== undefined ? sharedData.Property : Number("") || 0;
  }
  
  // Shared properties:
  
  _getProperty() {
    return this.Property !== undefined ? this.Property : Number("") || 0;
  }
  _setProperty(newValue) {
    this.Property = newValue;
  }
}

gdjs.evtsExt__SpriteBasedLighting__Light.Light.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._SpriteBasedLighting_LightSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._SpriteBasedLighting_LightSharedData = new gdjs.evtsExt__SpriteBasedLighting__Light.Light.SharedData(
      initialData
    );
  }
  return instanceContainer._SpriteBasedLighting_LightSharedData;
}

// Methods:

gdjs.evtsExt__SpriteBasedLighting__Light.Light.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("SpriteBasedLighting::Light", gdjs.evtsExt__SpriteBasedLighting__Light.Light);
