/**
 * Atom holds an immutable data structure
 * @param {[type]} initialValue [description]
 * @param {[type]} meta         [description]
 * @param {[type]} validator    [description]
 */
var Atom = function(initialValue, meta, validator) {

	var _self 			= this,
		_value 			= initialValue,
		_meta			= meta,
		_watchers		= {},
		// validator defaults to identity
		_validator 		= function(x) { return x; }
	;

	/*
	 * Dispatches successful transactions to
	 * watchers
	 */
	var notifyWatchers = function(oldValue, newValue) {
		Object.keys(_watchers).forEach(function(key){
			_watchers[key](key, _self, oldValue, newValue);
		});
	};

	/*
	 * Validates new value,
	 * compares-and-sets
	 * and notifies the watch handlers
	 */
	var transact = function(oldValue, newValue) {
		if (_validator(newValue) === false)
			return false;
		_value = newValue;
   		notifyWatchers(oldValue, newValue);
   		return _value;
	};


	/**
	 * Returns the current value
	 * @return {[type]} [description]
	 */
	this.deref = function() {
		return _value;
	};


	/**
	 * Change the value of an atom by applying function f with
	 * the atom value and the arguments.
	 *
	 * @param  {[function]} The function to be applied
	 * @param {[arguments]} Optional arguments
	 *
	 * @return Returns the value that was swapped in, false
	 * on failing transaction
	 */
	this.swap = function(f) {
		var oldValue 	= _value,
			args 		= [oldValue].concat([].slice.call(arguments,1))
		;
		return	transact(
					oldValue,
					f.apply(_self, args));
	};


	/**
	 * Changes the atom value immediately,
	 * ignoring the underlying value
	 * @param  {[any]} newValue [The new atom value]
	 * @return {[type]}      [description]
	 */
	this.reset = function(newValue) {
		return transact(_value, newValue);
	};


	/**
	 * Sets the validator fn used in the transaction internally
	 * @param {Function} fn [description]
	 */
	this.setValidator = function(fn) {
		if (fn(_value) === false) {
			throw new Error(
				'The provided validator function is unacceptable');
		}
		_validator = fn;
	};
	// if a validator was supplied in the constructor,
	// set it in place
	if (validator) this.setValidator(validator);


	/**
	 * Add a watch handler that get's called whenever
	 * a successful transaction happens
	 * @param {[type]} key     [description]
	 * @param {[type]} handler [description]
	 */
	this.addWatch = function(key, handler) {
		if (_watchers[key])
			throw new Error('A watcher with key:'
							+ key
							+ ' has already been assigned.');
		_watchers[key] = handler;
	};


	/**
	 * Remove a watcher by id
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	this.removeWatch = function(id) {
		delete _watchers[id];
	};


	return this;
};

module.exports = Atom;
