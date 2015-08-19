if ($('.app-page_group-ideas').length) {

    $('.js-rate').on('change', function(e) {
         // create an array of names
        var names = $('input[type=radio]').map(function() {
            return this.name;
        }).get();

        // filter unique values
        var unique = $.grep(names, function(v, i) {
            return $.inArray(v, names) === i;
        });

        var notChecked = $.grep(unique, function(v, i) {
            return $('[name="'+v+'"]').is(':checked') === false ;
        });

        if (notChecked.length === 0) {
            $('#confirm a').removeClass('-disabled');
        } else {
            $('#confirm a').addClass('-disabled');
        }
    });

}