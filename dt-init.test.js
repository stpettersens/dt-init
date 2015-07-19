var DTInit = require('./dt-init-lib'),
    should = require('should'),
      glob = require('glob');

describe('Test DTInit utility', function() {
    it('Generate definitions & test stubs for shortid', function(done) {
	new DTInit('shortid');
	var files = glob.sync('*');
	files[0].should.equal('package.json').and.be.a.String;
	files[1].should.equal('shortid-tests.ts').and.be.a.String;
	files[2].should.equal('shortid.d.ts').and.be.a.String;
	done();
    });
});
