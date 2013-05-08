(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */
    module('Basic Set Up', {
        setup: function() {
          this.elems = $('#qunit-fixture').PolaroidPhotoStack( { data : ["\/images\/photos\/album-one\/ID-10019581.jpg","\/images\/photos\/album-one\/ID-100421.jpg","\/images\/photos\/album-one\/ID-1004552.jpg","\/images\/photos\/album-one\/ID-1005942.jpg","\/images\/photos\/album-one\/ID-1006595.jpg"]});
        }
    });
// in progress... Philip A Senger
//    test( "verify jquery chaining", function() {
//       expect( 1 );
//       var target = $('#qunit-fixture').PolaroidPhotoStack();
//        equal( target, $('#qunit'), 'expected the plugin to return the object' );
//    });
    test( "A test of expected control elements present in the dom", function() {
        expect( 5 );
        $('#qunit-fixture').trigger('click');
        equal( $('#PPS-Container').length, 1, 'expected one container' );
        equal( $('#PPS-Next').length, 1, 'expected one Next button' );
        equal( $('#PPS-Prev').length, 1, 'expected one Prev button' );
        equal( $('#PPS-Close').length, 1, 'expected one Close button' );
        equal( $('.PPS-Photo').length, 5, 'expected five pictures' );

    });

}(jQuery));
