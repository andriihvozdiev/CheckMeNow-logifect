const EventEmitter = {
    _events: {},
    dispatch: function (event, data) {
        if (!this._events[event]) return;
        this._events[event].forEach(callbackObject => callbackObject.callback(data))
    },
    subscribe: function (event, callback) {
        if (!this._events[event]) this._events[event] = [];
        const handler = new Date().getTime();
        const callbackObject = {handler, callback};
        this._events[event].push(callbackObject);
        return handler;
    },
    unsubscribe: function(event, handler) {
        if (!this._events[event]) return;
        const callbackObjectIndex = this._events[event].findIndex(callbackObject=>callbackObject.handler===handler);
        if(callbackObjectIndex!=-1) this._events[event].splice(callbackObjectIndex, 1)
    },
    getSubscribers: function(){
        return this._events;
    }
}
export default EventEmitter;