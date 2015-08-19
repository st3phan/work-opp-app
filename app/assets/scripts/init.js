// sprite
$.get('images/svg/sprite/sprite.svg', function(data) {
    var $div = $('<div></div>').hide().append(data);
    $('body').prepend($div);
}, 'html');

// logo
$.get('images/svg/logo.svg', function(data) {
    var $div = $('<div></div>').hide().append(data);
    $('body').prepend($div);
}, 'html');

if ($('.app-page_conversation').length) {
    $(document).scrollTop($(document).height());
} else {
    $(document).scrollTop(0);
}

var collapseContainers = function() {
    $('.js-content').each(function(i, el) {
        if ($(this).outerHeight() >= 130) {
            $(this).closest('.js-container').addClass('-collapsed');
        }
    });

    $('.js-more').on('click', function(e) {
        var $box = $(this).closest('.js-container');
        $box.toggleClass('-expanded');
        e.preventDefault();
    });
};

collapseContainers();
