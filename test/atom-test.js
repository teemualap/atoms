var assert  = require('assert'),
	M       = require('mori'),
	Atom    = require('../lib/atom')
;


describe('Atom', function() {

	// preparation
	var clj 	= 	M.toClj({
						is: 'Awesome',
						count: 0
					}),
		atom    = 	new Atom(clj)
	;

	describe('#deref', function(){

		it('should return value as expected', function() {

			assert.ok(M.equals(clj, atom.deref()));

		});

	});

	describe('#addWatch', function(){

		it('should add a watcher and call it on updates', function() {

			atom.addWatch('addwatch', function(key, atom, oldValue, newValue) {
				assert.equal(M.get(newValue, 'foo'), 'bar');
			});

			atom.swap(M.assoc, 'foo', 'bar');

		});

	});

	describe('#removeWatch', function(){

		it('should remove a watcher', function() {

			atom.addWatch('removewatch', function(key, atom, oldValue, newValue) {
				assert.fail();
			});

			atom.removeWatch('removewatch');

			atom.swap(M.assoc, 'bar', 'baz');

		});

	});

	describe('#swap', function(){

		it('should update the atom value as expected', function(done) {

			atom.addWatch('swap', function(key, atom, oldValue, newValue) {
				assert.equal( M.get(atom.deref(), 'is'), 'Magnificent');
				atom.removeWatch('swap');
				done();
			});

			atom.swap(M.assoc, 'is', 'Magnificent');

		});

	});

});
